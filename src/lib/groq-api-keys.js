/**
 * Groq API keys from env: comma-separated `GROQ_API_KEYS`, or a single `GROQ_API_KEY`.
 * Whitespace around keys is trimmed. Empty entries are skipped.
 */
export function parseGroqApiKeysFromEnv() {
  const multi = process.env.GROQ_API_KEYS?.trim();
  if (multi) {
    return multi
      .split(/[,;\n]+/)
      .map((k) => k.trim())
      .filter(Boolean);
  }
  const single = process.env.GROQ_API_KEY?.trim();
  return single ? [single] : [];
}

/**
 * Returns a `fetch` that retries the same request with the next API key when Groq
 * responds with 429 (rate limit), 503, or 401 (invalid key for that slot).
 */
export function createGroqRotatingFetch(apiKeys) {
  const keys = apiKeys.filter(Boolean);
  if (keys.length <= 1) return undefined;

  return async (url, reqInit) => {
    let lastResponse = null;

    for (let i = 0; i < keys.length; i++) {
      const headers = new Headers(reqInit?.headers);
      headers.set("Authorization", `Bearer ${keys[i]}`);

      const res = await fetch(url, {
        ...reqInit,
        headers,
        ...(reqInit?.duplex != null ? { duplex: reqInit.duplex } : {}),
      });

      if (res.ok) return res;

      lastResponse = res;
      await res.text().catch(() => {});

      const retry =
        (res.status === 429 ||
          res.status === 503 ||
          res.status === 401) &&
        i < keys.length - 1;
      if (retry) continue;

      return res;
    }

    return (
      lastResponse ??
      new Response(JSON.stringify({ error: "Groq request failed" }), {
        status: 502,
        headers: { "Content-Type": "application/json" },
      })
    );
  };
}
