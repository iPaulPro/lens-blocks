"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/registry/new-york/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/registry/new-york/ui/avatar";
import { AnyPost, PublicClient, SessionClient } from "@lens-protocol/react";
import { Flag, Copy, MoreHorizontal, UserCircle2 } from "lucide-react";
import LensMarkdown from "./lens-markdown";
import LikeButton from "@/registry/new-york/blocks/feed/components/likes/like-button";
import ReferenceButton from "@/registry/new-york/blocks/feed/components/references/reference-button";
import CommentButton from "@/registry/new-york/blocks/feed/components/comment/comment-button";
import moment from "moment/moment";
import CollectButton from "@/registry/new-york/blocks/feed/components/collects/collect-button";
import TipButton from "@/registry/new-york/blocks/feed/components/tips/tip-button";
import { cn, truncateAddress } from "@/registry/new-york/common/lib/lens-utils";
import { Button } from "@/registry/new-york/ui/button";
import BookmarkButton from "@/registry/new-york/blocks/feed/components/bookmarks/bookmark-button";

type LensPostProps = {
  /**
   * The Lens Client used for making public and authenticated calls
   */
  lensClient: PublicClient | SessionClient;
  post: AnyPost;
  onPostClick?: (post: AnyPost) => void;
  postLoading: boolean;
  className?: string;
};

export const LensPost = ({ lensClient, post, postLoading, onPostClick, className }: LensPostProps) => {
  const author = post.author;
  const name = author.metadata?.name ?? author.username?.localName ?? "[anonymous]";
  const isPost = post.__typename === "Post";
  const isCollectible =
    isPost && post.actions?.find(action => action.__typename === "SimpleCollectAction") !== undefined;

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

  return (
    <article
      role="article"
      tabIndex={0}
      onClick={() => onPostClick?.(post)}
      className={cn(
        "w-full border rounded-md p-4 flex flex-col gap-3 text-start",
        onPostClick && "cursor-pointer",
        className,
      )}
    >
      <div className="flex-grow flex justify-between flex-none">
        <div className="flex gap-2 w-full min-w-0">
          <Avatar className="flex-none w-10 h-10">
            <AvatarImage src={author.metadata?.picture} alt={`${name}'s avatar`} />
            <AvatarFallback>
              <UserCircle2 className="w-10 h-10 opacity-45" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-grow flex flex-col min-w-0">
            <div className="flex gap-2 w-full min-w-0">
              <span className="text-sm md:text-base font-semibold truncate">{name}</span>
              {author.username?.localName ? (
                <span className="text-sm md:text-base text-muted-foreground flex-none">
                  @{author.username.localName}
                </span>
              ) : (
                <span className="text-sm md:text-base text-muted-foreground flex-none">
                  {truncateAddress(author.address)}
                </span>
              )}
            </div>
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
              <button className="flex gap-2 items-center w-full p-2" onClick={onReportClick} disabled={postLoading}>
                <Flag />
                Report post
              </button>
            </DropdownMenuItem>
            <DropdownMenuItem className="focus:outline-none p-0">
              <button className="flex gap-2 items-center w-full p-2" onClick={onCopyClick} disabled={postLoading}>
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
          <CommentButton post={post} onClick={() => undefined} postLoading={postLoading} />
          <LikeButton lensClient={lensClient} post={post} postLoading={postLoading} />
          <ReferenceButton
            post={post}
            createRepost={async () => undefined}
            createQuote={async () => undefined}
            postLoading={postLoading}
          />
          {isCollectible && <CollectButton post={post} collect={async () => undefined} postLoading={postLoading} />}
          <TipButton post={post} postLoading={postLoading} />
        </div>
        <BookmarkButton post={post} postLoading={postLoading} className="-me-2" />
      </div>
    </article>
  );
};
