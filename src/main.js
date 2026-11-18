// Ræsing og leiðsögn. Slóðir: #/idag, #/fog[?q=…], #/fag/<id>[/aefing|/prof|/bladid|/aaetlun][?…],
// #/framvinda[/villur|/vikan], #/upprifjun (lota sem Í dag ræsir), #/stillingar.
// Gamlar slóðir vísa áfram: #/villur og #/vikan → #/framvinda/…, #/bladin og #/blodin[?q=] → #/fog[?q=].

// Letur sett upp á vélinni (@fontsource), svo vefurinn virki án nets. Röðin skiptir máli: tokens.css kemur
// á eftir base.css og legacy.css og tengir gömlu breytuheitin þeirra við tókana.
import '@fontsource-variable/newsreader/opsz.css';
import '@fontsource-variable/source-sans-3';
import './ui/base.css';
import './ui/legacy.css';
import 'katex/dist/katex.min.css';
import './ui/tokens.css';
import './ui/styles.css';
import renderMathInElement from 'katex/contrib/auto-render';
import { createStore } from './store/store.js';
import { courseById } from './courses/index.js';
import { $, setTopH } from './ui/dom.js';
import * as coursesView from './views/courses.js';
import * as courseView from './views/course.js';
import * as progressView from './views/progress.js';
import * as settingsView from './views/settings.js';
import * as todayView from './views/today.js';
import * as reviewView from './views/upprifjun.js';
import { barHTML, barKey, clockText, advanceByTime, nextSegment, startSecond } from './views/block.js';
import { dueIds } from './engine/review.js';
import { COURSES } from './courses/index.js';
import { redirect } from './routes.js';

const store = createStore();

/** Ljóst, dökkt eða sjálfvirkt (eftir kerfinu), úr Stillingum. */
function applyTheme() {
  const t = store.state.settings.prefs.theme;
  if (t === 'light' || t === 'dark') document.documentElement.dataset.theme = t; else delete document.documentElement.dataset.theme;
}
applyTheme();
let current = null;

// Þrír staðir og tannhjól fyrir Stillingar. Upprifjun er lota sem Í dag ræsir; hún telst til Í dag.
const GEAR = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>';
const NAV = [
  { href: '#/idag', label: 'Í dag', match: p => !p[0] || p[0] === 'idag' || p[0] === 'upprifjun' },
  { href: '#/fog', label: 'Fög', match: p => p[0] === 'fog' || p[0] === 'fag' },
  { href: '#/framvinda', label: 'Framvinda', match: p => p[0] === 'framvinda', pill: true },
  { href: '#/stillingar', label: GEAR, aria: 'Stillingar', cls: 'gear', match: p => p[0] === 'stillingar' }
];

function parse() {
  const [path, qs] = location.hash.replace(/^#\/?/, '').split('?');
  return { parts: path.split('/').filter(Boolean), query: new URLSearchParams(qs || '') };
}

function renderNav(parts) {
  const n = COURSES.reduce((s, c) => s + dueIds(store.state, c.id).length, 0);   // villur á tíma
  $('#nav').innerHTML = NAV.map(x => `<a href="${x.href}" ${x.cls ? `class="${x.cls}"` : ''} ${x.aria ? `aria-label="${x.aria}" title="${x.aria}"` : ''} ${x.match(parts) ? 'aria-current="page"' : ''}>${x.label}${x.pill && n ? `<span class="pill" aria-label="${n} á tíma">${n}</span>` : ''}</a>`).join('');
  // Á mjóum skjá er valmyndin ein lína sem skrunast; virki tengillinn er hafður sýnilegur.
  const nav = $('#nav'), cur = nav.querySelector('[aria-current]');
  if (cur && nav.scrollWidth > nav.clientWidth) {
    const l = cur.offsetLeft - nav.offsetLeft, r = l + cur.offsetWidth;
    if (l < nav.scrollLeft + 24 || r > nav.scrollLeft + nav.clientWidth - 24) nav.scrollLeft = Math.max(0, l - (nav.clientWidth - cur.offsetWidth) / 2);
  }
}

function route() {
  const to = redirect(location.hash);
  if (to) history.replaceState(null, '', to);
  if (current && current.cleanup) current.cleanup();
  const { parts, query } = parse();
  const app = $('#app');
  app.onclick = app.onchange = app.oninput = null;
  const ctx = { app, store, query, go: h => { location.hash = h; } };
  const course = parts[0] === 'fag' ? courseById(parts[1]) : null;
  if (course) current = courseView.render({ ...ctx, course, tab: parts[2] || 'yfirlit' });
  else if (parts[0] === 'framvinda') current = progressView.render({ ...ctx, anchor: parts[1] });
  else if (parts[0] === 'stillingar') current = settingsView.render(ctx);
  else if (parts[0] === 'upprifjun') current = reviewView.render(ctx);
  else if (parts[0] === 'fog') current = coursesView.render(ctx);
  else current = todayView.render(ctx);
  renderNav(parts);
  renderBar();
  setTopH();
  window.scrollTo(0, 0);
}

// Lærdómsblokk í gangi: stika undir efstu stiku, uppfærð á sekúndu fresti.
// Stikan er aðeins teiknuð upp á nýtt þegar áfangi eða liður breytist, svo smellir á hnappana tapist ekki;
// klukkan ein er uppfærð á sekúndu fresti.
let barShown = null;
function renderBar() {
  const el = $('#blockbar'); const key = barKey(store.state);
  if (key !== barShown) { barShown = key; el.innerHTML = barHTML(store.state); el.hidden = !key; setTopH(); }
  const clk = el.querySelector('[data-clock]'); if (clk) clk.textContent = clockText(store.state);
}
setInterval(() => { if (!store.state.block) return; advanceByTime(store); renderBar(); }, 1000);
$('#blockbar').addEventListener('click', e => {
  const b = e.target.closest('[data-blk]'); if (!b) return;
  const act = b.dataset.blk;
  if (act === 'next') { const h = nextSegment(store); if (h) location.hash = h; }
  if (act === 'second') { const h = startSecond(store); if (h) location.hash = h; }
  if (act === 'end') { delete store.state.block; store.save(); }
  renderBar(); setTopH();
});

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

store.onChange(() => { applyTheme(); renderNav(parse().parts); renderBar(); });
window.addEventListener('hashchange', route);
window.addEventListener('resize', setTopH);
document.addEventListener('keydown', e => {
  if (e.target.matches('input, textarea, select') || e.metaKey || e.ctrlKey || e.altKey) return;
  if (current && current.onKey) current.onKey(e);
});
route();
