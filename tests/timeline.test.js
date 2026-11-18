// Dagaröðin á Í dag (endurhönnun, áfangi 3): fag hvers dags, hvenær dagur er búinn og „Á áætlun“.

import { describe, it, expect } from 'vitest';
import { buildStrip, onTrackText, planDays } from '../src/engine/timeline.js';
import { fresh } from '../src/store/store.js';
import { courses } from './helpers.js';
import { EXAMS } from '../src/config.js';

const NOW = Date.UTC(2026, 10, 18, 11);
const M = 60e3;
const strip = (S = fresh(), now = NOW) => buildStrip(courses, S, { now, exams: EXAMS });
const day = (s, d) => s.days.find(x => x.date === d);

describe('dagaröðin', () => {
  it('einn reitur á dag frá fyrsta degi áætlunar (17. nóv.) til síðasta staðfesta prófs (7. des.): 21 dagur', () => {
    const s = strip();
    expect([s.days[0].date, s.days.at(-1).date, s.total]).toEqual(['2026-11-17', '2026-12-07', 21]);
    expect(s.days.filter(d => d.exam).map(d => [d.date, d.course])).toEqual([
      ['2026-11-25', 'hag101g'], ['2026-12-01', 'hag108g'], ['2026-12-04', 'hag107g'], ['2026-12-07', 'hag103g']]);
    expect(s.days.some(d => d.course === 'hag106g')).toBe(false);   // óstaðfest próf er utan raðarinnar
    expect(day(s, '2026-11-18').today).toBe(true);
  });

  it('dagur í áætlun fær fagið með flestar mínútur; hitt fagið er rönd', () => {
    const p = planDays(courses);
    const s = strip();
    for (const [d, list] of Object.entries(p)) {
      const x = day(s, d); if (!x || x.exam) continue;
      expect(x.course).toBe(list[0].course);
      expect(x.stripe).toBe(list[1] ? list[1].course : null);
    }
    expect(day(s, '2026-11-19')).toMatchObject({ course: 'hag101g', stripe: 'hag103g' });
  });

  it('dagur án áætlunar fer á næsta próf, þriðji hver á prófið þar á eftir ef það er innan 7 daga', () => {
    const s = strip();
    const free = s.days.map((d, i) => ({ ...d, i })).filter(d => !d.plan && !d.exam);
    expect(free.length).toBeGreaterThan(0);
    const up = EXAMS.filter(x => x.at && x.kind === 'loka').map(x => ({ c: x.course, d: x.at.slice(0, 10) })).sort((a, b) => a.d.localeCompare(b.d));
    for (const d of free) {
      const next = up.filter(x => x.d >= d.date);
      const alt = d.i % 3 === 2 && next[1] && (Date.parse(next[1].d) - Date.parse(d.date)) / 864e5 <= 7;
      expect(d.course).toBe(alt ? next[1].c : next[0].c);
    }
  });

  it('dagur er búinn eftir 25 mín. í fagi dagsins eða þegar áætlun dagsins er öll hökuð', () => {
    const S = fresh();
    const t17 = Date.UTC(2026, 10, 17, 20);
    S.sessions.push({ course: 'hag103g', kind: 'practice', start: t17 - 24 * M, end: t17, n: 10, c: 8 });
    expect(day(strip(S), '2026-11-17').done).toBe(false);          // 24 mín.
    S.sessions.push({ course: 'hag103g', kind: 'practice', start: t17 + M, end: t17 + 2 * M, n: 1, c: 1 });
    expect(day(strip(S), '2026-11-17').done).toBe(true);           // 25 mín.
    const d18 = day(strip(S), '2026-11-18');
    expect(d18.done).toBe(false);
    S.settings.plan.hag101g = { done: Object.fromEntries(d18.plan.items.map(x => [x.key, true])) };
    expect(day(strip(S), '2026-11-18').done).toBe(true);
    // æfing í öðru fagi telur ekki
    const S2 = fresh(); S2.sessions.push({ course: 'hag108g', kind: 'practice', start: t17 - 60 * M, end: t17, n: 20, c: 15 });
    expect(day(strip(S2), '2026-11-17').done).toBe(false);
  });

  it('Á áætlun: liðnir dagar sem eru ekki búnir eru lotur á eftir', () => {
    const S = fresh();
    let s = strip(S);
    expect([s.done, s.total, s.behind]).toEqual([0, 21, 1]);
    expect(onTrackText(s)).toBe('Einni lotu á eftir: taktu tvær í dag.');
    S.sessions.push({ course: 'hag103g', kind: 'practice', start: Date.UTC(2026, 10, 17, 19), end: Date.UTC(2026, 10, 17, 20), n: 30, c: 20 });
    s = strip(S);
    expect([s.done, s.behind, onTrackText(s)]).toEqual([1, 0, 'Þú ert á áætlun.']);
    s = strip(fresh(), Date.UTC(2026, 10, 21, 11));
    expect(s.behind).toBe(4);
    expect(onTrackText(s)).toBe('Fjórum lotum á eftir: bættu einni við á dag næstu 4 daga.');
  });

  it('prófdagur er búinn þegar prófinu er lokið; engin röð eftir síðasta prófið', () => {
    expect(day(strip(fresh(), Date.UTC(2026, 10, 25, 17)), '2026-11-25').done).toBe(true);
    expect(day(strip(fresh(), Date.UTC(2026, 10, 25, 12)), '2026-11-25').done).toBe(false);
    expect(strip(fresh(), Date.UTC(2026, 11, 8))).toBe(null);
  });
});
