// src/types/quiz.ts
export type Difficulty = "Easy" | "Medium" | "Hard";

export type ClassLevel = "1" | "2" | "3" | "4" | "5" | "6";

export type QuizStep = 1 | 2 | 3 | 4 | 5;

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  topic: string;
}

export interface AnswerRecord {
  question: string;
  selectedAnswer: string | null;
  correctAnswer: string;
  isCorrect: boolean;
  topic: string;
}

export interface GeminiQuizParams {
  classLevel: string;
  subject: string;
  difficulty: Difficulty;
  count: number;
}

export interface GeminiAnalysisParams {
  studentName: string;
  classLevel: string;
  subject: string;
  score: number;
  total: number;
  answers: AnswerRecord[];
}