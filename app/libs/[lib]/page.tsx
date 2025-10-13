import PostProvider from "@/components/post-provider";
import { Utils } from "@/components/utils";

export default async function Page({ params }: { params: Promise<{ lib: string }> }) {
  const { lib } = await params;

  if (!lib) return null;

  switch (lib) {
    case "post-provider":
      return <PostProvider />;
    case "utils":
      return <Utils />;
    default:
      return <div>Library not found</div>;
  }
}
