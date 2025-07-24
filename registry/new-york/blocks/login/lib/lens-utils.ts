import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const ZeroAddress = "0x0000000000000000000000000000000000000000";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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
