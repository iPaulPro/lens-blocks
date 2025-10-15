import { AnyPost, TxHash, useAuthenticatedUser } from "@lens-protocol/react";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { BoxIcon, CircleDollarSign, Clock, Snowflake, Users } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/registry/new-york/ui/dialog";
import moment from "moment/moment";
import { Button } from "@/registry/new-york/ui/button";
import { Referral } from "@/registry/new-york/lib/lens-post-provider";
import { useLensPostContext } from "@/registry/new-york/hooks/use-lens-post-context";
import { getUsernamePath, truncateAddress } from "@/registry/new-york/lib/lens-utils";

export type CollectDialogRef = {
  open: () => void;
  close: () => void;
  isOpen: boolean;
};

type CollectDialogProps = {
  post: AnyPost;
  referrals?: Referral[];
  onSuccess?: (txHash: TxHash) => void;
  onError?: (error: Error) => void;
};

const CollectDialog = forwardRef<CollectDialogRef, CollectDialogProps>(
  ({ post, referrals, onSuccess, onError }, ref) => {
    const { collect } = useLensPostContext();

    const [collectDialogOpen, setCollectDialogOpen] = useState(false);
    const [collecting, setCollecting] = useState(false);
    const [collectEnded, setCollectEnded] = useState(false);
    const [collectAvailable, setCollectAvailable] = useState(false);

    const { data: user } = useAuthenticatedUser();

    const action = "actions" in post && post.actions?.find(action => action.__typename === "SimpleCollectAction");
    const operations = post && "operations" in post ? post.operations : null;
    const stats = post && "stats" in post ? post.stats : null;

    useImperativeHandle(ref, () => ({
      open: () => setCollectDialogOpen(true),
      close: () => setCollectDialogOpen(false),
      isOpen: collectDialogOpen,
    }));

    useEffect(() => {
      if (!action) {
        setCollectAvailable(false);
        onError?.(new Error("This post is not collectable"));
        return;
      }

      if (action.endsAt) {
        setCollectEnded(moment().isAfter(action.endsAt));
      }

      if (!operations?.canSimpleCollect || operations?.hasSimpleCollected) {
        setCollectAvailable(false);
        return;
      }

      if (action.collectLimit) {
        setCollectAvailable((stats?.collects ?? 0) < action.collectLimit);
      }
    }, [action]);

    const onCollectClick = async () => {
      setCollecting(true);
      try {
        const txHash = await collect();
        if (txHash) {
          setCollectDialogOpen(false);
        }
      } catch (e: any) {
        if (e instanceof Error) {
          onError?.(e);
        }
      } finally {
        setCollecting(false);
      }
    };

    if (!action) {
      return null;
    }

    return (
      <Dialog open={collectDialogOpen} onOpenChange={setCollectDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Collect</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            <div className="text-lg font-bold py-3">
              {"collectibleMetadata" in post && post.collectibleMetadata.name ? (
                post.collectibleMetadata.name
              ) : (
                <span>
                  Post by{" "}
                  {post.author.username ? (
                    <a
                      href={getUsernamePath(post.author.username.value)}
                      className="!font-bold"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      @{post.author.username.localName}
                    </a>
                  ) : (
                    <span className="!font-bold">{truncateAddress(post.author.address)}</span>
                  )}
                </span>
              )}
            </div>
            {action.payToCollect && (
              <div className="flex gap-2.5 items-center">
                <CircleDollarSign className="w-7 h-7" />
                <span className="font-bold">
                  <span className="text-xl">{action.payToCollect.amount.value}</span>{" "}
                  {action.payToCollect.amount.asset.symbol}
                </span>
              </div>
            )}
            <div className="flex gap-4 items-center pl-1.5">
              <BoxIcon className="w-4 h-4 opacity-60" />
              <span>
                <a
                  href={`https://lenscan.io/nfts/${action.collectNftAddress}`}
                  className="font-semibold"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {truncateAddress(action.collectNftAddress, 10)}
                </a>
              </span>
            </div>
            <div className="flex gap-4 items-center pl-1.5">
              <Users className="w-4 h-4 opacity-60" />
              <span>
                <span className="font-semibold">{new Intl.NumberFormat().format(stats?.collects ?? 0)}</span>{" "}
                {stats?.collects === 1 ? "collector" : "collectors"}
              </span>
            </div>
            {action.collectLimit && (
              <div className="flex gap-4 items-center pl-1.5">
                <Snowflake className="w-4 h-4 opacity-60" />
                <span>
                  <span className="font-semibold">
                    {new Intl.NumberFormat().format(action.collectLimit - (stats?.collects ?? 0))} of{" "}
                    {action.collectLimit}
                  </span>{" "}
                  remaining
                </span>
              </div>
            )}
            {action.endsAt && (
              <div className="flex gap-4 items-center pl-1.5">
                <Clock className="w-4 h-4 opacity-60" />
                <abbr className="!border-b-0 no-underline" title={moment(action.endsAt).format("LLL")}>
                  {collectEnded ? "Ended " : "Ends "}{" "}
                  <span className="font-semibold">{moment(action.endsAt).fromNow()}</span>
                </abbr>
              </div>
            )}
            <div className="flex justify-end pt-2">
              <Button
                size="lg"
                className="font-bold"
                onClick={onCollectClick}
                disabled={collecting || collectEnded || !collectAvailable}
              >
                {collecting ? (
                  <span className="loader"></span>
                ) : !user?.address ? (
                  "Log in to collect"
                ) : operations?.hasSimpleCollected ? (
                  "Collected"
                ) : collectEnded ? (
                  "No longer available"
                ) : collectAvailable ? (
                  action.payToCollect ? (
                    `Collect for ${action.payToCollect.amount.value} ${action.payToCollect.amount.asset.symbol}`
                  ) : (
                    "Collect for free"
                  )
                ) : (
                  "Unable to collect"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  },
);

export default CollectDialog;
