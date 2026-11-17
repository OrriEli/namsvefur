// Stillingar sem Orri breytir í höndunum: prófdagar, markmið og upptekin kvöld.
// Ísland er á UTC allt árið, svo tímarnir hér eru staðartímar.

/** @typedef {{course:string, kind:'midannar'|'loka', label:string, at:string|null, minutes?:number}} ExamDate */

/** @type {ExamDate[]} */
export const EXAMS = [
  { course: 'hag101g', kind: 'midannar', label: 'Miðannarpróf', at: '2026-11-05T16:00:00Z', minutes: 90 },
  { course: 'hag101g', kind: 'loka', label: 'Lokapróf', at: '2026-11-25T13:30:00Z', minutes: 180 },   // Á301
  { course: 'hag108g', kind: 'loka', label: 'Lokapróf', at: '2026-12-01T13:30:00Z', minutes: 180 },
  { course: 'hag107g', kind: 'loka', label: 'Lokapróf', at: '2026-12-04T13:30:00Z', minutes: 180 },   // S-261
  { course: 'hag103g', kind: 'loka', label: 'Lokapróf', at: '2026-12-07T13:30:00Z', minutes: 180 },   // HT103
  { course: 'hag106g', kind: 'loka', label: 'Lokapróf', at: null, minutes: 180 }                      // óstaðfest
];

// Markmið á hvert fag, t.d. { hag107g: '6,5 á lokaprófi' }. Stillanlegt síðar í stillingum.
export const GOALS = {};

// Upptekin kvöld (0 = sunnudagur): mán., mið. og fös.
export const BUSY_EVENINGS = [1, 3, 5];

// Lengd lærdómsblokkar í mínútum: fyrri helmingur, hlé, seinni helmingur.
export const BLOCK = { first: 25, pause: 10, second: 25 };
