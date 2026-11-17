// Áfangi 5: Vikan, leit í Blöðunum, útflutningur og innflutningur, og viðmiðið: vistun úr gömlu
// HAG103G-síðunni flyst inn og birtist rétt í kunnáttukortinu.

import { describe, it, expect } from 'vitest';
import { join } from 'node:path';
import { loadLegacy } from '../scripts/lib/load-legacy.js';
import { META } from '../scripts/extract-legacy.js';
import { fresh, logActivity } from '../src/store/store.js';
import { parseLegacy, importLegacy } from '../src/store/legacy-import.js';
import { exportState, parseBackup, mergeStates } from '../src/store/backup.js';
import { weekSummary, weekText } from '../src/engine/stats.js';
import { buildIndex, search, fold, sectionText } from '../src/engine/sheets.js';
import { recordAnswer } from '../src/engine/review.js';
import { knowledgeMap } from '../src/views/today.js';
import { courses, byId, ROOT } from './helpers.js';

const D = 864e5, M = 60e3;
const NOW = Date.UTC(2026, 10, 17, 20);

describe('viðmið: gamla HAG103G-vistunin birtist rétt í kunnáttukortinu', () => {
  it('hlutfall hvers flokks í kortinu = hlutfall gömlu síðunnar', () => {
    const V = loadLegacy(join(ROOT, 'legacy', META.hag103g.file)).vars;
    let seed = 3; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    for (let i = 0; i < 300; i++) { const e = V.ENTRIES[Math.floor(rnd() * V.ENTRIES.length)]; V.record(V.instantiate(e.key), rnd() < 0.65); }
    const S = fresh();
    importLegacy(S, byId.hag103g, parseLegacy(JSON.stringify(V.S), 'hag103g'));
    const html = knowledgeMap(S, NOW);
    for (const t of byId.hag103g.topics) {
      const legacyStat = V.topicStats(t.id);
      const label = [...html.matchAll(/aria-label="([^"]*)"/g)].map(m => m[1]).find(l => l.startsWith(`HAG103G ${t.name}:`));
      const want = legacyStat.pct === null ? 'ósnert' : `${Math.round(legacyStat.pct * 100)}% rétt`;
      expect(label).toContain(want);
    }
  });
});

describe('lotur og Vikan', () => {
  it('lota telst frá því atriðið birtist, mest 15 mín. aftur í tímann, og telur „Viss“-svör', () => {
    const S = fresh();
    logActivity(S, 'hag101g', 'practice', 1, NOW, { from: NOW - 5 * M, conf: 'viss', ok: true });
    logActivity(S, 'hag101g', 'practice', 0, NOW + 4 * M, { from: NOW + M, conf: 'viss', ok: false });
    logActivity(S, 'hag108g', 'practice', 1, NOW, { from: NOW - 60 * M });
    expect(S.sessions[0]).toMatchObject({ start: NOW - 5 * M, end: NOW + 4 * M, n: 2, c: 1, sure: 2, sureWrong: 1 });
    expect(S.sessions[1].start).toBe(NOW - 15 * M);
  });

  it('mínútur, atriði og rétt á fag, borið saman við vikuna á undan', () => {
    const S = fresh();
    S.sessions.push({ course: 'hag101g', kind: 'practice', start: NOW - D - 30 * M, end: NOW - D, n: 10, c: 7, sure: 4, sureWrong: 1 });
    S.sessions.push({ course: 'hag101g', kind: 'exam', start: NOW - 2 * D - 180 * M, end: NOW - 2 * D, n: 7, c: 3.5 });
    S.sessions.push({ course: 'hag101g', kind: 'practice', start: NOW - 9 * D - 20 * M, end: NOW - 9 * D, n: 8, c: 4 });
    S.sessions.push({ course: 'hag108g', kind: 'practice', start: NOW - 20 * D, end: NOW - 20 * D + 10 * M, n: 5, c: 5 });
    const w = weekSummary(S, courses, NOW);
    const r = w.rows.find(x => x.course.id === 'hag101g');
    expect([Math.round(r.minutes), r.n, r.c]).toEqual([210, 17, 10.5]);
    expect([Math.round(r.prev.minutes), r.prev.n, r.prev.pct]).toEqual([20, 8, 0.5]);
    expect(w.rows.find(x => x.course.id === 'hag108g').n).toBe(0);
    expect([w.total.sure, w.total.sureWrong]).toEqual([4, 1]);
    expect(w.days.reduce((s, d) => s + d.minutes, 0)).toBeCloseTo(210);
    const txt = weekText(w, 'Tvö full próf');
    expect(txt).toContain('Samtals: 210 mín., 17 atriði, 62% rétt');
    expect(txt).toContain('HAG101G Stærðfræði: 210 mín., 17 atriði, 62% rétt (↑ 190 mín., ↑ 12 prósentustig)');
    expect(txt).toContain('Viss en rangt: 1 af 4');
    expect(txt).toContain('Markmið næstu viku: Tvö full próf');
    expect(txt).not.toContain('HAG108G');
  });
});

