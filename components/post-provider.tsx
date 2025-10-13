"use client";

import { InstallCommandBlock } from "@/components/install-command-block";
import { CodeBlock } from "@/components/codeblock";
import Link from "next/link";

export default function PostProvider() {
  return (
    <div className="flex flex-col flex-1 gap-8">
      <p className="content">
        This library provides a React context provider component called <code>LensPostProvider</code> that manages and
        supplies Post-related data and functionalities to its child components. The Post context can be accessed using
        the <Link href="/hooks/use-post-context">useLensPostContext</Link> hook.
      </p>
      <h2 className="mt-6 pb-2 text-3xl font-semibold tracking-tight first:mt-0">Installation</h2>
      <InstallCommandBlock componentName="use-lens-post-context" />
      <h2 className="mt-6 pb-2 text-3xl font-semibold tracking-tight first:mt-0">Usage</h2>
      <CodeBlock lang="tsx" className="lines">
        {`import { PostProvider } from "@/lib/lens-post-provider";
import { useSessionClient } from "@lens-protocol/react";
import { useWalletClient } from "wagmi";`}
      </CodeBlock>
      <CodeBlock lang="tsx" className="lines">
        {`const { data: sessionClient } = useSessionClient();
const { data: walletClient } = useWalletClient();`}
      </CodeBlock>
      <CodeBlock lang="tsx" className="lines">
        {`<PostProvider postId={postId} sessionClient={sessionClient} walletClient={walletClient}>
  {/* Child components that consume the post context */}
</PostProvider>`}
      </CodeBlock>
    </div>
  );
}
