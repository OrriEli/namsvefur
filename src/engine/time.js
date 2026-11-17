// Tími í próf: eina fallið sem vefurinn notar til að segja hve langt er í próf (niðurtalning á fagsíðu,
// Í dag, Fögin, forgangur í tillögunni). Talið er í almanaksdögum eftir íslenskum tíma (UTC):
// frá 17. nóv. til 25. nóv. eru 8 dagar, hvenær dags sem er. Á prófdegi stendur „í dag kl. 13:30“.

export const DAY = 864e5;
const WD = ['sun.', 'mán.', 'þri.', 'mið.', 'fim.', 'fös.', 'lau.'];
const MON = ['jan.', 'feb.', 'mars', 'apr.', 'maí', 'júní', 'júlí', 'ág.', 'sept.', 'okt.', 'nóv.', 'des.'];

const dayIndex = t => { const d = new Date(t); return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()) / DAY; };

/** Almanaksdagar frá deginum í dag til dags `at` (0 = í dag, 1 = á morgun, neikvætt = liðið); null ef engin dagsetning. */
export function daysUntil(at, now = Date.now()) {
  if (!at) return null;
  return Math.round(dayIndex(at) - dayIndex(now));
}

/** „kl. 13:30“ */
export const clockText = at => `kl. ${new Date(at).toISOString().slice(11, 16)}`;
/** „mið. 25. nóv. kl. 13:30“ */
export function examDateText(at) {
  const t = new Date(at);
  return `${WD[t.getUTCDay()]} ${t.getUTCDate()}. ${MON[t.getUTCMonth()]} ${clockText(at)}`;
}

/**
 * Staða prófs miðað við `now`: {days, text, state}. `text` er „eftir 8 daga“, „á morgun“, „í dag kl. 13:30“,
 * „í gangi“, „lokið“ eða „óstaðfest“. `exam` er {at, minutes} úr config.js.
 */
export function timeToExam(exam, now = Date.now()) {
  if (!exam) return { days: null, text: 'ekkert próf skráð', state: 'none' };
  if (!exam.at) return { days: null, text: 'óstaðfest', state: 'tbd' };
  const start = new Date(exam.at).getTime(), end = start + (exam.minutes || 0) * 60e3;
  const days = daysUntil(exam.at, now);
  if (now >= end) return { days, text: 'lokið', state: 'past' };
  if (now >= start) return { days: 0, text: 'í gangi', state: 'running' };
  if (days === 0) return { days, text: `í dag ${clockText(exam.at)}`, state: 'today' };
  if (days === 1) return { days, text: 'á morgun', state: 'soon' };
  return { days, text: `eftir ${days} ${days % 10 === 1 && days % 100 !== 11 ? 'dag' : 'daga'}`, state: 'future' };
}
