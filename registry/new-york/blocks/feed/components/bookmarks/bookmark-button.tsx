import { AnyPost, postId, useUndoBookmarkPost, useBookmarkPost } from "@lens-protocol/react";
import { Button } from "@/registry/new-york/ui/button";
import { Bookmark } from "lucide-react";
import { useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/registry/new-york/ui/tooltip";
import { cn } from "@/registry/new-york/common/lib/lens-utils";

type BookmarkButtonProps = {
  post: AnyPost;
  postLoading: boolean;
  className?: string;
  onError?: (error: Error) => void;
};

const BookmarkButton = (props: BookmarkButtonProps) => {
  const { className, post, postLoading, onError } = props;
  const operations = post && "operations" in post ? post.operations : null;

  const [optimisticBookmarked, setOptimisticBookmarked] = useState(operations?.hasBookmarked ?? false);

  const { execute: bookmarkPost } = useBookmarkPost();
  const { execute: undoBookmarkPost } = useUndoBookmarkPost();

  const onClick = async (post: AnyPost) => {
    if (!post) return;

    setOptimisticBookmarked(optimisticBookmarked => !optimisticBookmarked);

    try {
      if (operations?.hasBookmarked) {
        await undoBookmarkPost({ post: postId(post.id) });
      } else {
        await bookmarkPost({ post: postId(post.id) });
      }
    } catch (error) {
      if (error instanceof Error && onError) {
        onError(error);
      }
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={async () => await onClick(post)}
            disabled={postLoading}
            variant="ghost"
            className={cn(
              "w-8 h-8 active:outline-none focus-visible:outline-none cursor-pointer rounded-full",
              className,
            )}
          >
            {optimisticBookmarked || operations?.hasBookmarked ? (
              <Bookmark className="text-primary" fill="var(--primary)" />
            ) : (
              <Bookmark className="opacity-85" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {optimisticBookmarked || operations?.hasBookmarked ? "Remove bookmark" : "Bookmark post"}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default BookmarkButton;
