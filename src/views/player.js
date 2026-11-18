// Spilari fyrir eitt atriði, notaður í æfingu og blandaðri upprifjun: svar, öryggismat (Viss · Hálfviss ·
// Gisk, lyklar V, H, G), dómur og útskýring, allur útreikningurinn (hraðspurningar úr rafölum 101) og
// reiturinn „Hvað hugsaði ég vitlaust?“ með merkjum eftir rangt svar.
// Hýsillinn teiknar spilarann með html(), sendir smelli, innslátt og lykla áfram og fær tilkynningar
// í onDone(score, ok) og onNext().

import { recordAnswer } from '../engine/review.js';
import { topicStats } from '../engine/practice.js';
import { blank, answered, grade, renderAnswer, renderSteps, verdictHTML, clickAnswer, inputAnswer, keyToIndex, stepTotal } from '../engine/items/index.js';
import { logActivity } from '../store/store.js';
import { esc } from '../ui/dom.js';
import { itemMeta, topicLabel } from './itemmeta.js';

export const CONF = [['viss', 'Viss', 'v'], ['halfviss', 'Hálfviss', 'h'], ['gisk', 'Gisk', 'g']];

/**
 * @param {{course:Object, item:Object, store:Object, hideCourse?:boolean, tally?:() => string,
 *          onDone?:(score:number, ok:boolean) => void, onNext?:() => void, redraw:() => void}} o
 */
