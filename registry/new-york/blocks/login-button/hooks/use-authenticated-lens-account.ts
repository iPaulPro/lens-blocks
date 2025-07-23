import {useAccount, useAuthenticatedUser} from '@lens-protocol/react'

export function useAuthenticatedLensAccount() {
    const { data: authenticatedUser, loading: authenticatedUserLoading } = useAuthenticatedUser();

    const { data: account, loading: accountLoading, error: accountError } = useAccount({
        address: authenticatedUser?.address,
    })

    return {
        loading: authenticatedUserLoading || accountLoading,
        data: account,
        error: accountError,
    };
}