"use client";

import { useEffect, useRef } from "react";

/**
 * Remember where a scrolling panel was, and put it back.
 *
 * The app scrolls inside its own panels rather than the page — the shell is a
 * phone-shaped column with a fixed header and tab bar — and browser and router
 * scroll restoration only ever apply to the window. So opening a piece from
 * halfway down the feed and coming back put you at the top, which is the one
 * thing a browsing app must not do: it loses the thing you were looking at and
 * everything you scrolled past to find it.
 *
 * Kept in sessionStorage rather than in React state because the feed unmounts
 * on navigation and remounts on the way back — there is nothing left in memory
 * to read. Keyed per view, so the four looks each keep their own place.
 */
export function useScrollMemory(key: string) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const storageKey = `the-edit:scroll:${key}`;

    const saved = Number(sessionStorage.getItem(storageKey) ?? 0);
    if (saved > 0) {
      /* After paint, once the cards have their heights — restoring before the
         images have reserved their space would scroll to a position that no
         longer means anything a frame later. The fields are painted from the
         tone, so the heights are known without waiting for the network. */
      requestAnimationFrame(() => {
        el.scrollTop = saved;
      });
    }

    let frame = 0;
    const onScroll = () => {
      /* Once per frame at most; scroll fires far faster than this needs to. */
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        sessionStorage.setItem(storageKey, String(el.scrollTop));
      });
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [key]);

  return ref;
}
