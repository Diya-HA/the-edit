"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { CSSProperties } from "react";
import { saveToEdit, saveToNewEdit, toggleSave } from "@/app/actions";
import type { EditView, ProductView } from "@/lib/data";
import BottomSheet from "../BottomSheet";
import Button from "../Button";
import CanvasSwatch from "../CanvasSwatch";
import Toast from "../Toast";
import styles from "./ProductScreen.module.css";

export type ProductScreenProps = {
  product: ProductView;
  wearsWellWith: ProductView[];
  edits: EditView[];
  lookName: string;
};

export default function ProductScreen({
  product,
  wearsWellWith,
  edits,
  lookName,
}: ProductScreenProps) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [sheet, setSheet] = useState(false);
  const [toast, setToast] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const say = (message: string) => {
    clearTimeout(timer.current);
    setToast(message);
    timer.current = setTimeout(() => setToast(""), 2600);
  };

  useEffect(() => () => clearTimeout(timer.current), []);

  const run = (work: () => Promise<{ message: string }>) =>
    startTransition(async () => {
      const result = await work();
      say(result.message);
    });

  /* The note is the editorial line and then why it was picked for you —
     what the piece is, then what it is doing here. */
  const note = [product.line, product.why].filter(Boolean).join(" ");

  return (
    <div className={styles.screen}>
      <div className={styles.scroll}>
        <div className={styles.hero}>
          <CanvasSwatch color={product.color} height={296} radius="0" />

          <button
            type="button"
            className={styles.back}
            onClick={() => router.back()}
            aria-label="Back"
          >
            ‹
          </button>

          <button
            type="button"
            aria-pressed={product.saved}
            aria-label={product.saved ? "Unsave" : "Save"}
            className={[styles.heart, product.saved && styles.saved]
              .filter(Boolean)
              .join(" ")}
            onClick={() => run(() => toggleSave(product.id, lookName))}
          >
            {product.saved ? "♥" : "♡"}
          </button>
        </div>

        <div className={styles.body}>
          <div className={styles.brand}>{product.brand}</div>
          <h1 className={styles.title}>{product.title}</h1>

          <div className={styles.prices}>
            <span className={styles.price}>${product.price}</span>
            {product.wasPrice && (
              <span className={styles.was}>${product.wasPrice}</span>
            )}
          </div>

          {note && <p className={styles.note}>{note}</p>}

          <div className={styles.actions}>
            <Button full onClick={() => setSheet(true)}>
              Save to a board
            </Button>
            <Button
              variant="secondary"
              onClick={() =>
                say(`We’ll take you to ${product.brand} to finish up`)
              }
            >
              Buy
            </Button>
          </div>

          {wearsWellWith.length > 0 && (
            <>
              <div className={styles.eyebrow}>Wears well with</div>
              <div className={styles.rail}>
                {wearsWellWith.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    className={styles.railItem}
                    onClick={() => router.push(`/product/${p.slug}`)}
                  >
                    <CanvasSwatch
                      color={p.color}
                      height={108}
                      radius="var(--radius-md)"
                    />
                    <span className={styles.railTitle}>{p.title}</span>
                    <span className={styles.railPrice}>${p.price}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <BottomSheet
        open={sheet}
        title="Where shall we save it?"
        onClose={() => setSheet(false)}
      >
        <div className={styles.picks}>
          {edits.map((e) => (
            <button
              key={e.id}
              type="button"
              className={styles.pick}
              onClick={() => {
                setSheet(false);
                run(() => saveToEdit(product.id, e.id));
              }}
            >
              <span
                className={styles.pickThumb}
                style={
                  {
                    "--pick-color": e.colors[0] ?? "var(--canvas-2)",
                  } as CSSProperties
                }
              />
              <span className={styles.pickText}>
                <span className={styles.pickName}>{e.name}</span>
                <span className={styles.pickNote}>
                  {e.note ?? `${e.count} ${e.count === 1 ? "piece" : "pieces"}`}
                </span>
              </span>
              <span
                className={[styles.pickMark, e.holdsProduct && styles.pickHeld]
                  .filter(Boolean)
                  .join(" ")}
              >
                {e.holdsProduct ? "✓" : "＋"}
              </span>
            </button>
          ))}

          <button
            type="button"
            className={styles.pick}
            onClick={() => {
              setSheet(false);
              run(() => saveToNewEdit(product.id, lookName));
            }}
          >
            <span className={styles.pickNew}>＋</span>
            <span className={styles.pickText}>
              <span className={styles.pickName}>Somewhere new</span>
            </span>
          </button>
        </div>
      </BottomSheet>

      <Toast message={toast} />
    </div>
  );
}
