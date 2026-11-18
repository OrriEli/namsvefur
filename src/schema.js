// Gagnasniðið (samþykkt 30. okt. 2026, víkkað út 17. nóv. fyrir lokaprófsútgáfur gömlu síðnanna; sjá docs/schema.md).

/** @typedef {'old'|'new'|'sheet'|'slides'|'gen'} Source */

/** @typedef {Object} Topic
 *  @property {string} id
 *  @property {string} name
 *  @property {string} [label]       stutt merki ef annað en id, t.d. 'F7–F8'
 *  @property {string} [ref]         'MT24', 'Kafli 5.4'
 *  @property {string} [weight]      vægi eins og gamla síðan sýndi það
 *  @property {string} [part]        hluti námskeiðs, t.d. 'Hluti 1 · framboð, eftirspurn og íhlutanir'
 *  @property {string[]} [members]   eldri auðkenni sem falla undir flokkinn
 *  @property {boolean} [review]     upprifjun: ekki í blönduðu prófi né „veikustu flokkum“
 */

/** @typedef {Object} Level  @property {string} name  @property {string} desc */
/** @typedef {{h:string, body:string, p:number}} Step */
/** @typedef {{l:string, ans:number, tol:number}} NumPart */

/** @typedef {Object} Item
 *  @property {string} id
 *  @property {'mc'|'multi'|'match'|'num'|'steps'|'card'} type
 *  @property {string} topic
 *  @property {1|2|3} [level]
 *  @property {Source} source
 *  @property {string} [origin]
 *  @property {string} src
 *  @property {string} q
 *  @property {string} e
 *  @property {number} [pts]         stig á prófi (HAG107G)
 *  @property {boolean} [quick]      hraðspurning (HAG101G)
 *  mc, multi
 *  @property {string[]} [o]         2–12 valkostir, stokkaðir við birtingu
 *  @property {number|number[]} [a]  mc: númer rétts kosts; multi: númer allra réttra kosta
 *  match
 *  @property {{t:string, a:number}[]} [rows]   fullyrðingar og númer rétts dálks
 *  @property {string[]} [cols]      dálkar, t.d. ['Rétt', 'Rangt']
 *  @property {boolean} [ord]        halda röð raða (annars stokkað)
 *  num: annaðhvort eitt svar (ans, tol) eða liðir (parts)
 *  @property {number} [ans]
 *  @property {number} [tol]
 *  @property {string} [unit]
 *  @property {string} [exact]
 *  @property {boolean} [prob]
 *  @property {NumPart[]} [parts]
 *  steps
 *  @property {Step[]} [steps]
 *  @property {number} [examWeight]
 *  @property {string} [paper]       gamalt próf sem dæmið kemur úr; ekki í sérsniðnu æfingaprófi
 *  card
 *  @property {string[]} [keys]
 *  sjaldgæf
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
 *  @property {boolean} [quick]
 *  @property {string[]} [types]     gerðir sem rafallinn getur skilað, ef ekki allar krossa- og tölugerðir
 *  @property {(level?: number) => GenItem} f
 */

/** @typedef {Object} ExamFormat
 *  @property {string} id
 *  @property {string} name
 *  @property {string} desc
 *  @property {'inspera'|'written'|'mixed'} style
 *  @property {number} [minutes]
 *  @property {{by:string}} pick     quota | fixed | gens | blueprint | levels (sjá docs/schema.md)
 *  @property {string} [notice]      texti efst í skriflegu prófi (hjálpargögn); sjálfgefið „Engin reiknivél.“
 */

/** @typedef {Object} SheetSection  @property {string} id  @property {string} n  @property {string} title  @property {string} html */
/** @typedef {Object} Sheet  @property {string} head  @property {SheetSection[]} sections  @property {string} [foot]  @property {{head:string, html:string}} [a4] */

/** @typedef {{v:string, topics?:string[], kind?:string, sec?:string, start?:string}} Go */
/** @typedef {{eyebrow:string, title:string, intro:string, days:{date?:string, label:string, title?:string, cal?:string, note?:string,
 *             items:{at?:string, m:number, h:string, p?:string, go?:Go, brk?:boolean}[]}[]}} Plan */

