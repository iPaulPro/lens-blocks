"use client";

import { useState } from "react";
import { Button } from "@/registry/new-york/ui/button";
import { Account, SessionClient, TxHash, UnauthenticatedError } from "@lens-protocol/react";
import { follow, unfollow } from "@lens-protocol/client/actions";
import { handleOperationWith } from "@lens-protocol/client/viem";
import { WalletClient } from "viem";
import { Spinner } from "@/registry/new-york/ui/spinner";
import { Result } from "@/registry/new-york/lib/result";

type Props = {
  accountRes?: Result<Account>;
  session: Result<SessionClient>;
  wallet?: { data: WalletClient | undefined | null; isLoading?: boolean; error?: unknown };
  onFollowSuccess?: (account: Account, txHash: TxHash) => void;
  onUnfollowSuccess?: (account: Account, txHash: TxHash) => void;
  onFollowError?: (account: Account, error: Error) => void;
};

export const LensFollowButton = ({ ...props }: Props) => {
  const { accountRes, session, wallet, onFollowSuccess, onUnfollowSuccess, onFollowError } = props;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const account = accountRes?.data;
  const sessionClient = session?.data;
  const walletClient = wallet?.data;

  const [optimisticIsFollowed, setOptimisticIsFollowed] = useState<boolean>(
    account?.operations?.isFollowedByMe ?? false,
  );

  const handleUnfollow = async () => {
    if (!account || !sessionClient) return;

    if (!walletClient) {
      onFollowError?.(account, new Error("Wallet client is not available"));
      return;
    }

    const res = await unfollow(sessionClient, {
      account: account.address,
    })
      .andThen(handleOperationWith(walletClient))
      .andThen(sessionClient.waitForTransaction);

    if (res.isErr()) {
      onFollowError?.(account, res.error);
      return;
    }

    setOptimisticIsFollowed(false);
    onUnfollowSuccess?.(account, res.value);
  };

  const handleFollow = async () => {
    if (!account || !sessionClient) return;

    if (!walletClient) {
      onFollowError?.(account, new Error("Wallet client is not available"));
      return;
    }

    const res = await follow(sessionClient, {
      account: account.address,
    })
      .andThen(handleOperationWith(walletClient))
      .andThen(sessionClient.waitForTransaction);

    if (res.isErr()) {
      onFollowError?.(account, res.error);
      return;
    }

    setOptimisticIsFollowed(true);
    onFollowSuccess?.(account, res.value);
  };

  const onFollowButtonClick = async () => {
    if (!account) return;

    if (!session) {
      onFollowError?.(account, new UnauthenticatedError());
      return;
    }

    setIsSubmitting(true);

    try {
      if (optimisticIsFollowed) {
        await handleUnfollow();
      } else {
        await handleFollow();
      }
    } catch (e) {
      if (e instanceof Error) {
        onFollowError?.(account, e);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Button
      variant={optimisticIsFollowed ? "outline" : "default"}
      className="group hover:border-destructive"
      onClick={onFollowButtonClick}
      disabled={isSubmitting || accountRes?.loading || session?.loading || wallet?.isLoading}
    >
      {isSubmitting ? (
        <>
          <Spinner /> {optimisticIsFollowed ? "Unfollowing..." : "Following..."}
        </>
      ) : (
        <>
          <span className="hidden group-hover:inline">{optimisticIsFollowed ? "Unfollow" : "Follow"}</span>
          <span className="inline group-hover:hidden">{optimisticIsFollowed ? "Following" : "Follow"}</span>
        </>
      )}
    </Button>
  );
};
