// Próf á tíma, Inspera-snið: flakk og merkingar, ekkert birt fyrr en skilað. Niðurstaða og yfirferð á eftir.

import { buildExam, finishExam, timeLeft, byTopic } from '../engine/exam.js';
import { renderMcOptions, mcVerdict, keyToIndex } from '../engine/items/mc.js';
import { fmtDur, grade10 } from '../ui/format.js';
import { esc, plain, clip, barCls, setTopH } from '../ui/dom.js';

const results = new Map();   // nýjasta niðurstaða hvers fags, sýnd þar til nýtt próf hefst

/** „20 · 60:00“: fjöldi spurninga og tími prófsniðs. */
export function formatMeta(c, f) {
  const p = f.pick;
  const n = p.by === 'quota' ? Object.values(p.quota).reduce((a, b) => a + b, 0) : p.by === 'fixed' ? p.ids.length : p.n;
  const min = f.minutes || f.minutesPerItem * n;
  return `${n} · ${min}:00`;
}

export function render(ctx) {
  const { el, course: c, store, query } = ctx;
  const S = store.state;
  let timer = null;
  const tname = id => c.topics.find(t => t.id === id).name;

  function start(id) { S.exams[c.id] = buildExam(c, id, S); store.save(); results.delete(c.id); drawExam(); window.scrollTo(0, 0); }

  function drawSetup() {
    clearInterval(timer);
    const last = S.hist.filter(h => h.course === c.id).slice(-6).reverse().map(h => `<tr><td>${esc(h.label)}</td><td class="mono">${h.score}/${h.max}</td><td class="mono">${Math.round(h.score / h.max * 100)}%</td><td class="hint">${new Date(h.at).toLocaleDateString('is-IS', { day: 'numeric', month: 'short' })} ${new Date(h.at).toLocaleTimeString('is-IS', { hour: '2-digit', minute: '2-digit' })}</td></tr>`).join('');
    el.innerHTML = `<div class="stack">
      <h2>Próf á tíma</h2>
      <p class="muted" style="max-width:62ch">Eins og í Inspera: þú getur flakkað fram og til baka og merkt spurningar. Þú sérð ekki hvað er rétt fyrr en þú skilar. Röng svör fara í villubankann.</p>
      <div class="actions">${c.examFormats.map((f, i) => `<button class="action ${i === 0 ? 'main' : ''}" data-k="${f.id}"><h3>${esc(f.name)} <span class="mono">${formatMeta(c, f)}</span></h3><p>${f.desc}</p></button>`).join('')}</div>
      ${last ? `<div class="panel"><h3 style="margin-bottom:8px">Síðustu próf</h3><div class="scroll"><table class="tt"><tbody>${last}</tbody></table></div></div>` : ''}
    </div>`;
    el.onclick = e => { const b = e.target.closest('[data-k]'); if (b) start(b.dataset.k); };
  }

  function drawExam() {
    const X = S.exams[c.id]; const it = X.items[X.cur]; const answered = X.ans.filter(a => a !== null).length;
    const tag = it.source === 'old' ? 'old' : it.source === 'gen' ? 'gen' : '';
    const grid = X.items.map((_, i) => `<button class="${X.ans[i] !== null ? 'ans' : ''} ${i === X.cur ? 'cur' : ''} ${X.flag[i] ? 'flag' : ''}" data-g="${i}" aria-label="Spurning ${i + 1}">${i + 1}</button>`).join('');
    el.innerHTML = `<div class="stack">
      <div class="timer"><span class="clock" id="clk">--:--</span><div class="tbar"><i id="tb" style="width:100%"></i></div><span class="hint mono">${answered}/${X.items.length} svarað</span><button class="btn small" data-act="submit">Skila</button></div>
      <div class="qcard">
        <div class="qmeta"><span class="eyebrow">Spurning ${X.cur + 1} af ${X.items.length} · ${esc(tname(it.topic))}</span><span class="tag ${tag}">${esc(it.src)}</span></div>
        <div class="qtext">${it.q}</div>${renderMcOptions(it, { chosen: X.ans[X.cur], reveal: false })}
        <div class="row" style="justify-content:space-between">
          <button class="btn small" data-act="prev" ${X.cur === 0 ? 'disabled' : ''}>← Fyrri</button>
          <button class="btn small" data-act="flag">${X.flag[X.cur] ? 'Taka merki af' : 'Merkja til að skoða aftur'}</button>
          <button class="btn small ${X.cur === X.items.length - 1 ? '' : 'primary'}" data-act="next" ${X.cur === X.items.length - 1 ? 'disabled' : ''}>Næsta →</button>
        </div>
      </div>
      <div class="panel"><div class="grid">${grid}</div><p class="hint" style="margin-top:10px">Grátt = svarað · gulur punktur = merkt · <span class="mono">${esc(X.label)}</span></p></div>
      <div class="row"><button class="btn small" data-act="quit">Hætta við prófið án þess að skila</button></div>
    </div>`;
    setTopH();
    el.onclick = e => {
      const opt = e.target.closest('.opt'); if (opt) { X.ans[X.cur] = +opt.dataset.i; store.save(); return drawExam(); }
      const g = e.target.closest('[data-g]'); if (g) { X.cur = +g.dataset.g; store.save(); return drawExam(); }
      const a = e.target.closest('[data-act]'); if (!a) return; const act = a.dataset.act;
      if (act === 'prev' && X.cur > 0) { X.cur--; store.save(); drawExam(); }
      if (act === 'next' && X.cur < X.items.length - 1) { X.cur++; store.save(); drawExam(); }
      if (act === 'flag') { X.flag[X.cur] = !X.flag[X.cur]; store.save(); drawExam(); }
      if (act === 'submit') {
        const left = X.items.length - X.ans.filter(v => v !== null).length;
        if (left && a.dataset.sure !== '1') { a.dataset.sure = '1'; a.textContent = `${left} ósvarað. Skila samt?`; a.classList.add('primary'); return; }
        finish(false);
      }
      if (act === 'quit') {
        if (a.dataset.sure !== '1') { a.dataset.sure = '1'; a.textContent = 'Smelltu aftur til að henda prófinu'; return; }
        delete S.exams[c.id]; store.save(); drawSetup();
      }
    };
    tick(); clearInterval(timer); timer = setInterval(tick, 1000);
  }

  function tick() {
    const X = S.exams[c.id]; if (!X) return;
    const left = timeLeft(X); const clk = el.querySelector('#clk'), tb = el.querySelector('#tb'); if (!clk) return;
    clk.textContent = fmtDur(left); clk.classList.toggle('low', left < 5 * 60e3); tb.style.width = Math.max(0, left / X.dur * 100) + '%';
    if (left <= 0) finish(true);
  }

  function finish(timeout) {
    clearInterval(timer);
    const X = S.exams[c.id]; if (!X) return;
    results.set(c.id, finishExam(S, c, X, { timeout }));
    store.save(); drawResult(); window.scrollTo(0, 0);
  }

  function drawResult() {
    const res = results.get(c.id); const by = byTopic(res);
    const rows = Object.keys(by).sort((a, b) => by[a].c / by[a].n - by[b].c / by[b].n).map(t => `<tr><td>${esc(tname(t))}</td><td class="mono">${by[t].c}/${by[t].n}</td><td style="width:40%"><div class="bar ${barCls(by[t].c / by[t].n)}"><i style="width:${by[t].c / by[t].n * 100}%"></i></div></td></tr>`).join('');
    const list = res.items.map((it, i) => {
      const a = res.ans[i]; const ok = a === it.a;
      return `<details class="rv" ${ok ? '' : 'open'}><summary><span class="dot ${a === null ? 'n' : ok ? 'g' : 'b'}"></span><span class="mono">${i + 1}.</span><span style="min-width:0">${esc(clip(plain(it.q), 90))}</span><span class="tag" style="margin-left:auto">${esc(tname(it.topic))}</span></summary>
        <div><div class="qtext">${it.q}</div>${renderMcOptions(it, { chosen: a, reveal: true })}<div class="expl">${mcVerdict(it, a)}<div>${it.e}</div></div></div></details>`;
    }).join('');
    el.innerHTML = `<div class="stack">
      <span class="eyebrow">${esc(res.label)}${res.timeout ? ' · tíminn rann út' : ''} · ${fmtDur(res.used)} notaðar</span>
      <div class="score"><b class="mono">${res.score}/${res.n}</b><span class="muted">≈ ${grade10(res.score / res.n)} í einkunn · ${res.n - res.score} í villubankann</span></div>
      <div class="panel"><h3 style="margin-bottom:6px">Eftir flokkum</h3><div class="scroll"><table class="tt"><tbody>${rows}</tbody></table></div></div>
      <div class="row"><a class="btn primary" href="#/fag/${c.id}/aefing?r=1">Æfa villurnar núna</a><button class="btn" data-act="again">Nýtt próf</button></div>
      <h3>Yfirferð</h3><div class="stack" style="gap:8px">${list}</div>
    </div>`;
    el.onclick = e => { if (e.target.closest('[data-act="again"]')) { results.delete(c.id); drawSetup(); window.scrollTo(0, 0); } };
  }

  const startId = query.get('start');
  if (startId) history.replaceState(null, '', `#/fag/${c.id}/prof`);
  if (S.exams[c.id]) drawExam();
  else if (startId && c.examFormats.some(f => f.id === startId)) start(startId);
  else if (results.has(c.id)) drawResult();
  else drawSetup();

  return {
    onKey(e) {
      const X = S.exams[c.id]; if (!X) return;
      const i = keyToIndex(e.key);
      if (i !== undefined && i < X.items[X.cur].o.length) { X.ans[X.cur] = i; store.save(); drawExam(); }
      else if ((e.key === 'ArrowRight' || e.key === 'Enter') && X.cur < X.items.length - 1) { e.preventDefault(); X.cur++; store.save(); drawExam(); }
      else if (e.key === 'ArrowLeft' && X.cur > 0) { X.cur--; store.save(); drawExam(); }
    },
    cleanup() { clearInterval(timer); }
  };
}

