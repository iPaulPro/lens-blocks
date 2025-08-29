"use client";

import { LensLoginButton } from "@/registry/new-york/blocks/account/components/lens-login-button";
import { AuthenticatedUser, useSessionClient } from "@lens-protocol/react";
import { lensClient } from "@/lib/lens/client";
import { Loader } from "lucide-react";
import { toast } from "sonner";

export function LensLoginBlock() {
  const { data: sessionClient, loading: sessionLoading } = useSessionClient();

  // Callback function that is called when the user successfully logs in
  const onLoginSuccess = (authenticatedUser: AuthenticatedUser) => {
    console.log("Login successful for user:", authenticatedUser);
    toast.success(`Login success!`);
  };

  // You can handle errors here if needed
  const onLoginError = (error: Error) => {
    console.error("Login failed with error:", error);
    toast.error(`Login failed: ${error.message}`);
  };

  if (sessionLoading && !sessionClient) {
    return <Loader className="animate-spin w-4 h-4 text-muted-foreground" />;
  }

  return <LensLoginButton lensClient={sessionClient ?? lensClient} onSuccess={onLoginSuccess} onError={onLoginError} />;
}
