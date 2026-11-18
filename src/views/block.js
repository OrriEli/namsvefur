// Lærdómsblokk í gangi: fyrri helmingur, hlé, seinni helmingur. Stikan undir efstu stiku sýnir tímann og
// núverandi lið á öllum síðum, og hver liður opnar æfingu (villur á tíma, veikustu flokkar) eða upprifjun.

import { COURSES } from '../courses/index.js';
import { fmtDur } from '../ui/format.js';
import { esc } from '../ui/dom.js';

const MIN = 60e3;

/** Slóð sem liður opnar. */
export function hrefFor(seg) {
  if (seg.kind === 'mix') return '#/upprifjun';
  const c = COURSES.find(x => x.id === seg.course);
  if (seg.kind === 'due') return `#/fag/${seg.course}/aefing?r=due`;
  const m = c && c.modes && c.modes.some(x => x.quick === false) ? 'm=written&' : '';
  return `#/fag/${seg.course}/aefing?${m}t=${seg.topics.join(',')}`;
}

/** Lýsing á lið, t.d. „HAG101G · villur á tíma (6)“. */
export function segLabel(seg) {
  if (seg.kind === 'mix') return 'Blönduð upprifjun úr öllum fögum';
  const c = COURSES.find(x => x.id === seg.course);
  if (seg.kind === 'due') return `${c.code} · villur á tíma`;
  return `${c.code} · ${seg.topics.map(t => c.topics.find(x => x.id === t).name).join(' og ')}`;
}

export function startBlock(store, sug, now = Date.now()) {
  store.state.block = { created: now, segments: sug.segments, first: sug.first, pause: sug.pause, second: sug.second, phase: 'first', phaseStart: now, idx: 0 };
  store.save();
  return hrefFor(sug.segments[0]);
}

const phaseLen = B => (B.phase === 'first' ? B.first : B.phase === 'pause' ? B.pause : B.second) * MIN;
const firstOfHalf = (B, h) => B.segments.findIndex(s => s.half === h);

/** Færir blokkina áfram eftir tíma: fyrri helmingur → hlé → (bíður eftir Halda áfram) → seinni → lokið. */
export function advanceByTime(store, now = Date.now()) {
  const B = store.state.block; if (!B || B.phase === 'done' || B.phase === 'ready') return false;
  if (now - B.phaseStart < phaseLen(B)) return false;
  if (B.phase === 'first') { if (B.second) { B.phase = 'pause'; B.phaseStart = now; } else B.phase = 'done'; }
  else if (B.phase === 'pause') B.phase = 'ready';
  else if (B.phase === 'second') B.phase = 'done';
  store.save();
  return true;
}

/** Næsti liður: innan helmings, eða yfir í hlé ef fyrri helmingur er búinn. Skilar slóð eða null. */
export function nextSegment(store, now = Date.now()) {
  const B = store.state.block; if (!B) return null;
  const nxt = B.idx + 1;
  if (nxt >= B.segments.length) { B.phase = 'done'; store.save(); return null; }
  if (B.segments[nxt].half === 2 && B.phase === 'first') { B.phase = 'pause'; B.phaseStart = now; B.idx = nxt; store.save(); return null; }
  B.idx = nxt; store.save();
  return hrefFor(B.segments[nxt]);
}

export function startSecond(store, now = Date.now()) {
  const B = store.state.block; if (!B) return null;
  B.phase = 'second'; B.phaseStart = now; B.idx = Math.max(B.idx, firstOfHalf(B, 2)); store.save();
  return hrefFor(B.segments[B.idx]);
}

/** Svör og hlutfall réttra síðan blokkin hófst. */
export function blockStats(state) {
  const B = state.block; let n = 0, c = 0;
  for (const s of state.sessions) if (s.end >= B.created) { n += s.n; c += s.c; }
  return { n, c };
}

/** Tíminn sem eftir er af núverandi helmingi eða hléi. */
export const clockText = (state, now = Date.now()) => state.block ? fmtDur(phaseLen(state.block) - (now - state.block.phaseStart)) : '';

/** Hve stór hluti núverandi helmings er liðinn (0–1): mjóa línan efst í einbeitingarham. */
export const phaseFrac = (state, now = Date.now()) => state.block ? Math.max(0, Math.min(1, (now - state.block.phaseStart) / phaseLen(state.block))) : 0;

/** Lykill sem breytist aðeins þegar stikan þarf að teiknast upp á nýtt (ekki með klukkunni). */
export const barKey = state => state.block ? `${state.block.phase}|${state.block.idx}|${state.block.created}` : '';

export function barHTML(state, now = Date.now()) {
  const B = state.block; if (!B) return '';
  const seg = B.segments[B.idx];
  const left = `<span data-clock>${clockText(state, now)}</span>`;
  if (B.phase === 'pause') return `<div class="bbar pause"><b>Hlé</b><span class="mono">${left}</span><span class="hint">Stattu upp, fáðu þér vatn, farðu út í smá stund.</span><button class="btn small" data-blk="second">Byrja seinni hluta</button><button class="btn small" data-blk="end">Ljúka blokk</button></div>`;
  if (B.phase === 'ready') return `<div class="bbar pause"><b>Hléið er búið</b><span class="hint">${esc(segLabel(seg))}</span><button class="btn small primary" data-blk="second">Byrja seinni hluta</button><button class="btn small" data-blk="end">Ljúka blokk</button></div>`;
  if (B.phase === 'done') { const s = blockStats(state); return `<div class="bbar done"><b>Blokkinni lokið</b><span class="hint">${s.n} svör${s.n ? ` · ${Math.round(s.c / s.n * 100)}% rétt` : ''}</span><button class="btn small" data-blk="end">Loka</button></div>`; }
  const inHalf = B.segments.filter(s => s.half === seg.half), k = inHalf.indexOf(seg) + 1;
  return `<div class="bbar run"><i class="bline" data-bline style="width:${Math.round(phaseFrac(state, now) * 1000) / 10}%"></i><b>${B.phase === 'first' ? 'Fyrri hluti' : 'Seinni hluti'}</b><span class="mono">${left}</span>
    <span class="hint">Liður ${k} af ${inHalf.length}: <a href="${hrefFor(seg)}">${esc(segLabel(seg))}</a></span>
    <button class="btn small" data-blk="next">Næsti liður →</button><button class="btn small" data-blk="end">Ljúka blokk</button></div>`;
}
