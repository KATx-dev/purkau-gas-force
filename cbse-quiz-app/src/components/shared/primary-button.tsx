// src/components/shared/primary-button.tsx
"use client";

import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function PrimaryButton({
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-500 px-6 py-3 font-semibold text-white transition hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-300/70 disabled:cursor-not-allowed disabled:opacity-40",
        className
      )}
      {...props}
    />
  );
}