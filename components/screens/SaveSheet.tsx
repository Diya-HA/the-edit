"use client";

import type { CSSProperties } from "react";
import {
  removeFromEdit,
  saveToEdit,
  saveToNewEdit,
  saveOutfitToEdit,
  saveOutfitToNewEdit,
} from "@/app/actions";
import type { EditView, OutfitView, ProductView } from "@/lib/data";
import BottomSheet from "../BottomSheet";
import styles from "./SaveSheet.module.css";

/** What is being saved: one piece, or a whole outfit. */
export type SaveTarget =
  | { kind: "product"; product: ProductView }
  | { kind: "outfit"; outfit: OutfitView };

export type SaveSheetProps = {
  target: SaveTarget | null;
  edits: EditView[];
  onClose: () => void;
  run: (work: () => Promise<{ message: string }>) => void;
};

/**
 * Where a save goes.
 *
 * Every heart in the app opens this, so a save is always a deliberate choice
 * of board. Saving an outfit offers a board of its own first — that is the
 * obvious thing to want — but the existing boards are right underneath, so
 * ten outfits need not become ten boards.
 */
export default function SaveSheet({
  target,
  edits,
  onClose,
  run,
}: SaveSheetProps) {
  if (!target) return null;

  const isOutfit = target.kind === "outfit";
  const title = isOutfit ? "Save this outfit" : "Where’s it going?";

  const newBoard = isOutfit ? (
    <button
      type="button"
      className={`${styles.pick} ${styles.suggested}`}
      onClick={() => {
        onClose();
        run(() => saveOutfitToNewEdit(target.outfit.id));
      }}
    >
      <span className={styles.new}>＋</span>
      <span className={styles.text}>
        <span className={styles.name}>{target.outfit.name}</span>
        <span className={styles.note}>A new board, named after the outfit</span>
      </span>
    </button>
  ) : (
    <button
      type="button"
      className={styles.pick}
      onClick={() => {
        onClose();
        run(() => saveToNewEdit(target.product.id, "New board"));
      }}
    >
      <span className={styles.new}>＋</span>
      <span className={styles.text}>
        <span className={styles.name}>New board</span>
      </span>
    </button>
  );

  const existing = edits.map((e) => {
    const inHere = !isOutfit && e.holdsProduct;
    return (
      <button
        key={e.id}
        type="button"
        className={styles.pick}
        onClick={() => {
          onClose();
          run(() =>
            isOutfit
              ? saveOutfitToEdit(target.outfit.id, e.id)
              : inHere
                ? removeFromEdit(target.product.id, e.id)
                : saveToEdit(target.product.id, e.id),
          );
        }}
      >
        <span
          className={styles.thumb}
          style={
            { "--pick-color": e.tones[0] ?? "var(--canvas-2)" } as CSSProperties
          }
        />
        <span className={styles.text}>
          <span className={styles.name}>{e.name}</span>
          <span className={styles.note}>
            {e.count} {e.count === 1 ? "piece" : "pieces"}
          </span>
        </span>
        <span
          className={[styles.mark, inHere && styles.held]
            .filter(Boolean)
            .join(" ")}
        >
          {inHere ? "✓" : "＋"}
        </span>
      </button>
    );
  });

  return (
    <BottomSheet open title={title} onClose={onClose}>
      <div className={styles.picks}>
        {/* An outfit wants its own board, so that offer comes first. A single
            piece almost always belongs on a board you already have. */}
        {isOutfit ? (
          <>
            {newBoard}
            <div className={styles.divider}>or add it to</div>
            {existing}
          </>
        ) : (
          <>
            {existing}
            {newBoard}
          </>
        )}
      </div>
    </BottomSheet>
  );
}
