import { ComponentProps } from "react";

type Props = {
  tag: string;
  href?: string;
};

type LinkProps = Omit<ComponentProps<"a">, "href">;

export default function LensTagLink(props: Props & LinkProps) {
  return props.href ? (
    <a {...props} href={props.href}>
      {props.tag}
    </a>
  ) : (
    <span className="font-bold">{props.tag}</span>
  );
}
