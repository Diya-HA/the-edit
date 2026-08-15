import { prisma } from "./prisma";
import { neighboursOf } from "./aesthetics";
import { spaceByStyle } from "./feed";

/* Prisma returns Decimal for money and Date for timestamps, neither of which
   crosses the server/client boundary. Everything here returns plain data. */

export type ProductView = {
  id: string;
  slug: string;
  brand: string;
  title: string;
  /** Garment noun, shown uppercase on the placeholder. */
  category: string;
  price: number;
  wasPrice: number | null;
  /** The tone of the cloth. Fills the field behind the photograph, and
      stands in for it entirely when there is no photograph. */
  tone: string;
  /** The brand's own photograph, when the catalogue has one. */
  image: string | null;
  /**
   * The photograph's own background, measured at ingest. Painted behind
   * the picture so the field and the image meet without a seam — which is
   * what lets five brands shooting on five different whites read as one
   * edit. Null when unmeasured, and then the tone stands in as before.
   */
  ground: string | null;
  /** Palette family this groups into, for the filter row. */
  family: string;
  familyName: string;
  /** How packshot-like the photograph is. Used to describe it in alt text. */
  packshot: number | null;
  line: string | null;
  why: string | null;
  /** Where Buy goes — the brand's own page for this piece. */
  productUrl: string | null;
  saved: boolean;
};

export type AestheticView = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  starred?: boolean;
};

export type PaletteEntry = { name: string; token: string; color: string };

const productSelect = {
  id: true,
  slug: true,
  title: true,
  category: true,
  price: true,
  wasPrice: true,
  colorName: true,
  colorToken: true,
  colorHex: true,
  line: true,
  why: true,
  imageUrl: true,
  bgHex: true,
  packshotScore: true,
  productUrl: true,
  brand: { select: { name: true } },
} as const;

type ProductRow = {
  id: string;
  slug: string;
  title: string;
  category: string;
  price: unknown;
  wasPrice: unknown;
  colorName: string;
  colorToken: string;
  colorHex: string;
  line: string | null;
  why: string | null;
  imageUrl: string | null;
  bgHex: string | null;
  packshotScore: number | null;
  productUrl: string | null;
  brand: { name: string };
};

function toView(p: ProductRow, savedIds: Set<string>): ProductView {
  return {
    id: p.id,
    slug: p.slug,
    brand: p.brand.name,
    title: p.title,
    category: p.category,
    price: Number(p.price),
    wasPrice: p.wasPrice === null ? null : Number(p.wasPrice),
    tone: p.colorHex.trim(),
    image: p.imageUrl,
    ground: p.bgHex ? p.bgHex.trim() : null,
    family: `var(${p.colorToken})`,
    familyName: p.colorName,
    packshot: p.packshotScore,
    line: p.line,
    why: p.why,
    productUrl: p.productUrl,
    saved: savedIds.has(p.id),
  };
}

/** Every product the given user has saved into any of their edits. */
export async function getSavedProductIds(userId: string): Promise<Set<string>> {
  const rows = await prisma.savedItem.findMany({
    where: { edit: { userId } },
    select: { productId: true },
  });
  return new Set(rows.map((r) => r.productId));
}

/**
 * The looks, starred ones first — turn 3: "star one and it climbs the strip
 * so home leans that way". Alphabetical within each group so the order is
 * stable rather than shuffling under you.
 */
export async function getAesthetics(userId: string): Promise<AestheticView[]> {
  const rows = await prisma.aesthetic.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      slug: true,
      name: true,
      description: true,
      favourites: { where: { userId }, select: { userId: true } },
    },
  });

  return rows
    .map((a) => ({
      id: a.id,
      slug: a.slug,
      name: a.name,
      description: a.description,
      starred: a.favourites.length > 0,
    }))
    .sort((a, b) => Number(b.starred) - Number(a.starred));
}

