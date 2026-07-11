const docx = require('docx');
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType,
  BorderStyle, WidthType, Table, TableRow, TableCell, ShadingType,
  LevelFormat, PageBreak, PositionalTab, PositionalTabAlignment, PositionalTabLeader
} = docx;

// ---- palette ----
const INK = '1A1A1A';
const MUTE = '5A5550';
const ACCENT = '9A5B4F';   // warm editorial clay
const RULE = 'C9BFB6';
const CHIP_BG = 'F1ECE7';
const PROTO_BG = 'E8E0D8';
const NEW_BG = 'DCE6E4';
const REC_BG = 'F3EEE7';

const BODY = 'Calibri';
const HEAD = 'Georgia';

// inline: accept a string or array of run-specs {text, bold, italic, color, size, font}
function runs(content, base = {}) {
  const arr = Array.isArray(content) ? content : [{ text: content }];
  return arr.map(r => new TextRun({
    text: r.text,
    bold: r.bold ?? base.bold,
    italics: r.italic ?? base.italic,
    color: r.color ?? base.color ?? INK,
    size: r.size ?? base.size ?? 22,
    font: r.font ?? base.font ?? BODY,
  }));
}

function docTitle(text, tag) {
  const kids = [];
  if (tag) kids.push(new Paragraph({
    spacing: { after: 60 },
    children: [new TextRun({ text: tag.toUpperCase(), bold: true, color: ACCENT, size: 16, font: BODY, characterSpacing: 40 })],
  }));
  kids.push(new Paragraph({
    spacing: { after: 40 },
    children: [new TextRun({ text, bold: true, color: INK, size: 40, font: HEAD })],
  }));
  return kids;
}

function subtitle(content) {
  return new Paragraph({
    spacing: { after: 200 },
    children: runs(content, { italic: true, color: MUTE, size: 22 }),
  });
}

function sectionLabel(text) {
  return new Paragraph({
    spacing: { before: 240, after: 80 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: RULE, space: 4 } },
    children: [new TextRun({ text: text.toUpperCase(), bold: true, color: ACCENT, size: 19, font: BODY, characterSpacing: 30 })],
  });
}

function subhead(content) {
  return new Paragraph({
    spacing: { before: 160, after: 60 },
    children: runs(content, { bold: true, color: INK, size: 24, font: HEAD }),
  });
}

function para(content, opts = {}) {
  return new Paragraph({
    spacing: { after: opts.after ?? 120, before: opts.before ?? 0, line: 276 },
    alignment: opts.align,
    children: runs(content, { size: opts.size ?? 22 }),
  });
}

function bullet(content, level = 0) {
  return new Paragraph({
    numbering: { reference: 'bul', level },
    spacing: { after: 80, line: 272 },
    children: runs(content, { size: 22 }),
  });
}

function numbered(content, level = 0) {
  return new Paragraph({
    numbering: { reference: 'num', level },
    spacing: { after: 80, line: 272 },
    children: runs(content, { size: 22 }),
  });
}

// callout box (single-cell shaded table) — used for the core bet / recommendations
function callout(content, opts = {}) {
  const bg = opts.bg ?? REC_BG;
  const label = opts.label;
  const kids = [];
  if (label) kids.push(new Paragraph({
    spacing: { after: 40 },
    children: [new TextRun({ text: label.toUpperCase(), bold: true, color: ACCENT, size: 16, font: BODY, characterSpacing: 30 })],
  }));
  const bodyParas = Array.isArray(opts.paras) ? opts.paras : [content];
  bodyParas.forEach((p, i) => kids.push(new Paragraph({
    spacing: { after: i === bodyParas.length - 1 ? 0 : 100, line: 272 },
    children: runs(p, { size: opts.size ?? 22 }),
  })));
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [9360],
    borders: allBorders('none'),
    rows: [new TableRow({ children: [new TableCell({
      width: { size: 9360, type: WidthType.DXA },
      shading: { type: ShadingType.CLEAR, fill: bg, color: 'auto' },
      margins: { top: 140, bottom: 140, left: 200, right: 200 },
      borders: { left: { style: BorderStyle.SINGLE, size: 18, color: ACCENT } },
      children: kids,
    })] })],
  });
}

