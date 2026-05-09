import { isAllowedLinkPreviewUrl } from "@/lib/link-preview-url";
import { extractOpenGraph, readHtmlLimited } from "@/lib/og-parse";

export const maxDuration = 15;
export const revalidate = 3600;

const UA =
  "Mozilla/5.0 (compatible; FayadPortfolio/1.0; +https://vercel.com) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const raw = searchParams.get("url");
  if (!raw?.trim()) {
    return Response.json({ error: "Missing url" }, { status: 400 });
  }

  let pageUrl;
  try {
    pageUrl = new URL(raw.trim());
  } catch {
    return Response.json({ error: "Invalid URL" }, { status: 400 });
  }

  if (!isAllowedLinkPreviewUrl(pageUrl)) {
    return Response.json({ error: "URL not allowed" }, { status: 400 });
  }

  const fetchUrl = pageUrl.toString();

  try {
    const res = await fetch(fetchUrl, {
      redirect: "follow",
      headers: {
        "User-Agent": UA,
        Accept: "text/html,application/xhtml+xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
      },
      signal: AbortSignal.timeout(12_000),
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return Response.json(
        {
          url: fetchUrl,
          title: pageUrl.hostname,
          description: "",
          image: null,
          siteName: pageUrl.hostname,
          fetchStatus: res.status,
        },
        { status: 200 }
      );
    }

    const ct = res.headers.get("content-type") || "";
    if (!ct.includes("text/html") && !ct.includes("application/xhtml")) {
      return Response.json({
        url: fetchUrl,
        title: pageUrl.hostname,
        description: "",
        image: null,
        siteName: pageUrl.hostname,
      });
    }

    const html = await readHtmlLimited(res.body, 524288);
    const og = extractOpenGraph(html, pageUrl);

    let image = og.image;
    if (image && !isAllowedLinkPreviewUrl(new URL(image))) {
      image = null;
    }

    return Response.json({
      url: fetchUrl,
      title: og.title || pageUrl.hostname,
      description: og.description || "",
      image,
      siteName: og.siteName || pageUrl.hostname,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Fetch failed";
    return Response.json(
      {
        url: fetchUrl,
        title: pageUrl.hostname,
        description: "",
        image: null,
        siteName: pageUrl.hostname,
        error: message,
      },
      { status: 200 }
    );
  }
}
