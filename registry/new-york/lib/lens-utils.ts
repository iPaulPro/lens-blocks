import {
  Account,
  AnyPost,
  EvmAddress,
  MediaAudioType,
  MediaVideoType,
  Post,
  ReferencedPost,
  SigningError,
  TransactionIndexingError,
  UnauthenticatedError,
  UnexpectedError,
  ValidationError,
} from "@lens-protocol/react";
import { chains } from "@lens-chain/sdk/viem";
import { PostMetadata } from "@lens-protocol/metadata";

/**
 * The chain ID for the Lens Chain mainnet
 */
export const LensChainId = chains.mainnet.id;

/**
 * The chain ID for the Lens Chain testnet
 */
export const LensChainTestnetId = chains.testnet.id;

/**
 * A zero (or empty) address in EVM-compatible blockchains
 */
export const ZeroAddress = "0x0000000000000000000000000000000000000000";

/**
 * The native token address in Lens Chain
 */
export const LensChainNativeToken = "0x000000000000000000000000000000000000800A";

/**
 * Truncate a string to a maximum length, adding an ellipsis in the middle
 *
 * @param address The string to truncate
 * @param maxLength The maximum length of the truncated string, excluding the ellipsis and 0x prefix
 */
export const truncateAddress = (address: string, maxLength: number = 8): string => {
  if (address.length <= maxLength) {
    return address;
  }
  const ellipsis = "…";
  const startLength = Math.ceil((maxLength + ellipsis.length) / 2) + 1;
  const endLength = Math.floor((maxLength + ellipsis.length) / 2);
  return address.slice(0, startLength) + ellipsis + address.slice(address.length - endLength);
};

/**
 * Extract the CID from an IPFS URL
 *
 * @example getCidFromIpfsUrl("ipfs://Qm...") => "Qm..."
 * @example getCidFromIpfsUrl("ipfs://Qm.../path/to/file") => "Qm..."
 *
 * @param ipfsUrl The IPFS URL to extract the CID from
 */
export const getCidFromIpfsUrl = (ipfsUrl: string): string => {
  if (!ipfsUrl.startsWith("ipfs://")) throw new Error("IPFS urls must begin with ipfs://");
  return ipfsUrl.replace("ipfs://", "").replace(/^\/+|\/+$/g, "");
};

/**
 *  Convert an IPFS URL to a gateway URL
 *
 * @example ipfsUrlToGatewayUrl("ipfs://Qm...") => "https://ipfs.io/ipfs/Qm..."
 * @example ipfsUrlToGatewayUrl("ipfs://Qm.../path/to/file") => "https://ipfs.io/ipfs/Qm.../path/to/file"
 *
 * @param ipfsUrl The IPFS URL to convert
 * @param gatewayDomain The gateway domain to use (default: https://ipfs.io/ipfs/)
 */
export const ipfsUrlToGatewayUrl = (ipfsUrl: string, gatewayDomain: string = "https://ipfs.io/ipfs/"): string => {
  if (ipfsUrl.length === 0 || !ipfsUrl.startsWith("ipfs://")) return ipfsUrl;
  const cid = getCidFromIpfsUrl(ipfsUrl);
  const gatewayUrl = gatewayDomain + cid;
  const path = ipfsUrl.split(cid)[1];
  return path ? `${gatewayUrl}${path}` : gatewayUrl;
};

/**
 * Convert an Arweave URL to a gateway URL
 *
 * @example arweaveUrlToGatewayUrl("ar://TxId") => "https://arweave.net/TxId"
 *
 * @param arUrl The Arweave URL to convert
 * @param gatewayDomain The gateway domain to use (default: https://arweave.net/)
 */
export const arweaveUrlToGatewayUrl = (arUrl: string, gatewayDomain: string = "https://arweave.net/"): string => {
  if (arUrl.length === 0 || !arUrl.startsWith("ar://")) return arUrl;
  const txId = arUrl.replace("ar://", "");
  return `${gatewayDomain}${txId}`;
};

/**
 * Convert a Lens URL to a gateway URL
 *
 * @example lensUrlToGatewayUrl("lens://TxId") => "https://api.grove.storage/TxId"
 *
 * @param lensUrl The Lens URL to convert
 * @param gatewayDomain The gateway domain to use (default: https://api.grove.storage/)
 */
export const lensUrlToGatewayUrl = (lensUrl: string, gatewayDomain: string = "https://api.grove.storage/"): string => {
  if (lensUrl.length === 0 || !lensUrl.startsWith("lens://")) return lensUrl;
  const txId = lensUrl.replace("lens://", "");
  return `${gatewayDomain}${txId}`;
};