/** @typedef {Object} ExamInfo
 *  @property {string} title
 *  @property {string} [format]
 *  @property {string} [aids]
 *  @property {string} [weight]
 *  @property {string} [note]
 *  @property {string} [callout]     HTML-reitur á forsíðu (HAG108G: „Óstaðfest“)
 *  @property {{value:string, label:string}[]} facts
 */

/** @typedef {{id:string, label:string, quick?:boolean, adapt?:boolean, cards?:boolean}} Mode */

/** @typedef {Object} Course
 *  @property {string} id
 *  @property {string} code
 *  @property {string} name
 *  @property {string} short
 *  @property {string} color
 *  @property {'mcq'|'lecture'|'written'} engine
 *  @property {Topic[]} topics
 *  @property {Object<number,Level>} [levels]
 *  @property {Mode[]} [modes]
 *  @property {Item[]} items
 *  @property {Generator[]} gens
 *  @property {ExamFormat[]} examFormats
 *  @property {Sheet} sheet
 *  @property {Plan} [plan]
 *  @property {ExamInfo} examInfo
 *  @property {number} passScore
 *  @property {Partial<Record<Source,string>>} [sourceLabels]
 *  @property {string} [genLabel]
 *  @property {{key:string, file:string}} legacy
 */

export const TYPES = ['mc', 'multi', 'match', 'num', 'steps', 'card'];
export const SOURCES = ['old', 'new', 'sheet', 'slides', 'gen'];
export const SOURCE_LABELS = { old: 'Gömul próf', new: 'Nýjar', sheet: 'Dæmablöð', slides: 'Glærur', gen: 'Rafalar' };

const isStr = v => typeof v === 'string';
const isNum = v => typeof v === 'number' && Number.isFinite(v);
const isIdx = (v, n) => Number.isInteger(v) && v >= 0 && v < n;
const badText = s => /\bNaN\b|\bInfinity\b|\bundefined\b/.test(s);

/**
 * Prófar það sem atriði eða rafalaúttak þarf að uppfylla eftir gerð. Skilar lista af villum (tómur = í lagi).
 * @param {Partial<Item>} it
 * @param {{generated?: boolean, topics?: Set<string>}} [ctx]
 */
