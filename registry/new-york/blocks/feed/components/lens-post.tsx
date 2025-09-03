"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/registry/new-york/ui/dropdown-menu";
import { MouseEvent, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/registry/new-york/ui/avatar";
import { Account, AnyPost, PublicClient, SessionClient, TxHash } from "@lens-protocol/react";
import { Copy, Flag, MoreHorizontal, UserCircle2 } from "lucide-react";
import LensMarkdown from "./lens-markdown";
import LikeButton from "@/registry/new-york/blocks/feed/components/likes/like-button";
import ReferenceButton from "@/registry/new-york/blocks/feed/components/references/reference-button";
import CommentButton from "@/registry/new-york/blocks/feed/components/comment/comment-button";
import moment from "moment/moment";
import CollectButton from "@/registry/new-york/blocks/feed/components/collects/collect-button";
import TipButton from "@/registry/new-york/blocks/feed/components/tips/tip-button";
import { cn } from "@/registry/new-york/common/lib/utils";
import { truncateAddress } from "@/registry/new-york/common/lib/lens-utils";
import { Button } from "@/registry/new-york/ui/button";
import BookmarkButton from "@/registry/new-york/blocks/feed/components/bookmarks/bookmark-button";
import { WalletClient } from "viem";
import CollectDialog, { CollectDialogRef } from "@/registry/new-york/blocks/feed/components/collects/collect-dialog";
import QuoteDialog, { QuoteDialogRef } from "@/registry/new-york/blocks/feed/components/references/quote-dialog";
import TipDialog, { TipDialogRef } from "@/registry/new-york/blocks/feed/components/tips/tip-dialog";
import { useLensPostContext } from "@/registry/new-york/common/hooks/use-lens-post-context";

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
   * Callback function that is called when the user clicks on the post.
   */
  onPostClick: (post: AnyPost) => void;

  /**
   * Callback function that is called when the user clicks on an account.
   */
  onAccountClick: (account: Account) => void;

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
  const { lensClient, walletClient, onPostClick, onAccountClick, onRepostSuccess, className } = props;

  const collectDialog = useRef<CollectDialogRef>(null);
  const quoteDialog = useRef<QuoteDialogRef>(null);
  const tipDialog = useRef<TipDialogRef>(null);

  const { post, loading } = useLensPostContext();
  console.log("post:", post, "loading", loading);
  if (!post) {
    if (loading) {
      return <></>; // TODO return skeleton
    }
    return null;
  }

  const author = post.author;
  const name = author.metadata?.name ?? author.username?.localName ?? "[anonymous]";
  const isPost = post.__typename === "Post";

  const collectAction =
    post && "actions" in post && post.actions?.find(action => action.__typename === "SimpleCollectAction");

  const onReportClick = () => {};

  const onCopyClick = () => {
    const postUrl = `https://hey.xyz/posts/${post.slug}`;
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
    onAccountClick(author);
  };

  return (
    <>
      <article
        onClick={() => onPostClick(post)}
        className={cn("w-full p-4 flex flex-col gap-3 text-start cursor-pointer", className)}
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
                  <span className="text-sm md:text-base text-muted-foreground flex-none  cursor-pointer hover:underline">
                    @{author.username.localName}
                  </span>
                ) : (
                  <span className="text-sm md:text-base text-muted-foreground flex-none cursor-pointer hover:underline">
                    {truncateAddress(author.address)}
                  </span>
                )}
              </button>
              <abbr title={new Date(post.timestamp).toLocaleString()} className="text-xs opacity-65 no-underline">
                {moment(post.timestamp).fromNow(true)}
              </abbr>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="w-8 h-8 active:outline-none focus-visible:outline-none hover:opacity-75 cursor-pointer rounded-full"
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
        {isPost && post.metadata.__typename === "TextOnlyMetadata" && (
          <LensMarkdown content={post.metadata.content} className="text-sm md:text-base" />
        )}
        <div className="flex gap-4 md:gap-8 items-center justify-between pe-2">
          <div className="flex items-center gap-4 md:gap-6 -ms-2">
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
          <BookmarkButton className="-me-2" />
        </div>
      </article>
      {collectAction && (
        <CollectDialog ref={collectDialog} post={post} action={collectAction} collect={async () => undefined} />
      )}
      <QuoteDialog ref={quoteDialog} post={post} createQuote={async (post, content) => undefined} />
      <TipDialog ref={tipDialog} supportedTokens={[]} createTip={async () => undefined} />
    </>
  );
};
