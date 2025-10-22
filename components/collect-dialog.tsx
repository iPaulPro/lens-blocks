"use client";

import { postId, useSessionClient } from "@lens-protocol/react";
import { useWalletClient } from "wagmi";
import LensCollectDialog, { CollectDialogRef } from "@/registry/new-york/components/feed/collects/lens-collect-dialog";
import { useRef } from "react";
import { LensPostProvider } from "@/registry/new-york/lib/lens-post-provider";
import { OpenInV0Button } from "@/components/open-in-v0-button";
import { InstallCommandBlock } from "@/components/install-command-block";
import { CodeBlock } from "@/components/codeblock";
import { Button } from "@/registry/new-york/ui/button";
import { ShoppingBag } from "lucide-react";

export default function CollectDialog() {
  const { data: sessionClient, loading: sessionLoading } = useSessionClient();
  const { data: walletClient, isLoading: walletClientLoading } = useWalletClient();

  const collectDialog = useRef<CollectDialogRef>(null);
  const post = postId("3988215955854869405528302997462877091460304706960228350925150132477118244123");

  return (
    <LensPostProvider postId={post} sessionClient={sessionClient} walletClient={walletClient} useTestnet={true}>
      <div className="flex flex-col flex-1 gap-8">
        <div className="preview flex flex-col gap-4 relative">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground sm:pl-3">A dialog component for collecting Posts</div>
            <OpenInV0Button name="collect-dialog" className="w-fit" />
          </div>
          <div className="flex flex-col gap-6 items-center justify-center flex-grow relative">
            <Button
              variant="outline"
              onClick={collectDialog.current?.open}
              disabled={sessionLoading || walletClientLoading}
            >
              <ShoppingBag className="h-4 h-4" />
            </Button>
            <p className="text-xs text-center text-muted-foreground max-w-xs">
              Collecting{" "}
              <a href="https://testnet.hey.xyz/posts/1n8vtqy901xcrynmgrb" target="_blank" rel="noopener">
                this post
              </a>{" "}
              on testnet.
            </p>
          </div>
        </div>
      </div>
      <h2 className="mt-6 pb-2 text-3xl font-semibold tracking-tight first:mt-0">Installation</h2>
      <InstallCommandBlock componentName="collect-dialog" />
      <h2 className="mt-6 pb-2 text-3xl font-semibold tracking-tight first:mt-0">Usage</h2>
      <CodeBlock lang="tsx" className="lines">
        {`import LensCollectDialog, { CollectDialogRef } from "@/components/lens-collect-dialog";
import { LensPostProvider } from "@/lib/lens-post-provider";
import { postId, useSessionClient } from "@lens-protocol/react";
import { useWalletClient } from "wagmi";`}
      </CodeBlock>
      <CodeBlock lang="tsx" className="lines">
        {`const { data: sessionClient } = useSessionClient();
const { data: walletClient } = useWalletClient();

const post = postId("SOME_POST_ID");
const collectDialog = useRef<CollectDialogRef>(null);`}
      </CodeBlock>
      <CodeBlock lang="tsx" className="lines">
        {`<LensPostProvider postId={post} sessionClient={sessionClient} walletClient={walletClient}>
  <button onClick={collectDialog.current?.open}>Collect</button>
  <LensCollectDialog ref={collectDialog} />
</LensPostProvider>`}
      </CodeBlock>
      <LensCollectDialog ref={collectDialog} nftUrlPattern="https://testnet.lenscan.io/nfts/{collectNftAddress}" />
    </LensPostProvider>
  );
}
