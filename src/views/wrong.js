// Villubankinn þvert á fög (hluti af Framvindu), í tveimur sýnum: „Á tíma núna“ (það sem á að æfa í dag) og „Eftir merkjum“
// (mynstrin í eigin villum). Við hverja villu er reiturinn „Hvað hugsaði ég vitlaust?“ og merki.

import { COURSES } from '../courses/index.js';
import { bankIds, dueIds, nextDue, isDue, BOXES } from '../engine/review.js';
import { EXAMS } from '../config.js';
import { entryByGid } from '../engine/practice.js';
import { fmtWhen, plural } from '../ui/format.js';
import { esc, plain, clip } from '../ui/dom.js';

let view = 'due';

const dayWord = d => d === 1 ? '1 dag' : `${d} daga`;   // „eftir 1 dag“, „eftir 3 daga“

/** Hólfin fjögur sem dálkar: fjöldi í hverju hólfi og hve margir eru á tíma. Tómt = skýringarmynd án talna. */
export function boxesHTML(S, now = Date.now()) {
  const ids = bankIds(S);
  const cols = BOXES.map(b => { const inBox = ids.filter(g => S.items[g].box === b); return { b, n: inBox.length, due: inBox.filter(g => isDue(S.items[g], now)).length }; });
  const max = Math.max(1, ...cols.map(x => x.n));
  const empty = !ids.length;
  return `<ol class="boxes ${empty ? 'empty' : ''}" aria-label="Hólf villubankans">${cols.map((x, i) => `<li class="box">
      <span class="bx-fill" style="height:${empty ? 0 : Math.round(x.n / max * 100)}%" aria-hidden="true"></span>
      ${empty ? '' : `<b class="bx-n">${x.n}</b>`}
      <span class="bx-l">${i === 0 ? 'Kemur aftur eftir' : 'Svo eftir'} <b>${dayWord(x.b)}</b></span>
      ${x.due ? `<span class="bx-due">${x.due} á tíma</span>` : ''}
    </li>`).join('')}<li class="box out"><span class="bx-l">Rétt í síðasta hólfi: <b>út</b></span></li></ol>`;
}

function textOf(c, e) {
  if (e.kind === 'gen') return `${c.genLabel || 'Rafall'}: ${c.gens.find(g => e.key === g.id || e.key.startsWith(g.id + '@')).name}${e.quick ? ' (hraðspurning)' : ''}`;
  return plain(c.items.find(i => i.id === e.key).q);
}

function row(S, c, gid, now) {
  const e = entryByGid(c, gid); if (!e) return '';
  const p = S.items[gid]; const t = c.topics.find(x => x.id === e.topic);
  const where = p.box ? (isDue(p, now) ? `<span class="tag" style="background:var(--bad-weak);color:var(--bad)">á tíma</span>` : `<span class="tag">hólf ${p.box} d. · ${fmtWhen(p.due)}</span>`) : '<span class="tag gen">komin út</span>';
  return `<li class="wrow"><div class="row" style="gap:8px;justify-content:space-between;flex-wrap:nowrap"><span style="min-width:0"><span class="cchip" style="--cc:var(${c.color})">${c.code}</span> <span class="hint">${esc(t.name)}</span></span><span class="row" style="gap:6px;flex-wrap:nowrap">${p.sureWrong ? '<span class="tag sure">Viss en rangt</span>' : ''}${where}</span></div>
    <div>${esc(clip(textOf(c, e), 160))}</div>
    <div class="noterow"><input class="note-in" data-gid="${gid}" data-note value="${esc(p.note || '')}" placeholder="Hvað hugsaði ég vitlaust?" autocomplete="off"><input class="note-in tags-in" data-gid="${gid}" data-tags value="${esc((p.tags || []).join(', '))}" placeholder="Merki, t.d. gleymdi NX" autocomplete="off"></div></li>`;
}

