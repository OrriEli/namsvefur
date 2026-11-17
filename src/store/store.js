// Geymslulag: öll framvinda fer hingað í gegn, svo hægt sé að skipta um geymslu (t.d. samstilltan
// bakenda) án þess að snerta vélina. Bakendi er hlutur með read() → string|null og write(string).

import { BLOCK, BUSY_EVENINGS, GOALS } from '../config.js';

export const STORE_KEY = 'namsvefur-v1';
export const VERSION = 1;

/** Framvinda eins atriðis, geymd undir alþjóðlegu auðkenni ('hag103g:H25-1', 'hag106g:g-ev@2').
 *  @typedef {Object} ItemProgress
 *  @property {number} n                tilraunir
 *  @property {number} c                summa einkunna (0–1 á tilraun)
 *  @property {number} streak           rétt í röð
 *  @property {number} [last]           síðasta tilraun (ms)
 *  @property {'viss'|'halfviss'|'gisk'} [conf] öryggismat síðasta svars
 *  @property {boolean} [sureWrong]     rangt þótt merkt væri „Viss“
 *  @property {number} [box]            hólf í villubanka (1, 3, 7, 16 dagar); vantar = ekki í banka
 *  @property {number} [due]            næst á tíma (ms)
 *  @property {string} [note]
 *  @property {string[]} [tags]
 *  @property {boolean} [again]
 *  @property {number} [p]            stig fengin samtals (skrifleg dæmi í HAG101G)
 *  @property {number} [m]            hámarksstig samtals
 *  @property {{n:number, c:number, p?:number, m?:number}} [imp] hlutur gömlu síðunnar (svo endurtekinn innflutningur tvítelji ekki)
 */

/** @typedef {{course:string, kind:'practice'|'exam', start:number, end:number, n:number, c:number, sure?:number, sureWrong?:number}} Session */
/** @typedef {{course:string, format:string, label:string, at:number, used:number, n:number, score:number, max:number, timeout:boolean, legacy?:boolean}} ExamResult */

/** @typedef {Object} State
 *  @property {number} v
 *  @property {Object<string,ItemProgress>} items
 *  @property {Session[]} sessions
 *  @property {ExamResult[]} hist
 *  @property {Object<string,*>} exams          próf í gangi, eitt á fag
 *  @property {{plan:Object<string,{done:Object<string,boolean>}>, adapt:Object<string,{lvl:number, up:number, down:number, msg:string}>,
 *             imported:Object<string,{at:number, key:string, items:number, bank:number, hist:number, skipped:number}>,
 *             prefs:{confidence:boolean, block:{first:number, pause:number, second:number}, busy:number[], goals:Object<string,string>, theme:'auto'|'light'|'dark'},
 *             weekGoal?:{text:string, at:number},
 *             self:Object<string,{v:Object<string,number|null>, at:string, ts:number}>}} settings  sjálfsmat á köflum Blaðsins (engine/self.js)
 *  @property {Object} [block]          lærdómsblokk í gangi (sjá views/block.js)
 */

/** @returns {State} */
export const defaultPrefs = () => ({ confidence: true, block: { ...BLOCK }, busy: [...BUSY_EVENINGS], goals: { ...GOALS }, theme: 'auto' });
export const fresh = () => ({ v: VERSION, items: {}, sessions: [], hist: [], exams: {}, settings: { plan: {}, adapt: {}, imported: {}, self: {}, prefs: defaultPrefs() } });

// Flutningsföll á milli útgáfa: MIGRATIONS[n] breytir útgáfu n í n + 1.
const MIGRATIONS = {};

export function migrate(raw) {
  let s = raw && typeof raw === 'object' ? raw : fresh();
  while ((s.v || 0) < VERSION) {
    const step = MIGRATIONS[s.v || 0];
    if (!step) { s = fresh(); break; }
    s = step(s);
  }
  const base = fresh();
  const settings = { ...base.settings, ...(s.settings || {}) };
  settings.prefs = { ...base.settings.prefs, ...(settings.prefs || {}) };
  return { ...base, ...s, settings };
}

export function localBackend(key = STORE_KEY) {
  return {
    read() { try { return localStorage.getItem(key); } catch (e) { return null; } },
    write(str) { try { localStorage.setItem(key, str); } catch (e) {} }
  };
}

export function memoryBackend(init = null) {
  let v = init;
  return { read: () => v, write: s => { v = s; } };
}

export function createStore(backend = localBackend()) {
  let state;
  try { state = migrate(JSON.parse(backend.read() || 'null')); } catch (e) { state = fresh(); }
  const listeners = new Set();
  return {
    get state() { return state; },
    save() { backend.write(JSON.stringify(state)); listeners.forEach(f => f(state)); },
    onChange(f) { listeners.add(f); return () => listeners.delete(f); }
  };
}

// Lotuskráning: æfing lengir síðustu lotu ef innan við 15 mín. eru liðnar, annars hefst ný.
// `from` er hvenær atriðið birtist (svo fyrsta svarið teljist líka til tíma), þó aldrei meira en 15 mín.
// aftur í tímann. `conf`/`ok` telja „Viss“-svör og hve mörg þeirra voru röng (fyrir Vikuna).
const GAP = 15 * 60e3;
export function logActivity(state, course, kind, score, now = Date.now(), { from, conf, ok } = {}) {
  const last = [...state.sessions].reverse().find(s => s.course === course && s.kind === kind);
  let s;
  if (kind === 'practice' && last && now - last.end < GAP) { s = last; s.end = now; s.n++; s.c += score; }
  else { s = { course, kind, start: Math.max(from ?? now, now - GAP), end: now, n: 1, c: score }; state.sessions.push(s); }
  if (conf === 'viss') { s.sure = (s.sure || 0) + 1; if (ok === false) s.sureWrong = (s.sureWrong || 0) + 1; }
  return s;
}
