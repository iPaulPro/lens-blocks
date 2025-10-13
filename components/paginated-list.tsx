"use client";

import { Account, usePost } from "@lens-protocol/react";
import { OpenInV0Button } from "@/components/open-in-v0-button";
import { toast } from "sonner";
import { Loader } from "lucide-react";
import LikesList from "@/registry/new-york/components/feed/likes/likes-list";
import { CodeBlock } from "@/components/codeblock";
import { InstallCommandBlock } from "@/components/install-command-block";

export default function PaginatedList() {
  const { data: post, loading: postLoading } = usePost({
    post: "1n8hs1aqb4k53f8vsvc",
  });

  const onAccountSelected = (account: Account) => {
    console.log("Selected account:", account);
    // You can handle the selected account here, e.g., update state or perform an action
    const handle = account.username?.localName;
    if (handle) {
      toast.success("Account clicked: @" + handle);
    } else {
      toast.success("Account clicked: " + account.address);
    }
  };

  if (postLoading) {
    return <Loader className="animate-spin w-4 h-4 text-muted-foreground" />;
  }

  if (!post) return null;

  return (
    <>
      <div className="flex flex-col flex-1 gap-8">
        <div className="preview flex flex-col gap-4 relative">
          <div className="flex items-center justify-between">
            <h2 className="text-sm text-muted-foreground sm:pl-3">A list of Lens Accounts that liked a post</h2>
            <OpenInV0Button name="paginated-list" className="w-fit" />
          </div>
          <div className="flex items-center justify-center flex-grow relative">
            <div className="h-48 w-full md:w-1/2 border rounded-md">
              <LikesList post={post} onAccountSelected={onAccountSelected} />
            </div>
          </div>
        </div>
        <h2 className="mt-6 pb-2 text-3xl font-semibold tracking-tight first:mt-0">Installation</h2>
        <InstallCommandBlock componentName="paginated-list" />
        <h2 className="mt-6 pb-2 text-3xl font-semibold tracking-tight first:mt-0">Usage</h2>
        <CodeBlock lang="tsx" className="lines">
          {`import { useState } from "react";
import { Cursor, PageSize, usePostReactions } from "@lens-protocol/react";
import { PaginatedList } from "@/components/paginated-list";
import { LensAccountListItem } from "@/components/lens-account-list-item";
import { LensAccountListItemSkeleton } from "@/components/lens-account-list-item-skeleton";`}
        </CodeBlock>
        <CodeBlock lang="tsx" className="lines">
          {`const [cursor, setCursor] = useState<Cursor | null>(null);

const { data, loading, error } = usePostReactions({
  post: "1n8hs1aqb4k53f8vsvc",
  pageSize: PageSize.Fifty,
  cursor,
});

return (
  <PaginatedList
    data={data}
    loading={loading}
    error={error}
    setCursor={setCursor}
    renderItem={item => (
      <LensAccountListItem
        account={item.account}
        key={item.account.address}
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
);`}
        </CodeBlock>
      </div>
    </>
  );
}
