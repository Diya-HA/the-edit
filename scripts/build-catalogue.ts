/**
 * Build the catalogue the seed plants.
 *
 *   node --experimental-strip-types scripts/build-catalogue.ts
 *
 * Fetches five real storefronts, classifies what comes back, chooses a balanced
 * subset and writes prisma/catalogue.json.
 *
 * It writes into prisma/ rather than anywhere more natural because of the
 * Dockerfile: the runtime image copies .next/standalone, prisma/,
 * node_modules/prisma and node_modules/@prisma, and nothing else. The seed runs
 * on container start, so everything the seed reads has to sit under one of
 * those four paths. Same reason prisma/outfits.ts lives where it does.
 *
 * Run this when the catalogue should change. It touches the network; the seed
 * never does.
 */
import { writeFileSync } from "node:fs";
import { BRANDS, RATE_TO_USD, RETIRED_BRANDS, RETIRED_OUTFITS } from "./catalogue/brands.ts";
import {
  classify,
  dedupeColourways,
  fetchCatalogue,
  type Piece,
  type Slot,
} from "./catalogue/classify.ts";

const OUT = new URL("../prisma/catalogue.json", import.meta.url);

/** How many styles to keep per aesthetic per slot. */
const PER_SLOT = 6;

/* The schema's Slot enum has no DRESS — a dress is worn on top and replaces
   the bottom, so it is stored as TOP. The distinction still matters while
   outfits are being assembled, which is why it survives classification and
   dies here. */
const DB_SLOT: Record<Slot, string> = {
  TOP: "TOP", DRESS: "TOP", BOTTOM: "BOTTOM", OUTER: "OUTER",
  SHOES: "SHOES", BAG: "BAG", ACCESSORY: "ACCESSORY",
};

/* --- voice --------------------------------------------------------------- */

/* Lines are generated, so they have to be true of anything they are attached
   to: what the piece is and what colour it is, never what the shopper has been
   doing. Invented familiarity is worse than none. */
const LINE_BY_SLOT: Record<Slot, string[]> = {
  TOP: ["Works on its own and under everything else.", "The layer the rest gets chosen around.", "Plain enough to wear twice a week."],
  DRESS: ["One decision, whole outfit.", "Moves well, which is most of the work.", "The piece everything else answers to."],
  BOTTOM: ["Cut straight and worn loose.", "Gets better the more it creases.", "Holds its shape all week."],
  OUTER: ["Goes over the lot without swamping it.", "Thrown on, and the outfit is finished.", "Cut short so it clears everything underneath."],
  SHOES: ["Quiet on their own, loud with a long skirt.", "Sturdy enough to walk home in.", "The pair that survives the whole season."],
  BAG: ["Carries the week without trying.", "Big enough for the days that need it.", "Nothing about it asks for attention."],
  ACCESSORY: ["The small thing that changes the outfit.", "Cheap in the best way.", "Makes the rest look deliberate."],
};

const WHY_BY_AESTHETIC: Record<string, (colour: string) => string[]> = {
  "quiet-utility": (c) => [
    `Straight lines and ${c}, which stays out of the way.`,
    `Workwear cut clean, in a ${c} that ages well.`,
  ],
  "soft-romance": (c) => [
    `Warm neutrals and one soft colour — here it is ${c}.`,
    `${c.charAt(0).toUpperCase() + c.slice(1)}, soft enough to sit under everything.`,
  ],
  "balletcore-off-duty": (c) => [
    `Wrap knits and flats, in a ${c} that keeps it off duty.`,
    `Built to move in, and ${c} keeps it quiet.`,
  ],
  whimsigoth: (c) => [
    `Velvet and moons, grounded by ${c}.`,
    `Dark and a bit theatrical, in ${c}.`,
  ],
};

/** Stable pick — the same piece gets the same line on every rebuild. */
function pick<T>(list: T[], key: string): T {
  let n = 0;
  for (let i = 0; i < key.length; i += 1) n = (n * 31 + key.charCodeAt(i)) % 99991;
  return list[n % list.length];
}

/* --- selection ----------------------------------------------------------- */

