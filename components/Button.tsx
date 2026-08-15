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
  /**
   * Render as a link to somewhere off this app, keeping the button's clothes.
   *
   * For Buy, which goes to the brand's own page. It has to be an anchor rather
   * than a button with a handler: it opens in a new tab, and a button cannot
   * be middle-clicked, long-pressed or opened deliberately in the background,
   * which is exactly what someone comparing two pieces will try to do.
   */
  asLink?: string;
} & ComponentPropsWithoutRef<"button">;

/**
 * Button — the pill action button. Ink is the default call to action;
 * vermillion is held back for brand moments.
 */
export default function Button({
  variant = "primary",
  size = "md",
  full = false,
  asLink,
  type = "button",
  children,
  className,
  ...rest
}: ButtonProps) {
  const classes = [
    styles.button,
    styles[size],
    styles[variant],
    full && styles.full,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (asLink) {
    return (
      <a
        href={asLink}
        target="_blank"
        /* noreferrer as well as noopener: these are third-party shops, and
           there is no reason to hand them the page someone came from. */
        rel="noreferrer"
        className={classes}
        onClick={rest.onClick as never}
      >
        {children}
      </a>
    );
  }

  return (
    <button {...rest} type={type} className={classes}>
      {children}
    </button>
  );
}
