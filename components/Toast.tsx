import type { CSSProperties } from "react";
import styles from "./Toast.module.css";

export type ToastProps = {
  /** Nothing renders while this is empty. */
  message?: string;
  className?: string;
  style?: CSSProperties;
};

/**
 * Toast — the transient confirmation pill. It says what just happened
 * and what is in it for you: "Saved to Soft romance. That makes 14
 * pieces ♥". Positions itself against the nearest positioned ancestor.
 */
export default function Toast({ message, className, style }: ToastProps) {
  if (!message) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={[styles.toast, className].filter(Boolean).join(" ")}
      style={style}
    >
      {message}
    </div>
  );
}
