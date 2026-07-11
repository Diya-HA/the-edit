const H = require('./helpers');
const { docx, docTitle, subtitle, sectionLabel, subhead, para, bullet, callout, table, buildDoc, write, footerRule, spacer, runs, ACCENT, INK, MUTE, RULE } = H;
const { Paragraph, TextRun, Table, TableRow, TableCell, WidthType, ShadingType, BorderStyle } = docx;

const PROTO = () => ({ text: 'PROTO', bold: true, color: '6B4A3A', size: 17 });
const NEW = () => ({ text: 'NEW', bold: true, color: '2C5A52', size: 17 });
const PROTOx = () => ({ text: 'PROTO*', bold: true, color: '6B4A3A', size: 17 });

function featTable(rows) {
  // rows: [ [feature, detail, tagRunSpec] ]
  return table(['Feature', 'Detail', 'Type'],
    rows.map(r => [ [{text:r[0], bold:true, size:19}], r[1], [r[2]] ]),
    [2400, 5760, 1000]);
}

function acceptance(text) {
  return new Table({
    width: { size: 9160, type: WidthType.DXA }, columnWidths: [9160],
    borders: { top:{style:BorderStyle.NONE,size:0,color:'FFFFFF'},bottom:{style:BorderStyle.NONE,size:0,color:'FFFFFF'},left:{style:BorderStyle.NONE,size:0,color:'FFFFFF'},right:{style:BorderStyle.NONE,size:0,color:'FFFFFF'} },
    rows: [ new TableRow({ children: [ new TableCell({
      width: { size: 9160, type: WidthType.DXA },
      shading: { type: ShadingType.CLEAR, fill: 'EFEAE4', color: 'auto' },
      margins: { top: 90, bottom: 90, left: 160, right: 160 },
      children: [ new Paragraph({ spacing:{line:264}, children: [
        new TextRun({ text: 'ACCEPTANCE BARS   ', bold: true, size: 15, color: ACCENT, font: 'Calibri', characterSpacing: 20 }),
        ...runs(text, { size: 19 }),
      ] }) ],
    }) ] }) ],
  });
}

function epicHead(text) {
  return new Paragraph({ spacing: { before: 200, after: 40 },
    children: [ new TextRun({ text, bold: true, size: 23, font: 'Georgia', color: INK }) ] });
}

const kids = [];
kids.push(...docTitle('What v1 builds, and why', 'The Edit · Product Requirements · v1'));
kids.push(subtitle('Written outcome-back: it starts from the one outcome that matters and traces every epic to it. If a feature doesn\'t serve the bet, it\'s deferred.'));

kids.push(callout(null, { bg: H.REC_BG, label: 'The outcome everything traces to', paras: [
  [{text:'North Star — cohesive looks saved and shopped. ', bold:true},{text:'v1 exists to prove that curating cross-brand pieces into cohesive looks makes people shop by aesthetic here rather than stitching it together across ten apps.'}],
  [{text:'The metric that carries it: ', bold:true},{text:'save-rate on the curated feed measured against a plain, shuffled multi-brand feed. That single comparison is the bet. Supporting it: boards created, outbound clicks per board, and 4-week return among board-creators. Targets are set from the first tests, not asserted here.'}],
] }));

kids.push(sectionLabel('Outcome → opportunities → epics'));
kids.push(para('Working back from the North Star, three opportunities carry the bet. Every epic hangs off one of them.'));
kids.push(table(['Opportunity (user need)', 'Epics that serve it'], [
  ['See a look that\'s already mine: a cohesive, on-aesthetic feed without the ten-tab hunt', 'E1 Aesthetic modes & feed · E2 Filtering · E3 Search & discovery · E7 Feed curator'],
  ['Hold the look together over time: save, organise, and come back to it', 'E4 Mood boards · E5 Brand shelf · E6 Price drops'],
  ['Act on it: actually buy, and let us earn', 'E8 Accounts · E9 Detail & outbound checkout · E10 Catalog ingestion'],
], [5180, 3980]));

kids.push(sectionLabel('How to read the epics'));
kids.push(para([{text:'Each feature is tagged '},{...PROTO()},{text:' (already shown in the visual prototype) or '},{...NEW()},{text:' (net-new for a real v1). Acceptance criteria are written as pass/fail bars you can check without asking us what we meant.'}]));

