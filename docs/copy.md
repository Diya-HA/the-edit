# Copy list

Every user-facing string in the app, current and proposed. **Nothing here has
been applied.** Read it, strike out what you disagree with, and I will change
only what survives.

## How to read it

**★ marks the first thirty seconds** — what a stranger reads between opening
the link and deciding whether this is worth their time. Three screens carry
almost all of it: the welcome, home, and the first product they tap. Twenty-
eight rows are starred. If your time is short, read those and the four
**⚠ honesty** rows.

**⚠ honesty** marks a string that says something untrue about what the app
does. Those are not tone problems and I would fix them regardless of the rest.

**Keep** in the proposed column means I checked it against the voice rules and
it already holds. Most of the app does; the copy was written carefully. It is
listed anyway so you can see what was looked at rather than only what changed.

## The rules being applied

From `design/design-system/readme.md`, plus the polish brief:

- Editorial, confident, warm — a stylist friend, not a salesperson
- Short, declarative sentences
- Speaks to **you**; the brand rarely says "we"
- Sentence case everywhere except mono eyebrow labels
- **No emoji.** The only glyphs are functional: ♥ ♡ ✓ ✕ ＋ ‹ › ↓
- **No exclamation marks**, no hype. A drop is stated calmly
- Tone words: cohesive, curated, edit, look, palette, board, drop

---

## ⚠ The four honesty problems

Worth deciding on these first, because two of them are not copy fixes at all.

| # | Where | The problem |
|---|---|---|
| 1 | Welcome, step 1 ★ | "Type it however it comes out. Half formed is completely fine and rambling is encouraged." There is **nothing to type into** — the box below it is a `<p>` holding an example, not an input. The first thing the app says to a stranger is an invitation it cannot honour. |
| 2 | Search ★ | "Everything in your size" heads the results. The app holds **no size data** and filters nothing by size. |
| 3 | Boards | The Sizes row reads `S · 27 · 38 ›` as though those are yours. They are hardcoded, and tapping says "Sizes are coming". |
| 4 | Product | "Buy" goes nowhere — it toasts "Off to {brand} to finish up" and stays put. `productUrl` is in the database and unused. |

**1 and 2 I would fix in copy today** — proposed wording below. **3 and 4 are
features pretending to exist**, and the honest options are to build them or
remove them. My recommendation: make Buy a real link (the URL is already
there, it is a one-line change), and take the invented sizes off the row until
there is somewhere to store them.

---

## ★ Welcome — step 1

The first screen. Every string here is in the first ten seconds.

| Current | Proposed | Why |
|---|---|---|
| ★ What are you into right now? | Keep | Warm, direct, sounds like a person. |
| ★ ⚠ Type it however it comes out. Half formed is completely fine and rambling is encouraged. | **Not sure? Here is the kind of thing that helps.** | The current line promises a text box that does not exist. This introduces the example as an example. If you would rather keep the invitation, the fix is to build the input, not to reword it. |
| ★ "Soft and a bit undone. Lots of layers in warm neutrals with one thing that's butter yellow." | Keep | Good example. Reads like a person, not a brief. |
| ★ Or pinch one to start | **Or start from one of these** | "Pinch" is a gesture instruction, and these are taps. Charming but it asks the reader to decode it in the first ten seconds. |
| ★ Next | Keep | |
| ★ Skip | Keep | Now genuinely skips rather than accepting defaults. |

## ★ Welcome — step 2

| Current | Proposed | Why |
|---|---|---|
| ★ Which colours | **Which colours pull you in?** | The other two steps are questions; this one is a fragment. |
| ★ Pick a few. Nothing is permanent and taste wanders. | Keep | The best line in the flow. |
| ★ What counts as a lot for one piece? | Keep | Clear, and it now does something. |
| $150 / $300 / $500 / No ceiling | Keep | |
| Back | Keep | |

## ★ Welcome — step 3

