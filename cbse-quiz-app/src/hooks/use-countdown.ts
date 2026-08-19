// src/hooks/use-countdown.ts
"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function useCountdown(initialSeconds: number, onComplete?: () => void) {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);

  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (!isRunning) return;

    if (timeLeft <= 0) {
      setIsRunning(false);
      onCompleteRef.current?.();
      return;
    }

    const id = window.setTimeout(() => {
      setTimeLeft((previous) => Math.max(0, previous - 1));
    }, 1000);

    return () => window.clearTimeout(id);
  }, [isRunning, timeLeft]);

  const start = useCallback((seconds?: number) => {
    if (typeof seconds === "number") {
      setTimeLeft(seconds);
    }
    setIsRunning(true);
  }, []);

  const stop = useCallback(() => {
    setIsRunning(false);
  }, []);

  const reset = useCallback(
    (seconds?: number) => {
      setTimeLeft(typeof seconds === "number" ? seconds : initialSeconds);
      setIsRunning(false);
    },
    [initialSeconds]
  );

  return {
    timeLeft,
    isRunning,
    start,
    stop,
    reset
  };
}