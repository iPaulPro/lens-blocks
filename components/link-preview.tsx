"use client";

import { CodeBlock } from "@/components/codeblock";
import { InstallCommandBlock } from "@/components/install-command-block";
import { LinkPreview } from "@/registry/new-york/components/feed/link-preview";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/registry/new-york/ui/tabs";

export default function LinkPreviewPage() {
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
              <div className="w-full md:w-1/2">
                <LinkPreview url="https://lens.xyz" />
              </div>
            </TabsContent>
            <TabsContent value="code" className="p-0">
              <CodeBlock lang="tsx" className="lines border-none">
                {`import { LinkPreview } from "@/registry/new-york/components/feed/link-preview";

export function LinkPreviewDemo() {
  return <LinkPreview url="https://lens.xyz" />;
};`}
              </CodeBlock>
            </TabsContent>
          </div>
        </Tabs>
        <h2 className="mt-6 pb-2 text-3xl font-semibold tracking-tight first:mt-0">Installation</h2>
        <InstallCommandBlock componentName="link-preview" />
        <h2 className="mt-6 pb-2 text-3xl font-semibold tracking-tight first:mt-0">Usage</h2>
        <CodeBlock lang="tsx" className="lines">
          {`import { LensLinkPreview } from "@/components/feed/link-preview";`}
        </CodeBlock>
        <CodeBlock lang="tsx" className="lines">
          {`<LinkPreview url="https://lens.xyz" />`}
        </CodeBlock>
      </div>
    </>
  );
}
