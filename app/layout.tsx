import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ReactNode } from "react";
import Web3Provider from "./web3-provider";
import { Toaster } from "@/registry/new-york/ui/sonner";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { SidebarProvider, SidebarTrigger } from "@/registry/new-york/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import DarkModeSwitch from "@/app/dark-mode-switch";

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
              <main className="w-full relative">
                <SidebarTrigger />
                {children}
                <DarkModeSwitch className="fixed top-4 right-4" />
              </main>
            </SidebarProvider>
          </Web3Provider>
          <Toaster richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
