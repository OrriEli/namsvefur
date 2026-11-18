// HAG108G: gömlu prófin fjögur (des. 2024 – jan. 2026) sem skrifleg dæmi og prófsnið.

import { describe, it, expect } from 'vitest';
import { byId } from './helpers.js';
import { validateCourse, validateItem } from '../src/schema.js';
import { buildExam, scoreExam, toGrade, finishExam } from '../src/engine/exam.js';
import { entriesOf } from '../src/engine/practice.js';
import { formatMeta } from '../src/views/exam.js';

const c = byId.hag108g;
const old = c.items.filter(i => i.paper);
const PAPERS = ['D24', 'J25', 'D25', 'J26'];
const fresh = () => ({ items: {}, exams: {}, hist: [], sessions: [], settings: {} });

describe('gömlu prófin í HAG108G', () => {
  it('60 dæmi, 15 úr hverju prófi, öll gild skrifleg dæmi merkt „Gömul próf“', () => {
    expect(old).toHaveLength(60);
    for (const p of PAPERS) expect(old.filter(i => i.paper === p).map(i => i.id)).toEqual(Array.from({ length: 15 }, (_, k) => `${p}-${k + 1}`));
    const topics = new Set(c.topics.map(t => t.id));
    for (const it of old) {
      expect(validateItem(it, { topics })).toEqual([]);
      expect([it.type, it.source, it.level]).toEqual(['steps', 'old', 2]);
    }
    expect(validateCourse(c)).toEqual([]);
  });

  it('R-dæmin (12–15) eru R-spurningar á L00', () => {
    for (const it of old) expect(!!it.r).toBe(+it.id.split('-')[1] >= 12);
    expect(old.filter(i => i.r).every(i => i.topic === 'L00')).toBe(true);
  });

  it('vægi hvers prófs er 100%; jan. 2025 hefur sitt eigið vægi', () => {
    for (const p of PAPERS) expect(old.filter(i => i.paper === p).reduce((s, i) => s + i.examWeight, 0)).toBeCloseTo(100);
    expect(c.items.find(i => i.id === 'J25-1').examWeight).toBe(6.5);
    expect(c.items.find(i => i.id === 'D25-1').src).toBe('Lokapróf desember 2025, dæmi 1 (vægi ekki gefið, um 5%)');
  });

  it('prófsniðin: blandað, fjögur gömul og sérsniðna æfingaprófið aftast', () => {
    expect(c.examFormats.map(f => f.id)).toEqual(['mix', 'D25', 'J26', 'D24', 'J25', 'blandad']);
    expect(c.examFormats.find(f => f.id === 'blandad').name).toBe('Sérsniðið æfingapróf');
    expect(formatMeta(c, c.examFormats[0])).toBe('15 dæmi · 3 klst.');
    expect(formatMeta(c, c.examFormats[1])).toBe('15 dæmi · 3 klst.');
  });

  it('blandaða prófið tekur dæmi n úr einhverju prófanna fjögurra og vegur 100', () => {
    let r = 0.13; const rnd = () => (r = (r * 9301 + 49297) % 233280 / 233280);
    for (let k = 0; k < 5; k++) {
      const x = buildExam(c, 'mix', fresh(), { rnd });
      expect(x.style).toBe('written');
      expect(x.items.map(i => +i.id.split('-')[1])).toEqual(Array.from({ length: 15 }, (_, i) => i + 1));
      expect(x.items.every(i => PAPERS.includes(i.paper))).toBe(true);
      expect(x.items.reduce((s, i) => s + i.w, 0)).toBe(100);
    }
  });

  it('gamalt próf: fast, á tíma, metið skref fyrir skref', () => {
    const S = fresh();
    const x = buildExam(c, 'J25', S, { now: 0 });
    expect([x.items.length, x.dur, x.items[0].w]).toEqual([15, 180 * 60e3, 6.5]);
    toGrade(x, { now: 60e3 });
    x.ans.forEach(a => { a.mk = a.mk.map(() => true); });
    expect(scoreExam(c, x).reduce((s, v) => s + v.pts, 0)).toBeCloseTo(100);
    const res = finishExam(S, c, x, { now: 120e3 });
    expect([res.score, res.max, S.hist.length]).toEqual([100, 100, 1]);
  });

  it('sérsniðna æfingaprófið tekur ekki heil gömul prófdæmi', () => {
    for (let k = 0; k < 10; k++) expect(buildExam(c, 'blandad', fresh()).items.some(i => i.paper)).toBe(false);
    expect(entriesOf(c).filter(e => e.paper)).toHaveLength(60);
  });

  it('sniðið er ekki lengur óstaðfest og Blaðið byrjar á sniði prófsins', () => {
    expect(c.examInfo.format).toMatch(/^Fjögur síðustu prófin hafa sama snið: 15 skrifleg dæmi/);
    expect(c.examInfo.callout).not.toContain('Snið lokaprófsins');
    expect(c.sheet.foot).not.toContain('Snið lokaprófsins');
    expect(c.sheet.sections[0]).toMatchObject({ id: 'hag108g-P', n: 'P', title: 'Snið lokaprófsins' });
    expect(c.examInfo.facts[1]).toEqual({ value: '15 dæmi', label: 'sama snið á fjórum síðustu prófum' });
  });

  it('HAG106G er óbreytt: eitt sérsniðið prófsnið, engin gömul próf', () => {
    const h = byId.hag106g;
    expect(h.examFormats.map(f => [f.id, f.name])).toEqual([['blandad', 'Próf á tíma']]);
    expect(h.items.some(i => i.paper)).toBe(false);
  });
});
