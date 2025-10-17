"use client";

import { AnyPost } from "@lens-protocol/react";
import { MouseEvent } from "react";
import { CircleDollarSign } from "lucide-react";
import { Button } from "@/registry/new-york/ui/button";
import { useLensPostContext } from "@/registry/new-york/hooks/use-lens-post-context";

interface Props {
  onClick: (post: AnyPost) => void;
}

const TipButton = ({ onClick }: Props) => {
  const { post, loading: postLoading, optimistic } = useLensPostContext();

  const operations = post && "operations" in post ? post.operations : null;

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.currentTarget.blur();
    event.stopPropagation();
    if (!post) return;
    onClick(post);
  };

  if (!post) return null;

  return (
    <div className="flex items-center">
      <Button
        variant="ghost"
        disabled={postLoading || !operations?.canTip}
        onClick={handleClick}
        className="w-8 h-8 active:outline-none focus-visible:outline-none cursor-pointer rounded-full"
      >
        {operations?.hasTipped ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="var(--primary)"
            stroke="var(--background)"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4"
          >
            <circle cx="12" cy="12" r="12" />
            <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" strokeWidth="2" />
            <path d="M12 18V6" strokeWidth="2" />
          </svg>
        ) : (
          <CircleDollarSign className="w-4 h-4" />
        )}
      </Button>
      <span className="opacity-85">{new Intl.NumberFormat().format(optimistic.tipCount)}</span>
    </div>
  );
};

export default TipButton;
