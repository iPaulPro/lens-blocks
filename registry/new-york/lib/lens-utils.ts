import { Account, EvmAddress, MediaAudioType, MediaVideoType } from "@lens-protocol/react";

/**
 * A zero (or empty) address in EVM-compatible blockchains
 */
export const ZeroAddress = "0x0000000000000000000000000000000000000000";

/**
 * The native token address in Lens Chain
 */
export const NativeToken = "0x000000000000000000000000000000000000800A";

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
export const parseUri = (uri: string): string | undefined => {
  if (uri.startsWith("data:")) return uri; // Return data URIs as-is

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
