"use client";

import type { CSSProperties } from "react";
import { toggleFollow } from "@/app/actions";
import type { BrandCard } from "@/lib/data";
import { BANDS } from "@/lib/brands";
import { formatPrice } from "@/lib/price";
import type { BrandSort } from "@/lib/brands";
import Chip from "../Chip";
import styles from "./BrandDiscovery.module.css";
import EmptyState from "./EmptyState";

export type BrandDiscoveryProps = {
  brands: BrandCard[];
  aesthetics: string[];
  sort: BrandSort;
  /** Narrowing: one look, or one price band. */
  look?: string;
  band?: string;
  onChange: (next: { sort?: BrandSort; look?: string; band?: string }) => void;
  run: (work: () => Promise<{ message: string }>) => void;
};

/**
 * Brand discovery. Browse by what a label stocks, what it costs, or what has
 * landed recently, and follow the ones worth hearing from. Price drops used to
 * live here; following is now about the label rather than a discount.
 */
export default function BrandDiscovery({
  brands,
  aesthetics,
  sort,
  look,
  band,
  onChange,
  run,
}: BrandDiscoveryProps) {
  const SORTS: { key: BrandSort; label: string }[] = [
    { key: "new", label: "What's new" },
    { key: "aesthetic", label: "By look" },
    { key: "price", label: "By price" },
  ];

  return (
    <>
      <p className={styles.intro}>
        Follow a label and its new pieces turn up first. Browse by what it
        stocks, what it costs, or what has just landed.
      </p>

      <div className={styles.sorts}>
        {SORTS.map((s) => (
          <Chip
            key={s.key}
            label={s.label}
            active={sort === s.key}
            onClick={() =>
              onChange({ sort: s.key, look: undefined, band: undefined })
            }
          />
        ))}
      </div>

      {sort === "aesthetic" && (
        <div className={styles.filters}>
          {aesthetics.map((a) => (
            <Chip
              key={a}
              label={a}
              active={look === a}
              onClick={() => onChange({ look: look === a ? undefined : a })}
            />
          ))}
        </div>
      )}

      {sort === "price" && (
        <div className={styles.filters}>
          {BANDS.map((b) => (
            <Chip
              key={b.key}
              label={b.label}
              active={band === b.key}
              onClick={() => onChange({ band: band === b.key ? undefined : b.key })}
            />
          ))}
        </div>
      )}

      <div className={styles.brands}>
        {brands.length === 0 ? (
          <EmptyState
            title="No labels here"
            body="Nothing matches that price in that look. A wider price usually finds them."
            action={{
              label: "Clear the filters",
              onClick: () =>
                onChange({ sort: "new", look: undefined, band: undefined }),
            }}
          />
        ) : (
          brands.map((b) => (
            <article key={b.id} className={styles.brand}>
              <div className={styles.tones}>
                {b.tones.map((t, i) => (
                  <span
                    key={i}
                    className={styles.tone}
                    style={{ "--tone": t } as CSSProperties}
                  />
                ))}
              </div>

              <div className={styles.body}>
                <div className={styles.top}>
                  <div className={styles.text}>
                    <div className={styles.name}>{b.name}</div>
                    <div className={styles.meta}>
                      {b.aesthetics.join(" · ") || "No pieces yet"}
                    </div>
                  </div>

                  <button
                    type="button"
                    aria-pressed={b.following}
                    className={[styles.follow, b.following && styles.following]
                      .filter(Boolean)
                      .join(" ")}
                    onClick={() => run(() => toggleFollow(b.id))}
                  >
                    {b.following ? "Following" : "Follow"}
                  </button>
                </div>

                <div className={styles.stats}>
                  {b.pieceCount} pieces · {formatPrice(b.priceFrom)}–{formatPrice(b.priceTo)}
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </>
  );
}
