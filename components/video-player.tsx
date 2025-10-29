"use client";

import { InstallCommandBlock } from "@/components/install-command-block";
import { CodeBlock } from "@/components/codeblock";
import { usePost } from "@lens-protocol/react";
import { LensVideoPlayer, LensVideoPlayerSkeleton } from "@/registry/new-york/components/common/lens-video-player";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/registry/new-york/ui/tabs";
import { isVideoPost } from "@/registry/new-york/lib/lens-utils";

export default function VideoPlayer() {
  const { data: post, loading: postLoading } = usePost({ post: "39d0736810280pbe9vk" });

  if (post && !isVideoPost(post)) {
    return null;
  }

  const postMetadata = post?.metadata;

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
              <div className="w-full md:w-2/3">
                {postLoading || !postMetadata ? (
                  <LensVideoPlayerSkeleton />
                ) : (
                  <LensVideoPlayer video={postMetadata.video} />
                )}
              </div>
            </TabsContent>
            <TabsContent value="code" className="p-0">
              <CodeBlock lang="tsx" className="lines border-none">
                {`import { 
  LensVideoPlayer,
  LensVideoPlayerSkeleton
} from "@/components/common/lens-video-player";
import { usePost } from "@lens-protocol/react";
import { isVideoPost } from "@/lib/lens-utils";

export function VideoPlayerDemo() {
  const { data: post, loading: postLoading } = usePost({ 
    post: "39d0736810280pbe9vk" 
  });

  if (post && !isVideoPost(post)) {
    return null;
  }

  const postMetadata = post?.metadata;
  
  return postLoading || !postMetadata ? (
    <LensVideoPlayerSkeleton />
  ) : (
    <LensVideoPlayer video={postMetadata.video} />
  );
};`}
              </CodeBlock>
            </TabsContent>
          </div>
        </Tabs>
        <h2 className="mt-6 pb-2 text-3xl font-semibold tracking-tight first:mt-0">Installation</h2>
        <InstallCommandBlock componentName="video-player" />
        <h2 className="mt-6 pb-2 text-3xl font-semibold tracking-tight first:mt-0">Usage</h2>
        <CodeBlock lang="tsx" className="lines">
          {`import { LensVideoPlayer } from "@/components/common/lens-video-player";
import { usePost } from "@lens-protocol/react";`}
        </CodeBlock>
        <CodeBlock lang="tsx" className="lines">
          {`const { data: post } = usePost({ post: "1z32szv5xqnpaqqncah" });`}
        </CodeBlock>
        <CodeBlock lang="tsx" className="lines">
          {`<LensVideoPlayer video={post.metadata.video} />`}
        </CodeBlock>
      </div>
    </>
  );
}
