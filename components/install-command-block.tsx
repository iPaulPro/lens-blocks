"use client";

import CommandBlock, { CommandBlockProps } from "@/components/command-tabs";
import { track } from "@vercel/analytics";

type Props = {
  componentName: string;
};

export const InstallCommandBlock = (props: Props & CommandBlockProps) => {
  const commands = [
    {
      label: "pnpm",
      command: `pnpm dlx shadcn@latest add @lens-blocks/${props.componentName}`,
    },
    {
      label: "npm",
      command: `npx shadcn@latest add @lens-blocks/${props.componentName}`,
    },
    {
      label: "yarn",
      command: `yarn dlx shadcn@latest add @lens-blocks/${props.componentName}`,
    },
    {
      label: "bun",
      command: `bunx --bun shadcn@latest add @lens-blocks/${props.componentName}`,
    },
  ];

  return (
    <CommandBlock
      commands={commands}
      {...props}
      onCopy={() => track("install_command_copied", { component: props.componentName })}
    />
  );
};
