const H = require('./helpers');
const { docx, docTitle, subtitle, sectionLabel, para, bullet, buildDoc, write, footerRule, spacer, runs, ACCENT, INK, MUTE, RULE, CHIP_BG, HEAD, BODY } = H;
const { Paragraph, TextRun, Table, TableRow, TableCell, WidthType, ShadingType, BorderStyle, AlignmentType } = docx;

function noBorders() {
  const n = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
  return { top:n, bottom:n, left:n, right:n, insideHorizontal:n, insideVertical:n };
}

function personaHeader(name, role, tagText, tagColor) {
  return new Paragraph({
    spacing: { before: 40, after: 40 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: RULE, space: 4 } },
    children: [
      new TextRun({ text: name, bold: true, size: 34, font: HEAD, color: INK }),
      new TextRun({ text: '   ' + role, size: 20, color: MUTE, font: BODY }),
      new TextRun({ text: '        ' + tagText.toUpperCase(), bold: true, size: 16, color: tagColor, font: BODY, characterSpacing: 20 }),
    ],
  });
}

function quote(text) {
  return new Paragraph({
    spacing: { before: 120, after: 120 },
    children: [new TextRun({ text: '“' + text + '”', italics: true, size: 24, color: ACCENT, font: HEAD })],
  });
}

function demoBox(lines) {
  const cells = lines.map(l => new Paragraph({
    spacing: { after: 30 },
    children: [ new TextRun({ text: l[0] + '  ', bold: true, size: 18, color: INK, font: BODY }), new TextRun({ text: l[1], size: 18, color: MUTE, font: BODY }) ],
  }));
  return new Table({
    width: { size: 9360, type: WidthType.DXA }, columnWidths: [9360], borders: noBorders(),
    rows: [ new TableRow({ children: [ new TableCell({
      width: { size: 9360, type: WidthType.DXA },
      shading: { type: ShadingType.CLEAR, fill: CHIP_BG, color: 'auto' },
      margins: { top: 100, bottom: 100, left: 160, right: 160 }, children: cells,
    }) ] }) ],
  });
}

function twoCol(leftTitle, leftItems, rightTitle, rightItems) {
  const colHead = t => new Paragraph({ spacing: { after: 60 }, children: [ new TextRun({ text: t.toUpperCase(), bold: true, size: 17, color: ACCENT, font: BODY, characterSpacing: 20 }) ] });
  const items = arr => arr.map(it => new Paragraph({ numbering: { reference: 'bul', level: 0 }, spacing: { after: 60, line: 264 }, children: runs(it, { size: 20 }) }));
  return new Table({
    width: { size: 9360, type: WidthType.DXA }, columnWidths: [4680, 4680], borders: noBorders(),
    rows: [ new TableRow({ children: [
      new TableCell({ width:{size:4680,type:WidthType.DXA}, margins:{right:200,top:60}, children: [colHead(leftTitle), ...items(leftItems)] }),
      new TableCell({ width:{size:4680,type:WidthType.DXA}, margins:{left:200,top:60}, children: [colHead(rightTitle), ...items(rightItems)] }),
    ] }) ],
  });
}

function jtbd(text) {
  return new Table({
    width: { size: 9360, type: WidthType.DXA }, columnWidths: [9360], borders: noBorders(),
    rows: [ new TableRow({ children: [ new TableCell({
      width: { size: 9360, type: WidthType.DXA },
      borders: { left: { style: BorderStyle.SINGLE, size: 18, color: ACCENT } },
      shading: { type: ShadingType.CLEAR, fill: 'F3EEE7', color: 'auto' },
      margins: { top: 100, bottom: 100, left: 200, right: 200 },
      children: [ new Paragraph({ children: [
        new TextRun({ text: 'JOB TO BE DONE   ', bold: true, size: 16, color: ACCENT, font: BODY, characterSpacing: 20 }),
        new TextRun({ text: text, size: 21, color: INK, font: BODY, italics: true }),
      ] }) ],
    }) ] }) ],
  });
}

