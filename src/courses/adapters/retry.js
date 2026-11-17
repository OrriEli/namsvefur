// Rafall sem skilar NaN, Infinity eða undefined í texta er keyrður aftur. Rafalakóðinn er orðréttur úr
// gömlu síðunum og sumir eiga sjaldgæf jaðartilvik (t.d. g-ols í HAG108G þegar hallatalan er nákvæmlega 0).

const BAD = /\b(NaN|Infinity|undefined)\b/;
const texts = r => [r.q, r.e, ...(r.o || []), ...(r.steps || []).map(s => s.body || s.lausn)].join(' ');

export function retry(make, tries = 20) {
  let out;
  for (let i = 0; i < tries; i++) { out = make(); if (!BAD.test(texts(out))) return out; }
  return out;
}
