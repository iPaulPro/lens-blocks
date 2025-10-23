"use client";

import { LensLoginButton } from "@/registry/new-york/components/account/lens-login-button";
import {
  Account,
  AuthenticatedUser,
  LoginError,
  SessionClient,
  useAuthenticatedUser,
  useLogout,
} from "@lens-protocol/react";
import { Link2Off } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/registry/new-york/ui/dialog";
import { LensAccountChooser } from "@/registry/new-york/components/account/lens-account-chooser";
import { Button } from "@/registry/new-york/ui/button";
import { useAccount, useDisconnect } from "wagmi";
import { useCallback, useEffect, useState } from "react";
import { useModal } from "connectkit";
import { useLensLoginWithViem } from "@/registry/new-york/hooks/use-lens-login-with-viem";
import { WalletClient } from "viem";
import { Result } from "@/registry/new-york/lib/result";

type LensLoginProps = {
  /**
   * The Lens Client used for making public and authenticated calls
   */
  session: Result<SessionClient>;

  /**
   * The wallet client from viem used to sign messages for authentication.
   * If not provided, follow/unfollow button will not be rendered.
   */
  wallet?: { data: WalletClient | undefined | null; isLoading?: boolean; error?: unknown };

  /**
   * The address of the app registered with Lens.
   */
  appAddress?: string;

  /**
   * Callback function that is called when the user successfully logs in.
   */
  onSuccess?: (authenticatedUser: AuthenticatedUser) => void;

  /**
   * Callback function that is called when there is an error during login.
   */
  onError?: (error: LoginError) => void;
};

export const LensLogin = (props: LensLoginProps) => {
  const { session, wallet, appAddress, onSuccess, onError } = props;
  const walletClient = wallet?.data;
  const sessionClient = session.data;

  const [accountChooserOpen, setAccountChooserOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

  const { loading: authenticatedUserLoading } = useAuthenticatedUser();
  const { execute: login, loading: loginLoading, error: loginError } = useLensLoginWithViem({ sessionClient });
  const { execute: logout, loading: logoutLoading } = useLogout();
  const { address: walletAddress, isConnected, isConnecting, isReconnecting } = useAccount();
  const { disconnect } = useDisconnect();
  const { setOpen: setConnectModalOpen } = useModal({
    onConnect: () => {
      setAccountChooserOpen(true);
    },
  });

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
    if (sessionClient?.isSessionClient()) {
      await logout();
    }
  };

  return (
    <>
      <LensLoginButton onClick={onLoginButtonClick} disabled={isConnecting || isReconnecting} />
      {walletAddress && (
        <Dialog open={accountChooserOpen} onOpenChange={setAccountChooserOpen}>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader className="border-b">
              <DialogTitle>Select an account</DialogTitle>
              <DialogDescription>Choose a Lens account to log in with.</DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4 px-4 pb-4">
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
};
