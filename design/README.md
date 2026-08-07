# Design source of truth — The Edit

**Read this before touching any styling. An earlier version of this file named the
wrong reference, and the app was built from it.**

## Which file wins

`screens/the-edit-FINAL-turn3.dc.html` is **the** visual reference. It is turn 3
of the design conversation and it is the direction to build.

`screens/the-edit-earlier-turn1.dc.html` is turn 1, superseded. Open it only to
see a screen turn 3 doesn't cover, and treat anything it shows as provisional.

Previews of each sit alongside them as `.webp`.

## What turn 3 changed, and why the app currently looks wrong

Turn 1 was "the full design-system treatment": Impressionist tints and the
pointillist texture on every painted surface, vermillion accent throughout.

Turn 3 pulled that back. Its own summary: *plain canvas, washed moments*.

The wash appears only where something is being celebrated or asked for — getting
started, the stylist, milestones. Everyday screens are clean white so the clothes
carry the colour. Product placeholders are tinted to the actual fabric colour, so
a look reads at a glance rather than being a decorative field. Search became its
own screen with three ways in: pieces, looks, and the brands you follow, which is
where price drops live. Looks behave like a deck you flip through, and starring
one makes home lean that way. Saving has three gestures: tap the heart for a
quick keep, hold the image and the boards come to you, double tap for full bleed.
Full-bleed browsing is a mode you flip into, not the default. Confirmations sit
on ink with a shadow so they never blend into the canvas.

So the fix to an app built from turn 1 is mostly subtraction: less texture, less
tint, more white, and the wash reserved for the few moments that earn it.

## The design system

`design-system/styles.css` is the single entry point. Import it once. Every
colour, size, radius and font is a CSS variable in `design-system/tokens/`.
Never hardcode a hex value in a component. If a value is missing, add it to
`tokens/extensions.css` with a name that fits the existing scheme.

Note that the token files were written alongside turn 1, so they lead with the
saturated pigments. Turn 3 leans on the `--tint-*` washes and plain white. The
tokens are still correct; the usage is what changed.

Type is Archivo for display, Instrument Sans for body and buttons, Martian Mono
for prices and uppercase eyebrow labels, Newsreader italic as a single accent
voice. Sentence case everywhere except the mono labels. No emoji.

## Components

Button, Chip, ColorDot, CanvasSwatch, ProductCard, BoardCard, BrandRow, Badge,
Avatar, TabBar, Toast, BottomSheet. `design-system/readme.md` has the props and
the behaviour notes.

## Screen priority

Feed, Product detail, Boards and board detail, Search, Shelf. Onboarding after
those — it is fully designed in turn 3 as "getting started, the washed screens"
and it is where the wash belongs.
