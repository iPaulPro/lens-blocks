"use client";

import { InstallCommandBlock } from "@/components/install-command-block";
import { CodeBlock } from "@/components/codeblock";

export default function UseAuthenticatedAccount() {
  return (
    <div className="flex flex-col flex-1 gap-8">
      <p className="content">
        This hook combines <code>useAuthenticatedUser</code> and <code>useAccount</code> from the Lens React SDK to
        fetch the currently authenticated Lens Account. It returns the account data, loading state, and any errors
        encountered during the fetch process.
      </p>
      <h2 className="mt-6 pb-2 text-3xl font-semibold tracking-tight first:mt-0">Installation</h2>
      <InstallCommandBlock componentName="use-authenticated-account" />
      <h2 className="mt-6 pb-2 text-3xl font-semibold tracking-tight first:mt-0">Usage</h2>
      <CodeBlock lang="tsx" className="lines">
        {`import { useAuthenticatedLensAccount } from "@/hooks/use-authenticated-lens-account";`}
      </CodeBlock>
      <CodeBlock lang="tsx" className="lines">
        {`const { data: account } = useAuthenticatedLensAccount();`}
      </CodeBlock>
    </div>
  );
}
