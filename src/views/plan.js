// Áætlun: kyrrstæð áætlun gömlu síðunnar, með tímum reiknuðum frá upphafstíma og hökum sem vistast.

import { weakest } from '../engine/practice.js';
import { esc } from '../ui/dom.js';

const tm = x => `${String(Math.floor(x / 60) % 24).padStart(2, '0')}:${String(x % 60).padStart(2, '0')}`;

/** Slóð sem `go` í áætlun vísar á. */
export function goHref(c, go, state) {
  const v = typeof go === 'string' ? go : go.v;
  if (v === 'sheet') return `#/fag/${c.id}/bladid${go.sec ? '?k=' + go.sec : ''}`;
  if (v === 'exam') return `#/fag/${c.id}/prof`;
  if (v === 'wrong') return `#/fag/${c.id}/aefing?r=1`;
  if (v === 'weak') return `#/fag/${c.id}/aefing?t=${weakest(c, state, 2).join(',')}`;
  if (v === 'old' || v === 'new' || v === 'gen') return `#/fag/${c.id}/aefing?s=${v}`;
  return `#/fag/${c.id}/aefing`;
}

export function render({ el, course: c, store }) {
  const S = store.state; const P = c.plan;
  if (!P) { el.innerHTML = '<div class="panel empty">Engin áætlun fyrir þetta fag.</div>'; return; }
  const mine = S.settings.plan[c.id] || (S.settings.plan[c.id] = { done: {} });

  function draw() {
    const [hh, mm] = (mine.start || P.start).split(':').map(Number); let t = hh * 60 + mm;
    const items = P.steps.map((s, i) => {
      const from = t; t += s.m; const done = !!mine.done[i];
      return `<li><div class="step ${s.brk ? 'brk' : ''} ${done ? 'done' : ''}"><div class="tm">${tm(from)}<small>${s.m} mín.</small></div>
        <div style="min-width:0"><h3>${esc(s.h)}</h3>${s.p ? `<p>${esc(s.p)}</p>` : ''}${s.go ? `<a class="btn small go" href="${goHref(c, s.go, S)}">Opna</a>` : ''}</div>
        <input type="checkbox" data-i="${i}" ${done ? 'checked' : ''} aria-label="Lokið"></div></li>`;
    }).join('');
    el.innerHTML = `<div class="stack plan">
      <div class="row" style="justify-content:space-between;align-items:flex-end"><div class="stack" style="gap:6px"><span class="eyebrow">${esc(P.eyebrow)}</span><h2>${esc(P.title)}</h2></div>
      <label class="row hint" for="st">Byrja kl. <input type="time" id="st" value="${mine.start || P.start}"></label></div>
      <p class="muted" style="max-width:62ch">${esc(P.intro)}</p>
      <p class="hint">Áætlunin er úr gömlu síðunni (${esc(P.eyebrow)}, próf kl. ${P.end}) og er hér til viðmiðunar.</p>
      <ol>${items}</ol>
      <div class="panel"><p>Lokið kl. <b class="mono">${tm(t)}</b>.</p></div>
      <button class="btn small" data-act="reset" style="width:fit-content">Hreinsa hök</button>
    </div>`;
  }

  el.onclick = e => { if (e.target.closest('[data-act="reset"]')) { mine.done = {}; store.save(); draw(); } };
  el.onchange = e => {
    if (e.target.id === 'st') { mine.start = e.target.value || P.start; store.save(); draw(); }
    if (e.target.dataset.i !== undefined) { mine.done[e.target.dataset.i] = e.target.checked; store.save(); draw(); }
  };
  draw();
}
