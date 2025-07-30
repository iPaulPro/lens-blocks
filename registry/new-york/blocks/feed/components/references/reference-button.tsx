import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/registry/new-york/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/registry/new-york/ui/tooltip";
import { AnyPost, TxHash } from "@lens-protocol/react";
import { MouseEvent, useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/registry/new-york/ui/dialog";
import ReferencesList from "@/registry/new-york/blocks/feed/components/references/references-list";
import { MessageCircle, Repeat2 } from "lucide-react";
import QuoteDialog, { QuoteDialogRef } from "@/registry/new-york/blocks/feed/components/references/quote-dialog";
import { Button } from "@/registry/new-york/ui/button";

type ReferenceButtonProps = {
  post: AnyPost;
  createRepost: (post: AnyPost) => Promise<TxHash | undefined>;
  createQuote: (post: AnyPost) => Promise<TxHash | undefined>;
  onError?: (error: Error) => void;
  postLoading: boolean;
};

const ReferenceButton = ({ post, createRepost, createQuote, onError, postLoading }: ReferenceButtonProps) => {
  const [listDialogOpen, setListDialogOpen] = useState(false);
  const [isPosting, setIsPosting] = useState(false);

  const quoteDialog = useRef<QuoteDialogRef>(null);

  const stats = post && "stats" in post ? post.stats : null;

  const onClick = (event: MouseEvent<HTMLDivElement>) => {
    event.currentTarget.blur();
    setListDialogOpen(true);
  };

  const onRepostClick = async () => {
    setIsPosting(true);
    try {
      setListDialogOpen(false);
      await createRepost(post);
    } catch (error) {
      if (error instanceof Error) {
        onError?.(error);
      }
    } finally {
      setIsPosting(false);
    }
  };

  const onQuoteClick = () => {
    quoteDialog.current?.showModal();
  };

  if (!post) return null;

  return (
    <div className="flex items-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  disabled={postLoading || isPosting}
                  className="w-8 h-8 active:outline-none focus-visible:outline-none hover:opacity-75 cursor-pointer rounded-full"
                >
                  <Repeat2 className="size-[1.125rem]" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Quote and Repost</TooltipContent>
            </Tooltip>
          </TooltipProvider>
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
              onClick={onQuoteClick}
              disabled={postLoading || isPosting}
            >
              <MessageCircle className="w-4 h-4 inline" />
              Quote
            </button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={listDialogOpen} onOpenChange={setListDialogOpen}>
        <DialogTrigger>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="cursor-pointer whitespace-nowrap hover:opacity-75" onClick={onClick}>
                  {new Intl.NumberFormat().format((stats?.quotes ?? 0) + (stats?.reposts ?? 0))}
                </div>
              </TooltipTrigger>
              <TooltipContent>View Quotes and Reposts</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </DialogTrigger>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader className="text-left border-b pb-4">
            <DialogTitle>Quotes & Reposts</DialogTitle>
          </DialogHeader>
          {listDialogOpen && <ReferencesList post={post} />}
        </DialogContent>
      </Dialog>

      <QuoteDialog ref={quoteDialog} post={post} createQuote={async (post, content) => createQuote(post)} />
    </div>
  );
};

export default ReferenceButton;
