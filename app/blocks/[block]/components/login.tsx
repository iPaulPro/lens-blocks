"use client";

import config from "@/lib/lens/config";
import { LensPostProvider } from "@/registry/new-york/common/lib/lens-post-context";
import { useSessionClient } from "@lens-protocol/react";
import { OpenInV0Button } from "@/components/open-in-v0-button";
import { Loader } from "lucide-react";
import { LensLoginBlock } from "@/registry/new-york/blocks/account/lens-login-block";

export function Login() {
  const { data: sessionClient, loading: sessionLoading } = useSessionClient();

  return (
    <LensPostProvider postId="1n8hs1aqb4k53f8vsvc" sessionClient={sessionClient} config={config}>
      <div className="w-full h-full relative">
        <div className="max-w-3xl mx-auto flex flex-col min-h-svh px-4 py-8 gap-8">
          <header className="flex flex-col gap-1">
            <h1 className="text-3xl font-bold tracking-tight">Components for Lens</h1>
            <p className="text-muted-foreground">A shadcn/ui registry of components for Lens Protocol.</p>
          </header>
          <div className="flex flex-col gap-4 border rounded-lg p-4 flex-grow min-h-[450px] relative">
            <div className="flex items-center justify-between">
              <h2 className="text-sm text-muted-foreground sm:pl-3">A Lens login button component</h2>
              <OpenInV0Button name="hello-world" className="w-fit" />
            </div>
            <div className="flex items-center justify-center min-h-[400px] relative">
              {sessionLoading ? <Loader className="animate-spin w-4 h-4 text-muted-foreground" /> : <LensLoginBlock />}
            </div>
          </div>
        </div>
      </div>
    </LensPostProvider>
  );
}
