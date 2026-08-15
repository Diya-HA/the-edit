/**
 * Read a sentence about clothes and guess which look it is.
 *
 * Word matching, not comprehension. It knows that "velvet" leans whimsigoth
 * and "pockets" leans quiet utility, and it knows nothing else — "nothing too
 * fussy" scores zero and always will. That is a deliberate limit rather than a
 * stage on the way somewhere: this runs in the welcome, which is the first
 * screen anyone sees, and it must not wait on a model or a network.
 *
 * So it is built to fail quietly. No match means no change, the chips stay
 * where they were, and the shopper picks one. Typing is an accelerator, never
 * a gate.
 */

/**
 * Words that lean toward a look.
 *
 * Chosen from how people actually describe clothes rather than from the
 * aesthetics' own names — someone types "big cardigan and jeans", not
 * "quiet utility". A word may appear under two looks; it simply votes twice.
 */
const VOCABULARY: Record<string, string[]> = {
  "soft-romance": [
    "soft", "romantic", "romance", "lace", "floral", "flowers", "prairie",
    "cottage", "delicate", "pretty", "feminine", "silk", "slip", "blouse",
    "cream", "ivory", "neutral", "neutrals", "warm", "undone", "layers",
    "linen", "buttery", "butter", "peach", "dreamy", "gentle", "loose",
  ],
  "quiet-utility": [
    "utility", "workwear", "work", "practical", "plain", "simple", "clean",
    "pockets", "pocket", "drill", "canvas", "cord", "corduroy", "denim",
    "overshirt", "chore", "functional", "sturdy", "hardwearing", "boxy",
    "jeans", "trousers", "tee", "t-shirt", "shirt", "utilitarian", "rugged",
    "minimal", "understated", "quiet", "olive", "khaki", "navy", "grey",
    "straight", "unfussy", "no-nonsense", "sensible",
  ],
  "balletcore-off-duty": [
    "ballet", "balletcore", "ribbon", "ribbons", "wrap", "flats", "leotard",
    "tights", "knit", "knits", "ribbed", "dance", "pink", "blush", "legwarmers",
    "cardigan", "bodysuit", "stretchy", "movement", "off duty", "studio",
    "pale", "barre", "pilates", "sleek",
  ],
  whimsigoth: [
    "goth", "whimsigoth", "witchy", "velvet", "moons", "moon", "stars",
    "mesh", "black", "dark", "mystical", "occult", "crochet", "lace-up",
    "nineties", "90s", "grunge", "theatrical", "dramatic", "silver",
    "tarnished", "crescent", "spooky", "vampy", "burgundy", "plum",
  ],
};

export type MoodMatch = {
  slug: string;
  /** How many distinct words voted for it. */
  score: number;
  /** Which words did, so the guess can be explained rather than asserted. */
  matched: string[];
};

/** Word characters only, so punctuation and case do not break a match. */
function words(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s'-]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

/**
 * The best-matching look, or null when nothing in the sentence is recognised.
 *
 * Null is a real answer and the common one — most sentences about clothes do
 * not contain the handful of words this knows. Callers must leave the current
 * choice alone when they get it.
 */
export function matchLook(text: string, allowed: string[]): MoodMatch | null {
  const said = new Set(words(text));
  if (said.size === 0) return null;

  const lowered = text.toLowerCase();

  const scores: MoodMatch[] = allowed
    .map((slug) => {
      const vocab = VOCABULARY[slug] ?? [];
      const matched = vocab.filter((w) =>
        /* Multi-word entries like "off duty" are matched against the whole
           sentence; single words against the tokens, so "work" does not fire
           on "network". */
        w.includes(" ") || w.includes("-") ? lowered.includes(w) : said.has(w),
      );
      return { slug, score: matched.length, matched };
    })
    .filter((m) => m.score > 0)
    .sort((a, b) => b.score - a.score);

  if (scores.length === 0) return null;

  /* A tie is not a guess. Two looks reached equally on the same sentence means
     the sentence does not choose between them, and picking the first would be
     arbitrary dressed up as intelligence. */
  if (scores.length > 1 && scores[0].score === scores[1].score) return null;

  return scores[0];
}
