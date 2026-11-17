// Hver rafall keyrður 1.000 sinnum (á hverju stigi): úttakið passar við sniðið, valkostir eru einstakir,
// rétt svar er meðal þeirra og engin tala er NaN eða Infinity.

import { describe, it } from 'vitest';
import { validateItem } from '../src/schema.js';
import { courses } from './helpers.js';

const RUNS = 1000;
const finite = v => typeof v === 'number' && Number.isFinite(v);

function badNumbers(out) {
  const bad = [];
  for (const k of ['ans', 'tol', 'pts']) if (k in out && out[k] !== undefined && !finite(out[k])) bad.push(k);
  if (out.type === 'mc' && !finite(out.a)) bad.push('a');
  if (out.parts) out.parts.forEach((p, i) => { if (!finite(p.ans) || !finite(p.tol)) bad.push(`liður ${i + 1}`); });
  return bad;
}

for (const c of courses) {
  describe(c.id, () => {
    const cases = c.gens.flatMap(g => (g.levels || [undefined]).map(l => [l === undefined ? g.id : `${g.id}@${l}`, g, l]));
    it.each(cases)('%s', (_, g, l) => {
      for (let i = 0; i < RUNS; i++) {
        const out = g.f(l);
        const err = [...validateItem(out, { generated: true }), ...badNumbers(out)];
        if (g.types && !g.types.includes(out.type)) err.push(`óvænt gerð ${out.type}`);
        if (out.solution) err.push(...validateItem({ type: 'steps', q: out.solution.q, e: '', steps: out.solution.steps }, { generated: true }));
        if (err.length) throw new Error(`keyrsla ${i + 1}: ${err.join('; ')}\n${JSON.stringify(out).slice(0, 400)}`);
      }
    });
  });
}
