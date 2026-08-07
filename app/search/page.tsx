import AppShell from "@/components/AppShell";
import SearchScreen from "@/components/screens/SearchScreen";
import type { SearchTab } from "@/components/screens/SearchScreen";
import { BANDS, BRAND_SORTS } from "@/lib/brands";
import type { BrandSort } from "@/lib/brands";
import {
  getAesthetics,
  getBrandCards,
  getEdits,
  getOutfits,
  getTrending,
  searchPieces,
} from "@/lib/data";
import { getCurrentUser } from "@/lib/session";

export const dynamic = "force-dynamic";

const TABS: SearchTab[] = ["pieces", "outfits", "brands"];

const str = (v: string | string[] | undefined) =>
  typeof v === "string" && v ? v : undefined;

export default async function SearchPage({ searchParams }: PageProps<"/search">) {
  const params = await searchParams;
  const user = await getCurrentUser();

  const rawTab = str(params.tab) ?? "pieces";
  const tab: SearchTab = TABS.includes(rawTab as SearchTab)
    ? (rawTab as SearchTab)
    : "pieces";
  const query = str(params.q) ?? "";
  const outfitLook = str(params.look);
  const rawSort = str(params.sort) ?? "new";
  const brandSort: BrandSort = BRAND_SORTS.includes(rawSort as BrandSort)
    ? (rawSort as BrandSort)
    : "new";
  const brandLook = str(params.blook);
  const brandBand = str(params.band);

  /* Only the open tab's data is fetched. Trending sits above the tabs, so it
     is always needed. */
  const [pieces, trending, outfits, looks, allBrands, edits] =
    await Promise.all([
      tab === "pieces" ? searchPieces({ userId: user.id, query }) : [],
      getTrending(user.id),
      tab === "outfits"
        ? getOutfits({ userId: user.id, aestheticSlug: outfitLook })
        : [],
      tab === "outfits" ? getAesthetics(user.id) : [],
      tab === "brands" ? getBrandCards(user.id) : [],
      getEdits(user.id),
    ]);

  const brandAesthetics = [
    ...new Set(allBrands.flatMap((b) => b.aesthetics)),
  ].sort();

  /* Filtering and ordering happen here rather than in the query: the set of
     labels is small, and the fields it sorts on — price range, which looks a
     label stocks — are derived from its pieces. */
  let brands = allBrands;
  if (brandSort === "aesthetic" && brandLook) {
    brands = brands.filter((b) => b.aesthetics.includes(brandLook));
  }
  if (brandSort === "price" && brandBand) {
    const band = BANDS.find((b) => b.key === brandBand);
    if (band) brands = brands.filter((b) => b.priceFrom <= band.max);
  }
  if (brandSort === "new") {
    brands = [...brands].sort((a, b) => b.newestAt.localeCompare(a.newestAt));
  } else if (brandSort === "price") {
    brands = [...brands].sort((a, b) => a.priceFrom - b.priceFrom);
  }

  return (
    <AppShell>
      <SearchScreen
        tab={tab}
        query={query}
        pieces={pieces}
        trending={trending}
        outfits={outfits}
        looks={looks.map((l) => ({ slug: l.slug, name: l.name }))}
        outfitLook={outfitLook}
        brands={brands}
        brandAesthetics={brandAesthetics}
        brandSort={brandSort}
        brandLook={brandLook}
        brandBand={brandBand}
        edits={edits}
      />
    </AppShell>
  );
}
