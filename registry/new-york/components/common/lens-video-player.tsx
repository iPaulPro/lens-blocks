import ReactPlayer from "react-player";
import { CSSProperties } from "react";
import { cn } from "@/lib/utils";
import { MediaVideo } from "@lens-protocol/react";
import { getVideoExtension, parseUri } from "@/registry/new-york/lib/lens-utils";
import { Skeleton } from "@/registry/new-york/ui/skeleton";

type Props = {
  video: MediaVideo;
  preload?: "none" | "metadata" | "auto" | "";
  playsInline?: boolean;
  style?: CSSProperties;
  className?: string;
  onError?: (e: any) => void;
};

export const LensVideoPlayer = (props: Props) => {
  const {
    video,
    preload = "metadata",
    playsInline = true,
    style = {
      width: "100%",
      height: "100%",
    },
    className,
    onError,
  } = props;

  // ReactPlayer looks at the file extension in the source URI to determine how to play the file
  // so we need to append the extension to the url for instances where the audio url does not have an extension
  // e.g. when using IPFS urls like https://api.grove.storage/<key>
  // or when using a proxy server that does not preserve the original file name
  const videoUri = video ? parseUri(video.item) + "?extension=." + getVideoExtension(video.type) : null;

  if (!videoUri) {
    return null;
  }

  return (
    <div className="w-full aspect-video" onClick={event => event.stopPropagation()}>
      <ReactPlayer
        slot="media"
        src={videoUri}
        fallback={video.cover}
        controls={true}
        preload={preload}
        playsInline={playsInline}
        style={style}
        className={cn("w-full h-full rounded-xl", className)}
        onError={onError}
      />
    </div>
  );
};

export const LensVideoPlayerSkeleton = () => {
  return (
    <div className="w-full aspect-video bg-black dark border rounded-xl flex flex-col justify-end p-4 gap-4">
      <div className="w-full flex items-center gap-2">
        <Skeleton className="h-5 w-5 rounded-full" />
        <Skeleton className="h-3 w-8 rounded-full ml-2" />
        <Skeleton className="h-3 w-8 rounded-full" />
        <div className="flex-grow flex justify-end gap-4">
          <Skeleton className="h-5 w-5 rounded-full ml-2" />
          <Skeleton className="h-5 w-5 rounded-full ml-2" />
          <Skeleton className="h-5 w-5 rounded-full ml-2" />
        </div>
      </div>
      <div className="w-full">
        <Skeleton className="h-2 w-full rounded-full" />
      </div>
    </div>
  );
};
