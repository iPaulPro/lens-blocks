import registry from "@/registry.json";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/registry/new-york/ui/button";

type DirectoryProps = {
  type: "block" | "component" | "hook" | "lib";
  title: string;
  subtitle: string;
  description?: string;
};

export default function Directory(props: DirectoryProps) {
  const { type, title, subtitle, description } = props;

  const registryItems = registry.items
    .filter(block => block.type === `registry:${type}`)
    .sort((a, b) => a.title.localeCompare(b.title));

  return (
    <>
      <div className="flex flex-col gap-1 border-b pb-4">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground text-xl">{subtitle}</p>
      </div>
      {description && (
        <p className="content !mt-0">
          Blocks are complex complex components made up of multiple files and sub-components. They are designed to be
          used in a variety of contexts, from simple pages to complex applications, and hook deeply into the Lens React
          SDK.
        </p>
      )}
      <div className="flex-grow md:pt-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-x-8 lg:gap-x-16 lg:gap-y-6">
          {registryItems.map(item => (
            <Link
              key={item.name}
              href={`/${type}s/${item.name}`}
              className="flex justify-between items-center gap-1 h-fit underline-none hover:bg-secondary hover:text-secondary-foreground border rounded-lg p-2"
            >
              <div className="flex flex-col gap-1">
                <span className="text-[0.925rem] font-semibold">{item.title.replace("Lens ", "")}</span>
                <span className="line-clamp-2 text-secondary-foreground text-sm">{item.description}</span>
              </div>
              <ArrowRight className="size-3.5 text-muted-foreground flex-none" />
            </Link>
          ))}
        </div>
      </div>
      <div className="flex justify-between flex-none py-4">
        <Button className="w-fit" asChild>
          <Link href="/#install">
            <ArrowLeft /> Installation
          </Link>
        </Button>
        <Button className="w-fit" asChild>
          <Link href={`/${type}s/${registryItems[0].name}`}>
            {registryItems[0].title.replace("Lens ", "")} <ArrowRight />
          </Link>
        </Button>
      </div>
    </>
  );
}
