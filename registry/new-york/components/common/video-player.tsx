import ReactPlayer from "react-player";

type Props = {
  src: string;
  poster?: string;
  preload?: "none" | "metadata" | "auto" | "";
};

export default function VideoPlayer(props: Props) {
  return (
    <div className="w-full aspect-video" onClick={event => event.stopPropagation()}>
      <ReactPlayer
        slot="media"
        src={props.src}
        fallback={props.poster}
        controls={true}
        preload={props.preload}
        style={{
          width: "100%",
          height: "100%",
        }}
        className="w-full h-full rounded-xl"
      />
    </div>
  );
}
