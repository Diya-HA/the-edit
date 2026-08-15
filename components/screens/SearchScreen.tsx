"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { CSSProperties } from "react";
import type {
  BrandCard,
  EditView,
  OutfitView,
  ProductView,
} from "@/lib/data";
import { thumbBackground } from "@/lib/images";
import Chip from "../Chip";
import Toast from "../Toast";
import { useToast } from "../useToast";
import BrandDiscovery from "./BrandDiscovery";
import EmptyState from "./EmptyState";
import type { BrandSort } from "@/lib/brands";
import OutfitList from "./OutfitList";
import PieceGrid from "./PieceGrid";
import SaveSheet from "./SaveSheet";
import type { SaveTarget } from "./SaveSheet";
import styles from "./SearchScreen.module.css";

export type SearchTab = "pieces" | "outfits" | "brands";

export type SearchScreenProps = {
  tab: SearchTab;
  query: string;
  pieces: ProductView[];
  trending: ProductView[];
  outfits: OutfitView[];
  looks: { slug: string; name: string }[];
  outfitLook?: string;
  brands: BrandCard[];
  brandAesthetics: string[];
  brandSort: BrandSort;
  brandLook?: string;
  brandBand?: string;
  edits: EditView[];
};

const SEGMENTS: { key: SearchTab; label: string }[] = [
  { key: "pieces", label: "Pieces" },
  { key: "outfits", label: "Outfits" },
  { key: "brands", label: "Brands" },
];

export default function SearchScreen({
  tab,
  query,
  pieces,
  trending,
  outfits,
  looks,
  outfitLook,
  brands,
  brandAesthetics,
  brandSort,
  brandLook,
  brandBand,
  edits,
}: SearchScreenProps) {
  const router = useRouter();
  const { message: toast, run, pending } = useToast();
  const [saving, setSaving] = useState<SaveTarget | null>(null);

  /* Every bit of state this screen has lives in the URL, so any view of it
     can be linked to and the back button walks it. */
  const go = (next: Record<string, string | undefined>) => {
    const merged: Record<string, string | undefined> = {
      tab,
      q: query || undefined,
      look: outfitLook,
      sort: brandSort === "new" ? undefined : brandSort,
      blook: brandLook,
      band: brandBand,
      ...next,
    };
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(merged)) {
      if (v && !(k === "tab" && v === "pieces")) params.set(k, v);
    }
    const qs = params.toString();
    router.push(qs ? `/search?${qs}` : "/search", { scroll: false });
  };

  return (
    <>
      <div className={styles.header}>
        <div className={styles.title}>Look for something</div>

        <form
          className={styles.field}
          onSubmit={(e) => {
            e.preventDefault();
            const v = new FormData(e.currentTarget).get("q");
            go({
              tab: "pieces",
              q: typeof v === "string" ? v || undefined : undefined,
            });
          }}
        >
          <span className={styles.glass} aria-hidden="true">
            ⌕
          </span>
          <input
            className={styles.input}
            name="q"
            defaultValue={query}
            placeholder="A piece or a label or a whole mood"
            aria-label="Search"
          />
        </form>

        {/* Under the search bar: what is getting saved. Labelled a sample
            because with one shopper there is no popularity to measure. */}
        {trending.length > 0 && (
          <div className={styles.trending}>
            <div className={styles.trendingHead}>
              <span className={styles.trendingLabel}>Getting saved</span>
              <span className={styles.trendingNote}>sample data</span>
            </div>
            <div className={styles.trendingRow}>
              {trending.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  className={styles.trend}
                  onClick={() => router.push(`/product/${p.slug}`)}
                >
                  <span
                    className={styles.trendThumb}
                    style={
                      {
                        "--trend-tone": p.ground ?? p.tone,
                        "--trend-photo": thumbBackground(p.image),
                      } as CSSProperties
                    }
                  />
                  <span className={styles.trendTitle}>{p.title}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className={styles.segments}>
          {SEGMENTS.map((s) => (
            <button
              key={s.key}
              type="button"
              aria-pressed={tab === s.key}
              className={[styles.segment, tab === s.key && styles.segmentOn]
                .filter(Boolean)
                .join(" ")}
              onClick={() => go({ tab: s.key })}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.scroll}>
        <div className={styles.body}>
          {tab === "pieces" && (
            <>
              <div className={styles.eyebrow}>
                {query ? `Matching “${query}”` : "Everything in the edit"}
              </div>
              {pieces.length === 0 ? (
                <EmptyState
                  title="Nothing matched that"
                  body="Try fewer words. The outfits are a good way in when a search comes up short."
                  action={{
                    label: "Show the outfits",
                    onClick: () => go({ tab: "outfits", q: undefined }),
                  }}
                />
              ) : (
                <PieceGrid
                  products={pieces}
                  pending={pending}
                  onOpen={(p) => router.push(`/product/${p.slug}`)}
                  onSave={(p) => setSaving({ kind: "product", product: p })}
                />
              )}
            </>
          )}

          {tab === "outfits" && (
            <>
              <div className={styles.filters}>
                <Chip
                  label="All looks"
                  active={!outfitLook}
                  onClick={() => go({ look: undefined })}
                />
                {looks.map((l) => (
                  <Chip
                    key={l.slug}
                    label={l.name}
                    active={outfitLook === l.slug}
                    onClick={() =>
                      go({ look: outfitLook === l.slug ? undefined : l.slug })
                    }
                  />
                ))}
              </div>

              <OutfitList
                outfits={outfits}
                onOpenPiece={(slug) => router.push(`/product/${slug}`)}
                onSave={(o) => setSaving({ kind: "outfit", outfit: o })}
                onClearLook={
                  outfitLook ? () => go({ look: undefined }) : undefined
                }
              />
            </>
          )}

          {tab === "brands" && (
            <BrandDiscovery
              brands={brands}
              aesthetics={brandAesthetics}
              sort={brandSort}
              look={brandLook}
              band={brandBand}
              onChange={(next) =>
                go({
                  sort: next.sort,
                  blook: "look" in next ? next.look : brandLook,
                  band: "band" in next ? next.band : brandBand,
                })
              }
              run={run}
            />
          )}
        </div>
      </div>

      <SaveSheet
        target={saving}
        edits={edits}
        onClose={() => setSaving(null)}
        run={run}
      />

      <Toast message={toast} />
    </>
  );
}
