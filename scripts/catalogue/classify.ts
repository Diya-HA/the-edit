/**
 * Turn a Shopify products.json payload into pieces the app can hold.
 *
 * Everything here is deterministic and offline. It decides four things about a
 * garment — its slot, its colour family, its price in one currency, and whether
 * it is the same style as one already seen — and drops anything it cannot
 * decide rather than guessing. A wrong slot puts trousers where a jacket should
 * be in a head-to-toe look, which is worse than a shorter catalogue.
 *
 * Judging whether a garment belongs in an aesthetic is a different job, and it
 * belongs to .claude/skills/aesthetic-fit, not here. This assigns the aesthetic
 * its brand sits in.
 */
import { RATE_TO_USD, type BrandConfig } from "./brands.ts";

export type Slot = "TOP" | "DRESS" | "BOTTOM" | "OUTER" | "SHOES" | "BAG" | "ACCESSORY";

export type Piece = {
  brand: string;
  brandName: string;
  aesthetic: string;
  handle: string;
  title: string;
  /** The brand's own garment noun, shown on the card. */
  category: string;
  slot: Slot;
  /** Cheapest variant, in USD. */
  price: number;
  /** The word that decided the family — "camel", "noir". */
  colourWord: string;
  colorName: string;
  colorToken: string;
  colorHex: string;
  /** Every image the brand published, in its own order. The one to show is
      chosen after measuring — see lib/measure.ts. */
  imageCandidates: string[];
  imageUrl: string;
  productUrl: string;
  /** Style identity within a brand. Colourways of one style share it. */
  style: string;
};

type ShopifyProduct = {
  handle?: string;
  title?: string;
  product_type?: string;
  tags?: string[];
  options?: { name?: string; values?: string[] }[];
  variants?: { price?: string; available?: boolean; title?: string }[];
  images?: { src?: string }[];
};

/* --- slot ---------------------------------------------------------------- */

/* Ordered: the first match wins, so the specific beats the generic. "Ballet
   flat" has to reach SHOES before "flat" reaches anything else, and a
   "cardigan" has to reach OUTER before "knit" pulls it into TOP. */
/* Word boundaries are load-bearing, not tidiness. Without them "pointe" matches
   inside "pointelle" and files a knee-high sock as footwear, and "boot" matches
   inside "bootcut" and files a pair of jeans as boots. Both were real. */
const SLOT_RULES: [Slot, RegExp][] = [
  ["SHOES", /ballerines?\b|\bpointes?\b|\bbabies\b|mocassins?\b|sneakers?\b|bottines?\b|\bboots?\b|\bshoes?\b|sandals?\b|\bheels?\b|ballet flat|creepers?\b|loafers?\b|\bderby\b|\bclogs?\b|mary jane/],
  ["BAG", /\bsac\b|handbag|\bbag\b|tote|pouch|backpack|purse|clutch|satchel/],
  /* Worn, not merely owned. A keyring lived here for a while and reached the
     catalogue as a piece of an outfit, which it is not. */
  ["ACCESSORY", /\bbelts?\b|harness|\bsocks?\b|collants?\b|tights?\b|\bhat\b|\bcap\b|beanie|scarf|glove|jewel|earring|necklace|choker|\bhair\b|ribbon|leg ?warmer|wristband|headband|sunglass|brooch|\bgloves?\b/],
  ["OUTER", /jacket|coat|blazer|parka|trench|overshirt|cardigan|veste|manteau|shacket|gilet/],
  /* "short" must not catch "short-sleeve", which is a t-shirt. */
  ["BOTTOM", /trousers?\b|\bpants?\b|jeans?\b|denim|\bshorts\b|\bshort\b(?!\s*-?\s*sleeve)|skirts?\b|jupe|jupette|legging|culotte|chino/],
  ["DRESS", /\bmini\b|\bmidi\b|\bmaxi\b|dress|robe|gown|pinafore/],
  /* `bralet` but not a bare `bra`: a bralet is worn out, a bra is not, and a
     look built on underwear is a miss the app would be blamed for. */
  ["TOP", /justaucorps|leotard|cache-c|bodysuit|bralet|corset|tunique|tunic|sweater|sweatshirt|hoodie|shirt|t-?shirt|\btop\b|blouse|knit|jumper|cami|tank|vest|crop|polo|one-?piece|unitard/],
];

