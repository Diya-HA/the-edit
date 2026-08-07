/**
 * Step three of the pipeline: scored garments in, catalogue and outfits out.
 *
 *   node --experimental-strip-types scripts/ingest-uskees.ts <scored.json>
 *
 * Runs with no browser and no session, like the job it stands in for. Pieces
 * are upserted on slug and outfits go through prisma/outfits.ts — the same door
 * the seed and the server action use — so a repeat run updates rather than
 * duplicates.
 */
import { PrismaClient } from "@prisma/client";
import { readFileSync } from "node:fs";
import { upsertOutfits } from "../prisma/outfits.ts";
import type { OutfitInput } from "../prisma/outfits.ts";

const prisma = new PrismaClient();

const AESTHETIC = "quiet-utility";
const BRAND = {
  slug: "uskees",
  name: "Uskees",
  meta: "Quiet utility, strictly. Drill, cord and linen, built for work.",
  colorToken: "--fabric-sage",
  isPartner: false,
};

/** Garment noun for the placeholder label, from the model name. */
function categoryOf(model: string) {
  for (const k of ["overshirt", "workshirt", "blazer", "jacket", "cardigan", "hat", "socks", "tie"]) {
    if (model.includes(k)) return k === "socks" ? "sock" : k;
  }
  return "piece";
}

type Scored = {
  brand: string; handle: string; title: string; colour: string | null;
  price: number; imageUrl: string; productUrl: string; inStock: boolean;
  model: string; colourNorm: string; score: number; verdict: string;
  family: string; familyName: string; tone: string;
};

const file = process.argv[2];
if (!file) throw new Error("usage: ingest-uskees.ts <scored.json>");
const { scored } = JSON.parse(readFileSync(file, "utf8")) as { scored: Scored[] };

/* Only what the skill put in, and only what you can actually buy. */
const keep = scored.filter((s) => s.score >= 85 && s.inStock);

const aesthetic = await prisma.aesthetic.findUnique({ where: { slug: AESTHETIC } });
if (!aesthetic) throw new Error(`no aesthetic "${AESTHETIC}" — seed first`);

const brand = await prisma.brand.upsert({
  where: { slug: BRAND.slug },
  update: BRAND,
  create: BRAND,
});

let written = 0;
for (const s of keep) {
  const category = categoryOf(s.model);
  const line = `${s.model.charAt(0).toUpperCase()}${s.model.slice(1)} in ${s.colourNorm}.`;
  const why = `Scores ${s.score} against quiet utility — straight lines and a colour that stays out of the way.`;
  const data = {
    slug: `uskees-${s.handle}`.slice(0, 190),
    title: s.title.replace(/^\d+\s*/, "").trim(),
    category,
    price: s.price,
    wasPrice: null,
    colorName: s.familyName,
    colorToken: s.family,
    colorHex: s.tone,
    line,
    why,
    imageUrl: s.imageUrl,
    productUrl: s.productUrl,
    inStock: true,
    brandId: brand.id,
    aestheticId: aesthetic.id,
  };
  await prisma.product.upsert({
    where: { slug: data.slug },
    update: data,
    create: data,
  });
  written += 1;
}
console.log(`pieces      ${written} of ${scored.length} scored (>=85 and in stock)`);

/* Assemble: one outfit per tonal family, taking distinct garment models so a
   set is a set rather than four colourways of the same overshirt. */
const byFamily = new Map<string, Scored[]>();
for (const s of keep) {
  const list = byFamily.get(s.familyName) ?? [];
  list.push(s);
  byFamily.set(s.familyName, list);
}

const NAMES: Record<string, { name: string; note: string }> = {
  Ink:     { name: "Everything in charcoal", note: "One colour, four weights, nothing asking for attention." },
  Neutral: { name: "Taupe and loam",         note: "Undyed cloth that gets better the more it creases." },
  Sage:    { name: "Field greens",           note: "Olive and seaweed, cut straight and worn loose." },
  Indigo:  { name: "Washed indigo",          note: "Navy top to toe, broken only by the weave." },
  Rust:    { name: "Chestnut and clay",      note: "Warm earth tones, still nothing you have to think about." },
};

const outfits: OutfitInput[] = [];
for (const [family, pieces] of byFamily) {
  const seenModels = new Set<string>();
  const picked = pieces
    .sort((a, b) => b.score - a.score)
    .filter((p) => !seenModels.has(p.model) && seenModels.add(p.model))
    .slice(0, 4);
  if (picked.length < 2) continue;

  const meta = NAMES[family] ?? {
    name: `${family} workwear`,
    note: "Straight lines and steady colour, chosen to sit together.",
  };
  outfits.push({
    slug: `uskees-${family.toLowerCase()}`,
    name: meta.name,
    aestheticSlug: AESTHETIC,
    note: meta.note,
    source: "AGENT",
    items: picked.map((p) => ({
      productSlug: `uskees-${p.handle}`.slice(0, 190),
      score: p.score,
      note: `${p.model} in ${p.colourNorm}, scored ${p.score}.`,
    })),
  });
}

const result = await upsertOutfits(prisma, outfits);
for (const f of result.failed) console.error(`  rejected ${f.error}`);
console.log(`outfits     ${result.written.length} written, ${result.failed.length} rejected`);
for (const w of result.written) {
  console.log(`  ${w.created ? "created" : "updated"}  ${w.slug}  (${w.itemCount} pieces)`);
}

await prisma.$disconnect();
