import { Skeleton } from "@/registry/new-york/ui/skeleton";

export const LensAccountListItemSkeleton = ({ showChevron = true }: { showChevron?: boolean }) => {
  return (
    <div className="w-full flex items-center space-x-2 p-2">
      <Skeleton className="h-10 w-10 rounded-full flex-none" />
      <div className="flex-grow space-y-1.5">
        <Skeleton className="h-4 w-9/12" />
        <Skeleton className="h-3 w-5/12" />
      </div>
      {showChevron && <Skeleton className="w-4 h-4" />}
    </div>
  );
};
