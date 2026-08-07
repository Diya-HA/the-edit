/**
 * Seed: 4 aesthetics, 6 brands, 30 products, one shopper with four edits and
 * two labels followed.
 *
 * Idempotent by design — everything is an upsert keyed on a natural handle,
 * so running it twice changes nothing. That is what lets it run on container
 * start in production.
 *
 * Colour follows turn 3 of the design (design/screens/the-edit-FINAL-turn3
 * .dc.html): placeholders are tinted to the actual fabric, not to decorative
 * pigment. Each product carries its own tone — the colour of the cloth — plus
 * the palette family it groups into, which is what the filter row offers.
 */
import { PrismaClient } from "@prisma/client";
import { upsertOutfits } from "../lib/outfits.ts";
import type { OutfitInput } from "../lib/outfits.ts";

const prisma = new PrismaClient();

/** The eight palette families the filter row offers. */
const FAMILY = {
  neutral: { colorName: "Neutral", colorToken: "--fabric-neutral" },
  cream: { colorName: "Cream", colorToken: "--fabric-cream" },
  butter: { colorName: "Butter", colorToken: "--fabric-butter" },
  rust: { colorName: "Rust", colorToken: "--fabric-rust" },
  rose: { colorName: "Rose", colorToken: "--fabric-rose" },
  indigo: { colorName: "Indigo", colorToken: "--fabric-indigo" },
  sage: { colorName: "Sage", colorToken: "--fabric-sage" },
  ink: { colorName: "Ink", colorToken: "--fabric-ink" },
} as const;

type FamilyKey = keyof typeof FAMILY;

const AESTHETICS = [
  {
    slug: "soft-romance",
    name: "Soft romance",
    description: "Warm neutrals and one soft colour",
    wordmark: "Soft romance ’26",
  },
  {
    slug: "quiet-utility",
    name: "Quiet utility",
    description: "Workwear cut clean",
    wordmark: "Quiet utility ’26",
  },
  {
    slug: "balletcore-off-duty",
    name: "Balletcore off duty",
    description: "Ribbons and wrap knits and flats",
    wordmark: "Balletcore off duty ’26",
  },
  {
    slug: "whimsigoth",
    name: "Whimsigoth",
    description: "Velvet and crochet and moons",
    wordmark: "Whimsigoth ’26",
  },
];

const BRANDS = [
  { slug: "margaux", name: "Margaux", meta: "Three of theirs live on your boards", colorToken: "--fabric-rose", isPartner: true },
  { slug: "ciel", name: "Ciel", meta: "Two prices came down this week", colorToken: "--fabric-indigo", isPartner: true },
  { slug: "alder-and-oak", name: "Alder & Oak", meta: "New linen just landed", colorToken: "--fabric-sage", isPartner: false },
  { slug: "paloma-works", name: "Paloma Works", meta: "You keep four of theirs", colorToken: "--fabric-neutral", isPartner: false },
  { slug: "leonie", name: "Leonie", meta: "Quietly good after dark", colorToken: "--fabric-ink", isPartner: true },
  { slug: "halle", name: "Halle", meta: "The knitwear you come back to", colorToken: "--fabric-rust", isPartner: false },
];

/** Labels the seeded shopper already follows. */
const FOLLOWED = ["margaux", "ciel"];

/** Looks she has starred. Starred looks sort first on the home strip. */
const STARRED = ["soft-romance"];

type ProductSeed = {
  slug: string;
  title: string;
  /** Garment noun. Shown uppercase on the placeholder — "CARDIGAN". */
  category: string;
  price: number;
  wasPrice?: number;
  brand: string;
  aesthetic: string;
  /** Palette family, for the filter row. */
  family: FamilyKey;
  /** The tone of the actual cloth, which fills the placeholder. */
  tone: string;
  line: string;
  why: string;
};

