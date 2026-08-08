/* Product photography comes from brand CDNs, at whatever size the brand's own
   listing page happened to ask for — the Uskees scrape captures 128px
   thumbnails, which is a third of what a feed card needs and a sixth of the
   detail hero.

   Shopify (and Shopify-shaped CDNs, which is most of the brands that meet the
   scrape criteria) resize on demand from a `width` query parameter, so the
   stored URL is re-pointed at the size the surface actually needs. Anything
   that isn't recognisably one of those is handed back untouched: a wrong guess
   here is a broken image, and the original always works. */

/** Hosts known to resize from `?width=`. */
const RESIZES_ON_DEMAND = /(^|\.)(cdn\.shopify\.com|shopify\.com)$/;

const SHOPIFY_PATH = "/cdn/shop/";

export function atWidth(url: string, width: number): string {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return url;
  }

  /* Either a Shopify-hosted CDN, or a brand's own domain serving the same
     /cdn/shop/ path — Uskees is the latter. */
  const resizable =
    RESIZES_ON_DEMAND.test(parsed.hostname) ||
    parsed.pathname.startsWith(SHOPIFY_PATH);
  if (!resizable) return url;

  parsed.searchParams.set("width", String(width));
  return parsed.toString();
}

/** Widths the app asks for, one per surface rather than one per breakpoint —
    without the Next optimizer there is no srcset, so these are chosen for a
    2x phone and shared across every card of that kind so the cache hits. */
export const IMAGE_WIDTH = {
  /** Feed cards, rails and board tiles — roughly 170 CSS px at 2x. */
  card: 400,
  /** The product detail hero, full-bleed at 2x. */
  hero: 900,
} as const;

/**
 * A `background-image` value for the small painted thumbs — outfit pieces,
 * trending, board covers. Those surfaces paint a tone through a CSS variable
 * rather than going through CanvasSwatch, and a background keeps their layout
 * untouched: the tone stays as the colour underneath, the photograph covers it
 * when there is one. They sit beside their own visible titles, so there is no
 * alt text to lose.
 */
export function thumbBackground(
  url: string | null | undefined,
  width: number = IMAGE_WIDTH.card,
): string {
  return url ? `url("${atWidth(url, width)}")` : "none";
}