/**
 * Take up to PER_SLOT styles per slot, spreading across brands and colour
 * families first so an aesthetic does not end up as six versions of one thing
 * from one label. Cheapest first within that, because a catalogue that opens
 * expensive reads as a different product.
 */
function select(pieces: Piece[]): Piece[] {
  const out: Piece[] = [];
  const slots: Slot[] = ["TOP", "DRESS", "BOTTOM", "OUTER", "SHOES", "BAG", "ACCESSORY"];

  for (const slot of slots) {
    const inSlot = pieces.filter((p) => p.slot === slot).sort((a, b) => a.price - b.price);
    const taken: Piece[] = [];
    const seenBrand = new Map<string, number>();
    const seenFamily = new Map<string, number>();

    /* Two passes: first one piece per (brand, family) pair, then fill up. */
    for (const p of inSlot) {
      if (taken.length >= PER_SLOT) break;
      const b = seenBrand.get(p.brand) ?? 0;
      const f = seenFamily.get(p.colorName) ?? 0;
      if (b === 0 || f === 0) {
        taken.push(p);
        seenBrand.set(p.brand, b + 1);
        seenFamily.set(p.colorName, f + 1);
      }
    }
    for (const p of inSlot) {
      if (taken.length >= PER_SLOT) break;
      if (!taken.includes(p)) taken.push(p);
    }
    out.push(...taken);
  }
  return out;
}

/* --- outfits ------------------------------------------------------------- */

type OutfitOut = {
  slug: string;
  name: string;
  aestheticSlug: string;
  note: string;
  source: string;
  items: { productSlug: string; score: number; note: string }[];
};

const OUTFIT_NAMES: Record<string, { name: string; note: string }[]> = {
  "quiet-utility": [
    { name: "Monday, and it holds", note: "Straight lines and pockets, nothing asking for attention." },
    { name: "Cord and canvas", note: "Two heavy weaves and a colour that stays put." },
  ],
  "soft-romance": [
    { name: "Sunday, slowly", note: "Soft cloth in warm neutrals, with one colour doing the talking." },
    { name: "The good linen", note: "Everything here creases, and that is the point." },
  ],
  "balletcore-off-duty": [
    { name: "Class, then the rest of the day", note: "Wrap knits over a leotard and flats you can actually walk in." },
    { name: "Off duty, still on pointe", note: "Ribbed knit and ribbon, kept quiet enough for daylight." },
  ],
  whimsigoth: [
    { name: "Long way home", note: "Velvet and mesh, romantic rather than heavy." },
    { name: "Moons and mesh", note: "Dark, a bit theatrical, entirely wearable." },
  ],
};

/**
 * Assemble a head-to-toe look: one piece per slot, four to six pieces, all one
 * aesthetic. Prefers pieces from different labels — a look drawn from one brand
 * is that brand's lookbook, and the whole claim is one aesthetic across many.
 */
function assemble(pieces: Piece[], aesthetic: string, index: number): OutfitOut | null {
  const meta = OUTFIT_NAMES[aesthetic]?.[index];
  if (!meta) return null;

  const bySlot = (s: Slot) =>
    pieces.filter((p) => p.slot === s).sort((a, b) => a.price - b.price);

  const chosen: Piece[] = [];
  const usedBrands = new Set<string>();
  const usedSlots = new Set<string>();

  /* Take from the slot, preferring a label not yet in the look — a look drawn
     from one brand is that brand's lookbook.
     Only the cheapest few are ever candidates. Walking the whole price-sorted
     list with `index` produced a five-piece Balletcore look costing $1,506,
     which argues against the product rather than for it. */
  const SHORTLIST = 3;
  const take = (slot: Slot) => {
    const options = bySlot(slot);
    if (options.length === 0) return;
    const fresh = options.filter((p) => !usedBrands.has(p.brand));
    const pool = (fresh.length > 0 ? fresh : options).slice(0, SHORTLIST);
    const p = pool[index % pool.length];
    if (usedSlots.has(DB_SLOT[p.slot])) return;
    chosen.push(p);
    usedBrands.add(p.brand);
    usedSlots.add(DB_SLOT[p.slot]);
  };

  /* A dress fills the top and removes the need for a bottom. Only reach for
     one when the aesthetic actually has dresses worth building on. */
  const dresses = bySlot("DRESS");
  if (dresses.length > 0 && index % 2 === 1) {
    take("DRESS");
    take("OUTER");
  } else {
    take("TOP");
    take("BOTTOM");
    take("OUTER");
  }
  take("SHOES");
  take("ACCESSORY");
  take("BAG");

  if (chosen.length < 4) return null;
  const items = chosen.slice(0, 6);

  return {
    slug: `${aesthetic}-${index === 0 ? "one" : "two"}`,
    name: meta.name,
    aestheticSlug: aesthetic,
    note: meta.note,
    source: "SEED",
    items: items.map((p) => ({
      productSlug: `${p.brand}-${p.handle}`.slice(0, 190),
      /* Assembled by rule, not by the skill, so the score says how well it
         fits the look rather than pretending to a judgement it never made. */
      score: 88,
      note: `${p.category} in ${p.colourWord}.`,
    })),
  };
}

