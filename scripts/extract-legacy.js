// Flytur efnið út úr gömlu síðunum í src/courses/. Ekkert er afritað í höndunum: atriði, Blaðið,
// áætlun og lýsingar prófsniða eru lesin úr minni gömlu síðunnar eða úr því sem hún teiknar, og
// rafalakóðinn er skorinn orðréttur úr <script>-blokkinni.
// Notkun: node scripts/extract-legacy.js [fag ...]   (sjálfgefið öll fög sem eru komin inn)

import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadLegacy, renderToHtml, inlineScripts } from './lib/load-legacy.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'src', 'courses');

export const META = {
  hag103g: { file: 'HAG103G prófæfing.html', code: 'HAG103G', name: 'Heildahagfræði I', short: 'Heild', engine: 'mcq' },
  hag107g: { file: 'HAG107G prófæfing.html', code: 'HAG107G', name: 'Eindahagfræði I', short: 'Einda', engine: 'mcq' }
};

const DEFAULT_SOURCE_LABELS = { old: 'Gömul próf', new: 'Nýjar', sheet: 'Dæmablöð', slides: 'Glærur', gen: 'Rafalar' };
const KIND_TO_SOURCE = { old: 'old', new: 'new', gen: 'gen' };

const must = (m, what) => { if (!m) throw new Error('Fann ekki ' + what); return m; };

// ---------- Blaðið ----------
export function splitSheet(courseId, inner) {
  const re = /<section\b[^>]*>[\s\S]*?<\/section>/g;
  const parts = [...inner.matchAll(re)];
  must(parts.length, 'kafla í Blaðinu');
  const head = inner.slice(0, parts[0].index);
  const last = parts[parts.length - 1];
  const foot = inner.slice(last.index + last[0].length);
  const sections = parts.map(m => {
    const html = m[0];
    const h = must(html.match(/<h2><span class="n">([^<]*)<\/span>([\s\S]*?)<\/h2>/), 'fyrirsögn kafla');
    const id = (html.match(/^<section id="([^"]+)"/) || [])[1] || `${courseId}-${h[1]}`;
    return { id, n: h[1], title: h[2].replace(/<[^>]+>/g, '').trim(), html };
  });
  return { head, sections, foot: foot.trim() ? foot : undefined };
}

