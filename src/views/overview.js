// Yfirlit fags: staðreyndir um prófið, aðgerðir og staðan, eins og forsíður gömlu síðnanna.
// Krossavélin og skriflega vélin sýna flokka (eftir hlutum námskeiðs); fyrirlestravélin sýnir fylki fyrirlestra × stiga.
// Í fagi með sjálfsmati (HAG101G) kemur forgangsröð á undan stöðunni og dálkurinn „Mat“ í stað „Séð“.

import { topicStats, weakest, entriesOf } from '../engine/practice.js';
import { bankIds } from '../engine/review.js';
import { pctTxt, plural } from '../ui/format.js';
import { bar, barCls, esc, thinBar } from '../ui/dom.js';
import { ptsTxt } from '../engine/items/index.js';
import { formatMeta } from './exam.js';
import { hasSelf, selfOf, selfScore, writtenStats } from '../engine/self.js';

export function render({ el, course: c, store, go }) {
  const S = store.state;
  const first = c.examFormats[0];
  const quota = (c.examFormats.find(f => f.pick.by === 'quota') || {}).pick;
  const qTotal = quota ? Object.values(quota.quota).reduce((a, b) => a + b, 0) : 0;
  const last = [...S.hist].reverse().find(h => h.course === c.id);
  const bank = bankIds(S, c.id).length;
  const running = S.exams[c.id];
  const written = c.engine === 'written', lecture = c.engine === 'lecture';
  const self = written && hasSelf(c);
  const scCls = sc => sc === null ? '' : sc < 0.4 ? 'lo' : sc < 0.7 ? 'mid' : 'hi';
  const scTxt = sc => sc === null ? '–' : ptsTxt(sc * 10);
  const isW = e => !e.quick && e.type !== 'card', isQ = e => e.quick;
  const wk = weakest(c, S, 2, written ? isW : undefined);
  const name = id => c.topics.find(t => t.id === id).name;
  const es = entriesOf(c);
  const count = f => es.filter(f).length;

  // ---------- inngangur ----------
  let intro;
  if (lecture) {
    const papers = new Set(entriesOf(c).filter(e => e.paper).map(e => e.paper)).size, nOld = count(e => !!e.paper);
    intro = `${plural(count(e => e.kind === 'item' && e.type !== 'card'), 'fast dæmi', 'föst dæmi')}${nOld ? ` (þar af ${nOld} úr ${papers} gömlum prófum)` : ''}, ${plural(count(e => e.type === 'card'), 'skilningsspjald', 'skilningsspjöld')} og ${plural(c.gens.length, 'rafall', 'rafalar')} sem búa til ný dæmi á þremur erfiðleikastigum.`;
  }
  else if (written) intro = `${plural(count(e => e.kind === 'item' && !e.quick), 'skriflegt dæmi', 'skrifleg dæmi')} með fullum lausnum, ${plural(count(e => e.kind === 'gen' && !e.quick), 'rafall', 'rafalar')} sem gefa ný dæmi með nýjum tölum og ${plural(count(e => e.kind === 'item' && e.quick), 'hraðspurning', 'hraðspurningar')}. Þú leysir á blað og gefur þér stig skref fyrir skref.`;
  else intro = [count(e => e.source === 'old') && `${plural(count(e => e.source === 'old'), 'spurning', 'spurningar')} úr gömlum prófum`, count(e => e.source === 'new') && plural(count(e => e.source === 'new'), 'ný spurning', 'nýjar spurningar'), c.gens.length && `${plural(c.gens.length, 'tegund', 'tegundir')} reikningsdæma sem fá nýjar tölur í hvert sinn`].filter(Boolean).join(', ') + '.';

  // ---------- aðgerðir ----------
  const exam = `<button class="action main" data-act="exam"><h3>Taka próf <span class="mono">${formatMeta(c, first)}</span></h3><p>${first.pick.by === 'levels' ? 'Blandað eftir stigum. Lausnir birtast eftir skil.' : first.desc}</p></button>`;
  const wrong = `<button class="action" data-act="wrong"><h3>Villubankinn <span class="mono">${bank}</span></h3><p>Dæmi fer út þegar þú svarar því rétt tvisvar í röð.</p></button>`;
  let actions;
  if (lecture) {
    const A = S.settings.adapt[c.id] || { lvl: 1 };
    actions = `<div class="actions four">${exam}
      <button class="action" data-act="adapt"><h3>Stigvaxandi <span class="mono">Stig ${A.lvl}</span></h3><p>Upp eftir þrjú rétt í röð, niður eftir tvö röng.</p></button>
      <button class="action" data-act="cards"><h3>Spjöld <span class="mono">${count(e => e.type === 'card')}</span></h3><p>Opnar skilningsspurningar með fyrirmyndarsvari. Engin einkunn.</p></button>${wrong}</div>`;
  } else if (written) {
    actions = `<div class="actions">${exam}
      <button class="action" data-act="weak"><h3>Skrifleg dæmi</h3><p>Veikustu flokkarnir núna: ${wk.map(name).map(esc).join(' og ')}.</p></button>
      <button class="action" data-act="quick"><h3>Hraðæfing</h3><p>Stuttar spurningar án reiknivélar. Svarið slegið inn sem heiltala eða brot.</p></button></div>`;
  } else {
    actions = `<div class="actions">${exam}
      <button class="action" data-act="weak"><h3>Æfa veikustu flokkana</h3><p>${wk.map(name).map(esc).join(' og ')}, með útskýringu eftir hvert svar.</p></button>${wrong}</div>`;
  }

  // ---------- staðan ----------
  let table;
  if (lecture) {
    const head = `<tr><th>Fyrirlestur</th>${[1, 2, 3].map(l => `<th><span class="lv lv${l}">Stig ${l} · ${esc(c.levels[l].name)}</span></th>`).join('')}<th class="hide-sm">Spjöld</th></tr>`;
    const rows = c.topics.map(t => {
      const cells = [1, 2, 3].map(l => { const s = topicStats(c, S, t.id, undefined, l);
        return `<td><button class="cell ${barCls(s.pct) || (s.pct === null ? '' : 'hi')}" data-g="${t.id}" data-l="${l}" aria-label="${esc(t.label || t.id)} stig ${l}: ${pctTxt(s.pct)} rétt, ${s.seen} af ${s.total} séð"><span class="pc">${pctTxt(s.pct)}</span><span class="sn">${s.seen}/${s.total} séð</span></button></td>`; }).join('');
      const cs = es.filter(e => e.type === 'card' && e.topic === t.id); const seen = cs.filter(e => S.items[e.gid]).length;
      return `<tr><td class="lname"><b>${esc(t.label || t.id)}</b><span>${esc(t.name)}</span></td>${cells}<td class="hide-sm"><button class="cell" data-cards="${t.id}"><span class="pc">${seen}/${cs.length}</span><span class="sn">skoðuð</span></button></td></tr>`;
    }).join('');
    table = `<p class="hint">Hlutfall réttra svara og hve mörg dæmi hafa sést í hverjum reit. Smelltu á reit til að æfa nákvæmlega hann.</p>
      <div class="scroll"><table class="mx"><thead>${head}</thead><tbody>${rows}</tbody></table></div>
      <div class="legend"><span>${[1, 2, 3].map(l => `<b>Stig ${l}:</b> ${esc(c.levels[l].desc)}`).join('</span><span>')}</span></div>`;
  } else {
    let part;
    const cols = written ? 6 : quota ? 5 : 4;
    const rows = c.topics.map(t => {
      const s = topicStats(c, S, t.id, written ? isW : undefined);
      const grp = t.part && t.part !== part ? `<tr class="grp"><td colspan="${cols}">${esc(t.part)}</td></tr>` : ''; part = t.part;
      const share = written ? esc(t.weight || '–') : quota ? (quota.quota[t.id] ? `${quota.quota[t.id]} af ${qTotal}` : '–') : null;
      const quick = written ? `<td style="width:20%">${bar(topicStats(c, S, t.id, isQ).pct, pctTxt(topicStats(c, S, t.id, isQ).pct))}</td>` : '';
      if (self) { const sc = selfScore(c, S, t.id), qq = topicStats(c, S, t.id, isQ);
        return `<tr><td><b>${esc(t.name)}</b>${t.ref ? `<div class="hint">${esc(t.ref)}</div>` : ''}</td><td class="mono hide-sm">${share}</td><td class="mono"><span class="selfpill ${scCls(sc)}">${scTxt(sc)}</span></td><td style="width:20%">${bar(s.pct, pctTxt(s.pct))}</td><td style="width:20%" class="hide-sm">${bar(qq.pct, pctTxt(qq.pct))}</td>
        <td><button class="btn small" data-act="topic" data-t="${t.id}">Æfa</button></td></tr>`; }
      return `${grp}<tr><td><b>${esc(t.name)}</b>${t.ref ? `<div class="hint">${esc(t.ref)}</div>` : ''}</td>${share !== null ? `<td class="mono hide-sm">${share}</td>` : ''}<td class="mono">${s.seen}/${s.total}</td>
        <td style="width:${written ? 20 : 28}%">${bar(s.pct, pctTxt(s.pct))}</td>${quick}<td><button class="btn small" data-act="topic" data-t="${t.id}">Æfa</button></td></tr>`;
    }).join('');
    const head = self ? '<tr><th>Flokkur</th><th class="hide-sm">Vægi</th><th>Mat</th><th>Skrifleg (stig)</th><th class="hide-sm">Hraðæfing</th><th></th></tr>' : `<tr><th>Flokkur</th>${written ? '<th class="hide-sm">Vægi</th>' : quota ? '<th class="hide-sm">Vægi á prófi</th>' : ''}<th>Séð</th><th>${written ? 'Skrifleg (stig)' : 'Rétt'}</th>${written ? '<th>Hraðæfing</th>' : ''}<th></th></tr>`;
    table = `<div class="scroll"><table class="tt"><thead>${head}</thead><tbody>${rows}</tbody></table></div>${c.examInfo.note ? `<p class="hint">${c.examInfo.note}</p>` : ''}`;
  }

  // ---------- forgangsröð (sjálfsmat) ----------
  const maxW = self ? Math.max(...Object.values(c.examWeights)) : 1;
  const prio = !self ? '' : `<div class="panel stack" style="gap:10px">
      <div class="row" style="justify-content:space-between"><h2>Forgangsröð</h2><span class="hint">Lítil kunnátta × mikið vægi á prófinu</span></div>
      <ol class="prio">${weakest(c, S, 5).map((t, i) => { const sc = selfScore(c, S, t), w = writtenStats(c, S, t), ew = c.examWeights[t];
        return `<li><span class="mono pn">${i + 1}</span><div style="min-width:0"><b>${esc(name(t))}</b><span class="vh">Sjálfsmat ${scTxt(sc)}/10${w.seen >= 3 ? ` · æfing ${pctTxt(w.pct)}` : ''} · um ${ew}% af prófinu</span>
          <div class="pmini" aria-hidden="true">${thinBar('Mat', sc, `${scTxt(sc)}/10`)}${thinBar('Vægi', ew / maxW, `${ew}%`)}</div>${w.seen >= 3 ? `<div class="hint">Æfing ${pctTxt(w.pct)}</div>` : ''}</div><button class="btn small" data-act="topic" data-t="${t}">Æfa</button></li>`; }).join('')}</ol>
      <p class="hint">Sjálfsmatið kemur frá Blaðinu (${esc(selfOf(c, S).at || '–')}); breyttu því þar þegar þú lærir kafla. Eftir þrjú æfð dæmi í flokki vegur æfingin til jafns við matið.</p>
    </div>`;

  el.innerHTML = `<div class="stack" style="gap:22px">
    <p class="muted" style="max-width:64ch">${intro} Allt sem þú svarar er skráð hér í vafranum.</p>
    ${running ? `<div class="panel row" style="justify-content:space-between"><span><b>${esc(running.label)}</b> er í gangi.</span><a class="btn primary" href="#/fag/${c.id}/prof">Halda áfram</a></div>` : ''}
    <div class="facts">${c.examInfo.facts.map(f => `<div><b>${esc(f.value)}</b><span>${esc(f.label)}</span></div>`).join('')}</div>
    ${actions}
    ${prio}
    <div class="panel stack" style="gap:10px">
      <div class="row" style="justify-content:space-between"><h2>${lecture ? 'Staðan: fyrirlestrar × stig' : 'Staðan eftir flokkum'}</h2>${last ? `<p class="hint">Síðasta próf: <span class="mono">${ptsTxt(last.score)}/${ptsTxt(last.max)}</span> · ${esc(last.label)}</p>` : ''}</div>
      ${table}
    </div>
    ${c.examInfo.callout || ''}
    <p class="foot">Flýtilyklar: <kbd>1</kbd>–<kbd>9</kbd> velja svar og <kbd>Enter</kbd> svarar eða fer í næstu spurningu.${written ? ' Í skriflegum dæmum: <kbd>H</kbd> vísbending, <kbd>N</kbd> næsta skref, <kbd>A</kbd> öll skref, <kbd>R</kbd>/<kbd>V</kbd> rétt eða vantaði.' : ''}</p>
  </div>`;

  el.onclick = e => {
    const cell = e.target.closest('.cell[data-g]'); if (cell) return go(`#/fag/${c.id}/aefing?m=pick&t=${cell.dataset.g}&l=${cell.dataset.l}`);
    const cc = e.target.closest('.cell[data-cards]'); if (cc) return go(`#/fag/${c.id}/aefing?m=cards&t=${cc.dataset.cards}`);
    const b = e.target.closest('[data-act]'); if (!b) return;
    const a = b.dataset.act;
    if (a === 'exam') go(`#/fag/${c.id}/prof?start=${first.id}`);
    if (a === 'weak') go(`#/fag/${c.id}/aefing?${written ? 'm=written&' : ''}t=${weakest(c, S, 2, written ? isW : undefined).join(',')}`);
    if (a === 'quick') go(`#/fag/${c.id}/aefing?m=quick`);
    if (a === 'adapt') go(`#/fag/${c.id}/aefing?m=adapt`);
    if (a === 'cards') go(`#/fag/${c.id}/aefing?m=cards`);
    if (a === 'wrong') go(`#/fag/${c.id}/aefing?r=1`);
    if (a === 'topic') go(`#/fag/${c.id}/aefing?${written ? 'm=written&' : ''}t=${b.dataset.t}`);
  };
}
