// Niðurtalning að prófum úr config.js.

import { EXAMS } from '../config.js';

/** Næsta próf fags sem er ekki liðið; próf án dagsetningar koma á eftir dagsettum. */
export function nextExam(courseId, now = Date.now()) {
  const list = EXAMS.filter(x => x.course === courseId)
    .filter(x => !x.at || new Date(x.at).getTime() + (x.minutes || 0) * 60e3 > now);
  list.sort((a, b) => (a.at ? new Date(a.at).getTime() : Infinity) - (b.at ? new Date(b.at).getTime() : Infinity));
  return list[0] || null;
}

const DAYS = ['sun.', 'mán.', 'þri.', 'mið.', 'fim.', 'fös.', 'lau.'];
const MONTHS = ['jan.', 'feb.', 'mars', 'apr.', 'maí', 'júní', 'júlí', 'ág.', 'sept.', 'okt.', 'nóv.', 'des.'];

/** „Lokapróf eftir 26 d. 4 klst. · mið. 25. nóv. kl. 13:30“ eða „Lokapróf · óstaðfest“. */
export function countdownTxt(x, now = Date.now()) {
  if (!x) return 'Ekkert próf skráð';
  if (!x.at) return `${x.label} · óstaðfest`;
  const t = new Date(x.at); const d = t.getTime() - now;
  const when = `${DAYS[t.getUTCDay()]} ${t.getUTCDate()}. ${MONTHS[t.getUTCMonth()]} kl. ${t.toISOString().slice(11, 16)}`;
  if (d <= 0) return `${x.label} er í gangi`;
  const days = Math.floor(d / 864e5), h = Math.floor(d % 864e5 / 3600e3), m = Math.floor(d % 3600e3 / 60e3);
  return `${x.label} eftir <b>${days ? days + ' d. ' + h + ' klst.' : h + ' klst. ' + m + ' mín.'}</b> · ${when}`;
}
