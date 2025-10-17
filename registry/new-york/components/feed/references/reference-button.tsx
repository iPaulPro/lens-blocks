import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/registry/new-york/ui/dropdown-menu";
import { AnyPost, Post, TxHash } from "@lens-protocol/react";
import { MouseEvent, useState } from "react";
import { CheckCircle, Loader, MessageCircle, Repeat2 } from "lucide-react";
import { Button } from "@/registry/new-york/ui/button";
import { useLensPostContext } from "@/registry/new-york/hooks/use-lens-post-context";

type ReferenceButtonProps = {
  onQuoteClick: (post: AnyPost) => void;
  onRepostSuccess?: (txHash: TxHash) => void;
  onError?: (error: Error) => void;
};

const ReferenceButton = ({ onQuoteClick, onRepostSuccess, onError }: ReferenceButtonProps) => {
  const { post, repost, loading: postLoading, optimistic } = useLensPostContext();

  const [isDropdownMenuOpen, setIsDropdownMenuOpen] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const postToReference: Post | null | undefined = post?.__typename === "Repost" ? post.repostOf : post;

  const onClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.currentTarget.blur();
    event.stopPropagation();
    setIsDropdownMenuOpen(true);
  };

  const onRepostClick = async (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setIsPosting(true);
    try {
      const txHash = await repost();
      if (txHash) {
        onRepostSuccess?.(txHash);
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
        }, 3000);
        setShowSuccess(false);
      }
    } catch (error) {
      if (error instanceof Error) {
        onError?.(error);
      }
    } finally {
      setIsPosting(false);
    }
  };

  const handleQuoteClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.currentTarget.blur();
    event.stopPropagation();
    setIsDropdownMenuOpen(false);
    if (!post) return;
    onQuoteClick(post);
  };

  if (!post) return null;

  return (
    <div className="flex items-center">
      <DropdownMenu open={isDropdownMenuOpen} onOpenChange={setIsDropdownMenuOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            disabled={postLoading || isPosting || showSuccess}
            onClick={onClick}
            className="w-8 h-8 active:outline-none focus-visible:outline-none hover:opacity-75 cursor-pointer rounded-full"
          >
            {isPosting ? (
              <Loader className="animate-spin w-4 h-4 text-muted-foreground" />
            ) : showSuccess ? (
              <CheckCircle className="size-2" />
            ) : postToReference?.operations?.hasReposted ||
              postToReference?.operations?.hasQuoted.optimistic ||
              postToReference?.operations?.hasQuoted.onChain ? (
              <Repeat2 className="size-[1.125rem]" strokeWidth={3} stroke="var(--primary)" />
            ) : (
              <Repeat2 className="size-[1.125rem]" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="min-w-48">
          <DropdownMenuItem className="text-md focus:outline-none p-0">
            <button
              className="flex gap-4 items-center w-full p-3"
              onClick={onRepostClick}
              disabled={postLoading || isPosting}
            >
              <Repeat2 className="w-4 h-4 inline" />
              Repost
            </button>
          </DropdownMenuItem>
          <DropdownMenuItem className="text-md focus:outline-none p-0">
            <button
              className="flex gap-4 items-center w-full p-3"
              onClick={handleQuoteClick}
              disabled={postLoading || isPosting}
            >
              <MessageCircle className="w-4 h-4 inline" />
              Quote
            </button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <span className="opacity-85">{new Intl.NumberFormat().format(optimistic.repostAndQuoteCount)}</span>
    </div>
  );
};

export default ReferenceButton;
