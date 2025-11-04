"use client";

import { AuthenticatedUser, useSessionClient } from "@lens-protocol/react";
import { LensLogin } from "@/registry/new-york/blocks/account/lens-login";
import { CodeBlock } from "@/components/codeblock";
import { toast } from "sonner";
import { useWalletClient } from "wagmi";
import { InstallCommandBlock } from "@/components/install-command-block";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/registry/new-york/ui/tabs";

export function LoginBlock() {
  const session = useSessionClient();
  const wallet = useWalletClient();

  const handleLoginSuccess = (authenticatedUser: AuthenticatedUser) => {
    console.log("Login successful for user:", authenticatedUser);
    toast.success(`Login success!`);
  };

  const handleLoginError = (error: Error) => {
    console.error("Login failed with error:", error);
    toast.error(`Login failed: ${error.message}`);
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
              <LensLogin
                session={session}
                wallet={wallet}
                onSuccess={handleLoginSuccess}
                onError={handleLoginError}
                appAddress={process.env.NEXT_PUBLIC_LENS_APP_ADDRESS}
              />
            </TabsContent>
            <TabsContent value="code" className="p-0">
              <CodeBlock lang="tsx" className="lines border-none">
                {`import { AuthenticatedUser, useSessionClient } from "@lens-protocol/react";
import { LensLogin } from "@/components/lens-login";
import { toast } from "sonner";
import { useWalletClient } from "wagmi";
  
  const session = useSessionClient();
  const wallet = useWalletClient();

  const handleLoginSuccess = (authenticatedUser: AuthenticatedUser) => {
    toast.success("Login success!");
  };

  const handleLoginError = (error: Error) => {
    toast.error("Login failed: " + error.message);
  };
  
  return (
    <LensLogin 
      session={session}
      wallet={wallet}
      onSuccess={handleLoginSuccess}
      onError={handleLoginError}
      appAddress={process.env.NEXT_PUBLIC_LENS_APP_ADDRESS}
    /> 
  );
};`}
              </CodeBlock>
            </TabsContent>
          </div>
        </Tabs>
        <h2 className="mt-6 pb-2 text-3xl font-semibold tracking-tight first:mt-0">Installation</h2>
        <InstallCommandBlock componentName="login" />
        <h2 className="mt-6 pb-2 text-3xl font-semibold tracking-tight first:mt-0">Usage</h2>
        <CodeBlock lang="tsx" className="lines">
          {`import { LensLogin } from "@/components/account/lens-login";
import { useSessionClient } from "@lens-protocol/react";
import { useWalletClient } from "wagmi";`}
        </CodeBlock>
        <CodeBlock lang="tsx" className="lines">
          {`const session = useSessionClient();
const wallet = useWalletClient();`}
        </CodeBlock>
        <CodeBlock lang="tsx" className="lines">
          {`<LensLogin session={session} wallet={wallet} />`}
        </CodeBlock>
      </div>
    </>
  );
}
