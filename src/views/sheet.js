// Blaðið: orðrétt HTML gömlu síðunnar, samsett úr köflum. HAG106G hefur líka A4-formúlublað til að prenta.
// Tenglar í Blaði HAG101G (data-toc, data-sgo, data-sq, data-exam) opna kafla, æfingu, hraðæfingu eða próf.
// ?k=<kafli> skrunar að kafla. Í fagi með sjálfsmati (HAG101G) fær hver kafli sem tilheyrir flokki reit fyrir
// mat 0–10 í fyrirsögninni; það vistast strax (engine/self.js).

import { hasSelf, selfOf, setSelf, selfCls } from '../engine/self.js';

const tabs = new Map();   // valinn flipi (listi eða A4) hvers fags

function colorSelf(lab, v) { lab.classList.remove('lo', 'mid', 'hi'); const k = selfCls(v); if (k) lab.classList.add(k); }

export function render({ el, course: c, query, go, store }) {
  const sh = c.sheet;
  const tab = sh.a4 ? tabs.get(c.id) || 'list' : 'list';
  const seg = sh.a4 ? `<div class="row" style="justify-content:space-between;gap:10px"><div class="seg" role="tablist">${[['list', 'Yfirlit'], ['a4', 'A4 formúlublað']].map(([k, v]) => `<button data-tab="${k}" aria-pressed="${tab === k}">${v}</button>`).join('')}</div>${tab === 'a4' ? '<button class="btn small" data-act="print">Prenta / vista PDF</button>' : ''}</div>` : '';
  if (tab === 'a4') el.innerHTML = `<div class="sheet a4mode">${sh.a4.head}${seg}<div class="a4wrap">${sh.a4.html}</div></div>`;
  else {
    el.innerHTML = `<div class="sheet">${sh.head}${sh.sections.map(s => s.html).join('\n\n')}${sh.foot || ''}</div>`;
    if (seg) el.querySelector('.sheet > .stack').insertAdjacentHTML('afterend', seg);
    el.querySelectorAll('.sheet > section').forEach((node, i) => { if (!node.id) node.id = sh.sections[i].id; });
    if (hasSelf(c)) {
      const mine = selfOf(c, store.state).v;
      el.querySelectorAll('.sheet > section').forEach(sec => {
        const n = +sec.id.slice(1); if (!c.self.sections[n]) return;
        const v = mine[n], h = sec.querySelector('h2'); if (!h) return;
        const lab = document.createElement('label'); lab.className = 'selfr';
        lab.innerHTML = `<span>Mat</span><input type="number" id="self-${n}" data-self="${n}" min="0" max="10" step="0.5" inputmode="decimal" value="${v ?? ''}" aria-label="Sjálfsmat á kafla ${n}, 0 til 10"><span>/10</span>`;
        const g = h.querySelector('.go'); if (g) h.insertBefore(lab, g); else h.appendChild(lab);
        colorSelf(lab, v);
      });
    }
  }
  const k = query.get('k');
  if (k) { const node = el.querySelector('#' + CSS.escape(k)); if (node) setTimeout(() => node.scrollIntoView({ block: 'start' }), 50); }

  el.oninput = e => {
    const n = e.target.dataset.self; if (!n || !hasSelf(c)) return;
    const v = setSelf(c, store.state, n, e.target.value === '' ? null : e.target.value);
    store.save(); colorSelf(e.target.parentNode, v);
  };
  el.onclick = e => {
    const t = e.target.closest('[data-tab]'); if (t) { tabs.set(c.id, t.dataset.tab); return render({ el, course: c, query: new URLSearchParams(), go, store }); }
    if (e.target.closest('[data-act="print"]')) return window.print();
    const toc = e.target.closest('[data-toc]'); if (toc) { const node = el.querySelector('#' + CSS.escape(toc.dataset.toc)); if (node) node.scrollIntoView({ block: 'start', behavior: 'auto' }); return; }
    const sgo = e.target.closest('[data-sgo]'); if (sgo) { const kind = sgo.dataset.kind; return go(`#/fag/${c.id}/aefing?m=written&t=${sgo.dataset.sgo}${kind && kind !== 'all' ? '&s=' + ({ blad: 'sheet' }[kind] || kind) : ''}`); }
    const sq = e.target.closest('[data-sq]'); if (sq) return go(`#/fag/${c.id}/aefing?m=quick${sq.dataset.sq === 'all' ? '' : '&t=' + sq.dataset.sq}`);
    const x = e.target.closest('[data-exam]'); if (x) return go(`#/fag/${c.id}/prof?start=${x.dataset.exam}`);
  };
}
