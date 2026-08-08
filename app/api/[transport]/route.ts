import { createMcpHandler } from "mcp-handler";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { measureImage } from "@/lib/measure";
import { OutfitInputError, upsertOutfit } from "@/prisma/outfits";

/**
 * The Edit as an MCP server.
 *
 * The other door into the same catalogue. The scraping pipeline reaches the
 * database through prisma/outfits.ts from a script; this exposes the same two
 * operations — find pieces, assemble them — to any MCP client, so a run that
 * lives outside this repo can curate without shelling into it.
 *
 * It deliberately shares the app's Prisma client and the same write path, so
 * validation cannot drift between the two entrances.
 */

/* Reads the database on every request; nothing here can be prerendered. */
export const dynamic = "force-dynamic";
/* Assembling an outfit does a few round trips inside one transaction. */
export const maxDuration = 60;

/* Writes are guarded. The deployed endpoint is on the public internet, so
   without this anyone could POST an outfit into the production catalogue.
   Set MCP_WRITE_TOKEN and every request must carry it; leave it unset and
   production refuses writes while still answering reads. Locally, where
   NODE_ENV is not production, writes are open so development stays simple. */
const WRITE_TOKEN = process.env.MCP_WRITE_TOKEN;
const IS_PROD = process.env.NODE_ENV === "production";

const ok = (payload: unknown) => ({
  content: [{ type: "text" as const, text: JSON.stringify({ ok: true, ...(payload as object) }, null, 2) }],
});

const fail = (error: string) => ({
  isError: true,
  content: [{ type: "text" as const, text: JSON.stringify({ ok: false, error }, null, 2) }],
});

/** Non-null when the caller may not write, with the reason. */
function writeDenied() {
  if (WRITE_TOKEN) return null; // the request already proved itself, see below
  if (IS_PROD) {
    return fail(
      "writes are disabled: MCP_WRITE_TOKEN is not set on this deployment",
    );
  }
  return null;
}

