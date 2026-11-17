// HAG101G 17. nóv.: sjálfsmat á köflum Blaðsins, forgangsröð = (1 − kunnátta) × vægi á prófi, og ný áætlun.
// Breytingarnar eru í src/courses/updates/hag101g.js og útdrátturinn setur þær í src/courses/hag101g.js.

import { describe, it, expect } from 'vitest';
import { fresh, migrate } from '../src/store/store.js';
import { mergeStates, parseBackup, exportState } from '../src/store/backup.js';
import { importLegacy } from '../src/store/legacy-import.js';
import { entriesOf, weakest } from '../src/engine/practice.js';
import { recordAnswer } from '../src/engine/review.js';
import { hasSelf, selfOf, setSelf, selfScore, mastery, topicPriority, byPriority, selfCls } from '../src/engine/self.js';
import { goHref } from '../src/views/plan.js';
import { render as overview } from '../src/views/overview.js';
import { courses, byId } from './helpers.js';

const c = byId.hag101g;
const NOW = Date.UTC(2026, 10, 17, 20);

describe('HAG101G er lokaprófsútgáfan', () => {
  it('22 kaflar s0–s21 (16 Taylor, 17 einsleitni, 19 hámörkun) og 13 flokkar', () => {
    expect(c.sheet.sections.map(s => s.id)).toEqual(Array.from({ length: 22 }, (_, i) => 's' + i));
    expect(c.sheet.sections[16].title).toMatch(/Taylor/);
    expect(c.sheet.sections[17].title).toMatch(/[Ee]insleit/);
    expect(c.sheet.sections[19].title).toMatch(/Hámörkun/);
    expect(c.topics.map(t => t.id)).toEqual(['fyl', 'akv', 'and', 'jof', 'dif', 'ein', 'hlu', 'mis', 'dul', 'eins', 'tay', 'hes', 'ham']);
  });
  it('sjálfsmat á köflum 1–19, hver kafli í flokki fagsins; vægi á hvern flokk', () => {
    expect(Object.keys(c.self.sections).map(Number)).toEqual(Array.from({ length: 19 }, (_, i) => i + 1));
    expect(Object.values(c.self.sections).every(t => c.topics.some(x => x.id === t))).toBe(true);
    expect(Object.keys(c.examWeights).sort()).toEqual(c.topics.map(t => t.id).sort());
    expect([c.self.initial[16], c.self.initial[15], c.self.initial[6], c.self.at]).toEqual([0, 3, 6.5, '17. nóv.']);
  });
  it('hin fögin fjögur hafa hvorki sjálfsmat né forgangsröð', () => {
    expect(courses.filter(x => x.id !== 'hag101g').some(x => hasSelf(x) || x.self || x.examWeights)).toBe(false);
  });
});

describe('forgangsröð', () => {
  it('með upphafsmatinu: Hámörkun 22, Taylor 12, fólgin föll 7,7', () => {
    const S = fresh();
    expect(weakest(c, S, 5)).toEqual(['ham', 'tay', 'dul', 'jof', 'ein']);
    expect(topicPriority(c, S, 'ham')).toBe(22);
    expect(topicPriority(c, S, 'tay')).toBe(12);
    expect(topicPriority(c, S, 'dul')).toBeCloseTo(7.7);
    expect(selfScore(c, S, 'fyl')).toBeCloseTo((8 + 9 + 8) / 30);
    expect(byPriority(c, S)).toHaveLength(13);
  });

  it('eftir þrjú æfð dæmi vegur æfingin til jafns við matið', () => {
    const S = fresh();
    const ham = entriesOf(c).filter(e => e.topic === 'ham' && !e.quick);
    for (const e of ham.slice(0, 2)) recordAnswer(S, e.gid, 1, { now: NOW, pts: 4, max: 4 });
    expect(mastery(c, S, 'ham')).toBe(0);                 // tvö dæmi: aðeins matið
    recordAnswer(S, ham[2].gid, 1, { now: NOW, pts: 4, max: 4 });
    expect(mastery(c, S, 'ham')).toBe(0.5);               // (1 + 0) / 2
    expect(topicPriority(c, S, 'ham')).toBe(11);
    expect(weakest(c, S, 2)).toEqual(['tay', 'ham']);
    // hraðspurningar teljast ekki með
    for (const e of entriesOf(c).filter(e => e.topic === 'tay' && e.quick).slice(0, 3)) recordAnswer(S, e.gid, 1, { now: NOW });
    expect(mastery(c, S, 'tay')).toBe(0);
  });

  it('án mats í flokki gildir æfingin, annars 0,5', () => {
    const S = fresh();
    setSelf(c, S, '16', null, NOW);
    expect(selfScore(c, S, 'tay')).toBe(null);
    expect(mastery(c, S, 'tay')).toBe(0.5);
    expect(topicPriority(c, S, 'tay')).toBe(6);
  });

  it('hin fögin raða veikustu flokkum eins og áður', () => {
    const S = fresh(), c3 = byId.hag103g;
    expect(weakest(c3, S, 2)).toEqual(c3.topics.filter(t => !t.review).slice(0, 2).map(t => t.id));
  });
});

