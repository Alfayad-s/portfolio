import { createGroq } from "@ai-sdk/groq";
import { streamText, convertToModelMessages } from "ai";
import { getPortfolioSystemPrompt } from "@/data/portfolioKnowledge";
import {
  createGroqRotatingFetch,
  parseGroqApiKeysFromEnv,
} from "@/lib/groq-api-keys";

export const maxDuration = 30;

export async function POST(req) {
  const apiKeys = parseGroqApiKeysFromEnv();
  if (apiKeys.length === 0) {
    return new Response(
      JSON.stringify({
        error:
          "No Groq API keys configured. Set GROQ_API_KEY or a comma-separated GROQ_API_KEYS in .env.local (see env.example), then restart the dev server.",
      }),
      {
        status: 503,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const rotatingFetch = createGroqRotatingFetch(apiKeys);
  const groq = createGroq({
    apiKey: apiKeys[0],
    ...(rotatingFetch ? { fetch: rotatingFetch } : {}),
  });

  try {
    const { messages } = await req.json();
    const modelMessages = await convertToModelMessages(messages);
    const result = streamText({
      model: groq("llama-3.3-70b-versatile"),
      system: getPortfolioSystemPrompt(),
      messages: modelMessages,
    });
    return result.toUIMessageStreamResponse();
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Chat request failed";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
