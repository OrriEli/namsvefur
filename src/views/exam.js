// Próf á tíma. Inspera (103, 107): ein spurning í einu, flakk og merkingar. Blandað (106, 108): sama, með
// tölusvörum, skriflegum dæmum og skýringarspjöldum; val á fyrirlestrum, blöndu og lengd. Skriflegt (101): öll
// dæmi í einu á blað. Skrifleg dæmi eru metin skref fyrir skref eftir skil; svo kemur niðurstaða og yfirferð.

import { buildExam, finishExam, timeLeft, needsGrading, toGrade, scoreExam, breakdown, pointsOf } from '../engine/exam.js';
import { answered, renderAnswer, renderSteps, verdictHTML, clickAnswer, inputAnswer, keyToIndex, stepTotal, ptsTxt } from '../engine/items/index.js';
import { fmtDur, grade10, fmtWhen } from '../ui/format.js';
import { esc, plain, clip, barCls, setTopH } from '../ui/dom.js';
import { itemMeta, topicLabel } from './itemmeta.js';

const results = new Map();   // nýjasta niðurstaða hvers fags, sýnd þar til nýtt próf hefst
const setups = new Map();    // val í blönduðu prófi: fyrirlestrar, blanda, lengd, skýringar

/** „20 · 1:00:00“: fjöldi spurninga og tími prófsniðs. */
export function formatMeta(c, f) {
  const p = f.pick;
  const n = p.by === 'quota' ? Object.values(p.quota).reduce((a, b) => a + b, 0) : p.by === 'fixed' ? p.ids.length : p.by === 'blueprint' ? p.sections.length : p.by === 'levels' ? p.lengths.find(l => l.id === p.defaultLength).n : p.n;
  const min = f.minutes || (p.lengths && p.lengths.find(l => l.id === p.defaultLength).minutes);
  return `${n} · ${fmtDur(min * 60e3)}`;
}

const fmtPts = v => ptsTxt(v);

