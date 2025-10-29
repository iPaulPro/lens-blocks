"use client";

import { InstallCommandBlock } from "@/components/install-command-block";
import { CodeBlock } from "@/components/codeblock";
import { LensMarkdown } from "@/registry/new-york/components/common/lens-markdown";
import { AccountMention, GroupMention } from "@lens-protocol/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/registry/new-york/ui/tabs";

export default function Markdown() {
  const content = `Hello @lens/john, check out #0x1234567890abcdef1234567890abcdef12345678 *and* $GHO! Visit https://lens.xyz/docs/chain/using-lens-chain/ for **more** info.`;
  const mentions: (AccountMention | GroupMention)[] = [
    {
      __typename: "AccountMention",
      replace: { __typename: "MentionReplace", from: "@lens/john", to: "@lens/john" },
      namespace: "0x1234567890abcdef1234567890abcdef12345678",
      account: "0x1234567890abcdef1234567890abcdef12345678",
    },
    {
      __typename: "GroupMention",
      group: "0x1234567890abcdef1234567890abcdef12345678",
      replace: { __typename: "MentionReplace", from: "#0x1234567890abcdef1234567890abcdef12345678", to: "#Web3" },
    },
  ];

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
              <div className="min-h-24 w-full md:w-2/3 border rounded-lg p-8">
                <LensMarkdown content={content} mentions={mentions} />
              </div>
            </TabsContent>
            <TabsContent value="code" className="p-0">
              <CodeBlock lang="tsx" className="lines border-none">
                {`import { LensMarkdown } from "@/components/common/lens-markdown";
import { AccountMention, GroupMention } from "@lens-protocol/react";

export function LensMarkdownDemo() {
  const content = "Hello @lens/john, check out #0x1234567890abcdef1234567890abcdef12345678 *and* $GHO! Visit https://lens.xyz/docs/chain/using-lens-chain/ for **more** info.";
  const mentions: (AccountMention | GroupMention)[] = [
    {
      __typename: "AccountMention",
      replace: { 
        __typename: "MentionReplace",
        from: "@lens/john",
        to: "@lens/john" 
      },
      namespace: "0x1234567890abcdef1234567890abcdef12345678",
      account: "0x1234567890abcdef1234567890abcdef12345678",
    },
    {
      __typename: "GroupMention",
      group: "0x1234567890abcdef1234567890abcdef12345678",
      replace: {
        __typename: "MentionReplace",
        from: "#0x1234567890abcdef1234567890abcdef12345678",
        to: "#Web3"
      },
    },
  ];
  
  return <LensMarkdown content={content} mentions={mentions} />;
};
`}
              </CodeBlock>
            </TabsContent>
          </div>
        </Tabs>
        <h2 className="mt-6 pb-2 text-3xl font-semibold tracking-tight first:mt-0">Installation</h2>
        <InstallCommandBlock componentName="lens-markdown" />
        <h2 className="mt-6 pb-2 text-3xl font-semibold tracking-tight first:mt-0">Usage</h2>
        <CodeBlock lang="tsx" className="lines">
          {`import { LensMarkdown } from "@/components/lens-markdown";
import { usePost } from "@lens-protocol/react";`}
        </CodeBlock>
        <CodeBlock lang="tsx" className="lines">
          {`const { data: post } = usePost({ post: postId });`}
        </CodeBlock>
        <CodeBlock lang="tsx" className="lines">
          {`<LensMarkdown content={post.metadata.content} mentions={post.mentions} />`}
        </CodeBlock>
      </div>
    </>
  );
}
