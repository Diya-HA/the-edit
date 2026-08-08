/* The client is passed in rather than imported, so this module has no runtime
   imports at all — only erased type imports. That is what lets the seed load
   it directly under node's type stripping, and it keeps the one write path
   usable from a server action, a script or an MCP tool without each of them
   inheriting a particular client. */
import type { PrismaClient } from "@prisma/client";

type Db = Pick<PrismaClient, "aesthetic" | "product" | "outfit" | "$transaction">;

/**
 * The write path for outfits.
 *
 * It lives under prisma/ rather than lib/ because the deploy template's
 * Dockerfile only copies .next/standalone, prisma/, node_modules/prisma and
 * node_modules/@prisma into the runtime image. The seed imports this at
 * container start, so anything it reaches has to sit inside one of those
 * four paths — from lib/ it was simply absent, and the container died.
 *
 * This exists so an agent, the seed and the app all reach the table the same
 * way. A non-interactive run scores garments with the aesthetic-fit skill and
 * calls this; nothing about it assumes a browser, a session or the UI.
 *
 * It is idempotent on `slug`, so a run that reassembles the same outfit
 * updates it instead of duplicating — which is what makes the job safe to
 * repeat on a schedule.
 */

export type OutfitItemInput = {
  /** Product handle. The product must already exist. */
  productSlug: string;
  /** Aesthetic-fit score out of 100, if the skill produced one. */
  score?: number | null;
  /** The piece's WHY line within this outfit. */
  note?: string | null;
};

export type OutfitInput = {
  /** Stable handle. Re-running with the same slug updates rather than adds. */
  slug: string;
  name: string;
  /** Which look this belongs to, by slug. */
  aestheticSlug: string;
  /** The skill's one-line reasoning, product voice. Under 20 words. */
  note?: string | null;
  source?: "SEED" | "AGENT" | "HUMAN";
  /** Two or more pieces, in the order they should read. */
  items: OutfitItemInput[];
};

export class OutfitInputError extends Error {}

/** Everything that would make the row wrong, checked before it is written. */
function validate(input: OutfitInput) {
  const fail = (m: string) => {
    throw new OutfitInputError(`${input.slug || "(no slug)"}: ${m}`);
  };

  if (!input.slug?.trim()) fail("slug is required");
  if (!/^[a-z0-9-]+$/.test(input.slug)) {
    fail("slug must be lowercase letters, digits and hyphens");
  }
  if (!input.name?.trim()) fail("name is required");
  if (!input.aestheticSlug?.trim()) fail("aestheticSlug is required");

  /* An outfit is pieces that work together, so one piece is not an outfit. */
  if (!input.items || input.items.length < 2) {
    fail("an outfit needs at least two pieces");
  }

  const slugs = input.items.map((i) => i.productSlug);
  if (new Set(slugs).size !== slugs.length) {
    fail("the same piece appears twice");
  }

  for (const item of input.items) {
    if (item.score != null && (item.score < 0 || item.score > 100)) {
      fail(`score ${item.score} is outside 0–100`);
    }
  }
}

export type UpsertResult = {
  id: string;
  slug: string;
  created: boolean;
  itemCount: number;
};

/**
 * Create or update one outfit. Throws OutfitInputError with a message naming
 * the outfit when the input is unusable, so a batch run can log and continue.
 */
export async function upsertOutfit(
  db: Db,
  input: OutfitInput,
): Promise<UpsertResult> {
  validate(input);

  const aesthetic = await db.aesthetic.findUnique({
    where: { slug: input.aestheticSlug },
    select: { id: true },
  });
  if (!aesthetic) {
    throw new OutfitInputError(
      `${input.slug}: no aesthetic "${input.aestheticSlug}"`,
    );
  }

  const products = await db.product.findMany({
    where: { slug: { in: input.items.map((i) => i.productSlug) } },
    select: { id: true, slug: true, aestheticId: true },
  });
  const bySlug = new Map(products.map((p) => [p.slug, p]));

  const missing = input.items
    .map((i) => i.productSlug)
    .filter((s) => !bySlug.has(s));
  if (missing.length) {
    throw new OutfitInputError(
      `${input.slug}: no such pieces — ${missing.join(", ")}`,
    );
  }

  /* An outfit is pieces from one aesthetic; a piece from elsewhere is a
     scoring mistake upstream and would quietly break the look. */
  const strays = products.filter((p) => p.aestheticId !== aesthetic.id);
  if (strays.length) {
    throw new OutfitInputError(
      `${input.slug}: ${strays.map((p) => p.slug).join(", ")} ` +
        `are not in ${input.aestheticSlug}`,
    );
  }

  const existing = await db.outfit.findUnique({
    where: { slug: input.slug },
    select: { id: true },
  });

  const data = {
    slug: input.slug,
    name: input.name.trim(),
    note: input.note?.trim() || null,
    source: input.source ?? "SEED",
    aestheticId: aesthetic.id,
  };

  /* Items are replaced wholesale rather than merged: a re-run represents the
     outfit as it now stands, not an addition to what it used to be. */
  const outfit = await db.$transaction(async (tx) => {
    const row = await tx.outfit.upsert({
      where: { slug: input.slug },
      update: data,
      create: data,
    });

    await tx.outfitItem.deleteMany({ where: { outfitId: row.id } });
    await tx.outfitItem.createMany({
      data: input.items.map((item, i) => ({
        outfitId: row.id,
        productId: bySlug.get(item.productSlug)!.id,
        position: i,
        score: item.score ?? null,
        note: item.note?.trim() || null,
      })),
    });

    return row;
  });

  return {
    id: outfit.id,
    slug: outfit.slug,
    created: !existing,
    itemCount: input.items.length,
  };
}

/** Write a batch, reporting per-outfit rather than failing the whole run. */
export async function upsertOutfits(db: Db, inputs: OutfitInput[]) {
  const written: UpsertResult[] = [];
  const failed: { slug: string; error: string }[] = [];

  for (const input of inputs) {
    try {
      written.push(await upsertOutfit(db, input));
    } catch (e) {
      if (e instanceof OutfitInputError) {
        failed.push({ slug: input.slug, error: e.message });
      } else {
        throw e;
      }
    }
  }

  return { written, failed };
}
