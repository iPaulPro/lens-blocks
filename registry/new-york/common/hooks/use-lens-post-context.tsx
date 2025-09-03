import { useContext } from "react";
import { LensPostContext } from "@/registry/new-york/common/lib/lens-post-provider";

export const useLensPostContext = () => {
  const context = useContext(LensPostContext);
  if (!context) {
    throw new Error("usePost must be used within a PostProvider");
  }
  return context;
};
