// src/components/quiz/steps/welcome-step.tsx
"use client";

import { FormEvent } from "react";
import { Sparkles, Zap } from "lucide-react";
import { GlassCard } from "@/components/shared/glass-card";
import { LogoImage } from "@/components/shared/logo-image";
import { PrimaryButton } from "@/components/shared/primary-button";
import { useQuizStore } from "@/store/use-quiz-store";

const SCHOOL_NAME = "Delhi Public Secondary School, Barasat";
const QUIZ_TITLE = "BrainSpark CBSE";

export function WelcomeStep({ onNext }: { onNext: () => void }) {
  const { studentName, update } = useQuizStore();

  const canStart = studentName.trim().length > 0;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canStart) return;

    onNext();
  }

  return (
    <GlassCard className="quiz-step w-full max-w-xl p-8 text-center md:p-10">
      <div className="flex flex-col items-center gap-5">
        <LogoImage />

        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.35em] text-white/70">
            {SCHOOL_NAME}
          </p>

          <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">
            {QUIZ_TITLE}
          </h1>

          <p className="flex items-center justify-center gap-2 text-white/75">
            <Sparkles className="h-4 w-4 text-cyan-300" />
            <span>AI-powered CBSE practice for Classes I to VI</span>
          </p>

          <p className="text-sm text-white/60">
            Made by the students of class XI
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <input
            value={studentName}
            onChange={(event) =>
              update({ studentName: event.target.value })
            }
            placeholder="Enter your name"
            className="w-full rounded-2xl border border-white/20 bg-black/30 px-5 py-4 text-lg outline-none transition placeholder:text-white/40 focus:border-indigo-300/70 focus:ring-2 focus:ring-indigo-300/30"
          />

          <PrimaryButton
            type="submit"
            disabled={!canStart}
            className="w-full"
          >
            START
            <Zap className="h-5 w-5" />
          </PrimaryButton>
        </form>
      </div>
    </GlassCard>
  );
}