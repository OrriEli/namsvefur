// Fög: eitt spjald á hvert fag, með næsta prófi og stöðunni.

import { COURSES, PENDING } from '../courses/index.js';
import { entriesOf } from '../engine/practice.js';
import { bankIds } from '../engine/review.js';
import { nextExam, countdownTxt } from '../ui/countdown.js';
import { pctTxt, plural } from '../ui/format.js';
import { esc } from '../ui/dom.js';

export function render({ app, store }) {
  const S = store.state;
  const cards = COURSES.map(c => {
    const es = entriesOf(c); let n = 0, k = 0, seen = 0;
    for (const e of es) { const p = S.items[e.gid]; if (p) { n += p.n; k += p.c; seen++; } }
    const bank = bankIds(S, c.id).length;
    return `<a class="ccard" href="#/fag/${c.id}" style="--cc:var(${c.color})">
      <div class="row" style="justify-content:space-between"><span class="cchip">${c.code}</span><span class="hint mono">${countdownTxt(nextExam(c.id))}</span></div>
      <h2>${esc(c.name)}</h2>
      <p class="hint">${plural(c.items.length, 'spurning', 'spurningar')} og ${plural(c.gens.length, 'rafall', 'rafalar')} · séð ${seen}/${es.length} · rétt ${pctTxt(n ? k / n : null)}${bank ? ` · ${bank} í villubanka` : ''}</p>
    </a>`;
  }).join('');
  const pending = PENDING.map(c => `<div class="ccard pending" style="--cc:var(--c-${c.id})">
      <div class="row" style="justify-content:space-between"><span class="cchip">${c.code}</span><span class="hint mono">${countdownTxt(nextExam(c.id))}</span></div>
      <h2>${esc(c.name)}</h2><p class="hint">${esc(c.note)}</p></div>`).join('');
  app.innerHTML = `<div class="stack" style="gap:22px">
    <div class="hero"><h1>Fögin</h1><p class="muted" style="max-width:62ch">Allt efni gömlu prófæfingasíðnanna, á einum stað. Framvindan er vistuð í þessum vafra.</p></div>
    <div class="courses">${cards}${pending}</div>
  </div>`;
  return {};
}
