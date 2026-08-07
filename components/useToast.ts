"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";

/**
 * The confirmation line. Every screen says what just happened in the same
 * voice and clears itself, so no screen reimplements the timer.
 */
export function useToast() {
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const say = useCallback((next: string) => {
    clearTimeout(timer.current);
    setMessage(next);
    timer.current = setTimeout(() => setMessage(""), 2400);
  }, []);

  /** Run a server action and show whatever it says came of it. */
  const run = useCallback(
    (work: () => Promise<{ message: string }>) => {
      startTransition(async () => {
        const result = await work();
        say(result.message);
      });
    },
    [say],
  );

  useEffect(() => () => clearTimeout(timer.current), []);

  return { message, say, run, pending };
}
