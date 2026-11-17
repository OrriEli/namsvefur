// „Í dag“: forgangur faga og tillaga að blokk. Viðmið áfanga 4: tillagan breytist þegar villur eru
// skráðar og þegar prófdagur nálgast.

import { describe, it, expect } from 'vitest';
import { proximity, priorities, suggestBlock, examFor, recentShare } from '../src/engine/today.js';
import { recordAnswer } from '../src/engine/review.js';
import { entriesOf } from '../src/engine/practice.js';
import { fresh, defaultPrefs } from '../src/store/store.js';
import { cellCls, cellOpacity } from '../src/views/today.js';
import { pickReview } from '../src/views/upprifjun.js';
import { courses, byId } from './helpers.js';

const D = 864e5;
const NOW = Date.UTC(2026, 10, 17, 12);           // þriðjudagur
const at = days => new Date(NOW + days * D).toISOString();
const prefs = { ...defaultPrefs(), busy: [1, 3, 5] };

describe('nálægð prófs', () => {
  it('1/dagar innan 14 daga, 1/14 lengra frá og fyrir óstaðfest próf, 0 ef liðið', () => {
    expect(proximity({ at: at(7) }, NOW)).toBeCloseTo(1 / 7);
    expect(proximity({ at: at(14) }, NOW)).toBeCloseTo(1 / 14);
    expect(proximity({ at: at(30) }, NOW)).toBeCloseTo(1 / 14);
    expect(proximity({ at: null }, NOW)).toBeCloseTo(1 / 14);
    expect(proximity(null, NOW)).toBe(0);
    expect(examFor('hag101g', [{ course: 'hag101g', at: at(-1), minutes: 180 }], NOW)).toBeNull();
  });
});

