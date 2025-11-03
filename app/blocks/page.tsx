import Directory from "@/components/directory";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blocks - Lens Blocks",
  description: "A shadcn/ui registry of blocks and components for Lens Social Protocol.",
  icons: `${process.env.NEXT_PUBLIC_APP_URL}/lens-blocks.png`,
};

export default function Page() {
  return (
    <Directory
      type="block"
      title="Blocks"
      subtitle="Here you can find all the blocks available in the registry."
      description="Blocks are complex complex components made up of multiple files and sub-components. They are designed to be used in a variety of contexts, from simple pages to complex applications, and hook deeply into the Lens React SDK."
    />
  );
}