/* 30 pieces — five per brand, spread across the four looks. */
const PRODUCTS: ProductSeed[] = [
  // ---- Margaux ----
  { slug: "margaux-cotton-poplin-blouse", title: "Cotton poplin blouse", category: "blouse", price: 128, brand: "margaux", aesthetic: "soft-romance", family: "cream", tone: "#F2EDE4", line: "Goes under everything without adding bulk.", why: "Sits neatly beneath the cardigan you starred." },
  { slug: "margaux-cropped-barn-coat", title: "Cropped barn coat", category: "coat", price: 285, wasPrice: 340, brand: "margaux", aesthetic: "quiet-utility", family: "sage", tone: "#B6B79C", line: "Cut short so it sits over everything.", why: "Short enough to clear the long skirts you save." },
  { slug: "margaux-silk-scarf", title: "Hand rolled silk scarf", category: "scarf", price: 74, brand: "margaux", aesthetic: "soft-romance", family: "rose", tone: "#E9C7CC", line: "The one thing that lifts a plain morning.", why: "A warm note to break up all that oatmeal." },
  { slug: "margaux-wool-trouser", title: "High waist wool trouser", category: "trouser", price: 198, brand: "margaux", aesthetic: "quiet-utility", family: "indigo", tone: "#9AA9C4", line: "Holds a crease all the way to Friday.", why: "The cut you keep saving, in a weight that lasts past October." },
  { slug: "margaux-velvet-blazer", title: "Crushed velvet blazer", category: "blazer", price: 320, wasPrice: 395, brand: "margaux", aesthetic: "whimsigoth", family: "ink", tone: "#3A3A3C", line: "Dark, a bit theatrical, entirely wearable.", why: "Darker than your usual and it works with everything on One day." },

  // ---- Ciel ----
  { slug: "ciel-ribbon-tie-ballet-flat", title: "Ribbon tie ballet flat", category: "flat", price: 96, wasPrice: 140, brand: "ciel", aesthetic: "balletcore-off-duty", family: "rose", tone: "#E9C7CC", line: "Quiet alone and loud with a long skirt.", why: "You keep saving flats so here is a pair that lasts." },
  { slug: "ciel-wrap-knit-cardigan", title: "Wrap knit cardigan", category: "cardigan", price: 145, brand: "ciel", aesthetic: "balletcore-off-duty", family: "rust", tone: "#E3CBA4", line: "Ties at the waist and softens everything.", why: "Ties in where the boxier knits on your boards do not." },
  { slug: "ciel-mesh-sock", title: "Sheer mesh sock", category: "sock", price: 24, wasPrice: 32, brand: "ciel", aesthetic: "balletcore-off-duty", family: "rose", tone: "#F0D9DC", line: "Small thing that changes the whole outfit.", why: "Makes the flats you already keep look finished." },
  { slug: "ciel-satin-hair-ribbon", title: "Satin hair ribbon", category: "ribbon", price: 18, brand: "ciel", aesthetic: "soft-romance", family: "butter", tone: "#F0DFA8", line: "Cheap in the best way.", why: "Cheapest trick for making the rest look deliberate." },
  { slug: "ciel-leather-mary-jane", title: "Leather mary jane", category: "shoe", price: 245, brand: "ciel", aesthetic: "whimsigoth", family: "ink", tone: "#3A3A3C", line: "Sturdy enough to walk home in.", why: "Tougher than the flats you keep and just as pretty." },

  // ---- Alder & Oak ----
  { slug: "alder-washed-linen-trouser", title: "Washed linen trouser", category: "trouser", price: 165, brand: "alder-and-oak", aesthetic: "quiet-utility", family: "neutral", tone: "#E4DCCB", line: "The kind that gets better creased.", why: "Same easy cut as the dress on your Linen summer board." },
  { slug: "alder-slub-linen-dress", title: "Slub linen dress", category: "dress", price: 210, brand: "alder-and-oak", aesthetic: "soft-romance", family: "neutral", tone: "#EDE3D3", line: "The one everything else was chosen around.", why: "Everything on your Soft romance board goes with it." },
  { slug: "alder-boxy-canvas-jacket", title: "Boxy canvas jacket", category: "jacket", price: 240, brand: "alder-and-oak", aesthetic: "quiet-utility", family: "sage", tone: "#C9D2C3", line: "Throw it over anything and it works.", why: "Roomy enough to go over the knits already on your boards." },
  { slug: "alder-oversized-poplin-shirt", title: "Oversized poplin shirt", category: "shirt", price: 110, wasPrice: 145, brand: "alder-and-oak", aesthetic: "quiet-utility", family: "cream", tone: "#E8EAEC", line: "Works buttoned up or falling off.", why: "Cheap trick for making everything else look considered." },
  { slug: "alder-undyed-cotton-tee", title: "Undyed cotton tee", category: "tee", price: 58, brand: "alder-and-oak", aesthetic: "quiet-utility", family: "cream", tone: "#F2EDE4", line: "The plain one you reach for most.", why: "The layer the rest of your linen has been missing." },

  // ---- Paloma Works ----
  { slug: "paloma-raw-hem-denim", title: "Raw hem denim", category: "denim", price: 132, wasPrice: 176, brand: "paloma-works", aesthetic: "quiet-utility", family: "indigo", tone: "#9AA9C4", line: "Stiff for a week then yours forever.", why: "A plainer cut than the pair you scrolled past last week." },
  { slug: "paloma-workwear-chore-coat", title: "Workwear chore coat", category: "coat", price: 189, brand: "paloma-works", aesthetic: "quiet-utility", family: "indigo", tone: "#8C97AE", line: "Four pockets and no opinions.", why: "Goes over the knits you save without swamping them." },
  { slug: "paloma-canvas-tote", title: "Heavy canvas tote", category: "tote", price: 88, brand: "paloma-works", aesthetic: "quiet-utility", family: "neutral", tone: "#E4DCCB", line: "Carries a laptop and a week of groceries.", why: "Big enough for the days your board says desk to dinner." },
  { slug: "paloma-indigo-overshirt", title: "Indigo overshirt", category: "overshirt", price: 124, brand: "paloma-works", aesthetic: "quiet-utility", family: "indigo", tone: "#9AA9C4", line: "Fades exactly where you use it.", why: "Layers over the tees you own and fades with them." },
  { slug: "paloma-utility-belt", title: "Webbing utility belt", category: "belt", price: 45, wasPrice: 60, brand: "paloma-works", aesthetic: "quiet-utility", family: "sage", tone: "#C9D2C3", line: "Adjusts to whatever you are wearing.", why: "Holds up the looser trousers you keep saving." },

  // ---- Leonie ----
  { slug: "leonie-silk-slip-skirt", title: "Silk slip skirt", category: "skirt", price: 148, brand: "leonie", aesthetic: "soft-romance", family: "butter", tone: "#F0DFA8", line: "One shiny thing is usually enough.", why: "The bit of shine your neutrals have been missing." },
  { slug: "leonie-lace-trim-camisole", title: "Lace trim camisole", category: "camisole", price: 88, brand: "leonie", aesthetic: "soft-romance", family: "rose", tone: "#F0D9DC", line: "Layer it or don’t.", why: "Works alone in August and under wool by October." },
  { slug: "leonie-bias-cut-midi", title: "Bias cut midi dress", category: "dress", price: 265, wasPrice: 330, brand: "leonie", aesthetic: "soft-romance", family: "rose", tone: "#E9C7CC", line: "Moves well, which is most of the work.", why: "The dress your Soft romance board has been building toward." },
  { slug: "leonie-velvet-opera-coat", title: "Velvet opera coat", category: "coat", price: 410, brand: "leonie", aesthetic: "whimsigoth", family: "ink", tone: "#3A3A3C", line: "For the two nights a year that deserve it.", why: "Worth the wait, which is what One day is for." },
  { slug: "leonie-crescent-drop-earring", title: "Crescent drop earring", category: "earring", price: 62, brand: "leonie", aesthetic: "whimsigoth", family: "ink", tone: "#8F8A82", line: "Tarnished silver, deliberately.", why: "Tarnished enough to sit with the silver you keep." },

  // ---- Halle ----
  { slug: "halle-lambswool-cardigan", title: "Lambswool cardigan", category: "cardigan", price: 118, brand: "halle", aesthetic: "soft-romance", family: "rust", tone: "#E3CBA4", line: "The one everything else got picked around.", why: "Half your boards are built around a cardigan like this." },
  { slug: "halle-ribbed-wool-sock", title: "Ribbed wool sock", category: "sock", price: 28, brand: "halle", aesthetic: "balletcore-off-duty", family: "rust", tone: "#D08A6E", line: "Small thing that changes the whole outfit.", why: "Warm colour to break up all that oatmeal." },
  { slug: "halle-crochet-cardigan", title: "Crochet cardigan", category: "crochet", price: 195, wasPrice: 240, brand: "halle", aesthetic: "whimsigoth", family: "ink", tone: "#8F8A82", line: "A bit odd in the best way.", why: "Odd enough to be interesting and soft enough to live in." },
  { slug: "halle-cashmere-crew", title: "Featherweight cashmere crew", category: "knit", price: 225, brand: "halle", aesthetic: "soft-romance", family: "butter", tone: "#F0DFA8", line: "Thin for autumn, warm for winter.", why: "Thin enough to go under everything else you keep." },
  { slug: "halle-ballet-wrap-top", title: "Ballet wrap top", category: "wrap top", price: 132, brand: "halle", aesthetic: "balletcore-off-duty", family: "rose", tone: "#F0D9DC", line: "Crosses at the front and stays put.", why: "The wrap shape you keep saving, in a knit that holds it." },
];

