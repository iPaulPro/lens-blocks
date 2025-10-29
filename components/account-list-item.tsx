"use client";

import { Account, evmAddress, useAccount } from "@lens-protocol/react";
import { LensAccountListItem } from "@/registry/new-york/components/account/lens-account-list-item";
import { toast } from "sonner";
import { CodeBlock } from "@/components/codeblock";
import { InstallCommandBlock } from "@/components/install-command-block";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/registry/new-york/ui/tabs";

export default function AccountListItem() {
  const account = useAccount({
    address: evmAddress("0xA77f9f69Da9dafBC1ef31D1fCd79D04dF607e983"),
  });

  const handleAccountSelected = (account: Account) => {
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
        <Tabs defaultValue="preview">
          <div className="preview flex flex-col gap-2 relative">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="preview">Preview</TabsTrigger>
                <TabsTrigger value="code">Code</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="preview" className="flex items-center justify-center flex-grow relative">
              <div className="border rounded-md w-full md:w-1/3">
                <LensAccountListItem account={account} onAccountSelected={handleAccountSelected} showChevron={false} />
              </div>
            </TabsContent>
            <TabsContent value="code" className="p-0">
              <CodeBlock lang="tsx" className="lines border-none">
                {`import { LensAccountListItem } from "@/components/account/lens-account-list-item";

export function AccountListItemDemo() {
  const handleAccountSelected = (account: Account) => {
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
    <LensAccountListItem
      account={account}
      onAccountSelected={handleAccountSelected}
    />    
  );
};`}
              </CodeBlock>
            </TabsContent>
          </div>
        </Tabs>
      </div>
      <h2 className="mt-6 pb-2 text-3xl font-semibold tracking-tight first:mt-0">Installation</h2>
      <InstallCommandBlock componentName="account-list-item" />
      <h2 className="mt-6 pb-2 text-3xl font-semibold tracking-tight first:mt-0">Usage</h2>
      <CodeBlock lang="tsx" className="lines">
        {`import { LensAccountListItem } from "@/components/account/lens-account-list-item";
import { evmAddress, useAccount } from "@lens-protocol/react";

const account = useAccount({
  address: evmAddress("0xA77f9f69Da9dafBC1ef31D1fCd79D04dF607e983"),
});`}
      </CodeBlock>
      <CodeBlock lang="tsx" className="lines">
        {`<LensAccountListItem account={account} />`}
      </CodeBlock>
    </>
  );
}
