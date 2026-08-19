// src/components/quiz/quiz-option.tsx
"use client";

import { CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export type QuizOptionState = "default" | "correct" | "wrong" | "dim";

interface QuizOptionProps {
  option: string;
  index: number;
  state: QuizOptionState;
  disabled: boolean;
  onClick: () => void;
}

const stateStyles: Record<QuizOptionState, string> = {
  default:
    "border-white/15 bg-white/5 hover:border-indigo-300/60 hover:bg-white/10",
  correct: "border-emerald-300/80 bg-emerald-500/25",
  wrong: "border-red-300/80 bg-red-500/25",
  dim: "border-white/10 bg-white/5 opacity-45"
};

export function QuizOption({
  option,
  index,
  state,
  disabled,
  onClick
}: QuizOptionProps) {
  const letter = String.fromCharCode(65 + index);

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "flex min-h-16 items-center justify-between gap-4 rounded-2xl border px-5 py-4 text-left transition disabled:cursor-not-allowed",
        stateStyles[state]
      )}
    >
      <span className="flex items-center gap-4">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/10 font-bold">
          {letter}
        </span>
        <span className="text-base leading-relaxed md:text-lg">{option}</span>
      </span>

      {state === "correct" ? (
        <CheckCircle2 className="h-6 w-6 shrink-0 text-emerald-300" />
      ) : null}

      {state === "wrong" ? (
        <XCircle className="h-6 w-6 shrink-0 text-red-300" />
      ) : null}
    </button>
  );
}