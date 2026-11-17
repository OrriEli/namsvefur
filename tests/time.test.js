// Tími í próf: eitt fall (engine/time.js) sem niðurtalningin, Fögin, Í dag og tillagan nota öll.

import { describe, it, expect } from 'vitest';
import { daysUntil, timeToExam, examDateText } from '../src/engine/time.js';
import { countdownShort, countdownTxt } from '../src/ui/countdown.js';
import { daysTo } from '../src/engine/today.js';
import { durText } from '../src/ui/format.js';
import { formatMeta } from '../src/views/exam.js';
import { byId } from './helpers.js';

const at = '2026-11-25T13:30:00Z';
const exam = { label: 'Lokapróf', at, minutes: 180 };
const T = s => Date.parse(s);

describe('dagar í próf', () => {
  it('almanaksdagar, óháð tíma dags', () => {
    expect(daysUntil(at, T('2026-11-17T08:00:00Z'))).toBe(8);
    expect(daysUntil(at, T('2026-11-17T23:59:00Z'))).toBe(8);
    expect(daysUntil(at, T('2026-11-24T23:59:00Z'))).toBe(1);
    expect(daysUntil(at, T('2026-11-25T08:00:00Z'))).toBe(0);
    expect(daysUntil(null)).toBe(null);
  });
  it('texti: eftir n daga, á morgun, í dag, í gangi, lokið, óstaðfest', () => {
    expect(timeToExam(exam, T('2026-11-17T20:00:00Z')).text).toBe('eftir 8 daga');
    expect(timeToExam({ ...exam, at: '2026-12-08T13:30:00Z' }, T('2026-11-17T20:00:00Z')).text).toBe('eftir 21 dag');
    expect(timeToExam(exam, T('2026-11-24T20:00:00Z')).text).toBe('á morgun');
    expect(timeToExam(exam, T('2026-11-25T09:00:00Z')).text).toBe('í dag kl. 13:30');
    expect(timeToExam(exam, T('2026-11-25T14:00:00Z')).text).toBe('í gangi');
    expect(timeToExam(exam, T('2026-11-25T17:00:00Z')).text).toBe('lokið');
    expect(timeToExam({ label: 'Lokapróf', at: null }).text).toBe('óstaðfest');
    expect(examDateText(at)).toBe('mið. 25. nóv. kl. 13:30');
  });
  it('niðurtalningin og forgangurinn segja sama fjölda daga (áður „7 d.“ og „8 daga“)', () => {
    const now = T('2026-11-17T20:00:00Z');
    expect(countdownShort(exam, now)).toBe('Lokapróf eftir <b>8 daga</b> · mið. 25. nóv. kl. 13:30');
    expect(countdownTxt(exam, now)).toContain('Lokapróf eftir <b>8 daga</b>');
    expect(daysTo(exam, now)).toBe(8);
    expect(countdownShort({ label: 'Lokapróf', at: null }, now)).toBe('Lokapróf · óstaðfest');
  });
});

describe('prófmerki', () => {
  it('lengd í orðum', () => {
    expect([durText(180), durText(90), durText(45), durText(72)]).toEqual(['3 klst.', '1 klst. 30 mín.', '45 mín.', '1 klst. 12 mín.']);
  });
  it('„6 dæmi · 3 klst.“ í HAG101G og spurningar í krossaprófum', () => {
    const c = byId.hag101g, f = c.examFormats[0];
    expect(formatMeta(c, f)).toBe('6 dæmi · 3 klst.');
    expect(formatMeta(byId.hag103g, byId.hag103g.examFormats[0])).toBe('50 spurningar · 3 klst.');
    expect(formatMeta(byId.hag103g, byId.hag103g.examFormats.find(x => /41/.test(formatMeta(byId.hag103g, x))))).toBe('41 spurning · 2 klst. 28 mín.');
  });
});
