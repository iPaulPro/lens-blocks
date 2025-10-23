import { createContext, ReactNode, useEffect, useMemo, useState } from "react";
import {
  AnyPost,
  CreatePostRequest,
  EvmAddress,
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
import { executePostAction, post as createPost, repost as createRepost } from "@lens-protocol/client/actions";
import { handleOperationWith } from "@lens-protocol/client/viem";
import { useReactionToggle } from "@/registry/new-york/hooks/use-reaction-toggle";
import { NativeToken } from "@/registry/new-york/lib/lens-utils";
import { textOnly } from "@lens-protocol/metadata";
import { immutable, StorageClient } from "@lens-chain/storage-client";
import { chains } from "@lens-chain/sdk/viem";
import { WalletClient } from "viem";
import { Result } from "@/registry/new-york/lib/result";

export type OptimisticState = {
  liked: boolean;
  commented: boolean;
  collected: boolean;
  repostedOrQuoted: boolean;
  tipped: boolean;
  bookmarked: boolean;
  likeCount: number;
  commentCount: number;
  collectCount: number;
  repostAndQuoteCount: number;
  tipCount: number;
};

export type Referral = {
  percent: number;
  address: EvmAddress;
};

type PostContextType = {
  sessionClient?: SessionClient | null | undefined;
  post: AnyPost | undefined | null;
  loading: boolean;
  error?: Error;
  optimistic: OptimisticState;
  toggleLike: () => Promise<void>;
  comment: (content: string) => Promise<TxHash>;
  collect: (paymentSource?: PaymentSource, referrals?: Referral[]) => Promise<TxHash>;
  repost: () => Promise<TxHash | undefined>;
  quote: (content: string) => Promise<TxHash>;
  tip: (paymentSource: PaymentSource, amount: string, tokenAddress: string) => Promise<TxHash>;
  toggleBookmark: () => Promise<void>;
};

export const LensPostContext = createContext<PostContextType | undefined>(undefined);

type Props = {
  /**
   * The Lens Session Client used for making authenticated calls
   */
  session: Result<SessionClient>;

  /**
   * The wallet client from viem used to sign messages for authentication.
   */
  wallet?: { data: WalletClient | undefined | null; isLoading?: boolean; error?: unknown };

  postId: string;

  children: ReactNode;

  useTestnet?: boolean;
};

export const LensPostProvider = ({ session, wallet, postId, children, useTestnet = false }: Props) => {
  const sessionClient = session?.data;
  const walletClient = wallet?.data;

  const { data, loading, error } = usePost({ post: postId });

  const [post, setPost] = useState<Post | undefined | null>(data?.__typename === "Repost" ? data.repostOf : data);

  const operations = post && "operations" in post ? post.operations : null;
  const stats = post && "stats" in post ? post.stats : null;

  const defaultOptimisticState: OptimisticState = useMemo(
    () => ({
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
      likeCount: stats?.upvotes ?? 0,
      commentCount: stats?.comments ?? 0,
      collectCount: stats?.collects ?? 0,
      repostAndQuoteCount: (stats?.reposts ?? 0) + (stats?.quotes ?? 0),
      tipCount: stats?.tips ?? 0,
    }),
    [operations, stats],
  );
  const [optimistic, setOptimistic] = useState<OptimisticState>(defaultOptimisticState);

  useEffect(() => {
    setPost(data?.__typename === "Repost" ? data.repostOf : data);
    setOptimistic(defaultOptimisticState);
  }, [data, defaultOptimisticState]);

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
      likeCount: optimistic.liked ? Math.max(0, optimistic.likeCount - 1) : optimistic.likeCount + 1,
    }));

    const res = await toggleReaction({ post, session: sessionClient });

    if (res.isErr()) {
      setOptimistic(optimistic => ({
        ...optimistic,
        liked: !optimistic?.liked,
        likeCount: optimistic.liked ? Math.max(0, optimistic.likeCount - 1) : optimistic.likeCount + 1,
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

  const comment = async (content: string): Promise<TxHash> => {
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
      setOptimistic(optimistic => ({
        ...optimistic,
        commented: previouslyCommented,
      }));
      throw postResponse.error;
    }

    return postResponse.value;
  };

  const collect = async (paymentSource?: PaymentSource, referrals?: Referral[]): Promise<TxHash> => {
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
          paymentSource,
          referrals,
        },
      },
    })
      .andThen(handleOperationWith(walletClient))
      .andThen(sessionClient.waitForTransaction);

    if (res.isErr()) {
      setOptimistic(optimistic => ({
        ...optimistic,
        collected: false,
        collectCount: Math.max(0, optimistic.collectCount - 1),
      }));
      throw res.error;
    }

    setOptimistic(optimistic => ({
      ...optimistic,
      collectCount: optimistic.collectCount + 1,
    }));

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
      repostAndQuoteCount: optimistic.repostAndQuoteCount + 1,
    }));

    const res = await createRepost(sessionClient, {
      post: toPostId(postId),
    })
      .andThen(handleOperationWith(walletClient))
      .andThen(sessionClient.waitForTransaction);

    if (res.isErr()) {
      setOptimistic(optimistic => ({
        ...optimistic,
        repostedOrQuoted: previouslyReposted,
        repostAndQuoteCount: Math.max(0, optimistic.repostAndQuoteCount - 1),
      }));
      throw res.error;
    }

    return res.value;
  };

  const quote = async (content: string): Promise<TxHash> => {
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
      repostAndQuoteCount: optimistic.repostAndQuoteCount + 1,
    }));

    const postResponse = await createPost(sessionClient, postRequest)
      .andThen(handleOperationWith(walletClient))
      .andThen(sessionClient.waitForTransaction);

    if (postResponse.isErr()) {
      setOptimistic(optimistic => ({
        ...optimistic,
        repostedOrQuoted: previouslyQuoted,
        repostAndQuoteCount: Math.max(0, optimistic.repostAndQuoteCount - 1),
      }));
      throw postResponse.error;
    }

    return postResponse.value;
  };

  const tip = async (paymentSource: PaymentSource, amount: string, tokenAddress: string): Promise<TxHash> => {
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
          paymentSource,
          ...(tokenAddress === NativeToken ? { native: amount } : { value: amount, token: evmAddress(tokenAddress) }),
        },
      },
    })
      .andThen(handleOperationWith(walletClient))
      .andThen(sessionClient.waitForTransaction);

    if (res.isErr()) {
      setOptimistic(optimistic => ({
        ...optimistic,
        tipped: false,
        tipCount: Math.max(0, optimistic.tipCount - 1),
      }));
      throw res.error;
    }

    setOptimistic(optimistic => ({
      ...optimistic,
      tipCount: optimistic.tipCount + 1,
    }));

    return res.value;
  };

  const toggleBookmark = async () => {
    if (!postId) return;

    setOptimistic(optimistic => ({
      ...optimistic,
      bookmarked: !optimistic.bookmarked,
    }));

    if (operations?.hasBookmarked) {
      await undoBookmarkPost({ post: toPostId(postId) });
    } else {
      await bookmarkPost({ post: toPostId(postId) });
    }
  };

  return (
    <LensPostContext.Provider
      value={{
        sessionClient,
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
