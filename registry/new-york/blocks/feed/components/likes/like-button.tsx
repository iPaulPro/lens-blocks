"use client";

import { MouseEvent } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/registry/new-york/ui/button";
import { useLensPostContext } from "@/registry/new-york/common/hooks/use-lens-post-context";
import { cn } from "@/registry/new-york/common/lib/utils";

type LikeButtonProps = {
  className?: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
};

const LikeButton = ({ className, onSuccess, onError }: LikeButtonProps) => {
  const { post, loading: postLoading, toggleLike, optimistic } = useLensPostContext();

  const operations = post && "operations" in post ? post.operations : null;
  const stats = post && "stats" in post ? post.stats : null;

  const onClick = async (event: MouseEvent<HTMLButtonElement>) => {
    event.currentTarget.blur();
    event.stopPropagation();

    if (post?.__typename !== "Post") return;

    try {
      await toggleLike();
      onSuccess?.();
    } catch (e) {
      if (onError) {
        onError(e instanceof Error ? e : new Error("An unexpected error occurred while toggling like."));
      } else {
        console.error("An unexpected error occurred while toggling like:", e);
      }
    }
  };

  return (
    <div className="flex items-center">
      <Button
        onClick={onClick}
        disabled={postLoading}
        variant="ghost"
        className={cn("w-8 h-8 active:outline-none focus-visible:outline-none cursor-pointer rounded-full", className)}
      >
        {optimistic.liked || operations?.hasUpvoted ? (
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
