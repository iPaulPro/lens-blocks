"use client";

import { MouseEvent } from "react";
import { MessageCircle } from "lucide-react";
import { AnyPost } from "@lens-protocol/react";
import { Button } from "@/registry/new-york/ui/button";
import { useLensPostContext } from "@/registry/new-york/hooks/use-lens-post-context";

type CommentButtonProps = {
  onClick: (post: AnyPost) => void;
};

const CommentButton = ({ onClick }: CommentButtonProps) => {
  const { post, loading: postLoading } = useLensPostContext();

  const operations = post && "operations" in post ? post.operations : null;
  const stats = post && "stats" in post ? post.stats : null;

  const onButtonClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.currentTarget.blur();
    event.stopPropagation();
    if (!post) return;
    onClick(post);
  };

  return (
    <div className="flex items-center">
      <Button
        variant="ghost"
        onClick={onButtonClick}
        disabled={postLoading}
        className="w-8 h-8 active:outline-none focus-visible:outline-none cursor-pointer rounded-full"
      >
        {operations?.hasCommented?.optimistic || operations?.hasCommented?.onChain ? (
          <MessageCircle className="text-primary" fill="var(--primary)" />
        ) : (
          <MessageCircle className="opacity-85" />
        )}
      </Button>
      <span className="opacity-85">{new Intl.NumberFormat().format(stats?.comments ?? 0)}</span>
    </div>
  );
};

export default CommentButton;
