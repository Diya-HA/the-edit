"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { CSSProperties } from "react";
import { setPriceCeiling } from "@/app/actions";
import { CEILINGS, ceilingLabel } from "@/lib/budget";
import type { EditView } from "@/lib/data";
import { thumbBackground } from "@/lib/images";
import Avatar from "../Avatar";
import BottomSheet from "../BottomSheet";
import Toast from "../Toast";
import { useToast } from "../useToast";
import styles from "./BoardsScreen.module.css";

export type BoardsScreenProps = {
  edits: EditView[];
  displayName: string;
  initials: string;
  /** What counts as a lot for one piece. Null is no ceiling. */
  priceCeiling: number | null;
};

/**
 * Boards, two across. Account settings live here too, now that the shelf and
 * the You tab are gone and this is the only personal corner of the app.
 */
export default function BoardsScreen({
  edits,
  displayName,
  initials,
  priceCeiling,
}: BoardsScreenProps) {
  const router = useRouter();
  const { message: toast, say, run } = useToast();
  const [budgetOpen, setBudgetOpen] = useState(false);

  const pieces = edits.reduce((n, e) => n + e.count, 0);

  return (
    <>
      <div className={styles.header}>
        <Avatar initials={initials} size={38} />
        <div className={styles.who}>
          <div className={styles.name}>{displayName}</div>
          <div className={styles.summary}>
            {edits.length} {edits.length === 1 ? "board" : "boards"} · {pieces}{" "}
            {pieces === 1 ? "piece" : "pieces"}
          </div>
        </div>
      </div>

      <div className={styles.scroll}>
        <div className={styles.body}>
          {edits.length === 0 ? (
            <div className={styles.empty}>
              <div className={styles.emptyTitle}>No boards yet</div>
              <p className={styles.emptyBody}>
                Heart something you like and it will start one for you.
              </p>
            </div>
          ) : (
            <div className={styles.grid}>
              {edits.map((e) => (
                <button
                  key={e.id}
                  type="button"
                  className={styles.board}
                  onClick={() => router.push(`/boards/${e.id}`)}
                >
                  <span className={styles.cover}>
                    {[0, 1, 2, 3].map((i) => (
                      <span
                        key={i}
                        className={styles.tile}
                        style={
                          {
                            "--tile":
                              e.grounds[i % Math.max(e.grounds.length, 1)] ??
                              e.tones[i % Math.max(e.tones.length, 1)] ??
                              "var(--canvas-2)",
                            "--tile-photo": thumbBackground(
                              e.covers[i % Math.max(e.covers.length, 1)],
                            ),
                          } as CSSProperties
                        }
                      />
                    ))}
                  </span>
                  <span className={styles.boardName}>{e.name}</span>
                  <span className={styles.boardCount}>
                    {e.count} {e.count === 1 ? "piece" : "pieces"}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* ---- Settings ---- */}
          <div className={styles.settings}>
            <div className={styles.eyebrow}>Settings</div>

            <button
              type="button"
              className={styles.row}
              onClick={() => say("Sizes are coming")}
            >
              <span className={styles.rowLabel}>Sizes</span>
              <span className={styles.rowValue}>S · 27 · 38 ›</span>
            </button>

            {/* Real now that the answer has somewhere to live. Changing it
                changes the feed, which is the whole point of having asked. */}
            <button
              type="button"
              className={styles.row}
              onClick={() => setBudgetOpen(true)}
            >
              <span className={styles.rowLabel}>What counts as a lot</span>
              <span className={styles.rowValue}>
                {ceilingLabel(priceCeiling)} ›
              </span>
            </button>

            {/* Sizes is still a placeholder — there is nowhere to put it. */}
            <button
              type="button"
              className={styles.row}
              onClick={() => router.push("/welcome")}
            >
              <span className={styles.rowLabel}>Redo the welcome</span>
              <span className={styles.rowValue}>›</span>
            </button>

            <button
              type="button"
              className={styles.signOut}
              onClick={() => say("There is only one account for now")}
            >
              Sign out
            </button>
          </div>
        </div>
      </div>

      <BottomSheet
        open={budgetOpen}
        title="What counts as a lot?"
        onClose={() => setBudgetOpen(false)}
      >
        <div className={styles.ceilings}>
          {CEILINGS.map((c) => (
            <button
              key={String(c)}
              type="button"
              aria-pressed={priceCeiling === c}
              className={[
                styles.ceiling,
                priceCeiling === c && styles.ceilingOn,
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={() => {
                setBudgetOpen(false);
                run(() => setPriceCeiling(c));
              }}
            >
              {ceilingLabel(c)}
            </button>
          ))}
        </div>
      </BottomSheet>

      <Toast message={toast} />
    </>
  );
}
