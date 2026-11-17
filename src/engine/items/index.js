// Spurningagerðirnar: tómt svar, birting, mat og dómur. Útlit og textar eru úr gömlu síðunum:
// kross og „veldu allt“/pörun/tölusvar með liðum úr HAG107G, tölusvar með vikmörkum úr HAG106G/HAG108G,
// nákvæmt brotasvar úr HAG101G, skrefadæmi úr HAG101G og spjöld úr HAG106G/HAG108G.
//
// Svör: mc → númer | null · multi → [númer] · match → [dálkur | null] · num → strengur (eða [strengur] með liðum)
//       steps → {st:[0|1|2], mk:[true|false|null], txt} · card → {flip:boolean, txt}

import { F } from '../../ui/format.js';
import { esc } from '../../ui/dom.js';

export const LET = 'ABCDEFGHIJKL'.split('');

// ---------- tölur ----------
// Les tölusvar: „0,541“, „54,1%“, „1.250.000“, „−3,5“, „1 200“, „12 kr.“. Skilar NaN ef ólæsilegt.
export function parseNum(s) {
  if (s === null || s === undefined) return NaN;
  let t = String(s).trim().replace(/[\s  ]/g, '').replace(/[−–]/g, '-').replace(/kr\.?|%|\$|ár|mín\.?|stig|dalir|dali/gi, '');
  if (!t) return NaN;
  if (t.includes(',')) t = t.replace(/\./g, '').replace(',', '.');
  else if (/^-?[1-9]\d{0,2}(\.\d{3})+$/.test(t)) t = t.replace(/\./g, '');
  if (!/^-?\d*\.?\d+(e-?\d+)?$/i.test(t)) return NaN;
  return parseFloat(t);
}

// Heiltala, brot eða tugabrot sem nákvæmt brot [teljari, nefnari]; null ef ólæsilegt (eins og parseAns í HAG101G).
export function parseFrac(s) {
  s = String(s).trim().replace(/[−–]/g, '-').replace(/\s+/g, '').replace(',', '.');
  let m = s.match(/^([+-]?\d+)\/([+-]?\d+)$/); if (m) { const d = +m[2]; return d === 0 ? null : [+m[1], d]; }
  m = s.match(/^([+-]?)(\d*)\.?(\d*)$/);
  if (m && (m[2] || m[3])) { const k = m[3].length; return [(m[1] === '-' ? -1 : 1) * (+(m[2] || '0') * 10 ** k + +(m[3] || '0')), 10 ** k]; }
  return null;
}
const sameFrac = (x, y) => x[0] * y[1] === y[0] * x[1];
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
export function fracTex(str) {
  let [n, d] = str.split('/').map(Number); d = d || 1;
  if (d < 0) { n = -n; d = -d; }
  const g = gcd(n, d); n /= g; d /= g;
  return d === 1 ? String(n) : `${n < 0 ? '-' : ''}\\frac{${Math.abs(n)}}{${d}}`;
}

const decOf = tol => tol >= 0.5 ? 0 : tol >= 0.05 ? 1 : tol >= 0.005 ? 2 : tol >= 0.0005 ? 3 : 4;
export const fmtAns = it => F.dec(it.ans, it.prob ? Math.min(4, Math.max(3, decOf(it.tol) + 1)) : decOf(it.tol)) + (it.unit ? ' ' + it.unit : '');
export const tolTxt = t => t >= 1 ? F.dec(t, t % 1 ? 1 : 0) : String(+t.toPrecision(2)).replace('.', ',');
const niceNum = v => { const neg = v < 0; let [i, f] = String(Math.round(Math.abs(v) * 1000) / 1000).split('.'); i = i.replace(/\B(?=(\d{3})+(?!\d))/g, '.'); return (neg ? '−' : '') + i + (f ? ',' + f : ''); };

