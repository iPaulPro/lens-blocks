import { ComponentProps } from "react";
import Link from "next/link";

type Props = {
  tag: string;
  href?: string;
};

type LinkProps = Omit<ComponentProps<typeof Link>, "href">;

export default function LensTagLink(props: Props & LinkProps) {
  return props.href ? (
    <Link {...props} href={props.href}>
      {props.tag}
    </Link>
  ) : (
    <span className="font-bold">{props.tag}</span>
  );
}
