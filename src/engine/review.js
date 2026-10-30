// Villubanki, einföld útgáfa (áfangi 1): rangt svar → í bankann, á tíma strax;
// tvö rétt svör í röð á meðan atriðið er í bankanum → út. Dreifð endurtekning kemur í áfanga 4.

/** Skráir svar á atriði og uppfærir bankann. Skilar true ef svarið telst rétt. */
export function recordAnswer(state, gid, score, { passScore = 1, now = Date.now() } = {}) {
  const p = state.items[gid] || (state.items[gid] = { n: 0, c: 0, streak: 0 });
  const ok = score >= passScore - 1e-9;
  p.n++; p.c += score; p.last = now;
  if (ok) {
    p.streak++;
    if (p.box) { p.hits = (p.hits || 0) + 1; if (p.hits >= 2) { delete p.box; delete p.due; delete p.hits; } }
  } else {
    p.streak = 0; p.box = 1; p.due = now; p.hits = 0;
  }
  return ok;
}

export const inBank = p => !!(p && p.box);

/** Alþjóðleg auðkenni í bankanum, valkvætt aðeins fyrir eitt fag. */
export function bankIds(state, courseId) {
  return Object.keys(state.items).filter(gid => inBank(state.items[gid]) && (!courseId || gid.startsWith(courseId + ':')));
}
