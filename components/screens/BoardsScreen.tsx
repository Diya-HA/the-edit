"use client";

import { useRouter } from "next/navigation";
import type { EditView } from "@/lib/data";
import BoardCard from "../BoardCard";
import Toast from "../Toast";
import { useToast } from "../useToast";
import styles from "./BoardsScreen.module.css";

const WORDS = ["none", "one", "two", "three", "four", "five", "six", "seven"];

/** "FOUR ON THE GO" — the count reads as words, as in the reference. */
function onTheGo(n: number) {
  return `${(WORDS[n] ?? String(n)).toUpperCase()} ON THE GO`;
}

export default function BoardsScreen({ edits }: { edits: EditView[] }) {
  const router = useRouter();
  const { message: toast, say } = useToast();

  return (
    <>
      <div className={styles.header}>
        <div>
          <div className={styles.title}>Your boards</div>
          <div className={styles.count}>{onTheGo(edits.length)}</div>
        </div>
        <button
          type="button"
          className={styles.new}
          onClick={() => say("Keep something and a new board follows")}
        >
          ＋ New
        </button>
      </div>

      <div className={styles.scroll}>
        <div className={styles.list}>
          {edits.length === 0 ? (
            <div className={styles.empty}>
              <div className={styles.emptyTitle}>No boards yet</div>
              <p className={styles.emptyBody}>
                Keep something you like and it will start one for you.
              </p>
            </div>
          ) : (
            edits.map((e) => (
              <BoardCard
                key={e.id}
                className={styles.board}
                name={e.name}
                count={e.count}
                note={e.note ?? undefined}
                colors={e.tones}
                onOpen={() => router.push(`/boards/${e.id}`)}
              />
            ))
          )}
        </div>
      </div>

      <Toast message={toast} />
    </>
  );
}
