// Sameiginlega talnasniðið gefur sama streng og F gömlu síðnanna.

import { describe, it, expect } from 'vitest';
import { makeF } from '../src/ui/format.js';
import { courses, legacy } from './helpers.js';

function samples() {
  const xs = [0, -0, 0.5, -0.5, 0.004, -0.004, 0.005, -0.005, 0.0049999, 1e-9, -1e-9, 999.995, -999.995, 1234567.891, -1234567.891, 1e15, 0.1 + 0.2];
  let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  for (let i = 0; i < 3000; i++) {
    const mag = Math.pow(10, Math.floor(rnd() * 12) - 5);
    xs.push((rnd() - 0.5) * 2 * mag, Math.round((rnd() - 0.5) * 2e6) / 1000);
  }
  return xs;
}

describe.each(courses.map(c => [c.id]))('F í %s', id => {
  const old = legacy(id).vars.F;
  const F = makeF({ pctDigits: 1 });
  const xs = samples();

  it('int, num og pct (sjálfgefið)', () => {
    for (const x of xs) {
      expect(F.int(x)).toBe(old.int(x));
      expect(F.num(x)).toBe(old.num(x));
      expect(F.pct(x)).toBe(old.pct(x));
    }
  });

  it('dec og pct með 0–4 aukastöfum', () => {
    for (const x of xs) for (const d of [0, 1, 2, 3, 4]) {
      expect(F.dec(x, d)).toBe(old.dec(x, d));
      expect(F.pct(x, d)).toBe(old.pct(x, d));
    }
  });
});
