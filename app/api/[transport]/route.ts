import { createMcpHandler } from "mcp-handler";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
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
      "create_outfit",
      {
        title: "Create an outfit",
        description:
          "Assemble two or more pieces from a single aesthetic into an outfit, " +
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
            .min(2, "an outfit needs at least two pieces"),
        }),
      },
      async (input) => {
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

export { handler as GET, handler as POST, handler as DELETE };
