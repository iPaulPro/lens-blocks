import { ComponentProps } from "react";
import Link from "next/link";

type Props = {
  hashtag: string;
  href?: string;
};

type LinkProps = Omit<ComponentProps<typeof Link>, "href">;

export default function LensMentionLink(props: Props & LinkProps) {
  return props.href ? (
    <Link {...props} href={props.href}>
      {props.hashtag}
    </Link>
  ) : (
    <span className="font-bold">{props.hashtag}</span>
  );
}
