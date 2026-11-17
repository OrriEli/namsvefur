// Hleður gamalli prófæfingasíðu í lokað vm-umhverfi og skilar gagnafylkjum hennar.
// Skráin í legacy/ er aðeins lesin. Innbyggðu <script>-blokkirnar eru keyrðar óbreyttar,
// nema einni línu er skotið inn rétt á undan lokaræsingunni (`updateWrongPill(); setTopH();`)
// svo hægt sé að lesa breytur sem eru inni í IIFE-lokun síðunnar.

import { readFileSync } from 'node:fs';
import vm from 'node:vm';

// Öll nöfn sem gætu verið til í einhverri gömlu síðunni. Það sem vantar verður einfaldlega undefined.
export const NAMES = [
  // gögn
  'OLD', 'NEW', 'GENS', 'STATIC', 'QUICK', 'BANK', 'CARDS', 'SHEET_PROBS', 'NEW_PROBS', 'QGENS',
  'OLD2', 'NEW2', 'GENS2', 'GEN', 'OLDALL', 'FINAL_PROBS', 'A4_HTML',
  // efnisflokkar og próf
  'TOPICS', 'ORDER', 'MIX', 'BLUEPRINT', 'OLD_EXAM', 'EXAM_AT', 'EXAM', 'LECTURES', 'LEVELS', 'MIXES',
  'LEN', 'XC', 'R_SHARE', 'KIND_LABEL', 'FROM', 'MIX2', 'FIRST', 'SECOND', 'EXAM_SETS', 'PART', 'AP', 'NMIX', 'TY_LABEL',
  // færslur í æfingapotti
  'ENTRIES', 'W_ENTRIES', 'Q_ENTRIES',
  // blaðið og áætlun
  'SHEET', 'SHEET_LEC', 'SHEET_RULES', 'SHEET_DECIDE', 'SHEET_TRAPS', 'SHEET_DIST', 'SHEET_R',
  'SHEET_ERRATA', 'UNCONFIRMED', 'PLAN',
  // geymsla
  'KEY', 'STORE_KEY', 'S',
  // föll sem útdrátturinn notar
  'renderSheet', 'renderPlan', 'renderHome', 'renderExam', 'buildExam', 'instantiate', 'instW', 'instQ', 'parseNum', 'parseAns', 'gradeNum',
  'maxPts', 'grade', 'blank', 'answered', 'numOK', 'record', 'recordW', 'recordQ', 'topicStats', 'statsW', 'cellStats',
  'F', 'R', 'PROB'
];

const INIT_LINE = /^updateWrongPill\(\); ?setTopH\(\);/m;

// Lítill DOM-staðgengill: allt er til og gerir ekkert, nema gildi sem eru sett eru geymd.
function stub() {
  const store = {};
  const fn = function () { return stub(); };
  return new Proxy(fn, {
    get(_, k) {
      if (k in store) return store[k];
      if (k === Symbol.toPrimitive) return () => 0;
      if (k === 'then' || k === Symbol.iterator) return undefined;
      return stub();
    },
    set(_, k, v) { store[k] = v; return true; },
    apply() { return stub(); }
  });
}

function makeDocument() {
  const els = new Map();
  const el = sel => { if (!els.has(sel)) els.set(sel, stub()); return els.get(sel); };
  const doc = stub();
  doc.querySelector = el;
  doc.getElementById = id => el('#' + id);
  doc.querySelectorAll = () => [];
  doc.addEventListener = () => {};
  doc.documentElement = stub();
  return doc;
}

/** Skilar innbyggðu (ekki src=) script-blokkunum í röð. */
export function inlineScripts(html) {
  const out = [];
  const re = /<script(\s[^>]*)?>([\s\S]*?)<\/script>/g;
  let m;
  while ((m = re.exec(html))) { if (!/\bsrc=/.test(m[1] || '')) out.push(m[2]); }
  return out;
}

/**
 * Keyrir síðuna og skilar { vars, errors, html }.
 * vars inniheldur öll NAMES sem fundust. errors eru villur sem komu upp eftir að gögnin voru lesin
 * (t.d. í teiknun forsíðu); þær hafa ekki áhrif á gögnin.
 */
export function loadLegacy(path) {
  const html = readFileSync(path, 'utf8');
  const scripts = inlineScripts(html);
  const engineIdx = scripts.findIndex(s => INIT_LINE.test(s));
  if (engineIdx < 0) throw new Error(`Fann ekki lokaræsingu í ${path}`);
  const hook = `globalThis.__legacy = (names => { const o = {}; for (const k of names) { try { o[k] = eval(k); } catch (e) {} } return o; })(${JSON.stringify(NAMES)});\n`;
  scripts[engineIdx] = scripts[engineIdx].replace(INIT_LINE, m => hook + m);

  const ctx = {
    document: makeDocument(),
    localStorage: { getItem: () => null, setItem() {}, removeItem() {} },
    console: { log() {}, warn() {}, error() {}, info() {} },
    setTimeout: () => 0, clearTimeout() {}, setInterval: () => 0, clearInterval() {},
    queueMicrotask: () => {}, requestAnimationFrame: () => 0,
    matchMedia: () => ({ matches: false }),
    MutationObserver: class { observe() {} disconnect() {} },
    innerWidth: 1280, innerHeight: 800,
    addEventListener() {}, removeEventListener() {}, scrollTo() {}, scrollY: 0
  };
  vm.createContext(ctx);
  vm.runInContext('globalThis.window = globalThis;', ctx);

  const errors = [];
  scripts.forEach((src, i) => {
    try { vm.runInContext(src, ctx, { filename: `${path}#script${i}` }); }
    catch (e) {
      if (i === engineIdx && ctx.__legacy) errors.push(String(e && e.stack || e).split('\n').slice(0, 2).join(' '));
      else throw e;
    }
  });
  if (!ctx.__legacy) throw new Error(`Gögn náðust ekki úr ${path}`);
  const vars = Object.fromEntries(Object.entries(ctx.__legacy).filter(([, v]) => v !== undefined));
  return { vars, errors, html, ctx };
}

/** Kallar á teiknifall síðunnar og skilar HTML-inu sem það setti í #app. */
export function renderToHtml(loaded, fnName, arg) {
  const fn = loaded.vars[fnName];
  if (typeof fn !== 'function') return null;
  fn(arg || {});
  return loaded.ctx.document.querySelector('#app').innerHTML;
}

/** Kallar á onclick-meðhöndlun #app með gervismelli á eigindi, t.d. clickApp(L, '[data-tab]', {tab:'a4'}). */
export function clickApp(loaded, selector, dataset) {
  const app = loaded.ctx.document.querySelector('#app');
  const target = { closest: sel => sel === selector ? { dataset, disabled: false } : null, matches: () => false };
  app.onclick({ target, preventDefault() {} });
  return app.innerHTML;
}
