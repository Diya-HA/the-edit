import { PACKSHOT } from "./images";

/**
 * What a photograph shows, for someone who cannot see it.
 *
 * The old pattern was `{title} — {category} by {brand}`, which for most pieces
 * repeated itself: "Overshirt — overshirt by Uskees". A screen reader user got
 * the noun twice and the two things the picture actually carries — what colour
 * it is, and whether it is a garment on a plain ground or a person wearing it
 * — neither time.
 *
 * So: brand, title, colour, and how it was shot. The last part is free, because
 * every piece already carries a measured packshotScore from ingest, and it is
 * the difference between "a black dress" and "a woman on a hillside in a black
 * dress" — which is what someone is actually being told to picture.
 *
 * The category is added only when the title does not already contain it, which
 * is the case for pieces named after a person rather than a thing — Dôen's
 * "Adelana", Repetto's "Salomés Baya".
 *
 * And never when the category is a slot name. Where a brand files something
 * unhelpfully, ingest falls back to the slot, so the "noun" is ACCESSORY or
 * TOP — appending that gave "College Stripe Socks in berry red accessory",
 * which is not how anyone describes socks.
 */
const SLOT_NAMES = new Set([
  "top", "dress", "bottom", "outer", "shoes", "bag", "accessory",
]);

export function describeProduct(p: {
  title: string;
  brand: string;
  category: string;
  colorName: string;
  packshotScore?: number | null;
}): string {
  const title = p.title.trim();
  const noun = p.category.trim().toLowerCase();

  const isSlotName = SLOT_NAMES.has(noun);

  /* "Overshirt" already says overshirt. "Adelana" does not say dress. */
  const named =
    noun && !isSlotName && !title.toLowerCase().includes(noun.replace(/s$/, ""))
      ? `${title} ${noun}`
      : title;

  const colour = p.colorName.trim().toLowerCase();
  const shot =
    p.packshotScore == null
      ? ""
      : p.packshotScore >= PACKSHOT
        ? ", photographed on a plain ground"
        : ", worn";

  return `${p.brand} ${named}, ${colour}${shot}`;
}
