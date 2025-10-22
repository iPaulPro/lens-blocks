import {
  EvmAddress,
  evmAddress,
  PaymentSource,
  SessionClient,
  SigningError,
  TransactionIndexingError,
  TxHash,
  UnauthenticatedError,
  UnexpectedError,
  UseAsyncTask,
  ValidationError,
} from "@lens-protocol/react";
import { executeAccountAction } from "@lens-protocol/client/actions";
import { WalletClient } from "viem";
import { LensChainId, LensChainTestnetId, NativeToken } from "@/registry/new-york/lib/lens-utils";
import { handleOperationWith } from "@lens-protocol/client/viem";
import { invariant, ResultAsync } from "@lens-protocol/types";
import { useAsyncTask } from "@/registry/new-york/lib/tasks";

export type TipAccountActionArgs = {
  account: EvmAddress;
  source: PaymentSource;
  amount: string;
  tokenAddress: string;
};

type TipAccountActionResult = ResultAsync<
  TxHash,
  SigningError | TransactionIndexingError | UnauthenticatedError | UnexpectedError | ValidationError
>;

export const useTipAccountAction = ({
  sessionClient,
  walletClient,
  useTestnet,
}: {
  sessionClient: SessionClient | null | undefined;
  walletClient: WalletClient | null | undefined;
  useTestnet?: boolean;
}): UseAsyncTask<
  TipAccountActionArgs,
  TxHash,
  SigningError | TransactionIndexingError | UnauthenticatedError | UnexpectedError | ValidationError
> => {
  return useAsyncTask((args: TipAccountActionArgs): TipAccountActionResult => {
    invariant(sessionClient?.isSessionClient(), "You must be authenticated to use this operation");
    invariant(walletClient, "A wallet must be connected to use this operation");

    return ResultAsync.fromSafePromise(walletClient.switchChain({ id: useTestnet ? LensChainTestnetId : LensChainId }))
      .andThen(() => {
        return executeAccountAction(sessionClient, {
          account: args.account,
          action: {
            tipping: {
              paymentSource: args.source,
              ...(args.tokenAddress === NativeToken
                ? { native: args.amount }
                : { value: args.amount, token: evmAddress(args.tokenAddress) }),
            },
          },
        });
      })
      .andThen(handleOperationWith(walletClient))
      .andThen(sessionClient.waitForTransaction);
  });
};
