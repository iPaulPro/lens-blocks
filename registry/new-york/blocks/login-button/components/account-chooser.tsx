"use client";

import { Account, Cursor, evmAddress, PageSize, useAccountsAvailable } from "@lens-protocol/react";
import { useState } from "react";
import PaginatedList from "@/registry/new-york/blocks/login-button/lib/paginated-list";
import { LensAccountListItem } from "@/registry/new-york/blocks/login-button/components/lens-account-list-item";

type AccountSelectorProps = {
  walletAddress: string;
  setSelectedAccount: (account: Account) => void;
};

export const AccountChooser = ({ walletAddress, setSelectedAccount }: AccountSelectorProps) => {
  const [cursor, setCursor] = useState<Cursor | null>(null);

  const { data, loading, error } = useAccountsAvailable({
    managedBy: evmAddress(walletAddress),
    pageSize: PageSize.Fifty,
    cursor,
  });

  return (
    <PaginatedList
      data={data}
      loading={loading}
      error={error}
      cursor={cursor}
      setCursor={setCursor}
      emptyMessage="No accounts available"
      errorMessage="Error loading accounts"
      renderItem={item => (
        <LensAccountListItem account={item.account} onAccountSelected={setSelectedAccount} key={item.account.address} />
      )}
    />
  );
};
