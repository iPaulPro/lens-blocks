import { AnyPost } from "@lens-protocol/react";
import { Button } from "@/registry/new-york/ui/button";
import { Bookmark } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/registry/new-york/ui/tooltip";
import { cn } from "@/registry/new-york/common/lib/lens-utils";
import { useLensPostContext } from "@/registry/new-york/common/lib/lens-post-context";
import { MouseEvent } from "react";

type BookmarkButtonProps = {
  className?: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
};

const BookmarkButton = ({ className, onSuccess, onError }: BookmarkButtonProps) => {
  const { post, loading: postLoading, toggleBookmark, optimistic } = useLensPostContext();

  const operations = post && "operations" in post ? post.operations : null;

  const onClick = async (event: MouseEvent<HTMLButtonElement>) => {
    event.currentTarget.blur();
    event.stopPropagation();

    if (!post) return;

    try {
      await toggleBookmark();
      onSuccess?.();
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
            onClick={onClick}
            disabled={postLoading}
            variant="ghost"
            className={cn(
              "w-8 h-8 active:outline-none focus-visible:outline-none cursor-pointer rounded-full",
              className,
            )}
          >
            {optimistic.bookmarked || operations?.hasBookmarked ? (
              <Bookmark className="text-primary" fill="var(--primary)" />
            ) : (
              <Bookmark className="opacity-85" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {optimistic.bookmarked || operations?.hasBookmarked ? "Remove bookmark" : "Bookmark post"}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default BookmarkButton;
