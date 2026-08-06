# The Edit — app

Next.js 16 (App Router, TypeScript, CSS Modules) built on the design system
in [`../design`](../design).

```bash
npm run dev     # http://localhost:3000
npm run build
npm run lint
```

`app/page.tsx` is a component gallery: an app frame on the left exercising the
feed chrome, and specimen cards on the right for the rest of the inventory.

## Design system

`styles/design-system/` is a copy of `design/design-system/`. It is imported
once, in `app/layout.tsx`:

```tsx
import "@/styles/design-system/styles.css";
```

`styles.css` stays a manifest of `@import`s — no rules are added to it
directly. Components reference the tokens and never hardcode a colour.

### Two changes to the copied files

**`tokens/extensions.css`** (new, imported last) holds values the screens use
that the base tokens do not name — the idle glyph colour on glass controls, the
sheet scrim, the idle/active pill shadows, the palette selection ring, the
softened sheen, and a small type sub-scale for the sizes that fall between the
steps of the base ramp. Every value is lifted from
`design/screens/the-edit-app.dc.html`; nothing is invented. This follows the
design README's rule: if a value is missing, add it to the token file, not to
the component.

**`tokens/fonts.css`** has its remote `@import` disabled. Nested inside the
token manifest, it lands mid-file once the CSS is bundled — an invalid position
for `@import` — so it was being dropped and Archivo, Instrument Sans, Martian
Mono and Newsreader silently fell back to `system-ui`. `app/layout.tsx` loads
the same four families with `next/font/google` instead, and
`tokens/extensions.css` binds them back onto `--font-display`, `--font-sans`,
`--font-mono` and `--font-serif`. They are now self-hosted and preloaded, which
is what the design system's own notes ask for.

## Components

`components/`, exported from `components/index.ts`. Names and props follow the
design system; visual detail follows `the-edit-app.dc.html`, which the design
README names as the primary reference.

| Component | Props |
| --- | --- |
| `Button` | `variant` `primary\|brand\|secondary\|ghost`, `size` `sm\|md\|lg`, `full` |
| `Chip` | `label`, `active`, `dashed`, `onClick` |
| `ColorDot` | `color`, `active`, `size`, `label`, `onClick` |
| `CanvasSwatch` | `color`, `height`, `radius`, `caption`, `captionColor`, `wash` |
| `ProductCard` | `brand`, `title`, `price`, `was`, `color`, `caption`, `captionColor`, `height`, `saved`, `featured`, `line`, `onOpen`, `onSave` |
| `BoardCard` | `name`, `count`, `colors`, `note`, `onOpen` |
| `BrandRow` | `name`, `meta`, `color`, `following`, `onFollow` |
| `Badge` | `tone` `drop\|sale\|brand\|cobalt\|ink\|outline` |
| `Avatar` | `initials`, `size`, `color` |
| `TabBar` | `active`, `onChange`, `items` |
| `Toast` | `message` |
| `BottomSheet` | `open`, `title`, `onClose` |

### Where the screens and the bundled design system disagree

The screens win, per the design README. Worth knowing:

- **`ProductCard`** puts the save heart bottom-right on glass (the bundle has it
  top-right), and the drop badge is a white chip with brand text rather than a
  filled vermillion one — hence the `drop` tone on `Badge`.
- **`Chip`** is white and lifted when idle; the bundle uses the sunken grey.
- **`Button` `secondary`** is the white outlined pill the screens use for "Buy"
  and "Back", not the bundle's sunken grey.
- **`BrandRow`** is a bordered card row rather than a hairline-divided list, and
  "Following" is the ink-filled state.
- **`ColorDot`** is a rounded square carrying the pointillist texture, not a
  plain circle.

Props added beyond the bundle, because the screens need them: `ProductCard`
`featured` and `line` (the hero card at the head of a feed block), `BoardCard`
`note`, `Chip` `dashed`, `ColorDot` `label`, and a `you` glyph in `TabBar`.

### Notes

- `Toast` and `BottomSheet` position against the nearest positioned ancestor —
  keep them inside the app frame.
- Components taking handlers are `"use client"`. `CanvasSwatch`, `Badge`,
  `Avatar` and `Toast` are server-compatible.
- Colours are always tokens. Spacing uses the `--space-*` grid where it fits;
  the handful of off-grid paddings in the reference (5px, 9px, 11px) are kept
  literal rather than given tokens of their own.
