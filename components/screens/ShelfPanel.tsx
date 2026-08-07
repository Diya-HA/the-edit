"use client";

import { useRouter } from "next/navigation";
import type { CSSProperties } from "react";
import { toggleFollow } from "@/app/actions";
import type { BrandRowView, ProductView } from "@/lib/data";
import Badge from "../Badge";
import BrandRow from "../BrandRow";
import styles from "./ShelfPanel.module.css";

export type ShelfPanelProps = {
  brands: BrandRowView[];
  drops: ProductView[];
  run: (work: () => Promise<{ message: string }>) => void;
};

/**
 * The shelf. Follow a label and its price drops turn up here — which is the
 * point of following, so an empty follow list means an empty drops list
 * rather than a list of everything.
 */
export default function ShelfPanel({ brands, drops, run }: ShelfPanelProps) {
  const router = useRouter();
  const following = brands.some((b) => b.following);

  return (
    <>
      <p className={styles.intro}>
        Follow a label and its new pieces turn up here first. So do its price
        drops, which is the fun part.
      </p>

      {drops.length > 0 && (
        <>
          <div className={styles.eyebrow}>Prices moved on labels you follow</div>
          <div className={styles.drops}>
            {drops.map((p) => (
              <button
                key={p.id}
                type="button"
                className={styles.drop}
                onClick={() => router.push(`/product/${p.slug}`)}
              >
                <span
                  className={styles.dropThumb}
                  style={{ "--drop-tone": p.tone } as CSSProperties}
                />
                <span className={styles.dropText}>
                  <span className={styles.dropBrand}>{p.brand}</span>
                  <span className={styles.dropTitle}>{p.title}</span>
                  <span className={styles.dropPrices}>
                    <span className={styles.dropPrice}>${p.price}</span>
                    {p.wasPrice && (
                      <span className={styles.dropWas}>${p.wasPrice}</span>
                    )}
                  </span>
                </span>
                {p.wasPrice && (
                  <Badge tone="ink">
                    {`↓ ${Math.round((1 - p.price / p.wasPrice) * 100)}%`}
                  </Badge>
                )}
              </button>
            ))}
          </div>
        </>
      )}

      {following && drops.length === 0 && (
        <p className={styles.quiet}>
          Nothing has moved on your labels this week. We’ll tell you the moment
          it does.
        </p>
      )}

      <div className={styles.eyebrow}>Labels on your shelf</div>
      <div className={styles.brands}>
        {brands.map((b) => (
          <BrandRow
            key={b.id}
            name={b.name}
            meta={b.meta ?? undefined}
            color={b.color}
            following={b.following}
            onFollow={() => run(() => toggleFollow(b.id))}
          />
        ))}
      </div>
    </>
  );
}
