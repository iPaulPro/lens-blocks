"use client";

import Link from "next/link";
import registry from "@/registry.json";
import { Button } from "@/registry/new-york/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function Page() {
  const registryItems = registry.items
    .filter(block => block.type === "registry:component")
    .sort((a, b) => a.title.localeCompare(b.title));

  return (
    <>
      <div className="flex flex-col gap-1 border-b pb-4">
        <h1 className="text-3xl font-bold tracking-tight">Components</h1>
        <p className="text-muted-foreground text-xl">
          Here you can find all of the components available in the registry.
        </p>
      </div>
      <div className="flex-grow md:pt-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-x-8 lg:gap-x-16 lg:gap-y-6">
          {registryItems.map(component => (
            <Link
              key={component.name}
              href={`/components/${component.name}`}
              className="flex justify-between items-center gap-1 h-fit underline-none hover:bg-secondary hover:text-secondary-foreground border rounded-lg p-2"
            >
              <div className="flex flex-col gap-1">
                <span className="text-[0.925rem] font-semibold">{component.title.replace("Lens ", "")}</span>
                <span className="line-clamp-2 text-secondary-foreground text-sm">{component.description}</span>
              </div>
              <ArrowRight className="size-3.5 text-muted-foreground flex-none" />
            </Link>
          ))}
        </div>
      </div>
      <div className="flex justify-between flex-none py-4">
        <Button className="w-fit" asChild>
          <Link href="/#blocks">
            <ArrowLeft /> Blocks
          </Link>
        </Button>
        <Button className="w-fit" asChild>
          <Link href={`/components/${registryItems[0].name}`}>
            {registryItems[0].title.replace("Lens ", "")} <ArrowRight />
          </Link>
        </Button>
      </div>
    </>
  );
}
