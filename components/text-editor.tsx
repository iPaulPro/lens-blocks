"use client";

import { OpenInV0Button } from "@/components/open-in-v0-button";
import { CodeBlock } from "@/components/codeblock";
import { LensTextEditor } from "@/registry/new-york/components/common/editor/lens-text-editor";
import { InstallCommandBlock } from "@/components/install-command-block";

export default function TextEditor() {
  return (
    <>
      <div className="flex flex-col flex-1 gap-8">
        <div className="preview flex flex-col gap-4 relative">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground sm:pl-3">A Lens text editor component</div>
            <OpenInV0Button name="text-editor" className="w-fit" />
          </div>
          <div className="flex items-center justify-center flex-grow relative">
            <LensTextEditor className="w-full md:w-1/2 flex border rounded-lg p-4 min-h-40" />
          </div>
        </div>
        <h2 className="mt-6 pb-2 text-3xl font-semibold tracking-tight first:mt-0">Installation</h2>
        <InstallCommandBlock componentName="text-editor" />
        <h2 className="mt-6 pb-2 text-3xl font-semibold tracking-tight first:mt-0">Usage</h2>
        <CodeBlock lang="tsx" className="lines">
          {`import { TextEditor } from "@/components/lens-text-editor";`}
        </CodeBlock>
        <CodeBlock lang="tsx" className="lines">
          {`<TextEditor />`}
        </CodeBlock>
      </div>
    </>
  );
}
