# The Edit

*Working title. A curated, multi-brand shopping app built on one idea: **one aesthetic, every brand.***

Pick a look — Soft romance, Quiet utility, Balletcore off duty, Whimsigoth — and
the app assembles real pieces from many brands into one cohesive, on-palette feed
you can save, follow and buy. The curation, keeping the mix cohesive across
brands, is the product.

Live at `theedit.apps.human-angle.com`. Every merge to `main` redeploys it.

---

## What's in here

```
the-edit/
├── app/              Next.js App Router — the running app, including the MCP route
├── components/       The design system as React components (see components/README.md)
├── styles/           design-system/ — the token set, imported once in app/layout.tsx
├── prisma/           Schema, migrations, seed, and the shared outfit write path
├── scripts/          The agent pipeline — scrape, score, assemble
├── .claude/skills/   The aesthetic-fit skill
├── design/           The visual source of truth (read design/README.md first)
├── docs/             Written deliverables and the data model views
├── prototypes/       The original clickable HTML prototypes, kept for reference
├── deck/             The 9-slide concept deck
├── build/            The scripts that generate the Word docs (see build/README.md)
└── Dockerfile        From the class deploy template — expects the app at the repo root
```

## Running it

```bash
npm install
docker compose up -d          # PostgreSQL on localhost:5432
npx prisma migrate dev        # create the schema
npx prisma db seed            # 6 brands, 4 aesthetics, 30 products
npm run dev                   # http://localhost:3000
```

Copy `.env.example` to `.env` first — it holds the local `DATABASE_URL`. In
production the platform provides it, and migrations plus the seed run on every
container start.

The app is designed for a phone. On a desktop browser, narrow the window before
judging anything.

---

## The app

Eight screens, all reading from Postgres.

| Screen | What it does |
|--------|--------------|
| Onboarding | Asks what you're into, which colours, sizes and budget, then lands you on home with an active look |
| Home | Pinterest-style masonry — squares and portraits only — with an aesthetic strip you can star and a single-select palette filter |
| Product detail | Full-bleed painted field, the piece's reason for being in the edit, and what it wears well with |
| Search → Pieces | Search across the catalogue, with a trending row above it |
| Search → Outfits | Assembled outfits — several pieces that work together inside one aesthetic — saveable whole |
| Search → Brands | Brand discovery by aesthetic, price range or what's new, with follow |
| Boards | Two-across grid of your boards, plus account settings |
| Board detail | The pieces in a board |

Saving works the same everywhere: tap a heart, the board sheet opens, pick an
existing board or make a new one. Saving an outfit leads with a new board named
after it. Confirmation is a quiet `Saved ✓`, with a milestone message roughly
every twenty saves.

There is no authentication. Everyone who opens the deployed app is the seeded
shopper, Aria Lane. That's deliberate for now.

## Design

`design/README.md` is the brief, and reading it first matters. The two design
files in `design/screens/` are two turns of one design conversation, not two
alternatives — `the-edit-FINAL-turn3.dc.html` is the direction, and
`the-edit-earlier-turn1.dc.html` is superseded. Turn 3's summary of itself is
*plain canvas, washed moments*: white everyday screens so the clothes carry the
colour, with the painterly wash saved for the welcome, the stylist and
milestones.

Every colour, size, radius and font is a CSS variable in
`styles/design-system/tokens/`. No component hardcodes a hex value. Changing the
look means changing a token, not a screen.

Fonts are Archivo for display, Instrument Sans for body, Martian Mono for prices
and eyebrow labels, and Newsreader italic as a single accent voice. They're
loaded through `next/font/google` rather than the design system's own `@import`,
which was being silently dropped when bundled.

## The agent pipeline

The point of the product is that curation scales. The pipeline is how.

`.claude/skills/aesthetic-fit/SKILL.md` scores a garment against an aesthetic on
palette, fabric, silhouette and cohesion, out of 100, and writes the one-line
reason that appears under the piece in the app. Cohesion is scored against what's
already in the edit, which is the part a generic prompt can't do.

Playwright MCP reads real brand sites. Two are proven: Colorful Standard, whose
listing page is server-rendered and whose colours are first-class in the data,
and Uskees, whose range actually lands inside Quiet utility.

