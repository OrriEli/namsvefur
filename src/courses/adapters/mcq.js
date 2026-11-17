// Millilag krossavélarinnar (HAG103G, HAG107G): varpar gömlu atriðunum {id, t, src, q, o, a, e, ty?, …}
// og rafölunum á sniðið. HAG107G hefur gerðirnar kross, „veldu allt“ (multi), pörun (match) og tölusvar með liðum.

import { retry } from './retry.js';

const clean = o => Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined));

// Stig eftir gerð, eins og maxPts() í HAG107G.
const maxPts = q => q.pts || (!q.ty || q.ty === 'mc' ? 2 : q.ty === 'multi' ? 3 : q.ty === 'match' ? Math.max(2, Math.ceil(q.rows.length / 2)) : 2 * q.p.length);

// Vikmörk tölusvars í HAG107G þegar liður gefur þau ekki: 0,6% af svarinu, minnst 0,011.
const partTol = p => p.tol ?? Math.max(0.011, Math.abs(p.a) * 0.006);

export function body(q, points) {
  const ty = q.ty || 'mc';
  const pts = points === 'type' ? maxPts(q) : q.pts;
  if (ty === 'mc') return clean({ type: 'mc', q: q.q, o: q.o, a: q.a, e: q.e, pts });
  if (ty === 'multi') return clean({ type: 'multi', q: q.q, o: q.o, a: q.a, e: q.e, pts });
  if (ty === 'match') return clean({ type: 'match', q: q.q, rows: q.rows, cols: q.cols, ord: q.ord, e: q.e, pts });
  if (ty === 'num') return clean({ type: 'num', q: q.q, parts: q.p.map(p => clean({ l: p.l, ans: p.a, tol: partTol(p) })), e: q.e, pts });
  throw new Error(`Óþekkt gerð ${ty}`);
}

/** @returns {import('../../schema.js').Course} */
export default function adapt(meta, L) {
  const oldItems = [...L.OLD, ...(L.OLD2 || [])];
  const newItems = [...L.NEW, ...(L.NEW2 || [])];
  const item = (q, source, src) => ({ id: q.id, topic: q.t, source, src, ...body(q, meta.points) });
  const items = [
    ...oldItems.map(q => item(q, 'old', q.src)),
    ...newItems.map(q => item(q, 'new', q.src ? meta.newSrc.prefix + q.src : meta.newSrc.fallback))
  ];
  const gens = [...L.GENS, ...(L.GENS2 || [])].map(g => ({ id: g.id, name: g.name, topic: g.t, f: () => body(retry(() => g.f()), meta.points) }));
  return { ...meta, items, gens };
}
