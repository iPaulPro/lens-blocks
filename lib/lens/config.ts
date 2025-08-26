import { mainnet, testnet } from "@lens-protocol/react";
import { chains } from "@lens-chain/sdk/viem";
import { LensConfig } from "@/registry/new-york/common/lib/lens-config";

const isTestnet = process.env.NEXT_PUBLIC_LENS_USE_TESTNET === "true";

const config: LensConfig = {
  isTestnet,
  environment: isTestnet ? testnet : mainnet,
  chain: isTestnet ? chains.testnet : chains.mainnet,
};

export default config;