/**
 * Anything that is not a garment, or not for the shopper this app has.
 *
 * Brands sell more than clothes, and a lifestyle label sells a lot more: a
 * lunchbox, a water bottle, a candle, a keyring. None of it can be worn, so
 * none of it can be part of a head-to-toe look, so none of it belongs in a
 * feed about getting dressed. A piece that cannot fill a wearable slot is
 * dropped at ingest rather than filtered later — the catalogue should not
 * contain it in the first place.
 */
const EXCLUDE = new RegExp(
  [
    // Not a product
    "gift ?card", "e-gift", "voucher", "donation", "shipping protection",
    "sample sale", "mystery", "gift wrap",
    // Not for this shopper
    "enfant", "\\bkids?\\b", "\\bchild", "\\bmen'?s\\b",
    // Homeware and objects
    "lunchbox", "lunch box", "\\bbottle\\b", "flask", "\\bmug\\b", "tumbler",
    "candle", "\\bposter\\b", "art print", "sticker", "\\bpatch\\b", "\\bbook\\b",
    "\\btowel\\b", "blanket", "cushion", "\\brug\\b", "keyring", "key ?chain",
    "porte-cl", "\\bmagnet\\b", "\\bbadge\\b", "\\bpin\\b", "lanyard",
    "\\bposter\\b", "notebook", "\\bpen\\b", "\\bcard\\b",
    // Care and service
    "repair", "care kit", "detergent", "\\bspray\\b", "shoe ?tree", "insole",
  ].join("|"),
  "i",
);

/**
 * Costume rather than clothing. Repetto is a dance house, so its catalogue
 * carries genuine performance kit, and "Balletcore off duty" is by its own name
 * street clothes borrowing from ballet — a tutu is the one thing it is not.
 * Deliberately narrow: leotards and soft ballet flats stay, because those are
 * the aesthetic. Judging the rest of the line is the aesthetic-fit skill's job,
 * and this is a guardrail, not a substitute for it.
 */
const COSTUME = /\btutu\b|r[ée]p[ée]tition|competition|stage costume/i;

/** Children's ranges that are only distinguishable by their sizes. */
const KID_SIZE = /^\d+\s*(ans|yrs?|years?|m)$/i;

/**
 * The garment noun, as a person would say it.
 *
 * A brand's product_type is written for its own merchandising, not for a
 * shopper: Uskees files an overshirt as `OVERSHIRTS_COTTON` and a t-shirt as
 * `T-SHIRTS_JERSEY`. Lowercasing that verbatim put "overshirts_cotton" on the
 * card and into the alt text, which is only invisible while a photograph is
 * covering the label — it appeared the moment an image failed.
 *
 * The fabric is a real word about the garment, just not part of its name, so
 * known fabric tokens come off the end and the rest becomes the noun.
 */
const FABRIC_WORDS = new Set([
  "cotton", "cottonmix", "cottonblend", "wool", "drill", "cord", "linen",
  "blend", "mix", "ripstop", "polyester", "recycled", "jersey", "twill",
  "herringbone", "wax", "canvas", "lyocell", "nylon", "waffle", "oxford",
  "oxfordchambray", "seersucker", "chambray", "metal", "wood", "denim",
  "silk", "cashmere", "leather", "velvet", "mesh", "satin",
]);

/* Garments that are only ever plural. "A pant" is not a thing. */
const ALWAYS_PLURAL = new Set([
  "pants", "shorts", "socks", "tights", "jeans", "trousers", "leggings",
  "sunglasses", "gloves", "pointes", "demi-pointes", "boots", "heels",
  "sandals", "creepers", "ballerines", "collants",
  /* French, and singular as it stands — a leotard is "un justaucorps". */
  "justaucorps", "salomes", "babies",
]);

/* Types that name a department rather than a garment. Worse than nothing on a
   card, so the slot stands in instead. */
const NOT_A_NOUN = new Set([
  "other", "apparel", "clothing", "new", "sale", "all", "dance apparel",
]);