/**
 * The palette filter row. Derived from the catalogue rather than hardcoded,
 * so it only ever offers colours that will return something.
 *
 * Scoped to one look when the feed is showing one, which is what makes that
 * promise true. Globally there is a piece in every family, but inside a look
 * there may not be: Quiet utility has no rose in it, and offering the swatch
 * anyway sends someone to an empty screen for no reason. Someone trying the
 * app for the first time taps every colour, so a dead end is not a rare path.
 *
 * Called without an aesthetic for the welcome, which asks about colour in
 * general rather than within a look.
 */
export async function getPalette(aestheticId?: string): Promise<PaletteEntry[]> {
  const rows = await prisma.product.findMany({
    where: { inStock: true, ...(aestheticId ? { aestheticId } : {}) },
    distinct: ["colorToken"],
    orderBy: { colorName: "asc" },
    select: { colorName: true, colorToken: true },
  });
  return rows.map((r) => ({
    name: r.colorName,
    token: r.colorToken,
    color: `var(${r.colorToken})`,
  }));
}

/** The feed: pieces in one look, optionally narrowed to a set of families. */
export async function getFeed(opts: {
  userId: string;
  aestheticId: string;
  colorTokens?: string[];
  /** What counts as a lot for one piece. Null is no ceiling. */
  priceCeiling?: number | null;
}): Promise<ProductView[]> {
  const { userId, aestheticId, colorTokens = [], priceCeiling = null } = opts;

  const [rows, savedIds] = await Promise.all([
    prisma.product.findMany({
      where: {
        aestheticId,
        inStock: true,
        ...(colorTokens.length ? { colorToken: { in: colorTokens } } : {}),
        ...(priceCeiling ? { price: { lte: priceCeiling } } : {}),
      },
      orderBy: [{ wasPrice: { sort: "desc", nulls: "last" } }, { title: "asc" }],
      select: productSelect,
    }),
    getSavedProductIds(userId),
  ]);

  /* Alphabetical order puts a brand's whole family of one thing together —
     five Sac polochon bags, four Demi-Pointes. Spread them out. */
  return spaceByStyle(rows.map((r) => toView(r as ProductRow, savedIds)));
}

export type BudgetReach = {
  /** Pieces in this look the shopper can actually see. */
  within: number;
  /** Pieces in this look altogether. */
  total: number;
  /** The ceiling this was measured against. */
  ceiling: number;
  /** The look with the most within reach, when there is a better one. */
  better?: { slug: string; name: string; within: number };
};

/**
 * How much of a look a ceiling leaves standing, and where there is more.
 *
 * Choosing an aesthetic currently chooses a price bracket — the median piece
 * in Whimsigoth is a fraction of the median piece in Soft romance — which the
 * onboarding flow implies is not the case. Rather than quietly showing a thin
 * feed, the app says so, in the numbers the catalogue actually holds.
 *
 * Returns null when nothing needs saying: no ceiling set, or the look is
 * mostly within it anyway.
 */
export async function getBudgetReach(opts: {
  aestheticId: string;
  aestheticSlug: string;
  priceCeiling: number | null;
}): Promise<BudgetReach | null> {
  const { aestheticId, aestheticSlug, priceCeiling } = opts;
  if (!priceCeiling) return null;

  const [within, total] = await Promise.all([
    prisma.product.count({
      where: { aestheticId, inStock: true, price: { lte: priceCeiling } },
    }),
    prisma.product.count({ where: { aestheticId, inStock: true } }),
  ]);

  /* Only worth saying when the ceiling is hiding most of the look. Below that
     the feed speaks for itself and a notice is just noise. */
  if (total === 0 || within / total > 0.5) return null;

  /* The nearest look that actually clears the ceiling, not the one with the
     most in it. Suggesting whichever aesthetic happens to be cheapest measures
     the catalogue rather than taste — see lib/aesthetics.ts. */
  const neighbours = neighboursOf(aestheticSlug);
  let better: BudgetReach["better"];

  if (neighbours.length > 0) {
    const rows = await prisma.aesthetic.findMany({
      where: { slug: { in: neighbours } },
      select: {
        slug: true,
        name: true,
        _count: {
          select: {
            products: { where: { inStock: true, price: { lte: priceCeiling } } },
          },
        },
      },
    });
    const bySlug = new Map(rows.map((r) => [r.slug, r]));

    for (const slug of neighbours) {
      const row = bySlug.get(slug);
      if (!row) continue;
      /* "Clears the ceiling" means comfortably more to look at, not one piece
         more — walking someone sideways for a marginal gain is not a nudge. */
      if (row._count.products >= within * 2 && row._count.products >= 8) {
        better = { slug: row.slug, name: row.name, within: row._count.products };
        break;
      }
    }
  }

  return { within, total, ceiling: priceCeiling, better };
}

