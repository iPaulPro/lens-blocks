import Directory from "@/components/directory";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Components - Lens Blocks",
  description: "A shadcn/ui registry of blocks and components for Lens Social Protocol.",
  icons: `${process.env.NEXT_PUBLIC_APP_URL}/lens-blocks.png`,
};

export default function Page() {
  return (
    <Directory
      type="component"
      title="Components"
      subtitle="Here you can find all the components available in the registry."
    />
  );
}