/* Assembled outfits. Written through the same upsertOutfits the agent uses,
   so the seed exercises the real write path rather than a private shortcut.
   The notes are WHY lines in the product voice, as the skill produces. */
const OUTFITS: OutfitInput[] = [
  {
    slug: "sunday-in-warm-neutrals",
    name: "Sunday in warm neutrals",
    aestheticSlug: "soft-romance",
    note: "Butter and cream layered soft, with one shine for the evening.",
    items: [
      { productSlug: "margaux-cotton-poplin-blouse", score: 92, note: "Warms the cream without competing." },
      { productSlug: "leonie-silk-slip-skirt", score: 88, note: "The shine the neutrals were missing." },
      { productSlug: "halle-lambswool-cardigan", score: 90, note: "The piece the rest gets chosen around." },
      { productSlug: "ciel-satin-hair-ribbon", score: 84, note: "Makes the whole thing look deliberate." },
    ],
  },
  {
    slug: "the-long-dress-one",
    name: "The long dress one",
    aestheticSlug: "soft-romance",
    note: "One dress doing the work, softened either side.",
    items: [
      { productSlug: "alder-slub-linen-dress", score: 94, note: "Everything here was chosen around it." },
      { productSlug: "halle-cashmere-crew", score: 86, note: "Goes under it when it turns." },
      { productSlug: "margaux-silk-scarf", score: 82, note: "A warm note against all that oatmeal." },
    ],
  },
  {
    slug: "monday-uniform",
    name: "Monday uniform",
    aestheticSlug: "quiet-utility",
    note: "Straight lines and pockets, nothing asking for attention.",
    items: [
      { productSlug: "alder-washed-linen-trouser", score: 91, note: "Better creased, which helps by Friday." },
      { productSlug: "alder-oversized-poplin-shirt", score: 89, note: "Buttoned up or falling off, both work." },
      { productSlug: "alder-boxy-canvas-jacket", score: 87, note: "Goes over the lot without swamping it." },
      { productSlug: "paloma-utility-belt", score: 78, note: "Holds the looser trouser where you want it." },
    ],
  },
  {
    slug: "denim-and-canvas",
    name: "Denim and canvas",
    aestheticSlug: "quiet-utility",
    note: "Indigo top to toe, broken with one plain layer.",
    items: [
      { productSlug: "paloma-raw-hem-denim", score: 90, note: "Stiff for a week, then yours." },
      { productSlug: "paloma-indigo-overshirt", score: 88, note: "Fades exactly where you use it." },
      { productSlug: "alder-undyed-cotton-tee", score: 83, note: "The plain layer holding it together." },
      { productSlug: "paloma-canvas-tote", score: 76, note: "Carries the week without trying." },
    ],
  },
  {
    slug: "studio-to-street",
    name: "Studio to street",
    aestheticSlug: "balletcore-off-duty",
    note: "Wrap knits and flats, worn a long way from the studio.",
    items: [
      { productSlug: "halle-ballet-wrap-top", score: 93, note: "Crosses at the front and stays put." },
      { productSlug: "ciel-wrap-knit-cardigan", score: 89, note: "Ties in where boxier knits do not." },
      { productSlug: "ciel-ribbon-tie-ballet-flat", score: 91, note: "Quiet alone, lovely with a long skirt." },
      { productSlug: "ciel-mesh-sock", score: 80, note: "Makes the flats look finished." },
    ],
  },
  {
    slug: "after-dark-velvet",
    name: "After dark velvet",
    aestheticSlug: "whimsigoth",
    note: "Velvet and tarnished silver, romantic rather than heavy.",
    items: [
      { productSlug: "leonie-velvet-opera-coat", score: 95, note: "For the two nights that deserve it." },
      { productSlug: "margaux-velvet-blazer", score: 88, note: "Theatrical without the effort." },
      { productSlug: "leonie-crescent-drop-earring", score: 85, note: "Tarnished enough to sit with the rest." },
      { productSlug: "ciel-leather-mary-jane", score: 82, note: "Sturdy enough to walk home in." },
    ],
  },
];

