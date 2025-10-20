"use client";

import { InstallCommandBlock } from "@/components/install-command-block";
import { CodeBlock } from "@/components/codeblock";

export default function UseReactionToggle() {
  return (
    <div className="flex flex-col flex-1 gap-8">
      <p className="content">
        This hook toggles the upvote reaction on a given post. It checks if the authenticated user has already upvoted
        the post and either adds or removes the upvote accordingly.
      </p>
      <h2 className="mt-6 pb-2 text-3xl font-semibold tracking-tight first:mt-0">Installation</h2>
      <InstallCommandBlock componentName="use-reaciton-toggle" />
      <h2 className="mt-6 pb-2 text-3xl font-semibold tracking-tight first:mt-0">Usage</h2>
      <CodeBlock lang="tsx" className="lines">
        {`import { useReactionToggle } from "@/hooks/use-reaction-toggle";
import { usePost, useSessionClient } from "@lens-protocol/react";`}
      </CodeBlock>
      <CodeBlock lang="tsx" className="lines">
        {`const { execute: toggleReaction } = useReactionToggle();
const { data: session } = useSessionClient();
const { data: post } = usePost({ post: "SOME_ID_OR_SLUG" });`}
      </CodeBlock>
      <CodeBlock lang="tsx" className="lines">
        {`const res = await toggleReaction({ post, session });
if (res.isErr()) {
  // Handle error
} else {
  // Reaction toggled successfully
}`}
      </CodeBlock>
    </div>
  );
}