// ---------- krossavélin (103, 107) ----------
function extractMcq(id, meta) {
  const L = loadLegacy(join(ROOT, 'legacy', meta.file));
  const V = L.vars;
  const engineSrc = inlineScripts(L.html).find(s => /function instantiate/.test(s));

  const topics = V.ORDER.map(t => ({ id: t, name: V.TOPICS[t].n, ref: V.TOPICS[t].mt, ...(t in V.MIX ? {} : { review: true }) }));

  const items = V.STATIC.map(q => ({ id: q.id, type: 'mc', topic: q.t, source: KIND_TO_SOURCE[q.kind], src: q.src, q: q.q, o: q.o, a: q.a, e: q.e }));

  // Prófsnið: heiti, lýsing og tími lesin af upphafsskjá prófsins; samsetningin úr buildExam.
  const setup = renderToHtml(L, 'renderExam');
  const buttons = [...setup.matchAll(/<button class="action[^"]*" data-k="(\w+)"><h3>([^<]+?) <span class="mono">(\d+) · (\d+):00<\/span><\/h3><p>([\s\S]*?)<\/p><\/button>/g)];
  must(buttons.length, 'prófsnið');
  const examFormats = buttons.map(([, k, name, n, mins, desc]) => {
    const f = { id: k, name, desc, style: 'inspera' };
    if (k === 'mix') return { ...f, minutes: +mins, pick: { by: 'quota', quota: V.MIX } };
    if (k === 'new') return { ...f, minutes: +mins, pick: { by: 'quota', quota: V.MIX, sources: ['new'] } };
    if (k === 'gen') return { ...f, minutes: +mins, pick: { by: 'gens', n: +n } };
    if (k === 'h25') { const ids = V.OLD.filter(q => q.id.startsWith('H25')).map(q => q.id); return { ...f, minutesPerItem: +mins / ids.length, pick: { by: 'fixed', ids } }; }
    throw new Error('Óþekkt prófsnið ' + k);
  });

  const sheetHtml = renderToHtml(L, 'renderSheet');
  const sheet = splitSheet(id, must(sheetHtml.match(/^<div class="sheet">([\s\S]*)<\/div>$/), 'Blaðið')[1]);

  const planHtml = renderToHtml(L, 'renderPlan');
  const at = new Date(V.EXAM_AT).toISOString();
  const ph = must(planHtml.match(/<span class="eyebrow">([^<]*)<\/span><h1>([^<]*)<\/h1>/), 'fyrirsögn áætlunar');
  const plan = {
    kind: 'day', date: at.slice(0, 10), start: V.S.start, end: at.slice(11, 16), eyebrow: ph[1], title: ph[2],
    intro: must(planHtml.match(/<p class="muted" style="max-width:62ch">([\s\S]*?)<\/p>/), 'inngang áætlunar')[1],
    steps: V.PLAN
  };

  const home = renderToHtml(L, 'renderHome');
  const factsHtml = must(home.match(/<div class="facts">([\s\S]*?)<\/div>\s*<div class="actions">/), 'staðreyndir')[1];
  const examInfo = {
    title: must(L.html.match(/<div class="brand">([^<]+?) <small>/), 'heiti prófs')[1],
    note: must(home.match(/<\/table><\/div>\s*<p class="hint">([\s\S]*?)<\/p>/), 'skýringu stöðutöflu')[1],
    facts: [...factsHtml.matchAll(/<div><b>([^<]*)<\/b><span>([^<]*)<\/span><\/div>/g)].map(m => ({ value: m[1], label: m[2] }))
  };

  const sourceLabels = {};
  for (const [k, v] of Object.entries(V.KIND_LABEL)) if (KIND_TO_SOURCE[k] && DEFAULT_SOURCE_LABELS[KIND_TO_SOURCE[k]] !== v) sourceLabels[KIND_TO_SOURCE[k]] = v;
  const genLabel = must(engineSrc.match(/src:'([^']+) · ' \+ g\.name/), 'merki rafala')[1];

  const course = {
    id, code: meta.code, name: meta.name, short: meta.short, color: `--c-${id}`,
    topics, items, examFormats, sheet, plan, examInfo, passScore: 1, sourceLabels, genLabel,
    legacy: { key: V.KEY, file: meta.file }
  };

  // Rafalakóðinn: frá athugasemdinni á undan `const R = {` til enda gagnablokkarinnar.
  const dataSrc = inlineScripts(L.html).find(s => /\nconst GENS = \[/.test(s));
  const rAt = dataSrc.search(/^const R = \{/m);
  const start = dataSrc.lastIndexOf('\n//', rAt - 2) + 1;
  let code = dataSrc.slice(start).replace(/\s+$/, '\n');
  const fBlock = /^const F = \{\n[\s\S]*?\n\};\n/m;
  must(fBlock.test(code), 'skilgreiningu F');
  code = code.replace(fBlock, 'const F = makeF({ pctDigits: 1 });\n');
  const gensModule = `// Búið til af scripts/extract-legacy.js úr legacy/${meta.file}. Ekki breyta í höndunum.
// Rafalakóðinn er orðréttur; aðeins skilgreiningu síðunnar á F er skipt út fyrir sameiginlegu eininguna.
import { makeF } from '../ui/format.js';

${code}
// ---- millilag: gamla úttakið {q, o, a, e} → GenItem ----
export default GENS.map(g => ({ id: g.id, name: g.name, topic: g.t, f: () => ({ type: 'mc', ...g.f() }) }));
`;
  return { course, gensModule };
}

// ---------- skrif ----------
function courseModule(id, meta, course) {
  const lines = [];
  for (const [k, v] of Object.entries(course)) {
    if (k === 'items') lines.push(`  items: [\n${v.map(it => '    ' + JSON.stringify(it)).join(',\n')}\n  ],`, '  gens,');
    else lines.push(`  ${k}: ${JSON.stringify(v, null, 2).replace(/\n/g, '\n  ')},`);
  }
  return `// Búið til af scripts/extract-legacy.js úr legacy/${meta.file}. Ekki breyta í höndunum.
import gens from './${id}.gens.js';

/** @type {import('../schema.js').Course} */
export default {
${lines.join('\n').replace(/,$/, '')}
};
`;
}

export function extract(id) {
  const meta = META[id];
  if (!meta) throw new Error('Óþekkt fag ' + id);
  if (meta.engine === 'mcq') return extractMcq(id, meta);
  throw new Error('Engin útdráttur fyrir vél ' + meta.engine);
}

if (fileURLToPath(import.meta.url) === process.argv[1]) {
  const ids = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(META);
  for (const id of ids) {
    const { course, gensModule } = extract(id);
    writeFileSync(join(OUT, `${id}.js`), courseModule(id, META[id], course));
    writeFileSync(join(OUT, `${id}.gens.js`), gensModule);
    console.log(`${id}: ${course.items.length} atriði, ${course.examFormats.length} prófsnið, ${course.sheet.sections.length} kaflar í Blaðinu`);
  }
}
