"use client";

import { useState } from "react";
import { Button } from "@/registry/new-york/ui/button";
import { Account, SessionClient, TxHash, UnauthenticatedError } from "@lens-protocol/react";
import { follow, unfollow } from "@lens-protocol/client/actions";
import { handleOperationWith } from "@lens-protocol/client/viem";
import { WalletClient } from "viem";
import { Spinner } from "@/registry/new-york/ui/spinner";

type Props = {
  account: Account;
  session: SessionClient | undefined | null;
  walletClient?: WalletClient;
  onFollowSuccess?: (account: Account, txHash: TxHash) => void;
  onUnfollowSuccess?: (account: Account, txHash: TxHash) => void;
  onFollowError?: (account: Account, error: Error) => void;
};

export default function LensFollowButton({ ...props }: Props) {
  const { account, session, walletClient, onFollowSuccess, onUnfollowSuccess, onFollowError } = props;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [optimisticIsFollowed, setOptimisticIsFollowed] = useState<boolean>(
    account.operations?.isFollowedByMe ?? false,
  );

  const handleUnfollow = async (session: SessionClient) => {
    const res = await unfollow(session, {
      account: account.address,
    })
      .andThen(handleOperationWith(walletClient))
      .andThen(session.waitForTransaction);
    if (res.isErr()) {
      onFollowError?.(account, res.error);
      return;
    }
    setOptimisticIsFollowed(false);
    onUnfollowSuccess?.(account, res.value);
  };

  const handleFollow = async (session: SessionClient) => {
    const res = await follow(session, {
      account: account.address,
    })
      .andThen(handleOperationWith(walletClient))
      .andThen(session.waitForTransaction);
    if (res.isErr()) {
      onFollowError?.(account, res.error);
      return;
    }
    setOptimisticIsFollowed(true);
    onFollowSuccess?.(account, res.value);
  };

  const onFollowButtonClick = async () => {
    if (!session) {
      onFollowError?.(account, new UnauthenticatedError());
      return;
    }

    setIsSubmitting(true);

    try {
      if (optimisticIsFollowed) {
        await handleUnfollow(session);
      } else {
        await handleFollow(session);
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
      disabled={isSubmitting}
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
}
