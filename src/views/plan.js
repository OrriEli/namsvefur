// Áætlun: dagar úr gömlu síðunni, með hökum sem vistast. Liðnir dagar dofna og dagurinn í dag er merktur.

import { weakest } from '../engine/practice.js';
import { esc } from '../ui/dom.js';

/** Slóð sem `go` í áætlun vísar á. */
export function goHref(c, go, state) {
  const m = c.modes ? (go.v === 'quick' ? 'm=quick&' : 'm=written&') : '';
  if (go.v === 'sheet') return `#/fag/${c.id}/bladid${go.sec ? '?k=' + go.sec : ''}`;
  if (go.v === 'exam') return `#/fag/${c.id}/prof${go.start ? '?start=' + go.start : ''}`;
  if (go.v === 'wrong') return `#/fag/${c.id}/aefing?r=1`;
  if (go.v === 'weak') return `#/fag/${c.id}/aefing?${m}t=${weakest(c, state, 2, c.modes ? e => !e.quick : undefined).join(',')}`;
  const q = [go.topics && 't=' + go.topics.join(','), go.kind && go.kind !== 'all' && 's=' + go.kind].filter(Boolean).join('&');
  return `#/fag/${c.id}/aefing?${m}${q}`.replace(/[?&]$/, '');
}

const dur = m => m >= 60 ? `${Math.floor(m / 60)} klst.${m % 60 ? ' ' + (m % 60) + ' mín.' : ''}` : `${m} mín.`;

export function render({ el, course: c, store }) {
  const S = store.state; const P = c.plan;
  if (!P) { el.innerHTML = '<div class="panel empty">Engin áætlun fyrir þetta fag.</div>'; return; }
  const mine = S.settings.plan[c.id] || (S.settings.plan[c.id] = { done: {} });
  if (!mine.done) mine.done = {};
  const today = new Date().toISOString().slice(0, 10);

  function draw() {
    const days = P.days.map((d, di) => {
      const tot = d.items.filter(s => !s.brk).reduce((a, s) => a + s.m, 0);
      const cls = d.date === today ? 'today' : d.date && d.date < today ? 'past' : '';
      const items = d.items.map((s, i) => {
        const id = `${di}-${i}`; const done = !!mine.done[id];
        return `<li><div class="step ${s.brk ? 'brk' : ''} ${done ? 'done' : ''} ${s.go && s.go.v === 'exam' ? 'exam' : ''}"><div class="tm">${s.at || (s.m ? s.m : '')}<small>${s.at ? s.m + ' mín.' : s.m ? 'mín.' : ''}</small></div>
          <div style="min-width:0"><h3>${esc(s.h)}</h3>${s.p ? `<p>${esc(s.p)}</p>` : ''}${s.go ? `<a class="btn small go" href="${goHref(c, s.go, S)}">Opna</a>` : ''}</div>
          ${s.brk ? '<span></span>' : `<input type="checkbox" data-id="${id}" ${done ? 'checked' : ''} aria-label="Lokið">`}</div></li>`;
      }).join('');
      return `<section class="day ${cls}"><header><div><span class="eyebrow">${esc(d.label)}</span>${d.title ? `<h2>${esc(d.title)}</h2>` : ''}</div><span class="mono hint">${tot ? dur(tot) : ''}</span></header>
        ${d.cal ? `<p class="cal">${esc(d.cal)}</p>` : ''}${d.note ? `<p class="dnote">${esc(d.note)}</p>` : ''}<ol>${items}</ol></section>`;
    }).join('');
    el.innerHTML = `<div class="stack plan">
      <div class="stack" style="gap:6px"><span class="eyebrow">${esc(P.eyebrow)}</span><h2>${esc(P.title)}</h2></div>
      <p class="muted" style="max-width:62ch">${P.intro}</p>
      ${days}
      <button class="btn small" data-act="reset" style="width:fit-content">Hreinsa hök</button>
    </div>`;
    const t = el.querySelector('.day.today'); if (t && !draw.scrolled) { draw.scrolled = true; setTimeout(() => t.scrollIntoView({ block: 'start' }), 50); }
  }

  el.onclick = e => { if (e.target.closest('[data-act="reset"]')) { mine.done = {}; store.save(); draw(); } };
  el.onchange = e => { const id = e.target.dataset.id; if (id) { mine.done[id] = e.target.checked; store.save(); draw(); } };
  draw();
}
