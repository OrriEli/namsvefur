// Útflutningur og innflutningur allra gagna sem ein JSON-skrá (öryggisafrit, eða flutningur milli vafra).
// Innflutningur sameinar og skrifar ekki yfir nýrri gögn:
//   items     atriði sem vantar bætast við; ef bæði hafa atriðið gildir það sem var æft síðast (`last`)
//   sessions  sameinaðar eftir (fag, gerð, upphaf); ef sama lotan er í báðum gildir sú sem endaði síðar
//   hist      sameinuð eftir (fag, tími, heiti)
//   settings  stillingar þessa vafra halda sér; hök í áætlunum sameinast; markmið vikunnar og sjálfsmat
//             hvers fags: nýrra gildir
//   exams, block  próf og blokk í gangi í þessum vafra halda sér

import { migrate, VERSION } from './store.js';

export function exportState(state, now = Date.now()) {
  return JSON.stringify({ app: 'namsvefur', v: VERSION, exported: now, state }, null, 1);
}

/** Les útfluttu skrána. Tekur líka við hreinu ástandi (eins og það er í vafrageymslu). */
export function parseBackup(text) {
  let v;
  try { v = JSON.parse(text); } catch (e) { throw new Error('Skráin er ekki gilt JSON.'); }
  const s = v && v.app === 'namsvefur' ? v.state : v;
  if (!s || typeof s !== 'object' || typeof s.items !== 'object') throw new Error('Þetta er ekki útflutningur úr námsvefnum.');
  return migrate(s);
}

/** Sameinar `b` inn í `a` (breytir `a`). Skilar samantekt. */
export function mergeStates(a, b) {
  const sum = { items: 0, updated: 0, sessions: 0, hist: 0 };
  for (const [gid, p] of Object.entries(b.items || {})) {
    const q = a.items[gid];
    if (!q) { a.items[gid] = p; sum.items++; }
    else if ((p.last || 0) > (q.last || 0)) { a.items[gid] = p; sum.updated++; }
  }
  const sk = s => `${s.course}|${s.kind}|${s.start}`;
  const have = new Map(a.sessions.map(s => [sk(s), s]));
  for (const s of b.sessions || []) {
    const t = have.get(sk(s));
    if (!t) { a.sessions.push(s); have.set(sk(s), s); sum.sessions++; }
    else if (s.end > t.end) Object.assign(t, s);
  }
  a.sessions.sort((x, y) => x.start - y.start);
  const hk = h => `${h.course}|${h.at}|${h.label}`;
  const hh = new Set(a.hist.map(hk));
  for (const h of b.hist || []) if (!hh.has(hk(h))) { a.hist.push(h); hh.add(hk(h)); sum.hist++; }
  a.hist.sort((x, y) => x.at - y.at);
  const bs = b.settings || {};
  for (const [c, p] of Object.entries(bs.plan || {})) {
    const mine = a.settings.plan[c] || (a.settings.plan[c] = { done: {} });
    for (const [k, v] of Object.entries(p.done || {})) if (v) mine.done[k] = true;
  }
  for (const k of ['adapt', 'imported']) for (const [c, v] of Object.entries(bs[k] || {})) if (!a.settings[k][c]) a.settings[k][c] = v;
  if (bs.weekGoal && (!a.settings.weekGoal || bs.weekGoal.at > a.settings.weekGoal.at)) a.settings.weekGoal = bs.weekGoal;
  for (const [c, v] of Object.entries(bs.self || {})) { const mine = a.settings.self[c]; if (!mine || (v.ts || 0) > (mine.ts || 0)) a.settings.self[c] = v; }
  return sum;
}
