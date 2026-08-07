import AppShell from "@/components/AppShell";
import FeedScreen from "@/components/screens/FeedScreen";
import { getAesthetics, getFeed, getPalette, toBlocks } from "@/lib/data";
import { getCurrentUser } from "@/lib/session";

/* Every screen reads the database per request. Without this Next would try to
   prerender at build time — and the image is built in CI with no database
   reachable, so the build would fail. Nothing here may assume a local one. */
export const dynamic = "force-dynamic";

export default async function FeedPage({ searchParams }: PageProps<"/">) {
  const params = await searchParams;

  const [user, aesthetics, palette] = await Promise.all([
    getCurrentUser(),
    getAesthetics(),
    getPalette(),
  ]);

  /* Which look the feed is showing: the URL wins, then the shopper's own
     active look, then whatever comes first. */
  const lookParam = typeof params.look === "string" ? params.look : undefined;
  const active =
    aesthetics.find((a) => a.slug === lookParam) ??
    aesthetics.find((a) => a.id === user.activeAestheticId) ??
    aesthetics[0];

  if (!active) {
    throw new Error(
      "No aesthetics in the database — run `npx prisma db seed`.",
    );
  }

  const raw = params.tint;
  const requested = Array.isArray(raw) ? raw : raw ? [raw] : [];
  /* Only honour tints the catalogue actually offers, so a stale or hand-typed
     URL cannot empty the feed with a filter that could never match. */
  const selectedTokens = requested.filter((t) =>
    palette.some((p) => p.token === t),
  );

  const products = await getFeed({
    userId: user.id,
    aestheticId: active.id,
    colorTokens: selectedTokens,
  });

  return (
    <AppShell>
      <FeedScreen
        blocks={toBlocks(products)}
        aesthetics={aesthetics}
        palette={palette}
        activeSlug={active.slug}
        activeName={active.name}
        selectedTokens={selectedTokens}
        initials={user.initials}
      />
    </AppShell>
  );
}
