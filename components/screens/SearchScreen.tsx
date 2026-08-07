"use client";

import { useRouter } from "next/navigation";
import type { CSSProperties } from "react";
import { adoptLook, toggleSave } from "@/app/actions";
import type {
  BrandRowView,
  LookRow,
  ProductView,
} from "@/lib/data";
import Button from "../Button";
import Toast from "../Toast";
import { useToast } from "../useToast";
import PieceGrid from "./PieceGrid";
import ShelfPanel from "./ShelfPanel";
import styles from "./SearchScreen.module.css";

export type SearchTab = "pieces" | "looks" | "brands";

export type SearchScreenProps = {
  tab: SearchTab;
  query: string;
  pieces: ProductView[];
  looks: LookRow[];
  openLook: LookRow | null;
  openLookItems: ProductView[];
  brands: BrandRowView[];
  drops: ProductView[];
};

const SEGMENTS: { key: SearchTab; label: string }[] = [
  { key: "pieces", label: "Pieces" },
  { key: "looks", label: "Looks" },
  { key: "brands", label: "Brands" },
];

export default function SearchScreen({
  tab,
  query,
  pieces,
  looks,
  openLook,
  openLookItems,
  brands,
  drops,
}: SearchScreenProps) {
  const router = useRouter();
  const { message: toast, run, pending } = useToast();

  /* The tab, the query and the opened look all live in the URL, so any state
     of this screen can be linked to and the back button walks it. */
  const go = (next: Partial<{ tab: SearchTab; q: string; look: string }>) => {
    const params = new URLSearchParams();
    const t = next.tab ?? tab;
    if (t !== "pieces") params.set("tab", t);
    const q = next.q ?? query;
    if (q) params.set("q", q);
    if (next.look) params.set("look", next.look);
    const qs = params.toString();
    router.push(qs ? `/search?${qs}` : "/search", { scroll: false });
  };

  const openPiece = (p: ProductView) => router.push(`/product/${p.slug}`);
  const savePiece = (p: ProductView) =>
    run(() => toggleSave(p.id, openLook?.name ?? "Kept"));

  return (
    <>
      <div className={styles.header}>
        <div className={styles.title}>Look for something</div>

        <form
          className={styles.field}
          onSubmit={(e) => {
            e.preventDefault();
            const value = new FormData(e.currentTarget).get("q");
            go({ tab: "pieces", q: typeof value === "string" ? value : "" });
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

        <div className={styles.segments}>
          {SEGMENTS.map((s) => (
            <button
              key={s.key}
              type="button"
              aria-pressed={tab === s.key}
              className={[styles.segment, tab === s.key && styles.segmentOn]
                .filter(Boolean)
                .join(" ")}
              onClick={() => go({ tab: s.key, look: undefined })}
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
                {query ? `Matching “${query}”` : "Everything in your size"}
              </div>
              {pieces.length === 0 ? (
                <p className={styles.empty}>
                  Nothing matched that. Try fewer words, or have a look through
                  the looks instead.
                </p>
              ) : (
                <PieceGrid
                  products={pieces}
                  pending={pending}
                  onOpen={openPiece}
                  onSave={savePiece}
                />
              )}
            </>
          )}

          {tab === "looks" && !openLook && (
            <>
              <p className={styles.intro}>
                Looks other people are building. Have a nose around and take any
                of them home.
              </p>
              <div className={styles.looks}>
                {looks.map((l) => (
                  <button
                    key={l.id}
                    type="button"
                    className={styles.look}
                    onClick={() => go({ tab: "looks", look: l.slug })}
                  >
                    <span className={styles.lookSwatches}>
                      {l.tones.map((tone, i) => (
                        <span
                          key={i}
                          className={styles.lookSwatch}
                          style={{ "--look-tone": tone } as CSSProperties}
                        />
                      ))}
                    </span>
                    <span className={styles.lookText}>
                      <span className={styles.lookName}>{l.name}</span>
                      <span className={styles.lookMeta}>
                        {l.count} pieces
                        {l.description ? ` · ${l.description.toLowerCase()}` : ""}
                      </span>
                    </span>
                    <span className={styles.chevron} aria-hidden="true">
                      ›
                    </span>
                  </button>
                ))}
              </div>
            </>
          )}

          {tab === "looks" && openLook && (
            <>
              <button
                type="button"
                className={styles.back}
                onClick={() => go({ tab: "looks", look: undefined })}
              >
                ‹ All looks
              </button>
              <div className={styles.openName}>{openLook.name}</div>
              <div className={styles.openMeta}>{openLook.description}</div>
              <div className={styles.adopt}>
                <Button
                  size="sm"
                  onClick={() => run(() => adoptLook(openLook.id))}
                >
                  Put this on my home
                </Button>
              </div>
              <PieceGrid
                products={openLookItems}
                pending={pending}
                onOpen={openPiece}
                onSave={savePiece}
              />
            </>
          )}

          {tab === "brands" && (
            <ShelfPanel brands={brands} drops={drops} run={run} />
          )}
        </div>
      </div>

      <Toast message={toast} />
    </>
  );
}
