import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import { ReactNode } from "react";
import Web3Provider from "./web3-provider";
import { Toaster } from "@/registry/new-york/ui/sonner";
import { ThemeProvider } from "next-themes";
import { SidebarProvider } from "@/registry/new-york/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Analytics } from "@vercel/analytics/next";
import Header from "@/components/header";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lens Blocks",
  description: "A shadcn/ui registry of blocks and components for Lens Social Protocol.",
  icons: `${process.env.NEXT_PUBLIC_APP_URL}/lens-blocks.png`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="light" disableTransitionOnChange>
          <Web3Provider>
            <SidebarProvider>
              <AppSidebar />
              <div className="w-full">
                <span className="min-h-8 p-1 bg-warning text-background flex justify-center items-center font-bold text-sm md:text-base text-center">
                  <span>
                    Lens Blocks are currently in beta and{" "}
                    <span className="font-black animate-pulse"> not&nbsp;ready&nbsp;for&nbsp;production use</span>!
                  </span>
                </span>
                <main className="w-full">
                  <Header />
                  <div className="max-w-3xl flex flex-col min-h-svh px-4 md:px-8 pt-4 pb-8 gap-8">{children}</div>
                </main>
                <footer className="w-full max-w-3xl min-h-12 p-4 flex items-center text-center text-sm text-muted-foreground">
                  <span className="w-full content">
                    Built by{" "}
                    <Link href="https://paulburke.co/" target="_blank" rel="noopener">
                      Paul Burke
                    </Link>
                    . Source code available on{" "}
                    <Link href="https://github.com/iPaulPro/lens-blocks" target="_blank" rel="noopener">
                      GitHub
                    </Link>
                    .
                  </span>
                </footer>
              </div>
            </SidebarProvider>
          </Web3Provider>
          <Toaster richColors />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
