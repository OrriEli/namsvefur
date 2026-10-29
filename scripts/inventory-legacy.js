// Úttekt á gömlu síðunum: telur gagnafylki, spurningagerðir, svið, efnisflokka, stig og uppruna.
// Notkun:
//   node scripts/inventory-legacy.js            prentar skýrsluna sem JSON
//   node scripts/inventory-legacy.js --write    uppfærir talnablokkina í docs/legacy-inventory.md
// Rafalar eru keyrðir RUNS sinnum (á hverju stigi) til að sjá hvað þeir skila; þetta er ekki
// 1.000 keyrslna prófið, aðeins könnun.

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadLegacy, renderToHtml } from './lib/load-legacy.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const RUNS = 200;

export const COURSES = [
  { id: 'hag101g', file: 'HAG101G miðannarpróf.html' },
  { id: 'hag103g', file: 'HAG103G prófæfing.html' },
  { id: 'hag106g', file: 'HAG106G prófæfing.html' },
  { id: 'hag107g', file: 'HAG107G prófæfing.html' },
  { id: 'hag108g', file: 'HAG108G prófæfing.html' }
];

const tally = (list, fn) => { const o = {}; for (const x of list) { const k = String(fn(x)); o[k] = (o[k] || 0) + 1; } return o; };
const keysOf = list => [...new Set(list.flatMap(x => Object.keys(x)))].sort();
const isBad = v => typeof v === 'number' && !Number.isFinite(v);

function navOf(html) {
  const nav = (html.match(/<nav id="nav">([\s\S]*?)<\/nav>/) || [])[1] || '';
  return [...nav.matchAll(/data-v="([^"]+)">([^<]+)/g)].map(m => ({ v: m[1], label: m[2].trim() }));
}

function sheetSections(html) {
  return [...html.matchAll(/<section[^>]*>\s*<h2><span class="n">([^<]*)<\/span>([\s\S]*?)<\/h2>/g)]
    .map(m => ({ n: m[1], title: m[2].replace(/<[^>]+>/g, '').trim() }));
}

function dupes(ids) { const seen = new Set(), d = new Set(); for (const i of ids) { if (seen.has(i)) d.add(i); seen.add(i); } return [...d]; }

// Keyrir rafal og safnar því sem hann skilar.
function probeGen(run, n) {
  const out = { runs: 0, errors: 0, kinds: {}, fields: new Set(), optCounts: {}, dupOpts: 0, badNums: 0, firstError: null, flags: {} };
  for (let i = 0; i < n; i++) {
    let r;
    try { r = run(); } catch (e) { out.errors++; out.firstError ??= String(e.message || e); continue; }
    out.runs++;
    Object.keys(r).forEach(k => out.fields.add(k));
    const kind = r.kind || (r.steps ? 'steps' : r.o ? 'mc' : '?');
    out.kinds[kind] = (out.kinds[kind] || 0) + 1;
    if (r.o) { out.optCounts[r.o.length] = (out.optCounts[r.o.length] || 0) + 1; if (new Set(r.o).size !== r.o.length) out.dupOpts++; }
    for (const k of ['ans', 'tol', 'x', 'a']) if (isBad(r[k])) out.badNums++;
    if (r.prob) out.flags.prob = (out.flags.prob || 0) + 1;
  }
  out.fields = [...out.fields].sort();
  return out;
}

