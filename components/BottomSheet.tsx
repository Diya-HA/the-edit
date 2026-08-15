"use client";

import { useEffect, useRef } from "react";
import type { CSSProperties, ReactNode } from "react";
import styles from "./BottomSheet.module.css";

export type BottomSheetProps = {
  open?: boolean;
  /** Set in the display grotesque — "Where shall we save it?". */
  title?: string;
  onClose?: () => void;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
};

/** Everything a keyboard can land on, in document order. */
const FOCUSABLE =
  'button, a[href], input, textarea, select, [tabindex]:not([tabindex="-1"])';

/**
 * BottomSheet — the bottom-anchored modal used for Save to board.
 * Renders nothing when closed. It positions against the nearest
 * positioned ancestor, so keep it inside the app frame.
 *
 * It is a real modal for the keyboard as well as for the screen. It was not:
 * aria-modal told assistive tech the page behind was unavailable while Tab
 * walked straight out into it, and opening the sheet left focus on the button
 * that opened it — so a keyboard user got a dialog they were not in and could
 * tab through twelve controls they could not see.
 *
 * So: focus moves in on open, Tab cycles within, Escape closes, and focus
 * returns to whatever opened it. That last part matters most — losing your
 * place on close is worse than never having been moved.
 */
export default function BottomSheet({
  open = false,
  title,
  onClose,
  children,
  className,
  style,
}: BottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  /* Whatever had focus when this opened, so it can be given back. */
  const opener = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;

    opener.current = document.activeElement as HTMLElement | null;

    /* Into the sheet, on the first thing worth touching — the first board in
       the list rather than the drag handle. */
    const first = sheetRef.current?.querySelector<HTMLElement>(FOCUSABLE);
    (first ?? sheetRef.current)?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose?.();
        return;
      }
      if (e.key !== "Tab") return;

      const inSheet = Array.from(
        sheetRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? [],
      ).filter((el) => el.offsetParent !== null);
      if (inSheet.length === 0) return;

      const firstEl = inSheet[0];
      const lastEl = inSheet[inSheet.length - 1];
      const active = document.activeElement;

      /* Wrap at both ends, and pull focus back in if it has escaped —
         which it will have done if the sheet opened while focus was outside. */
      if (e.shiftKey && (active === firstEl || !sheetRef.current?.contains(active))) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && (active === lastEl || !sheetRef.current?.contains(active))) {
        e.preventDefault();
        firstEl.focus();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      /* Back where they were. Focus landing on <body> after a dialog closes
         means the next Tab starts from the top of the page. */
      opener.current?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className={styles.scrim}
      />
      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        /* Focusable so there is somewhere to put focus when the sheet holds
           no controls of its own. */
        tabIndex={-1}
        className={[styles.sheet, className].filter(Boolean).join(" ")}
        style={style}
      >
        <div className={styles.handle} />
        {title && <div className={styles.title}>{title}</div>}
        <div className={styles.body}>{children}</div>
      </div>
    </>
  );
}
