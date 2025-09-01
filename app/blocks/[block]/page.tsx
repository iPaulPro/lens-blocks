import { Login } from "@/components/login";
import { Post } from "@/components/post";
import AccountChooser from "@/components/account-chooser";

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
    default:
      return <div>Block not found</div>;
  }
}
