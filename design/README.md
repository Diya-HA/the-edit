# Design source of truth — The Edit

This folder is the visual reference for the app. If a screen in the built app
disagrees with something in here, this folder wins.

## What's in here

```
screens/
  the-edit-app.dc.html          Newer, fuller design. THE primary reference.
  the-edit-mobile-ui.dc.html    Earlier wireframe pass. Use for screens the app file doesn't cover.
  *-preview.webp                Static previews, so you can see the look without opening the HTML.
  support.js, image-slot.js     Runtime the two HTML files need. Don't edit.
  _ds/                          Copy of the design system, so the HTML opens standalone.

design-system/
  styles.css                    Single entry point. Import this and nothing else.
  tokens/                       colors, typography, spacing, effects, fonts.
  readme.md                     Voice, layout rules, component inventory, do's and don'ts.
```

## The look, in one paragraph

Pure white canvas, cool near-black ink (`#0E0E10`). Colour comes from soft
pigment washes (the `--tint-*` variables) used as large fields, with the full
saturated pigments held back for accents. Vermillion `#FF3B24` is the brand
accent. Type is Archivo for anything display, Instrument Sans for body and
buttons, Martian Mono for prices and small uppercase eyebrow labels, Newsreader
italic as a single accent voice. Feed is a two-column masonry with varied card
heights. Product images are painted colour fields with a fine pointillist
texture over them, not photos. Sentence case everywhere except the mono eyebrow
labels. No emoji.

## Rules for building the app from this

Use the design tokens as CSS variables. Import `design-system/styles.css` once
in the root layout and reference `var(--tint-rose)`, `var(--type-h1)` and so on.
Do not hardcode hex values in components, and do not invent new ones — if a
colour is missing, add it to the token file, not to the component.

The design system's component list (Button, Chip, ColorDot, CanvasSwatch,
ProductCard, BoardCard, BrandRow, Badge, Avatar, TabBar, Toast, BottomSheet) is
the component inventory for the app. Build React versions with those names and
those props.

Screens to build, in priority order: Feed, Product detail, Boards, Board detail,
Search, Shelf. Onboarding last — it's designed but it isn't what gets demoed.
