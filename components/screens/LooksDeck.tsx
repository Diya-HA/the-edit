"use client";

import type { CSSProperties } from "react";
import type { LookRow } from "@/lib/data";
import Button from "../Button";
import styles from "./LooksDeck.module.css";

export type LooksDeckProps = {
  looks: LookRow[];
  /** Slug of the look on top. Identified by look, not position: starring
   *  re-sorts the deck, and a card that changed identity under your finger
   *  would be baffling. */
  onSlug?: string;
  onFlip: (nextSlug: string) => void;
  onOpen: (look: LookRow) => void;
  onStar: (look: LookRow) => void;
  onAdopt: (look: LookRow) => void;
};

/* The card heights vary so the two columns stagger, and they are derived from
   the title so a piece keeps the same height every time you flip back to it. */
const heightOf = (title: string) => 86 + ((title.length * 11) % 36);

/**
 * LooksDeck — flip through the looks with the chevrons. Starring one climbs
 * the strip on home, which is what makes the deck worth flipping.
 */
export default function LooksDeck({
  looks,
  onSlug,
  onFlip,
  onOpen,
  onStar,
  onAdopt,
}: LooksDeckProps) {
  if (looks.length === 0) return null;

  const total = looks.length;
  const found = looks.findIndex((l) => l.slug === onSlug);
  const at = found >= 0 ? found : 0;
  const look = looks[at];
  const step = (delta: number) => looks[(at + delta + total) % total].slug;

  return (
    <div className={styles.deck}>
      <div className={styles.eyebrow}>Flip through your looks</div>

      <div className={styles.head}>
        <button
          type="button"
          className={styles.arrow}
          aria-label="Previous look"
          onClick={() => onFlip(step(-1))}
        >
          ‹
        </button>

        <div className={styles.headText}>
          <div className={styles.name}>{look.name}</div>
          <div className={styles.meta}>
            {look.starred ? "One of yours" : "Tap the star for more of it"}
          </div>
        </div>

        <button
          type="button"
          className={styles.arrow}
          aria-label="Next look"
          onClick={() => onFlip(step(1))}
        >
          ›
        </button>
      </div>

      {/* Keyed on the look so flipping replays the fade. */}
      <div className={styles.grid} key={look.id}>
        {look.pieces.map((p) => (
          <button
            key={p.id}
            type="button"
            className={styles.piece}
            onClick={() => onOpen(look)}
          >
            <span
              className={styles.thumb}
              style={
                {
                  "--piece-tone": p.tone,
                  "--piece-height": `${heightOf(p.title)}px`,
                } as CSSProperties
              }
            />
            <span className={styles.pieceTitle}>{p.title}</span>
          </button>
        ))}
      </div>

      <div className={styles.foot}>
        <button
          type="button"
          aria-pressed={look.starred}
          className={[styles.star, look.starred && styles.starOn]
            .filter(Boolean)
            .join(" ")}
          onClick={() => onStar(look)}
        >
          {look.starred ? "★ One of yours" : "☆ More of this please"}
        </button>

        <span className={styles.spacer} />

        <span className={styles.pips}>
          {looks.map((l, i) => (
            <span
              key={l.id}
              className={[styles.pip, i === at && styles.pipOn]
                .filter(Boolean)
                .join(" ")}
            />
          ))}
        </span>
      </div>

      <div className={styles.adopt}>
        <Button size="sm" full onClick={() => onAdopt(look)}>
          Put this on my home
        </Button>
      </div>
    </div>
  );
}