function allBorders(kind) {
  const none = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
  const line = { style: BorderStyle.SINGLE, size: 4, color: RULE };
  const b = kind === 'none' ? none : line;
  return { top: b, bottom: b, left: b, right: b, insideHorizontal: b, insideVertical: b };
}

function tag(kind) {
  // returns an inline TextRun for PROTO / NEW tags
  const isNew = /new/i.test(kind);
  return new TextRun({ text: ' ' + kind.toUpperCase() + ' ', bold: true, size: 15,
    color: isNew ? '2C5A52' : '6B4A3A', font: BODY, highlight: undefined });
}

// generic table from header row + rows (each cell = string or run-array)
function table(headers, rows, colWidths, opts = {}) {
  const total = colWidths.reduce((a, b) => a + b, 0);
  const headerCells = headers.map((h, i) => new TableCell({
    width: { size: colWidths[i], type: WidthType.DXA },
    shading: { type: ShadingType.CLEAR, fill: INK, color: 'auto' },
    margins: { top: 70, bottom: 70, left: 110, right: 110 },
    children: [new Paragraph({ children: [new TextRun({ text: h, bold: true, color: 'FFFFFF', size: 18, font: BODY })] })],
  }));
  const bodyRows = rows.map((r, ri) => new TableRow({ children: r.map((c, i) => new TableCell({
    width: { size: colWidths[i], type: WidthType.DXA },
    shading: { type: ShadingType.CLEAR, fill: ri % 2 ? 'FFFFFF' : 'F7F3EF', color: 'auto' },
    margins: { top: 70, bottom: 70, left: 110, right: 110 },
    children: [new Paragraph({ spacing: { line: 264 }, children: runs(c, { size: opts.size ?? 19 }) })],
  })) }));
  return new Table({
    width: { size: total, type: WidthType.DXA },
    columnWidths: colWidths,
    borders: allBorders('line'),
    rows: [new TableRow({ tableHeader: true, children: headerCells }), ...bodyRows],
  });
}

function spacer(after = 120) {
  return new Paragraph({ spacing: { after }, children: [] });
}

function footerRule() {
  return new Paragraph({
    spacing: { before: 200 },
    border: { top: { style: BorderStyle.SINGLE, size: 6, color: RULE, space: 6 } },
    children: [],
  });
}

function buildDoc(children) {
  return new Document({
    styles: { default: { document: { run: { font: BODY, size: 22, color: INK } } } },
    numbering: {
      config: [
        { reference: 'bul', levels: [
          { level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT,
            style: { run: { color: ACCENT }, paragraph: { indent: { left: 360, hanging: 220 } } } },
          { level: 1, format: LevelFormat.BULLET, text: '–', alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 720, hanging: 220 } } } },
        ] },
        { reference: 'num', levels: [
          { level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.LEFT,
            style: { run: { bold: true, color: ACCENT }, paragraph: { indent: { left: 360, hanging: 240 } } } },
        ] },
      ],
    },
    sections: [{
      properties: { page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1080, bottom: 1080, left: 1200, right: 1200 },
      } },
      children,
    }],
  });
}

async function write(doc, path) {
  const buf = await Packer.toBuffer(doc);
  const fs = require('fs');
  fs.mkdirSync(require('path').dirname(path), { recursive: true });
  fs.writeFileSync(path, buf);
  console.log('wrote', path);
}

module.exports = {
  docx, INK, MUTE, ACCENT, RULE, CHIP_BG, PROTO_BG, NEW_BG, REC_BG, BODY, HEAD,
  runs, docTitle, subtitle, sectionLabel, subhead, para, bullet, numbered,
  callout, table, tag, spacer, footerRule, buildDoc, write, PageBreak,
};