function inventory(c) {
  const L = loadLegacy(join(ROOT, 'legacy', c.file));
  const V = L.vars;
  const rep = { id: c.id, file: c.file, storageKey: V.KEY || V.STORE_KEY, stateDefault: Object.keys(V.S || {}), loadErrors: L.errors, nav: navOf(L.html) };
  rep.arrays = Object.fromEntries(Object.entries(V).filter(([, v]) => Array.isArray(v)).map(([k, v]) => [k, v.length]));

  if (c.id === 'hag103g' || c.id === 'hag107g') {
    const items = V.STATIC;
    rep.topics = V.ORDER.map(t => ({ id: t, name: V.TOPICS[t].n, ref: V.TOPICS[t].mt }));
    rep.items = { total: items.length, byType: { mc: items.length }, bySource: tally(items, q => q.kind), byTopic: tally(items, q => q.t), fields: keysOf(V.OLD.concat(V.NEW)), optionCounts: tally(items, q => q.o.length) };
    rep.oldBySrc = tally(V.OLD, q => q.id.replace(/-.*$/, ''));
    rep.gens = { total: V.GENS.length, byTopic: tally(V.GENS, g => g.t), list: V.GENS.map(g => ({ id: g.id, topic: g.t, name: g.name, probe: probeGen(() => g.f(), RUNS) })) };
    rep.exam = { mix: V.MIX, mixTotal: Object.values(V.MIX).reduce((a, b) => a + b, 0), examAt: new Date(V.EXAM_AT).toISOString() };
    rep.plan = V.PLAN.length;
    rep.dupIds = dupes([...items.map(q => q.id), ...V.GENS.map(g => g.id)]);
  }

  if (c.id === 'hag106g' || c.id === 'hag108g') {
    const bank = V.BANK;
    rep.lectures = V.LECTURES.map(l => ({ id: l.id, label: l.label, name: l.name, members: l.members || null }));
    rep.levels = V.LEVELS;
    rep.items = {
      total: bank.length,
      byType: tally(bank, q => q.kind),
      bySource: tally(bank, q => q.from),
      byLecture: tally(bank, q => q.lec),
      byLevel: tally(bank, q => q.lvl),
      byTypeLevel: tally(bank, q => q.kind + '@' + q.lvl),
      fieldsByType: Object.fromEntries(['mc', 'num', 'step', 'card'].map(k => [k, keysOf(bank.filter(q => q.kind === k))])),
      optionCounts: tally(bank.filter(q => q.kind === 'mc'), q => q.o.length),
      numProb: bank.filter(q => q.kind === 'num' && q.prob).length,
      rFlag: bank.filter(q => q.r).length,
      rCode: bank.filter(q => q.rc).length,
      stepCount: tally(bank.filter(q => q.kind === 'step'), q => q.steps.length),
      tolValues: tally(bank.filter(q => q.kind === 'num'), q => q.tol),
      units: tally(bank.filter(q => q.kind === 'num'), q => q.unit || '(engin)')
    };
    rep.gens = {
      total: V.GENS.length,
      byLecture: tally(V.GENS, g => g.lec),
      rFlag: V.GENS.filter(g => g.r).map(g => ({ id: g.id, r: g.r })),
      list: V.GENS.map(g => ({ id: g.id, lecture: g.lec, name: g.name, r: g.r ?? null,
        probe: Object.fromEntries([1, 2, 3].map(l => [l, probeGen(() => g.f(l), RUNS)])) }))
    };
    rep.entries = { total: V.ENTRIES.length, gen: V.ENTRIES.filter(e => e.kind === 'gen').length };
    rep.exam = { EXAM: V.EXAM, MIXES: V.MIXES, LEN: V.LEN, R_SHARE: V.R_SHARE ?? null };
    rep.dupIds = dupes([...bank.map(q => q.id), ...V.GENS.map(g => g.id)]);
  }

  if (c.id === 'hag101g') {
    const st = V.STATIC, qk = V.QUICK;
    rep.topics = V.ORDER.map(t => ({ id: t, name: V.TOPICS[t].n, ref: V.TOPICS[t].k, weight: V.TOPICS[t].w }));
    rep.items = {
      written: { total: st.length, bySource: tally(st, p => p.kind), byTopic: tally(st, p => p.t), fields: keysOf(st), stepFields: keysOf(st.flatMap(p => p.steps)), stepCount: tally(st, p => p.steps.length), pointsTotal: tally(st, p => p.steps.reduce((s, x) => s + x.stig, 0)), sheetProbs: V.SHEET_PROBS.length, newProbs: V.NEW_PROBS.length },
      quick: { total: qk.length, withOptions: qk.filter(p => p.o).length, typed: qk.filter(p => !p.o).length, byTopic: tally(qk, p => p.t), fields: keysOf(qk), answerForms: tally(qk.filter(p => !p.o), p => /\//.test(p.a) ? 'brot' : /\./.test(p.a) ? 'tugabrot' : 'heiltala') }
    };
    rep.gens = {
      total: V.GENS.length, withQuick: V.QGENS.length, byTopic: tally(V.GENS, g => g.t),
      list: V.GENS.map(g => ({ id: g.id, topic: g.t, name: g.name, probe: probeGen(() => g.f(), RUNS),
        quick: probeGen(() => { const r = g.f(); if (!r.quick) throw new Error('enginn quick'); return r.quick; }, 50) }))
    };
    rep.exam = { blueprint: V.BLUEPRINT, blueprintTotal: V.BLUEPRINT.reduce((s, b) => s + b.w, 0), oldExam: V.OLD_EXAM.map(k => { const p = st.find(x => x.id === k); return { id: k, topic: p.t, weight: p.exam, src: p.src }; }), examAt: new Date(V.EXAM_AT).toISOString() };
    rep.exam.oldExamTotal = rep.exam.oldExam.reduce((s, x) => s + x.weight, 0);
    rep.plan = { days: V.PLAN.length, items: V.PLAN.reduce((s, d) => s + d.items.length, 0) };
    rep.dupIds = dupes([...st.map(p => p.id), ...qk.map(p => p.id), ...V.GENS.map(g => g.id)]);
  }

  const sheetHtml = renderToHtml(L, 'renderSheet');
  rep.sheet = { htmlLength: sheetHtml.length, sections: sheetSections(sheetHtml) };
  return rep;
}

// Tölurnar sem útdráttarprófin bera saman við.
export function counts(reports) {
  const o = {};
  for (const r of reports) {
    const g = r.gens;
    if (r.id === 'hag101g') o[r.id] = { written: r.items.written.total, quick: r.items.quick.total, quickMc: r.items.quick.withOptions, quickNum: r.items.quick.typed, gens: g.total, quickGens: g.withQuick, sheetSections: r.sheet.sections.length };
    else if (r.items.byType.mc === r.items.total && !r.items.byType.num) o[r.id] = { mc: r.items.total, old: r.items.bySource.old || 0, new: r.items.bySource.new || 0, gens: g.total, sheetSections: r.sheet.sections.length };
    else o[r.id] = { ...r.items.byType, total: r.items.total, gens: g.total, genEntries: r.entries.gen, sheetSections: r.sheet.sections.length };
  }
  return o;
}

if (fileURLToPath(import.meta.url) === process.argv[1]) {
  const reports = COURSES.map(inventory);
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
