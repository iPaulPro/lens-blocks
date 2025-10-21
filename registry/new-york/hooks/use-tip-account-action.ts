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
  sessionClient: SessionClient;
  walletClient: WalletClient;
  account: EvmAddress;
  source: PaymentSource;
  amount: string;
  tokenAddress: string;
  useTestnet?: boolean;
};

type TipAccountActionResult = ResultAsync<
  TxHash,
  SigningError | TransactionIndexingError | UnauthenticatedError | UnexpectedError | ValidationError
>;

export const useTipAccountAction = (): UseAsyncTask<
  TipAccountActionArgs,
  TxHash,
  SigningError | TransactionIndexingError | UnauthenticatedError | UnexpectedError | ValidationError
> => {
  return useAsyncTask((args: TipAccountActionArgs): TipAccountActionResult => {
    invariant(args.sessionClient.isSessionClient(), "You must be authenticated to use this operation");

    return tip(
      args.sessionClient,
      args.walletClient,
      args.account,
      args.source,
      args.amount,
      args.tokenAddress,
      args.useTestnet,
    );
  });
};

const tip = (
  session: SessionClient,
  walletClient: WalletClient,
  account: EvmAddress,
  source: PaymentSource,
  amount: string,
  tokenAddress: string,
  isTestnet?: boolean,
): TipAccountActionResult => {
  if (!session.isSessionClient() || !walletClient) {
    throw new UnauthenticatedError();
  }

  return ResultAsync.fromSafePromise(walletClient.switchChain({ id: isTestnet ? LensChainTestnetId : LensChainId }))
    .andThen(() => {
      return executeAccountAction(session, {
        account,
        action: {
          tipping: {
            paymentSource: source,
            ...(tokenAddress === NativeToken ? { native: amount } : { value: amount, token: evmAddress(tokenAddress) }),
          },
        },
      });
    })
    .andThen(handleOperationWith(walletClient))
    .andThen(session.waitForTransaction);
};
