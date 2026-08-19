// src/components/quiz/steps/active-quiz-step.tsx
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { PartyPopper, Timer, XCircle } from "lucide-react";
import { GlassCard } from "@/components/shared/glass-card";
import { QuizOption, type QuizOptionState } from "@/components/quiz/quiz-option";
import { QuizTimer } from "@/components/quiz/quiz-timer";
import { useCountdown } from "@/hooks/use-countdown";
import { useQuizStore } from "@/store/use-quiz-store";
import type { AnswerRecord } from "@/types/quiz";

export function ActiveQuizStep({ onFinish }: { onFinish: () => void }) {
  const { questions, currentIndex, timePerQuestion, update } =
    useQuizStore();

  const question = questions[currentIndex];

  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);

  const revealedRef = useRef(false);
  const recordAnswerRef = useRef<(answer: string | null) => void>(() => {});

  const { timeLeft, start, stop } = useCountdown(
    timePerQuestion,
    () => recordAnswerRef.current(null)
  );

  const recordAnswer = useCallback(
    (answer: string | null) => {
      const state = useQuizStore.getState();
      const currentQuestion = state.questions[state.currentIndex];

      if (!currentQuestion || revealedRef.current) return;

      revealedRef.current = true;
      setRevealed(true);
      setSelectedAnswer(answer);
      stop();

      const isCorrect = answer === currentQuestion.correctAnswer;

      const answerRecord: AnswerRecord = {
        question: currentQuestion.question,
        selectedAnswer: answer,
        correctAnswer: currentQuestion.correctAnswer,
        isCorrect,
        topic: currentQuestion.topic
      };

      update({
        score: state.score + (isCorrect ? 1 : 0),
        answers: [...state.answers, answerRecord]
      });

      window.setTimeout(() => {
        const latest = useQuizStore.getState();

        if (latest.currentIndex + 1 >= latest.questions.length) {
          onFinish();
        } else {
          update({
            currentIndex: latest.currentIndex + 1
          });
        }
      }, 1800);
    },
    [onFinish, stop, update]
  );

  useEffect(() => {
    recordAnswerRef.current = recordAnswer;
  }, [recordAnswer]);

  useEffect(() => {
    revealedRef.current = false;
    setRevealed(false);
    setSelectedAnswer(null);
    start(timePerQuestion);

    return () => {
      stop();
    };
  }, [currentIndex, start, stop, timePerQuestion]);

  if (!question) return null;

  function getOptionState(option: string): QuizOptionState {
    if (!revealed) return "default";
    if (option === question.correctAnswer) return "correct";
    if (option === selectedAnswer) return "wrong";
    return "dim";
  }

  return (
    <GlassCard className="quiz-step w-full max-w-4xl p-6 md:p-10">
      <div className="space-y-8">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-lg font-semibold text-white/85">
            <Timer className="h-5 w-5 text-cyan-300" />
            Speedrun Mode
          </div>

          <div className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white/85">
            Topic: {question.topic}
          </div>
        </div>

        <QuizTimer
          timeLeft={timeLeft}
          total={timePerQuestion}
          questionNumber={currentIndex + 1}
          totalQuestions={questions.length}
        />

        <h2 className="min-h-20 text-2xl font-bold leading-snug md:text-3xl">
          {question.question}
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
          {question.options.map((option, index) => (
            <QuizOption
              key={`${question.question}-${index}`}
              option={option}
              index={index}
              state={getOptionState(option)}
              disabled={revealed}
              onClick={() => recordAnswer(option)}
            />
          ))}
        </div>

        {revealed ? (
          <div className="rounded-2xl border border-white/15 bg-black/25 px-5 py-4 text-center text-lg font-semibold">
            {selectedAnswer === question.correctAnswer ? (
              <span className="inline-flex items-center justify-center gap-2 text-emerald-200">
                <PartyPopper className="h-5 w-5" />
                Correct! Great job.
              </span>
            ) : selectedAnswer ? (
              <span className="inline-flex items-center justify-center gap-2 text-red-200">
                <XCircle className="h-5 w-5" />
                Correct answer: {question.correctAnswer}
              </span>
            ) : (
              <span className="inline-flex items-center justify-center gap-2 text-amber-200">
                <Timer className="h-5 w-5" />
                Time up! Correct answer: {question.correctAnswer}
              </span>
            )}
          </div>
        ) : null}
      </div>
    </GlassCard>
  );
}