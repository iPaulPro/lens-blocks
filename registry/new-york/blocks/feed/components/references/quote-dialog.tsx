import { AnyPost, TxHash } from "@lens-protocol/react";
import { forwardRef, useImperativeHandle, useState } from "react";

export interface QuoteDialogRef {
  showModal: () => void;
}

export interface QuoteDialogProps {
  post: AnyPost;
  createQuote: (post: AnyPost, content: string) => Promise<TxHash | undefined>;
  onError?: (error: Error) => void;
}

const QuoteDialog = forwardRef<QuoteDialogRef, QuoteDialogProps>(({ post, createQuote, onError }, ref) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useImperativeHandle(ref, () => ({
    showModal: () => setDialogOpen(true),
  }));

  return <></>;
});

export default QuoteDialog;
