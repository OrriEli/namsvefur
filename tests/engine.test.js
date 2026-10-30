// Sniðið, geymslan, villubankinn og vægi í úrtaki.

import { describe, it, expect } from 'vitest';
import { validateCourse, validateItem } from '../src/schema.js';
import { createStore, memoryBackend, fresh, migrate, logActivity } from '../src/store/store.js';
import { recordAnswer, inBank, bankIds } from '../src/engine/review.js';
import { entriesOf, weight, instantiate, topicStats, weakest } from '../src/engine/practice.js';
import { courses } from './helpers.js';

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
    expect(validateItem({ ...ok, topic: 'u' }, { topics: new Set(['t']) })).not.toEqual([]);
    expect(validateItem({ type: 'num', q: 'Q', e: '', ans: NaN, tol: 0 }, { generated: true })).not.toEqual([]);
    expect(validateItem({ type: 'mc', q: 'NaN m.kr.', e: '', o: ['1', '2'], a: 0 }, { generated: true })).not.toEqual([]);
  });
});

describe('geymsla', () => {
  it('vistar og les aftur', () => {
    const be = memoryBackend();
    const s1 = createStore(be); recordAnswer(s1.state, 'hag103g:H25-1', 0); s1.save();
    const s2 = createStore(be);
    expect(s2.state.items['hag103g:H25-1']).toMatchObject({ n: 1, c: 0, box: 1 });
  });

  it('ónýtt eða tómt gildi gefur nýja stöðu', () => {
    expect(createStore(memoryBackend('{ónýtt')).state).toEqual(fresh());
    expect(migrate(null)).toEqual(fresh());
  });

  it('lotuskráning lengir æfingalotu innan 15 mín.', () => {
    const S = fresh();
    logActivity(S, 'hag103g', 'practice', 1, 0);
    logActivity(S, 'hag103g', 'practice', 0, 10 * 60e3);
    logActivity(S, 'hag103g', 'practice', 1, 40 * 60e3);
    expect(S.sessions.map(s => [s.n, s.c])).toEqual([[2, 1], [1, 1]]);
  });
});

describe('villubanki (einfaldur)', () => {
  it('rangt → inn; tvö rétt í röð → út; rangt á milli byrjar upp á nýtt', () => {
    const S = fresh(); const g = 'hag107g:x';
    recordAnswer(S, g, 0); expect(inBank(S.items[g])).toBe(true);
    recordAnswer(S, g, 1); expect(inBank(S.items[g])).toBe(true);
    recordAnswer(S, g, 0); recordAnswer(S, g, 1); expect(inBank(S.items[g])).toBe(true);
    recordAnswer(S, g, 1); expect(inBank(S.items[g])).toBe(false);
    expect(bankIds(S)).toEqual([]);
    expect(S.items[g]).toMatchObject({ n: 5, c: 3, streak: 2 });
  });
});

describe('vægi í úrtaki', () => {
  const c = courses[0]; const es = entriesOf(c);
  const item = es.find(e => e.kind === 'item'), gen = es.find(e => e.kind === 'gen');

  it('villubanki 5 > ósnert 3 > rafall 2 > 1 > náð 0,25', () => {
    const S = fresh();
    expect(weight(item, S)).toBe(3);
    expect(weight(gen, S)).toBe(2);
    recordAnswer(S, item.gid, 0); recordAnswer(S, gen.gid, 0);
    expect(weight(item, S)).toBe(5);
    expect(weight(gen, S)).toBe(5);
    recordAnswer(S, item.gid, 1); recordAnswer(S, item.gid, 1);
    expect(weight(item, S)).toBe(0.25);
    recordAnswer(S, item.gid, 0); recordAnswer(S, item.gid, 1); recordAnswer(S, item.gid, 1);
    expect(inBank(S.items[item.gid])).toBe(false);
    expect(weight(item, S)).toBe(0.25);
  });

  it('tilvik krossaspurningar heldur réttu svari eftir stokkun', () => {
    const it0 = c.items[0];
    for (let k = 0; k < 50; k++) { const x = instantiate(c, es[0]); expect(x.o[x.a]).toBe(it0.o[it0.a]); expect([...x.o].sort()).toEqual([...it0.o].sort()); }
  });

  it('staða flokks og veikustu flokkar', () => {
    const S = fresh(); const t = c.topics[0].id;
    const inT = es.filter(e => e.topic === t).slice(0, 3);
    inT.forEach(e => recordAnswer(S, e.gid, 0));
    const st = topicStats(c, S, t);
    expect(st).toMatchObject({ n: 3, c: 0, seen: 3, pct: 0 });
    expect(weakest(c, S, 1)).toEqual([t]);
    expect(weakest(c, S, 20).some(x => c.topics.find(y => y.id === x).review)).toBe(false);
  });
});
