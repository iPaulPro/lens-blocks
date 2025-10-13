"use client";

import { InstallCommandBlock } from "@/components/install-command-block";
import { CodeBlock } from "@/components/codeblock";

export default function UseLoginWithViem() {
  return (
    <div className="flex flex-col flex-1 gap-8">
      <p className="content">
        This hook executes <code>useLogin</code> from the Lens React SDK using a <code>WalletClient</code> from Viem to
        sign the authentication message. It is designed to fetch the currently authenticated Lens Account. It returns
        the authenticated user data, loading state, and any errors encountered during the fetch process.
      </p>
      <h2 className="mt-6 pb-2 text-3xl font-semibold tracking-tight first:mt-0">Installation</h2>
      <InstallCommandBlock componentName="use-login-with-viem" />
      <h2 className="mt-6 pb-2 text-3xl font-semibold tracking-tight first:mt-0">Usage</h2>
      <p className="content !mt-0">
        This example uses the{" "}
        <a href="https://wagmi.sh" target="_blank" rel="noreferrer">
          wagmi
        </a>{" "}
        library to manage the <code>WalletClient</code>, but this is not strictly required.
      </p>
      <CodeBlock lang="tsx" className="lines">
        {`import { useLensLoginWithViem } from "@/hooks/use-lens-login-with-viem";
import { useWalletClient } from "wagmi";`}
      </CodeBlock>
      <CodeBlock lang="tsx" className="lines">
        {`const { data: walletClient } = useWalletClient();        
const { execute: login } = useLensLoginWithViem();`}
      </CodeBlock>
      <CodeBlock lang="tsx" className="lines">
        {`const user = await login(walletClient, account);}`}
      </CodeBlock>
    </div>
  );
}
