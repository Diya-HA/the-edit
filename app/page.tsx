import AppShell from "@/components/AppShell";
import FeedScreen from "@/components/screens/FeedScreen";
import {
  getAesthetics,
  getBudgetReach,
  getEdits,
  getFeed,
  getPalette,
} from "@/lib/data";
import { getCurrentUser } from "@/lib/session";

/* Every screen reads the database per request. Without this Next would try to
   prerender at build time — and the image is built in CI with no database
   reachable, so the build would fail. Nothing here may assume a local one. */
export const dynamic = "force-dynamic";

export default async function FeedPage({ searchParams }: PageProps<"/">) {
  const params = await searchParams;

  /* Aesthetics need the user, so starred looks can climb the strip. */
  const user = await getCurrentUser();
  const [aesthetics, palette, edits] = await Promise.all([
    getAesthetics(user.id),
    getPalette(),
    getEdits(user.id),
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

  /* One colour at a time. Only honour a tint the catalogue actually offers,
     so a stale or hand-typed URL cannot empty the feed with a filter that
     could never match. */
  const raw = typeof params.tint === "string" ? params.tint : undefined;
  const activeTint = palette.some((p) => p.token === raw) ? raw : undefined;

  /* The feed honours what counts as a lot for one piece. When that leaves
     most of the look out of reach, the note above it says so rather than
     letting the feed just be short. */
  const [products, budget] = await Promise.all([
    getFeed({
      userId: user.id,
      aestheticId: active.id,
      colorTokens: activeTint ? [activeTint] : [],
      priceCeiling: user.priceCeiling,
    }),
    getBudgetReach({
      aestheticId: active.id,
      priceCeiling: user.priceCeiling,
    }),
  ]);

  return (
    <AppShell>
      <FeedScreen
        products={products}
        aesthetics={aesthetics}
        palette={palette}
        edits={edits}
        activeSlug={active.slug}
        activeTint={activeTint}
        budget={budget}
        initials={user.initials}
      />
    </AppShell>
  );
}
