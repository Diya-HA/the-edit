/**
 * Seed: 4 aesthetics and a real catalogue — five brands, every piece with a
 * photograph, a price and a link back to the shop that sells it.
 *
 * The catalogue itself is prisma/catalogue.json, built by
 * scripts/build-catalogue.ts from five storefronts' public products.json. This
 * file plants it; it never goes to the network. That split is what lets the
 * seed run on container start, where the only paths that exist are
 * .next/standalone, prisma/, node_modules/prisma and node_modules/@prisma.
 *
 * Idempotent by design — everything is an upsert keyed on a natural handle, so
 * running it twice changes nothing.
 *
 * Colour follows turn 3 of the design: the field behind each photograph is
 * tinted to the actual fabric, so a card holds its colour while the image
 * loads. Each piece carries its own tone plus the palette family it groups
 * into, which is what the filter row offers.
 */
import { PrismaClient } from "@prisma/client";
import { readFileSync } from "node:fs";
import { upsertOutfits } from "./outfits.ts";
import type { OutfitInput } from "./outfits.ts";

const prisma = new PrismaClient();

type Catalogue = {
  generatedAt: string;
  retiredBrands: string[];
  retiredOutfits: string[];
  brands: { slug: string; name: string; meta: string; colorToken: string; isPartner: boolean }[];
  products: {
    slug: string; title: string; category: string; slot: string;
    price: number; colorName: string; colorToken: string; colorHex: string;
    line: string; why: string; imageUrl: string; productUrl: string;
    bgHex: string | null; packshotScore: number | null;
    imageMeasuredAt: string | null;
    brand: string; aesthetic: string;
  }[];
  outfits: OutfitInput[];
};

const catalogue = JSON.parse(
  readFileSync(new URL("./catalogue.json", import.meta.url), "utf8"),
) as Catalogue;

const AESTHETICS = [
  { slug: "soft-romance", name: "Soft romance", description: "Warm neutrals and one soft colour", wordmark: "Soft romance ’26" },
  { slug: "quiet-utility", name: "Quiet utility", description: "Workwear cut clean", wordmark: "Quiet utility ’26" },
  { slug: "balletcore-off-duty", name: "Balletcore off duty", description: "Ribbons and wrap knits and flats", wordmark: "Balletcore off duty ’26" },
  { slug: "whimsigoth", name: "Whimsigoth", description: "Velvet and crochet and moons", wordmark: "Whimsigoth ’26" },
];

/** Labels the seeded shopper already follows. */
const FOLLOWED = ["doen", "repetto"];

/** Looks she has starred. Starred looks sort first on the home strip. */
const STARRED = ["soft-romance"];

/* Her boards. Which pieces land in them is derived from the catalogue rather
   than listed by hand, so a rebuilt catalogue never leaves a board pointing at
   a piece that no longer exists.
   Each board names the slots it is about, because a board called "Linen
   summer" holding four t-shirts is worse than no board at all. Nothing is
   saved to two boards, so the covers stay distinguishable. */
const EDITS: {
  name: string; note: string; from: string; take: number;
  slots: string[]; dearest?: boolean;
}[] = [
  { name: "Soft romance", note: "Started in March and still going", from: "soft-romance", take: 5, slots: ["TOP", "BOTTOM", "SHOES", "ACCESSORY"] },
  { name: "Desk to dinner", note: "Things that do both", from: "quiet-utility", take: 3, slots: ["OUTER", "BAG", "SHOES"] },
  { name: "Linen summer", note: "For Sicily allegedly", from: "quiet-utility", take: 4, slots: ["TOP", "BOTTOM"] },
  { name: "One day", note: "Saving up", from: "soft-romance", take: 2, slots: ["OUTER", "BAG"], dearest: true },
];

