"use client";

import type { CSSProperties, MouseEvent } from "react";
import Badge from "./Badge";
import CanvasSwatch from "./CanvasSwatch";
import styles from "./ProductCard.module.css";

export type ProductCardProps = {
  brand: string;
  title: string;
  price: number;
  /** Was-price. Its presence is what draws the drop badge. */
  was?: number;
  /** Pigment fill standing in for the photograph. */
  color?: string;
  caption?: string;
  captionColor?: string;
  height?: number | string;
  saved?: boolean;
  /** The hero card at the head of a feed block: taller, grotesque
   *  title, price out to the right. */
  featured?: boolean;
  /** One editorial line, serif italic, under a featured card. */
  line?: string;
  onOpen?: () => void;
  onSave?: () => void;
  className?: string;
  style?: CSSProperties;
};

/**
 * ProductCard — the core feed unit: a painted swatch, a floating save
 * heart, an optional price-drop badge, then brand / title / price.
 * Prices are always mono.
 */
export default function ProductCard({
  brand,
  title,
  price,
  was,
  color = "var(--pig-cobalt)",
  caption,
  captionColor,
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

  return (
    <div
      className={[styles.card, featured && styles.featured, className]
        .filter(Boolean)
        .join(" ")}
      style={style}
    >
      <div className={styles.frame}>
        <CanvasSwatch
          color={color}
          height={fieldHeight}
          radius={featured ? "var(--radius-xl)" : "var(--radius-lg)"}
          caption={caption}
          captionColor={captionColor}
          className={onOpen ? styles.tappable : undefined}
          onClick={onOpen}
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

      <div
        className={[styles.meta, onOpen && styles.tappable]
          .filter(Boolean)
          .join(" ")}
        onClick={onOpen}
      >
        <div className={styles.text}>
          <div className={styles.brand}>{brand}</div>
          <div className={styles.title}>{title}</div>
          {!featured && (
            <div className={styles.prices}>
              <span className={styles.price}>${price}</span>
              {was && <span className={styles.was}>${was}</span>}
            </div>
          )}
        </div>

        {featured && (
          <div className={styles.prices}>
            <span className={styles.price}>${price}</span>
            {was && <span className={styles.was}>${was}</span>}
          </div>
        )}
      </div>

      {featured && line && <div className={styles.line}>{line}</div>}
    </div>
  );
}
