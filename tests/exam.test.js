// Prófsnið: sama samsetning og á gömlu síðunum, mat og skráning.

import { describe, it, expect } from 'vitest';
import { buildExam, finishExam, toGrade, scoreExam } from '../src/engine/exam.js';
import { fresh } from '../src/store/store.js';
import { inBank } from '../src/engine/review.js';
import { entriesOf } from '../src/engine/practice.js';
import { byId, legacy, tally } from './helpers.js';

function legacyExam(id, k) {
  const V = legacy(id).vars; V.buildExam(k); const X = V.S.exam; V.S.exam = null;
  return { keys: X.items.map(i => i.key), topics: X.items.map(i => i.t), minutes: X.dur / 60e3, w: X.items.map(i => i.w) };
}

describe('Inspera (HAG103G, HAG107G)', () => {
  for (const [id, formats] of [['hag103g', ['mix', 'second', 'gen', 'l25', 'l24']], ['hag107g', ['lok', 'half', 'p1', 'p2', 'p3', 'gen']]]) {
    for (const f of formats) {
      it(`${id} ${f}: sama fjöldi, tími og skipting og á gömlu síðunni`, () => {
        const c = byId[id]; const old = legacyExam(id, f);
        for (let k = 0; k < 20; k++) {
          const X = buildExam(c, f, fresh());
          expect(X.items.length).toBe(old.keys.length);
          expect(X.dur / 60e3).toBe(old.minutes);
          expect(new Set(X.items.map(i => i.gid)).size).toBe(X.items.length);
          if (f === 'gen') expect(X.items.every(i => i.source === 'gen')).toBe(true);
          else if (c.examFormats.find(x => x.id === f).pick.by === 'fixed') expect(X.items.map(i => i.id)).toEqual(old.keys);
          else expect(tally(X.items.map(i => i.topic))).toEqual(tally(old.topics));
        }
      });
    }
  }

  it('HAG103G fullt lokapróf: 50 spurningar á 3 klst.', () => {
    const X = buildExam(byId.hag103g, 'mix', fresh());
    expect([X.items.length, X.dur / 60e3]).toEqual([50, 180]);
  });

  it('HAG107G: stig eftir gerð og hlutastig fyrir „veldu allt“', () => {
    const c = byId.hag107g; const S = fresh(); const X = buildExam(c, 'lok', S); S.exams[c.id] = X;
    X.items.forEach((it, i) => { if (it.type === 'mc') X.ans[i] = it.a; if (it.type === 'multi') X.ans[i] = it.a.slice(0, 1); });
    const sc = scoreExam(c, X);
    X.items.forEach((it, i) => {
      if (it.type === 'mc') expect(sc[i]).toEqual({ frac: 1, max: 2, pts: 2 });
      if (it.type === 'multi') expect(sc[i].frac).toBeCloseTo(1 / it.a.length);
    });
    const res = finishExam(S, c, X);
    expect(res.max).toBe(X.items.reduce((s, it) => s + it.pts, 0));
  });

  it('skil: röng svör fara í villubankann og niðurstaðan í söguna', () => {
    const c = byId.hag103g; const S = fresh(); const X = buildExam(c, 'second', S); S.exams[c.id] = X;
    X.ans = X.items.map((it, i) => i < 15 ? it.a : (it.a + 1) % it.o.length);
    const res = finishExam(S, c, X, { now: X.start + 30 * 60e3 });
    expect([res.score, res.max, res.used]).toEqual([15, 20, 30 * 60e3]);
    expect(X.items.filter(it => inBank(S.items[it.gid])).length).toBe(5);
    expect(S.hist).toHaveLength(1);
    expect(S.exams[c.id]).toBeUndefined();
  });
});

