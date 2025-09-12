"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/registry/new-york/ui/dropdown-menu";
import { MouseEvent, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/registry/new-york/ui/avatar";
import { Account, Post, PublicClient, SessionClient, TxHash } from "@lens-protocol/react";
import { Copy, Flag, MoreHorizontal, UserCircle2 } from "lucide-react";
import LensMarkdown from "../components/common/lens-markdown";
import LikeButton from "@/registry/new-york/components/feed/likes/like-button";
import ReferenceButton from "@/registry/new-york/components/feed/references/reference-button";
import CommentButton from "@/registry/new-york/components/feed/comment/comment-button";
import moment from "moment/moment";
import CollectButton from "@/registry/new-york/components/feed/collects/collect-button";
import TipButton from "@/registry/new-york/components/feed/tips/tip-button";
import { cn } from "@/registry/new-york/lib/utils";
import { parseUri, truncateAddress } from "@/registry/new-york/lib/lens-utils";
import { Button } from "@/registry/new-york/ui/button";
import BookmarkButton from "@/registry/new-york/components/feed/bookmarks/bookmark-button";
import { WalletClient } from "viem";
import CollectDialog, { CollectDialogRef } from "@/registry/new-york/components/feed/collects/collect-dialog";
import QuoteDialog, { QuoteDialogRef } from "@/registry/new-york/components/feed/references/quote-dialog";
import TipDialog, { TipDialogRef } from "@/registry/new-york/components/feed/tips/tip-dialog";
import { useLensPostContext } from "@/registry/new-york/hooks/use-lens-post-context";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent } from "@/registry/new-york/ui/dialog";
import Image from "next/image";
import LensAudioPlayer from "@/registry/new-york/components/common/lens-audio-player";
import LensVideoPlayer from "@/registry/new-york/components/common/lens-video-player";

type LensPostProps = {
  /**
   * The Lens Client used for making public and authenticated calls
   */
  lensClient?: PublicClient | SessionClient;

  /**
   * The wallet client from viem used to sign messages for authentication.
   */
  walletClient?: WalletClient;

  /**
   * Callback function that is called when the user clicks on a post.
   */
  onPostClick?: (post: Post) => void;

  /**
   * Callback function that is called when the user clicks on an account.
   */
  onAccountClick?: (account: Account) => void;

  /**
   * The URL pattern to use for generating post links if onPostClick is not provided.
   * It should include `{slug}` as a placeholder for the post slug.
   * If not provided, a default pattern (/posts/{slug}) will be used.
   * * Example: `/posts/{slug}` or `https://example.com/posts/{slug}`
   */
  postUrlPattern?: string;

  /**
   * The URL pattern to use for generating account links if onAccountClick is not provided.
   * It should include `{localName}` as a placeholder for the local name and optionally `{namespace}` for the namespace.
   * If not provided, a default pattern (/u/{namespace}/{localName}) will be used.
   * * Example: `/u/{localName}` or `https://example.com/u/{localName}`
   */
  accountUrlPattern?: string;

  /**
   * Callback function that is called when a repost is successful.
   * It receives the transaction hash as an argument.
   */
  onRepostSuccess?: (txHash: TxHash) => void;

  /**
   * Optional additional class names to apply to the post container.
   *
   */
  className?: string;
};

