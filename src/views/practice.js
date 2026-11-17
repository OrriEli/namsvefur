// Æfing: síur á flokka, hluta, stig og uppruna; hættir fags (stigvaxandi og spjöld í 106/108, skrifleg dæmi
// og hraðæfing í 101); villubanki. Atriðið sjálft er teiknað af spilaranum (player.js).
// Fyrirspurnir: ?t=flokkar ?s=uppruni ?m=háttur ?l=stig ?r=due (villur á tíma) ?r=1 (allar villur)

import { entriesOf, weightedPick, cardWeight, instantiate, sourceLabel, inMode, modeOf } from '../engine/practice.js';
import { inBank, isDue, nextDue } from '../engine/review.js';
import { SOURCES, SOURCE_LABELS } from '../schema.js';
import { F, fmtWhen } from '../ui/format.js';
import { esc } from '../ui/dom.js';
import { createPlayer } from './player.js';

const states = new Map();   // æfingastaða hvers fags lifir á milli flipa

function stateOf(c) {
  if (!states.has(c.id)) states.set(c.id, { mode: c.modes ? c.modes[0].id : null, topics: new Set(c.topics.map(t => t.id)), levels: new Set([1, 2, 3]), source: 'all', review: null,
    player: null, n: 0, c: 0, recent: [], filtOpen: window.innerWidth > 720 });
  return states.get(c.id);
}

