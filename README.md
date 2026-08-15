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
npx prisma db seed            # 5 real brands, 4 aesthetics, 142 pieces
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

## The catalogue

Every piece in the app is real — a real photograph, a real price and a link to
the shop that sells it. Five brands, one per aesthetic except Balletcore off
duty, which has two.

`scripts/build-catalogue.ts` fetches each brand's public `products.json`,
classifies what comes back and writes `prisma/catalogue.json`. The seed plants
that file and never touches the network, which is what lets it run on container
start. It lives under `prisma/` for the same reason `prisma/outfits.ts` does —
see the deployment rule below.

```bash
node --experimental-strip-types scripts/build-catalogue.ts   # refresh the catalogue
node --experimental-strip-types scripts/survey-catalogue.ts  # refresh docs/catalogue-survey.md
```

This is not how the demo works, and deliberately so. The demo scrapes a real
page with a real browser, because that is the thing worth showing. `products.json`
is how the shelves get stocked behind it.

`docs/catalogue-survey.md` has the coverage tables, regenerated rather than
typed. Two things it records are worth knowing before touching the ingest:

**Only Balletcore off duty can be dressed from more than one label**, which is
why it is the demo aesthetic. An outfit assembled inside any other aesthetic is
one brand's lookbook.

**Repetto is the fragile brand.** It publishes no colour field at all — not an
option, not a tag. Colour is recovered from the French URL handle, between the
model name and the reference code:

```
boots-phoebe-camel-cuba-velours-v690vavld-387
```

It works for about three quarters of their catalogue. If Repetto ever changes
that format it will fail *silently*: the ingest carries on, pieces quietly start
being dropped for "no colour could be read", and the run still reports success.
Nothing else in the pipeline depends on a URL being shaped a particular way.

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

## After the demo

Things known to be worth doing, parked deliberately rather than forgotten.

**Tests.** There are none. `lib/mood.ts`, `lib/price.ts`, `lib/alt.ts` and
`scripts/catalogue/classify.ts` are pure functions with real edge cases that
were found by hand and can regress silently — the classifier alone has had four
bugs of the same shape, where a word matched inside a longer word and filed a
garment in the wrong slot. A modest suite around those four would have caught
every one of them. This is the first thing to do with a clear week.

**Sizes.** The settings row says "Not set" honestly, but nothing collects a
size, so it can never say anything else. Either ask at the welcome and show the
answer back, or take the row out.

**Image weight.** The feed loads 25 photographs, about 700 KiB, and on a
throttled connection that is what holds Largest Contentful Paint near five
seconds — not the loading strategy, which is already right. Paginating the feed
or turning Next's optimizer back on would both help; the second is the trade
documented in `next.config.ts` and worth revisiting once someone can watch a
deploy properly.

**`User.moodNote` is stored and only read back at the welcome.** The words
someone types are the best signal in the app about what they want and nothing
downstream uses them.

### A real first run — name-only entry

**The problem.** Onboarding only fires for a user who has never been onboarded,
and the deployed app has one shopper who was onboarded long ago. So anyone
opening the link lands on home and never sees the welcome, and everyone shares
Aria's boards. The "Redo the welcome" settings row is a workaround, not the
intent.

**The shape.** Someone opens the link, gets a short screen — "Who's shopping?",
one field, no password and no email — which creates that person or resumes them
if they have been before, then runs the existing three-step welcome. They come
out with their own boards.

**Why not an anonymous per-browser session.** It was the obvious cheaper
alternative and it fails the actual goal. Same browser means same session, so
handing someone your phone gives them *your* boards, which is the specific
thing this is meant to stop. It only wins when someone opens the link on their
own device, and it can never tell two people apart on one.

**What passwordless means here, said plainly.** Anyone who types your name gets
your boards, and two people typing "Sarah" share an account. That is not a flaw
to be fixed later; it is what no password means. Worth saying in the UI rather
than leaving to be discovered.

#### Schema

```prisma
model User {
  email  String? @unique   // was required
  handle String  @unique   // "aria-lane" — the display name, normalised
}
```

```sql
ALTER TABLE "users" ALTER COLUMN "email" DROP NOT NULL;
ALTER TABLE "users" ADD COLUMN "handle" TEXT;
UPDATE "users" SET "handle" = 'aria-lane' WHERE "email" = 'aria@theedit.test';
ALTER TABLE "users" ALTER COLUMN "handle" SET NOT NULL;
CREATE UNIQUE INDEX "users_handle_key" ON "users"("handle");
```

