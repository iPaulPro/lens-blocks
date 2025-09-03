import {
  Erc20Amount,
  evmAddress,
  NativeAmount,
  PaymentSource,
  TxHash,
  useAuthenticatedUser,
  useSessionClient,
} from "@lens-protocol/react";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/registry/new-york/ui/dialog";
import { fetchBalancesBulk } from "@lens-protocol/client/actions";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/new-york/ui/select";
import { useAccount } from "wagmi";

export interface TipDialogRef {
  open: () => void;
  close: () => void;
  isOpen: boolean;
}

export interface TipDialogProps {
  supportedTokens: string[];
  createTip: (source: PaymentSource, amount: string, tokenAddress: string) => Promise<TxHash | undefined>;
  onError?: (error: Error) => void;
}

const NATIVE_TOKEN = "0x000000000000000000000000000000000000800A";

const TipDialog = forwardRef<TipDialogRef, TipDialogProps>(({ supportedTokens, createTip, onError }, ref) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [balances, setBalances] = useState<(Erc20Amount | NativeAmount)[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [selectedTokenAddress, setSelectedTokenAddress] = useState<string>();
  const [inputValue, setInputValue] = useState<string>("");
  const [balance, setBalance] = useState<string>("0");
  const [paymentSource, setPaymentSource] = useState<PaymentSource>(PaymentSource.Signer);

  const { data: session } = useSessionClient();
  const { data: user } = useAuthenticatedUser();
  const { address } = useAccount();

  const account = user?.address;

  useImperativeHandle(ref, () => ({
    open: () => setDialogOpen(true),
    close: () => setDialogOpen(false),
    isOpen: dialogOpen,
  }));

  const getAddressFromBalance = (balance: Erc20Amount | NativeAmount) => {
    return balance.__typename === "NativeAmount" ? NATIVE_TOKEN : balance.asset.contract.address;
  };

  useEffect(() => {
    if (!dialogOpen || !session?.isSessionClient() || !address || !account) return;
    setIsLoading(true);

    const fetchBalances = async () => {
      try {
        const res = await fetchBalancesBulk(session, {
          address: paymentSource === PaymentSource.Account ? account : evmAddress(address),
          tokens: supportedTokens,
          includeNative: true,
        });

        if (res.isErr()) {
          throw res.error;
        }

        const accountBalances = res.value.filter(
          balance => balance.__typename === "NativeAmount" || balance.__typename === "Erc20Amount",
        );
        if (!selectedTokenAddress) {
          if (accountBalances[0].__typename === "NativeAmount") {
            setSelectedTokenAddress(NATIVE_TOKEN);
          } else {
            setSelectedTokenAddress(accountBalances[0]?.asset.contract.address);
          }
        }
        setBalances(accountBalances);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBalances().catch(err => {
      console.error("Error fetching balances:", err);
      setError(err);
    });
  }, [session, dialogOpen, address, account, paymentSource, selectedTokenAddress]);

  useEffect(() => {
    if (!balances.length || !selectedTokenAddress) {
      setBalance("0");
      return;
    }
    const balance =
      selectedTokenAddress === NATIVE_TOKEN
        ? balances.find(b => b.__typename === "NativeAmount")
        : balances.find(b => b.asset.contract.address === selectedTokenAddress);
    setBalance(balance?.value || "0");
  }, [balances, selectedTokenAddress]);

  const onSubmitClick = async () => {
    if (!selectedTokenAddress || !inputValue) {
      onError?.(new Error("Token and amount cannot be falsy"));
      return;
    }

    setIsSubmitting(true);

    try {
      await createTip(paymentSource, inputValue, selectedTokenAddress);
      setDialogOpen(false);
      setInputValue("");
    } catch (e) {
      if (e instanceof Error) {
        onError?.(e);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const onPaymentSourceChange = (value: PaymentSource) => {
    setPaymentSource(value);
    setSelectedTokenAddress(NATIVE_TOKEN);
    setInputValue("");
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent className="max-w-xl">
        <DialogHeader className="text-left border-b pb-4">
          <DialogTitle>Send a tip</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 min-w-0">
          {(error || (!isLoading && !balances.length)) && (
            <div className="py-4 flex gap-4 items-center">
              <span className="text-red-500">No tokens available</span>
            </div>
          )}

          {isLoading ? (
            <div className="flex justify-center py-12">
              <span className="loader"></span>
            </div>
          ) : (
            balances.length && (
              <div className="flex flex-col gap-4 min-w-0">
                <Select value={paymentSource} onValueChange={onPaymentSourceChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem key={PaymentSource.Signer} value={PaymentSource.Signer}>
                        from wallet
                      </SelectItem>
                      <SelectItem key={PaymentSource.Account} value={PaymentSource.Account}>
                        from account
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <Select value={selectedTokenAddress} onValueChange={setSelectedTokenAddress}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a token" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {balances.map(balance => (
                        <SelectItem
                          key={getAddressFromBalance(balance)}
                          value={getAddressFromBalance(balance)}
                          disabled={balance.value === "0"}
                        >
                          {balance.asset.name} ({balance.asset.symbol})
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <div className="flex gap-4">
                  <input
                    type="number"
                    placeholder="amount"
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    className="p-4 border rounded flex-grow"
                    disabled={isLoading}
                  />
                  <button
                    className="flex-none btn-secondary !py-3 !px-6 !text-xl"
                    onClick={() => setInputValue(balance)}
                  >
                    max
                  </button>
                </div>

                <div className="flex gap-8 justify-between">
                  <span className="text-lg truncate opacity-80">
                    balance:{" "}
                    {parseFloat(balance).toLocaleString(undefined, {
                      maximumFractionDigits: 6,
                      useGrouping: false,
                    })}
                    {balance.split(".")[1]?.length > 6 ? "…" : ""}
                  </span>
                  <button className="btn flex-none !py-4" onClick={onSubmitClick} disabled={isSubmitting}>
                    {isSubmitting ? <span className="loader"></span> : "send"}
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
});

export default TipDialog;
