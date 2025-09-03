import { createContext, ReactNode, useEffect, useState } from "react";
import {
  AnyPost,
  CreatePostRequest,
  evmAddress,
  PaymentSource,
  Post,
  postId as toPostId,
  SessionClient,
  TxHash,
  useBookmarkPost,
  usePost,
  useUndoBookmarkPost,
} from "@lens-protocol/react";
import { useWalletClient } from "wagmi";
import { executePostAction, post as createPost, repost as createRepost } from "@lens-protocol/client/actions";
import { handleOperationWith } from "@lens-protocol/client/viem";
import { useReactionToggle } from "@/registry/new-york/blocks/feed/hooks/use-reaction-toggle";
import { NATIVE_TOKEN } from "@/registry/new-york/common/lib/lens-utils";
import { textOnly } from "@lens-protocol/metadata";
import { immutable, StorageClient } from "@lens-chain/storage-client";
import { chains } from "@lens-chain/sdk/viem";

type OptimisticState = {
  liked: boolean;
  commented: boolean;
  collected: boolean;
  repostedOrQuoted: boolean;
  tipped: boolean;
  bookmarked: boolean;
};

type PostContextType = {
  post: AnyPost | undefined | null;
  loading: boolean;
  error?: Error;
  optimistic: OptimisticState;
  toggleLike: () => Promise<void>;
  comment: (content: string) => Promise<TxHash | undefined>;
  collect: () => Promise<TxHash | undefined>;
  repost: () => Promise<TxHash | undefined>;
  quote: (content: string) => Promise<TxHash | undefined>;
  tip: (source: PaymentSource, amount: string, tokenAddress: string) => Promise<TxHash | undefined>;
  toggleBookmark: () => Promise<void>;
};

export const LensPostContext = createContext<PostContextType | undefined>(undefined);

