"use client";

import { Account } from "@lens-protocol/react";
import { LensAccountChooser } from "@/registry/new-york/blocks/account/lens-account-chooser";
import { toast } from "sonner";
import { CodeBlock } from "@/components/codeblock";
import { InstallCommandBlock } from "@/components/install-command-block";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/registry/new-york/ui/tabs";

export default function AccountChooser() {
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
              <div className="h-48 w-full md:w-1/2">
                <LensAccountChooser
                  walletAddress="0xdaA5EBe0d75cD16558baE6145644EDdFcbA1e868"
                  onAccountSelected={handleAccountSelected}
                />
              </div>
            </TabsContent>
            <TabsContent value="code" className="p-0">
              <CodeBlock lang="tsx" className="lines border-none">
                {`import { LensAccountChooser } from "@/components/account/lens-account-chooser";
import { Account } from "@lens-protocol/react";
import { toast } from "sonner";

export function AccountChooserDemo() {
  const handleAccountSelected = (account: Account) => {
    // You can handle the selected account here, e.g., update state or perform an action
    const handle = account.username?.localName;
    if (handle) {
      toast.success("Account clicked: @" + handle);
    } else {
      toast.success("Account clicked: " + account.address);
    }
  };
  
  return (
    <LensAccountChooser
      walletAddress="0xdaA5EBe0d75cD16558baE6145644EDdFcbA1e868"
      onAccountSelected={handleAccountSelected}
    />    
  );
};`}
              </CodeBlock>
            </TabsContent>
          </div>
        </Tabs>
        <h2 className="mt-6 pb-2 text-3xl font-semibold tracking-tight first:mt-0">Installation</h2>
        <InstallCommandBlock componentName="account-chooser" />
        <h2 className="mt-6 pb-2 text-3xl font-semibold tracking-tight first:mt-0">Usage</h2>
        <CodeBlock lang="tsx" className="lines">
          {`import { LensAccountChooser } from "@/components/account/lens-account-chooser";`}
        </CodeBlock>
        <CodeBlock lang="tsx" className="lines">
          {`<LensAccountChooser walletAddress="0xdaA5EBe0d75cD16558baE6145644EDdFcbA1e868" />`}
        </CodeBlock>
      </div>
    </>
  );
}
