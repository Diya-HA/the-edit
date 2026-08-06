"use client";

import type { CSSProperties } from "react";
import styles from "./BoardCard.module.css";

export type BoardCardProps = {
  name: string;
  count: number;
  /** Up to three pigment tokens, taken from the board's first pieces.
   *  Short lists are padded with the sunken canvas. */
  colors?: string[];
  /** A quiet line under the name — "Growing since March". */
  note?: string;
  onOpen?: () => void;
  className?: string;
  style?: CSSProperties;
};

const panelStyle = (color: string) =>
  ({ "--panel-color": color }) as CSSProperties;

/**
 * BoardCard — a board as a painted triptych. Name in grotesque, count
 * in mono, note in quiet sans.
 */
export default function BoardCard({
  name,
  count,
  colors = [],
  note,
  onOpen,
  className,
  style,
}: BoardCardProps) {
  const tiles = [...colors.slice(0, 3)];
  while (tiles.length < 3) tiles.push("var(--canvas-2)");

  return (
    <button
      type="button"
      onClick={onOpen}
      className={[styles.card, className].filter(Boolean).join(" ")}
      style={style}
    >
      <div className={styles.cover}>
        <div
          className={`${styles.panel} ${styles.lead}`}
          style={panelStyle(tiles[0])}
        />
        <div className={styles.stack}>
          <div className={styles.panel} style={panelStyle(tiles[1])} />
          <div className={styles.panel} style={panelStyle(tiles[2])} />
        </div>
      </div>

      <div className={styles.head}>
        <span className={styles.name}>{name}</span>
        <span className={styles.count}>
          {count} {count === 1 ? "piece" : "pieces"}
        </span>
      </div>

      {note && <div className={styles.note}>{note}</div>}
    </button>
  );
}
