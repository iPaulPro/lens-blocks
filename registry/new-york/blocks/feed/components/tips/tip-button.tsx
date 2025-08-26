"use client";

import { AnyPost } from "@lens-protocol/react";
import { MouseEvent } from "react";
import { CircleDollarSign } from "lucide-react";
import { Button } from "@/registry/new-york/ui/button";
import { useLensPostContext } from "@/registry/new-york/common/lib/lens-post-context";

interface Props {
  onClick: (post: AnyPost) => void;
}

const TipButton = ({ onClick }: Props) => {
  const { post, loading: postLoading } = useLensPostContext();

  const operations = post && "operations" in post ? post.operations : null;
  const stats = post && "stats" in post ? post.stats : null;

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.currentTarget.blur();
    event.stopPropagation();
    if (!post) return;
    // onClick(post);
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
          <CircleDollarSign className="w-4 h-4 text-primary" fill="var(--primary)" />
        ) : (
          <CircleDollarSign className="w-4 h-4" />
        )}
      </Button>
      <span className="opacity-85">{new Intl.NumberFormat().format(stats?.tips ?? 0)}</span>
    </div>
  );
};

export default TipButton;