export const LensPostProvider = ({
  sessionClient,
  postId,
  children,
  useTestnet = false,
}: {
  sessionClient: SessionClient | null | undefined;
  postId: string;
  children: ReactNode;
  useTestnet?: boolean;
}) => {
  const { data, loading, error } = usePost({ post: postId });

  const [post, setPost] = useState<Post | undefined | null>(data?.__typename === "Repost" ? data.repostOf : data);

  const operations = post && "operations" in post ? post.operations : null;
  const stats = post && "stats" in post ? post.stats : null;

  const [optimistic, setOptimistic] = useState<OptimisticState>({
    liked: operations?.hasUpvoted ?? false,
    bookmarked: operations?.hasBookmarked ?? false,
    collected: operations?.hasSimpleCollected ?? false,
    tipped: operations?.hasTipped ?? false,
    commented: operations?.hasCommented.optimistic ?? operations?.hasCommented.onChain ?? false,
    repostedOrQuoted:
      operations?.hasReposted.optimistic ??
      operations?.hasReposted.onChain ??
      operations?.hasQuoted.optimistic ??
      operations?.hasQuoted.onChain ??
      false,
  });

  useEffect(() => {
    setPost(data?.__typename === "Repost" ? data.repostOf : data);
  }, [data]);

  const { data: walletClient } = useWalletClient();
  const storageClient = StorageClient.create();
  const { execute: toggleReaction } = useReactionToggle();
  const { execute: bookmarkPost } = useBookmarkPost();
  const { execute: undoBookmarkPost } = useUndoBookmarkPost();

  const chain = useTestnet ? chains.testnet : chains.mainnet;

  const switchChain = async () => {
    await walletClient?.switchChain({ id: chain.id });
  };

  const toggleLike = async () => {
    if (!post || !sessionClient?.isSessionClient()) return;

    setOptimistic(optimistic => ({
      ...optimistic,
      liked: !optimistic?.liked,
    }));

    const res = await toggleReaction({ post, session: sessionClient });

    if (res.isErr()) {
      setOptimistic(optimistic => ({
        ...optimistic,
        liked: !optimistic?.liked,
      }));
      throw res.error;
    }

    setPost(prevPost => {
      if (!prevPost) return null;
      return {
        ...prevPost,
        stats: {
          ...prevPost.stats,
          upvotes: prevPost.stats.upvotes + (prevPost.operations?.hasUpvoted ? -1 : 1),
        },
        ...(prevPost.operations
          ? {
              operations: {
                ...prevPost.operations,
                hasUpvoted: !prevPost.operations?.hasUpvoted,
              },
            }
          : {
              operations: {
                hasUpvoted: true,
              },
            }),
      } as Post;
    });
  };

  const comment = async (content: string): Promise<TxHash | undefined> => {
    if (!post) {
      throw new Error("Cannot comment without a post");
    }

    if (!sessionClient?.isSessionClient() || !walletClient) {
      throw new Error("Must be logged in to comment on a post");
    }

    await switchChain();

    const metadata = textOnly({ content });
    const acl = immutable(chain.id);
    const { uri } = await storageClient.uploadAsJson(metadata, { acl });
    const postRequest: CreatePostRequest = {
      contentUri: uri,
      commentOn: {
        post: post.id,
      },
    };

    const previouslyCommented = optimistic.commented;

    setOptimistic(optimistic => ({
      ...optimistic,
      commented: true,
    }));

    const postResponse = await createPost(sessionClient, postRequest)
      .andThen(handleOperationWith(walletClient))
      .andThen(sessionClient.waitForTransaction);

    if (postResponse.isErr()) {
      console.error("Error posting comment:", postResponse.error);
      setOptimistic(optimistic => ({
        ...optimistic,
        commented: previouslyCommented,
      }));
      throw postResponse.error;
    }

    return postResponse.value;
  };

  const collect = async (): Promise<TxHash | undefined> => {
    if (!post) {
      throw new Error("Cannot collect without a post");
    }

    if (!sessionClient?.isSessionClient() || !walletClient) {
      throw new Error("Must be logged in to collect a post");
    }

    await switchChain();

    setOptimistic(optimistic => ({
      ...optimistic,
      collected: true,
    }));

    const res = await executePostAction(sessionClient, {
      post: post.id,
      action: {
        simpleCollect: {
          selected: true,
        },
      },
    })
      .andThen(handleOperationWith(walletClient))
      .andThen(sessionClient.waitForTransaction);

    if (res.isErr()) {
      console.error("Error collecting post:", res.error);
      setOptimistic(optimistic => ({
        ...optimistic,
        collected: false,
      }));
      throw res.error;
    }

    return res.value;
  };

  const repost = async (): Promise<TxHash | undefined> => {
    if (!sessionClient?.isSessionClient() || !walletClient) {
      throw new Error("Must be logged in to repost");
    }

    await switchChain();

    const previouslyReposted = optimistic.repostedOrQuoted;

    setOptimistic(optimistic => ({
      ...optimistic,
      repostedOrQuoted: true,
    }));

    const res = await createRepost(sessionClient, {
      post: toPostId(postId),
    })
      .andThen(handleOperationWith(walletClient))
      .andThen(sessionClient.waitForTransaction);

    if (res.isErr()) {
      console.error("Error reposting post:", res.error);
      setOptimistic(optimistic => ({
        ...optimistic,
        repostedOrQuoted: previouslyReposted,
      }));
      throw res.error;
    }

    return res.value;
  };

  const quote = async (content: string): Promise<TxHash | undefined> => {
    if (!post) {
      throw new Error("Cannot quote without a post");
    }

    if (!sessionClient?.isSessionClient() || !walletClient) {
      throw new Error("Must be logged in to quote a post");
    }

    await switchChain();

    const metadata = textOnly({ content });
    const acl = immutable(chain.id);
    const { uri } = await storageClient.uploadAsJson(metadata, { acl });
    const postRequest: CreatePostRequest = {
      contentUri: uri,
      quoteOf: {
        post: post.id,
      },
    };

    const previouslyQuoted = optimistic.repostedOrQuoted;

    setOptimistic(optimistic => ({
      ...optimistic,
      repostedOrQuoted: true,
    }));

    const postResponse = await createPost(sessionClient, postRequest)
      .andThen(handleOperationWith(walletClient))
      .andThen(sessionClient.waitForTransaction);

    if (postResponse.isErr()) {
      console.error("Error quoting post:", postResponse.error);
      setOptimistic(optimistic => ({
        ...optimistic,
        repostedOrQuoted: previouslyQuoted,
      }));
      throw postResponse.error;
    }

    return postResponse.value;
  };

  const tip = async (source: PaymentSource, amount: string, tokenAddress: string): Promise<TxHash | undefined> => {
    if (!post) {
      throw new Error("Cannot tip without a post");
    }

    if (!sessionClient?.isSessionClient() || !walletClient) {
      throw new Error("Must be logged in to tip");
    }

    await switchChain();

    setOptimistic(optimistic => ({
      ...optimistic,
      tipped: true,
    }));

    const res = await executePostAction(sessionClient, {
      post: post.id,
      action: {
        tipping: {
          paymentSource: source,
          ...(tokenAddress === NATIVE_TOKEN ? { native: amount } : { value: amount, token: evmAddress(tokenAddress) }),
        },
      },
    })
      .andThen(handleOperationWith(walletClient))
      .andThen(sessionClient.waitForTransaction);

    if (res.isErr()) {
      console.error("Error sending tip:", res.error);
      setOptimistic(optimistic => ({
        ...optimistic,
        tipped: false,
      }));
      throw res.error;
    }

    return res.value;
  };

  const toggleBookmark = async () => {
    if (!postId) return;

    setOptimistic(optimistic => ({
      ...optimistic,
      bookmarked: !optimistic.bookmarked,
    }));

    try {
      if (operations?.hasBookmarked) {
        await undoBookmarkPost({ post: toPostId(postId) });
      } else {
        await bookmarkPost({ post: toPostId(postId) });
      }
    } catch (error) {
      console.error("Error bookmarking post:", error);
    }
  };

  return (
    <LensPostContext.Provider
      value={{
        post,
        toggleLike,
        comment,
        collect,
        repost,
        quote,
        tip,
        toggleBookmark,
        loading,
        error,
        optimistic,
      }}
    >
      {children}
    </LensPostContext.Provider>
  );
};
