// Villubankinn þvert á fög, flokkaður eftir fagi og efnisflokki.

import { COURSES } from '../courses/index.js';
import { bankIds } from '../engine/review.js';
import { entryByGid } from '../engine/practice.js';
import { esc, plain, clip } from '../ui/dom.js';

export function render({ app, store }) {
  const S = store.state;
  const blocks = COURSES.map(c => {
    const ids = bankIds(S, c.id); if (!ids.length) return '';
    const by = {};
    for (const gid of ids) { const e = entryByGid(c, gid); if (e) (by[e.topic] = by[e.topic] || []).push(e); }
    const topics = c.topics.filter(t => by[t.id]).map(t => `<div class="stack" style="gap:6px"><div class="row" style="justify-content:space-between"><h3>${esc(t.name)}</h3><span class="mono hint">${by[t.id].length}</span></div>
      <ul class="wlist">${by[t.id].map(e => {
        const p = S.items[e.gid];
        const txt = e.kind === 'gen' ? `${c.genLabel || 'Rafall'}: ${c.gens.find(g => g.id === e.key.split('@')[0]).name}` : plain(c.items.find(i => i.id === e.key).q);
        return `<li class="hint"><span class="mono">${p.hits ? '1/2 ✓ ' : ''}</span>${esc(clip(txt, 120))}</li>`;
      }).join('')}</ul></div>`).join('');
    return `<div class="panel stack" style="gap:12px;--cc:var(${c.color})"><div class="row" style="justify-content:space-between"><h2><span class="cchip">${c.code}</span> ${esc(c.name)} <span class="mono muted">${ids.length}</span></h2><a class="btn primary" href="#/fag/${c.id}/aefing?r=1">Æfa villurnar</a></div>${topics}</div>`;
  }).join('');
  app.innerHTML = `<div class="stack"><h1>Villubankinn</h1>
    ${blocks || '<div class="panel empty">Engar villur skráðar enn. Þegar þú svarar rangt í æfingu eða prófi lendir spurningin hér og fer út þegar þú svarar rétt tvisvar í röð.</div>'}
    ${blocks ? '<p class="muted">Reikningsdæmi koma aftur með nýjum tölum, svo þú æfir aðferðina en ekki svarið.</p>' : ''}</div>`;
  return {};
}
