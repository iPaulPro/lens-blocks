"use client";

import { AnyPost, PublicClient, SessionClient, useAuthenticatedUser } from "@lens-protocol/react";
import { MouseEvent, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/registry/new-york/ui/dialog";
import LikesList from "@/registry/new-york/blocks/feed/components/likes/likes-list";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/registry/new-york/ui/tooltip";
import { Heart } from "lucide-react";
import { useReactionToggle } from "@/registry/new-york/blocks/feed/hooks/use-reaction-toggle";
import { Button } from "@/registry/new-york/ui/button";

type LikeButtonProps = {
  /**
   * The Lens Client used for making public and authenticated calls
   */
  lensClient: PublicClient | SessionClient;
  post: AnyPost | null;
  postLoading: boolean;
};

const LikeButton = ({ lensClient, post, postLoading }: LikeButtonProps) => {
  const operations = post && "operations" in post ? post.operations : null;
  const stats = post && "stats" in post ? post.stats : null;

  const [dialogOpen, setDialogOpen] = useState(false);
  const [optimisticLiked, setOptimisticLiked] = useState(operations?.hasUpvoted ?? false);

  const { execute: toggleLike } = useReactionToggle();

  const onClick = async (event: MouseEvent<HTMLButtonElement>) => {
    event.currentTarget.blur();
    if (!post || !lensClient.isSessionClient()) return;
    setOptimisticLiked(optimisticLiked => !optimisticLiked);
    await toggleLike({ post, session: lensClient });
  };

  return (
    <div className="flex items-center">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={onClick}
              disabled={postLoading}
              variant="ghost"
              className="w-8 h-8 active:outline-none focus-visible:outline-none cursor-pointer rounded-full"
            >
              {optimisticLiked || operations?.hasUpvoted ? (
                <Heart className="text-primary" fill="var(--primary)" />
              ) : (
                <Heart className="opacity-85" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>{optimisticLiked || operations?.hasUpvoted ? "Remove like" : "Like post"}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="cursor-pointer whitespace-nowrap opacity-85 hover:opacity-75">
                  {new Intl.NumberFormat().format(stats?.upvotes ?? 0)}
                </div>
              </TooltipTrigger>
              <TooltipContent>View likes</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </DialogTrigger>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader className="text-left border-b pb-4">
            <DialogTitle>Likes</DialogTitle>
          </DialogHeader>
          {dialogOpen && post && <LikesList post={post} />}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LikeButton;
