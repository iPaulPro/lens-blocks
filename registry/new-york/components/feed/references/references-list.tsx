import { useState } from "react";
import { ArrowRightLeft, MessageSquareQuote } from "lucide-react";
import { Cursor, PageSize, AnyPost, PostReferenceType, usePostReferences } from "@lens-protocol/react";
import { LensAccountListItem } from "@/registry/new-york/components/common/lens-account-list-item";
import { PaginatedList } from "@/registry/new-york/components/common/paginated-list";
import { LensAccountListItemSkeleton } from "@/registry/new-york/components/common/lens-account-list-item-skeleton";

const ReferencesList = ({ post }: { post: AnyPost }) => {
  const [cursor, setCursor] = useState<Cursor | null>(null);

  const { data, loading, error } = usePostReferences({
    referencedPost: post?.id,
    referenceTypes: [PostReferenceType.QuoteOf, PostReferenceType.RepostOf],
    pageSize: PageSize.Fifty,
    cursor,
  });

  return (
    <PaginatedList
      data={data}
      loading={loading}
      error={error}
      setCursor={setCursor}
      emptyMessage="No quotes or reposts yet"
      errorMessage="Error loading quotes and reposts"
      renderItem={(item, index) => (
        <LensAccountListItem
          account={item.author}
          key={item.author.address}
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

export default ReferencesList;
