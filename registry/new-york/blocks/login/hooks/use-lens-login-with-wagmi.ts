import { WalletClient } from "viem";
import { useState } from "react";
import {
  Account,
  AuthenticatedUser,
  evmAddress,
  LoginError,
  UnexpectedError,
  useLogin,
  useSessionClient,
  useSwitchAccount,
} from "@lens-protocol/react";

type UseLensLoginWithWagmiReturnType = {
  execute: (walletClient: WalletClient, account: Account, appAddress?: string) => Promise<AuthenticatedUser | null>;
  loading: boolean;
  error: LoginError | null;
};

export function useLensLoginWithWagmi(): UseLensLoginWithWagmiReturnType {
  const [error, setError] = useState<LoginError | null>(null);

  const { execute: switchAccount, loading: switchingAccounts } = useSwitchAccount();
  const { execute: executeLogin, loading: loginLoading } = useLogin();
  const { data: sessionClient } = useSessionClient();

  const execute = async (
    walletClient: WalletClient,
    account: Account,
    appAddress?: string,
  ): Promise<AuthenticatedUser | null> => {
    if (loginLoading || switchingAccounts) return null;

    const walletAddress = walletClient.account?.address;
    if (!walletAddress) {
      setError(new UnexpectedError("Wallet client is not available"));
      return null;
    }

    // First attempt to switch accounts, in case of an active session
    if (sessionClient?.isSessionClient()) {
      const switchResult = await switchAccount({
        account: account.address,
      });
      if (switchResult.isOk()) {
        return switchResult.value;
      }
    }

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
      setError(res.error);
      return null;
    }

    return res.value;
  };

  return {
    execute,
    loading: loginLoading,
    error: error,
  };
}