| Current | Proposed | Why |
|---|---|---|
| ★ Nice eye! | **Nice eye.** | No exclamation marks. |
| ★ It's all yours. | Keep | |
| ★ Everything in here was picked to sit next to everything else. Keep what you love and it gets sharper by the day. | Keep | This is the pitch, in the product's voice. |
| ★ Your first look | Keep | Mono eyebrow. |
| ★ Take me in | Keep | |

## ★ Home

| Current | Proposed | Why |
|---|---|---|
| ★ THE EDIT | Keep | Wordmark. |
| ★ PALETTE | Keep | Mono eyebrow. |
| ★ Soft romance / Quiet utility / Balletcore off duty / Whimsigoth | Keep | |
| ★ {Look} runs expensive. Under $150 there are twelve pieces. | Keep | Says the true thing plainly. |
| ★ Raise it | Keep | |
| ★ Try {Look} | Keep | |
| Nothing in this colour yet | Keep | |
| Bit of a niche request. Try another swatch, or clear it and see the whole look. | **Try another swatch, or clear it and see the whole look.** | "Bit of a niche request" gently blames the reader for a filter the app offered. Now rare anyway — the palette only shows colours the look contains. |
| Clear the palette | Keep | |

## ★ Product detail

| Current | Proposed | Why |
|---|---|---|
| ★ Keep it ♡ | Keep | ♡ is a functional glyph, and this is the save control. |
| ★ Buy | Keep the word | ⚠ but make it go to `productUrl`. See honesty #4. |
| ★ Off to {brand} to finish up | Keep | Good line — worth keeping when Buy becomes real. |
| ★ Sits well with | Keep | |
| Back | Keep | `aria-label`. |
| ★ {line} {why} — e.g. "Thrown on, and the outfit is finished. Straight lines and aqua, which stays out of the way." | See **Generated product copy** below | Two generated sentences joined. The seam sometimes reads oddly. |

## Search

| Current | Proposed | Why |
|---|---|---|
| Look for something | Keep | |
| A piece or a label or a whole mood | Keep | Sets up that mood-search is intended. |
| Getting saved · sample data | Keep | Says plainly that it is not a measurement. Rare and good. |
| ⚠ Everything in your size | **Everything in the edit** | There is no size data. |
| Matching "{query}" | Keep | |
| Pieces / Outfits / Brands | Keep | |
| Nothing matched that | Keep | |
| Try fewer words. The outfits are a good way in when a search comes up short. | Keep | |
| Show the outfits | Keep | |

## Search — outfits

| Current | Proposed | Why |
|---|---|---|
| All looks | Keep | |
| Save this outfit | Keep | |
| {n} pieces · ${total} | Keep | |
| No outfits in this look | Keep | |
| They arrive as the pieces do. The other looks have some already. | Keep | |

## Search — brands

| Current | Proposed | Why |
|---|---|---|
| Follow a label and its new pieces turn up first. Browse by what it stocks, what it costs, or what has just landed. | **Follow a label and its new pieces turn up first.** | Two sentences where one does the work; the second describes the controls sitting directly beneath it. |
| No labels here | Keep | |
| Nothing matches that price in that look. A wider price usually finds them. | Keep | |
| Clear the filters | Keep | |

## Boards

| Current | Proposed | Why |
|---|---|---|
| {n} boards · {n} pieces | Keep | |
| Settings | Keep | |
| ⚠ Sizes — S · 27 · 38 | **Sizes — Not set** | Invented data presented as the shopper's own. |
| Sizes are coming | Keep | Honest about it. |
| What counts as a lot — $300 | Keep | Real now. |
| What counts as a lot? | Keep | Sheet title. |
| Redo the welcome | Keep | |
| Sign out | Keep | |
| There is only one account for now | Keep | Says the true thing lightly. |
| No boards yet | Keep | |
| Heart something you like and it will start one for you. | Keep | |
| Find something to keep | Keep | |

## Board detail

| Current | Proposed | Why |
|---|---|---|
| Nothing on this board | Keep | |
| Keep something you like and it lands here. | Keep | |

