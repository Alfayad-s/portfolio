import { resolveOgUrl } from "@/lib/link-preview-url";

function decodeBasicEntities(s) {
  if (!s) return s;
  return s
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&#x27;/gi, "'")
    .replace(/&#(\d+);/g, (_, n) => {
      const code = Number.parseInt(n, 10);
      return Number.isFinite(code) ? String.fromCodePoint(code) : _;
    })
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => {
      const code = Number.parseInt(h, 16);
      return Number.isFinite(code) ? String.fromCodePoint(code) : _;
    });
}

/**
 * @param {string} html
 * @param {string} prop property or name value to match (lowercase)
 */
function metaContent(html, prop) {
  const esc = prop.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const patterns = [
    new RegExp(
      `<meta[^>]+property=["']${esc}["'][^>]*content=["']([^"']*)["']`,
      "i"
    ),
    new RegExp(
      `<meta[^>]*content=["']([^"']*)["'][^>]*property=["']${esc}["']`,
      "i"
    ),
    new RegExp(
      `<meta[^>]+name=["']${esc}["'][^>]*content=["']([^"']*)["']`,
      "i"
    ),
    new RegExp(
      `<meta[^>]*content=["']([^"']*)["'][^>]*name=["']${esc}["']`,
      "i"
    ),
  ];
  for (const re of patterns) {
    const m = html.match(re);
    if (m?.[1] != null) return decodeBasicEntities(m[1]);
  }
  return null;
}

function mergeUint8Arrays(chunks) {
  const len = chunks.reduce((s, c) => s + c.length, 0);
  const out = new Uint8Array(len);
  let off = 0;
  for (const c of chunks) {
    out.set(c, off);
    off += c.length;
  }
  return out;
}

/**
 * Read up to maxBytes of HTML (enough for <head> OG tags on typical pages).
 * @param {import('stream/web').ReadableStream<Uint8Array> | null} body
 * @param {number} maxBytes
 */
export async function readHtmlLimited(body, maxBytes = 524288) {
  if (!body) return "";
  const reader = body.getReader();
  const chunks = [];
  let total = 0;
  const decoder = new TextDecoder();
  try {
    while (total < maxBytes) {
      const { done, value } = await reader.read();
      if (done) break;
      if (!value?.length) continue;
      const nextTotal = total + value.length;
      if (nextTotal > maxBytes) {
        const take = maxBytes - total;
        chunks.push(value.slice(0, take));
        total = maxBytes;
        break;
      }
      chunks.push(value);
      total = nextTotal;
      const partial = decoder.decode(mergeUint8Arrays(chunks), { stream: true });
      if (/<\/head\s*>/i.test(partial)) break;
    }
  } finally {
    try {
      await reader.cancel();
    } catch {
      /* ignore */
    }
  }
  return decoder.decode(mergeUint8Arrays(chunks));
}

/**
 * @param {string} html
 * @param {URL} pageUrl
 */
export function extractOpenGraph(html, pageUrl) {
  const titleTag = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  const titleFromTag = titleTag?.[1]
    ? decodeBasicEntities(titleTag[1].trim())
    : null;
  const title =
    metaContent(html, "og:title") ||
    metaContent(html, "twitter:title") ||
    titleFromTag;

  const description =
    metaContent(html, "og:description") ||
    metaContent(html, "twitter:description") ||
    metaContent(html, "description");

  const imageRaw =
    metaContent(html, "og:image") ||
    metaContent(html, "twitter:image") ||
    metaContent(html, "twitter:image:src");

  const image = imageRaw ? resolveOgUrl(imageRaw, pageUrl) : null;

  const siteName =
    metaContent(html, "og:site_name") ||
    metaContent(html, "application-name") ||
    pageUrl.hostname;

  return {
    title: title || pageUrl.hostname,
    description: description || "",
    image,
    siteName: siteName || pageUrl.hostname,
  };
}
