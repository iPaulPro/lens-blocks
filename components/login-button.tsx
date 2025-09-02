"use client";

import { OpenInV0Button } from "@/components/open-in-v0-button";
import CommandBlock from "@/components/command-tabs";
import { CodeBlock } from "@/components/codeblock";
import { LensLoginButton } from "@/registry/new-york/blocks/account/components/lens-login-button";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/registry/new-york/ui/alert";
import { Blocks } from "lucide-react";
import { Button } from "@/registry/new-york/ui/button";
import Link from "next/link";

export default function LoginButton() {
  const commands = [
    {
      label: "npm",
      command: "npx shadcn@latest add https://lensblocks.com/r/login-button.json",
    },
    {
      label: "yarn",
      command: "yarn dlx shadcn@latest add https://lensblocks.com/r/login-button.json",
    },
    {
      label: "pnpm",
      command: "pnpm dlx shadcn@latest add https://lensblocks.com/r/login-button.json",
    },
    {
      label: "bun",
      command: "bunx --bun shadcn@latest add https://lensblocks.com/r/login-button.json",
    },
  ];

  return (
    <>
      <div className="flex flex-col flex-1 gap-8">
        <div className="preview flex flex-col gap-4 relative">
          <div className="flex items-center justify-between">
            <h2 className="text-sm text-muted-foreground sm:pl-3">A Lens Account list item skeleton component</h2>
            <OpenInV0Button name="login-button" className="w-fit" />
          </div>
          <div className="flex items-center justify-center flex-grow relative">
            <LensLoginButton onClick={() => toast.success("Login button clicked")} />
          </div>
        </div>
      </div>
      <Alert className="bg-foreground text-background">
        <Blocks className="!size-5" />
        <AlertTitle className="text-lg">Looking for a full login flow?</AlertTitle>
        <AlertDescription className="text-background opacity-80">
          This is just a button component. If you want a complete login flow with wallet connection and account
          selection, use the Login Block.
        </AlertDescription>
        <div className="col-start-2 grid flex justify-items-end">
          <Button className="w-fit mt-4" variant="secondary" asChild>
            <Link href="/blocks/login">Login Block</Link>
          </Button>
        </div>
      </Alert>
      <h2 className="mt-6 pb-2 text-3xl font-semibold tracking-tight first:mt-0">Installation</h2>
      <CommandBlock commands={commands} />
      <h2 className="mt-6 pb-2 text-3xl font-semibold tracking-tight first:mt-0">Usage</h2>
      <CodeBlock lang="tsx" className="lines">
        {`import { LensLoginButton } from "@/registry/new-york/blocks/account/components/lens-login-button";`}
      </CodeBlock>
      <CodeBlock lang="tsx" className="lines">
        {`<LensLoginButton />`}
      </CodeBlock>
    </>
  );
}
