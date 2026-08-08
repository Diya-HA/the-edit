"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { raisePriceCeiling, toggleStar } from "@/app/actions";
import type {
  AestheticView,
  BudgetReach,
  EditView,
  PaletteEntry,
  ProductView,
} from "@/lib/data";
import Avatar from "../Avatar";
import Button from "../Button";
import Chip from "../Chip";
import ColorDot from "../ColorDot";
import Toast from "../Toast";
import { useToast } from "../useToast";
import BudgetNote from "./BudgetNote";
import PieceGrid from "./PieceGrid";
import SaveSheet from "./SaveSheet";
import type { SaveTarget } from "./SaveSheet";
import styles from "./FeedScreen.module.css";

export type FeedScreenProps = {
  products: ProductView[];
  aesthetics: AestheticView[];
  palette: PaletteEntry[];
  edits: EditView[];
  activeSlug: string;
  /** The one colour the feed is filtered to, if any. */
  activeTint?: string;
  /** Set when the price ceiling is hiding most of this look. */
  budget: BudgetReach | null;
  initials: string;
};

export default function FeedScreen({
  products,
  aesthetics,
  palette,
  edits,
  activeSlug,
  activeTint,
  budget,
  initials,
}: FeedScreenProps) {
  const router = useRouter();
  const { message: toast, run, pending } = useToast();
  const [saving, setSaving] = useState<SaveTarget | null>(null);

  /* Filters live in the URL, so a filtered feed is shareable and the back
     button walks the looks you tried. */
  const navigate = (look: string, tint?: string) => {
    const params = new URLSearchParams();
    params.set("look", look);
    if (tint) params.set("tint", tint);
    router.push(`/?${params}`, { scroll: false });
  };

  /* One colour at a time. Tapping the one already on clears it. */
  const pickTint = (token: string) =>
    navigate(activeSlug, token === activeTint ? undefined : token);

  return (
    <>
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <div className={styles.wordmark}>The Edit</div>
          <Avatar initials={initials} size={26} />
        </div>

        <div className={styles.chips}>
          {aesthetics.map((a) => (
            <Chip
              key={a.id}
              label={a.name}
              active={a.slug === activeSlug}
              starred={a.starred}
              onStar={() => run(() => toggleStar(a.id))}
              onClick={() => navigate(a.slug, activeTint)}
            />
          ))}
          <Chip label="＋ Write your own" dashed />
        </div>

        <div className={styles.palette}>
          <span className={styles.paletteLabel}>PALETTE</span>
          <div className={styles.dots}>
            {palette.map((p) => (
              <ColorDot
                key={p.token}
                color={p.color}
                label={p.name}
                active={p.token === activeTint}
                onClick={() => pickTint(p.token)}
              />
            ))}
          </div>
        </div>
      </div>

      <div className={styles.scroll}>
        <div className={styles.feed}>
          {/* What the ceiling is hiding, before the feed rather than after it,
              so a short feed is explained instead of merely short. */}
          {budget && (
            <BudgetNote
              look={aesthetics.find((a) => a.slug === activeSlug)?.name ?? "This look"}
              reach={budget}
              onRaise={() => run(raisePriceCeiling)}
              onSwitch={(slug) => navigate(slug, activeTint)}
            />
          )}

          {products.length === 0 ? (
            <div className={styles.empty}>
              <div className={styles.emptyTitle}>Nothing in this colour yet</div>
              <p className={styles.emptyBody}>
                Bit of a niche request. Try another swatch or clear it and see
                the whole look.
              </p>
              <Button size="sm" onClick={() => navigate(activeSlug)}>
                Clear the palette
              </Button>
            </div>
          ) : (
            <PieceGrid
              products={products}
              pending={pending}
              onOpen={(p) => router.push(`/product/${p.slug}`)}
              onSave={(p) => setSaving({ kind: "product", product: p })}
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
