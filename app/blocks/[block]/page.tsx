import { LoginBlock } from "@/components/login-block";
import { PostBlock } from "@/components/post-block";
import AccountHoverCard from "@/components/account-hover-card";
import AccountChooser from "@/components/account-chooser";
import CollectDialog from "@/components/collect-dialog";
import QuoteDialog from "@/components/quote-dialog";
import TipDialog from "@/components/tip-dialog";

export async function generateMetadata({ params }: { params: Promise<{ block: string }> }) {
  const { block } = await params;

  const titleMap: Record<string, string> = {
    "account-chooser": "Account Chooser",
    "account-hover-card": "Account Hover Card",
    "collect-dialog": "Collect Dialog",
    login: "Login Block",
    post: "Post Block",
    "quote-dialog": "Quote Dialog",
    "tip-dialog": "Tip Dialog",
  };

  const descriptionMap: Record<string, string> = {
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

  return {
    title: titleMap[block] ? titleMap[block] + " - Lens Blocks" : "Lens Blocks",
    description:
      descriptionMap[block] ||
      "A registry of useful social building blocks using the official Lens React SDK, wagmi, and shadcn/ui components.",
  };
}

export default async function Page({ params }: { params: Promise<{ block: string }> }) {
  const { block } = await params;

  if (!block) return null;

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
      return <div>Block not found</div>;
  }
}
