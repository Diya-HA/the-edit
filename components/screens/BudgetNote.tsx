"use client";

import type { BudgetReach } from "@/lib/data";
import { formatPrice } from "@/lib/price";
import styles from "./BudgetNote.module.css";

export type BudgetNoteProps = {
  look: string;
  reach: BudgetReach;
  /** Lift the ceiling to the next rung. */
  onRaise: () => void;
  /** Go and look at the aesthetic that has more within reach. */
  onSwitch: (slug: string) => void;
};

const WORDS = [
  "no", "one", "two", "three", "four", "five", "six", "seven", "eight",
  "nine", "ten", "eleven", "twelve",
];

/** Small counts read better as words; past twelve, digits are clearer. */
function count(n: number) {
  return n <= 12 ? WORDS[n] : String(n);
}

/**
 * What the feed is not showing, and what to do about it.
 *
 * Budget and aesthetic are not independent — the labels behind a look decide
 * its price bracket — so a ceiling can quietly empty a feed. Saying so, with
 * the real numbers and both ways out, is warmer than a short feed with no
 * explanation. Never an error: nothing has gone wrong.
 */
export default function BudgetNote({
  look,
  reach,
  onRaise,
  onSwitch,
}: BudgetNoteProps) {
  const { within, ceiling, better } = reach;

  return (
    <div className={styles.note} role="status">
      <p className={styles.body}>
        {look} runs expensive. Under {formatPrice(ceiling)} there{" "}
        {within === 1 ? "is" : "are"} {count(within)}{" "}
        {within === 1 ? "piece" : "pieces"}.
      </p>
      <div className={styles.actions}>
        <button type="button" className={styles.action} onClick={onRaise}>
          Raise it
        </button>
        {better && (
          <>
            <span className={styles.or} aria-hidden="true">
              ·
            </span>
            <button
              type="button"
              className={styles.action}
              onClick={() => onSwitch(better.slug)}
            >
              Try {better.name}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
