import { prisma } from "./prisma";

/* Prisma returns Decimal for money and Date for timestamps, neither of which
   crosses the server/client boundary. Everything here returns plain data. */

export type ProductView = {
  id: string;
  slug: string;
  brand: string;
  title: string;
  category: string;
  price: number;
  wasPrice: number | null;
  colorName: string;
  colorToken: string;
  /** Ready to drop straight into a component: `var(--tint-rose)`. */
  color: string;
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
    colorName: p.colorName,
    colorToken: p.colorToken,
    color: `var(${p.colorToken})`,
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
 * so it only ever offers colours that will actually return something.
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

/** The feed: pieces in one look, optionally narrowed to a set of tints. */
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

/** One piece, by its handle. Null when the slug matches nothing. */
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
 * "Wears well with" — other pieces from the same look. Cohesion across
 * brands is the product, so this deliberately does not filter to one brand.
 */
export async function getWearsWellWith(opts: {
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

export type EditView = {
  id: string;
  name: string;
  note: string | null;
  count: number;
  /** Tints of the first few pieces, for the painted cover. */
  colors: string[];
  /** Whether a particular piece is already in here. */
  holdsProduct?: boolean;
};

/** The user's edits, newest first, with cover colours and counts. */
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
        select: { productId: true, product: { select: { colorToken: true } } },
      },
    },
  });

  return rows.map((e) => ({
    id: e.id,
    name: e.name,
    note: e.note,
    count: e.items.length,
    colors: e.items.slice(0, 3).map((i) => `var(${i.product.colorToken})`),
    holdsProduct: productId
      ? e.items.some((i) => i.productId === productId)
      : undefined,
  }));
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
