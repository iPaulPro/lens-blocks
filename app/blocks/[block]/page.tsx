import { LoginButton } from "@/app/blocks/[block]/components/login-button";
import { Post } from "@/app/blocks/[block]/components/post";
import AccountChooser from "@/app/blocks/[block]/components/account-chooser";
import AccountListItem from "@/app/blocks/[block]/components/account-list-item";
import AccountList from "@/app/blocks/[block]/components/account-list";

export default async function Page({ params }: { params: Promise<{ block: string }> }) {
  const { block } = await params;

  if (!block) return null;

  switch (block) {
    case "login-button":
      return <LoginButton />;
    case "post":
      return <Post />;
    case "account-chooser":
      return <AccountChooser />;
    case "account-list-item":
      return <AccountListItem />;
    case "account-list":
      return <AccountList />;
    default:
      return <div>Block not found</div>;
  }
}
