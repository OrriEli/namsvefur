// Sniðið, spurningagerðirnar, geymslan, villubankinn og vægi í úrtaki.

import { describe, it, expect } from 'vitest';
import { validateCourse, validateItem } from '../src/schema.js';
import { createStore, memoryBackend, fresh, migrate, logActivity } from '../src/store/store.js';
import { recordAnswer, inBank, isDue, bankIds, dueIds, nextDue } from '../src/engine/review.js';
import { entriesOf, weight, instantiate, topicStats, weakest, inMode } from '../src/engine/practice.js';
import { grade, answered, blank, parseNum, parseFrac } from '../src/engine/items/index.js';
import { courses, byId } from './helpers.js';

describe('snið', () => {
  it.each(courses.map(c => [c.id, c]))('%s stenst validateCourse', (_, c) => {
    expect(validateCourse(c)).toEqual([]);
  });

  it('grípur gölluð atriði', () => {
    const ok = { id: 'x', type: 'mc', topic: 't', source: 'new', src: 's', q: 'Q', e: '', o: ['a', 'b'], a: 0 };
    expect(validateItem(ok, { topics: new Set(['t']) })).toEqual([]);
    expect(validateItem({ ...ok, a: 2 })).not.toEqual([]);
    expect(validateItem({ ...ok, o: ['a', 'a'] })).not.toEqual([]);
    expect(validateItem({ ...ok, source: 'foo' })).not.toEqual([]);
    expect(validateItem({ ...ok, type: 'multi', a: [0, 5] })).not.toEqual([]);
    expect(validateItem({ ...ok, type: 'match', cols: ['R', 'F'], rows: [{ t: 'x', a: 2 }] })).not.toEqual([]);
    expect(validateItem({ type: 'num', q: 'Q', e: '', ans: NaN, tol: 0 }, { generated: true })).not.toEqual([]);
    expect(validateItem({ type: 'num', q: 'Q', e: '', parts: [{ l: 'a', ans: 1, tol: -1 }] }, { generated: true })).not.toEqual([]);
    expect(validateItem({ type: 'mc', q: 'NaN m.kr.', e: '', o: ['1', '2'], a: 0 }, { generated: true })).not.toEqual([]);
  });
});

describe('mat á gerðum', () => {
  it('kross og „veldu allt“ (rétt mínus rangt, aldrei undir núlli)', () => {
    expect(grade({ type: 'mc', a: 2 }, 2)).toBe(1);
    expect(grade({ type: 'mc', a: 2 }, 1)).toBe(0);
    const m = { type: 'multi', a: [0, 2, 3] };
    expect(grade(m, [0, 2, 3])).toBe(1);
    expect(grade(m, [0, 2])).toBeCloseTo(2 / 3);
    expect(grade(m, [0, 1])).toBe(0);
    expect(grade(m, [1, 4])).toBe(0);
  });
  it('pörun: hlutfall réttra raða', () => {
    const it0 = { type: 'match', cols: ['Rétt', 'Rangt'], rows: [{ t: 'a', a: 0 }, { t: 'b', a: 1 }, { t: 'c', a: 0 }, { t: 'd', a: 1 }] };
    expect(grade(it0, [0, 1, 1, null])).toBe(0.5);
    expect(answered(it0, blank(it0))).toBe(false);
  });
  it('tölusvar: vikmörk, líkur sem prósenta og liðir', () => {
    expect(grade({ type: 'num', ans: 1440, tol: 0.5 }, '1.440')).toBe(1);
    expect(grade({ type: 'num', ans: 1440, tol: 0.5 }, '1441')).toBe(0);
    expect(grade({ type: 'num', ans: 0.2, tol: 0.001, prob: true }, '20%')).toBe(1);
    expect(grade({ type: 'num', ans: 0.2, tol: 0.001, prob: true }, '0,2')).toBe(1);
    expect(grade({ type: 'num', ans: -3.5, tol: 0.01 }, '−3,5')).toBe(1);
    const parts = { type: 'num', parts: [{ l: 'P', ans: -1.5, tol: 0.011 }, { l: 'Q', ans: 30, tol: 0.18 }] };
    expect(grade(parts, ['-1.5', '29'])).toBe(0.5);
    expect(parseNum('1 200 kr.')).toBe(1200);
    expect(parseNum('abc')).toBeNaN();
  });
  it('nákvæmt brotasvar: 6/4 = 3/2 = 1,5', () => {
    const it0 = { type: 'num', ans: 1.5, tol: 0, exact: '3/2' };
    for (const v of ['3/2', '6/4', '1,5', '1.5']) expect(grade(it0, v)).toBe(1);
    expect(grade(it0, '1.49')).toBe(0);
    expect(grade({ type: 'num', ans: -5, tol: 0, exact: '-5' }, '-10/2')).toBe(1);
    expect(parseFrac('1/0')).toBeNull();
  });
  it('skrefadæmi: hlutfall stiga í réttum skrefum', () => {
    const it0 = { type: 'steps', steps: [{ h: 'a', body: '', p: 2 }, { h: 'b', body: '', p: 3 }] };
    const r = blank(it0); r.mk = [true, false];
    expect(grade(it0, r)).toBe(0.4);
  });
});

