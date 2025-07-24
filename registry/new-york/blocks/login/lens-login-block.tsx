"use client";

import { LensLoginButton } from "@/registry/new-york/blocks/login/components/lens-login-button";
import { AuthenticatedUser, PublicClient, SessionClient } from "@lens-protocol/react";

type LensLoginBlockProps = {
  lensClient: PublicClient | SessionClient;
};

export function LensLoginBlock({ lensClient }: LensLoginBlockProps) {
  // Callback function that is called when the user successfully logs in
  const onLoginSuccess = (authenticatedUser: AuthenticatedUser) => {
    console.log("Login successful for user:", authenticatedUser);
  };

  // You can handle errors here if needed
  const onLoginError = (error: Error) => {
    console.error("Login failed with error:", error);
  };

  return <LensLoginButton lensClient={lensClient} onSuccess={onLoginSuccess} onError={onLoginError} />;
}