function numOk(it, v) {
  if (v === null || v === undefined || !String(v).trim()) return false;
  if (it.exact !== undefined) { const g = parseFrac(v); const [n, d] = it.exact.split('/').map(Number); return !!g && sameFrac(g, [n, d || 1]); }
  let x = parseNum(v); if (it.prob && /%/.test(String(v))) x /= 100;
  return Number.isFinite(x) && Math.abs(x - it.ans) <= it.tol + 1e-9;
}
const partOk = (p, v) => { const x = parseNum(v); return Number.isFinite(x) && Math.abs(x - p.ans) <= p.tol + 1e-9; };

// ---------- tómt svar, svarað? ----------
export function blank(it) {
  if (it.type === 'multi') return [];
  if (it.type === 'match') return it.rows.map(() => null);
  if (it.type === 'num') return it.parts ? it.parts.map(() => '') : '';
  if (it.type === 'steps') return { st: it.steps.map(() => 0), mk: it.steps.map(() => null), txt: '' };
  if (it.type === 'card') return { flip: false, txt: '' };
  return null;
}

export function answered(it, r) {
  if (r === null || r === undefined) return false;
  if (it.type === 'mc') return true;
  if (it.type === 'multi') return r.length > 0;
  if (it.type === 'match') return r.some(v => v !== null);
  if (it.type === 'num') return it.parts ? r.some(v => String(v).trim() !== '') : String(r).trim() !== '';
  return !!(r.txt && r.txt.trim());
}

/** Hlutfall réttra (0–1). Skrefadæmi: hlutfall stiga í skrefum sem merkt eru rétt. Spjöld eru ekki metin (null). */
export function grade(it, r) {
  let frac = 0;
  if (it.type === 'mc') frac = r === it.a ? 1 : 0;
  else if (it.type === 'multi') { const ch = r || []; const right = ch.filter(i => it.a.includes(i)).length; frac = Math.max(0, (right - (ch.length - right)) / it.a.length); }
  else if (it.type === 'match') frac = it.rows.filter((row, i) => r && r[i] === row.a).length / it.rows.length;
  else if (it.type === 'num') frac = it.parts ? it.parts.filter((p, i) => r && partOk(p, r[i])).length / it.parts.length : numOk(it, r) ? 1 : 0;
  else if (it.type === 'steps') { const tot = it.steps.reduce((s, x) => s + x.p, 0); frac = it.steps.reduce((s, x, i) => s + (r && r.mk[i] ? x.p : 0), 0) / tot; }
  else return null;
  return frac;
}

export const stepTotal = it => it.steps.reduce((s, x) => s + x.p, 0);
export const ptsTxt = v => String(Math.round(v * 10) / 10).replace('.', ',');