/* The trending row. Demo data: with one shopper there is no popularity
   signal to measure, so these are simply plausible and the app says so. */
const TRENDING = [
  "leonie-bias-cut-midi",
  "halle-lambswool-cardigan",
  "alder-slub-linen-dress",
  "ciel-ribbon-tie-ballet-flat",
  "paloma-raw-hem-denim",
  "margaux-cropped-barn-coat",
  "halle-crochet-cardigan",
  "leonie-silk-slip-skirt",
];

const EDITS = [
  { name: "Soft romance", note: "Started in March and still going" },
  { name: "Desk to dinner", note: "Things that do both" },
  { name: "Linen summer", note: "For Sicily allegedly" },
  { name: "One day", note: "Saving up" },
];

const SAVED: Record<string, string[]> = {
  "Soft romance": [
    "leonie-lace-trim-camisole",
    "halle-lambswool-cardigan",
    "leonie-silk-slip-skirt",
    "margaux-silk-scarf",
    "ciel-satin-hair-ribbon",
  ],
  "Desk to dinner": [
    "margaux-wool-trouser",
    "margaux-cotton-poplin-blouse",
    "halle-cashmere-crew",
  ],
  "Linen summer": [
    "alder-washed-linen-trouser",
    "alder-slub-linen-dress",
    "alder-oversized-poplin-shirt",
    "alder-undyed-cotton-tee",
  ],
  "One day": ["leonie-velvet-opera-coat", "margaux-velvet-blazer"],
};

