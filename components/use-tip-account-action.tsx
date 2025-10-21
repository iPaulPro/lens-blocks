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
import { useAccount, useSessionClient, PaymentSource, evmAddress, TxHash } from "@lens-protocol/react";`}
      </CodeBlock>
      <CodeBlock lang="tsx" className="lines">
        {`const { execute, error } = useTipAccountAction();
const { data: sessionClient } = useSessionClient();
const { data: walletClient } = useWalletClient();
const account = evmAddress("SOME_ACCOUNT_ADDRESS");`}
      </CodeBlock>
      <CodeBlock lang="tsx" className="lines">
        {`const handleCreateTip = async (source: PaymentSource, amount: string, tokenAddress: string): Promise<TxHash> => {
  if (!sessionClient || !walletClient) {
    throw new Error("A valid session and wallet client are required");
  }

  const res = await execute({
    sessionClient,
    walletClient,
    account,
    source,
    amount,
    tokenAddress,
  });

  if (res.isErr()) {
    throw res.error;
  }

  return res.value;
};`}
      </CodeBlock>
    </div>
  );
}
