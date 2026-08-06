# The Edit — Design System

*One aesthetic, every brand.*

**The Edit** is a curated, multi-brand shopping app built on a single idea: pick a look (Soft Romance, Quiet Utility) and the app assembles real pieces from many brands into one cohesive, on-palette feed you can save, follow, and buy. The curation — keeping the mix cohesive across brands — is the product. Positioning: *Pinterest you can actually shop.*

This design system gives design agents everything needed to produce well-branded interfaces and assets for The Edit: color, type, spacing, the signature Impressionist texture motif, reusable components, and a full interactive UI kit.

> **Working title.** "The Edit" is a placeholder in the source material (Net-a-Porter runs an editorial brand of the same name), kept here as a codename. Swap the wordmark when a name is chosen.

---

## Sources

Built from the founder's concept repo. Explore it to build more faithful work:

- **GitHub — `Diya-HA/fashion-curation-app`** (`main`): https://github.com/Diya-HA/fashion-curation-app
  - `prototypes/visual-prototype.html` — the clickable app in two aesthetics (Muse / STACK). **Primary visual + interaction reference.**
  - `prototypes/feed-curator-agent.html` — the working feed-curator agent.
  - `build/01-brief.js`, `build/04-hypotheses.js` — product brief and test plan (source of product copy + voice).

**Design direction note (from stakeholder):** the repo prototype is an early *draft*, not final. The intended brand is **modern, fresh, and elegant**, using **sophisticated layouts with bright, saturated colors**, a **mix of modern + elegant typography**, and an **artistic element reminiscent of Impressionism / Neo-Impressionism**. Target demographic: **18–34**. This system honors that brief — it keeps the prototype's structure and fonts but pushes the palette from muted earth tones to a bright painter's-box palette and introduces the pointillist "painted canvas" motif as the signature element.

---

## Content fundamentals

How The Edit writes.

- **Voice:** editorial, confident, warm — a stylist friend, not a salesperson. Sentences are short and declarative. *"One aesthetic, every brand." "Save the look. Shop the look." "Nothing in this palette yet — try another color."*
- **Person:** speaks about the shopper as **you** ("your boards", "pieces from your shelf"); the brand rarely says "we" in-product.
- **Casing:** **Sentence case** everywhere in the UI (buttons, titles, section headers) — e.g. "Save to board", "Your boards", "Price drops". The only uppercase is **mono eyebrow/meta labels** with wide tracking ("FILTER BY PALETTE", "SOFT ROMANCE ’26", brand names above product titles).
- **Aesthetic naming:** each edit gets a named look + a year, styled like a season: *"Soft Romance ’26"*, *"Quiet Utility ’26"*. Uses a curly apostrophe (’).
- **Product copy:** `Brand` (mono/uppercase, muted) → `Piece title` (sentence case) → `$price` (mono). Descriptions are one sentence tying the piece to the edit and to cohesion: *"A dress piece from the Soft Romance ’26 edit — chosen to layer into one cohesive wardrobe."*
- **Numbers & prices:** always mono, plain `$148`; drops read `↓ 25%` or `−25%`; strikethrough on the old price.
- **Emoji:** **not used** as content. The only glyphs are functional UI symbols — hearts (♥ / ♡ save), check (✓), close (✕), plus (＋), chevrons (‹ ›), price arrow (↓). Keep it to those.
- **Tone words:** cohesive, curated, edit, look, palette, shelf, board, drop. Avoid hype ("amazing deals!", "SALE!!!") — a drop is stated calmly.

---

## Visual foundations

