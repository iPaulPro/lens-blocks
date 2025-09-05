"use client";

import { AuthenticatedUser, useSessionClient } from "@lens-protocol/react";
import { OpenInV0Button } from "@/components/open-in-v0-button";
import { Loader } from "lucide-react";
import { LensLogin } from "@/registry/new-york/blocks/lens-login";
import CommandBlock from "@/components/command-tabs";
import { CodeBlock } from "@/components/codeblock";
import { toast } from "sonner";
import { useWalletClient } from "wagmi";

export function LoginBlock() {
  const { data: sessionClient, loading: sessionLoading } = useSessionClient();
  const { data: walletClient, isLoading: walletClientLoading } = useWalletClient();

  const commands = [
    {
      label: "npm",
      command: "npx shadcn@latest add @lens-blocks/login.json",
    },
    {
      label: "yarn",
      command: "yarn dlx shadcn@latest add @lens-blocks/login.json",
    },
    {
      label: "pnpm",
      command: "pnpm dlx shadcn@latest add @lens-blocks/login.json",
    },
    {
      label: "bun",
      command: "bunx --bun shadcn@latest add @lens-blocks/login.json",
    },
  ];

  // Callback function that is called when the user successfully logs in
  const onLoginSuccess = (authenticatedUser: AuthenticatedUser) => {
    console.log("Login successful for user:", authenticatedUser);
    toast.success(`Login success!`);
  };

  // You can handle errors here if needed
  const onLoginError = (error: Error) => {
    console.error("Login failed with error:", error);
    toast.error(`Login failed: ${error.message}`);
  };

  return (
    <>
      <div className="flex flex-col flex-1 gap-8">
        <div className="preview flex flex-col gap-4 relative">
          <div className="flex items-center justify-between">
            <h2 className="text-sm text-muted-foreground sm:pl-3">A Lens login button component</h2>
            <OpenInV0Button name="login" className="w-fit" />
          </div>
          <div className="flex items-center justify-center flex-grow relative">
            {(walletClientLoading && walletClient) || (sessionLoading && !sessionClient) ? (
              <Loader className="animate-spin w-4 h-4 text-muted-foreground" />
            ) : (
              <LensLogin
                lensClient={sessionClient}
                walletClient={walletClient}
                onSuccess={onLoginSuccess}
                onError={onLoginError}
              />
            )}
          </div>
        </div>
        <h2 className="mt-6 pb-2 text-3xl font-semibold tracking-tight first:mt-0">Installation</h2>
        <CommandBlock commands={commands} />
        <h2 className="mt-6 pb-2 text-3xl font-semibold tracking-tight first:mt-0">Usage</h2>
        <CodeBlock lang="tsx" className="lines">
          {`import { LensLogin } from "@/components/lens-login";
import { useSessionClient } from "@lens-protocol/react";
import { useWalletClient } from "wagmi";`}
        </CodeBlock>
        <CodeBlock lang="tsx" className="lines">
          {`const { data: sessionClient } = useSessionClient();
const { data: walletClient } = useWalletClient();`}
        </CodeBlock>
        <CodeBlock lang="tsx" className="lines">
          {`<LensLogin lensClient={sessionClient} walletClient={walletClient} />`}
        </CodeBlock>
      </div>
    </>
  );
}
