/**
 * Seed: 4 aesthetics, 6 brands, 30 products, one shopper with four edits.
 *
 * Idempotent by design — everything is an upsert keyed on a natural handle,
 * so running it twice changes nothing. That is what lets it run on container
 * start in production if we ever enable that in the Dockerfile.
 *
 * Names, brands, prices and copy come from the design screens
 * (design/screens/the-edit-app.dc.html) so the seeded feed reads like the
 * thing that was designed. Every product carries a tint from the palette in
 * design/design-system/tokens/colors.css, which is what makes the painted
 * swatches look right.
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/** The tint palette. `token` is what the React components consume. */
const TINT = {
  rose: { colorName: "Rose", colorToken: "--tint-rose", colorHex: "#FFD6E6" },
  butter: {
    colorName: "Butter",
    colorToken: "--tint-cadmium",
    colorHex: "#FFEDB0",
  },
  coral: {
    colorName: "Coral",
    colorToken: "--tint-vermillion",
    colorHex: "#FFD9D1",
  },
  sage: { colorName: "Sage", colorToken: "--tint-viridian", colorHex: "#C4F0DC" },
  sky: { colorName: "Sky", colorToken: "--tint-cerulean", colorHex: "#CBEBFF" },
  blue: { colorName: "Blue", colorToken: "--tint-cobalt", colorHex: "#D4D9FF" },
  violet: {
    colorName: "Violet",
    colorToken: "--tint-violet",
    colorHex: "#E3D6FF",
  },
} as const;

type TintKey = keyof typeof TINT;

const AESTHETICS = [
  {
    slug: "soft-romance",
    name: "Soft romance",
    description: "Warm neutrals with one soft colour.",
    wordmark: "Soft romance ’26",
  },
  {
    slug: "quiet-utility",
    name: "Quiet utility",
    description: "Workwear, cut clean.",
    wordmark: "Quiet utility ’26",
  },
  {
    slug: "balletcore-off-duty",
    name: "Balletcore off duty",
    description: "Ribbons, wrap knits and flats.",
    wordmark: "Balletcore off duty ’26",
  },
  {
    slug: "whimsigoth",
    name: "Whimsigoth",
    description: "Velvet, crochet and moons.",
    wordmark: "Whimsigoth ’26",
  },
];

const BRANDS = [
  {
    slug: "margaux",
    name: "Margaux",
    meta: "Three of theirs live on your boards",
    colorToken: "--tint-rose",
    isPartner: true,
  },
  {
    slug: "ciel",
    name: "Ciel",
    meta: "Two prices came down this week",
    colorToken: "--tint-cobalt",
    isPartner: true,
  },
  {
    slug: "alder-and-oak",
    name: "Alder & Oak",
    meta: "New linen just arrived",
    colorToken: "--tint-viridian",
    isPartner: false,
  },
  {
    slug: "paloma-works",
    name: "Paloma Works",
    meta: "You’ve saved four of theirs",
    colorToken: "--tint-cadmium",
    isPartner: false,
  },
  {
    slug: "leonie",
    name: "Leonie",
    meta: "Quietly good at eveningwear",
    colorToken: "--tint-violet",
    isPartner: true,
  },
  {
    slug: "halle",
    name: "Halle",
    meta: "The knitwear you keep coming back to",
    colorToken: "--tint-vermillion",
    isPartner: false,
  },
];

type ProductSeed = {
  slug: string;
  title: string;
  category: string;
  price: number;
  wasPrice?: number;
  brand: string;
  aesthetic: string;
  tint: TintKey;
  line: string;
};

