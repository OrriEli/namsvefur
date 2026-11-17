// „Í dag“: forgangur faga og tillaga að lærdómsblokk. Hrein föll; `now`, prófdagar og stillingar eru færibreytur.
//
// Forgangur fags = nálægð prófs × veikleiki.
//   nálægð  = 1 / min(dagar í próf, 14), og 1/14 ef prófið er óstaðfest. Próf sem eru 14 daga eða lengra
//             í burtu fá öll sama grunnvægi; nær prófi vex vægið. Liðið próf gefur 0.
//   veikleiki = 1 − hlutfall réttra svara síðustu 14 daga (úr lotum); ef engar lotur eru á tímabilinu er
//             notað heildarhlutfall fagsins, og 0,5 ef ekkert hefur verið æft. Hlutfallið er dempað með
//             PRIOR hlutlausum tilraunum (50%), svo eitt eða tvö svör snúi ekki allri tillögunni við.
// Blokkin: fyrri helmingur = villur á tíma (öll fög, elstu fyrst), svo veikustu flokkar fagsins með hæstan
// forgang; seinni helmingur = næsta fag í forgangsröð, annars blönduð upprifjun. Upptekin kvöld fá aðeins
// fyrri helminginn.

import { entriesOf, weakest, topicStats, inMode, modeOf } from './practice.js';
import { dueIds } from './review.js';
import { daysUntil } from './time.js';

export const DAY = 864e5;
const HORIZON = 14;
export const PRIOR = 4;

/** Næsta próf fags úr prófalistanum (dagsett á undan óstaðfestu), eða null ef öll eru liðin. */
export function examFor(courseId, exams, now) {
  const list = exams.filter(x => x.course === courseId && (!x.at || new Date(x.at).getTime() + (x.minutes || 0) * 60e3 > now));
  list.sort((a, b) => (a.at ? new Date(a.at).getTime() : Infinity) - (b.at ? new Date(b.at).getTime() : Infinity));
  return list[0] || null;
}

/** Dagar í próf: sama fall og allur vefurinn notar (engine/time.js), í almanaksdögum. */
export const daysTo = (exam, now) => exam && exam.at ? daysUntil(exam.at, now) : null;

export function proximity(exam, now) {
  if (!exam) return 0;
  const d = daysTo(exam, now);
  if (d === null) return 1 / HORIZON;
  if (d <= 0) return 1;                       // prófið er í dag
  return 1 / Math.min(Math.max(d, 1), HORIZON);
}

/** Hlutfall réttra síðustu 14 daga úr lotum fagsins (dempað); annars heildarhlutfall atriða; annars null. */
export function recentShare(state, course, now) {
  let n = 0, c = 0;
  for (const s of state.sessions) if (s.course === course.id && s.end >= now - HORIZON * DAY) { n += s.n; c += s.c; }
  if (!n) for (const e of entriesOf(course)) { const p = state.items[e.gid]; if (p && e.type !== 'card') { n += p.n; c += p.c; } }
  return n ? (c + PRIOR / 2) / (n + PRIOR) : null;
}

/** Fög í forgangsröð: [{course, exam, days, share, prox, weak, prio}]; fög án komandi prófs eru aftast með prio 0. */
export function priorities(courses, state, { now = Date.now(), exams } = {}) {
  return courses.map(course => {
    const exam = examFor(course.id, exams, now);
    const share = recentShare(state, course, now);
    const weak = share === null ? 0.5 : 1 - share;
    const prox = proximity(exam, now);
    return { course, exam, days: daysTo(exam, now), share, prox, weak, prio: prox * weak };
  }).sort((a, b) => b.prio - a.prio || (a.days ?? Infinity) - (b.days ?? Infinity));
}

/** Áætlaðar mínútur á atriði eftir gerð. */
export function minutesFor(course, e) {
  if (e.quick) return 1;
  if (e.type === 'steps' || (e.kind === 'gen' && course.engine === 'written')) return 8;
  if (e.type === 'num' || e.type === 'multi' || e.type === 'match') return 3;
  if (e.kind === 'gen') return course.engine === 'lecture' ? 3 : 2;
  return 2;
}

