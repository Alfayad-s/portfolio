"use client";

import { useCallback, useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Rich link card for overlay chat: fetches OG title, description, image via /api/link-preview.
 */
export function OverlayLinkPreviewCard({ url, className }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imgBroken, setImgBroken] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const ac = new AbortController();
    setLoading(true);
    setData(null);
    setImgBroken(false);

    const t = window.setTimeout(() => {
      (async () => {
        try {
          const res = await fetch(
            `/api/link-preview?url=${encodeURIComponent(url)}`,
            { signal: ac.signal }
          );
          const json = await res.json();
          if (cancelled) return;
          setData(json);
        } catch {
          if (cancelled) return;
          setData({
            url,
            title: safeHostname(url),
            description: "",
            image: null,
            siteName: safeHostname(url),
          });
        } finally {
          if (!cancelled) setLoading(false);
        }
      })();
    }, 420);

    return () => {
      cancelled = true;
      window.clearTimeout(t);
      ac.abort();
    };
  }, [url]);

  const onImgError = useCallback(() => setImgBroken(true), []);

  if (loading) {
    return (
      <div
        className={cn(
          "flex h-10 w-full max-w-xl items-center gap-2 overflow-hidden rounded-lg border border-white/10 bg-neutral-900/50 py-1 pl-1 pr-2 font-sans",
          className
        )}
        aria-hidden
      >
        <div className="h-8 w-8 shrink-0 animate-pulse rounded-md bg-neutral-800/90" />
        <div className="h-3.5 min-w-0 flex-1 animate-pulse rounded bg-neutral-700/70" />
      </div>
    );
  }

  const title = data?.title || safeHostname(url);
  const image = data?.image;
  const siteName = data?.siteName || safeHostname(url);

  const showImage = image && !imgBroken;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group flex h-10 w-full max-w-xl items-center gap-2 overflow-hidden rounded-lg border border-white/10 bg-neutral-950/80 py-1 pl-1 pr-2 font-sans text-left shadow-sm shadow-black/30 transition-colors hover:border-sky-500/40 hover:bg-neutral-900/90",
        className
      )}
    >
      {showImage ? (
        <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-md bg-neutral-800/80">
          {/* eslint-disable-next-line @next/next/no-img-element -- arbitrary remote OG URLs */}
          <img
            src={image}
            alt=""
            className="h-full w-full object-cover object-center transition-transform duration-200 group-hover:scale-105"
            referrerPolicy="no-referrer"
            loading="lazy"
            onError={onImgError}
          />
        </div>
      ) : (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-neutral-800/90 text-[10px] font-semibold uppercase tracking-tighter text-neutral-500">
          {safeHostname(url).slice(0, 1)}
        </div>
      )}
      <p className="min-w-0 flex-1 truncate text-[0.8125rem] leading-tight text-neutral-200">
        <span className="font-medium text-neutral-100 group-hover:text-sky-200">
          {title}
        </span>
        {siteName ? (
          <span className="font-normal text-neutral-500"> · {siteName}</span>
        ) : null}
      </p>
      <ExternalLink className="h-3.5 w-3.5 shrink-0 text-neutral-500 transition-colors group-hover:text-sky-400" />
    </a>
  );
}

function safeHostname(u) {
  try {
    return new URL(u).hostname.replace(/^www\./, "");
  } catch {
    return u;
  }
}
