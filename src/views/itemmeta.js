// Haus spurningaspjalds: flokkamerki í lit fagsins (flokkur eða fyrirlestur), gerð og stig, erfiðleikastig og upprunamerki.

import { esc } from '../ui/dom.js';
import { ptsTxt } from '../engine/items/index.js';

const TY = { multi: 'Veldu allt sem á við', match: 'Pörun', num: 'Tölusvar' };
const TAG = { old: 'old', gen: 'gen', sheet: 'db' };

export function topicLabel(c, id) {
  const t = c.topics.find(x => x.id === id);
  return c.engine === 'lecture' ? (t.label || t.id) : t.name;
}

export function itemMeta(c, it, num) {
  const typ = it.pts !== undefined && TY[it.type] ? ' · ' + TY[it.type] : '';
  const pts = it.pts !== undefined ? ` · ${ptsTxt(it.pts)} st.` : '';
  const lv = it.level && c.levels ? `<span class="lv lv${it.level}">Stig ${it.level} · ${esc(c.levels[it.level].name)}</span>` : '';
  const tag = it.origin === 'mid' ? 'mid' : TAG[it.source] || '';
  return `<div class="qmeta"><span class="row" style="gap:8px">${num ? `<span class="eyebrow">${num}</span>` : ''}<span class="ttag">${esc(topicLabel(c, it.topic))}</span>${typ || pts ? `<span class="eyebrow">${(typ + pts).replace(/^ · /, '')}</span>` : ''}${lv}</span><span class="tag ${tag}">${esc(it.src)}${it.r ? ' · R' : ''}</span></div>`;
}
