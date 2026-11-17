// Sjálfsmat á köflum Blaðsins (0–10) og forgangsröð flokka: forgangur = (1 − kunnátta) × vægi á prófi.
// Kunnátta er sjálfsmatið (meðaltal kaflanna sem tilheyra flokknum), eða meðaltal þess og árangurs í
// skriflegum dæmum þegar flokkurinn hefur að minnsta kosti 3 æfð dæmi. Virkt í fagi sem hefur `self`
// og `examWeights` (aðeins HAG101G, sjá src/courses/updates/hag101g.js).
//
// Matið er geymt í state.settings.self[fag] = {v: {kafli: 0–10 | null}, at: '17. nóv.', ts}; `ts` er
// tími síðustu breytingar (0 = upphafsgildin), notaður þegar útflutt gögn eru sameinuð.

import { topicStats } from './practice.js';
import { fmtDay } from '../ui/format.js';

const written = e => !e.quick && e.type !== 'card';
const has = x => x !== undefined && x !== null && x !== '';

export const hasSelf = course => !!(course.self && course.examWeights);

/** Sjálfsmat fagsins; upphafsgildin eru sett inn ef ekkert er vistað. */
export function selfOf(course, state) {
  const all = state.settings.self || (state.settings.self = {});
  return all[course.id] || (all[course.id] = { v: { ...course.self.initial }, at: course.self.at, ts: 0 });
}

/** Skráir mat á kafla `n` (null = autt). Gildi utan 0–10 eru færð inn á bilið. */
export function setSelf(course, state, n, value, now = Date.now()) {
  const s = selfOf(course, state);
  const v = value === null || value === '' || value === undefined || Number.isNaN(+value) ? null : Math.max(0, Math.min(10, +value));
  s.v[n] = v; s.at = fmtDay(now); s.ts = now;
  return v;
}

/** Meðalmat kafla flokksins á bilinu 0–1, eða null ef enginn kafli hefur mat. */
export function selfScore(course, state, t) {
  const S = selfOf(course, state).v, T = course.self.sections;
  const v = Object.keys(T).filter(n => T[n] === t).map(n => S[n]).filter(has);
  return v.length ? v.reduce((a, b) => a + +b, 0) / v.length / 10 : null;
}

/** Árangur í skriflegum dæmum flokksins (hlutfall stiga og fjöldi æfðra dæma). */
export const writtenStats = (course, state, t) => topicStats(course, state, t, written);

export function mastery(course, state, t) {
  const w = writtenStats(course, state, t), sc = selfScore(course, state, t);
  if (w.pct !== null && w.seen >= 3) return sc === null ? w.pct : (w.pct + sc) / 2;
  return sc ?? w.pct ?? 0.5;
}

export const topicPriority = (course, state, t) => (1 - mastery(course, state, t)) * course.examWeights[t];

/** Flokkar í forgangsröð, mestur forgangur fyrst (jafnir halda röð flokkanna). */
export function byPriority(course, state) {
  return course.topics.filter(t => !t.review).map(t => t.id).sort((a, b) => topicPriority(course, state, b) - topicPriority(course, state, a));
}

/** Litaflokkur mats á bilinu 0–10: lo undir 4, mid undir 7, annars hi. */
export const selfCls = v => !has(v) ? '' : v < 4 ? 'lo' : v < 7 ? 'mid' : 'hi';
