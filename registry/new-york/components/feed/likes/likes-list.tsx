import { useState } from "react";
import { Account, AnyPost, Cursor, PageSize, usePostReactions } from "@lens-protocol/react";
import { PaginatedList } from "@/registry/new-york/components/common/paginated-list";
import { LensAccountListItem } from "@/registry/new-york/components/account/lens-account-list-item";
import { LensAccountListItemSkeleton } from "@/registry/new-york/components/account/lens-account-list-item-skeleton";
import { isResult, Result } from "@/registry/new-york/lib/result";

type LikesListProps = {
  post: AnyPost | Result<AnyPost>;
  onAccountSelected?: (account: Account) => void;
};

export const LikesList = ({ post: postRes, onAccountSelected }: LikesListProps) => {
  const [cursor, setCursor] = useState<Cursor | null>(null);

  const post = isResult(postRes) ? postRes.data : postRes;
  const postLoading = isResult(postRes) ? postRes.loading : false;
  const postError = isResult(postRes) ? postRes.error : null;

  const { data, loading, error } = usePostReactions({
    post: post?.id,
    pageSize: PageSize.Fifty,
    cursor,
  });

  return (
    <PaginatedList
      data={data}
      loading={loading || postLoading}
      error={post?.id ? error : postError}
      setCursor={setCursor}
      emptyMessage="No likes yet"
      errorMessage="Error loading likes"
      renderItem={item => (
        <LensAccountListItem
          account={item.account}
          key={item.account.address}
          renderDivider={() => <div className="h-0.5"></div>}
          showChevron={false}
          onAccountSelected={onAccountSelected}
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
