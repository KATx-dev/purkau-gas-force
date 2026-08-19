// src/components/quiz/quiz-timer.tsx
interface QuizTimerProps {
  timeLeft: number;
  total: number;
  questionNumber: number;
  totalQuestions: number;
}

export function QuizTimer({
  timeLeft,
  total,
  questionNumber,
  totalQuestions
}: QuizTimerProps) {
  const percentage =
    total > 0 ? Math.max(0, Math.min(100, (timeLeft / total) * 100)) : 0;

  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between text-sm text-white/80">
        <span>
          Question {questionNumber} of {totalQuestions}
        </span>
        <span className="font-semibold text-white">{timeLeft}s</span>
      </div>

      <div className="h-3 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400 transition-all duration-1000 ease-linear"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}