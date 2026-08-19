// src/components/quiz/steps/class-subject-step.tsx
"use client";

import { ArrowLeft, ArrowRight, GraduationCap } from "lucide-react";
import { GlassCard } from "@/components/shared/glass-card";
import { PrimaryButton } from "@/components/shared/primary-button";
import { CLASS_LEVELS, CLASS_SUBJECTS } from "@/data/subjects";
import { cn } from "@/lib/utils";
import { useQuizStore } from "@/store/use-quiz-store";
import type { ClassLevel } from "@/types/quiz";

export function ClassSubjectStep({
  onBack,
  onNext
}: {
  onBack: () => void;
  onNext: () => void;
}) {
  const { classLevel, subject, update } = useQuizStore();

  const subjects = classLevel
    ? CLASS_SUBJECTS[classLevel as ClassLevel]
    : [];

  const canContinue = Boolean(classLevel && subject);

  function selectClass(value: ClassLevel) {
    const allowedSubjects = CLASS_SUBJECTS[value];

    update({
      classLevel: value,
      subject:
        subject && allowedSubjects.includes(subject) ? subject : null
    });
  }

  return (
    <GlassCard className="quiz-step w-full max-w-3xl p-8 md:p-10">
      <div className="space-y-8">
        <div className="flex items-center gap-3">
          <GraduationCap className="h-8 w-8 text-cyan-300" />
          <h2 className="text-3xl font-bold">Choose Class and Subject</h2>
        </div>

        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.25em] text-white/65">
            Class
          </p>

          <div className="grid grid-cols-3 gap-3 md:grid-cols-6">
            {CLASS_LEVELS.map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => selectClass(value)}
                className={cn(
                  "rounded-2xl border px-4 py-4 font-semibold transition",
                  classLevel === value
                    ? "border-indigo-300/70 bg-indigo-500/30"
                    : "border-white/15 bg-white/5 hover:bg-white/10"
                )}
              >
                {value}
              </button>
            ))}
          </div>
        </div>

        {classLevel ? (
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.25em] text-white/65">
              Subject
            </p>

            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {subjects.map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => update({ subject: value })}
                  className={cn(
                    "rounded-2xl border px-4 py-4 font-semibold transition",
                    subject === value
                      ? "border-cyan-300/70 bg-cyan-500/25"
                      : "border-white/15 bg-white/5 hover:bg-white/10"
                  )}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>
        ) : null}

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
            disabled={!canContinue}
            onClick={onNext}
          >
            Continue
            <ArrowRight className="h-5 w-5" />
          </PrimaryButton>
        </div>
      </div>
    </GlassCard>
  );
}