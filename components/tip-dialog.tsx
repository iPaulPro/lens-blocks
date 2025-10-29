"use client";

import { InstallCommandBlock } from "@/components/install-command-block";
import { CodeBlock } from "@/components/codeblock";
import { LensTipDialog, TipDialogRef } from "@/registry/new-york/components/feed/tips/lens-tip-dialog";
import { postId, TxHash, useSessionClient } from "@lens-protocol/react";
import { useTipPostAction } from "@/registry/new-york/hooks/use-tip-post-action";
import { useWalletClient } from "wagmi";
import { toast } from "sonner";
import { useEffect, useRef } from "react";
import { Button } from "@/registry/new-york/ui/button";
import { CircleDollarSign } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/registry/new-york/ui/tabs";

export default function TipDialog() {
  const { data: sessionClient, loading: sessionLoading } = useSessionClient();
  const { data: walletClient, isLoading: walletLoading } = useWalletClient();
  const { execute, error } = useTipPostAction({ sessionClient, walletClient, useTestnet: true });

  const tipDialog = useRef<TipDialogRef>(null);
  const post = postId("3988215955854869405528302997462877091460304706960228350925150132477118244123");

  const handleError = (e: Error) => {
    console.error("Tip creation error:", e);
    toast.error("Unable to send tip");
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

  useEffect(() => {
    if (error && error instanceof Error) {
      handleError(error);
    }
  }, [error]);

  return (
    <>
      <div className="flex flex-col flex-1 gap-8">
        <Tabs defaultValue="preview">
          <div className="preview flex flex-col gap-2 relative">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="preview">Preview</TabsTrigger>
                <TabsTrigger value="code">Code</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="preview" className="flex flex-col gap-6 items-center justify-center flex-grow relative">
              <Button
                variant="outline"
                onClick={() => tipDialog?.current?.open()}
                disabled={sessionLoading || walletLoading}
              >
                <CircleDollarSign className="w-4 h-4" />
              </Button>
              <p className="text-xs text-center text-muted-foreground max-w-xs">
                Tipping{" "}
                <a href="https://testnet.hey.xyz/posts/1n8vtqy901xcrynmgrb" target="_blank" rel="noopener">
                  this post
                </a>{" "}
                on testnet.
              </p>
            </TabsContent>
            <TabsContent value="code" className="p-0">
              <CodeBlock lang="tsx" className="lines border-none">
                {`import { postId, useSessionClient } from "@lens-protocol/react";
import { useWalletClient } from "wagmi";
import { useRef } from "react";
import { LensTipDialog, TipDialogRef } from "@/components/feed/tips/lens-tip-dialog";
import { LensPostProvider } from "@/lib/lens-post-provider";
import { Button } from "@/ui/button";
import { CircleDollarSign } from "lucide-react";
import { toast } from "sonner";

export function TipDialogDemo() {
  const { data: sessionClient, loading: sessionLoading } = useSessionClient();
  const { data: walletClient, isLoading: walletLoading } = useWalletClient();
  
  const { execute, error } = useTipPostAction({ 
    sessionClient,
    walletClient,
    useTestnet: true 
  });

  const tipDialog = useRef<TipDialogRef>(null);
  const post = postId("3988215955854869405528302997462877091460304706960228350925150132477118244123");
  
  const handleTipCreated = (txHash: TxHash) => {
    toast.success("Tip sent successfully!", {
      action: (
        <Button 
          className="ml-auto"
          onClick={() => window.open("https://explorer.testnet.lens.xyz/tx/" + txHash)}
        >
          View tx
        </Button>
      ),
    });
  };

  useEffect(() => {
    if (error && error instanceof Error) {
      toast.error("Unable to send tip");
    }
  }, [error]);
  
  return (
    <LensPostProvider
      postId={post}
      session={session}
      wallet={wallet}
      useTestnet={true}
    >
      <Button
        variant="outline"
        onClick={tipDialog.current?.open}
        disabled={sessionLoading || walletLoading}
      >
        <CircleDollarSign className="w-4 h-4" />
      </Button>
      <LensTipDialog
        ref={tipDialog}
        sessionClient={sessionClient}
        createTip={(source, amount, tokenAddress) => {
          return execute({ post, source, amount, tokenAddress });
        }}
        onTipCreated={handleTipCreated}
        onTipError={handleError}
      />
    </LensPostProvider>    
  );
};`}
              </CodeBlock>
            </TabsContent>
          </div>
        </Tabs>
        <h2 className="mt-6 pb-2 text-3xl font-semibold tracking-tight first:mt-0">Installation</h2>
        <InstallCommandBlock componentName="tip-dialog" />
        <h2 className="mt-6 pb-2 text-3xl font-semibold tracking-tight first:mt-0">Usage</h2>
        <p>The tip dialog can be used to create tips for Posts and Accounts.</p>
        <CodeBlock lang="tsx" className="lines">
          {`import { LensTipDialog, TipDialogRef } from "@/components/lens-tip-dialog";
import { useTipPostAction } from "@/hooks/use-tip-post-action";
import { postId, useSessionClient } from "@lens-protocol/react";
import { useWalletClient } from "wagmi";`}
        </CodeBlock>
        <CodeBlock lang="tsx" className="lines">
          {`const { data: sessionClient } = useSessionClient();
const { data: walletClient } = useWalletClient();
const { execute } = useTipPostAction({ sessionClient, walletClient });

const post = postId("SOME_POST_ID");
const tipDialog = useRef<TipDialogRef>(null);`}
        </CodeBlock>
        <CodeBlock lang="tsx" className="lines">
          {`<>
  <button onClick={() => tipDialog?.current?.open()}>
    Tip me!
  </button>
  <LensTipDialog
    ref={tipDialog}
    sessionClient={sessionClient}
    createTip={(source, amount, tokenAddress) => {
      return execute({ post, source, amount, tokenAddress });
    }}
  />       
</>`}
        </CodeBlock>
      </div>
      <LensTipDialog
        ref={tipDialog}
        sessionClient={sessionClient}
        createTip={(source, amount, tokenAddress) => {
          return execute({ post, source, amount, tokenAddress });
        }}
        onTipCreated={handleTipCreated}
        onTipError={handleError}
      />
    </>
  );
}
