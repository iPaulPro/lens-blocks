"use client";

import { InstallCommandBlock } from "@/components/install-command-block";
import { CodeBlock } from "@/components/codeblock";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/registry/new-york/ui/table";
import Link from "next/link";

export default function UsePostContext() {
  return (
    <div className="flex flex-col flex-1 gap-8">
      <p className="content">
        This hook exposes the Post context from <Link href="/libs/post-provider">LensPostProvider</Link> allowing access
        to the post data and related functionalities within the context of a Lens Post. It is useful for components that
        need to interact with or display information about a specific Post.
      </p>
      <h2 className="mt-6 pb-2 text-3xl font-semibold tracking-tight first:mt-0">Installation</h2>
      <InstallCommandBlock componentName="use-post-context" />
      <h2 className="mt-6 pb-2 text-3xl font-semibold tracking-tight first:mt-0">Usage</h2>
      <p className="content !mt-0">
        This hook can only be used in components that are children of a <code>LensPostProvider</code>.
      </p>
      <CodeBlock lang="tsx" className="lines">
        {`import { useLensPostContext } from "@/hooks/use-lens-post-context";`}
      </CodeBlock>
      <CodeBlock lang="tsx" className="lines">
        {`const { post } = useLensPostContext();`}
      </CodeBlock>
      <h2 className="mt-6 pb-2 text-3xl font-semibold tracking-tight first:mt-0">API Reference</h2>
      <p className="content !mt-0">
        The return value of the hook is a <code>PostContextType</code> object:
      </p>
      <div className="content">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Prop</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Type</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>
                <code>post</code>
              </TableCell>
              <TableCell>The Post data object.</TableCell>
              <TableCell className="text-right">
                <code>AnyPost</code>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <code>loading</code>
              </TableCell>
              <TableCell>A boolean indicating if the post data is currently being loaded.</TableCell>
              <TableCell className="text-right">
                <code>boolean</code>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <code>error</code>
              </TableCell>
              <TableCell>An error object if there was an issue fetching the post data.</TableCell>
              <TableCell className="text-right">
                <code>Error</code>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <code>optimistic</code>
              </TableCell>
              <TableCell>The local state of Post actions.</TableCell>
              <TableCell className="text-right">
                <code>OptimisticState</code>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <code>toggleLike</code>
              </TableCell>
              <TableCell>Toggle the upvote status for the authenticated user.</TableCell>
              <TableCell className="text-right">
                <code>function</code>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <code>comment</code>
              </TableCell>
              <TableCell>Create a comment on the Post from the authenticated user.</TableCell>
              <TableCell className="text-right">
                <code>function</code>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <code>collect</code>
              </TableCell>
              <TableCell>Collect the Post for the authenticated user.</TableCell>
              <TableCell className="text-right">
                <code>function</code>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <code>repost</code>
              </TableCell>
              <TableCell>Repost the post by the authenticated user.</TableCell>
              <TableCell className="text-right">
                <code>function</code>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <code>quote</code>
              </TableCell>
              <TableCell>Quote the post by the authenticated user.</TableCell>
              <TableCell className="text-right">
                <code>function</code>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <code>tip</code>
              </TableCell>
              <TableCell>Tip the post from the authenticated user.</TableCell>
              <TableCell className="text-right">
                <code>function</code>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <code>toggleBookmark</code>
              </TableCell>
              <TableCell>Toggle the bookmark status for the authenticated user.</TableCell>
              <TableCell className="text-right">
                <code>function</code>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
