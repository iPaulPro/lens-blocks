import { LoginBlock } from "@/components/login-block";
import { PostBlock } from "@/components/post-block";
import AccountHoverCard from "@/components/account-hover-card";
import AccountChooser from "@/components/account-chooser";
import CollectDialog from "@/components/collect-dialog";
import QuoteDialog from "@/components/quote-dialog";
import TipDialog from "@/components/tip-dialog";

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
