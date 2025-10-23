"use client";

import { AnyPost } from "@lens-protocol/react";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/registry/new-york/ui/button";
import { useLensPostContext } from "@/registry/new-york/hooks/use-lens-post-context";
import { MouseEvent } from "react";

type CollectButtonProps = {
  onClick: (post: AnyPost) => void;
  showCount?: boolean;
};

export const CollectButton = ({ onClick, showCount = true }: CollectButtonProps) => {
  const { post, loading: postLoading, optimistic } = useLensPostContext();

  const operations = post && "operations" in post ? post.operations : null;

  const onButtonClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.currentTarget.blur();
    event.stopPropagation();
    if (!post) return;
    onClick(post);
  };

  return (
    <div className="flex items-center">
      <Button
        onClick={onButtonClick}
        disabled={postLoading}
        variant="ghost"
        size="icon"
        className="w-8 h-8 active:outline-none focus-visible:outline-none cursor-pointer rounded-full"
      >
        {optimistic.collected || operations?.hasSimpleCollected ? (
          <svg viewBox="0 0 20 22" className="w-4 h-4">
            <g strokeWidth="1.5" fill="none" fillRule="evenodd" strokeLinecap="round" strokeLinejoin="round">
              <path
                d="M3,0 L0,4 L0,18 C0,19.1045695 0.8954305,20 2,20 L16,20 C17.1045695,20 18,19.1045695 18,18 L18,4 L15,0 L3,0 Z"
                stroke="var(--primary)"
                fill="var(--primary)"
                transform="translate(1 1)"
              />
              <path
                stroke="var(--primary)"
                fill="var(--background)"
                d="M3 0 0 4 18 4 15 0z"
                transform="translate(1 1)"
              />
              <path stroke="var(--primary)" d="M0 4 18 4" transform="translate(1 1)" />
              <path
                d="M13,8 C13,10.209139 11.209139,12 9,12 C6.790861,12 5,10.209139 5,8"
                stroke="var(--background)"
                transform="translate(1 1)"
              />
            </g>
          </svg>
        ) : (
          <ShoppingBag className="h-4 h-4" />
        )}
      </Button>
      {showCount && <span className="opacity-85">{new Intl.NumberFormat().format(optimistic.collectCount)}</span>}
    </div>
  );
};
