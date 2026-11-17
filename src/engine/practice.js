// Æfingapotturinn: færslur (föst atriði og rafalar), hættir, vegið úrtak, tilvik og staða eftir flokkum.
// Vélin veit ekki úr hvaða fagi færsla kemur; hún les aðeins Course-hlutinn.

import { inBank } from './review.js';

/** @typedef {Object} Entry
 *  @property {string} gid         alþjóðlegt auðkenni, 'hag103g:H25-1', 'hag106g:g-ev@2', 'hag101g:q:g-mul'
 *  @property {string} key         auðkenni innan fags, eins og í gömlu geymslunni
 *  @property {string} course
 *  @property {string} topic
 *  @property {number} [level]
 *  @property {import('../schema.js').Source} source
 *  @property {'item'|'gen'} kind
 *  @property {string} type         gerð fasts atriðis; 'gen' fyrir rafal
 *  @property {string[]} [types]    gerðir sem rafall getur skilað
 *  @property {boolean} quick
 *  @property {boolean} r           R-spurning (HAG108G)
 *  @property {number} [points]     heildarstig skrefadæmis
 */

const cache = new WeakMap();

/** Allar færslur fags. Rafall með stigum verður ein færsla á hvert stig. @returns {Entry[]} */
export function entriesOf(course) {
  if (cache.has(course)) return cache.get(course);
  const items = course.items.map(it => ({ gid: `${course.id}:${it.id}`, key: it.id, course: course.id, topic: it.topic, level: it.level, source: it.source, kind: 'item', type: it.type,
    quick: !!it.quick, r: !!it.r, points: it.steps ? it.steps.reduce((s, x) => s + x.p, 0) : undefined }));
  const gens = course.gens.flatMap(g => (g.levels || [undefined]).map(l => {
    const key = l === undefined ? g.id : `${g.id}@${l}`;
    return { gid: `${course.id}:${key}`, key, course: course.id, topic: g.topic, level: l, source: 'gen', kind: 'gen', type: 'gen', types: g.types,
      quick: !!g.quick, r: g.r === true || (Array.isArray(g.r) && g.r.includes(l)) };
  }));
  const list = [...items, ...gens];
  cache.set(course, list);
  return list;
}

export const entryByGid = (course, gid) => entriesOf(course).find(e => e.gid === gid);

/** Á færslan heima í æfingahættinum? Spjöld eru aðeins í spjaldahætti; HAG101G skiptir í skrifleg og hraðspurningar. */
export function inMode(e, mode) {
  if (mode && mode.cards) return e.type === 'card';
  if (e.type === 'card') return false;
  if (mode && mode.quick !== undefined) return e.quick === mode.quick;
  return true;
}

export const modeOf = (course, id) => (course.modes || []).find(m => m.id === id) || (course.modes || [])[0] || null;

// Vægi í úrtaki: í villubanka 5, rafall 2, ósnert 3, náð tvisvar í röð 0,25, annars 1.
export function weight(e, state) {
  const p = state.items[e.gid];
  if (inBank(p)) return 5;
  if (e.kind === 'gen') return 2;
  if (!p) return 3;
  return p.streak >= 2 ? 0.25 : 1;
}

// Spjöld: merkt „sýna aftur“ 4, ósnert 3, séð 1 (eins og á gömlu síðunum).
export const cardWeight = (e, state) => { const p = state.items[e.gid]; return p && p.again ? 4 : p ? 1 : 3; };

/** Vegið úrtak úr `list`, framhjá gid-um í `avoid` ef hægt er. */
export function weightedPick(list, avoid, state, rnd = Math.random, w = weight) {
  const pool = list.filter(e => !avoid.includes(e.gid));
  const use = pool.length ? pool : list;
  const tot = use.reduce((s, e) => s + w(e, state), 0);
  let x = rnd() * tot;
  for (const e of use) { x -= w(e, state); if (x <= 0) return e; }
  return use[use.length - 1];
}

export function shuffle(a, rnd = Math.random) {
  a = a.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

/** Býr til tilvik færslu: fast atriði eða ný keyrsla rafals. Valkostum og (óröðuðum) pörunarröðum er stokkað. */
export function instantiate(course, e, rnd = Math.random) {
  let b;
  if (e.kind === 'gen') {
    const at = e.key.lastIndexOf('@');
    const id = at > 0 ? e.key.slice(0, at) : e.key, l = at > 0 ? +e.key.slice(at + 1) : undefined;
    const g = course.gens.find(x => x.id === id);
    b = { ...g.f(l), id: g.id, gid: e.gid, key: e.key, topic: g.topic, level: e.level, source: 'gen', quick: !!g.quick, src: `${course.genLabel || 'Rafall'} · ${g.name}` };
  } else {
    b = { ...course.items.find(x => x.id === e.key), gid: e.gid, key: e.key };
  }
  if (b.type === 'mc' || b.type === 'multi') {
    const idx = shuffle(b.o.map((_, i) => i), rnd);
    b = { ...b, o: idx.map(i => b.o[i]), a: b.type === 'mc' ? idx.indexOf(b.a) : b.a.map(x => idx.indexOf(x)).sort((x, y) => x - y) };
  }
  if (b.type === 'match' && !b.ord) b = { ...b, rows: shuffle(b.rows, rnd) };
  return b;
}

/** Staða flokks: tilraunir, rétt, hve margar færslur hafa sést og hlutfall réttra. Spjöld teljast ekki með. */
export function topicStats(course, state, topic, filter = e => e.type !== 'card', level) {
  let n = 0, c = 0, seen = 0, total = 0;
  for (const e of entriesOf(course)) {
    if (e.topic !== topic || !filter(e) || (level !== undefined && e.level !== level)) continue;
    total++;
    const p = state.items[e.gid];
    if (p) { n += p.n; c += p.c; seen++; }
  }
  return { n, c, seen, total, pct: n ? c / n : null };
}

/** k veikustu flokkarnir (upprifjunarflokkar undanskildir), ósnertir taldir 50%. */
export function weakest(course, state, k = 2, filter) {
  return course.topics.filter(t => !t.review).map(t => ({ t: t.id, s: topicStats(course, state, t.id, filter) }))
    .sort((a, b) => ((a.s.pct ?? 0.5) - (b.s.pct ?? 0.5)) || (a.s.n - b.s.n)).slice(0, k).map(x => x.t);
}

/** Heiti uppruna í síum fags. */
export function sourceLabel(course, source, defaults) {
  return (course.sourceLabels && course.sourceLabels[source]) || defaults[source];
}
