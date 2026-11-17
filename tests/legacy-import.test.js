// Innflutningur gömlu sögunnar: gömlu síðurnar skrá svör í vm-umhverfi, vistunin er afrituð eins og Orri
// gerir (JSON-strengur) og flutt inn. Staðan á nýja vefnum á að vera sú sama og á gömlu síðunni.

import { describe, it, expect } from 'vitest';
import { join } from 'node:path';
import { loadLegacy } from '../scripts/lib/load-legacy.js';
import { META } from '../scripts/extract-legacy.js';
import { fresh } from '../src/store/store.js';
import { parseLegacy, importLegacy, LEGACY_KEYS, consoleCommand } from '../src/store/legacy-import.js';
import { recordAnswer, inBank, bankIds } from '../src/engine/review.js';
import { topicStats } from '../src/engine/practice.js';
import { byId, ROOT } from './helpers.js';

let seed = 11; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;

/** Keyrir gömlu síðuna og lætur hana sjálfa skrá ~120 svör. Skilar vistuninni sem JSON-streng. */
function legacySave(id) {
  const V = loadLegacy(join(ROOT, 'legacy', META[id].file)).vars;
  const pick = list => list[Math.floor(rnd() * list.length)];
  for (let i = 0; i < 120; i++) {
    if (id === 'hag101g') {
      if (rnd() < 0.5) { const e = pick(V.W_ENTRIES); const it = V.instW(e.key); const m = it.steps.reduce((s, x) => s + x.stig, 0); V.recordW(it, rnd() < 0.5 ? m : Math.floor(m / 2), m); }
      else { const e = pick(V.Q_ENTRIES); V.recordQ(V.instQ(e.key), rnd() < 0.6); }
    } else if (V.BANK) {
      const e = pick(V.ENTRIES); V.record(e.key, rnd() < 0.3 ? 0.5 : rnd() < 0.6 ? 1 : 0);
    } else {
      const e = pick(V.ENTRIES); V.record(V.instantiate(e.key), rnd() < 0.6);
    }
  }
  if (V.S.cards !== undefined) { const c = V.CARDS.slice(0, 3); V.S.cards[c[0].id] = { seen: 2, again: true }; V.S.cards[c[1].id] = { seen: 1 }; }
  if (id === 'hag101g') V.S.hist.push({ label: 'Lokapróf 2025', score: 61.5, tot: 100, at: 1794000000000 });
  else if (V.BANK) V.S.hist.push({ label: 'Eins og prófið · allir fyrirlestrar', pct: 0.62, at: 1794000000000 });
  else V.S.hist.push({ label: 'Blandað próf', n: 20, c: 13, at: 1794000000000 });
  return { raw: JSON.stringify(V.S), V };
}

describe.each(['hag101g', 'hag103g', 'hag106g', 'hag107g', 'hag108g'])('%s', id => {
  const c = byId[id];
  const { raw, V } = legacySave(id);
  const old = JSON.parse(raw);

  it('tilraunir, rétt og villubanki eins og á gömlu síðunni', () => {
    const S = fresh();
    const sum = importLegacy(S, c, parseLegacy(raw, id));
    expect(sum.skipped).toBe(0);
    for (const [k, r] of Object.entries({ ...old.st, ...(old.qs || {}) })) {
      const p = S.items[`${id}:${k}`];
      expect(p.n).toBe(r.n);
      expect(p.c).toBeCloseTo(r.m !== undefined ? r.n * r.p / r.m : r.c);
    }
    expect(bankIds(S, id).map(g => g.slice(id.length + 1)).sort()).toEqual(Object.keys(old.wrong).sort());
    expect(S.hist).toHaveLength(1);
    expect(S.hist[0].score / S.hist[0].max).toBeCloseTo(id === 'hag101g' ? 0.615 : V.BANK ? 0.62 : 0.65);
    if (old.cards) expect(Object.keys(old.cards).every(k => S.items[`${id}:${k}`].n === old.cards[k].seen)).toBe(true);
  });

  it('staðan eftir flokkum = gömlu síðunnar', () => {
    const S = fresh(); importLegacy(S, c, parseLegacy(raw, id));
    for (const t of c.topics) {
      const filter = id === 'hag101g' ? e => !e.quick : undefined;
      const s = topicStats(c, S, t.id, filter);
      if (id === 'hag101g') { const w = V.statsW(t.id); expect(s.seen).toBe(w.seen); if (w.pct !== null) expect(s.pct).toBeCloseTo(w.pct); }
      else if (V.BANK) { let n = 0, k = 0; for (const l of [1, 2, 3]) { const x = V.cellStats(t.id, l); n += x.n; k += x.c; } expect(s.n).toBe(n); expect(s.c).toBeCloseTo(k); }
      else { const x = V.topicStats(t.id); expect([s.n, s.seen]).toEqual([x.n, x.seen]); expect(s.c).toBeCloseTo(x.c); }
    }
  });

  it('endurtekinn innflutningur tvítelur ekki og æfing á nýja vefnum helst', () => {
    const S = fresh(); importLegacy(S, c, parseLegacy(raw, id));
    const [k] = Object.keys(old.st); const gid = `${id}:${k}`;
    const before = { ...S.items[gid] };
    recordAnswer(S, gid, 1);
    importLegacy(S, c, parseLegacy(raw, id));
    expect(S.items[gid].n).toBe(before.n + 1);
    expect(S.items[gid].c).toBeCloseTo(before.c + 1);
    expect(S.hist).toHaveLength(1);
  });
});

describe('innlestur', () => {
  const raw = JSON.stringify({ st: { 'H25-1': { n: 2, c: 1, s: 0, t: 'rei' } }, wrong: { 'H25-1': 0 } });
  it('tekur við hráu gildi, gildi í gæsalöppum og {lykill: gildi}', () => {
    expect(parseLegacy(raw, 'hag103g').st['H25-1'].n).toBe(2);
    expect(parseLegacy(JSON.stringify(raw), 'hag103g').st['H25-1'].n).toBe(2);
    expect(parseLegacy(JSON.stringify({ 'hag103g-hlutaprof-v1': raw }), 'hag103g').st['H25-1'].n).toBe(2);
  });
  it('hafnar öðru en vistun gömlu síðunnar', () => {
    expect(() => parseLegacy('ekki json', 'hag103g')).toThrow();
    expect(() => parseLegacy('{"a":1}', 'hag103g')).toThrow();
    expect(() => parseLegacy('null', 'hag103g')).toThrow();
  });
  it('atriði sem eru ekki lengur til er sleppt', () => {
    const S = fresh();
    const sum = importLegacy(S, byId.hag103g, { st: { 'H25-1': { n: 1, c: 0, s: 0 }, 'ekki-til': { n: 3, c: 3, s: 3 } }, wrong: { 'H25-1': 0 } });
    expect([sum.items, sum.skipped]).toEqual([1, 1]);
    expect(inBank(S.items['hag103g:H25-1'])).toBe(true);
  });
  it('skipunin les alla lykla fagsins', () => {
    for (const id of Object.keys(LEGACY_KEYS)) for (const k of LEGACY_KEYS[id]) expect(consoleCommand(id)).toContain(`'${k}'`);
  });
});
