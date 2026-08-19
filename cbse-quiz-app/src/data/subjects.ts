// src/data/subjects.ts
import type { ClassLevel, Difficulty } from "@/types/quiz";

export const CLASS_LEVELS: ClassLevel[] = ["1", "2", "3", "4", "5", "6"];

export const CLASS_SUBJECTS: Record<ClassLevel, string[]> = {
  "1": ["English", "Bengali", "Hindi", "Maths", "EVS"],
  "2": ["English", "Bengali", "Hindi", "Maths", "EVS"],
  "3": ["English", "Bengali", "Hindi", "Math", "EVS"],
  "4": ["English", "Bengali", "Hindi", "Math", "EVS"],
  "5": ["English", "Bengali", "Hindi", "Math", "EVS"],
  "6": ["English", "Bengali", "Hindi", "Math", "Science", "SST"]
};

export const DIFFICULTIES: Difficulty[] = ["Easy", "Medium", "Hard"];

export const TIME_OPTIONS: number[] = [15, 30, 45, 60];

export const QUESTION_COUNT_OPTIONS: number[] = [5, 10, 15, 20];