describe('leit í Blöðunum', () => {
  const index = buildIndex(courses);
  it('„núvirði“ finnur kaflann í HAG103G; „nuvirdi“ finnur það sama án kommu og ð', () => {
    const a = search(index, 'núvirði'), b = search(index, 'nuvirdi');
    expect(a.map(r => `${r.course.id} ${r.section.n}`)).toContain('hag103g 03');
    expect(b.map(r => r.section.id)).toEqual(a.map(r => r.section.id));
  });
  it('stofninn „núvirð“ finnur líka HAG106G (þar stendur „núvirt“, ekki „núvirði“)', () => {
    const r = search(index, 'núvirð');
    expect(r.some(x => x.course.id === 'hag106g')).toBe(true);
    expect(r.every(x => x.snippets[0].match.toLowerCase() === 'núvirð')).toBe(true);
  });
  it('„Hessian“ finnur kafla í HAG101G', () => {
    const r = search(index, 'Hessian');
    expect(r.some(x => x.course.id === 'hag101g' && /Hessian/.test(x.section.title) && x.inTitle)).toBe(true);
  });
  it('öll orð þurfa að finnast; of stutt leit skilar engu', () => {
    expect(search(index, 'núvirði xyzzyq')).toEqual([]);
    expect(search(index, 'a')).toEqual([]);
  });
  it('fellingin heldur lengd og texti kafla er án merkja', () => {
    for (const s of ['Núvirði', 'Þjóðarframleiðsla', 'Æðarfugl', 'F7–F8 𝐴']) expect(fold(s).length).toBe(s.length);
    expect(sectionText('<p>Gildi \\(x^2\\) &amp; <b>meira</b></p>')).toBe('Gildi x2 & meira');
  });
});

describe('útflutningur og innflutningur', () => {
  it('flytur út og les aftur', () => {
    const S = fresh(); recordAnswer(S, 'hag103g:H25-1', 0, { now: NOW });
    const back = parseBackup(exportState(S, NOW));
    expect(back.items['hag103g:H25-1']).toMatchObject({ n: 1, box: 1 });
    expect(() => parseBackup('{"a":1}')).toThrow();
    expect(() => parseBackup('ekki json')).toThrow();
  });

  it('sameinar og skrifar ekki yfir nýrri gögn', () => {
    const A = fresh(), B = fresh();
    recordAnswer(A, 'hag101g:L25-1', 1, { now: NOW });            // nýrra hér
    recordAnswer(B, 'hag101g:L25-1', 0, { now: NOW - D });
    recordAnswer(B, 'hag101g:L25-2', 0, { now: NOW - D });        // aðeins í B
    recordAnswer(A, 'hag107g:x', 0, { now: NOW - 2 * D });
    recordAnswer(B, 'hag107g:x', 1, { now: NOW - D });            // nýrra í B
    A.sessions.push({ course: 'hag101g', kind: 'practice', start: 1, end: 5, n: 2, c: 1 });
    B.sessions.push({ course: 'hag101g', kind: 'practice', start: 1, end: 9, n: 3, c: 2 }, { course: 'hag108g', kind: 'exam', start: 7, end: 8, n: 1, c: 1 });
    B.hist.push({ course: 'hag103g', at: 5, label: 'Blandað', score: 1, max: 2 });
    B.settings.weekGoal = { text: 'B', at: 10 }; A.settings.weekGoal = { text: 'A', at: 20 };
    B.settings.plan.hag103g = { done: { '0-1': true } };
    const r = mergeStates(A, parseBackup(exportState(B)));
    expect(r).toEqual({ items: 1, updated: 1, sessions: 1, hist: 1 });
    expect(A.items['hag101g:L25-1'].c).toBe(1);
    expect(A.items['hag107g:x'].c).toBe(1);
    expect(A.items['hag101g:L25-2']).toBeDefined();
    expect(A.sessions.find(s => s.start === 1)).toMatchObject({ end: 9, n: 3 });
    expect(A.settings.weekGoal.text).toBe('A');
    expect(A.settings.plan.hag103g.done['0-1']).toBe(true);
    // endurtekinn innflutningur breytir engu
    expect(mergeStates(A, parseBackup(exportState(B)))).toEqual({ items: 0, updated: 0, sessions: 0, hist: 0 });
  });
});
