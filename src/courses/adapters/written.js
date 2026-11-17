// Millilag skriflegu vélarinnar (HAG101G): skrifleg dæmi {id, t, src, q, steps:[{titill, stig, lausn}], exam?}
// verða `steps`, hraðspurningar verða `mc` eða `num` með nákvæmu brotasvari, og hver rafall verður tveir:
// skriflegt dæmi (`g-mul`) og hraðútgáfa (`q:g-mul`) fyrir þá rafala sem hafa hana.

import { retry } from './retry.js';

const clean = o => Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined));
const SOURCE_OF = { blad: 'sheet', old: 'old', new: 'new' };
const steps = list => list.map(s => ({ h: s.titill, body: s.lausn, p: s.stig }));

// Fjarlægir tvítekna valkosti og heldur réttu svari. Rafallinn g-homog í gömlu síðunni býr til
// „Já, af gráðu 1“ tvisvar þegar gráðan er 2 (rétta svarið, „Nei“, er alltaf fremst og einstakt).
function dedupe(o, a) {
  const out = [], map = [];
  o.forEach((x, i) => { const j = out.indexOf(x); if (j < 0) { map[i] = out.length; out.push(x); } else map[i] = j; });
  return { o: out, a: map[a] };
}

/** Hraðspurning {q, a, o?}: kross ef valkostir fylgja, annars nákvæmt svar 'p/q' eða heiltala. */
export function quickBody(p) {
  if (p.o) return { type: 'mc', quick: true, q: p.q, ...dedupe(p.o, p.a), e: '' };
  const [n, d] = String(p.a).split('/').map(Number);
  return { type: 'num', quick: true, q: p.q, ans: n / (d || 1), tol: 0, unit: '', exact: String(p.a), e: '' };
}

/** @returns {import('../../schema.js').Course} */
export default function adapt(meta, L) {
  const items = [
    ...L.STATIC.map(p => clean({ id: p.id, type: 'steps', topic: p.t, source: SOURCE_OF[p.kind], origin: p.kind === 'blad' ? 'blad' : undefined, src: p.src, q: p.q, steps: steps(p.steps), examWeight: p.exam, e: '', chk: p.chk })),
    ...L.QUICK.map(p => ({ id: p.id, topic: p.t, source: 'new', src: p.src, ...quickBody(p) }))
  ];
  const written = L.GENS.map(g => ({ id: g.id, name: g.name, topic: g.t, types: ['steps'],
    f: () => { const r = retry(() => g.f()); return clean({ type: 'steps', q: r.q, steps: steps(r.steps), e: '', chk: r.chk }); } }));
  // Eins og á gömlu síðunni: reynt allt að 20 sinnum þar til rafallinn skilar hraðspurningu.
  const quick = L.GENS.filter(g => meta.quickGens.includes(g.id)).map(g => ({ id: 'q:' + g.id, name: g.name, topic: g.t, quick: true,
    f: () => { let r; for (let i = 0; i < 20; i++) { r = retry(() => g.f()); if (r.quick) break; } return { ...quickBody(r.quick), solution: { q: r.q, steps: steps(r.steps) } }; } }));
  return { ...meta, items, gens: [...written, ...quick] };
}
