# build/ — how the Word docs are generated

The four documents in `docs/` are generated from these scripts, so the source of truth is code and the `.docx` files can always be regenerated cleanly. If you edit the Word files directly in Word, that's fine too; just know these scripts won't pick up those manual edits.

## Files

- `helpers.js` — shared styling and layout helpers (fonts, colours, headings, tables, callouts).
- `01-brief.js` — product brief.
- `02-personas.js` — personas.
- `03-prd.js` — PRD.
- `04-hypotheses.js` — hypotheses and test plan.

## Regenerating the docs

Requires Node.js and the `docx` npm package.

```bash
cd build
npm install docx        # first time only
node 01-brief.js
node 02-personas.js
node 03-prd.js
node 04-hypotheses.js
```

Each script writes its `.docx` to an `out/` folder. Copy the results into `../docs/` to update the deliverables.
