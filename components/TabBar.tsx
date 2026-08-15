"use client";

import type { CSSProperties, ReactNode } from "react";
import styles from "./TabBar.module.css";

/* The nav glyphs are hand-set here, as in the source prototype:
   stroke 1.9, currentColor, 24-grid, rounded joins. No icon font,
   no icon library. */
const svg = (children: ReactNode) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.9"
    aria-hidden="true"
  >
    {children}
  </svg>
);

const grid = svg(
  <>
    <rect x="3" y="3" width="7" height="7" rx="1.4" />
    <rect x="14" y="3" width="7" height="7" rx="1.4" />
    <rect x="3" y="14" width="7" height="7" rx="1.4" />
    <rect x="14" y="14" width="7" height="7" rx="1.4" />
  </>,
);

export const ICONS: Record<string, ReactNode> = {
  feed: grid,
  home: grid,
  search: svg(
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
    </>,
  ),
  boards: svg(
    <path
      d="M6 3.5h12a1 1 0 0 1 1 1V21l-7-4.6L5 21V4.5a1 1 0 0 1 1-1z"
      strokeLinejoin="round"
    />,
  ),
  you: svg(
    <>
      <circle cx="12" cy="8.5" r="3.8" />
      <path
        d="M4.8 20c.7-3.7 3.6-5.6 7.2-5.6s6.5 1.9 7.2 5.6"
        strokeLinecap="round"
      />
    </>,
  ),
};

export type TabItem = {
  key: string;
  label: string;
  /** Glyph override; defaults to the icon matching `key`. */
  icon?: keyof typeof ICONS;
};

export type TabBarProps = {
  active?: string;
  onChange?: (key: string) => void;
  /* Required: there is no sensible default. The list used to fall back to
     one including Feed and Shelf, tabs the app stopped having — nobody saw
     them, because both call sites pass their own, which is the point. */
  items: TabItem[];
  className?: string;
  style?: CSSProperties;
};

/**
 * TabBar — the app's bottom navigation.
 */
export default function TabBar({
  active = "feed",
  onChange,
  items,
  className,
  style,
}: TabBarProps) {
  return (
    <nav
      className={[styles.bar, className].filter(Boolean).join(" ")}
      style={style}
    >
      {items.map((tab) => {
        const on = active === tab.key;
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onChange?.(tab.key)}
            aria-current={on ? "page" : undefined}
            className={[styles.tab, on && styles.active]
              .filter(Boolean)
              .join(" ")}
          >
            {ICONS[tab.icon ?? tab.key]}
            <span className={styles.label}>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
