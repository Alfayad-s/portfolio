import { parseGroqApiKeysFromEnv } from "@/lib/groq-api-keys";

export const maxDuration = 60;

const GROQ_TRANSCRIBE =
  "https://api.groq.com/openai/v1/audio/transcriptions";
const WHISPER_MODEL = "whisper-large-v3-turbo";
const MAX_BYTES = 12 * 1024 * 1024; // 12 MB

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

  let formData;
  try {
    formData = await request.formData();
  } catch {
    return Response.json({ error: "Invalid form data" }, { status: 400 });
  }

  const file = formData.get("file");
  if (!file || typeof file === "string") {
    return Response.json({ error: "Missing audio file field `file`" }, { status: 400 });
  }

  const ab = await file.arrayBuffer();
  if (ab.byteLength === 0) {
    return Response.json({ error: "Empty audio file" }, { status: 400 });
  }
  if (ab.byteLength > MAX_BYTES) {
    return Response.json(
      { error: "Audio file too large (max 12 MB)" },
      { status: 400 }
    );
  }

  const mimeType = file.type || "audio/webm";
  const filename = file.name || "audio.webm";
  const buffer = Buffer.from(ab);

  let lastText = "";
  let lastStatus = 502;

  for (let i = 0; i < apiKeys.length; i++) {
    const key = apiKeys[i];
    const body = new FormData();
    body.append("model", WHISPER_MODEL);
    body.append("file", new Blob([buffer], { type: mimeType }), filename);

    const res = await fetch(GROQ_TRANSCRIBE, {
      method: "POST",
      headers: { Authorization: `Bearer ${key}` },
      body,
    });

    lastStatus = res.status;
    const raw = await res.text();

    if (res.ok) {
      try {
        const data = JSON.parse(raw);
        const text = typeof data.text === "string" ? data.text : "";
        return Response.json({ text: text.trim() });
      } catch {
        return Response.json({ text: "" });
      }
    }

    lastText = raw.slice(0, 500);
    const retry =
      (res.status === 429 || res.status === 503 || res.status === 401) &&
      i < apiKeys.length - 1;
    if (retry) continue;
    break;
  }

  return Response.json(
    { error: lastText || "Transcription failed", status: lastStatus },
    { status: lastStatus >= 400 && lastStatus < 600 ? lastStatus : 502 }
  );
}
