// Villubankinn þvert á fög (hluti af Framvindu), í tveimur sýnum: „Á tíma núna“ (það sem á að æfa í dag) og „Eftir merkjum“
// (mynstrin í eigin villum). Við hverja villu er reiturinn „Hvað hugsaði ég vitlaust?“ og merki.

import { COURSES } from '../courses/index.js';
import { bankIds, dueIds, nextDue, isDue } from '../engine/review.js';
import { entryByGid } from '../engine/practice.js';
import { fmtWhen, plural } from '../ui/format.js';
import { esc, plain, clip } from '../ui/dom.js';

let view = 'due';

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
      }).join('') || '<div class="panel empty">Engar villur skráðar enn. Þegar þú svarar rangt lendir atriðið hér og kemur aftur eftir 1, 3, 7 og 16 daga.</div>';
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
    el.innerHTML = `<div class="stack">
      <div class="row" style="justify-content:space-between;align-items:baseline"><h2>Villubankinn</h2><span class="mono hint">${plural(bankAll, 'villa', 'villur')} · ${dueAll} á tíma</span></div>
      <p class="muted" style="max-width:66ch">Rangt svar fer í hólf 1 og kemur aftur eftir 1 dag. Rétt svar þegar villan er á tíma færir hana í næsta hólf (3, 7, 16 dagar); rétt í síðasta hólfi og hún fer út. Rangt svar sendir hana aftur í hólf 1. Dæmi úr rafölum koma aftur með nýjum tölum.</p>
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
