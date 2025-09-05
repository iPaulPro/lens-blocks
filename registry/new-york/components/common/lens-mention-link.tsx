import { ComponentProps } from "react";
import Link from "next/link";

type Props = {
  username: string;
  href?: string;
};

type LinkProps = Omit<ComponentProps<typeof Link>, "href">;

export default function LensMentionLink(props: Props & LinkProps) {
  const href = props.href || `/u/${props.username.replace("lens/", "")}`;

  return (
    <Link {...props} href={href}>
      {props.username.replace("lens/", "@")}
    </Link>
  );
}