/** One piece, by its handle. */
export async function getProduct(
  slug: string,
  userId: string,
): Promise<
  (ProductView & { aestheticId: string; aestheticName: string }) | null
> {
  const row = await prisma.product.findUnique({
    where: { slug },
    select: {
      ...productSelect,
      aestheticId: true,
      aesthetic: { select: { name: true } },
    },
  });
  if (!row) return null;

  const savedIds = await getSavedProductIds(userId);
  return {
    ...toView(row as ProductRow, savedIds),
    aestheticId: row.aestheticId,
    aestheticName: row.aesthetic.name,
  };
}

/**
 * "Sits well with" — other pieces from the same look. Cohesion across brands
 * is the product, so this deliberately does not filter to one brand.
 */
export async function getSitsWellWith(opts: {
  userId: string;
  aestheticId: string;
  excludeId: string;
  take?: number;
}): Promise<ProductView[]> {
  const { userId, aestheticId, excludeId, take = 4 } = opts;

  const [rows, savedIds] = await Promise.all([
    prisma.product.findMany({
      where: { aestheticId, inStock: true, id: { not: excludeId } },
      orderBy: { title: "asc" },
      take,
      select: productSelect,
    }),
    getSavedProductIds(userId),
  ]);

  return rows.map((r) => toView(r as ProductRow, savedIds));
}

/** Everything in the catalogue, for the Pieces tab of search. */
export async function searchPieces(opts: {
  userId: string;
  query?: string;
  take?: number;
}): Promise<ProductView[]> {
  const { userId, query, take = 20 } = opts;
  const q = query?.trim();

  const [rows, savedIds] = await Promise.all([
    prisma.product.findMany({
      where: {
        inStock: true,
        ...(q
          ? {
              OR: [
                { title: { contains: q, mode: "insensitive" as const } },
                { category: { contains: q, mode: "insensitive" as const } },
                { brand: { name: { contains: q, mode: "insensitive" as const } } },
                { aesthetic: { name: { contains: q, mode: "insensitive" as const } } },
              ],
            }
          : {}),
      },
      /* Packshots first. Searching across everything is one of only two
          places the app puts four aesthetics side by side — cohesion is
          per-aesthetic everywhere else — so this is where a calm picture
          earns its place. Title breaks the tie, as before. */
      orderBy: [
        { packshotScore: { sort: "desc", nulls: "last" } },
        { title: "asc" },
      ],
      take,
      select: productSelect,
    }),
    getSavedProductIds(userId),
  ]);

  return rows.map((r) => toView(r as ProductRow, savedIds));
}

export type DeckPiece = { id: string; title: string; tone: string };

export type LookRow = AestheticView & {
  starred: boolean;
  count: number;
  /** Tones of the first few pieces, for the little stacked swatches. */
  tones: string[];
  /** The four pieces the deck shows for this look. */
  pieces: DeckPiece[];
};

/**
 * The deck: every look with its count, a colour sample, and the handful of
 * pieces shown on the card. Starred looks come first, as on the home strip.
 */
