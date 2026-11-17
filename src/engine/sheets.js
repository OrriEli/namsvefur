// Leit í Blöðum allra faga: „núvirði“ eða „Hessian“ sýnir hvaða kafli í hvaða fagi geymir orðið.
// Leitin hunsar há- og lágstafi og kommur (núvirði = nuvirdi), og ð = d. Hver stafur er felldur í einn
// staf, svo staðsetning samsvörunar í felldum texta er sú sama og í upprunalega textanum.

const ENT = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&nbsp;': ' ', '&#39;': "'" };
const TEX = { '\\le': '≤', '\\leq': '≤', '\\ge': '≥', '\\geq': '≥', '\\cdot': '·', '\\times': '×', '\\neq': '≠', '\\approx': '≈', '\\infty': '∞', '\\pm': '±', '\\to': '→', '\\sum': 'Σ', '\\int': '∫', '\\sqrt': '√', '\\in': '∈', '\\lambda': 'λ', '\\mu': 'μ', '\\sigma': 'σ', '\\rho': 'ρ', '\\chi': 'χ', '\\Phi': 'Φ', '\\alpha': 'α', '\\beta': 'β', '\\pi': 'π', '\\Delta': 'Δ', '\\partial': '∂' };

/** Hreinn texti úr HTML kafla: merki fjarlægð, stærðfræði gerð læsileg. */
export function sectionText(html) {
  return String(html)
    .replace(/<(script|style)[\s\S]*?<\/\1>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z#0-9]+;/gi, m => ENT[m] ?? ' ')
    .replace(/\\[()[\]]/g, ' ')
    .replace(/\\(?:mathrm|text|operatorname|textbf|mathbf)\{([^}]*)\}/g, '$1')
    .replace(/\\[a-zA-Z]+/g, m => TEX[m] ?? ' ')
    .replace(/\{,\}/g, ',').replace(/[{}^_]/g, '').replace(/\\/g, ' ')
    .replace(/\s+/g, ' ').trim();
}

/** Fellir texta staf fyrir staf: lágstafir, án kommu, ð → d. Lengdin helst. */
export function fold(s) {
  let out = '';
  for (const ch of s) {
    const l = ch.toLowerCase();
    const f = l === 'ð' ? 'd' : l.normalize('NFD').replace(/[̀-ͯ]/g, '');
    out += f.length === 1 ? f : (l.length === 1 ? l : ch);
  }
  return out;
}

/** Vísir: einn hlutur á kafla í hverju fagi. */
export function buildIndex(courses) {
  const out = [];
  for (const c of courses) for (const s of c.sheet.sections) {
    const text = sectionText(s.html);
    out.push({ course: c, section: s, text, folded: fold(text) });
  }
  return out;
}

/**
 * Leitar að `q` (öll orð verða að finnast í kaflanum). Skilar köflum með fjölda samsvarana og bútum.
 * `inTitle`: öll orðin eru í fyrirsögn kaflans (sýndur fyrst).
 * @returns {{course:Object, section:Object, hits:number, inTitle:boolean, snippets:{before:string, match:string, after:string}[]}[]}
 */
export function search(index, q, { snippets = 2, width = 70 } = {}) {
  const words = fold(q.trim()).split(/\s+/).filter(w => w.length >= 2);
  if (!words.length) return [];
  const res = [];
  for (const e of index) {
    if (!words.every(w => e.folded.includes(w))) continue;
    const at = [];
    for (const w of words) { let i = e.folded.indexOf(w); while (i >= 0) { at.push([i, w.length]); i = e.folded.indexOf(w, i + w.length); } }
    at.sort((a, b) => a[0] - b[0]);
    const sn = [];
    for (const [i, len] of at) {
      if (sn.length >= snippets) break;
      if (sn.some(s => Math.abs(s.i - i) < width)) continue;
      const a = Math.max(0, i - width), b = Math.min(e.text.length, i + len + width);
      sn.push({ i, before: (a > 0 ? '…' : '') + e.text.slice(a, i), match: e.text.slice(i, i + len), after: e.text.slice(i + len, b) + (b < e.text.length ? '…' : '') });
    }
    const title = fold(e.section.title);
    res.push({ course: e.course, section: e.section, hits: at.length, inTitle: words.every(w => title.includes(w)), snippets: sn.map(({ i, ...x }) => x) });
  }
  return res;
}