async function main() {
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

  const brands = new Map<string, string>();
  for (const b of BRANDS) {
    const row = await prisma.brand.upsert({
      where: { slug: b.slug },
      update: { name: b.name, meta: b.meta, colorToken: b.colorToken, isPartner: b.isPartner },
      create: b,
    });
    brands.set(b.slug, row.id);
  }
  console.log(`brands      ${brands.size}`);

  const products = new Map<string, string>();
  for (const p of PRODUCTS) {
    const brandId = brands.get(p.brand);
    const aestheticId = aesthetics.get(p.aesthetic);
    if (!brandId) throw new Error(`${p.slug}: unknown brand "${p.brand}"`);
    if (!aestheticId) throw new Error(`${p.slug}: unknown aesthetic "${p.aesthetic}"`);

    const data = {
      slug: p.slug,
      title: p.title,
      category: p.category,
      price: p.price,
      wasPrice: p.wasPrice ?? null,
      line: p.line,
      why: p.why,
      colorHex: p.tone,
      ...FAMILY[p.family],
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

  for (const [i, slug] of TRENDING.entries()) {
    await prisma.product.update({
      where: { slug },
      data: { trendingRank: i + 1 },
    });
  }
  console.log(`trending    ${TRENDING.length}`);

  const outfits = await upsertOutfits(prisma, OUTFITS);
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
  for (const e of EDITS) {
    const edit = await prisma.edit.upsert({
      where: { userId_name: { userId: user.id, name: e.name } },
      update: { note: e.note },
      create: { userId: user.id, name: e.name, note: e.note },
    });

    for (const slug of SAVED[e.name] ?? []) {
      const productId = products.get(slug);
      if (!productId) throw new Error(`${e.name}: unknown product "${slug}"`);
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
