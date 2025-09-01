import { LoginBlock } from "@/components/login-block";
import { PostBlock } from "@/components/post-block";
import AccountChooser from "@/components/account-chooser";

export default async function Page({ params }: { params: Promise<{ block: string }> }) {
  const { block } = await params;

  if (!block) return null;

  switch (block) {
    case "login":
      return <LoginBlock />;
    case "post":
      return <PostBlock />;
    case "account-chooser":
      return <AccountChooser />;
    default:
      return <div>Block not found</div>;
  }
}
