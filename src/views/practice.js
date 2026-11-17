// Æfing: einn spilari fyrir allar gerðir. Síur á flokka, hluta, stig og uppruna; hættir fags (stigvaxandi og
// spjöld í 106/108, skrifleg dæmi og hraðæfing í 101); villubankahamur með ?r=1.
// Fyrirspurnir: ?t=flokkar ?s=uppruni ?m=háttur ?l=stig ?r=1

import { entriesOf, weightedPick, cardWeight, instantiate, sourceLabel, inMode, modeOf } from '../engine/practice.js';
import { recordAnswer, inBank } from '../engine/review.js';
import { blank, answered, grade, renderAnswer, renderSteps, verdictHTML, clickAnswer, inputAnswer, keyToIndex, stepTotal, ptsTxt } from '../engine/items/index.js';
import { logActivity } from '../store/store.js';
import { SOURCES, SOURCE_LABELS } from '../schema.js';
import { F } from '../ui/format.js';
import { esc } from '../ui/dom.js';
import { itemMeta } from './itemmeta.js';

const states = new Map();   // æfingastaða hvers fags lifir á milli flipa

function stateOf(c) {
  if (!states.has(c.id)) states.set(c.id, { mode: c.modes ? c.modes[0].id : null, topics: new Set(c.topics.map(t => t.id)), levels: new Set([1, 2, 3]), source: 'all', review: false,
    cur: null, resp: null, done: false, showSol: false, n: 0, c: 0, recent: [], filtOpen: window.innerWidth > 720 });
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

  // fyrirspurn úr slóð
  if (query.has('m') && modeOf(c, query.get('m')) && P.mode !== query.get('m')) { P.mode = query.get('m'); P.review = false; P.cur = null; P.n = P.c = 0; }
  if (query.has('t')) { const ts = query.get('t').split(',').filter(t => allTopics.includes(t)); if (ts.length) { P.topics = new Set(ts); P.source = 'all'; P.review = false; P.cur = null; } }
  else if (query.has('m') || query.has('s')) { P.topics = new Set(allTopics); }
  if (query.has('s') && SOURCES.includes(query.get('s'))) { P.source = query.get('s'); P.review = false; P.cur = null; }
  if (query.has('l')) { const ls = query.get('l').split(',').map(Number).filter(l => [1, 2, 3].includes(l)); if (ls.length) { P.levels = new Set(ls); P.cur = null; } }
  if (query.get('r') === '1' && !P.review) { P.review = true; P.cur = null; }

  const mode = () => modeOf(c, P.mode);
  const pool = () => {
    const m = mode();
    if (P.review) return entriesOf(c).filter(e => inBank(S.items[e.gid]) && inMode(e, m));
    return entriesOf(c).filter(e => inMode(e, m) && P.topics.has(e.topic)
      && (m && m.cards ? true : P.source === 'all' || e.source === P.source)
      && (!c.levels || (m && m.cards) ? true : m && m.adapt ? e.level === adapt().lvl : P.levels.has(e.level)));
  };

  function next() {
    const list = pool(); const m = mode();
    if (!list.length) { P.cur = null; return; }
    const cards = m && m.cards;
    const e = weightedPick(list, P.recent, S, Math.random, cards ? cardWeight : undefined);
    P.cur = instantiate(c, e); P.resp = blank(P.cur); P.done = false; P.showSol = false;
    P.recent.push(e.gid);
    const keep = cards ? 8 : m && m.quick ? 20 : 12;
    if (P.recent.length > Math.min(keep, Math.floor(list.length / 2))) P.recent.shift();
  }

  function finish(score) {
    const it = P.cur; if (!it || P.done) return;
    P.done = true; P.n++; P.c += score;
    const ok = recordAnswer(S, it.gid, score, { passScore: c.passScore });
    logActivity(S, c.id, 'practice', score);
    const m = mode();
    if (m && m.adapt && !P.review) adaptAfter(ok);
    store.save(); draw();
    const ex = el.querySelector('.expl, .result'); if (ex && ex.getBoundingClientRect().top > window.innerHeight - 80) ex.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }

  function adaptAfter(ok) {
    const A = adapt();
    if (ok) { A.up++; A.down = 0; if (A.up >= 3) { if (A.lvl < 3) { A.lvl++; A.msg = `Þrjú rétt í röð: upp á stig ${A.lvl}.`; } else A.msg = 'Þrjú rétt í röð á stigi 3.'; A.up = 0; } else A.msg = ''; }
    else { A.down++; A.up = 0; if (A.down >= 2) { if (A.lvl > 1) { A.lvl--; A.msg = `Tvö röng í röð: niður á stig ${A.lvl}.`; } else A.msg = 'Tvö röng í röð; áfram á stigi 1.'; A.down = 0; } else A.msg = ''; }
  }

  function submit() {
    const it = P.cur; if (!it || P.done) return;
    if (it.type === 'card') { P.done = true; const p = S.items[it.gid] || (S.items[it.gid] = { n: 0, c: 0, streak: 0 }); p.n++; p.last = Date.now(); store.save(); return draw(); }
    if (it.type === 'steps' || !answered(it, P.resp)) return;
    finish(grade(it, P.resp));
  }

  function stepAct(act) {
    const it = P.cur, r = P.resp; if (!it || it.type !== 'steps' || P.done) return;
    if (act === 'hint') { const i = r.st.findIndex(x => x === 0); if (i >= 0) r.st[i] = 1; }
    if (act === 'step') { const i = r.st.findIndex(x => x < 2); if (i >= 0) r.st[i] = 2; }
    if (act === 'all') r.st = r.st.map(() => 2);
    if (act === 'allok') { r.mk = r.mk.map(() => true); return finish(1); }
    draw();
    if (act === 'step') { const i = r.st.lastIndexOf(2); const node = el.querySelector(`.sstep[data-i="${i}"]`); if (node && node.getBoundingClientRect().bottom > window.innerHeight) node.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }
  }
  function markStep(i, ok) {
    const r = P.resp; r.mk[i] = ok;
    if (!P.done && r.mk.every(x => x !== null)) return finish(grade(P.cur, r));
    draw();
  }

  function filtersHTML() {
    const m = mode();
    if (P.review) return `<div class="row"><span class="tag" style="background:var(--bad-weak);color:var(--bad)">Villubanki · ${pool().length} eftir</span><button class="btn small" data-act="exitrev">Hætta í villubanka</button></div>`;
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
    const tally = it => it && it.type === 'card' ? '<span class="hint">Spjöld telja ekki í einkunn</span>' : `<span class="hint">Lota: <span class="mono">${F.n(Math.round(P.c * 10) / 10)}/${P.n}</span> rétt</span>`;
    let body;
    if (!P.cur) body = `<div class="qcard empty">${P.review ? 'Villubankinn er tómur. Vel gert.' : 'Ekkert passar við valið. Veldu fleiri flokka eða stig.'}</div>`;
    else {
      const it = P.cur, r = P.resp, done = P.done;
      let main, foot;
      if (it.type === 'steps') {
        const tot = stepTotal(it), shown = r.st.filter(x => x === 2).length;
        const got = it.steps.reduce((s, x, i) => s + (r.mk[i] ? x.p : 0), 0);
        const ctrl = done ? `<div class="result"><span class="verdict ${got === tot ? 'ok' : 'no'}">${got}/${tot} stig</span><span class="hint">${got >= tot * c.passScore - 1e-9 ? (got === tot ? 'Fullt hús.' : 'Nóg til að teljast rétt.') : 'Dæmið fer í villubankann og kemur aftur' + (it.source === 'gen' ? ' með nýjum tölum.' : '.')}</span><button class="btn primary" data-act="next" style="margin-left:auto">Næsta dæmi <kbd style="margin-left:6px">Enter</kbd></button></div>`
          : `<div class="row"><button class="btn small" data-act="hint" ${r.st.every(x => x >= 1) ? 'disabled' : ''}>Vísbending <kbd>H</kbd></button><button class="btn small" data-act="step" ${shown === it.steps.length ? 'disabled' : ''}>Næsta skref <kbd>N</kbd></button><button class="btn small" data-act="all" ${shown === it.steps.length ? 'disabled' : ''}>Sýna alla lausnina <kbd>A</kbd></button>${shown === it.steps.length ? '<button class="btn small good" data-act="allok">Allt rétt hjá mér</button>' : ''}<button class="btn small" data-act="skip" style="margin-left:auto">Sleppa</button></div>`;
        main = `<div class="qtext">${it.q}</div>
          <div class="solhead"><span class="hint">Leystu á blað fyrst. Lausnin er í ${it.steps.length} skrefum, ${tot} stig.</span>${tally(it)}</div>
          ${ctrl}${renderSteps(it, r, {})}${done && it.e ? `<div class="expl">${it.e}</div>` : ''}`;
        foot = '';
      } else if (it.type === 'card') {
        const p = S.items[it.gid];
        main = renderAnswer(it, r, { reveal: done });
        foot = `<div class="row" style="justify-content:space-between">${tally(it)}<span class="row">${done ? `<button class="btn small ${p && p.again ? 'again' : ''}" data-act="again">${p && p.again ? '✓ Sýna aftur' : 'Sýna aftur'}</button><button class="btn primary" data-act="next">Næsta <kbd style="margin-left:6px">Enter</kbd></button>` : '<button class="btn primary" data-act="flip">Snúa spjaldinu <kbd style="margin-left:6px">Enter</kbd></button><button class="btn small" data-act="skip">Sleppa</button>'}</span></div>`;
      } else {
        const sol = it.solution ? (P.showSol ? `<div class="qtext">${it.solution.q}</div>${renderSteps(it.solution, { st: [], mk: it.solution.steps.map(() => null) }, { reveal: true, noMark: true })}` : '<button class="btn small" data-act="sol" style="width:fit-content">Sýna allan útreikninginn</button>') : '';
        main = `<div class="qtext">${it.q}</div>${renderAnswer(it, r, { reveal: done })}${done ? `<div class="expl">${verdictHTML(it, r, it.pts)}${it.e ? `<div>${it.e}</div>` : ''}${sol}</div>` : ''}`;
        foot = `<div class="row" style="justify-content:space-between">${tally(it)}<span class="row">${done ? '<button class="btn primary" data-act="next">Næsta spurning <kbd style="margin-left:6px">Enter</kbd></button>'
          : `${it.type !== 'mc' ? `<button class="btn primary small" data-act="submit" ${answered(it, r) ? '' : 'disabled'}>Svara <kbd style="margin-left:6px">Enter</kbd></button>` : ''}<button class="btn small" data-act="skip">Sleppa</button>`}</span></div>`;
      }
      body = `<div class="qcard" id="qc">${itemMeta(c, it)}${main}${foot}</div>`;
    }
    const title = P.review ? 'Villurnar þínar' + (m ? ': ' + m.label.toLowerCase() : '') : m ? m.label : 'Æfing';
    el.innerHTML = `<div class="stack"><h2>${title}</h2>${filtersHTML()}${adaptBar}${body}</div>`;
    const fd = el.querySelector('details.filt'); if (fd) fd.addEventListener('toggle', () => { P.filtOpen = fd.open; });
    const inp = el.querySelector('#numin, .ninp');
    if (inp && !P.done) {
      el.querySelectorAll('#numin, .ninp').forEach(x => x.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); submit(); } }));
      if (window.innerWidth > 720) inp.focus();
    }
  }

  el.onclick = e => {
    const it = P.cur;
    if (it && !P.done) { const nr = clickAnswer(it, P.resp, e); if (nr !== undefined) { P.resp = nr; if (it.type === 'mc') return finish(grade(it, nr)); return draw(); } }
    const mk = e.target.closest('[data-mk]'); if (mk && it && it.type === 'steps') return markStep(+mk.dataset.mk, mk.dataset.v === '1');
    const chip = e.target.closest('.chip[data-t]');
    if (chip) { const t = chip.dataset.t; if (P.topics.has(t) && P.topics.size > 1) P.topics.delete(t); else P.topics.add(t); next(); return draw(); }
    const pc = e.target.closest('.chip[data-part]'); if (pc) { P.topics = new Set(c.topics.filter(t => t.part === pc.dataset.part).map(t => t.id)); next(); return draw(); }
    const lv = e.target.closest('[data-lv]'); if (lv) { const l = +lv.dataset.lv; if (P.levels.has(l) && P.levels.size > 1) P.levels.delete(l); else P.levels.add(l); next(); return draw(); }
    const md = e.target.closest('[data-mode]'); if (md) { P.mode = md.dataset.mode; P.source = 'all'; P.review = false; P.n = P.c = 0; next(); return draw(); }
    const seg = e.target.closest('.seg button[data-s]'); if (seg) { P.source = seg.dataset.s; next(); return draw(); }
    const a = e.target.closest('[data-act]'); if (!a || a.disabled) return;
    const act = a.dataset.act;
    if (act === 'submit' || act === 'flip') submit();
    if (['hint', 'step', 'all', 'allok'].includes(act)) stepAct(act);
    if (act === 'sol') { P.showSol = true; draw(); }
    if (act === 'again') { const p = S.items[it.gid] || (S.items[it.gid] = { n: 0, c: 0, streak: 0 }); p.again = !p.again; store.save(); draw(); }
    if (act === 'next' || act === 'skip') { next(); draw(); window.scrollTo(0, 0); }
    if (act === 'allt') { P.topics = new Set(allTopics); next(); draw(); }
    if (act === 'exitrev') { P.review = false; next(); draw(); }
  };
  el.oninput = e => {
    if (!P.cur || P.done) return;
    if (inputAnswer(P.cur, P, 'resp', e)) { const b = el.querySelector('[data-act="submit"]'); if (b) b.disabled = !answered(P.cur, P.resp); }
  };

  if (!P.cur) next();
  draw();

  return {
    onKey(e) {
      const it = P.cur; if (!it) return;
      const k = e.key.toLowerCase();
      if (it.type === 'steps' && !P.done) {
        const open = P.resp.st.findIndex((x, i) => x === 2 && P.resp.mk[i] === null);
        if (k === 'h') stepAct('hint'); else if (k === 'n') stepAct('step'); else if (k === 'a') stepAct('all');
        else if ((k === 'r' || k === 'v') && open >= 0) markStep(open, k === 'r');
        return;
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        if (P.done) { next(); draw(); window.scrollTo(0, 0); } else submit();
        return;
      }
      if (P.done) return;
      const i = keyToIndex(it, e.key);
      if (i === undefined) return;
      if (it.type === 'mc' && i < it.o.length) finish(grade(it, i));
      if (it.type === 'multi' && i < it.o.length) { const s = new Set(P.resp); s.has(i) ? s.delete(i) : s.add(i); P.resp = [...s].sort((a, b) => a - b); draw(); }
    }
  };
}
