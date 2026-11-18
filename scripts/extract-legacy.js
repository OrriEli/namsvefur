// Flytur efnið út úr gömlu síðunum í src/courses/ og stílana í src/ui/. Ekkert er afritað í höndunum:
//  - src/courses/legacy/<fag>.js   gagnablokk síðunnar orðrétt sem ES-eining (atriði, rafalar, hjálparföll);
//                                  aðeins skilgreiningu síðunnar á F er skipt út fyrir sameiginlegu eininguna
//  - src/courses/<fag>.js          lýsigögn (flokkar, prófsnið, Blaðið, áætlun) lesin úr því sem gamla síðan
//                                  teiknar, ásamt kalli á millilag vélarinnar sem varpar atriðunum á sniðið
//  - src/ui/base.css, legacy.css   stílar HAG103G orðréttir og viðbætur hinna síðnanna
// Notkun: node scripts/extract-legacy.js

import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadLegacy, renderToHtml, inlineScripts, clickApp } from './lib/load-legacy.js';
import hag101gUpdates from '../src/courses/updates/hag101g.js';
import hag108gUpdates from '../src/courses/updates/hag108g.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'src', 'courses');

export const META = {
  hag101g: { file: 'HAG101G lokapróf.html', code: 'HAG101G', name: 'Hagræn stærðfræði I', short: 'Stærðfræði', engine: 'written', exports: ['STATIC', 'QUICK', 'GENS'] },
  hag103g: { file: 'HAG103G prófæfing.html', code: 'HAG103G', name: 'Heildahagfræði I', short: 'Heild', engine: 'mcq', exports: ['OLD', 'OLD2', 'NEW', 'NEW2', 'GENS', 'GENS2'] },
  hag106g: { file: 'HAG106G prófæfing.html', code: 'HAG106G', name: 'Fjármálahagfræði I', short: 'Fjármál', engine: 'lecture', exports: ['BANK', 'GENS', 'A4_HTML'] },
  hag107g: { file: 'HAG107G prófæfing.html', code: 'HAG107G', name: 'Eindahagfræði I', short: 'Einda', engine: 'mcq', exports: ['OLD', 'NEW', 'GENS'] },
  hag108g: { file: 'HAG108G prófæfing.html', code: 'HAG108G', name: 'Líkindafræði og forritun', short: 'Líkindi', engine: 'lecture', exports: ['BANK', 'GENS'] }
};

export const SOURCE_OF = { old: 'old', new: 'new', gen: 'gen', blad: 'sheet', db: 'sheet', hv: 'sheet', gl: 'slides', mid: 'old', ny: 'new' };
const DEFAULT_SOURCE_LABELS = { old: 'Gömul próf', new: 'Nýjar', sheet: 'Dæmablöð', slides: 'Glærur', gen: 'Rafalar' };

const must = (m, what) => { if (!m) throw new Error('Fann ekki ' + what); return m; };
const clean = o => Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined));
const tally = list => list.reduce((o, t) => (o[t] = (o[t] || 0) + 1, o), {});

