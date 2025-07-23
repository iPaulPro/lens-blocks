"use client";

import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from '@/registry/new-york/ui/dialog'
import {LoginButton} from '@/registry/new-york/blocks/login-button/components/login-button'
import {useState} from 'react'
import {Account} from '@lens-protocol/react'
import {useAccount} from 'wagmi'
import {AccountChooser} from '@/registry/new-york/blocks/login-button/components/account-chooser'
import {useAuthenticatedLensAccount} from '@/registry/new-york/blocks/login-button/hooks/use-authenticated-lens-account'

export function LensLoginBlock() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

  const { address: walletAddress } = useAccount();
  const { data: lensAccount, loading: lensAccountLoading } = useAuthenticatedLensAccount();

  const onShowAccountPicker = () => {
    setDialogOpen(true);
  };

  return (
      <div>
        <LoginButton onShowAccountPicker={onShowAccountPicker} selectedAccount={selectedAccount} />
        {walletAddress && (
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Select an account</DialogTitle>
                  <DialogDescription>
                    Choose a Lens account to log in with.
                  </DialogDescription>
                </DialogHeader>
                <AccountChooser walletAddress={walletAddress} setSelectedAccount={setSelectedAccount} />
              </DialogContent>
            </Dialog>
        )}
      </div>
  );
}