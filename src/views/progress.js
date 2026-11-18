// Framvinda: villubankinn og vikan á einni síðu. #/framvinda/villur og #/framvinda/vikan opna síðuna við
// viðkomandi hluta (gömlu slóðirnar #/villur og #/vikan vísa hingað).

import { COURSES } from '../courses/index.js';
import { dueIds } from '../engine/review.js';
import { mountWrong } from './wrong.js';
import { mountWeek } from './week.js';

export function render({ app, store, anchor }) {
  const due = COURSES.reduce((s, c) => s + dueIds(store.state, c.id).length, 0);
  app.innerHTML = `<div class="stack" style="gap:28px">
    <div class="hero"><h1>Framvinda</h1><p class="muted" style="max-width:62ch">Villurnar sem bíða þín og hvernig vikan hefur gengið.</p></div>
    <nav class="jump" aria-label="Á þessari síðu"><a href="#/framvinda/villur" ${anchor === 'villur' ? 'aria-current="true"' : ''}>Villubankinn${due ? ` <span class="pill">${due}</span>` : ''}</a><a href="#/framvinda/vikan" ${anchor === 'vikan' ? 'aria-current="true"' : ''}>Vikan</a></nav>
    <section id="villur" class="anchor"></section>
    <section id="vikan" class="anchor"></section>
  </div>`;
  mountWrong(app.querySelector('#villur'), store);
  mountWeek(app.querySelector('#vikan'), store);
  // eftir að leiðsögnin hefur skrunað efst
  if (anchor) setTimeout(() => { const el = app.querySelector(`#${anchor === 'vikan' ? 'vikan' : 'villur'}`); if (el) el.scrollIntoView(); }, 0);
  return {};
}