// ---------- gagnablokkin sem ES-eining ----------
function dataCode(meta, L) {
  const scripts = inlineScripts(L.html);
  if (meta.engine === 'written') {
    const s = must(scripts.find(x => x.includes('// ===== app.js =====')), 'app.js');
    return s.slice(s.indexOf('(() => {\n') + '(() => {\n'.length, s.indexOf('// ===== app.js ====='));
  }
  return must(scripts.find(x => /^const GENS = \[/m.test(x)), 'gagnablokk');
}

export function legacyModule(id, meta, L) {
  let code = dataCode(meta, L).replace(/^\n+/, '').replace(/\s+$/, '\n');
  const fBlock = /^const F = \{\n[\s\S]*?\n\};\n/m;
  let header = '';
  if (fBlock.test(code)) {
    const digits = (L.vars.F.pct(0.123456).split(',')[1] || '').replace('%', '').length;
    code = code.replace(fBlock, `const F = makeF({ pctDigits: ${digits} });\n`);
    header = "import { makeF } from '../../ui/format.js';\n\n";
  }
  for (const n of meta.exports) if (!new RegExp(`^(const|let|var|function) ${n}\\b`, 'm').test(code)) throw new Error(`${id}: ${n} er ekki skilgreint í gagnablokkinni`);
  return `// Búið til af scripts/extract-legacy.js úr legacy/${meta.file}. Ekki breyta í höndunum.
// Gagnablokk gömlu síðunnar, orðrétt${header ? '; aðeins skilgreiningu síðunnar á F er skipt út fyrir sameiginlegu eininguna' : ''}.
/* eslint-disable */
${header}${code}
export { ${meta.exports.join(', ')} };
`;
}

// ---------- Blaðið ----------
const sectionTitle = h2 => h2.replace(/<span class="n">[\s\S]*?<\/span>|<span class="kafli">[\s\S]*?<\/span>|<button[\s\S]*?<\/button>/g, '').replace(/<[^>]+>/g, '').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&amp;/g, '&').trim();

export function splitSheet(courseId, inner) {
  const parts = [...inner.matchAll(/<section\b[^>]*>[\s\S]*?<\/section>/g)];
  must(parts.length, 'kafla í Blaðinu');
  const last = parts[parts.length - 1];
  const foot = inner.slice(last.index + last[0].length);
  return clean({
    head: inner.slice(0, parts[0].index),
    sections: parts.map(m => {
      const html = m[0];
      const h = must(html.match(/<h2>([\s\S]*?)<\/h2>/), 'fyrirsögn kafla')[1];
      const n = (h.match(/<span class="n">([^<]*)<\/span>/) || [])[1] || '';
      const id = (html.match(/^<section id="([^"]+)"/) || [])[1] || `${courseId}-${n}`;
      return { id, n, title: sectionTitle(h), html };
    }),
    foot: foot.trim() ? foot : undefined
  });
}

function sheetOf(id, L) {
  const html = renderToHtml(L, 'renderSheet');
  const sheet = splitSheet(id, must(html.match(/^<div class="sheet">([\s\S]*)<\/div>$/), 'Blaðið')[1]);
  if (L.vars.A4_HTML) {
    const a4 = clickApp(L, '[data-tab]', { tab: 'a4' });
    sheet.a4 = { head: must(a4.match(/^<div class="sheet a4mode">\s*(<div class="stack"[\s\S]*?<\/div>)\s*<div class="row"/), 'haus A4-blaðs')[1] };
    clickApp(L, '[data-tab]', { tab: 'list' });
  }
  return sheet;
}

