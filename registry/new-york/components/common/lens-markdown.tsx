// @ts-ignore
import linkifyRegex from "remark-linkify-regex";
import stripMarkdown from "strip-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { RegEx } from "@/registry/new-york/lib/regex";
import ReactMarkdown, { Components } from "react-markdown";
import { cn } from "@/lib/utils";
import LensMentionLink from "@/registry/new-york/components/common/lens-mention-link";
import { AccountMention, GroupMention } from "@lens-protocol/react";
import LensTagLink from "@/registry/new-york/components/common/lens-tag-link";

type Props = {
  content: string;
  className?: string;
  mentions?: (AccountMention | GroupMention)[];
};

const LensMarkdown = (props: Props) => {
  const { content, className, mentions } = props;
  const remarkPlugins = [
    [
      stripMarkdown,
      {
        keep: ["blockquote", "code", "delete", "emphasis", "inlineCode", "link", "list", "listItem", "strong"],
      },
    ],
    remarkGfm,
    remarkBreaks,
    linkifyRegex(RegEx.URL),
    linkifyRegex(RegEx.MENTION),
    linkifyRegex(RegEx.HASHTAG),
    linkifyRegex(RegEx.CASHTAG),
  ];

  const components: Components = {
    // linkifyRegex will find mentions, hashtags, and cashtags, and replace them with a link
    // here we are defining how to render that link
    a: (props: any) => {
      const mention = mentions?.find(mention => mention.replace.from === props.title);

      if (mention) {
        return <LensMentionLink mention={mention} />;
      }

      if (props.title?.startsWith("#") || props.title?.startsWith("$")) {
        return <LensTagLink tag={props.title} />;
      }

      return (
        <a {...props} target="_blank" rel="noopener noreferrer">
          {props.href
            .replace(/^https?:\/\//, "")
            .replace(/\/$/, "")
            .replace(/\\$/, "")
            .replace(/^www\./, "")
            .slice(0, 30) + (props.href.length > 30 ? "..." : "")}
        </a>
      );
    },
  };
  return (
    <ReactMarkdown
      remarkPlugins={remarkPlugins}
      components={components}
      className={cn("break-words hyphens-none line-clamp-6 whitespace-pre-wrap", className)}
    >
      {content}
    </ReactMarkdown>
  );
};

export default LensMarkdown;
