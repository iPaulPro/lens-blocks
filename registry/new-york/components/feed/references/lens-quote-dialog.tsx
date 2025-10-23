"use client";

import { TxHash, useSessionClient } from "@lens-protocol/react";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { LensTextEditor, TextEditorRef } from "@/registry/new-york/components/common/editor/lens-text-editor";
import { LensPostProvider } from "@/registry/new-york/lib/lens-post-provider";
import { LensPost } from "@/registry/new-york/blocks/lens-post";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/registry/new-york/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/registry/new-york/ui/avatar";
import { parseUri } from "@/registry/new-york/lib/lens-utils";
import { UserCircle2 } from "lucide-react";
import { useAuthenticatedLensAccount } from "@/registry/new-york/hooks/use-authenticated-lens-account";
import { Button } from "@/registry/new-york/ui/button";
import { useLensPostContext } from "@/registry/new-york/hooks/use-lens-post-context";
import { Spinner } from "@/registry/new-york/ui/spinner";

export interface QuoteDialogRef {
  open: () => void;
  close: () => void;
  isOpen: boolean;
}

export interface QuoteDialogProps {
  onQuoteCreated?: (txHash: TxHash) => void;
  onError?: (error: Error) => void;
}

export const LensQuoteDialog = forwardRef<QuoteDialogRef, QuoteDialogProps>((props, ref) => {
  const { onQuoteCreated, onError } = props;
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const session = useSessionClient();
  const { data: account, loading: accountLoading } = useAuthenticatedLensAccount();
  const { post, quote } = useLensPostContext();

  const textEditor = useRef<TextEditorRef>(null);

  useImperativeHandle(ref, () => ({
    open: () => setDialogOpen(true),
    close: () => setDialogOpen(false),
    isOpen: dialogOpen,
  }));

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const content = textEditor.current?.getContent() || "";
      const txHash = await quote(content);
      if (txHash) {
        onQuoteCreated?.(txHash);
        setDialogOpen(false);
      }
    } catch (error) {
      if (error instanceof Error) {
        onError?.(error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader className="text-left border-b">
          <DialogTitle>Create a post</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col px-4">
          <div className="flex gap-4">
            <div className="flex-none">
              {accountLoading ? (
                <div className="w-10 h-10 border rounded-full flex items-center justify-center">
                  <Spinner />
                </div>
              ) : (
                <Avatar className="flex-none w-10 h-10">
                  <AvatarImage src={parseUri(account?.metadata?.picture)} alt={`${account?.address}'s avatar`} />
                  <AvatarFallback>
                    <UserCircle2 className="w-10 h-10 opacity-45" />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
            <div className="flex-grow mt-2 pb-7">
              <LensTextEditor ref={textEditor} className="p-0 min-h-20" />
            </div>
          </div>
          {post && (
            <LensPostProvider session={session} postId={post.id}>
              <div className="md:pl-14">
                <LensPost showActions={false} className="border rounded-xl" contentClassName="md:text-sm" />
              </div>
            </LensPostProvider>
          )}
        </div>
        <DialogFooter className="justify-end border-t">
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Spinner /> Posting...
              </>
            ) : (
              "Post"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});
