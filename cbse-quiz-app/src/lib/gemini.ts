export async function generateGeminiText(prompt: string): Promise<string> {
  const response = await fetch("/api/gemini", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ prompt })
  });

  const body = (await response.json().catch(() => null)) as
    | { text?: unknown; error?: unknown }
    | null;

  if (!response.ok) {
    const message =
      typeof body?.error === "string"
        ? body.error
        : "Gemini could not generate a response.";

    throw new Error(message);
  }

  if (typeof body?.text !== "string" || !body.text.trim()) {
    throw new Error("Gemini returned an empty response.");
  }

  return body.text;
}