## Save sheet

| Current | Proposed | Why |
|---|---|---|
| Where's it going? | Keep | |
| ＋ New board | Keep | |
| A new board, named after the outfit | Keep | |

## Toasts

The app's running commentary. These are the strings most likely to be read out
of context, so each has to stand alone.

| Current | Proposed | Why |
|---|---|---|
| ★ Saved ✓ | Keep | |
| Yours now ♥ | Keep | The milestone, roughly every twentieth save. |
| Saved to {board} ✓ | Keep | |
| Removed from {board} | Keep | |
| Following. You'll know before they announce it | Keep | Best toast in the app. |
| Unfollowed {brand}. No hard feelings | Keep | |
| Noted! More of that on the way | **Noted. More of that on the way** | No exclamation marks. |
| Fair enough. Easing off {look} | Keep | |
| {Look} it is. Home just changed ♥ | Keep | |
| {Look} it is ♥ | Keep | End of the welcome. |
| Under $150 from now on | Keep | |
| No ceiling. Everything is in the feed | Keep | |
| Sizes are coming | Keep | |
| There is only one account for now | Keep | |

## Not found, errors, offline

| Current | Proposed | Why |
|---|---|---|
| Not here | Keep | Mono eyebrow. |
| This one has gone | Keep | |
| Pieces come and go as brands sell through. The rest of the edit is where you left it. | Keep | Explains without apologising. |
| Back to the feed / Look for something else | Keep | |
| Something slipped | Keep | |
| That didn't load | Keep | |
| Not your doing. Try it again, and if it keeps happening the feed is still there. | Keep | |
| Try again | Keep | |
| No connection. What's here still works. | Keep | |

## Alt text

Currently `{title} — {category} by {brand}`, which for most pieces repeats
itself: **"Overshirt — overshirt by Uskees"**. The brief asks for alt text that
describes the garment usefully rather than restating the title.

| Current | Proposed |
|---|---|
| Overshirt — overshirt by Uskees | **Uskees overshirt in indigo** |
| Demi-Pointes - semelle entière — demi-pointes by Repetto | **Repetto demi-pointes in rose** |

Pattern: `{brand} {title}, {colour}` — dropping the category when the title
already contains it, which is most of the time. The colour is the thing a
photograph carries that the title often does not.

There is a further option worth considering: every piece has a measured
`packshotScore`, so the app knows whether its photograph is a plain packshot or
a lifestyle shot. Alt text could say which — "photographed on a plain ground"
versus "worn". Genuinely more useful to a screen reader, and free. Say if you
want it and I will add it.

## Generated product copy

Not hand-written. Every piece gets one `line` and one `why`, picked
deterministically from these banks at ingest, so the same piece always reads
the same. They appear together on the product screen, in that order.

The rule I followed writing them: they have to be true of **anything** they
land on. No claim about the shopper's boards, no "you keep saving cardigans" —
invented familiarity is worse than none.

### Lines, by slot

| Slot | Lines |
|---|---|
| TOP | Works on its own and under everything else. · The layer the rest gets chosen around. · Plain enough to wear twice a week. |
| DRESS | One decision, whole outfit. · Moves well, which is most of the work. · The piece everything else answers to. |
| BOTTOM | Cut straight and worn loose. · Gets better the more it creases. · Holds its shape all week. |
| OUTER | Goes over the lot without swamping it. · Thrown on, and the outfit is finished. · Cut short so it clears everything underneath. |
| SHOES | Quiet on their own, loud with a long skirt. · Sturdy enough to walk home in. · The pair that survives the whole season. |
| BAG | Carries the week without trying. · Big enough for the days that need it. · Nothing about it asks for attention. |
| ACCESSORY | The small thing that changes the outfit. · Cheap in the best way. · Makes the rest look deliberate. |

