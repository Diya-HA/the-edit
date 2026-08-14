import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";
import type { ButtonSize, ButtonVariant } from "./Button";
import styles from "./Button.module.css";

export type ButtonLinkProps = {
  href: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  full?: boolean;
} & Omit<ComponentPropsWithoutRef<typeof Link>, "href">;

/**
 * A link wearing the button's clothes.
 *
 * The ways out of a dead end — back to the feed, on to search — are
 * navigations, so they are anchors: they can be opened in a new tab, they are
 * announced as links, and they work before the JavaScript arrives, which is
 * exactly the situation an error page should assume. Sharing Button's
 * stylesheet rather than copying it, so the two cannot drift apart.
 */
export default function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  full = false,
  className,
  children,
  ...rest
}: ButtonLinkProps) {
  return (
    <Link
      {...rest}
      href={href}
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
    </Link>
  );
}
