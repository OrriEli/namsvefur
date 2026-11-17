// Innflutningur gömlu sögunnar. Hver gamla síða geymir framvindu sína undir eigin lykli í vafrageymslu
// og nýi vefurinn getur ekki lesið hana beint, svo Orri afritar gildið úr þróunartólum vafrans og límir það inn.
//
// Vörpun (sjá docs/schema.md):
//   st[k] = {n, c, s}       → items['<fag>:k'] = {n, c, streak: s}          (103, 106, 107, 108; 101 hraðspurningar í qs)
//   st[k] = {n, p, m}       → items['<fag>:k'] = {n, c: n·p/m, p, m, streak: 0}   (101 skrifleg dæmi)
//   wrong[k]                → í villubanka, hólf 1, á tíma strax; hits = wrong[k] (rétt í röð síðan)
//   cards[id] = {seen, again} → items['<fag>:id'] = {n: seen, again}         (106, 108)
//   hist[]                  → state.hist (merkt legacy), adapt → stigvaxandi stig
// Innflutningur má endurtaka: hlutur gömlu síðunnar í n og c er geymdur í `imp` og skipt út, ekki lagður við.
// Ef atriði hefur verið æft á nýja vefnum ræður nýja staðan streak, villubanka og „sýna aftur“.

import { entriesOf } from '../engine/practice.js';

/** Geymslulyklar gömlu síðnanna, nýjasti fyrst. */
export const LEGACY_KEYS = {
  hag101g: ['hag101g-lokaprof-v1', 'hag101g-midannar-v1'],
  hag103g: ['hag103g-hlutaprof-v1'],
  hag106g: ['hag106g-profaefing-v1'],
  hag107g: ['hag107g-lokaprof-v1', 'hag107g-kaflaprof3-v1'],
  hag108g: ['hag108g-profaefing-v1']
};

/** Skipunin sem Orri keyrir í Console gömlu síðunnar: afritar vistunina á klemmuspjaldið. */
export const consoleCommand = id => `copy(${LEGACY_KEYS[id].map(k => `localStorage.getItem('${k}')`).join(' || ')})`;

/** Les límdan texta. Tekur við hráu gildi lykilsins eða {lykill: gildi} (t.d. úr Application-flipanum). */
export function parseLegacy(text, id) {
  let v;
  try { v = JSON.parse(String(text).trim()); } catch (e) { throw new Error('Þetta er ekki gilt JSON. Afritaðu allt gildið, frá { til }.'); }
  if (typeof v === 'string') { try { v = JSON.parse(v); } catch (e) { throw new Error('Þetta er ekki gilt JSON.'); } }
  if (v && typeof v === 'object' && !v.st && !v.wrong) {
    const k = LEGACY_KEYS[id].find(key => key in v);
    if (k) return parseLegacy(typeof v[k] === 'string' ? v[k] : JSON.stringify(v[k]), id);
  }
  if (!v || typeof v !== 'object' || (!v.st && !v.wrong && !v.qs)) throw new Error('Þetta lítur ekki út eins og vistun úr gömlu síðunni (vantar st og wrong).');
  return v;
}

const num = x => (typeof x === 'number' && Number.isFinite(x) ? x : 0);

/**
 * Flytur vistun gömlu síðunnar `old` inn í `state` fyrir fagið `course`. Skilar samantekt.
 * @returns {{items:number, bank:number, hist:number, cards:number, skipped:number}}
 */
export function importLegacy(state, course, old, { now = Date.now(), key = '' } = {}) {
  const known = new Set(entriesOf(course).map(e => e.key));
  const sum = { items: 0, bank: 0, hist: 0, cards: 0, skipped: 0 };
  const wrong = old.wrong || {};

  // Uppfærir eitt atriði með hlut gömlu síðunnar (pts/max: stig skriflegs dæmis í HAG101G).
  function apply(k, n, c, streak, pts) {
    if (!known.has(k)) { sum.skipped++; return null; }
    const gid = `${course.id}:${k}`;
    const p = state.items[gid] || (state.items[gid] = { n: 0, c: 0, streak: 0 });
    const prev = p.imp || { n: 0, c: 0 };
    const fresh = p.n - prev.n <= 0;                 // ekkert æft á nýja vefnum
    p.n += n - prev.n; p.c += c - prev.c; p.imp = { n, c };
    if (pts) { p.p = (p.p || 0) + pts.p - (prev.p || 0); p.m = (p.m || 0) + pts.m - (prev.m || 0); p.imp.p = pts.p; p.imp.m = pts.m; }
    if (fresh) {
      p.streak = streak;
      if (k in wrong) { p.box = 1; p.due = now; p.hits = num(wrong[k]); } else { delete p.box; delete p.due; delete p.hits; }
    }
    if (p.n <= 0 && !p.box && !p.again) delete state.items[gid];
    return p;
  }

  for (const [k, r] of Object.entries(old.st || {})) {
    const n = num(r.n);
    const c = r.m !== undefined ? (num(r.m) ? n * num(r.p) / num(r.m) : 0) : num(r.c);
    if (apply(k, n, c, r.m !== undefined ? 0 : num(r.s), r.m !== undefined ? { p: num(r.p), m: num(r.m) } : undefined)) sum.items++;
  }
  for (const [k, r] of Object.entries(old.qs || {})) if (apply(k, num(r.n), num(r.c), num(r.s))) sum.items++;
  // Atriði í villubankanum sem voru aldrei skráð í st (t.d. ósvarað í prófi á eldri síðu).
  for (const k of Object.keys(wrong)) if (!(k in (old.st || {})) && !(k in (old.qs || {})) && apply(k, 0, 0, 0)) sum.items++;

  for (const [id, r] of Object.entries(old.cards || {})) {
    if (!known.has(id)) { sum.skipped++; continue; }
    const gid = `${course.id}:${id}`;
    const p = state.items[gid] || (state.items[gid] = { n: 0, c: 0, streak: 0 });
    const prev = p.imp || { n: 0, c: 0 };
    const fresh = p.n - prev.n <= 0;
    p.n += num(r.seen) - prev.n; p.imp = { n: num(r.seen), c: 0 };
    if (fresh) { if (r.again) p.again = true; else delete p.again; }
    sum.cards++;
  }

  for (const k in state.items) { const p = state.items[k]; if (k.startsWith(course.id + ':') && p.box) sum.bank++; }

  for (const h of old.hist || []) {
    if (!h || !h.at || state.hist.some(x => x.course === course.id && x.at === h.at && x.label === h.label)) continue;
    let score, max;
    if (h.pct !== undefined) { score = num(h.pct) * 10; max = 10; }
    else if (h.tot !== undefined) { score = num(h.score); max = num(h.tot); }
    else { score = num(h.pts ?? h.c); max = num(h.max ?? h.n); }
    state.hist.push({ course: course.id, format: 'legacy', label: h.label, at: h.at, used: 0, n: num(h.n), score, max, timeout: false, legacy: true });
    sum.hist++;
  }
  state.hist.sort((a, b) => a.at - b.at);

  if (old.adapt && !state.settings.adapt[course.id]) state.settings.adapt[course.id] = { lvl: old.adapt.lvl || 1, up: num(old.adapt.up), down: num(old.adapt.down), msg: '' };

  state.settings.imported[course.id] = { at: now, key, ...sum };
  return sum;
}
