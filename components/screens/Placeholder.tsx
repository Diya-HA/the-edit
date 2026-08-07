import AppShell from "../AppShell";
import styles from "./Placeholder.module.css";

/**
 * A route that exists so navigation never dead-ends, but whose screen has not
 * been built yet. Replaced as each screen lands.
 */
export default function Placeholder({ title }: { title: string }) {
  return (
    <AppShell>
      <div className={styles.wrap}>
        <div className={styles.title}>{title}</div>
        <p className={styles.body}>Not built yet — this one is coming next.</p>
      </div>
    </AppShell>
  );
}
