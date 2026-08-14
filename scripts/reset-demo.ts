/**
 * Put a database back to the clean "before" state after a demo run.
 *
 *   node --experimental-strip-types scripts/reset-demo.ts              # dry run
 *   node --experimental-strip-types scripts/reset-demo.ts --confirm    # do it
 *
 * Locally you would just run `npx prisma migrate reset --force`, which drops
 * everything and reseeds. You cannot do that to production: it would take the
 * site down while it rebuilt, and the platform's database is not yours to drop.
 * Restarting the container does not help either — the seed is all upserts, and
 * it deliberately leaves anything an agent wrote alone, so the demo's outfit
 * survives a restart. That is correct behaviour and it is exactly why this
 * exists.
 *
 * So this removes precisely what a run introduces and nothing else:
 *
 *   - outfits whose source is AGENT
 *   - products whose source is AGENT
 *
 * Pieces the seed planted are never touched, including ones a run updated with
 * today's price — provenance is stamped when a piece is created and never
 * rewritten, so "what the run added" stays a truthful question.
 *
 * Point it at a database with DATABASE_URL. For production that is the value
 * from the Azure portal; take it from the Container App's environment, run
 * this, and then forget it — do not put it in .env, where the next local
 * command would pick it up.
 */
import { PrismaClient } from "@prisma/client";

const confirm = process.argv.includes("--confirm");
const url = process.env.DATABASE_URL ?? "";

if (!url) throw new Error("DATABASE_URL is not set.");

/* Say out loud which database is about to be changed. Getting this wrong is
   the whole risk, and the host is the part that tells you. */
const host = (() => {
  try {
    return new URL(url).host;
  } catch {
    return "(unparseable)";
  }
})();
const looksLocal = /^(localhost|127\.0\.0\.1)/.test(host);

const prisma = new PrismaClient();

const [outfits, products, seededOutfits, seededProducts] = await Promise.all([
  prisma.outfit.findMany({
    where: { source: "AGENT" },
    select: { slug: true, name: true },
    orderBy: { slug: "asc" },
  }),
  prisma.product.findMany({
    where: { source: "AGENT" },
    select: { slug: true, title: true },
    orderBy: { slug: "asc" },
  }),
  prisma.outfit.count({ where: { source: { not: "AGENT" } } }),
  prisma.product.count({ where: { source: { not: "AGENT" } } }),
]);

console.log(`database   ${host}${looksLocal ? "  (local)" : "  ← NOT local"}`);
console.log(`seeded     ${seededProducts} pieces, ${seededOutfits} outfits — untouched`);
console.log(`to remove  ${products.length} pieces, ${outfits.length} outfits\n`);

for (const o of outfits) console.log(`  outfit   ${o.slug}  ${o.name}`);
for (const p of products) console.log(`  piece    ${p.slug}`);

if (outfits.length === 0 && products.length === 0) {
  console.log("\nNothing a run added. Already in the before state.");
  await prisma.$disconnect();
  process.exit(0);
}

if (!confirm) {
  console.log("\nDry run. Nothing changed. Add --confirm to remove the above.");
  await prisma.$disconnect();
  process.exit(0);
}

/* Deleting a product cascades its outfit items and its saves, so the outfits
   go first and explicitly — otherwise a look would quietly lose a piece and
   survive as a shorter, wrong outfit. */
const removedOutfits = await prisma.outfit.deleteMany({ where: { source: "AGENT" } });
const removedProducts = await prisma.product.deleteMany({ where: { source: "AGENT" } });

const [nowOutfits, nowProducts] = await Promise.all([
  prisma.outfit.count(),
  prisma.product.count(),
]);

console.log(
  `\nremoved    ${removedProducts.count} pieces, ${removedOutfits.count} outfits` +
    `\nnow        ${nowProducts} pieces, ${nowOutfits} outfits`,
);

await prisma.$disconnect();