export function garmentNoun(productType: string, fallback: string): string {
  /* A slash means the brand could not decide — "NECKLACES/CHOKERS" is one
     thing filed under two names. Take the first; one noun is enough. */
  const parts = productType
    .toLowerCase()
    .split("/")[0]
    .split(/[_]+/)
    .map((s) => s.trim())
    .filter(Boolean);

  /* Trim fabric words from the end only. Taking them from anywhere would turn
     "tank top cotton" into "tank", and a leading fabric is sometimes the name
     — a "cord overshirt" is not an overshirt that happens to be cord. */
  while (parts.length > 1 && FABRIC_WORDS.has(parts[parts.length - 1])) {
    parts.pop();
  }

  /* One garment, so one noun — the card says OVERSHIRT, not OVERSHIRTS.
     Except where the plural is the word: nobody wears a pant. */
  const last = parts[parts.length - 1];
  if (last && !ALWAYS_PLURAL.has(last)) {
    /* "accessories" is not "accessorie". */
    if (/ies$/.test(last)) parts[parts.length - 1] = `${last.slice(0, -3)}y`;
    else if (/[^s]s$/.test(last)) parts[parts.length - 1] = last.slice(0, -1);
  }

  const noun = parts.join(" ").replace(/\s+/g, " ").trim();
  if (!noun || /^\d/.test(noun) || NOT_A_NOUN.has(noun)) return fallback;
  return noun;
}

export function slotOf(...texts: (string | undefined)[]): Slot | null {
  const blob = texts.filter(Boolean).join(" ").toLowerCase();
  for (const [slot, pattern] of SLOT_RULES) {
    if (pattern.test(blob)) return slot;
  }
  return null;
}

/* --- colour -------------------------------------------------------------- */

/* English and French, because Repetto keeps colour only in a French handle.
   The families are the eight the filter row offers; the hex is the tone of the
   cloth, which fills the field behind the photograph and shows while it
   loads. */
const COLOUR_FAMILIES: [string, string, string, RegExp][] = [
  ["Ink", "--fabric-ink", "#2A2622", /black|noir|charcoal|coal|onyx|jet|graphite|raven|ebony|licorice|obsidian/],
  ["Indigo", "--fabric-indigo", "#3B4A63", /navy|indigo|marine|midnight|denim|blue|bleu|paon|slate|steel|azur|cobalt|petrol|teal|aqua/],
  ["Sage", "--fabric-sage", "#7C8A6B", /sage|olive|green|vert|khaki|kaki|moss|fern|seaweed|forest|pistach|celadon|amande/],
  ["Rust", "--fabric-rust", "#A5613F", /rust|chestnut|brick|terracotta|\btan\b|camel|cognac|caramel|copper|bronze|orange|ochre|marron|brun|brown|ristretto|chocolat|espresso|cinnamon|rouille|fauve|toffee|hazel|walnut|tabac|amber|rouge|\bred\b|scarlet|cherry|coral|corail/],
  ["Rose", "--fabric-rose", "#D8A7B0", /rose|pink|blush|petal|fuchsia|magenta|mauve|lilac|lilas|lavender|lavande|violet|purple|plum|prune|berry|wine|burgundy|bordeaux|aubergine|orchid|peony|bramble|heather/],
  ["Butter", "--fabric-butter", "#E8CE8A", /butter|yellow|jaune|gold|dor[ée]|lemon|citron|mustard|moutarde|honey|miel|straw|wheat|saffron|apricot|abricot|peach|p[êe]che|champagne/],
  ["Cream", "--fabric-cream", "#EFE7DA", /cream|cr[èe]me|ivory|ivoire|white|blanc|salt|[ée]cru|bone|chalk|milk|lait|pearl|perle|\boat|vanilla|vanille|snow|neige|coconut/],
  ["Neutral", "--fabric-neutral", "#C9BFB2", /stone|sand|sable|taupe|natural|naturel|beige|nude|chair|grey|gray|gris|argent|silver|mushroom|clay|greige|linen|\blin\b|putty|pebble/],
];

