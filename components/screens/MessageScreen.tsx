import type { ReactNode } from "react";
import styles from "./MessageScreen.module.css";

export type MessageScreenProps = {
  /** Mono eyebrow above the heading — "NOT FOUND". */
  eyebrow?: string;
  title: string;
  body: string;
  /** The way out. There is always a way out. */
  children?: ReactNode;
};

/**
 * The screen for when there is nothing to show — a piece that has gone, a
 * board that was deleted, something that broke.
 *
 * It exists because the alternative is Next's own 404 and error pages, which
 * are unstyled, sit outside the phone frame, and read as the scaffolding
 * showing through. Someone who taps a stale link should still be in the app.
 *
 * Nothing here apologises or blames. A piece being gone from a shop is
 * ordinary, and the useful thing is the way back to the rest of it.
 */
export default function MessageScreen({
  eyebrow,
  title,
  body,
  children,
}: MessageScreenProps) {
  return (
    <div className={styles.screen}>
      <div className={styles.inner}>
        {eyebrow && <div className={styles.eyebrow}>{eyebrow}</div>}
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.body}>{body}</p>
        {children && <div className={styles.actions}>{children}</div>}
      </div>
    </div>
  );
}
