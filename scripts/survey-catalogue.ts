/**
 * Regenerate the coverage tables in docs/catalogue-survey.md.
 *
 *   node --experimental-strip-types scripts/survey-catalogue.ts
 *
 * The numbers move every time a brand is added or a storefront restocks, so
 * they are generated rather than typed. Everything between the BEGIN and END
 * markers in that file is replaced; the prose around them is written by hand
 * and left alone.
 *
 * This surveys everything the brands carry, not the subset the seed plants —
 * the question it answers is what is available to curate from.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { BRANDS, RATE_TO_USD } from "./catalogue/brands.ts";
import { classify, dedupeColourways, fetchCatalogue, type Piece } from "./catalogue/classify.ts";

const DOC = new URL("../docs/catalogue-survey.md", import.meta.url);
const BEGIN = "<!-- BEGIN GENERATED -->";
const END = "<!-- END GENERATED -->";

const SLOTS = ["TOP", "DRESS", "BOTTOM", "OUTER", "SHOES", "BAG", "ACCESSORY"] as const;
const ORDER = ["quiet-utility", "soft-romance", "balletcore-off-duty", "whimsigoth"];
const NAMES: Record<string, string> = {
  "quiet-utility": "Quiet utility",
  "soft-romance": "Soft romance",
  "balletcore-off-duty": "Balletcore off duty",
  whimsigoth: "Whimsigoth",
};

const money = (n: number) => `$${Math.round(n).toLocaleString("en-US")}`;
const median = (xs: number[]) => {
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};
const share = (xs: number[], under: number) =>
  `${Math.round((100 * xs.filter((x) => x < under).length) / xs.length)}%`;

const all: Piece[] = [];
const perBrand: { slug: string; name: string; fetched: number; styles: number }[] = [];

for (const brand of BRANDS) {
  process.stdout.write(`${brand.name.padEnd(10)} `);
  const raw = await fetchCatalogue(brand);
  const styles = dedupeColourways(classify(raw, brand).pieces);
  all.push(...styles);
  perBrand.push({ slug: brand.slug, name: brand.name, fetched: raw.length, styles: styles.length });
  console.log(`${String(raw.length).padStart(5)} fetched  ${String(styles.length).padStart(4)} styles`);
}

const byAesthetic = (a: string) => all.filter((p) => p.aesthetic === a);

const lines: string[] = [];
const row = (cells: (string | number)[]) => `| ${cells.join(" | ")} |`;

lines.push(`Taken on ${new Date().toISOString().slice(0, 10)} from each brand's public`);
lines.push(`\`products.json\`. ${perBrand.reduce((n, b) => n + b.fetched, 0).toLocaleString("en-US")} products,`);
lines.push(`${all.length.toLocaleString("en-US")} distinct styles once colourways are collapsed.`);
lines.push("");
lines.push(row(["Brand", "Aesthetic", "Locale", "Prices in", "Styles"]));
lines.push(row(["---", "---", "---", "---", "---"]));
for (const b of BRANDS) {
  const s = perBrand.find((x) => x.slug === b.slug)!;
  const rate = RATE_TO_USD[b.currency];
  lines.push(row([
    b.name,
    NAMES[b.aesthetic] ?? b.aesthetic,
    b.path ? `\`${b.path}\`` : "root",
    rate === 1 ? "USD" : `${b.currency} → USD ×${rate}`,
    s.styles,
  ]));
}

lines.push("");
lines.push("### Slot coverage");
lines.push("");
lines.push("Distinct styles per slot. `DRESS` is tracked apart from `TOP` because a dress");
lines.push("fills two slots at once and the assembler needs to know not to put a bottom");
lines.push("underneath it; the schema stores it as `TOP`.");
lines.push("");
lines.push(row(["Aesthetic", ...SLOTS, "Labels"]));
lines.push(row(new Array(SLOTS.length + 2).fill("---")));
for (const a of ORDER) {
  const rs = byAesthetic(a);
  if (rs.length === 0) continue;
  lines.push(row([
    NAMES[a] ?? a,
    ...SLOTS.map((s) => rs.filter((r) => r.slot === s).length || "—"),
    new Set(rs.map((r) => r.brand)).size,
  ]));
}

lines.push("");
lines.push("Slots more than one label can fill — the ones where an assembled look is");
lines.push("curation rather than a single brand's lookbook:");
lines.push("");
for (const a of ORDER) {
  const rs = byAesthetic(a);
  if (rs.length === 0) continue;
  const contested = SLOTS.filter(
    (s) => new Set(rs.filter((r) => r.slot === s).map((r) => r.brand)).size > 1,
  );
  const covered = SLOTS.filter((s) => rs.some((r) => r.slot === s)).length;
  lines.push(`- **${NAMES[a] ?? a}** — covers ${covered}/7, contested: ${contested.join(", ") || "none"}`);
}

lines.push("");
lines.push("### Price coverage");
lines.push("");
lines.push("Cheapest variant per style, in USD. The buckets are the onboarding question —");
lines.push("*what counts as a lot for one piece* — which offers $150, $300, $500 and no");
lines.push("ceiling.");
lines.push("");
lines.push(row(["Aesthetic", "n", "min", "median", "max", "<$150", "<$300", "<$500"]));
lines.push(row(new Array(8).fill("---")));
for (const a of ORDER) {
  const ps = byAesthetic(a).map((r) => r.price);
  if (ps.length === 0) continue;
  lines.push(row([
    NAMES[a] ?? a, ps.length,
    money(Math.min(...ps)), money(median(ps)), money(Math.max(...ps)),
    share(ps, 150), share(ps, 300), share(ps, 500),
  ]));
}

lines.push("");
lines.push("Median per slot, which is where the shape of it shows:");
lines.push("");
lines.push(row(["Aesthetic", ...SLOTS]));
lines.push(row(new Array(SLOTS.length + 1).fill("---")));
for (const a of ORDER) {
  const rs = byAesthetic(a);
  if (rs.length === 0) continue;
  lines.push(row([
    NAMES[a] ?? a,
    ...SLOTS.map((s) => {
      const ps = rs.filter((r) => r.slot === s).map((r) => r.price);
      return ps.length ? money(median(ps)) : "—";
    }),
  ]));
}

const doc = readFileSync(DOC, "utf8");
const start = doc.indexOf(BEGIN);
const end = doc.indexOf(END);
if (start === -1 || end === -1) {
  throw new Error(`docs/catalogue-survey.md is missing its ${BEGIN} / ${END} markers`);
}
writeFileSync(
  DOC,
  `${doc.slice(0, start + BEGIN.length)}\n\n${lines.join("\n")}\n\n${doc.slice(end)}`,
);
console.log(`\nrewrote the generated section of docs/catalogue-survey.md`);
