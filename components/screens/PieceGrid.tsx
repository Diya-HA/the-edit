"use client";

import type { CSSProperties } from "react";
import type { ProductView } from "@/lib/data";
import { describeProduct } from "@/lib/alt";
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

/**
 * The two-column masonry the whole app browses in.
 *
 * The columns are built here rather than left to CSS `columns: 2`, which
 * balances by height: it cuts the list in half and puts the first half down
 * the left and the second half down the right. That makes items i and
 * i + n/2 next to each other at the top of the screen — so lib/feed.ts, which
 * spreads a brand's near-identical pieces apart, was placing the second
 * Demi-Pointes at precisely the distance that put it back alongside the first.
 *
 * Dealing alternately instead makes position predictable: i and i+1 are side
 * by side, i and i+2 are stacked. Anything spread further than two apart in
 * the list cannot land next to itself. It also fixes the reading order, which
 * CSS columns sends down one side and back up the other.
 */
export default function PieceGrid({
  products,
  onOpen,
  onSave,
  pending,
}: PieceGridProps) {
  const columns: ProductView[][] = [[], []];
  products.forEach((p, i) => columns[i % 2].push(p));

  return (
    <div
      className={[styles.grid, pending && styles.pending]
        .filter(Boolean)
        .join(" ")}
    >
      {columns.map((column, i) => (
        <div key={i} className={styles.column}>
          {column.map((p, row) => (
            <div
              key={p.id}
              className={styles.item}
              /* Capped, so the twentieth card is not still waiting to appear
                 half a second after the first. Both columns share the ramp so
                 a row arrives together rather than left-then-right. */
              style={
                {
                  "--stagger": `${Math.min(row, 6) * 45}ms`,
                } as CSSProperties
              }
            >
              <ProductCard
                brand={p.brand}
                title={p.title}
                price={p.price}
                was={p.wasPrice ?? undefined}
                color={p.tone}
                image={p.image}
                ground={p.ground}
                category={p.category}
                alt={describeProduct({
                  title: p.title,
                  brand: p.brand,
                  category: p.category,
                  colorName: p.familyName,
                  packshotScore: p.packshot,
                })}
                aspect={shapeOf(p.slug)}
                saved={p.saved}
                onOpen={() => onOpen(p)}
                onSave={onSave ? () => onSave(p) : undefined}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
