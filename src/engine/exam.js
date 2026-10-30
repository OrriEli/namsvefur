// Próf á tíma: samsetning eftir prófsniði fagsins, mat og skráning. Teikning er í views/exam.js.

import { entriesOf, weightedPick, shuffle, instantiate } from './practice.js';
import { recordAnswer } from './review.js';
import { gradeMc } from './items/mc.js';

/** Velur færslur (gid) í próf eftir `format.pick`. */
export function pickExam(course, format, state, rnd = Math.random) {
  const all = entriesOf(course);
  const p = format.pick;
  if (p.by === 'quota') {
    let keys = [];
    for (const t of Object.keys(p.quota)) {
      const pool = all.filter(e => e.topic === t && (!p.sources || p.sources.includes(e.source)));
      const chosen = [];
      while (chosen.length < p.quota[t] && chosen.length < pool.length) {
        const e = weightedPick(pool, chosen, state, rnd);
        if (!chosen.includes(e.gid)) chosen.push(e.gid);
      }
      keys.push(...chosen);
    }
    return shuffle(keys, rnd);
  }
  if (p.by === 'fixed') return p.ids.map(id => `${course.id}:${id}`);
  if (p.by === 'gens') return shuffle(all.filter(e => e.kind === 'gen').map(e => e.gid), rnd).slice(0, p.n);
  throw new Error(`Prófsnið ${p.by} er ekki komið inn`);
}

/** Býr til nýtt próf. Tilvikin eru vistuð með prófinu svo að endurhleðsla síðunnar haldi sömu tölum. */
export function buildExam(course, formatId, state, { now = Date.now(), rnd = Math.random } = {}) {
  const format = course.examFormats.find(f => f.id === formatId);
  const byGid = Object.fromEntries(entriesOf(course).map(e => [e.gid, e]));
  const items = pickExam(course, format, state, rnd).map(gid => instantiate(course, byGid[gid], rnd));
  const minutes = format.minutes || format.minutesPerItem * items.length;
  return { course: course.id, format: format.id, label: format.name, items, ans: items.map(() => null), flag: items.map(() => false), start: now, dur: minutes * 60e3, cur: 0 };
}

export const timeLeft = (exam, now = Date.now()) => exam.dur - (now - exam.start);

/** Metur, skráir hvert svar (röng fara í villubankann) og vistar niðurstöðuna í sögu. */
export function finishExam(state, course, exam, { timeout = false, now = Date.now() } = {}) {
  const scores = exam.items.map((it, i) => gradeMc(it, exam.ans[i]));
  exam.items.forEach((it, i) => recordAnswer(state, it.gid, scores[i], { passScore: course.passScore, now }));
  const c = scores.reduce((s, x) => s + x, 0), n = exam.items.length;
  const used = Math.min(exam.dur, now - exam.start);
  const res = { course: course.id, format: exam.format, label: exam.label, at: now, used, n, score: c, max: n, timeout };
  state.hist.push(res);
  state.sessions.push({ course: course.id, kind: 'exam', start: exam.start, end: now, n, c });
  delete state.exams[course.id];
  return { ...res, items: exam.items, ans: exam.ans, scores };
}

/** Niðurstaða eftir flokkum: {topic: {n, c}}. */
export function byTopic(result) {
  const by = {};
  result.items.forEach((it, i) => { const b = by[it.topic] || (by[it.topic] = { n: 0, c: 0 }); b.n++; b.c += result.scores[i]; });
  return by;
}