/**
 * Parse a URI and convert it to a gateway URL if it is an IPFS, Arweave, or Lens URL
 *
 * @param uri The URI to parse
 * @returns The parsed URI as a gateway URL, or null if the URI is invalid
 */
export const parseUri = (uri: string | undefined): string | undefined => {
  if (!uri || uri.startsWith("data:")) return uri; // Return data URIs as-is

  if (uri.startsWith("https://gw.ipfs-lens.dev/ipfs/")) {
    const ipfs = uri.replace("https://gw.ipfs-lens.dev/ipfs/", "ipfs://");
    return ipfsUrlToGatewayUrl(ipfs);
  }

  try {
    const { protocol } = new URL(uri);
    switch (protocol) {
      case "ipfs:":
        return ipfsUrlToGatewayUrl(uri);
      case "ar:":
        return arweaveUrlToGatewayUrl(uri);
      case "lens:":
        return lensUrlToGatewayUrl(uri);
      default:
        return uri;
    }
  } catch {
    return undefined;
  }
};

/**
 * Get the file extension for a given MediaAudioType
 *
 * @param mediaAudioType The MediaAudioType to get the extension for
 */
export const getAudioExtension = (mediaAudioType: MediaAudioType): string => {
  switch (mediaAudioType) {
    case MediaAudioType.AudioWav:
      return "wav";
    case MediaAudioType.AudioVndWave:
      return "wave";
    case MediaAudioType.AudioMpeg:
      return "mp3";
    case MediaAudioType.AudioOgg:
      return "ogg";
    case MediaAudioType.AudioMp4:
      return "mp4";
    case MediaAudioType.AudioAac:
      return "aac";
    case MediaAudioType.AudioWebm:
      return "webm";
    case MediaAudioType.AudioFlac:
      return "flac";
  }
};

/**
 * Get the file extension for a given MediaVideoType
 *
 * @param mediaVideoType The MediaVideoType to get the extension for
 */
export const getVideoExtension = (mediaVideoType: MediaVideoType): string => {
  switch (mediaVideoType) {
    case MediaVideoType.VideoMp4:
      return "mp4";
    case MediaVideoType.VideoMpeg:
      return "mpeg";
    case MediaVideoType.VideoOgg:
      return "ogg";
    case MediaVideoType.VideoQuicktime:
      return "mov";
    case MediaVideoType.VideoWebm:
      return "webm";
    case MediaVideoType.VideoMov:
      return "mov";
    case MediaVideoType.VideoOgv:
      return "ogv";
    case MediaVideoType.VideoXm4v:
      return "xm4v";
    case MediaVideoType.ModelGltfJson:
      return "gltf";
    case MediaVideoType.ModelGltfBinary:
      return "glb";
  }
};

/**
 * Get the path for a Lens username, optionally including the namespace if it's not the default "lens" namespace.
 *
 * @example getUsernamePath("@lens/username") => "/u/username"
 * @example getUsernamePath("@othernamespace/username", "0x1234...") => "/u/0x1234.../username"
 *
 * @param username - The full username, including the namespace (e.g., "@lens/username")
 * @param namespace - The namespace address of the username. If not provided, the default namespace will be assumed.
 */
export const getUsernamePath = (username: string, namespace?: EvmAddress): string => {
  let path = "/u/";
  if (namespace && !username.startsWith("@lens")) path += `${namespace}/`;
  path += `${username.split("/")[1]}`;
  return path;
};

/**
 * Format a follower count as a string, using "k" for thousands and "m" for millions
 *
 * @example formatFollowerCount(123) => "123"
 * @example formatFollowerCount(12345) => "12.3k"
 * @example formatFollowerCount(1234567) => "1.2m"
 *
 * @param count The follower count to format
 */
export const formatFollowerCount = (count: number): string => {
  if (count >= 1_000_000) {
    return (count / 1_000_000).toFixed(1).replace(/\.0$/, "") + "m";
  } else if (count >= 10_000) {
    return (count / 1_000).toFixed(1).replace(/\.0$/, "") + "k";
  }
  return count.toString();
};

/**
 * Get the display name for an account, prioritizing the metadata name, then the username,
 * and finally truncating the address.
 *
 * @param account The account to get the display name for
 */
export const getDisplayName = (account: Account): string => {
  if (account.metadata?.name) {
    return account.metadata.name;
  }
  if (account.username) {
    return `@${account.username.localName}`;
  }
  return truncateAddress(account.address);
};