kids.push(sectionLabel('Goals & non-goals (v1)'));
kids.push(new Table({ width:{size:9360,type:WidthType.DXA}, columnWidths:[4680,4680],
  borders:{top:{style:BorderStyle.NONE,size:0,color:'FFFFFF'},bottom:{style:BorderStyle.NONE,size:0,color:'FFFFFF'},left:{style:BorderStyle.NONE,size:0,color:'FFFFFF'},right:{style:BorderStyle.NONE,size:0,color:'FFFFFF'},insideHorizontal:{style:BorderStyle.NONE,size:0,color:'FFFFFF'},insideVertical:{style:BorderStyle.NONE,size:0,color:'FFFFFF'}},
  rows:[ new TableRow({ children:[
    new TableCell({ width:{size:4680,type:WidthType.DXA}, margins:{right:200}, children:[
      new Paragraph({ spacing:{after:60}, children:[new TextRun({text:'GOALS', bold:true, size:17, color:ACCENT, font:'Calibri', characterSpacing:20})] }),
      ...['Pick an aesthetic and get a cohesive, on-palette, multi-brand feed.','Save, organise, and revisit looks; follow brands.','Watch prices on saved pieces and surface drops.','Drive qualified outbound clicks to brand partners.'].map(t=>new Paragraph({numbering:{reference:'bul',level:0},spacing:{after:60,line:264},children:runs(t,{size:20})})),
    ] }),
    new TableCell({ width:{size:4680,type:WidthType.DXA}, margins:{left:200}, children:[
      new Paragraph({ spacing:{after:60}, children:[new TextRun({text:'NON-GOALS', bold:true, size:17, color:ACCENT, font:'Calibri', characterSpacing:20})] }),
      ...['In-app checkout or payments.','User-to-user social features.','Fit and size personalisation.','Our own inventory or logistics.'].map(t=>new Paragraph({numbering:{reference:'bul',level:0},spacing:{after:60,line:264},children:runs(t,{size:20})})),
    ] }),
  ] }) ] }));

// ===== Opportunity 1 =====
kids.push(sectionLabel('Opportunity 1 — See a look that\'s already mine'));

kids.push(epicHead('E1 · Aesthetic modes & curated feed'));
kids.push(para('The home experience is a chosen look, pulled from many brands.', { size:20, after:80 }));
kids.push(featTable([
  ['Aesthetic modes','Distinct modes (Soft Romance / "Muse", Quiet Utility / "STACK"), each its own palette, type, and mix.', PROTO()],
  ['Masonry feed','Two-column feed of product cards: image, brand, title, price.', PROTO()],
  ['Mode switch','Switching aesthetic re-curates feed, palette, and shelf.', NEW()],
  ['Cohesion ranking','Feed ordered for palette and category balance, not random.', NEW()],
]));
kids.push(acceptance('Selecting a mode changes wordmark, palette, and product set · feed loads ≥ 12 pieces from ≥ 4 brands · no single brand exceeds ~40% above the fold · scroll stays smooth with lazy-loaded images.'));

kids.push(epicHead('E2 · Palette & category filtering'));
kids.push(para('Narrow the feed the way people think, by colour and type.', { size:20, after:80 }));
kids.push(featTable([
  ['Palette filter','Colour dots filter the feed to a colour family; tap again to clear.', PROTO()],
  ['Category chips','Scrolling chips filter by category.', PROTO()],
  ['Combined filters','Palette, category, and search apply together, with a live result count and a friendly empty state.', PROTO()],
]));
kids.push(acceptance('Active filter is visually distinct · filters combine (AND) and update the count on every change · empty state appears at zero results and clears when loosened.'));

kids.push(epicHead('E3 · Search & "more like this" discovery'));
kids.push(featTable([
  ['Search','Free-text over brand, title, category.', PROTO()],
  ['Product detail','Full-screen: hero, brand, title, price, colour, description, save.', PROTO()],
  ['More like this','Grid of pieces sharing palette or category.', PROTO()],
  ['Semantic search','Understands vibe terms ("cottagecore," "going-out top").', NEW()],
]));
kids.push(acceptance('Search filters live while typing and keeps input focus · detail opens from a card and returns to the same scroll position · "more like this" shows ≥ 3 relevant pieces excluding the current one.'));

kids.push(new Paragraph({ children:[new H.PageBreak()] }));

// ===== Opportunity 2 =====
kids.push(sectionLabel('Opportunity 2 — Hold the look together'));

kids.push(epicHead('E4 · Mood boards'));
kids.push(featTable([
  ['Save to board','Save any piece; a sheet to pick one or more boards.', PROTO()],
  ['Create board','Create a new board inline while saving.', PROTO()],
  ['Boards view','Grid with cover collage and count; open to see pieces.', PROTO()],
  ['Persistence & sharing','Boards persist to the account; share a board via read-only link.', NEW()],
]));
kids.push(acceptance('Saving updates saved-state and shows a toast · a new board immediately holds its first piece · covers reflect real saved pieces · boards survive logout/login unchanged.'));

kids.push(epicHead('E5 · Brand shelf & follow'));
kids.push(featTable([
  ['Shelf list','Brands in the current aesthetic with piece and drop counts.', PROTO()],
  ['Follow / unfollow','Follow to weight a brand into the feed.', PROTO()],
  ['Follow influences feed','Followed brands appear more; unfollowed less.', NEW()],
]));
kids.push(acceptance('Follow toggles instantly with a toast · state persists to the account · a followed brand is measurably more frequent in the next feed load.'));

kids.push(epicHead('E6 · Price drops & alerts'));
kids.push(featTable([
  ['Drop badges & shelf','"↓ X%" badges, struck old price, a row of current drops.', PROTO()],
  ['Price tracking','Backend polls brand prices, records drops on saved and followed items.', NEW()],
  ['Drop notifications','Push or email when a saved piece drops past a threshold.', NEW()],
]));
kids.push(acceptance('Any piece with was > price shows the correct percent · drops shelf lists only currently-discounted pieces · a price change on a saved item fires exactly one notification per polling window.'));

