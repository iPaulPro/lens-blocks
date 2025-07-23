import { PublicClient } from "@lens-protocol/react";
import config from "./config";

export const lensClient = PublicClient.create({
  environment: config.lens.environment,
  ...(typeof window !== "undefined" ? { storage: window.localStorage } : {}),
});
