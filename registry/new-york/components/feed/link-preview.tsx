import { useEffect, useState } from "react";
import getMetaFromUrl, { UrlMetadata } from "@/registry/new-york/lib/get-meta-from-url";
import getFavicon from "@/registry/new-york/lib/get-favicon";

type Props = {
  url: string;
};

export const LinkPreview = (props: Props) => {
  const { url } = props;

  const [urlMetadata, setUrlMetadata] = useState<UrlMetadata | null>(null);

  const favicon = getFavicon(url);

  useEffect(() => {
    if (!url) return;
    getMetaFromUrl({ url }).then(setUrlMetadata);
  }, [url]);

  if (!urlMetadata) {
    return null;
  }

  return (
    <div onClick={event => event.stopPropagation()}>
      <a
        href={url}
        className="w-full max-w-sm flex flex-col bg-card text-card-foreground border rounded-lg mb-4 cursor-pointer hover:!no-underline"
        target="_blank"
        rel="noopener noreferrer"
      >
        <div className="flex flex-col p-2 flex-1 min-w-0 gap-0.5">
          <div className="flex gap-1 items-center">
            <img
              src={urlMetadata.icon ?? favicon}
              width={24}
              height={24}
              alt={`${url} favicon`}
              className="w-4 h-4 p-0.5"
            />
            <div className="line-clamp-1 opacity-60 text-xs font-normal">
              {urlMetadata.siteName ? urlMetadata.siteName + " • " : ""}
              {urlMetadata.url}
            </div>
          </div>
          {urlMetadata.title && <div className="line-clamp-1 !font-bold text-sm">{urlMetadata.title}</div>}
          {urlMetadata.description && (
            <div className="line-clamp-2 text-xs !font-normal">{urlMetadata.description}</div>
          )}
        </div>
      </a>
    </div>
  );
};
