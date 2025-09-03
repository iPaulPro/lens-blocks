import stripMarkdown from "strip-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
// @ts-ignore
import linkifyRegex from "remark-linkify-regex";
import { RegEx } from "@/registry/new-york/lib/regex";
import ReactMarkdown, { Components } from "react-markdown";
import { cn } from "@/lib/utils";

const LensMarkdown = ({ content, className }: { content: string; className?: string }) => {
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
    a: (props: any) => {
      // linkifyRegex will find @namespace/localname mentions and replace them with a link
      // here we are defining how to render that link, removing the lens/ namespace if it exists
      if (props.title?.startsWith("@")) {
        return (
          <a href={`/u/${props.href.replace("@lens/", "")}`} className="font-bold no-underline hover:underline">
            {props.children.replace("@lens/", "@")}
          </a>
        );
      }

      if (props.title?.startsWith("#") || props.title?.startsWith("$")) {
        return <span className="font-bold">{props.children}</span>;
      }

      return <a {...props} target="_blank" rel="noopener noreferrer" />;
    },
  };
  return (
    <>
      <ReactMarkdown
        remarkPlugins={remarkPlugins}
        components={components}
        className={cn("break-words hyphens-none line-clamp-6 whitespace-pre-wrap", className)}
      >
        {content}
      </ReactMarkdown>
    </>
  );
};

export default LensMarkdown;