// ---------- birting ----------
/** Svarsvæðið (án spurningartexta). ctx: {reveal, exam, noMark} */
export function renderAnswer(it, r, ctx = {}) {
  const rev = !!ctx.reveal;
  if (it.type === 'mc') return `<div class="opts">${it.o.map((o, i) => {
    let cls = 'opt'; if (rev) { if (i === it.a) cls += ' right'; else if (i === r) cls += ' wrong'; } else if (i === r) cls += ' sel';
    return `<button class="${cls}" data-i="${i}" ${rev ? 'disabled' : ''}><span class="k">${LET[i]}</span><span>${o}</span></button>`; }).join('')}</div>`;
  if (it.type === 'multi') { const ch = r || [];
    return `<p class="hint">Veldu allt sem á við. Rangt val dregur frá innan spurningarinnar.</p><div class="opts">${it.o.map((o, i) => {
      let cls = 'opt multi'; const on = ch.includes(i), good = it.a.includes(i);
      if (rev) { if (on && good) cls += ' right'; else if (on) cls += ' wrong'; else if (good) cls += ' miss'; } else if (on) cls += ' sel';
      return `<button class="${cls}" data-i="${i}" aria-pressed="${on}" ${rev ? 'disabled' : ''}><span class="k">${on ? '✓' : LET[i]}</span><span>${o}</span></button>`; }).join('')}</div>`; }
  if (it.type === 'match') { const ch = r || [];
    return `<div class="match">${it.rows.map((row, i) => `<div class="mrow"><div class="mt">${row.t}</div><div class="mseg">${it.cols.map((c, j) => {
      let cls = ''; if (rev) { if (j === row.a) cls = 'ok'; else if (j === ch[i]) cls = 'no'; }
      return `<button class="${cls}" data-r="${i}" data-c="${j}" aria-pressed="${ch[i] === j}" ${rev ? 'disabled' : ''}>${c}</button>`; }).join('')}</div></div>`).join('')}</div>`; }
  if (it.type === 'num' && it.parts) { const ch = r || [];
    return `<div class="nums">${it.parts.map((p, i) => { const ok = rev && partOk(p, ch[i]);
      return `<div class="nrow"><label for="n-${i}">${p.l}</label><div class="row" style="gap:8px;flex-wrap:nowrap"><input id="n-${i}" class="ninp ${rev ? (ok ? 'ok' : 'no') : ''}" data-p="${i}" inputmode="decimal" autocomplete="off" spellcheck="false" value="${esc(ch[i] ?? '')}" ${rev ? 'disabled' : ''}>
        ${rev ? `<span class="nres ${ok ? 'ok' : 'no'}">${ok ? '✓' : '✗ ' + niceNum(p.ans)}</span>` : ''}</div></div>`; }).join('')}<p class="hint">Komma eða punktur sem tugabrotsmerki. Námundaðu að minnsta kosti í tvo aukastafi.</p></div>`; }
  if (it.type === 'num' && it.exact !== undefined) {
    const ok = rev && numOk(it, r);
    return `<div class="ansrow"><label class="hint" for="numin">Svar</label><input id="numin" class="ans-in ${rev ? (ok ? 'r' : 'w') : ''}" inputmode="text" autocomplete="off" placeholder="t.d. -3/2" value="${esc(r || '')}" ${rev ? 'readonly' : ''} aria-label="Svar"></div>
      <p class="hint">Heiltala, brot (−3/2) eða tugabrot (0,25). Brot eru borin saman sem brot, svo 6/4 = 3/2.</p>`;
  }
  if (it.type === 'num') {
    const ok = rev && numOk(it, r);
    const res = rev ? `<div class="numres"><span>Þitt svar: <b class="${ok ? 'ok' : 'no'}">${r ? esc(r) : '—'}</b></span><span>Rétt: <b>${fmtAns(it)}</b></span><span class="hint">vikmörk ±${tolTxt(it.tol)}</span></div>` : '';
    return `<div class="numrow"><input id="numin" inputmode="decimal" autocomplete="off" placeholder="t.d. 12,34" value="${esc(r || '')}" ${rev ? 'disabled' : ''} aria-label="Tölusvar">${it.unit ? `<span class="unit">${esc(it.unit)}</span>` : ''}</div>
      ${rev ? '' : `<p class="hint tolhint">Vikmörk ±${tolTxt(it.tol)}${it.unit ? ' ' + esc(it.unit) : ''} · komma fyrir aukastafi${it.prob ? ' · líkur má gefa sem 0,541 eða 54,1%' : ''}</p>`}${res}`;
  }
  if (it.type === 'steps') return renderSteps(it, r, ctx);
  // spjald
  const flip = rev || (r && r.flip);
  return `<div class="flash"><div class="side">Spurning</div><div class="front">${it.q}</div><textarea class="scratch" data-txt placeholder="Hugsaðu eða skrifaðu svarið áður en þú snýrð spjaldinu" ${flip && !ctx.exam ? 'readonly' : ''}>${esc((r && r.txt) || '')}</textarea>
    ${flip ? `<div class="back"><div class="side">Fyrirmyndarsvar</div><p>${it.e}</p>${it.keys ? `<div class="side">Gott svar nefnir</div><ul class="keys">${it.keys.map(k => `<li>${k}</li>`).join('')}</ul>` : ''}</div>` : ''}</div>`;
}

