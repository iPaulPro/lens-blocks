"use client";

import { ReactNode } from "react";
import { LensProvider } from "@lens-protocol/react";
import { lensClient } from "@/lib/lens/client";
import { WagmiProvider } from "wagmi";
import { config as wagmiConfig } from "@/lib/wagmi/config";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider } from "connectkit";
import { useTheme } from "next-themes";

const queryClient = new QueryClient();

export default function Web3Provider({ children }: { children: ReactNode }) {
  const { theme: nextTheme } = useTheme();

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider mode={nextTheme === "system" ? "auto" : (nextTheme as "light" | "dark")}>
          <LensProvider client={lensClient}>{children}</LensProvider>
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
