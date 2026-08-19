// src/lib/quiz-validation.ts
import type { QuizQuestion } from "@/types/quiz";

export function extractJsonArray(text: string): unknown[] {
  try {
    const parsed = JSON.parse(text);
    if (Array.isArray(parsed)) return parsed;
  } catch {
    // ignore
  }

  const match = text.match(/\[[\s\S]*\]/);
  if (match) {
    try {
      const parsed = JSON.parse(match[0]);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      // ignore
    }
  }

  return [];
}

function normalizeCorrectAnswer(raw: unknown, options: string[]): string {
  if (typeof raw === "string") {
    const trimmed = raw.trim();

    if (options.includes(trimmed)) {
      return trimmed;
    }

    const upper = trimmed.toUpperCase();

    if (/^[A-D]$/.test(upper)) {
      const index = upper.charCodeAt(0) - 65;
      if (options[index]) return options[index];
    }

    if (/^[1-4]$/.test(trimmed)) {
      const index = Number(trimmed) - 1;
      if (options[index]) return options[index];
    }

    const lowerMatch = options.find(
      (option) => option.toLowerCase() === trimmed.toLowerCase()
    );

    if (lowerMatch) return lowerMatch;
  }

  if (typeof raw === "number" && raw >= 0 && raw < options.length) {
    return options[raw];
  }

  return options[0] ?? "";
}

export function normalizeQuestions(input: unknown): QuizQuestion[] {
  if (!Array.isArray(input)) return [];

  const normalized = input
    .map((item) => {
      if (typeof item !== "object" || item === null) return null;

      const record = item as Record<string, unknown>;

      const question = String(record.question ?? "").trim();

      let options = Array.isArray(record.options)
        ? record.options
            .map((option) => String(option ?? "").trim())
            .filter(Boolean)
        : [];

      if (options.length < 4) {
        options = [
          ...options,
          ...Array.from(
            { length: 4 - options.length },
            (_, index) => `Option ${options.length + index + 1}`
          )
        ];
      }

      options = options.slice(0, 4);

      const correctAnswer = normalizeCorrectAnswer(
        record.correctAnswer ?? record.answer,
        options
      );

      const topic = String(record.topic ?? "General").trim();

      if (!question) return null;

      return {
        question,
        options,
        correctAnswer,
        topic
      };
    })
    .filter(Boolean) as QuizQuestion[];

  return normalized;
}