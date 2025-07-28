"use client";

import {
  Account,
  AccountAvailable,
  Cursor,
  evmAddress,
  PageSize,
  Paginated,
  useAccountsAvailable,
  useAuthenticatedUser,
} from "@lens-protocol/react";
import { useState } from "react";
import PaginatedList from "@/registry/new-york/blocks/account/lib/paginated-list";
import { LensAccountListItem } from "@/registry/new-york/blocks/account/components/lens-account-list-item";
import { LensAccountListItemSkeleton } from "@/registry/new-york/blocks/account/components/lens-account-list-item-skeleton";

type AccountChooserProps = {
  walletAddress: string;
  selectedAccount?: Account | null;
  onAccountSelected?: (account: Account) => void;
};

export const LensAccountChooser = ({ walletAddress, selectedAccount, onAccountSelected }: AccountChooserProps) => {
  const [cursor, setCursor] = useState<Cursor | null>(null);

  const { data, loading, error } = useAccountsAvailable({
    managedBy: evmAddress(walletAddress),
    pageSize: PageSize.Fifty,
    cursor,
  });

  const { data: authenticatedUser } = useAuthenticatedUser();

  const sortFn = (a: AccountAvailable, b: AccountAvailable) => {
    const authAddress = authenticatedUser?.address.toLowerCase();
    const aAddress = a.account.address.toLowerCase();
    const bAddress = b.account.address.toLowerCase();

    if (aAddress === authAddress) return -1;
    if (bAddress === authAddress) return 1;

    if (a.account.metadata?.name) {
      if (b.account.metadata?.name) {
        return a.account.metadata.name.localeCompare(b.account.metadata.name);
      }
      return a.account.metadata.name.localeCompare(b.account.username?.localName || "");
    }
    if (a.account.username?.localName) {
      return a.account.username.localName.localeCompare(b.account.username?.localName || "");
    }
    return a.account.address.localeCompare(b.account.address);
  };

  return (
    <PaginatedList
      className="border rounded-md px-2"
      data={data}
      loading={loading}
      error={error}
      cursor={cursor}
      setCursor={setCursor}
      emptyMessage="No accounts available"
      errorMessage="Error loading accounts"
      sortFn={sortFn}
      renderItem={(item, index) => (
        <LensAccountListItem
          account={item.account}
          selectedAccount={selectedAccount}
          onAccountSelected={onAccountSelected}
          authenticatedUser={authenticatedUser}
          key={item.account.address}
        />
      )}
      renderSkeleton={() => (
        <div className={"flex flex-col gap-0.5 max-h-full overflow-x-hidden"}>
          {Array.from({ length: 3 }).map((_, index) => (
            <LensAccountListItemSkeleton key={index} />
          ))}
        </div>
      )}
    />
  );
};