**Existing rows survive completely.** There is exactly one, and nothing keyed on
`userId` moves — Aria keeps her id, her four boards, her fourteen saves, her
follows and her starred look. She gains the handle `aria-lane`.

That is the useful accident: **typing "Aria Lane" at the entry screen resumes
the seeded shopper**, so the new screen becomes the demo's way back to the known
state rather than a thing in its way.

#### Sessions

A cookie holding the user id — `httpOnly`, `sameSite=lax`, `secure` in
production, year-long expiry so nobody re-types. Writing it needs a Server
Action, because Next cannot set cookies from a server component: the entry form
posts, creates or resumes, sets the cookie, redirects into the existing welcome.
`getCurrentUser()` reads the cookie; no cookie or a dead id redirects to the
entry screen.

**This adds identity, not authentication.** The cookie is a bearer token,
whoever holds it is that person, and a UUID is unguessable in practice but not
secret. No passwords, no email, nothing personal beyond a display name. The
MCP write token is a separate mechanism and is unaffected.

#### What it does to the demo

Checked rather than assumed:

| | Affected |
|---|---|
| `scripts/demo.sh` | No — writes through MCP, which never touches `User` |
| `scripts/reset-demo.ts` | No — removes AGENT products and outfits, user-independent |
| Verification table, products and outfits | No — per-aesthetic counts are user-independent |
| Verification table, **Boards 4 · 14** | **Yes** — the only user-dependent row |

Two new ways the demo's "before" could go ambiguous, both real:

- **Browser state decides what Boards shows.** A window carrying a visitor
  cookie shows their empty boards, not Aria's, and the verification table reads
  wrong through no fault of the reset.
- **Visitors accumulate.** Everyone who tries it adds a user and their boards.

**The runbook change.** Its clean state stops being *"Boards shows 4 · 14"* and
becomes *"enter Aria Lane, then Boards shows 4 · 14"* — a deliberate, checkable
step instead of an assumption. Plus a `scripts/reset-demo.ts --visitors` flag to
remove everyone who is not the seeded shopper, not run by default because it
deletes other people's saves.

#### Design

`design/screens/the-edit-FINAL-turn3.dc.html` has **nothing** for this. It has
the three washed "Getting started" screens, "Sign out" in settings and Aria Lane
as the account, but no entry screen, no name field and nothing about identity.

So it is a new screen and wants looking at before it ships. Build it as a fourth
washed screen in front of the existing three, reusing the field treatment from
the mood box and the same progress bars, so it extends the established pattern
rather than introducing a second visual language for the same moment.

#### Cost, and what to cut

**About a full day.** Schema and migration 1h; session helper and the
`getCurrentUser` rewrite 2h; entry screen and action 2h; routing across the call
sites and the error paths 2h; demo reconciliation and runbook 1.5h; re-rehearsal
of both demo paths 1h.

Cut in this order if it runs over: the `--visitors` cleanup (do it with SQL by
hand), then Sign out, then the "welcome back" versus new-person copy
distinction. **The last thing to cut is the routing**, because a half-wired gate
does not break one screen, it breaks all of them.

#### The honest note

`getCurrentUser` has **25 call sites** and is the most load-bearing function in
the app. Every screen goes through it. A mistake there is not one broken screen,
it is every screen — and the change introduces a genuinely new failure mode:
what you see now depends on which browser window you opened.

This wants a clear working day for the build **plus a full re-rehearsal and a
deploy after it**. It is sound work and the reasoning holds; the only real
question is runway. With a week it is worth doing. The night before a demo it is
not, and the smaller flaw — everyone is Aria — is easier to live with than a
broken welcome.


## Open decisions

- **Product name.** "The Edit" is a placeholder. Net-a-Porter already runs an editorial brand called The Edit, so it would be hard to own.
- **Business model.** Affiliate assumed for v1.
- **Launch curation.** Hand-curated for guaranteed taste, or agent-curated for scale. The pipeline now makes the second one real.
- **Number of aesthetics at launch.** Four are built. Whether all four ship is open.

Each has a recommendation inside the product brief; all remain open.