kids.push(new Paragraph({ children:[new H.PageBreak()] }));

// ===== Opportunity 3 / engine =====
kids.push(sectionLabel('Opportunity 3 — Act on it, and the engine underneath'));

kids.push(epicHead('E7 · Feed curator — the curation engine ★'));
kids.push(para('The intelligence that assembles a cohesive cross-brand feed. This is the product\'s core and the subject of the agent prototype: configurable goal → plan → assemble → explain → adapt.', { size:20, after:80 }));
kids.push(featTable([
  ['Aesthetic brief input','Aesthetic, palette, budget, categories, occasion.', NEW()],
  ['Cohesion assembly','Select pieces that fit the brief; balance palette and category so it reads as one look.', PROTOx()],
  ['Rationale','Explain why pieces were chosen.', PROTOx()],
  ['Constraints & learning','Respect budget and category coverage; feed saves and dismisses back into future curation.', NEW()],
]));
kids.push(para([{text:'* Demonstrated in the feed-curator agent prototype.', italic:true, color:MUTE, size:17}]));
kids.push(acceptance('Given a brief, returns a set within budget covering the requested categories · stays within the palette family (≤ one accent) · every set ships with a short, specific rationale · changing budget or palette visibly changes the result.'));
kids.push(spacer(40));
kids.push(callout(null, { bg: 'F6E9E6', label: 'Core risk on this epic', paras: [
  [{text:'E7 is the whole product, and most of it is still net-new. If the agent can\'t hit cohesion people accept (hypothesis H5), we don\'t ship a mediocre feed. The fallback is to hand-curate the launch catalogue and let the agent assist behind the scenes, moving more to it as it earns trust. Build E7 so a human curator can always override or seed it.'}],
] }));

kids.push(epicHead('E8–E10 · Accounts, checkout hand-off, catalog'));
kids.push(table(['Epic', 'What it covers · key acceptance bar', 'Type'], [
  [[{text:'E8 Accounts & onboarding', bold:true, size:19}], 'Email/social login, aesthetic quiz, profile. New user reaches a curated feed in < 60s; choices persist through logout.', [NEW()]],
  [[{text:'E9 Detail & outbound', bold:true, size:19}], '"Shop at [brand]" affiliate deep-link, stock flags, click attribution. Buy link opens the right page with the affiliate tag; every click logged.', [NEW()]],
  [[{text:'E10 Catalog ingestion', bold:true, size:19}], 'Normalise brand feeds; auto-tag aesthetic/colour/category (where Claude earns its keep); refresh price and stock. ≥ 90% of pieces auto-tagged.', [NEW()]],
], [2200, 5960, 1000]));
kids.push(spacer(40));
kids.push(callout(null, { bg: 'EFEAE4', label: 'The dependency to respect', paras: [
  [{text:'E10 feeds everything. ', bold:true},{text:'E1 and E7 have nothing to curate without a catalogue, and whether enough aesthetic-fit brands are reachable by affiliate is an open risk (hypothesis H6). So supply is the real gate: confirm a few reachable brands before building the ingestion pipeline, and start the launch catalogue hand-assembled rather than waiting on automation.'}],
] }));

kids.push(sectionLabel('Phasing — time budgets are real'));
kids.push(para([{text:'v1, prove the bet: ', bold:true},{text:'the honest minimum is E1–E4 plus E7 in a lite, hand-assisted form, plus minimal accounts (E8) and outbound links (E9), over a curated catalogue of even a few hundred hand-checked pieces. That\'s enough to test cohesion and demand.'}]));
kids.push(para([{text:'v1.1: ', bold:true},{text:'brand shelf and follow-weighted feed (E5), price tracking and notifications (E6), semantic search, board sharing.'}]));
kids.push(para([{text:'Later: ', bold:true},{text:'the learning loop, automated ingestion at scale (E10), business-model experiments.'}]));

kids.push(sectionLabel('Open questions'));
kids.push(para([{text:'My recommendation on each is below; all stay open for you.', italic:true, color:MUTE}]));
kids.push(callout(null, { bg: H.CHIP_BG, paras: [
  [{text:'Two aesthetics at launch or a handful? ', bold:true},{text:'Recommendation: two, as prototyped. Depth per aesthetic beats breadth while the catalogue is small.'}],
  [{text:'Curate manually or by agent at launch? ', bold:true},{text:'Recommendation: manual for launch with the agent assisting, then shift to agent as H5 proves out. Taste is the bet.'}],
  [{text:'Which affiliate networks and brands are reachable for a real v1 catalogue? ', bold:true},{text:'Recommendation: answer this first (it\'s hypothesis H6). It gates the whole build, so run the desk research before committing to ingestion.'}],
] }));

kids.push(footerRule());
kids.push(para([{text:'The Edit — PRD v1', color:MUTE, size:16},{text:'          July 2026 · working draft for review', color:MUTE, size:16}]));

write(buildDoc(kids), './out/03-prd.docx');
