// src/components/quiz/steps/quiz-settings-step.tsx
"use client";

import { ArrowLeft, Play, Settings2 } from "lucide-react";
import { GlassCard } from "@/components/shared/glass-card";
import { PrimaryButton } from "@/components/shared/primary-button";
import {
  DIFFICULTIES,
  QUESTION_COUNT_OPTIONS,
  TIME_OPTIONS
} from "@/data/subjects";
import { cn } from "@/lib/utils";
import { useQuizStore } from "@/store/use-quiz-store";

export function QuizSettingsStep({
  onBack,
  onStart
}: {
  onBack: () => void;
  onStart: () => void;
}) {
  const {
    difficulty,
    timePerQuestion,
    totalQuestions,
    isGeneratingQuiz,
    update
  } = useQuizStore();

  return (
    <GlassCard className="quiz-step w-full max-w-3xl p-8 md:p-10">
      <div className="space-y-8">
        <div className="flex items-center gap-3">
          <Settings2 className="h-8 w-8 text-cyan-300" />
          <h2 className="text-3xl font-bold">Quiz Settings</h2>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.25em] text-white/65">
              Difficulty
            </p>

            <div className="space-y-3">
              {DIFFICULTIES.map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => update({ difficulty: value })}
                  className={cn(
                    "w-full rounded-2xl border px-4 py-4 font-semibold transition",
                    difficulty === value
                      ? "border-indigo-300/70 bg-indigo-500/30"
                      : "border-white/15 bg-white/5 hover:bg-white/10"
                  )}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.25em] text-white/65">
              Time per Question
            </p>

            <div className="space-y-3">
              {TIME_OPTIONS.map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => update({ timePerQuestion: value })}
                  className={cn(
                    "w-full rounded-2xl border px-4 py-4 font-semibold transition",
                    timePerQuestion === value
                      ? "border-cyan-300/70 bg-cyan-500/25"
                      : "border-white/15 bg-white/5 hover:bg-white/10"
                  )}
                >
                  {value} seconds
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.25em] text-white/65">
              Questions
            </p>

            <div className="space-y-3">
              {QUESTION_COUNT_OPTIONS.map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => update({ totalQuestions: value })}
                  className={cn(
                    "w-full rounded-2xl border px-4 py-4 font-semibold transition",
                    totalQuestions === value
                      ? "border-emerald-300/70 bg-emerald-500/25"
                      : "border-white/15 bg-white/5 hover:bg-white/10"
                  )}
                >
                  {value} questions
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <PrimaryButton
            type="button"
            onClick={onBack}
            className="border border-white/15 bg-white/10 hover:bg-white/20"
          >
            <ArrowLeft className="h-5 w-5" />
            Back
          </PrimaryButton>

          <PrimaryButton
            type="button"
            onClick={onStart}
            disabled={isGeneratingQuiz}
          >
            Start Quiz
            <Play className="h-5 w-5" />
          </PrimaryButton>
        </div>
      </div>
    </GlassCard>
  );
}