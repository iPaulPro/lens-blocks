"use client";

import { AnyPost, PublicClient, SessionClient } from "@lens-protocol/react";
import { MouseEvent, useState } from "react";
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

  const [optimisticLiked, setOptimisticLiked] = useState(operations?.hasUpvoted ?? false);

  const { execute: toggleLike } = useReactionToggle();

  const onClick = async (event: MouseEvent<HTMLButtonElement>) => {
    event.currentTarget.blur();
    event.stopPropagation();
    if (!post || !lensClient.isSessionClient()) return;
    setOptimisticLiked(optimisticLiked => !optimisticLiked);
    await toggleLike({ post, session: lensClient });
  };

  return (
    <div className="flex items-center">
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
      <span>{new Intl.NumberFormat().format(stats?.upvotes ?? 0)}</span>
    </div>
  );
};

export default LikeButton;
