"use client";

import { OpenInV0Button } from "@/components/open-in-v0-button";
import { InstallCommandBlock } from "@/components/install-command-block";
import { CodeBlock } from "@/components/codeblock";
import { usePost } from "@lens-protocol/react";
import { Loader } from "lucide-react";
import LensVideoPlayer from "@/registry/new-york/components/common/lens-video-player";

export default function VideoPlayer() {
  const { data: post, loading: postLoading } = usePost({ post: "39d0736810280pbe9vk" });

  const postMetadata = post && "metadata" in post ? post.metadata : undefined;
  const video = postMetadata?.__typename === "VideoMetadata" ? postMetadata.video : null;

  return (
    <>
      <div className="flex flex-col flex-1 gap-8">
        <div className="preview flex flex-col gap-4 relative">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground sm:pl-3">Basic video player</div>
            <OpenInV0Button name="account-hover-card" className="w-fit" />
          </div>
          <div className="flex items-center justify-center flex-grow relative">
            {postLoading || !postMetadata ? (
              <Loader className="animate-spin w-4 h-4 text-muted-foreground" />
            ) : (
              video && (
                <div className="w-full md:w-2/3">
                  <LensVideoPlayer video={video} />
                </div>
              )
            )}
          </div>
        </div>
        <h2 className="mt-6 pb-2 text-3xl font-semibold tracking-tight first:mt-0">Installation</h2>
        <InstallCommandBlock componentName="video-player" />
        <h2 className="mt-6 pb-2 text-3xl font-semibold tracking-tight first:mt-0">Usage</h2>
        <CodeBlock lang="tsx" className="lines">
          {`import { LensVideoPlayer } from "@/components/lens-video-player";
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
