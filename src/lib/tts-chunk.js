/** Orpheus on Groq accepts limited input length per request; keep chunks safely under the cap. */
const DEFAULT_MAX = 180;

/**
 * Split plain text into chunks suitable for TTS (word-aware).
 * @param {string} text
 * @param {number} [maxLen]
 * @returns {string[]}
 */
export function chunkTextForTts(text, maxLen = DEFAULT_MAX) {
  const t = String(text || "")
    .replace(/\s+/g, " ")
    .trim();
  if (!t) return [];

  const out = [];
  let pos = 0;
  while (pos < t.length) {
    let end = Math.min(pos + maxLen, t.length);
    if (end < t.length) {
      const sp = t.lastIndexOf(" ", end);
      if (sp > pos + 24) end = sp;
    }
    const piece = t.slice(pos, end).trim();
    if (piece) out.push(piece);
    pos = end;
    while (pos < t.length && t[pos] === " ") pos += 1;
  }
  return out;
}
