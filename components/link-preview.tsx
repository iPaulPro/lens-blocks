"use client";

import { CodeBlock } from "@/components/codeblock";
import { InstallCommandBlock } from "@/components/install-command-block";
import { LinkPreview } from "@/registry/new-york/components/feed/link-preview";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/registry/new-york/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/registry/new-york/ui/alert";

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
        <p className="content !mt-0">
          The <code className="text-foreground">LinkPreview</code> component is used to display a preview of a link.
          Because of CORS restrictions, the component requires a server to proxy the request. When installing this
          component a <code>/url-meta</code> API route is created.
        </p>
        <Alert className="bg-foreground text-background">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="mt-1">
            <path d="M18.665 21.978C16.758 23.255 14.465 24 12 24 5.377 24 0 18.623 0 12S5.377 0 12 0s12 5.377 12 12c0 3.583-1.574 6.801-4.067 9.001L9.219 7.2H7.2v9.596h1.615V9.251l9.85 12.727Zm-3.332-8.533 1.6 2.061V7.2h-1.6v6.245Z" />
          </svg>
          <AlertTitle className="text-lg">This component requires Next.js</AlertTitle>
          <AlertDescription className="text-background opacity-80">
            This component will install a Next.js API route to proxy the request, using App Router. If you are not using
            Next.js, you will need to create your own API route to proxy the request and edit the source accordingly.
          </AlertDescription>
        </Alert>
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
