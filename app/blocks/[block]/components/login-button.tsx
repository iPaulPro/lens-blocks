"use client";

import { useSessionClient } from "@lens-protocol/react";
import { OpenInV0Button } from "@/components/open-in-v0-button";
import { Loader } from "lucide-react";
import { LensLoginBlock } from "@/registry/new-york/blocks/account/lens-login-block";
import CommandBlock from "@/components/command-tabs";
import { CodeBlock } from "@/components/codeblock";

export function LoginButton() {
  const { loading: sessionLoading } = useSessionClient();

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
        <div className="flex flex-col gap-4 border rounded-lg p-4 flex-grow min-h-[450px] relative">
          <div className="flex items-center justify-between">
            <h2 className="text-sm text-muted-foreground sm:pl-3">A Lens login button component</h2>
            <OpenInV0Button name="hello-world" className="w-fit" />
          </div>
          <div className="flex items-center justify-center min-h-[400px] relative">
            {sessionLoading ? <Loader className="animate-spin w-4 h-4 text-muted-foreground" /> : <LensLoginBlock />}
          </div>
        </div>
        <h2 className="mt-6 pb-2 text-3xl font-semibold tracking-tight first:mt-0">Installation</h2>
        <CommandBlock commands={commands} />
        <h2 className="mt-6 pb-2 text-3xl font-semibold tracking-tight first:mt-0">Usage</h2>
        <CodeBlock lang="tsx" className="lines">
          {`import { LensLoginBlock } from "@/registry/new-york/blocks/account/lens-login-block";`}
        </CodeBlock>
        <CodeBlock lang="tsx" className="lines">
          {`<LensLoginBlock />`}
        </CodeBlock>
      </div>
    </>
  );
}
