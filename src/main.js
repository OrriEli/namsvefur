// Ræsing og leiðsögn. Slóðir: #/fog, #/fag/<id>[/aefing|/prof|/bladid|/aaetlun][?…], #/villur

import './ui/styles.css';
import { createStore } from './store/store.js';
import { courseById } from './courses/index.js';
import { bankIds } from './engine/review.js';
import { $, setTopH } from './ui/dom.js';
import * as coursesView from './views/courses.js';
import * as courseView from './views/course.js';
import * as wrongView from './views/wrong.js';

const store = createStore();
let current = null;

const NAV = [
  { href: '#/fog', label: 'Fög', match: p => !p[0] || p[0] === 'fog' || p[0] === 'fag' },
  { href: '#/villur', label: 'Villur', match: p => p[0] === 'villur', pill: true }
];

function parse() {
  const [path, qs] = location.hash.replace(/^#\/?/, '').split('?');
  return { parts: path.split('/').filter(Boolean), query: new URLSearchParams(qs || '') };
}

function renderNav(parts) {
  const n = bankIds(store.state).length;
  $('#nav').innerHTML = NAV.map(x => `<a href="${x.href}" ${x.match(parts) ? 'aria-current="page"' : ''}>${x.label}${x.pill && n ? `<span class="pill">${n}</span>` : ''}</a>`).join('');
}

function route() {
  if (current && current.cleanup) current.cleanup();
  const { parts, query } = parse();
  const app = $('#app');
  app.onclick = app.onchange = app.oninput = null;
  const ctx = { app, store, query, go: h => { location.hash = h; } };
  const course = parts[0] === 'fag' ? courseById(parts[1]) : null;
  if (course) current = courseView.render({ ...ctx, course, tab: parts[2] || 'yfirlit' });
  else if (parts[0] === 'villur') current = wrongView.render(ctx);
  else current = coursesView.render(ctx);
  renderNav(parts);
  setTopH();
  window.scrollTo(0, 0);
}

store.onChange(() => renderNav(parse().parts));
window.addEventListener('hashchange', route);
window.addEventListener('resize', setTopH);
document.addEventListener('keydown', e => {
  if (e.target.matches('input, textarea, select') || e.metaKey || e.ctrlKey || e.altKey) return;
  if (current && current.onKey) current.onKey(e);
});
route();
