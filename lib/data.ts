import { prisma } from "./prisma";

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
  /** The tone of the cloth. Fills the placeholder. */
  tone: string;
  /** Palette family this groups into, for the filter row. */
  family: string;
  familyName: string;
  line: string | null;
  why: string | null;
  saved: boolean;
};

export type AestheticView = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
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
    family: `var(${p.colorToken})`,
    familyName: p.colorName,
    line: p.line,
    why: p.why,
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

export async function getAesthetics(): Promise<AestheticView[]> {
  return prisma.aesthetic.findMany({
    orderBy: { name: "asc" },
    select: { id: true, slug: true, name: true, description: true },
  });
}

/**
 * The palette filter row. Derived from the catalogue rather than hardcoded,
 * so it only ever offers colours that will return something.
 */
export async function getPalette(): Promise<PaletteEntry[]> {
  const rows = await prisma.product.findMany({
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
}): Promise<ProductView[]> {
  const { userId, aestheticId, colorTokens = [] } = opts;

  const [rows, savedIds] = await Promise.all([
    prisma.product.findMany({
      where: {
        aestheticId,
        inStock: true,
        ...(colorTokens.length ? { colorToken: { in: colorTokens } } : {}),
      },
      orderBy: [{ wasPrice: { sort: "desc", nulls: "last" } }, { title: "asc" }],
      select: productSelect,
    }),
    getSavedProductIds(userId),
  ]);

  return rows.map((r) => toView(r as ProductRow, savedIds));
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
      orderBy: { title: "asc" },
      take,
      select: productSelect,
    }),
    getSavedProductIds(userId),
  ]);

  return rows.map((r) => toView(r as ProductRow, savedIds));
}

export type LookRow = AestheticView & {
  count: number;
  /** Tones of the first few pieces, for the little stacked swatches. */
  tones: string[];
};

/** The Looks tab: every look with a count and a colour sample. */
export async function getLooks(): Promise<LookRow[]> {
  const rows = await prisma.aesthetic.findMany({
    orderBy: { name: "asc" },
    include: {
      products: {
        where: { inStock: true },
        orderBy: { title: "asc" },
        select: { colorHex: true },
      },
    },
  });

  return rows.map((a) => ({
    id: a.id,
    slug: a.slug,
    name: a.name,
    description: a.description,
    count: a.products.length,
    tones: a.products.slice(0, 3).map((p) => p.colorHex.trim()),
  }));
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
        select: { productId: true, product: { select: { colorHex: true } } },
      },
    },
  });

  return rows.map((e) => ({
    id: e.id,
    name: e.name,
    note: e.note,
    count: e.items.length,
    tones: e.items.slice(0, 3).map((i) => i.product.colorHex.trim()),
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
    },
    items,
  };
}

/**
 * The feed reads as blocks: one hero piece, then a pair beside it. Matches
 * the block rhythm in the reference screens.
 */
export type FeedBlock = { hero: ProductView; pair: ProductView[] };

export function toBlocks(products: ProductView[]): FeedBlock[] {
  const blocks: FeedBlock[] = [];
  for (let i = 0; i < products.length; i += 3) {
    blocks.push({ hero: products[i], pair: products.slice(i + 1, i + 3) });
  }
  return blocks;
}