describe('sjálfsmatið í geymslunni', () => {
  it('upphafsgildin eru sett inn ef ekkert er vistað; breyting er klemmd á 0–10', () => {
    const S = fresh();
    expect(selfOf(c, S)).toMatchObject({ v: { 16: 0, 19: 0, 13: 5 }, at: '17. nóv.', ts: 0 });
    expect(setSelf(c, S, '16', '12', NOW)).toBe(10);
    expect(setSelf(c, S, '17', -3, NOW)).toBe(0);
    expect(setSelf(c, S, '15', '', NOW)).toBe(null);
    expect(setSelf(c, S, '18', '6.5', NOW)).toBe(6.5);
    expect(S.settings.self.hag101g).toMatchObject({ v: { 16: 10, 17: 0, 15: null, 18: 6.5 }, at: '17. nóv.', ts: NOW });
    expect(Object.keys(S.settings.self)).toEqual(['hag101g']);
    expect(S.items).toEqual({});
    expect([selfCls(0), selfCls(3.5), selfCls(4), selfCls(6.5), selfCls(7), selfCls(null)]).toEqual(['lo', 'lo', 'mid', 'mid', 'hi', '']);
  });

  it('eldra ástand fær tómt sjálfsmat; útflutningur og innflutningur halda nýrra matinu', () => {
    expect(migrate({ v: 1, items: {}, settings: { plan: {} } }).settings.self).toEqual({});
    const A = fresh(), B = fresh();
    setSelf(c, A, '16', 4, NOW - 1000);
    setSelf(c, B, '16', 7, NOW);
    mergeStates(A, parseBackup(exportState(B)));
    expect(A.settings.self.hag101g.v[16]).toBe(7);
    setSelf(c, A, '16', 9, NOW + 1000);
    mergeStates(A, parseBackup(exportState(B)));
    expect(A.settings.self.hag101g.v[16]).toBe(9);
  });

  it('matið flyst inn úr vistun sjálfstæðu síðunnar, nema því hafi verið breytt hér', () => {
    const old = { st: {}, qs: {}, wrong: {}, hist: [], self: { 16: 5, 17: 2, 19: 4, 99: 3 }, selfAt: '18. nóv.' };
    const S = fresh();
    importLegacy(S, c, old, { now: NOW });
    expect(S.settings.self.hag101g).toEqual({ v: { 16: 5, 17: 2, 19: 4 }, at: '18. nóv.', ts: 0 });
    setSelf(c, S, '16', 8, NOW);
    importLegacy(S, c, { ...old, self: { 16: 1 } }, { now: NOW });
    expect(S.settings.self.hag101g.v[16]).toBe(8);
  });
});

