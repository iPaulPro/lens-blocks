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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/registry/new-york/ui/tabs";

export default function AccountHoverCard() {
  const session = useSessionClient();
  const wallet = useWalletClient();
  const account = useAccount({
    username: {
      localName: "paulburke",
    },
  });

  if ((!account.data && !account.loading) || account.error) {
    return null;
  }

  return (
    <>
      <div className="flex flex-col flex-1 gap-8">
        <Tabs defaultValue="preview">
          <div className="preview flex flex-col gap-4 relative">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="preview">Preview</TabsTrigger>
                <TabsTrigger value="code">Code</TabsTrigger>
              </TabsList>
              <OpenInV0Button name="account-hover-card" className="w-fit" />
            </div>
            <TabsContent value="preview" className="flex items-center justify-center flex-grow relative">
              <LensAccountHoverCard account={account} wallet={wallet} session={session} useTestnet={true}>
                {account.loading ? (
                  <Skeleton className="w-10 h-10 rounded-full" />
                ) : (
                  account && (
                    <Avatar className="flex-none w-10 h-10">
                      <AvatarImage
                        src={parseUri(account.data?.metadata?.picture)}
                        alt={`${account.data?.username?.value ?? account.data?.address}'s avatar`}
                      />
                      <AvatarFallback>
                        <UserCircle2 className="w-10 h-10 opacity-45" />
                      </AvatarFallback>
                    </Avatar>
                  )
                )}
              </LensAccountHoverCard>
            </TabsContent>
            <TabsContent value="code" className="p-0">
              <CodeBlock lang="tsx" className="lines border-none">
                {`import { LensAccountHoverCard } from "@/blocks/lens-account-hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/ui/avatar";
import { parseUri } from "@/lib/lens-utils";
import { Skeleton } from "@/ui/skeleton";
import { UserCircle2 } from "lucide-react";
import { useAccount, useSessionClient } from "@lens-protocol/react";
import { useWalletClient } from "wagmi";

export function AccountHoverCardDemo() {
  const session = useSessionClient();
  const wallet = useWalletClient();
  const account = useAccount({
    username: {
      localName: "paulburke",
    },
  });

  return (
    <LensAccountHoverCard 
      account={account}
      wallet={wallet}
      session={session}>
      {account.loading ? (
        <Skeleton className="w-10 h-10 rounded-full" />
      ) : (
        account && (
          <Avatar className="flex-none w-10 h-10">
            <AvatarImage src={parseUri(account.data.metadata?.picture)} />
            <AvatarFallback>
              <UserCircle2 className="w-10 h-10 opacity-45" />
            </AvatarFallback>
          </Avatar>
        )
      )}
    </LensAccountHoverCard>
  );
};`}
              </CodeBlock>
            </TabsContent>
          </div>
        </Tabs>
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
const account = useAccount({
  username: {
    localName: "paulburke",
  },
});`}
        </CodeBlock>
        <CodeBlock lang="tsx" className="lines">
          {`<LensAccountHoverCard account={account} wallet={wallet} session={session}>
  @paulburke
</LensAccountHoverCard>`}
        </CodeBlock>
      </div>
    </>
  );
}
