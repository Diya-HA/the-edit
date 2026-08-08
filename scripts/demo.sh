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
COLLECTION="${COLLECTION:-https://uskees.com/en-us/collections/all}"
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
   previously scraped Uskees listing. Use its garments as the scrape result and
   print "loaded N garments from the offline fixture".'
  TOOLS="mcp__the-edit,Skill,Read"
else
  STEP_ONE="Using the Playwright MCP tools, open ${COLLECTION} and read the
   product listing. For every product card, collect: title, colour, price, and
   image URL. The colour is the part of the card title after the last \" - \".
   Take the first 20 products. Print \"scraped N garments\" when done."
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
   "N of M above ${THRESHOLD}". If none qualify, say so plainly and stop.

4. WRITE. Using the the-edit MCP tools:
   a. Call upsert_products once with all the kept garments. Use brandSlug
      "uskees", brandName "Uskees", aestheticSlug "${AESTHETIC}". For each
      product: slug is "uskees-" plus a lowercase hyphenated form of title and
      colour; category is the garment noun (overshirt, jacket, blazer...);
      colorName/colorToken/colorHex are the closest of these palette families —
      Ink --fabric-ink #3F4145, Neutral --fabric-neutral #8C8175,
      Cream --fabric-cream #E4E1DA, Sage --fabric-sage #5C6B54,
      Indigo --fabric-indigo #2F3A52, Rust --fabric-rust #A85A32,
      Butter --fabric-butter #C7B27E, Rose --fabric-rose #9B2F45.
      Put the skill's WHY line in the product's "why" field.
   b. Call create_outfit once, with slug "uskees-live-${AESTHETIC}", a short
      name, and every kept garment as an item with its score and its WHY line.
      The outfit's "note" must be the skill's one-line reasoning for the set as
      a whole: product voice, sentence case, under twenty words, no hype.

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
