# Demo runbook

Read this on the day. Commands in order, what should happen, what to do when
it doesn't.

**One sentence, if you forget everything else:** the app is already live at
`theedit.apps.human-angle.com` — the demo just adds a live-scraped outfit to
it. If the run fails, the site is still there and still works.

---

## Before you start

- [ ] Docker Desktop running
- [ ] Terminal open in the repo
- [ ] Browser open at `theedit.apps.human-angle.com`
- [ ] Second browser tab at `localhost:3000`
- [ ] Wifi working — if not, jump to **Offline fallback**

Time: about **6 minutes** total. The run itself is **4-5 minutes**; a
repeat run is faster, around 3.

---

## Step 0 — reset to a clean state · ~40s

```bash
cd ~/Development/App_Building/the-edit
docker compose up -d
npx prisma migrate reset --force
```

**On screen:** Prisma drops and recreates the database, applies 4 migrations,
then runs the seed. Ends with `saved items 14`.

That is your clean state: 6 brands, 30 products, 6 outfits, no Uskees, no
live-scraped anything.

```bash
npm run dev
```

**On screen:** `Ready in …`. Leave this running in its own tab.

Check `localhost:3000` → **Search → Outfits**. You should see **6 outfits**,
none of them Uskees. That's the "before".

---

## Step 1 — the composed run · 4-5 min

Open a **second terminal tab** (leave `npm run dev` alone).

```bash
cd ~/Development/App_Building/the-edit
./scripts/demo.sh
```

**What should appear, roughly in this order:**

| When | What |
|---|---|
| 0:00 | The header block — target, catalogue, collection, threshold |
| 0:10 | A Chrome window opens by itself and loads the Uskees listing |
| 1:00 | `scraped 20 garments` |
| 1:10 | Scores print, one line per garment |
| 2:30 | `N of 20 above 85` |
| 3:00 | Two tool calls to `the-edit` — products, then the outfit |
| 4:00 | The outfit name, its piece count, and a URL |
| — | `finished in NNNs` |

**The bit worth narrating while it runs:** the scores are not a filter on
colour names. Look for a piece that scores in the 90s and one in the 50s and
read out the two `WHY` lines — that's the skill discriminating.

**Then, on the site:** refresh **Search → Outfits**. There are now **7**. The
new one is at the top.

---

## Step 2 — show it is real · ~30s

Two things prove it isn't a fixture:

1. **Open the outfit's pieces.** They are Uskees garments that were not in the
   database ninety seconds ago.
2. **Run it again:**

   ```bash
   ./scripts/demo.sh
   ```

   It says `Updated`, not `Created`. Still 7 outfits, not 8. That's
   idempotency — the thing that makes it safe to run on a schedule.

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

### The scrape returns nothing

The run prints `scraped 0 garments`, or hangs on the browser step.

Uskees changed their markup, or the site is slow. **Don't debug it live.**

```bash
OFFLINE=1 ./scripts/demo.sh
```

Skips the browser and reads a real scrape captured earlier. Scoring, writing
and the app are all still live — only the network hop is replaced. Say so out
loud; it's a stronger look than pretending.

### The run hangs

If nothing has printed for **two minutes**: `Ctrl-C`, then

```bash
OFFLINE=1 ./scripts/demo.sh
```

If that also hangs, the app is still up. Skip to showing the site as it is —
the seeded outfits are real outfits.

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

This needs **no internet at all**. The fixture at
`scripts/fixtures/uskees-sample.json` is a real scrape of 20 Uskees garments,
captured on a real run. Scoring, the MCP calls, the database write and the app
are all genuinely happening.

If even that fails, `docs/demo-transcript.log` is a recorded run you can read
from. Last resort — the live site is the better fallback.

---

## The one-paragraph version

The app curates across brands. Curation is the product, and curation has to
scale, so it can't be hand-done. One command scrapes a real brand's site with
a browser, scores every garment against an aesthetic with a skill that knows
what the aesthetic means, keeps what belongs, and writes it into the live
catalogue through the app's own MCP server — the same code path the UI uses.
Run it twice and nothing duplicates.
