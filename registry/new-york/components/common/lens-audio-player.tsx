import ReactPlayer from "react-player";
import { MediaAudio } from "@lens-protocol/react";
import { getAudioExtension, parseUri } from "@/registry/new-york/lib/lens-utils";
import { SyntheticEvent, useRef, useState } from "react";
import { Button } from "@/registry/new-york/ui/button";
import { PauseIcon, PlayIcon, Volume2Icon, VolumeOffIcon } from "lucide-react";
import { MediaSeekSlider } from "@/registry/new-york/ui/media-seek-slider";
import { Duration } from "@/registry/new-york/ui/duration";

type Props = {
  audio: MediaAudio;
  postTitle?: string | null;
  preload?: "none" | "metadata" | "auto" | "";
  onError?: (e: any) => void;
  onCoverClick?: (imageUri: string) => void;
};

export const LensAudioPlayer = (props: Props) => {
  const { audio, postTitle, preload = "metadata", onError } = props;

  // ReactPlayer looks at the file extension in the source URI to determine how to play the file
  // so we need to append the extension to the url for instances where the audio url does not have an extension
  // e.g. when using IPFS urls like https://api.grove.storage/<key>
  // or when using a proxy server that does not preserve the original file name
  const audioUri = audio ? parseUri(audio.item) + "?extension=." + getAudioExtension(audio.type) : null;

  const playerRef = useRef<HTMLVideoElement | null>(null);

  const initialState = {
    playing: false,
    volume: 1,
    muted: false,
    played: 0,
    loaded: 0,
    duration: 0,
    seeking: false,
    loadedSeconds: 0,
    playedSeconds: 0,
  };

  type PlayerState = typeof initialState;

  const [state, setState] = useState<PlayerState>(initialState);
  const [showTimeRemaining, setShowTimeRemaining] = useState(true);
  const [hasPlayed, setHasPlayed] = useState(false);

  if (!audio || !audioUri) {
    return null;
  }

  if (!ReactPlayer.canPlay?.(audioUri)) {
    return <audio controls src={audioUri} />;
  }

  const handlePlayPause = () => {
    setState(prevState => ({ ...prevState, playing: !prevState.playing }));
  };

  const handleToggleMuted = () => {
    setState(prevState => ({ ...prevState, muted: !prevState.muted }));
  };

  const handlePlay = () => {
    setState(prevState => ({ ...prevState, playing: true }));
    setHasPlayed(true);
  };

  const handlePause = () => {
    setState(prevState => ({ ...prevState, playing: false }));
  };

  const handleSeekMouseDown = () => {
    setState(prevState => ({ ...prevState, seeking: true }));
  };

  const handleSeekChange = (event: SyntheticEvent<HTMLInputElement>) => {
    const inputTarget = event.target as HTMLInputElement;
    setState(prevState => ({ ...prevState, played: Number.parseFloat(inputTarget.value) }));
  };

  const onValueChange = (values: Number[]) => {
    setState(prevState => ({ ...prevState, seeking: false }));
    if (playerRef.current) {
      playerRef.current.currentTime = values[0].valueOf() * playerRef.current.duration;
    }
  };

  const handleProgress = () => {
    const player = playerRef.current;
    // We only want to update time slider if we are not currently seeking
    if (!player || state.seeking || !player.buffered?.length) return;

    setState(prevState => ({
      ...prevState,
      loadedSeconds: player.buffered?.end(player.buffered?.length - 1),
      loaded: player.buffered?.end(player.buffered?.length - 1) / player.duration,
    }));
  };

  const handleTimeUpdate = () => {
    const player = playerRef.current;
    // We only want to update time slider if we are not currently seeking
    if (!player || state.seeking) return;

    if (!player.duration) return;

    setState(prevState => ({
      ...prevState,
      playedSeconds: player.currentTime,
      played: player.currentTime / player.duration,
    }));
  };

  const handleEnded = () => {
    setState(prevState => ({ ...prevState, playing: false }));
  };

  const handleDurationChange = () => {
    const player = playerRef.current;
    if (!player) return;

    setState(prevState => ({ ...prevState, duration: player.duration }));
  };

  const { playing, playedSeconds, volume, muted, played, loaded, duration } = state;

  return (
    <div
      className="w-full flex border rounded-xl mt-1 bg-card text-card-foreground overflow-hidden"
      onClick={event => event.stopPropagation()}
    >
      <div className="w-full h-24 flex items-center">
        {audio.cover && (
          <img
            src={parseUri(audio.cover)!!}
            alt="Cover image"
            className="aspect-square object-cover h-full rounded-l-xl flex-1 cursor-pointer hover:opacity-90"
            width={192}
            height={192}
            loading={"lazy"}
            onClick={() => props.onCoverClick?.(parseUri(audio.cover)!!)}
          />
        )}

        <div className="w-full min-w-0 flex flex-col h-full px-2 justify-center">
          <div className="w-full min-w-0 flex flex-col pl-1 gap-1 md:gap-0">
            {(audio.title || postTitle) && (
              <div className="text-sm md:text-lg font-semibold truncate mt-1">{audio.title ?? postTitle}</div>
            )}
            {audio.artist && <div className="text-sm md:text-base opacity-80 truncate -mt-1">{audio.artist}</div>}
          </div>
          <ReactPlayer
            ref={playerRef}
            src={audioUri}
            controls={false}
            preload={preload}
            playing={playing}
            volume={volume}
            muted={muted}
            onPlay={handlePlay}
            onPause={handlePause}
            onEnded={handleEnded}
            onError={onError}
            onTimeUpdate={handleTimeUpdate}
            onProgress={handleProgress}
            onDurationChange={handleDurationChange}
          />
          <div className="w-full flex gap-1 items-center">
            <Button
              variant="ghost"
              size="icon"
              className="-ms-2 flex-none rounded-full"
              onClick={handlePlayPause}
              disabled={!loaded}
            >
              {playing ? <PauseIcon fill="var(--primary)" /> : <PlayIcon fill="var(--primary)" />}
            </Button>
            <MediaSeekSlider
              min={0}
              max={0.999999}
              step={0.01}
              value={[played]}
              onValueChange={onValueChange}
              onMouseDown={handleSeekMouseDown}
              onChange={handleSeekChange}
              className="flex-grow"
              disabled={!loaded}
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowTimeRemaining(!showTimeRemaining)}
              className="flex-none rounded-full"
              disabled={!loaded}
            >
              <Duration
                seconds={!hasPlayed ? duration : showTimeRemaining ? duration - playedSeconds : playedSeconds}
                isCountdown={hasPlayed && showTimeRemaining}
                className="flex-none text-sm"
              />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="flex-none rounded-full"
              onClick={handleToggleMuted}
              disabled={!loaded}
            >
              {muted ? <VolumeOffIcon fill="var(--primary)" /> : <Volume2Icon fill="var(--primary)" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
