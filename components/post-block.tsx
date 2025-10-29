"use client";

import { LensPostProvider } from "@/registry/new-york/lib/lens-post-provider";
import { Account, AnyPost, Post, postId, TxHash, useSessionClient } from "@lens-protocol/react";
import { Loader } from "lucide-react";
import { LensPost } from "@/registry/new-york/blocks/feed/lens-post";
import { toast } from "sonner";
import { Button } from "@/registry/new-york/ui/button";
import { useWalletClient } from "wagmi";
import { CodeBlock } from "@/components/codeblock";
import { InstallCommandBlock } from "@/components/install-command-block";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/registry/new-york/ui/tabs";

export function PostBlock() {
  const session = useSessionClient();
  const wallet = useWalletClient();

  const handlePostClick = (post: AnyPost) => {
    console.log("Post clicked:", post);
    toast.success("Post clicked: " + post.slug, { duration: 5000 });
  };

  const handleRepostSuccess = (_post: Post, txHash: TxHash) => {
    toast.success("Reposted successfully!", {
      action: (
        <Button className="ml-auto" onClick={() => window.open("https://explorer.testnet.lens.xyz/tx/" + txHash)}>
          View tx
        </Button>
      ),
    });
  };

  const handleTipCreated = (_post: Post, txHash: TxHash) => {
    toast.success("Tip sent successfully!", {
      action: (
        <Button className="ml-auto" onClick={() => window.open("https://explorer.testnet.lens.xyz/tx/" + txHash)}>
          View tx
        </Button>
      ),
    });
  };

  const handleTipError = (_post: Post, error: Error) => {
    toast.error("Unable to send tip: " + error.message);
  };

  const handleAccountSelected = (account: Account) => {
    console.log("Selected account:", account);
    // You can handle the selected account here, e.g., update state or perform an action
    const handle = account.username?.localName;
    if (handle) {
      toast.success("Account clicked: @" + handle);
    } else {
      toast.success("Account clicked: " + account.address);
    }
  };

  const handleBookmarkToggle = (_post: Post, bookmarked: boolean) => {
    toast.success((bookmarked ? "Added" : "Removed") + " bookmark successfully");
  };

  return (
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
            <LensPostProvider postId="1n8vtqy901xcrynmgrb" session={session} wallet={wallet} useTestnet={true}>
              <LensPost
                className="w-full md:w-2/3 border rounded-md"
                onPostClick={handlePostClick}
                onAccountClick={handleAccountSelected}
                onRepostSuccess={handleRepostSuccess}
                onTipCreated={handleTipCreated}
                onTipError={handleTipError}
                onBookmarkToggle={handleBookmarkToggle}
              />
            </LensPostProvider>
          </TabsContent>
          <TabsContent value="code" className="p-0">
            <CodeBlock lang="tsx" className="lines border-none">
              {`import { LensPostProvider } from "@/lib/lens-post-provider";
import { Account, AnyPost, TxHash, useSessionClient, postId } from "@lens-protocol/react";
import { LensPost } from "@/components/feed/lens-post";
import { Button } from "@/ui/button";
import { useWalletClient } from "wagmi";

export function PostBlockDemo() {
  const session = useSessionClient();
  const wallet = useWalletClient();

  const handlePostClick = (post: AnyPost) => {
    toast.success("Post clicked: " + post.slug, { duration: 5000 });
  };

  const handleRepostSuccess = (txHash: TxHash) => {
    toast.success("Reposted successfully!", {
      action: (
        <Button 
          className="ml-auto"
          onClick={() => window.open("https://explorer.testnet.lens.xyz/tx/" + txHash)}
        >
          View tx
        </Button>
      ),
    });
  };

  const handleTipCreated = (txHash: TxHash) => {
    toast.success("Tip sent successfully!", {
      action: (
        <Button 
          className="ml-auto"
          onClick={() => window.open("https://explorer.testnet.lens.xyz/tx/" + txHash)}
        >
          View tx
        </Button>
      ),
    });
  };

  const handleTipError = (error: Error) => {
    toast.error("Unable to send tip: " + error.message);
  };
  
  const handleAccountSelected = (account: Account) => {
    // You can handle the selected account here, e.g., update state or perform an action
    const handle = account.username?.localName;
    if (handle) {
      toast.success("Account clicked: @" + handle);
    } else {
      toast.success("Account clicked: " + account.address);
    }
  };
  
  const handleBookmarkToggle = (_post: Post, bookmarked: boolean) => {
    toast.success((bookmarked ? "Added" : "Removed") + " bookmark successfully");
  };
  
  return (
    <LensPostProvider
      postId={postId("1n8vtqy901xcrynmgrb")}
      session={session}
      wallet={wallet}
      useTestnet={true}>
      <LensPost
        className="w-full md:w-2/3 border rounded-md"
        onPostClick={handlePostClick}
        onAccountClick={handleAccountSelected}
        onRepostSuccess={handleRepostSuccess}
        onTipCreated={handleTipCreated}
        onTipError={handleTipError}
        onBookmarkToggle={handleBookmarkToggle}
      />
    </LensPostProvider>   
  );
};`}
            </CodeBlock>
          </TabsContent>
        </div>
      </Tabs>
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
            <LensPostProvider
              postId={postId("1n8vtqy901xcrynmgrb")}
              session={session}
              wallet={wallet}
              useTestnet={true}
            >
              <LensPost
                className="w-full md:w-2/3 border rounded-md"
                onPostClick={handlePostClick}
                onAccountClick={handleAccountSelected}
                onRepostSuccess={handleRepostSuccess}
                onTipCreated={handleTipCreated}
                onTipError={handleTipError}
                onBookmarkToggle={handleBookmarkToggle}
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
                onPostClick={handlePostClick}
                onAccountClick={handleAccountSelected}
                onRepostSuccess={handleRepostSuccess}
                onTipCreated={handleTipCreated}
                onTipError={handleTipError}
                onBookmarkToggle={handleBookmarkToggle}
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
                onPostClick={handlePostClick}
                onAccountClick={handleAccountSelected}
                onRepostSuccess={handleRepostSuccess}
                onTipCreated={handleTipCreated}
                onTipError={handleTipError}
                onBookmarkToggle={handleBookmarkToggle}
              />
            </LensPostProvider>
          )}
        </div>
      </div>
    </div>
  );
}
