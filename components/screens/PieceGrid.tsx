"use client";

import type { ProductView } from "@/lib/data";
import ProductCard from "../ProductCard";
import styles from "./PieceGrid.module.css";

export type PieceGridProps = {
  products: ProductView[];
  onOpen: (p: ProductView) => void;
  onSave?: (p: ProductView) => void;
  pending?: boolean;
};

/** The two-column masonry shared by search, a look, and a board. */
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
            /* Varied heights are what make the masonry read as one. */
            height={92 + ((p.title.length * 7) % 58)}
            saved={p.saved}
            onOpen={() => onOpen(p)}
            onSave={onSave ? () => onSave(p) : undefined}
          />
        </div>
      ))}
    </div>
  );
}
