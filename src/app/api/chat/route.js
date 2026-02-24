import { groq } from "@ai-sdk/groq";
import { streamText, convertToModelMessages } from "ai";
import { getPortfolioSystemPrompt } from "@/data/portfolioKnowledge";

export const maxDuration = 30;

export async function POST(req) {
  const { messages } = await req.json();
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "GROQ_API_KEY is not configured" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
  const modelMessages = await convertToModelMessages(messages);
  const result = streamText({
    model: groq("llama-3.3-70b-versatile"),
    system: getPortfolioSystemPrompt(),
    messages: modelMessages,
  });
  return result.toUIMessageStreamResponse();
}
