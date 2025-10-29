import { Button } from "@/registry/new-york/ui/button";
import { Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLensPostContext } from "@/registry/new-york/hooks/use-lens-post-context";
import { MouseEvent } from "react";
import { Post } from "@lens-protocol/react";

type BookmarkButtonProps = {
  className?: string;
  onSuccess?: (post: Post, bookmarked: boolean) => void;
  onError?: (error: Error) => void;
};

export const BookmarkButton = ({ className, onSuccess, onError }: BookmarkButtonProps) => {
  const { post, loading: postLoading, toggleBookmark, optimistic } = useLensPostContext();

  const basePost: Post | null | undefined = post?.__typename === "Repost" ? post.repostOf : post;

  const onClick = async (event: MouseEvent<HTMLButtonElement>) => {
    event.currentTarget.blur();
    event.stopPropagation();

    if (!basePost) return;

    try {
      const bookmarked = await toggleBookmark();
      onSuccess?.(basePost, bookmarked);
    } catch (error) {
      if (error instanceof Error && onError) {
        onError(error);
      }
    }
  };

  return (
    <Button
      onClick={onClick}
      disabled={postLoading}
      variant="ghost"
      size="icon"
      className={cn("w-8 h-8 active:outline-none focus-visible:outline-none cursor-pointer rounded-full", className)}
    >
      {optimistic.bookmarked || basePost?.operations?.hasBookmarked ? (
        <Bookmark className="text-primary" fill="var(--primary)" />
      ) : (
        <Bookmark className="opacity-85" />
      )}
    </Button>
  );
};

export default BookmarkButton;
