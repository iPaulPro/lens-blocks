"use client";

import { InstallCommandBlock } from "@/components/install-command-block";
import { CodeBlock } from "@/components/codeblock";
import { usePost } from "@lens-protocol/react";
import { LensAudioPlayer, LensAudioPlayerSkeleton } from "@/registry/new-york/components/common/lens-audio-player";
import { Dialog, DialogContent } from "@/registry/new-york/ui/dialog";
import { useState } from "react";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/registry/new-york/ui/tabs";
import { isAudioPost } from "@/registry/new-york/lib/lens-utils";

export default function AudioPlayer() {
  const [lightboxUri, setLightboxUri] = useState<string | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const { data: post, loading: postLoading } = usePost({ post: "1z32szv5xqnpaqqncah" });

  if (post && !isAudioPost(post)) {
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
                  <LensAudioPlayerSkeleton />
                ) : (
                  <LensAudioPlayer
                    audio={postMetadata.audio}
                    postTitle={postMetadata.title}
                    onCoverClick={imageUri => {
                      setLightboxUri(imageUri);
                      setLightboxOpen(true);
                    }}
                  />
                )}
              </div>
            </TabsContent>
            <TabsContent value="code" className="p-0">
              <CodeBlock lang="tsx" className="lines border-none">
                {`import { 
  LensAudioPlayer,
  LensAudioPlayerSkeleton
} from "@/components/common/lens-audio-player";
import { Dialog, DialogContent } from "@/ui/dialog";
import { usePost } from "@lens-protocol/react";
import { isAudioPost } from "@/lib/lens-utils";

export function AudioPlayerDemo() {
  const [lightboxUri, setLightboxUri] = useState<string | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const { data: post, loading: postLoading } = usePost({ 
    post: "1z32szv5xqnpaqqncah" 
  });

  if (post && !isAudioPost(post)) {
    return null;
  }

  const postMetadata = post?.metadata;
  
  return (
    <>
      {postLoading || !postMetadata ? (
        <LensAudioPlayerSkeleton />
      ) : (
        <LensAudioPlayer
          audio={postMetadata.audio}
          postTitle={postMetadata.title}
          onCoverClick={imageUri => {
            setLightboxUri(imageUri);
            setLightboxOpen(true);
          }}
        />
      )}  
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="flex justify-center items-center
          max-h-full max-w-full bg-transparent border-none shadow-none">
          {lightboxOpen && lightboxUri && (
            <Image
              src={lightboxUri}
              alt={"Audio cover art"}
              className="max-w-full max-h-full object-contain shadow-lg"
              loading="lazy"
              width={1024}
              height={1024}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};`}
              </CodeBlock>
            </TabsContent>
          </div>
        </Tabs>
        <h2 className="mt-6 pb-2 text-3xl font-semibold tracking-tight first:mt-0">Installation</h2>
        <InstallCommandBlock componentName="audio-player" />
        <h2 className="mt-6 pb-2 text-3xl font-semibold tracking-tight first:mt-0">Usage</h2>
        <CodeBlock lang="tsx" className="lines">
          {`import { LensAudioPlayer } from "@/components/common/lens-audio-player";
import { usePost } from "@lens-protocol/react";`}
        </CodeBlock>
        <CodeBlock lang="tsx" className="lines">
          {`const { data: post } = usePost({ post: "1z32szv5xqnpaqqncah" });`}
        </CodeBlock>
        <CodeBlock lang="tsx" className="lines">
          {`<LensAudioPlayer audio={post.metadata.audio} />`}
        </CodeBlock>
      </div>
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="flex justify-center items-center max-h-full max-w-full bg-transparent border-none shadow-none">
          {lightboxOpen && lightboxUri && (
            <Image
              src={lightboxUri}
              alt={"Audio cover art"}
              className="max-w-full max-h-full object-contain shadow-lg"
              loading="lazy"
              width={1024}
              height={1024}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
