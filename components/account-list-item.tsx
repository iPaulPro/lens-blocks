"use client";

import { Account, evmAddress, useAccount } from "@lens-protocol/react";
import { OpenInV0Button } from "@/components/open-in-v0-button";
import { Loader } from "lucide-react";
import { LensAccountListItem } from "@/registry/new-york/components/account/lens-account-list-item";
import { toast } from "sonner";
import { CodeBlock } from "@/components/codeblock";
import { InstallCommandBlock } from "@/components/install-command-block";

export default function AccountListItem() {
  const { data: account, loading: accountLoading } = useAccount({
    address: evmAddress("0xA77f9f69Da9dafBC1ef31D1fCd79D04dF607e983"),
  });

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
    <>
      <div className="flex flex-col flex-1 gap-8">
        <div className="preview flex flex-col gap-4 relative">
          <div className="flex items-center justify-between">
            <h2 className="text-sm text-muted-foreground sm:pl-3">A Lens Account list item component</h2>
            <OpenInV0Button name="account-list-item" className="w-fit" />
          </div>
          <div className="flex items-center justify-center flex-grow relative">
            {accountLoading ? (
              <Loader className="animate-spin w-4 h-4 text-muted-foreground" />
            ) : (
              account && (
                <div className="border rounded-md w-full md:w-1/3">
                  <LensAccountListItem account={account} onAccountSelected={onAccountSelected} showChevron={false} />
                </div>
              )
            )}
          </div>
        </div>
      </div>
      <h2 className="mt-6 pb-2 text-3xl font-semibold tracking-tight first:mt-0">Installation</h2>
      <InstallCommandBlock componentName="account-list-item" />
      <h2 className="mt-6 pb-2 text-3xl font-semibold tracking-tight first:mt-0">Usage</h2>
      <CodeBlock lang="tsx" className="lines">
        {`import { LensAccountListItem } from "@/components/lens-account-list-item";
import { evmAddress, useAccount } from "@lens-protocol/react";

const { data: account } = useAccount({
  address: evmAddress("0xA77f9f69Da9dafBC1ef31D1fCd79D04dF607e983"),
});`}
      </CodeBlock>
      <CodeBlock lang="tsx" className="lines">
        {`<LensAccountListItem account={account} />`}
      </CodeBlock>
    </>
  );
}
