// Fög: leit í Blöðum allra faga efst og síðan eitt spjald á hvert fag, með næsta prófi og stöðunni.
// ?q=leitarorð sýnir niðurstöður leitarinnar í stað listans (gömlu slóðirnar #/bladin og #/blodin vísa hingað).
// Blað hvers fags er flipi á fagsíðunni.

import { COURSES } from '../courses/index.js';
import { entriesOf } from '../engine/practice.js';
import { bankIds } from '../engine/review.js';
import { buildIndex, search } from '../engine/sheets.js';
import { nextExam, countdownShort } from '../ui/countdown.js';
import { pctTxt, plural } from '../ui/format.js';
import { esc } from '../ui/dom.js';

let index = null;
let last = '';

const href = (c, s) => `#/fag/${c.id}/bladid?k=${encodeURIComponent(s.id)}`;

function courseList(S) {
  const at = c => { const x = nextExam(c.id); return x && x.at ? new Date(x.at).getTime() : Infinity; };
  return `<ul class="rows">${[...COURSES].sort((a, b) => at(a) - at(b)).map(c => {
    const es = entriesOf(c).filter(e => e.type !== 'card'); let n = 0, k = 0, seen = 0;
    for (const e of es) { const p = S.items[e.gid]; if (p) { n += p.n; k += p.c; seen++; } }
    const bank = bankIds(S, c.id).length;
    return `<li><a class="rowlink" href="#/fag/${c.id}" style="--cc:var(${c.color})"><span class="rname"><span class="cchip">${c.code}</span><b>${esc(c.name)}</b></span><span class="rright">${countdownShort(nextExam(c.id))}</span>
      <span class="rsub">${plural(c.items.length, 'spurning', 'spurningar')} og ${plural(c.gens.length, 'rafall', 'rafalar')} · séð ${seen}/${es.length} · rétt ${pctTxt(n ? k / n : null)}${bank ? ` · ${bank} í villubanka` : ''}</span></a></li>`;
  }).join('')}</ul>`;
}

/** Niðurstöður leitar í Blöðunum, flokkaðar eftir fagi. */
export function searchResults(q) {
  if (!index) index = buildIndex(COURSES);
  const res = search(index, q);
  if (!res.length) return `<div class="panel empty">Ekkert fannst í Blöðunum fyrir „${esc(q)}“. Prófaðu styttri orðhluta, t.d. „núvirð“.</div>`;
  const by = new Map(); for (const r of res) { const l = by.get(r.course) || []; l.push(r); by.set(r.course, l); }
  for (const list of by.values()) list.sort((x, y) => (y.inTitle - x.inTitle) || (y.hits - x.hits));
  return [...by].map(([c, list]) => `<div class="panel stack" style="gap:10px"><div class="row" style="justify-content:space-between"><h2><span class="cchip" style="--cc:var(${c.color})">${c.code}</span> ${esc(c.name)}</h2><span class="mono hint">${plural(list.length, 'kafli', 'kaflar')}</span></div>
    ${list.map(r => `<a class="hit" href="${href(c, r.section)}"><b><span class="mono hint">${esc(r.section.n)}</span> ${esc(r.section.title)}</b><span class="mono hint">${plural(r.hits, 'samsvörun', 'samsvaranir')}</span>
      ${r.snippets.map(s => `<span class="snip">${esc(s.before)}<mark>${esc(s.match)}</mark>${esc(s.after)}</span>`).join('')}</a>`).join('')}</div>`).join('');
}

export function render({ app, store, query }) {
  const S = store.state;
  last = query.get('q') || '';
  const body = q => q.trim() ? `<p class="hint">Leit í Blöðum allra faga. <a href="#/fog">Sýna fögin</a></p>${searchResults(q)}` : courseList(S);

  app.innerHTML = `<div class="stack" style="gap:22px">
    <div class="hero"><h1>Fögin</h1><p class="muted" style="max-width:62ch">Í þeirri röð sem prófin eru. Leitaðu í Blöðum allra faga, t.d. „núvirði“, „Hessian“ eða „teygni“.</p></div>
    <input class="note-in search" id="q" type="search" placeholder="Leita í Blöðunum" value="${esc(last)}" autocomplete="off" aria-label="Leita í Blöðum allra faga">
    <div id="res" class="stack" style="gap:14px">${body(last)}</div>
  </div>`;
  if (last) { const inp = app.querySelector('#q'); inp.focus(); inp.setSelectionRange(last.length, last.length); }
  let timer = null;
  app.oninput = e => {
    if (e.target.id !== 'q') return;
    clearTimeout(timer);
    timer = setTimeout(() => { last = e.target.value; app.querySelector('#res').innerHTML = body(last); history.replaceState(null, '', last.trim() ? `#/fog?q=${encodeURIComponent(last)}` : '#/fog'); }, 150);
  };
  return { cleanup() { clearTimeout(timer); } };
}