export function render(ctx) {
  const { el, course: c, store, query } = ctx;
  const S = store.state;
  let timer = null, setupClick = null;
  const X = () => S.exams[c.id];
  const lowAt = f => (f && f.style === 'inspera' ? 5 : 10) * 60e3;

  function start(id, opts) {
    S.exams[c.id] = buildExam(c, id, S, { opts }); store.save(); results.delete(c.id);
    drawRun(); window.scrollTo(0, 0);
  }

  // ---------- uppsetning ----------
  function drawSetup() {
    clearInterval(timer);
    const last = S.hist.filter(h => h.course === c.id).slice(-8).reverse().map(h => `<tr><td>${esc(h.label)}</td><td class="mono">${fmtPts(h.score)}/${fmtPts(h.max)}</td><td class="mono">${grade10(h.score / (h.max || 1))}</td><td class="hint">${fmtWhen(h.at)}${h.legacy ? ' · gamla síðan' : ''}</td></tr>`).join('');
    const hist = last ? `<div class="panel"><h3 style="margin-bottom:8px">Síðustu próf</h3><div class="scroll"><table class="tt"><thead><tr><th>Próf</th><th>Stig</th><th>Einkunn</th><th></th></tr></thead><tbody>${last}</tbody></table></div></div>` : '';
    const lev = c.examFormats.find(f => f.pick.by === 'levels');
    if (lev) return drawLevelsSetup(lev, hist);
    const intro = c.examFormats[0].style === 'written'
      ? 'Eins og á prófinu: dæmin birtast öll í einu, þú skrifar á blað og skilar þegar tíminn er liðinn eða þú ert búinn. Þá birtast lausnirnar og þú gefur þér stig skref fyrir skref.'
      : 'Eins og í Inspera: þú getur flakkað fram og til baka og merkt spurningar. Þú sérð ekki hvað er rétt fyrr en þú skilar. Röng svör fara í villubankann.' + (c.items.some(i => i.pts) ? ' Stig eru gefin eftir gerð og hlutastig fást fyrir hluta af réttu svari.' : '');
    el.innerHTML = `<div class="stack">
      <h2>Próf á tíma</h2>
      <p class="muted" style="max-width:62ch">${intro}</p>
      <div class="actions">${c.examFormats.map((f, i) => `<button class="action ${i === 0 ? 'main' : ''}" data-k="${f.id}"><h3>${esc(f.name)} <span class="mono">${formatMeta(c, f)}</span></h3><p>${f.desc}</p></button>`).join('')}</div>
      ${hist}
    </div>`;
    setupClick = e => { const b = e.target.closest('[data-k]'); if (b) start(b.dataset.k); };
  }

  function drawLevelsSetup(f, hist) {
    const p = f.pick;
    const XC = setups.get(c.id) || { groups: new Set(c.topics.map(t => t.id)), mix: p.mixes[0].id, len: p.defaultLength, explain: p.explain };
    setups.set(c.id, XC);
    const len = p.lengths.find(l => l.id === XC.len), w = p.mixes.find(m => m.id === XC.mix).w;
    const rNote = p.rShare && XC.groups.has(p.rShare.topic) ? ` · minnst ${Math.ceil(p.rShare.share * len.n)} R-spurningar` : '';
    el.innerHTML = `<div class="stack">
      <h2>Próf á tíma</h2>
      <p class="muted" style="max-width:64ch">${esc(f.desc)} Hér er blandað próf sjálfgefið: krossar, tölusvör og skrifleg dæmi. Þú getur flakkað og merkt dæmi. Lausnir birtast eftir skil; skriflegu dæmin gefur þú þér stig fyrir sjálfur í yfirferðinni.</p>
      <div class="panel filters">
        <div class="frow"><span class="eyebrow">Fyrirlestrar</span><div class="chips">${c.topics.map(t => `<button class="chip" data-xg="${t.id}" aria-pressed="${XC.groups.has(t.id)}">${esc(t.label || t.id)}</button>`).join('')}<button class="chip" data-act="xall">Allir</button></div></div>
        <div class="frow"><span class="eyebrow">Blanda</span><div class="seg">${p.mixes.map(m => `<button data-mix="${m.id}" aria-pressed="${XC.mix === m.id}">${esc(m.name)} · ${m.w.map(x => Math.round(x * 100)).join('/')}</button>`).join('')}</div></div>
        <div class="frow"><span class="eyebrow">Lengd</span><div class="seg">${p.lengths.map(l => `<button data-len="${l.id}" aria-pressed="${XC.len === l.id}">${l.minutes} mín · ${l.n} dæmi</button>`).join('')}</div></div>
        <div class="frow"><span class="eyebrow">Skýringar</span><label class="switch"><input type="checkbox" id="xexp" ${XC.explain ? 'checked' : ''}> Taka ${len.cards} opnar skýringarspurningar með (telja ekki í einkunn)</label></div>
      </div>
      <div class="row"><button class="btn primary" data-act="start">Hefja próf · ${len.n} dæmi · ${fmtDur(len.minutes * 60e3)}</button><span class="hint">Stig 1/2/3 ≈ ${w.map(x => Math.round(len.n * x)).join(' / ')} dæmi${rNote} · Blaðið má opna á meðan</span></div>
      ${hist}
    </div>`;
    setupClick = e => {
      const g = e.target.closest('[data-xg]'); if (g) { const id = g.dataset.xg; if (XC.groups.has(id) && XC.groups.size > 1) XC.groups.delete(id); else XC.groups.add(id); return drawSetup(); }
      const m = e.target.closest('[data-mix]'); if (m) { XC.mix = m.dataset.mix; return drawSetup(); }
      const l = e.target.closest('[data-len]'); if (l) { XC.len = l.dataset.len; return drawSetup(); }
      const a = e.target.closest('[data-act]'); if (!a) return;
      if (a.dataset.act === 'xall') { XC.groups = new Set(c.topics.map(t => t.id)); drawSetup(); }
      if (a.dataset.act === 'start') {
        const all = XC.groups.size === c.topics.length;
        start(f.id, { groups: [...XC.groups], mix: XC.mix, len: XC.len, explain: XC.explain, groupsLabel: all ? 'allir fyrirlestrar' : c.topics.filter(t => XC.groups.has(t.id)).map(t => t.label || t.id).join(', ') });
      }
    };
    el.onchange = e => { if (e.target.id === 'xexp') XC.explain = e.target.checked; };
  }

  // ---------- í gangi ----------
  function drawRun() {
    const x = X(); if (!x) return drawSetup();
    if (x.phase === 'grade') return drawGrade();
    if (x.style === 'written') return drawWritten();
    drawOne();
  }

  function timerBar(x, extra = '') {
    return `<div class="timer"><span class="clock" id="clk">--:--</span><div class="tbar"><i id="tb" style="width:100%"></i></div>${extra}<button class="btn small ${x.style === 'written' ? 'primary' : ''}" data-act="submit">Skila</button></div>`;
  }

  function drawOne() {
    const x = X(); const it = x.items[x.cur]; const r = x.ans[x.cur];
    const nAns = x.items.filter((q, i) => answered(q, x.ans[i])).length;
    const fmt = c.examFormats.find(f => f.id === x.format);
    const tot = x.items.reduce((s, q) => s + (q.type === 'card' ? 0 : pointsOf(q, fmt)), 0);
    const grid = x.items.map((q, i) => `<button class="${answered(q, x.ans[i]) ? 'ans' : ''} ${i === x.cur ? 'cur' : ''} ${x.flag[i] ? 'flag' : ''} ${q.type === 'steps' || q.type === 'card' ? 'st' : ''}" data-g="${i}" aria-label="Spurning ${i + 1}">${i + 1}</button>`).join('');
    let main;
    if (it.type === 'steps') main = `<div class="qtext">${it.q}</div><textarea class="scratch" data-txt placeholder="Skrifaðu lausnina hér eða á blað (valfrjálst)">${esc(r.txt || '')}</textarea><p class="hint">Skriflegt dæmi (${stepTotal(it)} stig í lausn, ${fmtPts(pointsOf(it, fmt))} á prófinu). Leystu á blað eða í reitinn; þú metur lausnina sjálfur eftir skil.</p>`;
    else if (it.type === 'card') main = `${renderAnswer(it, r, { exam: true })}<p class="hint">Skýringarspurning: telur ekki í einkunn. Fyrirmyndarsvarið birtist í yfirferðinni.</p>`;
    else main = `<div class="qtext">${it.q}</div>${renderAnswer(it, r, { exam: true })}`;
    el.innerHTML = `<div class="stack">
      ${timerBar(x, `<span class="hint mono">${nAns}/${x.items.length} svarað</span>`)}
      <div class="qcard">${itemMeta(c, it, `${x.style === 'inspera' ? 'Spurning' : 'Dæmi'} ${x.cur + 1} af ${x.items.length}`)}${main}
        <div class="row" style="justify-content:space-between">
          <button class="btn small" data-act="prev" ${x.cur === 0 ? 'disabled' : ''}>← Fyrri</button>
          <button class="btn small" data-act="flag">${x.flag[x.cur] ? 'Taka merki af' : 'Merkja til að skoða aftur'}</button>
          <button class="btn small ${x.cur === x.items.length - 1 ? '' : 'primary'}" data-act="next" ${x.cur === x.items.length - 1 ? 'disabled' : ''}>Næsta →</button>
        </div>
      </div>
      <div class="panel"><div class="grid">${grid}</div><p class="hint" style="margin-top:10px">Grátt = svarað · gulur punktur = merkt${x.style === 'mixed' ? ' · lína = skriflegt' : ''} · <span class="mono">${esc(x.label)} · ${fmtPts(tot)} stig</span></p></div>
      <div class="row"><button class="btn small" data-act="quit">Hætta við prófið án þess að skila</button></div>
    </div>`;
    setTopH();
    el.querySelectorAll('#numin, .ninp').forEach(inp => inp.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); if (x.cur < x.items.length - 1) { x.cur++; store.save(); drawOne(); } } }));
    startTimer();
  }

  function drawWritten() {
    const x = X(); const tot = x.items.reduce((s, it) => s + it.w, 0);
    const list = x.items.map((it, i) => `<div class="qcard exam-q" id="eq${i}"><div class="qmeta"><span class="eyebrow">Dæmi ${i + 1} · ${esc(topicLabel(c, it.topic))}</span><span class="wt">${it.w} stig</span></div><div class="qtext">${it.q}</div></div>`).join('');
    el.innerHTML = `<div class="stack">
      ${timerBar(x)}
      <p class="notice">Skrifaðu allar lausnir á blað með millireikningum. Engin reiknivél. ${esc(x.label)}, ${x.items.length} dæmi, ${tot} stig.</p>
      ${list}
      <div class="row"><button class="btn primary" data-act="submit">Skila og fara yfir</button><button class="btn small" data-act="quit">Hætta við prófið</button></div>
    </div>`;
    setTopH();
    startTimer();
  }

  function startTimer() { tick(); clearInterval(timer); timer = setInterval(tick, 1000); }
  function tick() {
    const x = X(); if (!x || x.phase !== 'write') return;
    const left = timeLeft(x); const clk = el.querySelector('#clk'), tb = el.querySelector('#tb'); if (!clk) return;
    clk.textContent = fmtDur(left); clk.classList.toggle('low', left < lowAt(x)); tb.style.width = Math.max(0, left / x.dur * 100) + '%';
    if (left <= 0) submit(true);
  }

  function submit(timeout) {
    clearInterval(timer);
    const x = X(); if (!x) return;
    if (needsGrading(x)) { toGrade(x, { timeout }); store.save(); drawGrade(); window.scrollTo(0, 0); return; }
    finish(timeout);
  }

  function finish(timeout) {
    clearInterval(timer);
    const x = X(); if (!x) return;
    results.set(c.id, finishExam(S, c, x, { timeout }));
    store.save(); drawResult(); window.scrollTo(0, 0);
  }

  // ---------- sjálfsmat skriflegra dæma ----------
  function drawGrade() {
    clearInterval(timer);
    const x = X(); const sc = scoreExam(c, x);
    const idx = x.items.map((it, i) => i).filter(i => x.items[i].type === 'steps');
    const marks = idx.flatMap(i => x.ans[i].mk); const left = marks.filter(v => v === null).length;
    const list = idx.map(i => { const it = x.items[i];
      return `<div class="qcard exam-q" id="eq${i}"><div class="qmeta"><span class="eyebrow">Dæmi ${i + 1} · ${esc(topicLabel(c, it.topic))}</span><span class="wt">${fmtPts(sc[i].pts)}/${fmtPts(sc[i].max)} stig</span></div><div class="qtext">${it.q}</div>${x.ans[i].txt ? `<p class="hint">Þitt svar í reitnum:</p><pre class="code">${esc(x.ans[i].txt)}</pre>` : ''}<div data-ex="${i}">${renderSteps(it, x.ans[i], { reveal: true })}</div></div>`; }).join('');
    el.innerHTML = `<div class="stack">
      <span class="eyebrow">${esc(x.label)}${x.timeout ? ' · tíminn rann út' : ''} · ${fmtDur(x.used)} notaðar</span>
      <h2>Gefðu þér stig</h2>
      <p class="muted" style="max-width:62ch">Berðu blaðið þitt saman við hvert skref og hakaðu heiðarlega. Rétt aðferð með reikningsvillu í lokin fær stig fyrir fyrri skrefin, eins og á prófinu.${idx.length < x.items.length ? ' Hin dæmin eru metin sjálfkrafa.' : ''}</p>
      <div class="timer"><span class="hint mono">${marks.length - left}/${marks.length} skref metin</span><div class="tbar"><i style="width:${marks.length ? (marks.length - left) / marks.length * 100 : 100}%"></i></div><button class="btn small primary" data-act="finish">Ljúka yfirferð</button></div>
      ${list}
      <button class="btn primary" data-act="finish" style="width:fit-content">Ljúka yfirferð</button>
    </div>`;
    setTopH();
  }

  // ---------- niðurstaða ----------
  function drawResult() {
    const res = results.get(c.id);
    const byT = breakdown(res, it => it.topic);
    const tbl = (by, label) => Object.keys(by).sort((a, b) => by[a].pts / by[a].max - by[b].pts / by[b].max).map(k => `<tr><td>${label(k)}</td><td class="mono">${fmtPts(by[k].pts)}/${fmtPts(by[k].max)}</td><td style="width:40%"><div class="bar ${barCls(by[k].pts / by[k].max)}"><i style="width:${by[k].pts / by[k].max * 100}%"></i></div></td></tr>`).join('');
    const byLevel = res.style === 'mixed' ? `<div class="panel"><h3 style="margin-bottom:6px">Eftir stigum</h3><div class="scroll"><table class="tt"><tbody>${tbl(breakdown(res, it => it.level), l => `<span class="lv lv${l}">Stig ${l} · ${esc(c.levels[l].name)}</span>`)}</tbody></table></div></div>` : '';
    const toBank = res.items.filter((it, i) => it.type !== 'card' && res.scores[i].frac < c.passScore - 1e-9).length;
    const counts = res.scores.every(s => s.max <= 1);
    const list = res.items.map((it, i) => {
      const a = res.ans[i], s = res.scores[i];
      const dot = it.type === 'card' ? 'n' : !answered(it, a) && it.type !== 'steps' ? 'n' : s.frac >= 0.999 ? 'g' : s.frac > 0 ? 'n' : 'b';
      let body;
      if (it.type === 'steps') body = `<div class="qtext">${it.q}</div>${renderSteps(it, a, { reveal: true, noMark: true })}`;
      else if (it.type === 'card') body = renderAnswer(it, a, { reveal: true, exam: true });
      else body = `<div class="qtext">${it.q}</div>${renderAnswer(it, a, { reveal: true })}<div class="expl">${verdictHTML(it, a, s.max !== 1 ? s.max : undefined)}${it.e ? `<div>${it.e}</div>` : ''}</div>`;
      return `<details class="rv" ${dot === 'b' || (it.type === 'steps' && s.frac < 0.999) ? 'open' : ''}><summary><span class="dot ${dot}"></span><span class="mono">${i + 1}.</span><span style="min-width:0">${esc(clip(plain(it.q), 90))}</span><span class="tag" style="margin-left:auto">${it.type === 'card' ? 'skýring' : `${fmtPts(s.pts)}/${fmtPts(s.max)}`}</span></summary><div>${body}</div></details>`;
    }).join('');
    el.innerHTML = `<div class="stack">
      <span class="eyebrow">${esc(res.label)}${res.timeout ? ' · tíminn rann út' : ''} · ${fmtDur(res.used)} notaðar</span>
      <div class="score"><b class="mono">${fmtPts(res.score)}/${fmtPts(res.max)}</b><span class="muted">${counts ? '' : 'stig · '}≈ ${grade10(res.score / (res.max || 1))} í einkunn · ${toBank} í villubankann</span></div>
      <div class="cols"><div class="panel"><h3 style="margin-bottom:6px">Eftir flokkum</h3><div class="scroll"><table class="tt"><tbody>${tbl(byT, k => esc(c.topics.find(t => t.id === k).name))}</tbody></table></div></div>${byLevel}</div>
      <div class="row"><a class="btn primary" href="#/fag/${c.id}/aefing?r=1">Æfa villurnar núna</a><button class="btn" data-act="again">Nýtt próf</button></div>
      <h3>Yfirferð</h3><div class="stack" style="gap:8px">${list}</div>
    </div>`;
  }

  // ---------- atburðir ----------
  el.onclick = e => {
    const x = X();
    if (results.has(c.id) && !x) { if (e.target.closest('[data-act="again"]')) { results.delete(c.id); drawSetup(); window.scrollTo(0, 0); } return; }
    if (!x) return setupClick && setupClick(e);
    if (x.phase === 'grade') {
      const mk = e.target.closest('[data-mk]');
      if (mk) { const i = +mk.closest('[data-ex]').dataset.ex; const y = window.scrollY; x.ans[i].mk[+mk.dataset.mk] = mk.dataset.v === '1'; store.save(); drawGrade(); window.scrollTo(0, y); return; }
      const a = e.target.closest('[data-act="finish"]'); if (!a) return;
      const left = x.items.flatMap((it, i) => it.type === 'steps' ? x.ans[i].mk : []).filter(v => v === null).length;
      if (left && a.dataset.sure !== '1') { el.querySelectorAll('[data-act="finish"]').forEach(b => { b.dataset.sure = '1'; b.textContent = `${left} skref ómetin teljast röng. Ljúka samt?`; }); return; }
      return finish(x.timeout);
    }
    if (x.style !== 'written') {
      const it = x.items[x.cur];
      const nr = clickAnswer(it, x.ans[x.cur], e); if (nr !== undefined) { x.ans[x.cur] = nr; store.save(); return drawOne(); }
      const g = e.target.closest('[data-g]'); if (g) { x.cur = +g.dataset.g; store.save(); return drawOne(); }
    }
    const a = e.target.closest('[data-act]'); if (!a || a.disabled) return; const act = a.dataset.act;
    if (act === 'prev' && x.cur > 0) { x.cur--; store.save(); drawOne(); }
    if (act === 'next' && x.cur < x.items.length - 1) { x.cur++; store.save(); drawOne(); }
    if (act === 'flag') { x.flag[x.cur] = !x.flag[x.cur]; store.save(); drawOne(); }
    if (act === 'submit') {
      if (x.style === 'written') {
        if (a.dataset.sure !== '1' && timeLeft(x) > 60e3) { el.querySelectorAll('[data-act="submit"]').forEach(b => { b.dataset.sure = '1'; b.textContent = `Skila núna? ${fmtDur(timeLeft(x))} eftir`; }); return; }
      } else {
        const left = x.items.length - x.items.filter((q, i) => answered(q, x.ans[i])).length;
        if (left && a.dataset.sure !== '1') { a.dataset.sure = '1'; a.textContent = `${left} ósvarað. Skila samt?`; a.classList.add('primary'); return; }
      }
      submit(false);
    }
    if (act === 'quit') {
      if (a.dataset.sure !== '1') { a.dataset.sure = '1'; a.textContent = 'Smelltu aftur til að henda prófinu'; return; }
      delete S.exams[c.id]; store.save(); drawSetup();
    }
  };
  el.oninput = e => {
    const x = X(); if (!x || x.phase !== 'write' || x.style === 'written') return;
    const it = x.items[x.cur];
    if (inputAnswer(it, x.ans, x.cur, e)) {
      store.save();
      const n = x.items.filter((q, i) => answered(q, x.ans[i])).length; const h = el.querySelector('.timer .hint'); if (h) h.textContent = `${n}/${x.items.length} svarað`;
      const gb = el.querySelector(`[data-g="${x.cur}"]`); if (gb) gb.classList.toggle('ans', answered(it, x.ans[x.cur]));
    }
  };

  const startId = query.get('start');
  if (startId) history.replaceState(null, '', `#/fag/${c.id}/prof`);
  if (X()) drawRun();
  else if (startId && c.examFormats.some(f => f.id === startId) && c.examFormats.find(f => f.id === startId).pick.by !== 'levels') start(startId);
  else if (results.has(c.id)) drawResult();
  else drawSetup();

  return {
    onKey(e) {
      const x = X(); if (!x || x.phase !== 'write' || x.style === 'written') return;
      const it = x.items[x.cur];
      const i = keyToIndex(it, e.key);
      if (i !== undefined && (it.type === 'mc' || it.type === 'multi') && i < it.o.length) {
        if (it.type === 'mc') x.ans[x.cur] = i; else { const s = new Set(x.ans[x.cur]); s.has(i) ? s.delete(i) : s.add(i); x.ans[x.cur] = [...s].sort((a, b) => a - b); }
        store.save(); drawOne();
      } else if ((e.key === 'ArrowRight' || e.key === 'Enter') && x.cur < x.items.length - 1) { e.preventDefault(); x.cur++; store.save(); drawOne(); }
      else if (e.key === 'ArrowLeft' && x.cur > 0) { x.cur--; store.save(); drawOne(); }
    },
    cleanup() { clearInterval(timer); }
  };
}

