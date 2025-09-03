import { EnvironmentConfig, mainnet, testnet } from "@lens-protocol/react";
import { chains } from "@lens-chain/sdk/viem";
import { Chain } from "viem";

interface LensConfig {
  isTestnet: boolean;
  environment: EnvironmentConfig;
  chain: Chain;
}

const isTestnet = process.env.NEXT_PUBLIC_LENS_USE_TESTNET === "true";

const config: LensConfig = {
  isTestnet,
  environment: isTestnet ? testnet : mainnet,
  chain: isTestnet ? chains.testnet : chains.mainnet,
};

export default config;