/**
 *  Converts an unknown error to a Lens API `UnexpectedError`, or returns the original error if it's a known error.'
 */
export const toApiError = (
  e: unknown,
): SigningError | TransactionIndexingError | UnauthenticatedError | UnexpectedError | ValidationError => {
  if (
    e instanceof SigningError ||
    e instanceof TransactionIndexingError ||
    e instanceof UnauthenticatedError ||
    e instanceof UnexpectedError ||
    e instanceof ValidationError
  )
    return e;
  return { name: "UnexpectedError", cause: e } as UnexpectedError;
};

type AudioPost =
  | (Post & { metadata: { __typename: "AudioMetadata" } })
  | (ReferencedPost & { metadata: { __typename: "AudioMetadata" } });

type ArticlePost =
  | (Post & { metadata: { __typename: "ArticleMetadata" } })
  | (ReferencedPost & { metadata: { __typename: "ArticleMetadata" } });

type ImagePost =
  | (Post & { metadata: { __typename: "ImageMetadata" } })
  | (ReferencedPost & { metadata: { __typename: "ImageMetadata" } });

type LinkPost =
  | (Post & { metadata: { __typename: "LinkMetadata" } })
  | (ReferencedPost & { metadata: { __typename: "LinkMetadata" } });

type LiveStreamPost =
  | (Post & { metadata: { __typename: "LiveStreamMetadata" } })
  | (ReferencedPost & { metadata: { __typename: "LiveStreamMetadata" } });

type MintPost =
  | (Post & { metadata: { __typename: "MintMetadata" } })
  | (ReferencedPost & { metadata: { __typename: "MintMetadata" } });

type SpacePost =
  | (Post & { metadata: { __typename: "SpaceMetadata" } })
  | (ReferencedPost & { metadata: { __typename: "SpaceMetadata" } });

type StoryPost =
  | (Post & { metadata: { __typename: "StoryMetadata" } })
  | (ReferencedPost & { metadata: { __typename: "StoryMetadata" } });

type TextOnlyPost =
  | (Post & { metadata: { __typename: "TextOnlyMetadata" } })
  | (ReferencedPost & { metadata: { __typename: "TextOnlyMetadata" } });

type ThreeDPost =
  | (Post & { metadata: { __typename: "ThreeDMetadata" } })
  | (ReferencedPost & { metadata: { __typename: "ThreeDMetadata" } });

type TransactionPost =
  | (Post & { metadata: { __typename: "TransactionMetadata" } })
  | (ReferencedPost & { metadata: { __typename: "TransactionMetadata" } });

type VideoPost =
  | (Post & { metadata: { __typename: "VideoMetadata" } })
  | (ReferencedPost & { metadata: { __typename: "VideoMetadata" } });

/**
 * Type guard that checks whether a post has a `metadata` field.
 *
 * Narrows `AnyPost` to a `Post`/`ReferencedPost` with a non-`undefined` `metadata`.
 *
 * @param post - The post to inspect.
 * @returns `true` if `post.metadata` exists and is not `undefined`; otherwise `false`.
 *
 * @example
 * if (hasMetadata(post)) {
 *   // post.metadata is now typed as PostMetadata
 *   console.log(post.metadata.__typename);
 * }
 */
export const hasMetadata = (
  post: AnyPost,
): post is (Post & { metadata: PostMetadata }) | (ReferencedPost & { metadata: PostMetadata }) =>
  "metadata" in post && post.metadata !== undefined;

/**
 * Internal helper that checks if a post has metadata of a specific GraphQL `__typename`.
 *
 * @param post - The post to inspect.
 * @param metadataType - The expected `__typename` of the post's metadata (e.g., `ImageMetadata`).
 * @returns `true` if the post has metadata and its `__typename` matches `metadataType`.
 *
 * @example
 * isPostWithMetadata(post, "VideoMetadata"); // -> boolean
 */
const isPostWithMetadata = (post: AnyPost, metadataType: string): boolean =>
  hasMetadata(post) && post.metadata.__typename === metadataType;

/**
 * Type guard for posts whose metadata is `ArticleMetadata`.
 *
 * @param post - The post to inspect.
 * @returns `true` if the post's metadata `__typename` is `ArticleMetadata`.
 *
 * @example
 * if (isArticlePost(post)) {
 *   // post.metadata.__typename === "ArticleMetadata"
 * }
 */
