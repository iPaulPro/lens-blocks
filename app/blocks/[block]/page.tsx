import { Login } from "@/app/blocks/[block]/components/login";
import { Post } from "@/app/blocks/[block]/components/post";
import AccountChooser from "@/app/blocks/[block]/components/account-chooser";
import AccountItem from "@/app/blocks/[block]/components/account-item";
import AccountList from "@/app/blocks/[block]/components/account-list";

export default async function Page({ params }: { params: Promise<{ block: string }> }) {
  const { block } = await params;

  if (!block) return null;

  switch (block) {
    case "login":
      return <Login />;
    case "post":
      return <Post />;
    case "account-chooser":
      return <AccountChooser />;
    case "account-item":
      return <AccountItem />;
    case "account-list":
      return <AccountList />;
    default:
      return <div>Block not found</div>;
  }
}
