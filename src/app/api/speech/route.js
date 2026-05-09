import { parseGroqApiKeysFromEnv } from "@/lib/groq-api-keys";

export const maxDuration = 60;
export const runtime = "nodejs";

const GROQ_SPEECH = "https://api.groq.com/openai/v1/audio/speech";
const ORPHEUS_MODEL = "canopylabs/orpheus-v1-english";
/** Groq Orpheus English voice IDs (lowercase). Troy is the doc default. */
const VOICES_TRY = ["troy", "austin", "hannah"];

/**
 * Orpheus treats `[word]` as vocal directions; assistant text can contain `[` from
 * markdown or noise and cause 400s. Strip brackets and other risky chars for TTS.
 */
function sanitizeForOrpheus(raw) {
  const s = String(raw ?? "")
    .normalize("NFKC")
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/[\[\]]/g, " ")
    .replace(/\*\*/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 185);
  return s;
}

async function groqSpeechOnce(apiKey, input, voice) {
  const payload = {
    model: ORPHEUS_MODEL,
    voice,
    input,
    response_format: "wav",
  };

  const res = await fetch(GROQ_SPEECH, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "User-Agent": "AlfayadPortfolio/1.0",
    },
    body: JSON.stringify(payload),
  });

  const ct = res.headers.get("content-type") || "";

  if (res.ok) {
    if (!ct.includes("audio") && !ct.includes("octet-stream")) {
      const text = await res.text();
      return {
        ok: false,
        status: res.status,
        error: text.slice(0, 400) || "Unexpected non-audio response",
      };
    }
    const buf = Buffer.from(await res.arrayBuffer());
    return { ok: true, buf };
  }

  let errMsg = `HTTP ${res.status}`;
  const raw = await res.text();
  try {
    const j = JSON.parse(raw);
    const m = j?.error?.message ?? j?.message;
    if (m) errMsg = String(m);
    else if (raw) errMsg = raw.slice(0, 400);
  } catch {
    if (raw) errMsg = raw.slice(0, 400);
  }
  return { ok: false, status: res.status, error: errMsg };
}

export async function POST(request) {
  const apiKeys = parseGroqApiKeysFromEnv();
  if (apiKeys.length === 0) {
    return Response.json(
      {
        error:
          "No Groq API keys configured. Set GROQ_API_KEY or GROQ_API_KEYS (see env.example).",
      },
      { status: 503 }
    );
  }

  let bodyJson;
  try {
    bodyJson = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const input = sanitizeForOrpheus(bodyJson?.text);
  if (!input) {
    return Response.json(
      { error: "Missing or empty `text` after sanitization" },
      { status: 400 }
    );
  }

  let last = { status: 502, error: "Speech generation failed" };

  outer: for (let k = 0; k < apiKeys.length; k++) {
    const key = apiKeys[k];
    for (const voice of VOICES_TRY) {
      const out = await groqSpeechOnce(key, input, voice);
      if (out.ok) {
        return new Response(out.buf, {
          status: 200,
          headers: {
            "Content-Type": "audio/wav",
            "Cache-Control": "no-store",
          },
        });
      }
      last = { status: out.status, error: out.error };
      if (out.status === 400 || out.status === 422) {
        continue;
      }
      break;
    }
    if (last.status === 429 || last.status === 503) {
      if (k < apiKeys.length - 1) continue outer;
    }
    if (last.status === 401 && k < apiKeys.length - 1) {
      continue outer;
    }
    break;
  }

  const status =
    last.status >= 400 && last.status < 600 ? last.status : 502;
  return Response.json({ error: last.error }, { status });
}
