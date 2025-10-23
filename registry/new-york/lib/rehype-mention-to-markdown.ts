import { visit } from "unist-util-visit";
import { Root } from "hast";

/**
 * Rehype plugin to convert local name mention elements to full mentions with namespace.
 *
 * eg: @paul -> @lens/paul
 */
export const rehypeMentionToMarkdown = () => (tree: Root) => {
  visit(tree, "element", node => {
    if (
      node.tagName === "span" &&
      node.properties &&
      node.properties.dataType === "mention" &&
      node.properties.dataId
    ) {
      const dataId = String(node.properties.dataId);
      node.children = [{ type: "text", value: `@${dataId}` }];
    }
  });
};
