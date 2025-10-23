"use client";

import { LensPostProvider } from "@/registry/new-york/lib/lens-post-provider";
import { Account, AnyPost, useSessionClient } from "@lens-protocol/react";
import { OpenInV0Button } from "@/components/open-in-v0-button";
import { Loader } from "lucide-react";
import { LensPost } from "@/registry/new-york/blocks/lens-post";
import { toast } from "sonner";
import { Button } from "@/registry/new-york/ui/button";
import { useWalletClient } from "wagmi";
import { CodeBlock } from "@/components/codeblock";
import { InstallCommandBlock } from "@/components/install-command-block";

export function PostBlock() {
  const session = useSessionClient();
  const wallet = useWalletClient();

  const onPostClick = (post: AnyPost) => {
    console.log("Post clicked:", post);
    toast.success("Post clicked: " + post.slug, { duration: 5000 });
  };

  const onRepostSuccess = (txHash: string) => {
    toast.success("Reposted successfully!", {
      action: (
        <Button className="ml-auto" onClick={() => window.open("https://explorer.testnet.lens.xyz/tx/" + txHash)}>
          View tx
        </Button>
      ),
    });
  };

  const onTipCreated = (txHash: string) => {
    toast.success("Tip sent successfully!", {
      action: (
        <Button className="ml-auto" onClick={() => window.open("https://explorer.testnet.lens.xyz/tx/" + txHash)}>
          View tx
        </Button>
      ),
    });
  };

  const onTipError = (error: Error) => {
    toast.error("Unable to send tip: " + error.message);
  };

  const onAccountSelected = (account: Account) => {
    console.log("Selected account:", account);
    // You can handle the selected account here, e.g., update state or perform an action
    const handle = account.username?.localName;
    if (handle) {
      toast.success("Account clicked: @" + handle);
    } else {
      toast.success("Account clicked: " + account.address);
    }
  };

  return (
    <div className="flex flex-col flex-1 gap-8">
      <div className="preview flex flex-col gap-4 relative">
        <div className="flex items-center justify-between">
          <h2 className="text-sm text-muted-foreground sm:pl-3">A basic text-only Post</h2>
          <OpenInV0Button name="post" className="w-fit" />
        </div>
        <div className="flex items-center justify-center flex-grow relative">
          <LensPostProvider postId="1n8vtqy901xcrynmgrb" session={session} wallet={wallet} useTestnet={true}>
            <LensPost
              className="w-full md:w-2/3 border rounded-md"
              onPostClick={onPostClick}
              onAccountClick={onAccountSelected}
              onRepostSuccess={onRepostSuccess}
              onTipCreated={onTipCreated}
              onTipError={onTipError}
            />
          </LensPostProvider>
        </div>
      </div>
      <h2 className="mt-6 pb-2 text-3xl font-semibold tracking-tight first:mt-0">Installation</h2>
      <InstallCommandBlock componentName="post" />
      <h2 className="mt-6 pb-2 text-3xl font-semibold tracking-tight first:mt-0">Usage</h2>
      <CodeBlock lang="tsx" className="lines">
        {`import { LensPostProvider } from "@/lib/lens-post-context";
import { LensPost } from "@/components/lens-post";
import { useSessionClient, postId } from "@lens-protocol/react";
import { useWalletClient } from "wagmi";`}
      </CodeBlock>
      <CodeBlock lang="tsx" className="lines">
        {`const session = useSessionClient();
const wallet = useWalletClient();
const post = postId("SOME_POST_ID");`}
      </CodeBlock>
      <CodeBlock lang="tsx" className="lines">
        {`<LensPostProvider postId={post} session={session} wallet={wallet}>
  <LensPost />
</LensPostProvider>`}
      </CodeBlock>
      <h2 className="mt-6 pb-2 text-3xl font-semibold tracking-tight first:mt-0">Examples</h2>
      <h3 className="text-2xl font-semibold tracking-tight">Image Post</h3>
      <div className="flex flex-col gap-4 relative p-0 md:p-4 border-0 md:border rounded-lg">
        <div className="flex items-center justify-center flex-grow relative">
          {session.loading || wallet.isLoading ? (
            <Loader className="animate-spin w-4 h-4 text-muted-foreground" />
          ) : (
            <LensPostProvider postId="58g7rtbnq9x60fv55w" session={session} wallet={wallet} useTestnet={true}>
              <LensPost
                className="w-full md:w-2/3 border rounded-md"
                onPostClick={onPostClick}
                onAccountClick={onAccountSelected}
                onRepostSuccess={onRepostSuccess}
                onTipCreated={onTipCreated}
                onTipError={onTipError}
              />
            </LensPostProvider>
          )}
        </div>
      </div>
      <h3 className="text-2xl font-semibold tracking-tight">Audio Post</h3>
      <div className="flex flex-col gap-4 relative p-0 md:p-4 border-0 md:border rounded-lg">
        <div className="flex items-center justify-center flex-grow relative">
          {session.loading || wallet.isLoading ? (
            <Loader className="animate-spin w-4 h-4 text-muted-foreground" />
          ) : (
            <LensPostProvider postId="1z32szv5xqnpaqqncah" session={session} wallet={wallet} useTestnet={true}>
              <LensPost
                className="w-full md:w-2/3 border rounded-md"
                onPostClick={onPostClick}
                onAccountClick={onAccountSelected}
                onRepostSuccess={onRepostSuccess}
                onTipCreated={onTipCreated}
                onTipError={onTipError}
              />
            </LensPostProvider>
          )}
        </div>
      </div>
      <h3 className="text-2xl font-semibold tracking-tight">Video Post</h3>
      <div className="flex flex-col gap-4 relative p-0 md:p-4 border-0 md:border rounded-lg">
        <div className="flex items-center justify-center flex-grow relative">
          {session.loading || wallet.isLoading ? (
            <Loader className="animate-spin w-4 h-4 text-muted-foreground" />
          ) : (
            <LensPostProvider postId="39d0736810280pbe9vk" session={session} wallet={wallet} useTestnet={true}>
              <LensPost
                className="w-full md:w-2/3 border rounded-md"
                onPostClick={onPostClick}
                onAccountClick={onAccountSelected}
                onRepostSuccess={onRepostSuccess}
                onTipCreated={onTipCreated}
                onTipError={onTipError}
              />
            </LensPostProvider>
          )}
        </div>
      </div>
    </div>
  );
}
