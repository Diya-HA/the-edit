# Catalogue survey

What five real brands actually contain, before any of it is seeded. Taken from
each brand's public `products.json` on 8 August 2026.

Five brands, 3,501 products, 1,161 distinct styles once colourways are
collapsed. Prices are the cheapest variant of each style, converted to USD at
fixed rates recorded below — not live ones. A demo catalogue needs one coherent
currency more than it needs today's mid-market rate.

| Brand | Aesthetic | Locale pinned | Prices in | Styles |
|---|---|---|---|---|
| Uskees | Quiet utility | `/en-us` | USD | 145 |
| Dôen | Soft romance | root | USD | 192 |
| Nagnata | Balletcore off duty | root | AUD → USD ×0.66 | 81 |
| Repetto | Balletcore off duty | `/en-us` | EUR → USD ×1.09 | 216 |
| Killstar | Whimsigoth | root | GBP → USD ×1.27 | 527 |

Currency was read from each storefront's `/cart.js`, not assumed. Repetto's
`/en-us` path translates the locale but still prices in EUR, which is the
geolocation trap the README already warns about.

## Slot coverage

Distinct styles per slot, colourways collapsed. `DRESS` is tracked separately
from `TOP` because a dress fills two slots at once and the assembler needs to
know not to add a bottom underneath it.

| Aesthetic | TOP | DRESS | BOTTOM | OUTER | SHOES | BAG | ACC | Labels |
|---|---|---|---|---|---|---|---|---|
| Quiet utility | 37 | — | 27 | 50 | — | 1 | 30 | 1 |
| Soft romance | 52 | 61 | 40 | 18 | 9 | 4 | 8 | 1 |
| Balletcore off duty | 116 | 7 | 43 | 7 | 92 | 16 | 16 | 2 |
| Whimsigoth | 140 | 138 | 79 | 28 | 27 | 37 | 78 | 1 |

Three of the four can now be dressed head to toe. Quiet utility covers 5 of 7:
Uskees sells no shoes and no dresses.

**Only Balletcore off duty can be dressed from more than one label.** Nagnata
and Repetto both contribute to TOP, DRESS, BOTTOM, OUTER and ACCESSORY, and
Repetto alone carries SHOES. Every other aesthetic has exactly one brand behind
it, so any outfit assembled inside it is a single-label lookbook rather than a
piece of curation. That is the argument for Balletcore as the demo aesthetic,
and it holds.

## Price coverage

Buckets are the onboarding question — *what counts as a lot for one piece* —
which offers $150, $300, $500 and no ceiling.

| Aesthetic | n | min | median | max | <$150 | <$300 | <$500 |
|---|---|---|---|---|---|---|---|
| Quiet utility | 145 | $18 | $98 | $380 | 77% | 97% | 100% |
| Soft romance | 192 | $32 | $298 | $2,998 | 8% | 55% | 82% |
| Balletcore off duty | 297 | $24 | $132 | $649 | 56% | 77% | 95% |
| Whimsigoth | 527 | $8 | $44 | $171 | 99% | 100% | 100% |

Median USD per slot, which is where the shape of it shows:

| Aesthetic | TOP | DRESS | BOTTOM | OUTER | SHOES | BAG | ACC |
|---|---|---|---|---|---|---|---|
| Quiet utility | 77 | — | 98 | 152 | — | 25 | 60 |
| Soft romance | 273 | 498 | 278 | 353 | 268 | 298 | 113 |
| Balletcore off duty | 116 | 251 | 139 | 317 | 343 | 117 | 44 |
| Whimsigoth | 44 | 57 | 49 | 79 | 114 | 64 | 38 |

### What this says

**Choosing an aesthetic currently chooses a price bracket.** The median piece
in Whimsigoth is $44; in Soft romance it is $298. That is a factor of seven, and
it is a property of the brands, not of the taste. Someone who answers "$150"
and picks Soft romance sees roughly 15 of 192 pieces. Someone who answers "no
ceiling" and picks Whimsigoth is shown nothing above $171.

So budget and aesthetic are not independent axes, which is what the onboarding
flow implies they are.

**And the answer is not stored.** `OnboardingScreen` records only the chosen
look; its own comment says the colours and the budget "have nowhere to live in
the v1 schema". The question is asked, shapes the copy on the next screen, and
is then discarded. The filter is decorative today regardless of what the
catalogue contains.

Two honest ways out, both cheap:

1. Persist a ceiling on `User` and filter the feed by it. Makes the question
   real, and makes the thinness of Soft romance under $150 visible — which is
   information, not a bug.
2. Cut the question. One fewer onboarding step, and nothing pretends to work.

A third option only if the first is taken: add a second, cheaper Soft romance
label so the bracket isn't determined by the aesthetic. That is more scraping,
and it is the only one of the three that cannot be done before the 14th
comfortably.

## Notes for whoever ingests this

**Dedupe has to be per brand.** `(brandId, title)` holds for Killstar, Nagnata,
Repetto and Uskees, where colourways share a title. It fails on Dôen, which
puts the colourway in the title — `JULIENNE TOP -- SALT` and `JULIENNE TOP --
OXFORD BLUE` are one style. Splitting on the `--` recovers it. Without that,
two colourways of one top pass straight into the same outfit, which is the
exact thing the head-to-toe rules were added to stop.

**Slot has to come from somewhere different per brand.** Killstar, Nagnata and
Repetto put a usable garment noun in `product_type` (`Boots`, `Bottoms`,
`Ballerines`). Dôen's `product_type` is the season — `FALL 26` — so its slot
has to come from the title.

**Repetto carries no colour field at all.** Only `Size` options; colour lives
in the French handle, between the model name and the reference code
(`boots-phoebe-camel-cuba-velours-v690vavld-387`). Recoverable for 766 of its
1,025 products, but it strictly fails the "colour present in the data"
criterion, and it is the one brand here whose ingest would break silently if
they changed their handle format.

**Nagnata is mostly sold out** — 726 of 965 products have no available variant.
The 81 styles that remain are real, but it is a thinner brand than its
catalogue size suggests.

**Dôen's ceiling is $2,998.** Next to Killstar's $8 pieces in a mixed feed that
will read as a bug. Worth a cap.
