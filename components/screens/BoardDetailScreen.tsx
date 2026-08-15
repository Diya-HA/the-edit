"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { EditView, ProductView } from "@/lib/data";
import Toast from "../Toast";
import { useToast } from "../useToast";
import PieceGrid from "./PieceGrid";
import SaveSheet from "./SaveSheet";
import type { SaveTarget } from "./SaveSheet";
import styles from "./BoardDetailScreen.module.css";
import EmptyState from "./EmptyState";

export type BoardDetailScreenProps = {
  edit: EditView;
  items: ProductView[];
  edits: EditView[];
};

export default function BoardDetailScreen({
  edit,
  items,
  edits,
}: BoardDetailScreenProps) {
  const router = useRouter();
  const { message: toast, run, pending } = useToast();
  const [saving, setSaving] = useState<SaveTarget | null>(null);

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
            <EmptyState
              title="Nothing on this board"
              body="Keep something you like and it lands here."
              action={{
                label: "Find something to keep",
                onClick: () => router.push("/"),
              }}
            />
          ) : (
            <PieceGrid
              products={items}
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
