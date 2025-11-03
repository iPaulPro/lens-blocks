import Directory from "@/components/directory";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hooks - Lens Blocks",
  description: "A shadcn/ui registry of blocks and components for Lens Social Protocol.",
  icons: `${process.env.NEXT_PUBLIC_APP_URL}/lens-blocks.png`,
};

export default function Page() {
  return (
    <Directory
      type="hook"
      title="Hooks"
      subtitle="Here you can find all the hooks available in the registry."
      description="Hooks are functions that you can use to extend the functionality of the Lens SDK. They are used by components but may also be used directly in your application."
    />
  );
}