/** Skrefin: falin, titill sýndur (vísbending) eða lausn sýnd; hvert sýnt skref merkt rétt eða vantaði. */
export function renderSteps(it, r, ctx = {}) {
  return `<div class="steps">${it.steps.map((s, i) => {
    const state = ctx.reveal ? 2 : r.st[i]; const mk = r.mk[i];
    const cls = state === 2 ? (mk === true ? 'ok' : mk === false ? 'miss' : '') : 'locked';
    const head = `<header><span class="no">${i + 1}</span><span class="ttl">${state >= 1 ? s.h : '<span class="muted">Skref falið</span>'}</span><span class="pts">${s.p} stig</span></header>`;
    const marks = ctx.noMark ? '' : `<div class="mark">${mk === null ? '<span class="hint">Hafðir þú þetta skref rétt?</span>' : ''}<button class="btn small good" data-mk="${i}" data-v="1" aria-pressed="${mk === true}">${mk === true ? '✓ Rétt' : 'Rétt hjá mér'}</button><button class="btn small bad" data-mk="${i}" data-v="0" aria-pressed="${mk === false}">${mk === false ? '✗ Vantaði' : 'Vantaði eða rangt'}</button></div>`;
    return `<div class="sstep ${cls}" data-i="${i}">${head}${state === 2 ? `<div class="body">${s.body}${marks}</div>` : ''}</div>`;
  }).join('')}</div>`;
}

/** Dómur eftir svar (kross, veldu allt, pörun, tölusvar). */
export function verdictHTML(it, r, max) {
  const frac = grade(it, r), unans = !answered(it, r), ok = frac >= 0.999;
  let key = '';
  if (it.type === 'mc') key = ' Rétt svar er ' + LET[it.a] + '.';
  if (it.type === 'multi') key = ' Rétt svör: ' + it.a.map(i => LET[i]).join(', ') + '.';
  if (it.type === 'num' && it.exact !== undefined) key = ` Rétt svar: \\(${fracTex(it.exact)}\\)`;
  const partial = max ? `Að hluta rétt: ${ptsTxt(frac * max)} af ${ptsTxt(max)} stigum.` : 'Að hluta rétt.';
  const head = unans ? 'Ósvarað.' + key : ok ? 'Rétt.' : frac > 0 ? partial + key : 'Rangt.' + key;
  return `<div class="verdict ${ok ? 'ok' : 'no'}">${head}</div>`;
}

// ---------- samskipti ----------
/** Smellur á valkost eða pörunarhnapp: skilar nýju svari eða undefined. */
export function clickAnswer(it, r, e) {
  const opt = e.target.closest('.opt'); if (opt && !opt.disabled) {
    const i = +opt.dataset.i;
    if (it.type === 'mc') return i;
    if (it.type === 'multi') { const s = new Set(r || []); s.has(i) ? s.delete(i) : s.add(i); return [...s].sort((a, b) => a - b); }
  }
  const m = e.target.closest('[data-r]'); if (m && !m.disabled && it.type === 'match') { const out = (r || it.rows.map(() => null)).slice(); out[+m.dataset.r] = +m.dataset.c; return out; }
  return undefined;
}

/** Innsláttur í tölusvar eða krotreit: uppfærir svarið á staðnum og skilar true ef eitthvað breyttist. */
export function inputAnswer(it, holder, key, e) {
  const t = e.target;
  if (t.matches('.ninp') && it.type === 'num' && it.parts) { holder[key][+t.dataset.p] = t.value; return true; }
  if (t.id === 'numin' && it.type === 'num') { holder[key] = t.value; return true; }
  if (t.matches('[data-txt]') && (it.type === 'steps' || it.type === 'card')) { holder[key].txt = t.value; return true; }
  return false;
}

// Flýtilyklar: 1–9 og (fyrir krossa) a–l velja kost.
export function keyToIndex(it, key) {
  if (/^[1-9]$/.test(key)) return +key - 1;
  if ((it.type === 'mc' || it.type === 'multi') && /^[a-l]$/i.test(key)) return key.toLowerCase().charCodeAt(0) - 97;
  return undefined;
}
