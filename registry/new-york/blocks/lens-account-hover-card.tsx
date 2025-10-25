"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/registry/new-york/ui/avatar";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/registry/new-york/ui/hover-card";
import { ReactNode, useEffect, useState } from "react";
import { Account, AccountStats, mainnet, PublicClient, SessionClient, testnet, TxHash } from "@lens-protocol/react";
import { fetchAccount, fetchAccountStats } from "@lens-protocol/client/actions";
import { formatFollowerCount, parseUri } from "@/registry/new-york/lib/lens-utils";
import { CircleUserRoundIcon } from "lucide-react";
import { WalletClient } from "viem";
import { LensMarkdown } from "@/registry/new-york/components/common/lens-markdown";
import { LensFollowButton } from "@/registry/new-york/components/account/lens-follow-button";
import { Skeleton } from "@/registry/new-york/ui/skeleton";
import { Result } from "@/registry/new-york/lib/result";

interface Props {
  /**
   * The component that will trigger the hover card when hovered over.
   *
   */
  children?: ReactNode;

  /**
   * The Lens Account to display information about
   */
  accountRes: Account | Result<Account>;

  /**
   * The Lens Client used for making public and authenticated calls
   */
  session: Result<SessionClient>;

  /**
   * The wallet client from viem used to sign messages for authentication.
   * If not provided, follow/unfollow button will not be rendered.
   */
  wallet?: { data: WalletClient | undefined | null; isLoading?: boolean; error?: unknown };

  publicClient?: PublicClient;

  /**
   * Callback function that is called when the follow operation is successful
   */
  onFollowSuccess?: (account: Account, txHash: TxHash) => void;

  /**
   * Callback function that is called when the unfollow operation is successful
   */
  onUnfollowSuccess?: (account: Account, txHash: TxHash) => void;

  /**
   * Callback function that is called when an error occurs during follow/unfollow operations
   */
  onError?: (account: Account, error: Error) => void;

  useTestnet?: boolean;
}

