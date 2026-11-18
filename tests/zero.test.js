// Tómt ástand (endurhönnun, áfangi 6): engin „–“ eða „0/345“ sem aðalskilaboð; villubankinn í fjórum hólfum.

import { describe, it, expect } from 'vitest';
import { fresh } from '../src/store/store.js';
import { recordAnswer } from '../src/engine/review.js';
import { progressBars } from '../src/ui/dom.js';
import { boxesHTML, mountWrong } from '../src/views/wrong.js';
import { mountWeek } from '../src/views/week.js';
import { render as overview } from '../src/views/overview.js';
import { byId } from './helpers.js';

const D = 864e5, NOW = Date.UTC(2026, 10, 18, 12);
const store = S => ({ state: S, save() {} });
const draw = (fn, S) => { const el = {}; fn(el, store(S)); return el.innerHTML; };

describe('tómt ástand', () => {
  it('„Ekki byrjað“ í stað „séð 0/345 · rétt –“', () => {
    expect(progressBars({ seen: 0, total: 345, pct: null })).toBe('<p class="pempty">Ekki byrjað · 345 atriði bíða</p>');
    const h = progressBars({ seen: 12, total: 345, pct: 0.5 });
    expect(h).toContain('12 af 345');
    expect(h).toContain('50%');
  });

  it('tómur villubanki er boð: „Villur sem þú gerir lenda hér“ og „Byrja að æfa“', () => {
    const html = draw(mountWrong, fresh());
    expect(html).toContain('Villur sem þú gerir lenda hér');
    expect(html).toMatch(/<a class="btn primary" href="#\/fag\/\w+\/aefing">Byrja að æfa<\/a>/);
    expect(html).not.toMatch(/0 villur|0 á tíma/);
  });

  it('tóm vika er boð, ekki núll og strik', () => {
    const html = draw(mountWeek, fresh());
    expect(html).toContain('Vikan fyllist þegar þú æfir');
    expect(html).not.toMatch(/>–</);
  });

  it('ósnert fag: reitir segja „Byrja“, engin „–“', () => {
    const el = {}; overview({ el, course: byId.hag106g, store: store(fresh()), go() {} });
    expect(el.innerHTML).toContain('<span class="pc new">Byrja</span>');
    expect(el.innerHTML.replace('<kbd>1</kbd>–<kbd>9</kbd>', '')).not.toMatch(/>–</);   // bilið 1–9 í lyklaskýringunni er ekki tómt gildi
  });
});

describe('villubankinn í fjórum hólfum', () => {
  it('fjöldi í hólfum 1, 3, 7 og 16 daga og hve margir eru á tíma', () => {
    const S = fresh(), g = i => `hag103g:x${i}`;
    for (let i = 0; i < 5; i++) recordAnswer(S, g(i), 0, { now: NOW - 2 * D });   // hólf 1, á tíma
    recordAnswer(S, g(9), 0, { now: NOW - 4 * D }); recordAnswer(S, g(9), 1, { now: NOW - 3 * D });   // hólf 3, á tíma
    const html = boxesHTML(S, NOW);
    const n = [...html.matchAll(/<b class="bx-n">(\d+)<\/b>/g)].map(m => +m[1]);
    expect(n).toEqual([5, 1, 0, 0]);
    expect([...html.matchAll(/(\d+) á tíma/g)].map(m => +m[1])).toEqual([5, 1]);
    expect(html).toContain('Kemur aftur eftir <b>1 dag</b>');
    expect(html).toContain('Svo eftir <b>16 daga</b>');
    expect(boxesHTML(fresh(), NOW)).toContain('class="boxes empty"');
  });
});
