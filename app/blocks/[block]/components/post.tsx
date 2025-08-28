"use client";

import config from "@/lib/lens/config";
import { LensPostProvider } from "@/registry/new-york/common/lib/lens-post-context";
import { Account, AnyPost, useSessionClient } from "@lens-protocol/react";
import { OpenInV0Button } from "@/components/open-in-v0-button";
import { Loader } from "lucide-react";
import { LensPost } from "@/registry/new-york/blocks/feed/components/lens-post";
import { toast } from "sonner";
import { Button } from "@/registry/new-york/ui/button";
import { useWalletClient } from "wagmi";

export function Post() {
  const { data: sessionClient, loading: sessionLoading } = useSessionClient();
  const { data: walletClient, isLoading: walletClientLoading } = useWalletClient();

  const onPostClick = (post: AnyPost) => {
    console.log("Post clicked:", post);
    toast.success("Post clicked: " + post.slug, { duration: 10000 });
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
    <LensPostProvider postId="1n8hs1aqb4k53f8vsvc" sessionClient={sessionClient} config={config}>
      <div className="w-full h-full relative">
        <div className="max-w-3xl mx-auto flex flex-col min-h-svh px-4 py-8 gap-8">
          <header className="flex flex-col gap-1">
            <h1 className="text-3xl font-bold tracking-tight">Components for Lens</h1>
            <p className="text-muted-foreground">A shadcn/ui registry of components for Lens Protocol.</p>
          </header>
          <div className="flex flex-col flex-1 gap-8">
            <div className="flex flex-col gap-4 border rounded-lg p-4 min-h-[450px] relative">
              <div className="flex items-center justify-between">
                <h2 className="text-sm text-muted-foreground sm:pl-3">A basic text-only Post</h2>
                <OpenInV0Button name="hello-world" className="w-fit" />
              </div>
              <div className="flex items-center justify-center flex-grow min-h-[400px] relative">
                {sessionLoading || walletClientLoading ? (
                  <Loader className="animate-spin w-4 h-4 text-muted-foreground" />
                ) : (
                  sessionClient &&
                  walletClient && (
                    <div className="w-full md:w-2/3">
                      <LensPost
                        className="border rounded-md"
                        lensClient={sessionClient}
                        walletClient={walletClient}
                        onPostClick={onPostClick}
                        onAccountClick={onAccountSelected}
                        onRepostSuccess={txHash =>
                          toast.success("Reposted successfully!", {
                            action: (
                              <Button onClick={() => window.open("https://explorer.lens.xyz/tx/" + txHash)}>
                                View tx
                              </Button>
                            ),
                          })
                        }
                      />
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </LensPostProvider>
  );
}
