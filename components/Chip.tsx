"use client";

import type { ComponentPropsWithoutRef } from "react";
import styles from "./Chip.module.css";

export type ChipProps = {
  label: string;
  active?: boolean;
  /** Dashed outline, for the "write your own" affordance. */
  dashed?: boolean;
} & Omit<ComponentPropsWithoutRef<"button">, "children">;

/**
 * Chip — the aesthetic / category filter pill. Rows of these scroll
 * horizontally under the wordmark. Active chips fill with ink; they
 * change fill, never opacity.
 */
export default function Chip({
  label,
  active = false,
  dashed = false,
  type = "button",
  className,
  ...rest
}: ChipProps) {
  return (
    <button
      {...rest}
      type={type}
      aria-pressed={active}
      className={[
        styles.chip,
        active && styles.active,
        dashed && styles.dashed,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {label}
    </button>
  );
}
