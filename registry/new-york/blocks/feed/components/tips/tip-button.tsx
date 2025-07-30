"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/registry/new-york/ui/dialog";
import { AnyPost } from "@lens-protocol/react";
import { MouseEvent, useRef, useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/registry/new-york/ui/tooltip";
import TippersList from "@/registry/new-york/blocks/feed/components/tips/tippers-list";
import TipDialog, { TipDialogRef } from "@/registry/new-york/blocks/feed/components/tips/tip-dialog";
import { CircleDollarSign } from "lucide-react";
import { Button } from "@/registry/new-york/ui/button";

interface Props {
  post: AnyPost | null;
  postLoading: boolean;
  onError?: (error: Error) => void;
}

const TipButton = ({ post, postLoading, onError }: Props) => {
  const [listDialogOpen, setListDialogOpen] = useState(false);

  const tipDialog = useRef<TipDialogRef>(null);

  if (!post) return null;

  const operations = post && "operations" in post ? post.operations : null;
  const stats = post && "stats" in post ? post.stats : null;

  const onClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.currentTarget.blur();
    tipDialog.current?.showModal();
  };

  return (
    <div className="flex items-center">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              disabled={postLoading || !operations?.canTip}
              onClick={onClick}
              className="w-8 h-8 active:outline-none focus-visible:outline-none cursor-pointer rounded-full"
            >
              {operations?.hasTipped ? (
                <CircleDollarSign className="w-4 h-4 text-primary" fill="var(--primary)" />
              ) : (
                <CircleDollarSign className="w-4 h-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>Send a tip</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Dialog open={listDialogOpen} onOpenChange={setListDialogOpen}>
        <DialogTrigger>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="cursor-pointer whitespace-nowrap hover:opacity-75">
                  {new Intl.NumberFormat().format(stats?.tips ?? 0)}
                </div>
              </TooltipTrigger>
              <TooltipContent>View tippers</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </DialogTrigger>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader className="text-left border-b pb-4">
            <DialogTitle>Tippers</DialogTitle>
          </DialogHeader>
          {listDialogOpen && <TippersList post={post} />}
        </DialogContent>
      </Dialog>
      <TipDialog ref={tipDialog} supportedTokens={[]} createTip={async () => undefined} />
    </div>
  );
};

export default TipButton;
