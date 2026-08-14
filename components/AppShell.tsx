import type { ReactNode } from "react";
import AppNav from "./AppNav";
import OfflineNotice from "./OfflineNotice";
import styles from "./AppShell.module.css";

/**
 * The app frame: a phone-width column with the tab bar pinned to the bottom.
 * Screens supply their own header and scrolling body, and anything positioned
 * absolutely (toasts, sheets) anchors to the screen.
 */
export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className={styles.shell}>
      <div className={styles.screen}>
        {children}
        <AppNav />
        {/* Sits over the tab bar when the network goes, and only then. */}
        <OfflineNotice />
      </div>
    </div>
  );
}
