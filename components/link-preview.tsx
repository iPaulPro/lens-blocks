"use client";

import { OpenInV0Button } from "@/components/open-in-v0-button";
import { CodeBlock } from "@/components/codeblock";
import { InstallCommandBlock } from "@/components/install-command-block";
import { LinkPreview } from "@/registry/new-york/components/feed/link-preview";

export default function LinkPreviewPage() {
  return (
    <>
      <div className="flex flex-col flex-1 gap-8">
        <div className="preview flex flex-col gap-4 relative">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground sm:pl-3"> A link preview embed</div>
            <OpenInV0Button name="link-preview" className="w-fit" />
          </div>
          <div className="flex items-center justify-center flex-grow relative">
            <div className="w-full md:w-1/2">
              <LinkPreview url="https://lens.xyz" />
            </div>
          </div>
        </div>
        <h2 className="mt-6 pb-2 text-3xl font-semibold tracking-tight first:mt-0">Installation</h2>
        <InstallCommandBlock componentName="link-preview" />
        <h2 className="mt-6 pb-2 text-3xl font-semibold tracking-tight first:mt-0">Usage</h2>
        <CodeBlock lang="tsx" className="lines">
          {`import { LensLinkPreview } from "@/components/link-preview";`}
        </CodeBlock>
        <CodeBlock lang="tsx" className="lines">
          {`<LinkPreview url="https://lens.xyz" />`}
        </CodeBlock>
      </div>
    </>
  );
}
