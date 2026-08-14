import AppShell from "@/components/AppShell";
import { PieceGridSkeleton } from "@/components/Skeleton";
import styles from "@/components/screens/FeedScreen.module.css";

/**
 * The feed, waiting. Every screen reads the database per request, so this gap
 * is real rather than theoretical — and the skeleton holds the shape the feed
 * is about to take, so nothing jumps when it arrives.
 */
export default function Loading() {
  return (
    <AppShell>
      <div className={styles.scroll}>
        <div className={styles.feed}>
          <PieceGridSkeleton count={6} />
        </div>
      </div>
    </AppShell>
  );
}
