"use client";

import {
  Erc20Amount,
  evmAddress,
  NativeAmount,
  PaymentSource,
  SessionClient,
  TxHash,
  useAuthenticatedUser,
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
import { Input } from "@/registry/new-york/ui/input";
import { Button } from "@/registry/new-york/ui/button";
import { Spinner } from "@/registry/new-york/ui/spinner";
import { NativeToken } from "@/registry/new-york/lib/lens-utils";
import { Skeleton } from "@/registry/new-york/ui/skeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/registry/new-york/ui/tooltip";

export interface TipDialogRef {
  open: () => void;
  close: () => void;
  isOpen: boolean;
}

export interface TipDialogProps {
  /**
   * The Lens Session Client used for making authenticated calls
   */
  sessionClient: SessionClient | null | undefined;

  /**
   *  Function to create a tip transaction. Any error thrown will be caught and passed to onError callback.
   */
  createTip: (source: PaymentSource, amount: string, tokenAddress: string) => Promise<TxHash>;

  /**
   * Optional list of supported token addresses to tip with. If not provided, only the native token will be supported.
   */
  supportedTokens?: string[];

  /**
   * Callback fired when a tip is successfully created and the dialog is closed.
   */
  onTipCreated?: (txHash: TxHash) => void;

  /**
   * Callback fired when an error occurs during tip creation.
   */
  onError?: (error: Error) => void;
}

export const LensTipDialog = forwardRef<TipDialogRef, TipDialogProps>(
  ({ sessionClient, supportedTokens, createTip, onTipCreated, onError }, ref) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [balances, setBalances] = useState<(Erc20Amount | NativeAmount)[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [inputError, setInputError] = useState<Error | null>(null);
    const [selectedTokenAddress, setSelectedTokenAddress] = useState<string>(NativeToken);
    const [inputValue, setInputValue] = useState<string>("");
    const [balance, setBalance] = useState<string>("0");
    const [paymentSource, setPaymentSource] = useState<PaymentSource>(PaymentSource.Signer);

    const { data: user } = useAuthenticatedUser();

    const account = user?.address;
    const address = user?.signer;

    useImperativeHandle(ref, () => ({
      open: () => setDialogOpen(true),
      close: () => setDialogOpen(false),
      isOpen: dialogOpen,
    }));

    const getAddressFromBalance = (balance: Erc20Amount | NativeAmount) => {
      return balance.__typename === "NativeAmount" ? NativeToken : balance.asset.contract.address;
    };

    const fetchBalances = async (session: SessionClient, paymentSource: PaymentSource, address: string) => {
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
        setBalances(accountBalances);
      } finally {
        setIsLoading(false);
      }
    };

    useEffect(() => {
      if (!dialogOpen || !sessionClient?.isSessionClient() || !address || !account) return;
      setIsLoading(true);

      fetchBalances(sessionClient, paymentSource, address).catch(err => {
        setError(err);
      });
    }, [sessionClient, dialogOpen, address, account, paymentSource]);

    useEffect(() => {
      if (!balances.length) {
        setSelectedTokenAddress(NativeToken);
        return;
      }

      if (!selectedTokenAddress) {
        if (balances[0].__typename === "NativeAmount") {
          setSelectedTokenAddress(NativeToken);
        } else {
          setSelectedTokenAddress(balances[0]?.asset.contract.address);
        }
      }
    }, [balances]);

    useEffect(() => {
      if (!balances.length || !selectedTokenAddress) {
        setBalance("0");
        return;
      }
      const balance =
        selectedTokenAddress === NativeToken
          ? balances.find(b => b.__typename === "NativeAmount")
          : balances.find(b => b.asset.contract.address === selectedTokenAddress);
      setBalance(balance?.value || "0");
    }, [balances, selectedTokenAddress]);

    useEffect(() => {
      if (!balance) return;
      const numericInput = parseFloat(inputValue);
      const numericBalance = parseFloat(balance);
      // If input value exceeds balance, set and error, otherwise clear error
      if (numericInput > numericBalance) {
        setInputError(new Error("Input amount exceeds balance"));
      } else {
        setInputError(null);
      }
    }, [inputValue, balance]);

    const onSubmitClick = async () => {
      if (!selectedTokenAddress || !inputValue) {
        onError?.(new Error("Token and amount cannot be falsy"));
        return;
      }

      setIsSubmitting(true);

      try {
        const txHash = await createTip(paymentSource, inputValue, selectedTokenAddress);
        if (txHash) {
          setDialogOpen(false);
          setInputValue("");
          onTipCreated?.(txHash);
        } else {
          onError?.(new Error("Unexpected error"));
        }
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
      setSelectedTokenAddress(NativeToken);
      setInputValue("");
    };

    return (
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader className="text-left border-b">
            <DialogTitle>Send a tip</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 min-w-0 px-4 pb-4">
            {(error || (!isLoading && balances.length === 0)) && (
              <div className="py-4 flex gap-4 items-center">
                <span className="text-red-500">No tokens available</span>
              </div>
            )}

            {isLoading && balances.length === 0 && (
              <div className="flex flex-col gap-4 min-w-0">
                <div className="flex gap-4 items-center">
                  <Skeleton className="h-8 flex-grow" />
                  <Skeleton className="h-8 w-1/3" />
                </div>
                <div className="flex gap-4">
                  <Skeleton className="h-8 flex-grow" />
                  <Skeleton className="h-8 w-1/6" />
                </div>
                <div className="flex gap-8 justify-between">
                  <Skeleton className="h-4 w-1/3 mt-1" />
                  <Skeleton className="h-8 w-1/3" />
                </div>
              </div>
            )}

            {balances.length > 0 && (
              <div className="flex flex-col gap-4 min-w-0">
                <div className="flex gap-4 items-center">
                  <Select value={selectedTokenAddress} onValueChange={setSelectedTokenAddress}>
                    <SelectTrigger className="flex-grow">
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
                  <Select value={paymentSource} onValueChange={onPaymentSourceChange}>
                    <SelectTrigger className="flex-none">
                      <SelectValue placeholder="Source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem key={PaymentSource.Signer} value={PaymentSource.Signer}>
                          from Wallet
                        </SelectItem>
                        <SelectItem key={PaymentSource.Account} value={PaymentSource.Account}>
                          from Account
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-4">
                  <Input
                    id="amount"
                    type="number"
                    placeholder="Amount"
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    className={`flex-grow ${inputError ? "border-red-500 !ring-destructive" : ""}`}
                    disabled={isLoading}
                  />
                  <Button
                    variant="secondary"
                    className="flex-none"
                    onClick={() => setInputValue(balance)}
                    disabled={isLoading || isSubmitting}
                  >
                    Max
                  </Button>
                </div>

                <div className="flex gap-8 justify-between">
                  <span className="flex items-center gap-2 truncate text-muted-foreground text-sm h-fit">
                    <span className="text-muted-foreground">Balance:</span>
                    {isLoading ? (
                      <Spinner />
                    ) : (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="font-bold">
                            {parseFloat(balance).toLocaleString(undefined, {
                              maximumFractionDigits: 6,
                              useGrouping: false,
                            })}
                            {balance.split(".")[1]?.length > 6 ? "…" : ""}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="font-bold">{balance}</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </span>
                  <Button
                    className="flex-none flex items-center gap-2"
                    onClick={onSubmitClick}
                    disabled={isLoading || isSubmitting || !!inputError || !inputValue}
                  >
                    {isSubmitting ? (
                      <>
                        <Spinner /> Sending...
                      </>
                    ) : (
                      "Send tip"
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  },
);
