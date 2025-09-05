"use client";

import { LensPostProvider } from "@/registry/new-york/lib/lens-post-provider";
import { Account, useSessionClient } from "@lens-protocol/react";
import { OpenInV0Button } from "@/components/open-in-v0-button";
import { LensAccountChooser } from "@/registry/new-york/components/account/lens-account-chooser";
import { toast } from "sonner";
import CommandBlock from "@/components/command-tabs";
import { CodeBlock } from "@/components/codeblock";

export default function AccountChooser() {
  const { data: sessionClient } = useSessionClient();

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
      command: "npx shadcn@latest add @lens-blocks/account-chooser.json",
    },
    {
      label: "yarn",
      command: "yarn dlx shadcn@latest add @lens-blocks/account-chooser.json",
    },
    {
      label: "pnpm",
      command: "pnpm dlx shadcn@latest add @lens-blocks/account-chooser.json",
    },
    {
      label: "bun",
      command: "bunx --bun shadcn@latest add @lens-blocks/account-chooser.json",
    },
  ];

  return (
    <>
      <div className="flex flex-col flex-1 gap-8">
        <div className="preview flex flex-col gap-4 relative">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground sm:pl-3">A Lens Account chooser component</div>
            <OpenInV0Button name="account-chooser" className="w-fit" />
          </div>
          <div className="flex items-center justify-center flex-grow relative">
            <div className="h-48 w-full md:w-1/2">
              <LensPostProvider postId="1n8hs1aqb4k53f8vsvc" sessionClient={sessionClient} useTestnet={true}>
                <LensAccountChooser
                  walletAddress="0xdaA5EBe0d75cD16558baE6145644EDdFcbA1e868"
                  onAccountSelected={onAccountSelected}
                />
              </LensPostProvider>
            </div>
          </div>
        </div>
        <h2 className="mt-6 pb-2 text-3xl font-semibold tracking-tight first:mt-0">Installation</h2>
        <CommandBlock commands={commands} />
        <h2 className="mt-6 pb-2 text-3xl font-semibold tracking-tight first:mt-0">Usage</h2>
        <CodeBlock lang="tsx" className="lines">
          {`import { LensPostProvider } from "@/lib/lens-post-context";
import { LensAccountChooser } from "@/components/lens-account-chooser";
import { useSessionClient } from "@lens-protocol/react";`}
        </CodeBlock>
        <CodeBlock lang="tsx" className="lines">
          {`const { data: sessionClient } = useSessionClient();

<LensPostProvider postId="1n8hs1aqb4k53f8vsvc" sessionClient={sessionClient}>
  <LensAccountChooser walletAddress="0xdaA5EBe0d75cD16558baE6145644EDdFcbA1e868" />
</LensPostProvider>`}
        </CodeBlock>
      </div>
    </>
  );
}
