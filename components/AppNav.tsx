"use client";

import { usePathname, useRouter } from "next/navigation";
import TabBar from "./TabBar";
import type { TabItem } from "./TabBar";

/* Three tabs. The shelf became brand discovery inside search, and account
   settings moved onto boards, so neither needs a tab of its own. */
const ITEMS: (TabItem & { href: string })[] = [
  { key: "home", label: "Home", icon: "home", href: "/" },
  { key: "search", label: "Search", icon: "search", href: "/search" },
  { key: "boards", label: "Boards", icon: "boards", href: "/boards" },
];

/** Bottom navigation, wired to the router. */
export default function AppNav() {
  const pathname = usePathname();
  const router = useRouter();

  const active =
    ITEMS.find((i) => i.href !== "/" && pathname.startsWith(i.href))?.key ??
    "home";

  return (
    <TabBar
      active={active}
      items={ITEMS}
      onChange={(key) => {
        const item = ITEMS.find((i) => i.key === key);
        if (item) router.push(item.href);
      }}
    />
  );
}
