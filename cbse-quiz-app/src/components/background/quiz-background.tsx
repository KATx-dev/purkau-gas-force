"use client";

export function QuizBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#05050a]"
    >
      <div className="absolute -left-1/4 -top-1/4 h-[70vh] w-[70vw] rounded-full bg-fuchsia-500/10 blur-3xl" />
      <div className="absolute -bottom-1/4 -right-1/4 h-[70vh] w-[70vw] rounded-full bg-indigo-500/10 blur-3xl" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:48px_48px] opacity-25" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/25 to-black/75" />
    </div>
  );
}
