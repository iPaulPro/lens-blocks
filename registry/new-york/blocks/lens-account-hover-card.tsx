"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/registry/new-york/ui/avatar";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/registry/new-york/ui/hover-card";
import { ReactNode, useEffect, useState } from "react";
import { Account, AccountStats, PublicClient, SessionClient, UnauthenticatedError } from "@lens-protocol/react";
import { fetchAccount, fetchAccountStats, follow, unfollow } from "@lens-protocol/client/actions";
import { formatFollowerCount, parseUri } from "@/registry/new-york/lib/lens-utils";
import { CircleUserRoundIcon } from "lucide-react";
import { WalletClient } from "viem";
import { handleOperationWith } from "@lens-protocol/client/viem";
import { Button } from "@/registry/new-york/ui/button";
import LensMarkdown from "@/registry/new-york/components/common/lens-markdown";

interface Props {
  /**
   * The component that will trigger the hover card when hovered over.
   *
   */
  children?: ReactNode;

  /**
   * The Lens Account to display information about
   */
  account: Account;

  /**
   * The Lens Client used for making public and authenticated calls
   */
  lensClient: PublicClient | SessionClient;

  /**
   * The wallet client from viem used to sign messages for authentication.
   * If not provided, follow/unfollow button will not be rendered.
   */
  walletClient?: WalletClient;

  /**
   * Callback function that is called when the follow operation is successful
   */
  onFollowSuccess?: (account: Account) => void;

  /**
   * Callback function that is called when the unfollow operation is successful
   */
  onUnfollowSuccess?: (account: Account) => void;

  /**
   * Callback function that is called when an error occurs during follow/unfollow operations
   */
  onError?: (account: Account, error: Error) => void;
}

export default function LensAccountHoverCard(props: Props) {
  const { children, account, lensClient, walletClient, onFollowSuccess, onUnfollowSuccess, onError } = props;

  const session = lensClient?.isSessionClient() ? (lensClient as SessionClient) : null;

  const [isOpen, setIsOpen] = useState(false);
  const [accountStats, setAccountStats] = useState<AccountStats>();
  const [showFollowButton, setShowFollowButton] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [freshAccount, setFreshAccount] = useState<Account>(account);

  useEffect(() => {
    if (!isOpen) return;

    const fetchStats = async () => {
      const res = await fetchAccountStats(lensClient, {
        account: account.address,
      });
      if (res.isOk() && res.value) {
        setAccountStats(res.value);
      }
    };

    fetchStats();

    if (!session) return;

    const user = session.getAuthenticatedUser();
    if (user.isOk()) {
      setShowFollowButton(
        freshAccount.operations?.canFollow.__typename === "AccountFollowOperationValidationPassed" ||
          freshAccount.operations?.canUnfollow.__typename === "AccountFollowOperationValidationPassed",
      );
    }
  }, [account, isOpen]);

  const handleUnfollow = async (session: SessionClient) => {
    const res = await unfollow(session, {
      account: freshAccount.address,
    })
      .andThen(handleOperationWith(walletClient))
      .andThen(session.waitForTransaction);
    if (res.isErr()) {
      onError?.(account, res.error);
      return;
    }
    onUnfollowSuccess?.(account);
  };

  const handleFollow = async (session: SessionClient) => {
    const res = await follow(session, {
      account: freshAccount.address,
    })
      .andThen(handleOperationWith(walletClient))
      .andThen(session.waitForTransaction);
    if (res.isErr()) {
      onError?.(account, res.error);
      return;
    }
    onFollowSuccess?.(account);
  };

  const onFollowButtonClick = async () => {
    if (!session) {
      onError?.(account, new UnauthenticatedError());
      return;
    }

    setIsSubmitting(true);

    try {
      if (freshAccount.operations?.isFollowedByMe) {
        await handleUnfollow(session);
      } else {
        await handleFollow(session);
      }
      // Refresh the account data
      const res = await fetchAccount(session, {
        address: freshAccount.address,
      });
      if (res.isOk() && res.value) {
        setFreshAccount(res.value);
      }
    } catch (e) {
      if (e instanceof Error) {
        onError?.(account, e);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <HoverCard open={isOpen} onOpenChange={setIsOpen}>
      <HoverCardTrigger>{children}</HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex flex-col w-full min-w-0">
          <div className="flex justify-between">
            <Avatar className="w-10 h-10">
              <AvatarImage
                src={parseUri(freshAccount.metadata?.picture)}
                alt={"@" + freshAccount.username?.localName}
              />
              <AvatarFallback className="bg-primary">
                <CircleUserRoundIcon className="text-primary-foreground" />
              </AvatarFallback>
            </Avatar>
            {showFollowButton && (
              <Button
                variant={freshAccount.operations?.isFollowedByMe ? "outline" : "default"}
                className="btn group hover:border-destructive"
                onClick={onFollowButtonClick}
              >
                {isSubmitting ? (
                  <span className="loader"></span>
                ) : (
                  <>
                    <span className="hidden group-hover:inline">
                      {freshAccount.operations?.isFollowedByMe ? "Unfollow" : "Follow"}
                    </span>
                    <span className="inline group-hover:hidden">
                      {freshAccount.operations?.isFollowedByMe ? "Following" : "Follow"}
                    </span>
                  </>
                )}
              </Button>
            )}
          </div>
          <div className="flex flex-col pt-2 w-full min-w-0">
            <div className="font-bold text-lg truncate">
              {freshAccount.metadata?.name ??
                (freshAccount.username ? "@" + freshAccount.username.value.replace("lens/", "") : undefined) ??
                freshAccount.address}
            </div>
            <div className="flex flex-wrap gap-2 items-center -mt-0.5">
              {freshAccount.metadata?.name && freshAccount.username && (
                <span className="opacity-60 truncate">{`@${freshAccount.username.value.replace("lens/", "")}`}</span>
              )}
              {freshAccount.operations?.isFollowingMe && (
                <span className="h-5 bg-muted text-muted-foreground rounded-full px-2 text-xs font-semibold flex items-center justify-center">
                  Follows you
                </span>
              )}
            </div>
            {freshAccount.metadata?.bio && (
              <LensMarkdown content={freshAccount.metadata.bio} className="opacity-70 pt-3 pb-1 line-clamp-5 text-sm" />
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
      </HoverCardContent>
    </HoverCard>
  );
}
