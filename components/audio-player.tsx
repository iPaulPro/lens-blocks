"use client";

import { OpenInV0Button } from "@/components/open-in-v0-button";
import { InstallCommandBlock } from "@/components/install-command-block";
import { CodeBlock } from "@/components/codeblock";
import { usePost } from "@lens-protocol/react";
import { Loader } from "lucide-react";
import LensAudioPlayer from "@/registry/new-york/components/common/lens-audio-player";
import { Dialog, DialogContent } from "@/registry/new-york/ui/dialog";
import { useState } from "react";
import Image from "next/image";

export default function AudioPlayer() {
  const [lightboxUri, setLightboxUri] = useState<string | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const { data: post, loading: postLoading } = usePost({ post: "1z32szv5xqnpaqqncah" });

  const postMetadata = post && "metadata" in post ? post.metadata : undefined;
  const audio = postMetadata?.__typename === "AudioMetadata" ? postMetadata.audio : null;
  const title = postMetadata && "title" in postMetadata ? postMetadata.title : undefined;

  return (
    <>
      <div className="flex flex-col flex-1 gap-8">
        <div className="preview flex flex-col gap-4 relative">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground sm:pl-3">Basic audio player with title and lightbox</div>
            <OpenInV0Button name="account-hover-card" className="w-fit" />
          </div>
          <div className="flex items-center justify-center flex-grow relative">
            {postLoading || !postMetadata ? (
              <Loader className="animate-spin w-4 h-4 text-muted-foreground" />
            ) : (
              audio && (
                <div className="w-full md:w-2/3">
                  <LensAudioPlayer
                    audio={audio}
                    postTitle={title}
                    onCoverClick={imageUri => {
                      setLightboxUri(imageUri);
                      setLightboxOpen(true);
                    }}
                  />
                </div>
              )
            )}
          </div>
        </div>
        <h2 className="mt-6 pb-2 text-3xl font-semibold tracking-tight first:mt-0">Installation</h2>
        <InstallCommandBlock componentName="audio-player" />
        <h2 className="mt-6 pb-2 text-3xl font-semibold tracking-tight first:mt-0">Usage</h2>
        <CodeBlock lang="tsx" className="lines">
          {`import { LensAudioPlayer } from "@/components/lens-audio-player";
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
              alt={"Image attached to post"}
              className="max-w-full max-h-full object-contain shadow-lg"
              loading="lazy"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
