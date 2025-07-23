import { Cursor, Paginated } from "@lens-protocol/react";
import { ReactNode, useCallback, useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Skeleton } from "@/registry/new-york/ui/skeleton";
import { Virtuoso } from "react-virtuoso";

type PaginationListProps<Type> = {
  data: Paginated<Type> | undefined;
  loading: boolean;
  error: Error | undefined;
  cursor?: Cursor | null;
  setCursor: (cursor: Cursor | null) => void;
  renderItem: (item: Type) => ReactNode;
  emptyMessage?: string;
  errorMessage?: string;
  itemsFilter?: (item: Type) => boolean;
};

const PaginatedList = <Type extends any>(props: PaginationListProps<Type>) => {
  const [items, setItems] = useState<Type[]>([]);

  const { data, loading, error, cursor, setCursor, renderItem, emptyMessage, errorMessage } = props;

  useEffect(() => {
    if (data?.items) {
      const items = props.itemsFilter ? data.items.filter(props.itemsFilter) : data.items;
      setItems(prevItems => {
        return cursor ? [...prevItems, ...items] : [...items];
      });
    }
  }, [data]);

  const loadMore = useCallback(() => {
    if (!data || !data.pageInfo.next) return;
    setCursor(data.pageInfo.next as Cursor);
  }, [data, setCursor]);

  const Footer = () => {
    if (!loading || !items) return null;
    return <div className="w-full h-16 flex items-center justify-center text-gray-500 text-lg">Loading...</div>;
  };

  return (
    <div className="h-[360px] sm:h-[480px]">
      {error ? (
        <div className="py-4 flex gap-4 items-center">
          <AlertTriangle className="w-8 h-8" />
          {errorMessage ?? "Error loading data"}
        </div>
      ) : !items.length && loading ? (
        <div className="flex flex-col gap-2 max-h-full overflow-x-hidden">
          {Array.from({ length: 10 }).map((_, index) => (
            <div key={index} className="flex items-center space-x-4 py-2">
              <Skeleton className="h-14 w-14 rounded-full" />
              <div className="space-y-1.5">
                <Skeleton className="h-7 w-[250px]" />
                <Skeleton className="h-7 w-[200px]" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="h-full">
          {items.length === 0 && <div className="py-4 text-center">{emptyMessage ?? "Nothing to show"}</div>}
          <Virtuoso
            style={{ height: "100%" }}
            data={items}
            endReached={loadMore}
            itemContent={(_index, item) => renderItem(item)}
            components={{ Footer }}
          />
        </div>
      )}
    </div>
  );
};

export default PaginatedList;
