# Polish brief — make The Edit look like a real product

This is a standing brief. Work through it in order, in the background, without
stopping for approval between items unless something here says to stop.

The goal is not "done". The goal is that someone who opens this on their phone
assumes it's a shipped app from a company with a design team. Demo Day is Friday
14 August and the audience is a room of people who have all built something this
week, so the bar is craft, not completeness.

---

## Standing rules

**Design source of truth.** `design/README.md` first, then
`design/screens/the-edit-FINAL-turn3.dc.html`. Turn 1 is superseded. Turn 3's
summary of itself is *plain canvas, washed moments* — white everyday screens so
the clothes carry the colour, painterly wash only on the welcome, the stylist and
milestones.

**Tokens, always.** Every colour, size, radius, shadow and font comes from
`styles/design-system/tokens/`. No hardcoded hex, rgb or hsl in any component. If
a value is missing, add it to `tokens/extensions.css` with a name that fits the
existing scheme, and mirror it back into `design/design-system/` so the source
stays the source.

**Verify by driving, not by reasoning.** Every claim you make should come from
having run it — a browser screenshot, a measured value, a database row, an HTTP
response. Two failures this week were invisible to code inspection and obvious on
screen. Prefer a screenshot over a passing type check.

**Keep `main` deployable.** Work on branches, open PRs in reviewable chunks, and
never merge. Diya merges. She may need to demo from `main` at any moment.

**The container's four paths.** The Dockerfile copies only `.next/standalone`,
`prisma/`, `node_modules/prisma` and `node_modules/@prisma`. Anything the start
command touches must live under one of those. Do not modify the Dockerfile.
Prisma stays pinned at exactly `6.3.1`.

**Voice.** Editorial, warm, confident — a stylist friend who is glad you're here.
Sentence case everywhere except mono eyebrow labels. No emoji. No exclamation
marks. No hype words. Short declarative sentences. `design/design-system/readme.md`
has the full rules; follow them for every string you write.

**Ask before schema changes.** Anything that needs a migration, stop and say so
first.

---

## Phase 1 — Real clothes

Right now product images are painted colour fields. That reads as a wireframe.
The design system anticipated this: photography replaces the fill, the pointillist
texture stays as a light overlay so it still looks like The Edit.

1. Render `imageUrl` when a product has one, with the painted swatch as fallback.
   Configure Next's image remote patterns for the brand CDNs. Keep the texture as
   a subtle overlay over photography, not instead of it.
2. Hold the aspect-ratio rule regardless of source image shape: 1:1, 4:5 and 3:4
   only, never landscape. Crop, don't letterbox. Choose the crop so the garment
   stays centred.
3. Make the catalogue real. Find two or three more brands using the criteria that
   worked for Uskees: agent-friendly robots.txt, server-rendered listing page,
   colour present in the data, and a range that genuinely lands inside one of the
   four aesthetics. Cover all four. Tell Diya which brands and why before
   scraping.
4. Rebuild the seed from scraped data and retire the invented brands. Every
   product should have a real photo, a real price and a real link.
5. Keep the seed idempotent, keep it under the four paths, and keep the run
   loggable.

**Stop and report after this phase.** It changes what the whole app looks like.

---

## Phase 2 — Visual craft

This is the phase that separates a student project from something that looks
bought. None of it is individually visible; all of it is collectively obvious.

**Typography.** Tabular figures for all prices so columns don't jitter. Optical
tracking on large display type — Archivo needs negative tracking at size and
looser at small. No widows on headings or two-line product titles. Consistent
truncation: a product title that overflows should ellipsis on a fixed line count,
never reflow the card.

**Spacing rhythm.** ~~Audit every screen against the 4px grid and the
`--gutter`.~~ **Corrected 14 August.** This asked for the wrong thing, and it
would have made the app disagree with its own source of truth.

The design is not on a 4px grid and never was. The turn 3 file uses 10px 26
times, 9px 23 times, 11px 21 times and 6px 25 times, and `--gutter` is itself
18px. Auditing the app onto a 4px scale would have meant rewriting spacing
*away* from the design this brief names as the source of truth two sections
above.

The rhythm is optical, and optical wins. So: rhythm between sections should be
consistent rather than incidental, and every value should come from a token —
but the scale is the design's, not an arithmetic one imposed on top of it. If a
true 4px system is ever wanted, it is a change to make in `design/` first and
transcribe from there, never the other way round.

**Imagery treatment.** Consistent corner radius per surface type. No image
touching a screen edge unless it's meant to be full-bleed. Blur-up or dominant-
colour placeholder while an image loads, using the product's tint token so the
grid never flashes white. No layout shift when an image arrives.

