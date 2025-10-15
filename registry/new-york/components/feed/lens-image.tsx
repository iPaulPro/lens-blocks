import { ComponentProps } from "react";
import { MediaImage } from "@lens-protocol/react";
import { parseUri } from "@/registry/new-york/lib/lens-utils";
import { cn } from "@/lib/utils";

type ButtonProps = Omit<ComponentProps<"img">, "src">;

type Props = {
  image: MediaImage;
};

export default function LensImage({ image, ...props }: Props & ButtonProps) {
  const imageUri = image ? parseUri(image.item) : null;

  if (!imageUri) {
    return null;
  }

  return (
    <img
      src={imageUri}
      {...props}
      className={cn("w-full mt-2 border rounded-xl object-contain cursor-pointer", props.className)}
    />
  );
}
