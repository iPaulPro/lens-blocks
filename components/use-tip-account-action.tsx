"use client";

import { InstallCommandBlock } from "@/components/install-command-block";
import { CodeBlock } from "@/components/codeblock";

export default function UseTipAccountAction() {
  return (
    <div className="flex flex-col flex-1 gap-8">
      <p className="content">This hook allows users to tip a account using a specified payment source and amount.</p>
      <h2 className="mt-6 pb-2 text-3xl font-semibold tracking-tight first:mt-0">Installation</h2>
      <InstallCommandBlock componentName="use-tip-account-action" />
      <h2 className="mt-6 pb-2 text-3xl font-semibold tracking-tight first:mt-0">Usage</h2>
      <CodeBlock lang="tsx" className="lines">
        {`import { useTipAccountAction } from "@/hooks/use-tip-account-action";
import { useAccount,useSessionClient, PaymentSource, evmAddress } from "@lens-protocol/react";
import { NativeToken } from "@/lib/lens-utils";`}
      </CodeBlock>
      <CodeBlock lang="tsx" className="lines">
        {`const { data: sessionClient } = useSessionClient();
const { data: walletClient } = useWalletClient();
const { execute: tipAccount } = useTipAccountAction({ sessionClient, walletClient });

const account = evmAddress("SOME_ACCOUNT_ADDRESS");`}
      </CodeBlock>
      <CodeBlock lang="tsx" className="lines">
        {`const res = await tipAccount({ 
  account,
  source: PaymentSource.Signer,
  amount: "1.0",
  tokenAddress: NativeToken
});
// See https://lens.xyz/docs/protocol/best-practices/error-handling 
// on how to handle ResultAsync responses`}
      </CodeBlock>
    </div>
  );
}
