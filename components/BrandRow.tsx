"use client";

import type { CSSProperties } from "react";
import styles from "./BrandRow.module.css";

export type BrandRowProps = {
  name: string;
  /** Why this label is on your shelf — "New linen just arrived". */
  meta?: string;
  color?: string;
  following?: boolean;
  onFollow?: () => void;
  className?: string;
  style?: CSSProperties;
};

/**
 * BrandRow — a brand-shelf list item with a follow toggle.
 */
export default function BrandRow({
  name,
  meta,
  color = "var(--pig-cobalt)",
  following = false,
  onFollow,
  className,
  style,
}: BrandRowProps) {
  return (
    <div
      className={[styles.row, className].filter(Boolean).join(" ")}
      style={style}
    >
      <div
        className={styles.swatch}
        style={{ "--brand-swatch-color": color } as CSSProperties}
      />

      <div className={styles.text}>
        <div className={styles.name}>{name}</div>
        {meta && <div className={styles.meta}>{meta}</div>}
      </div>

      <button
        type="button"
        onClick={onFollow}
        aria-pressed={following}
        className={[styles.follow, following && styles.following]
          .filter(Boolean)
          .join(" ")}
      >
        {following ? "Following" : "Follow"}
      </button>
    </div>
  );
}
