import { Button } from "@/registry/new-york/ui/button";
import { ArrowRight, RedoDot } from "lucide-react";
import Link from "next/link";
import { ExternalIcon } from "next/dist/client/components/react-dev-overlay/ui/icons/external";
import { CodeBlock } from "@/components/codeblock";
import { Alert, AlertDescription, AlertTitle } from "@/registry/new-york/ui/alert";

export default function Home() {
  return (
    <>
      <div className="flex flex-col gap-1">
        <h1 className="text-4xl font-extrabold tracking-tight text-balance">Lens Blocks</h1>
        <p className="text-muted-foreground text-xl">
          A shadcn/ui registry of blocks and components for Lens Social Protocol.
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <h2 id="intro" className="mt-12 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          Introduction
        </h2>
        <p className="content">
          Lens Blocks is a <a href="https://ui.shadcn.com/docs/registry">Registry</a> of useful social building blocks
          using the official{" "}
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
          </a>{" "}
          components.
        </p>
        <p className="content">
          The registry includes essentials like a wallet-aware login button (using wagmi), a rich post component
          (Markdown, mentions, reactions), a follow button, and a WYSIWYG composer/editor.
        </p>
        <p className="content">
          Each block deeply integrates with the Lens React SDK and handles wallet connection, signing, authentication,
          session lifecycle, optimistic updates, and state management out of the box.
        </p>
        {/*<Image*/}
        {/*  src="/images/img-intro.webp"*/}
        {/*  width={400}*/}
        {/*  height={400}*/}
        {/*  alt="shadcn/ui + Lens SDK = Lens Blocks"*/}
        {/*  className="rounded-lg mx-auto my-4"*/}
        {/*/>*/}
      </div>
      <div className="flex flex-col gap-2">
        <h2 id="install" className="mt-12 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          Installation
        </h2>
        <p className="content">
          Lens Blocks are installed on a component-by-component basis using the shadcn/ui CLI. As such, you&apos;ll need
          to have already set up a project with shadcn/ui. If you haven&apos;t done that yet, follow the installation
          instructions first:
        </p>
        <Button className="w-fit mt-4" variant="secondary" asChild>
          <Link href="https://ui.shadcn.com/docs/installation" target="_blank">
            shadcn/ui installation docs <ExternalIcon />
          </Link>
        </Button>
        <p className="content mb-4">
          You&apos;ll also need to set up the Lens React SDK and wagmi. If you haven&apos;t done that already, here is a
          basic setup using <a href="https://family.co/docs/connectkit">ConnectKit</a>:
        </p>
        <Alert className="bg-foreground text-background">
          <RedoDot className="!size-5" />
          <AlertTitle className="text-lg">Already have shadcn/ui and Lens Reack SDK set up?</AlertTitle>
          <AlertDescription className="text-background opacity-80">
            If you already have shadcn/ui and the Lens React SDK set up there&apos;s nothing to install, you can start
            adding blocks with no further changes!
          </AlertDescription>
          <div className="col-start-2 grid flex justify-items-end">
            <Button className="w-fit mt-4" variant="secondary" asChild>
              <Link href="/blocks">
                Jump to Blocks <ArrowRight />
              </Link>
            </Button>
          </div>
        </Alert>
        <h3 className="mt-8 text-2xl font-semibold tracking-tight">Install ConnectKit</h3>
        <p className="content">Follow the instructions in the ConnectKit docs :</p>
        <Button className="w-fit mt-4" variant="secondary" asChild>
          <Link href="https://family.co/docs/connectkit/getting-started" target="_blank">
            ConnectKit installation docs <ExternalIcon />
          </Link>
        </Button>
        <p className="content">
          You&apos;ll end up with a <span className="font-mono font-semibold">Web3Provider</span> that looks something
          like this:
        </p>
        <CodeBlock lang="tsx" className="lines">
          {`export const Web3Provider = ({ children }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>{children}</ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};`}
        </CodeBlock>
        <h3 className="mt-8 text-2xl font-semibold tracking-tight">Install Lens React SDK</h3>
        <p className="content">Follow the instructions in the Lens React SDK docs:</p>
        <Button className="w-fit mt-4" variant="secondary" asChild>
          <Link href="https://lens.xyz/docs/protocol/getting-started/typescript" target="_blank">
            Lens React SDK installation docs <ExternalIcon />
          </Link>
        </Button>
        <p className="content">
          You&apos;ll end up with a <span className="font-mono font-semibold">LensProvider</span> that looks something
          like this:
        </p>
        <CodeBlock lang="tsx" className="lines">{`<LensProvider client={client}>{children}</LensProvider>`}</CodeBlock>
        <h3 className="mt-8 text-2xl font-semibold tracking-tight">Add the LensProvider to Web3Provider</h3>
        <p className="content">
          Now you just have to combine the providers created above, and you should end up with a{" "}
          <span className="font-mono font-semibold">Web3Provider</span> that looks something like this:
        </p>
        <CodeBlock lang="tsx" className="lines">{`export const Web3Provider = ({ children }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>
          <LensProvider client={client}>{children}</LensProvider>
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};`}</CodeBlock>
        <span>
          <strong>Note:</strong>The <span className="font-mono font-semibold">LensProvider</span> should go inside of
          the <span className="font-mono font-semibold">ConnectKitProvider</span>
        </span>
        <p>
          Now you can wrap your app with the <strong>Web3Provider</strong> and you&apos;ll be ready to use the Lens
          Blocks!
        </p>
      </div>
      <div className="flex justify-end">
        <Button className="w-fit" asChild>
          <Link href="/blocks">
            Blocks <ArrowRight />
          </Link>
        </Button>
      </div>
    </>
  );
}