export function render(ctx) {
  const { el, course: c, store, query } = ctx;
  const S = store.state;
  const P = stateOf(c);
  const allTopics = c.topics.map(t => t.id);
  const tname = id => c.topics.find(t => t.id === id).name;
  const parts = [...new Set(c.topics.map(t => t.part).filter(Boolean))];
  const adapt = () => S.settings.adapt[c.id] || (S.settings.adapt[c.id] = { lvl: 1, up: 0, down: 0, msg: '' });
  const reset = () => { P.player = null; };

  // fyrirspurn úr slóð
  if (query.has('m') && modeOf(c, query.get('m')) && P.mode !== query.get('m')) { P.mode = query.get('m'); P.review = null; reset(); P.n = P.c = 0; }
  if (query.has('t')) { const ts = query.get('t').split(',').filter(t => allTopics.includes(t)); if (ts.length) { P.topics = new Set(ts); P.source = 'all'; P.review = null; reset(); } }
  else if (query.has('m') || query.has('s')) { P.topics = new Set(allTopics); }
  if (query.has('s') && SOURCES.includes(query.get('s'))) { P.source = query.get('s'); P.review = null; reset(); }
  if (query.has('l')) { const ls = query.get('l').split(',').map(Number).filter(l => [1, 2, 3].includes(l)); if (ls.length) { P.levels = new Set(ls); reset(); } }
  if (query.has('r')) { const r = query.get('r') === 'due' ? 'due' : 'all'; if (P.review !== r) { P.review = r; reset(); } }

  const mode = () => modeOf(c, P.mode);
  const pool = () => {
    const m = mode();
    if (P.review) return entriesOf(c).filter(e => (P.review === 'due' ? isDue(S.items[e.gid]) : inBank(S.items[e.gid])) && (!m || m.cards || inMode(e, m)));
    return entriesOf(c).filter(e => inMode(e, m) && P.topics.has(e.topic)
      && (m && m.cards ? true : P.source === 'all' || e.source === P.source)
      && (!c.levels || (m && m.cards) ? true : m && m.adapt ? e.level === adapt().lvl : P.levels.has(e.level)));
  };

  const hooks = () => ({
    redraw: draw,
    tally: it => it.type === 'card' ? '<span class="hint">Spjöld telja ekki í einkunn</span>' : `<span class="hint">Lota: <span class="mono">${F.n(Math.round(P.c * 10) / 10)}/${P.n}</span> rétt</span>`,
    onDone: (score, ok) => { if (P.player.item.type === 'card') return; P.n++; P.c += score; const mm = mode(); if (mm && mm.adapt && !P.review) adaptAfter(ok); },
    onNext: () => { next(); draw(); window.scrollTo(0, 0); }
  });

  function next() {
    const list = pool(); const m = mode();
    if (!list.length) { P.player = null; return; }
    const cards = m && m.cards && !P.review;
    const e = weightedPick(list, P.recent, S, Math.random, cards ? cardWeight : undefined);
    P.player = createPlayer({ course: c, item: instantiate(c, e), store, ...hooks() });
    P.recent.push(e.gid);
    const keep = cards ? 8 : m && m.quick ? 20 : 12;
    if (P.recent.length > Math.min(keep, Math.floor(list.length / 2))) P.recent.shift();
  }

  function adaptAfter(ok) {
    const A = adapt();
    if (ok) { A.up++; A.down = 0; if (A.up >= 3) { if (A.lvl < 3) { A.lvl++; A.msg = `Þrjú rétt í röð: upp á stig ${A.lvl}.`; } else A.msg = 'Þrjú rétt í röð á stigi 3.'; A.up = 0; } else A.msg = ''; }
    else { A.down++; A.up = 0; if (A.down >= 2) { if (A.lvl > 1) { A.lvl--; A.msg = `Tvö röng í röð: niður á stig ${A.lvl}.`; } else A.msg = 'Tvö röng í röð; áfram á stigi 1.'; A.down = 0; } else A.msg = ''; }
    store.save();
  }

  function filtersHTML() {
    const m = mode();
    if (P.review) {
      const due = entriesOf(c).filter(e => isDue(S.items[e.gid])).length, all = entriesOf(c).filter(e => inBank(S.items[e.gid])).length;
      return `<div class="row"><span class="tag" style="background:var(--bad-weak);color:var(--bad)">Villubanki · ${pool().length} eftir</span><div class="seg"><button data-rv="due" aria-pressed="${P.review === 'due'}">Á tíma (${due})</button><button data-rv="all" aria-pressed="${P.review === 'all'}">Allar villur (${all})</button></div><button class="btn small" data-act="exitrev">Hætta í villubanka</button></div>`;
    }
    const srcs = SOURCES.filter(s => entriesOf(c).some(e => e.source === s && inMode(e, m)));
    const partChips = parts.map(p => { const ts = c.topics.filter(t => t.part === p).map(t => t.id);
      return `<button class="chip" data-part="${esc(p)}" aria-pressed="${ts.length === P.topics.size && ts.every(t => P.topics.has(t))}">${esc(p.split(' · ')[0])}</button>`; }).join('');
    const summary = `${P.topics.size === allTopics.length ? 'Allir flokkar' : [...P.topics].map(tname).map(esc).join(', ')}${c.levels && !(m && (m.cards || m.adapt)) ? ' · stig ' + [...P.levels].sort().join(', ') : ''}`;
    return `<details class="filt" ${P.filtOpen ? 'open' : ''}><summary>${summary}</summary><div class="filters">
      <div class="frow"><span class="eyebrow">Flokkar</span><div class="chips">${partChips}${c.topics.map(t => `<button class="chip" data-t="${t.id}" aria-pressed="${P.topics.has(t.id)}">${esc(t.label || t.name)}</button>`).join('')}<button class="chip" data-act="allt">Allir</button></div></div>
      ${c.modes ? `<div class="frow"><span class="eyebrow">Háttur</span><div class="seg">${c.modes.map(x => `<button data-mode="${x.id}" aria-pressed="${P.mode === x.id}">${x.label}</button>`).join('')}</div></div>` : ''}
      ${c.levels && !(m && (m.cards || m.adapt)) ? `<div class="frow"><span class="eyebrow">Stig</span><div class="chips">${[1, 2, 3].map(l => `<button class="chip l${l}" data-lv="${l}" aria-pressed="${P.levels.has(l)}">${l} · ${c.levels[l].name}</button>`).join('')}</div></div>` : ''}
      ${m && m.cards ? '' : `<div class="frow"><span class="eyebrow">Uppruni</span><div class="seg">${['all', ...srcs].map(s => `<button data-s="${s}" aria-pressed="${P.source === s}">${s === 'all' ? 'Allt' : esc(sourceLabel(c, s, SOURCE_LABELS))}</button>`).join('')}</div></div>`}
      <div class="frow"><span class="eyebrow"></span><span class="hint mono">${pool().length} í pottinum</span></div>
    </div></details>`;
  }

  function draw() {
    const m = mode();
    const A = adapt();
    const adaptBar = m && m.adapt && !P.review ? `<div class="panel adapt"><span class="lv lv${A.lvl}">Stig ${A.lvl} · ${c.levels[A.lvl].name}</span><span>Upp: <span class="pips">${[0, 1, 2].map(i => `<i class="${i < A.up ? 'on' : ''}"></i>`).join('')}</span></span><span>Niður: <span class="pips">${[0, 1].map(i => `<i class="${i < A.down ? 'x' : ''}"></i>`).join('')}</span></span>${A.msg ? `<b>${A.msg}</b>` : ''}</div>` : '';
    let body;
    if (P.player) body = P.player.html();
    else if (P.review === 'due') { const t = nextDue(S, c.id); body = `<div class="qcard empty">Engin villa er á tíma núna.${t ? ` Næsta verður á tíma ${fmtWhen(t)}.` : ''} <button class="btn small" data-rv="all">Æfa allar villur</button></div>`; }
    else body = `<div class="qcard empty">${P.review ? 'Villubankinn er tómur. Vel gert.' : 'Ekkert passar við valið. Veldu fleiri flokka eða stig.'}</div>`;
    const title = P.review ? 'Villurnar þínar' + (m ? ': ' + m.label.toLowerCase() : '') : m ? m.label : 'Æfing';
    el.innerHTML = `<div class="stack"><h2>${title}</h2>${filtersHTML()}${adaptBar}${body}</div>`;
    const fd = el.querySelector('details.filt'); if (fd) fd.addEventListener('toggle', () => { P.filtOpen = fd.open; });
    if (P.player) P.player.afterDraw(el);
  }

  el.onclick = e => {
    if (P.player && P.player.click(e)) return;
    const rv = e.target.closest('[data-rv]'); if (rv) { P.review = rv.dataset.rv; next(); return draw(); }
    const chip = e.target.closest('.chip[data-t]');
    if (chip) { const t = chip.dataset.t; if (P.topics.has(t) && P.topics.size > 1) P.topics.delete(t); else P.topics.add(t); next(); return draw(); }
    const pc = e.target.closest('.chip[data-part]'); if (pc) { P.topics = new Set(c.topics.filter(t => t.part === pc.dataset.part).map(t => t.id)); next(); return draw(); }
    const lv = e.target.closest('[data-lv]'); if (lv) { const l = +lv.dataset.lv; if (P.levels.has(l) && P.levels.size > 1) P.levels.delete(l); else P.levels.add(l); next(); return draw(); }
    const md = e.target.closest('[data-mode]'); if (md) { P.mode = md.dataset.mode; P.source = 'all'; P.review = null; P.n = P.c = 0; next(); return draw(); }
    const seg = e.target.closest('.seg button[data-s]'); if (seg) { P.source = seg.dataset.s; next(); return draw(); }
    const a = e.target.closest('[data-act]'); if (!a || a.disabled) return;
    if (a.dataset.act === 'allt') { P.topics = new Set(allTopics); next(); draw(); }
    if (a.dataset.act === 'exitrev') { P.review = null; next(); draw(); }
  };
  el.oninput = e => { if (P.player) P.player.input(e); };

  if (!P.player || P.player.st.done) next(); else P.player.bind(hooks());
  draw();

  return { onKey(e) { if (P.player) P.player.key(e); } };
}
