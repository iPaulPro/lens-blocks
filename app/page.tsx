"use client";

import DarkModeSwitch from "@/app/dark-mode-switch";
import { Button } from "@/registry/new-york/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { ExternalIcon } from "next/dist/client/components/react-dev-overlay/ui/icons/external";

export default function Home() {
  return (
    <div className="w-full h-full relative">
      <div className="max-w-3xl flex flex-col min-h-svh px-12 py-8 gap-8">
        <header className="flex flex-col gap-1">
          <h1>Lens Blocks</h1>
          <p className="text-muted-foreground text-xl">
            A shadcn/ui registry of blocks and components for Lens Social Protocol.
          </p>
        </header>
        <div className="flex flex-col gap-2">
          <a href="#intro">
            <h2>Introduction</h2>
          </a>
          <p>
            Lens Blocks are a collection of useful social building blocks built with the official{" "}
            <a href="https://lens.xyz/docs/protocol/getting-started/react" target="_blank">
              Lens React SDK
            </a>
            ,{" "}
            <a href="https://wagmi.sh" target="_blank">
              wagmi
            </a>
            , and{" "}
            <a href="https://ui.shadcn.com/" target="_blank">
              shadcn/ui
            </a>
            .
          </p>
          <p className="leading-7 [&:not(:first-child)]:mt-6">
            The registry includes essentials like a wallet-aware login button (using wagmi), a rich post component
            (Markdown, mentions, reactions), and a WYSIWYG composer/editor. Each block deeply integrates the Lens React
            SDK and handles wallet connection, signing, authentication, session lifecycle, optimistic updates, and state
            management out of the box. This makes it easy to assemble social features quickly while retaining complete
            ownership of the code.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <a href="#install">
            <h2>Installation</h2>
          </a>
          <p className="leading-7 [&:not(:first-child)]:mt-6">
            Lens Blocks are installed on a component-by-component basis using the shadcn/ui CLI. As such, you'll need to
            have already set up a project with shadcn/ui. If you haven't done that yet, follow the installation
            instructions first:
          </p>
          <Button className="w-fit mt-4" variant="secondary" asChild>
            <Link href="https://ui.shadcn.com/docs/installation" target="_blank">
              shadcn/ui installation docs <ExternalIcon />
            </Link>
          </Button>
          <p>
            You'll also need to set up the Lens React SDK and wagmi. If you haven't done that already, here is a basic
            setup using <a href="https://family.co/docs/connectkit">ConnectKit</a>:
          </p>
          <h3>Install ConnectKit</h3>
          <p>Follow the instructions in the ConnectKit docs :</p>
          <Button className="w-fit mt-4" variant="secondary" asChild>
            <Link href="https://ui.shadcn.com/docs/installation" target="_blank">
              ConnectKit installation docs <ExternalIcon />
            </Link>
          </Button>
          <p>
            You'll end up with a <span className="font-mono font-semibold">Web3Provider</span> that looks something like
            this:
          </p>
          <pre>
            <code>{`export const Web3Provider = ({ children }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>{children}</ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};`}</code>
          </pre>
          <h3>Install Lens React SDK</h3>
          <p>Follow the instructions in the Lens React SDK docs:</p>
          <Button className="w-fit mt-4" variant="secondary" asChild>
            <Link href="https://ui.shadcn.com/docs/installation" target="_blank">
              Lens React SDK installation docs <ExternalIcon />
            </Link>
          </Button>
          <p>
            You'll end up with a <span className="font-mono font-semibold">LensProvider</span> that looks something like
            this:
          </p>
          <pre>
            <code>{`<LensProvider client={client}>{children}</LensProvider>`}</code>
          </pre>
          <h3>Add the LensProvider to Web3Provider</h3>
          <p>
            Now you just have to combine the providers created above, and you should end up with a{" "}
            <span className="font-mono font-semibold">Web3Provider</span> that looks something like this:
          </p>
          <pre>
            <code>{`export const Web3Provider = ({ children }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>
          <LensProvider client={client}>{children}</LensProvider>
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};`}</code>
          </pre>
          <span>
            <strong>Note:</strong>The <span className="font-mono font-semibold">LensProvider</span> should go inside of
            the <span className="font-mono font-semibold">ConnectKitProvider</span>
          </span>
          <p>
            Now you can wrap your app with the <strong>Web3Provider</strong> and you'll be ready to use the Lens Blocks!
          </p>
        </div>
        <div className="flex justify-end">
          <Button className="w-fit" asChild>
            <Link href="/blocks">
              Blocks <ArrowRight />
            </Link>
          </Button>
        </div>
      </div>
      <DarkModeSwitch className="fixed top-4 right-4" />
    </div>
  );
}
