import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/registry/new-york/ui/breadcrumb";
import Link from "next/link";
import { ReactNode } from "react";
import registry from "@/registry.json";
import { Button } from "@/registry/new-york/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default async function Page({ children, params }: { children: ReactNode; params: Promise<{ block: string }> }) {
  const { block } = await params;

  const registryItem = registry.items.find(item => item.name === block);
  const registryIndex = registry.items.findIndex(item => item.name === block);

  if (!block || !registryItem || registryIndex === -1) return <div className="p-8">Block not found</div>;

  const title = registryItem.title.replace("Lens ", "");

  return (
    <div className="w-full h-full relative">
      <div className="max-w-3xl flex flex-col min-h-svh px-4 py-8 gap-8">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/blocks">Blocks</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <header className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight">{title} Block</h1>
          <p className="text-muted-foreground">{registryItem.description}</p>
        </header>
        {children}
        <div className="flex justify-between flex-none py-4">
          {registryIndex > 0 ? (
            <Button className="w-fit" asChild>
              <Link href={`/blocks/${registry.items[registryIndex - 1].name}`}>
                <ArrowLeft />
                {registry.items[registryIndex - 1].title.replace("Lens ", "")}
              </Link>
            </Button>
          ) : (
            <Button className="w-fit" asChild>
              <Link href="/blcoks">
                <ArrowLeft /> Blocks
              </Link>
            </Button>
          )}
          {registryIndex < registry.items.length - 1 && (
            <Button className="w-fit" asChild>
              <Link href={`/blocks/${registry.items[registryIndex + 1].name}`}>
                {registry.items[registryIndex + 1].title.replace("Lens ", "")} <ArrowRight />
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
