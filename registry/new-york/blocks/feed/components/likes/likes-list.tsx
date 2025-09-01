import { useState } from "react";
import { Account, AnyPost, Cursor, PageSize, usePostReactions } from "@lens-protocol/react";
import { PaginatedList } from "@/registry/new-york/common/components/paginated-list";
import { LensAccountListItem } from "@/registry/new-york/common/components/lens-account-list-item";
import { LensAccountListItemSkeleton } from "@/registry/new-york/common/components/lens-account-list-item-skeleton";

type LikesListProps = {
  post: AnyPost;
  onAccountSelected?: (account: Account) => void;
};

const LikesList = ({ post, onAccountSelected }: LikesListProps) => {
  const [cursor, setCursor] = useState<Cursor | null>(null);

  const { data, loading, error } = usePostReactions({
    post: post.id,
    pageSize: PageSize.Fifty,
    cursor,
  });

  return (
    <PaginatedList
      data={data}
      loading={loading}
      error={error}
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

export default LikesList;
