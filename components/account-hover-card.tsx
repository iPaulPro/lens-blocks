"use client";

import { OpenInV0Button } from "@/components/open-in-v0-button";
import { InstallCommandBlock } from "@/components/install-command-block";
import { CodeBlock } from "@/components/codeblock";
import { LensAccountHoverCard } from "@/registry/new-york/blocks/lens-account-hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/registry/new-york/ui/avatar";
import { parseUri } from "@/registry/new-york/lib/lens-utils";
import { UserCircle2 } from "lucide-react";
import { useAccount, useSessionClient } from "@lens-protocol/react";
import { useWalletClient } from "wagmi";
import { Skeleton } from "@/registry/new-york/ui/skeleton";

export default function AccountHoverCard() {
  const session = useSessionClient();
  const wallet = useWalletClient();
  const accountRes = useAccount({
    username: {
      localName: "paulburke",
    },
  });

  const account = accountRes.data;

  return (
    <>
      <div className="flex flex-col flex-1 gap-8">
        <div className="preview flex flex-col gap-4 relative">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground sm:pl-3">A Lens Account chooser component</div>
            <OpenInV0Button name="account-hover-card" className="w-fit" />
          </div>
          <div className="flex items-center justify-center flex-grow relative">
            <LensAccountHoverCard accountRes={accountRes} wallet={wallet} session={session} useTestnet={true}>
              {accountRes.loading ? (
                <Skeleton className="w-10 h-10 rounded-full" />
              ) : (
                account && (
                  <Avatar className="flex-none w-10 h-10">
                    <AvatarImage
                      src={parseUri(account.metadata?.picture)}
                      alt={`${account.username?.value ?? account.address}'s avatar`}
                    />
                    <AvatarFallback>
                      <UserCircle2 className="w-10 h-10 opacity-45" />
                    </AvatarFallback>
                  </Avatar>
                )
              )}
            </LensAccountHoverCard>
          </div>
        </div>
        <h2 className="mt-6 pb-2 text-3xl font-semibold tracking-tight first:mt-0">Installation</h2>
        <InstallCommandBlock componentName="account-hover-card" />
        <h2 className="mt-6 pb-2 text-3xl font-semibold tracking-tight first:mt-0">Usage</h2>
        <CodeBlock lang="tsx" className="lines">
          {`import { LensAccountHoverCard } from "@/components/lens-account-hover-card";
import { useSessionClient } from "@lens-protocol/react";
import { useWalletClient } from "wagmi";`}
        </CodeBlock>
        <CodeBlock lang="tsx" className="lines">
          {`const session = useSessionClient();
const wallet = useWalletClient();
const accountRes = useAccount({
  username: {
    localName: "paulburke",
  },
});`}
        </CodeBlock>
        <CodeBlock lang="tsx" className="lines">
          {`<LensAccountHoverCard accountRes={accountRes} wallet={wallet} session={session}>
  @paulburke
</LensAccountHoverCard>`}
        </CodeBlock>
      </div>
    </>
  );
}
