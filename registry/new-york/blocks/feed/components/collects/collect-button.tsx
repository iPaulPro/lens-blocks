"use client";

import { AnyPost, SimpleCollectAction, TxHash } from "@lens-protocol/react";
import { MouseEvent, useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/registry/new-york/ui/dialog";
import CollectDialog, { CollectDialogRef } from "@/registry/new-york/blocks/feed/components/collects/collect-dialog";
import CollectorsList from "@/registry/new-york/blocks/feed/components/collects/collectors-list";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/registry/new-york/ui/tooltip";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/registry/new-york/ui/button";

type CollectButtonProps = {
  post: AnyPost;
  collect: () => Promise<TxHash | undefined>;
  postLoading: boolean;
};

const CollectButton = ({ post, collect, postLoading }: CollectButtonProps) => {
  const [collectorsListDialogOpen, setCollectorsListDialogOpen] = useState(false);
  const [collectAction, setCollectAction] = useState<SimpleCollectAction | undefined>(undefined);

  const actions = "actions" in post ? post.actions : null;
  const operations = post && "operations" in post ? post.operations : null;
  const stats = post && "stats" in post ? post.stats : null;

  const collectDialog = useRef<CollectDialogRef>(null);

  useEffect(() => {
    if (!post) return;
    const action = actions?.find(action => action.__typename === "SimpleCollectAction");
    setCollectAction(action);
  }, [post]);

  const onClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.currentTarget.blur();
    collectDialog.current?.open();
  };

  return (
    <div className="flex items-center">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={onClick}
              disabled={postLoading}
              variant="ghost"
              className="w-8 h-8 active:outline-none focus-visible:outline-none cursor-pointer rounded-full"
            >
              {operations?.hasSimpleCollected ? (
                <svg viewBox="0 0 20 22" className="w-4 h-4">
                  <g strokeWidth="1.5" fill="none" fillRule="evenodd" strokeLinecap="round" strokeLinejoin="round">
                    <path
                      d="M3,0 L0,4 L0,18 C0,19.1045695 0.8954305,20 2,20 L16,20 C17.1045695,20 18,19.1045695 18,18 L18,4 L15,0 L3,0 Z"
                      stroke="var(--primary)"
                      fill="var(--primary)"
                      transform="translate(1 1)"
                    />
                    <path stroke="var(--primary)" fill="#FFF" d="M3 0 0 4 18 4 15 0z" transform="translate(1 1)" />
                    <path stroke="var(--primary)" d="M0 4 18 4" transform="translate(1 1)" />
                    <path
                      d="M13,8 C13,10.209139 11.209139,12 9,12 C6.790861,12 5,10.209139 5,8"
                      stroke="#FFF"
                      transform="translate(1 1)"
                    />
                  </g>
                </svg>
              ) : (
                <ShoppingBag className="h-4 h-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>Collect</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Dialog open={collectorsListDialogOpen} onOpenChange={setCollectorsListDialogOpen}>
        <DialogTrigger>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="cursor-pointer whitespace-nowrap hover:opacity-75">
                  {new Intl.NumberFormat().format(stats?.collects ?? 0)}
                </div>
              </TooltipTrigger>
              <TooltipContent>View collectors</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader className="text-left border-b pb-4">
            <DialogTitle className="text-2xl">Collectors</DialogTitle>
          </DialogHeader>
          {collectorsListDialogOpen && post && <CollectorsList post={post} />}
        </DialogContent>
      </Dialog>
      {post && collectAction && (
        <CollectDialog ref={collectDialog} post={post} action={collectAction} collect={collect} />
      )}
    </div>
  );
};

export default CollectButton;