async function main() {
  console.log(`catalogue   built ${catalogue.generatedAt.slice(0, 10)}`);

  const aesthetics = new Map<string, string>();
  for (const a of AESTHETICS) {
    const row = await prisma.aesthetic.upsert({
      where: { slug: a.slug },
      update: { name: a.name, description: a.description, wordmark: a.wordmark },
      create: a,
    });
    aesthetics.set(a.slug, row.id);
  }
  console.log(`aesthetics  ${aesthetics.size}`);

  /* Retire the invented catalogue. Named explicitly rather than inferred from
     "not in the file": pieces written by the agent through the MCP server are
     also absent from it, and a container restart must not delete the thing the
     demo just created. Deleting a brand cascades its pieces, their saves and
     their outfit items. */
  for (const slug of catalogue.retiredOutfits) {
    await prisma.outfit.deleteMany({ where: { slug } });
  }
  const retired = await prisma.brand.deleteMany({
    where: { slug: { in: catalogue.retiredBrands } },
  });
  if (retired.count > 0) console.log(`retired     ${retired.count} invented brands`);

  const brands = new Map<string, string>();
  for (const b of catalogue.brands) {
    const row = await prisma.brand.upsert({
      where: { slug: b.slug },
      update: { name: b.name, meta: b.meta, colorToken: b.colorToken, isPartner: b.isPartner },
      create: b,
    });
    brands.set(b.slug, row.id);
  }
  console.log(`brands      ${brands.size}`);

  const products = new Map<string, string>();
  for (const p of catalogue.products) {
    const brandId = brands.get(p.brand);
    const aestheticId = aesthetics.get(p.aesthetic);
    if (!brandId) throw new Error(`${p.slug}: unknown brand "${p.brand}"`);
    if (!aestheticId) throw new Error(`${p.slug}: unknown aesthetic "${p.aesthetic}"`);

    const data = {
      slug: p.slug,
      title: p.title,
      category: p.category,
      slot: p.slot as never,
      price: p.price,
      wasPrice: null,
      line: p.line,
      why: p.why,
      colorName: p.colorName,
      colorToken: p.colorToken,
      colorHex: p.colorHex,
      imageUrl: p.imageUrl,
      bgHex: p.bgHex,
      packshotScore: p.packshotScore,
      imageMeasuredAt: p.imageMeasuredAt ? new Date(p.imageMeasuredAt) : null,
      productUrl: p.productUrl,
      inStock: true,
      source: "SEED" as never,
      brandId,
      aestheticId,
    };
    const row = await prisma.product.upsert({
      where: { slug: p.slug },
      update: data,
      create: data,
    });
    products.set(p.slug, row.id);
  }
  /* Pieces that have left the catalogue — excluded as unwearable, gone out
     of stock, or simply not chosen this time — are removed rather than left
     behind. Scoped to source SEED, so anything an agent wrote survives: a
     container restart must never delete what the demo just created. */
  const departed = await prisma.product.deleteMany({
    where: {
      source: "SEED",
      brand: { slug: { in: catalogue.brands.map((b) => b.slug) } },
      slug: { notIn: [...products.keys()] },
    },
  });
  if (departed.count > 0) console.log(`departed    ${departed.count} no longer in the catalogue`);

  console.log(`products    ${products.size}`);

  const user = await prisma.user.upsert({
    where: { email: "aria@theedit.test" },
    update: { activeAestheticId: aesthetics.get("soft-romance") },
    create: {
      email: "aria@theedit.test",
      displayName: "Aria Lane",
      initials: "AL",
      activeAestheticId: aesthetics.get("soft-romance"),
    },
  });
  console.log(`users       1`);

  for (const slug of FOLLOWED) {
    const brandId = brands.get(slug);
    if (!brandId) throw new Error(`follow: unknown brand "${slug}"`);
    await prisma.follow.upsert({
      where: { userId_brandId: { userId: user.id, brandId } },
      update: {},
      create: { userId: user.id, brandId },
    });
  }
  console.log(`follows     ${FOLLOWED.length}`);

  /* The trending row. Demo data: with one shopper there is no popularity
     signal to measure, so these are simply a spread across the four looks and
     the app says as much on screen.
     Packshots first. Trending is one of the two places the app puts four
     aesthetics side by side — cohesion everywhere else is per-aesthetic,
     because home, outfits and sits-well-with are each filtered to one — so
     this is where a calm picture earns its place. */
  await prisma.product.updateMany({ data: { trendingRank: null } });
  const trending = AESTHETICS.flatMap((a) =>
    catalogue.products
      .filter((p) => p.aesthetic === a.slug)
      .sort((x, y) => (y.packshotScore ?? 0) - (x.packshotScore ?? 0))
      .slice(0, 2),
  );
  for (const [i, p] of trending.entries()) {
    await prisma.product.update({
      where: { slug: p.slug },
      data: { trendingRank: i + 1 },
    });
  }
  console.log(`trending    ${trending.length}`);

  const outfits = await upsertOutfits(prisma, catalogue.outfits);
  if (outfits.failed.length) {
    for (const f of outfits.failed) console.error(`  outfit ${f.error}`);
    throw new Error(`${outfits.failed.length} outfit(s) rejected`);
  }
  console.log(`outfits     ${outfits.written.length}`);

  let starCount = 0;
  for (const slug of STARRED) {
    const aestheticId = aesthetics.get(slug);
    if (!aestheticId) throw new Error(`star: unknown look "${slug}"`);
    await prisma.favouriteLook.upsert({
      where: { userId_aestheticId: { userId: user.id, aestheticId } },
      update: {},
      create: { userId: user.id, aestheticId },
    });
    starCount += 1;
  }
  console.log(`starred     ${starCount}`);

  let savedCount = 0;
  const alreadySaved = new Set<string>();
  for (const e of EDITS) {
    const edit = await prisma.edit.upsert({
      where: { userId_name: { userId: user.id, name: e.name } },
      update: { note: e.note },
      create: { userId: user.id, name: e.name, note: e.note },
    });

    const pool = catalogue.products.filter(
      (p) =>
        p.aesthetic === e.from &&
        e.slots.includes(p.slot) &&
        !alreadySaved.has(p.slug),
    );
    const picks = (e.dearest
      ? [...pool].sort((a, b) => b.price - a.price)
      : pool
    ).slice(0, e.take);
    for (const p of picks) alreadySaved.add(p.slug);

    for (const p of picks) {
      const productId = products.get(p.slug);
      if (!productId) continue;
      await prisma.savedItem.upsert({
        where: { editId_productId: { editId: edit.id, productId } },
        update: {},
        create: { editId: edit.id, productId },
      });
      savedCount += 1;
    }
  }
  console.log(`edits       ${EDITS.length}`);
  console.log(`saved items ${savedCount}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
