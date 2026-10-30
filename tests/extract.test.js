// Útdrátturinn: fjöldi stemmir við úttektina, textinn er orðréttur og skrárnar eru nýjar.

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { extract } from '../scripts/extract-legacy.js';
import { renderToHtml } from '../scripts/lib/load-legacy.js';
import { courses, legacy, inventoryCounts, squash, ROOT } from './helpers.js';

const counts = inventoryCounts();

describe.each(courses.map(c => [c.id, c]))('%s', (id, c) => {
  const L = legacy(id);

  it('fjöldi atriða, rafala og kafla = úttektin', () => {
    const k = counts[id];
    expect(c.items.filter(i => i.type === 'mc').length).toBe(k.mc);
    expect(c.items.filter(i => i.source === 'old').length).toBe(k.old);
    expect(c.items.filter(i => i.source === 'new').length).toBe(k.new);
    expect(c.items.length).toBe(k.old + k.new);
    expect(c.gens.length).toBe(k.gens);
    expect(c.sheet.sections.length).toBe(k.sheetSections);
  });

  it('hvert atriði er orðrétt eins og á gömlu síðunni', () => {
    const old = L.vars.STATIC;
    expect(c.items.map(i => i.id)).toEqual(old.map(q => q.id));
    c.items.forEach((it, i) => {
      const q = old[i];
      expect(it).toEqual({ id: q.id, type: 'mc', topic: q.t, source: q.kind, src: q.src, q: q.q, o: q.o, a: q.a, e: q.e });
    });
  });

  it('rafalarnir eru þeir sömu', () => {
    expect(c.gens.map(g => [g.id, g.name, g.topic])).toEqual(L.vars.GENS.map(g => [g.id, g.name, g.t]));
  });

  it('Blaðið sett saman = það sem gamla síðan teiknaði', () => {
    const html = `<div class="sheet">${c.sheet.head}${c.sheet.sections.map(s => s.html).join('')}${c.sheet.foot || ''}</div>`;
    expect(squash(html)).toBe(squash(renderToHtml(L, 'renderSheet')));
  });

  it('skrárnar í src/courses eru óbreyttar frá útdrættinum', () => {
    const fresh = extract(id);
    const { gens, ...data } = c;
    expect(JSON.parse(JSON.stringify(fresh.course))).toEqual(JSON.parse(JSON.stringify(data)));
    expect(readFileSync(join(ROOT, 'src', 'courses', `${id}.gens.js`), 'utf8')).toBe(fresh.gensModule);
  });
});
