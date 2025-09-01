import { useState } from "react";
import { Cursor, PageSize, AnyPost, useWhoExecutedActionOnPost } from "@lens-protocol/react";
import { PaginatedList } from "@/registry/new-york/common/components/paginated-list";
import { LensAccountListItem } from "@/registry/new-york/common/components/lens-account-list-item";
import { LensAccountListItemSkeleton } from "@/registry/new-york/common/components/lens-account-list-item-skeleton";

const CollectorsList = ({ post }: { post: AnyPost }) => {
  const [cursor, setCursor] = useState<Cursor | null>(null);

  const { data, loading, error } = useWhoExecutedActionOnPost({
    post: post.id,
    filter: {
      anyOf: [{ simpleCollect: true }],
    },
    pageSize: PageSize.Fifty,
    cursor,
  });

  return (
    <PaginatedList
      data={data}
      loading={loading}
      error={error}
      setCursor={setCursor}
      emptyMessage="No collectors yet"
      errorMessage="Error loading collectors"
      renderItem={(item, index) => (
        <LensAccountListItem
          account={item.account}
          key={item.account.address}
          renderDivider={() => <div className="h-0.5"></div>}
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

export default CollectorsList;
