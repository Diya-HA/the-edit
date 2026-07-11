const H = require('./helpers');
const { docx, docTitle, subtitle, sectionLabel, para, callout, table, buildDoc, write, footerRule, spacer, runs, ACCENT, INK, MUTE, RULE } = H;
const { Paragraph, TextRun, Table, TableRow, TableCell, WidthType, ShadingType, BorderStyle } = docx;

function hypo(tag, title, statement, risky, kill, test, isNew) {
  const kids = [];
  const head = [ new TextRun({ text: tag.toUpperCase() + '  ·  ' + title, bold: true, size: 18, color: ACCENT, font: 'Calibri', characterSpacing: 20 }) ];
  if (isNew) head.push(new TextRun({ text: '   NEW', bold: true, size: 15, color: '2C5A52', font: 'Calibri' }));
  kids.push(new Paragraph({ spacing: { after: 60 }, children: head }));
  kids.push(new Paragraph({ spacing: { after: 100, line: 272 }, children: [ new TextRun({ text: statement, bold: true, size: 23, color: INK, font: 'Georgia' }) ] }));
  const line = (label, txt) => new Paragraph({ spacing: { after: 70, line: 268 }, children: [
    new TextRun({ text: label + '  ', bold: true, size: 17, color: ACCENT, font: 'Calibri', characterSpacing: 10 }),
    ...runs(txt, { size: 20 }),
  ] });
  kids.push(line('WHY IT\'S RISKY', risky));
  kids.push(line('KILL CRITERION', kill));
  kids.push(line('CHEAP TEST', test));
  return new Table({
    width: { size: 9360, type: WidthType.DXA }, columnWidths: [9360],
    borders: { top:{style:BorderStyle.NONE,size:0,color:'FFFFFF'},bottom:{style:BorderStyle.NONE,size:0,color:'FFFFFF'},left:{style:BorderStyle.NONE,size:0,color:'FFFFFF'},right:{style:BorderStyle.NONE,size:0,color:'FFFFFF'} },
    rows: [ new TableRow({ children: [ new TableCell({
      width: { size: 9360, type: WidthType.DXA },
      shading: { type: ShadingType.CLEAR, fill: 'F7F3EF', color: 'auto' },
      borders: { left: { style: BorderStyle.SINGLE, size: 18, color: ACCENT } },
      margins: { top: 130, bottom: 130, left: 200, right: 200 },
      children: kids,
    }) ] }) ],
  });
}

const kids = [];
kids.push(...docTitle('What we believe, and how to prove it wrong', 'The Edit · Hypotheses & Cheap Test Plan'));
kids.push(subtitle('Every belief here is written to be falsifiable, with a kill criterion (the result that says we\'re wrong) and a test you could run in days for near-zero money. These are assumptions until a test moves them; no invented facts.'));

kids.push(callout(null, { bg: H.REC_BG, label: 'Read it this way', paras: [
  [{text:'Test the riskiest, cheapest-to-test beliefs first. ', bold:true},{text:'H1 and H2 are existential: if either dies, the product doesn\'t. Run both before building anything. We put H2 ahead of H1 only because H2 costs nothing and reuses the prototype we already have, while H1 needs a landing page and a little spend.'}],
  [{text:'Set every threshold before you run the test. ', bold:true},{text:'The numbers below (5%, 15%, 20%) are starting lines, not measured facts. Agree them up front and don\'t move them afterwards, or the test can\'t really fail.'}],
] }));

kids.push(spacer(80));
kids.push(hypo('H1 · Desirability', '', 'People want to shop by aesthetic, across brands, not by store or category.',
  'It\'s the whole premise. People might pin by aesthetic but still buy by brand or price.',
  'A fake-door landing page converts under ~5% to "notify me," and interviews show people default back to "I just go to [brand]."',
  '2–4 days, ~$100. One landing page ("Shop by aesthetic, across every brand") plus the two mode mock-ups and email capture; drive ~300–500 visits from aesthetic communities; read opt-in rate and replies.'));
kids.push(spacer(120));
kids.push(hypo('H2 · Core value', '', 'Cohesion is the value: a curated cross-brand feed beats a plain one on saves and intent.',
  'If a random multi-brand feed performs just as well, curation isn\'t the product.',
  'The curated feed\'s save-rate is not meaningfully higher than a shuffled baseline. Decide what "meaningfully" means and the sample size before running, so the result can genuinely come back negative.',
  '3–5 days, ~$0. Use the prototype: cohesion-ordered variant vs a random shuffle of the same pieces; 40–60 people unmoderated (or 8 moderated); measure saves per session and "which feels more you?"'));
