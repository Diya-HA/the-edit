"use client";

import type { ProductView } from "@/lib/data";
import ProductCard from "../ProductCard";
import styles from "./PieceGrid.module.css";

export type PieceGridProps = {
  products: ProductView[];
  onOpen: (p: ProductView) => void;
  /** Hearting opens the board sheet rather than saving straight away. */
  onSave?: (p: ProductView) => void;
  pending?: boolean;
};

/* Squares and portraits only — a landscape card cannot be produced here.
   The shape is derived from the slug so a piece keeps the same one every
   time you see it, which is what stops the grid reshuffling as you scroll. */
const SHAPES = ["1 / 1", "4 / 5", "3 / 4"];

function shapeOf(slug: string) {
  let n = 0;
  for (let i = 0; i < slug.length; i += 1) n = (n * 31 + slug.charCodeAt(i)) % 997;
  return SHAPES[n % SHAPES.length];
}

/** The two-column masonry the whole app browses in. */
export default function PieceGrid({
  products,
  onOpen,
  onSave,
  pending,
}: PieceGridProps) {
  return (
    <div
      className={[styles.grid, pending && styles.pending]
        .filter(Boolean)
        .join(" ")}
    >
      {products.map((p) => (
        <div key={p.id} className={styles.item}>
          <ProductCard
            brand={p.brand}
            title={p.title}
            price={p.price}
            was={p.wasPrice ?? undefined}
            color={p.tone}
            category={p.category}
            aspect={shapeOf(p.slug)}
            saved={p.saved}
            onOpen={() => onOpen(p)}
            onSave={onSave ? () => onSave(p) : undefined}
          />
        </div>
      ))}
    </div>
  );
}
