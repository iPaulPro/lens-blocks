import BuiltInMention from "@tiptap/extension-mention";
import { ReactRenderer } from "@tiptap/react";
import { LensMentionsList } from "../components/common/editor/lens-mentions-list";
import tippy, { Instance } from "tippy.js";
import config from "@/lib/lens/config";

import { fetchAccounts } from "@lens-protocol/client/actions";
import { PublicClient } from "@lens-protocol/react";

const client = PublicClient.create({
  environment: config.environment,
});

const suggestion = {
  items: async ({ query }: { query: string }) => {
    if (query.length === 0) return [];

    const accounts = await fetchAccounts(client, {
      filter: {
        searchBy: {
          localNameQuery: query,
        },
      },
    });
    if (accounts.isOk()) {
      return [...accounts.value.items];
    }

    return [];
  },

  render: () => {
    let component: ReactRenderer<any>;
    let popup: Instance[];

    return {
      onStart: (props: any) => {
        component = new ReactRenderer(LensMentionsList, {
          props,
          editor: props.editor,
        });

        if (!props.clientRect) {
          return;
        }

        popup = tippy("body", {
          getReferenceClientRect: props.clientRect,
          appendTo: () => document.body,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: "manual",
          placement: "bottom-start",
        });
      },

      onUpdate(props: any) {
        component.updateProps(props);

        if (!props.clientRect) {
          return;
        }

        popup[0].setProps({
          getReferenceClientRect: props.clientRect,
        });
      },

      onKeyDown(props: any) {
        if (props.event.key === "Escape") {
          popup[0].hide();

          return true;
        }

        return component.ref?.onKeyDown(props);
      },

      onExit() {
        popup[0].destroy();
        component.destroy();
      },
    };
  },
};

export const Mention = BuiltInMention.extend().configure({
  HTMLAttributes: {
    class: "font-bold",
  },
  renderHTML({ options, node }) {
    return ["span", options.HTMLAttributes, `@${node.attrs.id.replace("lens/", "")}`];
  },
  renderText({ node }) {
    return `@${node.attrs.id.replace("lens/", "")}`;
  },
  deleteTriggerWithBackspace: true,
  suggestion,
});
