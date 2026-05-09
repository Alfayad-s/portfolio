/**
 * Allow only public http(s) URLs for server-side fetch (SSRF mitigation).
 * @param {URL} url
 */
export function isAllowedLinkPreviewUrl(url) {
  if (url.protocol !== "http:" && url.protocol !== "https:") return false;
  const host = url.hostname.toLowerCase();
  if (!host || host === "localhost") return false;
  if (host === "[::1]" || host.endsWith(".localhost")) return false;
  if (host.endsWith(".local")) return false;
  if (host === "0.0.0.0") return false;
  if (/^127\.\d+\.\d+\.\d+$/.test(host)) return false;
  if (/^10\.\d+\.\d+\.\d+$/.test(host)) return false;
  if (/^192\.168\.\d+\.\d+$/.test(host)) return false;
  if (/^172\.(1[6-9]|2\d|3[0-1])\.\d+\.\d+$/.test(host)) return false;
  if (/^169\.254\.\d+\.\d+$/.test(host)) return false;
  return true;
}

/**
 * @param {string} relativeOrAbsolute
 * @param {URL} basePageUrl
 */
export function resolveOgUrl(relativeOrAbsolute, basePageUrl) {
  if (!relativeOrAbsolute || typeof relativeOrAbsolute !== "string") return null;
  const t = relativeOrAbsolute.trim();
  if (!t) return null;
  try {
    if (t.startsWith("//")) {
      return new URL(`${basePageUrl.protocol}${t}`).toString();
    }
    return new URL(t, basePageUrl).toString();
  } catch {
    return null;
  }
}
