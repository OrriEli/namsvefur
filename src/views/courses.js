// Fög: eitt spjald á hvert fag, með næsta prófi og stöðunni.

import { COURSES } from '../courses/index.js';
import { entriesOf } from '../engine/practice.js';
import { bankIds } from '../engine/review.js';
import { nextExam, countdownTxt } from '../ui/countdown.js';
import { pctTxt, plural } from '../ui/format.js';
import { esc } from '../ui/dom.js';

export function render({ app, store }) {
  const S = store.state;
  const at = c => { const x = nextExam(c.id); return x && x.at ? new Date(x.at).getTime() : Infinity; };
  const cards = [...COURSES].sort((a, b) => at(a) - at(b)).map(c => {
    const es = entriesOf(c).filter(e => e.type !== 'card'); let n = 0, k = 0, seen = 0;
    for (const e of es) { const p = S.items[e.gid]; if (p) { n += p.n; k += p.c; seen++; } }
    const bank = bankIds(S, c.id).length;
    return `<a class="ccard" href="#/fag/${c.id}" style="--cc:var(${c.color})">
      <span class="cchip">${c.code}</span>
      <h2>${esc(c.name)}</h2>
      <p class="cd mono">${countdownTxt(nextExam(c.id))}</p>
      <p class="hint">${plural(c.items.length, 'spurning', 'spurningar')} og ${plural(c.gens.length, 'rafall', 'rafalar')} · séð ${seen}/${es.length} · rétt ${pctTxt(n ? k / n : null)}${bank ? ` · ${bank} í villubanka` : ''}</p>
    </a>`;
  }).join('');
  app.innerHTML = `<div class="stack" style="gap:22px">
    <div class="hero"><h1>Fögin</h1><p class="muted" style="max-width:62ch">Undirbúningur fyrir lokaprófin, í þeirri röð sem prófin eru. Allt efni gömlu prófæfingasíðnanna er hér; framvindan er vistuð í þessum vafra.</p></div>
    <div class="courses">${cards}</div>
  </div>`;
  return {};
}