describe('Skriflegt (HAG101G)', () => {
  const c = byId.hag101g;
  for (const f of ['L23', 'L25', 'M25']) {
    it(`${f}: sömu dæmi, vægi og tími og á gömlu síðunni`, () => {
      const old = legacyExam('hag101g', f); const X = buildExam(c, f, fresh());
      expect(X.items.map(i => i.id)).toEqual(old.keys);
      expect(X.items.map(i => i.w)).toEqual(old.w);
      expect(X.dur / 60e3).toBe(old.minutes);
    });
  }
  it('lokaprófin 2023 og 2025 hafa 100 stig hvort', () => {
    for (const f of ['L23', 'L25']) expect(buildExam(c, f, fresh()).items.reduce((s, i) => s + i.w, 0)).toBe(100);
  });
  for (const f of ['mix', 'gen']) {
    it(`${f}: eitt dæmi úr hverjum hluta með vægi gömlu síðunnar`, () => {
      const fmt = c.examFormats.find(x => x.id === f);
      for (let k = 0; k < 20; k++) {
        const X = buildExam(c, f, fresh());
        expect(X.items.map(i => i.w)).toEqual(fmt.pick.sections.map(s => s.weight));
        X.items.forEach((it, i) => { expect(fmt.pick.sections[i].topics).toContain(it.topic); expect(it.type).toBe('steps'); expect(it.quick).toBeFalsy(); });
        if (f === 'gen') expect(X.items.every(i => i.source === 'gen')).toBe(true);
        else expect(X.items.every(i => i.source === 'gen' || i.steps.reduce((s, x) => s + x.p, 0) >= 5)).toBe(true);
      }
    });
  }
  it('sjálfsmat: stig dæmis = vægi × hlutfall réttra skrefa', () => {
    const S = fresh(); const X = buildExam(c, 'L25', S); S.exams[c.id] = X;
    toGrade(X);
    X.ans.forEach((r, i) => { r.mk = X.items[i].steps.map((_, j) => j === 0); });
    const sc = scoreExam(c, X);
    X.items.forEach((it, i) => expect(sc[i].pts).toBeCloseTo(it.w * it.steps[0].p / it.steps.reduce((s, x) => s + x.p, 0)));
  });
});

describe('Blandað (HAG106G, HAG108G)', () => {
  for (const id of ['hag106g', 'hag108g']) {
    const c = byId[id];
    it(`${id}: skipting á stig, skrifleg dæmi á stigi 3 og skýringarspjöld`, () => {
      for (let k = 0; k < 30; k++) {
        const X = buildExam(c, 'blandad', fresh());
        const main = X.items.filter(i => i.type !== 'card');
        expect(main.length).toBe(24);
        expect(X.items.filter(i => i.type === 'card').length).toBe(2);
        expect(X.items.slice(-2).every(i => i.type === 'card')).toBe(true);
        expect(tally(main.map(i => i.level))).toEqual({ 1: 5, 2: 12, 3: 7 });
        // Í HAG108G getur lágmark R-spurninga bætt skriflegu R-dæmi við á stigi 3, eins og á gömlu síðunni.
        if (id === 'hag106g') expect(main.filter(i => i.level === 3 && i.type === 'steps').length).toBeLessThanOrEqual(3);
        expect(X.dur / 60e3).toBe(180);
      }
    });
    it(`${id}: stutt próf og valdir fyrirlestrar`, () => {
      const groups = c.topics.slice(0, 3).map(t => t.id);
      const X = buildExam(c, 'blandad', fresh(), { opts: { len: 'short', mix: 'hard', groups, explain: false } });
      expect(X.items.length).toBe(12);
      expect(X.items.every(i => groups.includes(i.topic))).toBe(true);
      expect(X.dur / 60e3).toBe(90);
    });
  }
  it('HAG108G: minnst 15% R-spurningar ef L00 er valið', () => {
    const c = byId.hag108g;
    for (let k = 0; k < 30; k++) {
      const X = buildExam(c, 'blandad', fresh());
      const main = X.items.filter(i => i.type !== 'card');
      const isR = new Map(entriesOf(c).map(e => [e.gid, e.r]));
      const r = main.filter(i => isR.get(i.gid)).length;
      expect(r).toBeGreaterThanOrEqual(Math.ceil(0.15 * 24));
    }
  });
  it('stig: kross og tölusvar 1, skriflegt 3 × hlutfall, spjald 0', () => {
    const c = byId.hag106g; const S = fresh(); const X = buildExam(c, 'blandad', S); S.exams[c.id] = X;
    toGrade(X);
    X.items.forEach((it, i) => { if (it.type === 'steps') X.ans[i].mk = it.steps.map(() => true); if (it.type === 'mc') X.ans[i] = it.a; });
    const res = finishExam(S, c, X);
    const nSteps = X.items.filter(i => i.type === 'steps').length, nMc = X.items.filter(i => i.type === 'mc').length, nNum = X.items.filter(i => i.type === 'num').length;
    expect(res.max).toBe(nMc + nNum + 3 * nSteps);
    expect(res.score).toBe(nMc + 3 * nSteps);
  });
});
