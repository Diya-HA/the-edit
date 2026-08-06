"use client";

import type { ComponentPropsWithoutRef, CSSProperties } from "react";
import styles from "./ColorDot.module.css";

export type ColorDotProps = {
  /** Pigment or tint token, e.g. `var(--tint-rose)`. */
  color: string;
  active?: boolean;
  size?: number;
  /** Names the colour for screen readers, e.g. "Rose". */
  label?: string;
} & Omit<ComponentPropsWithoutRef<"button">, "color" | "children">;

/**
 * ColorDot — the palette filter swatch. Carries the pointillist
 * texture so the filter row already reads as the product, and takes
 * a white-gapped ink ring when active.
 */
export default function ColorDot({
  color,
  active = false,
  size = 22,
  label,
  type = "button",
  className,
  style,
  ...rest
}: ColorDotProps) {
  return (
    <button
      {...rest}
      type={type}
      aria-pressed={active}
      aria-label={label}
      title={label}
      className={[styles.dot, active && styles.active, className]
        .filter(Boolean)
        .join(" ")}
      style={
        {
          "--dot-color": color,
          "--dot-size": `${size}px`,
          ...style,
        } as CSSProperties
      }
    />
  );
}
