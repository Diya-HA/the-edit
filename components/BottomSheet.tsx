"use client";

import { useEffect } from "react";
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

/**
 * BottomSheet — the bottom-anchored modal used for Save to board.
 * Renders nothing when closed. It positions against the nearest
 * positioned ancestor, so keep it inside the app frame.
 */
export default function BottomSheet({
  open = false,
  title,
  onClose,
  children,
  className,
  style,
}: BottomSheetProps) {
  useEffect(() => {
    if (!open || !onClose) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
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
        role="dialog"
        aria-modal="true"
        aria-label={title}
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
