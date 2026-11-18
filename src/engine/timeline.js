// Dagaröðin á Í dag: einn reitur á hvern dag frá fyrsta degi áætlunar til síðasta staðfesta lokaprófs.
// Hver dagur tilheyrir einu fagi (lota dagsins), og „Á áætlun“ telur hve margir dagar eru búnir.
//
// Fag dagsins:
//   1. Prófdagur → fag prófsins.
//   2. Dagur í áætlun fags (liðir sem eru ekki hlé) → fagið með flestar mínútur; næsta fag er rönd.
//   3. Annars → næsta próf; þriðji hver dagur (talið frá upphafi) fer þó á prófið þar á eftir ef það er
//      innan 7 daga, svo fag sem kemur rétt á eftir gleymist ekki.
// Próf án dagsetningar (HAG106G) er utan raðarinnar þar til dagurinn er staðfestur.
//
// Dagur er búinn ef æft var í minnst 25 mín. í fagi dagsins, ef allir liðir áætlunar fagsins þann dag eru
// hakaðir, eða (prófdagur) ef prófinu er lokið. Ein lota = einn dagur.

import { DAY } from './time.js';

export const DONE_MIN = 25;
const iso = t => new Date(t).toISOString().slice(0, 10);
const addDays = (d, n) => iso(Date.parse(d + 'T00:00:00Z') + n * DAY);
const between = (a, b) => Math.round((Date.parse(b + 'T00:00:00Z') - Date.parse(a + 'T00:00:00Z')) / DAY);

/** Áætlunardagar faga eftir dagsetningu: {dagur: [{course, minutes, di, items}]} (aðeins dagar með liðum). */
export function planDays(courses) {
  const by = {};
  for (const c of courses) (c.plan ? c.plan.days : []).forEach((d, di) => {
    if (!d.date) return;
    const items = d.items.map((s, i) => ({ ...s, key: `${di}-${i}` })).filter(s => !s.brk);
    if (!items.length) return;
    (by[d.date] || (by[d.date] = [])).push({ course: c.id, minutes: items.reduce((a, s) => a + (s.m || 0), 0), items });
  });
  for (const list of Object.values(by)) list.sort((a, b) => b.minutes - a.minutes);
  return by;
}

/** Mínútur æfðar á hvert fag á hvern dag (úr lotum): {dagur: {fag: mín.}}. */
export function minutesByDay(state) {
  const by = {};
  for (const s of state.sessions) { const d = iso(s.end); const m = by[d] || (by[d] = {}); m[s.course] = (m[s.course] || 0) + Math.max(0, s.end - s.start) / 60e3; }
  return by;
}

/**
 * Dagaröðin. Skilar null ef ekkert staðfest próf er framundan.
 * @returns {{days:{date:string, course:string, stripe:string|null, exam:boolean, plan:object|null, past:boolean, today:boolean, done:boolean, minutes:number}[],
 *            total:number, done:number, behind:number, todayDay:object|null}}
 */
export function buildStrip(courses, state, { now = Date.now(), exams }) {
  const ids = new Set(courses.map(c => c.id));
  const dated = exams.filter(x => x.at && x.kind !== 'midannar' && ids.has(x.course)).map(x => ({ ...x, date: iso(x.at), end: Date.parse(x.at) + (x.minutes || 0) * 60e3 }))
    .sort((a, b) => Date.parse(a.at) - Date.parse(b.at));
  const today = iso(now);
  const last = dated.length ? dated[dated.length - 1] : null;
  if (!last || last.end <= now) return null;
  const plans = planDays(courses);
  const first = Object.keys(plans).sort()[0];
  const start = first && first < today ? first : today;
  const mins = minutesByDay(state);
  const checked = c => ((state.settings.plan || {})[c] || {}).done || {};

  const days = [];
  for (let i = 0, d = start; d <= last.date; i++, d = addDays(d, 1)) {
    const exam = dated.find(x => x.date === d);
    const p = plans[d] || [];
    let course, stripe = null;
    if (exam) { course = exam.course; stripe = (p.find(x => x.course !== course) || {}).course || null; }
    else if (p.length) { course = p[0].course; stripe = p[1] ? p[1].course : null; }
    else {
      const up = dated.filter(x => x.date >= d);
      course = up[0].course;
      if (i % 3 === 2 && up[1] && between(d, up[1].date) <= 7) course = up[1].course;
    }
    const plan = p.find(x => x.course === course) || null;
    const minutes = (mins[d] || {})[course] || 0;
    const allChecked = !!plan && plan.items.every(s => checked(course)[s.key]);
    const done = d <= today && (minutes >= DONE_MIN || allChecked || (!!exam && exam.end <= now));
    days.push({ date: d, course, stripe, exam: !!exam, plan, past: d < today, today: d === today, done, minutes });
  }
  const behind = days.filter(x => x.past && !x.done).length;
  return { days, total: days.length, done: days.filter(x => x.done).length, behind, todayDay: days.find(x => x.today) || null };
}

const WORD = { 2: 'Tveimur', 3: 'Þremur', 4: 'Fjórum' };
/** Ein setning um stöðuna: „Þú ert á áætlun.“ eða hvernig á að vinna upp. */
export function onTrackText(strip) {
  const n = strip.behind, todayDone = !!(strip.todayDay && strip.todayDay.done);
  if (!n) return 'Þú ert á áætlun.';
  if (n === 1) return `Einni lotu á eftir: taktu tvær ${todayDone ? 'á morgun' : 'í dag'}.`;
  return `${WORD[n] || n} lotum á eftir: bættu einni við á dag næstu ${n} daga.`;
}