export const isArticlePost = (post: AnyPost): post is ArticlePost => isPostWithMetadata(post, "ArticleMetadata");

/**
 * Type guard for posts whose metadata is `AudioMetadata`.
 *
 * @param post - The post to inspect.
 * @returns `true` if the post's metadata `__typename` is `AudioMetadata`.
 *
 * @example
 * if (isAudioPost(post)) {
 *   // Safe to treat as an audio post
 * }
 */
export const isAudioPost = (post: AnyPost): post is AudioPost => isPostWithMetadata(post, "AudioMetadata");

/**
 * Type guard for posts whose metadata is `ImageMetadata`.
 *
 * @param post - The post to inspect.
 * @returns `true` if the post's metadata `__typename` is `ImageMetadata`.
 */
export const isImagePost = (post: AnyPost): post is ImagePost => isPostWithMetadata(post, "ImageMetadata");

/**
 * Type guard for posts whose metadata is `LinkMetadata`.
 *
 * @param post - The post to inspect.
 * @returns `true` if the post's metadata `__typename` is `LinkMetadata`.
 */
export const isLinkPost = (post: AnyPost): post is LinkPost => isPostWithMetadata(post, "LinkMetadata");

/**
 * Type guard for posts whose metadata is `LiveStreamMetadata`.
 *
 * @param post - The post to inspect.
 * @returns `true` if the post's metadata `__typename` is `LiveStreamMetadata`.
 */
export const isLiveStreamPost = (post: AnyPost): post is LiveStreamPost =>
  isPostWithMetadata(post, "LiveStreamMetadata");

/**
 * Type guard for posts whose metadata is `MintMetadata`.
 *
 * @param post - The post to inspect.
 * @returns `true` if the post's metadata `__typename` is `MintMetadata`.
 */
export const isMintPost = (post: AnyPost): post is MintPost => isPostWithMetadata(post, "MintMetadata");

/**
 * Type guard for posts whose metadata is `SpaceMetadata`.
 *
 * @param post - The post to inspect.
 * @returns `true` if the post's metadata `__typename` is `SpaceMetadata`.
 */
export const isSpacePost = (post: AnyPost): post is SpacePost => isPostWithMetadata(post, "SpaceMetadata");

/**
 * Type guard for posts whose metadata is `StoryMetadata`.
 *
 * @param post - The post to inspect.
 * @returns `true` if the post's metadata `__typename` is `StoryMetadata`.
 */
export const isStoryPost = (post: AnyPost): post is StoryPost => isPostWithMetadata(post, "StoryMetadata");

/**
 * Type guard for posts whose metadata is `TextOnlyMetadata`.
 *
 * @param post - The post to inspect.
 * @returns `true` if the post's metadata `__typename` is `TextOnlyMetadata`.
 */
export const isTextOnlyPost = (post: AnyPost): post is TextOnlyPost => isPostWithMetadata(post, "TextOnlyMetadata");

/**
 * Type guard for posts whose metadata is `ThreeDMetadata`.
 *
 * @param post - The post to inspect.
 * @returns `true` if the post's metadata `__typename` is `ThreeDMetadata`.
 */
export const isThreeDPost = (post: AnyPost): post is ThreeDPost => isPostWithMetadata(post, "ThreeDMetadata");

/**
 * Type guard for posts whose metadata is `TransactionMetadata`.
 *
 * @param post - The post to inspect.
 * @returns `true` if the post's metadata `__typename` is `TransactionMetadata`.
 */
export const isTransactionPost = (post: AnyPost): post is TransactionPost =>
  isPostWithMetadata(post, "TransactionMetadata");

/**
 * Type guard for posts whose metadata is `VideoMetadata`.
 *
 * @param post - The post to inspect.
 * @returns `true` if the post's metadata `__typename` is `VideoMetadata`.
 */
export const isVideoPost = (post: AnyPost): post is VideoPost => isPostWithMetadata(post, "VideoMetadata");

/**
 * Safely extracts a textual `content` field from a post's metadata, if present.
 *
 * This is useful for metadata types that include a `content` property (e.g., text or article types).
 *
 * @param post - The post whose metadata content should be read.
 * @returns The `content` string if present on `post.metadata`; otherwise `undefined`.
 *
 * @example
 * const content = getMetadataContent(post);
 * if (content) {
 *   render(content);
 * }
 */
export const getMetadataContent = (post: AnyPost): string | undefined => {
  if (hasMetadata(post) && "content" in post.metadata) {
    return post.metadata.content;
  }
  return undefined;
};
