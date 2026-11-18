// Millilag fyrirlestravélarinnar (HAG106G, HAG108G): varpar BANK {id, lec, lvl, kind, from, src, q, …}
// og rafölum f(lvl) á sniðið. Fyrirlestrar í sama hópi (F7 og F8) fá auðkenni hópsins.

import { retry } from './retry.js';

const clean = o => Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined));
const SOURCE_OF = { db: 'sheet', hv: 'sheet', gl: 'slides', mid: 'old', ny: 'new' };

export function genBody(r) {
  return clean({ type: r.kind, q: r.q, o: r.o, a: r.a, ans: r.ans, tol: r.tol, unit: r.unit, prob: r.prob, e: r.e, x: r.x });
}

/** @returns {import('../../schema.js').Course} */
export default function adapt(meta, L) {
  const grp = {};
  meta.topics.forEach(t => { grp[t.id] = t.id; (t.members || []).forEach(m => { grp[m] = t.id; }); });

  const items = L.BANK.filter(q => grp[q.lec]).map(q => {
    const source = SOURCE_OF[q.from];
    const base = { id: q.id, topic: grp[q.lec], level: q.lvl, source, origin: q.from !== source ? q.from : undefined, src: q.src, q: q.q };
    const extra = { r: q.r, rtest: q.rc ? clean({ code: q.rc, expect: q.rx, rxo: q.rxo }) : undefined, x: q.x };
    if (q.kind === 'mc') return clean({ ...base, type: 'mc', o: q.o, a: q.a, e: q.e, ...extra });
    if (q.kind === 'num') return clean({ ...base, type: 'num', ans: q.ans, tol: q.tol, unit: q.unit, prob: q.prob, e: q.e, ...extra });
    if (q.kind === 'step') return clean({ ...base, type: 'steps', steps: q.steps.map(s => ({ h: s.h, body: s.e, p: s.p })), e: q.e || '', ...extra });
    if (q.kind === 'card') return clean({ ...base, type: 'card', e: q.back, keys: q.keys });
    throw new Error(`Óþekkt gerð ${q.kind}`);
  });

  const gens = L.GENS.filter(g => grp[g.lec]).map(g => clean({
    id: g.id, name: g.name, topic: grp[g.lec], levels: [1, 2, 3], r: g.r,
    f: l => genBody(retry(() => g.f(l)))
  }));

  const { extraItems = [], ...rest } = meta;   // dæmi úr src/courses/updates/ (HAG108G: gömlu prófin)
  const sheet = L.A4_HTML ? { ...meta.sheet, a4: { ...meta.sheet.a4, html: L.A4_HTML.join('') } } : meta.sheet;
  return { ...rest, sheet, items: [...items, ...extraItems], gens };
}
