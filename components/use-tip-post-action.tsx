"use client";

import { InstallCommandBlock } from "@/components/install-command-block";
import { CodeBlock } from "@/components/codeblock";

export default function UseTipPostAction() {
  return (
    <div className="flex flex-col flex-1 gap-8">
      <p className="content">This hook allows users to tip a post using a specified payment source and amount.</p>
      <h2 className="mt-6 pb-2 text-3xl font-semibold tracking-tight first:mt-0">Installation</h2>
      <InstallCommandBlock componentName="use-tip-post-action" />
      <h2 className="mt-6 pb-2 text-3xl font-semibold tracking-tight first:mt-0">Usage</h2>
      <CodeBlock lang="tsx" className="lines">
        {`import { useTipPostAction } from "@/hooks/use-tip-post-action";
import { usePost, useSessionClient, PaymentSource, postId, TxHash } from "@lens-protocol/react";`}
      </CodeBlock>
      <CodeBlock lang="tsx" className="lines">
        {`const { execute, error } = useTipPostAction();
const { data: sessionClient } = useSessionClient();
const { data: walletClient } = useWalletClient();
const post = postId("SOME_POST_ID");`}
      </CodeBlock>
      <CodeBlock lang="tsx" className="lines">
        {`const handleCreateTip = async (source: PaymentSource, amount: string, tokenAddress: string): Promise<TxHash> => {
  if (!sessionClient || !walletClient) {
    throw new Error("A valid session and wallet client are required");
  }

  const res = await execute({
    sessionClient,
    walletClient,
    post,
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
