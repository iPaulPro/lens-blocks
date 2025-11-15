"use client";

import { postId, TxHash, useSessionClient } from "@lens-protocol/react";
import { useWalletClient } from "wagmi";
import { useRef } from "react";
import { LensQuoteDialog, QuoteDialogRef } from "@/registry/new-york/blocks/feed/lens-quote-dialog";
import { LensPostProvider } from "@/registry/new-york/lib/lens-post-provider";
import { Button } from "@/registry/new-york/ui/button";
import { Repeat2 } from "lucide-react";
import { InstallCommandBlock } from "@/components/install-command-block";
import { CodeBlock } from "@/components/codeblock";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/registry/new-york/ui/tabs";
import { toast } from "sonner";

export default function QuoteDialog() {
  const session = useSessionClient();
  const wallet = useWalletClient();

  const quoteDialog = useRef<QuoteDialogRef>(null);
  const post = postId("3988215955854869405528302997462877091460304706960228350925150132477118244123");

  const handleQuoteCreated = (txHash: TxHash) => {
    toast.success("Qupted successfully!", {
      action: (
        <Button className="ml-auto" onClick={() => window.open("https://explorer.testnet.lens.xyz/tx/" + txHash)}>
          View tx
        </Button>
      ),
    });
  };

  const handleQuoteError = (e: Error) => {
    console.error("Quote creation error:", e);
    toast.error("Unable to quote post");
  };

  return (
    <LensPostProvider postId={post} session={session} wallet={wallet} useTestnet={true}>
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
                onClick={quoteDialog.current?.open}
                disabled={session.loading || wallet.isLoading}
              >
                <Repeat2 className="h-4 h-4" />
              </Button>
              <p className="text-xs text-center text-muted-foreground max-w-xs">
                Quoting{" "}
                <a href="https://t.hey.xyz/posts/1n8vtqy901xcrynmgrb" target="_blank" rel="noopener">
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
import { LensQuoteDialog, QuoteDialogRef } from "@/components/feed/references/lens-quote-dialog";
import { LensPostProvider } from "@/lib/lens-post-provider";
import { Button } from "@/ui/button";
import { Repeat2 } from "lucide-react";
import { toast } from "sonner";

export function QuoteDialogDemo() {
  const session = useSessionClient();
  const wallet = useWalletClient();

  const quoteDialog = useRef<QuoteDialogRef>(null);
  const post = postId("3988215955854869405528302997462877091460304706960228350925150132477118244123");
  
  const handleQuoteCreated = (txHash: TxHash) => {
    toast.success("Qupted successfully!", {
      action: (
        <Button className="ml-auto" onClick={() => window.open("https://explorer.testnet.lens.xyz/tx/" + txHash)}>
          View tx
        </Button>
      ),
    });
  };
  
  const handleQuoteError = (e: Error) => {
    toast.error("Unable to quote post");
  };

  return (
    <LensPostProvider
      postId={post}
      session={session}
      wallet={wallet}
      useTestnet={true}
    >
      <Button
        variant="outline"
        onClick={quoteDialog.current?.open}
        disabled={session.loading || wallet.isLoading}
      >
        <Repeat2 className="h-4 h-4" />
      </Button>
      <LensQuoteDialog ref={quoteDialog} onQuoteCreated={handleQuoteCreated} onError={handleQuoteError} />
    </LensPostProvider>    
  );
};`}
              </CodeBlock>
            </TabsContent>
          </div>
        </Tabs>
      </div>
      <h2 className="mt-6 pb-2 text-3xl font-semibold tracking-tight first:mt-0">Installation</h2>
      <InstallCommandBlock componentName="quote-dialog" />
      <h2 className="mt-6 pb-2 text-3xl font-semibold tracking-tight first:mt-0">Usage</h2>
      <CodeBlock lang="tsx" className="lines">
        {`import { LensQuoteDialog, QuoteDialogRef } from "@/components/lens-quote-dialog";
import { LensPostProvider } from "@/lib/lens-post-provider";
import { postId, useSessionClient } from "@lens-protocol/react";
import { useWalletClient } from "wagmi";`}
      </CodeBlock>
      <CodeBlock lang="tsx" className="lines">
        {`const session = useSessionClient();
const wallet = useWalletClient();

const post = postId("SOME_POST_ID");
const quoteDialog = useRef<QuoteDialogRef>(null);`}
      </CodeBlock>
      <CodeBlock lang="tsx" className="lines">
        {`<LensPostProvider postId={post} session={session} wallet={wallet}>
  <button onClick={quoteDialog.current?.open}>Quote</button>
  <LensQuoteDialog ref={quoteDialog} />
</LensPostProvider>`}
      </CodeBlock>
      <LensQuoteDialog ref={quoteDialog} onQuoteCreated={handleQuoteCreated} onError={handleQuoteError} />
    </LensPostProvider>
  );
}
