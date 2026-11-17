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

/** Hlutar niðurtalningar: `left` er tíminn sem er eftir („26 d. 4 klst.“), `when` dagsetningin eða „óstaðfest“. */
export function countdownParts(x, now = Date.now()) {
  if (!x) return { label: 'Ekkert próf skráð', left: null, when: null };
  if (!x.at) return { label: x.label, left: null, when: 'óstaðfest' };
  const t = new Date(x.at); const d = t.getTime() - now;
  const when = `${DAYS[t.getUTCDay()]} ${t.getUTCDate()}. ${MONTHS[t.getUTCMonth()]} kl. ${t.toISOString().slice(11, 16)}`;
  if (d <= 0) return { label: `${x.label} er í gangi`, left: null, when };
  const days = Math.floor(d / 864e5), h = Math.floor(d % 864e5 / 3600e3), m = Math.floor(d % 3600e3 / 60e3);
  return { label: x.label, left: days ? `${days} d. ${h} klst.` : `${h} klst. ${m} mín.`, when };
}

/** Stutt, fyrir línur: „Lokapróf eftir <b>7 d.</b> · mið. 25. nóv. kl. 13:30“ eða „Lokapróf · óstaðfest“. */
export function countdownShort(x, now = Date.now()) {
  const p = countdownParts(x, now);
  if (!p.left) return p.when ? `${p.label} · ${p.when}` : p.label;
  const m = p.left.match(/^\d+ d\./);
  return `${p.label} eftir <b>${m ? m[0] : p.left}</b> · ${p.when}`;
}

/** „Lokapróf eftir <b>26 d. 4 klst.</b> · mið. 25. nóv. kl. 13:30“, í tveimur hlutum (.cd-a og .cd-w) sem
 *  brotna hvor í sína línu á mjóum skjá; punkturinn á milli er í CSS. */
export function countdownTxt(x, now = Date.now()) {
  const p = countdownParts(x, now);
  const a = p.left ? `${p.label} eftir <b>${p.left}</b>` : p.label;
  return `<span class="cd-a">${a}</span>${p.when ? `<span class="cd-w">${p.when}</span>` : ''}`;
}