export const LensPost = (props: LensPostProps) => {
  const {
    lensClient,
    walletClient,
    onPostClick,
    onAccountClick,
    postUrlPattern,
    accountUrlPattern,
    onRepostSuccess,
    className,
  } = props;

  const collectDialog = useRef<CollectDialogRef>(null);
  const quoteDialog = useRef<QuoteDialogRef>(null);
  const tipDialog = useRef<TipDialogRef>(null);

  const [lightboxOpen, setLightboxOpen] = useState(false);

  const { post, loading } = useLensPostContext();
  const router = useRouter();

  if (!post) {
    if (loading) {
      return <></>; // TODO return skeleton
    }
    return null;
  }

  const isPost = post.__typename === "Post";
  const basePost = isPost ? post : post.repostOf;
  if (basePost.metadata.__typename === "UnknownPostMetadata") {
    return <>Unsupported post type</>;
  }

  const author = post.author;
  const name = author.metadata?.name ?? author.username?.localName ?? "[anonymous]";

  const image = "image" in basePost.metadata ? basePost.metadata.image : null;
  const imageUri = image ? parseUri(image.item) : null;

  const audio = "audio" in basePost.metadata ? basePost.metadata.audio : null;
  const video = "video" in basePost.metadata ? basePost.metadata.video : null;

  // function isVideoPlatformUrl(url: string): boolean {
  //   const patterns = [
  //     /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/, // YouTube
  //     /^(https?:\/\/)?(www\.)?vimeo\.com\/.+$/, // Vimeo
  //     /^(https?:\/\/)?(www\.)?twitch\.tv\/.+$/, // Twitch
  //     /^(https?:\/\/)?(www\.)?tiktok\.com\/.+$/, // TikTok
  //   ];
  //
  //   return patterns.some(pattern => pattern.test(url));
  // }
  //
  // const isVideoEmbed = videoUri ? isVideoPlatformUrl(videoUri) : false;

  const collectAction =
    post && "actions" in post && post.actions?.find(action => action.__typename === "SimpleCollectAction");

  const onReportClick = () => {};

  const onCopyClick = () => {
    const postUrl = postUrlPattern
      ? postUrlPattern.replace("{slug}", basePost.slug)
      : `${window.location.origin}/posts/${basePost.slug}`;
    navigator.clipboard
      .writeText(postUrl)
      .then(() => {
        console.log("Post link copied to clipboard:", postUrl);
      })
      .catch(err => {
        console.error("Failed to copy post link:", err);
      });
  };

  const handleAccountClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onAccountClick?.(author);
  };

  const handlePostClick = (event: MouseEvent<HTMLButtonElement>) => {
    // Allow text selection
    if (window.getSelection()?.toString()) {
      return;
    }

    event.preventDefault();

    // If it's a repost, we assume the user wants to see the original post
    const postUrl = postUrlPattern ? postUrlPattern.replace("{slug}", basePost.slug) : `/posts/${basePost.slug}`;

    if (onPostClick) {
      onPostClick(basePost);
    } else if (event.metaKey || event.ctrlKey || event.button === 1) {
      window.open(postUrl, "_blank");
    } else {
      router.push(postUrl);
    }
  };

  return (
    <>
      <article
        onClick={handlePostClick}
        className={cn("w-full px-3 md:px-4 pt-3 md:pt-4 pb-2 flex flex-col gap-3 text-start cursor-pointer", className)}
      >
        <div className="flex-grow flex justify-between flex-none">
          <div className="flex gap-2 w-full min-w-0">
            <button type="button" onClick={handleAccountClick} className="cursor-pointer">
              <Avatar className="flex-none w-10 h-10">
                <AvatarImage src={author.metadata?.picture} alt={`${name}'s avatar`} />
                <AvatarFallback>
                  <UserCircle2 className="w-10 h-10 opacity-45" />
                </AvatarFallback>
              </Avatar>
            </button>
            <div className="flex-grow flex flex-col min-w-0">
              <button type="button" onClick={handleAccountClick} className="flex gap-2 w-full min-w-0">
                <span className="text-sm md:text-base font-semibold truncate cursor-pointer hover:underline">
                  {name}
                </span>
                {author.username?.localName ? (
                  <span className="text-sm md:text-base text-muted-foreground truncate cursor-pointer hover:underline">
                    @{author.username.localName}
                  </span>
                ) : (
                  <span className="text-sm md:text-base text-muted-foreground truncate cursor-pointer hover:underline">
                    {truncateAddress(author.address)}
                  </span>
                )}
              </button>
              <abbr title={new Date(post.timestamp).toLocaleString()} className="text-xs opacity-65 no-underline">
                {moment(post.timestamp).fromNow(true)}
              </abbr>
            </div>
          </div>
          <div className="flex gap-2">
            <BookmarkButton className="md:hidden" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-8 h-8 active:outline-none focus-visible:outline-none hover:opacity-75 cursor-pointer rounded-full -me-2.5 md:me-0"
                >
                  <MoreHorizontal className="w-4 h-4 opacity-75" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="min-w-48" side="bottom">
                <DropdownMenuItem className="focus:outline-none p-0">
                  <button className="flex gap-2 items-center w-full p-2" onClick={onReportClick} disabled={loading}>
                    <Flag />
                    Report post
                  </button>
                </DropdownMenuItem>
                <DropdownMenuItem className="focus:outline-none p-0">
                  <button className="flex gap-2 items-center w-full p-2" onClick={onCopyClick} disabled={loading}>
                    <Copy className="w-4 h-4 inline" />
                    Copy link
                  </button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        {basePost.metadata.content && (
          <div className="min-h-12 flex items-center">
            <LensMarkdown
              content={basePost.metadata.content}
              mentions={basePost.mentions}
              className="text-sm md:text-base"
            />
          </div>
        )}
        {image && imageUri && (
          <Image
            src={imageUri}
            alt={image.altTag ?? ""}
            className="w-full mt-2 border rounded-xl object-contain bg-gray-200 cursor-pointer"
            width={600}
            height={400}
            loading="lazy"
            onClick={event => {
              event.stopPropagation();
              setLightboxOpen(true);
            }}
          />
        )}
        {audio && (
          <LensAudioPlayer
            audio={audio}
            postTitle={"title" in basePost.metadata ? basePost.metadata.title : undefined}
          />
        )}
        {video ? <LensVideoPlayer video={video} preload="metadata" /> : null}
        <div className="w-full flex gap-4 md:gap-8 items-center justify-between">
          <div className="w-full flex items-center justify-between md:justify-normal gap-4 md:gap-6 -mx-2">
            <CommentButton onClick={() => undefined} />
            <LikeButton />
            <ReferenceButton
              lensClient={lensClient}
              walletClient={walletClient}
              onQuoteClick={() => quoteDialog.current?.open()}
              onRepostSuccess={onRepostSuccess}
            />
            {collectAction && <CollectButton onClick={() => collectDialog.current?.open()} />}
            <TipButton onClick={() => tipDialog.current?.open()} />
          </div>
          <BookmarkButton className="hidden md:flex" />
        </div>
      </article>
      {collectAction && <CollectDialog ref={collectDialog} post={post} />}
      <QuoteDialog ref={quoteDialog} post={post} createQuote={async (post, content) => undefined} />
      <TipDialog ref={tipDialog} supportedTokens={[]} createTip={async () => undefined} />
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="flex justify-center items-center max-h-full max-w-full bg-transparent border-none shadow-none">
          {lightboxOpen && image && imageUri && (
            <img
              src={imageUri}
              alt={image.altTag ?? ""}
              className="max-w-full max-h-full object-contain shadow-lg"
              loading="lazy"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
