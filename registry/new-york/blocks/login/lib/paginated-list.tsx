import { Cursor, Paginated } from "@lens-protocol/react";
import { ReactNode, useCallback, useEffect, useState } from "react";
import { AlertTriangle, Loader } from "lucide-react";
import { Virtuoso } from "react-virtuoso";

type PaginationListProps<Type> = {
  className?: string;
  data: Paginated<Type> | undefined;
  loading: boolean;
  error: Error | undefined;
  cursor?: Cursor | null;
  setCursor: (cursor: Cursor | null) => void;
  renderItem: (item: Type, index: number) => ReactNode;
  renderHeader?: () => ReactNode;
  renderFooter?: () => ReactNode;
  renderSkeleton?: () => ReactNode;
  emptyMessage?: string;
  errorMessage?: string;
  filterFn?: (item: Type) => boolean;
  sortFn?: (a: Type, b: Type) => number;
};

const PaginatedList = <Type extends any>(props: PaginationListProps<Type>) => {
  const [items, setItems] = useState<Type[]>([]);

  const DefaultHeader = (): ReactNode => {
    return <div className="h-2"></div>;
  };

  const DefaultFooter = (): ReactNode => {
    if (!loading || !items) return <div className="h-2"></div>;
    return (
      <div className="w-full h-16 flex items-center justify-center">
        <Loader className="animate-spin flex-none opacity-45 w-6 h-6" />
      </div>
    );
  };

  const {
    className,
    data,
    loading,
    error,
    filterFn,
    cursor,
    setCursor,
    renderItem,
    renderSkeleton,
    renderHeader = DefaultHeader,
    renderFooter = DefaultFooter,
    emptyMessage,
    errorMessage,
    sortFn,
  } = props;

  useEffect(() => {
    if (data?.items) {
      const items = filterFn ? data.items.filter(filterFn) : data.items;
      const sortedItems = sortFn ? items.toSorted(sortFn) : items;
      setItems(prevItems => {
        return cursor ? [...prevItems, ...sortedItems] : [...sortedItems];
      });
    }
  }, [data]);

  const loadMore = useCallback(() => {
    if (!data || !data.pageInfo.next) return;
    setCursor(data.pageInfo.next as Cursor);
  }, [data, setCursor]);

  const Skeleton = (): ReactNode => {
    return renderSkeleton ? (
      renderSkeleton()
    ) : (
      <div className="w-full h-full flex items-center justify-center">
        <Loader className="animate-spin flex-none opacity-45 w-6 h-6" />
      </div>
    );
  };

  const Header = renderHeader;
  const Footer = renderFooter;

  return (
    <div className="h-full">
      {error ? (
        <div className="py-4 flex gap-4 items-center">
          <AlertTriangle className="w-8 h-8" />
          {errorMessage ?? "Error loading data"}
        </div>
      ) : !items.length && loading ? (
        <div className={"h-full" + (className ? ` ${className}` : "")}>
          <Header />
          <Skeleton />
          <Footer />
        </div>
      ) : (
        <div className={"h-full" + (className ? ` ${className}` : "")}>
          {items.length === 0 && (
            <div className="py-4 h-full flex items-center justify-center text-sm">
              {emptyMessage ?? "Nothing to show"}
            </div>
          )}
          <Virtuoso
            className="testing"
            style={{ height: "100%" }}
            data={items}
            endReached={loadMore}
            itemContent={(index, item) => renderItem(item, index)}
            components={{ Header, Footer }}
          />
        </div>
      )}
    </div>
  );
};

export default PaginatedList;
