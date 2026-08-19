// src/components/shared/logo-image.tsx
"use client";

import { useLogo } from "@/hooks/use-logo";
import { cn } from "@/lib/utils";

export function LogoImage({ className }: { className?: string }) {
  const { src, handleLogoError } = useLogo();

  return (
    <img
      src={src}
      alt="School Logo"
      onError={handleLogoError}
      className={cn(
        "h-24 w-24 rounded-full border-2 border-white/25 object-cover shadow-lg",
        className
      )}
    />
  );
}