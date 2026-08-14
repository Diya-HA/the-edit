import AppShell from "@/components/AppShell";
import { BoardsSkeleton } from "@/components/Skeleton";
import styles from "@/components/screens/BoardsScreen.module.css";

export default function Loading() {
  return (
    <AppShell>
      <div className={styles.scroll}>
        <div className={styles.body}>
          <BoardsSkeleton />
        </div>
      </div>
    </AppShell>
  );
}