`app/api/[transport]/route.ts` is this app's own MCP server, so an agent can
search the catalogue and create outfits through the same code the UI uses.

`prisma/outfits.ts` is the single write path for outfits, shared by the seed, the
server action and any standalone script. It takes an injected Prisma client and
has no runtime imports, which is what lets a plain
`node --experimental-strip-types` script load it with no bundler.

`scripts/ingest-uskees.ts` chains all of it: scrape, score, assemble, write. It
runs outside the container by design.

### Two things learned the hard way

Headed and headless can disagree silently. Colorful Standard rewrites product
hrefs when running headed, so a selector that worked headless matched nothing and
returned zero results without erroring. Anything you intend to demo should be run
once in exactly the mode you'll demo it in.

Storefronts geolocate prices. The same hoodie came back as €80 and $88 depending
on the session. The pipeline pins a locale explicitly; without that the catalogue
quietly fills with inconsistent prices.

## Data model

`User`, `Brand`, `Aesthetic`, `Product`, `Edit`, `SavedItem`, `Follow`,
`FavouriteLook`, `Outfit`, `OutfitItem`.

`Outfit` and `OutfitItem` are the data model's `CURATED_SET` and `CURATED_ITEM`.
An outfit is a named set of pieces inside one aesthetic; `Outfit.note` holds the
skill's reasoning in the product voice, and `OutfitItem` keeps each piece's score
and reason. These tables are written by an agent, not only by the seed, which is
why the write path is shaped the way it is.

`Product.why` is denormalised from `CURATED_ITEM.rationale` until curated sets
carry their own briefs.

The full eighteen-entity model lives in `docs/data-model-cards.html`. The schema
here is the six-plus that v1 actually needs.

## Deployment

Merge to `main`, the GitHub Action builds the image and ships it, roughly four
minutes. `next.config.ts` sets `output: 'standalone'`, which the class Dockerfile
requires.

**The rule that has broken this twice:** the Dockerfile copies exactly four
things into the runtime image — `.next/standalone`, `prisma/`,
`node_modules/prisma` and `node_modules/@prisma`. Anything the start command
reaches for must live under one of those.

That is why Prisma is pinned to exactly `6.3.1`. Every later version has a
top-level dependency outside `@prisma` — `effect` via `@prisma/config` from 6.5,
`esbuild` at 6.4, `mysql2` and `postgres` at 7 — and the CLI dies at module load
before it ever reaches the database. It presents as a green build and an
"activation failed" container, which sends you looking at the database for
something that was never a database problem.

It is also why `prisma/outfits.ts` lives in `prisma/` rather than `lib/`, despite
being application logic. Moving it back reintroduces the failure.

---

## docs/

| File | What it is |
|------|-----------|
| `01-product-brief` | The one-pager: problem, idea, the core bet, who it's for, success metric, scope, open decisions. |
| `02-personas` | Three primary personas (Maya, Priya, Sam) plus one anti-persona (Dev). Maya is the primary wedge. |
| `03-prd` | The build spec, written outcome-back: North Star → 3 opportunities → 10 epics, each tagged prototyped or new, with a pass/fail acceptance bar. |
| `04-hypotheses-and-test-plan` | Seven falsifiable hypotheses, each with a kill criterion and a days-long, near-free test, plus a run order. |
| `data-model-cards.html` | The v1 data model as entity cards grouped by domain. Double-click to open. |
| `data-model-interactive.html` | The same eighteen entities as an ER diagram with drawn connectors. |

Each deliverable exists as both `.docx` and `.pdf`.

## prototypes/

Kept for reference. These predate the real app and no longer describe it.

- `the-edit-app.html` — the original clickable mobile prototype
- `the-edit-app-wireframes.html` — the low-fi wireframe map
- `feed-curator-agent.html` — the feed-curator agent concept, now real
- `visual-prototype.html` — an earlier visual exploration

---

## Open decisions

- **Product name.** "The Edit" is a placeholder. Net-a-Porter already runs an editorial brand called The Edit, so it would be hard to own.
- **Business model.** Affiliate assumed for v1.
- **Launch curation.** Hand-curated for guaranteed taste, or agent-curated for scale. The pipeline now makes the second one real.
- **Number of aesthetics at launch.** Four are built. Whether all four ship is open.

Each has a recommendation inside the product brief; all remain open.
