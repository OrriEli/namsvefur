// Hver rafall keyrður 1.000 sinnum (á hverju stigi): úttakið passar við sniðið, valkostir eru einstakir,
// rétt svar er meðal þeirra og engin tala er NaN eða Infinity.

import { describe, it, expect } from 'vitest';
import { validateItem } from '../src/schema.js';
import { courses } from './helpers.js';

const RUNS = 1000;

function badNumbers(out) {
  const bad = [];
  for (const k of ['a', 'ans', 'tol', 'x']) if (k in out && !(typeof out[k] === 'number' && Number.isFinite(out[k]))) bad.push(k);
  return bad;
}

for (const c of courses) {
  describe(c.id, () => {
    const cases = c.gens.flatMap(g => (g.levels || [undefined]).map(l => [l === undefined ? g.id : `${g.id}@${l}`, g, l]));
    it.each(cases)('%s', (_, g, l) => {
      for (let i = 0; i < RUNS; i++) {
        const out = g.f(l);
        const err = validateItem(out, { generated: true });
        if (err.length || badNumbers(out).length) throw new Error(`keyrsla ${i + 1}: ${[...err, ...badNumbers(out)].join('; ')}\n${JSON.stringify(out).slice(0, 400)}`);
        if (out.type === 'mc') expect(out.o[out.a]).toBeDefined();
      }
    });
  });
}
