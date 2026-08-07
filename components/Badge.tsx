import type { ComponentPropsWithoutRef } from "react";
import styles from "./Badge.module.css";

export type BadgeTone =
  | "drop"
  | "sale"
  | "brand"
  | "cobalt"
  | "ink"
  | "outline";

export type BadgeProps = {
  /** `drop` is the white-on-paint chip the feed cards use. */
  tone?: BadgeTone;
} & ComponentPropsWithoutRef<"span">;

/**
 * Badge — the compact mono tag. Price drops read calmly: `↓ 25%`,
 * never "SALE!!".
 */
export default function Badge({
  tone = "drop",
  children,
  className,
  ...rest
}: BadgeProps) {
  return (
    <span
      {...rest}
      className={[styles.badge, styles[tone], className]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </span>
  );
}
