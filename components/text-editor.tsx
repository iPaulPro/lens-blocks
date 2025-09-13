"use client";

import { OpenInV0Button } from "@/components/open-in-v0-button";
import CommandBlock from "@/components/command-tabs";
import { CodeBlock } from "@/components/codeblock";
import Editor from "@/registry/new-york/components/common/editor/lens-text-editor";

export default function TextEditor() {
  const commands = [
    {
      label: "npm",
      command: "npx shadcn@latest add @lens-blocks/text-editor.json",
    },
    {
      label: "yarn",
      command: "yarn dlx shadcn@latest add @lens-blocks/text-editor.json",
    },
    {
      label: "pnpm",
      command: "pnpm dlx shadcn@latest add @lens-blocks/text-editor.json",
    },
    {
      label: "bun",
      command: "bunx --bun shadcn@latest add @lens-blocks/text-editor.json",
    },
  ];

  return (
    <>
      <div className="flex flex-col flex-1 gap-8">
        <div className="preview flex flex-col gap-4 relative">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground sm:pl-3">A Lens text editor component</div>
            <OpenInV0Button name="text-editor" className="w-fit" />
          </div>
          <div className="flex items-center justify-center flex-grow relative">
            <Editor className="w-full md:w-1/2 border rounded-lg" />
          </div>
        </div>
        <h2 className="mt-6 pb-2 text-3xl font-semibold tracking-tight first:mt-0">Installation</h2>
        <CommandBlock commands={commands} />
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
