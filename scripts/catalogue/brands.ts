/**
 * The brands the catalogue is built from, and what each one needs doing to it.
 *
 * Every one of these is a Shopify storefront with a public products.json, which
 * is why they were chosen: colour, price, images and a garment noun come back
 * as structured data rather than as HTML to be guessed at. The criteria are the
 * ones that worked for Uskees — agent-friendly robots.txt, a listing that
 * renders server-side, colour present in the data, and a range that genuinely
 * lands inside one of the four aesthetics.
 *
 * The demo's Playwright run against Uskees is untouched by any of this. That
 * scrapes a real page with a real browser, and it stays the thing shown on
 * stage. This is how the shelves get stocked behind it.
 */

export type SlotSource = "product_type" | "title";
export type ColourSource = "option" | "title-suffix" | "handle";

export type BrandConfig = {
  slug: string;
  name: string;
  /** One line for the brand shelf. */
  meta: string;
  /** Tint the shelf swatch carries. */
  colorToken: string;
  isPartner: boolean;

  host: string;
  /** Locale path, pinned. Storefronts geolocate; the README has the scars. */
  path: string;
  /** What that locale actually prices in — read from /cart.js, never assumed. */
  currency: "USD" | "GBP" | "EUR" | "AUD";

  aesthetic: string;
  /** Where the garment noun lives. */
  slotFrom: SlotSource;
  /** Where the colour lives. */
  colourFrom: ColourSource;
  /**
   * Whether the colourway is part of the title. Dôen writes
   * "JULIENNE TOP -- SALT", so two colourways of one style have different
   * titles and (brand, title) is not a style key. Everyone else repeats the
   * title across colourways, so it is.
   */
  colourwayInTitle: boolean;
};

export const BRANDS: BrandConfig[] = [
  {
    slug: "uskees",
    name: "Uskees",
    meta: "Quiet utility, strictly. Drill, cord and linen, built for work.",
    colorToken: "--fabric-sage",
    isPartner: false,
    host: "uskees.com",
    path: "/en-us",
    currency: "USD",
    aesthetic: "quiet-utility",
    slotFrom: "product_type",
    colourFrom: "option",
    colourwayInTitle: false,
  },
  {
    slug: "doen",
    name: "Dôen",
    meta: "Soft romance, at the top of the range. Silk, cotton and lace.",
    colorToken: "--fabric-rose",
    isPartner: true,
    host: "www.shopdoen.com",
    path: "",
    currency: "USD",
    aesthetic: "soft-romance",
    // product_type is the season — "FALL 26" — so the noun comes from the title.
    slotFrom: "title",
    colourFrom: "title-suffix",
    colourwayInTitle: true,
  },
  {
    slug: "nagnata",
    name: "Nagnata",
    meta: "Balletcore off duty. Ribbed knit built to move in.",
    colorToken: "--fabric-butter",
    isPartner: false,
    host: "www.nagnata.com",
    path: "",
    currency: "AUD",
    aesthetic: "balletcore-off-duty",
    slotFrom: "product_type",
    colourFrom: "option",
    colourwayInTitle: false,
  },
  {
    slug: "repetto",
    name: "Repetto",
    meta: "Balletcore off duty, from the source. Flats, leotards and wrap tops.",
    colorToken: "--fabric-rose",
    isPartner: true,
    host: "www.repetto.com",
    path: "/en-us",
    currency: "EUR",
    aesthetic: "balletcore-off-duty",
    slotFrom: "product_type",
    // The fragile one. Repetto publishes no colour field at all — not an
    // option, not a tag. Colour is recoverable only from the French handle,
    // between the model name and the reference code:
    //   boots-phoebe-camel-cuba-velours-v690vavld-387
    // It works for about three quarters of the catalogue and it will fail
    // silently, not loudly, if they ever change that format.
    colourFrom: "handle",
    colourwayInTitle: false,
  },
  {
    slug: "killstar",
    name: "Killstar",
    meta: "Whimsigoth, head to toe. Velvet, mesh and moons, rarely over $100.",
    colorToken: "--fabric-ink",
    isPartner: false,
    host: "www.killstar.com",
    path: "",
    currency: "GBP",
    aesthetic: "whimsigoth",
    slotFrom: "product_type",
    colourFrom: "option",
    colourwayInTitle: false,
  },
];

/**
 * Fixed conversion rates, deliberately not live ones. A demo catalogue needs
 * one coherent currency more than it needs today's mid-market rate, and a
 * number that moves on every run is worse than one that is stated. Recorded in
 * the generated catalogue so the figures can always be read back.
 */
export const RATE_TO_USD: Record<BrandConfig["currency"], number> = {
  USD: 1,
  GBP: 1.27,
  EUR: 1.09,
  AUD: 0.66,
};

/** The six invented brands the real catalogue replaces. */
export const RETIRED_BRANDS = [
  "margaux",
  "ciel",
  "alder-and-oak",
  "paloma-works",
  "leonie",
  "halle",
];

/** Outfits the invented catalogue carried, retired with it. */
export const RETIRED_OUTFITS = ["monday-uniform", "after-dark-velvet"];
