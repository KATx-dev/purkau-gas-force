import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const MODEL_NAME = "gemini-2.5-flash-lite";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Request body must be valid JSON." },
      { status: 400 }
    );
  }

  const prompt =
    typeof body === "object" && body !== null && "prompt" in body
      ? (body as { prompt?: unknown }).prompt
      : undefined;

  if (typeof prompt !== "string" || !prompt.trim()) {
    return NextResponse.json(
      { error: "A non-empty prompt is required." },
      { status: 400 }
    );
  }

  const apiKey = process.env.GEMINI_API_KEY ?? process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "Gemini is not configured. Add GEMINI_API_KEY to the server environment."
      },
      { status: 500 }
    );
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return NextResponse.json({ text });
  } catch (error) {
    console.error("Gemini request failed", error);

    return NextResponse.json(
      { error: "Gemini could not generate a response. Please try again." },
      { status: 502 }
    );
  }
}
