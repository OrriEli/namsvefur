// Gagnasniðið (samþykkt 29. okt. 2026, sjá docs/schema.md) og prófun á því.

/** @typedef {'old'|'new'|'sheet'|'slides'|'gen'} Source */

/** @typedef {Object} Topic
 *  @property {string} id
 *  @property {string} name
 *  @property {string} [label]       stutt merki ef annað en id, t.d. 'F7–F8'
 *  @property {string} [ref]         'MT24', 'Kafli 5.4'
 *  @property {string} [weight]      vægi eins og gamla síðan sýndi það
 *  @property {string[]} [members]   eldri auðkenni sem falla undir flokkinn
 *  @property {boolean} [review]     upprifjun: ekki í blönduðu prófi né „veikustu flokkum“
 */

/** @typedef {Object} Level  @property {string} name  @property {string} desc */

/** @typedef {{h:string, body:string, p:number}} Step */

/** @typedef {Object} Item
 *  @property {string} id
 *  @property {'mc'|'num'|'steps'|'card'} type
 *  @property {string} topic
 *  @property {1|2|3} [level]
 *  @property {Source} source
 *  @property {string} [origin]
 *  @property {string} src
 *  @property {string} q
 *  @property {string} e
 *  @property {string[]} [o]
 *  @property {number} [a]
 *  @property {number} [ans]
 *  @property {number} [tol]
 *  @property {string} [unit]
 *  @property {string} [exact]
 *  @property {boolean} [prob]
 *  @property {Step[]} [steps]
 *  @property {number} [examWeight]
 *  @property {string[]} [keys]
 *  @property {{q:string, steps:Step[]}} [solution]
 *  @property {boolean} [r]
 *  @property {{code:string, expect:string, rxo?:boolean}} [rtest]
 *  @property {number} [x]
 *  @property {*} [chk]
 */

/** @typedef {Omit<Item, 'id'|'topic'|'source'|'src'|'level'>} GenItem */

/** @typedef {Object} Generator
 *  @property {string} id
 *  @property {string} name
 *  @property {string} topic
 *  @property {number[]} [levels]
 *  @property {boolean|number[]} [r]
 *  @property {(level?: number) => GenItem} f
 */

/** @typedef {
 *   {by:'quota', quota:Object<string,number>, sources?:Source[]}
 *  |{by:'fixed', ids:string[]}
 *  |{by:'gens', n:number}
 *  |{by:'blueprint', sections:{topics:string[], weight:number}[], minPoints:number, gensOnly?:boolean}
 *  |{by:'levels', mixes:{id:string, name:string, w:number[]}[], lengths:{id:string, minutes:number, n:number, cards:number}[],
 *     stepCapL3:number, points:{mc:number, num:number, steps:number, card:number}, rShare?:{topic:string, share:number}}
 *  } Pick */

/** @typedef {Object} ExamFormat
 *  @property {string} id
 *  @property {string} name
 *  @property {string} desc
 *  @property {'inspera'|'written'|'mixed'} style
 *  @property {number} [minutes]
 *  @property {number} [minutesPerItem]
 *  @property {Pick} pick
 */

/** @typedef {Object} SheetSection  @property {string} id  @property {string} n  @property {string} title  @property {string} html */
/** @typedef {Object} Sheet  @property {string} head  @property {SheetSection[]} sections  @property {string} [foot] */

/** @typedef {string | {v:string, topics?:string[], kind?:string, sec?:string}} Go */
/** @typedef {{kind:'day', date:string, start:string, end:string, eyebrow:string, title:string, intro:string,
 *             steps:{m:number, h:string, p?:string, go?:Go, brk?:boolean}[]}
 *          | {kind:'days', days:{d:string, h:string, cal?:string, note?:string,
 *             items:{at:string, m:number, h:string, p?:string, go?:Go, brk?:boolean}[]}[]}} Plan */

/** @typedef {Object} ExamInfo
 *  @property {string} title
 *  @property {string} [format]
 *  @property {string} [aids]
 *  @property {string} [weight]
 *  @property {string} [note]        skýring undir stöðutöflunni á gömlu síðunni
 *  @property {{value:string, label:string}[]} facts
 */

/** @typedef {Object} Course
 *  @property {string} id
 *  @property {string} code
 *  @property {string} name
 *  @property {string} short
 *  @property {string} color
 *  @property {Topic[]} topics
 *  @property {Object<number,Level>} [levels]
 *  @property {Item[]} items
 *  @property {Generator[]} gens
 *  @property {ExamFormat[]} examFormats
 *  @property {Sheet} sheet
 *  @property {Plan} [plan]
 *  @property {ExamInfo} examInfo
 *  @property {number} passScore
 *  @property {Partial<Record<Source,string>>} [sourceLabels]
 *  @property {string} [genLabel]    forskeyti á merki rafaldæma, t.d. 'Reikningur' (sjálfgefið 'Rafall')
 *  @property {{key:string, file:string}} legacy
 */

export const TYPES = ['mc', 'num', 'steps', 'card'];
export const SOURCES = ['old', 'new', 'sheet', 'slides', 'gen'];
export const SOURCE_LABELS = { old: 'Gömul próf', new: 'Nýjar', sheet: 'Dæmablöð', slides: 'Glærur', gen: 'Rafalar' };