**One I would change:** "Cheap in the best way" lands on a $44 Repetto
accessory and on a $17 headband alike, and on the dearer one it reads as a
misjudgement. Proposed: **"Small, and it changes everything."**

**One to check:** "Cut short so it clears everything underneath" is true of a
cropped jacket and false of a long coat, and OUTER holds both.

### Why lines, by aesthetic

`{c}` is the colour word — "camel", "noir", "sage".

| Aesthetic | Lines |
|---|---|
| Quiet utility | Straight lines and {c}, which stays out of the way. · Workwear cut clean, in a {c} that ages well. |
| Soft romance | Warm neutrals and one soft colour — here it is {c}. · {C}, soft enough to sit under everything. |
| Balletcore off duty | Wrap knits and flats, in a {c} that keeps it off duty. · Built to move in, and {c} keeps it quiet. |
| Whimsigoth | Velvet and moons, grounded by {c}. · Dark and a bit theatrical, in {c}. |

**Known rough edge:** the colour word comes from the brand's own vocabulary, so
{c} is sometimes a phrase rather than a colour — "bleu paon", "ristretto". Most
read fine. A few do not: "Straight lines and marble, which stays out of the
way."

### Outfit names and notes

Seeded outfits only; the demo's live outfit is named by the skill at runtime.

| Name | Note |
|---|---|
| Monday, and it holds | Straight lines and pockets, nothing asking for attention. |
| Cord and canvas | Two heavy weaves and a colour that stays put. |
| Sunday, slowly | Soft cloth in warm neutrals, with one colour doing the talking. |
| The good linen | Everything here creases, and that is the point. |
| Class, then the rest of the day | Wrap knits over a leotard and flats you can actually walk in. |
| Off duty, still on pointe | Ribbed knit and ribbon, kept quiet enough for daylight. |
| Long way home | Velvet and mesh, romantic rather than heavy. |
| Moons and mesh | Dark, a bit theatrical, entirely wearable. |

All keep. These are the strings people quote back.

## Aesthetics and brands

| Name | Description | Proposed |
|---|---|---|
| Soft romance | Warm neutrals and one soft colour | Keep |
| Quiet utility | Workwear cut clean | Keep |
| Balletcore off duty | Ribbons and wrap knits and flats | Keep |
| Whimsigoth | Velvet and crochet and moons | Keep |

| Brand | Shelf line | Proposed |
|---|---|---|
| Uskees | Quiet utility, strictly. Drill, cord and linen, built for work. | Keep |
| Dôen | Soft romance, at the top of the range. Silk, cotton and lace. | Keep |
| Nagnata | Balletcore off duty. Ribbed knit built to move in. | Keep |
| Repetto | Balletcore off duty, from the source. Flats, leotards and wrap tops. | Keep |
| Killstar | Whimsigoth, head to toe. Velvet, mesh and moons, rarely over $100. | Keep |

"Rarely over $100" is checkable and true. Of the 42 Killstar pieces in the
catalogue the median is $25 and the dearest is $146; across their whole range
of 609 styles the median is $44 and the ceiling $171.

## Metadata

Read on a shared link rather than in the app.

| Where | Current | Proposed |
|---|---|---|
| Page title | The Edit | Keep |
| Description | One aesthetic, every brand. | Keep |
| Manifest name | The Edit | Keep |
| Open Graph title | The Edit | Keep |
| Open Graph image | THE EDIT / One aesthetic, every brand. | Keep |

## Dead copy

`components/TabBar.tsx` carries labels **Feed**, **Search**, **Boards**,
**Shelf**. The app renders `AppNav`, which uses **Home**, **Search**,
**Boards**. So "Feed" and "Shelf" are strings for a shelf tab that no longer
exists. Nobody sees them; worth deleting so the next person does not have to
work out which nav is real.

---

## Counts

149 rows across the tables. 28 in the first thirty seconds. 4 honesty problems.
Nine wording changes proposed, of which two are exclamation marks and two are
statements that are not true. Everything else holds up — the copy was written
carefully and most of it needs nothing.
