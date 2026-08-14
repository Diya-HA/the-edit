# Demo runbook

Read this on the day. Commands in order, what should happen, what to do when
it doesn't.

**One sentence, if you forget everything else:** the app is already live at
`theedit.apps.human-angle.com` — the demo just adds a live-scraped outfit to
it. If the run fails, the site is still there and still works.

Last rehearsed end to end on **14 August 2026**, against the five-brand
catalogue. Timings below are from that rehearsal, not estimates.

---

## Before you start

- [ ] Docker Desktop running — and **not paused**, which is a separate thing
      and looks identical until a command fails
- [ ] Terminal open in the repo
- [ ] Browser open at `theedit.apps.human-angle.com`
- [ ] Second browser tab at `localhost:3000`
- [ ] Wifi working — if not, jump to **Offline fallback**

Time: about **4 minutes** total. The run itself is **2m30s**, and a repeat run
is the same.

---

## Step 0 — reset to a clean state · ~50s

```bash
cd ~/Development/App_Building/the-edit
docker compose up -d
npx prisma migrate reset --force
```

**On screen:** Prisma drops and recreates the database, applies the migrations,
then runs the seed. Ends with `saved items 14`.

That is your clean state: **5 real brands, 143 pieces, 8 outfits.**

```bash
npm run dev
```

**On screen:** `Ready in …`. Leave this running in its own tab.

Check `localhost:3000` → **Search → Outfits**. You should see **8 outfits**.
That's the "before".

Uskees is already in that catalogue — 25 pieces of it. The demo is not adding a
brand from nothing; it is going to today's live listing, scoring what is on it,
and building a look that did not exist. Which is the more honest claim anyway.

---

## Step 1 — the composed run · 2m30s

Open a **second terminal tab** (leave `npm run dev` alone).

```bash
cd ~/Development/App_Building/the-edit
./scripts/demo.sh
```

**What should appear, roughly in this order:**

| When | What |
|---|---|
| 0:00 | The header block — target, catalogue, collection, threshold |
| 0:10 | A Chrome window opens by itself and loads the Uskees all-clothing page |
| 0:40 | `scraped 20 garments`, then a line naming the kinds it saw |
| 0:50 | Scores print, one line per garment |
| 1:40 | `11 of 20 above 85`, then a line of slot counts |
| 2:00 | Two or three tool calls to `the-edit` — products, a catalogue search, the outfit |
| 2:20 | The outfit name, which pieces came from the scrape and which from the shelf, and a URL |
| — | `finished in NNNs` |

**The bit worth narrating while it runs.** Two things, and the second is the
better one.

First: the scores are not a filter on colour names. Find a piece in the 90s and
one that fell short and read out the two `WHY` lines — that is the skill
discriminating.

Second, and this is the actual product: the scrape only covers what the page
sells, and a clothing page has no bags or shoes on it. So the run takes the
best top, bottom and outer layer from today's scrape and **completes the look
from the catalogue** — the tote and the socks come off the shelf. It says so
out loud as it does it. That is curation across a catalogue rather than a
scraper dressed up as one.

**Then, on the site:** refresh **Search → Outfits**. There are now **9**.

---

## Step 2 — show it is real · ~30s

1. **Open the new outfit's pieces.** The prices are today's, several of them
   marked down, because they were read off the live page ninety seconds ago.
2. **Run it again:**

   ```bash
   ./scripts/demo.sh
   ```

   Still **9 outfits**, not 10, and the products update rather than duplicate.
   That's idempotency — the thing that makes it safe to run on a schedule.

---

## Making it write to the deployed site

By default the run writes to **your laptop's database**, so the deployed site
does not change. To make the demo land on `theedit.apps.human-angle.com`:

**You need to do this once, before the day:**

1. Invent a long random string. This is the write token.
2. GitHub → repo **Settings → Secrets and variables → Actions → Secrets tab**
   (⚠️ *Secrets*, not Variables) → **New repository secret**.
   Name: `MCP_WRITE_TOKEN`. Value: the string.