const isStr = v => typeof v === 'string';
const isNum = v => typeof v === 'number' && Number.isFinite(v);
const badText = s => /\bNaN\b|\bInfinity\b|undefined/.test(s);

/**
 * Prófar það sem atriði eða rafalaúttak þarf að uppfylla eftir gerð. Skilar lista af villum (tómur = í lagi).
 * @param {Partial<Item>} it
 * @param {{generated?: boolean, topics?: Set<string>}} [ctx]
 */
export function validateItem(it, ctx = {}) {
  const err = [];
  const where = it.id ? `${it.id}: ` : '';
  if (!TYPES.includes(it.type)) err.push(`${where}óþekkt gerð ${it.type}`);
  if (!isStr(it.q) || !it.q.trim()) err.push(`${where}vantar q`);
  if (!isStr(it.e)) err.push(`${where}e er ekki strengur`);
  if (!ctx.generated) {
    if (!isStr(it.id) || !it.id) err.push('vantar id');
    if (!SOURCES.includes(it.source)) err.push(`${where}óþekktur uppruni ${it.source}`);
    if (!isStr(it.src)) err.push(`${where}vantar src`);
    if (ctx.topics && !ctx.topics.has(it.topic)) err.push(`${where}óþekktur flokkur ${it.topic}`);
    if (it.level !== undefined && ![1, 2, 3].includes(it.level)) err.push(`${where}ógilt stig ${it.level}`);
  }
  if (ctx.generated) {
    for (const k of ['q', 'e']) if (isStr(it[k]) && badText(it[k])) err.push(`${where}${k} inniheldur NaN/Infinity/undefined`);
  }
  if (it.type === 'mc') {
    if (!Array.isArray(it.o) || it.o.length < 2 || it.o.length > 5) err.push(`${where}mc þarf 2–5 valkosti`);
    else {
      if (!it.o.every(isStr)) err.push(`${where}valkostur er ekki strengur`);
      if (new Set(it.o).size !== it.o.length) err.push(`${where}tvíteknir valkostir`);
      if (!Number.isInteger(it.a) || it.a < 0 || it.a >= it.o.length) err.push(`${where}rétt svar ${it.a} ekki meðal valkosta`);
      if (ctx.generated && it.o.some(o => badText(o))) err.push(`${where}valkostur inniheldur NaN/Infinity/undefined`);
    }
  }
  if (it.type === 'num') {
    if (!isNum(it.ans)) err.push(`${where}ans er ekki endanleg tala`);
    if (!isNum(it.tol) || it.tol < 0) err.push(`${where}ógilt tol`);
    if (it.exact !== undefined && !/^-?\d+(\/-?\d+)?$/.test(it.exact)) err.push(`${where}ógilt exact ${it.exact}`);
  }
  if (it.type === 'steps') {
    if (!Array.isArray(it.steps) || !it.steps.length) err.push(`${where}vantar skref`);
    else it.steps.forEach((s, i) => { if (!isStr(s.h) || !isStr(s.body) || !isNum(s.p) || s.p <= 0) err.push(`${where}skref ${i + 1} ógilt`); });
  }
  if (it.type === 'card' && it.keys !== undefined && !(Array.isArray(it.keys) && it.keys.every(isStr))) err.push(`${where}keys ógilt`);
  return err;
}

/** Prófar heilt fag: svið, auðkenni, flokka, prófsnið og Blaðið. Rafalar eru prófaðir sér (tests/generators.test.js). */
export function validateCourse(c) {
  const err = [];
  for (const k of ['id', 'code', 'name', 'short', 'color']) if (!isStr(c[k]) || !c[k]) err.push(`vantar ${k}`);
  if (!Array.isArray(c.topics) || !c.topics.length) err.push('vantar flokka');
  const topics = new Set((c.topics || []).map(t => t.id));
  const ids = new Set();
  for (const it of c.items || []) {
    err.push(...validateItem(it, { topics }));
    if (ids.has(it.id)) err.push(`tvítekið auðkenni ${it.id}`);
    ids.add(it.id);
  }
  for (const g of c.gens || []) {
    if (!isStr(g.id) || typeof g.f !== 'function') err.push(`ógildur rafall ${g.id}`);
    if (!topics.has(g.topic)) err.push(`rafall ${g.id}: óþekktur flokkur ${g.topic}`);
    if (ids.has(g.id)) err.push(`tvítekið auðkenni ${g.id}`);
    ids.add(g.id);
  }
  for (const f of c.examFormats || []) {
    if (!f.minutes && !f.minutesPerItem && f.pick?.by !== 'levels') err.push(`prófsnið ${f.id}: enginn tími`);
    if (f.pick?.by === 'quota') for (const t of Object.keys(f.pick.quota)) if (!topics.has(t)) err.push(`prófsnið ${f.id}: óþekktur flokkur ${t}`);
    if (f.pick?.by === 'fixed') for (const id of f.pick.ids) if (!ids.has(id)) err.push(`prófsnið ${f.id}: óþekkt atriði ${id}`);
  }
  if (!c.sheet || !isStr(c.sheet.head) || !Array.isArray(c.sheet.sections) || !c.sheet.sections.length) err.push('vantar Blaðið');
  if (!isNum(c.passScore) || c.passScore <= 0 || c.passScore > 1) err.push('ógilt passScore');
  return err;
}
