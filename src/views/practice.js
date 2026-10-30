// Æfing: síur á flokka og uppruna, vegið úrtak og útskýring eftir hvert svar. Villubankahamur með ?r=1.

import { entriesOf, weightedPick, instantiate, sourceLabel } from '../engine/practice.js';
import { recordAnswer, inBank } from '../engine/review.js';
import { renderMcOptions, mcVerdict, gradeMc, keyToIndex } from '../engine/items/mc.js';
import { logActivity } from '../store/store.js';
import { SOURCES, SOURCE_LABELS } from '../schema.js';
import { F } from '../ui/format.js';
import { esc } from '../ui/dom.js';

const states = new Map();   // æfingastaða hvers fags lifir á milli flipa

function stateOf(c) {
  if (!states.has(c.id)) states.set(c.id, { topics: new Set(c.topics.map(t => t.id)), source: 'all', review: false, cur: null, chosen: null, n: 0, c: 0, recent: [], filtOpen: window.innerWidth > 720 });
  return states.get(c.id);
}

export function render(ctx) {
  const { el, course: c, store, query } = ctx;
  const S = store.state;
  const P = stateOf(c);
  const allTopics = c.topics.map(t => t.id);
  const tname = id => c.topics.find(t => t.id === id).name;
  const sources = SOURCES.filter(s => entriesOf(c).some(e => e.source === s));

  if (query.has('t')) { const ts = query.get('t').split(',').filter(t => allTopics.includes(t)); if (ts.length) { P.topics = new Set(ts); P.source = 'all'; P.review = false; P.cur = null; } }
  if (query.has('s') && sources.includes(query.get('s'))) { P.source = query.get('s'); P.topics = new Set(allTopics); P.review = false; P.cur = null; }
  if (query.get('r') === '1' && !P.review) { P.review = true; P.cur = null; }

  const pool = () => P.review
    ? entriesOf(c).filter(e => inBank(S.items[e.gid]))
    : entriesOf(c).filter(e => P.topics.has(e.topic) && (P.source === 'all' || e.source === P.source));

  function next() {
    const list = pool();
    if (!list.length) { P.cur = null; return; }
    const e = weightedPick(list, P.recent, S);
    P.cur = instantiate(c, e); P.chosen = null;
    P.recent.push(e.gid); if (P.recent.length > Math.min(12, Math.floor(list.length / 2))) P.recent.shift();
  }

  function answer(i) {
    if (!P.cur || P.chosen !== null || i >= P.cur.o.length) return;
    P.chosen = i; const score = gradeMc(P.cur, i); P.n++; P.c += score;
    recordAnswer(S, P.cur.gid, score, { passScore: c.passScore });
    logActivity(S, c.id, 'practice', score);
    store.save(); draw();
    const ex = el.querySelector('.expl'); if (ex && ex.getBoundingClientRect().top > window.innerHeight - 80) ex.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }

  function draw() {
    const bankN = entriesOf(c).filter(e => inBank(S.items[e.gid])).length;
    const filters = P.review
      ? `<div class="row"><span class="tag" style="background:var(--bad-weak);color:var(--bad)">Villubanki · ${bankN} eftir</span><button class="btn small" data-act="exitrev">Hætta í villubanka</button></div>`
      : `<details class="filt" ${P.filtOpen ? 'open' : ''}><summary>Flokkar: ${P.topics.size === allTopics.length ? 'allir' : [...P.topics].map(tname).map(esc).join(', ')}</summary><div class="chips">${c.topics.map(t => `<button class="chip" data-t="${t.id}" aria-pressed="${P.topics.has(t.id)}">${esc(t.name)}</button>`).join('')}</div></details>
         <div class="row" style="justify-content:space-between"><div class="seg">${['all', ...sources].map(s => `<button data-s="${s}" aria-pressed="${P.source === s}">${s === 'all' ? 'Allt' : esc(sourceLabel(c, s, SOURCE_LABELS))}</button>`).join('')}</div>
         <div class="row hint"><button class="chip" data-act="allt">Allir flokkar</button><span class="mono">${pool().length} í pottinum</span></div></div>`;
    let body;
    const tally = `<span class="hint">Lota: <span class="mono">${F.n(P.c)}/${P.n}</span> rétt</span>`;
    if (!P.cur) body = `<div class="qcard empty">${P.review ? 'Villubankinn er tómur. Vel gert.' : 'Engin spurning passar við valið. Veldu fleiri flokka.'}</div>`;
    else {
      const it = P.cur; const rev = P.chosen !== null;
      const tag = it.source === 'old' ? 'old' : it.source === 'gen' ? 'gen' : '';
      body = `<div class="qcard" id="qc">
        <div class="qmeta"><span class="eyebrow">${esc(tname(it.topic))}</span><span class="tag ${tag}">${esc(it.src)}</span></div>
        <div class="qtext">${it.q}</div>${renderMcOptions(it, { chosen: P.chosen, reveal: rev })}
        ${rev ? `<div class="expl">${mcVerdict(it, P.chosen)}<div>${it.e}</div></div>
          <div class="row" style="justify-content:space-between">${tally}<button class="btn primary" data-act="next">Næsta spurning <kbd style="margin-left:6px">Enter</kbd></button></div>`
        : `<div class="row" style="justify-content:space-between">${tally}<button class="btn small" data-act="skip">Sleppa</button></div>`}
      </div>`;
    }
    el.innerHTML = `<div class="stack"><h2>${P.review ? 'Villurnar þínar' : 'Æfing'}</h2>${filters}${body}</div>`;
    const fd = el.querySelector('details.filt'); if (fd) fd.addEventListener('toggle', () => { P.filtOpen = fd.open; });
  }

  el.onclick = e => {
    const opt = e.target.closest('.opt'); if (opt && !opt.disabled) return answer(+opt.dataset.i);
    const chip = e.target.closest('.chip[data-t]');
    if (chip) { const t = chip.dataset.t; if (P.topics.has(t) && P.topics.size > 1) P.topics.delete(t); else P.topics.add(t); next(); return draw(); }
    const seg = e.target.closest('.seg button[data-s]'); if (seg) { P.source = seg.dataset.s; next(); return draw(); }
    const a = e.target.closest('[data-act]'); if (!a) return;
    if (a.dataset.act === 'next' || a.dataset.act === 'skip') { next(); draw(); window.scrollTo(0, 0); }
    if (a.dataset.act === 'allt') { P.topics = new Set(allTopics); next(); draw(); }
    if (a.dataset.act === 'exitrev') { P.review = false; next(); draw(); }
  };

  if (!P.cur) next();
  draw();

  return {
    onKey(e) {
      if (!P.cur) return;
      const i = keyToIndex(e.key);
      if (i !== undefined && P.chosen === null) answer(i);
      else if (e.key === 'Enter' && P.chosen !== null) { e.preventDefault(); next(); draw(); window.scrollTo(0, 0); }
    }
  };
}
