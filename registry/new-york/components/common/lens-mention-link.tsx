import { ComponentProps } from "react";
import Link from "next/link";
import { AccountMention, GroupMention } from "@lens-protocol/react";
import { getUsernamePath } from "@/registry/new-york/lib/lens-utils";

type Props = {
  mention: AccountMention | GroupMention;
  href?: string;
};

type LinkProps = Omit<ComponentProps<typeof Link>, "href">;

export default function LensMentionLink(props: Props & LinkProps) {
  if (props.mention.__typename === "GroupMention") {
    const href = props.href ?? `/g/${props.mention.replace.from.replace("#", "")}`;
    return (
      <Link {...props} href={href}>
        {props.mention.replace.to}
      </Link>
    );
  }

  const namespace = props.mention.namespace;
  const href = props.href ?? getUsernamePath(props.mention.replace.to, namespace);
  return (
    <Link {...props} href={href}>
      {props.mention.replace.to.replace("@lens/", "@")}
    </Link>
  );
}
