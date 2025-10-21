"use client";

import { forwardRef, useEffect, useImperativeHandle } from "react";
import { BubbleMenu, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import { unified } from "unified";
import rehypeParse from "rehype-parse";
import rehypeRemark from "rehype-remark";
import remarkStringify from "remark-stringify";
import remarkGfm from "remark-gfm";
import { RegEx } from "@/registry/new-york/lib/regex";
// @ts-ignore
import linkifyRegex from "remark-linkify-regex";
import { Mention } from "@/registry/new-york/lib/mention";
import { rehypeMentionToMarkdown } from "@/registry/new-york/lib/rehype-mention-to-markdown";
import { BoldIcon, CodeIcon, ItalicIcon, StrikethroughIcon, TextQuoteIcon } from "lucide-react";
import { Button } from "@/registry/new-york/ui/button";
import remarkParse from "remark-parse";
import rehypeStringify from "rehype-stringify";

export interface TextEditorRef {
  getContent: () => string;
  setContent: (content: string) => void;
  clearContent: () => void;
}

type Props = {
  editable?: boolean;
  className?: string;
  placeholder?: string;
};

const LensTextEditor = forwardRef<TextEditorRef, Props>(({ editable = true, className, placeholder }, ref) => {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        hardBreak: false,
        heading: false,
        horizontalRule: false,
      }),
      Placeholder.configure({
        placeholder: placeholder ?? "What's happening?",
        showOnlyWhenEditable: false,
      }),
      Mention,
      Link.configure({
        openOnClick: false,
        autolink: true,
      }),
    ],
  });

  useEffect(() => {
    editor?.setEditable(editable);
    if (!editable && editor?.getText().trim().length === 0) {
      editor?.view?.dom?.classList.add("opacity-20");
      editor?.view?.dom?.classList.add("cursor-not-allowed");
    } else {
      editor?.view?.dom?.classList.remove("opacity-20");
      editor?.view?.dom?.classList.remove("cursor-not-allowed");
    }
  }, [editor, editable]);

  // Allow underscores in username mentions
  const unescapeUnderscore = (str: string) => {
    return str.replace(/(^|[^\\])\\_/g, "$1_");
  };

  const getContent = () => {
    let html = editor?.getHTML();
    if (!html) return "";

    const markdown = unified()
      .use(rehypeParse)
      .use(rehypeMentionToMarkdown)
      .use(rehypeRemark)
      .use(remarkGfm)
      .use(linkifyRegex(RegEx.URL))
      .use(remarkStringify)
      .processSync(html)
      .toString();

    return unescapeUnderscore(markdown);
  };

  const setContent = (markdown: string) => {
    const html = unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkStringify)
      .use(rehypeRemark)
      .use(rehypeStringify)
      .processSync(markdown)
      .toString();

    editor?.commands.setContent(html);
  };

  useImperativeHandle(ref, () => ({
    getContent,
    setContent,
    clearContent: () => editor?.commands.clearContent(),
  }));

  return (
    <>
      {editor && (
        <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
          <div className="bubble-menu bg-background border rounded-lg shadow-lg flex py-1 px-2 gap-2 text-sm font-semibold">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={editor.isActive("bold") ? "is-active" : ""}
            >
              <BoldIcon />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={editor.isActive("italic") ? "is-active" : ""}
            >
              <ItalicIcon />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={editor.isActive("strike") ? "is-active" : ""}
            >
              <StrikethroughIcon />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => editor.chain().focus().toggleCode().run()}
              className={editor.isActive("code") ? "is-active" : ""}
            >
              <CodeIcon />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={editor.isActive("blockquote") ? "is-active" : ""}
            >
              <TextQuoteIcon />
            </Button>
          </div>
        </BubbleMenu>
      )}
      <EditorContent editor={editor} className={className} />
    </>
  );
});

export default LensTextEditor;
