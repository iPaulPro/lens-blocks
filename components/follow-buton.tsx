"use client";

import { OpenInV0Button } from "@/components/open-in-v0-button";
import { InstallCommandBlock } from "@/components/install-command-block";
import { CodeBlock } from "@/components/codeblock";
import { LensFollowButton } from "@/registry/new-york/components/account/lens-follow-button";
import { Account, UnauthenticatedError, useAccount, useSessionClient } from "@lens-protocol/react";
import { toast } from "sonner";
import { getDisplayName } from "@/registry/new-york/lib/lens-utils";
import { useWalletClient } from "wagmi";

export default function FollowButton() {
  const session = useSessionClient();
  const wallet = useWalletClient();
  const accountRes = useAccount({
    username: {
      localName: "paulburke",
    },
  });

  const account = accountRes.data;

  // Callback function that is called when the follow operation is successful
  const onFollowSuccess = (account: Account) => {
    console.log("Follow successful for account:", account);
    toast.success(`Followed ${getDisplayName(account)}!`);
  };

  // Callback function that is called when the unfollow operation is successful
  const onUnfollowSuccess = (account: Account) => {
    console.log("Unfollow successful for account:", account);
    toast.success(`Unfollowed ${getDisplayName(account)}`);
  };

  // You can handle errors here if needed
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
        <div className="preview flex flex-col gap-4 relative">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground sm:pl-3">A basic follow button</div>
            <OpenInV0Button name="follow-button" className="w-fit" />
          </div>
          <div className="flex items-center justify-center flex-grow relative">
            <div className="flex flex-col gap-4 items-center justify-center">
              <LensFollowButton
                accountRes={accountRes}
                session={session}
                wallet={wallet}
                onFollowSuccess={onFollowSuccess}
                onUnfollowSuccess={onUnfollowSuccess}
                onFollowError={onFollowError}
              />
              {account && (
                <p className="text-xs text-center text-muted-foreground">
                  This will follow or unfollow the account <strong>{getDisplayName(account)}</strong> on testnet
                </p>
              )}
            </div>
          </div>
        </div>
        <h2 className="mt-6 pb-2 text-3xl font-semibold tracking-tight first:mt-0">Installation</h2>
        <InstallCommandBlock componentName="follow-button" />
        <h2 className="mt-6 pb-2 text-3xl font-semibold tracking-tight first:mt-0">Usage</h2>
        <CodeBlock lang="tsx" className="lines">
          {`import { LensFollowButton } from "@/components/follow-button";
import { useAccount, useSessionClient } from "@lens-protocol/react";`}
        </CodeBlock>
        <CodeBlock lang="tsx" className="lines">
          {`const session = useSessionClient();
const { data: account } = useAccount({
  username: {
    localName: "paulburke",
  },
});`}
        </CodeBlock>
        <CodeBlock lang="tsx" className="lines">
          {`<LensFollowButton account={account} session={session} />`}
        </CodeBlock>
      </div>
    </>
  );
}
