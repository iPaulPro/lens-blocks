"use client";

import CommandBlock, { CommandBlockProps } from "@/components/command-tabs";

type Props = {
  componentName: string;
};

export const InstallCommandBlock = (props: Props & CommandBlockProps) => {
  const commands = [
    {
      label: "pnpm",
      command: `pnpm dlx shadcn@latest add @lens-blocks/${props.componentName}.json`,
    },
    {
      label: "npm",
      command: `npx shadcn@latest add @lens-blocks/${props.componentName}.json`,
    },
    {
      label: "yarn",
      command: `yarn dlx shadcn@latest add @lens-blocks/${props.componentName}.json`,
    },
    {
      label: "bun",
      command: `bunx --bun shadcn@latest add @lens-blocks/${props.componentName}.json`,
    },
  ];

  return <CommandBlock commands={commands} {...props} />;
};
