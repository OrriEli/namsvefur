// Útdrátturinn: fjöldi stemmir við úttektina, textinn er orðréttur og skrárnar eru nýjar.

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { extract, stylesheets, UPDATES } from '../scripts/extract-legacy.js';
import { renderToHtml } from '../scripts/lib/load-legacy.js';
import { entriesOf } from '../src/engine/practice.js';
import { courses, legacy, inventoryCounts, squash, tally, ROOT } from './helpers.js';

const counts = inventoryCounts();
const SOURCE_OF = { old: 'old', new: 'new', blad: 'sheet', db: 'sheet', hv: 'sheet', gl: 'slides', mid: 'old', ny: 'new' };

// Gömlu síðurnar + breytingarnar í src/courses/updates/ = fögin. Hér er borið saman við gömlu síðurnar, svo það
// sem breytingarnar bæta við (HAG108G: gömlu prófin og kaflinn um snið prófsins) er tekið frá.
describe.each(courses.map(c => [c.id, { ...c, items: c.items.filter(i => !i.paper), sheet: { ...c.sheet, sections: c.sheet.sections.filter(s => !((UPDATES[c.id] || {}).sheetSections || { prepend: [] }).prepend.some(p => p.id === s.id)) } }]))('%s', (id, c) => {
  const V = legacy(id).vars;

  it('fjöldi atriða, rafala, færslna og kafla = úttektin', () => {
    const k = counts[id];
    expect(c.items.length).toBe(k.items);
    expect(tally(c.items.map(i => i.type))).toEqual(k.byType);
    expect(tally(c.items.filter(i => !i.quick).map(i => i.source))).toEqual(k.bySource);
    expect(c.gens.length).toBe(k.gens);
    expect(entriesOf(c).filter(e => e.type !== 'card' && !e.paper).length).toBe(k.entries);
    expect(c.sheet.sections.length).toBe(k.sheetSections);
  });

  it('hvert atriði er orðrétt eins og á gömlu síðunni', () => {
    const by = Object.fromEntries(c.items.map(i => [i.id, i]));
    if (c.engine === 'mcq') {
      expect(c.items.map(i => i.id)).toEqual(V.STATIC.map(q => q.id));
      for (const q of V.STATIC) {
        const it = by[q.id];
        expect([it.topic, it.source, it.src, it.q, it.e]).toEqual([q.t, q.kind, q.src, q.q, q.e]);
        const ty = q.ty || 'mc';
        expect(it.type).toBe(ty);
        if (ty === 'mc' || ty === 'multi') expect([it.o, it.a]).toEqual([q.o, q.a]);
        if (ty === 'match') expect([it.rows, it.cols, !!it.ord]).toEqual([q.rows, q.cols, !!q.ord]);
        if (ty === 'num') expect(it.parts.map(p => [p.l, p.ans])).toEqual(q.p.map(p => [p.l, p.a]));
        if (V.maxPts) expect(it.pts).toBe(V.maxPts({ ...q, ty }));
      }
    }
    if (c.engine === 'lecture') {
      expect(c.items.map(i => i.id)).toEqual(V.BANK.map(q => q.id));
      for (const q of V.BANK) {
        const it = by[q.id];
        expect([it.q, it.src, it.level, it.source]).toEqual([q.q, q.src, q.lvl, SOURCE_OF[q.from]]);
        if (q.kind === 'mc') expect([it.o, it.a, it.e]).toEqual([q.o, q.a, q.e]);
        if (q.kind === 'num') expect([it.ans, it.tol, it.unit, !!it.prob, it.e]).toEqual([q.ans, q.tol, q.unit, !!q.prob, q.e]);
        if (q.kind === 'step') expect(it.steps).toEqual(q.steps.map(s => ({ h: s.h, body: s.e, p: s.p })));
        if (q.kind === 'card') expect([it.e, it.keys]).toEqual([q.back, q.keys]);
      }
    }
    if (c.engine === 'written') {
      for (const p of V.STATIC) {
        const it = by[p.id];
        expect([it.topic, it.source, it.src, it.q, it.examWeight]).toEqual([p.t, SOURCE_OF[p.kind], p.src, p.q, p.exam]);
        expect(it.steps).toEqual(p.steps.map(s => ({ h: s.titill, body: s.lausn, p: s.stig })));
      }
      for (const p of V.QUICK) {
        const it = by[p.id];
        expect([it.quick, it.q, it.src, it.topic]).toEqual([true, p.q, p.src, p.t]);
        if (p.o) expect([it.type, it.o[it.a]]).toEqual(['mc', p.o[p.a]]);
        else expect([it.type, it.exact]).toEqual(['num', p.a]);
      }
    }
  });

  it('rafalarnir eru þeir sömu', () => {
    const legacyGens = [...V.GENS, ...(V.GENS2 || [])];
    const ids = c.engine === 'written' ? [...legacyGens.map(g => g.id), ...V.QGENS.map(g => 'q:' + g.id)] : legacyGens.map(g => g.id);
    expect(c.gens.map(g => g.id)).toEqual(ids);
  });

  it('Blaðið sett saman = það sem gamla síðan teiknaði', () => {
    const html = `<div class="sheet">${c.sheet.head}${c.sheet.sections.map(s => s.html).join('')}${c.sheet.foot || ''}</div>`;
    const old = (UPDATES[id] && UPDATES[id].replace || []).reduce((h, r) => h.replace(r.from, r.to), renderToHtml(legacy(id), 'renderSheet'));
    expect(squash(html)).toBe(squash(old));
  });

  it('skrárnar í src/courses eru óbreyttar frá útdrættinum', async () => {
    const fresh = extract(id);
    const mod = await import(`../src/courses/${id}.js`);
    expect(JSON.parse(JSON.stringify(fresh.course))).toEqual(JSON.parse(JSON.stringify(mod.meta)));
    expect(readFileSync(join(ROOT, 'src', 'courses', 'legacy', `${id}.js`), 'utf8')).toBe(fresh.legacyModule);
  });
});

it('stílarnir eru óbreyttir frá útdrættinum', () => {
  const css = stylesheets();
  expect(readFileSync(join(ROOT, 'src', 'ui', 'base.css'), 'utf8')).toBe(css.base);
  expect(readFileSync(join(ROOT, 'src', 'ui', 'legacy.css'), 'utf8')).toBe(css.legacy);
});
