// src/components/shared/glass-card.tsx
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function GlassCard({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-white/15 bg-white/10 shadow-2xl backdrop-blur-2xl",
        className
      )}
      {...props}
    />
  );
}