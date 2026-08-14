#!/usr/bin/env bash
# The composed run: scrape, score, assemble, in one non-interactive pass.
#
#   ./scripts/demo.sh              -> writes to your local database
#   TARGET=production ./scripts/demo.sh   -> writes to the deployed site
#
# Everything it does goes through MCP: Playwright for the browser, The Edit's
# own server for the catalogue. Nothing here talks to Postgres directly, which
# is what lets the same command aim at localhost or at production.
set -euo pipefail

TARGET="${TARGET:-local}"
OFFLINE="${OFFLINE:-0}"
# /collections/all is sorted alphabetically, which on this storefront means the
# first twenty products are twenty colourways of one overshirt — the scrape
# then fills a single slot and the shelf has to supply the rest of the look.
# /collections/all-clothing spans tops, bottoms and outerwear, so the scrape
# earns most of the outfit. Verified against the live page, not assumed.
COLLECTION="${COLLECTION:-https://uskees.com/en-us/collections/all-clothing}"
AESTHETIC="${AESTHETIC:-quiet-utility}"
THRESHOLD="${THRESHOLD:-85}"

if [ "$TARGET" = "production" ]; then
  APP_URL="${PROD_URL:-https://theedit.apps.human-angle.com}"
  MCP_URL="${APP_URL}/api/mcp"
  if [ -z "${MCP_WRITE_TOKEN:-}" ]; then
    echo "✗ TARGET=production needs MCP_WRITE_TOKEN in your environment." >&2
    echo "  It is the same value as the MCP_WRITE_TOKEN secret in GitHub." >&2
    exit 1
  fi
else
  APP_URL="http://localhost:3000"
  MCP_URL="${APP_URL}/api/mcp"
fi

echo "─────────────────────────────────────────────"
echo " The Edit — composed run"
echo " target      $TARGET"
echo " catalogue   $MCP_URL"
if [ "$OFFLINE" = "1" ]; then
  echo " collection  scripts/fixtures/uskees-sample.json  (OFFLINE)"
else
  echo " collection  $COLLECTION"
fi
echo " aesthetic   $AESTHETIC   threshold $THRESHOLD"
echo "─────────────────────────────────────────────"
echo

# A run-scoped MCP config, so the demo never depends on whatever the repo's
# .mcp.json happens to hold. Playwright is headed on purpose — the browser
# driving itself is the thing worth watching.
CONFIG="$(mktemp -t the-edit-mcp).json"

if [ "$TARGET" = "production" ]; then
  AUTH_BLOCK="\"headers\": { \"Authorization\": \"Bearer ${MCP_WRITE_TOKEN}\" },"
else
  AUTH_BLOCK=""
fi

cat > "$CONFIG" <<JSON
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["-y", "@playwright/mcp@latest", "--isolated", "--viewport-size=1280,900"]
    },
    "the-edit": {
      "type": "http",
      "url": "${MCP_URL}",
      ${AUTH_BLOCK}
      "description": "The Edit's catalogue"
    }
  }
}
JSON

if [ "$OFFLINE" = "1" ]; then
  STEP_ONE='Read the file scripts/fixtures/uskees-sample.json. It holds a
   previously captured Uskees catalogue, spanning tops, bottoms, outerwear,
   bags and accessories. Use its garments as the scrape result and print
   "loaded N garments from the offline fixture". Each carries a handle and a
   slot; keep both, you will need them in step 4.'
  TOOLS="mcp__the-edit,Skill,Read"
else
  STEP_ONE="Using the Playwright MCP tools, open ${COLLECTION} and read the
   product listing. For every product card, collect: title, colour, price,
   image URL, and the product URL — its last path segment is the handle, which
   step 4 needs for the slug. The colour is the part of the card title after
   the last \" - \".
   Take the first 20 products. Print \"scraped N garments\" when done, then one
   line naming the garment kinds you saw, so it is clear whether the page gave
   a spread or twenty colourways of one thing."
  TOOLS="mcp__playwright,mcp__the-edit,Skill"
fi