const handler = createMcpHandler(
  (server) => {
    server.registerTool(
      "search_products",
      {
        title: "Search products",
        description:
          "Find garments in The Edit's catalogue. Filter by free text, by " +
          "aesthetic slug (soft-romance, quiet-utility, balletcore-off-duty, " +
          "whimsigoth), by brand, or by price. Returns the slug each piece is " +
          "known by, which is what create_outfit takes.",
        inputSchema: z.object({
          query: z
            .string()
            .optional()
            .describe("Free text matched against title, category and brand"),
          aesthetic: z
            .string()
            .optional()
            .describe("Aesthetic slug, e.g. quiet-utility"),
          brand: z.string().optional().describe("Brand slug, e.g. uskees"),
          maxPrice: z.number().positive().optional(),
          limit: z.number().int().min(1).max(50).default(20),
        }),
      },
      async ({ query, aesthetic, brand, maxPrice, limit }) => {
        const q = query?.trim();
        const rows = await prisma.product.findMany({
          where: {
            inStock: true,
            ...(aesthetic ? { aesthetic: { slug: aesthetic } } : {}),
            ...(brand ? { brand: { slug: brand } } : {}),
            ...(maxPrice ? { price: { lte: maxPrice } } : {}),
            ...(q
              ? {
                  OR: [
                    { title: { contains: q, mode: "insensitive" as const } },
                    { category: { contains: q, mode: "insensitive" as const } },
                    {
                      brand: {
                        name: { contains: q, mode: "insensitive" as const },
                      },
                    },
                  ],
                }
              : {}),
          },
          orderBy: { title: "asc" },
          take: limit,
          select: {
            slug: true,
            title: true,
            category: true,
            price: true,
            colorName: true,
            colorHex: true,
            brand: { select: { name: true } },
            aesthetic: { select: { slug: true } },
          },
        });

        const found = rows.map((p) => ({
          slug: p.slug,
          brand: p.brand.name,
          title: p.title,
          category: p.category,
          /* Decimal does not survive JSON; the client wants a number. */
          price: Number(p.price),
          colour: p.colorName,
          colourHex: p.colorHex.trim(),
          aesthetic: p.aesthetic.slug,
        }));

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({ count: found.length, products: found }, null, 2),
            },
          ],
        };
      },
    );

    server.registerTool(
      "upsert_products",
      {
        title: "Add or update products",
        description:
          "Put scraped garments into the catalogue. Idempotent on slug, so a " +
          "repeated run updates rather than duplicating. Every piece needs a " +
          "brand and an aesthetic that already exist. Returns the slugs, which " +
          "create_outfit then takes.",
        inputSchema: z.object({
          brandSlug: z.string().min(1),
          brandName: z.string().min(1),
          brandMeta: z.string().optional(),
          aestheticSlug: z.string().min(1),
          products: z
            .array(
              z.object({
                slug: z.string().regex(/^[a-z0-9-]+$/),
                title: z.string().min(1),
                category: z.string().min(1).describe("Garment noun, e.g. overshirt"),
                slot: z
                  .enum(["TOP", "BOTTOM", "OUTER", "SHOES", "BAG", "ACCESSORY"])
                  .describe("Where it sits in a head-to-toe look"),
                price: z.number().nonnegative(),
                colorName: z.string().min(1).describe("Palette family, e.g. Sage"),
                colorToken: z.string().min(1).describe("e.g. --fabric-sage"),
                colorHex: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
                line: z.string().optional(),
                why: z.string().optional().describe("The skill's WHY line"),
                imageUrl: z.string().optional(),
                bgHex: z
                  .string()
                  .regex(/^#[0-9A-Fa-f]{6}$/)
                  .optional()
                  .describe(
                    "The photograph's own background colour. Measured here from imageUrl when omitted.",
                  ),
                packshotScore: z
                  .number()
                  .min(0)
                  .max(100)
                  .optional()
                  .describe(
                    "How packshot-like the photograph is, 0-100. Measured here from imageUrl when omitted.",
                  ),
                productUrl: z.string().optional(),
              }),
            )
            .min(1),
        }),
      },
      async (input) => {
        const denied = writeDenied();
        if (denied) return denied;

        const aesthetic = await prisma.aesthetic.findUnique({
          where: { slug: input.aestheticSlug },
          select: { id: true },
        });
        if (!aesthetic) {
          return fail(`no aesthetic "${input.aestheticSlug}"`);
        }

        const brand = await prisma.brand.upsert({
          where: { slug: input.brandSlug },
          update: { name: input.brandName, meta: input.brandMeta ?? undefined },
          create: {
            slug: input.brandSlug,
            name: input.brandName,
            meta: input.brandMeta ?? null,
            colorToken: input.products[0]?.colorToken ?? "--fabric-neutral",
          },
        });

        const written: string[] = [];
        for (const p of input.products) {
          /* Photography measurement travels with the piece rather than being
             backfilled afterwards. The agent that writes here scrapes image
             URLs, not pixels, so it usually cannot supply these — and a piece
             written mid-demo with no measurement would render on its tint
             while everything around it sits on a matched ground, which is a
             visible seam in the one moment that matters. Measuring here costs
             one small request per piece and needs no second command.
             It is allowed to fail: null falls back to the tint. */
          let bgHex = p.bgHex ?? null;
          let packshotScore = p.packshotScore ?? null;
          if (p.imageUrl && (bgHex === null || packshotScore === null)) {
            const m = await measureImage(p.imageUrl);
            if (m) {
              bgHex = bgHex ?? m.bgHex;
              packshotScore = packshotScore ?? m.packshotScore;
            }
          }

          const data = {
            slug: p.slug,
            title: p.title,
            category: p.category,
            slot: p.slot,
            price: p.price,
            colorName: p.colorName,
            colorToken: p.colorToken,
            colorHex: p.colorHex,
            line: p.line ?? null,
            why: p.why ?? null,
            imageUrl: p.imageUrl ?? null,
            bgHex,
            packshotScore,
            imageMeasuredAt: bgHex === null ? null : new Date(),
            productUrl: p.productUrl ?? null,
            inStock: true,
            /* Written by a run, not planted by the seed. This is what keeps a
               container restart from sweeping away what the demo made. */
            source: "AGENT" as const,
            brandId: brand.id,
            aestheticId: aesthetic.id,
          };
          await prisma.product.upsert({
            where: { slug: p.slug },
            update: data,
            create: data,
          });
          written.push(p.slug);
        }

        return ok({ brand: brand.slug, count: written.length, slugs: written });
      },
    );

    server.registerTool(
      "create_outfit",
      {
        title: "Create an outfit",
        description:
          "Assemble a head-to-toe look: four to six pieces from one aesthetic, " +
          "one per slot — never two tops, never two colourways of one style. " +
          "which appears in the app immediately. Idempotent on slug: calling " +
          "again with the same slug updates that outfit rather than adding a " +
          "duplicate. The note is the one line a shopper reads under it — " +
          "sentence case, under twenty words, no hype.",
        inputSchema: z.object({
          slug: z
            .string()
            .regex(/^[a-z0-9-]+$/, "lowercase letters, digits and hyphens")
            .describe("Stable handle. Reusing it updates the same outfit."),
          name: z.string().min(1),
          aestheticSlug: z.string().min(1),
          note: z.string().optional().describe("One line, product voice"),
          items: z
            .array(
              z.object({
                productSlug: z.string().min(1),
                score: z.number().min(0).max(100).optional(),
                note: z.string().optional(),
              }),
            )
            .min(4, "a look needs at least four pieces")
            .max(6, "a look is at most six pieces"),
        }),
      },
      async (input) => {
        const denied = writeDenied();
        if (denied) return denied;
        try {
          const result = await upsertOutfit(prisma, {
            ...input,
            source: "AGENT",
          });
          return {
            content: [
              {
                type: "text" as const,
                text: JSON.stringify(
                  {
                    ok: true,
                    ...result,
                    message: `${result.created ? "Created" : "Updated"} "${input.name}" with ${result.itemCount} pieces.`,
                  },
                  null,
                  2,
                ),
              },
            ],
          };
        } catch (e) {
          /* A rejected outfit is a normal outcome for a scoring run, not a
             crash: report why so the caller can fix it and retry. */
          if (e instanceof OutfitInputError) {
            return {
              isError: true,
              content: [
                {
                  type: "text" as const,
                  text: JSON.stringify({ ok: false, error: e.message }, null, 2),
                },
              ],
            };
          }
          throw e;
        }
      },
    );
  },
  {
    serverInfo: { name: "the-edit", version: "1.0.0" },
    instructions:
      "The Edit's catalogue. Use search_products to find pieces by aesthetic, " +
      "brand or price, then create_outfit to assemble two or more of them from " +
      "one aesthetic. Pieces are referred to by slug throughout.",
  },
);

/* When a token is configured, every request must present it. Checked here
   rather than per tool so tools/list is covered too — an open endpoint that
   only enumerates is still an invitation. */
async function guarded(request: Request): Promise<Response> {
  if (WRITE_TOKEN) {
    const header = request.headers.get("authorization") ?? "";
    const presented = header.replace(/^Bearer\s+/i, "");
    if (presented !== WRITE_TOKEN) {
      return new Response(
        JSON.stringify({ error: "unauthorized" }),
        { status: 401, headers: { "content-type": "application/json" } },
      );
    }
  }
  return handler(request);
}

export { guarded as GET, guarded as POST, guarded as DELETE };
