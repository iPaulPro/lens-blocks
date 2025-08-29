"use client";

import Link from "next/link";
import registry from "@/registry.json";
import { Button } from "@/registry/new-york/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/registry/new-york/ui/breadcrumb";

export default function Page() {
  return (
    <div className="w-full h-full relative">
      <div className="max-w-3xl flex flex-col min-h-svh px-12 py-8 gap-8">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Blocks</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <header className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight">Blocks</h1>
          <p className="text-muted-foreground text-xl">
            Here you can find all of the blocks available in the registry.
          </p>
        </header>
        <div className="flex-grow">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-x-8 lg:gap-x-16 lg:gap-y-6 xl:gap-x-20">
            {registry.items.map(block => (
              <Link
                key={block.name}
                href={`/blocks/${block.name}`}
                className="text-lg font-medium underline-offset-4 hover:underline md:text-base"
              >
                {block.title.replace("Lens ", "")}
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
            <Link href={`/blocks/${registry.items[0].name}`}>
              {registry.items[0].title.replace("Lens ", "")} <ArrowRight />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
