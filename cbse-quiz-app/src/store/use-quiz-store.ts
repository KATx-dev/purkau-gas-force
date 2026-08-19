// src/store/use-quiz-store.ts
import { create } from "zustand";
import type {
  AnswerRecord,
  Difficulty,
  QuizQuestion,
  QuizStep
} from "@/types/quiz";

interface QuizState {
  step: QuizStep;
  studentName: string;
  classLevel: string | null;
  subject: string | null;
  difficulty: Difficulty;
  timePerQuestion: number;
  totalQuestions: number;
  questions: QuizQuestion[];
  currentIndex: number;
  score: number;
  answers: AnswerRecord[];
  aiAnalysis: string;
  isGeneratingQuiz: boolean;
  isGeneratingAnalysis: boolean;
  error: string | null;
}

interface QuizActions {
  update: (partial: Partial<QuizState>) => void;
  resetAll: () => void;
  retryWithSameSettings: () => void;
}

const initialState: QuizState = {
  step: 1,
  studentName: "",
  classLevel: null,
  subject: null,
  difficulty: "Medium",
  timePerQuestion: 30,
  totalQuestions: 10,
  questions: [],
  currentIndex: 0,
  score: 0,
  answers: [],
  aiAnalysis: "",
  isGeneratingQuiz: false,
  isGeneratingAnalysis: false,
  error: null
};

export const useQuizStore = create<QuizState & QuizActions>((set, get) => ({
  ...initialState,

  update: (partial) => set(partial),

  resetAll: () => set({ ...initialState }),

  retryWithSameSettings: () => {
    const {
      studentName,
      classLevel,
      subject,
      difficulty,
      timePerQuestion,
      totalQuestions
    } = get();

    set({
      ...initialState,
      studentName,
      classLevel,
      subject,
      difficulty,
      timePerQuestion,
      totalQuestions,
      step: 3
    });
  }
}));