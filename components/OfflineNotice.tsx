"use client";

import { useEffect, useState } from "react";
import styles from "./OfflineNotice.module.css";

/**
 * Says when the network has gone.
 *
 * Every screen reads the database on the request, and the photographs come
 * from brands' CDNs, so with no connection the app does not degrade — it
 * stops. Without this, tapping a piece does nothing at all for as long as the
 * request takes to give up, which reads as the app having frozen.
 *
 * Deliberately a strip rather than a screen. What is already on screen is
 * still perfectly good to look at, and the boards and the feed you have
 * loaded remain readable; only going somewhere new will fail. Covering that
 * with a full-page message would take away more than the network did.
 */
export default function OfflineNotice() {
  /* Starts optimistic. navigator.onLine cannot be read while rendering on the
     server, and assuming offline would flash the strip on every first paint. */
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    const sync = () => setOffline(!navigator.onLine);
    sync();
    window.addEventListener("online", sync);
    window.addEventListener("offline", sync);
    return () => {
      window.removeEventListener("online", sync);
      window.removeEventListener("offline", sync);
    };
  }, []);

  if (!offline) return null;

  return (
    <div className={styles.strip} role="status">
      No connection. What’s here still works.
    </div>
  );
}
