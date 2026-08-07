"use client";

import type { CSSProperties } from "react";
import { removeFromEdit, saveToEdit, saveToNewEdit } from "@/app/actions";
import type { EditView, ProductView } from "@/lib/data";
import BottomSheet from "../BottomSheet";
import styles from "./SaveSheet.module.css";

export type SaveSheetProps = {
  /** The piece being saved. Null closes the sheet. */
  product: ProductView | null;
  edits: EditView[];
  onClose: () => void;
  run: (work: () => Promise<{ message: string }>) => void;
};

/**
 * Where a save goes.
 *
 * Every heart in the app opens this rather than saving somewhere by itself,
 * so a save is always a deliberate choice of board. Boards already holding
 * the piece show a check and tapping one takes it back out.
 */
export default function SaveSheet({
  product,
  edits,
  onClose,
  run,
}: SaveSheetProps) {
  if (!product) return null;

  const held = new Set(
    edits.filter((e) => e.holdsProduct).map((e) => e.id),
  );

  return (
    <BottomSheet open title="Where’s it going?" onClose={onClose}>
      <div className={styles.picks}>
        {edits.map((e) => {
          const inHere = held.has(e.id);
          return (
            <button
              key={e.id}
              type="button"
              className={styles.pick}
              onClick={() => {
                onClose();
                run(() =>
                  inHere
                    ? removeFromEdit(product.id, e.id)
                    : saveToEdit(product.id, e.id),
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
        })}

        <button
          type="button"
          className={styles.pick}
          onClick={() => {
            onClose();
            run(() => saveToNewEdit(product.id, "New board"));
          }}
        >
          <span className={styles.new}>＋</span>
          <span className={styles.text}>
            <span className={styles.name}>New board</span>
          </span>
        </button>
      </div>
    </BottomSheet>
  );
}