PROMPTFILE="$(mktemp -t the-edit-prompt)"
trap 'rm -f "$CONFIG" "$PROMPTFILE"' EXIT
cat > "$PROMPTFILE" <<PROMPT_END
You are running The Edit's curation pipeline, unattended. Work through this in
order and narrate as you go — someone is watching the output.

1. SCRAPE. ${STEP_ONE}

2. SCORE. Use the aesthetic-fit skill to score every garment against
   "${AESTHETIC}". Print one line per garment as you score it, in this shape,
   so there is something to watch:
       <score>/100  <verdict>  <title> - <colour>
   Do not batch the output; print each line as you decide it.

3. SELECT. Keep the garments scoring ${THRESHOLD} or above. Print
   "N of M above ${THRESHOLD}", and then one line per slot showing what the
   kept set covers, e.g. "TOP 3  BOTTOM 1  OUTER 4  BAG 1  ACCESSORY 2". If
   none qualify, say so plainly and stop.

4. WRITE. Using the the-edit MCP tools:
   a. Call upsert_products once with all the kept garments. Use brandSlug
      "uskees", brandName "Uskees", aestheticSlug "${AESTHETIC}". For each
      product: slug is "uskees-" plus the garment's own handle, which is the
      last path segment of its product URL. That is how the catalogue already
      names Uskees pieces, so a piece it already holds is updated rather than
      appearing twice under a second name. Do not invent a slug from the title.
      category is the garment noun (overshirt, jacket, trouser, sock...);
      slot is where it sits in a head-to-toe look — one of TOP, BOTTOM, OUTER,
      SHOES, BAG, ACCESSORY;
      colorName/colorToken/colorHex are the closest of these palette families —
      Ink --fabric-ink #3F4145, Neutral --fabric-neutral #8C8175,
      Cream --fabric-cream #E4E1DA, Sage --fabric-sage #5C6B54,
      Indigo --fabric-indigo #2F3A52, Rust --fabric-rust #A85A32,
      Butter --fabric-butter #C7B27E, Rose --fabric-rose #9B2F45.
      Put the skill's WHY line in the product's "why" field.
   b. Assemble ONE head-to-toe look and call create_outfit once, with slug
      "uskees-live-${AESTHETIC}" and a short name.

      An outfit is four to six pieces, ONE PER SLOT. Never two tops, never two
      colourways of one style — thirteen overshirts is a colourway rail, not a
      look, and create_outfit will refuse it. So: take the highest scoring kept
      piece for each slot, up to six slots.

      A look needs a top, something on the legs and a layer over them. If the
      kept pieces are missing any of TOP, BOTTOM or OUTER, fill it from what
      the catalogue already holds: call search_products with aesthetic
      "${AESTHETIC}" and pick the best piece in each missing slot. Then, if the
      look is still under five pieces, add a BAG or an ACCESSORY the same way.
      Say out loud which pieces came from today's scrape and which came from
      the shelf — completing a look from the whole catalogue is the product
      working, not a shortfall.

      Each item carries its score and its WHY line. The outfit's "note" is the
      skill's one-line reasoning for the set as a whole: product voice,
      sentence case, under twenty words, no hype.

Both writes are idempotent, so re-running is safe and expected.

5. Finish by printing the outfit name, how many pieces it holds, and this
   exact URL, which is where it can be seen:
   ${APP_URL}/search?tab=outfits&look=${AESTHETIC}
   Keep the whole run under five minutes.
PROMPT_END


START=$(date +%s)
claude -p "$(cat "$PROMPTFILE")" \
  --mcp-config "$CONFIG" \
  --allowed-tools "$TOOLS" \
  --permission-mode acceptEdits \
  --output-format stream-json \
  --verbose \
  2>&1 | node "$(dirname "$0")/render-run.mjs" | tee /tmp/the-edit-demo.log

END=$(date +%s)
echo
echo "─────────────────────────────────────────────"
echo " finished in $((END - START))s"
echo " transcript: /tmp/the-edit-demo.log"
echo "─────────────────────────────────────────────"
