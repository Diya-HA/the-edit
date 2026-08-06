"use client";

import type { ComponentPropsWithoutRef } from "react";
import styles from "./Button.module.css";

export type ButtonVariant = "primary" | "brand" | "secondary" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export type ButtonProps = {
  /** `primary` is the ink CTA, `brand` the vermillion one. */
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Stretch to the width of the container. */
  full?: boolean;
} & ComponentPropsWithoutRef<"button">;

/**
 * Button — the pill action button. Ink is the default call to action;
 * vermillion is held back for brand moments.
 */
export default function Button({
  variant = "primary",
  size = "md",
  full = false,
  type = "button",
  children,
  className,
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      type={type}
      className={[
        styles.button,
        styles[size],
        styles[variant],
        full && styles.full,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </button>
  );
}
