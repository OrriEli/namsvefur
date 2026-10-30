// Prófsnið: sama samsetning og á gömlu síðunum, mat og skráning.

import { describe, it, expect } from 'vitest';
import { buildExam, finishExam } from '../src/engine/exam.js';
import { fresh } from '../src/store/store.js';
import { inBank } from '../src/engine/review.js';
import { courses, legacy } from './helpers.js';

const byId = Object.fromEntries(courses.map(c => [c.id, c]));
const tally = list => { const o = {}; for (const t of list) o[t] = (o[t] || 0) + 1; return o; };

describe('HAG103G', () => {
  const c = byId.hag103g;

  it('blandað próf: 20 spurningar, 60 mín., sama skipting á flokka og gamla síðan', () => {
    const L = legacy('hag103g').vars;
    L.buildExam('mix');
    const old = L.S.exam;
    L.S.exam = null;
    expect(old.items.length).toBe(20);
    for (let k = 0; k < 50; k++) {
      const X = buildExam(c, 'mix', fresh());
      expect(X.items.length).toBe(20);
      expect(X.dur).toBe(60 * 60e3);
      expect(X.dur).toBe(old.dur);
      expect(tally(X.items.map(i => i.topic))).toEqual(tally(old.items.map(i => i.t)));
      expect(new Set(X.items.map(i => i.gid)).size).toBe(20);
    }
  });

  it('Hlutapróf 2025: 17 spurningar í sömu röð, 51 mín.', () => {
    const L = legacy('hag103g').vars;
    L.buildExam('h25'); const old = L.S.exam; L.S.exam = null;
    const X = buildExam(c, 'h25', fresh());
    expect(X.items.map(i => i.id)).toEqual(old.items.map(i => i.key));
    expect(X.dur).toBe(old.dur);
    expect(X.dur).toBe(51 * 60e3);
  });

  it('Reikningapróf: 15 ólíkir rafalar, 45 mín.', () => {
    const X = buildExam(c, 'gen', fresh());
    expect(X.items.length).toBe(15);
    expect(X.items.every(i => i.source === 'gen')).toBe(true);
    expect(new Set(X.items.map(i => i.id)).size).toBe(15);
    expect(X.dur).toBe(45 * 60e3);
  });

  it('skil: röng svör fara í villubankann og niðurstaðan í söguna', () => {
    const S = fresh(); const X = buildExam(c, 'mix', S); S.exams[c.id] = X;
    X.ans = X.items.map((it, i) => i < 15 ? it.a : (it.a + 1) % it.o.length);
    const res = finishExam(S, c, X, { now: X.start + 30 * 60e3 });
    expect(res.score).toBe(15);
    expect(res.used).toBe(30 * 60e3);
    expect(X.items.filter(it => inBank(S.items[it.gid])).length).toBe(5);
    expect(S.hist).toHaveLength(1);
    expect(S.exams[c.id]).toBeUndefined();
  });
});

describe('HAG107G', () => {
  const c = byId.hag107g;

  for (const f of ['mix', 'new']) {
    it(`${f}: sama skipting á flokka og gamla síðan`, () => {
      const L = legacy('hag107g').vars;
      L.buildExam(f); const old = L.S.exam; L.S.exam = null;
      const X = buildExam(c, f, fresh());
      expect(X.items.length).toBe(old.items.length);
      expect(X.dur).toBe(old.dur);
      expect(tally(X.items.map(i => i.topic))).toEqual(tally(old.items.map(i => i.t)));
      if (f === 'new') expect(X.items.every(i => i.source === 'new')).toBe(true);
    });
  }
});
