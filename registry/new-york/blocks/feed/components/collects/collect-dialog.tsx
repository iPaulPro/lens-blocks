import { AnyPost, SimpleCollectAction, TxHash, useAuthenticatedUser } from "@lens-protocol/react";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { Clock, Snowflake, Users } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/registry/new-york/ui/dialog";
import moment from "moment/moment";

export type CollectDialogRef = {
  open: () => void;
  close: () => void;
  isOpen: boolean;
};

type CollectDialogProps = {
  post: AnyPost;
  action: SimpleCollectAction;
  collect: () => Promise<TxHash | undefined>;
  onError?: (error: Error) => void;
};

const CollectDialog = forwardRef<CollectDialogRef, CollectDialogProps>(({ post, action, collect, onError }, ref) => {
  const [collectDialogOpen, setCollectDialogOpen] = useState(false);
  const [collecting, setCollecting] = useState(false);
  const [collectEnded, setCollectEnded] = useState(false);
  const [collectAvailable, setCollectAvailable] = useState(false);

  const { data: user } = useAuthenticatedUser();

  const operations = post && "operations" in post ? post.operations : null;
  const stats = post && "stats" in post ? post.stats : null;

  useImperativeHandle(ref, () => ({
    open: () => setCollectDialogOpen(true),
    close: () => setCollectDialogOpen(false),
    isOpen: collectDialogOpen,
  }));

  useEffect(() => {
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
  }, [action, post]);

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

  return (
    <Dialog open={collectDialogOpen} onOpenChange={setCollectDialogOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="text-left border-b pb-4">
          <DialogTitle className="text-2xl">Collect this Article</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          {"collectibleMetadata" in post && post.collectibleMetadata.name && (
            <div className="text-2xl font-medium py-2">{post.collectibleMetadata.name}</div>
          )}
          <div className="flex gap-4 items-center">
            <Users className="w-6 h-6" />
            {new Intl.NumberFormat().format(stats?.collects ?? 0)} {stats?.collects === 1 ? "collector" : "collectors"}
          </div>
          {action.collectLimit && (
            <div className="flex gap-4 items-center">
              <Snowflake className="w-6 h-6" />
              {new Intl.NumberFormat().format(action.collectLimit - (stats?.collects ?? 0))} remaining
            </div>
          )}
          {action.endsAt && (
            <div className="flex gap-4 items-center">
              <Clock className="w-6 h-6" />
              <abbr className="!border-b-0 no-underline text-xl" title={moment(action.endsAt).format("LLL")}>
                {collectEnded ? "Ended " + moment(action.endsAt).fromNow() : "Ends " + moment(action.endsAt).fromNow()}
              </abbr>
            </div>
          )}
          <div className="flex justify-end">
            <button
              onClick={onCollectClick}
              disabled={collecting || collectEnded || !collectAvailable}
              className={`btn btn-primary ${collectAvailable ? "px-8" : "px-16"} py-4`}
            >
              {collecting ? (
                <span className="loader"></span>
              ) : !user?.address ? (
                "log in to collect"
              ) : operations?.hasSimpleCollected ? (
                "collected"
              ) : collectEnded ? (
                "no longer available"
              ) : collectAvailable ? (
                "collect"
              ) : (
                "unable to collect"
              )}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
});

export default CollectDialog;