**Motion.** Use the tokens: `--dur-fast/med/slow`, `--ease-out`, `--ease-inout`.
Buttons press to 0.97. Sheets slide up on ease-out. Toasts fade and rise. Cards
fade in as they enter the viewport, staggered slightly, once — not on every
scroll. Page transitions between tabs. Nothing bounces, nothing loops. Respect
`prefers-reduced-motion` and turn all of it off when set.

**Scroll.** Momentum feel on iOS, scroll restoration when going back from a
product to the feed, sticky header that behaves — either pinned or hiding on
scroll down and returning on scroll up, chosen deliberately. No scroll chaining
when a sheet is open.

**States.** Every interactive element needs idle, hover, focus, active and
disabled. Focus rings use `--focus-ring` and must be visible on keyboard but not
on mouse.

**The phone.** Safe-area insets so nothing hides under the notch or the home
indicator. A web app manifest, a real app icon at every required size, a theme
colour, and a splash screen, so "Add to Home Screen" gives a standalone app with
no browser chrome. A favicon. Open Graph tags with a decent preview image, since
the URL will get shared.

---

## Phase 3 — Every state, not just the happy one

Go through every screen and build the states that exist when things are empty,
slow or broken. These are where student projects fall apart in a live demo.

**Loading.** Skeletons that match the real card shapes and the real aspect
ratios, so nothing jumps when content arrives. No spinners in the feed.

**Empty.** Every list, filter combination and search that can return nothing
needs copy in the product voice and a way out. "Nothing in this palette yet — try
another colour" is the tone. Never a bare "No results".

**Error.** A failed image, a failed fetch, a product that no longer exists, a
board that was deleted. Each should degrade to something calm rather than a stack
trace or a blank screen.

**Edge content.** A twelve-word product title. A brand name with an ampersand. A
price of $1,240. A board with one item and a board with sixty. An aesthetic with
three products. Find these by making them, not by imagining them.

**Offline.** If the network drops mid-browse, the app should say so rather than
hanging.

---

## Phase 4 — Copy

Rewrite every string in the app against the voice rules. Onboarding questions,
button labels, empty states, error messages, toasts, section headers, brand
lines, the outfit notes, alt text.

Two specific things to fix: alt text should describe the garment usefully for
someone who can't see it, not repeat the title. And any remaining
price-drop-era language should go — there are still comments referencing it.

Produce the full list of every user-facing string as `docs/copy.md`, current and
proposed side by side, and show it to Diya before applying. She writes for a
living and will have opinions.

---

## Phase 5 — Accessibility and performance

Run a real audit, don't assert compliance.

Contrast every text colour against every surface it actually sits on, including
text over photography and text over the tint fields, to WCAG AA. Tap targets at
least 44px. Full keyboard path through every flow including the sheets. Screen
reader labels on icon-only buttons. `prefers-reduced-motion` honoured.

Then Lighthouse on mobile against the deployed site. Report the four scores.
Chase cumulative layout shift to near zero and first contentful paint under two
seconds, and say what you couldn't fix and why.

---

## Phase 6 — The demo

This is the one that can't slip.

1. Build the composed run: one non-interactive `claude -p` command that scrapes a
   brand with Playwright MCP, scores every garment with the `aesthetic-fit` skill,
   assembles everything scoring 85 or above into an outfit, and writes it through
   `prisma/outfits.ts` so it appears in the app. Idempotent, repeatable, and
   logging each piece as it's scored so there is something to watch.
2. Solve the database question first and tell Diya what you need. If the run
   writes to local Postgres, the deployed site won't change and the demo shows
   nothing. It needs to write to the platform database behind
   `theedit.apps.human-angle.com`. She has Azure portal access. If it can't be
   done safely, say so and plan a localhost demo instead, but decide it now.
3. Write `docs/DEMO.md` as a runbook for someone nervous reading a phone. Exact
   commands in order. How to reset to a clean state. What should appear on screen
   at each step and roughly when. What to do if the scrape returns nothing or the
   run hangs. An offline fallback — a recorded run or pre-scraped data — so it
   works if the wifi dies.
4. Rehearse it yourself end to end from a clean state, in exactly the mode it
   will be run in, and report how long it takes.

---

## How to report back

Keep it short and evidence-led. For each phase: what changed, what you verified
and how, screenshots of anything visual, and anything you decided that Diya
should overrule if she disagrees.

Produce a screenshot set of every screen at phone width and put it in
`docs/screens/`, refreshed at the end of each phase, so she can review the app
without running it.

Flag anything that would need a schema change, anything that would touch the
Dockerfile, and anything you think is wrong with this brief. If a later phase
would undo an earlier one, say so rather than doing both.