3. Merge to `main`. The workflow now sets it on the Container App.
4. Put the same value in your local `.env`:
   ```
   MCP_WRITE_TOKEN=the-same-string
   ```

**Then on the day:**

```bash
export MCP_WRITE_TOKEN="the-same-string"
TARGET=production ./scripts/demo.sh
```

Everything else is identical, and the outfit appears on the live site.

**Why a token at all:** the MCP endpoint is on the public internet. Without
one, anyone who finds the URL can write outfits into your production
catalogue. With `MCP_WRITE_TOKEN` set, every request must present it; with it
unset, the deployed app refuses writes but still answers reads. Either way you
are safe — you just can't do the production demo until you set it.

---

## When it goes wrong

### Docker says it is running but nothing works

Docker Desktop can be **paused**, which is not the same as stopped and gives no
obvious sign. `docker compose up -d` fails with "Docker Desktop is manually
paused". Unpause it from the whale menu, or:

```bash
docker desktop start
```

Then give it up to a minute before retrying — it reports ready before it is.

### The scrape returns nothing

The run prints `scraped 0 garments`, or hangs on the browser step.

Uskees changed their markup, or the site is slow. **Don't debug it live.**

```bash
OFFLINE=1 ./scripts/demo.sh
```

Skips the browser and reads a real capture of their catalogue. Scoring, writing
and the app are all still live — only the network hop is replaced. Say so out
loud; it's a stronger look than pretending. It takes about **1m45s**.

### The run hangs

If nothing has printed for **two minutes**: `Ctrl-C`, then

```bash
OFFLINE=1 ./scripts/demo.sh
```

If that also hangs, the app is still up. Skip to showing the site as it is —
the seeded outfits are real outfits, assembled from real brands.

### The outfit is refused

You'll see `create_outfit` return an error about slots or piece count. An
outfit is four to six pieces, one per slot; the run is meant to pick the best
piece per slot and fill any gaps from the catalogue. If it tried to write
thirteen overshirts, the rules did their job and the prompt did not — say that,
and move on to showing the site. Nothing is broken.

### `TARGET=production needs MCP_WRITE_TOKEN`

You didn't export it in this tab. `export MCP_WRITE_TOKEN="…"`, or drop
`TARGET=production` and demo against localhost.

### `unauthorized` from the deployed site

Your local token and the GitHub secret don't match, or the workflow hasn't run
since you added it. Demo against localhost — drop `TARGET=production`.

### The site shows no outfits at all

The production database starts empty and seeds on container start. If a deploy
just happened, give it a minute and refresh. If still empty, use localhost.

### Postgres won't start

```bash
docker compose down && docker compose up -d
sleep 5 && npx prisma migrate reset --force
```

---

## Offline fallback

If the wifi is gone entirely:

```bash
docker compose up -d
npx prisma migrate reset --force
npm run dev                       # separate tab
OFFLINE=1 ./scripts/demo.sh
```

This needs **no internet at all**, and takes about **1m45s**.

The fixture at `scripts/fixtures/uskees-sample.json` is 19 real Uskees
garments taken from their own product feed, chosen to span tops, bottoms,
outerwear, bags and accessories. Scoring, the MCP calls, the database write and
the app are all genuinely happening.

If even that fails, `docs/demo-transcript.log` is a recorded run you can read
from. Last resort — the live site is the better fallback.

---

## Known, and worth saying before someone asks

**No shoes in Quiet utility.** Uskees does not sell them and no other brand
covers that aesthetic, so the look runs five slots rather than six. The run
says so itself. Balletcore off duty is the aesthetic that dresses head to toe
from two labels — it is worth showing that feed straight afterwards.

---

## The one-paragraph version

The app curates across brands. Curation is the product, and curation has to
scale, so it can't be hand-done. One command opens a real brand's site in a
real browser, scores every garment against an aesthetic with a skill that knows
what the aesthetic means, keeps what belongs, and assembles a head-to-toe look
— taking what today's page can supply and completing it from the catalogue it
already has. It writes through the app's own MCP server, the same code path the
UI uses. Run it twice and nothing duplicates.