/* 30 pieces — five per brand, spread across the four looks. */
const PRODUCTS: ProductSeed[] = [
  // ---- Margaux ----
  { slug: "margaux-cotton-poplin-blouse", title: "Cotton poplin blouse", category: "tops", price: 128, brand: "margaux", aesthetic: "soft-romance", tint: "butter", line: "Layers under everything without any bulk." },
  { slug: "margaux-cropped-barn-coat", title: "Cropped barn coat", category: "outerwear", price: 285, wasPrice: 340, brand: "margaux", aesthetic: "quiet-utility", tint: "sage", line: "Cut short so it sits well over everything." },
  { slug: "margaux-silk-scarf", title: "Hand rolled silk scarf", category: "accessories", price: 74, brand: "margaux", aesthetic: "soft-romance", tint: "rose", line: "The one thing that lifts a plain morning." },
  { slug: "margaux-wool-trouser", title: "High waist wool trouser", category: "bottoms", price: 198, brand: "margaux", aesthetic: "quiet-utility", tint: "blue", line: "Holds a crease all the way to Friday." },
  { slug: "margaux-velvet-blazer", title: "Crushed velvet blazer", category: "outerwear", price: 320, wasPrice: 395, brand: "margaux", aesthetic: "whimsigoth", tint: "violet", line: "Dark, a little theatrical, entirely wearable." },

  // ---- Ciel ----
  { slug: "ciel-ribbon-tie-ballet-flat", title: "Ribbon tie ballet flat", category: "shoes", price: 96, wasPrice: 140, brand: "ciel", aesthetic: "balletcore-off-duty", tint: "rose", line: "Quiet on their own, lovely with a long skirt." },
  { slug: "ciel-wrap-knit-cardigan", title: "Wrap knit cardigan", category: "knitwear", price: 145, brand: "ciel", aesthetic: "balletcore-off-duty", tint: "coral", line: "Ties at the waist and softens everything." },
  { slug: "ciel-mesh-sock", title: "Sheer mesh sock", category: "accessories", price: 24, wasPrice: 32, brand: "ciel", aesthetic: "balletcore-off-duty", tint: "rose", line: "A small thing that makes flats look considered." },
  { slug: "ciel-satin-hair-ribbon", title: "Satin hair ribbon", category: "accessories", price: 18, brand: "ciel", aesthetic: "soft-romance", tint: "butter", line: "Cheap in the best way, and it changes a whole look." },
  { slug: "ciel-leather-mary-jane", title: "Leather mary jane", category: "shoes", price: 245, brand: "ciel", aesthetic: "whimsigoth", tint: "violet", line: "Pretty enough for dinner, sturdy enough to walk home." },

  // ---- Alder & Oak ----
  { slug: "alder-washed-linen-trouser", title: "Washed linen trouser", category: "bottoms", price: 165, brand: "alder-and-oak", aesthetic: "quiet-utility", tint: "sage", line: "The kind of linen that looks better creased." },
  { slug: "alder-slub-linen-dress", title: "Slub linen dress", category: "dresses", price: 210, brand: "alder-and-oak", aesthetic: "soft-romance", tint: "butter", line: "The dress the whole look was built around." },
  { slug: "alder-boxy-canvas-jacket", title: "Boxy canvas jacket", category: "outerwear", price: 240, brand: "alder-and-oak", aesthetic: "quiet-utility", tint: "sage", line: "Throw it over anything and it simply works." },
  { slug: "alder-oversized-poplin-shirt", title: "Oversized poplin shirt", category: "tops", price: 110, wasPrice: 145, brand: "alder-and-oak", aesthetic: "quiet-utility", tint: "sky", line: "Lovely buttoned up or worn loose." },
  { slug: "alder-undyed-cotton-tee", title: "Undyed cotton tee", category: "tops", price: 58, brand: "alder-and-oak", aesthetic: "quiet-utility", tint: "sky", line: "The plain one you will reach for most." },

  // ---- Paloma Works ----
  { slug: "paloma-raw-hem-denim", title: "Raw hem denim", category: "bottoms", price: 132, wasPrice: 176, brand: "paloma-works", aesthetic: "quiet-utility", tint: "blue", line: "A touch stiff the first week, then yours forever." },
  { slug: "paloma-workwear-chore-coat", title: "Workwear chore coat", category: "outerwear", price: 189, brand: "paloma-works", aesthetic: "quiet-utility", tint: "blue", line: "Four pockets and no opinions." },
  { slug: "paloma-canvas-tote", title: "Heavy canvas tote", category: "bags", price: 88, brand: "paloma-works", aesthetic: "quiet-utility", tint: "butter", line: "Carries a laptop and a week of groceries." },
  { slug: "paloma-indigo-overshirt", title: "Indigo overshirt", category: "tops", price: 124, brand: "paloma-works", aesthetic: "quiet-utility", tint: "blue", line: "Fades exactly where you use it." },
  { slug: "paloma-utility-belt", title: "Webbing utility belt", category: "accessories", price: 45, wasPrice: 60, brand: "paloma-works", aesthetic: "quiet-utility", tint: "sage", line: "Adjusts to whatever you are wearing." },

  // ---- Leonie ----
  { slug: "leonie-silk-slip-skirt", title: "Silk slip skirt", category: "bottoms", price: 148, brand: "leonie", aesthetic: "soft-romance", tint: "butter", line: "One touch of shine is usually all you need." },
  { slug: "leonie-lace-trim-camisole", title: "Lace trim camisole", category: "tops", price: 88, brand: "leonie", aesthetic: "soft-romance", tint: "rose", line: "Layer it, or let it stand alone." },
  { slug: "leonie-bias-cut-midi", title: "Bias cut midi dress", category: "dresses", price: 265, wasPrice: 330, brand: "leonie", aesthetic: "soft-romance", tint: "rose", line: "Moves well, which is most of the work." },
  { slug: "leonie-velvet-opera-coat", title: "Velvet opera coat", category: "outerwear", price: 410, brand: "leonie", aesthetic: "whimsigoth", tint: "violet", line: "For the two nights a year that deserve it." },
  { slug: "leonie-crescent-drop-earring", title: "Crescent drop earring", category: "jewellery", price: 62, brand: "leonie", aesthetic: "whimsigoth", tint: "violet", line: "Tarnished silver, deliberately." },

  // ---- Halle ----
  { slug: "halle-lambswool-cardigan", title: "Lambswool cardigan", category: "knitwear", price: 118, brand: "halle", aesthetic: "soft-romance", tint: "coral", line: "The piece everything else gets chosen around." },
  { slug: "halle-ribbed-wool-sock", title: "Ribbed wool sock", category: "accessories", price: 28, brand: "halle", aesthetic: "balletcore-off-duty", tint: "coral", line: "A small thing that lifts the whole outfit." },
  { slug: "halle-crochet-cardigan", title: "Crochet cardigan", category: "knitwear", price: 195, wasPrice: 240, brand: "halle", aesthetic: "whimsigoth", tint: "violet", line: "A little unusual, in the best way." },
  { slug: "halle-cashmere-crew", title: "Featherweight cashmere crew", category: "knitwear", price: 225, brand: "halle", aesthetic: "soft-romance", tint: "butter", line: "Thin enough for autumn, warm enough for winter." },
  { slug: "halle-ballet-wrap-top", title: "Ballet wrap top", category: "knitwear", price: 132, brand: "halle", aesthetic: "balletcore-off-duty", tint: "rose", line: "Crosses at the front and stays put." },
];

const EDITS = [
  { name: "Soft romance", note: "Growing since March" },
  { name: "Desk to dinner", note: "Pieces that do both" },
  { name: "Linen summer", note: "For Sicily, hopefully" },
  { name: "One day", note: "Worth the wait" },
];

/** Which pieces land in which edit, by product slug. */
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
      update: {
        name: b.name,
        meta: b.meta,
        colorToken: b.colorToken,
        isPartner: b.isPartner,
      },
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
    if (!aestheticId)
      throw new Error(`${p.slug}: unknown aesthetic "${p.aesthetic}"`);

    const data = {
      slug: p.slug,
      title: p.title,
      category: p.category,
      price: p.price,
      wasPrice: p.wasPrice ?? null,
      line: p.line,
      ...TINT[p.tint],
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