export async function getLooks(userId: string): Promise<LookRow[]> {
  const rows = await prisma.aesthetic.findMany({
    orderBy: { name: "asc" },
    include: {
      favourites: { where: { userId }, select: { userId: true } },
      products: {
        where: { inStock: true },
        orderBy: { title: "asc" },
        select: { id: true, title: true, colorHex: true },
      },
    },
  });

  return rows
    .map((a) => ({
      id: a.id,
      slug: a.slug,
      name: a.name,
      description: a.description,
      starred: a.favourites.length > 0,
      count: a.products.length,
      tones: a.products.slice(0, 3).map((p) => p.colorHex.trim()),
      pieces: a.products.slice(0, 4).map((p) => ({
        id: p.id,
        title: p.title,
        tone: p.colorHex.trim(),
      })),
    }))
    .sort((a, b) => Number(b.starred) - Number(a.starred));
}

/** Pieces inside one look, for the opened-look view. */
export async function getLookItems(
  aestheticId: string,
  userId: string,
): Promise<ProductView[]> {
  const [rows, savedIds] = await Promise.all([
    prisma.product.findMany({
      where: { aestheticId, inStock: true },
      orderBy: { title: "asc" },
      select: productSelect,
    }),
    getSavedProductIds(userId),
  ]);
  return rows.map((r) => toView(r as ProductRow, savedIds));
}

export type BrandRowView = {
  id: string;
  slug: string;
  name: string;
  meta: string | null;
  color: string;
  following: boolean;
};

/** The shelf: every label, with whether you follow it. */
export async function getBrands(userId: string): Promise<BrandRowView[]> {
  const rows = await prisma.brand.findMany({
    orderBy: { name: "asc" },
    include: { followers: { where: { userId }, select: { userId: true } } },
  });

  return rows.map((b) => ({
    id: b.id,
    slug: b.slug,
    name: b.name,
    meta: b.meta,
    color: `var(${b.colorToken})`,
    following: b.followers.length > 0,
  }));
}

/**
 * Price drops from labels you follow. Following is the whole point of the
 * shelf, so an empty follow list means an empty drops list — not everything.
 */
export async function getDrops(userId: string): Promise<ProductView[]> {
  const [rows, savedIds] = await Promise.all([
    prisma.product.findMany({
      where: {
        inStock: true,
        wasPrice: { not: null },
        brand: { followers: { some: { userId } } },
      },
      orderBy: { title: "asc" },
      select: productSelect,
    }),
    getSavedProductIds(userId),
  ]);

  return rows.map((r) => toView(r as ProductRow, savedIds));
}

export type EditView = {
  id: string;
  name: string;
  note: string | null;
  count: number;
  /** Tones of the first three pieces, for the board cover. */
  tones: string[];
  /** Their photographs, where they have one — same order as tones. */
  covers: (string | null)[];
  /** Each photograph's measured background, same order again. */
  grounds: (string | null)[];
  holdsProduct?: boolean;
};

/** The user's edits, with cover tones and counts. */
export async function getEdits(
  userId: string,
  productId?: string,
): Promise<EditView[]> {
  const rows = await prisma.edit.findMany({
    where: { userId },
    orderBy: { createdAt: "asc" },
    include: {
      items: {
        orderBy: { addedAt: "asc" },
        select: {
          productId: true,
          product: { select: { colorHex: true, imageUrl: true, bgHex: true } },
        },
      },
    },
  });

  return rows.map((e) => ({
    id: e.id,
    name: e.name,
    note: e.note,
    count: e.items.length,
    tones: e.items.slice(0, 4).map((i) => i.product.colorHex.trim()),
    covers: e.items.slice(0, 4).map((i) => i.product.imageUrl),
    grounds: e.items.slice(0, 4).map((i) => i.product.bgHex?.trim() ?? null),
    holdsProduct: productId
      ? e.items.some((i) => i.productId === productId)
      : undefined,
  }));
}