kids.push(spacer(120));
kids.push(hypo('H3 · Model viability', '', 'People will click out to the brand to buy (outbound affiliate) rather than demand in-app checkout.',
  'If they won\'t, the lean v1 can\'t monetise and we\'ve under-scoped.',
  'A painted-door "Shop at [brand]" button is clicked by under ~15% of people who open a detail; interviews cite wanting to check out in-app.',
  '1–2 days, ~$0. Add a working outbound button to the prototype detail; watch clicks and reactions in the same sessions as H2.'));

kids.push(new Paragraph({ children:[new H.PageBreak()] }));

kids.push(hypo('H4 · Retention', '', 'Boards plus drop alerts create a reason to return within a week.',
  'Curation could be a one-and-done novelty.',
  'Among board-creators, under ~20% return within 7 days when prompted by a drop.',
  '1–2 weeks, low cost. Concierge: recruit 15–20 users, have them save boards, and manually email them when a saved piece actually drops; measure re-opens.'));
kids.push(spacer(120));
kids.push(hypo('H5 · Feasibility', '', 'We can assemble cohesive feeds people accept by agent, not just a human with great taste.',
  'If only a skilled stylist can do it, it won\'t scale, and the feed curator (E7) is the core of the product.',
  'Blind-rated, agent sets score materially worse than human sets on "does this go together?" and users can reliably tell which is which.',
  '2–3 days, ~$0. Use the feed-curator agent: 5 agent sets vs 5 hand-curated; blind-rate all 10 with 10–15 users on cohesion and fit.'));
kids.push(spacer(120));
kids.push(hypo('H6 · Supply viability', '', 'Enough relevant brands are reachable via affiliate networks to build a real catalogue.',
  'No catalogue, no product, and some desirable brands don\'t offer affiliate at all.',
  'Of ~20 aesthetic-fit brands, under ~5 are reachable with usable product-level feeds.',
  '2–3 days, ~$0. Desk research against the major affiliate networks; note which brands have product-level feeds and workable terms. Can run in parallel from day one.'));
kids.push(spacer(120));
kids.push(hypo('H7 · Checkout friction', '', 'Buying a look across several brands won\'t sink conversion.',
  '"Shop the look across brands" means a five-piece look can be five separate checkouts, five shipping fees, and five return windows. That friction lands right at the moment of purchase and could quietly kill the outbound conversion the affiliate model depends on.',
  'Once people see a multi-brand look priced out with separate shipping, more than half abandon or say they\'d "buy one piece, not the whole look."',
  '1–2 days, ~$0. In the same H2/H3 sessions, show a saved 4–5 piece look with real per-brand shipping and ask them to "buy the look"; watch how many complete vs cherry-pick one item, and why.', true));

kids.push(new Paragraph({ children:[new H.PageBreak()] }));

kids.push(sectionLabel('Test sequencing — what to run first'));
kids.push(table(['#', 'Hypothesis', 'Test', 'Time', 'Cost', 'If it fails'], [
  ['1', 'H2 cohesion value', 'Curated vs shuffled prototype', '3–5 d', '~$0', 'No product'],
  ['2', 'H1 aesthetic demand', 'Fake-door landing page', '2–4 d', '~$100', 'No product'],
  ['3', 'H5 curation feasibility', 'Blind agent-vs-human rating', '2–3 d', '~$0', 'No scale; fall back to hand-curation'],
  ['4', 'H3 outbound buying', 'Painted-door buy button', '1–2 d', '~$0', 'Reshapes scope'],
  ['5', 'H7 checkout friction', 'Priced multi-brand look', '1–2 d', '~$0', 'Reshapes the model'],
  ['6', 'H6 brand supply', 'Affiliate desk research', '2–3 d', '~$0', 'Gates launch (run in parallel)'],
  ['7', 'H4 retention', 'Concierge drop alerts', '1–2 wk', 'Low', 'Shapes roadmap'],
], [500, 2300, 2600, 900, 900, 2160], { size: 18 }));

kids.push(spacer(160));
kids.push(callout(null, { bg: H.REC_BG, label: 'The one-sentence summary', paras: [
  [{text:'The two questions that matter most, do people want to shop by aesthetic (H1) and is cohesion actually the value (H2), can be answered in under a week for about $100, using the prototype and a landing page we mostly already have.', bold:true}],
] }));

kids.push(footerRule());
kids.push(para([{text:'The Edit — Hypotheses & Test Plan', color:MUTE, size:16},{text:'          July 2026 · working draft for review', color:MUTE, size:16}]));

write(buildDoc(kids), './out/04-hypotheses-and-test-plan.docx');