// Meðaltími á atriði í æfingu fags (skrifleg dæmi í 101, annars blanda af gerðum fagsins).
function perItem(course) {
  const m = modeOf(course, null);
  const es = entriesOf(course).filter(e => inMode(e, m));
  return es.reduce((s, e) => s + minutesFor(course, e), 0) / (es.length || 1);
}

/** Veikustu flokkar fags í æfingarhætti fagsins (skrifleg dæmi í 101). */
export function weakTopics(course, state, k = 2) {
  const m = modeOf(course, null);
  return weakest(course, state, k, m && m.quick === false ? e => !e.quick && e.type !== 'card' : undefined);
}

/**
 * Tillaga að lærdómsblokk.
 * @returns {{busy:boolean, first:number, pause:number, second:number, total:number,
 *            segments:{half:1|2, kind:'due'|'topics'|'mix', course?:string, topics?:string[], n:number, minutes:number}[],
 *            ranking:Object[]}}
 */
export function suggestBlock(courses, state, { now = Date.now(), exams, prefs }) {
  const busy = prefs.busy.includes(new Date(now).getDay());
  const first = prefs.block.first, pause = busy ? 0 : prefs.block.pause, second = busy ? 0 : prefs.block.second;
  const ranking = priorities(courses, state, { now, exams });
  const active = ranking.filter(r => r.prio > 0);
  const byId = Object.fromEntries(courses.map(c => [c.id, c]));
  const segments = [];

  // 1. villur á tíma, elstu fyrst, eins margar og komast fyrir í fyrri helmingi
  let used = 0;
  const dueBy = new Map();
  const due = courses.flatMap(c => dueIds(state, c.id, now).map(gid => ({ c, gid, due: state.items[gid].due })))
    .filter(x => active.some(r => r.course.id === x.c.id)).sort((a, b) => a.due - b.due);
  for (const x of due) {
    const e = entriesOf(x.c).find(y => y.gid === x.gid); if (!e) continue;
    const m = minutesFor(x.c, e);
    if (used + m > first && used > 0) break;
    used += m;
    const s = dueBy.get(x.c.id) || { half: 1, kind: 'due', course: x.c.id, n: 0, minutes: 0 };
    s.n++; s.minutes += m; dueBy.set(x.c.id, s);
  }
  segments.push(...dueBy.values());

  // 2. veikustu flokkar fagsins með hæstan forgang
  const left = first - used;
  const top = active[0];
  if (top && left >= 5) {
    const per = perItem(top.course);
    segments.push({ half: 1, kind: 'topics', course: top.course.id, topics: weakTopics(top.course, state, 2), n: Math.max(1, Math.round(left / per)), minutes: left });
  }

  // 3. seinni helmingur: annað fag, annars blönduð upprifjun
  if (second) {
    const other = active.find(r => !top || r.course.id !== top.course.id);
    if (other) {
      const per = perItem(other.course);
      segments.push({ half: 2, kind: 'topics', course: other.course.id, topics: weakTopics(other.course, state, 2), n: Math.max(1, Math.round(second / per)), minutes: second });
    } else segments.push({ half: 2, kind: 'mix', n: 10, minutes: second });
  }

  for (const s of segments) if (s.minutes !== undefined) s.minutes = Math.round(s.minutes);
  return { busy, first, pause, second, total: first + pause + second, segments, ranking, courses: byId };
}

/** Dagar síðan flokkur var æfður (út frá `last` atriða), eða null ef aldrei. */
export function daysSince(course, state, topic, now = Date.now()) {
  let last = 0;
  for (const e of entriesOf(course)) if (e.topic === topic) { const p = state.items[e.gid]; if (p && p.last > last) last = p.last; }
  return last ? (now - last) / DAY : null;
}

export { topicStats };
