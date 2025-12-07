import Link from "next/link";
import { ReactNode } from "react";
import registry from "@/registry.json";
import { Button } from "@/registry/new-york/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

export const dynamic = "force-static";
export const dynamicParams = false;
export const revalidate = 28800; // 8 hours

export default async function Layout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ block: string }>;
}) {
  const { block } = await params;

  const registryItems = registry.items
    .filter(block => block.type === "registry:block")
    .sort((a, b) => a.title.localeCompare(b.title));

  const registryItem = registryItems.find(item => item.name === block);
  const registryIndex = registryItems.findIndex(item => item.name === block);

  if (!block || !registryItem || registryIndex === -1 || registryItem.type !== "registry:block")
    return <div className="p-8">Block not found</div>;

  const title = registryItem.title.replace("Lens ", "");

  return (
    <>
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">{title} Block</h1>
        <p className="text-muted-foreground">{registryItem.description}</p>
      </div>
      {children}
      <div className="flex justify-between flex-none py-4">
        {registryIndex > 0 ? (
          <Button className="w-fit" asChild>
            <Link href={`/blocks/${registryItems[registryIndex - 1].name}`}>
              <ArrowLeft />
              {registryItems[registryIndex - 1].title.replace("Lens ", "")}
            </Link>
          </Button>
        ) : (
          <Button className="w-fit" asChild>
            <Link href="/blocks">
              <ArrowLeft /> Blocks
            </Link>
          </Button>
        )}
        {registryIndex < registryItems.length - 1 ? (
          <Button className="w-fit" asChild>
            <Link href={`/blocks/${registryItems[registryIndex + 1].name}`}>
              {registryItems[registryIndex + 1].title.replace("Lens ", "")} <ArrowRight />
            </Link>
          </Button>
        ) : (
          <Button className="w-fit" asChild>
            <Link href="/libs">
              Libraries <ArrowRight />
            </Link>
          </Button>
        )}
      </div>
    </>
  );
}
