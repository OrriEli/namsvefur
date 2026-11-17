// Blaðið: orðrétt HTML gömlu síðunnar, samsett úr köflum. HAG106G hefur líka A4-formúlublað til að prenta.
// Tenglar í Blaði HAG101G (data-toc, data-sgo, data-sq, data-exam) opna kafla, æfingu, hraðæfingu eða próf.
// ?k=<kafli> skrunar að kafla.

const tabs = new Map();   // valinn flipi (listi eða A4) hvers fags

export function render({ el, course: c, query, go }) {
  const sh = c.sheet;
  const tab = sh.a4 ? tabs.get(c.id) || 'list' : 'list';
  const seg = sh.a4 ? `<div class="row" style="justify-content:space-between;gap:10px"><div class="seg" role="tablist">${[['list', 'Yfirlit'], ['a4', 'A4 formúlublað']].map(([k, v]) => `<button data-tab="${k}" aria-pressed="${tab === k}">${v}</button>`).join('')}</div>${tab === 'a4' ? '<button class="btn small" data-act="print">Prenta / vista PDF</button>' : ''}</div>` : '';
  if (tab === 'a4') el.innerHTML = `<div class="sheet a4mode">${sh.a4.head}${seg}<div class="a4wrap">${sh.a4.html}</div></div>`;
  else {
    el.innerHTML = `<div class="sheet">${sh.head}${sh.sections.map(s => s.html).join('\n\n')}${sh.foot || ''}</div>`;
    if (seg) el.querySelector('.sheet > .stack').insertAdjacentHTML('afterend', seg);
    el.querySelectorAll('.sheet > section').forEach((node, i) => { if (!node.id) node.id = sh.sections[i].id; });
  }
  const k = query.get('k');
  if (k) { const node = el.querySelector('#' + CSS.escape(k)); if (node) setTimeout(() => node.scrollIntoView({ block: 'start' }), 50); }

  el.onclick = e => {
    const t = e.target.closest('[data-tab]'); if (t) { tabs.set(c.id, t.dataset.tab); return render({ el, course: c, query: new URLSearchParams(), go }); }
    if (e.target.closest('[data-act="print"]')) return window.print();
    const toc = e.target.closest('[data-toc]'); if (toc) { const node = el.querySelector('#' + CSS.escape(toc.dataset.toc)); if (node) node.scrollIntoView({ block: 'start', behavior: 'smooth' }); return; }
    const sgo = e.target.closest('[data-sgo]'); if (sgo) { const kind = sgo.dataset.kind; return go(`#/fag/${c.id}/aefing?m=written&t=${sgo.dataset.sgo}${kind && kind !== 'all' ? '&s=' + ({ blad: 'sheet' }[kind] || kind) : ''}`); }
    const sq = e.target.closest('[data-sq]'); if (sq) return go(`#/fag/${c.id}/aefing?m=quick${sq.dataset.sq === 'all' ? '' : '&t=' + sq.dataset.sq}`);
    const x = e.target.closest('[data-exam]'); if (x) return go(`#/fag/${c.id}/prof?start=${x.dataset.exam}`);
  };
}
