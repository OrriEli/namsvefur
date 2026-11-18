// Blönduð upprifjun (lota sem Í dag ræsir, #/upprifjun): tíu atriði úr öllum fögum með komandi próf, vegin eftir hve langt er síðan flokkurinn
// var æfður. Fagið og flokkurinn sjást ekki fyrr en eftir svar, svo æfingin reyni á að þekkja hvers konar
// dæmi er á ferðinni. Skrifleg dæmi og spjöld eru ekki með, því þau taka of langan tíma í tíu atriða lotu.

import { COURSES } from '../courses/index.js';
import { EXAMS } from '../config.js';
import { entriesOf, weightedPick, instantiate } from '../engine/practice.js';
import { daysSince, examFor } from '../engine/today.js';
import { plural } from '../ui/format.js';
import { esc, setFocus, dotsHTML } from '../ui/dom.js';
import { createPlayer } from './player.js';

const N = 10;
let R = null;   // lota í gangi: {queue:[{course, entry}], i, results:[{course, score, ok}], player}

/** Velur N atriði: flokkur vegin eftir dögum síðan æft (aldrei æft = 21), atriði innan flokks með venjulegu vægi. */
export function pickReview(S, now = Date.now(), rnd = Math.random) {
  const topics = [];
  for (const c of COURSES) {
    if (!examFor(c.id, EXAMS, now)) continue;
    for (const t of c.topics) {
      const es = entriesOf(c).filter(e => e.topic === t.id && e.type !== 'card' && e.type !== 'steps' && !(e.kind === 'gen' && c.engine === 'written' && !e.quick));
      if (!es.length) continue;
      const d = daysSince(c, S, t.id, now);
      topics.push({ c, es, w: (d === null ? 21 : Math.min(d, 20)) + 1 });
    }
  }
  const out = [];
  while (out.length < N && topics.length) {
    let x = rnd() * topics.reduce((s, t) => s + t.w, 0), k = topics.length - 1;
    for (let i = 0; i < topics.length; i++) { x -= topics[i].w; if (x <= 0) { k = i; break; } }
    const t = topics.splice(k, 1)[0];
    out.push({ course: t.c, entry: weightedPick(t.es, [], S, rnd) });
  }
  return out;
}

export function render({ app, store }) {
  const S = store.state;

  function start() { R = { queue: pickReview(S), i: 0, results: [], player: null }; load(); }
  function load() {
    const q = R.queue[R.i]; if (!q) { R.player = null; return; }
    R.player = createPlayer({ course: q.course, item: instantiate(q.course, q.entry), store, hideCourse: true, ...hooks() });
  }
  const hooks = () => ({
    redraw: draw,
    tally: () => '',
    onDone: (score, ok) => { R.results.push({ course: R.queue[R.i].course, score, ok }); },
    onNext: () => { if (!R.player.st.done) R.results.push({ course: R.queue[R.i].course, score: 0, ok: false, skipped: true }); R.i++; load(); draw(); window.scrollTo(0, 0); }
  });

  function summary() {
    const by = new Map();
    for (const r of R.results) { const b = by.get(r.course) || { n: 0, ok: 0 }; b.n++; if (r.ok) b.ok++; by.set(r.course, b); }
    const rows = [...by].map(([c, b]) => `<tr><td><span class="cchip" style="--cc:var(${c.color})">${c.code}</span> ${esc(c.short)}</td><td class="mono">${b.ok}/${b.n}</td></tr>`).join('');
    const ok = R.results.filter(r => r.ok).length;
    return `<div class="panel stack calm" style="gap:10px"><h2>${ok}/${R.results.length} rétt</h2><div class="scroll"><table class="tt"><tbody>${rows}</tbody></table></div>
      <div class="row"><button class="btn primary" data-act="again">Ný upprifjun</button><a class="btn" href="#/idag">Í dag</a></div></div>`;
  }

  function draw() {
    const body = R.player ? R.player.html() : summary();
    app.innerHTML = `<div class="stack focus-sheet">
      <div class="fbar">
        <a class="fback" href="#/idag">← <span>Í dag</span></a>
        <div class="ftitle"><h1>Blönduð upprifjun</h1><span class="hint">Fagið birtist þegar þú hefur svarað</span></div>
        <span class="fprog">${dotsHTML(R.results.map(r => r.ok), { total: R.queue.length, current: !!R.player })}<span class="hint mono">${Math.min(R.i + 1, R.queue.length)} af ${R.queue.length}</span></span>
      </div>
      ${R.player ? `<p class="hint" style="max-width:62ch;margin:0">${plural(R.queue.length, 'atriði', 'atriði')} úr öllum fögum, oftast úr flokkum sem langt er síðan þú æfðir. Reyndu fyrst að þekkja hvers konar dæmi þetta er.</p>` : ''}
      ${body}
    </div>`;
    if (R.player) R.player.afterDraw(app);
  }

  app.onclick = e => {
    if (R.player && R.player.click(e)) return;
    if (e.target.closest('[data-act="again"]')) { start(); draw(); }
  };
  app.oninput = e => { if (R.player) R.player.input(e); };

  setFocus(true);
  if (!R || !R.player) start(); else R.player.bind(hooks());
  draw();
  return { onKey(e) { if (R.player) R.player.key(e); } };
}
