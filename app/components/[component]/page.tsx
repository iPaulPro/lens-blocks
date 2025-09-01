import AccountListItem from "@/components/account-list-item";
import PaginatedList from "@/components/paginated-list";
import AccountListItemSkeleton from "@/components/account-list-item-skeleton";

export default async function Page({ params }: { params: Promise<{ component: string }> }) {
  const { component } = await params;

  if (!component) return null;

  switch (component) {
    case "account-list-item":
      return <AccountListItem />;
    case "account-list-item-skeleton":
      return <AccountListItemSkeleton />;
    case "paginated-list":
      return <PaginatedList />;
    default:
      return <div>Component not found</div>;
  }
}
