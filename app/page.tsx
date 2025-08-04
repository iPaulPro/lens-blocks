"use client";

import { OpenInV0Button } from "@/components/open-in-v0-button";
import { LensLoginBlock } from "@/registry/new-york/blocks/account/lens-login-block";
import { Account, AnyPost, evmAddress, postId, useAccount, usePost, useSessionClient } from "@lens-protocol/react";
import { lensClient } from "@/lib/lens/client";
import { Loader } from "lucide-react";
import { LensAccountChooser } from "@/registry/new-york/blocks/account/components/lens-account-chooser";
import { LensAccountListItem } from "@/registry/new-york/common/components/lens-account-list-item";
import { LensPost } from "@/registry/new-york/blocks/feed/components/lens-post";
import DarkModeSwitch from "@/app/dark-mode-switch";
import LikesList from "@/registry/new-york/blocks/feed/components/likes/likes-list";
import { toast } from "sonner";
import { useWalletClient } from "wagmi";

export default function Home() {
  const { data: sessionClient, loading: sessionLoading } = useSessionClient();

  const { data: account, loading: accountLoading } = useAccount({
    address: evmAddress("0xA77f9f69Da9dafBC1ef31D1fCd79D04dF607e983"),
  });

  const { data: walletClient, isLoading: walletClientLoading } = useWalletClient();

  const onAccountSelected = (account: Account) => {
    console.log("Selected account:", account);
    // You can handle the selected account here, e.g., update state or perform an action
    const handle = account.username?.localName;
    if (handle) {
      toast.success("Account clicked: @" + handle);
    } else {
      toast.error("Account clicked: " + account.address);
    }
  };

  const { data: post, loading: postLoading } = usePost({
    post: postId("1n8hs1aqb4k53f8vsvc"),
  });

  const onPostClick = (post: AnyPost) => {
    console.log("Post clicked:", post);
    toast.success("Post clicked: " + post.slug);
  };

  return (
    <div className="w-full h-full relative">
      <div className="max-w-3xl mx-auto flex flex-col min-h-svh px-4 py-8 gap-8">
        <header className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight">Components for Lens</h1>
          <p className="text-muted-foreground">A shadcn/ui registry of components for Lens Protocol.</p>
        </header>
        <main className="flex flex-col flex-1 gap-8">
          <div className="flex flex-col gap-4 border rounded-lg p-4 min-h-[450px] relative">
            <div className="flex items-center justify-between">
              <h2 className="text-sm text-muted-foreground sm:pl-3">A Lens login button component</h2>
              <OpenInV0Button name="hello-world" className="w-fit" />
            </div>
            <div className="flex items-center justify-center min-h-[400px] relative">
              {sessionLoading ? (
                <Loader className="animate-spin w-4 h-4 text-muted-foreground" />
              ) : (
                <LensLoginBlock lensClient={sessionClient ?? lensClient} />
              )}
            </div>
          </div>
          <div className="flex flex-col gap-4 border rounded-lg p-4 min-h-[450px] relative">
            <div className="flex items-center justify-between">
              <h2 className="text-sm text-muted-foreground sm:pl-3">A basic text-only Post</h2>
              <OpenInV0Button name="hello-world" className="w-fit" />
            </div>
            <div className="flex items-center justify-center min-h-[400px] relative">
              {postLoading || sessionLoading || walletClientLoading ? (
                <Loader className="animate-spin w-4 h-4 text-muted-foreground" />
              ) : (
                post &&
                sessionClient &&
                walletClient && (
                  <div className="w-full md:w-2/3">
                    <LensPost
                      className="border rounded-md"
                      lensClient={sessionClient}
                      walletClient={walletClient}
                      post={post}
                      postLoading={postLoading}
                      onPostClick={onPostClick}
                      onAccountClick={onAccountSelected}
                      onRepostSuccess={txHash => toast.success("Reposted successfully!")}
                    />
                  </div>
                )
              )}
            </div>
          </div>
          <div className="flex flex-col gap-4 border rounded-lg p-4 min-h-[450px] relative">
            <div className="flex items-center justify-between">
              <h2 className="text-sm text-muted-foreground sm:pl-3">A Lens Account chooser component</h2>
              <OpenInV0Button name="hello-world" className="w-fit" />
            </div>
            <div className="flex items-center justify-center min-h-[400px] relative">
              <div className="h-48 w-full md:w-1/2">
                <LensAccountChooser
                  walletAddress="0xdaA5EBe0d75cD16558baE6145644EDdFcbA1e868"
                  onAccountSelected={onAccountSelected}
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4 border rounded-lg p-4 min-h-[450px] relative">
            <div className="flex items-center justify-between">
              <h2 className="text-sm text-muted-foreground sm:pl-3">A Lens Account list item component</h2>
              <OpenInV0Button name="hello-world" className="w-fit" />
            </div>
            <div className="flex items-center justify-center min-h-[400px] relative">
              {accountLoading ? (
                <Loader className="animate-spin w-4 h-4 text-muted-foreground" />
              ) : (
                account && (
                  <div className="border rounded-md w-full md:w-1/3">
                    <LensAccountListItem account={account} onAccountSelected={onAccountSelected} showChevron={false} />
                  </div>
                )
              )}
            </div>
          </div>
          <div className="flex flex-col gap-4 border rounded-lg p-4 min-h-[450px] relative">
            <div className="flex items-center justify-between">
              <h2 className="text-sm text-muted-foreground sm:pl-3">A list of users that liked a post</h2>
              <OpenInV0Button name="hello-world" className="w-fit" />
            </div>
            <div className="flex items-center justify-center min-h-[400px] relative">
              <div className="border rounded-md w-full md:w-1/3">
                {postLoading || sessionLoading ? (
                  <Loader className="animate-spin w-4 h-4 text-muted-foreground" />
                ) : (
                  post && <LikesList post={post} />
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
      <DarkModeSwitch className="fixed top-4 right-4" />
    </div>
  );
}
