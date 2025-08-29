import * as React from "react";
import { Blocks, Github } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/registry/new-york/ui/sidebar";
import registry from "@/registry.json";
import { Button } from "@/registry/new-york/ui/button";

const data = {
  navMain: [
    {
      title: "Getting Started",
      url: "/",
      items: [
        {
          title: "Introduction",
          url: "/#intro",
          isActive: true,
        },
        {
          title: "Installation",
          url: "/#install",
        },
      ],
    },
    {
      title: "Blocks",
      url: "/blocks",
      items: registry.items.map(block => ({
        title: block.title.replace("Lens ", ""),
        url: `/blocks/${block.name}`,
      })),
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="floating" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/">
                <div className="bg-black text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Blocks className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-medium">Lens Blocks</span>
                  <span className="">v0.1.0</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu className="gap-2">
            {data.navMain.map(item => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <a href={item.url} className="font-medium">
                    {item.title}
                  </a>
                </SidebarMenuButton>
                {item.items?.length ? (
                  <SidebarMenuSub className="ml-0 border-l-0 px-1.5">
                    {item.items.map(item => (
                      <SidebarMenuSubItem key={item.title}>
                        <SidebarMenuSubButton asChild isActive={item.isActive}>
                          <a href={item.url}>{item.title}</a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                ) : null}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="text-sm text-muted-foreground flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <a href="https://github.com/ipaulpro/lens-blocks" target="_blank" rel="noreferrer">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <title>GitHub</title>
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
            </a>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <a href="https://hey.xyz/u/paulburke" target="_blank" rel="noreferrer">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="currentColor">
                <title>Lens</title>
                <path
                  fillRule="evenodd"
                  d="M42.311 23.793c1.788-1.654 4.133-2.68 6.745-2.68 5.807.002 10.51 4.71 10.51 10.521 0 5.027-4.973 9.326-6.217 10.316-5.815 4.63-13.39 7.339-21.566 7.339-8.176 0-15.749-2.707-21.565-7.34C8.98 40.96 4 36.653 4 31.634c0-5.811 4.705-10.521 10.507-10.521 2.615 0 4.96 1.026 6.748 2.68l.185-.092c.408-5.422 4.817-9.7 10.343-9.7 5.527 0 9.935 4.278 10.344 9.7l.184.091v.002"
                  clipRule="evenodd"
                />
              </svg>
            </a>
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
