import { EnvironmentConfig } from "@lens-protocol/react";
import { Chain } from "viem";

export interface LensConfig {
  isTestnet: boolean;
  environment: EnvironmentConfig;
  chain: Chain;
}
