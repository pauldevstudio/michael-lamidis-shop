/**
 * Chatbot stub. Replace with a real LLM provider (Anthropic, OpenAI, etc).
 * Kept intentionally simple — production code should stream and validate input.
 */
import { NextRequest } from "next/server";
import { z } from "zod";
import { ok, fail } from "@/lib/http";

const schema = z.object({ message: z.string().min(1).max(2000) });

const CANNED = [
  "Thanks for reaching out! We'll have a human follow up shortly.",
  "All our open box appliances come with a 12-month Lamidis warranty.",
  "Delivery is free across Cyprus on orders over €500.",
];

export async function POST(req: NextRequest) {
  const json = await req.json();
  const parsed = schema.safeParse(json);
  if (!parsed.success) return fail(parsed.error.message, 422);

  // TODO: replace with actual LLM call
  const reply = CANNED[Math.floor(Math.random() * CANNED.length)];
  return ok({ reply });
}
