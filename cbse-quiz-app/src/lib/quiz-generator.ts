// src/lib/quiz-generator.ts
import { geminiModel } from "@/lib/gemini";
import { extractJsonArray, normalizeQuestions } from "@/lib/quiz-validation";
import type { GeminiQuizParams, QuizQuestion } from "@/types/quiz";

export async function generateQuizQuestions({
  classLevel,
  subject,
  difficulty,
  count
}: GeminiQuizParams): Promise<QuizQuestion[]> {
  const prompt = `
You are a CBSE teacher.

Generate exactly ${count} multiple-choice questions for a Class ${classLevel} student.

Subject: ${subject}
Difficulty: ${difficulty}
Curriculum: CBSE, age-appropriate, simple language.

Return ONLY a valid JSON array.
Do not include markdown.
Do not include comments.
Do not include code fences.

Each object must have exactly these fields:
question, options, correctAnswer, topic

Requirements:
- options must be an array of exactly 4 strings.
- correctAnswer must exactly match one of the strings inside options.
- topic must be a short topic name.
`.trim();

  const result = await geminiModel.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  const parsed = extractJsonArray(text);
  const questions = normalizeQuestions(parsed);

  return questions.slice(0, count);
}