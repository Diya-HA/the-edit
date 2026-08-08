"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { EditView, ProductView } from "@/lib/data";
import { IMAGE_WIDTH } from "@/lib/images";
import { formatPrice } from "@/lib/price";
import Button from "../Button";
import CanvasSwatch from "../CanvasSwatch";
import Toast from "../Toast";
import { useToast } from "../useToast";
import SaveSheet from "./SaveSheet";
import styles from "./ProductScreen.module.css";

export type ProductScreenProps = {
  product: ProductView;
  sitsWellWith: ProductView[];
  edits: EditView[];
};

export default function ProductScreen({
  product,
  sitsWellWith,
  edits,
}: ProductScreenProps) {
  const router = useRouter();
  const [sheet, setSheet] = useState(false);
  const { message: toast, say, run } = useToast();

  /* The note is the editorial line and then why it was picked for you —
     what the piece is, then what it is doing here. */
  const note = [product.line, product.why].filter(Boolean).join(" ");

  return (
    <div className={styles.screen}>
      <div className={styles.scroll}>
        <div className={styles.hero}>
          <CanvasSwatch
            color={product.tone}
            image={product.image}
            alt={`${product.title} — ${product.category} by ${product.brand}`}
            imageWidth={IMAGE_WIDTH.hero}
            height={296}
            radius="0"
            label={product.category}
          />

          <div className={styles.controls}>
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
            onClick={() => setSheet(true)}
          >
              {product.saved ? "♥" : "♡"}
            </button>
          </div>
        </div>

        <div className={styles.body}>
          <div className={styles.brand}>{product.brand}</div>
          <h1 className={styles.title}>{product.title}</h1>

          <div className={styles.prices}>
            <span className={styles.price}>{formatPrice(product.price)}</span>
            {product.wasPrice && (
              <span className={styles.was}>{formatPrice(product.wasPrice)}</span>
            )}
          </div>

          {note && <p className={styles.note}>{note}</p>}

          <div className={styles.actions}>
            <Button full onClick={() => setSheet(true)}>
              Keep it ♡
            </Button>
            <Button
              variant="secondary"
              onClick={() =>
                say(`Off to ${product.brand} to finish up`)
              }
            >
              Buy
            </Button>
          </div>

          {sitsWellWith.length > 0 && (
            <>
              <div className={styles.eyebrow}>Sits well with</div>
              <div className={styles.rail}>
                {sitsWellWith.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    className={styles.railItem}
                    onClick={() => router.push(`/product/${p.slug}`)}
                  >
                    <CanvasSwatch
                      color={p.tone}
                      image={p.image}
                      alt={`${p.title} — ${p.category} by ${p.brand}`}
                      height={108}
                      radius="var(--radius-md)"
                      label={p.category}
                    />
                    <span className={styles.railTitle}>{p.title}</span>
                    <span className={styles.railPrice}>{formatPrice(p.price)}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <SaveSheet
        target={sheet ? { kind: "product", product } : null}
        edits={edits}
        onClose={() => setSheet(false)}
        run={run}
      />

      <Toast message={toast} />
    </div>
  );
}