/** One board and everything in it. */
export async function getEdit(
  editId: string,
  userId: string,
): Promise<{ edit: EditView; items: ProductView[] } | null> {
  const row = await prisma.edit.findFirst({
    where: { id: editId, userId },
    include: {
      items: {
        orderBy: { addedAt: "desc" },
        include: { product: { select: productSelect } },
      },
    },
  });
  if (!row) return null;

  const savedIds = await getSavedProductIds(userId);
  const items = row.items.map((i) => toView(i.product as ProductRow, savedIds));

  return {
    edit: {
      id: row.id,
      name: row.name,
      note: row.note,
      count: items.length,
      tones: items.slice(0, 3).map((p) => p.tone),
      covers: items.slice(0, 3).map((p) => p.image),
      grounds: items.slice(0, 3).map((p) => p.ground),
    },
    items,
  };
}

export type OutfitView = {
  id: string;
  slug: string;
  name: string;
  note: string | null;
  aestheticName: string;
  aestheticSlug: string;
  /** True when an agent assembled it rather than the seed. */
  fromAgent: boolean;
  pieces: ProductView[];
};

/** Assembled outfits, newest first, optionally narrowed to one look. */
export async function getOutfits(opts: {
  userId: string;
  aestheticSlug?: string;
}): Promise<OutfitView[]> {
  const { userId, aestheticSlug } = opts;

  const [rows, savedIds] = await Promise.all([
    prisma.outfit.findMany({
      where: aestheticSlug ? { aesthetic: { slug: aestheticSlug } } : {},
      orderBy: [{ createdAt: "desc" }, { name: "asc" }],
      include: {
        aesthetic: { select: { name: true, slug: true } },
        items: {
          orderBy: { position: "asc" },
          include: { product: { select: productSelect } },
        },
      },
    }),
    getSavedProductIds(userId),
  ]);

  return rows.map((o) => ({
    id: o.id,
    slug: o.slug,
    name: o.name,
    note: o.note,
    aestheticName: o.aesthetic.name,
    aestheticSlug: o.aesthetic.slug,
    fromAgent: o.source === "AGENT",
    pieces: o.items.map((i) => toView(i.product as ProductRow, savedIds)),
  }));
}

/**
 * The trending row. Seeded demo data — with a single shopper there is no real
 * popularity signal, so the app labels it as a sample rather than dressing a
 * made-up number as a measurement.
 */
export async function getTrending(userId: string): Promise<ProductView[]> {
  const [rows, savedIds] = await Promise.all([
    prisma.product.findMany({
      where: { inStock: true, trendingRank: { not: null } },
      orderBy: { trendingRank: "asc" },
      take: 12,
      select: productSelect,
    }),
    getSavedProductIds(userId),
  ]);
  return rows.map((r) => toView(r as ProductRow, savedIds));
}

export type BrandCard = BrandRowView & {
  /** Looks this label actually stocks. */
  aesthetics: string[];
  priceFrom: number;
  priceTo: number;
  pieceCount: number;
  /** Tones from its pieces, for the card. */
  tones: string[];
  newestAt: string;
};

/** Brand discovery: every label with what it stocks and what it costs. */
export async function getBrandCards(userId: string): Promise<BrandCard[]> {
  const rows = await prisma.brand.findMany({
    orderBy: { name: "asc" },
    include: {
      followers: { where: { userId }, select: { userId: true } },
      products: {
        where: { inStock: true },
        orderBy: { createdAt: "desc" },
        select: {
          price: true,
          colorHex: true,
          createdAt: true,
          aesthetic: { select: { name: true } },
        },
      },
    },
  });

  return rows.map((b) => {
    const prices = b.products.map((p) => Number(p.price));
    return {
      id: b.id,
      slug: b.slug,
      name: b.name,
      meta: b.meta,
      color: `var(${b.colorToken})`,
      following: b.followers.length > 0,
      aesthetics: [...new Set(b.products.map((p) => p.aesthetic.name))].sort(),
      priceFrom: prices.length ? Math.min(...prices) : 0,
      priceTo: prices.length ? Math.max(...prices) : 0,
      pieceCount: b.products.length,
      tones: b.products.slice(0, 4).map((p) => p.colorHex.trim()),
      newestAt: (b.products[0]?.createdAt ?? new Date(0)).toISOString(),
    };
  });
}
