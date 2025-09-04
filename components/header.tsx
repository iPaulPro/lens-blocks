"use client";

import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/registry/new-york/ui/breadcrumb";
import { useSidebar } from "@/registry/new-york/ui/sidebar";
import Link from "next/link";
import { Button } from "@/registry/new-york/ui/button";
import { Menu } from "lucide-react";

export default function Header() {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter(Boolean);

  const { openMobile: isSidebarOpen, isMobile, setOpenMobile: setSidbarOpen } = useSidebar();

  function formatPath(str: string): string {
    return str
      .split("-")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  function onSidebarBtnClick() {
    setSidbarOpen(!isSidebarOpen);
  }

  return (
    <header className="w-full h-12 flex items-center">
      {isMobile && (
        <Button onClick={onSidebarBtnClick} variant="ghost">
          <Menu className="w-6 h-6" />
        </Button>
      )}
      {pathSegments.length > 0 && (
        <Breadcrumb>
          <BreadcrumbList className={`pr-2 ${isMobile ? "pl-1 " : "pl-8"}`}>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            {pathSegments.map((segment, index) => {
              const href = `/${pathSegments.slice(0, index + 1).join("/")}`;
              const isLast = index === pathSegments.length - 1;
              return (
                <>
                  <BreadcrumbItem key={href}>
                    {isLast ? (
                      <span>{formatPath(segment)}</span>
                    ) : (
                      <BreadcrumbLink href={href}>{formatPath(segment)}</BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {!isLast && <BreadcrumbSeparator key={`${href}-sep`} />}
                </>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      )}
    </header>
  );
}
