"use client";

import config from "@/lib/lens/config";
import { LensPostProvider } from "@/registry/new-york/common/lib/lens-post-context";
import { Account, useSessionClient } from "@lens-protocol/react";
import { OpenInV0Button } from "@/components/open-in-v0-button";
import { LensAccountChooser } from "@/registry/new-york/blocks/account/components/lens-account-chooser";
import { toast } from "sonner";

export default function AccountChooser() {
  const { data: sessionClient, loading: sessionLoading } = useSessionClient();

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
                <h2 className="text-sm text-muted-foreground sm:pl-3">A Lens Account chooser component</h2>
                <OpenInV0Button name="hello-world" className="w-fit" />
              </div>
              <div className="flex items-center justify-center flex-grow min-h-[400px] relative">
                <div className="h-48 w-full md:w-1/2">
                  <LensAccountChooser
                    walletAddress="0xdaA5EBe0d75cD16558baE6145644EDdFcbA1e868"
                    onAccountSelected={onAccountSelected}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LensPostProvider>
  );
}
