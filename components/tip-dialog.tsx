"use client";

import { OpenInV0Button } from "@/components/open-in-v0-button";
import { InstallCommandBlock } from "@/components/install-command-block";
import { CodeBlock } from "@/components/codeblock";
import LensTipDialog, { TipDialogRef } from "@/registry/new-york/components/feed/tips/lens-tip-dialog";
import { PaymentSource, postId, TxHash, useSessionClient } from "@lens-protocol/react";
import { useTipPostAction } from "@/registry/new-york/hooks/use-tip-post-action";
import { useWalletClient } from "wagmi";
import { toast } from "sonner";
import { useEffect, useRef } from "react";
import { Button } from "@/registry/new-york/ui/button";
import { CircleDollarSign } from "lucide-react";

export default function TipDialog() {
  const { data: sessionClient, loading: sessionLoading } = useSessionClient();
  const { data: walletClient, isLoading: walletClientLoading } = useWalletClient();
  const { execute, error } = useTipPostAction();

  const tipDialog = useRef<TipDialogRef>(null);
  const post = postId("3988215955854869405528302997462877091460304706960228350925150132477118244123");

  const handleCreateTip = async (source: PaymentSource, amount: string, tokenAddress: string): Promise<TxHash> => {
    if (sessionLoading || walletClientLoading || !sessionClient || !walletClient) {
      throw new Error("Session or wallet client is loading");
    }

    const res = await execute({
      source,
      amount,
      tokenAddress,
      post,
      sessionClient,
      walletClient,
      isTestnet: true,
    });

    if (res.isErr()) {
      throw res.error;
    }

    return res.value;
  };

  const handleTipCreated = (txHash: TxHash) => {
    toast.success("Tip sent successfully!", {
      action: (
        <Button className="ml-auto" onClick={() => window.open("https://explorer.testnet.lens.xyz/tx/" + txHash)}>
          View tx
        </Button>
      ),
    });
  };

  const handleError = (e: Error) => {
    console.error("Tip creation error:", e);
    toast.error("Unable to send tip");
  };

  useEffect(() => {
    if (error && error instanceof Error) {
      handleError(error);
    }
  }, [error]);

  return (
    <>
      <div className="flex flex-col flex-1 gap-8">
        <div className="preview flex flex-col gap-4 relative">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground sm:pl-3">A Lens tip dialog component</div>
            <OpenInV0Button name="tip-dialog" className="w-fit" />
          </div>
          <div className="flex flex-col gap-6 items-center justify-center flex-grow relative">
            <Button variant="outline" onClick={() => tipDialog?.current?.open()}>
              <CircleDollarSign className="w-4 h-4" />
            </Button>
            <p className="text-xs text-center text-muted-foreground max-w-xs">
              This will create a post tip for{" "}
              <a href="https://testnet.hey.xyz/posts/1n8vtqy901xcrynmgrb" target="_blank" rel="noopener">
                this post
              </a>
            </p>
          </div>
        </div>
        <h2 className="mt-6 pb-2 text-3xl font-semibold tracking-tight first:mt-0">Installation</h2>
        <InstallCommandBlock componentName="tip-dialog" />
        <h2 className="mt-6 pb-2 text-3xl font-semibold tracking-tight first:mt-0">Usage</h2>
        <p>The tip dialog can be used to create tips for Posts and Accounts.</p>
        <CodeBlock lang="tsx" className="lines">
          {`import LensTipDialog, { TipDialogRef } from "@/components/lens-tip-dialog";
import { useTipPostAction } from "@/hooks/use-tip-post-action";
import { postId, useSessionClient } from "@lens-protocol/react";
import { useWalletClient } from "wagmi";`}
        </CodeBlock>
        <CodeBlock lang="tsx" className="lines">
          {`const { data: sessionClient } = useSessionClient();
const { data: walletClient } = useWalletClient();
const { execute } = useTipPostAction();

const post = postId("SOME_POST_ID");
const tipDialog = useRef<TipDialogRef>(null);`}
        </CodeBlock>
        <CodeBlock lang="tsx" className="lines">
          {`const handleCreateTip = async (
  source: PaymentSource,
  amount: string,
  tokenAddress: string,
): Promise<TxHash> => {
  if (!sessionClient || !walletClient) {
    // Errors thrown will be caught by LensTipDialog and passed to onError
    throw new Error("A valid session and wallet client are required");
  }
  const res = await execute({
    post,
    source,
    amount,
    tokenAddress,
    sessionClient,
    walletClient
  });
  if (res.isErr()) {
    throw res.error;
  }
  return res.value;
};`}
        </CodeBlock>
        <CodeBlock lang="tsx" className="lines">
          {`<>
  <button onClick={() => tipDialog?.current?.open()}>
    Tip me!
  </button>
  <LensTipDialog ref={tipDialog} createTip={handleCreateTip} />       
</>`}
        </CodeBlock>
      </div>
      <LensTipDialog
        ref={tipDialog}
        createTip={handleCreateTip}
        onTipCreated={handleTipCreated}
        onError={handleError}
      />
    </>
  );
}
