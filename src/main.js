// Ræsing og leiðsögn. Slóðir: #/fog, #/fag/<id>[/aefing|/prof|/bladid|/aaetlun][?…], #/villur, #/stillingar

import './ui/base.css';
import './ui/legacy.css';
import 'katex/dist/katex.min.css';
import './ui/styles.css';
import renderMathInElement from 'katex/contrib/auto-render';
import { createStore } from './store/store.js';
import { courseById } from './courses/index.js';
import { bankIds } from './engine/review.js';
import { $, setTopH } from './ui/dom.js';
import * as coursesView from './views/courses.js';
import * as courseView from './views/course.js';
import * as wrongView from './views/wrong.js';
import * as settingsView from './views/settings.js';

const store = createStore();
let current = null;

const NAV = [
  { href: '#/fog', label: 'Fög', match: p => !p[0] || p[0] === 'fog' || p[0] === 'fag' },
  { href: '#/villur', label: 'Villur', match: p => p[0] === 'villur', pill: true },
  { href: '#/stillingar', label: 'Stillingar', match: p => p[0] === 'stillingar' }
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
  else if (parts[0] === 'stillingar') current = settingsView.render(ctx);
  else current = coursesView.render(ctx);
  renderNav(parts);
  setTopH();
  window.scrollTo(0, 0);
}

// Stærðfræði: KaTeX teiknar \( \) og \[ \] í hvert sinn sem #app breytist (eins og í HAG108G).
const MATHOPT = {
  delimiters: [{ left: '\\[', right: '\\]', display: true }, { left: '\\(', right: '\\)', display: false }],
  ignoredTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code', 'option'], throwOnError: false,
  // Nokkur dæmi í HAG101G skrifa prím sem \' (t.d. f\'\'(1)); það er ógilt TeX svo það er skilgreint hér sem prím.
  macros: { "\\'": "'" }
};
const app = $('#app');
let queued = false;
const mathObs = new MutationObserver(() => {
  if (queued) return; queued = true;
  queueMicrotask(() => { queued = false; mathObs.disconnect(); try { renderMathInElement(app, MATHOPT); } catch (e) { console.warn(e); } mathObs.observe(app, { childList: true, subtree: true }); });
});
mathObs.observe(app, { childList: true, subtree: true });

store.onChange(() => renderNav(parse().parts));
window.addEventListener('hashchange', route);
window.addEventListener('resize', setTopH);
document.addEventListener('keydown', e => {
  if (e.target.matches('input, textarea, select') || e.metaKey || e.ctrlKey || e.altKey) return;
  if (current && current.onKey) current.onKey(e);
});
route();
