import Directory from "@/components/directory";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Libraries - Lens Blocks",
  description: "A shadcn/ui registry of blocks and components for Lens Social Protocol.",
  icons: `${process.env.NEXT_PUBLIC_APP_URL}/lens-blocks.png`,
};

export default function Page() {
  return (
    <Directory
      type="lib"
      title="Libraries"
      subtitle="Here you can find all the libraries available in the registry."
      description="Libraries are used by components but may also be used directly in your application."
    />
  );
}
