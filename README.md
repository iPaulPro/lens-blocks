![](https://img.shields.io/badge/License-MIT-blue.svg) ![](https://img.shields.io/badge/status-beta-yellow) ![](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript) [![shadcn/ui directory](https://img.shields.io/badge/shadcn%2Fui-000000?logo=shadcnui)](https://ui.shadcn.com/docs/directory) ![](https://img.shields.io/badge/DeepWiki-4192D8)

<img src="https://api.grove.storage/2f4e795c6421824396b1c14b883891257512e2b070e18c8d8fcb507fb22980ce" width="720"/>

## Introduction

Lens Blocks is a [shadcn/ui Registry](https://ui.shadcn.com/docs/registry) of useful social React components for Lens Social Protocol using the official [Lens React SDK](https://lens.xyz/docs/protocol/getting-started/react), [wagmi](https://wagmi.sh/), and [shadcn/ui](https://ui.shadcn.com/).

The registry includes essentials like a [wallet-aware login button](https://lensblocks.com/blocks/login) (using viem/wagmi), a full-featured [post component](https://lensblocks.com/blocks/post) (with markdown, mentions, reactions, collects, tips), a [follow button](https://lensblocks.com/components/follow-button), and a [WYSIWYG rich text editor](https://lensblocks.com/components/text-editor).

Each block deeply integrates with the Lens React SDK and handles wallet connection, signing, authentication, session lifecycle, optimistic updates, and state management out of the box.

## Installation

Much like shadcn/ui itself, Lens Blocks is a registry of React components that can be installed individually using the [shadcn/ui CLI](https://ui.shadcn.com/docs/cli).

The registry is part of the [official shadcn directory](https://ui.shadcn.com/docs/directory), so component installations can use the `@lens-blocks` namespace without any additional configuration. Eg:

```shell
pnpm dlx shadcn@latest add @lens-blocks/login
```
All components hook deeply into the Lens React SDK and use wagmi for wallet connection and signing. With just a single command, multiple components and libraries are added directly to your project. Everything including wallet connection, Lens API authentication, account switching, and more is handled for you. 

You can add a full Lens login flow to your app in minutes:

```typescript jsx
import { LensLogin } from "@/components/account/lens-login";
import { useSessionClient } from "@lens-protocol/react";
import { useWalletClient } from "wagmi";

export function Login() {
  const session = useSessionClient();
  const wallet = useWalletClient();

  return <LensLogin session={session} wallet={wallet} />;
}
```

<img src="https://api.grove.storage/8ab3ec1d5a983062c68988b558a71dd8924072ff9984283a7a160ab926dd6a6a" width="540"/>

View the [Login Block page](https://lensblocks.com/blocks/login) on the website for more detailed usage instructions.

## Documentation

View the [Lens Blocks Website](https://lensblocks.com/) for more detailed installation instructions and to see all available blocks, components, hooks, and libraries.

## Usage

Lens Blocks is currently in beta and subject to change. **It's not recommended to use the components in production yet**.

## Contributing

Not yet open to contributions during initial development. Feedback and suggestions are welcome!