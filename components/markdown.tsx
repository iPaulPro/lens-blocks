"use client";

import { OpenInV0Button } from "@/components/open-in-v0-button";
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
        <div className="preview flex flex-col gap-4 relative">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground sm:pl-3">A Lens Markdown Renderer</div>
            <OpenInV0Button name="lens-markdown" className="w-fit" />
          </div>
          <div className="flex items-center justify-center flex-grow relative">
            <Tabs defaultValue="preview" className=" w-full md:w-10/12">
              <TabsList>
                <TabsTrigger value="preview">Preview</TabsTrigger>
                <TabsTrigger value="code">Code</TabsTrigger>
              </TabsList>
              <div className="min-h-24 w-full border rounded-lg p-8">
                <TabsContent value="preview">
                  <LensMarkdown content={content} mentions={mentions} />
                </TabsContent>
                <TabsContent value="code">
                  <CodeBlock lang="tsx" className="lines">
                    {`const content = "Hello @lens/john, check out #0x1234567890abcdef1234567890abcdef12345678 *and* $GHO! Visit https://lens.xyz/docs/chain/using-lens-chain/ for **more** info.";
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

<LensMarkdown content={content} mentions={mentions} />`}
                  </CodeBlock>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
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