describe('tillaga að blokk', () => {
  it('breytist þegar villur eru skráðar: villur á tíma koma fyrst', () => {
    const exams = [{ course: 'hag103g', at: at(10) }, { course: 'hag107g', at: at(20) }];
    const S = fresh();
    const before = suggestBlock(courses, S, { now: NOW, exams, prefs });
    expect(before.segments[0]).toMatchObject({ half: 1, kind: 'topics', course: 'hag103g' });
    const es = entriesOf(byId.hag103g).filter(e => e.type === 'mc').slice(0, 4);
    es.forEach(e => recordAnswer(S, e.gid, 0, { now: NOW - 2 * D }));
    const after = suggestBlock(courses, S, { now: NOW, exams, prefs });
    expect(after.segments[0]).toMatchObject({ half: 1, kind: 'due', course: 'hag103g', n: 4 });
    expect(after.segments[1]).toMatchObject({ half: 1, kind: 'topics' });
    expect(after.segments[1].minutes).toBe(25 - after.segments[0].minutes);
  });

  it('breytist þegar prófdagur nálgast', () => {
    const S = fresh();
    const far = [{ course: 'hag103g', at: at(30) }, { course: 'hag107g', at: at(20) }];
    expect(priorities(courses, S, { now: NOW, exams: far })[0].course.id).toBe('hag107g');
    const near = [{ course: 'hag103g', at: at(5) }, { course: 'hag107g', at: at(20) }];
    const sug = suggestBlock(courses, S, { now: NOW, exams: near, prefs });
    expect(sug.ranking[0].course.id).toBe('hag103g');
    expect(sug.segments.find(s => s.half === 1 && s.kind === 'topics').course).toBe('hag103g');
    expect(sug.segments.find(s => s.half === 2).course).toBe('hag107g');
  });

  it('veikleiki: fag sem gengur illa í síðustu lotum fær meiri forgang', () => {
    const exams = [{ course: 'hag103g', at: at(20) }, { course: 'hag107g', at: at(20) }];
    const S = fresh();
    S.sessions.push({ course: 'hag103g', kind: 'practice', start: NOW - D, end: NOW - D, n: 20, c: 18 });
    S.sessions.push({ course: 'hag107g', kind: 'practice', start: NOW - D, end: NOW - D, n: 20, c: 8 });
    S.sessions.push({ course: 'hag107g', kind: 'practice', start: NOW - 30 * D, end: NOW - 30 * D, n: 100, c: 100 });   // of gamalt
    expect(recentShare(S, byId.hag107g, NOW)).toBeCloseTo((8 + 2) / 24);   // dempað með 4 hlutlausum tilraunum
    const r = priorities(courses, S, { now: NOW, exams });
    expect(r[0].course.id).toBe('hag107g');
    expect(r[0].weak).toBeCloseTo(1 - 10 / 24);
  });

  it('eitt rangt svar snýr ekki tillögunni við', () => {
    const exams = [{ course: 'hag101g', at: at(8) }, { course: 'hag108g', at: at(14) }];
    const S = fresh();
    S.sessions.push({ course: 'hag108g', kind: 'practice', start: NOW, end: NOW, n: 1, c: 0 });
    expect(priorities(courses, S, { now: NOW, exams })[0].course.id).toBe('hag101g');
  });

  it('upptekið kvöld: aðeins fyrri helmingurinn', () => {
    const exams = [{ course: 'hag103g', at: at(10) }, { course: 'hag107g', at: at(20) }];
    const monday = NOW - D;
    const sug = suggestBlock(courses, fresh(), { now: monday, exams, prefs });
    expect(sug.busy).toBe(true);
    expect([sug.pause, sug.second, sug.total]).toEqual([0, 0, 25]);
    expect(sug.segments.every(s => s.half === 1)).toBe(true);
  });

  it('eitt fag með próf: seinni helmingur er blönduð upprifjun', () => {
    const sug = suggestBlock(courses, fresh(), { now: NOW, exams: [{ course: 'hag101g', at: at(8) }], prefs });
    expect(sug.segments.find(s => s.half === 2)).toMatchObject({ kind: 'mix', n: 10, minutes: 25 });
    expect(sug.segments.find(s => s.kind === 'topics').course).toBe('hag101g');
  });

  it('villur á tíma fylla ekki meira en fyrri helminginn (skrifleg dæmi taka 8 mín.)', () => {
    const exams = [{ course: 'hag101g', at: at(8) }];
    const S = fresh();
    entriesOf(byId.hag101g).filter(e => e.type === 'steps').slice(0, 10).forEach(e => recordAnswer(S, e.gid, 0, { now: NOW - 2 * D }));
    const sug = suggestBlock(courses, S, { now: NOW, exams, prefs });
    const due = sug.segments.find(s => s.kind === 'due');
    expect(due.n).toBe(3);
    expect(due.minutes).toBe(24);
    expect(sug.segments.some(s => s.half === 1 && s.kind === 'topics')).toBe(false);
  });

  it('liðin próf: fagið fær engan forgang', () => {
    const r = priorities(courses, fresh(), { now: NOW, exams: [{ course: 'hag103g', at: at(-2), minutes: 180 }] });
    expect(r.find(x => x.course.id === 'hag103g').prio).toBe(0);
  });
});

describe('kunnáttukort', () => {
  it('litur eftir hlutfalli og daufara eftir því sem lengra er síðan æft var', () => {
    expect([cellCls(null), cellCls(0.5), cellCls(0.7), cellCls(0.9)]).toEqual(['', 'lo', 'mid', 'hi']);
    expect(cellOpacity(0)).toBe(1);
    expect(cellOpacity(7)).toBeCloseTo(0.725);
    expect(cellOpacity(30)).toBeCloseTo(0.45);
    expect(cellOpacity(null)).toBe(1);
  });
});

describe('blönduð upprifjun', () => {
  it('tíu atriði úr ólíkum flokkum, engin skrifleg dæmi eða spjöld', () => {
    const q = pickReview(fresh(), Date.UTC(2026, 10, 17, 12));
    expect(q).toHaveLength(10);
    expect(new Set(q.map(x => x.course.id + ':' + x.entry.topic)).size).toBe(10);
    expect(q.every(x => x.entry.type !== 'steps' && x.entry.type !== 'card')).toBe(true);
  });
});