// ---------- forsíða gömlu síðunnar ----------
function examInfoOf(L) {
  const home = renderToHtml(L, 'renderHome');
  const facts = must(home.match(/<div class="facts">([\s\S]*?)<\/div>\s*<div class="actions/), 'staðreyndir')[1];
  const V = L.vars;
  return clean({
    title: must(L.html.match(/<div class="brand">([^<]+?) <small>/), 'heiti prófs')[1],
    format: V.EXAM && V.EXAM.format, aids: V.EXAM && V.EXAM.aids, weight: V.EXAM && V.EXAM.weight,
    note: (home.match(/<\/table><\/div>\s*<p class="hint">([\s\S]*?)<\/p>/) || [])[1],
    callout: (home.match(/<div class="callout">[\s\S]*?<\/ul><\/div>/) || [])[0],
    facts: [...facts.matchAll(/<div><b>([^<]*)<\/b><span>([^<]*)<\/span><\/div>/g)].map(m => ({ value: m[1], label: m[2] }))
  });
}

// Hnappar á upphafsskjá prófsins: auðkenni, heiti og lýsing orðrétt.
function examButtons(L) {
  const setup = renderToHtml(L, 'renderExam');
  return [...setup.matchAll(/<button class="action[^"]*" data-k="(\w+)"><h3>([^<]+?) <span class="mono">[^<]*<\/span><\/h3><p>([\s\S]*?)<\/p><\/button>/g)].map(m => ({ id: m[1], name: m[2], desc: m[3] }));
}

// Keyrir buildExam gömlu síðunnar og skilar tíma og færslum (prófinu er hent á eftir).
function legacyExam(L, k) {
  L.vars.buildExam(k);
  const X = L.vars.S.exam; L.vars.S.exam = null;
  return { minutes: X.dur / 60e3, keys: X.items.map(it => it.key), topics: X.items.map(it => it.t), kinds: X.items.map(it => it.kind), weights: X.items.map(it => it.w) };
}

// ---------- áætlun ----------
const MON = { jan: 1, feb: 2, mar: 3, apr: 4, maí: 5, jún: 6, júl: 7, ágú: 8, sep: 9, okt: 10, nóv: 11, des: 12 };
function isoFromLabel(label) {
  const m = label.match(/(\d{1,2})\. ([a-záéíóúýþæöð]{3})/i);
  return m && MON[m[2].toLowerCase()] ? `2026-${String(MON[m[2].toLowerCase()]).padStart(2, '0')}-${m[1].padStart(2, '0')}` : undefined;
}
function normGo(go) {
  if (!go) return undefined;
  if (typeof go === 'object') return clean({ v: go.v, topics: go.topics, kind: go.kind ? SOURCE_OF[go.kind] || go.kind : undefined, sec: go.sec, start: go.start, review: go.review });
  if (go === 'second') return { v: 'exam', start: 'second' };
  if (go.startsWith('t:')) return go === 't:all' ? { v: 'practice' } : { v: 'practice', topics: go.slice(2).split(',') };
  return { v: go };
}
function planOf(L) {
  const V = L.vars; if (!V.PLAN || !V.renderPlan) return undefined;
  const html = renderToHtml(L, 'renderPlan');
  const head = must(html.match(/<span class="eyebrow">([^<]*)<\/span><h1>([^<]*)<\/h1>/), 'fyrirsögn áætlunar');
  const intro = must(html.match(/<p class="muted" style="max-width:62ch">([\s\S]*?)<\/p>/), 'inngang áætlunar')[1];
  return { eyebrow: head[1], title: head[2], intro, days: V.PLAN.map(planDay) };
}
/** Dagur í PLAN gömlu síðnanna → dagur í áætlun vefsins. */
function planDay(d) {
  const iso = /^\d{4}-\d\d-\d\d$/.test(d.d) ? d.d : isoFromLabel(d.d);
  const label = /^\d{4}-/.test(d.d) ? d.h : d.d;
  return clean({ date: iso, label, title: /^\d{4}-/.test(d.d) ? undefined : d.h, cal: d.cal, note: d.note,
    items: d.items.map(s => clean({ at: s.at, m: s.m, h: s.h, p: s.p, go: normGo(s.go), brk: s.brk, exam: s.exam })) });
}

// ---------- breytingar ofan á gömlu síðurnar (src/courses/updates/) ----------
export const UPDATES = { hag101g: hag101gUpdates, hag108g: hag108gUpdates };
function applyUpdates(id, course) {
  const u = UPDATES[id]; if (!u) return course;
  const out = { ...course };
  if (u.self) out.self = u.self;
  if (u.examWeights) out.examWeights = u.examWeights;
  if (u.plan) out.plan = { ...course.plan, eyebrow: u.plan.eyebrow, intro: u.plan.intro, days: u.plan.days.map(planDay) };
  if (u.noteInsert) {
    const note = must(course.examInfo.note && course.examInfo.note.includes(u.noteInsert.before) && course.examInfo.note, 'staðinn fyrir nýju setninguna í skýringunni');
    out.examInfo = { ...course.examInfo, note: note.replace(u.noteInsert.before, u.noteInsert.text + u.noteInsert.before) };
  }
  // ný atriði (millilagið bætir þeim aftan við atriðin úr gömlu síðunni), prófsnið, prófupplýsingar og Blaðið
  if (u.items) out.extraItems = u.items;
  if (u.examFormats) out.examFormats = [...u.examFormats.prepend, ...course.examFormats.map(f => ({ ...f, ...(u.examFormats.edit || {})[f.id] }))];
  if (u.examInfo) out.examInfo = { ...out.examInfo, ...u.examInfo };
  if (u.sheetSections) out.sheet = { ...course.sheet, sections: [...u.sheetSections.prepend, ...course.sheet.sections] };
  for (const r of u.replace || []) {
    must(out.examInfo.callout.includes(r.from) && out.sheet.foot.includes(r.from), `„${r.from}“ í prófupplýsingum og á Blaðinu`);
    out.examInfo = { ...out.examInfo, callout: out.examInfo.callout.replace(r.from, r.to) };
    out.sheet = { ...out.sheet, foot: out.sheet.foot.replace(r.from, r.to) };
  }
  return out;
}

// ---------- vélarnar ----------
function topicsFromHome(L, mk) {
  const home = renderToHtml(L, 'renderHome');
  const out = []; let part;
  for (const m of home.matchAll(/<tr class="grp"><td colspan="\d+">([^<]*)<\/td><\/tr>|data-act="topic" data-t="(\w+)"/g)) {
    if (m[1] !== undefined) part = m[1]; else out.push(clean({ ...mk(m[2]), part }));
  }
  return out;
}

function mcqMeta(id, meta, L) {
  const V = L.vars;
  const buttons = examButtons(L);
  const examFormats = buttons.map(b => {
    const a = legacyExam(L, b.id), c = legacyExam(L, b.id);
    const f = { id: b.id, name: b.name, desc: b.desc, style: 'inspera', minutes: a.minutes };
    if (a.kinds.every(k => k === 'gen')) return { ...f, pick: { by: 'gens', n: a.keys.length } };
    if (a.keys.join() === c.keys.join()) return { ...f, pick: { by: 'fixed', ids: a.keys } };
    return { ...f, pick: { by: 'quota', quota: tally(a.topics) } };
  });
  const main = examFormats.find(f => f.pick.by === 'quota');
  const topics = topicsFromHome(L, t => ({ id: t, name: V.TOPICS[t].n, ref: V.TOPICS[t].mt, review: main && !(t in main.pick.quota) ? true : undefined }));
  for (const f of examFormats) if (f.pick.by === 'quota') { const q = f.pick.quota; f.pick.quota = Object.fromEntries(topics.filter(t => q[t.id]).map(t => [t.id, q[t.id]])); }
  // Merki nýrra spurninga eins og síðan setur þau saman: forskeyti + src, eða fast merki.
  const newWithSrc = V.STATIC.find(q => q.kind === 'new' && [...(V.NEW || []), ...(V.NEW2 || [])].find(n => n.id === q.id && n.src));
  const newNoSrc = V.STATIC.find(q => q.kind === 'new' && [...(V.NEW || []), ...(V.NEW2 || [])].find(n => n.id === q.id && !n.src));
  const rawSrc = newWithSrc && [...(V.NEW || []), ...(V.NEW2 || [])].find(n => n.id === newWithSrc.id).src;
  const sourceLabels = {};
  for (const [k, v] of Object.entries(V.KIND_LABEL)) if (SOURCE_OF[k] && DEFAULT_SOURCE_LABELS[SOURCE_OF[k]] !== v) sourceLabels[SOURCE_OF[k]] = v;
  const engineSrc = inlineScripts(L.html).find(s => /function instantiate/.test(s));
  return clean({
    topics, examFormats, sheet: sheetOf(id, L), plan: planOf(L), examInfo: examInfoOf(L), passScore: 1, sourceLabels,
    genLabel: must(engineSrc.match(/src:'([^']+) · ' \+ g\.name/), 'merki rafala')[1],
    newSrc: { prefix: newWithSrc ? newWithSrc.src.slice(0, newWithSrc.src.length - rawSrc.length) : 'Ný · ', fallback: newNoSrc ? newNoSrc.src : 'Ný spurning' },
    points: V.maxPts ? 'type' : undefined
  });
}

function lectureMeta(id, meta, L) {
  const V = L.vars;
  const sourceLabels = {};
  for (const [k, v] of Object.entries(V.FROM)) if (SOURCE_OF[k] && k !== 'gen' && DEFAULT_SOURCE_LABELS[SOURCE_OF[k]] !== v) sourceLabels[SOURCE_OF[k]] = v;
  if (V.BANK.some(q => q.from === 'mid')) sourceLabels.old = 'Miðannarpróf';
  return clean({
    topics: V.LECTURES.map(l => clean({ id: l.id, label: l.label !== l.id ? l.label : undefined, name: l.name, ref: l.ch, members: l.members })),
    levels: Object.fromEntries(Object.entries(V.LEVELS).map(([k, v]) => [k, { name: v.n, desc: v.d }])),
    modes: [{ id: 'pick', label: 'Valin stig' }, { id: 'adapt', label: 'Stigvaxandi', adapt: true }, { id: 'cards', label: 'Aðeins spjöld', cards: true }],
    examFormats: [{
      id: 'blandad', name: 'Próf á tíma', desc: V.EXAM.format, style: 'mixed',
      pick: clean({
        by: 'levels',
        mixes: Object.entries(V.MIXES).map(([k, m]) => ({ id: k, name: m.n, w: m.w })),
        lengths: Object.entries(V.LEN).map(([k, l]) => ({ id: k, minutes: l.min, n: l.n, cards: l.cards })),
        defaultLength: V.XC.len, explain: V.EXAM.explainQuestions, stepCapL3: 1 / 3,
        points: { mc: 1, num: 1, steps: 3, card: 0 },
        rShare: V.R_SHARE ? { topic: 'L00', share: V.R_SHARE } : undefined
      })
    }],
    sheet: sheetOf(id, L), examInfo: examInfoOf(L), passScore: 0.7, sourceLabels
  });
}

function writtenMeta(id, meta, L) {
  const V = L.vars;
  const buttons = examButtons(L);
  const bp = V.BLUEPRINT.map(b => ({ topics: b.ts, weight: b.w }));
  const examFormats = buttons.map(b => {
    const a = legacyExam(L, b.id);
    const f = { id: b.id, name: b.name, desc: b.desc, style: 'written', minutes: a.minutes };
    if (V.EXAM_SETS[b.id]) return { ...f, pick: { by: 'fixed', ids: V.EXAM_SETS[b.id].ids } };
    return { ...f, pick: clean({ by: 'blueprint', sections: bp, minPoints: 5, gensOnly: b.id === 'gen' ? true : undefined }) };
  });
  const sourceLabels = {};
  for (const [k, v] of Object.entries(V.KIND_LABEL)) if (SOURCE_OF[k] && DEFAULT_SOURCE_LABELS[SOURCE_OF[k]] !== v) sourceLabels[SOURCE_OF[k]] = v;
  return clean({
    topics: V.ORDER.map(t => ({ id: t, name: V.TOPICS[t].n, ref: 'Kafli ' + V.TOPICS[t].k, weight: V.TOPICS[t].w })),
    modes: [{ id: 'written', label: 'Skrifleg dæmi', quick: false }, { id: 'quick', label: 'Hraðæfing', quick: true }],
    examFormats, sheet: sheetOf(id, L), plan: planOf(L), examInfo: examInfoOf(L), passScore: 1, sourceLabels,
    quickGens: V.QGENS.map(g => g.id)
  });
}

export function extract(id) {
  const meta = META[id]; if (!meta) throw new Error('Óþekkt fag ' + id);
  const L = loadLegacy(join(ROOT, 'legacy', meta.file));
  const body = { mcq: mcqMeta, lecture: lectureMeta, written: writtenMeta }[meta.engine](id, meta, L);
  const course = applyUpdates(id, { id, code: meta.code, name: meta.name, short: meta.short, color: `--c-${id}`, engine: meta.engine, ...body, legacy: { key: L.vars.KEY || L.vars.STORE_KEY, file: meta.file } });
  return { course, legacyModule: legacyModule(id, meta, L), L };
}

export function courseModule(id, meta, course) {
  return `// Búið til af scripts/extract-legacy.js úr legacy/${meta.file}. Ekki breyta í höndunum.
import * as L from './legacy/${id}.js';
import adapt from './adapters/${meta.engine}.js';

export const meta = ${JSON.stringify(course, null, 2)};

/** @type {import('../schema.js').Course} */
export default adapt(meta, L);
`;
}

// ---------- stílar ----------
// Les CSS í efstu reglur (at-reglur heilar). Strengir og athugasemdir með slaufusvigum koma ekki fyrir í gömlu síðunum.
export function cssRules(css) {
  const out = []; let i = 0;
  css = css.replace(/\/\*[\s\S]*?\*\//g, '');
  while (i < css.length) {
    const j = css.indexOf('{', i); if (j < 0) break;
    let d = 1, k = j + 1;
    while (k < css.length && d) { if (css[k] === '{') d++; else if (css[k] === '}') d--; k++; }
    out.push({ prelude: css.slice(i, j).trim(), body: css.slice(j + 1, k - 1).trim() });
    i = k;
  }
  return out;
}
const styleOf = html => must(html.match(/<style>\n([\s\S]*?)\n<\/style>/), 'stílblokk')[1].split('\n').filter(l => l.length < 3000).join('\n');
const scope = (prelude, id) => prelude.split(',').map(s => `.c-${id} ${s.trim()}`).join(',');

export function stylesheets() {
  const base = styleOf(loadLegacy(join(ROOT, 'legacy', META.hag103g.file)).html);
  const norm = r => `${r.prelude}{${r.body.replace(/\s+/g, ' ')}}`;
  const seen = new Set(cssRules(base).map(norm));
  const first = new Map(cssRules(base).map(r => [r.prelude, r.body]));
  let extra = '';
  for (const id of ['hag107g', 'hag101g', 'hag106g', 'hag108g']) {
    const rules = cssRules(styleOf(loadLegacy(join(ROOT, 'legacy', META[id].file)).html)).filter(r => !/mjx-container/.test(r.prelude));
    const add = [];
    for (const r of rules) {
      if (seen.has(norm(r))) continue;
      seen.add(norm(r));
      if (first.has(r.prelude) && !r.prelude.startsWith('@') && !r.prelude.startsWith(':root')) { add.push(`${scope(r.prelude, id)}{${r.body}}`); continue; }
      first.set(r.prelude, r.body);
      add.push(`${r.prelude}{${r.body}}`);
    }
    extra += `\n/* ---------- ${META[id].code} ---------- */\n${add.join('\n')}\n`;
  }
  const head = f => `/* Búið til af scripts/extract-legacy.js úr legacy/${f}. Ekki breyta í höndunum. */\n`;
  return {
    base: head(META.hag103g.file) + base + '\n',
    legacy: '/* Búið til af scripts/extract-legacy.js: stílar hinna síðnanna umfram HAG103G. Regla sem stangast á við\n   fyrri reglu með sama veljara gildir aðeins innan síns fags (.c-<fag>). Ekki breyta í höndunum. */\n' + extra
  };
}

if (fileURLToPath(import.meta.url) === process.argv[1]) {
  mkdirSync(join(OUT, 'legacy'), { recursive: true });
  for (const id of Object.keys(META)) {
    const { course, legacyModule: lm } = extract(id);
    writeFileSync(join(OUT, 'legacy', `${id}.js`), lm);
    writeFileSync(join(OUT, `${id}.js`), courseModule(id, META[id], course));
    console.log(`${id}: ${course.topics.length} flokkar, ${course.examFormats.length} prófsnið, ${course.sheet.sections.length} kaflar${course.plan ? `, áætlun ${course.plan.days.length} dagar` : ''}`);
  }
  const css = stylesheets();
  writeFileSync(join(ROOT, 'src', 'ui', 'base.css'), css.base);
  writeFileSync(join(ROOT, 'src', 'ui', 'legacy.css'), css.legacy);
  console.log('stílar skrifaðir');
}
