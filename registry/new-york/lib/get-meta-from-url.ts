import { parseHTML } from "linkedom";

export type UrlMetadata = {
  url: string;
  title: string | null;
  description: string | null;
  siteName: string | null;
  icon: string | null;
};

type Props = {
  url: string;
  userAgent?: string;
};

const getContentFromMetaTag = (document: Document, name: string): string | undefined | null => {
  const metaTag = document.querySelector(`meta[name="${name}"]`) || document.querySelector(`meta[property="${name}"]`);
  return metaTag?.getAttribute("content");
};

export default async function getMetaFromUrl(props: Props) {
  const { url, userAgent = "LensBot/0.1 (like TwitterBot)" } = props;

  const response = await fetch(url, {
    headers: { "User-Agent": userAgent },
  });

  if (!response.ok) {
    return { url, title: null, description: null } as UrlMetadata;
  }

  const data = await response.text();
  const { document } = parseHTML(data);

  const title = getContentFromMetaTag(document, "og:title") || getContentFromMetaTag(document, "twitter:title") || null;

  const description =
    getContentFromMetaTag(document, "og:description") || getContentFromMetaTag(document, "twitter:description") || null;

  const siteName = getContentFromMetaTag(document, "og:site_name") || null;

  const iconLinkTag = document.querySelector(`link[rel="icon"]`);
  let icon = iconLinkTag?.getAttribute("href");
  if (icon?.startsWith("/")) {
    const urlObj = new URL(url);
    const absoluteUrl = `${urlObj.protocol}//${urlObj.host}${icon}`;
    icon = absoluteUrl;
  }

  return { url, title, description, siteName, icon } as UrlMetadata;
}
