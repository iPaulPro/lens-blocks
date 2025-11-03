import PostProvider from "@/components/post-provider";
import { Utils } from "@/components/utils";
import { notFound } from "next/navigation";

const validLibs = ["post-provider", "utils"];

export function generateStaticParams(): Array<{ lib: string }> {
  return validLibs.map(lib => ({ lib }));
}

export default async function Page({ params }: { params: Promise<{ lib: string }> }) {
  const { lib } = await params;

  if (!lib) return null;

  switch (lib) {
    case "post-provider":
      return <PostProvider />;
    case "utils":
      return <Utils />;
    default:
      notFound();
  }
}