const kids = [];
kids.push(...docTitle('Who we\'re building for', 'The Edit · Personas'));
kids.push(subtitle('Three primary personas and one anti-persona. Each is built around a real job to be done, not demographics for their own sake. They share one job: they pay for cohesion.'));
kids.push(H.callout(null, { bg: CHIP_BG, label: 'Read it this way', paras: [
  [{text:'Maya is the wedge we win first.', bold:true},{text:' She feels the problem most sharply and judges cohesion hardest, so winning her is the cleanest proof the curation is real. Priya and Sam are how we expand once the taste is validated: Priya brings the price-watch and retention behaviour, Sam is the clearest showcase for the feed-curator agent.'}],
] }));

// ---- Maya ----
kids.push(new Paragraph({ spacing: { before: 200 }, children: [] }));
kids.push(personaHeader('Maya', 'the aesthetic curator', 'Primary wedge', '2C5A52'));
kids.push(quote('I don\'t want a store. I want the look, and I want it to actually go together.'));
kids.push(demoBox([['Age','24'],['Occupation','Design studio assistant'],['Education','College graduate, design'],['Home','Brooklyn, New York'],['Living','With a roommate']]));
kids.push(spacer(80));
kids.push(twoCol('Goals', [
  'Build a cohesive wardrobe piece by piece, where everything works together.',
  'Discover pieces from brands she\'d never think to check side by side.',
  'See a full look come together before she spends.',
], 'Frustrations', [
  '"My inspiration lives on Pinterest, but the products are on ten different sites."',
  '"I buy pieces that photograph well alone and clash in person."',
  '"I own plenty and still feel like I have nothing to wear."',
]));
kids.push(spacer(80));
kids.push(para('Maya has a defined aesthetic and protects it: soft romance with a little quiet luxury. She keeps dozens of Pinterest boards and can tell you exactly why a piece does or doesn\'t fit her look. Real taste, a modest budget, so every purchase has to earn its place in a wardrobe that already hangs together. Today she assembles that look by hand across a dozen tabs, and it rarely comes together the way it did on the mood board.', { size: 21 }));
kids.push(jtbd('When I find a look I love, I want to shop it across brands in one place, so I can build a wardrobe that actually goes together.'));
kids.push(spacer(60));
kids.push(para([{text:'Why she\'s the wedge: ', bold:true, color:INK},{text:'she feels the core problem most sharply and will judge cohesion hardest. Win Maya and we have proof the curation is real. She\'s who the first concierge test should target.', color:MUTE}], { size:19 }));

kids.push(new Paragraph({ children: [new H.PageBreak()] }));

// ---- Priya ----
kids.push(personaHeader('Priya', 'the deal-smart trend follower', 'Expansion · price + retention', '6B4A3A'));
kids.push(quote('I know what I want. I just want to be told the second it\'s affordable.'));
kids.push(demoBox([['Age','20'],['Occupation','Student, part-time barista'],['Education','University student, 2nd year'],['Home','Austin, Texas'],['Living','Student housing']]));
kids.push(spacer(80));
kids.push(twoCol('Goals', [
  'Get the aesthetic she wants at the right price.',
  'Never miss a price drop on a piece she\'s already decided she wants.',
  'Look current without overspending on a student budget.',
], 'Frustrations', [
  '"I save things in carts across sites and then forget about them."',
  '"Sales come and go without me noticing."',
  '"Nothing watches my wishlist for me. I have to keep checking."',
]));
kids.push(spacer(80));
kids.push(para('Priya follows trends closely but is patient on a student budget, so she\'ll save a piece and wait for it to go on sale. She treats her saved items like a watchlist and hates missing a drop on something she already wanted. She\'s why "save to board" and "price drop" exist: give her a place to park her wishlist and let the app do the watching.', { size: 21 }));
kids.push(jtbd('When I\'ve decided I want a piece, I want to be alerted the moment it drops in price, so I can buy it without overpaying or missing it.'));
kids.push(spacer(60));
kids.push(para([{text:'Watch the line with Dev: ', bold:true, color:INK},{text:'Priya is aesthetic-first and patient, wanting the right piece at a better price. Dev (our anti-persona) is price-first and aesthetic-agnostic. The gap is thin. If we lean too hard into deals, we drift toward serving Dev instead of Priya.', color:MUTE}], { size:19 }));