export function colourFamily(text: string | undefined) {
  const n = (text ?? "").toLowerCase();
  for (const [name, token, hex, pattern] of COLOUR_FAMILIES) {
    const m = n.match(pattern);
    if (m) return { colorName: name, colorToken: token, colorHex: hex, word: m[0] };
  }
  return null;
}

function colourTextOf(p: ShopifyProduct, brand: BrandConfig): string | null {
  if (brand.colourFrom === "option") {
    for (const o of p.options ?? []) {
      const n = (o.name ?? "").toLowerCase();
      if (["colour", "color", "product color", "couleur"].includes(n)) {
        const v = (o.values ?? [])[0];
        if (v) return v;
      }
    }
  }
  if (brand.colourFrom === "title-suffix") {
    const t = p.title ?? "";
    if (t.includes("--")) return t.split("--").pop()!.trim();
  }
  if (brand.colourFrom === "handle") {
    return (p.handle ?? "").replace(/-/g, " ");
  }
  /* Whatever the brand's declared source, a colour word in the title is still
     a colour word. Tried last so a real field always wins. */
  return p.title ?? null;
}

/* --- the rest ------------------------------------------------------------ */

function isKids(p: ShopifyProduct) {
  for (const o of p.options ?? []) {
    const n = (o.name ?? "").toLowerCase();
    if (n === "size" || n === "taille") {
      const vals = o.values ?? [];
      if (vals.length > 0 && vals.every((v) => KID_SIZE.test(String(v).trim()))) return true;
    }
  }
  return false;
}

function priceUsd(p: ShopifyProduct, currency: BrandConfig["currency"]): number | null {
  const prices = (p.variants ?? [])
    .map((v) => Number(v.price))
    .filter((n) => Number.isFinite(n) && n > 0);
  if (prices.length === 0) return null;

  const rate = RATE_TO_USD[currency];
  const cheapest = Math.min(...prices);
  /* Prices already in USD are the brand's own and are left exactly alone.
     Converted ones are rounded to whole dollars: £15.60 becomes $20, not
     $19.8 — a converted price is approximate anyway, and carrying the false
     precision through only makes the feed look broken. */
  return rate === 1 ? cheapest : Math.round(cheapest * rate);
}

/**
 * Style identity is the cleaned title, which is the whole point of cleaning it.
 *
 * prisma/outfits.ts refuses two colourways of one style in a look, and it
 * recognises them by `(brandId, title)`. That assumption held for brands which
 * repeat a title across colourways and broke on the ones that write the colour
 * into the title — Uskees ("… - vine green") and Dôen ("… -- SALT"). Stripping
 * the colourway here makes the assumption true for every brand, so the rule
 * keeps working without outfits.ts having to learn about brands.
 */
function styleKey(display: string): string {
  /* Whitespace is normalised because storefronts are typed by hand: Repetto
     publishes "Demi-Pointes - bi-semelles pro/ option moyenne" twice, once
     with a double space, and without this they are two styles. */
  return display.toLowerCase().replace(/\s+/g, " ").trim();
}

/**
 * Title as the app should show it.
 *
 * Storefront titles carry things meant for the storefront: Uskees leads with a
 * style number ("7006 Phillips head screw t-shirt - faded"), Dôen appends the
 * colourway after a double dash, several shout in capitals, and most repeat the
 * colour the card already shows as a swatch. All of it comes off.
 */
function displayTitle(p: ShopifyProduct, brand: BrandConfig, colourWord: string): string {
  let t = (p.title ?? "").trim();

  if (brand.colourwayInTitle && t.includes("--")) t = t.split("--")[0].trim();

  t = t.replace(/^\d+[\s.-]*/, "");

  /* A trailing " - faded" or " - vine green" is the colourway again. Only
     dropped when it is demonstrably the colour, so " - long sleeve" survives. */
  const tail = t.match(/^(.*?)\s*[-–]\s*([^-–]{2,30})$/);
  if (tail && colourWord && tail[2].toLowerCase().includes(colourWord.toLowerCase())) {
    t = tail[1].trim();
  }

  /* Brands shout. The app does not. */
  if (t.length > 3 && t === t.toUpperCase()) {
    t = t.charAt(0) + t.slice(1).toLowerCase();
  }
  return t;
}

