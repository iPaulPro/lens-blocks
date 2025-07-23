import {Account} from '@lens-protocol/react'

type LensAccountListItemProps = {
    account: Account;
    onAccountSelected: (account: Account) => void;
}

export function LensAccountListItem({ account, onAccountSelected }: LensAccountListItemProps) {
    return <div onClick={() => onAccountSelected(account)}>{account.address}</div>;
}