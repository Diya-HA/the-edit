/**
 * Backfill and re-measure product photography.
 *
 *   node --experimental-strip-types scripts/measure-photography.ts
 *   node --experimental-strip-types scripts/measure-photography.ts --all
 *   node --experimental-strip-types scripts/measure-photography.ts --stale 30
 *
 * By default it measures only what has never been measured. `--all` re-measures
 * everything; `--stale N` re-measures anything older than N days, which is the
 * one to reach for when a brand has changed how it shoots.
 *
 * This is maintenance, not part of any run that matters. The catalogue is
 * measured as it is built, and pieces the agent writes are measured by the MCP
 * server as they arrive, so neither the seed nor the demo depends on this
 * having been run. It exists for rows that predate the measurement, and for
 * when a storefront reshoots its range.
 *
 * It writes to the database, and also back into prisma/catalogue.json for any
 * piece that lives there, so a rebuilt container starts with what was learned
 * rather than measuring again from nothing.
 */
import { PrismaClient } from "@prisma/client";
import { readFileSync, writeFileSync } from "node:fs";
import { measureImage } from "../lib/measure.ts";

const prisma = new PrismaClient();
const CATALOGUE = new URL("../prisma/catalogue.json", import.meta.url);

const args = process.argv.slice(2);
const all = args.includes("--all");
const staleAt = args.indexOf("--stale");
const staleDays = staleAt >= 0 ? Number(args[staleAt + 1]) : null;

if (staleAt >= 0 && (!Number.isFinite(staleDays) || staleDays! <= 0)) {
  throw new Error("--stale takes a number of days, e.g. --stale 30");
}

const where = all
  ? { imageUrl: { not: null } }
  : staleDays
    ? {
        imageUrl: { not: null },
        OR: [
          { imageMeasuredAt: null },
          {
            imageMeasuredAt: {
              lt: new Date(Date.now() - staleDays * 24 * 60 * 60 * 1000),
            },
          },
        ],
      }
    : { imageUrl: { not: null }, imageMeasuredAt: null };

const rows = await prisma.product.findMany({
  where,
  select: { id: true, slug: true, imageUrl: true, imageMeasuredAt: true },
  orderBy: { slug: "asc" },
});

console.log(
  `${rows.length} to measure` +
    (all ? " (--all)" : staleDays ? ` (never measured, or older than ${staleDays} days)` : " (never measured)"),
);
if (rows.length === 0) {
  await prisma.$disconnect();
  process.exit(0);
}

const measured = new Map<string, { bgHex: string; packshotScore: number }>();
let failed = 0;

for (const [i, r] of rows.entries()) {
  const m = await measureImage(r.imageUrl!);
  if (!m) {
    failed += 1;
    console.log(`  ${String(i + 1).padStart(4)}  —    unreadable  ${r.slug}`);
    continue;
  }
  await prisma.product.update({
    where: { id: r.id },
    data: {
      bgHex: m.bgHex,
      packshotScore: m.packshotScore,
      imageMeasuredAt: new Date(),
    },
  });
  measured.set(r.slug, m);
  console.log(
    `  ${String(i + 1).padStart(4)}  ${String(m.packshotScore).padStart(3)}  ${m.bgHex}  ${r.slug}`,
  );
}

/* Write what was learned back into the seed's source, so a fresh container
   does not have to discover it again — and cannot start out disagreeing with
   the database it is seeding. Only pieces the catalogue already knows about
   are touched; anything the agent wrote lives in the database alone. */
let synced = 0;
try {
  const cat = JSON.parse(readFileSync(CATALOGUE, "utf8")) as {
    products: {
      slug: string;
      bgHex: string | null;
      packshotScore: number | null;
      imageMeasuredAt: string | null;
    }[];
  };
  const now = new Date().toISOString();
  for (const p of cat.products) {
    const m = measured.get(p.slug);
    if (!m) continue;
    p.bgHex = m.bgHex;
    p.packshotScore = m.packshotScore;
    p.imageMeasuredAt = now;
    synced += 1;
  }
  writeFileSync(CATALOGUE, JSON.stringify(cat, null, 2));
} catch (e) {
  console.error(`could not sync prisma/catalogue.json: ${(e as Error).message}`);
}

console.log(
  `\n${measured.size} measured, ${failed} unreadable, ${synced} written back to prisma/catalogue.json`,
);
await prisma.$disconnect();
