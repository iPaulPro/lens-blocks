import {
  AnyPost,
  evmAddress,
  PaymentSource,
  PostId,
  SessionClient,
  SigningError,
  TransactionIndexingError,
  TxHash,
  UnauthenticatedError,
  UnexpectedError,
  UseAsyncTask,
  ValidationError,
} from "@lens-protocol/react";
import { executePostAction } from "@lens-protocol/client/actions";
import { WalletClient } from "viem";
import { LensChainId, LensChainTestnetId, NativeToken } from "@/registry/new-york/lib/lens-utils";
import { handleOperationWith } from "@lens-protocol/client/viem";
import { invariant, ResultAsync } from "@lens-protocol/types";
import { useAsyncTask } from "@/registry/new-york/lib/tasks";

export type TipPostActionArgs = {
  sessionClient: SessionClient;
  walletClient: WalletClient;
  post: PostId;
  source: PaymentSource;
  amount: string;
  tokenAddress: string;
  isTestnet?: boolean;
};

type TipPostActionResult = ResultAsync<
  TxHash,
  SigningError | TransactionIndexingError | UnauthenticatedError | UnexpectedError | ValidationError
>;

export function hasTipped(post: AnyPost): boolean {
  return "operations" in post && post.operations?.hasTipped === true;
}

export const useTipPostAction = (): UseAsyncTask<
  TipPostActionArgs,
  TxHash,
  SigningError | TransactionIndexingError | UnauthenticatedError | UnexpectedError | ValidationError
> => {
  return useAsyncTask((args: TipPostActionArgs): TipPostActionResult => {
    invariant(args.sessionClient.isSessionClient(), "You must be authenticated to use this operation");

    return tip(
      args.sessionClient,
      args.walletClient,
      args.post,
      args.source,
      args.amount,
      args.tokenAddress,
      args.isTestnet,
    );
  });
};

const tip = (
  session: SessionClient,
  walletClient: WalletClient,
  post: PostId,
  source: PaymentSource,
  amount: string,
  tokenAddress: string,
  isTestnet: boolean = false,
): TipPostActionResult => {
  if (!session.isSessionClient() || !walletClient) {
    throw new UnauthenticatedError();
  }

  return ResultAsync.fromSafePromise(walletClient.switchChain({ id: isTestnet ? LensChainTestnetId : LensChainId }))
    .andThen(() => {
      return executePostAction(session, {
        post: post,
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