/** Teiknar villubankann í `el` (hluta á Framvindu). */
export function mountWrong(el, store) {
  const S = store.state;

  function draw() {
    const now = Date.now();
    let body = '';
    if (view === 'due') {
      body = COURSES.map(c => {
        const due = dueIds(S, c.id, now), all = bankIds(S, c.id);
        if (!all.length) return '';
        const t = nextDue(S, c.id, now);
        return `<div class="panel stack" style="gap:10px"><div class="row" style="justify-content:space-between"><h3><span class="cchip" style="--cc:var(${c.color})">${c.code}</span> ${esc(c.name)}</h3>
          <div class="row">${due.length ? `<a class="btn primary small" href="#/fag/${c.id}/aefing?r=due">Æfa á tíma (${due.length})</a>` : ''}<a class="btn small" href="#/fag/${c.id}/aefing?r=1">Allar villur (${all.length})</a></div></div>
          ${due.length ? `<ul class="wlist2">${due.map(g => row(S, c, g, now)).join('')}</ul>` : `<p class="hint">Ekkert á tíma núna.${t ? ` Næsta villa verður á tíma ${fmtWhen(t)}.` : ''}</p>`}</div>`;
      }).join('') || '<div class="panel empty">Engin villa er í bankanum núna. Athugasemdirnar þínar eru undir „Eftir merkjum“.</div>';
    } else {
      // allar villur í banka og öll atriði með athugasemd eða merki, flokkuð eftir merki
      const groups = new Map();
      for (const c of COURSES) for (const gid of Object.keys(S.items)) {
        if (!gid.startsWith(c.id + ':')) continue;
        const p = S.items[gid];
        if (!p.box && !p.note && !(p.tags && p.tags.length)) continue;
        for (const tag of p.tags && p.tags.length ? p.tags : ['']) { const g = groups.get(tag) || []; g.push([c, gid]); groups.set(tag, g); }
      }
      const order = [...groups.keys()].sort((a, b) => (a === '') - (b === '') || groups.get(b).length - groups.get(a).length || a.localeCompare(b, 'is'));
      body = order.map(tag => `<div class="panel stack" style="gap:10px"><div class="row" style="justify-content:space-between"><h3>${tag ? esc(tag) : 'Án merkja'}</h3><span class="mono hint">${groups.get(tag).length}</span></div>
        <ul class="wlist2">${groups.get(tag).map(([c, g]) => row(S, c, g, now)).join('')}</ul></div>`).join('') || '<div class="panel empty">Engin merki enn. Skrifaðu merki við villu (t.d. „gleymdi NX“) og þá birtast mynstrin hér.</div>';
    }
    const dueAll = COURSES.reduce((s, c) => s + dueIds(S, c.id, now).length, 0), bankAll = bankIds(S).length;
    if (!bankAll && !Object.values(S.items).some(p => p.note || (p.tags && p.tags.length))) {
      // tómur banki: boð, ekki tóm tafla
      const next = EXAMS.filter(x => x.at && Date.parse(x.at) > now).sort((a, b) => Date.parse(a.at) - Date.parse(b.at))[0];
      el.innerHTML = `<div class="stack">
        <h2>Villubankinn</h2>
        <div class="panel invite stack">
          <h3>Villur sem þú gerir lenda hér</h3>
          <p class="muted" style="max-width:60ch">Rangt svar fer í fyrsta hólfið og kemur aftur eftir einn dag. Svarirðu rétt færist það í næsta hólf, svo bilið lengist: 3, 7 og 16 dagar. Rétt í síðasta hólfinu og það fer út.</p>
          ${boxesHTML(S, now)}
          <div class="row"><a class="btn primary" href="${next ? `#/fag/${next.course}/aefing` : '#/fog'}">Byrja að æfa</a></div>
        </div>
      </div>`;
      return;
    }
    el.innerHTML = `<div class="stack">
      <div class="row" style="justify-content:space-between;align-items:baseline"><h2>Villubankinn</h2><span class="mono hint">${plural(bankAll, 'villa', 'villur')} · ${dueAll} á tíma</span></div>
      ${boxesHTML(S, now)}
      <p class="hint" style="max-width:66ch">Rangt svar fer í fyrsta hólfið og kemur aftur eftir 1 dag. Rétt svar þegar villan er á tíma færir hana í næsta hólf (3, 7, 16 dagar); rétt í síðasta hólfi og hún fer út. Rangt svar sendir hana aftur í fyrsta hólfið. Dæmi úr rafölum koma aftur með nýjum tölum.</p>
      <div class="seg"><button data-view="due" aria-pressed="${view === 'due'}">Á tíma núna</button><button data-view="tags" aria-pressed="${view === 'tags'}">Eftir merkjum</button></div>
      ${body}
    </div>`;
  }

  el.onclick = e => { const v = e.target.closest('[data-view]'); if (v) { view = v.dataset.view; draw(); } };
  el.oninput = e => {
    const t = e.target; const gid = t.dataset.gid; if (!gid || !S.items[gid]) return;
    const p = S.items[gid];
    if (t.matches('[data-note]')) p.note = t.value.trim() || undefined;
    if (t.matches('[data-tags]')) { const tags = t.value.split(',').map(x => x.trim()).filter(Boolean); if (tags.length) p.tags = tags; else delete p.tags; }
    store.save();
  };
  el.onchange = () => { if (view === 'tags') draw(); };
  draw();
}
