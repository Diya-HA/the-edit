/* Shared by the brand-discovery client component and the server page that
   filters with it. It lives outside the "use client" module on purpose: Next
   turns a client module's exports into references across the boundary, so a
   plain array imported from there arrives as a proxy, not an array. */

export type BrandSort = "new" | "aesthetic" | "price";

export const BRAND_SORTS: BrandSort[] = ["new", "aesthetic", "price"];

/** Price bands, matched against what a label's cheapest piece costs. */
export const BANDS: { key: string; label: string; max: number }[] = [
  { key: "under-100", label: "Under $100", max: 100 },
  { key: "under-200", label: "Under $200", max: 200 },
  { key: "any", label: "Any price", max: Number.POSITIVE_INFINITY },
];
