// Villubanki með dreifðri endurtekningu, einn banki þvert á fög:
//  - rangt svar → hólf 1 (á tíma eftir 1 dag); rangt í hvaða hólfi sem er → aftur í hólf 1
//  - rétt svar þegar atriðið er á tíma → næsta hólf: 1, 3, 7, 16 dagar; rétt í hólfi 16 → út
//  - rétt svar áður en atriðið er á tíma breytir ekki hólfinu
//  - rangt svar þótt merkt væri „Viss“ fær sérmerki (sureWrong) sem fylgir atriðinu þar til það fer út
// Rafalar koma aftur með nýjum tölum, því hver keyrsla er nýtt tilvik sama rafals.

export const BOXES = [1, 3, 7, 16];
export const DAY = 864e5;

/**
 * Skráir svar á atriði og uppfærir bankann. Skilar true ef svarið telst rétt.
 * `pts`/`max`: stig skriflegs dæmis (HAG101G), svo staðan sé hlutfall stiga eins og á gömlu síðunni.
 * `conf`: öryggismat ('viss' | 'halfviss' | 'gisk').
 */
export function recordAnswer(state, gid, score, { passScore = 1, now = Date.now(), pts, max, conf } = {}) {
  const p = state.items[gid] || (state.items[gid] = { n: 0, c: 0, streak: 0 });
  const ok = score >= passScore - 1e-9;
  p.n++; p.c += score; p.last = now;
  if (max !== undefined) { p.p = (p.p || 0) + pts; p.m = (p.m || 0) + max; }
  if (conf) p.conf = conf; else delete p.conf;
  if (ok) {
    p.streak++;
    if (p.box && isDue(p, now)) {
      const i = BOXES.indexOf(p.box);
      if (i < 0 || i === BOXES.length - 1) leaveBank(p);
      else { p.box = BOXES[i + 1]; p.due = now + p.box * DAY; }
    }
  } else {
    p.streak = 0; p.box = BOXES[0]; p.due = now + BOXES[0] * DAY;
    if (conf === 'viss') p.sureWrong = true;
  }
  delete p.hits;
  return ok;
}

function leaveBank(p) { delete p.box; delete p.due; delete p.sureWrong; delete p.hits; }

export const inBank = p => !!(p && p.box);
export const isDue = (p, now = Date.now()) => !!(p && p.box && (p.due ?? 0) <= now);

/** Alþjóðleg auðkenni í bankanum, valkvætt aðeins fyrir eitt fag. */
export function bankIds(state, courseId) {
  return Object.keys(state.items).filter(gid => inBank(state.items[gid]) && (!courseId || gid.startsWith(courseId + ':')));
}

/** Auðkenni sem eru á tíma núna, elst fyrst. */
export function dueIds(state, courseId, now = Date.now()) {
  return bankIds(state, courseId).filter(g => isDue(state.items[g], now)).sort((a, b) => state.items[a].due - state.items[b].due);
}

/** Hvenær næsta atriði verður á tíma (ms), eða null. */
export function nextDue(state, courseId, now = Date.now()) {
  const t = bankIds(state, courseId).map(g => state.items[g].due ?? 0).filter(d => d > now);
  return t.length ? Math.min(...t) : null;
}
