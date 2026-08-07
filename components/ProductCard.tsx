"use client";

import type { CSSProperties, MouseEvent } from "react";
import Badge from "./Badge";
import CanvasSwatch from "./CanvasSwatch";
import styles from "./ProductCard.module.css";

export type ProductCardProps = {
  brand: string;
  title: string;
  price: number;
  was?: number;
  /** The fabric tone that fills the placeholder. */
  color?: string;
  /** Garment noun, named along the bottom of the placeholder. */
  category?: string;
  height?: number | string;
  saved?: boolean;
  /** The hero at the head of a block: taller, grotesque title. */
  featured?: boolean;
  line?: string;
  onOpen?: () => void;
  onSave?: () => void;
  className?: string;
  style?: CSSProperties;
};

/**
 * ProductCard — the core feed unit.
 */
export default function ProductCard({
  brand,
  title,
  price,
  was,
  color = "var(--fabric-neutral)",
  category,
  height,
  saved = false,
  featured = false,
  line,
  onOpen,
  onSave,
  className,
  style,
}: ProductCardProps) {
  const drop = was ? Math.round((1 - price / was) * 100) : 0;
  const fieldHeight = height ?? (featured ? 176 : 108);

  const save = (e: MouseEvent) => {
    e.stopPropagation();
    onSave?.();
  };

  const prices = (
    <div className={styles.prices}>
      <span className={styles.price}>${price}</span>
      {was && <span className={styles.was}>${was}</span>}
    </div>
  );

  return (
    <div
      className={[styles.card, featured && styles.featured, className]
        .filter(Boolean)
        .join(" ")}
      style={style}
    >
      <div className={styles.frame} onClick={onOpen}>
        <CanvasSwatch
          color={color}
          height={fieldHeight}
          radius={featured ? "var(--radius-xl)" : "var(--radius-lg)"}
          label={category}
        />

        {was && (
          <Badge tone="drop" className={styles.drop}>
            {`↓ ${drop}%`}
          </Badge>
        )}

        {onSave && (
          <button
            type="button"
            onClick={save}
            aria-pressed={saved}
            aria-label={saved ? `Unsave ${title}` : `Save ${title}`}
            className={[styles.heart, saved && styles.saved]
              .filter(Boolean)
              .join(" ")}
          >
            {saved ? "♥" : "♡"}
          </button>
        )}
      </div>

      <div className={styles.meta} onClick={onOpen}>
        <div className={styles.text}>
          <div className={styles.brand}>{brand}</div>
          <div className={styles.title}>{title}</div>
          {!featured && prices}
        </div>
        {featured && prices}
      </div>

      {featured && line && <div className={styles.line}>{line}</div>}
    </div>
  );
}
