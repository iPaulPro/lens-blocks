"use client";

import { OpenInV0Button } from "@/components/open-in-v0-button";
import CommandBlock from "@/components/command-tabs";
import { CodeBlock } from "@/components/codeblock";
import { LensAccountListItemSkeleton } from "@/registry/new-york/components/common/lens-account-list-item-skeleton";

export default function AccountListItemSkeleton() {
  const commands = [
    {
      label: "npm",
      command: "npx shadcn@latest add https://lensblocks.com/r/account-list-item.json",
    },
    {
      label: "yarn",
      command: "yarn dlx shadcn@latest add https://lensblocks.com/r/account-list-item.json",
    },
    {
      label: "pnpm",
      command: "pnpm dlx shadcn@latest add https://lensblocks.com/r/account-list-item.json",
    },
    {
      label: "bun",
      command: "bunx --bun shadcn@latest add https://lensblocks.com/r/account-list-item.json",
    },
  ];

  return (
    <>
      <div className="flex flex-col flex-1 gap-8">
        <div className="preview flex flex-col gap-4 relative">
          <div className="flex items-center justify-between">
            <h2 className="text-sm text-muted-foreground sm:pl-3">A Lens Account list item skeleton component</h2>
            <OpenInV0Button name="account-list-item-skeleton" className="w-fit" />
          </div>
          <div className="flex items-center justify-center flex-grow relative">
            <div className="border rounded-md w-3/4 md:w-5/12">
              <LensAccountListItemSkeleton />
            </div>
          </div>
        </div>
      </div>
      <h2 className="mt-6 pb-2 text-3xl font-semibold tracking-tight first:mt-0">Installation</h2>
      <CommandBlock commands={commands} />
      <h2 className="mt-6 pb-2 text-3xl font-semibold tracking-tight first:mt-0">Usage</h2>
      <CodeBlock lang="tsx" className="lines">
        {`import { LensAccountListItemSkeleton } from "@/components/lens-account-list-item-skeleton";`}
      </CodeBlock>
      <CodeBlock lang="tsx" className="lines">
        {`<LensAccountListItemSkeleton />`}
      </CodeBlock>
    </>
  );
}
