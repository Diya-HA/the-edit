/**
 * Make the awkward content, so it can be looked at.
 *
 *   node --experimental-strip-types scripts/edge-content.ts
 *   npx prisma migrate reset --force        # to undo
 *
 * Layouts break on the content nobody thought about: the twelve-word title,
 * the brand with an ampersand in it, the four-figure price, the board with
 * sixty things in it and the board with one. Those cases exist in any real
 * catalogue and in none of the pleasant ones you build a demo from, so this
 * puts them into the local database on purpose and leaves them there to be
 * screenshotted.
 *
 * Nothing here touches production, and everything it does is undone by a
 * reseed. It is a test fixture that happens to live in the database, which is
 * the only place these particular problems can be seen.
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const say = (label: string, detail: string) =>
  console.log(`  ${label.padEnd(24)} ${detail}`);

/* --- a title nobody designed for ----------------------------------------- */

const LONG_TITLE =
  "Reversible quilted liner jacket with detachable corduroy collar and storm cuffs";

const first = await prisma.product.findFirst({
  where: { slot: "OUTER", inStock: true },
  orderBy: { slug: "asc" },
});
if (first) {
  await prisma.product.update({
    where: { id: first.id },
    data: { title: LONG_TITLE },
  });
  say("twelve-word title", `${first.slug}`);
}

/* --- an ampersand, and a four-figure price -------------------------------- */

const dear = await prisma.product.findFirst({
  where: { inStock: true, slug: { not: first?.slug ?? "" } },
  orderBy: { price: "desc" },
});
if (dear) {
  await prisma.product.update({
    where: { id: dear.id },
    data: { price: 1240, wasPrice: 1680 },
  });
  say("price over $1,000", `${dear.slug} → $1,240 from $1,680`);
}

/* A real brand renamed for the duration — the question is whether an "&"
   survives the card, the shelf and the alt text, not who sells it. */
const brand = await prisma.brand.findFirst({ where: { slug: "nagnata" } });
if (brand) {
  await prisma.brand.update({
    where: { id: brand.id },
    data: { name: "Nagnata & Sons" },
  });
  say("ampersand in a brand", `${brand.slug} → "Nagnata & Sons"`);
}

/* --- a board with sixty things, and a board with one ---------------------- */

const user = await prisma.user.findFirst();
if (user) {
  const all = await prisma.product.findMany({
    where: { inStock: true },
    take: 60,
    orderBy: { slug: "asc" },
    select: { id: true },
  });

  const big = await prisma.edit.upsert({
    where: { userId_name: { userId: user.id, name: "Everything" } },
    update: {},
    create: { userId: user.id, name: "Everything", note: "No discipline at all" },
  });
  await prisma.savedItem.createMany({
    data: all.map((p) => ({ editId: big.id, productId: p.id })),
    skipDuplicates: true,
  });
  say("board with sixty", `"Everything" — ${all.length} pieces`);

  const lonely = await prisma.edit.upsert({
    where: { userId_name: { userId: user.id, name: "Just the one" } },
    update: {},
    create: { userId: user.id, name: "Just the one", note: "Started strong" },
  });
  await prisma.savedItem.createMany({
    data: all.slice(0, 1).map((p) => ({ editId: lonely.id, productId: p.id })),
    skipDuplicates: true,
  });
  say("board with one", `"Just the one" — 1 piece`);
}

/* --- an aesthetic down to three pieces ------------------------------------ */

/* Sold out rather than deleted, which is what actually happens to a look at
   the end of a season and keeps the pieces around to come back. */
const thin = await prisma.aesthetic.findUnique({
  where: { slug: "quiet-utility" },
  include: { products: { orderBy: { slug: "asc" }, select: { id: true } } },
});
if (thin) {
  const keep = thin.products.slice(0, 3).map((p) => p.id);
  const { count } = await prisma.product.updateMany({
    where: { aestheticId: thin.id, id: { notIn: keep } },
    data: { inStock: false },
  });
  say("aesthetic with three", `quiet-utility — ${count} pieces marked sold out`);
}

console.log("\nUndo with: npx prisma migrate reset --force");
await prisma.$disconnect();
