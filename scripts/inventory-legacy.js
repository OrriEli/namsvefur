// Úttekt á gömlu síðunum: telur atriði eftir gerð og uppruna, rafala, æfingafærslur og kafla í Blaðinu,
// beint úr minni hverrar síðu. Rafalar eru keyrðir RUNS sinnum (á hverju stigi) til að sjá hvað þeir skila.
// Notkun:
//   node scripts/inventory-legacy.js            prentar skýrsluna sem JSON
//   node scripts/inventory-legacy.js --write    uppfærir talnablokkina í docs/legacy-inventory.md

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadLegacy, renderToHtml } from './lib/load-legacy.js';
import { META, SOURCE_OF, splitSheet } from './extract-legacy.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const RUNS = 100;
const tally = list => { const o = {}; for (const x of list) o[x] = (o[x] || 0) + 1; return Object.fromEntries(Object.entries(o).sort()); };
const TYPE = { mc: 'mc', multi: 'multi', match: 'match', num: 'num', step: 'steps', card: 'card' };

function probe(run) {
  const kinds = {}; let errors = 0, first = null;
  for (let i = 0; i < RUNS; i++) { try { const r = run(); const k = r.kind || r.ty || (r.steps ? 'steps' : 'mc'); kinds[k] = (kinds[k] || 0) + 1; } catch (e) { errors++; first ??= e.message; } }
  return { kinds, errors, first };
}

export function inventory(id) {
  const meta = META[id];
  const L = loadLegacy(join(ROOT, 'legacy', meta.file)); const V = L.vars;
  const sheetHtml = renderToHtml(L, 'renderSheet');
  const sheet = splitSheet(id, sheetHtml.match(/^<div class="sheet">([\s\S]*)<\/div>$/)[1]);
  const base = { id, file: meta.file, engine: meta.engine, storageKey: V.KEY || V.STORE_KEY, examAt: V.EXAM_AT ? new Date(V.EXAM_AT).toISOString() : V.EXAM && V.EXAM.at, sheetSections: sheet.sections.map(s => `${s.n} ${s.title}`) };
  if (meta.engine === 'mcq') {
    const gens = [...V.GENS, ...(V.GENS2 || [])];
    return { ...base, items: V.STATIC.length, byType: tally(V.STATIC.map(q => q.ty || 'mc')), bySource: tally(V.STATIC.map(q => SOURCE_OF[q.kind])),
      byTopic: tally(V.STATIC.map(q => q.t)), topics: V.ORDER.length, gens: gens.length, entries: V.ENTRIES.length, probes: Object.fromEntries(gens.map(g => [g.id, probe(() => g.f())])) };
  }
  if (meta.engine === 'lecture') {
    return { ...base, items: V.BANK.length, byType: tally(V.BANK.map(q => TYPE[q.kind])), bySource: tally(V.BANK.map(q => SOURCE_OF[q.from])),
      byTopic: tally(V.BANK.map(q => q.lec)), byLevel: tally(V.BANK.map(q => q.lvl)), topics: V.LECTURES.length, gens: V.GENS.length, entries: V.ENTRIES.length,
      probes: Object.fromEntries(V.GENS.flatMap(g => [1, 2, 3].map(l => [`${g.id}@${l}`, probe(() => g.f(l))]))) };
  }
  const quickMc = V.QUICK.filter(q => q.o).length;
  return { ...base, items: V.STATIC.length + V.QUICK.length, byType: { mc: quickMc, num: V.QUICK.length - quickMc, steps: V.STATIC.length }, bySource: tally(V.STATIC.map(p => SOURCE_OF[p.kind])),
    byTopic: tally(V.STATIC.map(p => p.t)), topics: V.ORDER.length, written: V.STATIC.length, quick: V.QUICK.length, gens: V.GENS.length + V.QGENS.length, quickGens: V.QGENS.length,
    entries: V.W_ENTRIES.length + V.Q_ENTRIES.length, probes: Object.fromEntries(V.GENS.map(g => [g.id, probe(() => g.f())])) };
}

// Tölurnar sem útdráttarprófin bera saman við.
export function counts(reports) {
  return Object.fromEntries(reports.map(r => [r.id, { items: r.items, byType: r.byType, bySource: r.bySource, gens: r.gens, entries: r.entries, sheetSections: r.sheetSections.length }]));
}

if (fileURLToPath(import.meta.url) === process.argv[1]) {
  const reports = Object.keys(META).map(inventory);
  if (process.argv.includes('--write')) {
    const path = join(ROOT, 'docs', 'legacy-inventory.md');
    const md = readFileSync(path, 'utf8');
    const block = '```json\n' + JSON.stringify(counts(reports), null, 2) + '\n```';
    const next = md.replace(/(<!-- inventory:counts:begin -->\n)[\s\S]*?(\n<!-- inventory:counts:end -->)/, `$1${block}$2`);
    if (next === md && !md.includes(block)) throw new Error('Fann ekki merkin inventory:counts í docs/legacy-inventory.md');
    writeFileSync(path, next);
    console.log('Uppfærði talnablokkina í docs/legacy-inventory.md');
  } else {
    console.log(JSON.stringify(reports, null, 2));
  }
}
