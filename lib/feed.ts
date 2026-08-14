import type { ProductView } from "./data";

/**
 * Keep near-identical pieces apart in the feed.
 *
 * Colourways of one style are already collapsed at ingest, but brands also
 * publish whole families of a thing: five sizes of one bag, four soles of one
 * ballet shoe, tights with feet and tights without. Each is a genuinely
 * different product and belongs in the catalogue — but two of them a row apart
 * read as a mistake, and a column of them reads as a colourway rail, which is
 * the exact thing head-to-toe outfits were introduced to stop.
 *
 * So nothing is hidden; it is spread. Pieces are grouped by style family and
 * dealt out one family at a time, so the gap between two members of a family
 * is as wide as the number of families allows.
 */

/**
 * The family a piece belongs to: its first meaningful word, singularised.
 *
 * Deliberately coarse. "Sac polochon Small" and "Sac polochon large" are one
 * family, and so are "Veste technique" and "Veste teddy" — two jackets that
 * are not really the same thing. Being wrong that way costs nothing, because
 * the only consequence is that they sit further apart.
 */
export function styleFamily(p: ProductView): string {
  const first =
    p.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, " ")
      .split(/[\s]+/)
      .filter(Boolean)[0] ?? p.title.toLowerCase();
  /* "Nagnata sock" and "Nagnata socks" are one thing sold under two titles. */
  const singular = first.replace(/s$/, "");
  return `${p.brand.toLowerCase()}::${singular}`;
}

/**
 * Give every family's members evenly spaced positions across the whole feed.
 *
 * Dealing round by round is the obvious approach and it bunches: the first
 * round is as wide as the number of families, but by the third only the two or
 * three largest families are still dealing, so their last members end up a few
 * cards apart. Spreading instead means a family of five is spaced at a fifth of
 * the feed however many other families there are.
 *
 * Stable — the same catalogue always produces the same feed, so nothing moves
 * under you between renders.
 */
export function spaceByStyle(products: ProductView[]): ProductView[] {
  const n = products.length;
  if (n < 3) return products;

  const families = new Map<string, ProductView[]>();
  for (const p of products) {
    const key = styleFamily(p);
    const list = families.get(key);
    if (list) list.push(p);
    else families.set(key, [p]);
  }

  /* Nothing repeats — leave the order exactly as it came. */
  if (families.size === n) return products;

  /* Crowded families claim their slots first, since they are the ones whose
     spacing is actually at risk; singletons fill in around them. */
  const groups = [...families.values()].sort((a, b) => b.length - a.length);

  const slots: (ProductView | undefined)[] = new Array(n);
  const place = (p: ProductView, wanted: number) => {
    for (let d = 0; d < n; d += 1) {
      /* Outward from the wanted slot, so a taken one costs as little of the
         intended spacing as possible. */
      for (const i of [wanted + d, wanted - d]) {
        if (i >= 0 && i < n && slots[i] === undefined) {
          slots[i] = p;
          return;
        }
      }
    }
  };

  for (const group of groups) {
    const stride = n / group.length;
    group.forEach((p, i) => place(p, Math.round(i * stride + stride / 2)));
  }

  return slots.filter((p): p is ProductView => p !== undefined);
}