export const LensAccountHoverCard = ({
  children,
  accountRes,
  session,
  wallet,
  publicClient,
  onFollowSuccess,
  onUnfollowSuccess,
  onError,
  useTestnet,
}: Props) => {
  const sessionClient = session.data;

  const [isOpen, setIsOpen] = useState(false);
  const [accountStats, setAccountStats] = useState<AccountStats>();
  const [showFollowButton, setShowFollowButton] = useState(false);
  const [account, setAccount] = useState<Account | null | undefined>(
    "data" in accountRes ? accountRes.data : accountRes,
  );

  const isLoading = "loading" in accountRes ? accountRes.loading : false;

  const lensClient =
    publicClient ??
    PublicClient.create({
      environment: useTestnet ? testnet : mainnet,
    });

  useEffect(() => {
    setAccount("data" in accountRes ? accountRes.data : accountRes);
  }, [accountRes]);

  useEffect(() => {
    const fetchStats = async () => {
      console.log("fetching stats for", account?.address);
      if (!isOpen || !account) return;
      const res = await fetchAccountStats(lensClient, {
        account: account.address,
      });
      console.log("fetched stats", res);
      if (res.isOk() && res.value) {
        setAccountStats(res.value);
      }
    };
    fetchStats();
  }, [account, isOpen]);

  useEffect(() => {
    if (!isOpen || !sessionClient) return;

    const user = sessionClient.getAuthenticatedUser();
    if (user.isOk()) {
      setShowFollowButton(
        account?.operations?.canFollow.__typename === "AccountFollowOperationValidationPassed" ||
          account?.operations?.canUnfollow.__typename === "AccountFollowOperationValidationPassed",
      );
    }
  }, [sessionClient, account?.operations]);

  const updateAccount = async () => {
    if (!account) return;
    const client = sessionClient ?? lensClient;
    const res = await fetchAccount(client, {
      address: account.address,
    });
    if (res.isOk() && res.value) {
      setAccount(res.value);
    }
  };

  const handleFollowSuccess = async (txHash: TxHash) => {
    await updateAccount();
    if (account) {
      onFollowSuccess?.(account, txHash);
    }
  };

  const handleUnfollowSuccess = async (txHash: TxHash) => {
    await updateAccount();
    if (account) {
      onUnfollowSuccess?.(account, txHash);
    }
  };

  return (
    <HoverCard open={isOpen} onOpenChange={setIsOpen}>
      <HoverCardTrigger>{children}</HoverCardTrigger>
      <HoverCardContent className="w-80">
        {!account || isLoading ? (
          <HoverCardSkeleton />
        ) : (
          <div className="flex flex-col w-full min-w-0">
            <div className="flex justify-between">
              <Avatar className="w-10 h-10">
                <AvatarImage src={parseUri(account.metadata?.picture)} alt={"@" + account.username?.localName} />
                <AvatarFallback className="bg-primary">
                  <CircleUserRoundIcon className="text-primary-foreground" />
                </AvatarFallback>
              </Avatar>
              {showFollowButton && (
                <LensFollowButton
                  accountRes={accountRes}
                  session={session}
                  wallet={wallet}
                  onFollowSuccess={(_account, txHash) => handleFollowSuccess(txHash)}
                  onUnfollowSuccess={(_account, txHash) => handleUnfollowSuccess(txHash)}
                  onFollowError={onError}
                />
              )}
            </div>
            <div className="flex flex-col pt-2 w-full min-w-0">
              <div className="font-bold text-lg truncate">
                {account.metadata?.name ??
                  (account.username ? "@" + account.username.value.replace("lens/", "") : undefined) ??
                  account.address}
              </div>
              <div className="flex flex-wrap gap-2 items-center -mt-0.5">
                {account.metadata?.name && account.username && (
                  <span className="opacity-60 truncate">{`@${account.username.value.replace("lens/", "")}`}</span>
                )}
                {account.operations?.isFollowingMe && (
                  <span className="h-5 bg-muted text-muted-foreground rounded-full px-2 text-xs font-semibold flex items-center justify-center">
                    Follows you
                  </span>
                )}
              </div>
              {account.metadata?.bio && (
                <LensMarkdown content={account.metadata.bio} className="opacity-70 pt-3 pb-1 line-clamp-5 text-sm" />
              )}
              {accountStats && (
                <div className="flex gap-3 pt-2 text-sm">
                  <div className="flex gap-1">
                    <span className="font-bold">{formatFollowerCount(accountStats.graphFollowStats.following)}</span>
                    <span className="opacity-60">following</span>
                  </div>
                  <div className="flex gap-1">
                    <span className="font-bold">{formatFollowerCount(accountStats.graphFollowStats.followers)}</span>
                    <span className="opacity-60">followers</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </HoverCardContent>
    </HoverCard>
  );
};

const HoverCardSkeleton = () => {
  return (
    <div className="w-full flex flex-col w-full min-w-0 gap-1">
      <div className="w-full flex justify-between">
        <Skeleton className="w-10 h-10 rounded-full" />
        <Skeleton className="w-28 h-8 rounded-full" />
      </div>
      <div className="w-full flex flex-col pt-2 w-full min-w-0 gap-2">
        <Skeleton className="h-5 w-32 rounded-full" />
        <Skeleton className="h-4 w-20 rounded-full" />
      </div>
      <div className="flex flex-col gap-1.5 mt-3">
        <Skeleton className="w-11/12 h-4 rounded-full" />
        <Skeleton className="w-full h-4 rounded-full" />
        <Skeleton className="w-2/3 h-4 rounded-full" />
      </div>
      <div className="w-full flex gap-2 text-sm mt-3">
        <div className="w-full flex gap-1">
          <Skeleton className="h-4 w-8 rounded-full" />
          <Skeleton className="h-4 w-16 rounded-full" />
        </div>
        <div className="w-full flex gap-1">
          <Skeleton className="h-4 w-8 rounded-full" />
          <Skeleton className="h-4 w-16 rounded-full" />
        </div>
      </div>
    </div>
  );
};
