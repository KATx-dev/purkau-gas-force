// src/components/quiz/quiz-flow.tsx
"use client";

import { useCallback } from "react";
import gsap from "gsap";
import { QuizBackground } from "@/components/background/quiz-background";
import { ActiveQuizStep } from "@/components/quiz/steps/active-quiz-step";
import { ClassSubjectStep } from "@/components/quiz/steps/class-subject-step";
import { QuizSettingsStep } from "@/components/quiz/steps/quiz-settings-step";
import { ResultAnalysisStep } from "@/components/quiz/steps/result-analysis-step";
import { WelcomeStep } from "@/components/quiz/steps/welcome-step";
import { QuizLoadingOverlay } from "@/components/quiz/quiz-loading-overlay";
import { useLenis } from "@/hooks/use-lenis";
import { generateQuizQuestions } from "@/lib/quiz-generator";
import { useQuizStore } from "@/store/use-quiz-store";
import type { QuizStep } from "@/types/quiz";

export default function QuizFlow() {
  useLenis();

  const {
    step,
    classLevel,
    subject,
    difficulty,
    totalQuestions,
    questions,
    isGeneratingQuiz,
    isGeneratingAnalysis,
    error,
    update,
    resetAll,
    retryWithSameSettings
  } = useQuizStore();

  const animateCurrentStepIn = useCallback(() => {
    requestAnimationFrame(() => {
      gsap.fromTo(
        ".quiz-step",
        {
          opacity: 0,
          y: 28,
          scale: 1.01,
          filter: "blur(10px)"
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          duration: 0.45,
          ease: "power2.out"
        }
      );
    });
  }, []);

  const goToStep = useCallback(
    (nextStep: QuizStep) => {
      const currentElement = document.querySelector(".quiz-step");

      if (!currentElement) {
        update({ step: nextStep });
        animateCurrentStepIn();
        return;
      }

      gsap.to(currentElement, {
        opacity: 0,
        y: -28,
        scale: 0.98,
        filter: "blur(10px)",
        duration: 0.4,
        ease: "power2.inOut",
        onComplete: () => {
          update({ step: nextStep });
          animateCurrentStepIn();
        }
      });
    },
    [animateCurrentStepIn, update]
  );

  const startQuiz = useCallback(async () => {
    if (!classLevel || !subject) return;

    update({
      isGeneratingQuiz: true,
      error: null
    });

    try {
      const generatedQuestions = await generateQuizQuestions({
        classLevel,
        subject,
        difficulty,
        count: totalQuestions
      });

      if (!generatedQuestions.length) {
        throw new Error("No questions generated");
      }

      update({
        questions: generatedQuestions,
        currentIndex: 0,
        score: 0,
        answers: [],
        aiAnalysis: "",
        isGeneratingQuiz: false
      });

      goToStep(4);
    } catch {
      update({
        isGeneratingQuiz: false,
        error: "Could not generate questions. Check your API key and internet connection."
      });
    }
  }, [classLevel, difficulty, goToStep, subject, totalQuestions, update]);

  const loadingMessage = isGeneratingQuiz
    ? "Generating questions..."
    : "Analyzing performance...";

  return (
    <main className="relative min-h-screen overflow-hidden">
      <QuizBackground />

      <div className="relative z-10 flex min-h-screen items-center justify-center p-4 md:p-8">
        {step === 1 ? (
          <WelcomeStep onNext={() => goToStep(2)} />
        ) : null}

        {step === 2 ? (
          <ClassSubjectStep
            onBack={() => goToStep(1)}
            onNext={() => goToStep(3)}
          />
        ) : null}

        {step === 3 ? (
          <QuizSettingsStep
            onBack={() => goToStep(2)}
            onStart={startQuiz}
          />
        ) : null}

        {step === 4 && questions.length > 0 ? (
          <ActiveQuizStep onFinish={() => goToStep(5)} />
        ) : null}

        {step === 5 ? (
          <ResultAnalysisStep
            onPlayAgain={resetAll}
            onRetry={retryWithSameSettings}
          />
        ) : null}
      </div>

      {error ? (
        <div className="fixed bottom-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 rounded-2xl border border-red-300/30 bg-red-500/15 px-4 py-3 text-center text-sm text-red-100 backdrop-blur-xl">
          {error}
        </div>
      ) : null}

      {isGeneratingQuiz || isGeneratingAnalysis ? (
        <QuizLoadingOverlay message={loadingMessage} />
      ) : null}
    </main>
  );
}