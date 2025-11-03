"use client";

import Link from "next/link";
import registry from "@/registry.json";
import { Button } from "@/registry/new-york/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function Page() {
  const registryItems = registry.items
    .filter(block => block.type === "registry:hook")
    .sort((a, b) => a.title.localeCompare(b.title));

  return (
    <>
      <div className="flex flex-col gap-1 border-b pb-4">
        <h1 className="text-3xl font-bold tracking-tight">Hooks</h1>
        <p className="text-muted-foreground text-xl">Here you can find all of the hooks available in the registry.</p>
      </div>
      <p className="content !mt-0">
        Hooks are functions that you can use to extend the functionality of the Lens SDK. They are used by components
        but may also be used directly in your application.
      </p>
      <div className="flex-grow md:pt-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-x-8 lg:gap-x-16 lg:gap-y-6">
          {registryItems.map(hook => (
            <Link
              key={hook.name}
              href={`/hooks/${hook.name}`}
              className="flex justify-between items-center gap-1 h-fit underline-none hover:bg-secondary hover:text-secondary-foreground border rounded-lg p-2"
            >
              <div className="flex flex-col gap-1">
                <span className="text-[0.925rem] font-semibold">{hook.title.replace("Lens ", "")}</span>
                <span className="line-clamp-2 text-secondary-foreground text-sm">{hook.description}</span>
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
          <Link href={`/hooks/${registryItems[0].name}`}>
            {registryItems[0].title.replace("Lens ", "")} <ArrowRight />
          </Link>
        </Button>
      </div>
    </>
  );
}
