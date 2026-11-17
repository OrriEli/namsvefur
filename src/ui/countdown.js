// Niðurtalning að prófum úr config.js.

import { EXAMS } from '../config.js';
import { timeToExam, examDateText } from '../engine/time.js';

/** Næsta próf fags sem er ekki liðið; próf án dagsetningar koma á eftir dagsettum. */
export function nextExam(courseId, now = Date.now()) {
  const list = EXAMS.filter(x => x.course === courseId)
    .filter(x => !x.at || new Date(x.at).getTime() + (x.minutes || 0) * 60e3 > now);
  list.sort((a, b) => (a.at ? new Date(a.at).getTime() : Infinity) - (b.at ? new Date(b.at).getTime() : Infinity));
  return list[0] || null;
}

/** Hlutar niðurtalningar úr timeToExam (engine/time.js): `lead` er „Lokapróf eftir <b>8 daga</b>“ (HTML),
 *  `when` dagsetningin („mið. 25. nóv. kl. 13:30“) eða „óstaðfest“. */
export function countdownParts(x, now = Date.now()) {
  const t = timeToExam(x, now);
  if (t.state === 'none') return { lead: 'Ekkert próf skráð', when: null, t };
  if (t.state === 'tbd') return { lead: x.label, when: 'óstaðfest', t };
  const when = examDateText(x.at);
  if (t.state === 'future') return { lead: `${x.label} eftir <b>${t.text.slice(6)}</b>`, when, t };
  return { lead: `${x.label} <b>${t.text}</b>`, when, t };
}

/** Í línum: „Lokapróf eftir <b>8 daga</b> · mið. 25. nóv. kl. 13:30“ eða „Lokapróf · óstaðfest“. */
export function countdownShort(x, now = Date.now()) {
  const p = countdownParts(x, now);
  return p.when ? `${p.lead} · ${p.when}` : p.lead;
}

/** Í haus fagsíðu: tveir hlutar (.cd-a og .cd-w) sem brotna hvor í sína línu á mjóum skjá. */
export function countdownTxt(x, now = Date.now()) {
  const p = countdownParts(x, now);
  return `<span class="cd-a">${p.lead}</span>${p.when ? `<span class="cd-w">${p.when}</span>` : ''}`;
}