- **Color.** A bright, saturated **Impressionist palette** — the painter's box: vermillion, tangerine, cadmium yellow, viridian, cerulean, cobalt, dioxazine violet, rose madder. These sit on a **pure white canvas** (`--canvas-0/1` = `#FFFFFF`; `--canvas-2` = `#F3F4F6`, a cool grey well) with cool near-black ink (`--ink-0` = `#0E0E10`). No beige, no cream — white does the breathing so the pigment reads at full strength. Signature/brand accent is **vermillion** (`--brand`), secondary is **cobalt**. Product "images" are painted pigment fields, so color carries the whole feed — palette filtering is a first-class feature. Tints (soft washes) exist for large calm fields.
- **The signature Impressionist motif.** Every product image, board tile and brand swatch is a **painted canvas**: a pigment fill dressed with a **pointillist dab texture** (fine radial-gradient stipple, Seurat-style), a diagonal **brushstroke sheen**, and — on hero fields — a gauzy **multi-pigment wash** (Monet-style). All pure CSS (`--texture-pointillism`, `--texture-sheen`, `--texture-wash`, and the `.te-canvas` helper / `CanvasSwatch` component). This is what makes the brand feel artistic rather than a generic e-commerce grid. Real product photography would replace the fill in production; the texture stays as an overlay accent.
- **Type.** Tight, contemporary, low-nostalgia: **Archivo** (variable-width grotesque — *all* display roles: wordmark, screen titles, section heads; set uppercase, **condensed** `font-stretch: 88–90%` — taller and narrower, never boxy — weight 700–800, negative tracking `--ls-tight`, line-height `0.86–0.96`), **Instrument Sans** (UI sans — body, labels, buttons), **Martian Mono** (wide mono — eyebrow labels, prices, meta), **Newsreader** (**italic only**, a single accent voice — the aesthetic label, pull quotes; never body or headings). Headlines are grotesque, not serif; prices and meta are always mono.
- **Layout.** Editorial and airy. Feed is a **2-column masonry** with varied card heights. Screen gutter `--gutter: 18px`. Fixed app chrome: header (wordmark + aesthetic + avatar, with palette/category filters below) pinned top; **tab bar** pinned bottom. Sub-sections use large tight grotesque titles ("Your boards", "Price drops", "The shelf").
- **Corner radii.** Soft but not pill-everywhere: product thumbs `16px` (`--radius-xl`), buttons/swatches `12px`, tags/small tiles `8px`, board covers/list thumbs `14px`, bottom sheets `26px`. Pills (`999px`) for chips, color dots, avatars, follow buttons, toasts.
- **Cards.** No borders and no heavy shadows on product cards — the painted swatch *is* the card; meta sits directly below on the canvas background. Elevation is reserved for floating glass controls, sheets, and toasts.
- **Shadows.** Soft and **cool-tinted** (`rgba(14,14,16,…)`), never pure black. Scale `--shadow-sm → xl`, plus `--shadow-sheet` (upward, for bottom sheets) and `--shadow-float` (small, for glass buttons).
- **Transparency & blur.** Frosted glass (`--glass-bg` + `--glass-blur`, 6px) only on floating controls over imagery — the save heart and detail close/save buttons. Scrims are warm-dark `rgba(20,16,12,0.4)`.
- **Borders.** Hairlines only, cool and low-contrast: `--line-0` (0.12α) for structural dividers, `--line-1` (0.06α) for faint ones. Follow-toggle and check use a `1.5px` border in the idle state.
- **Hover.** Links darken from vermillion → tangerine. Chips/dots change fill, not opacity.
- **Press.** Buttons **scale to 0.97** (springy, `--ease-out`); active chips/tabs go ink-filled.
- **Motion.** Quick and gentle: `--dur-fast .15s`, `--dur-med .22s`, `--dur-slow .28s`. Bottom sheets slide up on `--ease-out`; toasts fade+rise; scrims fade. No bounces on content, no infinite decorative loops.
- **Imagery vibe.** Warm, saturated, sunlit — the pigment fields read like paint catching light. Never cold, never grayscale.

---

## Iconography

