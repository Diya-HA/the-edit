import AppShell from "@/components/AppShell";
import SearchScreen from "@/components/screens/SearchScreen";
import type { SearchTab } from "@/components/screens/SearchScreen";
import {
  getBrands,
  getDrops,
  getEdits,
  getLookItems,
  getLooks,
  searchPieces,
} from "@/lib/data";
import { getCurrentUser } from "@/lib/session";

export const dynamic = "force-dynamic";

const TABS: SearchTab[] = ["pieces", "looks", "brands"];

export default async function SearchPage({ searchParams }: PageProps<"/search">) {
  const params = await searchParams;
  const user = await getCurrentUser();

  const raw = typeof params.tab === "string" ? params.tab : "pieces";
  const tab: SearchTab = TABS.includes(raw as SearchTab)
    ? (raw as SearchTab)
    : "pieces";
  const query = typeof params.q === "string" ? params.q : "";
  const lookSlug = typeof params.look === "string" ? params.look : undefined;
  const card = typeof params.card === "string" ? params.card : undefined;

  /* Only the open tab's data is fetched — no point querying the shelf while
     someone is looking at pieces. */
  const [pieces, looks, brands, drops, edits] = await Promise.all([
    tab === "pieces" ? searchPieces({ userId: user.id, query }) : [],
    tab === "looks" ? getLooks(user.id) : [],
    tab === "brands" ? getBrands(user.id) : [],
    tab === "brands" ? getDrops(user.id) : [],
    getEdits(user.id),
  ]);

  const openLook = lookSlug
    ? (looks.find((l) => l.slug === lookSlug) ?? null)
    : null;
  const openLookItems = openLook
    ? await getLookItems(openLook.id, user.id)
    : [];

  return (
    <AppShell>
      <SearchScreen
        tab={tab}
        query={query}
        pieces={pieces}
        looks={looks}
        openLook={openLook}
        card={card}
        openLookItems={openLookItems}
        brands={brands}
        drops={drops}
        edits={edits}
      />
    </AppShell>
  );
}
