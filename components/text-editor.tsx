"use client";

import { CodeBlock } from "@/components/codeblock";
import { InstallCommandBlock } from "@/components/install-command-block";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/registry/new-york/ui/tabs";
import { LensTextEditor } from "@/registry/new-york/components/common/editor/lens-text-editor";

export default function TextEditor() {
  return (
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
            <LensTextEditor className="w-full md:w-1/2 flex border rounded-lg p-4 min-h-40" />
          </TabsContent>
          <TabsContent value="code" className="p-0">
            <CodeBlock lang="tsx" className="lines border-none">
              {`import { LensTextEditor } from "@/components/common/editor/lens-text-editor";
              
export function TextEditorDemo() {
  return (
    <LensTextEditor
      className="w-full md:w-1/2 flex border rounded-lg p-4 min-h-40"
    />
  );
}`}
            </CodeBlock>
          </TabsContent>
        </div>
      </Tabs>
      <h2 className="mt-6 pb-2 text-3xl font-semibold tracking-tight first:mt-0">Installation</h2>
      <InstallCommandBlock componentName="text-editor" />
      <h2 className="mt-6 pb-2 text-3xl font-semibold tracking-tight first:mt-0">Usage</h2>
      <CodeBlock lang="tsx" className="lines">
        {`import { TextEditor } from "@/components/common/editor/lens-text-editor";`}
      </CodeBlock>
      <CodeBlock lang="tsx" className="lines">
        {`<TextEditor />`}
      </CodeBlock>
    </div>
  );
}
