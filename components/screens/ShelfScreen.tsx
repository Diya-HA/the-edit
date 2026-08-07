"use client";

import type { BrandRowView, ProductView } from "@/lib/data";
import Toast from "../Toast";
import { useToast } from "../useToast";
import ShelfPanel from "./ShelfPanel";
import styles from "./SearchScreen.module.css";

export type ShelfScreenProps = {
  brands: BrandRowView[];
  drops: ProductView[];
};

/**
 * The shelf on its own.
 *
 * Turn 3 folds this into Search's Brands tab and gives the fourth tab to
 * "You". The tab bar here keeps Shelf, because You is not in scope, and both
 * routes render the same ShelfPanel so there is one implementation.
 */
export default function ShelfScreen({ brands, drops }: ShelfScreenProps) {
  const { message: toast, run } = useToast();

  return (
    <>
      <div className={styles.header}>
        <div className={styles.title}>Your shelf</div>
      </div>

      <div className={styles.scroll}>
        <div className={styles.body}>
          <ShelfPanel brands={brands} drops={drops} run={run} />
        </div>
      </div>

      <Toast message={toast} />
    </>
  );
}
