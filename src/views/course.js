// Fagsíða sem „herbergi“ fagsins: haus í lit fagsins með stóru heiti, „séð“ og „rétt“ sem mjóar stikur og
// dögum í próf; flipar. Litur fagsins (--cc) gildir á stikur, valda hnappa og flokkamerki innan síðunnar.
// Hver flipi er sér skrá.

import { nextExam } from '../ui/countdown.js';
import { timeToExam, examDateText } from '../engine/time.js';
import { courseProgress } from '../engine/stats.js';
import { esc, progressBars } from '../ui/dom.js';
import * as overview from './overview.js';
import * as practice from './practice.js';
import * as exam from './exam.js';
import * as sheet from './sheet.js';
import * as plan from './plan.js';

/** Dagar í næsta próf fagsins: stór tala í lit fagsins, eða texti ef prófið er óstaðfest, í dag eða liðið. */
export function countHTML(c, now = Date.now()) {
  const x = nextExam(c.id); if (!x) return '<span class="ch-lbl">Ekkert próf skráð</span>';
  const t = timeToExam(x, now), what = esc(x.label.toLowerCase());
  if (t.state === 'future' || t.state === 'soon') return `<span class="bignum">${t.days}</span><span class="ch-lbl">${t.days === 1 ? 'dagur' : 'dagar'} í ${what}<br><span class="hint">${examDateText(x.at)}</span></span>`;
  if (t.state === 'tbd') return `<span class="ch-lbl"><b>${esc(x.label)}</b><br><span class="hint">dagsetning óstaðfest</span></span>`;
  return `<span class="ch-lbl"><b>${esc(x.label)} ${t.text}</b>${x.at ? `<br><span class="hint">${examDateText(x.at)}</span>` : ''}</span>`;
}

const TABS = [
  { id: 'yfirlit', label: 'Yfirlit', view: overview },
  { id: 'aefing', label: 'Æfing', view: practice },
  { id: 'prof', label: 'Próf', view: exam },
  { id: 'bladid', label: 'Blaðið', view: sheet },
  { id: 'aaetlun', label: 'Áætlun', view: plan, when: c => !!c.plan }
];

export function render(ctx) {
  const { app, course: c } = ctx;
  const tabs = TABS.filter(t => !t.when || t.when(c));
  const tab = tabs.find(t => t.id === ctx.tab) || tabs[0];
  const running = ctx.store.state.exams[c.id];
  app.innerHTML = `<div class="stack room c-${c.id}" style="gap:18px;--cc:var(${c.color});--course-accent:var(${c.color})">
    <nav class="crumbs" aria-label="Brauðmolar"><a href="#/fog">Fög</a><span aria-hidden="true">›</span><a href="#/fag/${c.id}">${c.code}</a><span aria-hidden="true">›</span><span aria-current="page">${tab.label}</span></nav>
    <header class="chead">
      <div class="ch-main"><span class="cchip">${c.code}</span><h1 class="ch-name">${esc(c.name)}</h1><div id="cprog">${progressBars(courseProgress(c, ctx.store.state))}</div></div>
      <div class="ch-count" id="cd">${countHTML(c)}</div>
    </header>
    <nav class="tabs" aria-label="${esc(c.short)}">${tabs.map(t => `<a href="#/fag/${c.id}${t.id === 'yfirlit' ? '' : '/' + t.id}" ${t === tab ? 'aria-current="page"' : ''}>${t.label}${t.id === 'prof' && running ? ' <span class="tag gen">í gangi</span>' : ''}</a>`).join('')}</nav>
    <div id="tab"></div>
  </div>`;
  const el = app.querySelector('#tab');
  const inner = tab.view.render({ ...ctx, el }) || {};
  const timer = setInterval(() => { const cd = app.querySelector('#cd'); if (cd) cd.innerHTML = countHTML(c); }, 30000);
  // „í gangi“ á Próf-flipanum fylgir því hvort próf er vistað
  const off = ctx.store.onChange(S => {
    const pr = app.querySelector('#cprog'); if (pr) pr.innerHTML = progressBars(courseProgress(c, S));
    const a = app.querySelector(`.tabs a[href="#/fag/${c.id}/prof"]`); if (!a) return;
    const tag = a.querySelector('.tag');
    if (S.exams[c.id] && !tag) a.insertAdjacentHTML('beforeend', ' <span class="tag gen">í gangi</span>');
    if (!S.exams[c.id] && tag) tag.remove();
  });
  return { onKey: inner.onKey, cleanup: () => { clearInterval(timer); off(); if (inner.cleanup) inner.cleanup(); } };
}
