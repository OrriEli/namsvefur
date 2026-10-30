// Blaðið: orðrétt HTML gömlu síðunnar, samsett úr köflum. ?k=<kafli> skrunar að kafla.

export function render({ el, course: c, query }) {
  const sh = c.sheet;
  el.innerHTML = `<div class="sheet">${sh.head}${sh.sections.map(s => s.html).join('\n\n')}${sh.foot || ''}</div>`;
  el.querySelectorAll('.sheet > section').forEach((node, i) => { if (!node.id) node.id = sh.sections[i].id; });
  const k = query.get('k');
  if (k) { const node = el.querySelector('#' + CSS.escape(k)); if (node) setTimeout(() => node.scrollIntoView({ block: 'start' }), 50); }
}
