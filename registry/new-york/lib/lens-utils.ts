import { EvmAddress, MediaAudioType, MediaVideoType } from "@lens-protocol/react";

export const ZeroAddress = "0x0000000000000000000000000000000000000000";
export const NATIVE_TOKEN = "0x000000000000000000000000000000000000800A";

/**
 * Truncate a string to a maximum length, adding an ellipsis in the middle
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

export const getCidFromIpfsUrl = (ipfsUrl: string): string => {
  if (!ipfsUrl.startsWith("ipfs://")) throw new Error("IPFS urls must begin with ipfs://");
  return ipfsUrl.replace("ipfs://", "").replace(/^\/+|\/+$/g, "");
};

export const ipfsUrlToGatewayUrl = (
  ipfsUrl: string | undefined,
  gatewayDomain: string = "https://ipfs.io/ipfs/",
): string | undefined => {
  if (!ipfsUrl || ipfsUrl.length === 0 || !ipfsUrl.startsWith("ipfs://")) return ipfsUrl;
  const cid = getCidFromIpfsUrl(ipfsUrl);
  const gatewayUrl = gatewayDomain + cid;
  const path = ipfsUrl.split(cid)[1];
  return path ? `${gatewayUrl}${path}` : gatewayUrl;
};

export const arweaveUrlToGatewayUrl = (
  arUrl: string | undefined,
  gatewayDomain: string = "https://arweave.net/",
): string | undefined => {
  if (!arUrl || arUrl.length === 0 || !arUrl.startsWith("ar://")) return arUrl;
  const txId = arUrl.replace("ar://", "");
  return `${gatewayDomain}${txId}`;
};

export const lensUrlToGatewayUrl = (
  lensUrl: string | undefined,
  gatewayDomain: string = "https://api.grove.storage/",
): string | undefined => {
  if (!lensUrl || lensUrl.length === 0 || !lensUrl.startsWith("lens://")) return lensUrl;
  const txId = lensUrl.replace("lens://", "");
  return `${gatewayDomain}${txId}`;
};

/**
 * Parse a URI and convert it to a gateway URL if it is an IPFS, Arweave, or Lens URL
 * @param uri The URI to parse
 */
export const parseUri = (uri: string | null | undefined): string | undefined => {
  if (!uri) return undefined;

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

export const getAudioExtension = (mediaAudioType: MediaAudioType): string | undefined => {
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
    default:
      return "";
  }
};

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
    default:
      return "";
  }
};

/**
 * Get the path for a Lens username, optionally including the namespace if it's not the default "lens" namespace.
 *
 * Examples:
 * * getUsernamePath("@lens/username") => "/u/username"
 * * getUsernamePath("@othernamespace/username", "0x1234...") => "/u/0x1234.../username"
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
