# Catalogue survey

What five real brands actually contain, before any of it is seeded.

The numbers move every time a brand is added or a storefront restocks, so they
are generated rather than typed:

```bash
node --experimental-strip-types scripts/survey-catalogue.ts
```

That rewrites everything between the markers below and leaves this prose alone.
It surveys everything the brands carry, not the subset the seed plants — the
question it answers is what there is to curate from.

Currency was read from each storefront's `/cart.js`, never assumed. Conversion
rates are fixed rather than live: a demo catalogue needs one coherent currency
more than it needs today's mid-market rate, and a figure that moves on every run
is worse than one that is stated. Prices already in USD are left exactly alone;
converted ones are rounded to whole dollars, because carrying false precision
through only makes the feed look broken.

<!-- BEGIN GENERATED -->

Taken on 2026-08-15 from each brand's public
`products.json`. 3,500 products,
1,146 distinct styles once colourways are collapsed.

| Brand | Aesthetic | Locale | Prices in | Styles |
| --- | --- | --- | --- | --- |
| Uskees | Quiet utility | `/en-us` | USD | 67 |
| Dôen | Soft romance | root | USD | 213 |
| Nagnata | Balletcore off duty | root | AUD → USD ×0.66 | 71 |
| Repetto | Balletcore off duty | `/en-us` | EUR → USD ×1.09 | 186 |
| Killstar | Whimsigoth | root | GBP → USD ×1.27 | 609 |

### Slot coverage

Distinct styles per slot. `DRESS` is tracked apart from `TOP` because a dress
fills two slots at once and the assembler needs to know not to put a bottom
underneath it; the schema stores it as `TOP`.

| Aesthetic | TOP | DRESS | BOTTOM | OUTER | SHOES | BAG | ACCESSORY | Labels |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Quiet utility | 20 | — | 16 | 17 | — | 1 | 13 | 1 |
| Soft romance | 58 | 71 | 42 | 20 | 7 | 3 | 12 | 1 |
| Balletcore off duty | 102 | — | 45 | 7 | 76 | 16 | 11 | 2 |
| Whimsigoth | 164 | 204 | 57 | 29 | 31 | 38 | 86 | 1 |

Slots more than one label can fill — the ones where an assembled look is
curation rather than a single brand's lookbook:

- **Quiet utility** — covers 5/7, contested: none
- **Soft romance** — covers 7/7, contested: none
- **Balletcore off duty** — covers 6/7, contested: TOP, BOTTOM, OUTER, ACCESSORY
- **Whimsigoth** — covers 7/7, contested: none

### Price coverage

Cheapest variant per style, in USD. The buckets are the onboarding question —
*what counts as a lot for one piece* — which offers $150, $300, $500 and no
ceiling.

| Aesthetic | n | min | median | max | <$150 | <$300 | <$500 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Quiet utility | 67 | $18 | $70 | $380 | 82% | 99% | 100% |
| Soft romance | 213 | $23 | $298 | $2,998 | 8% | 54% | 83% |
| Balletcore off duty | 257 | $17 | $153 | $872 | 49% | 77% | 87% |
| Whimsigoth | 609 | $8 | $44 | $171 | 99% | 100% | 100% |

Median per slot, which is where the shape of it shows:

| Aesthetic | TOP | DRESS | BOTTOM | OUTER | SHOES | BAG | ACCESSORY |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Quiet utility | $75 | — | $61 | $125 | — | $25 | $60 |
| Soft romance | $268 | $498 | $278 | $353 | $298 | $298 | $68 |
| Balletcore off duty | $147 | — | $147 | $307 | $463 | $180 | $40 |
| Whimsigoth | $38 | $44 | $49 | $83 | $102 | $64 | $38 |

### What the seed plants

The survey above is what there is to curate from. This is the 142
pieces actually chosen for the app — up to six per slot per aesthetic, spread
across brands and colour families. Dresses are stored as `TOP`.

