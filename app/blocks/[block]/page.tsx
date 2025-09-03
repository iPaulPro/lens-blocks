import { LoginBlock } from "@/components/login-block";
import { PostBlock } from "@/components/post-block";

export default async function Page({ params }: { params: Promise<{ block: string }> }) {
  const { block } = await params;

  if (!block) return null;

  switch (block) {
    case "login":
      return <LoginBlock />;
    case "post":
      return <PostBlock />;
    default:
      return <div>Block not found</div>;
  }
}
