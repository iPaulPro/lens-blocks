"use client";

import { OpenInV0Button } from "@/components/open-in-v0-button";
import { CodeBlock } from "@/components/codeblock";
import { LensAccountListItemSkeleton } from "@/registry/new-york/components/common/lens-account-list-item-skeleton";
import { InstallCommandBlock } from "@/components/install-command-block";

export default function AccountListItemSkeleton() {
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
      <InstallCommandBlock componentName="account-list-item-skeleton" />
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