| Aesthetic | TOP | BOTTOM | OUTER | SHOES | BAG | ACCESSORY | Labels | Packshot |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Quiet utility | 6 | 6 | 6 | — | 1 | 6 | 1 | 100% |
| Soft romance | 12 | 6 | 6 | 6 | 3 | 6 | 1 | 13% |
| Balletcore off duty | 6 | 6 | 6 | 6 | 6 | 6 | 2 | 61% |
| Whimsigoth | 12 | 6 | 6 | 6 | 6 | 6 | 1 | 45% |

| Aesthetic | n | min | median | max | <$150 | <$300 | <$500 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Quiet utility | 25 | $18 | $49 | $95 | 100% | 100% | 100% |
| Soft romance | 39 | $23 | $248 | $498 | 31% | 87% | 100% |
| Balletcore off duty | 36 | $17 | $98 | $383 | 78% | 89% | 100% |
| Whimsigoth | 42 | $6 | $25 | $146 | 100% | 100% | 100% |

<!-- END GENERATED -->

## What this says

**Only Balletcore off duty can be dressed from more than one label.** Nagnata
and Repetto both reach most of its slots, and Repetto alone carries its shoes.
Every other aesthetic has a single brand behind it, so any outfit assembled
inside it is that brand's lookbook rather than a piece of curation. That is the
argument for Balletcore as the demo aesthetic, and the data holds it up.

**Choosing an aesthetic currently chooses a price bracket.** The median piece in
Whimsigoth is a fraction of the median piece in Soft romance, and that is a
property of the brands rather than of the taste. Someone who answers "$150" and
picks Soft romance sees almost nothing. Someone who answers "no ceiling" and
picks Whimsigoth is never shown anything expensive. Budget and aesthetic are not
independent axes, which is what the onboarding flow implies they are.

**And the answer is not stored.** `OnboardingScreen` records only the chosen
look; its own comment says the colours and the budget "have nowhere to live in
the v1 schema". The question is asked, shapes one line of copy, and is then
discarded — so the filter is decorative today regardless of what the catalogue
holds.

## Notes for whoever ingests this

**Dedupe has to happen per brand, at ingest.** `prisma/outfits.ts` refuses two
colourways of one style in a look and recognises them by `(brandId, title)`.
That holds for brands which repeat a title across colourways and breaks on the
ones that write the colour into it — Uskees (`… - vine green`) and Dôen
(`… -- SALT`). Stripping the colourway from the title during classification
makes the assumption true for every brand, so the rule keeps working without
`outfits.ts` having to learn about brands.

**Slot comes from a different field per brand.** Killstar, Nagnata, Repetto and
Uskees put a real garment noun in `product_type` (`Boots`, `Bottoms`,
`Ballerines`), and that noun is trusted before the title is even read — titles
like "Short-sleeve power tools t-shirt" have half the slot vocabulary hiding in
them. Dôen's `product_type` is the season (`FALL 26`), so it goes the other way.

**Repetto is the fragile one.** It publishes no colour field at all — not an
option, not a tag. Colour is recovered from the French handle, between the model
name and the reference code:

```
boots-phoebe-camel-cuba-velours-v690vavld-387
```

That works for about three quarters of its catalogue and it will fail silently
rather than loudly if Repetto ever changes that format: the ingest will simply
start dropping pieces for "no colour could be read" while everything else
carries on looking healthy. It is the one brand here whose breakage would not
announce itself.

**Nagnata is mostly sold out.** Roughly three quarters of its products have no
available variant. What remains is real, but it is a thinner brand than its
catalogue size suggests.

**Dôen's ceiling is near $3,000.** Beside Killstar's $8 pieces in a mixed feed
that reads as a bug rather than a range. Worth a cap.

**Repetto sells performance kit.** It is a dance house, and "Balletcore off
duty" is by its own name street clothes borrowing from ballet — a tutu is the
one thing it is not. Classification drops literal costume and keeps leotards and
soft ballet flats, which are the aesthetic. That guardrail is deliberately
narrow: judging the rest of a line is the `aesthetic-fit` skill's job, not a
regular expression's.
