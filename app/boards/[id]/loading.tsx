import AppShell from "@/components/AppShell";
import { PieceGridSkeleton } from "@/components/Skeleton";
import styles from "@/components/screens/BoardDetailScreen.module.css";

export default function Loading() {
  return (
    <AppShell>
      <div className={styles.scroll}>
        <div className={styles.body}>
          <PieceGridSkeleton count={4} />
        </div>
      </div>
    </AppShell>
  );
}
