"use client";

import {
  Account,
  AuthenticatedUser,
  LoginError,
  PublicClient,
  SessionClient,
  useAuthenticatedUser,
  useLogout,
} from "@lens-protocol/react";
import { useModal } from "connectkit";
import { useAccount, useDisconnect, useWalletClient } from "wagmi";
import { useCallback, useEffect, useState } from "react";
import config from "@/lib/lens/config";
import { Button } from "@/registry/new-york/ui/button";
import { useLensLoginWithWagmi } from "@/registry/new-york/blocks/account/hooks/use-lens-login-with-wagmi";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/registry/new-york/ui/dialog";
import { LensAccountChooser } from "@/registry/new-york/blocks/account/components/lens-account-chooser";
import { Link2Off } from "lucide-react";

type LoginButtonProps = {
  /**
   * The Lens Client used for making public and authenticated calls
   */
  lensClient: PublicClient | SessionClient;

  /**
   * The address of the app that is logging in.
   * This is optional and can be used to specify the app address.
   */
  appAddress?: string;

  /**
   * Callback function that is called when the user successfully logs in.
   * It receives the authenticated user as an argument.
   */
  onSuccess?: (authenticatedUser: AuthenticatedUser) => void;

  /**
   * Callback function that is called when there is an error during login.
   * It receives the error as an argument.
   */
  onError?: (error: LoginError) => void;
};

export function LensLoginButton(props: LoginButtonProps) {
  const { appAddress, onSuccess, onError, lensClient } = props;

  const [accountChooserOpen, setAccountChooserOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

  const { setOpen: setConnectModalOpen } = useModal({
    onConnect: () => {
      setAccountChooserOpen(true);
    },
  });
  const { address: walletAddress, isConnected, isConnecting, isReconnecting } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: walletClient } = useWalletClient({ chainId: config.chain.id });

  const { execute: login, loading: loginLoading, error: loginError } = useLensLoginWithWagmi();
  const { execute: logout, loading: logoutLoading } = useLogout();
  const { data: authenticatedUser, loading: authenticatedUserLoading } = useAuthenticatedUser();

  useEffect(() => {
    if (loginError && onError) {
      onError(loginError);
    }
  }, [loginError, onError]);

  const onAccountSelected = useCallback(
    async (selectedAccount: Account) => {
      if (authenticatedUserLoading || loginLoading || !walletClient) {
        return;
      }

      setSelectedAccount(selectedAccount);

      const user = await login(walletClient, selectedAccount, appAddress);
      if (user) {
        setAccountChooserOpen(false);
        onSuccess?.(user);
      }
      setSelectedAccount(null);
    },
    [onSuccess, walletClient, authenticatedUserLoading, loginLoading],
  );

  const onLoginButtonClick = () => {
    if (!isConnected) {
      setConnectModalOpen(true);
    } else {
      setAccountChooserOpen(true);
    }
  };

  const onDisconnectButtonClick = async () => {
    disconnect();
    if (lensClient.isSessionClient()) {
      await logout();
    }
  };

  return (
    <>
      <Button onClick={onLoginButtonClick} disabled={isConnecting || isReconnecting}>
        <svg fill="none" viewBox="0 0 64 64" className="text-background">
          <path
            fillRule="evenodd"
            d="M42.311 23.793c1.788-1.654 4.133-2.68 6.745-2.68 5.807.002 10.51 4.71 10.51 10.521 0 5.027-4.973 9.326-6.217 10.316-5.815 4.63-13.39 7.339-21.566 7.339-8.176 0-15.749-2.707-21.565-7.34C8.98 40.96 4 36.653 4 31.634c0-5.811 4.705-10.521 10.507-10.521 2.615 0 4.96 1.026 6.748 2.68l.185-.092c.408-5.422 4.817-9.7 10.343-9.7 5.527 0 9.935 4.278 10.344 9.7l.184.091v.002"
            clipRule="evenodd"
            fill="currentColor"
          />
        </svg>
        <span>Log in with Lens</span>
      </Button>
      {walletAddress && (
        <Dialog open={accountChooserOpen} onOpenChange={setAccountChooserOpen}>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle>Select an account</DialogTitle>
              <DialogDescription>Choose a Lens account to log in with.</DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              <div className="h-48">
                <LensAccountChooser
                  walletAddress={walletAddress}
                  selectedAccount={selectedAccount}
                  onAccountSelected={onAccountSelected}
                />
              </div>
              <Button
                variant="secondary"
                size="sm"
                className="w-fit text-xs hover:bg-destructive/90 hover:text-white z-10"
                disabled={logoutLoading}
                onClick={() => onDisconnectButtonClick()}
              >
                {logoutLoading ? (
                  <>
                    <Link2Off className="size-3" />
                    Disconnecting...
                  </>
                ) : (
                  <>
                    <Link2Off className="size-3" />
                    Disconnect Wallet
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
