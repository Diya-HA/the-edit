"use client";

import type { BudgetReach } from "@/lib/data";
import { formatPrice } from "@/lib/price";
import Button from "../Button";
import styles from "./BudgetNote.module.css";

export type BudgetNoteProps = {
  look: string;
  reach: BudgetReach;
  /** Lift the ceiling to the next rung. */
  onRaise: () => void;
  /** Go and look at the nearest aesthetic that clears it. */
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
 * the real number and both ways out, is warmer than a short feed and no
 * explanation.
 *
 * It is written as the app talking: serif italic on a washed tint, the voice
 * the welcome and the milestones use. Both ways out are real buttons, because
 * they do real things — underlined text in a notice reads as small print, and
 * this is not small print.
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
        {look} runs expensive. Under{" "}
        <span className={styles.count}>{formatPrice(ceiling)}</span> there{" "}
        {within === 1 ? "is" : "are"} {count(within)}{" "}
        {within === 1 ? "piece" : "pieces"}.
      </p>
      <div className={styles.actions}>
        <Button size="sm" onClick={onRaise}>
          Raise it
        </Button>
        {better && (
          <Button
            size="sm"
            variant="secondary"
            onClick={() => onSwitch(better.slug)}
          >
            Try {better.name}
          </Button>
        )}
      </div>
    </div>
  );
}