export function validateItem(it, ctx = {}) {
  const err = [];
  const where = it.id ? `${it.id}: ` : '';
  const texts = [];
  if (!TYPES.includes(it.type)) err.push(`${where}óþekkt gerð ${it.type}`);
  if (!isStr(it.q) || !it.q.trim()) err.push(`${where}vantar q`);
  if (!isStr(it.e)) err.push(`${where}e er ekki strengur`);
  texts.push(it.q, it.e);
  if (!ctx.generated) {
    if (!isStr(it.id) || !it.id) err.push('vantar id');
    if (!SOURCES.includes(it.source)) err.push(`${where}óþekktur uppruni ${it.source}`);
    if (!isStr(it.src)) err.push(`${where}vantar src`);
    if (ctx.topics && !ctx.topics.has(it.topic)) err.push(`${where}óþekktur flokkur ${it.topic}`);
    if (it.level !== undefined && ![1, 2, 3].includes(it.level)) err.push(`${where}ógilt stig ${it.level}`);
  }
  if (it.pts !== undefined && !(isNum(it.pts) && it.pts > 0)) err.push(`${where}ógild stig ${it.pts}`);
  if (it.type === 'mc' || it.type === 'multi') {
    if (!Array.isArray(it.o) || it.o.length < 2 || it.o.length > 12) err.push(`${where}${it.type} þarf 2–12 valkosti`);
    else {
      if (!it.o.every(isStr)) err.push(`${where}valkostur er ekki strengur`);
      if (new Set(it.o).size !== it.o.length) err.push(`${where}tvíteknir valkostir`);
      if (it.type === 'mc' && !isIdx(it.a, it.o.length)) err.push(`${where}rétt svar ${it.a} ekki meðal valkosta`);
      if (it.type === 'multi' && !(Array.isArray(it.a) && it.a.length && it.a.every(i => isIdx(i, it.o.length)) && new Set(it.a).size === it.a.length)) err.push(`${where}ógild rétt svör ${it.a}`);
      texts.push(...it.o);
    }
  }
  if (it.type === 'match') {
    if (!Array.isArray(it.cols) || it.cols.length < 2) err.push(`${where}pörun þarf minnst tvo dálka`);
    else if (!Array.isArray(it.rows) || !it.rows.length || !it.rows.every(r => isStr(r.t) && isIdx(r.a, it.cols.length))) err.push(`${where}ógildar raðir í pörun`);
    else texts.push(...it.rows.map(r => r.t));
  }
  if (it.type === 'num') {
    if (it.parts) {
      if (!it.parts.length || !it.parts.every(p => isStr(p.l) && isNum(p.ans) && isNum(p.tol) && p.tol >= 0)) err.push(`${where}ógildir liðir í tölusvari`);
    } else {
      if (!isNum(it.ans)) err.push(`${where}ans er ekki endanleg tala`);
      if (!isNum(it.tol) || it.tol < 0) err.push(`${where}ógilt tol`);
      if (it.exact !== undefined && !/^-?\d+(\/-?\d+)?$/.test(it.exact)) err.push(`${where}ógilt exact ${it.exact}`);
    }
  }
  if (it.type === 'steps') {
    if (!Array.isArray(it.steps) || !it.steps.length) err.push(`${where}vantar skref`);
    else it.steps.forEach((s, i) => { if (!isStr(s.h) || !isStr(s.body) || !isNum(s.p) || s.p <= 0) err.push(`${where}skref ${i + 1} ógilt`); else texts.push(s.body); });
  }
  if (it.type === 'card' && it.keys !== undefined && !(Array.isArray(it.keys) && it.keys.every(isStr))) err.push(`${where}keys ógilt`);
  if (ctx.generated && texts.some(t => isStr(t) && badText(t))) err.push(`${where}texti inniheldur NaN, Infinity eða undefined`);
  return err;
}

/** Prófar heilt fag: svið, auðkenni, flokka, prófsnið og Blaðið. Rafalar eru prófaðir sér (tests/generators.test.js). */
export function validateCourse(c) {
  const err = [];
  for (const k of ['id', 'code', 'name', 'short', 'color', 'engine']) if (!isStr(c[k]) || !c[k]) err.push(`vantar ${k}`);
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
    const p = f.pick || {};
    if (!['inspera', 'written', 'mixed'].includes(f.style)) err.push(`prófsnið ${f.id}: óþekkt snið ${f.style}`);
    if (!f.minutes && p.by !== 'levels') err.push(`prófsnið ${f.id}: enginn tími`);
    if (p.by === 'quota') for (const t of Object.keys(p.quota)) if (!topics.has(t)) err.push(`prófsnið ${f.id}: óþekktur flokkur ${t}`);
    if (p.by === 'fixed') for (const id of p.ids) if (!ids.has(id)) err.push(`prófsnið ${f.id}: óþekkt atriði ${id}`);
    if (p.by === 'blueprint') for (const s of p.sections) {
      for (const t of s.topics || []) if (!topics.has(t)) err.push(`prófsnið ${f.id}: óþekktur flokkur ${t}`);
      for (const id of s.ids || []) if (!ids.has(id)) err.push(`prófsnið ${f.id}: óþekkt atriði ${id}`);
      if (!s.topics && !(s.ids && s.ids.length)) err.push(`prófsnið ${f.id}: sæti án flokka og atriða`);
    }
  }
  if (!c.sheet || !isStr(c.sheet.head) || !Array.isArray(c.sheet.sections) || !c.sheet.sections.length) err.push('vantar Blaðið');
  if (!isNum(c.passScore) || c.passScore <= 0 || c.passScore > 1) err.push('ógilt passScore');
  return err;
}