- **Navigation icons are inline stroke SVGs**, hand-set in the `TabBar` component: Feed (2×2 rounded grid), Search (magnifier), Boards (bookmark), Shelf (price tag). Stroke weight **1.9**, `currentColor`, `viewBox 0 0 24 24`, rounded joins. Active = ink, idle = muted. This matches the source prototype exactly.
- **No icon font and no icon library** are used or required. If a screen needs icons beyond the four nav glyphs, use **Lucide** (https://lucide.dev) — it is the closest match to the prototype's stroke style (~1.9px, rounded, 24px grid). *This is a substitution flag: the source defines only the four inline nav icons; anything else is a Lucide stand-in and should be reviewed.*
- **Functional symbols are Unicode glyphs**, used sparingly: ♥/♡ (save), ✓ (selected), ✕ (close), ＋ (new board), ‹ › (back/carousel), ↓ / − (price drop). Do not introduce emoji.
- **No logo/brand mark exists in the source.** The brand is rendered as **type**: `THE EDIT` in Archivo, uppercase, weight 800, expanded width, tight tracking. Do not invent a logomark — set the name in type wherever a mark would go. Provide a real logo to replace these type lockups.

---

## Foundations at a glance

Registered specimen cards in the **Design System** tab:

- **Colors** — Pigments · Tints · Canvas & Ink · Semantic Roles
- **Type** — Type Families · Type Scale
- **Spacing** — Spacing Scale · Radii & Elevation
- **Brand** — Impressionist Texture · Wordmark & Voice

---

## Components

Reusable primitives, from the source prototype's real inventory. Import from `window.TheEditDesignSystem_47ea0e` in card/kit HTML, or as `export`ed components in code.

**Actions**
- `Button` — pill action button (primary ink CTA / brand vermillion / secondary / ghost toggle).

**Forms & filters**
- `SearchField` — rounded card-surfaced feed search input.
- `Chip` — category filter pill (ink-filled when active).
- `ColorDot` — palette-filter swatch with active ring.

**Display**
- `CanvasSwatch` — **the signature painted color field** (pointillism + sheen + optional wash).
- `ProductCard` — core feed unit: swatch image, save heart, drop badge, brand/title/price.
- `BoardCard` — mood-board tile with a 3-panel painted cover.
- `BrandRow` — brand-shelf list item with follow toggle.
- `Badge` — compact mono tag (price drop, NEW, status).
- `Avatar` — round initials chip.

**Navigation**
- `TabBar` — bottom navigation (feed / search / boards / shelf), built-in SVG icons.

**Feedback**
- `Toast` — transient ink confirmation pill.
- `BottomSheet` — bottom-anchored modal with scrim + grab handle (Save to board).

*Intentional additions beyond the raw prototype:* **CanvasSwatch** was factored out as its own primitive to make the Impressionist motif reusable, and **Badge / Avatar** were named as standalone primitives (they appear inline in the prototype). No component here lacks a counterpart in the source.

---

## UI kits

- **`ui_kits/the-edit-app/`** — a full interactive recreation of The Edit mobile app, composing the components above. Feed (palette + category filter, masonry), Search, product Detail with "More like this", Boards (open a board), Shelf (price drops + follow), and the Save-to-board sheet with toasts. `index.html` is the interactive entry; `App.jsx`, `PhoneFrame.jsx`, `data.js` are the parts.

---

## Repository index

```
styles.css                      Global entry — @imports every token + font file (link this)
tokens/
  fonts.css                     Google Fonts import + family vars
  colors.css                    Pigments, tints, canvas neutrals, semantic aliases
  typography.css                Size ramp, weights, tracking, semantic type roles
  spacing.css                   4px grid, gutter, corner radii
  effects.css                   Elevation, motion, Impressionist texture tokens + .te-canvas
components/
  actions/     Button
  forms/       SearchField, Chip, ColorDot
  display/     CanvasSwatch, ProductCard, BoardCard, BrandRow, Badge, Avatar
  navigation/  TabBar
  feedback/    Toast, BottomSheet
guidelines/                     Foundation specimen cards (Colors / Type / Spacing / Brand)
ui_kits/
  the-edit-app/                 Interactive mobile-app recreation
SKILL.md                        Agent Skill wrapper (Claude Code compatible)
readme.md                       This file
```

Generated automatically (do not edit): `_ds_bundle.js`, `_ds_manifest.json`, `_adherence.oxlintrc.json`.

---

## Notes & caveats

- **Fonts** are loaded from **Google Fonts** (Archivo, Instrument Sans, Martian Mono, Newsreader) via `@import` in `tokens/fonts.css` — they are the intended families, so no local `@font-face` binaries are shipped. Consumers need network access to Google Fonts; provide self-hosted `.woff2` files if fully offline delivery is required.
- **No logo** in source — see Iconography. Provide a mark to replace the type lockups.
- The palette and Impressionist motif are this system's **interpretation** of the "bright, saturated, Impressionist" brief on top of the draft prototype. Confirm the pigment choices and texture intensity.
