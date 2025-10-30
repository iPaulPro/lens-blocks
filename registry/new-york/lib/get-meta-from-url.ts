import { parse } from "node-html-parser";

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

export default async function getMetaFromUrl({ url, userAgent = "LensBot/0.1 (like TwitterBot)" }: Props) {
  const res = await fetch(url, { headers: { "User-Agent": userAgent }, redirect: "follow" });
  if (!res.ok) return { url, title: null, description: null, siteName: null, icon: null };

  const html = await res.text();
  const root = parse(html);

  const pick = (names: string[]) => {
    for (const name of names) {
      const tag = root.querySelector(`meta[name="${name}"]`) || root.querySelector(`meta[property="${name}"]`);
      const val = tag?.getAttribute("content");
      if (val) return val;
    }
    return null;
  };

  const title = pick(["og:title", "twitter:title"]) || root.querySelector("title")?.text.trim() || null;

  const description = pick(["og:description", "twitter:description", "description"]) || null;

  const siteName = pick(["og:site_name"]) || null;

  const iconTags = root.querySelectorAll(
    'link[rel="icon"], link[rel="shortcut icon"], link[rel="apple-touch-icon"], link[rel="mask-icon"]',
  );

  let icon: string | null = null;
  let bestScore = -1;
  for (const el of iconTags) {
    const href = el.getAttribute("href");
    if (!href) continue;
    let score = href.toLowerCase().endsWith(".svg") ? 1000 : 0;
    const sizes = el.getAttribute("sizes");
    if (sizes) {
      const m = sizes.match(/(\d+)x(\d+)/);
      if (m) score += Math.max(parseInt(m[1], 10), parseInt(m[2], 10));
    }
    if (score > bestScore) {
      bestScore = score;
      icon = new URL(href, url).toString();
    }
  }
  if (!icon) icon = new URL("/favicon.ico", url).toString();

  return { url, title, description, siteName, icon };
}
