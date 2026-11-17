// Fagsíða: haus með niðurtalningu og flipar. Hver flipi er sér skrá.

import { nextExam, countdownTxt } from '../ui/countdown.js';
import { esc } from '../ui/dom.js';
import * as overview from './overview.js';
import * as practice from './practice.js';
import * as exam from './exam.js';
import * as sheet from './sheet.js';
import * as plan from './plan.js';

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
  app.innerHTML = `<div class="stack c-${c.id}" style="gap:18px;--cc:var(${c.color});--course-accent:var(${c.color})">
    <nav class="crumbs" aria-label="Brauðmolar"><a href="#/fog">Fög</a><span aria-hidden="true">›</span><a href="#/fag/${c.id}">${c.code}</a><span aria-hidden="true">›</span><span aria-current="page">${tab.label}</span></nav>
    <div class="course-head" style="margin-top:-10px">
      <h1><span class="cchip">${c.code}</span>${esc(c.name)}</h1>
      <span class="count mono" id="cd">${countdownTxt(nextExam(c.id))}</span>
    </div>
    <nav class="tabs" aria-label="${esc(c.short)}">${tabs.map(t => `<a href="#/fag/${c.id}${t.id === 'yfirlit' ? '' : '/' + t.id}" ${t === tab ? 'aria-current="page"' : ''}>${t.label}${t.id === 'prof' && running ? ' <span class="tag gen">í gangi</span>' : ''}</a>`).join('')}</nav>
    <div id="tab"></div>
  </div>`;
  const el = app.querySelector('#tab');
  const inner = tab.view.render({ ...ctx, el }) || {};
  const timer = setInterval(() => { const cd = app.querySelector('#cd'); if (cd) cd.innerHTML = countdownTxt(nextExam(c.id)); }, 30000);
  // „í gangi“ á Próf-flipanum fylgir því hvort próf er vistað
  const off = ctx.store.onChange(S => {
    const a = app.querySelector(`.tabs a[href="#/fag/${c.id}/prof"]`); if (!a) return;
    const tag = a.querySelector('.tag');
    if (S.exams[c.id] && !tag) a.insertAdjacentHTML('beforeend', ' <span class="tag gen">í gangi</span>');
    if (!S.exams[c.id] && tag) tag.remove();
  });
  return { onKey: inner.onKey, cleanup: () => { clearInterval(timer); off(); if (inner.cleanup) inner.cleanup(); } };
}
