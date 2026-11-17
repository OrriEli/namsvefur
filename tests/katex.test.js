// Allt TeX í atriðum, rafölum og Blöðum teiknast með KaTeX án villu. HAG101G notaði MathJax á gömlu síðunni.

import { describe, it, expect } from 'vitest';
import katex from 'katex';
import { courses } from './helpers.js';

const texOf = html => [...String(html || '').matchAll(/\\\(([\s\S]*?)\\\)|\\\[([\s\S]*?)\\\]/g)].map(m => [m[1] ?? m[2], m[2] !== undefined]);
const textsOf = r => [r.q, r.e, ...(r.o || []), ...(r.rows || []).map(x => x.t), ...(r.steps || []).flatMap(s => [s.h, s.body]), ...(r.solution ? [r.solution.q, ...r.solution.steps.map(s => s.body)] : [])];

describe.each(courses.map(c => [c.id, c]))('%s', (_, c) => {
  it('allt TeX teiknast', () => {
    const texts = [...c.items.flatMap(textsOf), c.sheet.head, ...c.sheet.sections.map(s => s.html), c.sheet.foot];
    for (const g of c.gens) for (const l of g.levels || [undefined]) for (let i = 0; i < 25; i++) texts.push(...textsOf(g.f(l)));
    const seen = new Set(), bad = [];
    for (const t of texts) for (const [tex, display] of texOf(t)) {
      if (seen.has(tex)) continue; seen.add(tex);
      try { katex.renderToString(tex, { displayMode: display, throwOnError: true, strict: 'ignore', macros: { "\\'": "'" } }); } catch (e) { bad.push(`${e.message.slice(0, 100)} :: ${tex.slice(0, 80)}`); }
    }
    expect(bad).toEqual([]);
  });
});
