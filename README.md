# The Edit

*Working title. A curated, multi-brand shopping app built on one idea: **one aesthetic, every brand.***

Pick a look (say Soft Romance or Quiet Utility) and the app curates real pieces from many brands into one cohesive, on-palette feed you can save, follow, and buy. The curation, keeping the mix cohesive across brands, is the product.

---

## What's in here

```
the-edit/
├── app/           Next.js App Router — the running app
├── components/    The design system as React components (see components/README.md)
├── styles/        design-system/ — the token set, imported once in app/layout.tsx
├── prisma/        Schema, migrations and seed
├── Dockerfile     From the class deploy template — expects the app at the repo root
├── design/        The visual source of truth: tokens, component system, screens
├── docs/          Written deliverables (Word docs, PDFs) + the data model views
├── prototypes/    Self-contained, clickable HTML prototypes — double-click to open
├── deck/          The 9-slide concept deck
└── build/         The scripts that generate the Word docs (see build/README.md)
```

## Running it

```bash
npm install
docker compose up -d          # PostgreSQL on localhost:5432
npx prisma migrate dev        # create the schema
npx prisma db seed            # 6 brands, 4 aesthetics, 30 products
npm run dev                   # http://localhost:3000
```

Copy `.env.example` to `.env` first — it holds the local `DATABASE_URL`.
In production the platform provides `DATABASE_URL`; migrations run on every
start via the Dockerfile.

Deployment follows the class template: merge to `main` and the GitHub Action
builds and ships the image. `next.config.ts` sets `output: 'standalone'`,
which that Dockerfile requires.

### docs/ — the deliverables

| File | What it is |
|------|-----------|
| `01-product-brief.docx` | The one-pager: problem, idea, the core bet, who it's for, success metric, scope, open decisions. |
| `02-personas.docx` | Three primary personas (Maya, Priya, Sam) plus one anti-persona (Dev). Maya is the primary wedge. |
| `03-prd.docx` | The build spec, written outcome-back: North Star → 3 opportunities → 10 epics, each feature tagged prototyped or new, with a pass/fail acceptance bar. |
| `04-hypotheses-and-test-plan.docx` | Seven falsifiable hypotheses, each with a kill criterion and a days-long, near-free test, plus a run order. |
| `data-model-cards.html` | The v1 data model as entity cards grouped by domain — a readable data dictionary. Double-click to open. |
| `data-model-interactive.html` | The same 18-entity model as an ER diagram with drawn connectors; hover an entity to trace its relationships. Double-click to open. |

These are **refined drafts awaiting review**, not final. Final PDFs will be exported once the content is signed off.

### prototypes/

- `the-edit-app.html` — the interactive, clickable mobile app: onboarding → curated feed → product detail → save-to-board → AI-stylist search → boards → settings, across two aesthetics.
- `the-edit-app-wireframes.html` — the low-fi wireframe map the app was built from (all screens, annotated).
- `feed-curator-agent.html` — the working feed-curator agent: set a brief, watch it reason, get a cohesive on-palette look with a rationale, then refine it and it re-curates.
- `visual-prototype.html` — an earlier clickable visual exploration (both aesthetics).

### deck/

- `concept-deck.pdf` — tells the whole story in nine slides.

---

## Status

- Written deliverables: refined, in review.
- Prototypes: the feed-curator agent and the app prototype are working demos; a production version is still to be built.

## Open decisions (flagged, not settled)

- **Product name.** "The Edit" is a placeholder. Net-a-Porter already runs an editorial brand called The Edit, so it would be hard to own.
- **Business model.** Affiliate assumed for v1.
- **Launch curation.** Hand-curated for guaranteed taste, or agent-curated for scale.
- **Number of aesthetics at launch.** Two (as prototyped) or a small handful.

Each has a recommendation inside the product brief; all remain open.
