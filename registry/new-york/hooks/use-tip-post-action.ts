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
  post: PostId;
  source: PaymentSource;
  amount: string;
  tokenAddress: string;
};

type TipPostActionResult = ResultAsync<
  TxHash,
  SigningError | TransactionIndexingError | UnauthenticatedError | UnexpectedError | ValidationError
>;

export const hasTipped = (post: AnyPost): boolean => "operations" in post && post.operations?.hasTipped === true;

export const useTipPostAction = ({
  sessionClient,
  walletClient,
  useTestnet,
}: {
  sessionClient: SessionClient | null | undefined;
  walletClient: WalletClient | null | undefined;
  useTestnet?: boolean;
}): UseAsyncTask<
  TipPostActionArgs,
  TxHash,
  SigningError | TransactionIndexingError | UnauthenticatedError | UnexpectedError | ValidationError
> => {
  return useAsyncTask((args: TipPostActionArgs): TipPostActionResult => {
    invariant(sessionClient?.isSessionClient(), "You must be authenticated to use this operation");
    invariant(walletClient, "A wallet must be connected to use this operation");

    return ResultAsync.fromSafePromise(walletClient.switchChain({ id: useTestnet ? LensChainTestnetId : LensChainId }))
      .andThen(() => {
        return executePostAction(sessionClient, {
          post: args.post,
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
