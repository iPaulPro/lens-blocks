"use client";

import { MouseEvent } from "react";
import { MessageCircle } from "lucide-react";
import { AnyPost } from "@lens-protocol/react";
import { Button } from "@/registry/new-york/ui/button";

type CommentButtonProps = {
  post: AnyPost;
  onClick: (post: AnyPost) => void;
  postLoading: boolean;
};

const CommentButton = ({ post, onClick, postLoading }: CommentButtonProps) => {
  const operations = post && "operations" in post ? post.operations : null;
  const stats = post && "stats" in post ? post.stats : null;

  const onButtonClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.currentTarget.blur();
    event.stopPropagation();
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
        {operations?.hasCommented.optimistic || operations?.hasCommented.onChain ? (
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
