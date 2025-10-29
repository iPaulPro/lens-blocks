"use client";

import { InstallCommandBlock } from "@/components/install-command-block";
import { CodeBlock } from "@/components/codeblock";
import { LensFollowButton } from "@/registry/new-york/components/account/lens-follow-button";
import { Account, UnauthenticatedError, useAccount, useSessionClient } from "@lens-protocol/react";
import { toast } from "sonner";
import { getDisplayName } from "@/registry/new-york/lib/lens-utils";
import { useWalletClient } from "wagmi";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/registry/new-york/ui/tabs";

export default function FollowButton() {
  const session = useSessionClient();
  const wallet = useWalletClient();
  const account = useAccount({
    username: {
      localName: "paulburke",
    },
  });

  const onFollowSuccess = (account: Account) => {
    console.log("Follow successful for account:", account);
    toast.success(`Followed ${getDisplayName(account)}!`);
  };

  const onUnfollowSuccess = (account: Account) => {
    console.log("Unfollow successful for account:", account);
    toast.success(`Unfollowed ${getDisplayName(account)}`);
  };

  const onFollowError = (_account: Account, error: Error) => {
    console.error("Follow/Unfollow failed with error:", error);
    if (error instanceof UnauthenticatedError) {
      toast.error(`Please log in first`);
    } else {
      toast.error(`Operation failed: ${error.message}`);
    }
  };

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
            <TabsContent value="preview" className="flex items-center justify-center flex-grow relative">
              <div className="flex flex-col gap-4 items-center justify-center">
                <LensFollowButton
                  account={account}
                  session={session}
                  wallet={wallet}
                  onFollowSuccess={onFollowSuccess}
                  onUnfollowSuccess={onUnfollowSuccess}
                  onFollowError={onFollowError}
                />
                {account.data && (
                  <p className="text-xs text-center text-muted-foreground">
                    This will follow or unfollow the account <strong>{getDisplayName(account.data)}</strong> on testnet
                  </p>
                )}
              </div>
            </TabsContent>
            <TabsContent value="code" className="p-0">
              <CodeBlock lang="tsx" className="lines border-none">
                {`import { LensFollowButton } from "@/components/account/lens-follow-button";
import { Account, UnauthenticatedError, useAccount, useSessionClient } from "@lens-protocol/react";
import { toast } from "sonner";
import { getDisplayName } from "@/lib/lens-utils";
import { useWalletClient } from "wagmi";

export function FollowButtonDemo() {
  const session = useSessionClient();
  const wallet = useWalletClient();
  const account = useAccount({
    username: {
      localName: "paulburke",
    },
  });

  const onFollowSuccess = (account: Account) => {
    toast.success("Followed " + getDisplayName(account));
  };

  const onUnfollowSuccess = (account: Account) => {
    toast.success("Unfollowed " + getDisplayName(account));
  };

  const onFollowError = (_account: Account, error: Error) => {
    if (error instanceof UnauthenticatedError) {
      toast.error("Please log in first");
    } else {
      toast.error("Operation failed: " + error.message);
    }
  };
  
  return (
    <LensFollowButton
      account={account}
      session={session}
      wallet={wallet}
      onFollowSuccess={onFollowSuccess}
      onUnfollowSuccess={onUnfollowSuccess}
      onFollowError={onFollowError}
    />   
  );
};`}
              </CodeBlock>
            </TabsContent>
          </div>
        </Tabs>
        <h2 className="mt-6 pb-2 text-3xl font-semibold tracking-tight first:mt-0">Installation</h2>
        <InstallCommandBlock componentName="follow-button" />
        <h2 className="mt-6 pb-2 text-3xl font-semibold tracking-tight first:mt-0">Usage</h2>
        <CodeBlock lang="tsx" className="lines">
          {`import { LensFollowButton } from "@/components/account/lens-follow-button";
import { useAccount, useSessionClient } from "@lens-protocol/react";
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
          {`<LensFollowButton account={account} session={session} wallet={wallet} />`}
        </CodeBlock>
      </div>
    </>
  );
}
