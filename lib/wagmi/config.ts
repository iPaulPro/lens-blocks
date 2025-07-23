import { http, createConfig } from "wagmi";
import { chains } from "@lens-chain/sdk/viem";
import { getDefaultConfig } from "connectkit";
import lensConfig from "../lens/config";

export const config = createConfig(
  getDefaultConfig({
    chains: [lensConfig.lens.chain],
    ...(process.env.NEXT_PUBLIC_ALCHEMY_ID && {
      transports: {
        [chains.mainnet.id]: http(`https://lens-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ID}`),
        [chains.testnet.id]: http(`https://lens-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ID}`),
      },
    }),

    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,

    appName: process.env.NEXT_PUBLIC_APP_NAME || "clens demo",
    appUrl: process.env.NEXT_PUBLIC_APP_URL || "https://clens.dev",
  }),
);
