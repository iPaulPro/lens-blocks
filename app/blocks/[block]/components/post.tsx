"use client";

import config from "@/lib/lens/config";
import { LensPostProvider } from "@/registry/new-york/common/lib/lens-post-context";
import { Account, AnyPost, useSessionClient } from "@lens-protocol/react";
import { OpenInV0Button } from "@/components/open-in-v0-button";
import { Loader } from "lucide-react";
import { LensPost } from "@/registry/new-york/blocks/feed/components/lens-post";
import { toast } from "sonner";
import { Button } from "@/registry/new-york/ui/button";
import { useWalletClient } from "wagmi";
import { CodeBlock } from "@/components/codeblock";

export function Post() {
  const { data: sessionClient, loading: sessionLoading } = useSessionClient();
  const { data: walletClient, isLoading: walletClientLoading } = useWalletClient();

  const onPostClick = (post: AnyPost) => {
    console.log("Post clicked:", post);
    toast.success("Post clicked: " + post.slug, { duration: 10000 });
  };

  const onAccountSelected = (account: Account) => {
    console.log("Selected account:", account);
    // You can handle the selected account here, e.g., update state or perform an action
    const handle = account.username?.localName;
    if (handle) {
      toast.success("Account clicked: @" + handle);
    } else {
      toast.success("Account clicked: " + account.address);
    }
  };

  return (
    <LensPostProvider postId="1n8hs1aqb4k53f8vsvc" sessionClient={sessionClient} config={config}>
      <div className="flex flex-col flex-1 gap-8">
        <div className="flex flex-col gap-4 border rounded-lg p-4 min-h-[450px] relative">
          <div className="flex items-center justify-between">
            <h2 className="text-sm text-muted-foreground sm:pl-3">A basic text-only Post</h2>
            <OpenInV0Button name="hello-world" className="w-fit" />
          </div>
          <div className="flex items-center justify-center flex-grow min-h-[400px] relative">
            {sessionLoading || walletClientLoading ? (
              <Loader className="animate-spin w-4 h-4 text-muted-foreground" />
            ) : (
              sessionClient &&
              walletClient && (
                <div className="w-full md:w-2/3">
                  <LensPost
                    className="border rounded-md"
                    lensClient={sessionClient}
                    walletClient={walletClient}
                    onPostClick={onPostClick}
                    onAccountClick={onAccountSelected}
                    onRepostSuccess={txHash =>
                      toast.success("Reposted successfully!", {
                        action: (
                          <Button onClick={() => window.open("https://explorer.lens.xyz/tx/" + txHash)}>View tx</Button>
                        ),
                      })
                    }
                  />
                </div>
              )
            )}
          </div>
        </div>
        <h2 className="mt-6 pb-2 text-3xl font-semibold tracking-tight first:mt-0">Usage</h2>
        <CodeBlock lang="tsx" className="lines">
          {`import { LensPostProvider } from "@/registry/new-york/common/lib/lens-post-context";
import { LensPost } from "@/registry/new-york/blocks/feed/components/lens-post";
import { LensConfig } from "@/registry/new-york/common/lib/lens-config";
import { testnet } from "@lens-protocol/react";
import { chains } from "@lens-chain/sdk/viem";

const config: LensConfig = {
  isTestnet: true,
  environment: testnet,
  chain: chains.testnet,
};

const { data: sessionClient } = useSessionClient();
const { data: walletClient } = useWalletClient();`}
        </CodeBlock>
        <CodeBlock lang="tsx" className="lines">
          {`<LensPostProvider postId="1n8hs1aqb4k53f8vsvc" sessionClient={sessionClient} config={config}>
  <LensPost
    lensClient={sessionClient}
    walletClient={walletClient}
  />
</LensPostProvider>`}
        </CodeBlock>
      </div>
    </LensPostProvider>
  );
}
