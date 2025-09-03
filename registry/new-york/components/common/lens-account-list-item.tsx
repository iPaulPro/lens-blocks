"use client";

import { Account, AuthenticatedUser } from "@lens-protocol/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/registry/new-york/ui/avatar";
import { UserCircle2, ChevronRight, Loader, CheckCircle2Icon } from "lucide-react";
import { truncateAddress } from "@/registry/new-york/lib/lens-utils";
import { ReactNode } from "react";

type LensAccountListItemProps = {
  account: Account;
  selectedAccount?: Account | null;
  onAccountSelected?: (account: Account) => void;
  authenticatedUser?: AuthenticatedUser | null;
  showChevron?: boolean;
  renderDivider?: () => ReactNode;
};

export function LensAccountListItem({
  account,
  selectedAccount,
  onAccountSelected,
  authenticatedUser,
  showChevron = true,
  renderDivider,
}: LensAccountListItemProps) {
  const isAuthenticated = authenticatedUser?.address.toLowerCase() === account.address.toLowerCase();
  const isSelected = onAccountSelected && isAuthenticated;

  const Divider = renderDivider;

  return (
    <div>
      <button
        type="button"
        disabled={selectedAccount?.address !== undefined || isSelected}
        onClick={() => onAccountSelected?.(account)}
        className={`w-full flex items-center text-start p-2 gap-2 enabled:cursor-pointer enabled:hover:bg-neutral-100 enabled:focus:bg-neutral-100 focus:outline-0 rounded-sm ${isSelected ? "border" : "disabled:opacity-45"}`}
      >
        <Avatar className="flex-none w-10 h-10">
          <AvatarImage src={account.metadata?.picture} alt="Account avatar" />
          <AvatarFallback>
            <UserCircle2 className="w-10 h-10 opacity-45" />
          </AvatarFallback>
        </Avatar>
        <div className="flex-grow flex flex-col w-full min-w-0">
          <div className="flex gap-1 items-center">
            <span className="text-sm font-semibold">
              {account.metadata?.name ?? account.username?.localName ?? "[anonymous]"}
            </span>
          </div>
          <span className="text-xs opacity-65 truncate">
            {account.metadata?.name ? "@" + account.username?.localName : truncateAddress(account.address)}
          </span>
        </div>
        {selectedAccount?.address == account.address ? (
          <Loader className="animate-spin flex-none opacity-45 w-4 h-4" />
        ) : showChevron && isSelected ? (
          <CheckCircle2Icon className="flex-none opacity-45 w-4 h-4 text-accent-foreground" />
        ) : (
          showChevron && <ChevronRight className="flex-none opacity-45 w-4 h-4" />
        )}
      </button>
      {Divider && <Divider />}
    </div>
  );
}