describe('geymsla', () => {
  it('vistar og les aftur', () => {
    const be = memoryBackend();
    const s1 = createStore(be); recordAnswer(s1.state, 'hag103g:H25-1', 0); s1.save();
    const s2 = createStore(be);
    expect(s2.state.items['hag103g:H25-1']).toMatchObject({ n: 1, c: 0, box: 1 });
  });
  it('ónýtt eða tómt gildi gefur nýja stöðu; eldri stillingar fá nýju svæðin', () => {
    expect(createStore(memoryBackend('{ónýtt')).state).toEqual(fresh());
    expect(migrate(null)).toEqual(fresh());
    expect(migrate({ v: 1, items: {}, settings: { plan: { x: { done: {} } } } }).settings.adapt).toEqual({});
  });
  it('lotuskráning lengir æfingalotu innan 15 mín.', () => {
    const S = fresh();
    logActivity(S, 'hag103g', 'practice', 1, 0);
    logActivity(S, 'hag103g', 'practice', 0, 10 * 60e3);
    logActivity(S, 'hag103g', 'practice', 1, 40 * 60e3);
    expect(S.sessions.map(s => [s.n, s.c])).toEqual([[2, 1], [1, 1]]);
  });
});

describe('villubanki með dreifðri endurtekningu', () => {
  const D = 864e5, t0 = Date.UTC(2026, 10, 17, 12);

  it('rangt → hólf 1, á tíma eftir 1 dag', () => {
    const S = fresh(); const g = 'hag107g:x';
    recordAnswer(S, g, 0, { now: t0 });
    expect(S.items[g]).toMatchObject({ box: 1, due: t0 + D });
    expect(isDue(S.items[g], t0 + D - 1)).toBe(false);
    expect(isDue(S.items[g], t0 + D)).toBe(true);
  });

  it('rétt þegar á tíma → 3, 7, 16 dagar og svo út; rétt áður en á tíma breytir engu', () => {
    const S = fresh(); const g = 'hag103g:y'; let t = t0;
    recordAnswer(S, g, 0, { now: t });
    recordAnswer(S, g, 1, { now: t + 3600e3 });             // ekki á tíma
    expect(S.items[g].box).toBe(1);
    for (const [box, next] of [[1, 3], [3, 7], [7, 16]]) {
      t = S.items[g].due; expect(S.items[g].box).toBe(box);
      recordAnswer(S, g, 1, { now: t });
      expect(S.items[g]).toMatchObject({ box: next, due: t + next * D });
    }
    recordAnswer(S, g, 1, { now: S.items[g].due });
    expect(inBank(S.items[g])).toBe(false);
    expect(bankIds(S)).toEqual([]);
  });

  it('rangt í hvaða hólfi sem er → aftur í hólf 1', () => {
    const S = fresh(); const g = 'hag108g:z';
    recordAnswer(S, g, 0, { now: t0 }); recordAnswer(S, g, 1, { now: t0 + D }); recordAnswer(S, g, 1, { now: t0 + 4 * D });
    expect(S.items[g].box).toBe(7);
    recordAnswer(S, g, 0, { now: t0 + 5 * D });
    expect(S.items[g]).toMatchObject({ box: 1, due: t0 + 6 * D });
  });

  it('„Viss“ en rangt fær sérmerki sem fer þegar villan fer út', () => {
    const S = fresh(); const g = 'hag101g:L25-1';
    recordAnswer(S, g, 0, { now: t0, conf: 'viss' });
    expect(S.items[g]).toMatchObject({ sureWrong: true, conf: 'viss' });
    let t = t0; for (let i = 0; i < 4; i++) { t = S.items[g].due; recordAnswer(S, g, 1, { now: t, conf: 'halfviss' }); }
    expect(S.items[g].sureWrong).toBeUndefined();
    recordAnswer(S, 'hag101g:L25-2', 0, { now: t0, conf: 'gisk' });
    expect(S.items['hag101g:L25-2'].sureWrong).toBeUndefined();
  });

  it('á tíma núna og næsti tími', () => {
    const S = fresh();
    recordAnswer(S, 'hag103g:a', 0, { now: t0 }); recordAnswer(S, 'hag103g:b', 0, { now: t0 + 2 * D });
    expect(dueIds(S, 'hag103g', t0 + 1.5 * D)).toEqual(['hag103g:a']);
    expect(nextDue(S, 'hag103g', t0 + 1.5 * D)).toBe(t0 + 3 * D);
  });

  it('hlutastig undir passScore telst rangt', () => {
    const S = fresh();
    expect(recordAnswer(S, 'a', 0.8, { passScore: 1 })).toBe(false);
    expect(recordAnswer(S, 'b', 0.8, { passScore: 0.7 })).toBe(true);
  });
});

