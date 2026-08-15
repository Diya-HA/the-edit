"use client";

import type { CSSProperties } from "react";
import type { OutfitView } from "@/lib/data";
import { thumbBackground } from "@/lib/images";
import { formatPrice } from "@/lib/price";
import Button from "../Button";
import EmptyState from "./EmptyState";
import styles from "./OutfitList.module.css";

export type OutfitListProps = {
  outfits: OutfitView[];
  onOpenPiece: (slug: string) => void;
  onSave: (outfit: OutfitView) => void;
  /** Drop the look filter, when one is on. The empty state's way out. */
  onClearLook?: () => void;
};

/**
 * Outfits — several pieces from one aesthetic that work together, saved as a
 * set rather than one at a time. The tab used to be a deck of looks; a look is
 * a category, an outfit is a thing you can actually wear, so the format
 * changed with it.
 */
export default function OutfitList({
  outfits,
  onOpenPiece,
  onSave,
  onClearLook,
}: OutfitListProps) {
  if (outfits.length === 0) {
    return (
      <EmptyState
        title="No outfits in this look"
        body="They arrive as the pieces do. The other looks have some already."
        action={
          onClearLook
            ? { label: "See every look", onClick: onClearLook }
            : undefined
        }
      />
    );
  }

  return (
    <div className={styles.list}>
      {outfits.map((o) => (
        <article key={o.id} className={styles.outfit}>
          <header className={styles.head}>
            <div className={styles.look}>{o.aestheticName}</div>
            <h3 className={styles.name}>{o.name}</h3>
            {o.note && <p className={styles.note}>{o.note}</p>}
          </header>

          <div className={styles.pieces}>
            {o.pieces.map((p) => (
              <button
                key={p.id}
                type="button"
                className={styles.piece}
                onClick={() => onOpenPiece(p.slug)}
              >
                <span
                  className={styles.thumb}
                  style={
                    {
                      "--piece-tone": p.ground ?? p.tone,
                      "--piece-photo": thumbBackground(p.image),
                    } as CSSProperties
                  }
                >
                  {!p.image && (
                    <span className={styles.pieceLabel}>{p.category}</span>
                  )}
                </span>
                <span className={styles.pieceTitle}>{p.title}</span>
                <span className={styles.piecePrice}>{formatPrice(p.price)}</span>
              </button>
            ))}
          </div>

          <footer className={styles.foot}>
            <span className={styles.total}>
              {o.pieces.length} pieces ·{" "}
              {formatPrice(o.pieces.reduce((n, p) => n + p.price, 0))}
            </span>
            <Button size="sm" onClick={() => onSave(o)}>
              Save this outfit
            </Button>
          </footer>
        </article>
      ))}
    </div>
  );
}