/* --- run ----------------------------------------------------------------- */

const allPieces: Piece[] = [];
const rejections: Record<string, Record<string, number>> = {};

for (const brand of BRANDS) {
  process.stdout.write(`${brand.name.padEnd(10)} `);
  const raw = await fetchCatalogue(brand);
  const { pieces, rejected } = classify(raw, brand);
  const styles = dedupeColourways(pieces);
  allPieces.push(...styles);

  rejections[brand.slug] = {};
  for (const r of rejected) {
    rejections[brand.slug][r.reason] = (rejections[brand.slug][r.reason] ?? 0) + 1;
  }
  console.log(`${String(raw.length).padStart(5)} fetched  ${String(styles.length).padStart(4)} styles`);
}

const AESTHETICS = [...new Set(BRANDS.map((b) => b.aesthetic))];
const products: Record<string, unknown>[] = [];
const outfits: OutfitOut[] = [];

for (const aesthetic of AESTHETICS) {
  const mine = allPieces.filter((p) => p.aesthetic === aesthetic);
  const kept = select(mine);

  for (const p of kept) {
    products.push({
      slug: `${p.brand}-${p.handle}`.slice(0, 190),
      title: p.title,
      category: p.category,
      slot: DB_SLOT[p.slot],
      price: p.price,
      colorName: p.colorName,
      colorToken: p.colorToken,
      colorHex: p.colorHex,
      line: pick(LINE_BY_SLOT[p.slot], p.handle),
      why: pick(WHY_BY_AESTHETIC[aesthetic](p.colourWord), p.handle + "w"),
      imageUrl: p.imageUrl,
      productUrl: p.productUrl,
      brand: p.brand,
      aesthetic,
    });
  }

  for (let i = 0; i < 2; i += 1) {
    const o = assemble(kept, aesthetic, i);
    if (o) outfits.push(o);
    else console.log(`  ${aesthetic}: outfit ${i + 1} could not be assembled`);
  }
}

const catalogue = {
  generatedAt: new Date().toISOString(),
  note: "Generated by scripts/build-catalogue.ts. Do not edit by hand.",
  rates: RATE_TO_USD,
  ratesNote: "Fixed, not live. Stated so the figures can be read back.",
  retiredBrands: RETIRED_BRANDS,
  retiredOutfits: RETIRED_OUTFITS,
  brands: BRANDS.map((b) => ({
    slug: b.slug, name: b.name, meta: b.meta,
    colorToken: b.colorToken, isPartner: b.isPartner,
  })),
  products,
  outfits,
};

writeFileSync(OUT, JSON.stringify(catalogue, null, 2));

console.log(`\n${products.length} products, ${outfits.length} outfits -> prisma/catalogue.json`);
for (const [brand, reasons] of Object.entries(rejections)) {
  const total = Object.values(reasons).reduce((a, b) => a + b, 0);
  if (total === 0) continue;
  console.log(`\n${brand}: ${total} not taken`);
  for (const [reason, n] of Object.entries(reasons).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${String(n).padStart(4)}  ${reason}`);
  }
}
