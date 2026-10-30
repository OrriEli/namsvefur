// Yfirlit fags: staðreyndir um prófið, þrjár aðgerðir og staðan eftir flokkum (eins og forsíða gömlu síðnanna).

import { topicStats, weakest, entriesOf } from '../engine/practice.js';
import { bankIds } from '../engine/review.js';
import { pctTxt, plural } from '../ui/format.js';
import { bar, esc } from '../ui/dom.js';
import { formatMeta } from './exam.js';

export function render({ el, course: c, store, go }) {
  const S = store.state;
  const quota = (c.examFormats.find(f => f.pick.by === 'quota') || {}).pick;
  const qTotal = quota ? Object.values(quota.quota).reduce((a, b) => a + b, 0) : 0;
  const nOld = c.items.filter(i => i.source === 'old').length, nNew = c.items.filter(i => i.source === 'new').length;
  const wk = weakest(c, S, 2);
  const name = id => c.topics.find(t => t.id === id).name;
  const first = c.examFormats[0];
  const last = [...S.hist].reverse().find(h => h.course === c.id);
  const bank = bankIds(S, c.id).length;
  const running = S.exams[c.id];

  const rows = c.topics.map(t => {
    const s = topicStats(c, S, t.id); const q = quota && quota.quota[t.id];
    return `<tr><td><b>${esc(t.name)}</b>${t.ref ? `<div class="hint">${esc(t.ref)}</div>` : ''}</td>
      ${quota ? `<td class="mono hide-sm">${q ? `${q} af ${qTotal}` : '–'}</td>` : ''}<td class="mono">${s.seen}/${s.total}</td>
      <td style="width:28%">${bar(s.pct, pctTxt(s.pct))}</td>
      <td><button class="btn small" data-act="topic" data-t="${t.id}">Æfa</button></td></tr>`;
  }).join('');

  el.innerHTML = `<div class="stack" style="gap:22px">
    <p class="muted" style="max-width:62ch">${[nOld && `${plural(nOld, 'spurning', 'spurningar')} úr gömlum prófum`, nNew && plural(nNew, 'ný spurning', 'nýjar spurningar'), c.gens.length && `${plural(c.gens.length, 'tegund', 'tegundir')} reikningsdæma sem fá nýjar tölur í hvert sinn`].filter(Boolean).join(', ')}. Allt sem þú svarar er skráð hér í vafranum.</p>
    ${running ? `<div class="panel row" style="justify-content:space-between"><span><b>${esc(running.label)}</b> er í gangi.</span><a class="btn primary" href="#/fag/${c.id}/prof">Halda áfram</a></div>` : ''}
    <div class="facts">${c.examInfo.facts.map(f => `<div><b>${esc(f.value)}</b><span>${esc(f.label)}</span></div>`).join('')}</div>
    <div class="actions">
      <button class="action main" data-act="exam"><h3>Taka próf <span class="mono">${formatMeta(c, first)}</span></h3><p>${first.desc}</p></button>
      <button class="action" data-act="weak"><h3>Æfa veikustu flokkana</h3><p>${wk.map(name).map(esc).join(' og ')}, með útskýringu eftir hvert svar.</p></button>
      <button class="action" data-act="wrong"><h3>Villubankinn <span class="mono">${bank}</span></h3><p>Spurning fer út þegar þú svarar henni rétt tvisvar í röð.</p></button>
    </div>
    <div class="panel stack" style="gap:10px">
      <div class="row" style="justify-content:space-between"><h2>Staðan eftir flokkum</h2>${last ? `<p class="hint">Síðasta próf: <span class="mono">${last.score}/${last.max}</span> · ${esc(last.label)}</p>` : ''}</div>
      <div class="scroll"><table class="tt"><thead><tr><th>Flokkur</th>${quota ? '<th class="hide-sm">Vægi á prófi</th>' : ''}<th>Séð</th><th>Rétt</th><th></th></tr></thead><tbody>${rows}</tbody></table></div>
      ${c.examInfo.note ? `<p class="hint">${c.examInfo.note}</p>` : ''}
    </div>
    <p class="foot">Ábending: talnatakkarnir <kbd>1</kbd>–<kbd>5</kbd> velja svar og <kbd>Enter</kbd> fer í næstu spurningu. ${entriesOf(c).length} færslur í æfingapottinum.</p>
  </div>`;

  el.onclick = e => {
    const b = e.target.closest('[data-act]'); if (!b) return;
    const a = b.dataset.act;
    if (a === 'exam') go(`#/fag/${c.id}/prof?start=${first.id}`);
    if (a === 'weak') go(`#/fag/${c.id}/aefing?t=${weakest(c, S, 2).join(',')}`);
    if (a === 'wrong') go(`#/fag/${c.id}/aefing?r=1`);
    if (a === 'topic') go(`#/fag/${c.id}/aefing?t=${b.dataset.t}`);
  };
}
