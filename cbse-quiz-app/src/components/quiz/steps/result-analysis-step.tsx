// src/components/quiz/steps/result-analysis-step.tsx
"use client";

import { useEffect } from "react";
import { BrainCircuit, Medal, RefreshCcw, RotateCcw } from "lucide-react";
import { GlassCard } from "@/components/shared/glass-card";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { PrimaryButton } from "@/components/shared/primary-button";
import { generateQuizAnalysis } from "@/lib/quiz-analysis";
import { useQuizStore } from "@/store/use-quiz-store";

export function ResultAnalysisStep({
  onPlayAgain,
  onRetry
}: {
  onPlayAgain: () => void;
  onRetry: () => void;
}) {
  const {
    studentName,
    classLevel,
    subject,
    score,
    questions,
    answers,
    aiAnalysis,
    isGeneratingAnalysis,
    update
  } = useQuizStore();

  const total = questions.length;
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

  useEffect(() => {
    const state = useQuizStore.getState();

    if (state.aiAnalysis || state.isGeneratingAnalysis) return;

    let cancelled = false;

    async function runAnalysis() {
      update({ isGeneratingAnalysis: true });

      const analysis = await generateQuizAnalysis({
        studentName: state.studentName,
        classLevel: state.classLevel ?? "",
        subject: state.subject ?? "",
        score: state.score,
        total: state.questions.length,
        answers: state.answers
      });

      if (!cancelled) {
        update({
          aiAnalysis: analysis,
          isGeneratingAnalysis: false
        });
      }
    }

    runAnalysis();

    return () => {
      cancelled = true;
    };
  }, [update]);

  return (
    <GlassCard className="quiz-step w-full max-w-3xl p-8 text-center md:p-10">
      <div className="space-y-8">
        <div className="flex flex-col items-center gap-4">
          <BrainCircuit className="h-16 w-16 text-cyan-300" />

          <h2 className="text-4xl font-extrabold">
            {studentName ? `${studentName}'s Result` : "Your Result"}
          </h2>

          <div className="flex items-center gap-3 rounded-full border border-white/15 bg-white/10 px-6 py-3 text-2xl font-bold">
            <Medal className="h-7 w-7 text-amber-300" />
            Score: {score} / {total}
          </div>

          <div className="text-lg text-white/80">
            Accuracy: {percentage}%
          </div>
        </div>

        <div className="rounded-3xl border border-white/15 bg-black/25 p-6 text-left">
          {isGeneratingAnalysis ? (
            <LoadingSpinner label="AI is analyzing performance..." />
          ) : (
            <p className="whitespace-pre-line text-lg leading-relaxed text-white/90">
              {aiAnalysis}
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <PrimaryButton
            type="button"
            onClick={onRetry}
            className="border border-white/15 bg-white/10 hover:bg-white/20"
          >
            <RotateCcw className="h-5 w-5" />
            Retry Same Settings
          </PrimaryButton>

          <PrimaryButton type="button" onClick={onPlayAgain}>
            <RefreshCcw className="h-5 w-5" />
            Play Again
          </PrimaryButton>
        </div>
      </div>
    </GlassCard>
  );
}