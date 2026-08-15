"use client";

import Button from "../Button";
import styles from "./EmptyState.module.css";

export type EmptyStateProps = {
  title: string;
  body: string;
  /** What to do about it. A dead end without one is just a notice. */
  action?: { label: string; onClick: () => void };
};

/**
 * A list with nothing in it.
 *
 * All six of these existed already and five of them stopped at telling you so
 * — "try fewer words", "try a wider price" — advice with nothing to press,
 * which leaves someone to work out for themselves which control to go back and
 * change. Every one now carries the way out as a button.
 *
 * One component rather than six shapes, so the pattern cannot drift: the same
 * heading weight, the same measure, the same distance from the thing that is
 * empty.
 */
export default function EmptyState({ title, body, action }: EmptyStateProps) {
  return (
    <div className={styles.empty}>
      <div className={styles.title}>{title}</div>
      <p className={styles.body}>{body}</p>
      {action && (
        <Button size="sm" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}