describe('Yfirlit', () => {
  const draw = (course, S) => { const el = {}; overview({ el, course, store: { state: S }, go() {} }); return el.innerHTML; };
  it('forgangsröð með 5 flokkum, efst Hámörkun; dálkurinn „Mat“ í stað „Séð“', () => {
    const html = draw(c, fresh());
    const items = [...html.matchAll(/<li><span class="mono pn">(\d)<\/span><div style="min-width:0"><b>([^<]+)<\/b><div class="hint">([^<]+)<\/div>/g)];
    expect(items.map(m => m[2])).toEqual(['Hámörkun og umslagssetning', 'Taylor-nálgun', 'Fólgin föll', 'Jöfnukerfi og Cramer', 'Föll af einni breytu og útmörk']);
    expect(items[0][3]).toBe('Sjálfsmat 0/10 · um 22% af prófinu');
    expect(items[2][3]).toBe('Sjálfsmat 3/10 · um 11% af prófinu');
    expect(html).toContain('Sjálfsmatið kemur frá Blaðinu (17. nóv.)');
    expect(html).toContain('<th>Flokkur</th><th class="hide-sm">Vægi</th><th>Mat</th><th>Skrifleg (stig)</th><th class="hide-sm">Hraðæfing</th><th></th>');
    expect(html).not.toContain('<th>Séð</th>');
    expect(html).toContain('<span class="selfpill mid">5,5</span>');           // mis: kaflar 13 og 14 (5 og 6)
    expect(html).toContain('<span class="selfpill hi">7,3</span>');            // akv: kaflar 5 og 6 (8 og 6,5)
    expect(html).toContain('<span class="selfpill lo">0</span>');
    expect(html).toContain('„Mat“ er sjálfsmatið af Blaðinu (0–10). „Skrifleg“ er hlutfall stiga');
    expect(html.indexOf('Forgangsröð')).toBeLessThan(html.indexOf('Staðan eftir flokkum'));
  });
  it('hin fögin fá hvorki forgangsröð né Mat-dálk', () => {
    for (const x of courses.filter(x => x.id !== 'hag101g')) {
      const html = draw(x, fresh());
      expect(html).not.toContain('class="prio"');
      expect(html).not.toContain('selfpill');
    }
  });
});

describe('áætlunin frá 17. nóv.', () => {
  const P = c.plan, S = fresh();
  const all = P.days.flatMap(d => d.items);
  it('10 dagar; fyrsti dagurinn hefur bara athugasemd', () => {
    expect(P.days).toHaveLength(10);
    expect(P.eyebrow).toBe('17. – 25. nóv.');
    expect(P.intro).toMatch(/^Byggð á Google Calendar.*Endurskipulögð 17\. nóv\. eftir sjálfsmatinu/);
    expect(P.days[0]).toMatchObject({ date: '2026-11-12', label: 'Fimmtudagur 12. – mánudagur 16. nóv.', items: [] });
    expect(P.days[0].note).toMatch(/^Sjálfsmatið 17\. nóv\./);
    expect(P.days.map(d => d.date)).toEqual(['2026-11-12', ...Array.from({ length: 9 }, (_, i) => `2026-11-${17 + i}`)]);
  });
  it('„Opna“ fer á réttan stað', () => {
    const at = (date, time) => goHref(c, P.days.find(d => d.date === date).items.find(s => s.at === time).go, S);
    expect(at('2026-11-17', '19:45')).toBe('#/fag/hag101g/bladid?k=s16');
    expect(at('2026-11-17', '20:35')).toBe('#/fag/hag101g/aefing?m=written&t=tay');
    expect(at('2026-11-18', '12:50')).toBe('#/fag/hag101g/aefing?m=quick&t=tay,eins,ham');
    expect(at('2026-11-19', '20:00')).toBe('#/fag/hag101g/aefing?m=written&t=ham&s=old');
    expect(at('2026-11-20', '19:00')).toBe('#/fag/hag101g/aefing?m=written&t=tay,dul&s=gen');
    expect(at('2026-11-21', '10:00')).toBe('#/fag/hag101g/prof?start=L25');
    expect(at('2026-11-21', '13:45')).toBe('#/fag/hag101g/prof');
    expect(at('2026-11-21', '14:45')).toBe('#/fag/hag101g/aefing?m=written&r=1');
    expect(at('2026-11-22', '10:00')).toBe('#/fag/hag101g/aefing?m=written&t=ham,tay');
    expect(at('2026-11-24', '10:00')).toBe('#/fag/hag101g/aefing?r=1');
    expect(at('2026-11-24', '16:00')).toBe('#/fag/hag101g/aefing?m=quick');
  });
  it('allir tenglar vísa á kafla, flokka og próf sem eru til', () => {
    const secs = new Set(c.sheet.sections.map(s => s.id)), tops = new Set(c.topics.map(t => t.id)), fmts = new Set(c.examFormats.map(f => f.id));
    for (const s of all.filter(s => s.go)) {
      if (s.go.sec) expect(secs.has(s.go.sec)).toBe(true);
      for (const t of s.go.topics || []) expect(tops.has(t)).toBe(true);
      if (s.go.start) expect(fmts.has(s.go.start)).toBe(true);
    }
    expect(all.filter(s => s.exam).map(s => s.h)).toEqual(['Lokapróf 2025 á tíma, á pappír', 'Lokapróf 2023 á tíma, á pappír', 'Lokaprófið']);
  });
});
