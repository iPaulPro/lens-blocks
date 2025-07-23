"use client";

import {
  Account,
  AccountAvailable,
  AuthenticatedUser,
  EnvironmentConfig,
  LoginError,
  PageSize,
  PublicClient,
  UnexpectedError,
  testnet,
  evmAddress,
  useAuthenticatedUser,
  useLogin,
  useSwitchAccount,
} from "@lens-protocol/react";
import { fetchAccountsAvailable, lastLoggedInAccount } from "@lens-protocol/client/actions";
import { useModal } from "connectkit";
import { useAccount, useWalletClient } from "wagmi";
import { useEffect, useState } from "react";
import config from "@/lib/lens/config";
import { Button } from "@/registry/new-york/ui/button";

type LoginButtonProps = {
  /**
   * Called when there are multiple accounts available for the connected wallet. When the wallet is connected,
   * all available accounts are fetched and if there is only one account available, it is automatically selected.
   * Otherwise, this function is called to show a modal or UI component that allows the user to select an account.
   * Once an account is selected, the `selectedAccount` prop should be updated with the chosen account.
   */
  onShowAccountPicker: () => void;

  /**
   * The account that should be used to complete log in. See `onShowAccountPicker` for more details.
   */
  selectedAccount: Account | null;

  /**
   * The environment configuration for the Lens client.
   * Defaults to testnet if not provided.
   */
  environment?: EnvironmentConfig;

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

export function LoginButton(props: LoginButtonProps) {
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(props.selectedAccount);

  const { setOpen: setConnectModalOpen, open: modalOpen } = useModal();
  const { address: walletAddress, isConnected, isConnecting, isReconnecting, isDisconnected } = useAccount();
  const { data: walletClient } = useWalletClient({ chainId: config.lens.chain.id });

  const { execute: executeLogin, loading: loginLoading, error: loginError } = useLogin();
  const { data: authenticatedUser, loading: authenticatedUserLoading } = useAuthenticatedUser();
  const { execute: switchAccount } = useSwitchAccount();

  const { onShowAccountPicker, appAddress, onSuccess, onError, environment = testnet } = props;

  const lensClient = PublicClient.create({ environment });

  useEffect(() => {
    if (props.selectedAccount) {
      setSelectedAccount(props.selectedAccount);
    }
  }, [props.selectedAccount]);

  useEffect(() => {
    if (loginError) {
      onError?.(loginError);
    }
  }, [loginError, onError]);

  const getLastLoggedInAccount = async (walletAddress: string) => {
    const res = await lastLoggedInAccount(lensClient, {
      address: evmAddress(walletAddress),
    });
    if (res.isErr()) {
      return null;
    }
    return res.value;
  };

  const getAccountsAvailable = async (walletAddress: string): Promise<AccountAvailable[]> => {
    const res = await fetchAccountsAvailable(lensClient, {
      managedBy: evmAddress(walletAddress),
      pageSize: PageSize.Ten,
    });

    if (res.isErr()) {
      return [];
    }

    return [...res.value.items];
  };

  useEffect(() => {
    if (authenticatedUser?.address || authenticatedUserLoading || !walletClient) return;

    const walletAddress = walletClient.account.address;

    const fetchData = async () => {
      const lastAccount = await getLastLoggedInAccount(walletAddress);
      if (lastAccount) {
        await login(lastAccount);
        return;
      }

      const accounts = await getAccountsAvailable(walletAddress);
      if (accounts.length === 1) {
        await login(accounts[0]!.account);
      } else {
        onShowAccountPicker();
      }
    };

    fetchData().catch(error => {
      onError?.(new UnexpectedError("Error fetching account data for connected wallet", error));
    });
  }, [walletClient, authenticatedUser?.address, authenticatedUserLoading]);

  const login = async (account: Account) => {
    if (!walletClient) {
      onError?.(new UnexpectedError("Wallet client is not available"));
      return;
    }

    // First attempt to switch accounts, in case of an active session
    const switchResult = await switchAccount({
      account: account.address,
    });
    if (switchResult.isOk()) {
      onSuccess?.(switchResult.value);
      setConnectModalOpen(false);
      return;
    }

    const walletAddress = walletClient.account.address;

    const res = await executeLogin({
      ...(account.owner === walletAddress
        ? {
            accountOwner: {
              owner: evmAddress(walletAddress),
              account: evmAddress(account.address),
              ...(appAddress && {
                app: evmAddress(appAddress),
              }),
            },
          }
        : {
            accountManager: {
              manager: evmAddress(walletAddress),
              account: evmAddress(account.address),
              ...(appAddress && {
                app: evmAddress(appAddress),
              }),
            },
          }),
      signMessage: async (message: string) => {
        return walletClient.signMessage({ account: walletAddress, message });
      },
    });

    if (res.isErr()) {
      onError?.(res.error);
      return;
    }

    onSuccess?.(res.value);
    setConnectModalOpen(false);
  };

  useEffect(() => {
    if (authenticatedUser?.address || authenticatedUserLoading || loginLoading || !walletClient || !selectedAccount)
      return;
    login(selectedAccount).catch(error => onError?.(new UnexpectedError(error)));
    setSelectedAccount(null);
  }, [authenticatedUser?.address, authenticatedUserLoading, walletClient, selectedAccount, loginLoading]);

  const onLoginButtonClick = () => {
    if (isConnected && !authenticatedUser) {
      onShowAccountPicker();
    } else {
      setConnectModalOpen(true);
    }
  };

  return (
    <Button onClick={onLoginButtonClick}>
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
  );
}