export function createPlayer(o) {
  const { course: c, item: it, store } = o;
  const S = store.state;
  const st = { resp: blank(it), done: false, ok: null, conf: null, pending: null, showSol: false, shown: Date.now() };
  const confOn = () => S.settings.prefs.confidence;
  const prog = () => S.items[it.gid] || (S.items[it.gid] = { n: 0, c: 0, streak: 0 });

  function finish(score) {
    if (st.done) return;
    st.done = true;
    const pts = c.engine === 'written' && it.type === 'steps' ? { pts: score * stepTotal(it), max: stepTotal(it) } : {};
    const before = topicStats(c, S, it.topic).pct;
    st.ok = recordAnswer(S, it.gid, score, { passScore: c.passScore, conf: st.conf || undefined, ...pts });
    // hreyfing 1 af 3: við rétt svar fyllist stika flokksins frá gamla hlutfallinu í það nýja
    if (st.ok) st.grow = { from: Math.round((before || 0) * 100), to: Math.round((topicStats(c, S, it.topic).pct || 0) * 100), played: false };
    logActivity(S, c.id, 'practice', score, Date.now(), { from: st.shown, conf: st.conf, ok: st.ok });
    store.save();
    if (o.onDone) o.onDone(score, st.ok);
    o.redraw();
  }

  // Svar er tilbúið: fyrst öryggismat (ef það er á), svo lausnin.
  function ready(action) {
    if (confOn() && !st.conf) { st.pending = action; return o.redraw(); }
    action();
  }
  function setConf(x) { st.conf = x; const a = st.pending; st.pending = null; if (a) a(); else o.redraw(); }

  function submit() {
    if (st.done) return;
    if (it.type === 'card') { st.done = true; const p = prog(); p.n++; p.last = Date.now(); store.save(); if (o.onDone) o.onDone(0, true); return o.redraw(); }
    if (it.type === 'steps' || !answered(it, st.resp)) return;
    ready(() => finish(grade(it, st.resp)));
  }

  function stepAct(act) {
    const r = st.resp; if (it.type !== 'steps' || st.done) return;
    const reveal = act === 'step' || act === 'all';
    if (reveal && r.st.every(x => x < 2) && confOn() && !st.conf) return ready(() => stepAct(act));
    if (act === 'hint') { const i = r.st.findIndex(x => x === 0); if (i >= 0) r.st[i] = 1; }
    if (act === 'step') { const i = r.st.findIndex(x => x < 2); if (i >= 0) r.st[i] = 2; }
    if (act === 'all') r.st = r.st.map(() => 2);
    if (act === 'allok') { r.mk = r.mk.map(() => true); return finish(1); }
    o.redraw();
  }
  function markStep(i, ok) {
    const r = st.resp; r.mk[i] = ok;
    if (!st.done && r.mk.every(x => x !== null)) return finish(grade(it, r));
    o.redraw();
  }

  // ---------- teikning ----------
  function meta() {
    if (!o.hideCourse) return itemMeta(c, it);
    if (!st.done) return '<div class="qmeta"><span class="eyebrow">Hvaða fag og efni?</span><span class="tag">falið þar til þú svarar</span></div>';
    return `<div class="qmeta"><span class="row" style="gap:8px"><span class="cchip" style="--cc:var(${c.color})">${c.code}</span><span class="eyebrow">${esc(topicLabel(c, it.topic))}</span></span><span class="tag">${esc(it.src)}</span></div>`;
  }

  function confRow() {
    if (!st.pending) return '';
    return `<div class="conf" role="group" aria-label="Öryggismat"><span class="hint">Hversu viss ertu?</span>${CONF.map(([k, l, key]) => `<button class="btn small" data-conf="${k}">${l} <kbd>${key.toUpperCase()}</kbd></button>`).join('')}</div>`;
  }

  function growHTML() {
    if (!st.done || !st.ok || !st.grow) return '';
    const g = st.grow, w = g.played ? g.to : g.from;
    return `<div class="grow pb"><span class="pb-l">${esc(topicLabel(c, it.topic))}</span><span class="pb-t" aria-hidden="true"><i data-grow="${g.to}" style="width:${w}%"></i></span><span class="pb-v">${g.to}% rétt</span></div>`;
  }

  function noteRow() {
    if (!st.done || st.ok || it.type === 'card') return '';
    const p = S.items[it.gid] || {};
    return `<div class="noterow"><label class="hint" for="note-in">Hvað hugsaði ég vitlaust?</label>
      <input id="note-in" class="note-in" data-note value="${esc(p.note || '')}" autocomplete="off" placeholder="Ein lína, t.d. „deildi í allan mannfjöldann“">
      <input class="note-in tags-in" data-tags value="${esc((p.tags || []).join(', '))}" autocomplete="off" placeholder="Merki, t.d. gleymdi NX, formerki">
      ${st.conf === 'viss' ? '<span class="tag sure">Viss en rangt</span>' : ''}</div>`;
  }

  function html() {
    const r = st.resp, done = st.done;
    const tally = o.tally ? o.tally(it) : '';
    let main, foot;
    if (it.type === 'steps') {
      const tot = stepTotal(it), shown = r.st.filter(x => x === 2).length;
      const got = it.steps.reduce((s, x, i) => s + (r.mk[i] ? x.p : 0), 0);
      const ctrl = done ? `<div class="result"><span class="verdict ${got === tot ? 'ok' : 'no'}">${got}/${tot} stig</span><span class="hint">${st.ok ? (got === tot ? 'Fullt hús.' : 'Nóg til að teljast rétt.') : 'Dæmið fer í villubankann og kemur aftur' + (it.source === 'gen' ? ' með nýjum tölum.' : '.')}</span><button class="btn primary" data-act="next" style="margin-left:auto">Næsta dæmi <kbd style="margin-left:6px">Enter</kbd></button></div>`
        : st.pending ? '' : `<div class="row"><button class="btn small" data-act="hint" ${r.st.every(x => x >= 1) ? 'disabled' : ''}>Vísbending <kbd>H</kbd></button><button class="btn small" data-act="step" ${shown === it.steps.length ? 'disabled' : ''}>Næsta skref <kbd>N</kbd></button><button class="btn small" data-act="all" ${shown === it.steps.length ? 'disabled' : ''}>Sýna alla lausnina <kbd>A</kbd></button>${shown === it.steps.length ? '<button class="btn small good" data-act="allok">Allt rétt hjá mér</button>' : ''}<button class="btn small" data-act="skip" style="margin-left:auto">Sleppa</button></div>`;
      main = `<div class="qtext">${it.q}</div>
        <div class="solhead"><span class="hint">Leystu á blað fyrst. Lausnin er í ${it.steps.length} skrefum, ${tot} stig.</span>${tally}</div>
        ${confRow()}${ctrl}${growHTML()}${renderSteps(it, r, {})}${done && it.e ? `<div class="expl">${it.e}</div>` : ''}${noteRow()}`;
      foot = '';
    } else if (it.type === 'card') {
      const p = S.items[it.gid];
      main = renderAnswer(it, r, { reveal: done });
      foot = `<div class="row" style="justify-content:space-between">${tally}<span class="row">${done ? `<button class="btn small ${p && p.again ? 'again' : ''}" data-act="again">${p && p.again ? '✓ Sýna aftur' : 'Sýna aftur'}</button><button class="btn primary" data-act="next">Næsta <kbd style="margin-left:6px">Enter</kbd></button>` : '<button class="btn primary" data-act="flip">Snúa spjaldinu <kbd style="margin-left:6px">Enter</kbd></button><button class="btn small" data-act="skip">Sleppa</button>'}</span></div>`;
    } else {
      const sol = it.solution ? (st.showSol ? `<div class="qtext">${it.solution.q}</div>${renderSteps(it.solution, { st: [], mk: it.solution.steps.map(() => null) }, { reveal: true, noMark: true })}` : '<button class="btn small" data-act="sol" style="width:fit-content">Sýna allan útreikninginn</button>') : '';
      main = `<div class="qtext">${it.q}</div>${renderAnswer(it, r, { reveal: done })}${confRow()}${done ? `<div class="expl">${verdictHTML(it, r, it.pts)}${growHTML()}${it.e ? `<div>${it.e}</div>` : ''}${sol}</div>` : ''}${noteRow()}`;
      foot = `<div class="row" style="justify-content:space-between">${tally}<span class="row">${done ? '<button class="btn primary" data-act="next">Næsta spurning <kbd style="margin-left:6px">Enter</kbd></button>'
        : st.pending ? '' : `${it.type !== 'mc' ? `<button class="btn primary small" data-act="submit" ${answered(it, r) ? '' : 'disabled'}>Svara <kbd style="margin-left:6px">Enter</kbd></button>` : ''}<button class="btn small" data-act="skip">Sleppa</button>`}</span></div>`;
    }
    return `<div class="qcard c-${c.id}" id="qc">${meta()}${main}${foot}</div>`;
  }

  function afterDraw(root) {
    const gi = root.querySelector('#qc [data-grow]');
    if (gi && st.grow && !st.grow.played) { st.grow.played = true; gi.getBoundingClientRect(); gi.style.width = gi.dataset.grow + '%'; }
    const inps = root.querySelectorAll('#qc #numin, #qc .ninp');
    if (inps.length && !st.done) {
      inps.forEach(x => x.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); submit(); } }));
      if (!st.pending && window.innerWidth > 720) inps[0].focus();
    }
    const ex = root.querySelector('.conf') || (st.done && root.querySelector('#qc .expl, #qc .result'));
    if (ex && ex.getBoundingClientRect().top > window.innerHeight - 80) ex.scrollIntoView({ block: 'nearest' });
  }

  // ---------- atburðir (skila true ef spilarinn átti þá) ----------
  function click(e) {
    if (!e.target.closest('#qc')) return false;
    const cf = e.target.closest('[data-conf]'); if (cf) { setConf(cf.dataset.conf); return true; }
    if (!st.done) {
      const nr = clickAnswer(it, st.resp, e);
      if (nr !== undefined) { st.resp = nr; if (it.type === 'mc') ready(() => finish(grade(it, nr))); else o.redraw(); return true; }
    }
    const mk = e.target.closest('[data-mk]'); if (mk && it.type === 'steps') { markStep(+mk.dataset.mk, mk.dataset.v === '1'); return true; }
    const a = e.target.closest('[data-act]'); if (!a || a.disabled) return !!a;
    const act = a.dataset.act;
    if (act === 'submit' || act === 'flip') submit();
    else if (['hint', 'step', 'all', 'allok'].includes(act)) stepAct(act);
    else if (act === 'sol') { st.showSol = true; o.redraw(); }
    else if (act === 'again') { const p = prog(); p.again = !p.again; store.save(); o.redraw(); }
    else if (act === 'next' || act === 'skip') { if (o.onNext) o.onNext(); }
    else return false;
    return true;
  }

  function input(e) {
    const t = e.target;
    if (t.matches('[data-note]')) { prog().note = t.value.trim() || undefined; store.save(); return true; }
    if (t.matches('[data-tags]')) { const tags = t.value.split(',').map(x => x.trim()).filter(Boolean); const p = prog(); if (tags.length) p.tags = tags; else delete p.tags; store.save(); return true; }
    if (st.done) return false;
    if (inputAnswer(it, st, 'resp', e)) { const b = document.querySelector('#qc [data-act="submit"]'); if (b) b.disabled = !answered(it, st.resp); return true; }
    return false;
  }

  function key(e) {
    const k = e.key.toLowerCase();
    if (st.pending) { const c2 = CONF.find(x => x[2] === k); if (c2) { e.preventDefault(); setConf(c2[0]); } else if (e.key === 'Escape') { st.pending = null; o.redraw(); } return true; }
    if (it.type === 'steps' && !st.done) {
      const open = st.resp.st.findIndex((x, i) => x === 2 && st.resp.mk[i] === null);
      if (k === 'h') stepAct('hint'); else if (k === 'n') stepAct('step'); else if (k === 'a') stepAct('all');
      else if ((k === 'r' || k === 'v') && open >= 0) markStep(open, k === 'r');
      return true;
    }
    if (e.key === 'Enter') { e.preventDefault(); if (st.done) { if (o.onNext) o.onNext(); } else submit(); return true; }
    if (st.done) return false;
    const i = keyToIndex(it, e.key);
    if (i === undefined) return false;
    if (it.type === 'mc' && i < it.o.length) { st.resp = i; ready(() => finish(grade(it, i))); }
    if (it.type === 'multi' && i < it.o.length) { const s = new Set(st.resp); s.has(i) ? s.delete(i) : s.add(i); st.resp = [...s].sort((a, b) => a - b); o.redraw(); }
    return true;
  }

  // Hýsill sem teiknar á ný (t.d. eftir að farið var af síðunni og aftur inn) tengir nýju föllin sín.
  const bind = hooks => Object.assign(o, hooks);

  return { st, item: it, html, afterDraw, click, input, key, bind };
}
