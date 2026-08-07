"use client";

import type { ComponentPropsWithoutRef } from "react";
import styles from "./Chip.module.css";

export type ChipProps = {
  label: string;
  active?: boolean;
  /** Dashed outline, for the "write your own" affordance. */
  dashed?: boolean;
  /**
   * Adds a star to the pill. Present it only where starring means something —
   * the home strip, where a starred look climbs to the front.
   */
  starred?: boolean;
  onStar?: () => void;
} & Omit<ComponentPropsWithoutRef<"button">, "children">;

/**
 * Chip — the look / category filter pill. Active chips fill with ink; they
 * change fill, never opacity.
 */
export default function Chip({
  label,
  active = false,
  dashed = false,
  starred,
  onStar,
  type = "button",
  className,
  ...rest
}: ChipProps) {
  const chip = (
    <button
      {...rest}
      type={type}
      aria-pressed={active}
      className={[
        styles.chip,
        active && styles.active,
        dashed && styles.dashed,
        onStar && styles.withStar,
        !onStar ? className : undefined,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {label}
    </button>
  );

  if (!onStar) return chip;

  /* Two buttons rather than one with a nested control: tapping the label
     picks the look, tapping the star favourites it, and nesting buttons
     would be invalid and unreachable by keyboard. */
  return (
    <span
      className={[styles.group, active && styles.groupActive, className]
        .filter(Boolean)
        .join(" ")}
    >
      {chip}
      <button
        type="button"
        aria-pressed={!!starred}
        aria-label={starred ? `Unstar ${label}` : `Star ${label}`}
        className={[styles.star, starred && styles.starOn]
          .filter(Boolean)
          .join(" ")}
        onClick={(e) => {
          e.stopPropagation();
          onStar();
        }}
      >
        {starred ? "★" : "☆"}
      </button>
    </span>
  );
}
