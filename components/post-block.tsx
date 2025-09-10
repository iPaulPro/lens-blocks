"use client";

import { LensPostProvider } from "@/registry/new-york/lib/lens-post-provider";
import { Account, AnyPost, useSessionClient } from "@lens-protocol/react";
import { OpenInV0Button } from "@/components/open-in-v0-button";
import { Loader } from "lucide-react";
import { LensPost } from "@/registry/new-york/blocks/lens-post";
import { toast } from "sonner";
import { Button } from "@/registry/new-york/ui/button";
import { useWalletClient } from "wagmi";
import { CodeBlock } from "@/components/codeblock";
import CommandBlock from "@/components/command-tabs";

export function PostBlock() {
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

  const commands = [
    {
      label: "npm",
      command: "npx shadcn@latest add @lens-blocks/post.json",
    },
    {
      label: "yarn",
      command: "yarn dlx shadcn@latest add @lens-blocks/post.json",
    },
    {
      label: "pnpm",
      command: "pnpm dlx shadcn@latest add @lens-blocks/post.json",
    },
    {
      label: "bun",
      command: "bunx --bun shadcn@latest add @lens-blocks/post.json",
    },
  ];

  return (
    <div className="flex flex-col flex-1 gap-8">
      <div className="preview flex flex-col gap-4 relative">
        <div className="flex items-center justify-between">
          <h2 className="text-sm text-muted-foreground sm:pl-3">A basic text-only Post</h2>
          <OpenInV0Button name="post" className="w-fit" />
        </div>
        <div className="flex items-center justify-center flex-grow relative">
          {sessionLoading || walletClientLoading ? (
            <Loader className="animate-spin w-4 h-4 text-muted-foreground" />
          ) : (
            <LensPostProvider postId="1n8vtqy901xcrynmgrb" sessionClient={sessionClient} useTestnet={true}>
              <div className="w-full md:w-2/3">
                <LensPost
                  className="border rounded-md"
                  lensClient={sessionClient ?? undefined}
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
            </LensPostProvider>
          )}
        </div>
      </div>
      <h2 className="mt-6 pb-2 text-3xl font-semibold tracking-tight first:mt-0">Installation</h2>
      <CommandBlock commands={commands} />
      <h2 className="mt-6 pb-2 text-3xl font-semibold tracking-tight first:mt-0">Usage</h2>
      <CodeBlock lang="tsx" className="lines">
        {`import { LensPostProvider } from "@/lib/lens-post-context";
import { LensPost } from "@/components/lens-post";
import { useSessionClient } from "@lens-protocol/react";
import { useWalletClient } from "wagmi";`}
      </CodeBlock>
      <CodeBlock lang="tsx" className="lines">
        {`const { data: sessionClient } = useSessionClient();
const { data: walletClient } = useWalletClient();`}
      </CodeBlock>
      <CodeBlock lang="tsx" className="lines">
        {`<LensPostProvider postId="58g7rtbnq9x60fv55w" sessionClient={sessionClient}>
  <LensPost
    lensClient={sessionClient}
    walletClient={walletClient}
  />
</LensPostProvider>`}
      </CodeBlock>
      <h2 className="mt-6 pb-2 text-3xl font-semibold tracking-tight first:mt-0">Examples</h2>
      <h3 className="text-2xl font-semibold tracking-tight">Image Post</h3>
      <div className="flex flex-col gap-4 relative p-0 md:p-4 border-0 md:border rounded-lg">
        <div className="flex items-center justify-center flex-grow relative">
          {sessionLoading || walletClientLoading ? (
            <Loader className="animate-spin w-4 h-4 text-muted-foreground" />
          ) : (
            <LensPostProvider postId="58g7rtbnq9x60fv55w" sessionClient={sessionClient} useTestnet={true}>
              <LensPost
                className="w-full md:w-2/3 border rounded-md"
                lensClient={sessionClient ?? undefined}
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
            </LensPostProvider>
          )}
        </div>
      </div>
      <h3 className="text-2xl font-semibold tracking-tight">Audio Post</h3>
      <div className="flex flex-col gap-4 relative p-0 md:p-4 border-0 md:border rounded-lg">
        <div className="flex items-center justify-center flex-grow relative">
          {sessionLoading || walletClientLoading ? (
            <Loader className="animate-spin w-4 h-4 text-muted-foreground" />
          ) : (
            <LensPostProvider postId="1z32szv5xqnpaqqncah" sessionClient={sessionClient} useTestnet={true}>
              <LensPost
                className="w-full md:w-2/3 border rounded-md"
                lensClient={sessionClient ?? undefined}
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
            </LensPostProvider>
          )}
        </div>
      </div>
      <h3 className="text-2xl font-semibold tracking-tight">Video Post</h3>
      <div className="flex flex-col gap-4 relative p-0 md:p-4 border-0 md:border rounded-lg">
        <div className="flex items-center justify-center flex-grow relative">
          {sessionLoading || walletClientLoading ? (
            <Loader className="animate-spin w-4 h-4 text-muted-foreground" />
          ) : (
            <LensPostProvider postId="39d0736810280pbe9vk" sessionClient={sessionClient} useTestnet={true}>
              <LensPost
                className="w-full md:w-2/3 border rounded-md"
                lensClient={sessionClient ?? undefined}
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
            </LensPostProvider>
          )}
        </div>
      </div>
    </div>
  );
}
