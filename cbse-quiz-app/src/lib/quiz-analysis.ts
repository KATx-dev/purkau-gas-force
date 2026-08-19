// src/lib/quiz-analysis.ts
import { generateGeminiText } from "@/lib/gemini";
import type { GeminiAnalysisParams } from "@/types/quiz";

export async function generateQuizAnalysis({
  studentName,
  classLevel,
  subject,
  score,
  total,
  answers
}: GeminiAnalysisParams): Promise<string> {
  const correctTopics = [
    ...new Set(
      answers
        .filter((answer) => answer.isCorrect)
        .map((answer) => answer.topic)
        .filter(Boolean)
    )
  ];

  const weakTopics = [
    ...new Set(
      answers
        .filter((answer) => !answer.isCorrect)
        .map((answer) => answer.topic)
        .filter(Boolean)
    )
  ];

  const prompt = `
You are a friendly CBSE teacher.

Student name: ${studentName || "Student"}
Class: ${classLevel}
Subject: ${subject}
Score: ${score} out of ${total}

Topics answered correctly: ${correctTopics.join(", ") || "None"}
Topics answered incorrectly: ${weakTopics.join(", ") || "None"}

Write a short, warm, encouraging analysis for a young student.
Maximum 4 sentences.
Congratulate strong topics.
Gently suggest weak topics to practice.
Do not use markdown.
`.trim();

  try {
    return await generateGeminiText(prompt);
  } catch {
    return `Great effort, ${studentName || "student"}! You scored ${score} out of ${total}. Keep practicing ${subject} and you will become even stronger.`;
  }
}