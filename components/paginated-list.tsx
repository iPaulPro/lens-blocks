"use client";

import { Account, usePost } from "@lens-protocol/react";
import { toast } from "sonner";
import { LikesList } from "@/registry/new-york/components/feed/likes/likes-list";
import { CodeBlock } from "@/components/codeblock";
import { InstallCommandBlock } from "@/components/install-command-block";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/registry/new-york/ui/tabs";
import { getDisplayName } from "@/registry/new-york/lib/lens-utils";

export default function PaginatedList() {
  const post = usePost({
    post: "1n8hs1aqb4k53f8vsvc",
  });

  const handleAccountSelected = (account: Account) => {
    console.log("Selected account:", account);
    // You can handle the selected account here, e.g., update state or perform an action
    toast.success("Account clicked: " + getDisplayName(account));
  };

  if (post.error) return null;

  return (
    <>
      <div className="flex flex-col flex-1 gap-8">
        <Tabs defaultValue="preview">
          <div className="preview flex flex-col gap-2 relative">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="preview">Preview</TabsTrigger>
                <TabsTrigger value="code">Code</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="preview" className="flex items-center justify-center flex-grow relative">
              <div className="h-48 w-full md:w-1/2 border rounded-md">
                <LikesList post={post} onAccountSelected={handleAccountSelected} />
              </div>
            </TabsContent>
            <TabsContent value="code" className="p-0">
              <CodeBlock lang="tsx" className="lines border-none">
                {`import { Account, usePost, postId } from "@lens-protocol/react";
import { toast } from "sonner";
import { LikesList } from "@/components/feed/likes/likes-list";
import { getDisplayName } from "@/lib/lens-utils";

export function PaginatedListDemo() {
  const post = usePost({
    post: "1n8hs1aqb4k53f8vsvc",
  });
  
  const handleAccountSelected = (account: Account) => {
    // You can handle the selected account here, e.g., update state or perform an action
      toast.success("Account clicked: @" + getDisplayName(account));
  };
  
  return (
    <LikesList post={post} onAccountSelected={handleAccountSelected} />   
  );
};`}
              </CodeBlock>
            </TabsContent>
          </div>
        </Tabs>
        <h2 className="mt-6 pb-2 text-3xl font-semibold tracking-tight first:mt-0">Installation</h2>
        <InstallCommandBlock componentName="paginated-list" />
        <h2 className="mt-6 pb-2 text-3xl font-semibold tracking-tight first:mt-0">Usage</h2>
        <CodeBlock lang="tsx" className="lines">
          {`import { useState } from "react";
import { Cursor, PageSize, usePostReactions, postId } from "@lens-protocol/react";
import { PaginatedList } from "@/components/common/paginated-list";
import { LensAccountListItem } from "@/components/account/lens-account-list-item";
import { LensAccountListItemSkeleton } from "@/components/account/lens-account-list-item-skeleton";`}
        </CodeBlock>
        <CodeBlock lang="tsx" className="lines">
          {`const [cursor, setCursor] = useState<Cursor | null>(null);

const { data, loading, error } = usePostReactions({
  post: postId("1n8hs1aqb4k53f8vsvc"),
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
