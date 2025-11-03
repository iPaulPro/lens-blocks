import { LoginBlock } from "@/components/login-block";
import { PostBlock } from "@/components/post-block";
import AccountHoverCard from "@/components/account-hover-card";
import AccountChooser from "@/components/account-chooser";
import CollectDialog from "@/components/collect-dialog";
import QuoteDialog from "@/components/quote-dialog";
import TipDialog from "@/components/tip-dialog";
import { notFound } from "next/navigation";
import { Metadata } from "next";

const validBlocks = [
  "account-chooser",
  "account-hover-card",
  "collect-dialog",
  "login",
  "post",
  "quote-dialog",
  "tip-dialog",
] as const;

const titles: Record<string, string> = {
  "account-chooser": "Account Chooser",
  "account-hover-card": "Account Hover Card",
  "collect-dialog": "Collect Dialog",
  login: "Login string",
  post: "Post string",
  "quote-dialog": "Quote Dialog",
  "tip-dialog": "Tip Dialog",
};

const descriptions: Record<string, string> = {
  "account-chooser": "A shadcn/ui component that hooks into the Lens React SDK and lets users choose a Lens account.",
  "account-hover-card":
    "A shadcn/ui component that hooks into the Lens React SDK and view details about accounts at a glance.",
  "collect-dialog": "A shadcn/ui component that hooks into the Lens React SDK and lets users to collect Posts.",
  login:
    "A shadcn/ui component that hooks into the Lens React SDK and lets users connect their wallet and log in with Lens.",
  post: "A shadcn/ui component that hooks into the Lens React SDK and displays a Post.",
  "quote-dialog": "A shadcn/ui component that hooks into the Lens React SDK and lets users quote Posts.",
  "tip-dialog":
    "A shadcn/ui component that hooks into the Lens React SDK and lets users send tips to Accounts and Posts.",
};
export async function generateMetadata({ params }: { params: Promise<{ block: string }> }): Promise<Metadata> {
  const { block } = await params;

  return {
    title: `${titles[block]} - Lens strings`,
    description:
      descriptions[block] ||
      "A registry of useful social building blocks using the official Lens React SDK, wagmi, and shadcn/ui components.",
  };
}

export function generateStaticParams(): Array<{ block: string }> {
  return validBlocks.map(block => ({ block }));
}

export default async function Page({ params }: { params: Promise<{ block: string }> }) {
  const { block } = await params;

  switch (block) {
    case "account-chooser":
      return <AccountChooser />;
    case "account-hover-card":
      return <AccountHoverCard />;
    case "collect-dialog":
      return <CollectDialog />;
    case "login":
      return <LoginBlock />;
    case "post":
      return <PostBlock />;
    case "quote-dialog":
      return <QuoteDialog />;
    case "tip-dialog":
      return <TipDialog />;
    default:
      notFound();
  }
}