kids.push(new Paragraph({ children: [new H.PageBreak()] }));

// ---- Sam ----
kids.push(personaHeader('Sam', 'the time-poor minimalist', 'Expansion · agent showcase', '6B4A3A'));
kids.push(quote('Show me ten things that go together. I\'ll pick three and get on with my day.'));
kids.push(demoBox([['Age','31'],['Occupation','Management consultant'],['Education','MBA'],['Home','Chicago, Illinois'],['Living','With a partner']]));
kids.push(spacer(80));
kids.push(twoCol('Goals', [
  'Look put-together with as little effort as possible.',
  'Solve a specific wardrobe gap quickly and decisively.',
  'Buy a few quality pieces that work with what he already owns.',
], 'Frustrations', [
  '"Every retailer wants me to browse endlessly."',
  '"Nothing understands \'just show me pieces that go together.\'"',
  '"Decision fatigue kills the session before I actually buy."',
]));
kids.push(spacer(80));
kids.push(para('Sam wants to look sharp with minimal effort: quiet utility, clean and functional, quality over quantity. Shopping is a chore to finish, not a hobby. When Sam shops it\'s to solve a gap ("trousers that go with what I own"), and the ideal outcome is a small, coherent set of good pieces chosen fast.', { size: 21 }));
kids.push(jtbd('When I need to fill a wardrobe gap, I want a short, cohesive set chosen for me, so I can decide fast and move on.'));
kids.push(spacer(60));
kids.push(para([{text:'Why he matters: ', bold:true, color:INK},{text:'Sam is the clearest showcase for the feed-curator agent, pick the aesthetic once and get a tight cohesive set. He also tests whether curation has value even for someone who doesn\'t enjoy shopping.', color:MUTE}], { size:19 }));

kids.push(new Paragraph({ children: [new H.PageBreak()] }));

// ---- Anti-persona ----
kids.push(personaHeader('Dev', 'the bargain maximiser', 'Anti-persona · not for us', 'A03A2E'));
kids.push(quote('Just show me the cheapest version of whatever\'s trending right now.'));
kids.push(demoBox([['Age','26'],['Occupation','Bargain maximiser'],['Education','College graduate'],['Home','Anywhere online']]));
kids.push(spacer(80));
kids.push(twoCol('What they want', [
  'Maximum volume of trend pieces at rock-bottom prices.',
  'Impulse buys, aesthetic-agnostic; cohesion doesn\'t matter.',
  'Whatever is cheapest today, regardless of brand or fit.',
], 'Why we don\'t serve them', [
  'They\'d see our curated, on-palette feed as fewer options at higher prices.',
  'Serving them pulls us toward being a discount aggregator.',
  'It dilutes the one thing that makes us different: taste and cohesion.',
]));
kids.push(spacer(80));
kids.push(para('Dev shops constantly for the cheapest trend piece from fast-fashion mega-sites, returns a lot, and doesn\'t care whether anything goes together. Curation has no value here. Building for Dev would compromise the product for everyone we are building for, so we knowingly leave this shopper to the discount aggregators.', { size: 21 }));
kids.push(spacer(40));
kids.push(para([{text:'Naming who we\'re not for is a product decision, not an oversight. It keeps the roadmap honest about the taste-driven shopper at the centre.', italic:true, color:MUTE}], { size:19 }));

kids.push(footerRule());
kids.push(para([{text:'The Edit — Personas', color:MUTE, size:16},{text:'          July 2026 · working draft for review', color:MUTE, size:16}]));

write(buildDoc(kids), './out/02-personas.docx');
