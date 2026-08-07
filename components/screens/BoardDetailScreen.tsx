"use client";

import { useRouter } from "next/navigation";
import { toggleSave } from "@/app/actions";
import type { EditView, ProductView } from "@/lib/data";
import Toast from "../Toast";
import { useToast } from "../useToast";
import PieceGrid from "./PieceGrid";
import styles from "./BoardDetailScreen.module.css";

export type BoardDetailScreenProps = {
  edit: EditView;
  items: ProductView[];
};

export default function BoardDetailScreen({
  edit,
  items,
}: BoardDetailScreenProps) {
  const router = useRouter();
  const { message: toast, run, pending } = useToast();

  const meta = [
    `${edit.count} ${edit.count === 1 ? "piece" : "pieces"}`,
    edit.note,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <>
      <div className={styles.scroll}>
        <div className={styles.body}>
          <button
            type="button"
            className={styles.back}
            onClick={() => router.push("/boards")}
          >
            ‹ All boards
          </button>

          <h1 className={styles.title}>{edit.name}</h1>
          <div className={styles.meta}>{meta}</div>

          {items.length === 0 ? (
            <p className={styles.empty}>
              Nothing in here yet. Keep something and it lands on this board.
            </p>
          ) : (
            <PieceGrid
              products={items}
              pending={pending}
              onOpen={(p) => router.push(`/product/${p.slug}`)}
              onSave={(p) => run(() => toggleSave(p.id, edit.name))}
            />
          )}
        </div>
      </div>

      <Toast message={toast} />
    </>
  );
}
