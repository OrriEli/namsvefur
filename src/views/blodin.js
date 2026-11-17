// Blöðin: Blöð allra faga á einum stað, með leit þvert á fög. Án leitarorðs sést efnisyfirlit hvers Blaðs.
// ?q=leitarorð

import { COURSES } from '../courses/index.js';
import { buildIndex, search } from '../engine/sheets.js';
import { plural } from '../ui/format.js';
import { esc } from '../ui/dom.js';

let index = null;
let last = '';

const href = (c, s) => `#/fag/${c.id}/bladid?k=${encodeURIComponent(s.id)}`;

export function render({ app, query }) {
  if (!index) index = buildIndex(COURSES);
  if (query.has('q')) last = query.get('q');

  function results(q) {
    if (!q.trim()) {
      return COURSES.map(c => `<div class="panel stack" style="gap:8px"><h2><span class="cchip" style="--cc:var(${c.color})">${c.code}</span> ${esc(c.name)}</h2>
        <ol class="toc-list">${c.sheet.sections.map(s => `<li><a href="${href(c, s)}"><span class="mono hint">${esc(s.n)}</span> ${esc(s.title)}</a></li>`).join('')}</ol></div>`).join('');
    }
    const res = search(index, q);
    if (!res.length) return `<div class="panel empty">Ekkert fannst fyrir „${esc(q)}“. Prófaðu styttri orðhluta, t.d. „núvirð“.</div>`;
    const by = new Map(); for (const r of res) { const l = by.get(r.course) || []; l.push(r); by.set(r.course, l); }
    for (const list of by.values()) list.sort((x, y) => (y.inTitle - x.inTitle) || (y.hits - x.hits));
    return [...by].map(([c, list]) => `<div class="panel stack" style="gap:10px"><div class="row" style="justify-content:space-between"><h2><span class="cchip" style="--cc:var(${c.color})">${c.code}</span> ${esc(c.name)}</h2><span class="mono hint">${plural(list.length, 'kafli', 'kaflar')}</span></div>
      ${list.map(r => `<a class="hit" href="${href(c, r.section)}"><b><span class="mono hint">${esc(r.section.n)}</span> ${esc(r.section.title)}</b><span class="mono hint">${plural(r.hits, 'samsvörun', 'samsvaranir')}</span>
        ${r.snippets.map(s => `<span class="snip">${esc(s.before)}<mark>${esc(s.match)}</mark>${esc(s.after)}</span>`).join('')}</a>`).join('')}</div>`).join('');
  }

  app.innerHTML = `<div class="stack" style="gap:18px">
    <div class="hero"><h1>Blöðin</h1><p class="muted" style="max-width:62ch">Blöð allra faganna. Leitaðu þvert á fög, t.d. „núvirði“, „Hessian“ eða „teygni“, til að sjá hvaða kafli í hvaða fagi geymir efnið.</p></div>
    <input class="note-in search" id="q" type="search" placeholder="Leita í Blöðunum" value="${esc(last)}" autocomplete="off" aria-label="Leita í Blöðunum">
    <div id="res" class="stack" style="gap:14px">${results(last)}</div>
  </div>`;
  const inp = app.querySelector('#q'); inp.focus(); inp.setSelectionRange(last.length, last.length);
  let timer = null;
  app.oninput = e => {
    if (e.target.id !== 'q') return;
    clearTimeout(timer);
    timer = setTimeout(() => { last = e.target.value; app.querySelector('#res').innerHTML = results(last); history.replaceState(null, '', last ? `#/bladin?q=${encodeURIComponent(last)}` : '#/bladin'); }, 150);
  };
  return { cleanup() { clearTimeout(timer); } };
}
