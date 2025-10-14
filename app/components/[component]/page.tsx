import AccountListItem from "@/components/account-list-item";
import PaginatedList from "@/components/paginated-list";
import AccountListItemSkeleton from "@/components/account-list-item-skeleton";
import LoginButton from "@/components/login-button";
import AccountChooser from "@/components/account-chooser";
import TextEditor from "@/components/text-editor";
import Markdown from "@/components/markdown";

export default async function Page({ params }: { params: Promise<{ component: string }> }) {
  const { component } = await params;

  if (!component) return null;

  switch (component) {
    case "account-chooser":
      return <AccountChooser />;
    case "account-list-item":
      return <AccountListItem />;
    case "account-list-item-skeleton":
      return <AccountListItemSkeleton />;
    case "login-button":
      return <LoginButton />;
    case "paginated-list":
      return <PaginatedList />;
    case "text-editor":
      return <TextEditor />;
    case "lens-markdown":
      return <Markdown />;
    default:
      return <div>Component not found</div>;
  }
}
