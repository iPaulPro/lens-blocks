"use client";

import { postId, useSessionClient } from "@lens-protocol/react";
import { useWalletClient } from "wagmi";
import { CollectDialogRef, LensCollectDialog } from "@/registry/new-york/blocks/feed/lens-collect-dialog";
import { useRef } from "react";
import { LensPostProvider } from "@/registry/new-york/lib/lens-post-provider";
import { InstallCommandBlock } from "@/components/install-command-block";
import { CodeBlock } from "@/components/codeblock";
import { Button } from "@/registry/new-york/ui/button";
import { ShoppingBag } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/registry/new-york/ui/tabs";

export default function CollectDialog() {
  const session = useSessionClient();
  const wallet = useWalletClient();

  const collectDialog = useRef<CollectDialogRef>(null);
  const post = postId("58g7rtbnq9x60fv55w");

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
                onClick={collectDialog.current?.open}
                disabled={session.loading || wallet.isLoading}
              >
                <ShoppingBag className="h-4 h-4" />
              </Button>
              <p className="text-xs text-center text-muted-foreground max-w-xs">
                Collecting{" "}
                <a href={"https://t.hey.xyz/posts/" + post} target="_blank" rel="noopener">
                  this post
                </a>{" "}
                on testnet.
              </p>
            </TabsContent>
            <TabsContent value="code" className="p-0">
              <CodeBlock lang="tsx" className="lines border-none">
                {`import { LensPostProvider } from "@/lib/lens-post-provider";
import { 
  LensCollectDialog,
  CollectDialogRef 
} from "@/components/feed/collects/lens-collect-dialog";
import { Button } from "@/ui/button";
import { ShoppingBag } from "lucide-react";

  const session = useSessionClient();
  const wallet = useWalletClient();
  
  const collectDialog = useRef<CollectDialogRef>(null);
  const post = postId("58g7rtbnq9x60fv55w");

  return (
    <LensPostProvider
     postId={post}
     session={session}
     wallet={wallet}
     useTestnet={true}>
      <Button
        variant="outline"
        onClick={collectDialog.current?.open}
        disabled={session.loading || wallet.isLoading}
      >
        <ShoppingBag className="h-4 h-4" />
      </Button>
      <LensCollectDialog 
        ref={collectDialog} 
        nftUrlPattern="https://testnet.lenscan.io/nfts/{collectNftAddress}" />
    </LensPostProvider>    
  );
};`}
              </CodeBlock>
            </TabsContent>
          </div>
        </Tabs>
      </div>
      <h2 className="mt-6 pb-2 text-3xl font-semibold tracking-tight first:mt-0">Installation</h2>
      <InstallCommandBlock componentName="collect-dialog" />
      <h2 className="mt-6 pb-2 text-3xl font-semibold tracking-tight first:mt-0">Usage</h2>
      <CodeBlock lang="tsx" className="lines">
        {`import { LensCollectDialog, CollectDialogRef } from "@/components/feed/collects/lens-collect-dialog";
import { LensPostProvider } from "@/lib/lens-post-provider";
import { postId, useSessionClient } from "@lens-protocol/react";
import { useWalletClient } from "wagmi";`}
      </CodeBlock>
      <CodeBlock lang="tsx" className="lines">
        {`const session = useSessionClient();
const wallet = useWalletClient();

const post = postId("SOME_POST_ID");
const collectDialog = useRef<CollectDialogRef>(null);`}
      </CodeBlock>
      <CodeBlock lang="tsx" className="lines">
        {`<LensPostProvider postId={post} session={session} wallet={wallet}>
  <button onClick={collectDialog.current?.open}>Collect</button>
  <LensCollectDialog ref={collectDialog} />
</LensPostProvider>`}
      </CodeBlock>
      <LensCollectDialog ref={collectDialog} nftUrlPattern="https://testnet.lenscan.io/nfts/{collectNftAddress}" />
    </LensPostProvider>
  );
}