export type Rejection = { brand: string; reason: string };

export function classify(
  products: ShopifyProduct[],
  brand: BrandConfig,
): { pieces: Piece[]; rejected: Rejection[] } {
  const pieces: Piece[] = [];
  const rejected: Rejection[] = [];
  const reject = (reason: string) => rejected.push({ brand: brand.slug, reason });

  for (const p of products) {
    const title = p.title ?? "";
    const ptype = p.product_type ?? "";

    if (EXCLUDE.test(`${title} ${ptype}`) || isKids(p)) {
      reject("not a garment, or not for this shopper");
      continue;
    }
    if (COSTUME.test(`${title} ${ptype}`)) {
      reject("performance kit, not off duty");
      continue;
    }
    if (!(p.variants ?? []).some((v) => v.available)) {
      reject("nothing in stock");
      continue;
    }
    const image = (p.images ?? [])[0]?.src;
    if (!image) {
      reject("no photograph");
      continue;
    }
    /* Where a brand keeps a real garment noun in product_type, that noun is
       the answer and the title is only noise to fall back on — a title reads
       "Short-sleeve power tools t-shirt" and half the slot vocabulary is
       hiding in it. Dôen has no usable type, so it goes the other way. */
    const slot = brand.slotFrom === "product_type"
      ? (slotOf(ptype) ?? slotOf(title))
      : (slotOf(title) ?? slotOf(ptype));
    if (!slot) {
      reject("no slot could be read");
      continue;
    }
    const price = priceUsd(p, brand.currency);
    if (price === null) {
      reject("no price");
      continue;
    }
    const fam = colourFamily(colourTextOf(p, brand) ?? undefined);
    if (!fam) {
      reject("no colour could be read");
      continue;
    }

    const handle = p.handle ?? "";
    const title_ = displayTitle(p, brand, fam.word);
    pieces.push({
      brand: brand.slug,
      brandName: brand.name,
      aesthetic: brand.aesthetic,
      handle,
      title: title_,
      /* The brand's own noun, cleaned for the mono label and the alt text.
         Falls back to the slot when the type is a season rather than a
         garment, which is how Dôen files everything. */
      category:
        ptype.trim() &&
        !/^(spring|summer|fall|winter|holiday|core|\d)/i.test(ptype)
          ? garmentNoun(ptype, slot.toLowerCase())
          : slot.toLowerCase(),
      slot,
      price,
      colourWord: fam.word,
      colorName: fam.colorName,
      colorToken: fam.colorToken,
      colorHex: fam.colorHex,
      imageCandidates: (p.images ?? []).map((i) => i.src).filter((s): s is string => !!s),
      imageUrl: image,
      productUrl: `https://${brand.host}${brand.path}/products/${handle}`,
      style: styleKey(title_),
    });
  }

  return { pieces, rejected };
}

/** One piece per style — the cheapest colourway, since price sorts the feed. */
export function dedupeColourways(pieces: Piece[]): Piece[] {
  const byStyle = new Map<string, Piece>();
  for (const p of pieces) {
    const key = `${p.brand}::${p.style}`;
    const seen = byStyle.get(key);
    if (!seen || p.price < seen.price) byStyle.set(key, p);
  }
  return [...byStyle.values()];
}

/** Fetch one brand's whole catalogue, a page at a time. */
export async function fetchCatalogue(brand: BrandConfig, maxPages = 6) {
  const all: ShopifyProduct[] = [];
  for (let page = 1; page <= maxPages; page += 1) {
    const url = `https://${brand.host}${brand.path}/products.json?limit=250&page=${page}`;
    const res = await fetch(url, {
      headers: { "User-Agent": "the-edit catalogue builder (course project)" },
    });
    if (!res.ok) throw new Error(`${brand.slug}: ${res.status} on page ${page}`);
    const batch = ((await res.json()) as { products?: ShopifyProduct[] }).products ?? [];
    if (batch.length === 0) break;
    all.push(...batch);
    if (batch.length < 250) break;
    await new Promise((r) => setTimeout(r, 1500)); // be a good guest
  }
  return all;
}
