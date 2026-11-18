// Vikan: mínútur, atriði og hlutfall réttra á hvert fag síðustu 7 daga, borið saman við vikuna á undan,
// og hlutfall „Viss“-svara sem voru röng. Allt reiknað úr lotum (state.sessions).

import { fmtDay } from '../ui/format.js';
import { entriesOf } from './practice.js';

export const DAY = 864e5;

const empty = () => ({ minutes: 0, n: 0, c: 0, sure: 0, sureWrong: 0 });
function add(a, s) { a.minutes += Math.max(0, s.end - s.start) / 60e3; a.n += s.n; a.c += s.c; a.sure += s.sure || 0; a.sureWrong += s.sureWrong || 0; }
const pct = a => a.n ? a.c / a.n : null;

/** Samantekt á tímabilinu [now − 7 d, now] og vikunni á undan, á hvert fag og samtals, og mínútur á dag. */
export function weekSummary(state, courses, now = Date.now()) {
  const from = now - 7 * DAY, prevFrom = now - 14 * DAY;
  const cur = Object.fromEntries(courses.map(c => [c.id, empty()])), prev = Object.fromEntries(courses.map(c => [c.id, empty()]));
  const total = empty(), prevTotal = empty();
  const days = Array.from({ length: 7 }, (_, i) => ({ day: new Date(now - (6 - i) * DAY), minutes: 0 }));
  const dayKey = t => new Date(t).toDateString();
  for (const s of state.sessions) {
    if (!cur[s.course]) continue;
    if (s.end >= from && s.end <= now) {
      add(cur[s.course], s); add(total, s);
      const d = days.find(x => dayKey(x.day) === dayKey(s.end)); if (d) d.minutes += Math.max(0, s.end - s.start) / 60e3;
    } else if (s.end >= prevFrom && s.end < from) { add(prev[s.course], s); add(prevTotal, s); }
  }
  const rows = courses.map(c => ({ course: c, ...cur[c.id], pct: pct(cur[c.id]), prev: { ...prev[c.id], pct: pct(prev[c.id]) } }));
  return { from, to: now, rows, total: { ...total, pct: pct(total) }, prev: { ...prevTotal, pct: pct(prevTotal) }, days };
}

const dstr = fmtDay;
const perc = p => p === null ? '–' : Math.round(p * 100) + '%';
const delta = (a, b, unit) => { const d = Math.round(a - b); return d === 0 ? `óbreytt` : `${d > 0 ? '↑' : '↓'} ${Math.abs(d)} ${unit}`; };

/** Yfirlitið sem hreinn texti, til að senda öðrum. */
export function weekText(sum, goal) {
  const L = [];
  L.push(`Vikan ${dstr(sum.from + DAY)}–${dstr(sum.to)}`);
  L.push(`Samtals: ${Math.round(sum.total.minutes)} mín., ${sum.total.n} atriði, ${perc(sum.total.pct)} rétt (vikan á undan: ${Math.round(sum.prev.minutes)} mín., ${perc(sum.prev.pct)} rétt)`);
  for (const r of sum.rows) {
    if (!r.n && !r.prev.n) continue;
    const trend = [delta(r.minutes, r.prev.minutes, 'mín.'), r.pct !== null && r.prev.pct !== null ? delta(r.pct * 100, r.prev.pct * 100, 'prósentustig') : null].filter(Boolean).join(', ');
    L.push(`${r.course.code} ${r.course.short}: ${Math.round(r.minutes)} mín., ${r.n} atriði, ${perc(r.pct)} rétt (${trend})`);
  }
  if (sum.total.sure) L.push(`Viss en rangt: ${sum.total.sureWrong} af ${sum.total.sure} „Viss“-svörum (${perc(sum.total.sureWrong / sum.total.sure)})`);
  if (goal) L.push(`Markmið næstu viku: ${goal}`);
  return L.join('\n');
}

/** Staða fags: hve mörg atriði (ekki spjöld) hafa sést af öllum, og hlutfall réttra svara (null ef ekkert svar). */
export function courseProgress(course, state) {
  const es = entriesOf(course).filter(e => e.type !== 'card'); let n = 0, c = 0, seen = 0;
  for (const e of es) { const p = state.items[e.gid]; if (p) { n += p.n; c += p.c; seen++; } }
  return { seen, total: es.length, pct: n ? c / n : null };
}
