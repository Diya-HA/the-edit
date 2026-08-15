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
  const [aesthetics, edits] = await Promise.all([
    getAesthetics(user.id),
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

  /* The palette this look actually contains, so every swatch returns
     something — which needs the look resolved first. */
  const palette = await getPalette(active.id);

  /* One colour at a time. Only honour a tint this look actually offers, so a
     stale or hand-typed URL cannot empty the feed with a filter that could
     never match. */
  const raw = typeof params.tint === "string" ? params.tint : undefined;
  const fromUrl = palette.some((p) => p.token === raw) ? raw : undefined;
  /* An explicit "off", so turning the swatch off is distinguishable from
     never having touched it — otherwise clearing the colour would fall
     straight back to the welcome's and could not be cleared at all. */
  const clearedByHand = raw === "none";

  /* Nothing in the URL: fall back to a colour they chose at the welcome.
     Those answers were being written down and never read, which made the
     question decorative in a quieter way than the budget one — at least the
     budget did nothing visibly. This makes the answer show up the moment they
     land, which is the only reason to have asked.

     Only the first of their colours, because the feed filters one at a time,
     and only if this look actually has it — Quiet utility holds no rose, and
     someone who picked rose should still see Quiet utility rather than an
     empty screen. Tapping the swatch off clears it for the rest of the
     session, since that puts an explicit choice in the URL. */
  const fromWelcome = user.palette.find((token) =>
    palette.some((p) => p.token === token),
  );
  const activeTint = clearedByHand ? undefined : (fromUrl ?? fromWelcome);

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
      aestheticSlug: active.slug,
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
