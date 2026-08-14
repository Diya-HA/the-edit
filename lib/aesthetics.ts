/**
 * Which looks sit next to which.
 *
 * Written down rather than inferred. The obvious move is to suggest whichever
 * aesthetic has the most within a shopper's reach, but that measures the
 * catalogue, not taste: it offers Whimsigoth to someone who chose Soft
 * romance, which is a leap rather than a nudge. Adjacency is a judgement about
 * the clothes, so it is stated here and can be argued with.
 *
 * In order of nearness. Soft romance and Balletcore off duty share a palette
 * and a softness and are each other's closest neighbour. Quiet utility sits
 * beside Balletcore because both are understated and off duty, whatever their
 * fabrics. Whimsigoth is the far corner from Quiet utility, and reaches Soft
 * romance first because they share the romance even as the palette inverts.
 */
export const NEIGHBOURS: Record<string, string[]> = {
  "soft-romance": ["balletcore-off-duty", "whimsigoth", "quiet-utility"],
  "balletcore-off-duty": ["soft-romance", "quiet-utility", "whimsigoth"],
  "quiet-utility": ["balletcore-off-duty", "soft-romance", "whimsigoth"],
  whimsigoth: ["soft-romance", "balletcore-off-duty", "quiet-utility"],
};

/** The looks beside this one, nearest first. Unknown slugs have no neighbours. */
export function neighboursOf(slug: string): string[] {
  return NEIGHBOURS[slug] ?? [];
}
