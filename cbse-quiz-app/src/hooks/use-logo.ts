// src/hooks/use-logo.ts
"use client";

import { useCallback, useState } from "react";

export function useLogo() {
  const [src, setSrc] = useState("/logo.jpg");

  const handleLogoError = useCallback(() => {
    setSrc((previous) => {
      if (previous === "/logo.jpg") return "/logo.png";
      if (previous === "/logo.png") return "/fallback-logo.svg";
      return previous;
    });
  }, []);

  return {
    src,
    handleLogoError
  };
}