describe('æfingapottur', () => {
  const c = byId.hag103g; const es = entriesOf(c);
  const item = es.find(e => e.kind === 'item'), gen = es.find(e => e.kind === 'gen');

  it('vægi: villa á tíma 5 > ósnert 3 > rafall 2 > 1 (villa ekki á tíma, eða séð) > náð 0,25', () => {
    const S = fresh(); const t = Date.now();
    expect(weight(item, S, t)).toBe(3);
    expect(weight(gen, S, t)).toBe(2);
    recordAnswer(S, item.gid, 0, { now: t }); recordAnswer(S, gen.gid, 0, { now: t });
    expect(weight(item, S, t)).toBe(1);
    expect(weight(gen, S, t)).toBe(2);
    expect(weight(item, S, t + 864e5)).toBe(5);
    expect(weight(gen, S, t + 864e5)).toBe(5);
    const other = es.find(e => e.kind === 'item' && e.gid !== item.gid);
    recordAnswer(S, other.gid, 1); recordAnswer(S, other.gid, 1);
    expect(weight(other, S)).toBe(0.25);
  });

  it('tilvik halda réttu svari eftir stokkun (kross, veldu allt, pörun)', () => {
    const c7 = byId.hag107g;
    for (const type of ['mc', 'multi', 'match']) {
      const it0 = c7.items.find(i => i.type === type); const e = entriesOf(c7).find(x => x.key === it0.id);
      for (let k = 0; k < 30; k++) {
        const x = instantiate(c7, e);
        if (type === 'mc') expect(x.o[x.a]).toBe(it0.o[it0.a]);
        if (type === 'multi') expect(x.a.map(i => x.o[i]).sort()).toEqual(it0.a.map(i => it0.o[i]).sort());
        if (type === 'match') expect(x.rows.map(r => r.t + r.a).sort()).toEqual(it0.rows.map(r => r.t + r.a).sort());
      }
    }
  });

  it('hættir: spjöld sér, skrifleg og hraðspurningar aðskilin í HAG101G', () => {
    const c1 = byId.hag101g;
    const w = entriesOf(c1).filter(e => inMode(e, { quick: false })), q = entriesOf(c1).filter(e => inMode(e, { quick: true }));
    expect(w.length + q.length).toBe(entriesOf(c1).length);
    expect(q.every(e => e.quick)).toBe(true);
    const c6 = byId.hag106g;
    expect(entriesOf(c6).filter(e => inMode(e, { cards: true })).every(e => e.type === 'card')).toBe(true);
    expect(entriesOf(c6).filter(e => inMode(e, null)).some(e => e.type === 'card')).toBe(false);
  });

  it('staða flokks og veikustu flokkar', () => {
    const S = fresh(); const t = c.topics[0].id;
    es.filter(e => e.topic === t).slice(0, 3).forEach(e => recordAnswer(S, e.gid, 0));
    expect(topicStats(c, S, t)).toMatchObject({ n: 3, c: 0, seen: 3, pct: 0 });
    expect(weakest(c, S, 1)).toEqual([t]);
    expect(weakest(c, S, 30).some(x => c.topics.find(y => y.id === x).review)).toBe(false);
  });
});
