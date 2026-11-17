// Búið til af scripts/extract-legacy.js úr legacy/HAG108G prófæfing.html. Ekki breyta í höndunum.
// Gagnablokk gömlu síðunnar, orðrétt; aðeins skilgreiningu síðunnar á F er skipt út fyrir sameiginlegu eininguna.
/* eslint-disable */
import { makeF } from '../../ui/format.js';

// ===================== STILLINGAR — breyttu hér =====================
// NÝR GLÆRUPAKKI (t.d. L10 aðhvarfsgreining) — svona er honum bætt við:
//   1. Taktu L10 úr athugasemd í LECTURES hér fyrir neðan.
//   2. Bættu dæmum í BANK með lec:'L10' og einkvæmu id (snið 'L10-hv-…', 'L10-gl-…', 'L10-ny-…').
//      Minnst 6 dæmi á hvert stig (lvl 1, 2, 3) og minnst 3 spjöld (kind:'card', lvl:3).
//      from: 'hv' = heima-/skilaverkefni · 'gl' = dæmi úr glærum · 'ny' = nýtt.
//   3. Bættu rafala í GENS: { id, lec:'L10', name, f(lvl) { … return num(…) / pnum(…) / mc(…) } }.
//      Stigið á að breyta uppbyggingu spurningarinnar, ekki bara tölunum.
//   4. Bættu formúlum í SHEET_LEC.L10 (og línu í SHEET_DIST ef ný dreifing bætist við).
//   5. Keyrðu prófanirnar (Node + R + Playwright) áður en þú birtir.
// R-spurningar fá r:true (rafalar líka) svo prófhamurinn geti tryggt minnst 15% R ef L00 er valið.
const LECTURES = [
  { id: 'L00', label: 'L00', name: 'Inngangur og R', ch: '–' },
  { id: 'L01', label: 'L01', name: 'Útkomurúm og líkindi', ch: 'SBE 3.1–3.5' },
  { id: 'L02', label: 'L02', name: 'Strjálar slembibreytur', ch: 'SBE 4.1–4.3' },
  { id: 'L03', label: 'L03', name: 'Strjálar dreifingar', ch: 'SBE 4.4–4.5' },
  { id: 'L04', label: 'L04', name: 'Samfelldar slembibreytur', ch: 'SBE 5.1–5.2' },
  { id: 'L05', label: 'L05', name: 'Samfelldar dreifingar', ch: 'SBE 5.3–5.5' },
  { id: 'L06', label: 'L06', name: 'Margvíðar slembibreytur og skilyrt vægi', ch: 'SBE 4.7, 5.6, 7.1–7.4' },
  { id: 'L07', label: 'L07', name: 'Úrtök og höfuðmarkgildissetningin', ch: 'SBE 6.1–6.4' },
  { id: 'L08', label: 'L08', name: 'Metlar og punktamat', ch: 'SBE 9.1–9.4' },
  { id: 'L09', label: 'L09', name: 'Tilgátupróf og öryggisbil', ch: 'SBE 9.1–9.6' },
  // { id: 'L10', label: 'L10', name: 'Aðhvarfsgreining', ch: 'SBE 11.1–11.9' },
];

// Lokaprófið. Það sem er óvíst er merkt „óstaðfest".
const EXAM = {
  at: '2026-12-01T13:30:00Z',  // 1. des. 2026 kl. 13:30 (Ísland = UTC)
  where: '',                   // óstaðfest
  minutes: 180,                // 3 klst.
  weight: '70% af einkunn; verkefnaeinkunnin (30%) gildir aðeins ef þú færð minnst 5 á lokaprófinu',
  format: 'Snið lokaprófsins er óstaðfest. Kennarinn segir að allt til prófs sé í glærunum og að spurningarnar líkist heimaverkefnunum; R er líka prófað.',
  aids: 'Reiknivél, formúlublað og töflur fyrir N/t/χ²/F',
  sheetNote: 'Óstaðfest hvort formúlublaðið er eigið eða frá kennara.',
  tables: true,                // töflur leyfðar: normalspurningar taka bæði töflugildi og nákvæmt gildi gilt
  sheetAllowed: true,
  explainQuestions: true       // opnar spurningar í prófham, birtar með fyrirmyndarsvari, teljast ekki
};

const LEVELS = {
  1: { n: 'Grunnur', d: 'Skilgreining, ein formúla, eitt skref.' },
  2: { n: 'Prófstig', d: 'Í stíl við heimaverkefnin. Kjarninn, því prófið líkist þeim.' },
  3: { n: 'Erfitt', d: 'Margþrepa dæmi, samdreifingar, skilyrt vægi og útleiðslur.' }
};
const MIXES = { exam: { n: 'Eins og prófið', w: [0.2, 0.5, 0.3] }, hard: { n: 'Erfitt', w: [0.1, 0.3, 0.6] } };
const STORE_KEY = 'hag108g-profaefing-v1';
const R_SHARE = 0.15;          // lágmarkshlutfall R-spurninga í prófi ef L00 er valið

// ===================== HJÁLPARFÖLL (notuð bæði við smíði og í síðunni) =====================
const R = {
  ri: (a, b) => a + Math.floor(Math.random() * (b - a + 1)),
  rs: (a, b, step) => { const n = Math.round((b - a) / step); return +(a + step * Math.floor(Math.random() * (n + 1))).toFixed(10); },
  pick: arr => arr[Math.floor(Math.random() * arr.length)],
  shuffle: arr => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; },
  sample: (arr, k) => R.shuffle(arr).slice(0, k)
};

// Íslensk talnasnið: punktur skilur þúsundir, komma aukastafi. F.m(...) er sama fyrir KaTeX (komma sem {,}).
const F = makeF({ pctDigits: 1 });
const T = String.raw;                      // T`\frac{a}{b}` heldur bakstrikum
const M = s => '\\(' + s + '\\)';         // stærðfræði í línu

// Útreikningur í línum með jöfnumerkjum í dálkum. Hver reitur er KaTeX nema hann byrji á §.
// Skiptir línu á ' = ' utan sviga, hornklofa og slaufusviga (E[X | Y = y] helst heilt)
function splitEq(r) {
  const out = []; let d = 0, cur = '';
  for (let i = 0; i < r.length; i++) {
    const c = r[i];
    if (c === '(' || c === '[' || c === '{') d++; else if ((c === ')' || c === ']' || c === '}') && d > 0) d--;
    if (d === 0 && r.startsWith(' = ', i)) { out.push(cur); cur = ''; i += 2; continue; }
    cur += c;
  }
  out.push(cur); return out;
}
function calc(...rows) {
  return '<div class="f"><table class="cl">' + rows.map(r => r === '' ? '<tr class="sp"><td></td></tr>'
    : String(r).startsWith('§') ? `<tr><td colspan="9" class="txt">${String(r).slice(1)}</td></tr>`   // textalína: ein heil reit
    : '<tr>' + splitEq(String(r)).map((c, i) => (i ? '<td class="eq">=</td>' : '') + `<td>${c.startsWith('§') ? c.slice(1) : M(c)}</td>`).join('') + '</tr>').join('') + '</table></div>';
}
const trap = html => `<p class="trap"><b>Gildra.</b> ${html}</p>`;
const note = html => `<p class="note">${html}</p>`;
const slideErr = html => `<p class="slideerr"><b>Villa á glæru.</b> ${html}</p>`;
const unconf = html => `<p class="unconf"><b>Óstaðfest.</b> ${html}</p>`;
const traps = list => '<ul class="traps">' + list.map(([v, why]) => `<li><b>${v}</b> ${why}</li>`).join('') + '</ul>';
const tbl = (head, rows, cls = 'dt') => `<table class="${cls}"><thead><tr>${head.map(h => `<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
const escH = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const code = src => `<pre class="code">${escH(src.replace(/^\n+|\s+$/g, ''))}</pre>`;
const out = src => `<pre class="code out">${escH(src)}</pre>`;
const hint = s => ` <span class="hint">${s}</span>`;

// Byggir 5 ólíka valkosti; rétta svarið fremst (a = 0). Stokkað þegar spurningin birtist.
function opts(correct, distract, fmt, perturb) {
  const c = fmt(correct); const res = [c]; const seen = new Set([c]);
  for (const d of distract) { if (d === null || d === undefined || (typeof d === 'number' && !isFinite(d))) continue; const s = typeof d === 'string' ? d : fmt(d); if (!seen.has(s)) { seen.add(s); res.push(s); } if (res.length === 5) break; }
  let k = 1;
  while (res.length < 5 && k < 400) { const v = perturb(correct, k); const s = fmt(v); if (!seen.has(s)) { seen.add(s); res.push(s); } k++; }
  return res;
}
const pertAdd = step => (c, k) => c + (k % 2 ? 1 : -1) * Math.ceil(k / 2) * step;
const pertMul = f => (c, k) => c * (1 + (k % 2 ? 1 : -1) * Math.ceil(k / 2) * f);
// líkur: hrista innan [0,1]
const pertP = step => (c, k) => { const v = c + (k % 2 ? 1 : -1) * Math.ceil(k / 2) * step; return v < 0 || v > 1 ? c + (k % 2 ? -1 : 1) * Math.ceil(k / 2) * step * 1.37 : v; };

// Les tölusvar: „0,541", „54,1%", „1.250.000", „−3,5", „1 200". Skilar NaN ef ólæsilegt.
function parseNum(s) {
  if (s === null || s === undefined) return NaN;
  let t = String(s).trim().replace(/[\s  ]/g, '').replace(/[−–]/g, '-').replace(/kr\.?|%|\$|ár|mín\.?|stig/gi, '');
  if (!t) return NaN;
  if (t.includes(',')) { t = t.replace(/\./g, '').replace(',', '.'); }
  else if (/^-?[1-9]\d{0,2}(\.\d{3})+$/.test(t)) { t = t.replace(/\./g, ''); }
  if (!/^-?\d*\.?\d+(e-?\d+)?$/i.test(t)) return NaN;
  return parseFloat(t);
}

// Smiðir sem rafalar og fast dæmi nota.
// num: tölusvar. pnum: líkur (0–1; „54,1%" líka gilt). mc: fjölval, rétta svarið fremst.
const num = (q, ans, tol, unit, e, p) => ({ kind: 'num', q, ans, tol, unit, e, x: ans, p });
const pnum = (q, ans, tol, e, p) => ({ kind: 'num', prob: true, q, ans, tol, unit: '', e, x: ans, p });
const mc = (q, o, e, x, p) => ({ kind: 'mc', q, o, a: 0, e, x, p });

// ===================== LÍKINDASAFNIÐ PROB =====================
// Dreifingarföll með R-nöfnum. Normal tekur sd (eins og pnorm í R), ekki dreifni.
const PROB = (() => {
  const LZ = [0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
  function lgamma(x) {
    if (x < 0.5) return Math.log(Math.PI / Math.abs(Math.sin(Math.PI * x))) - lgamma(1 - x);
    x -= 1; let a = LZ[0]; const t = x + 7.5; for (let i = 1; i < 9; i++) a += LZ[i] / (x + i);
    return 0.5 * Math.log(2 * Math.PI) + (x + 0.5) * Math.log(t) - t + Math.log(a);
  }
  // reglulegt neðra ófullgert Gamma-fall P(a, x)
  function pgamma(a, x) {
    if (x <= 0) return 0;
    if (x < a + 1) { let ap = a, sum = 1 / a, del = sum; for (let n = 0; n < 1000; n++) { ap++; del *= x / ap; sum += del; if (Math.abs(del) < Math.abs(sum) * 1e-16) break; } return sum * Math.exp(-x + a * Math.log(x) - lgamma(a)); }
    let b = x + 1 - a, c = 1 / 1e-300, d = 1 / b, h = d;
    for (let i = 1; i < 1000; i++) { const an = -i * (i - a); b += 2; d = an * d + b; if (Math.abs(d) < 1e-300) d = 1e-300; c = b + an / c; if (Math.abs(c) < 1e-300) c = 1e-300; d = 1 / d; const del = d * c; h *= del; if (Math.abs(del - 1) < 1e-16) break; }
    return 1 - Math.exp(-x + a * Math.log(x) - lgamma(a)) * h;
  }
  function betacf(a, b, x) {
    const qab = a + b, qap = a + 1, qam = a - 1; let c = 1, d = 1 - qab * x / qap; if (Math.abs(d) < 1e-300) d = 1e-300; d = 1 / d; let h = d;
    for (let m = 1; m <= 1000; m++) { const m2 = 2 * m; let aa = m * (b - m) * x / ((qam + m2) * (a + m2));
      d = 1 + aa * d; if (Math.abs(d) < 1e-300) d = 1e-300; c = 1 + aa / c; if (Math.abs(c) < 1e-300) c = 1e-300; d = 1 / d; h *= d * c;
      aa = -(a + m) * (qab + m) * x / ((a + m2) * (qap + m2));
      d = 1 + aa * d; if (Math.abs(d) < 1e-300) d = 1e-300; c = 1 + aa / c; if (Math.abs(c) < 1e-300) c = 1e-300; d = 1 / d; const del = d * c; h *= del; if (Math.abs(del - 1) < 1e-16) break; }
    return h;
  }
  // reglulegt ófullgert Beta-fall I_x(a, b)
  function pbeta(x, a, b) {
    if (x <= 0) return 0; if (x >= 1) return 1;
    const bt = Math.exp(lgamma(a + b) - lgamma(a) - lgamma(b) + a * Math.log(x) + b * Math.log(1 - x));
    return x < (a + 1) / (a + b + 2) ? bt * betacf(a, b, x) / a : 1 - bt * betacf(b, a, 1 - x) / b;
  }
  const bisect = (f, p, lo, hi) => { for (let i = 0; i < 200; i++) { const mid = (lo + hi) / 2; if (f(mid) < p) lo = mid; else hi = mid; } return (lo + hi) / 2; };
  const P = {
    lgamma, pgamma, pbeta,
    fact: n => { let r = 1; for (let i = 2; i <= n; i++) r *= i; return r; },
    choose: (n, k) => { if (k < 0 || k > n) return 0; k = Math.min(k, n - k); let r = 1; for (let i = 1; i <= k; i++) r = r * (n - k + i) / i; return Math.round(r); },
    perm: (n, k) => { if (k < 0 || k > n) return 0; let r = 1; for (let i = 0; i < k; i++) r *= n - i; return r; },
    dbinom: (x, n, p) => (x < 0 || x > n || x % 1) ? 0 : P.choose(n, x) * Math.pow(p, x) * Math.pow(1 - p, n - x),
    pbinom: (x, n, p) => { let s = 0; for (let i = 0; i <= Math.min(Math.floor(x), n); i++) s += P.dbinom(i, n, p); return Math.min(1, s); },
    dpois: (x, l) => (x < 0 || x % 1) ? 0 : Math.exp(-l + x * Math.log(l) - lgamma(x + 1)),
    ppois: (x, l) => { let s = 0; for (let i = 0; i <= Math.floor(x); i++) s += P.dpois(i, l); return Math.min(1, s); },
    dnorm: (x, m = 0, s = 1) => Math.exp(-0.5 * ((x - m) / s) ** 2) / (s * Math.sqrt(2 * Math.PI)),
    pnorm: (x, m = 0, s = 1) => { const z = (x - m) / s; const g = P.pgamma(0.5, z * z / 2); return z >= 0 ? 0.5 + 0.5 * g : 0.5 - 0.5 * g; },
    qnorm: (p, m = 0, s = 1) => {
      if (p <= 0) return -Infinity; if (p >= 1) return Infinity;
      const a = [-39.69683028665376, 220.9460984245205, -275.9285104469687, 138.3577518672690, -30.66479806614716, 2.506628277459239],
        b = [-54.47609879822406, 161.5858368580409, -155.6989798598866, 66.80131188771972, -13.28068155288572],
        c = [-0.007784894002430293, -0.3223964580411365, -2.400758277161838, -2.549732539343734, 4.374664141464968, 2.938163982698783],
        d = [0.007784695709041462, 0.3224671290700398, 2.445134137142996, 3.754408661907416];
      let q, r, x;
      if (p < 0.02425) { q = Math.sqrt(-2 * Math.log(p)); x = (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1); }
      else if (p > 1 - 0.02425) { q = Math.sqrt(-2 * Math.log(1 - p)); x = -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1); }
      else { q = p - 0.5; r = q * q; x = (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q / (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1); }
      for (let i = 0; i < 2; i++) { const e = P.pnorm(x) - p; const u = e * Math.sqrt(2 * Math.PI) * Math.exp(x * x / 2); x = x - u / (1 + x * u / 2); }
      return m + s * x;
    },
    punif: (x, a, b) => x <= a ? 0 : x >= b ? 1 : (x - a) / (b - a),
    pexp: (x, l) => x <= 0 ? 0 : 1 - Math.exp(-l * x),
    qexp: (p, l) => -Math.log(1 - p) / l,
    pchisq: (x, k) => P.pgamma(k / 2, x / 2),
    pt: (x, k) => { const ib = P.pbeta(k / (k + x * x), k / 2, 0.5); return x >= 0 ? 1 - 0.5 * ib : 0.5 * ib; },
    pf: (x, k1, k2) => x <= 0 ? 0 : P.pbeta(k1 * x / (k1 * x + k2), k1 / 2, k2 / 2),
    qchisq: (p, k) => bisect(x => P.pchisq(x, k), p, 0, 1000),
    qt: (p, k) => bisect(x => P.pt(x, k), p, -1000, 1000),
    qf: (p, k1, k2) => bisect(x => P.pf(x, k1, k2), p, 0, 1e4),
    // töflugildi: Φ með z námundað að tveimur aukastöfum
    tabPhi: z => P.pnorm(Math.round(z * 100) / 100),
    mean: a => a.reduce((s, x) => s + x, 0) / a.length,
    varS: a => { const m = P.mean(a); return a.reduce((s, x) => s + (x - m) ** 2, 0) / (a.length - 1); },
    sdS: a => Math.sqrt(P.varS(a))
  };
  return P;
})();

// Vikmörk fyrir normallíkur: svo bæði töflugildi (z á 2 aukastöfum) og nákvæmt gildi teljist rétt.
function nTol(exact, table, base = 0.001) { return Math.max(base, Math.ceil((Math.abs(exact - table) + 0.0004) * 10000) / 10000); }
const TABNOTE = 'Töflur eru leyfðar: vikmörkin eru höfð svo víð að bæði töflugildið (z námundað að tveimur aukastöfum) og nákvæmt gildi teljast rétt.';


// ===================== RAFALAR =====================
// Hver rafall er { id, lec, name, r?, f(lvl) } og skilar num()/pnum()/mc().
// Stigið breytir uppbyggingu spurningarinnar, ekki bara tölunum. p = stikar fyrir sjálfvirkt eftirlit.
// r: true → R-spurning á öllum stigum; r: [1] → aðeins stig 1 er R-spurning.
const GENS = [];
const rng = (a, b) => { const o = []; for (let i = a; i <= b; i++) o.push(i); return o; };
const fx = (v, d = 4) => F.s(v, d);                      // valkostir: stytt tala
const fp = v => F.dec(v, 4);                              // líkur í valkostum
const OTHER = 'Nálæg tala sem fæst ekki með neinni réttri aðferð (dæmigerð reikni- eða námundunarvilla).';
// Fjölval með útskýringu fyrir hvern rangan kost. ds = [[gildi, hvers vegna], …]
function mcx(q, correct, ds, fmt, pert, e, p) {
  const o = opts(correct, ds.map(d => d[0]), fmt, pert || pertAdd(1));
  const why = new Map(); ds.forEach(d => { const k = typeof d[0] === 'string' ? d[0] : fmt(d[0]); if (!why.has(k)) why.set(k, d[1]); });
  const rows = o.slice(1).map(s => [s, why.get(s) || OTHER]);
  return mc(q, o, e + '<p class="note"><b>Rangir kostir</b></p>' + traps(rows), correct, p);
}
const rv = a => 'c(' + a.join(', ') + ')';           // R-vektor sem kóði
const ro = a => a.join(' ');                         // úttak eins og cat() prentar það
const PTOL = 'líkur';

// ================= L00 · R =================
GENS.push({ id: 'g-r-index', lec: 'L00', name: 'Tilvísanir í vektor og matrix', r: true, f(lvl) {
  if (lvl === 1) {
    const x = R.sample(rng(2, 49), 6), i = R.ri(2, 5);
    return mcx(`Hvað prentar síðasta línan?` + code(`x <- ${rv(x)}\nx[${i}]`), x[i - 1],
      [[x[i], `Taldi frá 0 eins og í Python eða C. Í R er <code>x[${i}]</code> stak númer ${i}.`], [i, 'Vísirinn sjálfur er ekki skilað, heldur stakið í því sæti.'], [x[i - 2], 'Talið einu sæti of skammt.'], [x[x.length - 1], 'Síðasta stakið, ekki stak númer ' + i + '.']],
      fx, pertAdd(1), calc(`§Tilvísun í R byrjar á 1`, `§x[${i}] = §stak númer ${i} = ${x[i - 1]}`), { x, i, rc: `x <- ${rv(x)}; cat(x[${i}])`, rx: String(x[i - 1]) });
  }
  if (lvl === 2) {
    let r, c, i, j, v, by; do { r = R.pick([2, 3, 4]); c = R.pick([3, 4, 5]); i = R.ri(1, r); j = R.ri(1, c); v = (j - 1) * r + i; by = (i - 1) * c + j; } while (v === by || r * c > 20);
    const ds = [[by, `Fyllti röð fyrir röð. <code>matrix()</code> fyllist dálk fyrir dálk nema <code>byrow = TRUE</code> sé gefið.`], [j >= 2 ? (j - 2) * r + i : null, 'Hljóp yfir einn dálk of lítið (taldi dálkana frá 0).'], [i * j, 'Margfaldaði vísana; stakið ræðst af röðinni sem fylkið er fyllt í.'], [(i - 1) * r + j <= r * c && j <= r ? (i - 1) * r + j : null, `Las <code>[${i}, ${j}]</code> sem [dálkur, röð].`]];
    return mcx(`Hvað prentar síðasta línan?` + code(`m <- matrix(1:${r * c}, nrow = ${r}, ncol = ${c})\nm[${i}, ${j}]`), v, ds, fx, pertAdd(1),
      calc(`§Dálkur ${j} byrjar á ${(j - 1) * r + 1}`, `m[${i}, ${j}] = (${j} - 1) \\cdot ${r} + ${i} = ${v}`) + note('Fyrsti vísir = röð, annar = dálkur. Tölurnar 1, 2, 3, … fara niður fyrsta dálk fyrst.'), { r, c, i, j, rc: `m <- matrix(1:${r * c}, nrow=${r}, ncol=${c}); cat(m[${i}, ${j}])`, rx: String(v) });
  }
  const x = R.sample(rng(1, 30), 7);
  if (Math.random() < 0.5) {
    const k = R.pick(x.slice().sort((a, b) => a - b).slice(1, 6)); const ans = x.filter(t => t > k).reduce((s, t) => s + t, 0);
    return mcx(`Hvað prentar síðasta línan?` + code(`x <- ${rv(x)}\nsum(x[x > ${k}])`), ans,
      [[ans + k, `Tók <code>x >= ${k}</code>: ${k} sjálft er ekki stærra en ${k}.`], [x.filter(t => t > k).length, `<code>length()</code> eða <code>sum(x > ${k})</code> telur stökin í stað þess að leggja þau saman.`], [x.reduce((s, t) => s + t, 0), 'Summa allra staka; síunin gleymdist.'], [x.filter(t => t < k).reduce((s, t) => s + t, 0), 'Sneri ójöfnunni við.']],
      fx, pertAdd(2), calc(`§x > ${k} gefur TRUE/FALSE fyrir hvert stak`, `§x[x > ${k}] = ${x.filter(t => t > k).join(', ')}`, `§sum(...) = ${ans}`), { x, k, rc: `x <- ${rv(x)}; cat(sum(x[x > ${k}]))`, rx: String(ans) });
  }
  const i = R.ri(2, 6), tot = x.reduce((s, t) => s + t, 0), ans = tot - x[i - 1];
  return mcx(`Hvað prentar síðasta línan?` + code(`x <- ${rv(x)}\nsum(x[-${i}])`), ans,
    [[x[i - 1], `<code>x[-${i}]</code> fjarlægir stak ${i}; það skilar ekki stakinu.`], [tot - x[i], 'Fjarlægði stak númer ' + (i + 1) + ' (taldi frá 0).'], [tot, 'Mínusinn gleymdist; summa allra staka.'], [tot - x[i - 1] * 2, 'Dró stakið tvisvar frá.']],
    fx, pertAdd(1), calc(`§Neikvæður vísir = allt nema það sæti`, `sum(x[-${i}]) = ${tot} - ${x[i - 1]} = ${ans}`), { x, i, rc: `x <- ${rv(x)}; cat(sum(x[-${i}]))`, rx: String(ans) });
} });

GENS.push({ id: 'g-r-mod', lec: 'L00', name: 'Heiltöludeiling %/% og afgangur %%', r: true, f(lvl) {
  if (lvl === 1) {
    let a, b; do { a = R.ri(7, 60); b = R.ri(3, 9); } while (a % b === 0);
    const q = Math.floor(a / b), m = a % b, askQ = Math.random() < 0.5; const ans = askQ ? q : m;
    return mcx(`Hvað skilar <code>${a} ${askQ ? '%/%' : '%%'} ${b}</code> í R?`, ans,
      [[askQ ? m : q, `Ruglaði saman: <code>%/%</code> er heiltöludeiling (${q}), <code>%%</code> er afgangurinn (${m}).`], [Math.round(a / b * 100) / 100, `Venjuleg deiling <code>${a} / ${b}</code>.`], [b - m, 'Það sem vantar upp á næsta margfeldi, ekki afgangurinn.'], [askQ ? q + 1 : m + 1, 'Námundaði upp.']],
      v => F.s(v, 2), pertAdd(1), calc(`${a} = ${q} \\cdot ${b} + ${m}`, `${a} \\;\\%/\\%\\; ${b} = ${q}`, `${a} \\;\\%\\%\\; ${b} = ${m}`), { a, b, op: askQ ? '%/%' : '%%', rc: `cat(${a} ${askQ ? '%/%' : '%%'} ${b})`, rx: String(ans) });
  }
  if (lvl === 2) {
    let a10, b; do { a10 = R.ri(101, 499); b = R.ri(2, 9); } while (a10 % 10 === 0 || a10 % (b * 10) === 0);
    const a = a10 / 10, q = Math.floor(a10 / (b * 10)), m = (a10 % (b * 10)) / 10; const askQ = Math.random() < 0.4; const ans = askQ ? q : m;
    return num(`Í verkefni 1 var reiknað <code>a %/% b</code> og <code>a %% b</code> með kommutölu. Látum <code>a &lt;- ${String(a)}</code> og <code>b &lt;- ${b}</code>. Hvað skilar <code>a ${askQ ? '%/%' : '%%'} b</code>?`, ans, 0.001, '',
      calc(`${F.m(a)} = ${q} \\cdot ${b} + ${F.m(m)}`, `§a %/% b = ${q}`, `§a %% b = ${F.s(m)}`) + note('Afgangurinn má vera kommutala: það sem stendur eftir þegar heilum margfeldum af b hefur verið dregið frá a.') + trap(`${askQ ? `Afgangurinn ${F.s(m)} er svar við <code>%%</code>, ekki <code>%/%</code>.` : `${q} er heiltöludeilingin, ekki afgangurinn.`}`), { a, b, op: askQ ? '%/%' : '%%', rc: `cat(round(${a} ${askQ ? '%/%' : '%%'} ${b}, 6))`, rx: String(+ans.toFixed(6)) });
  }
  const x = R.sample(rng(1, 30), 8);
  if (Math.random() < 0.6) {
    let k = R.pick([2, 3, 4, 5]); if (!x.some(t => t % k === 0)) x[0] = k * R.ri(1, 6);
    const ans = x.filter(t => t % k === 0).reduce((s, t) => s + t, 0);
    return num(`Hvað prentar síðasta línan?` + code(`x <- ${rv(x)}\nsum(x[x %% ${k} == 0])`), ans, 0, '',
      calc(`§x %% ${k} == 0 er TRUE þar sem afgangurinn er 0`, `§Deilanleg með ${k}: ${x.filter(t => t % k === 0).join(', ')}`, `§Summa = ${ans}`) + trap(`<code>x %/% ${k} == 0</code> væri TRUE fyrir tölur minni en ${k}, ekki deilanlegar tölur.`), { x, k, rc: `x <- ${rv(x)}; cat(sum(x[x %% ${k} == 0]))`, rx: String(ans) });
  }
  const ans = x.reduce((s, t) => s + Math.floor(t / 3), 0);
  return num(`Hvað prentar síðasta línan?` + code(`x <- ${rv(x)}\nsum(x %/% 3)`), ans, 0, '',
    calc(`§x %/% 3 = ${x.map(t => Math.floor(t / 3)).join(', ')}`, `§sum = ${ans}`) + note('Aðgerðin vinnur á hvert stak í einu (vektoruð aðgerð).') + trap(`<code>sum(x) %/% 3</code> = ${Math.floor(x.reduce((s, t) => s + t, 0) / 3)} er annað: þar er deilt einu sinni eftir summuna.`), { x, rc: `x <- ${rv(x)}; cat(sum(x %/% 3))`, rx: String(ans) });
} });

GENS.push({ id: 'g-r-args', lec: 'L00', name: 'Inntaksbreytur: röð, nöfn og sjálfgefin gildi', r: true, f(lvl) {
  const a = R.ri(1, 9); let b, c; do { b = R.ri(1, 9); c = R.ri(1, 9); } while (b === a || c === a || c === b);
  const fn = (x, y, z) => x + y * z;
  if (lvl === 1) {
    const ans = fn(a, b, c);
    return mcx(`Hvað skilar kallið?` + code(`f <- function(x, y, z) {\n  return(x + y * z)\n}\nf(${a}, ${b}, ${c})`), ans,
      [[(a + b) * c, 'Reiknaði (x + y) · z; margföldun gengur á undan samlagningu.'], [a * b + c, 'Setti gildin á rangar breytur.'], [a + b + c, 'Lagði allt saman.'], [b + a * c, 'Víxlaði x og y.']],
      fx, pertAdd(1), calc(`§Ónefnd inntök fara í sætin í röð: x = ${a}, y = ${b}, z = ${c}`, `${a} + ${b} \\cdot ${c} = ${ans}`), { a, b, c, rc: `f <- function(x, y, z) { return(x + y * z) }; cat(f(${a}, ${b}, ${c}))`, rx: String(ans) });
  }
  if (lvl === 2) {
    const ans = fn(b, a, c);
    return mcx(`Hvað skilar kallið? (Sama regla og á glæru 26 í R-grunni.)` + code(`f <- function(x, y, z) {\n  return(x + y * z)\n}\nf(y = ${a}, ${b}, ${c})`), ans,
      [[fn(a, b, c), 'Las inntökin í röð og hunsaði nafnið <code>y =</code>.'], [fn(c, a, b), 'Setti ónefndu gildin í öfugri röð.'], [a + b + c, 'Lagði allt saman.'], [fn(b, c, a), 'Setti y = ' + c + '.']],
      fx, pertAdd(1), calc(`§Nefnda inntakið fyrst: y = ${a}`, `§Ónefndu fylla lausu sætin í röð: x = ${b}, z = ${c}`, `${b} + ${a} \\cdot ${c} = ${ans}`), { a, b, c, rc: `f <- function(x, y, z) { return(x + y * z) }; cat(f(y = ${a}, ${b}, ${c}))`, rx: String(ans) });
  }
  const d1 = R.ri(2, 6), d2 = R.ri(2, 6); const v = R.ri(0, 2);
  const calls = [`g(${a}, z = ${c})`, `g(z = ${c}, ${a})`, `g(${a}, ${b})`];
  const ans = v === 2 ? fn(a, b, d2) : fn(a, d1, c);
  const ds = v === 2 ? [[fn(a, b, c), 'Notaði ekki sjálfgefna gildið á z.'], [fn(a, d1, d2), 'Notaði sjálfgefna gildið fyrir y þó það sé gefið.'], [fn(b, a, d2), 'Víxlaði x og y.'], ['Villa: of fá inntök', 'Ekki villa: z hefur sjálfgefið gildi.']]
    : [[fn(a, d1, d2), 'Hunsaði <code>z = ' + c + '</code>.'], [fn(c, d1, a), 'Setti nefnda gildið í fyrsta sætið.'], [fn(a, c, d2), 'Setti ' + c + ' í y af því það kom annað.'], ['Villa: of fá inntök', 'Ekki villa: y hefur sjálfgefið gildi.']];
  return mcx(`Hvað skilar kallið?` + code(`g <- function(x, y = ${d1}, z = ${d2}) {\n  return(x + y * z)\n}\n${calls[v]}`), ans, ds, v2 => typeof v2 === 'string' ? v2 : F.s(v2), pertAdd(1),
    calc(v === 2 ? `§x = ${a}, y = ${b}, z = ${d2} (sjálfgefið)` : `§z = ${c} (nefnt), x = ${a}, y = ${d1} (sjálfgefið)`, v === 2 ? `${a} + ${b} \\cdot ${d2} = ${ans}` : `${a} + ${d1} \\cdot ${c} = ${ans}`), { a, b, c, d1, d2, v, rc: `g <- function(x, y = ${d1}, z = ${d2}) { return(x + y * z) }; cat(${calls[v]})`, rx: String(ans) });
} });

GENS.push({ id: 'g-r-apply', lec: 'L00', name: 'sapply, tapply og apply', r: true, f(lvl) {
  if (lvl === 1) {
    const v = R.sample(rng(1, 9), 4), k = R.ri(2, 5), m = R.ri(1, 4); const res = v.map(t => t * k + m);
    return mcx(`Hvað prentar síðasta línan?` + code(`v <- ${rv(v)}\nsapply(v, function(t) t * ${k} + ${m})`), ro(res),
      [[ro(v.map(t => (t + m) * k)), 'Reiknaði (t + ' + m + ') · ' + k + '.'], [ro(v.map(t => t * k)), 'Gleymdi + ' + m + '.'], [String(res.reduce((s, t) => s + t, 0)), '<code>sapply</code> leggur ekki saman; það skilar einu gildi fyrir hvert stak.'], [ro(v.map(t => t + k * m)), 'Margfaldaði ' + k + ' og ' + m + ' saman fyrst.']],
      s => s, (c2, i) => ro(res.map((t, j) => j === i % 4 ? t + 1 : t)),
      calc(...v.map((t, i) => `${t} \\cdot ${k} + ${m} = ${res[i]}`)) + note('<code>sapply</code> keyrir fallið á hvert stak og einfaldar niðurstöðuna í vektor; <code>lapply</code> skilaði sömu tölum sem lista.'), { v, k, m, rc: `v <- ${rv(v)}; cat(sapply(v, function(t) t * ${k} + ${m}))`, rx: ro(res) });
  }
  if (lvl === 2) {
    const d = R.sample(rng(1, 25), 6); let g; do { g = d.map(() => R.pick(['a', 'b'])); } while (!g.includes('a') || !g.includes('b'));
    const sa = d.filter((_, i) => g[i] === 'a').reduce((s, t) => s + t, 0), sb = d.filter((_, i) => g[i] === 'b').reduce((s, t) => s + t, 0);
    const na = g.filter(t => t === 'a').length, nb = 6 - na; const fmtAB = (x, y) => `a: ${F.s(x, 2)}, b: ${F.s(y, 2)}`;
    return mcx(`Hvað skilar <code>tapply</code>?` + code(`data  <- ${rv(d)}\ngroup <- ${rv(g.map(t => '"' + t + '"'))}\ntapply(data, group, sum)`), fmtAB(sa, sb),
      [[fmtAB(sb, sa), 'Víxlaði hópunum.'], [fmtAB(sa / na, sb / nb), 'Reiknaði meðaltal í stað summu.'], [fmtAB(d.slice(0, 3).reduce((s, t) => s + t, 0), d.slice(3).reduce((s, t) => s + t, 0)), 'Skipti eftir sæti (fyrstu þrjú / síðustu þrjú) í stað hópa.'], [String(sa + sb), 'Summa allra; hópaskiptingin gleymdist.']],
      s => s, (c2, i) => fmtAB(sa + i, sb), calc(`§a: ${d.filter((_, i) => g[i] === 'a').join(' + ')} = ${sa}`, `§b: ${d.filter((_, i) => g[i] === 'b').join(' + ')} = ${sb}`) + note('Eins og á glæru 32 í R-grunni: <code>tapply(x, INDEX, fun)</code> keyrir fallið sér á hvern hóp.'),
      { d, g, rc: `data <- ${rv(d)}; group <- ${rv(g.map(t => '"' + t + '"'))}; r <- tapply(data, group, sum); cat(paste0(names(r), ':', r))`, rx: `a:${sa} b:${sb}` });
  }
  const r = R.pick([2, 3]), c = 3; const v = R.sample(rng(1, 12), r * c); const mg = R.pick([1, 2]);
  const m = (i, j) => v[j * r + i]; const rows = rng(0, r - 1).map(i => rng(0, c - 1).reduce((s, j) => s + m(i, j), 0)); const cols = rng(0, c - 1).map(j => rng(0, r - 1).reduce((s, i) => s + m(i, j), 0));
  const byrowRows = rng(0, r - 1).map(i => rng(0, c - 1).reduce((s, j) => s + v[i * c + j], 0)); const byrowCols = rng(0, c - 1).map(j => rng(0, r - 1).reduce((s, i) => s + v[i * c + j], 0));
  const ans = mg === 1 ? ro(rows) : ro(cols);
  return mcx(`Hvað prentar síðasta línan?` + code(`m <- matrix(${rv(v)}, nrow = ${r})\napply(m, ${mg}, sum)`), ans,
    [[mg === 1 ? ro(cols) : ro(rows), `Ruglaði saman <code>MARGIN</code>: 1 = raðir, 2 = dálkar.`], [mg === 1 ? ro(byrowRows) : ro(byrowCols), 'Fyllti fylkið röð fyrir röð; það fyllist dálk fyrir dálk.'], [String(v.reduce((s, t) => s + t, 0)), 'Summa alls fylkisins.'], [mg === 1 ? ro(byrowCols) : ro(byrowRows), 'Bæði röng fylling og rangt MARGIN.']],
    s => s, (c2, i) => ro((mg === 1 ? rows : cols).map((t, j) => j === i % (mg === 1 ? r : c) ? t + 1 : t)),
    tbl(['', ...rng(1, c).map(j => 'dálkur ' + j)], rng(0, r - 1).map(i => ['röð ' + (i + 1), ...rng(0, c - 1).map(j => m(i, j))])) + calc(mg === 1 ? `§Raðasummur: ${rows.join(', ')}` : `§Dálkasummur: ${cols.join(', ')}`), { v, r, mg, rc: `m <- matrix(${rv(v)}, nrow = ${r}); cat(apply(m, ${mg}, sum))`, rx: ans });
} });

// ================= L01 · Útkomurúm og líkindi =================
GENS.push({ id: 'g-count', lec: 'L01', name: 'Talning: umraðanir og samantektir', f(lvl) {
  if (lvl === 1) {
    const n = R.ri(6, 14), k = R.ri(2, 4), ord = Math.random() < 0.5; const ans = ord ? PROB.perm(n, k) : PROB.choose(n, k);
    const what = ord ? `í ${k} ólík embætti (formaður, ritari${k > 2 ? ', gjaldkeri' : ''}${k > 3 ? ', meðstjórnandi' : ''})` : `í ${k} manna nefnd (öll sæti eins)`;
    return mcx(`Á hve marga vegu má velja ${k} af ${n} nemendum ${what}?`, ans,
      [[ord ? PROB.choose(n, k) : PROB.perm(n, k), ord ? 'Samantekt; en hér skiptir röðin máli því embættin eru ólík.' : 'Umröðun; í nefnd skiptir röðin ekki máli.'], [Math.pow(n, k), 'Með endurtekningu; sami nemandi getur ekki gegnt tveimur sætum.'], [n * k, 'Margfaldaði n og k.'], [PROB.fact(k), 'Aðeins röðun innan hópsins (k!).']],
      F.int, pertAdd(5), ord ? calc(`P(n,k) = \\frac{n!}{(n-k)!}`, `P(${n},${k}) = ${rng(n - k + 1, n).reverse().join(' \\cdot ')} = ${F.mi(ans)}`) : calc(`C(n,k) = \\frac{n!}{k!(n-k)!}`, `C(${n},${k}) = \\frac{${rng(n - k + 1, n).reverse().join(' \\cdot ')}}{${k}!} = ${F.mi(ans)}`), { n, k, ord });
  }
  if (lvl === 2) {
    const n1 = R.ri(4, 8), n2 = R.ri(4, 9), a = R.ri(1, 3), b = R.ri(1, 3); const ans = PROB.choose(n1, a) * PROB.choose(n2, b);
    return num(`Í félagi eru ${n1} hagfræðinemar og ${n2} viðskiptafræðinemar. Velja á nefnd með ${a} hagfræðinema og ${b} viðskiptafræðinema (röð skiptir ekki máli). Á hve marga vegu má skipa nefndina?`, ans, 0, '',
      calc(`C(${n1},${a}) \\cdot C(${n2},${b}) = ${PROB.choose(n1, a)} \\cdot ${PROB.choose(n2, b)} = ${F.mi(ans)}`) + note('Margföldunarreglan: hvert val úr fyrri hópnum má para við hvert val úr þeim seinni (eins og dæmablað 1, dæmi 3d).') +
      trap(`C(${n1 + n2},${a + b}) = ${F.int(PROB.choose(n1 + n2, a + b))} leyfir hvaða samsetningu sem er. Að leggja saman C(${n1},${a}) + C(${n2},${b}) = ${PROB.choose(n1, a) + PROB.choose(n2, b)} er líka rangt.`), { n1, n2, a, b });
  }
  let N, m, k, ans; do { const rows = R.ri(3, 5), per = R.ri(4, 6); N = rows * per; m = per * R.ri(1, rows - 1); k = R.ri(3, 6); ans = PROB.perm(m, k) / PROB.perm(N, k); } while (ans < 0.003 || ans > 0.5 || k > m);
  return pnum(`Í stofu eru ${N} sæti og ${k} nemendur velja sér sæti af handahófi (hver í sitt sæti). ${m} sæti eru fremst. Hverjar eru líkurnar á að allir ${k} sitji í fremstu ${m} sætunum?`, ans, Math.max(0.0005, +(ans * 0.005).toFixed(4)),
    calc(`§Allar raðanir = P(${N},${k})`, `§Hagstæðar = P(${m},${k})`, `Pr = \\frac{P(${m},${k})}{P(${N},${k})} = \\frac{${F.mi(PROB.perm(m, k))}}{${F.mi(PROB.perm(N, k))}} = ${F.m(ans, 5)}`) +
    note('Sama aðferð og í dæmablaði 1, dæmi 3b. Samantektir gefa sömu líkur, C(' + m + ',' + k + ')/C(' + N + ',' + k + '), því k! styttist út.') + trap(`(${m}/${N})<sup>${k}</sup> = ${F.dec(Math.pow(m / N, k), 4)} gerir ráð fyrir að sætin séu dregin með endurtekningu.`), { N, m, k });
} });

GENS.push({ id: 'g-union', lec: 'L01', name: 'Samlagningarreglan og fyllireglan', f(lvl) {
  let pA, pB, pAB; do { pA = R.ri(15, 70) / 100; pB = R.ri(15, 70) / 100; pAB = R.ri(1, Math.round(Math.min(pA, pB) * 100) - 1) / 100; } while (pA + pB - pAB > 0.98 || pAB < 0.01);
  const pU = pA + pB - pAB;
  if (lvl === 1) return pnum(`Í hópi neytenda eiga ${F.pct(pA, 0)} bíl (A), ${F.pct(pB, 0)} eiga hjól (B) og ${F.pct(pAB, 0)} eiga hvort tveggja. Hverjar eru líkurnar á að valinn neytandi eigi bíl <b>eða</b> hjól?`, pU, 0.001,
    calc(`\\Pr(A \\cup B) = \\Pr(A) + \\Pr(B) - \\Pr(A \\cap B)`, `= ${F.m(pA)} + ${F.m(pB)} - ${F.m(pAB)} = ${F.m(pU)}`) + trap(`${F.dec(pA + pB, 2)} telur þá sem eiga hvort tveggja tvisvar.`), { pA, pB, pAB });
  if (lvl === 2) { const c = pAB / pB;
    return pnum(`Gefið: ${M(`\\Pr(A) = ${F.m(pA)}`)}, ${M(`\\Pr(B) = ${F.m(pB)}`)} og ${M(`\\Pr(A \\cup B) = ${F.m(pU)}`)}. Finnið ${M('\\Pr(A \\mid B)')}.`, c, 0.001,
      calc(`\\Pr(A \\cap B) = \\Pr(A) + \\Pr(B) - \\Pr(A \\cup B) = ${F.m(pA)} + ${F.m(pB)} - ${F.m(pU)} = ${F.m(pAB)}`, `\\Pr(A \\mid B) = \\frac{\\Pr(A \\cap B)}{\\Pr(B)} = \\frac{${F.m(pAB)}}{${F.m(pB)}} = ${F.m(c)}`) +
      trap(`${M('\\Pr(B \\mid A)')} = ${F.dec(pAB / pA, 4)} deilir með röngum atburði; ${F.dec(pAB, 2)} er sniðmengið sjálft.`), { pA, pB, pU }); }
  if (Math.random() < 0.5) { const nn = 1 - pU;
    return pnum(`Gefið: ${M(`\\Pr(A) = ${F.m(pA)}`)}, ${M(`\\Pr(B) = ${F.m(pB)}`)} og ${M(`\\Pr(A \\cap B) = ${F.m(pAB)}`)}. Hverjar eru líkurnar á að <b>hvorugur</b> atburðurinn gerist, ${M('\\Pr(A^c \\cap B^c)')}?`, nn, 0.001,
      calc(`A^c \\cap B^c = (A \\cup B)^c \\quad \\text{(De Morgan)}`, `\\Pr(A \\cup B) = ${F.m(pA)} + ${F.m(pB)} - ${F.m(pAB)} = ${F.m(pU)}`, `\\Pr(A^c \\cap B^c) = 1 - ${F.m(pU)} = ${F.m(nn)}`) +
      trap(`(1 − ${F.dec(pA, 2)})(1 − ${F.dec(pB, 2)}) = ${F.dec((1 - pA) * (1 - pB), 4)} gerir ráð fyrir óhæði, sem ekki er gefið (og stenst ekki nema ${M('\\Pr(A\\cap B)=\\Pr(A)\\Pr(B)')}).`), { pA, pB, pAB, v: 'none' }); }
  const ex = pA + pB - 2 * pAB;
  return pnum(`Gefið: ${M(`\\Pr(A) = ${F.m(pA)}`)}, ${M(`\\Pr(B) = ${F.m(pB)}`)} og ${M(`\\Pr(A \\cap B) = ${F.m(pAB)}`)}. Hverjar eru líkurnar á að <b>nákvæmlega annar</b> atburðurinn gerist?`, ex, 0.001,
    calc(`\\Pr(A \\cap B^c) = ${F.m(pA)} - ${F.m(pAB)} = ${F.m(pA - pAB)}`, `\\Pr(A^c \\cap B) = ${F.m(pB)} - ${F.m(pAB)} = ${F.m(pB - pAB)}`, `\\Pr(\\text{nákvæmlega annar}) = ${F.m(pA - pAB)} + ${F.m(pB - pAB)} = ${F.m(ex)}`) +
    trap(`${F.dec(pU, 4)} er „annar eða báðir" (sammengið); hér þarf að draga sniðmengið frá tvisvar.`), { pA, pB, pAB, v: 'exact' });
} });

GENS.push({ id: 'g-cond2x2', lec: 'L01', name: '2×2-tafla, skilyrtar líkur og óhæði', f(lvl) {
  const indep = lvl === 3 && Math.random() < 0.5;
  let a, b, c, d;
  if (indep) { const pA = R.pick([0.2, 0.3, 0.4, 0.5, 0.6]), pB = R.pick([0.2, 0.3, 0.4, 0.5, 0.7]); a = pA * pB; b = pA * (1 - pB); c = (1 - pA) * pB; d = (1 - pA) * (1 - pB); [a, b, c, d] = [a, b, c, d].map(v => Math.round(v * 100) / 100); }
  else { do { a = R.ri(4, 35); b = R.ri(4, 35); c = R.ri(4, 35); d = 100 - a - b - c; } while (d < 4 || Math.abs(a * 100 - (a + b) * (a + c)) < 30); [a, b, c, d] = [a, b, c, d].map(v => v / 100); }
  const pA = a + b, pB = a + c;
  const table = tbl(['', 'B', 'B<sup>c</sup>', 'Alls'], [['A', F.dec(a, 2), F.dec(b, 2), '?'], ['A<sup>c</sup>', F.dec(c, 2), F.dec(d, 2), '?'], ['Alls', '?', '?', '1']]);
  const story = 'A = viðskiptavinur er fyrirtæki, B = færslan er merkt grunsamleg (eins og í verkefni 2). Samdreifing:';
  if (lvl === 1) { const askA = Math.random() < 0.5;
    return pnum(`${story}${table}Hverjar eru líkurnar ${askA ? M('\\Pr(A)') : M('\\Pr(B)')}?`, askA ? pA : pB, 0.001,
      calc(askA ? `\\Pr(A) = \\Pr(A\\cap B) + \\Pr(A \\cap B^c) = ${F.m(a)} + ${F.m(b)} = ${F.m(pA)}` : `\\Pr(B) = \\Pr(A\\cap B) + \\Pr(A^c \\cap B) = ${F.m(a)} + ${F.m(c)} = ${F.m(pB)}`) + note('Jaðarlíkur = summa raðar eða dálks (lögmál heildarlíkinda).') + trap(`${F.dec(a, 2)} er sniðmengið, ekki jaðarlíkurnar.`), { a, b, c, d, ask: askA ? 'A' : 'B' }); }
  if (lvl === 2) { const ans = a / pB;
    return pnum(`${story}${table}Hverjar eru líkurnar á að viðskiptavinur sé fyrirtæki <b>að því gefnu</b> að færslan sé merkt grunsamleg, ${M('\\Pr(A \\mid B)')}?`, ans, 0.001,
      calc(`\\Pr(B) = ${F.m(a)} + ${F.m(c)} = ${F.m(pB)}`, `\\Pr(A \\mid B) = \\frac{\\Pr(A \\cap B)}{\\Pr(B)} = \\frac{${F.m(a)}}{${F.m(pB)}} = ${F.m(ans)}`) +
      trap(`${M(`\\Pr(B \\mid A) = ${F.m(a)}/${F.m(pA)}`)} = ${F.dec(a / pA, 4)} deilir með röngu jaðri; ${F.dec(a, 2)} er sniðmengið.`), { a, b, c, d }); }
  const prod = pA * pB; const corr = indep ? `Óháðir: ${M(`\\Pr(A)\\Pr(B) = ${F.m(pA)} \\cdot ${F.m(pB)} = ${F.m(prod)} = \\Pr(A\\cap B)`)}` : `Háðir: ${M(`\\Pr(A)\\Pr(B) = ${F.m(pA)} \\cdot ${F.m(pB)} = ${F.m(prod)} \\neq ${F.m(a)} = \\Pr(A\\cap B)`)}`;
  return mc(`${story}${table}Eru A og B óháðir atburðir?`,
    [corr, indep ? 'Háðir, því Pr(A ∩ B) > 0' : 'Óháðir, því Pr(A ∩ B) > 0', indep ? 'Háðir, því Pr(A) + Pr(B) ≠ 1' : 'Óháðir, því Pr(A) + Pr(B) ≠ 1', 'Ekki hægt að segja nema vita Pr(A ∪ B)', indep ? 'Háðir, því A og B eru sundurlægir' : 'Óháðir, því töflugildin summast í 1'],
    calc(`\\Pr(A) = ${F.m(a)} + ${F.m(b)} = ${F.m(pA)}`, `\\Pr(B) = ${F.m(a)} + ${F.m(c)} = ${F.m(pB)}`, `\\Pr(A)\\Pr(B) = ${F.m(prod)}`, `§${indep ? 'Jafnt' : 'Ekki jafnt'} Pr(A ∩ B) = ${F.dec(a, 2)}`) +
    '<p class="note"><b>Rangir kostir</b></p>' + traps([['Pr(A ∩ B) > 0', 'Jákvætt sniðmengi segir ekkert um óhæði; óhæði er margfeldisregla.'], ['Pr(A) + Pr(B) ≠ 1', 'Summan skiptir ekki máli.'], ['Pr(A ∪ B)', 'Allt sem þarf er í töflunni.'], ['Sundurlægir / summast í 1', 'Atburðirnir eru ekki sundurlægir (Pr(A ∩ B) > 0) og allar líkindatöflur summast í 1.']]), indep ? 1 : 0, { a, b, c, d, indep });
} });

GENS.push({ id: 'g-bayes', lec: 'L01', name: 'Heildarlíkur og setning Bayes', f(lvl) {
  if (lvl < 3) {
    const pA = R.ri(2, 40) / 100, sens = R.ri(80, 99) / 100, fp = R.ri(1, 15) / 100; const pB = pA * sens + (1 - pA) * fp; const post = pA * sens / pB;
    const st = `Sjúkdómur hrjáir ${F.pct(pA, 0)} hóps (A). Próf er jákvætt (B) hjá ${F.pct(sens, 0)} sjúkra og ${F.pct(fp, 0)} heilbrigðra.`;
    if (lvl === 1) return pnum(`${st} Hverjar eru líkurnar á að prófið sé jákvætt hjá einstaklingi sem valinn er af handahófi, ${M('\\Pr(B)')}?`, pB, 0.001,
      calc(`\\Pr(B) = \\Pr(A)\\Pr(B\\mid A) + \\Pr(A^c)\\Pr(B\\mid A^c)`, `= ${F.m(pA)} \\cdot ${F.m(sens)} + ${F.m(1 - pA)} \\cdot ${F.m(fp)} = ${F.m(pB)}`) + trap(`${F.dec(pA * sens, 4)} er aðeins fyrri liðurinn (sjúkir með jákvætt próf).`), { pA, sens, fp });
    return pnum(`${st} Einstaklingur fær jákvæða niðurstöðu. Hverjar eru líkurnar á að hann sé með sjúkdóminn, ${M('\\Pr(A \\mid B)')}?`, post, 0.001,
      calc(`\\Pr(B) = ${F.m(pA)} \\cdot ${F.m(sens)} + ${F.m(1 - pA)} \\cdot ${F.m(fp)} = ${F.m(pB)}`, `\\Pr(A \\mid B) = \\frac{\\Pr(A)\\Pr(B\\mid A)}{\\Pr(B)} = \\frac{${F.m(pA * sens)}}{${F.m(pB)}} = ${F.m(post)}`) +
      note('Sama aðferð og sjúkdómsprófið á glærum 01 (gl. 45–46). Á glæru 43 er teljarinn ranglega Pr(B)Pr(A<sub>j</sub>|B); réttur teljari er Pr(A<sub>j</sub>)Pr(B|A<sub>j</sub>).') + trap(`${F.pct(sens, 0)} er ${M('\\Pr(B\\mid A)')}, ekki ${M('\\Pr(A\\mid B)')}.`), { pA, sens, fp });
  }
  let pr; do { pr = [R.ri(1, 6), R.ri(2, 6), R.ri(1, 6)]; } while (pr.reduce((s, t) => s + t, 0) !== 10); pr = pr.map(t => t / 10);
  const pt = [R.ri(25, 45), R.ri(10, 24), R.ri(1, 9)].map(t => t / 100); const names = ['áhættusækinn', 'venjulegur', 'áhættufælinn'];
  const pE = pr.reduce((s, p, i) => s + p * (1 - pt[i]), 0); const post = pr.map((p, i) => p * (1 - pt[i]) / pE); const j = R.ri(0, 2);
  return pnum(`Tryggingafélag flokkar viðskiptavini: ${names.map((n, i) => `${n} ${F.pct(pr[i], 0)}`).join(', ')}. Líkur á tjóni á ári eru ${pt.map(t => F.pct(t, 0)).join(', ')} í sömu röð. Viðskiptavinur lendir <b>ekki</b> í tjóni á árinu. Hverjar eru líkurnar á að hann sé ${names[j]}?`, post[j], 0.001,
    calc(`\\Pr(e\\mid \\text{flokkur}) = 1 - \\Pr(t\\mid \\text{flokkur}) \\Rightarrow ${pt.map(t => F.m(1 - t)).join(',\\;')}`, `\\Pr(e) = ${pr.map((p, i) => `${F.m(p)} \\cdot ${F.m(1 - pt[i])}`).join(' + ')} = ${F.m(pE)}`, `\\Pr(\\text{${names[j]}}\\mid e) = \\frac{${F.m(pr[j])} \\cdot ${F.m(1 - pt[j])}}{${F.m(pE)}} = ${F.m(post[j])}`) +
    note(`Eftirlíkurnar summast í 1: ${post.map(v => F.dec(v, 4)).join(' + ')} = 1.`) + trap(`Að nota tjónslíkurnar sjálfar (${F.pct(pt[j], 0)}) í stað 1 − þeirra gefur ${F.dec(pr[j] * pt[j] / pr.reduce((s, p, i) => s + p * pt[i], 0), 4)}, sem er Pr(flokkur | tjón).`), { pr, pt, j, post });
} });

GENS.push({ id: 'g-atleast', lec: 'L01', name: '„Að minnsta kosti einn" og fyllireglan', f(lvl) {
  if (lvl === 1) { const p = R.ri(5, 30) / 100, n = R.ri(3, 10); const ans = 1 - Math.pow(1 - p, n);
    return pnum(`Hver af ${n} óháðum sendingum glatast með líkum ${F.dec(p, 2)}. Hverjar eru líkurnar á að <b>að minnsta kosti ein</b> glatist?`, ans, 0.001,
      calc(`\\Pr(\\text{a.m.k. ein}) = 1 - \\Pr(\\text{engin})`, `= 1 - (1 - ${F.m(p)})^{${n}} = 1 - ${F.m(Math.pow(1 - p, n))} = ${F.m(ans)}`) + trap(`${n} · ${F.dec(p, 2)} = ${F.dec(n * p, 2)} telur skörun mörgum sinnum (og getur orðið > 1).`), { p, n }); }
  if (lvl === 2) { const d = R.pick([365, 52, 30, 20]), n = d === 365 ? R.ri(8, 30) : R.ri(3, Math.min(9, d - 1)); let pn = 1; for (let i = 0; i < n; i++) pn *= (d - i) / d; const ans = 1 - pn;
    const what = d === 365 ? 'eigi sama afmælisdag (365 dagar, allir jafnlíklegir)' : d === 52 ? 'fæðist í sömu viku (52 vikur, jafnlíklegar)' : `velji sama skáp af ${d} (allir jafnlíklegir, óháð val)`;
    return pnum(`${n} manns. Hverjar eru líkurnar á að minnst tveir ${what}?`, ans, 0.001,
      calc(`\\Pr(\\text{allir ólíkir}) = \\frac{P(${d},${n})}{${d}^{${n}}} = \\frac{${d}}{${d}}\\cdot\\frac{${d - 1}}{${d}}\\cdots\\frac{${d - n + 1}}{${d}} = ${F.m(pn, 5)}`, `\\Pr(\\text{minnst tveir eins}) = 1 - ${F.m(pn, 5)} = ${F.m(ans)}`) +
      note('Afmælisvandamálið á glærum 01 (gl. 28–31): fyllireglan er auðveldari leið. Í R: <code>1 - prod(' + d + ' - 1:n + 1) / ' + d + '^n</code>.') + trap(`C(${n},2)/${d} = ${F.dec(PROB.choose(n, 2) / d, 4)} er ekki líkur (getur farið yfir 1).`), { d, n }); }
  const p = R.ri(2, 20) / 100, t = R.pick([0.5, 0.8, 0.9, 0.95, 0.99]); const n = Math.ceil(Math.log(1 - t) / Math.log(1 - p));
  return num(`Hver tilraun heppnast með líkum ${F.dec(p, 2)}, óháð öðrum. Hver er <b>minnsti</b> fjöldi tilrauna n svo að líkurnar á að minnst ein heppnist séu að minnsta kosti ${F.dec(t, 2)}?`, n, 0, '',
    calc(`1 - (1 - ${F.m(p)})^n \\ge ${F.m(t)}`, `(${F.m(1 - p)})^n \\le ${F.m(1 - t)}`, `n \\ge \\frac{\\ln(${F.m(1 - t)})}{\\ln(${F.m(1 - p)})} = ${F.m(Math.log(1 - t) / Math.log(1 - p), 3)}`, `n = ${n}`) +
    trap(`Ójafnan snýst við þegar deilt er með ln(${F.dec(1 - p, 2)}) < 0. Að námunda niður (${n - 1}) gefur líkur ${F.dec(1 - Math.pow(1 - p, n - 1), 4)} < ${F.dec(t, 2)}.`), { p, t });
} });


// ================= L02 · Strjálar slembibreytur =================
// Handahófskennt þéttleikafall: k ólík gildi, líkur í margfeldum af 0,05.
function genPMF(k, lo = 0, hi = 9) {
  const xs = R.sample(rng(lo, hi), k).sort((a, b) => a - b);
  let w; do { w = xs.map(() => R.ri(1, 8)); } while (w.reduce((s, t) => s + t, 0) !== 20);
  return { xs, ps: w.map(t => t / 20) };
}
const pmfTbl = (xs, ps, lab = 'x') => tbl([lab, ...xs.map(String)], [['f(' + lab + ')', ...ps.map(p => F.dec(p, 2))]]);
const EV = (xs, ps, g = x => x) => xs.reduce((s, x, i) => s + g(x) * ps[i], 0);

GENS.push({ id: 'g-pmf', lec: 'L02', name: 'Væntigildi og dreifni úr PMF-töflu', f(lvl) {
  const { xs, ps } = genPMF(R.ri(4, 5), lvl === 3 ? 0 : 1, lvl === 3 ? 6 : 9);
  const E = EV(xs, ps), E2 = EV(xs, ps, x => x * x), V = E2 - E * E;
  const tab = pmfTbl(xs, ps);
  const eRow = `E[X] = ${xs.map((x, i) => `${x} \\cdot ${F.m(ps[i])}`).join(' + ')} = ${F.m(E)}`;
  if (lvl === 1) return num(`Slembibreytan X hefur þéttleikafallið${tab}Hvert er ${M('E[X]')}?`, E, 0.001, '',
    calc(`E[X] = \\sum_x x\\,f(x)`, eRow) + trap(`Meðaltal gildanna (${F.s(xs.reduce((s, t) => s + t, 0) / xs.length)}) hunsar líkurnar; það á aðeins við ef öll gildi eru jafnlíkleg.`), { xs, ps });
  if (lvl === 2) return num(`Slembibreytan X hefur þéttleikafallið${tab}Hver er dreifni X, ${M('\\mathrm{Var}[X]')}?`, V, 0.001, '',
    calc(eRow, `E[X^2] = ${xs.map((x, i) => `${x * x} \\cdot ${F.m(ps[i])}`).join(' + ')} = ${F.m(E2)}`, `\\mathrm{Var}[X] = E[X^2] - E[X]^2 = ${F.m(E2)} - ${F.m(E * E)} = ${F.m(V)}`) +
    note(`Staðalfrávik: ${M(`\\sqrt{${F.m(V)}} = ${F.m(Math.sqrt(V))}`)}.`) + trap(`${F.s(E2)} er ${M('E[X^2]')}, ekki dreifnin; ${F.s(Math.sqrt(V))} er staðalfrávikið.`), { xs, ps });
  const a = R.ri(1, 5) * 100, b = R.ri(1, 5) * 100; const EY = a * E2 + b * E; const gE = a * E * E + b * E;
  return num(`Fjöldi gallaðra eininga X í sendingu hefur þéttleikafallið${tab}Kostnaður við að bæta gallana er ${M(`Y = ${a}X^2 + ${b}X`)} kr. Hver er vænti kostnaðurinn ${M('E[Y]')}?`, EY, 0.5, 'kr.',
    calc(eRow, `E[X^2] = ${xs.map((x, i) => `${x * x} \\cdot ${F.m(ps[i])}`).join(' + ')} = ${F.m(E2)}`, `E[Y] = ${a}\\,E[X^2] + ${b}\\,E[X] = ${a} \\cdot ${F.m(E2)} + ${b} \\cdot ${F.m(E)} = ${F.m(EY, 2)}`) +
    note('Eins og verkefni 3, dæmi 3: væntigildi er línulegt í X² og X, en Y er ekki línulegt fall af X.') + trap(`Að stinga E[X] inn í fallið gefur ${a}·${F.s(E)}² + ${b}·${F.s(E)} = ${F.s(gE, 2)}. Það er g(E[X]), og ójafna Jensens segir E[g(X)] ≥ g(E[X]) fyrir kúpt g.`), { xs, ps, a, b });
} });

GENS.push({ id: 'g-linear', lec: 'L02', name: 'Línulegar varpanir og summur', f(lvl) {
  if (lvl === 1) { const mu = R.ri(-20, 40) / 2, a = R.pick([-3, -2, 2, 3, 4, 1.8]), b = R.ri(-10, 40);
    const ans = a * mu + b;
    return num(`${M(`E[X] = ${F.m(mu)}`)}. Hvert er ${M(`E[Y]`)} ef ${M(`Y = ${F.m(a)}X ${b < 0 ? '-' : '+'} ${Math.abs(b)}`)}?`, ans, 0.001, '',
      calc(`E[aX + b] = a\\,E[X] + b`, `E[Y] = ${F.m(a)} \\cdot ${F.m(mu)} ${b < 0 ? '-' : '+'} ${Math.abs(b)} = ${F.m(ans)}`) + trap(`${F.s(a * mu)} gleymir fastanum b; væntigildi fasta er fastinn sjálfur.`), { mu, a, b }); }
  if (lvl === 2) { const v = R.ri(4, 60), a = R.pick([-4, -3, -2, 2, 3, 5]), b = R.ri(1, 30); const ans = Math.abs(a) * Math.sqrt(v);
    return num(`${M(`\\mathrm{Var}[X] = ${v}`)}. Hvert er staðalfrávik ${M(`Y = ${a}X + ${b}`)}?`, ans, 0.001, '',
      calc(`\\mathrm{Var}[aX + b] = a^2\\,\\mathrm{Var}[X]`, `\\mathrm{Var}[Y] = (${a})^2 \\cdot ${v} = ${a * a * v}`, `SD[Y] = \\sqrt{${a * a * v}} = |${a}|\\sqrt{${v}} = ${F.m(ans)}`) +
      trap(`${a * a * v} er dreifnin, ekki staðalfrávikið. ${a < 0 ? `${F.s(a * Math.sqrt(v))} er neikvætt: staðalfrávik er |a|·SD. ` : ''}Fastinn ${b} hliðrar aðeins og hefur engin áhrif á dreifni.`), { v, a, b }); }
  const mA = R.ri(-2, 6), sA = R.ri(3, 12), mB = R.ri(-2, 6), sB = R.ri(3, 12), wA = R.ri(2, 8) * 100, wB = 1000 - wA;
  const E = wA * mA / 100 + wB * mB / 100, SD = Math.sqrt((wA / 100) ** 2 * sA ** 2 + (wB / 100) ** 2 * sB ** 2);
  return num(`Þú fjárfestir ${wA} þús. kr. í bréfi A og ${wB} þús. kr. í bréfi B. Ávöxtun A hefur væntigildi ${mA}% og staðalfrávik ${sA}%; B ${mB}% og ${sB}%. Verðþróunin er óháð. Hvert er staðalfrávik hagnaðarins í þús. kr.?`, SD, 0.01, 'þús. kr.',
    calc(`H = ${F.m(wA / 100)} R_A + ${F.m(wB / 100)} R_B \\quad (R \\text{ í \\%})`, `\\mathrm{Var}[H] = ${F.m(wA / 100)}^2 \\cdot ${sA}^2 + ${F.m(wB / 100)}^2 \\cdot ${sB}^2 = ${F.m(SD * SD, 2)}`, `SD[H] = \\sqrt{${F.m(SD * SD, 2)}} = ${F.m(SD, 2)}`) +
    note(`Væntigildið ${F.s(E, 2)} þús. kr. má leggja saman hvort sem bréfin eru óháð eða ekki; dreifnirnar aðeins ef þau eru óháð (dæmablað 2, dæmi 3c).`) + trap(`Að leggja saman staðalfrávikin, ${F.s(wA / 100 * sA)} + ${F.s(wB / 100 * sB)} = ${F.s(wA / 100 * sA + wB / 100 * sB, 2)}, er rangt: √(a + b) ≠ √a + √b.`), { mA, sA, mB, sB, wA, wB });
} });

GENS.push({ id: 'g-quant', lec: 'L02', name: 'Strjált miðgildi og hlutfallsmörk', f(lvl) {
  let xs, ps, p, cum, k;
  for (;;) { ({ xs, ps } = genPMF(5, 0, 12)); cum = []; ps.reduce((s, t, i) => (cum[i] = Math.round((s + t) * 100) / 100), 0);
    if (lvl === 1) p = 0.5; else if (lvl === 2) p = R.pick([0.25, 0.7, 0.75, 0.8, 0.9]); else { const ii = R.ri(0, 3); p = cum[ii]; if (![0.25, 0.3, 0.4, 0.5, 0.6, 0.7, 0.75, 0.8].includes(p)) continue; }
    k = cum.findIndex(c => c >= p - 1e-9); if (lvl < 3 && Math.abs(cum[k] - p) < 1e-9) continue; if (k === 0) continue; break; }
  const ans = xs[k]; const E = EV(xs, ps); const a = xs[k - 1], b = xs[k]; const interp = a + (p - cum[k - 1]) / (cum[k] - cum[k - 1]) * (b - a);
  const lab = p === 0.5 ? 'miðgildi' : `${F.pct(p, 0)} hlutfallsmörk`;
  const ds = [[lvl === 3 && k < 4 ? xs[k + 1] : null, `F(${xs[k]}) = ${F.dec(cum[k], 2)} er nákvæmlega ${F.dec(p, 2)}. Reglan er F(x) ≥ p, svo ${xs[k]} dugar.`], [a, `F(${a}) = ${F.dec(cum[k - 1], 2)} < ${F.dec(p, 2)}: of lágt.`], [Math.round(interp * 100) / 100, 'Brúun er aðferðin fyrir flokkuð gögn, ekki reglan fyrir strjálar breytur.'], [Math.round(E * 100) / 100, 'Væntigildið, ekki hlutfallsmark.'], [xs[2], 'Miðgildi talnanna sjálfra án tillits til líkinda.']];
  return mcx(`X hefur þéttleikafallið${pmfTbl(xs, ps)}Hvert er ${lab} X samkvæmt reglu glæranna, ${M(`\\min\\{x : F(x) \\ge ${F.m(p)}\\}`)}?`, ans, ds, v => F.s(v, 2), pertAdd(1),
    tbl(['x', ...xs.map(String)], [['F(x)', ...cum.map(c => F.dec(c, 2))]]) + calc(`F(${a}) = ${F.m(cum[k - 1])} < ${F.m(p)}`, `F(${b}) = ${F.m(cum[k])} \\ge ${F.m(p)}`, `§${lab} = ${ans}`) +
    unconf('Á glæru 02 (gl. 16) segir í orðum „gildið fyrir neðan miðjuna" en formúlan er min{x : F(x) ≥ 0,5}; lausn verkefnis 3 (2d) fær 15 þar sem formúlan gefur 20. Hér er formúlan notuð. Spurðu kennarann.'), { xs, ps, p });
} });

GENS.push({ id: 'g-interp', lec: 'L02', name: 'Brúun flokkaðra gagna', f(lvl) {
  const w = R.pick([50, 100, 200]), K = 5; const bnd = rng(1, K).map(i => i * w); let cnt; do { cnt = rng(1, K).map(() => R.ri(2, 30)); } while (cnt.reduce((s, t) => s + t, 0) < 40);
  const N = cnt.reduce((s, t) => s + t, 0); const Fb = []; cnt.reduce((s, t, i) => (Fb[i] = (s + t) / N, s + t), 0);
  const Fr = Fb.map(v => Math.round(v * 100) / 100); Fr[K - 1] = 1;
  const p = lvl === 1 ? 0.5 : R.pick([0.25, 0.75, 0.9, 0.6]);
  const Fu = lvl === 3 ? Fb : Fr; const k = Fu.findIndex(v => v >= p); if (k <= 0 || Math.abs(Fu[k] - p) < 1e-9 || Fu[k] === Fu[k - 1]) return this.f(lvl);
  const a = bnd[k - 1], b = bnd[k], Fa = Fu[k - 1], Fbk = Fu[k]; const Q = a + (p - Fa) / (Fbk - Fa) * (b - a); const Qwrong = a + (p - Fa) / (Fbk - Fa) * (a - b);
  const lab = p === 0.5 ? 'miðgildið' : `${F.pct(p, 0)} hlutfallsmörkin`;
  const table = lvl === 3 ? tbl(['Tekjur (þús. kr.)', ...rng(0, K - 1).map(i => `${i * w}–${(i + 1) * w}`)], [['Fjöldi', ...cnt]]) : tbl(['Tekjur ≤ (þús. kr.)', ...bnd.map(String)], [['F', ...Fr.map(v => F.dec(v, 2))]]);
  return num(`Tekjur eru flokkaðar ${lvl === 3 ? `(${N} manns)` : 'og dreifingarfallið við efri mörk flokka er'}:${table}Finnið ${lab} með brúun.`, Q, 0.05, 'þús. kr.',
    (lvl === 3 ? calc(`§Uppsöfnuð hlutföll: ${Fb.map(v => F.dec(v, 4)).join(', ')}`) : '') + calc(`F(${a}) = ${F.m(Fa)} < ${F.m(p)} \\le ${F.m(Fbk)} = F(${b})`, `Q = a + \\frac{p - F(a)}{F(b) - F(a)}(b - a)`, `= ${a} + \\frac{${F.m(p)} - ${F.m(Fa)}}{${F.m(Fbk)} - ${F.m(Fa)}} \\cdot ${b - a} = ${F.m(Q, 2)}`) +
    slideErr(`Á glæru 18 í 02 stendur (a − b) í formúlunni; það gæfi ${F.s(Qwrong, 2)}. Rétt er (b − a), eins og dæmið á glæru 19 sýnir.`) + (lvl === 3 ? trap('Fjöldi er ekki dreifingarfall: fyrst þarf að safna saman og deila með heildarfjölda.') : ''), { bnd, Fu, p, a, b, Fa, Fbk });
} });

// ================= L03 · Strjálar dreifingar =================
GENS.push({ id: 'g-binom', lec: 'L03', name: 'Tvíkostadreifing', f(lvl) {
  if (lvl === 1) { const n = R.ri(4, 12), p = R.ri(1, 9) / 10, k = R.ri(1, n - 1); const ans = PROB.dbinom(k, n, p);
    return pnum(`Í hverri af ${n} óháðum tilraunum eru líkur á árangri ${F.dec(p, 1)}. Hverjar eru líkurnar á nákvæmlega ${k} árangursríkum tilraunum?`, ans, 0.0005,
      calc(`\\Pr(X = ${k}) = \\binom{${n}}{${k}} ${F.m(p)}^{${k}} \\, ${F.m(1 - p)}^{${n - k}}`, `= ${PROB.choose(n, k)} \\cdot ${F.m(Math.pow(p, k), 6)} \\cdot ${F.m(Math.pow(1 - p, n - k), 6)} = ${F.m(ans)}`) +
      note(`R: <code>dbinom(${k}, ${n}, ${String(p)})</code>.`) + trap(`${F.dec(Math.pow(p, k) * Math.pow(1 - p, n - k), 4)} sleppir ${M(`\\binom{${n}}{${k}}`)}, fjölda raða sem gefa ${k} árangur.`), { n, p, k }); }
  if (lvl === 2) { const n = R.ri(6, 14), p = R.ri(2, 8) / 10; const v = R.ri(0, 2); let k = R.ri(1, n - 2), k2 = Math.min(n, k + R.ri(1, 3));
    const ans = v === 0 ? PROB.pbinom(k, n, p) : v === 1 ? 1 - PROB.pbinom(k, n, p) : PROB.pbinom(k2, n, p) - PROB.pbinom(k - 1, n, p);
    const ev = v === 0 ? `X \\le ${k}` : v === 1 ? `X > ${k}` : `${k} \\le X \\le ${k2}`;
    return pnum(`${M(`X \\sim \\mathrm{Bin}(${n},\\, ${F.m(p)})`)}. Reiknið ${M(`\\Pr(${ev})`)}.`, ans, 0.0005,
      calc(v === 0 ? `\\Pr(X \\le ${k}) = \\sum_{i=0}^{${k}} \\binom{${n}}{i}${F.m(p)}^i ${F.m(1 - p)}^{${n}-i} = ${F.m(ans)}` : v === 1 ? `\\Pr(X > ${k}) = 1 - \\Pr(X \\le ${k}) = 1 - ${F.m(1 - ans)} = ${F.m(ans)}` : `\\Pr(${ev}) = ${rng(k, k2).map(i => `f(${i})`).join(' + ')} = ${rng(k, k2).map(i => F.m(PROB.dbinom(i, n, p))).join(' + ')} = ${F.m(ans)}`) +
      note(`R: <code>${v === 0 ? `pbinom(${k}, ${n}, ${String(p)})` : v === 1 ? `1 - pbinom(${k}, ${n}, ${String(p)})` : `pbinom(${k2}, ${n}, ${String(p)}) - pbinom(${k - 1}, ${n}, ${String(p)})`}</code>.`) +
      trap(v === 1 ? `1 − Pr(X < ${k}) = ${F.dec(1 - PROB.pbinom(k - 1, n, p), 4)} tekur X = ${k} með.` : v === 2 ? `F(${k2}) − F(${k}) = ${F.dec(PROB.pbinom(k2, n, p) - PROB.pbinom(k, n, p), 4)} sleppir X = ${k}.` : `Pr(X = ${k}) = ${F.dec(PROB.dbinom(k, n, p), 4)} er aðeins einn liður summunnar.`), { n, p, k, k2, v }); }
  const n = R.pick([3, 4, 5, 6, 7]), p = R.ri(3, 6) / 10; const m = Math.floor(n / 2); const ans = 1 - PROB.pbinom(m, n, p);
  return pnum(`Hlutabréf hækkar um 1 kr. með líkum ${F.dec(p, 1)} eða lækkar um 1 kr. á hverjum degi, óháð milli daga. Hverjar eru líkurnar á að verðið sé <b>hærra</b> en í upphafi eftir ${n} daga?`, ans, 0.0005,
    calc(`§X = fjöldi hækkunardaga ~ Bin(${n}, ${F.dec(p, 1)}); breyting = X − (${n} − X) = 2X − ${n}`, `2X - ${n} > 0 \\iff X > ${F.m(n / 2)} \\iff X \\ge ${m + 1}`, `\\Pr(X \\ge ${m + 1}) = ${rng(m + 1, n).map(i => F.m(PROB.dbinom(i, n, p))).join(' + ')} = ${F.m(ans)}`) +
    note('Eins og hlutabréfadæmið á glærum 03 (gl. 20–23).') + (n % 2 === 0 ? trap(`X = ${n / 2} gefur sama verð, ekki hærra; að taka það með gefur ${F.dec(1 - PROB.pbinom(m - 1, n, p), 4)}.`) : trap(`Pr(X > 0) = ${F.dec(1 - PROB.pbinom(0, n, p), 4)} telur líka daga þar sem verðið endar lægra.`)), { n, p });
} });

GENS.push({ id: 'g-pois', lec: 'L03', name: 'Poisson-dreifing', f(lvl) {
  if (lvl === 1) { const l = R.ri(5, 60) / 10, k = R.ri(0, 6); const ans = PROB.dpois(k, l);
    return pnum(`Að jafnaði ${F.s(l)} atburðir á mánuði og fjöldinn er Poisson-dreifður. Hverjar eru líkurnar á nákvæmlega ${k} atburðum á mánuði?`, ans, 0.0005,
      calc(`\\Pr(X = ${k}) = \\frac{e^{-\\lambda}\\lambda^{${k}}}{${k}!} = \\frac{e^{-${F.m(l)}}\\,${F.m(l)}^{${k}}}{${PROB.fact(k)}} = ${F.m(ans)}`) + note(`R: <code>dpois(${k}, ${String(l)})</code>.`) + trap(`Að gleyma ${k}! í nefnara gefur ${F.dec(Math.exp(-l) * Math.pow(l, k), 4)}.`), { l, k }); }
  if (lvl === 2) { const l = R.ri(10, 50) / 10; const v = R.ri(0, 1); const k = R.ri(1, 4), k2 = k + R.ri(1, 3);
    const ans = v === 0 ? 1 - PROB.ppois(k, l) : PROB.ppois(k2, l) - PROB.ppois(k - 1, l);
    return pnum(`${M(`X \\sim \\mathrm{Poisson}(${F.m(l)})`)}. Reiknið ${M(v === 0 ? `\\Pr(X > ${k})` : `\\Pr(${k} \\le X \\le ${k2})`)}.`, ans, 0.0005,
      calc(v === 0 ? `\\Pr(X > ${k}) = 1 - \\sum_{i=0}^{${k}} \\frac{e^{-${F.m(l)}}${F.m(l)}^i}{i!} = 1 - ${F.m(1 - ans)} = ${F.m(ans)}` : `\\Pr(${k} \\le X \\le ${k2}) = ${rng(k, k2).map(i => F.m(PROB.dpois(i, l))).join(' + ')} = ${F.m(ans)}`) +
      note(v === 0 ? `R: <code>1 - ppois(${k}, ${String(l)})</code>. Fyllireglan sparar óendanlega summu.` : `R: <code>ppois(${k2}, ${String(l)}) - ppois(${k - 1}, ${String(l)})</code>.`) +
      trap(v === 0 ? `1 − Pr(X < ${k}) = ${F.dec(1 - PROB.ppois(k - 1, l), 4)} tekur X = ${k} með.` : `Á glæru 52 í 03 er Pr(2 ≤ X ≤ 4) með λ = 2 sögð 0,676, sem er í raun Pr(X ≤ 2); rétt er 0,541.`), { l, k, k2, v }); }
  const l1 = R.ri(2, 6), l0 = l1 * 2, pr = R.ri(5, 9) / 10, k = R.ri(0, 2); const a = PROB.dpois(k, l1), b = PROB.dpois(k, l0); const post = pr * a / (pr * a + (1 - pr) * b);
  return pnum(`Þú færð að jafnaði ${l0} kvefpestir á ári (Poisson). Lyf helmingar tíðnina en virkar aðeins fyrir ${F.pct(pr, 0)} fólks. Þú tekur lyfið og færð ${k} pest${k === 1 ? '' : 'ir'} á árinu. Hverjar eru líkurnar á að lyfið virki fyrir þig?`, post, 0.001,
    calc(`\\Pr(X = ${k} \\mid \\text{virkar}) = \\frac{e^{-${l1}}${l1}^{${k}}}{${k}!} = ${F.m(a, 5)}`, `\\Pr(X = ${k} \\mid \\text{virkar ekki}) = \\frac{e^{-${l0}}${l0}^{${k}}}{${k}!} = ${F.m(b, 5)}`, `\\Pr(\\text{virkar}\\mid X = ${k}) = \\frac{${F.m(pr)} \\cdot ${F.m(a, 5)}}{${F.m(pr)} \\cdot ${F.m(a, 5)} + ${F.m(1 - pr)} \\cdot ${F.m(b, 5)}} = ${F.m(post)}`) +
    note('Sama uppsetning og dæmablað 3, dæmi 3d: Poisson gefur líkindin, setning Bayes snýr skilyrðingunni við.') + trap(`${F.pct(pr, 0)} eru fyrirframlíkurnar; gögnin breyta þeim.`), { l0, l1, pr, k });
} });

GENS.push({ id: 'g-poisscale', lec: 'L03', name: 'Poisson með breyttu tímabili', f(lvl) {
  const per = R.pick([{ u: 'mánuði', l: R.ri(2, 8) / 2, t: [{ n: 'á ári', f: 12 }, { n: 'á viku (4 vikur í mánuði)', f: 0.25 }, { n: 'á þremur mánuðum', f: 3 }] }, { u: 'klukkustund', l: R.ri(2, 12), t: [{ n: 'á 30 mínútum', f: 0.5 }, { n: 'á 15 mínútum', f: 0.25 }, { n: 'á 2 klst.', f: 2 }] }]);
  const tt = R.pick(per.t); const L = per.l * tt.f;
  if (lvl === 1) return num(`Að jafnaði ${F.s(per.l)} atburðir á ${per.u} (Poisson). Hver er stikinn λ fyrir fjöldann ${tt.n}?`, L, 0.001, '',
    calc(`\\lambda_{\\text{nýtt}} = \\lambda \\cdot \\text{lengdarhlutfall} = ${F.m(per.l)} \\cdot ${F.m(tt.f)} = ${F.m(L)}`) + note('Poisson-stikinn er meðalfjöldi á því tímabili sem spurt er um; summa óháðra Poisson er Poisson með samanlögðu λ.') + trap(`${F.s(per.l)} er λ fyrir rangt tímabil.`), { l: per.l, f: tt.f });
  if (lvl === 2) { const k = Math.max(0, Math.round(L) + R.ri(-2, 2)); const ans = PROB.dpois(k, L);
    return pnum(`Að jafnaði ${F.s(per.l)} atburðir á ${per.u} (Poisson). Hverjar eru líkurnar á nákvæmlega ${k} atburðum ${tt.n}?`, ans, 0.0005,
      calc(`\\lambda = ${F.m(per.l)} \\cdot ${F.m(tt.f)} = ${F.m(L)}`, `\\Pr(X = ${k}) = \\frac{e^{-${F.m(L)}}\\,${F.m(L)}^{${k}}}{${k}!} = ${F.m(ans)}`) + note('Eins og dæmablað 3, dæmi 3c (tvö ár → λ = 8).') + trap(`Með óbreyttu λ = ${F.s(per.l)} fæst ${F.dec(PROB.dpois(k, per.l), 4)}: λ skalað á rangt tímabil.`), { l: per.l, f: tt.f, k }); }
  const a = R.pick([0.01, 0.05, 0.1]); const tmin = Math.log(1 / a) / per.l;
  return num(`Að jafnaði ${F.s(per.l)} atburðir á ${per.u} (Poisson). Hve langt tímabil (í ${per.u === 'mánuði' ? 'mánuðum' : 'klukkustundum'}) þarf til að líkurnar á að <b>enginn</b> atburður verði séu í mesta lagi ${F.dec(a, 2)}?`, tmin, 0.005, per.u === 'mánuði' ? 'mán.' : 'klst.',
    calc(`\\Pr(X_t = 0) = e^{-${F.m(per.l)}t} \\le ${F.m(a)}`, `t \\ge \\frac{\\ln(1/${F.m(a)})}{${F.m(per.l)}} = \\frac{${F.m(Math.log(1 / a), 4)}}{${F.m(per.l)}} = ${F.m(tmin, 3)}`) + note('Fyrir tímabil af lengd t er stikinn λt.') + trap('Að gleyma að ln snýr ójöfnunni gefur neikvætt t.'), { l: per.l, a });
} });

GENS.push({ id: 'g-sums', lec: 'L03', name: 'Summur óháðra dreifinga', f(lvl) {
  if (lvl === 1) { const n1 = R.ri(3, 9), n2 = R.ri(3, 9), p = R.ri(2, 8) / 10; const ans = (n1 + n2) * p;
    return num(`${M(`X \\sim \\mathrm{Bin}(${n1}, ${F.m(p)})`)} og ${M(`Y \\sim \\mathrm{Bin}(${n2}, ${F.m(p)})`)} eru óháðar. Hvert er ${M('E[X+Y]')}?`, ans, 0.001, '',
      calc(`X + Y \\sim \\mathrm{Bin}(${n1} + ${n2},\\, ${F.m(p)})`, `E[X+Y] = ${n1 + n2} \\cdot ${F.m(p)} = ${F.m(ans)}`) + note('Summa tvíkostadreifinga með sama p er tvíkostadreifð. E[X + Y] = E[X] + E[Y] gildir þó alltaf, líka fyrir háðar breytur.') + trap(`${F.s(n1 * n2 * p)} margfaldar fjöldana.`), { n1, n2, p }); }
  if (lvl === 2) { const l1 = R.ri(5, 40) / 10, l2 = R.ri(5, 40) / 10, k = R.ri(1, 7); const L = l1 + l2; const ans = PROB.dpois(k, L);
    return pnum(`Fjöldi tjónatilkynninga frá tveimur útibúum er óháður og Poisson-dreifður með λ = ${F.s(l1)} og λ = ${F.s(l2)} á dag. Hverjar eru líkurnar á nákvæmlega ${k} tilkynningum samtals á dag?`, ans, 0.0005,
      calc(`X + Y \\sim \\mathrm{Poisson}(${F.m(l1)} + ${F.m(l2)}) = \\mathrm{Poisson}(${F.m(L)})`, `\\Pr(X + Y = ${k}) = \\frac{e^{-${F.m(L)}}\\,${F.m(L)}^{${k}}}{${k}!} = ${F.m(ans)}`) + trap(`Pr(X = ${k})·Pr(Y = ${k}) = ${F.dec(PROB.dpois(k, l1) * PROB.dpois(k, l2), 4)} eru líkur á ${k} frá <i>hvoru</i> útibúi.`), { l1, l2, k }); }
  const n = R.ri(5, 20), p = R.ri(1, 9) / 10, l = R.ri(5, 60) / 10; const vX = n * p * (1 - p), vY = l; const ans = vX + vY;
  return num(`${M(`X \\sim \\mathrm{Bin}(${n}, ${F.m(p)})`)} og ${M(`Y \\sim \\mathrm{Poisson}(${F.m(l)})`)} eru óháðar. Hvert er ${M('\\mathrm{Var}[X - Y]')}?`, ans, 0.001, '',
    calc(`\\mathrm{Var}[X] = np(1-p) = ${n} \\cdot ${F.m(p)} \\cdot ${F.m(1 - p)} = ${F.m(vX)}`, `\\mathrm{Var}[Y] = \\lambda = ${F.m(l)}`, `\\mathrm{Var}[X - Y] = \\mathrm{Var}[X] + (-1)^2\\mathrm{Var}[Y] = ${F.m(ans)}`) +
    trap(`Var[X] − Var[Y] = ${F.s(vX - vY)}: dreifnir leggjast alltaf saman fyrir óháðar breytur, líka þegar breyturnar eru dregnar frá.`), { n, p, l });
} });


// ================= L04 · Samfelldar slembibreytur =================
GENS.push({ id: 'g-kxn', lec: 'L04', name: 'f(x) = kxⁿ á [0, c]', f(lvl) {
  const n = R.ri(1, 3), c = R.ri(1, 3); const k = (n + 1) / Math.pow(c, n + 1); const N1 = n + 1;
  const fTxt = `f(x) = k x^{${n}}, \\; 0 \\le x \\le ${c}`;
  const kRow = [`\\int_0^{${c}} k x^{${n}}\\,dx = k\\frac{${c}^{${N1}}}{${N1}} = 1`, `k = \\frac{${N1}}{${c}^{${N1}}} = \\frac{${N1}}{${Math.pow(c, N1)}} = ${F.m(k)}`];
  if (lvl === 1) return num(`Slembibreytan X hefur þéttleikafallið ${M(fTxt)} (og 0 annars). Hvert þarf k að vera til að f sé þéttleikafall?`, k, 0.0001, '',
    calc(...kRow) + note('Skilyrðin: f(x) ≥ 0 og heildið yfir allt bilið er 1 (glæra 11 í 04).') + trap(`k = ${N1} á aðeins við þegar c = 1. Að gleyma að hækka c í veldið ${N1} gefur ${F.s(N1 / c)}.`), { n, c });
  const Fx = x => Math.pow(x / c, N1);
  if (lvl === 2) {
    if (Math.random() < 0.5) { let a, b; do { a = R.ri(0, 9) * c / 10; b = R.ri(1, 10) * c / 10; } while (b <= a); const ans = Fx(b) - Fx(a);
      return pnum(`${M(fTxt)}, þar sem k gerir f að þéttleikafalli. Reiknið ${M(`\\Pr(${F.m(a)} < X < ${F.m(b)})`)}.`, ans, 0.0005,
        calc(...kRow, `F(x) = \\int_0^x k t^{${n}}\\,dt = \\left(\\frac{x}{${c}}\\right)^{${N1}}`, `\\Pr = F(${F.m(b)}) - F(${F.m(a)}) = ${F.m(Fx(b))} - ${F.m(Fx(a))} = ${F.m(ans)}`) +
        trap(`f(${F.s(b)}) − f(${F.s(a)}) eða f(x) sjálft gefur ekki líkur; þéttleiki er ekki líkindafall.`), { n, c, a, b, v: 'P' }); }
    const E = N1 * c / (n + 2);
    return num(`${M(fTxt)}, þar sem k gerir f að þéttleikafalli. Hvert er ${M('E[X]')}?`, E, 0.0005, '',
      calc(...kRow, `E[X] = \\int_0^{${c}} x \\cdot k x^{${n}}\\,dx = k\\frac{${c}^{${n + 2}}}{${n + 2}} = \\frac{${N1}}{${n + 2}} \\cdot ${c} = ${F.m(E)}`) + trap(`Miðja bilsins (${F.s(c / 2)}) er væntigildið aðeins fyrir jafna dreifingu.`), { n, c, v: 'E' });
  }
  if (Math.random() < 0.5) { const E = N1 * c / (n + 2), E2 = N1 * c * c / (n + 3), V = E2 - E * E;
    return num(`${M(fTxt)}, þar sem k gerir f að þéttleikafalli. Hver er dreifni X?`, V, 0.0005, '',
      calc(...kRow, `E[X] = \\frac{${N1}}{${n + 2}} \\cdot ${c} = ${F.m(E)}`, `E[X^2] = k\\frac{${c}^{${n + 3}}}{${n + 3}} = \\frac{${N1}}{${n + 3}} \\cdot ${c * c} = ${F.m(E2)}`, `\\mathrm{Var}[X] = ${F.m(E2)} - ${F.m(E)}^2 = ${F.m(V)}`) +
      trap(`${F.s(E2)} er E[X²]; dreifnin er E[X²] − E[X]².`), { n, c, v: 'V' }); }
  const p = R.pick([0.5, 0.25, 0.75, 0.8, 0.9]); const q = c * Math.pow(p, 1 / N1);
  return num(`${M(fTxt)}, þar sem k gerir f að þéttleikafalli. Finnið ${p === 0.5 ? 'miðgildi' : F.pct(p, 0) + ' hlutfallsmörk'} X.`, q, 0.0005, '',
    calc(...kRow, `F(x) = \\left(\\frac{x}{${c}}\\right)^{${N1}} = ${F.m(p)}`, `x = ${c} \\cdot ${F.m(p)}^{1/${N1}} = ${F.m(q)}`) + note('Fyrir samfellda breytu leysum við F(x) = p (glæra 33 í 04).') + trap(`${F.s(N1 * c / (n + 2))} er væntigildið; dreifingin er skökk svo miðgildi og væntigildi falla ekki saman.`), { n, c, p, v: 'Q' });
} });

// ================= L05 · Samfelldar dreifingar =================
GENS.push({ id: 'g-unif', lec: 'L05', name: 'Jöfn dreifing', f(lvl) {
  let a = R.ri(-5, 10), b = a + R.ri(2, 12); const Fu = x => PROB.punif(x, a, b);
  if (lvl === 1) { if (Math.random() < 0.5) { const E = (a + b) / 2, V = (b - a) ** 2 / 12;
      return num(`${M(`X \\sim \\mathrm{Unif}(${a}, ${b})`)}. Hver er dreifni X?`, V, 0.0005, '', calc(`\\mathrm{Var}[X] = \\frac{(b-a)^2}{12} = \\frac{(${b} - (${a}))^2}{12} = ${F.m(V)}`) + note(`Væntigildið er (a + b)/2 = ${F.s(E)}.`) + trap(`(b − a)/12 = ${F.s((b - a) / 12)} gleymir öðru veldinu; √Var = ${F.s(Math.sqrt(V))} er staðalfrávikið.`), { a, b, v: 'V' }); }
    const x = R.ri(a + 1, b - 1) + R.pick([0, 0.5]); const ans = Fu(x);
    return pnum(`${M(`X \\sim \\mathrm{Unif}(${a}, ${b})`)}. Reiknið ${M(`\\Pr(X < ${F.m(x)})`)}.`, ans, 0.0005, calc(`F(x) = \\frac{x - a}{b - a} = \\frac{${F.m(x)} - (${a})}{${b - a}} = ${F.m(ans)}`) + trap(`1/(b − a) = ${F.dec(1 / (b - a), 4)} er þéttleikinn, ekki líkur.`), { a, b, x, v: 'P' }); }
  if (lvl === 2) { if (Math.random() < 0.5) { const hi = R.ri(a + 1, b - 1), lo = R.ri(a + 1, hi); const ans = (1 - Fu(hi)) + Fu(lo);
      return pnum(`${M(`X \\sim \\mathrm{Unif}(${a}, ${b})`)}. Hverjar eru líkurnar á að X sé stærri en ${hi} <b>eða</b> minni en ${lo}?`, ans, 0.0005,
        calc(`\\Pr(X > ${hi}) = 1 - F(${hi}) = ${F.m(1 - Fu(hi))}`, `\\Pr(X < ${lo}) = F(${lo}) = ${F.m(Fu(lo))}`, `\\Pr = ${F.m(1 - Fu(hi))} + ${F.m(Fu(lo))} = ${F.m(ans)}`) +
        note('Atburðirnir eru sundurlægir (geta ekki gerst samtímis), svo líkurnar leggjast saman. Í lausn dæmablaðs 5 (1d) eru þeir ranglega kallaðir „óháðir".') + trap(`F(${hi}) − F(${lo}) = ${F.dec(Fu(hi) - Fu(lo), 4)} eru líkurnar á milli, sem er fyllingin.`), { a, b, hi, lo, v: 'or' }); }
    const c = R.ri(a - 4, a + 2), d = R.ri(Math.max(c + 1, a + 1), b + 4); const ans = Fu(d) - Fu(c);
    return pnum(`${M(`X \\sim \\mathrm{Unif}(${a}, ${b})`)}. Reiknið ${M(`\\Pr(${c} < X < ${d})`)}.`, ans, 0.0005,
      calc(`F(${d}) = ${F.m(Fu(d))}${d >= b ? ' \\;(\\text{ofan við } b)' : ''}`, `F(${c}) = ${F.m(Fu(c))}${c <= a ? ' \\;(\\text{neðan við } a)' : ''}`, `\\Pr = ${F.m(Fu(d))} - ${F.m(Fu(c))} = ${F.m(ans)}`) + trap(`(${d} − ${c})/(${b} − ${a}) = ${F.dec((d - c) / (b - a), 4)} hunsar að dreifingin er 0 utan [${a}, ${b}].`), { a, b, c, d, v: 'int' }); }
  a = R.ri(-3, 2); b = a + R.ri(2, 6); const m = R.pick([-3, -2, 2, 3, 4]), q = R.ri(-5, 5); const ya = Math.min(m * a + q, m * b + q), yb = Math.max(m * a + q, m * b + q);
  const SD = Math.abs(m) * (b - a) / Math.sqrt(12);
  return num(`${M(`X \\sim \\mathrm{Unif}(${a}, ${b})`)} og ${M(`Y = ${m}X ${q < 0 ? '-' : '+'} ${Math.abs(q)}`)}. Y er líka jafndreifð. Hvert er staðalfrávik Y?`, SD, 0.0005, '',
    calc(`§Endapunktar: ${m}·(${a}) ${q < 0 ? '−' : '+'} ${Math.abs(q)} = ${m * a + q} og ${m}·${b} ${q < 0 ? '−' : '+'} ${Math.abs(q)} = ${m * b + q}`, `Y \\sim \\mathrm{Unif}(${ya}, ${yb})`, `SD[Y] = \\frac{${yb} - (${ya})}{\\sqrt{12}} = ${F.m(SD)}`) +
    note(`Sama fæst með SD[aX + b] = |a|·SD[X] = ${Math.abs(m)} · ${F.s((b - a) / Math.sqrt(12))}. Eins og dæmablað 5, 1e–f.`) + trap(`${F.s(m * (b - a) / Math.sqrt(12))}${m < 0 ? ' er neikvætt' : ''}: staðalfrávik er |a|·SD; ${F.s(m * m * (b - a) ** 2 / 12)} er dreifnin.`), { a, b, m, q });
} });

GENS.push({ id: 'g-exp', lec: 'L05', name: 'Veldisdreifing', f(lvl) {
  const mean = R.pick([2, 4, 5, 8, 10, 12, 20]); const l = 1 / mean; const ctx = R.pick([['mínútur', 'milli skilaboða'], ['mánuðir', 'þar til atvinnulaus fær vinnu'], ['ár', 'milli kreppna']]);
  if (lvl === 1) { const x = R.ri(1, 2 * mean); const ans = PROB.pexp(x, l);
    return pnum(`Tíminn ${ctx[1]} er veldisdreifður með meðaltal ${mean} ${ctx[0]}. Hverjar eru líkurnar á að hann sé styttri en ${x}?`, ans, 0.0005,
      calc(`\\lambda = \\frac{1}{${mean}} = ${F.m(l)}`, `\\Pr(X < ${x}) = 1 - e^{-${F.m(l)} \\cdot ${x}} = ${F.m(ans)}`) + note(`R: <code>pexp(${x}, rate = ${F.s(l).replace(',', '.')})</code>.`) + trap(`Með λ = ${mean} (meðaltalið í stað tíðninnar) fæst ${F.dec(PROB.pexp(x, mean), 4)}.`), { mean, x }); }
  if (lvl === 2) { const a = R.ri(1, mean), b = a + R.ri(1, 2 * mean); const ans = Math.exp(-l * a) - Math.exp(-l * b);
    return pnum(`Tíminn ${ctx[1]} er veldisdreifður með meðaltal ${mean} ${ctx[0]}. Hverjar eru líkurnar á að hann sé á milli ${a} og ${b}?`, ans, 0.0005,
      calc(`\\lambda = 1/${mean} = ${F.m(l)}`, `\\Pr(${a} < X < ${b}) = F(${b}) - F(${a}) = e^{-${F.m(l)} \\cdot ${a}} - e^{-${F.m(l)} \\cdot ${b}}`, `= ${F.m(Math.exp(-l * a))} - ${F.m(Math.exp(-l * b))} = ${F.m(ans)}`) +
      (mean === 5 && a === 2 && b === 4 ? slideErr('Á glæru 29 í 05 stendur 0,11; rétt er 0,221.') : '') + trap(`F(${a}) − F(${b}) er neikvætt; e<sup>−λ·${b}</sup> − e<sup>−λ·${a}</sup> líka.`), { mean, a, b }); }
  const qq = R.pick([0.5, 0.9, 0.95, 0.99, 0.999]); const t = -Math.log(1 - qq) / l;
  return num(`Tíminn ${ctx[1]} er veldisdreifður með meðaltal ${mean} ${ctx[0]}. Eftir hve langan tíma er ${F.pct(qq, qq === 0.999 ? 1 : 0)} líkur á að atburðurinn hafi orðið?`, t, 0.01, ctx[0],
    calc(`1 - e^{-\\lambda t} = ${F.m(qq)}`, `t = \\frac{-\\ln(1 - ${F.m(qq)})}{\\lambda} = ${mean} \\cdot ${F.m(-Math.log(1 - qq))} = ${F.m(t, 3)}`) + note(`R: <code>qexp(${String(qq)}, rate = 1/${mean})</code>. Sama og dæmablað 5, 2d.`) + trap(`−ln(${F.s(qq)})·${mean} = ${F.s(-Math.log(qq) * mean, 3)} leysir e<sup>−λt</sup> = ${F.s(qq)} í stað 1 − e<sup>−λt</sup> = ${F.s(qq)}.`), { mean, qq });
} });

GENS.push({ id: 'g-norm', lec: 'L05', name: 'Stöðlun normaldreifingar', f(lvl) {
  const mu = R.ri(2, 30) * 10, sd = R.ri(1, 8) * 5; const z = x => (x - mu) / sd;
  if (lvl === 1) { const x = mu + R.ri(-25, 25) / 10 * sd; const zz = z(x); const ex = PROB.pnorm(zz), tb = PROB.tabPhi(zz);
    return pnum(`Dagleg eftirspurn er normaldreifð með meðaltal ${mu} og staðalfrávik ${sd}. Hverjar eru líkurnar á að hún sé undir ${F.s(x)}? ${hint(TABNOTE)}`, ex, nTol(ex, tb),
      calc(`Z = \\frac{${F.m(x)} - ${mu}}{${sd}} = ${F.m(zz, 4)}`, `\\Pr(Z < ${F.m(zz, 2)}) = ${F.m(tb)} \\;(\\text{tafla})`, `§nákvæmt: ${F.dec(ex, 4)} · R: <code>pnorm(${F.s(x).replace(',', '.')}, mean = ${mu}, sd = ${sd})</code>`) + trap(`1 − Φ(z) = ${F.dec(1 - ex, 4)} er efri halinn.`), { mu, sd, x, v: 'L' }); }
  if (lvl === 2) { const s2 = sd * sd; const v = Math.random() < 0.5;
    if (v) { const x = mu + R.ri(2, 25) / 10 * sd * R.pick([-1, 1]); const zz = z(x); const ex = 1 - PROB.pnorm(zz), tb = 1 - PROB.tabPhi(zz);
      return pnum(`${M(`X \\sim N(${mu},\\, ${s2})`)}. Reiknið ${M(`\\Pr(X > ${F.m(x)})`)}. ${hint(TABNOTE)}`, ex, nTol(ex, tb),
        calc(`\\sigma = \\sqrt{${s2}} = ${sd}`, `Z = \\frac{${F.m(x)} - ${mu}}{${sd}} = ${F.m(zz, 2)}`, `\\Pr(X > ${F.m(x)}) = 1 - \\Phi(${F.m(zz, 2)}) = ${F.m(tb)}`, `§nákvæmt: ${F.dec(ex, 4)}`) +
        trap(`Seinni stikinn í N(μ, σ²) er dreifnin. Að deila með ${s2} gefur Z = ${F.dec((x - mu) / s2, 3)}. Í R tekur <code>pnorm</code> sd: <code>1 - pnorm(${F.s(x).replace(',', '.')}, ${mu}, ${sd})</code>, ekki <code>pnorm(…, ${mu}, ${s2})</code>.`), { mu, sd, x, v: 'R' }); }
    const a = mu - R.ri(3, 20) / 10 * sd, b = mu + R.ri(3, 20) / 10 * sd; const ex = PROB.pnorm(z(b)) - PROB.pnorm(z(a)), tb = PROB.tabPhi(z(b)) - PROB.tabPhi(z(a));
    return pnum(`${M(`X \\sim N(${mu},\\, ${s2})`)}. Reiknið ${M(`\\Pr(${F.m(a)} < X < ${F.m(b)})`)}. ${hint(TABNOTE)}`, ex, nTol(ex, tb),
      calc(`\\sigma = \\sqrt{${s2}} = ${sd}`, `z_1 = \\frac{${F.m(a)} - ${mu}}{${sd}} = ${F.m(z(a), 2)}, \\quad z_2 = \\frac{${F.m(b)} - ${mu}}{${sd}} = ${F.m(z(b), 2)}`, `\\Pr = \\Phi(${F.m(z(b), 2)}) - \\Phi(${F.m(z(a), 2)}) = ${F.m(PROB.tabPhi(z(b)))} - ${F.m(PROB.tabPhi(z(a)))} = ${F.m(tb)}`, `§nákvæmt: ${F.dec(ex, 4)}`) +
      trap(`Seinni stikinn er dreifnin ${s2}; σ = ${sd}. Fyrir neikvætt z: Φ(−z) = 1 − Φ(z).`), { mu, sd, a, b, v: 'I' }); }
  const qq = R.pick([0.8, 0.9, 0.95, 0.975, 0.99]); const ze = PROB.qnorm(qq), zt = Math.round(ze * 100) / 100; const xe = mu + ze * sd, xt = mu + zt * sd;
  return num(`Eftirspurn er normaldreifð með meðaltal ${mu} og staðalfrávik ${sd}. Hve mikið þarf að eiga til að vera ${F.pct(qq, qq === 0.975 ? 1 : 0)} viss um að birgðirnar dugi? ${hint('Töflur leyfðar: vikmörkin ná bæði yfir z á tveimur aukastöfum og nákvæmt z.')}`, xe, Math.max(0.01, Math.ceil((Math.abs(xe - xt) + 0.006) * 100) / 100), '',
    calc(`\\Phi(z) = ${F.m(qq)} \\Rightarrow z = ${F.m(ze, 3)}`, `x = \\mu + z\\sigma = ${mu} + ${F.m(ze, 3)} \\cdot ${sd} = ${F.m(xe, 2)}`) + note(`R: <code>qnorm(${String(qq)}, mean = ${mu}, sd = ${sd})</code>. Eins og pylsuvagninn í dæmablaði 5 (3d); í heilum einingum þyrfti að námunda upp.`) +
    trap(`<code>qnorm(${String(qq)}, ${mu}, ${sd * sd})</code> notar dreifnina sem sd og gefur ${F.s(mu + ze * sd * sd, 2)}. Að nota neikvætt z (hlutfallsmarkið fyrir ${F.s(1 - qq, 3)}) gefur ${F.s(mu - ze * sd, 2)}.`), { mu, sd, qq });
} });

GENS.push({ id: 'g-normsum', lec: 'L05', name: 'Summur og línuleg föll normaldreifðra', f(lvl) {
  const m1 = R.ri(10, 60), s1 = R.ri(2, 12), m2 = R.ri(10, 60), s2 = R.ri(2, 12);
  if (lvl === 1) { const sd = Math.hypot(s1, s2);
    return num(`${M(`X \\sim N(${m1}, ${s1}^2)`)} og ${M(`Y \\sim N(${m2}, ${s2}^2)`)} eru óháðar. Hvert er staðalfrávik ${M('X + Y')}?`, sd, 0.0005, '',
      calc(`\\mathrm{Var}[X + Y] = ${s1}^2 + ${s2}^2 = ${s1 * s1 + s2 * s2}`, `SD = \\sqrt{${s1 * s1 + s2 * s2}} = ${F.m(sd)}`) + slideErr('Á glæru 54 í 05 stendur að dreifni summunnar sé Σσ<sub>i</sub>; rétt er Σσ<sub>i</sub>², dreifnirnar leggjast saman.') + trap(`${s1} + ${s2} = ${s1 + s2} leggur saman staðalfrávikin.`), { s1, s2 }); }
  if (lvl === 2) { const c = m1 + m2 + R.ri(-15, 15) / 10 * Math.hypot(s1, s2); const sd = Math.hypot(s1, s2), zz = (c - m1 - m2) / sd; const ex = 1 - PROB.pnorm(zz), tb = 1 - PROB.tabPhi(zz);
    return pnum(`Sala tveggja útibúa er óháð og normaldreifð: ${M(`X \\sim N(${m1}, ${s1}^2)`)}, ${M(`Y \\sim N(${m2}, ${s2}^2)`)}. Hverjar eru líkurnar á að heildarsalan sé meiri en ${F.s(c, 1)}? ${hint(TABNOTE)}`, ex, nTol(ex, tb),
      calc(`X + Y \\sim N(${m1 + m2},\\; ${s1 * s1 + s2 * s2})`, `Z = \\frac{${F.m(c, 1)} - ${m1 + m2}}{\\sqrt{${s1 * s1 + s2 * s2}}} = ${F.m(zz, 2)}`, `\\Pr = 1 - \\Phi(${F.m(zz, 2)}) = ${F.m(tb)}`, `§nákvæmt: ${F.dec(ex, 4)}`) + trap(`Að deila með ${s1 + s2} (summu staðalfrávika) gefur Z = ${F.dec((c - m1 - m2) / (s1 + s2), 2)}.`), { m1, s1, m2, s2, c }); }
  const mu = R.ri(15, 30) * 10, sd = R.ri(3, 8) * 10, buy = Math.round(mu + 1.645 * sd), pr = R.pick([100, 150, 200]), ls = R.pick([30, 50, 60]);
  const A = pr + ls, B = ls * buy; const mH = A * mu - B, sH = A * sd; const h = Math.round((mH + R.ri(-12, 6) / 10 * sH) / 100) * 100; const zz = (h - mH) / sH; const ex = 1 - PROB.pnorm(zz), tb = 1 - PROB.tabPhi(zz);
  return pnum(`Sala X ~ N(${mu}, ${sd}²) stykki á dag. Seljandi kaupir ${buy} stykki að morgni; hagnaður er ${M(`H = ${pr}X - ${ls}S`)} þar sem ${M(`S = ${buy} - X`)} er óselt. Hverjar eru líkurnar á að hagnaðurinn sé yfir ${F.int(h)} kr.? (Hunsið að X geti farið yfir ${buy}.) ${hint(TABNOTE)}`, ex, nTol(ex, tb),
    calc(`H = ${pr}X - ${ls}(${buy} - X) = ${A}X - ${F.mi(B)}`, `E[H] = ${A} \\cdot ${mu} - ${F.mi(B)} = ${F.mi(mH)}`, `SD[H] = ${A} \\cdot ${sd} = ${F.mi(sH)}`, `Z = \\frac{${F.mi(h)} - ${F.mi(mH)}}{${F.mi(sH)}} = ${F.m(zz, 2)}`, `\\Pr(H > ${F.mi(h)}) = 1 - \\Phi(${F.m(zz, 2)}) = ${F.m(tb)}`, `§nákvæmt: ${F.dec(ex, 4)}`) +
    note('Sama uppsetning og pylsuvagninn í dæmablaði 5 (3e): H er línulegt fall af X og því normaldreift.') + trap(`Að gleyma að S fer líka eftir X gefur SD = ${pr}·${sd} = ${F.int(pr * sd)}.`), { mu, sd, buy, pr, ls, h });
} });

GENS.push({ id: 'g-ctf', lec: 'L05', name: 'χ², t og F með R', r: [1], f(lvl) {
  const kind = R.pick(['chisq', 't', 'F']);
  if (lvl === 1) {
    const k = R.ri(2, 15), k2 = R.ri(5, 30), x = R.ri(5, 40) / 10;
    const nm = kind === 'chisq' ? `χ²-dreifð með ${k} frígráðum` : kind === 't' ? `t-dreifð með ${k} frígráðum` : `F-dreifð með ${k} og ${k2} frígráðum`;
    const args = kind === 'F' ? `${String(x)}, ${k}, ${k2}` : `${String(x)}, ${k}`; const f = kind === 'chisq' ? 'chisq' : kind;
    const right = `1 - p${f}(${args})`;
    return mc(`X er ${nm}. Hvaða R-skipun skilar ${M(`\\Pr(X > ${F.m(x)})`)}?`, [`<code>${right}</code>`, `<code>p${f}(${args})</code>`, `<code>q${f}(${args})</code>`, `<code>d${f}(${args})</code>`, `<code>1 - q${f}(${args})</code>`],
      note('p = dreifingarfall F(x) = Pr(X ≤ x), q = hlutfallsmark (andhverfa F), d = þéttleiki, r = slembidráttur. Efri hali: 1 − F(x).') + '<p class="note"><b>Rangir kostir</b></p>' + traps([[`p${f}(…)`, 'Gefur Pr(X ≤ x), neðri halann.'], [`q${f}(…)`, 'Tekur líkur inn og skilar x; hér er x gefið.'], [`d${f}(…)`, 'Þéttleiki, ekki líkur.'], [`1 - q${f}(…)`, 'Blandar saman hlutfallsmarki og líkum.']]) +
      unconf('Á glærunum koma aðeins r-föllin fyrir (rbinom, rpois, rexp, rnorm, runif) og í lausnum verkefna pnorm, qnorm, dnorm, qexp, dpois og ppois. pchisq, pt og pf koma hvergi fyrir í heimildunum; gert er ráð fyrir að sama d/p/q/r-regla gildi.'), null, { kind, k, k2, x });
  }
  if (lvl === 2) { const k = R.ri(2, 12), k2 = R.ri(5, 25), x = R.ri(3, 30) / 10 * (kind === 'chisq' ? k / 2 : 1) ;
    const xx = kind === 't' ? R.pick([-1, 1]) * R.ri(5, 30) / 10 : Math.round(x * 10) / 10;
    const ans = kind === 'chisq' ? PROB.pchisq(xx, k) : kind === 't' ? PROB.pt(xx, k) : PROB.pf(xx, k, k2);
    const cmd = kind === 'chisq' ? `pchisq(${String(xx)}, ${k})` : kind === 't' ? `pt(${String(xx)}, ${k})` : `pf(${String(xx)}, ${k}, ${k2})`;
    return pnum(`Hvað skilar <code>${cmd}</code> í R? (Gildið má finna með R eða reiknivél sem reiknar dreifingarföll.)`, ans, 0.0005,
      calc(`§<code>${cmd}</code> = Pr(X ≤ ${F.s(xx)}) fyrir ${kind === 'chisq' ? 'χ²(' + k + ')' : kind === 't' ? 't(' + k + ')' : 'F(' + k + ', ' + k2 + ')'}`, `= ${F.m(ans)}`) +
      note(kind === 't' ? 't-dreifingin er samhverf um 0: Pr(T ≤ −t) = 1 − Pr(T ≤ t).' : kind === 'chisq' ? `E = k = ${k}, Var = 2k = ${2 * k}.` : `E = k₂/(k₂ − 2) = ${F.s(k2 / (k2 - 2), 3)}.`) + unconf('pchisq/pt/pf eru ekki í glærunum (sjá stig 1).'), { kind, k, k2, x: xx, rc: `cat(round(${cmd}, 6))`, rx: String(+ans.toFixed(6)) }); }
  const s = R.pick([1, 2, 3]), dim = R.pick([2, 3]); const d1 = R.ri(1, 3) * s / 2 + s / 2;   const ans = PROB.pchisq(d1 * d1 / (s * s), dim);
  return pnum(`Staðsetningarskekkja í ${dim} víddum: skekkja í hverri vídd er óháð og ${M(`N(0, ${s}^2)`)} (í metrum). Hverjar eru líkurnar á að fjarlægðin frá matinu sé minni en ${F.s(d1)} m?`, ans, 0.0005,
    calc(`D^2 = X_1^2 + \\dots + X_{${dim}}^2, \\quad \\frac{D^2}{${s * s}} \\sim \\chi^2(${dim})`, `\\Pr(D < ${F.m(d1)}) = \\Pr\\left(\\frac{D^2}{${s * s}} < \\frac{${F.m(d1 * d1)}}{${s * s}}\\right) = \\Pr(\\chi^2_{${dim}} < ${F.m(d1 * d1 / (s * s))}) = ${F.m(ans)}`) +
    note(`R: <code>pchisq(${String(+(d1 * d1 / (s * s)).toFixed(6))}, ${dim})</code>. Eins og flugvélardæmið á glærum 05 (gl. 68–70), þar sem Pr(χ²₃ < 1) ≈ 0,199.`) + trap(`Að deila ekki með dreifninni ${s * s} gefur Pr(χ²<sub>${dim}</sub> < ${F.s(d1 * d1)}) = ${F.dec(PROB.pchisq(d1 * d1, dim), 4)}${s === 1 ? ' (sem er það sama hér því σ = 1)' : ''}.`), { s, dim, d: d1 });
} });

// ================= L06 · Margvíðar slembibreytur =================
function genJoint() {
  const xs = R.sample(rng(0, 4), 2).sort((a, b) => a - b), ys = R.sample(rng(0, 5), 3).sort((a, b) => a - b);
  let w; do { w = rng(1, 6).map(() => R.ri(0, 6)); } while (w.reduce((s, t) => s + t, 0) !== 20 || w.filter(t => t === 0).length > 1);
  const P = [w.slice(0, 3).map(t => t / 20), w.slice(3).map(t => t / 20)]; return { xs, ys, P };
}
const jointTbl = (xs, ys, P) => tbl(['f(x, y)', ...ys.map(y => 'y = ' + y)], xs.map((x, i) => ['x = ' + x, ...P[i].map(p => F.dec(p, 2))]));
GENS.push({ id: 'g-joint', lec: 'L06', name: 'Strjál samdreifingartafla', f(lvl) {
  const { xs, ys, P } = genJoint(); const fX = P.map(r => r.reduce((s, t) => s + t, 0)), fY = ys.map((_, j) => P[0][j] + P[1][j]);
  const EX = xs.reduce((s, x, i) => s + x * fX[i], 0), EY = ys.reduce((s, y, j) => s + y * fY[j], 0);
  let EXY = 0; xs.forEach((x, i) => ys.forEach((y, j) => EXY += x * y * P[i][j])); const cov = EXY - EX * EY;
  const tab = jointTbl(xs, ys, P);
  if (lvl === 1) { if (Math.random() < 0.5) { const j = R.ri(0, 2);
      return pnum(`X og Y hafa samþéttleikafallið${tab}Hvert er jaðarþéttleikafallið ${M(`f_Y(${ys[j]})`)}?`, fY[j], 0.0005, calc(`f_Y(${ys[j]}) = \\sum_x f(x, ${ys[j]}) = ${F.m(P[0][j])} + ${F.m(P[1][j])} = ${F.m(fY[j])}`) + trap('Að taka eina reit töflunnar gefur samlíkur, ekki jaðarlíkur.'), { xs, ys, P, v: 'm', j }); }
    const j = R.ri(0, 2); const Fv = P[0].slice(0, j + 1).reduce((s, t) => s + t, 0);
    return pnum(`X og Y hafa samþéttleikafallið${tab}Hvert er samdreifingarfallið ${M(`F(${xs[0]}, ${ys[j]}) = \\Pr(X \\le ${xs[0]}, Y \\le ${ys[j]})`)}?`, Fv, 0.0005,
      calc(`F(${xs[0]}, ${ys[j]}) = ${P[0].slice(0, j + 1).map(t => F.m(t)).join(' + ')} = ${F.m(Fv)}`) + note('Eins og glæra 9 í 06 og dæmablað 6, 1b.') + trap(`Að taka alla dálka Y ≤ ${ys[j]} fyrir bæði X-gildin gefur F(${xs[1]}, ${ys[j]}).`), { xs, ys, P, v: 'F', j }); }
  if (lvl === 2) return num(`X og Y hafa samþéttleikafallið${tab}Reiknið samdreifnina ${M('\\mathrm{Cov}[X, Y]')}.`, cov, 0.0005, '',
    calc(`f_X = (${fX.map(t => F.m(t)).join(', ')}), \\quad f_Y = (${fY.map(t => F.m(t)).join(', ')})`, `E[X] = ${F.m(EX)}, \\quad E[Y] = ${F.m(EY)}`, `E[XY] = \\sum_x\\sum_y xy\\,f(x,y) = ${F.m(EXY)}`, `\\mathrm{Cov}[X,Y] = E[XY] - E[X]E[Y] = ${F.m(EXY)} - ${F.m(EX)} \\cdot ${F.m(EY)} = ${F.m(cov)}`) +
    trap(`${F.s(EXY)} er E[XY]; samdreifnin er E[XY] − E[X]E[Y].`), { xs, ys, P });
  const VX = xs.reduce((s, x, i) => s + x * x * fX[i], 0) - EX * EX, VY = ys.reduce((s, y, j) => s + y * y * fY[j], 0) - EY * EY;
  if (VX < 1e-9 || VY < 1e-9) return this.f(3);
  if (Math.random() < 0.5) { const rho = cov / Math.sqrt(VX * VY);
    return num(`X og Y hafa samþéttleikafallið${tab}Reiknið fylgnina ${M('\\rho = \\mathrm{Corr}[X, Y]')}.`, rho, 0.001, '',
      calc(`E[X] = ${F.m(EX)}, \\; E[Y] = ${F.m(EY)}, \\; E[XY] = ${F.m(EXY)}`, `\\mathrm{Cov} = ${F.m(cov)}`, `\\mathrm{Var}[X] = ${F.m(VX)}, \\; \\mathrm{Var}[Y] = ${F.m(VY)}`, `\\rho = \\frac{${F.m(cov)}}{\\sqrt{${F.m(VX)} \\cdot ${F.m(VY)}}} = ${F.m(rho)}`) +
      trap('Fylgni er alltaf á [−1, 1]; tala utan þess bendir á að dreifni hafi verið ruglað við staðalfrávik.') + note('Fylgni 0 þýðir ekki óhæði (glæra 69 í 06 segir það ranglega).'), { xs, ys, P, v: 'rho' }); }
  const i = R.ri(0, 1); const ce = ys.reduce((s, y, j) => s + y * P[i][j], 0) / fX[i];
  return num(`X og Y hafa samþéttleikafallið${tab}Reiknið skilyrta væntigildið ${M(`E[Y \\mid X = ${xs[i]}]`)}.`, ce, 0.0005, '',
    calc(`f_X(${xs[i]}) = ${P[i].map(t => F.m(t)).join(' + ')} = ${F.m(fX[i])}`, `f_{Y|X}(y \\mid ${xs[i]}) = \\frac{f(${xs[i]}, y)}{${F.m(fX[i])}} = (${P[i].map(t => F.m(t / fX[i])).join(', ')})`, `E[Y \\mid X = ${xs[i]}] = ${ys.map((y, j) => `${y} \\cdot ${F.m(P[i][j] / fX[i])}`).join(' + ')} = ${F.m(ce)}`) +
    trap(`Að deila ekki með f<sub>X</sub>(${xs[i]}) gefur ${F.s(ce * fX[i])}; skilyrt líkur verða að summast í 1.`), { xs, ys, P, v: 'ce', i });
} });

GENS.push({ id: 'g-varsum', lec: 'L06', name: 'Dreifni summu með samdreifni', f(lvl) {
  const sx = R.ri(2, 12), sy = R.ri(2, 12), rho = R.pick([-0.8, -0.6, -0.5, -0.3, 0.2, 0.4, 0.5, 0.7, 0.9]); const cov = rho * sx * sy;
  if (lvl === 1) { const ans = sx * sx + sy * sy + 2 * cov;
    return num(`${M(`\\mathrm{Var}[X] = ${sx * sx}`)}, ${M(`\\mathrm{Var}[Y] = ${sy * sy}`)} og ${M(`\\mathrm{Cov}[X,Y] = ${F.m(cov, 2)}`)}. Hvert er ${M('\\mathrm{Var}[X + Y]')}?`, ans, 0.001, '',
      calc(`\\mathrm{Var}[X+Y] = \\mathrm{Var}[X] + \\mathrm{Var}[Y] + 2\\,\\mathrm{Cov}[X,Y]`, `= ${sx * sx} + ${sy * sy} + 2 \\cdot (${F.m(cov, 2)}) = ${F.m(ans, 2)}`) + trap(`${sx * sx + sy * sy} sleppir samdreifninni (gildir aðeins fyrir óháðar breytur).`), { sx, sy, cov }); }
  if (lvl === 2) { const a = R.ri(1, 4), b = R.ri(1, 4); const V = a * a * sx * sx + b * b * sy * sy - 2 * a * b * cov; const ans = Math.sqrt(V);
    return num(`SD[X] = ${sx}, SD[Y] = ${sy} og fylgnin er ${M(`\\rho = ${F.m(rho)}`)}. Hvert er staðalfrávik ${M(`${a}X - ${b}Y`)}?`, ans, 0.001, '',
      calc(`\\mathrm{Cov}[X,Y] = \\rho\\,\\sigma_X\\sigma_Y = ${F.m(rho)} \\cdot ${sx} \\cdot ${sy} = ${F.m(cov, 2)}`, `\\mathrm{Var}[${a}X - ${b}Y] = ${a}^2 \\cdot ${sx * sx} + ${b}^2 \\cdot ${sy * sy} - 2 \\cdot ${a} \\cdot ${b} \\cdot (${F.m(cov, 2)}) = ${F.m(V, 2)}`, `SD = \\sqrt{${F.m(V, 2)}} = ${F.m(ans)}`) +
      trap(`Með +2ab·Cov fæst ${F.s(Math.sqrt(Math.max(0, a * a * sx * sx + b * b * sy * sy + 2 * a * b * cov)), 3)}: mínusinn á Y snýr formerki samdreifniliðarins.`), { sx, sy, rho, a, b }); }
  const Vp = sx * sx + sy * sy + 2 * cov, Vm = sx * sx + sy * sy - 2 * cov; const ans = (Vp - Vm) / 4;
  return num(`${M(`\\mathrm{Var}[X + Y] = ${F.m(Vp, 2)}`)} og ${M(`\\mathrm{Var}[X - Y] = ${F.m(Vm, 2)}`)}. Hvert er ${M('\\mathrm{Cov}[X, Y]')}?`, ans, 0.001, '',
    calc(`\\mathrm{Var}[X+Y] - \\mathrm{Var}[X-Y] = 4\\,\\mathrm{Cov}[X,Y]`, `\\mathrm{Cov} = \\frac{${F.m(Vp, 2)} - ${F.m(Vm, 2)}}{4} = ${F.m(ans, 3)}`) + trap(`Að deila með 2 gefur ${F.s((Vp - Vm) / 2, 3)}: liðurinn kemur fyrir með +2 og −2, munurinn er 4·Cov.`), { Vp, Vm });
} });

GENS.push({ id: 'g-iter', lec: 'L06', name: 'Endurteknar væntingar', f(lvl) {
  if (lvl === 1) { const p = R.ri(1, 9) / 10, m1 = R.ri(20, 60) / 10, m0 = R.ri(20, 60) / 10; const ans = p * m1 + (1 - p) * m0;
    return num(`${F.pct(p, 0)} nemenda eru hagfræðinemar (Y = 1) með meðaleinkunn ${F.s(m1)}; hinir (Y = 0) hafa meðaleinkunn ${F.s(m0)}. Hvert er ${M('E[X]')}, meðaleinkunn allra?`, ans, 0.001, '',
      calc(`E[X] = E[E[X\\mid Y]] = \\Pr(Y=1)E[X\\mid Y=1] + \\Pr(Y=0)E[X\\mid Y=0]`, `= ${F.m(p)} \\cdot ${F.m(m1)} + ${F.m(1 - p)} \\cdot ${F.m(m0)} = ${F.m(ans)}`) + trap(`(${F.s(m1)} + ${F.s(m0)})/2 = ${F.s((m1 + m0) / 2)} vegur hópana jafnt.`), { p, m1, m0 }); }
  if (lvl === 2) { let a, b; const mk = () => { let w; do { w = [R.ri(1, 8), R.ri(1, 8), R.ri(1, 8)]; } while (w[0] + w[1] + w[2] !== 10); return w.map(t => t / 10); }; a = mk(); b = mk(); const n1 = R.ri(10, 40), n0 = R.ri(10, 40);
    const p1 = n1 / (n1 + n0); const e1 = a[0] + 2 * a[1] + 3 * a[2], e0 = b[0] + 2 * b[1] + 3 * b[2]; const ans = p1 * e1 + (1 - p1) * e0;
    return num(`Í stofu eru ${n1} hagfræðinemar og ${n0} viðskiptafræðinemar. Einkunnirnar 1, 2, 3 fást með líkum ${a.map(t => F.dec(t, 1)).join(', ')} hjá hagfræðinemum og ${b.map(t => F.dec(t, 1)).join(', ')} hjá viðskiptafræðinemum. Hver er væntanleg einkunn nemanda sem valinn er af handahófi?`, ans, 0.001, '',
      calc(`E[X\\mid Y=1] = 1 \\cdot ${F.m(a[0])} + 2 \\cdot ${F.m(a[1])} + 3 \\cdot ${F.m(a[2])} = ${F.m(e1)}`, `E[X\\mid Y=0] = 1 \\cdot ${F.m(b[0])} + 2 \\cdot ${F.m(b[1])} + 3 \\cdot ${F.m(b[2])} = ${F.m(e0)}`, `E[X] = \\frac{${n1}}{${n1 + n0}} \\cdot ${F.m(e1)} + \\frac{${n0}}{${n1 + n0}} \\cdot ${F.m(e0)} = ${F.m(ans)}`) +
      note('Sama dæmi og á glærum 06 (gl. 91–95), þar sem E[X] = 2,38.') + trap(`Meðaltal skilyrtu væntigildanna, ${F.s((e1 + e0) / 2)}, vegur hópana jafnt þótt þeir séu misstórir.`), { n1, n0, a, b }); }
  let pr; do { pr = [R.ri(1, 8), R.ri(1, 8), R.ri(1, 8)]; } while (pr[0] + pr[1] + pr[2] !== 10); pr = pr.map(t => t / 10); const lam = R.sample([0.5, 1, 1.5, 2, 3, 4], 3).sort((x, y) => x - y);
  const ans = pr.reduce((s, p, i) => s + p * Math.exp(-lam[i]), 0);
  return pnum(`Ástand hagkerfisins Y er slæmt, miðlungs eða gott með líkum ${pr.map(t => F.dec(t, 1)).join(', ')}. Að gefnu ástandi er fjöldi gjaldþrota á dag Poisson-dreifður með λ = ${lam.map(l => F.s(l)).join(', ')} í sömu röð. Hverjar eru líkurnar á að <b>ekkert</b> gjaldþrot verði á tilteknum degi?`, ans, 0.0005,
    calc(`\\Pr(X = 0) = \\sum_y \\Pr(Y = y)\\Pr(X = 0 \\mid Y = y) = \\sum_y \\Pr(Y=y)\\,e^{-\\lambda_y}`, `= ${pr.map((p, i) => `${F.m(p)} \\cdot e^{-${F.m(lam[i])}}`).join(' + ')} = ${F.m(ans)}`) +
    note(`Endurteknar væntingar gefa líka E[X] = ${pr.map((p, i) => F.s(p) + '·' + F.s(lam[i])).join(' + ')} = ${F.s(pr.reduce((s, p, i) => s + p * lam[i], 0))}.`) +
    trap(`e<sup>−E[λ]</sup> = ${F.dec(Math.exp(-pr.reduce((s, p, i) => s + p * lam[i], 0)), 4)} setur meðaltalið inn í fallið; vegna ójöfnu Jensens er það ekki það sama.`), { pr, lam });
} });

// ================= L07 · Úrtök og höfuðmarkgildissetningin =================
GENS.push({ id: 'g-xbar', lec: 'L07', name: 'X̄ og S² úr litlu úrtaki', f(lvl) {
  const n = R.ri(3, 6); const x = rng(1, n).map(() => R.ri(1, 9)); if (new Set(x).size === 1) x[0] = x[0] % 9 + 1;
  const m = PROB.mean(x), s2 = PROB.varS(x), ss = x.reduce((s, t) => s + (t - m) ** 2, 0);
  if (lvl === 1) return num(`Úrtak: ${x.join(', ')}. Hvert er úrtaksmeðaltalið ${M('\\bar{X}')}?`, m, 0.005, '', calc(`\\bar{X} = \\frac{${x.join(' + ')}}{${n}} = \\frac{${x.reduce((s, t) => s + t, 0)}}{${n}} = ${F.m(m, 3)}`) + trap('Miðgildið er ekki það sama og meðaltalið.'), { x });
  if (lvl === 2) return num(`Úrtak: ${x.join(', ')}. Hver er úrtaksdreifnin ${M('S^2')}?`, s2, 0.005, '',
    calc(`\\bar{X} = ${F.m(m, 4)}`, `\\sum (X_i - \\bar{X})^2 = ${x.map(t => `(${t} - ${F.m(m, 2)})^2`).join(' + ')} = ${F.m(ss, 4)}`, `S^2 = \\frac{${F.m(ss, 4)}}{${n} - 1} = ${F.m(s2, 4)}`) +
    note('Eins og teningaúrtakið 5, 3, 6 á glæru 45 í 07 (S² = 2,33). <code>var()</code> í R deilir líka með n − 1.') + trap(`Að deila með n = ${n} gefur ${F.s(ss / n, 3)}.`), { x });
  const sx = x.reduce((s, t) => s + t, 0), sx2 = x.reduce((s, t) => s + t * t, 0);
  return num(`Úrtak af stærð n = ${n} gefur ${M(`\\sum X_i = ${sx}`)} og ${M(`\\sum X_i^2 = ${sx2}`)}. Hver er úrtaksdreifnin ${M('S^2')}?`, s2, 0.005, '',
    calc(`\\sum (X_i - \\bar{X})^2 = \\sum X_i^2 - n\\bar{X}^2`, `\\bar{X} = ${sx}/${n} = ${F.m(m, 4)}`, `\\sum (X_i - \\bar{X})^2 = ${sx2} - ${n} \\cdot ${F.m(m, 4)}^2 = ${F.m(ss, 4)}`, `S^2 = \\frac{${F.m(ss, 4)}}{${n - 1}} = ${F.m(s2, 4)}`) +
    note('Hjálparjafnan er notuð í sönnuninni á E[S²] = σ² (glæra 37 í 07).') + trap(`${F.s(sx2 / n - m * m, 3)} = ΣX²/n − X̄² deilir með n, ekki n − 1.`), { x, sx, sx2 });
} });

GENS.push({ id: 'g-clt', lec: 'L07', name: 'Dreifing X̄ og höfuðmarkgildissetningin', f(lvl) {
  if (lvl === 1) { const s = R.ri(2, 30), n = R.pick([4, 9, 16, 25, 36, 49, 64, 100]); const ans = s / Math.sqrt(n);
    return num(`Þýði hefur staðalfrávik σ = ${s}. Hvert er staðalfrávik úrtaksmeðaltalsins ${M('\\bar{X}')} fyrir slembiúrtak af stærð n = ${n}?`, ans, 0.0005, '',
      calc(`\\mathrm{Var}[\\bar{X}] = \\frac{\\sigma^2}{n} \\Rightarrow SD[\\bar{X}] = \\frac{\\sigma}{\\sqrt{n}} = \\frac{${s}}{\\sqrt{${n}}} = ${F.m(ans)}`) + trap(`σ/n = ${F.s(s / n)} gleymir rótinni; σ²/n = ${F.s(s * s / n)} er dreifnin.`), { s, n }); }
  if (lvl === 2) { const mu = R.ri(50, 150), s = R.ri(5, 30), n = R.ri(9, 40); const se = s / Math.sqrt(n); const c = mu + R.ri(3, 25) / 10 * se * R.pick([-1, 1]); const zz = (c - mu) / se; const ex = 1 - PROB.pnorm(zz), tb = 1 - PROB.tabPhi(zz);
    return pnum(`Þýðið er normaldreift með μ = ${mu} og σ = ${s}. Tekið er slembiúrtak af stærð ${n}. Hverjar eru líkurnar á að ${M('\\bar{X} > ' + F.m(c, 2))}? ${hint(TABNOTE)}`, ex, nTol(ex, tb),
      calc(`\\bar{X} \\sim N\\left(${mu}, \\frac{${s}^2}{${n}}\\right), \\quad SD[\\bar{X}] = ${F.m(se, 4)}`, `Z = \\frac{${F.m(c, 2)} - ${mu}}{${F.m(se, 4)}} = ${F.m(zz, 2)}`, `\\Pr = 1 - \\Phi(${F.m(zz, 2)}) = ${F.m(tb)}`, `§nákvæmt: ${F.dec(ex, 4)}`) +
      trap(`Að nota σ = ${s} í stað σ/√n gefur Z = ${F.dec((c - mu) / s, 3)}: það eru líkurnar fyrir eina mælingu, ekki meðaltal.`), { mu, s, n, c }); }
  const kind = R.pick(['exp', 'pois']); const n = R.pick([50, 64, 80, 100, 150]);
  const mu = kind === 'exp' ? R.pick([2, 2.5, 4, 5]) : R.pick([2, 3, 4, 6]); const sd = kind === 'exp' ? mu : Math.sqrt(mu); const se = sd / Math.sqrt(n);
  const c = Math.round((mu + R.ri(5, 20) / 10 * se) * 100) / 100; const zz = (c - mu) / se; const ex = 1 - PROB.pnorm(zz), tb = 1 - PROB.tabPhi(zz);
  const desc = kind === 'exp' ? `veldisdreifð með meðaltal ${F.s(mu)} (λ = ${F.s(1 / mu)})` : `Poisson-dreifð með λ = ${mu}`;
  return pnum(`Hver mæling er ${desc}. Tekið er slembiúrtak af stærð n = ${n}. Notið höfuðmarkgildissetninguna til að finna ${M(`\\Pr(\\bar{X} > ${F.m(c)})`)}. ${hint(TABNOTE)}`, ex, nTol(ex, tb),
    calc(kind === 'exp' ? `E[X] = 1/\\lambda = ${F.m(mu)}, \\quad \\mathrm{Var}[X] = 1/\\lambda^2 = ${F.m(mu * mu)}` : `E[X] = \\mathrm{Var}[X] = \\lambda = ${mu}`, `\\bar{X} \\approx N\\left(${F.m(mu)}, \\frac{${F.m(sd * sd)}}{${n}}\\right), \\quad SD[\\bar{X}] = ${F.m(se, 4)}`, `Z = \\frac{${F.m(c)} - ${F.m(mu)}}{${F.m(se, 4)}} = ${F.m(zz, 2)}`, `\\Pr \\approx 1 - \\Phi(${F.m(zz, 2)}) = ${F.m(tb)}`, `§nákvæmt Φ: ${F.dec(ex, 4)}`) +
    note('Höfuðmarkgildissetningin gildir óháð dreifingu þýðisins (aðeins þarf Var[X] < ∞). Svarið er nálgun.') + trap(kind === 'exp' ? `Dreifni veldisdreifingar er 1/λ² = ${F.s(mu * mu)}, ekki 1/λ.` : `Dreifni Poisson er λ, svo SD = √λ, ekki λ.`), { kind, mu, n, c });
} });

GENS.push({ id: 'g-zprop', lec: 'L07', name: 'z fyrir hlutfall', f(lvl) {
  const p0 = R.pick([0.1, 0.2, 0.25, 0.3, 0.4, 0.5, 0.6]), n = R.pick([100, 200, 400, 500, 1000]); const se = Math.sqrt(p0 * (1 - p0) / n);
  if (lvl === 1) return num(`Ef hlutfallið í þýðinu er p = ${F.dec(p0, 2)}, hvert er staðalfrávik ${M('\\hat{p}')} í slembiúrtaki af stærð ${n}?`, se, 0.00005, '',
    calc(`SD[\\hat{p}] = \\sqrt{\\frac{p(1-p)}{n}} = \\sqrt{\\frac{${F.m(p0)} \\cdot ${F.m(1 - p0)}}{${n}}} = ${F.m(se, 5)}`) + trap(`p(1 − p)/n = ${F.dec(p0 * (1 - p0) / n, 6)} er dreifnin.`), { p0, n });
  let ph; do { ph = Math.round((p0 + R.ri(-30, 30) / 10 * se) * n) / n; } while (ph === p0); const z = (ph - p0) / se;
  if (lvl === 2) return num(`Í úrtaki af stærð ${n} er hlutfallið ${M(`\\hat{p} = ${F.m(ph, 3)}`)}. Reiknið prófstærðina z miðað við p = ${F.dec(p0, 2)}.`, z, 0.01, '',
    calc(`z = \\frac{\\hat{p} - p}{\\sqrt{p(1-p)/n}} = \\frac{${F.m(ph, 3)} - ${F.m(p0)}}{${F.m(se, 5)}} = ${F.m(z, 3)}`) + note('Eins og p̂ = 0,64, n = 1000 á glæru 95 í 07 (z = 8,85).') + trap(`Að nota p̂ í nefnaranum gefur ${F.dec((ph - p0) / Math.sqrt(ph * (1 - ph) / n), 3)}; glærurnar nota p úr tilgátunni.`), { p0, n, ph });
  const up = ph >= p0; const ex = up ? 1 - PROB.pnorm(z) : PROB.pnorm(z), tb = up ? 1 - PROB.tabPhi(z) : PROB.tabPhi(z);
  return pnum(`Gefum okkur að hlutfallið í þýðinu sé p = ${F.dec(p0, 2)}. Hverjar eru líkurnar á að fá hlutfall ${up ? 'jafnt eða hærra en' : 'jafnt eða lægra en'} ${M(`\\hat{p} = ${F.m(ph, 3)}`)} í úrtaki af stærð ${n}? (Einhliða; notið höfuðmarkgildissetninguna.) ${hint(TABNOTE)}`, ex, nTol(ex, tb),
    calc(`z = \\frac{${F.m(ph, 3)} - ${F.m(p0)}}{${F.m(se, 5)}} = ${F.m(z, 2)}`, up ? `\\Pr(\\hat{p} \\ge ${F.m(ph, 3)}) \\approx 1 - \\Phi(${F.m(z, 2)}) = ${F.m(tb)}` : `\\Pr(\\hat{p} \\le ${F.m(ph, 3)}) \\approx \\Phi(${F.m(z, 2)}) = ${F.m(tb)}`, `§nákvæmt Φ: ${F.dec(ex, 4)}`) +
    trap(`Tvíhliða líkur (${F.dec(2 * Math.min(ex, 1 - ex), 4)}) svara annarri spurningu; hér er spurt einhliða.`), { p0, n, ph, up });
} });

GENS.push({ id: 'g-tstat', lec: 'L07', name: 't-prófstærð', f(lvl) {
  if (lvl < 3) {
    let n, xb, s, mu0, x;
    if (lvl === 1) { n = R.ri(5, 30); mu0 = R.ri(20, 120); s = R.ri(2, 20); xb = mu0 + R.ri(-30, 30) / 10 * s / Math.sqrt(n); xb = Math.round(xb * 100) / 100; }
    else { n = R.ri(4, 7); x = rng(1, n).map(() => R.ri(10, 30)); xb = PROB.mean(x); s = PROB.sdS(x); mu0 = Math.round(xb) + R.pick([-3, -2, 2, 3]); if (s === 0) return this.f(lvl); }
    const t = (xb - mu0) / (s / Math.sqrt(n));
    if (lvl === 1) return num(`Úrtak af stærð n = ${n} gefur ${M(`\\bar{x} = ${F.m(xb, 2)}`)} og s = ${s}. Reiknið t-prófstærðina miðað við μ = ${mu0}.`, t, 0.01, '',
      calc(`t = \\frac{\\bar{x} - \\mu}{s/\\sqrt{n}} = \\frac{${F.m(xb, 2)} - ${mu0}}{${s}/\\sqrt{${n}}} = ${F.m(t, 3)}`) + note(`Prófstærðin er t-dreifð með n − 1 = ${n - 1} frígráðum ef þýðið er normaldreift.`) + trap(`Að deila með s (${F.dec((xb - mu0) / s, 3)}) eða s² gleymir √n eða ruglar dreifni og staðalfráviki.`), { n, xb, s, mu0 });
    return num(`Úrtak: ${x.join(', ')}. Reiknið t-prófstærðina miðað við μ = ${mu0} (þýðið normaldreift, σ óþekkt).`, t, 0.01, '',
      calc(`\\bar{x} = ${F.m(xb, 4)}`, `s^2 = \\frac{\\sum (x_i - \\bar{x})^2}{${n - 1}} = ${F.m(s * s, 4)}, \\quad s = ${F.m(s, 4)}`, `t = \\frac{${F.m(xb, 4)} - ${mu0}}{${F.m(s, 4)}/\\sqrt{${n}}} = ${F.m(t, 3)}`) +
      trap(`Með s reiknað með n í nefnara fæst ${F.dec((xb - mu0) / (Math.sqrt(s * s * (n - 1) / n) / Math.sqrt(n)), 3)}.`), { x, mu0 });
  }
  const n = R.ri(6, 16), t = -R.ri(150, 280) / 100; const pT = PROB.pt(t, n - 1), pZ = PROB.pnorm(t);
  const o = [pT, 2 * pT, pZ, PROB.pt(t, n), 1 - pT];
  return mcx(`Úrtak af stærð n = ${n} úr normaldreifðu þýði (σ óþekkt) gefur t = ${F.dec(t, 2)}. Hverjar eru <b>einhliða</b> líkurnar á svo lágri prófstærð, ${M(`\\Pr(T \\le ${F.m(t, 2)})`)}?`, pT,
    [[2 * pT, 'Tvíhliða líkur; spurt er einhliða.'], [pZ, 'Notar N(0, 1) í stað t-dreifingar; þegar σ er metið með S er stærðin t-dreifð.'], [PROB.pt(t, n), `Notar n = ${n} frígráður í stað n − 1 = ${n - 1}.`], [1 - pT, 'Efri halinn.']], fp, pertP(0.003),
    calc(`T \\sim t_{${n - 1}}`, `\\Pr(T \\le ${F.m(t, 2)}) = ${F.m(pT)}`, `§R: <code>pt(${String(t)}, ${n - 1})</code>`) +
    unconf('Glærur 07 (gl. 63 og 69) gefa 0,042 og 0,056 fyrir z = −2,12 og t₉ = −2,06; einhliða gildin eru 0,017 og 0,035. Hvort kennarinn ætlast til einhliða eða tvíhliða er óljóst; spurðu kennarann. Hér er alltaf tekið fram hvort er spurt um.'), { n, t });
} });


// ================= L08 · Metlar og punktamat =================
const mean = a => a.reduce((s, x) => s + x, 0) / a.length;
const var1 = a => { const m = mean(a); return a.reduce((s, x) => s + (x - m) ** 2, 0) / (a.length - 1); };
const fmtv = a => a.map(x => F.s(x, 3)).join('; ');
const rx3 = v => String(+v.toFixed(3));        // R-tala með punkti

GENS.push({ id: 'g-mom', lec: 'L08', name: 'Vægjaaðferðin', f(lvl) {
  if (lvl === 1) {
    if (Math.random() < 0.5) { const xb = R.ri(15, 150) / 10; const ans = 2 * xb;
      return num(`X er jafndreifð á ${M('[0, \\beta]')} þar sem β er óþekkt. Úrtak gefur ${M(`\\bar{x} = ${F.m(xb)}`)}. Metið β með vægjaaðferðinni.`, ans, 0.001, '',
        calc(`E[X] = \\frac{0 + \\beta}{2}`, `\\bar{x} = \\frac{\\hat\\beta}{2} \\Rightarrow \\hat\\beta = 2 \\cdot ${F.m(xb)} = ${F.m(ans)}`) + note('Sama og dæmið á glæru 29 í 08 (x̄ = 5 gefur β̂ = 10).') + trap(`${F.s(xb)} er matið á E[X], ekki á β. Efri mörkin eru tvöfalt meðaltalið.`), { v: 'U', xb }); }
    const xb = R.ri(5, 120) / 10; const ans = 1 / xb;
    return num(`Biðtími X er veldisdreifður með óþekkt λ. Úrtak gefur ${M(`\\bar{x} = ${F.m(xb)}`)}. Metið λ með vægjaaðferðinni.`, ans, 0.0005, '',
      calc(`E[X] = \\frac{1}{\\lambda}`, `\\bar{x} = \\frac{1}{\\hat\\lambda} \\Rightarrow \\hat\\lambda = \\frac{1}{${F.m(xb)}} = ${F.m(ans)}`) + trap(`λ̂ = ${F.s(xb)} ruglar saman tíðni og meðalbið.`), { v: 'E', xb });
  }
  if (lvl === 2) {
    if (Math.random() < 0.5) { const a = R.ri(-5, 10), k = R.ri(1, 4), w = 6 * k, b = a + w; const xb = (a + b) / 2, s2 = w * w / 12; const which = R.pick(['a', 'b']); const d = Math.sqrt(3 * s2);
      const ans = which === 'a' ? xb - d : xb + d;
      return num(`X er jafndreifð á ${M('[\\alpha, \\beta]')} og báðir stikar eru óþekktir. Úrtak gefur ${M(`\\bar{x} = ${F.m(xb)}`)} og ${M(`s^2 = ${F.m(s2)}`)}. Metið ${which === 'a' ? 'α' : 'β'} með vægjaaðferðinni.`, ans, 0.001, '',
        calc(`\\frac{\\hat\\alpha + \\hat\\beta}{2} = ${F.m(xb)}, \\quad \\frac{(\\hat\\beta - \\hat\\alpha)^2}{12} = ${F.m(s2)}`, `\\hat\\beta - \\hat\\alpha = \\sqrt{12 \\cdot ${F.m(s2)}} = ${w}`, `\\hat\\alpha = ${F.m(xb)} - ${w / 2} = ${F.m(a)}, \\quad \\hat\\beta = ${F.m(xb)} + ${w / 2} = ${F.m(b)}`) +
        note('Lausnin með α̂ > β̂ er útilokuð. Glæra 31 í 08: x̄ = 8 og S² = 12 gefa α̂ = 2 og β̂ = 14.') + trap(`Að nota √(s²) = ${F.s(Math.sqrt(s2), 3)} sem hálfa breidd gleymir 12 í nefnaranum.`), { v: 'U2', xb, s2, which }); }
    let xb, s2; do { xb = R.ri(20, 120) / 10; s2 = R.ri(5, Math.floor(xb * 9)) / 10; } while (s2 >= xb * 0.9 || s2 <= xb * 0.1);
    const ans = 1 - s2 / xb;
    return pnum(`Fjöldi X er tvíkostadreifður, Bin(n, p), með n og p óþekkt. Úrtak gefur ${M(`\\bar{x} = ${F.m(xb)}`)} og ${M(`s^2 = ${F.m(s2)}`)}. Metið p með vægjaaðferðinni (án þess að námunda n).`, ans, 0.001,
      calc(`n p = ${F.m(xb)}, \\quad n p (1 - p) = ${F.m(s2)}`, `1 - \\hat p = \\frac{${F.m(s2)}}{${F.m(xb)}} \\Rightarrow \\hat p = 1 - ${F.m(s2 / xb)} = ${F.m(ans)}`, `\\hat n = \\frac{${F.m(xb)}}{${F.m(ans)}} = ${F.m(xb / ans, 3)}`) + note('Deilið seinni jöfnunni með þeirri fyrri; þá hverfur n. Sama aðferð og dæmablað 8, 1c.') + trap(`s²/x̄ = ${F.s(s2 / xb)} er matið á 1 − p, ekki á p.`), { v: 'B', xb, s2 });
  }
  // stig 3: gögn → x̄ og S² → p̂0 → n̂ námundað → p̂ = x̄/n̂
  let k, xb, s2, p0, n0; do { const n = R.ri(5, 14), p = R.ri(50, 85) / 100; k = Array.from({ length: 10 }, () => { let c = 0; for (let i = 0; i < n; i++) c += Math.random() < p ? 1 : 0; return c; });
    xb = mean(k); s2 = var1(k); p0 = 1 - s2 / xb; n0 = xb / p0; } while (!(s2 > 0 && s2 < xb && n0 <= 40 && Math.round(n0) >= Math.max(...k) && Math.abs(n0 - Math.floor(n0) - 0.5) > 0.06));
  const nh = Math.round(n0), ans = xb / nh;
  return pnum(`Fjöldi vina sem mætir í kaffi er skráður tíu sinnum: ${k.join(', ')}. Gerið ráð fyrir Bin(n, p). Metið n og p með vægjaaðferðinni (notið ${M('S^2')}), námundið n að næstu heiltölu og gefið upp matið á p miðað við námundaða n.`, ans, 0.001,
    calc(`\\bar{x} = ${F.m(xb, 3)}, \\quad S^2 = ${F.m(s2, 4)}`, `\\hat p_0 = 1 - \\frac{S^2}{\\bar{x}} = ${F.m(p0, 4)}`, `\\hat n = \\frac{\\bar{x}}{\\hat p_0} = ${F.m(n0, 3)} \\approx ${nh}`, `\\hat p = \\frac{\\bar{x}}{\\hat n} = \\frac{${F.m(xb, 3)}}{${nh}} = ${F.m(ans, 4)}`) +
    note('Sama uppsetning og dæmablað 8, dæmi 1. Engin opinber lausn er til; að nota dreifni með n í nefnara (1/n) gefur annað n.') + trap(`p̂₀ = ${F.s(p0, 4)} er matið áður en n er námundað; spurt er um p eftir námundun.`), { v: 'B3', k });
} });

GENS.push({ id: 'g-mle', lec: 'L08', name: 'Sennileikamat', f(lvl) {
  if (lvl === 1) {
    const n = R.ri(5, 9);
    if (Math.random() < 0.5) { const x = Array.from({ length: n }, () => R.ri(1, 12)); const S = x.reduce((a, b) => a + b, 0); const ans = n / S;
      return num(`Biðtímar (dagar) eru veldisdreifðir: ${x.join(', ')}. Hvert er sennileikamatið á λ?`, ans, 0.0005, '',
        calc(`\\ell(\\lambda) = n \\log\\lambda - \\lambda \\sum x_i`, `\\frac{d\\ell}{d\\lambda} = \\frac{n}{\\lambda} - \\sum x_i = 0 \\Rightarrow \\hat\\lambda = \\frac{n}{\\sum x_i} = \\frac{${n}}{${S}} = ${F.m(ans)}`) + note('λ̂ = 1/x̄, sama og vægjaaðferðin gefur hér. Dæmablað 8, 2c.') + trap(`x̄ = ${F.s(S / n, 3)} metur meðalbiðina 1/λ, ekki λ.`), { v: 'E', x }); }
    const x = Array.from({ length: n }, () => R.ri(0, 8)); const ans = mean(x);
    return num(`Fjöldi tjóna á dag er Poisson-dreifður og síðustu ${n} dagar gáfu ${x.join(', ')}. Hvert er sennileikamatið á λ?`, ans, 0.0005, '',
      calc(`\\ell(\\lambda) = -n\\lambda + \\left(\\sum x_i\\right)\\log\\lambda - \\sum \\log(x_i!)`, `\\frac{d\\ell}{d\\lambda} = -n + \\frac{\\sum x_i}{\\lambda} = 0 \\Rightarrow \\hat\\lambda = \\bar{x} = ${F.m(ans, 4)}`) + trap('Síðasti liðurinn inniheldur ekki λ og hverfur við diffrun.'), { v: 'P', x });
  }
  if (lvl === 2) {
    if (Math.random() < 0.5) { const b = R.ri(5, 20); const x = Array.from({ length: R.ri(6, 10) }, () => Math.round(Math.random() * b * 100) / 100); const ans = Math.max(...x);
      return num(`X er jafndreifð á ${M('[0, \\beta]')}. Úrtakið er ${fmtv(x)}. Hvert er sennileikamatið á β?`, ans, 0.0005, '',
        calc(`L(\\beta) = \\frac{1}{\\beta^{n}} \\;\\text{ef}\\; \\beta \\ge \\max x_i`, `\\hat\\beta = \\max x_i = ${F.m(ans)}`) + note('L(β) minnkar í β, en β má ekki vera minna en stærsta gildið (þá væru líkurnar 0). Glæra 47 í 08.') + trap(`Vægjaaðferðin gefur 2x̄ = ${F.s(2 * mean(x), 3)}; spurt er um sennileikamat.`), { v: 'U', x }); }
    const x = Array.from({ length: R.ri(5, 8) }, () => R.ri(-20, 40) / 10); const m = mean(x); const ans = x.reduce((s, v) => s + (v - m) ** 2, 0) / x.length;
    return num(`Úrtak úr normaldreifingu: ${fmtv(x)}. Hvert er sennileikamatið á ${M('\\sigma^2')}?`, ans, 0.001, '',
      calc(`\\hat\\mu = \\bar{x} = ${F.m(m, 4)}`, `\\hat\\sigma^2 = \\frac{1}{n}\\sum (x_i - \\bar{x})^2 = ${F.m(ans, 4)}`) + note(`Sennileikamatið deilir með n og er bjagað; S² = ${F.s(var1(x), 4)} deilir með n − 1.`) + slideErr('Á glæru 54 í 08 stendur σ̂² = 1,647 fyrir gögnin á glæru 50; rétt er 2,099 (og S² = 2,332).') + trap(`S² = ${F.s(var1(x), 4)} er óbjagaða matið, ekki sennileikamatið.`), { v: 'N', x });
  }
  if (Math.random() < 0.5) { const n = R.ri(5, 20), lam = R.pick([0.1, 0.2, 0.25, 0.5, 1, 2]); const e = n * lam / (n - 1), ans = e - lam;
    return num(`X<sub>1</sub>, …, X<sub>${n}</sub> eru óháðar og Exp(λ = ${F.s(lam)}). Sennileikametillinn er ${M('\\hat\\lambda = n / \\sum X_i')} og ${M('E[1/\\sum X_i] = \\lambda/(n-1)')}. Hver er bjagi ${M('\\hat\\lambda')}?`, ans, 0.0005, '',
      calc(`E[\\hat\\lambda] = n \\cdot \\frac{\\lambda}{n - 1} = \\frac{${n} \\cdot ${F.m(lam)}}{${n - 1}} = ${F.m(e, 4)}`, `B(\\hat\\lambda) = E[\\hat\\lambda] - \\lambda = ${F.m(e, 4)} - ${F.m(lam)} = ${F.m(ans, 4)}`) + note('Bjaginn er jákvæður en hverfur þegar n → ∞. Dæmablað 8, 2d.') + trap('E[1/ΣX] ≠ 1/E[ΣX]; Jensen.'), { v: 'Eb', n, lam }); }
  const n = R.ri(5, 20), a = R.ri(0, 5), b = a + R.ri(4, 20); const e = (n * b + a) / (n + 1), ans = e - b;
  return num(`X er jafndreifð á [${a}, ${b}] og β̂ = max(X<sub>1</sub>, …, X<sub>${n}</sub>) er sennileikametillinn fyrir β. Hver er bjagi β̂?`, ans, 0.0005, '',
    calc(`E[\\hat\\beta] = \\frac{n\\beta + \\alpha}{n + 1} = \\frac{${n} \\cdot ${b} + ${a}}{${n + 1}} = ${F.m(e, 4)}`, `B(\\hat\\beta) = ${F.m(e, 4)} - ${b} = -\\frac{\\beta - \\alpha}{n + 1} = ${F.m(ans, 4)}`) + note('Glæra 81 í 08. Hámarkið er alltaf undir β, svo bjaginn er neikvæður.') + trap('Vægjametillinn 2X̄ (þegar α = 0) er óbjagaður, en hefur stærri dreifni.'), { v: 'Ub', n, a, b });
} });

GENS.push({ id: 'g-bias', lec: 'L08', name: 'Bjagi og meðalferskekkja', f(lvl) {
  const mu = R.ri(2, 30), sig = R.ri(2, 10), n = R.ri(4, 30);
  const c = R.pick([0.8, 0.9, 1.1, 1.2, +(n / (n + 1)).toFixed(4)]);
  if (lvl === 1) { const ans = (c - 1) * mu;
    return num(`Metillinn ${M(`\\hat\\theta = ${F.m(c)}\\,\\bar{X}`)} er notaður fyrir ${M('\\mu = E[X]')}. Ef μ = ${mu}, hver er bjagi metilsins?`, ans, 0.001, '',
      calc(`E[\\hat\\theta] = ${F.m(c)} \\cdot E[\\bar{X}] = ${F.m(c)} \\cdot ${mu} = ${F.m(c * mu)}`, `B = E[\\hat\\theta] - \\mu = ${F.m(c * mu)} - ${mu} = ${F.m(ans)}`) + trap(`Formerkið skiptir máli: B = E[θ̂] − θ, ekki θ − E[θ̂] (= ${F.s(-ans)}).`), { v: 1, c, mu }); }
  if (lvl === 2) { const vr = c * c * sig * sig / n, b = (c - 1) * mu, ans = vr + b * b;
    return num(`X hefur ${M(`\\mu = ${mu}`)} og ${M(`\\sigma = ${sig}`)}. Metillinn ${M(`\\hat\\theta = ${F.m(c)}\\,\\bar{X}`)} er reiknaður úr úrtaki af stærð n = ${n}. Hver er meðalferskekkjan MSE?`, ans, 0.001, '',
      calc(`\\mathrm{Var}[\\hat\\theta] = ${F.m(c)}^2 \\cdot \\frac{${sig}^2}{${n}} = ${F.m(vr, 4)}`, `B = (${F.m(c)} - 1) \\cdot ${mu} = ${F.m(b)}`, `\\mathrm{MSE} = \\mathrm{Var} + B^2 = ${F.m(vr, 4)} + ${F.m(b * b, 4)} = ${F.m(ans, 4)}`) +
      note('MSE = E[(θ̂ − θ)²] = Var[θ̂] + B(θ̂)². Hún tekur bæði dreifni og bjaga með.') + trap(`Að gleyma bjaganum gefur ${F.s(vr, 4)}; að nota σ² í stað σ²/n gefur ${F.s(c * c * sig * sig + b * b, 4)}.`), { v: 2, c, mu, sig, n }); }
  const s2 = sig * sig; const v = ((n - 1) / n) ** 2 * 2 * s2 * s2 / (n - 1), b = -s2 / n, ans = v + b * b;
  return num(`Þýðið er normaldreift með ${M(`\\sigma^2 = ${s2}`)} og n = ${n}. Metillinn ${M('\\tilde S^2 = \\frac{1}{n}\\sum (X_i - \\bar X)^2')} er notaður fyrir σ². Hver er MSE fyrir ${M('\\tilde S^2')}? (Notið ${M('\\mathrm{Var}[S^2] = 2\\sigma^4/(n-1)')} úr fyrirlestri 07.)`, ans, Math.max(0.001, ans * 1e-4), '',
    calc(`\\tilde S^2 = \\frac{n-1}{n} S^2 \\Rightarrow E[\\tilde S^2] = \\frac{${n - 1}}{${n}} \\cdot ${s2} = ${F.m((n - 1) / n * s2, 4)}`, `B = -\\frac{\\sigma^2}{n} = ${F.m(b, 4)}`, `\\mathrm{Var}[\\tilde S^2] = \\left(\\frac{${n - 1}}{${n}}\\right)^2 \\frac{2 \\cdot ${s2}^2}{${n - 1}} = ${F.m(v, 4)}`, `\\mathrm{MSE} = ${F.m(v, 4)} + ${F.m(b * b, 4)} = ${F.m(ans, 4)}`) +
    note(`Til samanburðar: MSE[S²] = Var[S²] = ${F.s(2 * s2 * s2 / (n - 1), 4)}. Bjagaði metillinn hefur minni MSE, en S² er óbjagaður.`) + trap('Var[cY] = c²Var[Y]; að margfalda dreifnina með c en ekki c² er algeng villa.'), { v: 3, s2, n });
} });

GENS.push({ id: 'g-ols', lec: 'L08', name: 'Aðferð minnstu kvaðrata', f(lvl) {
  if (lvl === 1) { const xb = R.ri(10, 80) / 2, b = R.pick([-1, 1]) * R.ri(2, 30) / 10, yb = R.ri(20, 200); const ans = yb - b * xb;
    return num(`Í einfaldri línulegri aðhvarfsgreiningu ${M('y = \\alpha + \\beta x')} er ${M(`\\bar{x} = ${F.m(xb)}`)}, ${M(`\\bar{y} = ${yb}`)} og ${M(`\\hat\\beta = ${F.m(b)}`)}. Hvert er ${M('\\hat\\alpha')}?`, ans, 0.001, '',
      calc(`\\hat\\alpha = \\bar{y} - \\hat\\beta \\bar{x} = ${yb} - (${F.m(b)}) \\cdot ${F.m(xb)} = ${F.m(ans)}`) + note('Línan fer alltaf í gegnum (x̄, ȳ).') + trap(`ȳ + β̂x̄ = ${F.s(yb + b * xb)} snýr formerkinu við.`), { xb, b, yb }); }
  const n = lvl === 2 ? R.ri(4, 5) : R.ri(5, 6); let x, y, sxx;
  do { x = R.sample(rng(1, 12), n).sort((a, b) => a - b).map(v => v * R.pick([1, 5, 10])); x = [...new Set(x)]; } while (x.length < 4);
  const a0 = R.ri(20, 120), b0 = R.pick([-1, 1]) * R.ri(5, 30) / 10; y = x.map(v => Math.round(a0 + b0 * v + R.ri(-8, 8)));
  const xb = mean(x), yb = mean(y); sxx = x.reduce((s, v) => s + (v - xb) ** 2, 0); const sxy = x.reduce((s, v, i) => s + (v - xb) * (y[i] - yb), 0); const b = sxy / sxx, a = yb - b * xb;
  const tbl = `<div class="scroll"><table class="tt"><tbody><tr><th>x</th>${x.map(v => `<td>${v}</td>`).join('')}</tr><tr><th>y</th>${y.map(v => `<td>${v}</td>`).join('')}</tr></tbody></table></div>`;
  const steps = calc(`\\bar{x} = ${F.m(xb, 4)}, \\quad \\bar{y} = ${F.m(yb, 4)}`, `\\sum (x_i - \\bar{x})(y_i - \\bar{y}) = ${F.m(sxy, 4)}, \\quad \\sum (x_i - \\bar{x})^2 = ${F.m(sxx, 4)}`, `\\hat\\beta = \\frac{${F.m(sxy, 4)}}{${F.m(sxx, 4)}} = ${F.m(b, 4)}`, `\\hat\\alpha = \\bar{y} - \\hat\\beta\\bar{x} = ${F.m(a, 4)}`);
  if (lvl === 2) return num(`Metið hallatöluna ${M('\\beta')} í ${M('y = \\alpha + \\beta x + \\epsilon')} með aðferð minnstu kvaðrata.` + tbl, b, 0.001, '', steps + note('Formúlan á glæru 70 í 08. R: <code>coef(lm(y ~ x))</code>.') + trap(`Σ(x−x̄)² / Σ(x−x̄)(y−ȳ) = ${F.s(1 / b, 4)} er umhverfan.`), { x, y, q: 'b', rc: `x <- c(${x.join(', ')}); y <- c(${y.join(', ')}); cat(round(coef(lm(y ~ x))[2], 6))`, rx: String(+b.toFixed(6)) });
  const x0 = R.ri(Math.min(...x), Math.max(...x)); const ans = a + b * x0;
  return num(`Metið línuna ${M('y = \\alpha + \\beta x')} með aðferð minnstu kvaðrata og spáið fyrir um y þegar x = ${x0}.` + tbl, ans, 0.002, '', steps + calc(`\\hat{y} = ${F.m(a, 4)} + ${F.m(b, 4)} \\cdot ${x0} = ${F.m(ans, 4)}`) + note('R: <code>predict(lm(y ~ x), data.frame(x = …))</code>.') + trap('Spáin notar metnu stikana, ekki y-gildið í töflunni sjálfri.'), { x, y, q: 'p', x0 });
} });

// ================= L09 · Tilgátupróf og öryggisbil =================
const ZTAB = { 0.90: 1.645, 0.95: 1.96, 0.99: 2.58 };       // gildi á glæru 17 í 09
const t3 = (p, df) => Math.round(PROB.qt(p, df) * 1000) / 1000;   // t-tafla á 3 aukastöfum
const tailTxt = s => s === 'two' ? 'tvíhliða' : s === 'greater' ? 'einhliða, efri (H₁: μ > μ₀)' : 'einhliða, neðri (H₁: μ < μ₀)';

GENS.push({ id: 'g-ci', lec: 'L09', name: 'Öryggisbil fyrir meðaltal', f(lvl) {
  const n = lvl === 1 ? R.pick([9, 16, 25, 36, 49, 64, 100]) : R.ri(6, 30); const xb = R.ri(400, 1200) / 10; const sd = R.ri(10, 120) / 10;
  if (lvl === 1) { const cf = R.pick([0.90, 0.95, 0.99]); const ze = PROB.qnorm(1 - (1 - cf) / 2), zt = ZTAB[cf]; const side = R.pick(['L', 'U']); const se = sd / Math.sqrt(n);
    const ex = side === 'L' ? xb - ze * se : xb + ze * se, tb = side === 'L' ? xb - zt * se : xb + zt * se;
    return num(`Þýðið er normaldreift með þekkt ${M(`\\sigma = ${F.m(sd)}`)}. Úrtak af stærð n = ${n} gefur ${M(`\\bar{x} = ${F.m(xb)}`)}. Hver eru ${side === 'L' ? 'neðri' : 'efri'} mörk ${F.pct(cf, 0)} tvíhliða öryggisbils fyrir μ? ${hint('Vikmörkin ná yfir z-gildið á glæru 17 og nákvæmt z.')}`, tb, nTol(ex, tb, 0.005), '',
      calc(`z_{${F.m((1 - cf) / 2, 3)}} = ${F.m(zt)}, \\quad \\frac{\\sigma}{\\sqrt{n}} = \\frac{${F.m(sd)}}{${Math.sqrt(n)}} = ${F.m(se, 4)}`, `${F.m(xb)} ${side === 'L' ? '-' : '+'} ${F.m(zt)} \\cdot ${F.m(se, 4)} = ${F.m(tb, 3)}`) + note('Tvíhliða bil notar z<sub>α/2</sub>; Pr(Z < z<sub>α/2</sub>) = 1 − α/2.') + trap(`Að nota z<sub>α</sub> (einhliða gildið) í tvíhliða bili, eða σ í stað σ/√n.`), { n, xb, sd, cf, side }); }
  if (lvl === 2) { const cf = R.pick([0.90, 0.95, 0.99]); const tq = t3(1 - (1 - cf) / 2, n - 1), te = PROB.qt(1 - (1 - cf) / 2, n - 1); const se = sd / Math.sqrt(n); const side = R.pick(['L', 'U']);
    const ex = side === 'L' ? xb - te * se : xb + te * se, tb = side === 'L' ? xb - tq * se : xb + tq * se;
    return num(`Þýðið er normaldreift og σ óþekkt. Úrtak af stærð n = ${n} gefur ${M(`\\bar{x} = ${F.m(xb)}`)} og ${M(`s = ${F.m(sd)}`)}. Hver eru ${side === 'L' ? 'neðri' : 'efri'} mörk ${F.pct(cf, 0)} tvíhliða öryggisbils fyrir μ? Notið ${M(`t_{${n - 1},\\,${F.m((1 - cf) / 2, 3)}} = ${F.m(tq, 3)}`)}.`, tb, nTol(ex, tb, 0.005), '',
      calc(`\\frac{s}{\\sqrt{n}} = \\frac{${F.m(sd)}}{\\sqrt{${n}}} = ${F.m(se, 4)}`, `${F.m(xb)} ${side === 'L' ? '-' : '+'} ${F.m(tq, 3)} \\cdot ${F.m(se, 4)} = ${F.m(tb, 3)}`) + note(`R: <code>qt(${1 - (1 - cf) / 2}, ${n - 1})</code> = ${F.s(te, 4)}. Glæra 24 í 09.`) + trap(`z = ${F.s(PROB.qnorm(1 - (1 - cf) / 2), 3)} í stað t gerir bilið of þröngt þegar σ er metið.`), { n, xb, sd, cf, side, tq }); }
  const cf = R.pick([0.90, 0.95, 0.99]); const side = R.pick(['L', 'U']); const te = PROB.qt(cf, n - 1), tq = t3(cf, n - 1); const se = sd / Math.sqrt(n);
  const ex = side === 'L' ? xb - te * se : xb + te * se, tb = side === 'L' ? xb - tq * se : xb + tq * se;
  return num(`Laun eru normaldreifð og σ óþekkt. Úrtak af stærð n = ${n} gefur ${M(`\\bar{x} = ${F.m(xb)}`)} og ${M(`s = ${F.m(sd)}`)}. Finnið ${F.pct(cf, 0)} <b>${side === 'L' ? 'neðra' : 'efra'}</b> (einhliða) öryggisbil fyrir μ og gefið upp ${side === 'L' ? 'neðri' : 'efri'} mörkin. ${hint('t-tafla leyfð; vikmörkin ná yfir t á þremur aukastöfum.')}`, tb, nTol(ex, tb, 0.005), '',
    calc(`t_{${n - 1},\\,${F.m(1 - cf, 2)}} = ${F.m(tq, 3)} \\;(\\text{einhliða: } \\alpha \\text{ í öðrum halanum})`, `${F.m(xb)} ${side === 'L' ? '-' : '+'} ${F.m(tq, 3)} \\cdot \\frac{${F.m(sd)}}{\\sqrt{${n}}} = ${F.m(tb, 3)}`) + note(`Bilið er ${side === 'L' ? `[${F.s(tb, 3)}; ∞)` : `(−∞; ${F.s(tb, 3)}]`}. Dæmablað 9, 1b–c.`) + trap(`t<sub>α/2</sub> = ${F.s(PROB.qt(1 - (1 - cf) / 2, n - 1), 3)} á við tvíhliða bil.`), { n, xb, sd, cf, side, tq });
} });

GENS.push({ id: 'g-ttest', lec: 'L09', name: 't-próf fyrir meðaltal', r: [3], f(lvl) {
  const n = R.ri(8, 60), mu0 = R.ri(20, 200) / 2, s = R.ri(10, 80) / 10; const t0 = R.pick([-1, 1]) * R.ri(2, 35) / 10; const xb = Math.round((mu0 + t0 * s / Math.sqrt(n)) * 100) / 100;
  const T = (xb - mu0) / (s / Math.sqrt(n));
  if (lvl === 1) return num(`Úrtak af stærð n = ${n} gefur ${M(`\\bar{x} = ${F.m(xb)}`)} og ${M(`s = ${F.m(s)}`)}. Reiknið t-prófstærðina fyrir ${M(`H_0: \\mu = ${F.m(mu0)}`)}.`, T, 0.002, '',
    calc(`T = \\frac{\\bar{x} - \\mu_0}{s / \\sqrt{n}} = \\frac{${F.m(xb)} - ${F.m(mu0)}}{${F.m(s)} / \\sqrt{${n}}} = \\frac{${F.m(xb - mu0)}}{${F.m(s / Math.sqrt(n), 4)}} = ${F.m(T, 3)}`) + trap(`Að deila með s (ekki s/√n) gefur ${F.s((xb - mu0) / s, 3)}.`), { n, mu0, s, xb });
  if (lvl === 2) { const side = R.pick(['two', 'greater', 'less']); const a = R.pick([0.05, 0.01, 0.10]);
    const cq = side === 'two' ? t3(1 - a / 2, n - 1) : t3(1 - a, n - 1); const other = side === 'two' ? t3(1 - a, n - 1) : t3(1 - a / 2, n - 1);
    const rej = side === 'two' ? Math.abs(T) > cq : side === 'greater' ? T > cq : T < -cq;
    const H1 = side === 'two' ? `\\mu \\neq ${F.m(mu0)}` : side === 'greater' ? `\\mu > ${F.m(mu0)}` : `\\mu < ${F.m(mu0)}`;
    const Ts = F.s(T, 2), crit = side === 'less' ? '−' + F.s(cq, 3) : F.s(cq, 3);
    const okTxt = rej ? `Hafna H₀: T = ${Ts} er á höfnunarsvæðinu (mörk ${side === 'two' ? '±' : ''}${crit})` : `Ekki hafna H₀: T = ${Ts} er utan höfnunarsvæðisins (mörk ${side === 'two' ? '±' : ''}${crit})`;
    const flip = rej ? `Ekki hafna H₀: T = ${Ts} er utan höfnunarsvæðisins (mörk ${side === 'two' ? '±' : ''}${crit})` : `Hafna H₀: T = ${Ts} er á höfnunarsvæðinu (mörk ${side === 'two' ? '±' : ''}${crit})`;
    const otherRej = side === 'two' ? Math.abs(T) > other : side === 'greater' ? T > other : T < -other;
    const d2 = `${otherRej ? 'Hafna' : 'Ekki hafna'} H₀: borið saman við ${side === 'less' ? '−' : ''}${F.s(other, 3)} (${side === 'two' ? 'einhliða' : 'tvíhliða'} gildið)`;
    const Tz = (xb - mu0) / s; const d3 = `${(side === 'two' ? Math.abs(Tz) > cq : side === 'greater' ? Tz > cq : Tz < -cq) ? 'Hafna' : 'Ekki hafna'} H₀: T = ${F.s(Tz, 2)} þegar deilt er með s`;
    const d4 = `Samþykkja H₀: gögnin sanna að ${M(`\\mu = ${F.m(mu0)}`)}`;
    const o = [okTxt, flip, d2, d3, d4];
    return mc(`Normaldreift þýði, σ óþekkt. Úrtak af stærð n = ${n} gefur ${M(`\\bar{x} = ${F.m(xb)}`)} og ${M(`s = ${F.m(s)}`)}. Prófið ${M(`H_0: \\mu ${side === 'two' ? '=' : side === 'greater' ? '\\le' : '\\ge'} ${F.m(mu0)}`)} gegn ${M(`H_1: ${H1}`)} með α = ${F.s(a)}. Notið ${M(`t_{${n - 1},\\,${F.m(side === 'two' ? a / 2 : a, 3)}} = ${F.m(cq, 3)}`)} og ${M(`t_{${n - 1},\\,${F.m(side === 'two' ? a : a / 2, 3)}} = ${F.m(other, 3)}`)}.`, o,
      calc(`T = \\frac{${F.m(xb)} - ${F.m(mu0)}}{${F.m(s)}/\\sqrt{${n}}} = ${F.m(T, 3)}`, `§Próf: ${tailTxt(side)} → viðmiðsgildi ${side === 'two' ? '±' : side === 'less' ? '−' : ''}${F.s(cq, 3)}`, `§Niðurstaða: ${rej ? 'hafna H₀' : 'ekki hafna H₀'}`) +
      '<p class="note"><b>Rangir kostir</b></p>' + traps([[flip.split(':')[0], 'Rangur samanburður við viðmiðsgildið.'], [d2.split(':')[0] + ' (rangt gildi)', side === 'two' ? 'Tvíhliða próf notar t<sub>α/2</sub>.' : 'Einhliða próf notar t<sub>α</sub>, allt α í öðrum halanum.'], ['Deilt með s', 'Prófstærðin deilir með s/√n.'], ['Samþykkja H₀', 'Tilgátupróf getur ekki sannað H₀; í mesta lagi er henni ekki hafnað.']]), rej ? 1 : 0, { n, mu0, s, xb, side, a, cq });
  }
  const side = R.pick(['two', 'greater', 'less']); const pv = side === 'two' ? 2 * (1 - PROB.pt(Math.abs(T), n - 1)) : side === 'greater' ? 1 - PROB.pt(T, n - 1) : PROB.pt(T, n - 1);
  const Tr = rx3(T); const rc = side === 'two' ? `cat(round(2 * (1 - pt(abs(${Tr}), ${n - 1})), 6))` : side === 'greater' ? `cat(round(1 - pt(${Tr}, ${n - 1}), 6))` : `cat(round(pt(${Tr}, ${n - 1}), 6))`;
  const pvR = side === 'two' ? 2 * (1 - PROB.pt(Math.abs(+Tr), n - 1)) : side === 'greater' ? 1 - PROB.pt(+Tr, n - 1) : PROB.pt(+Tr, n - 1);
  return pnum(`t-prófstærðin er T = ${F.s(+Tr, 3)} með ${n - 1} frígráðum. Hvert er p-gildið fyrir ${tailTxt(side)} próf? Hvaða R-skipun gefur það? ${hint('Svarið með R; vikmörk ±0,001.')}`, pvR, 0.001,
    calc(side === 'two' ? `p = 2\\min\\{\\Pr(T \\ge t), \\Pr(T \\le t)\\} = 2(1 - F_{${n - 1}}(|${F.m(+Tr, 3)}|)) = ${F.m(pvR, 4)}` : side === 'greater' ? `p = \\Pr(T \\ge ${F.m(+Tr, 3)}) = 1 - F_{${n - 1}}(${F.m(+Tr, 3)}) = ${F.m(pvR, 4)}` : `p = \\Pr(T \\le ${F.m(+Tr, 3)}) = F_{${n - 1}}(${F.m(+Tr, 3)}) = ${F.m(pvR, 4)}`) +
    out(rc.replace(/^cat\(round\((.*), 6\)\)$/, '$1')) + note('Glæra 40 í 09. Í R gefur <code>t.test()</code> p-gildið beint.') + trap(side === 'two' ? `Einhliða gildið ${F.s(pvR / 2, 4)} er helmingur þess tvíhliða.` : `Tvíhliða gildið væri ${F.s(2 * Math.min(pvR, 1 - pvR), 4)}; ${side === 'greater' ? '<code>pt(T, df)</code> gefur vinstri halann' : '<code>1 - pt(T, df)</code> gefur hægri halann'} (${F.s(1 - pvR, 4)}).`), { n, T: +Tr, side, rc, rx: String(+pvR.toFixed(6)) });
} });

GENS.push({ id: 'g-welch', lec: 'L09', name: 'Mismunur tveggja meðaltala (Welch)', f(lvl) {
  const n1 = R.ri(8, 40), n2 = R.ri(8, 40), s1 = R.ri(5, 30) / 10, s2 = R.ri(5, 30) / 10, x1 = R.ri(50, 90) / 10, x2 = R.ri(50, 90) / 10;
  const v1 = s1 * s1 / n1, v2 = s2 * s2 / n2, se = Math.sqrt(v1 + v2), T = (x1 - x2) / se, nu = (v1 + v2) ** 2 / (v1 * v1 / (n1 - 1) + v2 * v2 / (n2 - 1));
  const ctx = `Hagfræðinemar (n₁ = ${n1}) hafa meðaleinkunn ${F.s(x1)} og staðalfrávik ${F.s(s1)}; viðskiptafræðinemar (n₂ = ${n2}) ${F.s(x2)} og ${F.s(s2)}.`;
  const base = calc(`\\frac{s_1^2}{n_1} = \\frac{${F.m(s1)}^2}{${n1}} = ${F.m(v1, 4)}, \\quad \\frac{s_2^2}{n_2} = \\frac{${F.m(s2)}^2}{${n2}} = ${F.m(v2, 4)}`, `SE = \\sqrt{${F.m(v1, 4)} + ${F.m(v2, 4)}} = ${F.m(se, 4)}`);
  if (lvl === 1) return num(`${ctx} Hver er staðalskekkja mismunarins ${M('\\bar{x}_1 - \\bar{x}_2')}?`, se, 0.0005, '', base + trap(`Staðalfrávikin leggjast ekki saman: √(s₁²/n₁) + √(s₂²/n₂) = ${F.s(Math.sqrt(v1) + Math.sqrt(v2), 4)}.`), { n1, n2, s1, s2, x1, x2 });
  if (lvl === 2) return num(`${ctx} Reiknið Welch t-prófstærðina fyrir ${M('H_0: \\mu_1 = \\mu_2')}.`, T, 0.002, '', base + calc(`T = \\frac{${F.m(x1)} - ${F.m(x2)} - 0}{${F.m(se, 4)}} = ${F.m(T, 3)}`) + note('Glæra 70 í 09. R: <code>t.test(x, y)</code> reiknar Welch-útgáfuna sjálfgefið.') + trap(`Að nota s₁² + s₂² án þess að deila með n gefur ${F.s((x1 - x2) / Math.sqrt(s1 * s1 + s2 * s2), 3)}.`), { n1, n2, s1, s2, x1, x2 });
  return num(`${ctx} Hve margar frígráður ν hefur Welch t-prófið?`, nu, 0.05, '', base + calc(`\\nu = \\frac{(${F.m(v1, 4)} + ${F.m(v2, 4)})^2}{\\frac{${F.m(v1, 4)}^2}{${n1 - 1}} + \\frac{${F.m(v2, 4)}^2}{${n2 - 1}}} = ${F.m(nu, 2)}`) + note('Glæra 73 í 09 (ν ≈ 46,9). Í töflu er yfirleitt námundað niður.') + trap(`n₁ + n₂ − 2 = ${n1 + n2 - 2} á við sameinaða t-prófið með jafnri dreifni, ekki Welch.`), { n1, n2, s1, s2, x1, x2 });
} });

GENS.push({ id: 'g-varchi', lec: 'L09', name: 'χ²-próf og öryggisbil fyrir dreifni', f(lvl) {
  const n = R.ri(8, 40), s2 = R.ri(10, 400) / 10, s02 = R.ri(10, 400) / 10; const X2 = (n - 1) * s2 / s02;
  if (lvl === 1) { const sd = Math.round(Math.sqrt(s2) * 100) / 100, sd0 = Math.round(Math.sqrt(s02) * 10) / 10; const X = (n - 1) * sd * sd / (sd0 * sd0);
    return num(`Úrtak af stærð n = ${n} úr normaldreifðu þýði hefur staðalfrávik ${M(`s = ${F.m(sd)}`)}. Reiknið χ²-prófstærðina fyrir ${M(`H_0: \\sigma = ${F.m(sd0)}`)}.`, X, 0.002, '',
      calc(`\\chi^2 = \\frac{(n - 1) s^2}{\\sigma_0^2} = \\frac{${n - 1} \\cdot ${F.m(sd)}^2}{${F.m(sd0)}^2} = ${F.m(X, 3)}`) + note('Dæmablað 9, 3a: tilgáta um staðalfrávik er prófuð sem tilgáta um dreifni.') + trap(`Staðalfrávik í stað dreifni gefur ${F.s((n - 1) * sd / sd0, 3)}; n í stað n − 1 gefur ${F.s(n * sd * sd / (sd0 * sd0), 3)}.`), { n, sd, sd0 }); }
  if (lvl === 2) { const side = R.pick(['greater', 'less']); const a = 0.05; const lo = PROB.qchisq(a, n - 1), hi = PROB.qchisq(1 - a, n - 1), lo2 = PROB.qchisq(a / 2, n - 1), hi2 = PROB.qchisq(1 - a / 2, n - 1);
    const rej = side === 'greater' ? X2 > hi : X2 < lo; const cv = side === 'greater' ? hi : lo;
    const X2s = F.s(X2, 2);
    const ok = rej ? `Hafna H₀: χ² = ${X2s} ${side === 'greater' ? '>' : '<'} ${F.s(cv, 2)}` : `Ekki hafna H₀: χ² = ${X2s} ${side === 'greater' ? '≤' : '≥'} ${F.s(cv, 2)}`;
    const wrong1 = side === 'greater' ? `${X2 < lo ? 'Hafna' : 'Ekki hafna'} H₀: borið saman við neðra gildið ${F.s(lo, 2)}` : `${X2 > hi ? 'Hafna' : 'Ekki hafna'} H₀: borið saman við efra gildið ${F.s(hi, 2)}`;
    const wrong2 = side === 'greater' ? `${X2 > hi2 ? 'Hafna' : 'Ekki hafna'} H₀: borið saman við ${F.s(hi2, 2)} (α/2)` : `${X2 < lo2 ? 'Hafna' : 'Ekki hafna'} H₀: borið saman við ${F.s(lo2, 2)} (α/2)`;
    const Xs = (n - 1) * Math.sqrt(s2) / Math.sqrt(s02); const wrong3 = `${(side === 'greater' ? Xs > hi : Xs < lo) ? 'Hafna' : 'Ekki hafna'} H₀: χ² = ${F.s(Xs, 2)} reiknað með staðalfrávikum`;
    const wrong4 = rej ? `Ekki hafna H₀: χ² = ${X2s} er nálægt n − 1 = ${n - 1}` : `Hafna H₀: χ² = ${X2s} er langt frá σ₀² = ${F.s(s02)}`;
    return mc(`Normaldreift þýði; úrtak af stærð n = ${n} gefur ${M(`s^2 = ${F.m(s2)}`)}. Prófið ${M(`H_0: \\sigma^2 ${side === 'greater' ? '\\le' : '\\ge'} ${F.m(s02)}`)} gegn ${M(`H_1: \\sigma^2 ${side === 'greater' ? '>' : '<'} ${F.m(s02)}`)} með α = 0,05. χ²-gildi með ${n - 1} frígráðum: Pr(χ² < c) = 0,025: ${F.s(lo2, 2)} · 0,05: ${F.s(lo, 2)} · 0,95: ${F.s(hi, 2)} · 0,975: ${F.s(hi2, 2)}.`, [ok, wrong1, wrong2, wrong3, wrong4],
      calc(`\\chi^2 = \\frac{${n - 1} \\cdot ${F.m(s2)}}{${F.m(s02)}} = ${F.m(X2, 3)}`, `§${side === 'greater' ? 'Efra' : 'Neðra'} einhliða próf: allt α = 0,05 í ${side === 'greater' ? 'hægri' : 'vinstri'} halanum → ${F.s(cv, 2)}`, `§Niðurstaða: ${rej ? 'hafna' : 'ekki hafna'} H₀`) +
      note('Á glærum 81 og 86 í 09 er χ²-gildum gefið nafn á tvo vegu (hlutfallsmark neðan frá á gl. 81, efri hali á gl. 86). Lesið alltaf hvaða hala gildið á við.') + '<p class="note"><b>Rangir kostir</b></p>' + traps([['Rangur hali', 'H₁ ræður hvorum megin höfnunarsvæðið er.'], ['α/2', 'Einhliða próf: α fer allt í annan halann.'], ['Staðalfrávik', 'Prófstærðin notar dreifnir.'], ['„Nálægt" eða „langt frá"', 'Ákvörðunin byggir á viðmiðsgildinu, ekki á tilfinningu.']]), rej ? 1 : 0, { n, s2, s02, side });
  }
  const cf = R.pick([0.90, 0.95, 0.99]); const a = 1 - cf; const qL = PROB.qchisq(a / 2, n - 1), qU = PROB.qchisq(1 - a / 2, n - 1); const qLr = Math.round(qL * 1000) / 1000, qUr = Math.round(qU * 1000) / 1000;
  const which = R.pick(['L', 'U']); const ans = which === 'L' ? (n - 1) * s2 / qUr : (n - 1) * s2 / qLr; const ex = which === 'L' ? (n - 1) * s2 / qU : (n - 1) * s2 / qL;
  return num(`Normaldreift þýði; úrtak af stærð n = ${n} gefur ${M(`s^2 = ${F.m(s2)}`)}. Finnið ${which === 'L' ? 'neðri' : 'efri'} mörk ${F.pct(cf, 0)} öryggisbils fyrir ${M('\\sigma^2')}. χ²-hlutfallsmörk með ${n - 1} frígráðum: ${M(`\\chi^2_{${F.m(a / 2, 3)}} = ${F.m(qLr, 3)}`)} og ${M(`\\chi^2_{${F.m(1 - a / 2, 3)}} = ${F.m(qUr, 3)}`)} (Pr(χ² < c)).`, ans, nTol(ex, ans, 0.005), '',
    calc(`\\hat\\sigma^2_L = \\frac{(n - 1)s^2}{\\chi^2_{1 - \\alpha/2}} = \\frac{${n - 1} \\cdot ${F.m(s2)}}{${F.m(qUr, 3)}} = ${F.m((n - 1) * s2 / qUr, 3)}`, `\\hat\\sigma^2_U = \\frac{(n - 1)s^2}{\\chi^2_{\\alpha/2}} = \\frac{${n - 1} \\cdot ${F.m(s2)}}{${F.m(qLr, 3)}} = ${F.m((n - 1) * s2 / qLr, 3)}`) +
    note('Glærur 81–82 í 09. Stærra χ²-gildið er í nefnara <b>neðri</b> markanna. Bilið er ekki samhverft um s².') + trap('Að víxla χ²-gildunum gefur neðri mörk sem eru stærri en efri mörkin.'), { n, s2, cf, which, qLr, qUr });
} });

GENS.push({ id: 'g-ftest', lec: 'L09', name: 'F-próf fyrir tvær dreifnir', r: [3], f(lvl) {
  const n1 = R.ri(6, 30), n2 = R.ri(6, 30), sd1 = R.ri(5, 40) / 10, sd2 = R.ri(5, 40) / 10; const Fv = sd1 * sd1 / (sd2 * sd2);
  const ctx = `Tvö óháð úrtök úr normaldreifðum þýðum: n₁ = ${n1} með staðalfrávik ${F.s(sd1)} og n₂ = ${n2} með staðalfrávik ${F.s(sd2)}.`;
  if (lvl === 1) return num(`${ctx} Reiknið F-prófstærðina ${M('F = S_1^2 / S_2^2')}.`, Fv, 0.002, '', calc(`F = \\frac{${F.m(sd1)}^2}{${F.m(sd2)}^2} = \\frac{${F.m(sd1 * sd1, 4)}}{${F.m(sd2 * sd2, 4)}} = ${F.m(Fv, 3)}`) + note(`Frígráður: (${n1 - 1}, ${n2 - 1}).`) + trap(`Hlutfall staðalfrávika ${F.s(sd1 / sd2, 3)} er ekki F-prófstærðin.`), { n1, n2, sd1, sd2 });
  if (lvl === 2) { const lo = PROB.qf(0.025, n1 - 1, n2 - 1), hi = PROB.qf(0.975, n1 - 1, n2 - 1); const rej = Fv < lo || Fv > hi; const Fs = F.s(Fv, 2);
    const ok = rej ? `Hafna H₀: F = ${Fs} er utan [${F.s(lo, 3)}; ${F.s(hi, 3)}]` : `Ekki hafna H₀: F = ${Fs} er innan [${F.s(lo, 3)}; ${F.s(hi, 3)}]`;
    const hi1 = PROB.qf(0.95, n1 - 1, n2 - 1); const Fsd = sd1 / sd2;
    const o = [ok, rej ? `Ekki hafna H₀: F = ${Fs} er innan bilsins` : `Hafna H₀: F = ${Fs} er utan bilsins`, `${Fv > hi1 ? 'Hafna' : 'Ekki hafna'} H₀: borið aðeins saman við ${F.s(hi1, 3)} (α í einum hala)`, `${(Fsd < lo || Fsd > hi) ? 'Hafna' : 'Ekki hafna'} H₀: F = ${F.s(Fsd, 2)} (hlutfall staðalfrávika)`, `Hafna H₀ af því að F ≠ 1`];
    return mc(`${ctx} Prófið ${M('H_0: \\sigma_1^2 = \\sigma_2^2')} gegn ${M('H_1: \\sigma_1^2 \\neq \\sigma_2^2')} með α = 0,05. F-hlutfallsmörk með (${n1 - 1}, ${n2 - 1}) frígráðum: Pr(F < c) = 0,025: ${F.s(lo, 3)} · 0,95: ${F.s(hi1, 3)} · 0,975: ${F.s(hi, 3)}.`, o,
      calc(`F = \\frac{${F.m(sd1)}^2}{${F.m(sd2)}^2} = ${F.m(Fv, 3)}`, `§Tvíhliða: hafna ef F < ${F.s(lo, 3)} eða F > ${F.s(hi, 3)}`, `§Niðurstaða: ${rej ? 'hafna' : 'ekki hafna'} H₀`) +
      slideErr('Á glæru 96 í 09 er efra viðmiðsgildið F<sub>9,9</sub> sagt 4,96; rétt er 4,03 (qf(0.975, 9, 9)). Niðurstaðan þar breytist ekki.') + '<p class="note"><b>Rangir kostir</b></p>' + traps([['Öfug niðurstaða', 'Rangur samanburður við bilið.'], ['Einn hali', 'H₁: ≠ er tvíhliða, svo α/2 í hvorum hala.'], ['Hlutfall staðalfrávika', 'F notar dreifnir.'], ['F ≠ 1', 'F er nánast aldrei nákvæmlega 1; spurningin er hvort munurinn sé marktækur.']]), rej ? 1 : 0, { n1, n2, sd1, sd2 }); }
  const s1r = rx3(sd1 * sd1), s2r = rx3(sd2 * sd2); const Fr = +s1r / +s2r; const pv = 2 * Math.min(PROB.pf(Fr, n1 - 1, n2 - 1), 1 - PROB.pf(Fr, n1 - 1, n2 - 1));
  const rc = `F <- ${s1r} / ${s2r}; cat(round(2 * min(pf(F, ${n1 - 1}, ${n2 - 1}), 1 - pf(F, ${n1 - 1}, ${n2 - 1})), 6))`;
  return pnum(`${ctx} Hvert er tvíhliða p-gildi F-prófsins fyrir ${M('H_0: \\sigma_1^2 = \\sigma_2^2')}? ${hint('Notið R; vikmörk ±0,001.')}`, pv, 0.001,
    calc(`F = ${F.m(Fr, 4)}, \\quad (${n1 - 1}, ${n2 - 1}) \\text{ frígráður}`, `p = 2\\min\\{F_{F}(${F.m(Fr, 3)}), 1 - F_{F}(${F.m(Fr, 3)})\\} = ${F.m(pv, 4)}`) + out(rc) + note('Sama og <code>var.test(x, y)</code> gefur úr gögnunum (glæra 98 í 09).') + trap('Að tvöfalda ekki gefur einhliða p-gildi; að tvöfalda stærri halann gefur gildi yfir 1.'), { n1, n2, s1r: +s1r, s2r: +s2r, rc, rx: String(+pv.toFixed(6)) });
} });


// ===================== FÖST DÆMI =====================
// Hvert dæmi: {id, lec, lvl, kind ('mc'|'num'|'step'|'card'), from ('hv'|'gl'|'ny'), src, q, …, e}
// mc: o = valkostir, rétta svarið fremst (a = 0), stokkað við birtingu. num: ans, tol, unit (prob:true = líkur).
// step: steps = [{h, p, e}], stig gefin sjálfur. card: back (fyrirmyndarsvar), keys (lykilatriði).
// R-spurningar: r:true; rc/rx = R-kóði og vænt úttak sem prófanirnar keyra í alvöru R.
const BANK = [];
const WRONG = list => '<p class="note"><b>Rangir kostir</b></p>' + traps(list);
// MCQ: kostir sem [texti, hvers vegna rangur]; fyrsti er réttur.
function MCQ(id, lec, lvl, from, src, q, kostir, e, extra = {}) {
  BANK.push({ id, lec, lvl, kind: 'mc', from, src, q, o: kostir.map(k => k[0]), a: 0, e: e + WRONG(kostir.slice(1)), ...extra });
}
function NUM(id, lec, lvl, from, src, q, ans, tol, unit, e, extra = {}) { BANK.push({ id, lec, lvl, kind: 'num', from, src, q, ans, tol, unit, e, ...extra }); }
function PNUM(id, lec, lvl, from, src, q, ans, tol, e, extra = {}) { BANK.push({ id, lec, lvl, kind: 'num', prob: true, from, src, q, ans, tol, unit: '', e, ...extra }); }
function STEP(id, lec, from, src, q, steps, extra = {}) { BANK.push({ id, lec, lvl: 3, kind: 'step', from, src, q, steps: steps.map(([h, p, e]) => ({ h, p, e })), ...extra }); }
function CARD(id, lec, src, q, back, keys) { BANK.push({ id, lec, lvl: 3, kind: 'card', from: 'ny', src, q, back, keys }); }
const ASSUME = s => `<p class="assume"><b>Forsenda.</b> ${s}</p>`;

// ================= L00 · Inngangur og R =================
{ const L = 'L00', G = 'Glærur 00 R-grunnur', V1 = 'Verkefni 1 (R æfingar)';
MCQ('L00-gl-1', L, 1, 'gl', G + ', gl. 11', 'Hvaða tag (type) hefur gildið <code>104L</code> í R?',
  [['<code>integer</code>'], ['<code>numeric</code>', 'L-endingin gerir töluna að heiltölu; án hennar væri hún numeric (double).'], ['<code>character</code>', 'Engar gæsalappir, svo þetta er ekki strengur.'], ['<code>logical</code>', 'Logical eru aðeins TRUE og FALSE.'], ['<code>complex</code>', 'Complex hefur ímyndaðan hluta, t.d. 14 + 0.3i.']],
  note('Grunntögin fimm: numeric, integer (L-ending), complex, character og logical.'), { r: true, rc: 'cat(class(104L))', rx: 'integer', rxo: true });
MCQ('L00-gl-2', L, 1, 'gl', G + ', gl. 17', 'Hvað prentar síðasta línan?' + code('x <- c(1, 2, 3, 4, 5)\nx[c(1, 3)]'),
  [['1 3'], ['2 4', 'Taldi frá 0. Í R er fyrsta stakið x[1].'], ['1 2 3', 'c(1, 3) er vektor tveggja vísa, ekki bilið 1:3.'], ['3', 'Tók aðeins síðasta vísinn.'], ['4', 'Lagði vísana saman.']],
  calc('§x[c(1, 3)] = §stak 1 og stak 3 = §1 og 3'), { r: true, rc: 'x <- c(1, 2, 3, 4, 5); cat(x[c(1, 3)])', rx: '1 3', rxo: true });
NUM('L00-hv-1', L, 1, 'hv', V1 + ', 1f', 'Í verkefni 1 eru skilgreindar <code>a &lt;- 21.1</code> og <code>b &lt;- 5</code>. Hvað skilar <code>a %/% b</code>?', 4, 0, '',
  calc('21{,}1 = 4 \\cdot 5 + 1{,}1', '§21.1 %/% 5 = 4') + note('Heiltöludeiling fellir burt aukastafina: 21,1/5 = 4,22 → 4.') + trap('4,22 er venjuleg deiling; 1,1 er afgangurinn (%%).'), { r: true, rc: 'cat(21.1 %/% 5)', rx: '4' });
NUM('L00-hv-2', L, 1, 'hv', V1 + ', 1g', 'Með <code>a &lt;- 21.1</code> og <code>b &lt;- 5</code>: hvað skilar <code>a %% b</code>?', 1.1, 0.001, '',
  calc('21{,}1 - 4 \\cdot 5 = 1{,}1') + note('Afgangurinn er það sem stendur eftir þegar heiltöludeilingin hefur verið dregin frá, og hann má vera kommutala.') + trap('4 er svarið við %/%.'), { r: true, rc: 'cat(round(21.1 %% 5, 6))', rx: '1.1' });
MCQ('L00-gl-3', L, 1, 'gl', G + ', gl. 3', 'R er túlkað (interpreted) forritunarmál. Hvað einkennir slík mál samkvæmt glærunum?',
  [['Forritið er lesið og keyrt línu fyrir línu, sem leyfir gagnvirka vinnu en fórnar hraða'], ['Allt forritið er þýtt í heild á vélarmál áður en það keyrir', 'Þetta á við þýdd mál (C, C++, Java).'], ['Túlkuð mál eru alltaf hraðari en þýdd mál', 'Öfugt: þýdd mál geta beitt bestun og eru yfirleitt hraðari.'], ['Túlkuð mál keyra aðeins á einni tölvugerð', 'Æðri forritunarmál, þýdd eða túlkuð, keyra á mörgum tölvugerðum.'], ['Í túlkuðum málum er ekki hægt að skilgreina föll', 'R styður föll eins og önnur mál.']],
  note('Dæmi um túlkuð mál: R, Python, Matlab. Þýdd: C, C++, Java.'));
MCQ('L00-gl-4', L, 1, 'gl', G + ', gl. 12', 'Hvert eftirfarandi er löglegt breytunafn í R?',
  [['<code>medal_tekjur</code>'], ['<code>2tekjur</code>', 'Breytunafn má ekki byrja á tölustaf.'], ['<code>medal tekjur</code>', 'Breytunafn má ekki innihalda bil.'], ['<code>if</code>', 'Frátekið orð í R.'], ['<code>function</code>', 'Frátekið orð í R.']],
  note('snake_case og camelCase eru vinsæl snið. Íslenskir stafir eru leyfðir en betra að sleppa þeim.'));
MCQ('L00-gl-5', L, 1, 'gl', G + ', gl. 36–37 · ' + V1 + ', 4a–b', 'Hvað gerir skipunin <code>library(quantmod)</code>?',
  [['Hleður uppsettum pakka inn í minnið svo föll hans verði aðgengileg'], ['Sækir pakkann af CRAN og setur hann upp', 'Það gerir <code>install.packages("quantmod")</code>.'], ['Þarf aðeins að keyra einu sinni á hverri tölvu', 'Það á við install.packages; library þarf í hverri R-keyrslu.'], ['Uppfærir R í nýjustu útgáfu', 'library uppfærir ekkert.'], ['Krefst þess að nafnið sé í gæsalöppum, annars kemur villa', 'library tekur nafnið án gæsalappa (install.packages með).']],
  note('install.packages sækir líka pakkana sem pakkinn byggir á (dependencies).'));
MCQ('L00-hv-3', L, 1, 'hv', V1 + ', 2f', 'Hvað prentar síðasta línan?' + code('minn_vigur <- c(1, 2, 3, 4, 5)\nminn_listi <- list(42, "Halló", minn_vigur)\nminn_listi[[3]][1]'),
  [['1'], ['42', '[[3]] sækir þriðja stak listans (vigurinn), ekki það fyrsta.'], ['"Halló"', 'Það er annað stak listans.'], ['1 2 3 4 5', 'Það er minn_listi[[3]]; [1] tekur síðan fyrsta stak vigursins.'], ['Villa', 'Það má vísa áfram inn í vigurinn sem [[3]] skilar.']],
  calc('§minn_listi[[3]] = §c(1, 2, 3, 4, 5)', '§...[1] = §1'), { r: true, rc: 'minn_vigur <- c(1, 2, 3, 4, 5); minn_listi <- list(42, "Halló", minn_vigur); cat(minn_listi[[3]][1])', rx: '1', rxo: true });
MCQ('L00-gl-6', L, 1, 'gl', G + ', gl. 20', 'Hvað prentar kóðinn?' + code('if (0) {\n  print("A")\n} else {\n  print("B")\n}'),
  [['"B"'], ['"A"', 'Í skilyrði jafngildir talan 0 FALSE; allar aðrar tölur TRUE.'], ['Villa: if tekur aðeins TRUE eða FALSE', 'Tölur eru leyfðar í skilyrðum.'], ['Ekkert', 'else-greinin keyrir þegar skilyrðið er ósatt.'], ['Bæði "A" og "B"', 'Aðeins önnur greinin keyrir.']],
  note('Ef settar eru tölur inn í skilyrta segð er 0 jafngilt FALSE og allt annað TRUE.'), { r: true, rc: 'if (0) cat("A") else cat("B")', rx: 'B' });
NUM('L00-hv-4', L, 1, 'hv', V1 + ', 3d–e', 'Hvað skilar kallið?' + code('mitt_fall <- function(x1, x2) {\n  return(sqrt(x1 + x2))\n}\nmitt_fall(3, 4)'), Math.sqrt(7), 0.001, '',
  calc('\\sqrt{3 + 4} = \\sqrt{7} = 2{,}6458') + trap('√3 + √4 = 3,7321: rótin er tekin af summunni, ekki hvorri tölu.'), { r: true, rc: 'mitt_fall <- function(x1, x2) { return(sqrt(x1 + x2)) }; cat(round(mitt_fall(3, 4), 6))', rx: '2.645751' });

MCQ('L00-gl-7', L, 2, 'gl', G + ', gl. 18', 'Hvað prentar síðasta línan?' + code('mat <- matrix(1:12, nrow = 3, ncol = 4)\nmat[1, 2]'),
  [['4'], ['2', 'Það stendur á glærunni, en matrix fyllist dálk fyrir dálk: fyrsta röðin er 1, 4, 7, 10.'], ['5', 'Röð 2, dálkur 2.'], ['7', 'Dálkur 3.'], ['1 2', 'Ein röð og einn dálkur gefa eitt stak.']],
  tbl(['', 'd1', 'd2', 'd3', 'd4'], [['r1', 1, '<b>4</b>', 7, 10], ['r2', 2, 5, 8, 11], ['r3', 3, 6, 9, 12]]) + slideErr('Á glæru 18 í R-grunni stendur að <code>mat[1, 2]</code> skili 2. R skilar 4 (staðfest í R).'), { r: true, rc: 'mat <- matrix(1:12, nrow = 3, ncol = 4); cat(mat[1, 2])', rx: '4', rxo: true });
MCQ('L00-gl-8', L, 2, 'gl', G + ', gl. 18', 'Hvað prentar síðasta línan?' + code('mat <- matrix(1:12, nrow = 3, ncol = 4)\nmat[c(1, 3), 3]'),
  [['7 9'], ['3 11', 'Fyllti röð fyrir röð (byrow).'], ['7 8 9', 'Það er allur 3. dálkurinn, mat[, 3].'], ['1 3', 'Vísarnir sjálfir, ekki stökin.'], ['4 6', 'Tók 2. dálk.']],
  calc('§Dálkur 3 = 7, 8, 9', '§Raðir 1 og 3 = 7 og 9'), { r: true, rc: 'mat <- matrix(1:12, nrow = 3, ncol = 4); cat(mat[c(1, 3), 3])', rx: '7 9', rxo: true });
MCQ('L00-gl-9', L, 2, 'gl', G + ', gl. 26', 'Hvað skilar kallið?' + code('f <- function(x, y, z) {\n  return(x + y * z)\n}\nf(y = 2, 6, 3)'),
  [['12'], ['20', 'Það er f(2, 6, 3): las inntökin í röð og hunsaði nafnið y.'], ['24', 'Reiknaði (x + y)·z.'], ['11', 'Lagði allt saman.'], ['15', 'Setti x = 3 og z = 6.']],
  calc('§Nefnt: y = 2', '§Ónefnd í röð: x = 6, z = 3', '6 + 2 \\cdot 3 = 12') + note('Glæran: f(y = 2, 6, 3) jafngildir f(6, 2, 3).'), { r: true, rc: 'f <- function(x, y, z) { return(x + y * z) }; cat(f(y = 2, 6, 3))', rx: '12', rxo: true });
MCQ('L00-ny-1', L, 2, 'ny', 'Ný spurning · í stíl við glæru 27 (sjálfgefin gildi)', 'Hvað skilar kallið?' + code('f <- function(x, y = 3, z = 4) {\n  return(x + y * z)\n}\nf(2, z = 2)'),
  [['8'], ['14', 'Notaði sjálfgefna z = 4 þó z = 2 sé gefið.'], ['10', 'Setti 2 í y og notaði z = 4.'], ['6', 'Setti x = 2, y = 2, z = 2.'], ['Villa: y vantar', 'y hefur sjálfgefið gildi 3.']],
  calc('§x = 2, z = 2 (nefnt), y = 3 (sjálfgefið)', '2 + 3 \\cdot 2 = 8'), { r: true, rc: 'f <- function(x, y = 3, z = 4) { return(x + y * z) }; cat(f(2, z = 2))', rx: '8', rxo: true });
MCQ('L00-gl-10', L, 2, 'gl', G + ', gl. 31', 'Hvað skilar síðasta línan?' + code('lst <- list(a = 1:5, b = 6:10)\nsapply(lst, sum)'),
  [['Nefndur vektor: a = 15, b = 40'], ['Listi með a = 15 og b = 40', 'Það skilar lapply; sapply einfaldar í vektor þegar öll úttök eru stakar tölur.'], ['55', 'sapply keyrir fallið á hvert stak listans, ekki á allt saman.'], ['a = 3, b = 8', 'Það eru meðaltölin (mean), ekki summurnar.'], ['a = 1:5, b = 6:10', 'Fallinu sum var beitt.']],
  calc('§sum(1:5) = 15', '§sum(6:10) = 40') + note('vapply(lst, sum, numeric(1)) skilar sama vektor en krefst þess að tag úttaksins sé skilgreint.'), { r: true, rc: 'lst <- list(a = 1:5, b = 6:10); r <- sapply(lst, sum); cat(is.list(r), paste0(names(r), "=", r))', rx: 'FALSE a=15 b=40' });
MCQ('L00-gl-11', L, 2, 'gl', G + ', gl. 32', 'Hvað skilar <code>tapply</code>?' + code('data  <- c(10, 5, 20, 4, 5, 23)\ngroup <- c("a", "b", "a", "b", "b", "a")\ntapply(data, group, sum)'),
  [['a: 53, b: 14'], ['a: 14, b: 53', 'Víxlaði hópunum.'], ['a: 17,67, b: 4,67', 'Meðaltöl í stað summa.'], ['a: 35, b: 32', 'Skipti eftir sæti (fyrstu þrjú / síðustu þrjú) í stað hópa.'], ['67', 'Summa alls; hópaskiptingin gleymdist.']],
  calc('§a: 10 + 20 + 23 = 53', '§b: 5 + 4 + 5 = 14'), { r: true, rc: 'data <- c(10, 5, 20, 4, 5, 23); group <- c("a", "b", "a", "b", "b", "a"); r <- tapply(data, group, sum); cat(paste0(names(r), ":", r))', rx: 'a:53 b:14' });
MCQ('L00-gl-12', L, 2, 'gl', G + ', gl. 32', 'Hvað skilar síðasta línan?' + code('data  <- c(10, 5, 20, 4, 5, 23)\ndata2 <- c(1, 2, 3, 4, 5, 6)\nmapply(sum, data, data2)'),
  [['11 7 23 8 10 29'], ['67 21', 'Summa hvors vektors; mapply parar saman samsvarandi stök.'], ['88', 'Allt lagt saman.'], ['10 10 60 16 25 138', 'Margfeldi samsvarandi staka.'], ['10 5 20 4 5 23', 'data óbreytt.']],
  calc('§10 + 1, 5 + 2, 20 + 3, 4 + 4, 5 + 5, 23 + 6 = 11, 7, 23, 8, 10, 29'), { r: true, rc: 'data <- c(10, 5, 20, 4, 5, 23); data2 <- c(1, 2, 3, 4, 5, 6); cat(mapply(sum, data, data2))', rx: '11 7 23 8 10 29', rxo: true });
MCQ('L00-gl-13', L, 2, 'gl', G + ', gl. 35', 'Hvaða raðir skilar síðasta línan?' + code('df <- data.frame("Nafn" = c("Jói", "Dóri", "Stína"),\n                 "Aldur" = c(16, 49, 10),\n                 "Uppáhalds" = c("Pókémón", "Kisur", "Pókémón"))\ndf[df$Aldur < 30, ]'),
  [['Raðir Jóa og Stínu, með öllum þremur dálkunum'], ['Röð Dóra', 'Hann er 49 ára; skilyrðið er Aldur < 30.'], ['Aðeins Aldur-dálkurinn fyrir Jóa og Stínu', 'Tómi hlutinn á eftir kommunni velur alla dálka.'], ['TRUE FALSE TRUE', 'Það skilar df$Aldur < 30 eitt og sér.'], ['Villa: vantar dálkvísi', 'Tómur vísir eftir kommu er leyfður og þýðir „allt".']],
  calc('§df$Aldur < 30 = TRUE, FALSE, TRUE', '§df[TRUE/FALSE-vektor, ] = raðir 1 og 3'), { r: true, rc: 'df <- data.frame(Nafn = c("J", "D", "S"), Aldur = c(16, 49, 10), U = c("P", "K", "P")); s <- df[df$Aldur < 30, ]; cat(nrow(s), ncol(s), s$Aldur)', rx: '2 3 16 10' });
MCQ('L00-gl-14', L, 2, 'gl', G + ', gl. 14', 'Hvert er <code>y</code> eftir síðustu línuna?' + code('x <- 5\ny <- c(1, 2, 3, 4, 5)\nx <- x + 1\ny <- y * 2\ny <- y + x^2'),
  [['38 40 42 44 46'], ['27 29 31 33 35', 'Notaði x = 5; x var hækkað í 6.'], ['37 38 39 40 41', 'Gleymdi að y var tvöfaldað.'], ['38', 'Aðgerðin gildir um öll stökin (vektoruð).'], ['2 4 6 8 10', 'Gleymdi síðustu línunni.']],
  calc('§x = 6, y = 2, 4, 6, 8, 10', 'y + 6^2 = 38, 40, 42, 44, 46'), { r: true, rc: 'x <- 5; y <- c(1, 2, 3, 4, 5); x <- x + 1; y <- y * 2; y <- y + x^2; cat(y)', rx: '38 40 42 44 46', rxo: true });
MCQ('L00-gl-15', L, 2, 'gl', G + ', gl. 31', 'Hvað prentar síðasta línan?' + code('mat <- matrix(c(1:5, 10:15, 16:19), nrow = 5, ncol = 3)\napply(mat, 1, sum)'),
  [['26 29 32 35 38'], ['15 60 85', 'MARGIN = 2 (dálkasummur).'], ['6 19 36 45 54', 'Fyllti röð fyrir röð.'], ['170', 'Summa alls fylkisins.'], ['5 6 4', 'Lengd bútanna í c().']],
  tbl(['', 'd1', 'd2', 'd3'], [[1, 1, 10, 15], [2, 2, 11, 16], [3, 3, 12, 17], [4, 4, 13, 18], [5, 5, 14, 19]]) + note('c(1:5, 10:15, 16:19) eru 15 tölur; dálkur 2 er 10–14 og dálkur 3 er 15–19.') + calc('§Röð i: i + (9 + i) + (14 + i) = 3i + 23'), { r: true, rc: 'mat <- matrix(c(1:5, 10:15, 16:19), nrow = 5, ncol = 3); cat(apply(mat, 1, sum))', rx: '26 29 32 35 38', rxo: true });
MCQ('L00-ny-2', L, 2, 'ny', 'Ný spurning · glæra 38–40 (pakki::fall)', 'Hvað gerir <code>::</code> í <code>ggplot2::ggplot(df, aes(x = Aldur))</code>?',
  [['Tilgreinir úr hvaða pakka fallið kemur, svo enginn vafi sé ef tveir pakkar hafa fall með sama nafni'], ['Setur pakkann upp ef hann vantar', 'Það gerir install.packages.'], ['Hleður pakkanum varanlega inn eins og library', '<code>::</code> sækir eitt fall án þess að hlaða pakkanum inn í leitarslóðina.'], ['Keyrir tvö föll í röð', 'Það er hlutverk %>% í tidyverse.'], ['Gerir fallið hraðara', 'Hraðinn breytist ekki.']],
  note('Ef tveir hlaðnir pakkar hafa fall með sama nafni gildir sá sem síðast var hlaðinn; <code>pakki::fall</code> tekur af vafa.'));
MCQ('L00-hv-5', L, 2, 'hv', 'Verkefni 3, 4b–c', '„Finndu villuna": CSV-skrá frá Hagstofunni notar semíkommu (;) á milli reita og kommu sem tugabrotskil. Eftir <code>gjald &lt;- read_csv("gjald.csv")</code> lendir allt í einum dálki. Hvað lagar þetta?',
  [['<code>read_delim("gjald.csv", delim = ";")</code> (eða <code>read_csv2</code>)'], ['<code>read.csv("gjald.csv")</code>', 'Innbyggða fallið gerir líka ráð fyrir kommu milli reita.'], ['<code>as.numeric(gjald)</code>', 'Breytir ekki því hvernig reitirnir voru klofnir.'], ['Keyra <code>library(readr)</code> aftur', 'Pakkinn er hlaðinn; vandinn er aðskilnaðartáknið.'], ['<code>read_csv("gjald.csv", sep = ",")</code>', 'Komma er einmitt röng; reitirnir eru aðskildir með ;.']],
  note('read_csv2 er flýtileið fyrir read_delim með delim = ";".'));
MCQ('L00-hv-6', L, 2, 'hv', 'Verkefni 6, 4f', '„Finndu villuna": <code>x &lt;- c(0.02, NA, -0.05, 0.11)</code> og <code>max(x)</code> skilar NA. Hvaða skipun skilar 0.11?',
  [['<code>max(x, na.rm = TRUE)</code>'], ['<code>max(x)</code>', 'Skilar NA um leið og eitt gildi vantar.'], ['<code>max(x[1:4])</code>', 'Sömu fjögur stök, NA meðtalið.'], ['<code>max(as.numeric(x))</code>', 'x er þegar tölur; NA er áfram NA.'], ['<code>max(x == NA)</code>', 'Samanburður við NA skilar alltaf NA.']],
  note('na.rm = TRUE segir max, mean, sd o.fl. að hunsa NA-gildi.'), { r: true, rc: 'x <- c(0.02, NA, -0.05, 0.11); cat(max(x), max(x, na.rm = TRUE))', rx: 'NA 0.11' });
MCQ('L00-hv-7', L, 2, 'hv', 'Verkefni 6, 4b', 'Hvers vegna þurfti að keyra þessar tvær línur á gögn Hagstofunnar um sauðfé?' + code('data$"Sauðfé alls"[data$"Sauðfé alls" == ".."] <- NA\ndata$"Sauðfé alls" <- as.numeric(data$"Sauðfé alls")'),
  [['„..“ merkir vantandi gögn; það gerir allan dálkinn að texta, svo fyrst þarf að setja NA og svo breyta dálkinum í tölur'], ['Til að eyða öllum árum með fleiri en 1.000 kindum', 'Engu er eytt eftir stærð.'], ['Til að breyta tölunum í prósentur', 'as.numeric breytir tagi, ekki einingu.'], ['Vegna þess að R les ekki íslenska stafi', 'Gæsalappirnar leysa bil og íslenska stafi í nafninu; vandinn er „..“.'], ['Röðin skiptir ekki máli; as.numeric fyrst gefur sömu niðurstöðu', 'as.numeric á „..“ gefur líka NA en með viðvörun; verkefnið merkir þau fyrst sem NA.']],
  note('$ vísar í dálk í data.frame; gæsalappir þarf af því nafnið inniheldur bil og íslenska stafi.'));
MCQ('L00-hv-8', L, 2, 'hv', 'Verkefni 4, 4b', 'Hvað gerir <code>!</code> í <code>filter(!is.na(as.numeric(bankruptcies)))</code>?',
  [['Snýr TRUE í FALSE og öfugt, svo haldið er eftir þeim röðum þar sem breytingin í tölu tókst'], ['Reiknar aðfeldi (n!) talnanna', 'Í stærðfræði táknar ! aðfeldi en í R er það neitun.'], ['Breytir NA í 0', 'Engin gildi eru endurrituð.'], ['Fjarlægir allar raðir með tölum', 'Öfugt: raðir með tölum haldast.'], ['Prentar viðvörun fyrir hverja NA-röð', '! prentar ekkert.']],
  note('as.numeric skilar NA ef textinn er ekki tala; is.na skilar TRUE fyrir þær raðir.'));

MCQ('L00-gl-16', L, 3, 'gl', 'Glærur 01, gl. 31 (afmælisvandamálið í R)', 'Í falli glæranna er reiknað <code>prod(365 - 1:n + 1)</code>. Hvað skilar <code>365 - 1:3 + 1</code>?',
  [['365 364 363'], ['363 362 361', 'Lagði 1:3 + 1 saman fyrst; frádráttur og samlagning ganga frá vinstri til hægri.'], ['364 363 … 4 (361 tala)', 'Það væri (365 − 1):(3 + 1); en : gengur á undan − og +.'], ['363', 'Útkoman er vektor, ekki ein tala.'], ['366 367 368', 'Formerkið snýst ekki við.']],
  calc('§1:3 = 1 2 3 (: gengur fyrst)', '§365 − c(1, 2, 3) = 364 363 362', '§+ 1 = 365 364 363') + note('Því er prod(365 − 1:n + 1) = 365·364·…·(365 − n + 1). factorial(365) gefur Inf í R, svo það gengur ekki.'), { r: true, rc: 'cat(365 - 1:3 + 1)', rx: '365 364 363', rxo: true });
MCQ('L00-ny-3', L, 3, 'ny', 'Ný spurning · í stíl við glæru 18 (array)', 'Hvað prentar síðasta línan?' + code('arr <- array(1:24, dim = c(2, 3, 4))\narr[2, 1, 3]'),
  [['14'], ['15', 'Það er arr[1, 2, 3] (dæmið á glærunni).'], ['16', 'Taldi dálkinn frá 1 í stað 0: 2 + 1·2 + 2·6.'], ['20', 'Taldi lagið frá 1: 2 + 0·2 + 3·6.'], ['12', 'Gleymdi röðinni: 0 + 0 + 2·6.']],
  calc('\\text{stak} = i + (j-1)\\cdot 2 + (k-1)\\cdot 6', '= 2 + 0 \\cdot 2 + 2 \\cdot 6 = 14') + note('Hvert lag er 2 × 3 = 6 stök og fyllist dálk fyrir dálk; lag 3 byrjar á 13.'), { r: true, rc: 'arr <- array(1:24, dim = c(2, 3, 4)); cat(arr[2, 1, 3])', rx: '14', rxo: true });
MCQ('L00-gl-17', L, 3, 'gl', 'Glærur 01, gl. 51 (Monty Hall-hermun)', 'Í falli Montys er <code>doors &lt;- c(1, 2, 3)</code>, keppandinn velur dyr 1 og bíllinn er bak við dyr 3. Hvað skilar <code>doors[doors != org_choice &amp; doors != prize]</code>?',
  [['2'], ['1 3', 'Sneri skilyrðinu við.'], ['3', 'Það eru dyrnar með bílnum; Monty opnar þær aldrei.'], ['1 2 3', '&amp; síar: bæði skilyrðin þurfa að vera sönn.'], ['FALSE TRUE FALSE', 'Það er rökvektorinn sjálfur, ekki dyrnar sem hann velur.']],
  calc('§doors != 1 = FALSE TRUE TRUE', '§doors != 3 = TRUE TRUE FALSE', '§& = FALSE TRUE FALSE → doors[...] = 2') + note('Þegar keppandinn hefur rangt fyrir sér á Monty aðeins eina geitardyr eftir. Að skipta vinnur því í 2/3 tilvika.'), { r: true, rc: 'doors <- c(1, 2, 3); org_choice <- 1; prize <- 3; cat(doors[doors != org_choice & doors != prize])', rx: '2', rxo: true });
NUM('L00-hv-9', L, 3, 'hv', 'Dæmablað 4, dæmi 4 · Verkefni 5, dæmi 4 (Riemann-heildun)', 'Fallið reiknar heildi með miðpunktsreglu. Hvað skilar síðasta línan?' + code('riemann <- function(f, u, l, k) {\n  breidd <- (u - l) / k\n  nedri  <- l + (0:(k - 1)) * breidd\n  midja  <- nedri + breidd / 2\n  return(sum(f(midja) * breidd))\n}\nriemann(function(x) x^2, 1, 0, 2)'), 0.3125, 0.0001, '',
  calc('§breidd = 0,5; neðri mörk 0 og 0,5; miðpunktar 0,25 og 0,75', '(0{,}25^2 + 0{,}75^2) \\cdot 0{,}5 = (0{,}0625 + 0{,}5625) \\cdot 0{,}5 = 0{,}3125') +
  note('Nákvæmt gildi er 1/3; skekkjan minnkar þegar k vex. Í verkefni 5 er I = ∫<sub>0</sub><sup>π</sup> x² sin x dx = π² − 4 notað.') +
  slideErr('Í dæmablaði 4 (4b-ii) stendur að reikna eigi f((u<sub>i</sub> − l<sub>i</sub>)/2). Það er hálf breidd bilsins, ekki miðja þess; miðjan er (u<sub>i</sub> + l<sub>i</sub>)/2, eins og verkefni 5 segir rétt.'), { r: true, rc: 'riemann <- function(f, u, l, k) { breidd <- (u - l) / k; nedri <- l + (0:(k - 1)) * breidd; midja <- nedri + breidd / 2; return(sum(f(midja) * breidd)) }; cat(riemann(function(x) x^2, 1, 0, 2))', rx: '0.3125' });
STEP('L00-hv-10', L, 'hv', 'Verkefni 2, dæmi 5 (gagnavinnsla)', 'Útskýrðu hvert skref í hreinsun landsframleiðslugagna Hagstofunnar (vlf_gogn.xlsx) og hvers vegna það þarf.' + ASSUME('Gagnaskráin vlf_gogn.xlsx fylgdi verkefninu og er ekki hér; spurt er um skrefin, ekki tölurnar.') +
  code('library(readxl)\nvlf_gogn <- read_excel("vlf_gogn.xlsx", range = "A1:AC4")\nvlf_gogn <- t(vlf_gogn)\ncolnames(vlf_gogn) <- vlf_gogn[1, ]\nvlf_gogn <- vlf_gogn[-1, ]\nvlf_gogn <- as.data.frame(vlf_gogn)\nplot(rownames(vlf_gogn), vlf_gogn$"Verg landsframleiðsla", type = "l")'),
  [['read_excel með range', 1, 'Les aðeins reitina A1:AC4 svo aukalínur Hagstofunnar neðst lendi ekki í gögnunum.'],
   ['t()', 1, 'Snýr töflunni: hver röð verður eitt ár og hver dálkur ein stærð. Í hráu skránni voru stærðirnar í línum og árin í dálkum.'],
   ['colnames og [-1, ]', 1, 'Fyrsta röðin geymir nöfn stærðanna; hún er gerð að dálkaheitum og síðan fjarlægð (neikvæður vísir = allt nema röð 1).'],
   ['as.data.frame og plot', 1, 't() skilar matrix; as.data.frame gerir aftur töflu þar sem $ virkar. rownames gefur árin á x-ás; type = "l" teiknar línu.']], { r: true });
STEP('L00-hv-11', L, 'hv', 'Verkefni 3, dæmi 4 (tidyverse)', 'Gjaldþrotagögn Hagstofunnar eru á breiðu sniði. Lýstu hverju skrefi og hverju það skilar.' + ASSUME('Skráin gjald.csv fylgdi verkefninu.') +
  code('gjald <- read_delim("gjald.csv", delim = ";")\ngjald <- gjald %>% pivot_longer(cols = -Atvinnugrein,\n          names_to = "Ár Landsvæði", values_to = "Gjaldþrot")\ngjald <- gjald %>% separate("Ár Landsvæði", into = c("Ár", "Landssvæði"),\n          sep = " ", extra = "merge")\ngjald <- gjald %>% filter(Atvinnugrein != "Alls", Landssvæði != "Alls")\ngjald_agg <- gjald %>% group_by(Ár, Atvinnugrein) %>%\n          summarise(Gjaldþrot = sum(Gjaldþrot))'),
  [['read_delim', 1, 'Íslenskar CSV-skrár nota ; milli reita því komman er tugabrotskil.'],
   ['pivot_longer', 1, 'Breytir breiðu sniði í langt („tidy"): einn dálkur á breytu, ein lína á mælingu. Allir dálkar nema Atvinnugrein verða að línum.'],
   ['separate', 1, 'Klýfur „Ár Landsvæði" í tvo dálka við bil; extra = "merge" heldur landsvæðum með bili (t.d. „Suðurnes og nágrenni") í einum reit.'],
   ['filter og group_by/summarise', 1, 'Fjarlægir samtölulínur („Alls") svo ekkert sé tvítalið; hópar síðan eftir ári og atvinnugrein og leggur saman.']], { r: true });
STEP('L00-hv-12', L, 'hv', 'Verkefni 4, dæmi 4 (gjaldþrot og Poisson)', 'Mánaðarleg gjaldþrot 2000–2023 eru í tveimur skrám. Lýstu vinnslunni og hvernig Poisson-líkur eru fundnar í R.' + ASSUME('Skrárnar gjaldthrot_2000_2007.xlsx og gjaldthrot_2008_2023.xlsx fylgdu verkefninu; λ ræðst af gögnunum og er því táknað λ̂ hér.') +
  code('data_first <- data_first %>% fill(year, .direction = "down")\ndata <- rbind(data_first, data_second)\nlam <- mean(data$bankruptcies)\ndpois(70, lam)\nppois(69, lam)\n1 - ppois(80, lam)'),
  [['fill og rbind', 1, 'Hagstofan skráir ár aðeins við janúar; fill(.direction = "down") fyllir inn árið fyrir hina mánuðina. rbind setur skrárnar tvær saman (sömu dálkar).'],
   ['λ̂ = meðaltal', 1, 'Fyrir Poisson er E[X] = λ, svo meðalfjöldi gjaldþrota á mánuði er eðlilegt mat á λ.'],
   ['Pr(X = 70)', 1, 'dpois(70, λ̂) er þéttleikafallið f(70).'],
   ['Færri en 70 og fleiri en 80', 2, '„Færri en 70" = Pr(X ≤ 69) = ppois(69, λ̂). „Fleiri en 80" = 1 − Pr(X ≤ 80) = 1 − ppois(80, λ̂). Gildran: ppois(70, λ̂) tæki X = 70 með.']], { r: true });
STEP('L00-hv-13', L, 'hv', 'Verkefni 6, dæmi 4 (sauðfé)', 'Þingmaður segir að ársvöxtur sauðfjár verði á næsta ári meiri en nokkru sinni áður. Lýstu hvernig hann er metinn í R ef ársvöxturinn er normaldreifður.' + ASSUME('Skráin islenskar_saudkindur.xlsx (1815–2020) fylgdi verkefninu; tölurnar sjálfar eru ekki hér.') +
  code('data$"Ársvöxtur" <- (data$"Sauðfé alls" - lag(data$"Sauðfé alls")) /\n                     lag(data$"Sauðfé alls")\nmax_growth <- max(data$"Ársvöxtur", na.rm = TRUE)\nm <- mean(data$"Ársvöxtur", na.rm = TRUE)\ns <- sd(data$"Ársvöxtur", na.rm = TRUE)\n1 - pnorm(max_growth, mean = m, sd = s)'),
  [['Ársvöxtur með lag', 1, 'lag() skilar gildi fyrra árs; vöxtur = (í ár − í fyrra)/í fyrra, geymt sem tugabrot. Fyrsta árið og ár án gagna verða NA.'],
   ['na.rm = TRUE', 1, 'max, mean og sd skila NA ef eitt gildi vantar.'],
   ['Normal-líkan', 1, 'Meðaltal og staðalfrávik (sd deilir með n − 1) eru notuð sem stikar normaldreifingarinnar.'],
   ['pnorm og ályktun', 1, 'Pr(vöxtur > hámark) = 1 − pnorm(max_growth, m, s). pnorm tekur sd, ekki dreifni. Ef líkurnar eru mjög litlar er fullyrðingin ósennileg.']], { r: true });
MCQ('L00-gl-18', L, 3, 'gl', 'Glærur 07, gl. 72', 'Hver er vídd <code>samples</code> og hvað skilar <code>apply(samples, 2, mean)</code>?' + code('samples <- replicate(10000, rexp(5, rate = 0.4))\nsample_means <- apply(samples, 2, mean)'),
  [['5 × 10000 fylki; 10000 úrtaksmeðaltöl, eitt fyrir hvert úrtak'], ['10000 × 5 fylki; 5 meðaltöl', 'replicate setur hverja endurtekningu í sinn dálk.'], ['Vektor af lengd 50000; eitt meðaltal', 'Úttak rexp(5) er vektor af lengd 5, svo replicate býr til fylki.'], ['5 × 10000 fylki; 5 meðaltöl', 'MARGIN = 2 vinnur á dálka; dálkarnir eru 10000.'], ['Listi með 10000 stökum; villa í apply', 'Úttökin eru jafnlöng, svo replicate einfaldar í fylki.']],
  note('Spurt er um víddirnar, ekki tölurnar: þær ráðast af slembidrætti. Meðaltal úrtaksmeðaltalanna nálgast 1/λ = 2,5 og dreifni þeirra 6,25/5 = 1,25.'), { r: true, rc: 's <- replicate(10000, rexp(5, rate = 0.4)); cat(dim(s), length(apply(s, 2, mean)))', rx: '5 10000 10000' });
MCQ('L00-gl-19', L, 3, 'gl', 'Glærur 07, gl. 24–25', 'Hvað sýnir <code>x_mean</code>?' + code('n_seq <- seq(1, 1000, by = 1)\nx_mean <- sapply(n_seq, function(n) mean(rbinom(n, 10, 0.4)))'),
  [['Úrtaksmeðaltöl úrtaka af stærð 1, 2, …, 1000 úr Bin(10; 0,4), sem nálgast 4 eftir því sem n vex'], ['Líkurnar Pr(X = n) fyrir n = 1, …, 1000', 'rbinom dregur slembigildi; það reiknar ekki líkur.'], ['Eitt meðaltal 1000 talna', 'sapply skilar einu gildi fyrir hvert n, alls 1000.'], ['Nákvæmlega 4 í hverju sæti', 'Meðaltal úrtaks er slembibreyta; það sveiflast um 4.'], ['Úrtaksdreifnina fyrir hvert n', 'mean reiknar meðaltal, ekki dreifni.']],
  note('Þetta er hermun lögmáls mikils fjölda: X̄ stefnir á E[X] = np = 4.') + trap('Athugasemdin í kóðanum á glæru 29 í 03 segir að rbinom reikni þéttleikafall; það hermir gildi.'));
MCQ('L00-ny-4', L, 3, 'ny', 'Ný spurning · glæra 30–31 (apply-fjölskyldan)', 'Hver er munurinn á <code>sapply(lst, f)</code> og <code>vapply(lst, f, numeric(1))</code>?',
  [['vapply krefst þess að tag og lengd hvers úttaks sé skilgreint fyrirfram og gefur villu ef fallið skilar einhverju öðru'], ['vapply skilar alltaf lista', 'Það gerir lapply.'], ['vapply vinnur á raðir fylkis', 'Það gerir apply(x, 1, f).'], ['vapply skiptir í hópa eftir þriðja inntakinu', 'Það gerir tapply(x, INDEX, f).'], ['Enginn munur; numeric(1) er hunsað', 'numeric(1) segir að hvert úttak eigi að vera ein tala.']],
  note('Á glæru 31 skila sapply(lst, sum) og vapply(lst, sum, numeric(1)) sama vektor c(15, 40).'), { r: true, rc: 'lst <- list(a = 1:5, b = 6:10); r <- tryCatch(vapply(lst, function(v) v * 2, numeric(1)), error = function(e) "villa"); cat(r)', rx: 'villa' });

CARD('L00-c1', L, 'Spjald · glæra 3', 'Hver er munurinn á þýddum og túlkuðum forritunarmálum, og hvers vegna er R gagnvirkt en hægt?',
  'Þýdd mál (C, C++, Java) eru lesin í heild og þýdd á vélarmál áður en þau keyra, sem gefur tækifæri til bestunar og meiri hraða. Túlkuð mál (R, Python, Matlab) eru lesin og keyrð línu fyrir línu. Það leyfir gagnvirka vinnu, því hægt er að keyra eina skipun í einu og skoða útkomuna. Á móti kemur að túlkurinn getur ekki beitt sömu bestun, svo „hreinn" R-kóði keyrir hægt miðað við þýdd mál.',
  ['Þýdd: allt forritið þýtt fyrst', 'Túlkuð: línu fyrir línu', 'Gagnvirkni vs hraði', 'Dæmi um hvorn flokk']);
CARD('L00-c2', L, 'Spjald · glæra 29', 'Hvers vegna mæla glærurnar með apply-föllunum (vektoruðum föllum) frekar en for-lykkjum í R?',
  'Allt í R er geymt sem fylki, og vektoruð föll framkvæma aðgerðina á öll stök í einu í stað þess að fara í gegnum þau eitt og eitt. Apply-fjölskyldan (apply, lapply, sapply, vapply, tapply, mapply) keyrir sama fallið á hvert stak, röð, dálk eða hóp. Slíkur kóði er yfirleitt hraðari í R og styttri og skýrari. Glærurnar segja að vektoruð föll séu eina leiðin til að skrifa sæmilega hröð forrit í R.',
  ['Allt í R er fylki', 'Aðgerð á öll stök í einu', 'Hraðara og skýrara en for-lykkjur', 'Hvert apply-fall gerir hvað']);
CARD('L00-c3', L, 'Spjald · glæra 16–19', 'Útskýrðu muninn á <code>y[1]</code>, <code>y[[1]]</code> og <code>y$nafn</code> þegar y er listi.',
  'Í lista skilar y[1] undirlista sem inniheldur fyrsta stakið; útkoman er því enn listi. y[[1]] skilar stakinu sjálfu, t.d. vektornum sem geymdur er í fyrsta sæti, svo hægt er að vísa áfram inn í hann með y[[1]][2]. Ef stökin hafa nöfn má nota y[["nafn"]] eða y$nafn, sem jafngildir [[ ]]. Tilvísanir byrja alltaf á 1.',
  ['[ ] skilar undirlista', '[[ ]] skilar stakinu sjálfu', '$ = [[ ]] með nafni', 'Tilvísanir byrja á 1']);
CARD('L00-c4', L, 'Spjald · glæra 33 og verkefni 2', 'Hvað er data.frame og hvers vegna þurfti að kalla á <code>as.data.frame</code> eftir <code>t()</code> í verkefni 2?',
  'data.frame er tafla þar sem hver dálkur hefur nafn og er jafnlangur, og hver dálkur getur haft sitt eigið tag (tölur, texta, factor fyrir flokkabreytur). Matrix krefst þess hins vegar að öll stök hafi sama tag. Fallið t() snýr töflunni en skilar matrix, svo dálkaheiti og $-tilvísanir virka ekki eins og áður. as.data.frame breytir henni aftur í töflu svo hægt sé að nota vlf_gogn$"Verg landsframleiðsla".',
  ['Dálkar með nöfnum og mismunandi tögum', 'Matrix: eitt tag', 't() skilar matrix', 'as.data.frame endurheimtir töfluna']);
}


// ================= L01 · Útkomurúm og líkindi =================
{ const L = 'L01', G = 'Glærur 01', D1 = 'Dæmablað 1', V2 = 'Verkefni 2';
const S1 = `${M('S = \\{1,2,3,4,5,6,7\\}')}, ${M('A = \\{1,3,5,7\\}')}, ${M('B = \\{7,4,6\\}')} og ${M('C = \\{1,4\\}')}`;
MCQ('L01-hv-1', L, 1, 'hv', D1 + ', 1e', `Látum ${S1}. Hvert er ${M('(A \\cup B)^c')}?`,
  [[M('\\{2\\}')], [M('\\{1,3,4,5,6,7\\}'), 'Það er A ∪ B sjálft; fyllimengið tekur það sem eftir er af S.'], [M('\\{2,4,6\\}'), 'Það er A<sup>c</sup>.'], [M('\\emptyset'), 'Talan 2 er hvorki í A né B.'], [M('\\{7\\}'), 'Það er A ∩ B.']],
  calc('A \\cup B = \\{1,3,4,5,6,7\\}', '(A \\cup B)^c = \\{2\\}') + note('Sama svar fæst fyrir A<sup>c</sup> ∩ B<sup>c</sup> (dæmi 1f): regla De Morgan, (A ∪ B)<sup>c</sup> = A<sup>c</sup> ∩ B<sup>c</sup>.'));
MCQ('L01-hv-2', L, 1, 'hv', D1 + ', 1c', `Látum ${S1}. Hvert er ${M('A \\cup (C \\cap B)')}?`,
  [[M('\\{1,3,4,5,7\\}')], [M('\\{1,3,5,7\\}'), 'Gleymdi C ∩ B = {4}.'], [M('\\{4\\}'), 'Það er aðeins C ∩ B.'], [M('\\{1,3,4,5,6,7\\}'), 'Tók A ∪ B í stað A ∪ (C ∩ B).'], [M('\\{1,7\\}'), 'Tók sniðmengi í stað sammengis.']],
  calc('C \\cap B = \\{4\\}', 'A \\cup \\{4\\} = \\{1,3,4,5,7\\}'));
MCQ('L01-hv-3', L, 1, 'hv', V2 + ', 1c', `Látum ${M('S = \\{1, 42, 3, 10, 7, 9\\}')}, ${M('B = \\{10, 7, 9\\}')} og ${M('C = \\{42\\}')}. Hvert er ${M('B \\cup C^c')}?`,
  [[M('\\{1, 3, 10, 7, 9\\}')], [M('\\{1, 42, 3\\}'), 'Það er B<sup>c</sup>.'], [M('\\{10, 7, 9, 42\\}'), 'Tók B ∪ C í stað B ∪ C<sup>c</sup>.'], [M('S'), '42 er hvorki í B né C<sup>c</sup>.'], [M('\\{10, 7, 9\\}'), 'B ∪ C<sup>c</sup> inniheldur líka 1 og 3.']],
  calc('C^c = \\{1, 3, 10, 7, 9\\}', 'B \\cup C^c = \\{1, 3, 10, 7, 9\\}') + note('B er hlutmengi C<sup>c</sup>, svo sammengið er C<sup>c</sup> sjálft.') + slideErr('Í lausn verkefnis 2 (1b) stendur „2, 6, 16" í textanum, en svarið B<sup>c</sup> = {1, 42, 3} er rétt.'));
PNUM('L01-hv-4', L, 1, 'hv', D1 + ', 2a', 'Þið fáið lyklakippu með 5 ómerktum lyklum að sumarbústað; einn gengur að útidyrunum. Hverjar eru líkurnar á að opna í fyrstu tilraun?', 0.2, 0.001,
  calc('\\Pr = \\frac{1}{5} = 0{,}2'));
PNUM('L01-hv-5', L, 1, 'hv', V2 + ', 2a', 'Í verðlaunakassa eru 3 plastgormar, 5 skopparaboltar og 4 dótabílar. Blíðlyndur velur eitt leikfang af handahófi. Hverjar eru líkurnar á plastgormi?', 0.25, 0.001,
  calc('\\Pr = \\frac{3}{3 + 5 + 4} = \\frac{3}{12} = 0{,}25') + trap('3/9 deilir aðeins með hinum leikföngunum.'));
PNUM('L01-hv-6', L, 1, 'hv', V2 + ', 2c', 'Í verðlaunakassa eru 3 plastgormar, 5 skopparaboltar og 4 dótabílar. Hverjar eru líkurnar á að Blíðlyndur velji skopparabolta <b>eða</b> dótabíl?', 0.75, 0.001,
  calc('\\Pr(S \\cup D) = \\Pr(S) + \\Pr(D) = \\frac{5}{12} + \\frac{4}{12} = 0{,}75') + note('Atburðirnir eru sundurlægir (eitt leikfang), svo ekkert sniðmengi er dregið frá. Sama fæst með fyllireglunni: 1 − 3/12.'));
NUM('L01-gl-1', L, 1, 'gl', G + ', gl. 24 (áleggin)', 'Pylsuvagn selur 5 álegg. Hve margar pylsur með <b>3</b> áleggjum eru í boði ef röðin skiptir ekki máli?', 10, 0, '',
  calc('C(5,3) = \\frac{5!}{3!\\,2!} = \\frac{5 \\cdot 4}{2 \\cdot 1} = 10') + trap('60 = P(5, 3) gerir ráð fyrir að röðin skipti máli.'));
NUM('L01-gl-2', L, 1, 'gl', G + ', gl. 25 (áleggin)', 'Pylsuvagn selur 5 álegg. Hve margar pylsur með 3 áleggjum eru í boði ef <b>röðin skiptir máli</b>?', 60, 0, '',
  calc('P(5,3) = \\frac{5!}{2!} = 5 \\cdot 4 \\cdot 3 = 60') + trap('10 = C(5, 3) hunsar röðina; 120 = 5! raðar öllum fimm.'));
MCQ('L01-gl-3', L, 1, 'gl', G + ', gl. 12–16', 'Hver eftirfarandi er ein af þremur <b>frumsetningum</b> líkindafalls samkvæmt glærunum?',
  [[M('\\Pr(S) = 1')], [M('\\Pr(A^c) = 1 - \\Pr(A)'), 'Fyllireglan er setning sem leidd er af frumsetningunum.'], [M('\\Pr(A \\cup B) = \\Pr(A) + \\Pr(B) - \\Pr(A \\cap B)'), 'Samlagningarreglan er setning, leidd af frumsetningunum.'], [M('\\Pr(\\emptyset) = 0'), 'Setning, ekki frumsetning.'], [M('\\Pr(A \\cap B) = \\Pr(A)\\Pr(B)'), 'Þetta er skilgreining á óhæði og gildir ekki almennt.']],
  note('Frumsetningarnar: (1) Pr(A) ≥ 0, (2) Pr(S) = 1, (3) líkur sammengis sundurlægra atburða eru summa líkindanna.'));
MCQ('L01-gl-4', L, 1, 'gl', G + ', gl. 47', 'A og B eru <b>sundurlægir</b> atburðir með Pr(A) > 0 og Pr(B) > 0. Hvað gildir?',
  [['Þeir eru háðir: ef A gerist getur B ekki gerst'], ['Þeir eru óháðir af því þeir skerast ekki', 'Algengasti misskilningurinn. Óhæði krefst Pr(A ∩ B) = Pr(A)Pr(B) > 0, en hér er Pr(A ∩ B) = 0.'], ['Ekki hægt að segja án þess að vita Pr(A) og Pr(B)', 'Pr(A)Pr(B) > 0 = Pr(A ∩ B) dugar.'], ['Pr(A ∪ B) = Pr(A)Pr(B)', 'Fyrir sundurlæga atburði er Pr(A ∪ B) = Pr(A) + Pr(B).'], ['Þeir eru óháðir ef Pr(A) + Pr(B) = 1', 'Summan skiptir ekki máli.']],
  calc('\\Pr(A \\cap B) = 0 \\neq \\Pr(A)\\Pr(B) > 0') + note('Glærurnar: sundurlægir atburðir eru fullkomlega háðir.'));
NUM('L01-hv-7', L, 1, 'hv', V2 + ', 3a', 'Í Félagi þorpara eru 5 ræningjar og 7 þjófar. Á hve marga vegu getur Svartipétur valið 3 þorpara í lið?', 220, 0, '',
  calc('C(12, 3) = \\frac{12 \\cdot 11 \\cdot 10}{3!} = 220') + trap('1320 = P(12, 3) gerir ráð fyrir röð; liðið er sama hver er valinn fyrst.'));

PNUM('L01-hv-8', L, 2, 'hv', D1 + ', 2b', 'Lyklakippa með 5 ómerktum lyklum; einn gengur. Þið prófið lykil af handahófi í hverri tilraun (sami lykill getur komið aftur). Hverjar eru líkurnar á að dyrnar opnist í <b>þriðju</b> tilraun?', 0.128, 0.001,
  calc('\\Pr = 0{,}8 \\cdot 0{,}8 \\cdot 0{,}2 = 0{,}128') + trap('0,2 eru líkurnar á að opna í einhverri einni tilraun; fyrstu tvær verða að mistakast.'));
PNUM('L01-hv-9', L, 2, 'hv', D1 + ', 2c', 'Sama lyklakippa (5 lyklar, einn réttur), en nú leggið þið prófaða lykla til hliðar. Hverjar eru líkurnar á að opna í þriðju tilraun?', 0.2, 0.001,
  calc('\\Pr = \\frac{4}{5} \\cdot \\frac{3}{4} \\cdot \\frac{1}{3} = 0{,}2') + note('Það kemur á óvart en er rökrétt: rétti lykillinn er jafnlíklegur til að vera í hvaða sæti sem er af 5.') + trap('0,8 · 0,8 · 0,2 = 0,128 á við þegar lyklar eru dregnir með endurtekningu.'));
NUM('L01-hv-10', L, 2, 'hv', D1 + ', 3a', '7 nemendur mæta í stofu með 15 sætum (3 raðir × 5). Á hve marga vegu má raða þeim í sæti?', 32432400, 0, '',
  calc('P(15, 7) = \\frac{15!}{8!} = 15 \\cdot 14 \\cdots 9 = 32\\,432\\,400') + note('Röðin skiptir máli: A í sæti 10 og B í sæti 12 er önnur röðun en öfugt.') + trap('C(15, 7) = 6.435 velur aðeins sætin, ekki hver situr hvar.'));
PNUM('L01-hv-11', L, 2, 'hv', D1 + ', 3b', '7 nemendur velja sæti af handahófi í stofu með 15 sætum (3 raðir × 5). Hverjar eru líkurnar á að allir sitji í fremstu tveimur röðunum (10 sæti)?', 604800 / 32432400, 0.0001,
  calc('\\Pr = \\frac{P(10, 7)}{P(15, 7)} = \\frac{604\\,800}{32\\,432\\,400} = 0{,}018648') + trap('(10/15)<sup>7</sup> = 0,0585 dregur sæti með endurtekningu.'));
NUM('L01-hv-12', L, 2, 'hv', D1 + ', 3c', '7 nemendur, þar af 3 BA-nemar og 4 BS-nemar; stofan hefur 3 raðir × 5 sæti. BA-nemarnir eiga allir að sitja í sömu röð og BS-nemarnir í hinum röðunum. Á hve marga vegu má raða?', 907200, 0, '',
  calc('§Velja röð fyrir BA: 3', '§Raða BA innan raðarinnar: P(5, 3) = 60', '§Raða BS í hin 10 sætin: P(10, 4) = 5.040', '3 \\cdot 60 \\cdot 5\\,040 = 907\\,200') + trap('Að gleyma að velja röðina gefur 302.400.'));
NUM('L01-hv-13', L, 2, 'hv', D1 + ', 3d', 'Úr 4 BS-nemum og 3 BA-nemum eru valdir 2 BS og 2 BA á fund með rektor. Á hve marga vegu?', 18, 0, '',
  calc('C(4,2) \\cdot C(3,2) = 6 \\cdot 3 = 18') + trap('C(7, 4) = 35 leyfir hvaða blöndu sem er; 6 + 3 = 9 leggur saman í stað þess að margfalda.'));
PNUM('L01-hv-14', L, 2, 'hv', D1 + ', 4b', 'Tryggingafélag: 20% viðskiptavina eru áhættusæknir, 50% venjulegir, 30% áhættufælnir. Líkur á tjóni á ári eru 35%, 20% og 5%. Hverjar eru líkurnar á að viðskiptavinur verði fyrir tjóni?', 0.185, 0.001,
  calc('\\Pr(t) = 0{,}2 \\cdot 0{,}35 + 0{,}5 \\cdot 0{,}2 + 0{,}3 \\cdot 0{,}05', '= 0{,}07 + 0{,}1 + 0{,}015 = 0{,}185') + note('Lögmál heildarlíkinda.') + trap('(0,35 + 0,2 + 0,05)/3 = 0,2 vegur flokkana jafnt.'));
PNUM('L01-hv-15', L, 2, 'hv', D1 + ', 4c', 'Sama tryggingafélag (20/50/30%, tjónslíkur 35/20/5%). Viðskiptavinur lendir <b>ekki</b> í tjóni á árinu. Hverjar eru líkurnar á að hann sé áhættufælinn?', 0.285 / 0.815, 0.001,
  calc('\\Pr(e) = 0{,}2 \\cdot 0{,}65 + 0{,}5 \\cdot 0{,}8 + 0{,}3 \\cdot 0{,}95 = 0{,}815', '\\Pr(f \\mid e) = \\frac{0{,}3 \\cdot 0{,}95}{0{,}815} = \\frac{0{,}285}{0{,}815} = 0{,}3497') + trap('0,95 er Pr(e | f), ekki Pr(f | e). 0,3 eru fyrirframlíkurnar.'));
NUM('L01-hv-16', L, 2, 'hv', V2 + ', 3b', 'Í Félagi þorpara eru 5 ræningjar og 7 þjófar. Á hve marga vegu má skipa nefnd með 2 ræningjum og 2 þjófum?', 210, 0, '',
  calc('C(5,2) \\cdot C(7,2) = 10 \\cdot 21 = 210') + trap('C(12, 4) = 495 tryggir ekki 2 + 2.'));
NUM('L01-hv-17', L, 2, 'hv', V2 + ', 3c', 'Nefndin velur þorpara ársins, næstmesta og þriðjamesta úr öllum 12 þorpurunum. Á hve marga vegu?', 1320, 0, '',
  calc('P(12,3) = 12 \\cdot 11 \\cdot 10 = 1320') + trap('220 = C(12, 3) hunsar að sætin eru ólík.'));
PNUM('L01-hv-18', L, 2, 'hv', V2 + ', 4a', '75% kortafærslna eru einstaklingsfærslur og 25% fyrirtækjafærslur. Kerfið merkir 2% einstaklingsfærslna og 7% fyrirtækjafærslna grunsamlegar. Hverjar eru líkurnar á að valin færsla sé merkt grunsamleg?', 0.0325, 0.0005,
  calc('\\Pr(B) = 0{,}02 \\cdot 0{,}75 + 0{,}07 \\cdot 0{,}25 = 0{,}015 + 0{,}0175 = 0{,}0325'));
PNUM('L01-hv-19', L, 2, 'hv', V2 + ', 4b', 'Sömu færslur (75/25%, merkt 2% og 7%). Færsla er merkt grunsamleg. Hverjar eru líkurnar á að hún sé fyrirtækjafærsla?', 0.0175 / 0.0325, 0.001,
  calc('\\Pr(A^c \\mid B) = \\frac{0{,}07 \\cdot 0{,}25}{0{,}0325} = \\frac{0{,}0175}{0{,}0325} = 0{,}5385') + trap('0,07 er Pr(B | A<sup>c</sup>); 0,25 eru fyrirframlíkurnar.'));
PNUM('L01-gl-5', L, 2, 'gl', G + ', gl. 45–46 (sjúkdómspróf)', 'Líkur á sjúkdómi eru 1%. Prófið er jákvætt hjá 99% sjúkra og hjá 1% heilbrigðra. Einstaklingur fær jákvætt próf. Hverjar eru líkurnar á að hann sé með sjúkdóminn?', 0.5, 0.001,
  calc('\\Pr(A \\mid B) = \\frac{0{,}01 \\cdot 0{,}99}{0{,}01 \\cdot 0{,}99 + 0{,}99 \\cdot 0{,}01} = \\frac{0{,}0099}{0{,}0198} = 0{,}5') + note('Þótt prófið sé 99% nákvæmt eru jákvæðu niðurstöðurnar jafnmargar úr hópunum tveimur, því heilbrigðir eru 99 sinnum fleiri.') + trap('0,99 er Pr(B | A).'));
PNUM('L01-gl-6', L, 2, 'gl', G + ', gl. 28–30 (afmælisvandamálið)', '10 manns eru í herbergi. Hverjar eru líkurnar á að minnst tveir eigi sama afmælisdag (365 jafnlíklegir dagar)?', 1 - PROB.perm(365, 10) / Math.pow(365, 10), 0.001,
  calc('\\Pr(A^c) = \\frac{P(365, 10)}{365^{10}} = \\frac{365 \\cdot 364 \\cdots 356}{365^{10}} = 0{,}8831', '\\Pr(A) = 1 - 0{,}8831 = 0{,}1169') + note('R: <code>1 - prod(365 - 1:10 + 1) / 365^10</code>.') + trap('C(10, 2)/365 = 0,123 er nálgun sem tvítelur.'));
NUM('L01-gl-7', L, 2, 'gl', G + ', gl. 26 (áleggin)', 'Pylsuvagn selur 5 álegg. Hve margar pylsur með <b>2 eða 3</b> áleggjum eru í boði ef röðin skiptir máli?', 80, 0, '',
  calc('P(5,2) + P(5,3) = 20 + 60 = 80') + trap('C(5, 2) + C(5, 3) = 20 hunsar röðina; 20 · 60 margfaldar í stað þess að leggja saman sundurlæg tilvik.'));
NUM('L01-gl-8', L, 2, 'gl', G + ', gl. 27 (áleggin)', 'Pylsa með 2 eða 3 áleggjum. Röð áleggjanna skiptir ekki máli, en það skiptir máli hvar pylsan sjálf er í staflanum (neðst, á milli eða efst). Hve margar útgáfur eru í boði?', 70, 0, '',
  calc('C(5,2) \\cdot 3 + C(5,3) \\cdot 4 = 10 \\cdot 3 + 10 \\cdot 4 = 70') + note('Með 2 áleggjum eru 3 staðir fyrir pylsuna; með 3 áleggjum 4 staðir.') + trap('80 er svarið þegar röð áleggjanna skiptir máli.'));
PNUM('L01-gl-9', L, 2, 'gl', G + ', gl. 39 (Logi og Hans Óli)', '60% líkur eru á að Hans Óli komi Loga ekki til aðstoðar. Líkurnar á að Hans Óli komi til aðstoðar og Logi hitti eru 20%. Hverjar eru líkurnar á að Logi hitti, að því gefnu að Hans Óli komi til aðstoðar?', 0.5, 0.001,
  calc('\\Pr(B) = 1 - 0{,}6 = 0{,}4', '\\Pr(A \\mid B) = \\frac{0{,}2}{0{,}4} = 0{,}5') + trap('0,2 er sniðmengið; að deila með 0,6 notar Pr(B<sup>c</sup>).'));
MCQ('L01-gl-10', L, 2, 'gl', G + ', gl. 48–49', 'Tveimur teningum er kastað. C = „einhver 6", D = „einhver 5". Eru C og D óháðir?',
  [['Nei: Pr(C ∩ D) = 2/36 en Pr(C)Pr(D) = 121/1296'], ['Já: hvor teningur er óháður hinum', 'Teningarnir eru óháðir, en atburðirnir C og D vísa til beggja teninga.'], ['Já: Pr(C ∩ D) = Pr(C)Pr(D) = 1/36', '1/36 er Pr(6 á fyrri og 5 á seinni); C ∩ D getur líka verið 5 á fyrri og 6 á seinni.'], ['Nei: þeir eru sundurlægir', 'Þeir geta gerst samtímis (6 og 5).'], ['Ekki hægt að svara án hermunar', 'Talning dugar.']],
  calc('\\Pr(D) = 1 - \\frac{25}{36} = \\frac{11}{36}, \\quad \\Pr(C)\\Pr(D) = \\frac{121}{1296} = 0{,}0934', '\\Pr(C \\cap D) = 2 \\cdot \\frac{1}{36} = 0{,}0556 \\neq 0{,}0934') + note('Ef C gerist (6 á öðrum teningnum) er aðeins einn teningur eftir sem getur sýnt 5, svo líkurnar á D minnka.'), { x: null });

MCQ('L01-gl-11', L, 3, 'gl', G + ', gl. 50–52 (Monty Hall)', 'Þú velur einar af þremur dyrum; bíll er bak við einar. Monty, sem veit hvar bíllinn er, opnar aðrar dyr með geit. Hverjar eru vinningslíkurnar ef þú <b>skiptir</b>?',
  [['2/3'], ['1/2', 'Algengasta villan: tvær dyr eftir, en Monty valdi ekki af handahófi. Hann opnar alltaf geitardyr.'], ['1/3', 'Það eru líkurnar ef þú heldur þig við upphaflegu dyrnar.'], ['1', 'Upphaflega valið var rétt í 1/3 tilvika; þá taparðu á að skipta.'], ['Fer eftir því hvaða dyr Monty opnar', 'Samhverfa: niðurstaðan er sú sama hvaða dyr hann opnar.']],
  calc('\\Pr(\\text{upphaflegt val rangt}) = 2/3', '§Þá eru einu lokuðu dyrnar sem eftir eru bíllinn → að skipta vinnur') + note('Glærurnar herma þetta í R með sample() og mapply(); hermunin gefur um 0,33 fyrir að halda og 0,67 fyrir að skipta.'));
STEP('L01-hv-20', L, 'hv', D1 + ', dæmi 3 (heilt)', '7 nemendur (3 BA, 4 BS) mæta í stofu með 15 sætum í 3 röðum (5 í hverri). a) Hve margar raðanir? b) Líkur á að allir sitji í fremstu tveimur röðunum? c) Fjöldi raðana ef BA-nemarnir sitja allir í sömu röð og BS í hinum? d) Á hve marga vegu má velja 2 BS og 2 BA?',
  [['a) Raðanir', 1, calc('P(15, 7) = 15!/8! = 32\\,432\\,400')], ['b) Líkur', 2, calc('\\frac{P(10, 7)}{P(15, 7)} = \\frac{604\\,800}{32\\,432\\,400} = 0{,}018648')], ['c) BA saman', 2, calc('3 \\cdot P(5, 3) \\cdot P(10, 4) = 3 \\cdot 60 \\cdot 5\\,040 = 907\\,200')], ['d) Fulltrúar', 1, calc('C(4,2) \\cdot C(3,2) = 6 \\cdot 3 = 18')]]);
STEP('L01-hv-21', L, 'hv', D1 + ', dæmi 4 (heilt)', 'Áhættusæknir 20%, venjulegir 50%, áhættufælnir 30%; tjónslíkur 35%, 20%, 5%. a) Líkur á að áhættusækinn lendi ekki í tjóni? b) Líkur á tjóni? c) Líkur á að tjónlaus viðskiptavinur sé áhættufælinn? Settu upp töflu.',
  [['Tafla samlíkinda', 1, tbl(['', 'tjón', 'ekki tjón', 'Alls'], [['sækinn', '0,07', '0,13', '0,2'], ['venjulegur', '0,10', '0,40', '0,5'], ['fælinn', '0,015', '0,285', '0,3'], ['Alls', '0,185', '0,815', '1']])],
   ['a) Fyllireglan', 1, calc('1 - 0{,}35 = 0{,}65')], ['b) Heildarlíkur', 1, calc('0{,}07 + 0{,}10 + 0{,}015 = 0{,}185')], ['c) Bayes', 2, calc('\\frac{0{,}285}{0{,}815} = 0{,}3497')]]);
PNUM('L01-ny-1', L, 3, 'ny', 'Ný spurning · afmælisvandamálið (glærur 01, gl. 28–33)', 'Hvað þarf marga til að líkurnar á sameiginlegum afmælisdegi fari yfir 50%? Reiknið líkurnar fyrir <b>n = 23</b> (365 jafnlíklegir dagar).', 1 - PROB.perm(365, 23) / Math.pow(365, 23), 0.001,
  calc('\\Pr(\\text{enginn eins}) = \\prod_{i=0}^{22} \\frac{365 - i}{365} = 0{,}4927', '\\Pr = 1 - 0{,}4927 = 0{,}5073') + note('Fyrir n = 22 eru líkurnar 0,4757, svo 23 er minnsti fjöldinn. Myndin á glæru 33 sýnir ferilinn.') + trap('23/365 = 0,063 hunsar að hvert par getur átt sama dag; pörin eru C(23, 2) = 253.'));
PNUM('L01-ny-2', L, 3, 'ny', 'Ný spurning · framhald sjúkdómsprófsins (gl. 45–46)', 'Líkur á sjúkdómi eru 1%; prófið er jákvætt hjá 99% sjúkra og 1% heilbrigðra. Einstaklingur fær jákvætt próf og fer í <b>annað</b> sams konar próf, óháð því fyrra að gefnu ástandi. Það er líka jákvætt. Hverjar eru líkurnar nú á að hann sé með sjúkdóminn?', 0.99, 0.001,
  calc('§Eftir fyrra próf: Pr(A | B<sub>1</sub>) = 0,5 (verður ný fyrirframlíkindi)', '\\Pr(A \\mid B_1, B_2) = \\frac{0{,}5 \\cdot 0{,}99}{0{,}5 \\cdot 0{,}99 + 0{,}5 \\cdot 0{,}01} = 0{,}99') + note('Eftirlíkur eins skrefs eru fyrirframlíkur þess næsta (bayesísk uppfærsla, glæra 11).') + trap('Að nota 0,01 aftur sem fyrirframlíkur gefur 0,5 aftur.'));
MCQ('L01-gl-12', L, 3, 'gl', G + ', gl. 43–44', 'Hvert er rétt form setningar Bayes fyrir sundurlæga atburði A<sub>1</sub>, …, A<sub>n</sub> sem þekja S?',
  [[M('\\Pr(A_j \\mid B) = \\frac{\\Pr(A_j)\\Pr(B \\mid A_j)}{\\sum_i \\Pr(A_i)\\Pr(B \\mid A_i)}')], [M('\\Pr(A_j \\mid B) = \\frac{\\Pr(B)\\Pr(A_j \\mid B)}{\\sum_i \\Pr(A_i)\\Pr(B \\mid A_i)}'), 'Svona stendur á glæru 43, en það er prentvilla: Pr(A<sub>j</sub> | B) birtist þá báðum megin.'], [M('\\Pr(A_j \\mid B) = \\Pr(B \\mid A_j)'), 'Að víxla skilyrðingunni er einmitt villan sem Bayes leiðréttir.'], [M('\\Pr(A_j \\mid B) = \\frac{\\Pr(A_j)\\Pr(B)}{\\Pr(B \\mid A_j)}'), 'Rangt sett saman.'], [M('\\Pr(A_j \\mid B) = \\sum_i \\Pr(A_i)\\Pr(B \\mid A_i)'), 'Það er Pr(B), lögmál heildarlíkinda.']],
  slideErr('Teljarinn á glæru 43 er Pr(B)Pr(A<sub>j</sub>|B). Réttur teljari er Pr(A<sub>j</sub>)Pr(B|A<sub>j</sub>), eins og formlega skilgreiningin á glæru 44 sýnir.'));
MCQ('L01-ny-3', L, 3, 'ny', 'Ný spurning · tafla glæru 40 (Logi og Hans Óli)', 'Pr(A ∩ B) = 0,2 (Logi hittir og Hans Óli aðstoðar), Pr(B<sup>c</sup>) = 0,6 og Pr(A) = 0,2. Hvað segir þetta um Pr(A | B<sup>c</sup>)?',
  [['Pr(A | B<sup>c</sup>) = 0: Logi hittir aldrei án aðstoðar'], ['Pr(A | B<sup>c</sup>) = 0,2', 'Það eru jaðarlíkurnar Pr(A).'], ['Pr(A | B<sup>c</sup>) = 0,5', 'Það er Pr(A | B).'], ['Pr(A | B<sup>c</sup>) = 0,6', 'Það er Pr(B<sup>c</sup>).'], ['Ekki hægt að reikna', 'Taflan fyllist út frá gefnum stærðum.']],
  calc('\\Pr(A \\cap B^c) = \\Pr(A) - \\Pr(A \\cap B) = 0{,}2 - 0{,}2 = 0', '\\Pr(A \\mid B^c) = \\frac{0}{0{,}6} = 0') + tbl(['', 'B', 'B<sup>c</sup>', ''], [['A', '0,2', '0', '0,2'], ['A<sup>c</sup>', '0,2', '0,6', '0,8'], ['', '0,4', '0,6', '1']]));
PNUM('L01-ny-4', L, 3, 'ny', 'Ný spurning · fyllireglan og óhæði', 'Fyrirtæki hefur þrjá óháða birgja sem bregðast með líkum 0,1, 0,2 og 0,3. Hverjar eru líkurnar á að <b>að minnsta kosti einn</b> bregðist?', 0.496, 0.001,
  calc('\\Pr(\\text{enginn bregst}) = 0{,}9 \\cdot 0{,}8 \\cdot 0{,}7 = 0{,}504', '\\Pr(\\text{a.m.k. einn}) = 1 - 0{,}504 = 0{,}496') + trap('0,1 + 0,2 + 0,3 = 0,6 telur tilvik þar sem fleiri en einn bregst mörgum sinnum.'));
PNUM('L01-ny-5', L, 3, 'ny', 'Ný spurning · De Morgan og óhæði', 'Pr(A) = 0,4, Pr(B) = 0,5 og Pr(A ∪ B) = 0,7. Reiknið Pr(A<sup>c</sup> ∩ B<sup>c</sup>). (Athugið svo hvort A og B eru óháðir.)', 0.3, 0.001,
  calc('\\Pr(A^c \\cap B^c) = \\Pr((A \\cup B)^c) = 1 - 0{,}7 = 0{,}3', '\\Pr(A \\cap B) = 0{,}4 + 0{,}5 - 0{,}7 = 0{,}2 = 0{,}4 \\cdot 0{,}5') + note('A og B eru óháðir, og þá eru A<sup>c</sup> og B<sup>c</sup> það líka: 0,6 · 0,5 = 0,3.') + trap('1 − Pr(A ∩ B) = 0,8 er Pr((A ∩ B)<sup>c</sup>) = Pr(A<sup>c</sup> ∪ B<sup>c</sup>), hinn helmingur reglu De Morgan.'));

CARD('L01-c1', L, 'Spjald · glæra 47', 'Hvers vegna eru sundurlægir atburðir (með jákvæðar líkur) ekki óháðir?',
  'Óháðir atburðir eru þeir þar sem Pr(A ∩ B) = Pr(A)Pr(B): vitneskja um annan breytir ekki líkunum á hinum. Sundurlægir atburðir geta ekki gerst samtímis, svo Pr(A ∩ B) = 0. Ef báðir hafa jákvæðar líkur er Pr(A)Pr(B) > 0 og skilgreiningin stenst ekki. Raunar eru þeir fullkomlega háðir: ef A gerist vitum við að B gerðist ekki.',
  ['Skilgreining óhæðis: Pr(A ∩ B) = Pr(A)Pr(B)', 'Sundurlæg: Pr(A ∩ B) = 0', 'Pr(A)Pr(B) > 0', 'Vitneskja um A útilokar B']);
CARD('L01-c2', L, 'Spjald · glæra 50–52', 'Útskýrðu með orðum hvers vegna borgar sig að skipta um dyr í Monty Hall.',
  'Upphaflega valið hittir á bílinn með líkum 1/3 og þær líkur breytast ekki þegar Monty opnar dyr, því hann getur alltaf opnað geitardyr. Í 2/3 tilvika valdirðu geit; þá neyðist Monty til að opna hina geitina og eina lokaða dyrnar sem eftir eru fela bílinn. Að skipta vinnur því nákvæmlega þegar upphaflega valið var rangt, sem er 2/3. Lykilatriðið er að Monty velur ekki af handahófi heldur með vitneskju um hvar bíllinn er.',
  ['Upphaflegt val: 1/3', 'Monty opnar alltaf geit', 'Skipti vinnur þegar fyrsta val var rangt: 2/3', 'Upplýsingar Montys eru ekki slembnar']);
CARD('L01-c3', L, 'Spjald · glæra 10–11', 'Berðu saman klassíska, mælda (empirical) og huglæga (bayesíska) skilgreiningu á líkum.',
  'Klassíska skilgreiningin telur hagstæðar útkomur og deilir með fjölda útkoma, en hún krefst þess að útkomurnar séu jafnlíklegar og að við þekkjum útkomurúmið. Mældar líkur eru hlutfall athugana þar sem atburðurinn gerðist, og þær eru yfirleitt notaðar í raunverulegum rannsóknum. Huglægar líkur byrja á fyrirframvæntingum (prior) sem eru uppfærðar með gögnum í eftirlíkur (posterior). Í öllum tilvikum þarf líkindafallið að uppfylla frumsetningarnar þrjár.',
  ['Klassískar: talning, jafnlíklegar útkomur', 'Mældar: hlutfall athugana', 'Huglægar: prior → posterior', 'Allar uppfylla frumsetningarnar']);
CARD('L01-c4', L, 'Spjald · glæra 35', 'Hvers vegna eru skilyrtar líkur Pr(· | B) sjálfar líkindafall?',
  'Skilyrtar líkur eru skilgreindar sem Pr(A | B) = Pr(A ∩ B)/Pr(B) þegar Pr(B) > 0. Þær eru alltaf ≥ 0, Pr(B | B) = 1, og fyrir sundurlæga atburði leggjast skilyrtu líkurnar saman. Þetta eru nákvæmlega frumsetningarnar, svo allar reglurnar gilda áfram innan B, til dæmis fyllireglan Pr(A<sup>c</sup> | B) = 1 − Pr(A | B). Það var einmitt notað í dæmablaði 1 (4a): 1 − 0,35 = 0,65.',
  ['Pr(A | B) = Pr(A ∩ B)/Pr(B)', 'Uppfyllir frumsetningarnar þrjár', 'B verður nýja útkomurúmið', 'Fyllireglan gildir skilyrt']);
}


// ================= L02 · Strjálar slembibreytur =================
{ const L = 'L02', G = 'Glærur 02', D2 = 'Dæmablað 2', V3 = 'Verkefni 3';
const stj = tbl(['k', '1', '2', '3', '4', '5', '6'], [['P(X = k)', '0,25', '0,25', '0,15', '0,15', '0,1', '0,1']]);
const stjF = tbl(['k', '1', '2', '3', '4', '5', '6'], [['F(k)', '0,25', '0,5', '0,65', '0,8', '0,9', '1']]);
const v3 = tbl(['k', '−10', '15', '20', '60', '100'], [['P(X = k)', '0,25', '0,1', '0,4', '0,2', '0,05']]);
const v3F = tbl(['k', '−10', '15', '20', '60', '100'], [['F(k)', '0,25', '0,35', '0,75', '0,95', '1']]);
PNUM('L02-hv-1', L, 1, 'hv', D2 + ', 1c', 'X er fjöldi stjarna sem sjást á tilteknu svæði himins:' + stj + 'Hverjar eru líkurnar á að sjá 2 stjörnur?', 0.25, 0.001, calc('\\Pr(X = 2) = f(2) = 0{,}25') + trap('F(2) = 0,5 er Pr(X ≤ 2).'));
PNUM('L02-hv-2', L, 1, 'hv', D2 + ', 1d', 'Sama stjörnudreifing:' + stj + 'Hverjar eru líkurnar á að sjá 4 eða fleiri stjörnur?', 0.35, 0.001, calc('\\Pr(X \\ge 4) = 0{,}15 + 0{,}1 + 0{,}1 = 0{,}35') + trap('Pr(X > 4) = 0,2 sleppir X = 4.'));
PNUM('L02-hv-3', L, 1, 'hv', V3 + ', 1c', 'X hefur þéttleikafallið' + v3 + 'Reiknið Pr(X &lt; 20).', 0.35, 0.001, calc('\\Pr(X < 20) = f(-10) + f(15) = 0{,}25 + 0{,}1 = 0{,}35') + trap('0,75 = F(20) tekur X = 20 með.'));
PNUM('L02-hv-4', L, 1, 'hv', V3 + ', 1d', 'Sama X:' + v3 + 'Reiknið Pr(10 ≤ X ≤ 100).', 0.75, 0.001, calc('\\Pr(10 \\le X \\le 100) = 0{,}1 + 0{,}4 + 0{,}2 + 0{,}05 = 0{,}75') + note('Aðeins gildi með jákvæðar líkur leggjast saman; 10 sjálft hefur líkur 0.'));
NUM('L02-gl-1', L, 1, 'gl', G + ', gl. 15', 'Hvert er væntigildi kasts á venjulegum teningi?', 3.5, 0.001, '', calc('E[X] = \\frac{1 + 2 + \\dots + 6}{6} = \\frac{21}{6} = 3{,}5') + note('Væntigildi þarf ekki að vera mögulegt gildi breytunnar.'));
MCQ('L02-gl-2', L, 1, 'gl', G + ', gl. 17', 'Hver eru 25% hlutfallsmörk teningakasts samkvæmt reglunni min{x : F(x) ≥ 0,25}?',
  [['2'], ['1', 'F(1) = 1/6 < 0,25.'], ['1,5', 'Brúun er aðferð fyrir flokkuð gögn, ekki regla glæranna fyrir strjálar breytur.'], ['3', 'Það er miðgildið (F(3) = 0,5).'], ['5', 'Það eru 75% hlutfallsmörkin.']],
  calc('F(1) = 1/6 \\approx 0{,}167 < 0{,}25', 'F(2) = 2/6 \\approx 0{,}333 \\ge 0{,}25'), { x: 2 });
NUM('L02-gl-3', L, 1, 'gl', G + ', gl. 37–39', 'X er hitastig í °C með E[X] = 4. Hvert er væntigildi hitans í °F, Y = 1,8X + 32?', 39.2, 0.001, '',
  calc('E[aX + b] = aE[X] + b', 'E[Y] = 1{,}8 \\cdot 4 + 32 = 39{,}2') + trap('7,2 gleymir fastanum.'));
MCQ('L02-gl-4', L, 1, 'gl', G + ', gl. 47', 'SD[X] = 3. Hvert er staðalfrávik Y = −2X + 10?',
  [['6'], ['−6', 'Staðalfrávik er aldrei neikvætt: SD[aX + b] = |a|·SD[X].'], ['36', 'Það er dreifnin, (−2)²·9.'], ['16', 'Fastinn hefur engin áhrif á dreifingu: 6 + 10 er rangt.'], ['4', 'Lagði saman −2 + 6.']],
  calc('SD[-2X + 10] = |-2| \\cdot 3 = 6'), { x: 6 });
MCQ('L02-gl-5', L, 1, 'gl', G + ', gl. 4–5 · glærur 04, gl. 5', 'Hvað gerir slembibreytu <b>strjála</b>?',
  [['Myndmengi hennar er endanlegt eða teljanlegt'], ['Hún tekur aðeins heiltölugildi', 'Glærur 04 taka fram að strjálar breytur þurfa ekki að skila náttúrulegum tölum.'], ['Hún hefur endanlega mörg gildi', 'Poisson hefur óendanlega mörg (en teljanleg) gildi og er strjál.'], ['Dreifingarfall hennar er samfellt', 'Það einkennir samfelldar breytur.'], ['Útkomurnar eru jafnlíklegar', 'Strjál dreifing getur haft ójafnar líkur.']],
  note('Strjál: teljanlegt myndmengi. Samfelld: óteljanlegt.'));

NUM('L02-hv-5', L, 2, 'hv', D2 + ', 2a', 'Stjörnudreifingin:' + stj + 'Reiknið E[X].', 2.9, 0.001, '', calc('E[X] = 1 \\cdot 0{,}25 + 2 \\cdot 0{,}25 + 3 \\cdot 0{,}15 + 4 \\cdot 0{,}15 + 5 \\cdot 0{,}1 + 6 \\cdot 0{,}1 = 2{,}9') + trap('3,5 er meðaltal gildanna og hunsar líkurnar.'));
NUM('L02-hv-6', L, 2, 'hv', D2 + ', 2b', 'Stjörnudreifingin:' + stj + 'Reiknið dreifnina Var[X].', 2.69, 0.001, '',
  calc('E[X^2] = 1 \\cdot 0{,}25 + 4 \\cdot 0{,}25 + 9 \\cdot 0{,}15 + 16 \\cdot 0{,}15 + 25 \\cdot 0{,}1 + 36 \\cdot 0{,}1 = 11{,}1', '\\mathrm{Var}[X] = 11{,}1 - 2{,}9^2 = 11{,}1 - 8{,}41 = 2{,}69') + note('Staðalfrávik: √2,69 ≈ 1,64.') + trap('11,1 er E[X²]; 1,64 er staðalfrávikið.'));
MCQ('L02-hv-7', L, 2, 'hv', D2 + ', 2c', 'Stjörnudreifingin hefur dreifingarfallið' + stjF + 'Hvert er miðgildi X?',
  [['2'], ['3,5', 'Miðjan á milli 1 og 6 hunsar líkurnar.'], ['3', 'F(2) = 0,5 ≥ 0,5 þegar.'], ['2,9', 'Það er væntigildið.'], ['2,5', 'Brúun; óþörf því F(2) er nákvæmlega 0,5.']],
  calc('F(1) = 0{,}25 < 0{,}5', 'F(2) = 0{,}5 \\ge 0{,}5 \\Rightarrow \\text{miðgildi} = 2'), { x: 2 });
NUM('L02-hv-8', L, 2, 'hv', D2 + ', 2d', 'Stjörnudreifingin:' + stjF + 'Lausn dæmablaðsins finnur 70% hlutfallsmörk með því að brúa á milli 3 og 4 („láta eins og X sé samfelld"). Hvaða gildi fæst með brúun?', 10 / 3, 0.005, '',
  calc('F(3) = 0{,}65 < 0{,}7 \\le 0{,}8 = F(4)', 'Q = 3 + \\frac{0{,}7 - 0{,}65}{0{,}8 - 0{,}65} \\cdot (4 - 3) = 3 + \\frac{1}{3} = 3{,}333') +
  unconf('Regla glæranna fyrir strjálar breytur, min{x : F(x) ≥ 0,7}, gefur 4. Lausn dæmablaðsins notar brúun og fær 3⅓. Á prófi skiptir máli hvora aðferðina kennarinn vill; spurðu kennarann. Hér er alltaf tekið fram hvor er notuð.'));
NUM('L02-hv-9', L, 2, 'hv', V3 + ', 2a', 'X hefur þéttleikafallið' + v3 + 'Reiknið E[X].', 24, 0.001, '', calc('E[X] = -10 \\cdot 0{,}25 + 15 \\cdot 0{,}1 + 20 \\cdot 0{,}4 + 60 \\cdot 0{,}2 + 100 \\cdot 0{,}05 = 24'));
NUM('L02-hv-10', L, 2, 'hv', V3 + ', 2b', 'Sama X:' + v3 + 'Reiknið Var[X].', 851.5, 0.01, '',
  calc('E[X^2] = 100 \\cdot 0{,}25 + 225 \\cdot 0{,}1 + 400 \\cdot 0{,}4 + 3600 \\cdot 0{,}2 + 10\\,000 \\cdot 0{,}05 = 1427{,}5', '\\mathrm{Var}[X] = 1427{,}5 - 24^2 = 851{,}5') + note('SD = √851,5 ≈ 29,18.') + trap('Að nota (−10)² rangt sem −100 gefur 801,5.'));
MCQ('L02-hv-11', L, 2, 'hv', V3 + ', 2c', 'X hefur dreifingarfallið' + v3F + 'Hver eru 75% hlutfallsmörk X?',
  [['20'], ['60', 'F(20) = 0,75 ≥ 0,75 dugar; ekki þarf að fara yfir.'], ['15', 'F(15) = 0,35 < 0,75.'], ['24', 'Það er væntigildið.'], ['40', 'Brúun á milli 20 og 60 er óþörf þegar F hittir p nákvæmlega.']],
  calc('F(20) = 0{,}75 \\ge 0{,}75 \\Rightarrow Q_{0,75} = 20'), { x: 20 });
MCQ('L02-hv-12', L, 2, 'hv', V3 + ', 2d', 'X hefur dreifingarfallið' + v3F + 'Hvert er miðgildi X samkvæmt formúlu glæranna, min{x : F(x) ≥ 0,5}?',
  [['20'], ['15', 'Það er svarið í lausn verkefnisins, en F(15) = 0,35 < 0,5.'], ['16,875', 'Það er brúun (samfellda aðferðin).'], ['24', 'Væntigildið.'], ['17,5', 'Mitt á milli 15 og 20.']],
  calc('F(15) = 0{,}35 < 0{,}5', 'F(20) = 0{,}75 \\ge 0{,}5 \\Rightarrow \\text{miðgildi} = 20') +
  unconf('Lausn verkefnis 3 segir að miðgildið sé 15 („gildið fyrir neðan miðjuna", eins og orðalag glæru 16). Formúlan á sömu glæru, min{x : F(x) ≥ 0,5}, gefur 20, og fyrir tening gefa báðar 3. Spurðu kennarann hvor gildir.'), { x: 20 });
NUM('L02-hv-13', L, 2, 'hv', V3 + ', 3a', 'Fjöldi sprunginna leikfanga X hefur Pr(X = x) = (x + 1)/15 fyrir x ∈ {0, 1, 2, 3, 4}. Hvert er E[X]?', 8 / 3, 0.001, '',
  calc('E[X] = 0 \\cdot \\tfrac{1}{15} + 1 \\cdot \\tfrac{2}{15} + 2 \\cdot \\tfrac{3}{15} + 3 \\cdot \\tfrac{4}{15} + 4 \\cdot \\tfrac{5}{15} = \\frac{40}{15} = 2{,}667'));
NUM('L02-hv-14', L, 2, 'hv', V3 + ', 3b', 'Pr(X = x) = (x + 1)/15 fyrir x ∈ {0, …, 4}. Hver er Var[X]?', 14 / 9, 0.001, '',
  calc('E[X^2] = \\frac{0 + 2 + 12 + 36 + 80}{15} = \\frac{130}{15} = \\frac{26}{3}', '\\mathrm{Var}[X] = \\frac{26}{3} - \\left(\\frac{8}{3}\\right)^2 = \\frac{78 - 64}{9} = \\frac{14}{9} = 1{,}556'));
NUM('L02-gl-6', L, 2, 'gl', G + ', gl. 42–43 (hlutabréfið)', 'Eftirspurn er há, miðlungs eða lág með líkum 0,2, 0,3 og 0,5, og g(há) = 5, g(mið) = 3, g(lág) = 1. Verðið er P = 20 + 2g(X). Hvert er E[P]?', 24.8, 0.001, '',
  calc('E[g(X)] = 5 \\cdot 0{,}2 + 3 \\cdot 0{,}3 + 1 \\cdot 0{,}5 = 2{,}4', 'E[P] = 20 + 2 \\cdot 2{,}4 = 24{,}8'));
NUM('L02-gl-7', L, 2, 'gl', G + ', gl. 48 (hlutabréfið)', 'Sama hlutabréf: P = 20 + 2g(X), g = 5, 3, 1 með líkum 0,2, 0,3, 0,5. Hvert er Var[P]?', 9.76, 0.001, '',
  calc('E[g(X)^2] = 25 \\cdot 0{,}2 + 9 \\cdot 0{,}3 + 1 \\cdot 0{,}5 = 8{,}2', '\\mathrm{Var}[g(X)] = 8{,}2 - 2{,}4^2 = 2{,}44', '\\mathrm{Var}[P] = 2^2 \\cdot 2{,}44 = 9{,}76') +
  slideErr('Á glæru 48 kemur 39,04: þar eru frávik P sjálfs (sem eru þegar sköluð með 2) margfölduð aftur með 4. Summa liðanna í hornklofanum, 5,408 + 0,432 + 3,92 = 9,76, er rétta svarið.') + trap('Var[P] = 2·Var[g] = 4,88 gleymir að a er í öðru veldi.'));
NUM('L02-gl-8', L, 2, 'gl', G + ', gl. 18–19 (tekjuflokkar)', 'Tekjur eru flokkaðar í 0–100þ, 100–200þ, 200–300þ og 300þ+. Dreifingarfallið er F(100) = 0,15, F(200) = 0,4 og F(300) = 0,8 (og 1 fyrir hæsta flokkinn). Finnið miðgildið með brúun, í þús. kr.', 225, 0.05, 'þús. kr.',
  calc('F(200) = 0{,}4 < 0{,}5 \\le 0{,}8 = F(300)', '\\text{miðgildi} = 200 + \\frac{0{,}5 - 0{,}4}{0{,}8 - 0{,}4} \\cdot (300 - 200) = 225') +
  slideErr('Á glæru 18 stendur (a − b) í formúlunni; það gæfi 175. Rétt er (b − a), eins og dæmið sjálft á glæru 19 reiknar.'));
NUM('L02-hv-15', L, 2, 'hv', D2 + ', 3a', 'Þið fjárfestið 600 þús. í bréfi A og 400 þús. í bréfi B. Breytingar (−5%, −1%, +1%, +5%) hafa líkur 0,15/0,55/0,2/0,1 fyrir A og 0,3/0,4/0,1/0,2 fyrir B. Hvert er væntigildi heildarfjárfestingarinnar eftir ár (í kr.)?', 993200, 1, 'kr.',
  calc('E[A_r] = 0{,}95 \\cdot 0{,}15 + 0{,}99 \\cdot 0{,}55 + 1{,}01 \\cdot 0{,}2 + 1{,}05 \\cdot 0{,}1 = 0{,}994', 'E[B_r] = 0{,}95 \\cdot 0{,}3 + 0{,}99 \\cdot 0{,}4 + 1{,}01 \\cdot 0{,}1 + 1{,}05 \\cdot 0{,}2 = 0{,}992', 'E = 600\\,000 \\cdot 0{,}994 + 400\\,000 \\cdot 0{,}992 = 596\\,400 + 396\\,800 = 993\\,200') +
  note('E[X + Y] = E[X] + E[Y] gildir hvort sem bréfin eru óháð eða ekki.') + trap('Að nota prósentubreytingarnar (−5, −1, …) í stað margfaldaranna 0,95, 0,99, … gefur væntan hagnað í prósentum, ekki verðmæti.'));

STEP('L02-hv-16', L, 'hv', D2 + ', dæmi 3 (heilt)', '600 þús. í A og 400 þús. í B, óháð. Margfaldarar 0,95/0,99/1,01/1,05 með líkum 0,15/0,55/0,2/0,1 (A) og 0,3/0,4/0,1/0,2 (B). a) Væntigildi hvorrar fjárfestingar og heildar. b) Staðalfrávik hvorrar og heildar. c) Hvað breytist ef bæði bréf ráðast að hluta af vaxtaákvörðunum Seðlabankans?',
  [['a) Væntigildi', 1, calc('E[P_A] = 596\\,400, \\quad E[P_B] = 396\\,800, \\quad E[P_A + P_B] = 993\\,200')],
   ['b) SD hvorrar', 2, calc('\\mathrm{Var}[P_A] = 600\\,000^2(E[A_r^2] - E[A_r]^2) = 239\\,040\\,000 \\Rightarrow SD = 15\\,461', '\\mathrm{Var}[P_B] = 197\\,760\\,000 \\Rightarrow SD = 14\\,063')],
   ['b) SD heildar', 1, calc('\\mathrm{Var}[P_A + P_B] = 239\\,040\\,000 + 197\\,760\\,000 = 436\\,800\\,000', 'SD = 20\\,900') + trap('15.461 + 14.063 = 29.524 er rangt: √(a + b) ≠ √a + √b.')],
   ['c) Háð bréf', 1, 'Svar a) stendur, því E[X + Y] = E[X] + E[Y] gildir alltaf. Svar b) fellur, því Var[X + Y] = Var[X] + Var[Y] gildir aðeins fyrir óháðar breytur; með samdreifni bætist 2Cov við (fyrirlestur 06).']]);
MCQ('L02-hv-17', L, 3, 'hv', D2 + ', 3c', 'Í dæminu um bréf A og B kemur í ljós að bæði ráðast að hluta af vaxtaákvörðunum Seðlabankans. Hvaða útreikningar standa óbreyttir?',
  [['Væntigildin standa; dreifni heildarinnar ekki'], ['Hvorugt stendur', 'Væntigildi summu er alltaf summa væntigilda.'], ['Bæði standa, því hvert bréf hefur sína dreifingu', 'Dreifni summu háðra breyta inniheldur samdreifniliðinn.'], ['Dreifnin stendur en ekki væntigildin', 'Öfugt.'], ['Aðeins staðalfrávik hvors bréfs um sig breytist', 'Jaðardreifing hvors bréfs er óbreytt; það er summan sem breytist.']],
  calc('E[P_A + P_B] = E[P_A] + E[P_B] \\quad \\text{(alltaf)}', '\\mathrm{Var}[P_A + P_B] = \\mathrm{Var}[P_A] + \\mathrm{Var}[P_B] + 2\\mathrm{Cov} \\quad \\text{(Cov}=\\text{0 aðeins ef óháð)}'));
STEP('L02-hv-18', L, 'hv', V3 + ', dæmi 3 (heilt)', 'Pr(X = x) = (x + 1)/15, x ∈ {0, …, 4}, og kostnaður Y = 1000X² + 2000X. a) E[X] b) Var[X] c) E[Y] d) Var[Y] og SD[Y] e) Pr(Y &gt; 10.000).',
  [['a–b) E og Var X', 1, calc('E[X] = 8/3, \\quad E[X^2] = 26/3, \\quad \\mathrm{Var}[X] = 14/9')],
   ['c) E[Y]', 1, calc('E[Y] = 1000 \\cdot \\tfrac{26}{3} + 2000 \\cdot \\tfrac{8}{3} = 14\\,000') + note('Y er línulegt í X² og X, svo línuleiki væntigildis gildir.')],
   ['d) Var[Y]', 2, tbl(['x', '0', '1', '2', '3', '4'], [['y', '0', '3.000', '8.000', '15.000', '24.000'], ['f', '1/15', '2/15', '3/15', '4/15', '5/15']]) + calc('E[Y^2] = 266\\,000\\,000', '\\mathrm{Var}[Y] = 266\\,000\\,000 - 14\\,000^2 = 70\\,000\\,000', 'SD[Y] = 8\\,367')],
   ['e) Pr(Y > 10.000)', 1, calc('\\Pr(Y > 10\\,000) = \\Pr(X \\in \\{3, 4\\}) = \\tfrac{4}{15} + \\tfrac{5}{15} = 0{,}6')]]);
NUM('L02-gl-9', L, 3, 'gl', G + ', gl. 27–28 (fjárhættuspilið)', 'Þremur teningum er kastað. Samkvæmt kóðanum á glæru 28 vinnur spilarinn 1000 kr ef summan er <b>stærri en 13</b>, annars tapar hann 100 kr. Þrjár eins tölur gefa 500 kr bónus, nema þrír ásar (enginn bónus) eða þrjár sexur (1000 kr bónus). Reiknið nákvæmt væntigildi vinningsins (í stað hermunar).', 19900 / 216, 0.01, 'kr.',
  calc('§Summa ≥ 14: 15 + 10 + 6 + 3 + 1 = 35 af 216 útkomum', '§Bónus 500: (2,2,2), (3,3,3), (4,4,4), (5,5,5); bónus 1000: (6,6,6)', 'E = \\frac{1000 \\cdot 35 - 100 \\cdot 181 + 500 \\cdot 4 + 1000 \\cdot 1}{216} = \\frac{19\\,900}{216} = 92{,}13') +
  slideErr('Textinn á glæru 27 segir „hærri en 14" en kóðinn á glæru 28 notar &gt; 13. Með „hærri en 14" (summa ≥ 15, 20 útkomur) yrði E = 3.400/216 = 15,74 kr.'));
STEP('L02-gl-10', L, 'gl', G + ', gl. 44', 'Leiðið út jafngildu formúluna fyrir dreifni, Var[X] = E[X²] − E[X]², út frá skilgreiningunni Var[X] = E[(X − E[X])²].',
  [['Útvíkka ferninginn', 1, calc('(X - E[X])^2 = X^2 - 2E[X]X + E[X]^2')],
   ['Línuleiki væntigildis', 2, calc('E[X^2 - 2E[X]X + E[X]^2] = E[X^2] - 2E[X]E[X] + E[X]^2') + note('E[X] er fasti, svo E[E[X]X] = E[X]·E[X] og E[E[X]²] = E[X]².')],
   ['Einfalda', 1, calc('= E[X^2] - 2E[X]^2 + E[X]^2 = E[X^2] - E[X]^2')]]);
MCQ('L02-ny-1', L, 3, 'ny', 'Ný spurning · ójafna Jensens (gl. 45–46)', 'Fyrir stjörnudreifinguna (E[X] = 2,9) er E[X²] = 11,1. Hvað segir ójafna Jensens um g(x) = x²?',
  [['g er kúpt, svo E[X²] ≥ (E[X])²; hér 11,1 ≥ 8,41, og mismunurinn er dreifnin'], ['g er hvelft, svo E[X²] ≤ (E[X])²', 'x² er kúpt (sveigir upp).'], ['E[X²] = (E[X])² því væntigildi er línulegt', 'Línuleiki gildir aðeins fyrir línuleg föll.'], ['Ójafnan á ekki við strjálar breytur', 'Hún gildir um allar slembibreytur.'], ['E[X²] ≥ (E[X])² gildir aðeins ef X ≥ 0', 'Hún gildir alltaf, því Var[X] ≥ 0.']],
  calc('E[X^2] - E[X]^2 = 11{,}1 - 8{,}41 = 2{,}69 = \\mathrm{Var}[X] \\ge 0'));
NUM('L02-ny-2', L, 3, 'ny', 'Ný spurning · skeifni (gl. 25)', 'Reiknið skeifni stjörnudreifingarinnar (E[X] = 2,9, SD[X] = √2,69):' + stj, 2.208 / Math.pow(2.69, 1.5), 0.002, '',
  calc('E[(X - 2{,}9)^3] = (-1{,}9)^3 \\cdot 0{,}25 + (-0{,}9)^3 \\cdot 0{,}25 + 0{,}1^3 \\cdot 0{,}15 + 1{,}1^3 \\cdot 0{,}15 + 2{,}1^3 \\cdot 0{,}1 + 3{,}1^3 \\cdot 0{,}1 = 2{,}208', '\\mathrm{Skew}[X] = \\frac{2{,}208}{2{,}69^{3/2}} = \\frac{2{,}208}{4{,}412} = 0{,}5005') +
  note('Jákvæð skeifni: hali til hægri. Miðgildið (2) er líka lægra en væntigildið (2,9).') + trap('Að deila með dreifninni 2,69 í stað SD³ gefur 0,82.'));

CARD('L02-c1', L, 'Spjald · glæra 16', 'Hvers vegna er miðgildi stundum betri lýsing en væntigildi, og hvenær víkja þau hvort frá öðru?',
  'Miðgildið er það gildi sem helmingur líkindanna liggur fyrir neðan, svo fá en mjög stór gildi hafa nánast engin áhrif á það. Væntigildið er vegið meðaltal og dregst í átt að útlögum. Í skökkum dreifingum, eins og tekjudreifingum, er væntigildið því hærra en miðgildið þegar halinn er til hægri. Í samhverfum dreifingum falla þau saman.',
  ['Miðgildi: F(x) ≥ 0,5', 'Ekki viðkvæmt fyrir útlögum', 'Væntigildi dregst að halanum', 'Skeifni ræður bilinu á milli']);
CARD('L02-c2', L, 'Spjald · glæra 47–49', 'Hvers vegna er væntigildi línuleg aðgerð en dreifni ekki?',
  'Væntigildi er vegið meðaltal, svo E[aX + b] = aE[X] + b og E[X + Y] = E[X] + E[Y] gildir alltaf, líka fyrir háðar breytur. Dreifni mælir frávik í öðru veldi, svo fasti a kemur út í öðru veldi: Var[aX + b] = a²Var[X], og fastinn b hverfur. Fyrir summur bætist samdreifniliður við, svo Var[X + Y] = Var[X] + Var[Y] gildir aðeins fyrir óháðar breytur. Staðalfrávik leggjast aldrei saman.',
  ['E[aX + b] = aE[X] + b', 'Var[aX + b] = a²Var[X]', 'Var[X + Y] með samdreifni', 'SD leggjast ekki saman']);
CARD('L02-c3', L, 'Spjald · glæra 25–26', 'Hvað lýsa skeifni og ferilris, og hvers vegna eru þau stöðluð með staðalfrávikinu?',
  'Skeifni er þriðja staðlaða vægið og mælir hvort dreifingin er skökk: jákvæð skeifni þýðir hala til hægri, neikvæð til vinstri og 0 fyrir samhverfa dreifingu. Ferilris er fjórða staðlaða vægið og lýsir hve brött dreifingin er, eða hve gjörn hún er á útlaga. Bæði eru reiknuð af (X − E[X])/SD[X] svo þau verði óháð mælieiningum. Normaldreifingin hefur skeifni 0 og ferilris 3.',
  ['Skeifni: þriðja vægi, halaátt', 'Ferilris: fjórða vægi, útlagar', 'Stöðluð → óháð einingum', 'Normal: 0 og 3']);
CARD('L02-c4', L, 'Spjald · glæra 45–46', 'Hvað segir ójafna Jensens og hvers vegna skiptir hún máli í hagfræði?',
  'Almennt er E[g(X)] ≠ g(E[X]) nema g sé línulegt. Ef g er kúpt er E[g(X)] ≥ g(E[X]), og ef g er hvelft er E[g(X)] ≤ g(E[X]). Dæmi: x² er kúpt og E[X²] − E[X]² er dreifnin, sem er alltaf ≥ 0. Í hagfræði er nytjafall áhættufælins einstaklings hvelft, svo vænt nyt óvissrar fjárhæðar er minni en nyt væntu fjárhæðarinnar.',
  ['E[g(X)] ≠ g(E[X]) almennt', 'Kúpt: ≥; hvelft: ≤', 'x² → dreifnin ≥ 0', 'Hvelft nytjafall = áhættufælni']);
}


// ================= L03 · Strjálar dreifingar =================
{ const L = 'L03', G = 'Glærur 03', D3 = 'Dæmablað 3', V4 = 'Verkefni 4';
const db = (k, n, p) => PROB.dbinom(k, n, p), dp = (k, l) => PROB.dpois(k, l);
const pDJ = 166 / 252;
NUM('L03-gl-1', L, 1, 'gl', G + ', gl. 5–7', 'X er Bernoulli-dreifð með p = 0,22. Hver er dreifni X?', 0.22 * 0.78, 0.0001, '',
  calc('\\mathrm{Var}[X] = p(1 - p) = 0{,}22 \\cdot 0{,}78 = 0{,}1716') + trap('0,22 er væntigildið; √0,1716 = 0,414 er staðalfrávikið.'));
NUM('L03-hv-1', L, 1, 'hv', V4 + ', 2b', 'Líkur á að einstaklingur með líkamsræktarkort mæti einu sinni eða oftar í mánuði eru 40%. X = fjöldi mánaða af 12 sem hann mætir, tvíkostadreift. Hvert er E[X]?', 4.8, 0.001, '',
  calc('E[X] = np = 12 \\cdot 0{,}4 = 4{,}8'));
NUM('L03-hv-2', L, 1, 'hv', V4 + ', 2c', 'X ~ Bin(12; 0,4) (mánuðir sem mætt er í ræktina). Hver er Var[X]?', 2.88, 0.001, '',
  calc('\\mathrm{Var}[X] = np(1 - p) = 12 \\cdot 0{,}4 \\cdot 0{,}6 = 2{,}88') + trap('4,8 er væntigildið.'));
MCQ('L03-hv-3', L, 1, 'hv', V4 + ', 1a–b', 'Að jafnaði verða 3,5 stórir jarðskjálftar á mánuði og fjöldinn F er Poisson-dreifður. Hver er dreifni F?',
  [['3,5'], ['1,87', 'Það er staðalfrávikið √3,5.'], ['12,25', 'λ²; fyrir Poisson er Var = λ.'], ['0,286', '1/λ á við meðalbiðtíma í veldisdreifingu.'], ['Ekki hægt að vita án gagna', 'Poisson-dreifing er alveg ákvörðuð af λ.']],
  calc('E[F] = \\mathrm{Var}[F] = \\lambda = 3{,}5'), { x: 3.5 });
PNUM('L03-gl-2', L, 1, 'gl', G + ', gl. 50–51 (uppsagnir)', 'Að meðaltali er 2 sagt upp á mánuði (Poisson). Hverjar eru líkurnar á að engum sé sagt upp næsta mánuð?', Math.exp(-2), 0.0005,
  calc('\\Pr(X = 0) = \\frac{e^{-2} 2^0}{0!} = e^{-2} = 0{,}1353'));
PNUM('L03-gl-3', L, 1, 'gl', G + ', gl. 51 (uppsagnir)', 'λ = 2 uppsagnir á mánuði. Hverjar eru líkurnar á að nákvæmlega einum sé sagt upp?', 2 * Math.exp(-2), 0.0005,
  calc('\\Pr(X = 1) = \\frac{e^{-2} 2^1}{1!} = 2e^{-2} = 0{,}2707'));
PNUM('L03-gl-4', L, 1, 'gl', G + ', gl. 20–22 (hlutabréfið)', 'Hlutabréf hækkar um 1 kr. (p = 0,4) eða lækkar um 1 kr. á dag, óháð milli daga. Hverjar eru líkurnar á að það sé 3 kr. hærra eftir 3 daga?', 0.064, 0.0005,
  calc('\\Pr(X = 3) = \\binom{3}{3} 0{,}4^3 \\, 0{,}6^0 = 0{,}064'));
PNUM('L03-hv-4', L, 1, 'hv', V4 + ', 3a', 'Framkvæmdastjóri metur að 5% viðskiptavina séu óánægðir. Hverjar eru líkurnar á að fyrsti viðskiptavinurinn sem Goggi hittir sé ánægður?', 0.95, 0.001, calc('1 - 0{,}05 = 0{,}95'));
MCQ('L03-hv-5', L, 1, 'hv', V4 + ', 3b', 'Goggi spyr 10 viðskiptavini af handahófi; 5% eru óánægðir. H = fjöldi ánægðra. Hvaða dreifingu fylgir H?',
  [['Bin(n = 10, p = 0,95)'], ['Bin(n = 10, p = 0,05)', 'Það er dreifing fjölda óánægðra.'], ['Poisson(λ = 0,5)', 'Fastur fjöldi tilrauna (10) með sömu líkum: tvíkostadreifing.'], ['Bernoulli(p = 0,95)', 'Bernoulli lýsir einni tilraun.'], ['Jöfn dreifing á {0, …, 10}', 'Gildin eru ekki jafnlíkleg.']],
  note('Óháðar tilraunir (valdir af handahófi), fastur fjöldi og sömu líkur: tvíkostadreifing.'));
PNUM('L03-hv-6', L, 1, 'hv', D3 + ', 1a', 'Dow Jones hefur hækkað 166 af síðustu 252 dögum. Ef þeir dagar eru dæmigerðir, hverjar eru líkurnar á hækkun á morgun?', pDJ, 0.0005, calc('\\hat{p} = \\frac{166}{252} = 0{,}6587') + note('Mældar líkur (empirical).'));

PNUM('L03-hv-7', L, 2, 'hv', D3 + ', 1b', 'p = 166/252 og dagar óháðir. Hverjar eru líkurnar á að Dow Jones hækki næstu 5 daga?', Math.pow(pDJ, 5), 0.0005, calc('\\Pr(X = 5) = 0{,}6587^5 = 0{,}1240'));
PNUM('L03-hv-8', L, 2, 'hv', D3 + ', 1c', 'p = 166/252. Hverjar eru líkurnar á að Dow Jones hækki 4 daga af næstu 10?', db(4, 10, pDJ), 0.0005,
  calc('\\Pr(X = 4) = \\binom{10}{4} 0{,}6587^4 \\, 0{,}3413^6 = 210 \\cdot 0{,}18829 \\cdot 0{,}001580 = 0{,}06247') + trap('Að sleppa C(10, 4) = 210 gefur 0,0003.'));
PNUM('L03-hv-9', L, 2, 'hv', D3 + ', 1d', 'p = 166/252. Hverjar eru líkurnar á að Dow Jones hækki <b>færri en</b> 4 daga af næstu 10?', PROB.pbinom(3, 10, pDJ), 0.0005,
  calc('\\Pr(X < 4) = F(3) = f(0) + f(1) + f(2) + f(3)', '= 0{,}000021 + 0{,}000414 + 0{,}003593 + 0{,}018492 = 0{,}02252') + trap('F(4) = 0,0850 tekur X = 4 með.'));
PNUM('L03-hv-10', L, 2, 'hv', D3 + ', 2a', 'Stjórnmálafræðingur telur 60% líkur á sigri A. Ef það er rétt, hverjar eru líkurnar á að 3 af 9 könnunum spái A sigri?', db(3, 9, 0.6), 0.0005,
  calc('\\Pr(X = 3) = \\binom{9}{3} 0{,}6^3 \\, 0{,}4^6 = 84 \\cdot 0{,}216 \\cdot 0{,}004096 = 0{,}07432'));
PNUM('L03-hv-11', L, 2, 'hv', D3 + ', 2d', 'Nú eru kannanirnar 14 og 6 spá A sigri. Hverjar eru líkurnar á því ef p = 0,6?', db(6, 14, 0.6), 0.0005,
  calc('\\Pr(X = 6) = \\binom{14}{6} 0{,}6^6 \\, 0{,}4^8 = 3003 \\cdot 0{,}046656 \\cdot 0{,}000655 = 0{,}09182'));
PNUM('L03-hv-12', L, 2, 'hv', D3 + ', 3a', 'Þið fáið að jafnaði 4 kvefpestir á ári (Poisson). Hverjar eru líkurnar á 5 pestum á þessu ári?', dp(5, 4), 0.0005,
  calc('\\Pr(X = 5) = \\frac{e^{-4} 4^5}{5!} = 0{,}1563'));
PNUM('L03-hv-13', L, 2, 'hv', D3 + ', 3b', 'λ = 4 kvefpestir á ári. Hverjar eru líkurnar á 3, 4 eða 5 pestum?', dp(3, 4) + dp(4, 4) + dp(5, 4), 0.0005,
  calc('f(3) + f(4) + f(5) = 0{,}1954 + 0{,}1954 + 0{,}1563 = 0{,}5470') + note('f(3) = f(4) þegar λ = 4, því 4<sup>4</sup>/4! = 4<sup>3</sup>/3!.'));
PNUM('L03-hv-14', L, 2, 'hv', D3 + ', 3c', 'λ = 4 kvefpestir á ári, óháð milli ára. Hverjar eru líkurnar á nákvæmlega 4 pestum á næstu <b>tveimur</b> árum?', dp(4, 8), 0.0005,
  calc('\\lambda_{2\\text{ ár}} = 4 + 4 = 8', '\\Pr(X = 4) = \\frac{e^{-8} 8^4}{4!} = 0{,}05725') + trap('Með λ = 4 fæst 0,1954: λ skalað á rangt tímabil.'));
PNUM('L03-hv-15', L, 2, 'hv', V4 + ', 1c', 'λ = 3,5 stórir jarðskjálftar á mánuði. Hverjar eru líkurnar á 5 stórum skjálftum í mánuði?', dp(5, 3.5), 0.0005,
  calc('\\Pr(F = 5) = \\frac{3{,}5^5 e^{-3{,}5}}{5!} = \\frac{525{,}22 \\cdot 0{,}030197}{120} = 0{,}1322'));
PNUM('L03-hv-16', L, 2, 'hv', V4 + ', 1d', 'λ = 3,5 stórir skjálftar á mánuði. Hverjar eru líkurnar á <b>fleiri en 2</b>?', 1 - PROB.ppois(2, 3.5), 0.0005,
  calc('\\Pr(F > 2) = 1 - [f(0) + f(1) + f(2)]', '= 1 - e^{-3{,}5}(1 + 3{,}5 + 6{,}125) = 1 - 0{,}3208 = 0{,}6792') + note('Lausn verkefnisins námundar millireikninga og fær ≈ 0,68.') + trap('1 − F(3) = 0,4634 sleppir F = 3.'));
PNUM('L03-hv-17', L, 2, 'hv', V4 + ', 2d', 'X ~ Bin(12; 0,4). Hverjar eru líkurnar á að einstaklingur mæti einu sinni eða tvisvar á árinu (í mánuðum talið)?', db(1, 12, 0.4) + db(2, 12, 0.4), 0.0005,
  calc('\\Pr(X = 1) = 12 \\cdot 0{,}4 \\cdot 0{,}6^{11} = 0{,}01741', '\\Pr(X = 2) = 66 \\cdot 0{,}4^2 \\cdot 0{,}6^{10} = 0{,}06385', '\\Pr = 0{,}01741 + 0{,}06385 = 0{,}0813') + note('Lausnin námundar í 0,017 + 0,064 = 0,081.'));
PNUM('L03-hv-18', L, 2, 'hv', V4 + ', 3c', 'H ~ Bin(10; 0,95). Hverjar eru líkurnar á að nákvæmlega 8 af 10 séu ánægðir?', db(8, 10, 0.95), 0.0005,
  calc('\\Pr(H = 8) = \\binom{10}{8} 0{,}95^8 \\, 0{,}05^2 = 45 \\cdot 0{,}6634 \\cdot 0{,}0025 = 0{,}0746') + note('Í lausninni er þessi liður merktur b) og reiknaður sem „2 óánægðir", sem er sami atburður.'));
PNUM('L03-hv-19', L, 2, 'hv', V4 + ', 3d', 'H ~ Bin(10; 0,95). Reiknið Pr(7 ≤ H ≤ 9).', db(7, 10, 0.95) + db(8, 10, 0.95) + db(9, 10, 0.95), 0.0005,
  calc('\\Pr(H = 7) = 0{,}0105, \\; \\Pr(H = 8) = 0{,}0746, \\; \\Pr(H = 9) = 0{,}3151', '\\Pr(7 \\le H \\le 9) = 0{,}4002') + trap('Pr(H ≤ 9) = 0,4013 tekur H = 0, …, 6 með.'));
PNUM('L03-gl-5', L, 2, 'gl', G + ', gl. 23 (hlutabréfið)', 'Hlutabréf hækkar um 1 kr. (p = 0,4) eða lækkar um 1 kr. á dag. Hverjar eru líkurnar á að það hafi <b>hækkað</b> eftir 3 daga?', 0.352, 0.0005,
  calc('§Hækkað ⇔ X ≥ 2 hækkunardagar (breyting 2X − 3 > 0)', '\\Pr(X \\ge 2) = 3 \\cdot 0{,}4^2 \\cdot 0{,}6 + 0{,}4^3 = 0{,}288 + 0{,}064 = 0{,}352') +
  slideErr('Á glæru 23 stendur „Pr(X &gt; 0) = Pr(X = 1) + Pr(X = 3)", en reiknuðu liðirnir eru Pr(X = 2) og Pr(X = 3). Talan 0,352 er rétt.') + trap('Pr(X ≥ 1) = 0,784 telur með daga þar sem verðið endar lægra (einn upp, tveir niður).'));
PNUM('L03-gl-6', L, 2, 'gl', G + ', gl. 23 (hlutabréfið)', 'Sama hlutabréf (p = 0,4). Hverjar eru líkurnar á að það hafi hækkað eftir <b>2</b> daga?', 0.16, 0.0005,
  calc('§Eftir 2 daga þarf 2 hækkanir (einn upp og einn niður gefur sama verð)', '\\Pr(X = 2) = 0{,}4^2 = 0{,}16') + slideErr('Glæran merkir þetta Pr(X &gt; 0 | N = 2), en X = 1 gefur óbreytt verð; atburðurinn er X = 2.'));
PNUM('L03-gl-7', L, 2, 'gl', G + ', gl. 52 (uppsagnir)', 'λ = 2 uppsagnir á mánuði. Hverjar eru líkurnar á að 2, 3 eða 4 sé sagt upp?', dp(2, 2) + dp(3, 2) + dp(4, 2), 0.0005,
  calc('\\Pr(2 \\le X \\le 4) = e^{-2}\\left(\\frac{2^2}{2!} + \\frac{2^3}{3!} + \\frac{2^4}{4!}\\right) = e^{-2}(2 + 1{,}333 + 0{,}667) = 4e^{-2} = 0{,}5413') +
  slideErr('Á glæru 52 stendur ≈ 0,676; það er í raun Pr(X ≤ 2). Rétt summa liðanna er 0,541.'));
PNUM('L03-gl-8', L, 2, 'gl', G + ', gl. 22 (hlutabréfið)', 'Sama hlutabréf (p = 0,4). Hverjar eru líkurnar á að það sé 3 kr. <b>lægra</b> eftir 3 daga?', 0.216, 0.0005,
  calc('\\Pr(X = 0) = 0{,}6^3 = 0{,}216') + slideErr('Önnur leiðin á glæru 22 er skrifuð „1 − 0,432 + 0,288 + 0,064"; svigana vantar: 1 − (0,432 + 0,288 + 0,064) = 0,216.'));

PNUM('L03-hv-20', L, 3, 'hv', D3 + ', 1e', 'p = 166/252 og dagar óháðir. Hverjar eru líkurnar á að Dow Jones hækki að minnsta kosti <b>2 daga í röð</b> á næstu 4 dögum?', Math.pow(pDJ, 4) + 4 * Math.pow(pDJ, 3) * (1 - pDJ) + 3 * pDJ * pDJ * Math.pow(1 - pDJ, 2), 0.001,
  calc('§Raðir með „11" einhvers staðar: 1111; 1110, 1101, 1011, 0111; 1100, 0110, 0011', '\\Pr = p^4 + 4p^3q + 3p^2q^2 = 0{,}1883 + 4 \\cdot 0{,}09755 + 3 \\cdot 0{,}05054 = 0{,}7301') +
  note('Röðin skiptir máli, svo þetta er ekki tvíkostadreifing. Til samanburðar: Pr(X = 2) = 0,3032 (nákvæmlega 2 dagar, hvar sem er).') + trap('1101 og 1011 innihalda „11"; 1010 og 0101 ekki.'));
PNUM('L03-hv-21', L, 3, 'hv', D3 + ', 3d', 'Þið fáið að jafnaði 4 kvefpestir á ári (Poisson). Lyf helmingar tíðnina en virkar aðeins fyrir 80% fólks. Þið takið það og fáið <b>ekkert</b> kvef á árinu. Hverjar eru líkurnar á að lyfið virki fyrir ykkur?', 0.8 * Math.exp(-2) / (0.8 * Math.exp(-2) + 0.2 * Math.exp(-4)), 0.001,
  calc('\\Pr(0 \\mid \\text{virkar}) = e^{-2} = 0{,}13534, \\quad \\Pr(0 \\mid \\text{virkar ekki}) = e^{-4} = 0{,}01832', '\\Pr(0) = 0{,}8 \\cdot 0{,}13534 + 0{,}2 \\cdot 0{,}01832 = 0{,}11193', '\\Pr(\\text{virkar} \\mid 0) = \\frac{0{,}10827}{0{,}11193} = 0{,}9673') + trap('0,8 eru fyrirframlíkurnar; e<sup>−2</sup> er Pr(0 | virkar).'));
MCQ('L03-hv-22', L, 3, 'hv', D3 + ', 2e', 'Í 14 könnunum spá 6 A sigri. Reiknið Pr(X = 6) fyrir p = 0,4, 0,5 og 0,6. Hvaða p gerir gögnin líklegust?',
  [['p = 0,4 (Pr = 0,2066)'], ['p = 0,5 (Pr = 0,1833)', 'Lægri líkur en við p = 0,4.'], ['p = 0,6 (Pr = 0,0918)', 'Lægstu líkurnar af þremur.'], ['Öll jafnlíkleg', 'Líkurnar eru ólíkar.'], ['p = 6/14 er ekki á listanum, svo ekkert þeirra', 'Spurt er hvert hinna þriggja sé best; 0,4 er næst 6/14 = 0,43.']],
  calc('\\Pr(X = 6 \\mid p) = \\binom{14}{6}p^6(1-p)^8', '§p = 0,4: 0,2066 · p = 0,5: 0,1833 · p = 0,6: 0,0918') + note('Þetta er hugmyndin að sennileikametli (maximum likelihood), sem kemur síðar í námskeiðinu.'));
MCQ('L03-hv-23', L, 3, 'hv', D3 + ', 2b', 'X ~ Bin(9; 0,6) er fjöldi kannana sem spá A sigri. Hvert er <b>líklegasta gildi</b> X?',
  [['5 og 6, jafnlíkleg (Pr ≈ 0,2508 hvort)'], ['5,4', 'Það er væntigildið np. Lausn dæmablaðsins segir að líklegasta gildið sé væntigildið, en 5,4 er ekki einu sinni mögulegt gildi.'], ['6 eitt og sér', 'Pr(X = 5) = Pr(X = 6).'], ['5 eitt og sér', 'Pr(X = 6) er jafnstórt.'], ['9', 'Pr(X = 9) = 0,6⁹ = 0,0101.']],
  calc('\\Pr(X = 5) = 126 \\cdot 0{,}6^5 \\cdot 0{,}4^4 = 0{,}25082', '\\Pr(X = 6) = 84 \\cdot 0{,}6^6 \\cdot 0{,}4^3 = 0{,}25082') +
  note('Líklegasta gildið (toppgildi, mode) er ekki það sama og væntigildið. Fyrir Bin(n, p) er það ⌊(n + 1)p⌋; hér er (n + 1)p = 6 heiltala og þá eru tvö toppgildi, 5 og 6.') + unconf('Lausn dæmablaðs 3 (2b) svarar 5,4. Rökin í 2c standa samt: 3 af 9 er langt frá líklegustu gildunum.'));
STEP('L03-gl-9', L, 'gl', G + ', gl. 44–45', 'Sýnið að E[X] = λ fyrir X ~ Poisson(λ).',
  [['Skilgreining', 1, calc('E[X] = \\sum_{x=0}^{\\infty} x \\frac{e^{-\\lambda}\\lambda^x}{x!}')],
   ['Fella x = 0 og stytta', 1, calc('= \\sum_{x=1}^{\\infty} \\frac{e^{-\\lambda}\\lambda^x}{(x-1)!} = \\lambda e^{-\\lambda} \\sum_{x=1}^{\\infty} \\frac{\\lambda^{x-1}}{(x-1)!}') + note('Liðurinn fyrir x = 0 er 0, og x/x! = 1/(x − 1)!.')],
   ['Veldaröð e<sup>λ</sup>', 2, calc('k = x - 1: \\; \\sum_{k=0}^{\\infty} \\frac{\\lambda^k}{k!} = e^{\\lambda}', 'E[X] = \\lambda e^{-\\lambda} e^{\\lambda} = \\lambda')]]);
STEP('L03-gl-10', L, 'gl', G + ', gl. 46–49', 'Sýnið að Var[X] = λ fyrir X ~ Poisson(λ) (þið megið nota E[X] = λ).',
  [['E[X²] sett upp', 1, calc('E[X^2] = \\sum_{x=1}^{\\infty} x \\frac{e^{-\\lambda}\\lambda^x}{(x-1)!} = \\lambda e^{-\\lambda} \\sum_{x=1}^{\\infty} x \\frac{\\lambda^{x-1}}{(x-1)!}')],
   ['Skipta x = (x − 1) + 1', 2, calc('= \\lambda e^{-\\lambda}\\left(\\lambda\\sum_{x=2}^{\\infty}\\frac{\\lambda^{x-2}}{(x-2)!} + \\sum_{x=1}^{\\infty}\\frac{\\lambda^{x-1}}{(x-1)!}\\right) = \\lambda e^{-\\lambda}(\\lambda e^{\\lambda} + e^{\\lambda})', 'E[X^2] = \\lambda^2 + \\lambda')],
   ['Dreifnin', 1, calc('\\mathrm{Var}[X] = \\lambda^2 + \\lambda - \\lambda^2 = \\lambda')]]);
MCQ('L03-gl-11', L, 3, 'gl', G + ', gl. 26', 'X ~ Bin(5; 0,3) og Y ~ Bin(8; 0,6) eru óháðar. Hvað gildir um X + Y?',
  [['X + Y er ekki tvíkostadreifð, því p er ólíkt; E[X + Y] = 1,5 + 4,8 = 6,3 stendur samt'], ['X + Y ~ Bin(13; 0,45)', 'Reglan X + Y ~ Bin(n₁ + n₂, p) krefst sama p; meðaltal p-anna er ekki stiki neinnar tvíkostadreifingar hér.'], ['X + Y ~ Bin(13; 0,9)', 'Líkurnar leggjast ekki saman.'], ['X + Y ~ Poisson(6,3)', 'Engin Poisson-nálgun á við hér.'], ['E[X + Y] er ekki skilgreint', 'Væntigildi summu er alltaf summa væntigilda.']],
  calc('E[X + Y] = 5 \\cdot 0{,}3 + 8 \\cdot 0{,}6 = 6{,}3', '\\mathrm{Var}[X + Y] = 1{,}05 + 1{,}92 = 2{,}97 \\neq 13 \\cdot 0{,}45 \\cdot 0{,}55 = 3{,}22') + note('Ef X + Y væri Bin(13; 0,45) þyrfti dreifnin að vera 3,22; hún er 2,97.'));
MCQ('L03-hv-24', L, 3, 'hv', V4 + ', 3e', 'Af 10 viðskiptavinum reyndust 3 óánægðir; framkvæmdastjórinn segir 5%. Hvaða líkur eru eðlilegasti mælikvarðinn á hve ósennileg slík niðurstaða er ef hún hefur rétt fyrir sér?',
  [['Pr(3 eða fleiri óánægðir) = Pr(H ≤ 7) ≈ 0,0115'], ['Pr(H = 7) ≈ 0,0105 eitt og sér', 'Lausnin notar það, en eins öfgafullar eða öfgafyllri niðurstöður eiga allar að teljast með. Hér er munurinn lítill.'], ['Pr(H ≥ 7) ≈ 0,9990', 'Röng átt: það eru líkurnar á 3 eða færri óánægðum.'], ['0,05', 'Það er hlutfallið sem verið er að prófa, ekki líkurnar á gögnunum.'], ['3/10 = 0,3', 'Mælt hlutfall, ekki líkur á gögnunum.']],
  calc('\\Pr(H \\le 7) = \\sum_{h=0}^{7}\\binom{10}{h}0{,}95^h0{,}05^{10-h} = 0{,}0115') + note('Þessi hugsun, að reikna líkurnar á jafn öfgafullum gögnum ef fullyrðingin er sönn, er grunnurinn að tilgátuprófum í fyrirlestri 07 og síðar.'));
PNUM('L03-gl-12', L, 3, 'gl', G + ', gl. 32–42', 'Í 1000 óháðum færslum er hver gölluð með líkum 0,002. Notið Poisson-nálgun á tvíkostadreifinguna til að finna líkurnar á að engin sé gölluð.', Math.exp(-2), 0.0005,
  calc('\\lambda = np = 1000 \\cdot 0{,}002 = 2', '\\Pr(X = 0) \\approx e^{-2} = 0{,}1353') + note('Nákvæmt: 0,998<sup>1000</sup> = 0,1351. Bin(n, λ/n) stefnir á Poisson(λ) þegar n → ∞.') + trap('Með λ = 0,002 (p í stað np) fæst 0,998.'));

CARD('L03-c1', L, 'Spjald · glæra 8–13', 'Hvaða forsendur þurfa að gilda til að fjöldi heppnaðra tilrauna sé tvíkostadreifður?',
  'Tilraunirnar þurfa að vera fastur fjöldi n, hver með tveimur mögulegum útkomum (Bernoulli). Líkurnar p á heppnaðri tilraun þurfa að vera þær sömu í öllum tilraunum. Tilraunirnar þurfa að vera óháðar. Þá er hver tiltekin röð með x heppnuðum jafnlíkleg, p<sup>x</sup>(1 − p)<sup>n−x</sup>, og þær raðir eru C(n, x).',
  ['Fastur fjöldi n', 'Tvær útkomur', 'Sama p', 'Óháðar tilraunir', 'C(n, x) raðir']);
CARD('L03-c2', L, 'Spjald · glæra 32–42', 'Hvernig tengjast tvíkostadreifing og Poisson-dreifing?',
  'Poisson-dreifingin er markgildi tvíkostadreifingar þegar fjöldi tilrauna n stefnir á óendanlegt og p = λ/n verður lítið, svo að væntigildið np = λ helst fast. Í sönnuninni stefnir n(n − 1)⋯(n − x + 1)/n<sup>x</sup> á 1, (1 − λ/n)<sup>n</sup> á e<sup>−λ</sup> og (1 − λ/n)<sup>−x</sup> á 1. Því má nálga Bin(n, p) með Poisson(np) þegar n er stórt og p lítið. Poisson lýsir fjölda atburða á tímabili þar sem hver smástund er nánast Bernoulli-tilraun.',
  ['p = λ/n, n → ∞', 'np = λ helst fast', 'Þrír markgildisliðir', 'Nálgun fyrir stórt n og lítið p']);
CARD('L03-c3', L, 'Spjald · glærur 03 og 05', 'Hvenær notar þú tvíkostadreifingu, Poisson-dreifingu og veldisdreifingu?',
  'Tvíkostadreifingu þegar talið er hve margar af n föstum, óháðum tilraunum með sömu líkum heppnast. Poisson-dreifingu þegar talinn er fjöldi atburða á tilteknu tímabili eða svæði og aðeins meðalfjöldinn λ er þekktur, án efri marka. Veldisdreifingu þegar mældur er tíminn á milli slíkra atburða; hún er samfelld og hefur sömu tíðni λ. Fyrstu tvær eru strjálar en veldisdreifingin samfelld.',
  ['Bin: x af n tilraunum', 'Poisson: fjöldi á tímabili', 'Exp: biðtími milli atburða', 'Strjálar vs samfelld']);
CARD('L03-c4', L, 'Spjald · dæmablað 3, 2c', 'Stjórnmálafræðingur segir 60% sigurlíkur, en aðeins 3 af 9 könnunum spá sigri. Hvað má álykta?',
  'Ef spáin væri rétt væri væntur fjöldi 9 · 0,6 = 5,4 og líkurnar á nákvæmlega 3 af 9 aðeins um 7,4%. Gögnin eru því fremur ósennileg ef spáin er rétt, sem bendir til að hún sé of há. Það sannar þó ekkert, því ólíklegir hlutir gerast. Betri mælikvarði er líkurnar á 3 eða færri, því eins öfgafullar eða öfgafyllri niðurstöður eiga að teljast með.',
  ['Vænt 5,4 af 9', 'Pr(X = 3) ≈ 0,074', 'Ósennilegt, ekki ómögulegt', 'Halalíkur betri mælikvarði']);
}


// ================= L04 · Samfelldar slembibreytur =================
{ const L = 'L04', G = 'Glærur 04', D4 = 'Dæmablað 4', V5 = 'Verkefni 5';
const f3 = M('f(x) = 3x^2, \\; 0 \\le x \\le 1');
const fD4 = M('f(x) = 3{,}125(1 - x)') + ' fyrir 0,2 ≤ x ≤ 1 (og 0 annars)';
const FD4 = x => 3.125 * x - 1.5625 * x * x - 0.5625;
const fV5 = M('f(x) = \\tfrac{6}{5}(x + x^2), \\; 0 \\le x \\le 1');
const FV5 = x => 0.6 * x * x + 0.4 * x ** 3;
MCQ('L04-gl-1', L, 1, 'gl', G + ', gl. 10 og 21', 'X er samfelld slembibreyta. Hvað er Pr(X = 0,5)?',
  [['0, því líkurnar dreifast á óteljanlega mörg gildi'], ['f(0,5)', 'Þéttleiki samfelldrar breytu er ekki líkindi.'], ['F(0,5)', 'Það er Pr(X ≤ 0,5).'], ['Ekki hægt að segja án þéttleikafallsins', 'Fyrir samfellda breytu er svarið alltaf 0.'], ['1/óendanlegt, sem er óskilgreint', 'Líkurnar eru nákvæmlega 0.']],
  note('Þess vegna skiptir ekki máli hvort notað er &lt; eða ≤ fyrir samfelldar breytur (glæra 21).'));
MCQ('L04-gl-2', L, 1, 'gl', G + ', gl. 12 og 24', 'Fyrir ' + f3 + ' er f(1) = 3. Hvað segir það?',
  [['Ekkert óeðlilegt: þéttleiki má vera > 1, aðeins flatarmálið undir f þarf að vera 1'], ['f er ekki lögmætt þéttleikafall því f(1) > 1', 'Skilyrðin eru f ≥ 0 og ∫f = 1; ekki f ≤ 1.'], ['Pr(X = 1) = 3', 'Líkur eru aldrei > 1, og Pr(X = 1) = 0.'], ['Pr(X ≤ 1) = 3', 'F(1) = 1.'], ['X tekur gildið 3 með vissu', 'f(1) er þéttleiki í punktinum x = 1.']],
  calc('\\int_0^1 3x^2\\,dx = [x^3]_0^1 = 1'));
PNUM('L04-gl-3', L, 1, 'gl', G + ', gl. 25', 'X hefur ' + f3 + ', svo F(x) = x³. Reiknið Pr(X &lt; 0,3).', 0.027, 0.0005, calc('\\Pr(X < 0{,}3) = F(0{,}3) = 0{,}3^3 = 0{,}027') + trap('f(0,3) = 0,27 er þéttleikinn, ekki líkur.'));
PNUM('L04-gl-4', L, 1, 'gl', G + ', gl. 25', 'X hefur F(x) = x³ á [0, 1]. Reiknið Pr(X &gt; 0,99).', 1 - 0.99 ** 3, 0.0005, calc('\\Pr(X > 0{,}99) = 1 - F(0{,}99) = 1 - 0{,}970299 = 0{,}029701'));
MCQ('L04-hv-1', L, 1, 'hv', V5 + ', 2a', 'X hefur dreifingarfallið F(x) = 2x − x² á [0, 1]. Hvert er þéttleikafallið?',
  [[M('f(x) = 2 - 2x')], [M('f(x) = x^2 - \\tfrac{x^3}{3}'), 'Heildaði í stað þess að diffra.'], [M('f(x) = 2 - x'), 'Diffraði x² rangt.'], [M('f(x) = 2x - x^2'), 'Það er F sjálft.'], [M('f(x) = 2x'), 'Gleymdi liðnum 2.']],
  calc('f(x) = F\'(x) = \\frac{d}{dx}(2x - x^2) = 2 - 2x'));
MCQ('L04-gl-5', L, 1, 'gl', G + ', gl. 21', 'X er samfelld. Hvert eftirfarandi er alltaf jafnt Pr(1 &lt; X &lt; 2)?',
  [['Pr(1 ≤ X ≤ 2) = F(2) − F(1)'], ['f(2) − f(1)', 'Mismunur þéttleika er ekki líkur.'], ['F(2) − F(1) − f(1)', 'Endapunktar hafa líkur 0; ekkert þarf að draga frá.'], ['F(2) + F(1)', 'Leggja saman er rangt.'], ['1 − F(1) − F(2)', 'Röng samsetning.']],
  calc('\\Pr(a < X < b) = \\Pr(a \\le X \\le b) = F(b) - F(a) = \\int_a^b f(t)\\,dt'));
PNUM('L04-hv-2', L, 1, 'hv', V5 + ', 1c iv', 'X hefur ' + fV5 + '. Reiknið Pr(X = 0,5).', 0, 0.0005, calc('\\Pr(X = 0{,}5) = 0') + note('Samfelld breyta: einstakur punktur hefur líkur 0.') + trap('f(0,5) = 0,9 er þéttleikinn.'));
NUM('L04-gl-6', L, 1, 'gl', G + ', gl. 13 og 24', 'X hefur dreifingarfallið F(x) = x³ á [0, 1]. Hvert er gildi þéttleikafallsins í x = 0,5?', 0.75, 0.0005, '',
  calc('f(x) = F\'(x) = 3x^2', 'f(0{,}5) = 3 \\cdot 0{,}25 = 0{,}75') + trap('F(0,5) = 0,125 eru líkurnar Pr(X ≤ 0,5).'));

PNUM('L04-gl-7', L, 2, 'gl', G + ', gl. 25', 'X hefur ' + f3 + '. Reiknið Pr(0,5 ≤ X ≤ 0,75).', 0.296875, 0.0005,
  calc('F(0{,}75) - F(0{,}5) = 0{,}421875 - 0{,}125 = 0{,}296875') + trap('f(0,75) − f(0,5) = 0,9375 er ekki líkur.'));
NUM('L04-gl-8', L, 2, 'gl', G + ', gl. 32', 'X hefur ' + f3 + '. Hvert er E[X]?', 0.75, 0.0005, '', calc('E[X] = \\int_0^1 x \\cdot 3x^2\\,dx = \\left[\\tfrac{3}{4}x^4\\right]_0^1 = 0{,}75') + trap('0,5 er miðja bilsins; dreifingin er skökk til vinstri.'));
NUM('L04-gl-9', L, 2, 'gl', G + ', gl. 39', 'X hefur ' + f3 + '. Hver er Var[X]?', 0.0375, 0.0005, '',
  calc('E[X^2] = \\int_0^1 x^2 \\cdot 3x^2\\,dx = \\tfrac{3}{5} = 0{,}6', '\\mathrm{Var}[X] = 0{,}6 - 0{,}75^2 = 0{,}0375') + trap('0,6 er E[X²].'));
NUM('L04-gl-10', L, 2, 'gl', G + ', gl. 34', 'X hefur F(x) = x³ á [0, 1]. Hvert er miðgildi X?', Math.cbrt(0.5), 0.0005, '',
  calc('x^3 = 0{,}5 \\Rightarrow x = 0{,}5^{1/3} = 0{,}7937') + note('Miðgildið (0,794) er hærra en væntigildið (0,75): halinn er til vinstri.'));
NUM('L04-gl-11', L, 2, 'gl', G + ', gl. 35', 'X hefur F(x) = x³ á [0, 1]. Finnið 80% hlutfallsmark X.', Math.cbrt(0.8), 0.0005, '', calc('x^3 = 0{,}8 \\Rightarrow x = 0{,}8^{1/3} = 0{,}9283'));
PNUM('L04-hv-3', L, 2, 'hv', D4 + ', 1c i', 'X hefur ' + fD4 + '. Reiknið Pr(X ≤ 0,85).', FD4(0.85), 0.0005,
  calc('F(x) = \\int_{0{,}2}^x 3{,}125(1 - t)\\,dt = 3{,}125x - 1{,}5625x^2 - 0{,}5625', 'F(0{,}85) = 2{,}65625 - 1{,}12891 - 0{,}5625 = 0{,}96484') + trap('Heildið byrjar í 0,2, ekki 0; án neðri marka fengist 1,527 > 1.'));
PNUM('L04-hv-4', L, 2, 'hv', D4 + ', 1c ii', 'X hefur ' + fD4 + '. Reiknið Pr(X &gt; 0,7).', 1 - FD4(0.7), 0.0005, calc('1 - F(0{,}7) = 1 - 0{,}859375 = 0{,}140625'));
PNUM('L04-hv-5', L, 2, 'hv', D4 + ', 1c iii', 'X hefur ' + fD4 + '. Reiknið Pr(0,6 &lt; X &lt; 0,8).', FD4(0.8) - FD4(0.6), 0.0005, calc('F(0{,}8) - F(0{,}6) = 0{,}9375 - 0{,}75 = 0{,}1875'));
PNUM('L04-hv-6', L, 2, 'hv', V5 + ', 1c i', 'X hefur ' + fV5 + '. Reiknið Pr(X ≤ 0,8).', FV5(0.8), 0.0005,
  calc('F(x) = \\tfrac{6}{5}\\left(\\tfrac{x^2}{2} + \\tfrac{x^3}{3}\\right) = \\tfrac{3}{5}x^2 + \\tfrac{2}{5}x^3', 'F(0{,}8) = 0{,}384 + 0{,}2048 = 0{,}5888'));
PNUM('L04-hv-7', L, 2, 'hv', V5 + ', 1c ii', 'X hefur ' + fV5 + '. Reiknið Pr(X &gt; 0,5).', 1 - FV5(0.5), 0.0005, calc('1 - F(0{,}5) = 1 - (0{,}15 + 0{,}05) = 0{,}8'));
PNUM('L04-hv-8', L, 2, 'hv', V5 + ', 1c iii', 'X hefur ' + fV5 + '. Reiknið Pr(0,1 &lt; X &lt; 0,4).', FV5(0.4) - FV5(0.1), 0.0005, calc('F(0{,}4) - F(0{,}1) = 0{,}1216 - 0{,}0064 = 0{,}1152'));
NUM('L04-hv-9', L, 2, 'hv', V5 + ', 2b', 'X hefur f(x) = 2 − 2x á [0, 1]. Hvert er E[X]?', 1 / 3, 0.0005, '', calc('E[X] = \\int_0^1 x(2 - 2x)\\,dx = \\left[x^2 - \\tfrac{2}{3}x^3\\right]_0^1 = \\tfrac{1}{3}'));
NUM('L04-hv-10', L, 2, 'hv', V5 + ', 2c', 'X hefur f(x) = 2 − 2x á [0, 1]. Hver er Var[X]?', 1 / 18, 0.0005, '',
  calc('E[X^2] = \\int_0^1 x^2(2 - 2x)\\,dx = \\tfrac{2}{3} - \\tfrac{1}{2} = \\tfrac{1}{6}', '\\mathrm{Var}[X] = \\tfrac{1}{6} - \\tfrac{1}{9} = \\tfrac{1}{18} = 0{,}0556') + note('SD = √(1/18) ≈ 0,2357.'));
NUM('L04-hv-11', L, 2, 'hv', V5 + ', 3c', 'X hefur f(x) = kx(4 − x²) á [0, 2]. Hvaða k gerir f að lögmætu þéttleikafalli?', 0.25, 0.0005, '',
  calc('F(x) = \\int_0^x k(4t - t^3)\\,dt = 2kx^2 - \\tfrac{k}{4}x^4', 'F(2) = 8k - 4k = 4k = 1 \\Rightarrow k = \\tfrac{1}{4}'));
NUM('L04-hv-12', L, 2, 'hv', D4 + ', 2b', 'X hefur F(x) = (x − 2)²(10 − 2x)/8 á [2, 4]. Hvert er E[X]?', 3, 0.0005, '',
  calc('f(x) = F\'(x) = \\frac{-3x^2 + 18x - 24}{4}', 'E[X] = \\int_2^4 x f(x)\\,dx = -45 + 84 - 36 = 3') + note('f er samhverft um 3 (núllstöðvar í 2 og 4), svo E[X] = 3.'));
NUM('L04-hv-13', L, 2, 'hv', D4 + ', 2c', 'X hefur F(x) = (x − 2)²(10 − 2x)/8 á [2, 4]. Hver er Var[X]?', 0.2, 0.0005, '',
  calc('E[X^2] = \\int_2^4 x^2 f(x)\\,dx = -148{,}8 + 270 - 112 = 9{,}2', '\\mathrm{Var}[X] = 9{,}2 - 3^2 = 0{,}2') + note('SD = √0,2 ≈ 0,447.'));
MCQ('L04-hv-14', L, 2, 'hv', V5 + ', 3a', 'X hefur f(x) = kx(4 − x²) á [0, 2]. Kennarinn segir að k = −4. Getur það staðist?',
  [['Nei: þá er f(x) < 0 á (0, 2), t.d. f(1) = −12'], ['Já, ef heildið er 1', 'Með k = −4 er heildið −16, og f má aldrei vera neikvætt.'], ['Já, því F getur verið neikvætt', 'F er líkur og getur ekki verið neikvætt.'], ['Nei, því k verður að vera heiltala', 'k = 1/4 er rétta gildið.'], ['Ekki hægt að segja án F', 'Neikvætt f dugar til að hafna.']],
  calc('f(1) = -4 \\cdot 1 \\cdot (4 - 1) = -12 < 0'));

STEP('L04-hv-15', L, 'hv', D4 + ', dæmi 3 (heilt)', 'Gæði örgjörva X hafa f(x) = (x − 5)/4 á [5, 7] og (9 − x)/4 á (7, 9]. a) E[X] b) Var[X] og SD[X] c) 1000 örgjörvar á viku; gæði &gt; 8 seljast á 1000 kr., 6,5–8 á 500 kr., &lt; 6,5 á 100 kr.; kostnaður 200 kr. á stykki. Væntur vikulegur hagnaður?',
  [['a) E[X]', 1, calc('E[X] = \\int_5^7 x\\frac{x-5}{4}dx + \\int_7^9 x\\frac{9-x}{4}dx = 7') + note('f er samhverft um 7.')],
   ['b) Var', 1, calc('E[X^2] = 49{,}667', '\\mathrm{Var}[X] = 49{,}667 - 49 = 0{,}667, \\quad SD = 0{,}8165')],
   ['c) F(x)', 1, calc('F(x) = \\tfrac{1}{8}(x - 5)^2 \\text{ á } [5, 7], \\quad F(x) = \\tfrac{1}{8}(18x - x^2 - 73) \\text{ á } (7, 9]')],
   ['c) Hlutföll', 1, calc('\\Pr(X < 6{,}5) = 0{,}28125, \\; \\Pr(6{,}5 < X < 8) = 0{,}59375, \\; \\Pr(X > 8) = 0{,}125')],
   ['c) Hagnaður', 1, calc('1000(0{,}28125 \\cdot 100 + 0{,}59375 \\cdot 500 + 0{,}125 \\cdot 1000) - 200\\,000 = 250\\,000')]]);
NUM('L04-hv-16', L, 3, 'hv', D4 + ', 3c', 'Sömu örgjörvar (þríhyrningsdreifing á [5, 9] með toppi í 7). 1000 á viku; gæði &gt; 8: 1000 kr., 6,5–8: 500 kr., &lt; 6,5: 100 kr.; framleiðslukostnaður 200 kr. á stykki. Hver er væntur vikulegur hagnaður (kr.)?', 250000, 1, 'kr.',
  calc('\\Pr(X < 6{,}5) = \\tfrac{1}{8}(1{,}5)^2 = 0{,}28125', '\\Pr(X > 8) = 1 - \\tfrac{1}{8}(144 - 64 - 73) = 0{,}125', '\\Pr(6{,}5 < X < 8) = 0{,}59375', '1000(28{,}125 + 296{,}875 + 125) - 200\\,000 = 250\\,000') + trap('Að gleyma framleiðslukostnaðinum gefur 450.000.'));
STEP('L04-hv-17', L, 'hv', D4 + ', 2d', 'Sýnið að f(x) = (−3x² + 18x − 24)/4 á [2, 4] sé lögmætt þéttleikafall.',
  [['f ≥ 0', 2, calc('-3x^2 + 18x - 24 = -3(x - 2)(x - 4)') + note('Núllstöðvar í 2 og 4; neikvæður stuðull við x² svo fallið er ≥ 0 á milli þeirra (toppur í x = 3).')],
   ['Heildið er 1', 2, calc('\\int_2^4 f(x)\\,dx = -14 + 27 - 12 = 1') + note('Eða einfaldlega F(4) = 2²·2/8 = 1.')]]);
STEP('L04-hv-18', L, 'hv', V5 + ', dæmi 3 (heilt)', 'f(x) = kx(4 − x²) á [0, 2]. a) Getur k verið −4? b) Finnið F(x) með k óþekktu. c) Hvaða k gerir F að lögmætu dreifingarfalli?',
  [['a) k = −4', 1, calc('f(1) = -12 < 0') + note('Neikvæður þéttleiki er óleyfilegur.')],
   ['b) F(x)', 2, calc('F(x) = \\int_0^x (4kt - kt^3)\\,dt = 2kx^2 - \\tfrac{k}{4}x^4')],
   ['c) k', 1, calc('F(2) = 8k - 4k = 1 \\Rightarrow k = \\tfrac{1}{4}', 'F(x) = 0{,}5x^2 - \\tfrac{x^4}{16}')]]);
NUM('L04-ny-1', L, 3, 'ny', 'Ný spurning · í stíl við dæmablað 4, dæmi 1', 'X hefur ' + fD4 + ', svo F(x) = 3,125x − 1,5625x² − 0,5625 á [0,2; 1]. Hvert er miðgildi X?', 1 - Math.sqrt(0.32), 0.0005, '',
  calc('3{,}125x - 1{,}5625x^2 - 0{,}5625 = 0{,}5', 'x^2 - 2x + 0{,}68 = 0', 'x = 1 - \\sqrt{0{,}32} = 0{,}4343') + note('Hin lausnin, 1 + √0,32 = 1,566, er utan [0,2; 1].') + trap('Miðja bilsins (0,6) er ekki miðgildi skakkrar dreifingar.'));
NUM('L04-ny-2', L, 3, 'ny', 'Ný spurning · í stíl við dæmablað 4, dæmi 3', 'Gæði X hafa þríhyrningsdreifingu á [5, 9] með toppi í 7, svo F(x) = (18x − x² − 73)/8 á (7, 9]. Finnið 90% hlutfallsmark X.', 9 - Math.sqrt(0.8), 0.0005, '',
  calc('1 - F(x) = \\tfrac{1}{8}(9 - x)^2 = 0{,}1', '(9 - x)^2 = 0{,}8', 'x = 9 - \\sqrt{0{,}8} = 8{,}1056') + note('Halinn fyrir ofan x er þríhyrningur með flatarmál (9 − x)²/8.'));
NUM('L04-ny-3', L, 3, 'ny', 'Ný spurning · skeifni samfelldrar breytu (gl. 40)', 'X hefur ' + f3 + ' (E[X] = 0,75, Var[X] = 0,0375). Reiknið skeifni X.', (0.5 - 3 * 0.75 * 0.6 + 2 * 0.75 ** 3) / Math.pow(0.0375, 1.5), 0.002, '',
  calc('E[X^3] = \\int_0^1 3x^5\\,dx = 0{,}5', 'E[(X - \\mu)^3] = E[X^3] - 3\\mu E[X^2] + 2\\mu^3 = 0{,}5 - 1{,}35 + 0{,}84375 = -0{,}00625', '\\mathrm{Skew} = \\frac{-0{,}00625}{0{,}0375^{3/2}} = -0{,}861') + note('Neikvæð skeifni: hali til vinstri, eins og myndin á glæru 36 sýnir.'));
MCQ('L04-ny-4', L, 3, 'ny', 'Ný spurning · ójafna Jensens fyrir samfellda breytu (gl. 31)', 'X hefur ' + f3 + ', E[X] = 0,75. Hvort er stærra, E[√X] eða √E[X]?',
  [['√E[X] = 0,866 > E[√X] = 0,857, því √ er hvelft'], ['E[√X] > √E[X], því √ er kúpt', '√x sveigir niður (hvelft).'], ['Jafnt, því væntigildi er línulegt', 'Línuleiki gildir aðeins fyrir línuleg föll.'], ['Ekki hægt að bera saman án hermunar', 'Bæði má reikna beint.'], ['E[√X] = √0,75 = 0,866', 'Það er g(E[X]), ekki E[g(X)].']],
  calc('E[\\sqrt{X}] = \\int_0^1 \\sqrt{x}\\,3x^2\\,dx = \\tfrac{3}{3{,}5} = 0{,}8571', '\\sqrt{E[X]} = \\sqrt{0{,}75} = 0{,}8660'));

CARD('L04-c1', L, 'Spjald · glæra 5 og 10', 'Hvers vegna getum við ekki talað um Pr(X = x) fyrir samfellda breytu, og hvernig fáum við líkur í staðinn?',
  'Samfelld breyta tekur óteljanlega mörg gildi, svo líkunum er dreift á svo mörg gildi að hvert stakt gildi fær líkur 0. Í staðinn eru reiknaðar líkur á bilum, sem eru flatarmálið undir þéttleikafallinu: Pr(a ≤ X ≤ b) = F(b) − F(a) = ∫<sub>a</sub><sup>b</sup> f(t) dt. Þess vegna skiptir ekki máli hvort notað er &lt; eða ≤. Summur úr strjálum tilfellum verða að heildum.',
  ['Óteljanlega mörg gildi', 'Pr(X = x) = 0', 'Líkur = flatarmál á bili', '< og ≤ jafngild']);
CARD('L04-c2', L, 'Spjald · glæra 11–13', 'Hvaða skilyrði þarf f að uppfylla til að vera þéttleikafall, og hvert er sambandið milli f og F?',
  'Þéttleikafallið þarf að vera f(x) ≥ 0 fyrir öll x og heildið yfir allan rauntalnaásinn að vera 1. Það má vera stærra en 1, því það er ekki líkindi heldur þéttleiki. Dreifingarfallið er F(x) = ∫<sub>−∞</sub><sup>x</sup> f(t) dt og jafngilt er f(x) = dF/dx. F er samfellt, vaxandi og fer frá 0 upp í 1.',
  ['f ≥ 0', '∫ f = 1', 'f má vera > 1', 'F = ∫ f, f = F′']);
CARD('L04-c3', L, 'Spjald · glæra 6–7', 'Hvers vegna notum við samfelldar slembibreytur þótt allar mælingar séu í raun strjálar?',
  'Mælingar hafa alltaf takmarkaða nákvæmni, svo strangt til tekið eru allar breytur sem við vinnum með strjálar. Margt er þó fræðilega samfellt, t.d. tími, og samfelldar breytur hafa þægilega eiginleika: heildi hafa oft lokaðar lausnir þar sem summur hafa það ekki. Strjálar breytur með mörgum gildum má líka nálga vel með samfelldum. Dæmi er hlaupatími í 100 m, mældur í sekúndubrotum eða óendanlega litlum brotum.',
  ['Mælingar eru strjálar í raun', 'Fyrirbærið getur verið samfellt', 'Heildi oft auðveldari', 'Nálgun á strjálum breytum']);
CARD('L04-c4', L, 'Spjald · glæra 33–36', 'Hvernig eru miðgildi og hlutfallsmörk fundin fyrir samfellda breytu, og hvers vegna þarf ekki „minnsta x" regluna?',
  'Fyrir samfellda breytu er F samfellt og stranglega vaxandi þar sem breytan er skilgreind, svo fyrir hvert p á (0, 1) er nákvæmlega eitt x með F(x) = p. Því er miðgildið lausnin á F(x) = 0,5 og p-hlutfallsmarkið lausnin á F(x) = p. Fyrir strjálar breytur tekur F stökk og hittir p ekki endilega, þess vegna þarf þar regluna min{x : F(x) ≥ p}. Dæmi: F(x) = x³ gefur miðgildi 0,5<sup>1/3</sup> = 0,794.',
  ['Leysa F(x) = p', 'F samfellt og vaxandi', 'Ein lausn', 'Strjált: stökk → min-regla']);
}


// ================= L05 · Samfelldar dreifingar =================
{ const L = 'L05', G = 'Glærur 05', D5 = 'Dæmablað 5', V6 = 'Verkefni 6';
const P = PROB; const tN = (ex, tb) => nTol(ex, tb);
PNUM('L05-gl-1', L, 1, 'gl', G + ', gl. 8', 'X ~ Unif(11, 14). Reiknið Pr(X &lt; 12).', 1 / 3, 0.0005, calc('F(12) = \\frac{12 - 11}{14 - 11} = \\frac{1}{3}') + trap('1/(b − a) = 1/3 er hér sama tala, en það er þéttleikinn; Pr(X < 13) væri 2/3.'));
NUM('L05-gl-2', L, 1, 'gl', G + ', gl. 12', 'X ~ Unif(11, 14). Hvert er E[X]?', 12.5, 0.0005, '', calc('E[X] = \\frac{a + b}{2} = \\frac{11 + 14}{2} = 12{,}5'));
NUM('L05-gl-3', L, 1, 'gl', G + ', gl. 12', 'X ~ Unif(11, 14). Hver er Var[X]?', 0.75, 0.0005, '', calc('\\mathrm{Var}[X] = \\frac{(b - a)^2}{12} = \\frac{9}{12} = 0{,}75') + trap('(b − a)/12 = 0,25 gleymir öðru veldinu.'));
PNUM('L05-gl-4', L, 1, 'gl', G + ', gl. 24', 'X ~ Exp(λ = 2). Reiknið Pr(X &lt; 1).', 1 - Math.exp(-2), 0.0005, calc('F(1) = 1 - e^{-2 \\cdot 1} = 1 - 0{,}1353 = 0{,}8647') + note('R: <code>pexp(1, rate = 2)</code>.') + trap('e<sup>−2</sup> = 0,135 er Pr(X > 1).'));
NUM('L05-gl-5', L, 1, 'gl', G + ', gl. 25–27', 'X ~ Exp(λ = 2). Hver er Var[X]?', 0.25, 0.0005, '', calc('\\mathrm{Var}[X] = \\frac{1}{\\lambda^2} = \\frac{1}{4} = 0{,}25') + note('E[X] = 1/λ = 0,5.') + trap('1/λ = 0,5 er væntigildið.'));
MCQ('L05-gl-6', L, 1, 'gl', G + ', gl. 30 · ' + D5 + ', 3a', 'X ~ N(200, 2500). Hvaða R-skipun reiknar Pr(X &gt; 300)?',
  [['<code>1 - pnorm(300, mean = 200, sd = 50)</code>'], ['<code>1 - pnorm(300, mean = 200, sd = 2500)</code>', 'Seinni stikinn í N(μ, σ²) er dreifnin, en pnorm tekur staðalfrávikið: √2500 = 50.'], ['<code>pnorm(300, mean = 200, sd = 50)</code>', 'Það er Pr(X ≤ 300).'], ['<code>1 - qnorm(300, mean = 200, sd = 50)</code>', 'qnorm tekur líkur inn og skilar x.'], ['<code>dnorm(300, mean = 200, sd = 50)</code>', 'Þéttleiki, ekki líkur.']],
  note('Á glærunum er N(μ, σ²) ritað með dreifninni; pnorm, qnorm og rnorm taka sd.'), { r: true, rc: 'cat(round(1 - pnorm(300, mean = 200, sd = 50), 5))', rx: '0.02275' });
MCQ('L05-gl-7', L, 1, 'gl', G + ', gl. 36', 'Hve stór hluti normaldreifingar liggur innan við 2σ frá μ?',
  [['Um 95,4%'], ['Um 68,3%', 'Það er innan við 1σ.'], ['Um 99,7%', 'Það er innan við 3σ.'], ['Um 97,7%', 'Það er Φ(2), allt fyrir neðan μ + 2σ.'], ['50%', 'Það er hlutfallið fyrir neðan μ.']],
  calc('\\Phi(2) - \\Phi(-2) = 0{,}97725 - 0{,}02275 = 0{,}9545'));
NUM('L05-gl-8', L, 1, 'gl', G + ', gl. 66–67', 'Y ~ χ²(7). Hver er Var[Y]?', 14, 0, '', calc('\\mathrm{Var}[Y] = 2k = 14') + note('E[Y] = k = 7, því hver X<sub>i</sub>² hefur væntigildi 1 og dreifni 2.') + trap('7 er væntigildið.'));
NUM('L05-hv-1', L, 1, 'hv', D5 + ', 1a', 'X ~ Unif(−2, 2). Hvert er staðalfrávik X?', 2 / Math.sqrt(3), 0.0005, '',
  calc('\\mathrm{Var}[X] = \\frac{(2 - (-2))^2}{12} = \\frac{16}{12} = \\frac{4}{3}', 'SD = \\sqrt{4/3} = \\frac{2}{\\sqrt{3}} = 1{,}1547') + note('E[X] = 0.'));
NUM('L05-hv-2', L, 1, 'hv', V6 + ', 1a', 'X er jafndreifð á [−0,5; 2] með f(x) = 1/k. Hvert er k?', 2.5, 0.0005, '', calc('k = b - a = 2 - (-0{,}5) = 2{,}5'));
NUM('L05-hv-3', L, 1, 'hv', V6 + ', 1b', 'X ~ Unif(−0,5; 2). Hvert er staðalfrávik X?', 2.5 / Math.sqrt(12), 0.0005, '', calc('\\mathrm{Var}[X] = \\frac{2{,}5^2}{12} = 0{,}5208', 'SD = \\sqrt{0{,}5208} = 0{,}7217') + note('E[X] = 0,75.'));
NUM('L05-hv-4', L, 1, 'hv', V6 + ', 2a', 'Tíminn milli ríkisskuldakreppna T er veldisdreifður með meðaltal 10 ár. Hver er stikinn λ?', 0.1, 0.0005, '', calc('\\lambda = \\frac{1}{E[T]} = \\frac{1}{10} = 0{,}1') + trap('λ = 10 ruglar saman tíðni og meðalbið.'));
MCQ('L05-hv-5', L, 1, 'hv', V6 + ', 3a', 'Árlegur hagvöxtur X er normaldreifður með meðaltal 2% og staðalfrávik 1,5 (prósentustig). Hverjir eru stikar X á rithættinum N(μ, σ²)?',
  [['N(0,02; 0,015²)'], ['N(0,02; 0,015)', 'Seinni stikinn er dreifnin σ², ekki σ.'], ['N(2; 1,5)', 'Ef unnið er í prósentum er þetta N(2; 1,5²), seinni stikinn enn dreifni.'], ['N(0,015; 0,02²)', 'Víxlaði stikunum.'], ['N(0; 1)', 'Það er staðlaða normaldreifingin.']],
  note('Lausn verkefnisins segir að bæði μ = 0,02, σ = 0,015 og σ² = 0,015² séu jafnrétt svör; á rithættinum N(μ, σ²) á dreifnin að standa.'));

PNUM('L05-hv-6', L, 2, 'hv', D5 + ', 1b', 'X ~ Unif(−2, 2). Reiknið Pr(X &lt; 1,5).', 0.875, 0.0005, calc('F(1{,}5) = \\frac{1{,}5 + 2}{4} = 0{,}875'));
PNUM('L05-hv-7', L, 2, 'hv', D5 + ', 1c', 'X ~ Unif(−2, 2). Reiknið Pr(X &gt; 1,9).', 0.025, 0.0005, calc('1 - F(1{,}9) = 1 - \\frac{3{,}9}{4} = 0{,}025'));
PNUM('L05-hv-8', L, 2, 'hv', D5 + ', 1d', 'X ~ Unif(−2, 2). Reiknið líkurnar á að X sé stærri en 1,4 <b>eða</b> minni en 0,2.', 0.7, 0.0005,
  calc('\\Pr(X > 1{,}4) + \\Pr(X < 0{,}2) = (1 - 0{,}85) + 0{,}55 = 0{,}7') + note('Atburðirnir eru sundurlægir og því má leggja líkurnar saman.') + slideErr('Lausn dæmablaðsins kallar atburðina „óháða (geta ekki gerst á sama tíma)". Rétta orðið er sundurlægir; sundurlægir atburðir eru einmitt háðir.'));
PNUM('L05-hv-9', L, 2, 'hv', D5 + ', 2a', 'Tími milli skilaboða er veldisdreifður með meðaltal 10 mínútur. Hverjar eru líkurnar á að skilaboð berist innan 2 mínútna?', 1 - Math.exp(-0.2), 0.0005, calc('\\lambda = 0{,}1', 'F(2) = 1 - e^{-0{,}2} = 0{,}1813'));
PNUM('L05-hv-10', L, 2, 'hv', D5 + ', 2b', 'Meðaltími milli skilaboða er 10 mínútur (veldisdreifing). Hverjar eru líkurnar á að skilaboð berist á milli 5 og 15 mínútna?', Math.exp(-0.5) - Math.exp(-1.5), 0.0005,
  calc('F(15) - F(5) = e^{-0{,}5} - e^{-1{,}5} = 0{,}6065 - 0{,}2231 = 0{,}3834'));
NUM('L05-hv-11', L, 2, 'hv', D5 + ', 2c', 'Meðaltími milli skilaboða er 10 mínútur (veldisdreifing). Hver er dreifni tímans (í mín²)?', 100, 0.001, 'mín²', calc('\\mathrm{Var}[X] = \\frac{1}{0{,}1^2} = 100') + note('SD = 10: fyrir veldisdreifingu eru væntigildi og staðalfrávik jöfn.') + trap('10 er staðalfrávikið.'));
NUM('L05-hv-12', L, 2, 'hv', D5 + ', 2d', 'Meðaltími milli skilaboða er 10 mínútur. Spjallinu er lokað eftir t mínútur án skilaboða. Hvert er minnsta t svo að aðeins 1 af 1000 skilaboðum berist of seint? (Ónámundað.)', -Math.log(0.001) / 0.1, 0.01, 'mín.',
  calc('1 - e^{-0{,}1 t} = 0{,}999', 't = \\frac{-\\ln(0{,}001)}{0{,}1} = 69{,}08') + note('R: <code>qexp(0.999, rate = 0.1)</code>. Námundað upp að næstu mínútu: 70.') + slideErr('Í lausninni stendur „99% af öllum gildum"; það á að vera 99,9%.'));
PNUM('L05-hv-13', L, 2, 'hv', D5 + ', 3a', 'Dagleg sala á pylsum er N(200, 50²). Hverjar eru líkurnar á sölu yfir 300? ' + hint(TABNOTE), 1 - P.pnorm(2), tN(1 - P.pnorm(2), 1 - P.tabPhi(2)),
  calc('Z = \\frac{300 - 200}{50} = 2', '\\Pr(Z > 2) = 1 - 0{,}97725 = 0{,}02275') + note('R: <code>1 - pnorm(300, mean = 200, sd = 50)</code>.'));
PNUM('L05-hv-14', L, 2, 'hv', D5 + ', 3c', 'Sala ~ N(200, 50²). Hverjar eru líkurnar á sölu á milli 100 og 300? ' + hint(TABNOTE), P.pnorm(2) - P.pnorm(-2), 0.001,
  calc('\\Pr(-2 < Z < 2) = 0{,}97725 - 0{,}02275 = 0{,}9545'));
NUM('L05-hv-15', L, 2, 'hv', D5 + ', 3d', 'Sala ~ N(200, 50²). Hve margar pylsur (heil tala) þarf að kaupa til að vera 95% viss um að þær klárist ekki?', 283, 0, 'stk.',
  calc('z_{0{,}95} = 1{,}645', 'x = 200 + 1{,}645 \\cdot 50 = 282{,}25 \\Rightarrow 283') + note('R: <code>qnorm(0.95, mean = 200, sd = 50)</code> = 282,24; námundað upp.') + trap('Að námunda niður í 282 gefur aðeins 94,99% vissu; 1,96 er tvíhliða gildið fyrir 95%.'));
PNUM('L05-hv-16', L, 2, 'hv', V6 + ', 1c', 'X ~ Unif(−0,5; 2). Reiknið Pr(X &lt; 1).', 0.6, 0.0005, calc('F(1) = \\frac{1 + 0{,}5}{2{,}5} = 0{,}6'));
PNUM('L05-hv-17', L, 2, 'hv', V6 + ', 1d', 'X ~ Unif(−0,5; 2). Reiknið Pr(0 &lt; X &lt; 1).', 0.4, 0.0005, calc('F(1) - F(0) = 0{,}6 - 0{,}2 = 0{,}4'));
PNUM('L05-hv-18', L, 2, 'hv', V6 + ', 2c', 'Meðaltími milli kreppna er 10 ár (veldisdreifing). Hverjar eru líkurnar á kreppu innan 5 ára frá þeirri síðustu?', 1 - Math.exp(-0.5), 0.0005, calc('F(5) = 1 - e^{-0{,}5} = 0{,}3935'));
PNUM('L05-hv-19', L, 2, 'hv', V6 + ', 2d', 'Meðaltími milli kreppna er 10 ár. Hverjar eru líkurnar á kreppu 10 til 12 árum eftir þá síðustu?', Math.exp(-1) - Math.exp(-1.2), 0.0005,
  calc('F(12) - F(10) = e^{-1} - e^{-1{,}2} = 0{,}3679 - 0{,}3012 = 0{,}0667') + note('Lausnin námundar í 0,368 − 0,3 = 0,068.'));
PNUM('L05-hv-20', L, 2, 'hv', V6 + ', 3b', 'Hagvöxtur ~ N(0,02; 0,015²). Hverjar eru líkurnar á neikvæðum hagvexti? ' + hint(TABNOTE), P.pnorm(-0.02 / 0.015), tN(P.pnorm(-0.02 / 0.015), P.tabPhi(-0.02 / 0.015)),
  calc('Z = \\frac{0 - 0{,}02}{0{,}015} = -1{,}333', '\\Pr(Z < -1{,}33) = 1 - 0{,}9082 = 0{,}0918 \\;(\\text{tafla})', '§nákvæmt: 0,0912'));
PNUM('L05-hv-21', L, 2, 'hv', V6 + ', 3c', 'Hagvöxtur ~ N(0,02; 0,015²). Hverjar eru líkurnar á hagvexti á milli 2% og 4%? ' + hint(TABNOTE), P.pnorm(0.02 / 0.015) - 0.5, tN(P.pnorm(0.02 / 0.015) - 0.5, P.tabPhi(0.02 / 0.015) - 0.5),
  calc('z_1 = 0, \\quad z_2 = \\frac{0{,}04 - 0{,}02}{0{,}015} = 1{,}33', '\\Phi(1{,}33) - \\Phi(0) = 0{,}9082 - 0{,}5 = 0{,}4082', '§nákvæmt: 0,4088'));
PNUM('L05-hv-22', L, 2, 'hv', V6 + ', 3d', 'Hagvöxtur ~ N(0,02; 0,015²). Hverjar eru líkurnar á að hagvöxtur verði yfir 5%? ' + hint(TABNOTE), 1 - P.pnorm(2), tN(1 - P.pnorm(2), 1 - P.tabPhi(2)),
  calc('Z = \\frac{0{,}05 - 0{,}02}{0{,}015} = 2', '1 - \\Phi(2) = 0{,}0228'));
PNUM('L05-gl-9', L, 2, 'gl', G + ', gl. 28–29 (atvinnuleysi)', 'Meðalbið atvinnulausra eftir vinnu er 5 mánuðir (veldisdreifing). Hverjar eru líkurnar á vinnu innan 1 mánaðar?', 1 - Math.exp(-0.2), 0.0005, calc('\\lambda = 0{,}2', 'F(1) = 1 - e^{-0{,}2} = 0{,}1813'));
PNUM('L05-gl-10', L, 2, 'gl', G + ', gl. 29 (atvinnuleysi)', 'λ = 0,2 á mánuði. Hverjar eru líkurnar á að fá <b>ekki</b> vinnu fyrstu 6 mánuðina?', Math.exp(-1.2), 0.0005, calc('\\Pr(X > 6) = e^{-0{,}2 \\cdot 6} = e^{-1{,}2} = 0{,}3012'));
PNUM('L05-gl-11', L, 2, 'gl', G + ', gl. 29 (atvinnuleysi)', 'λ = 0,2 á mánuði. Hverjar eru líkurnar á að fá vinnu eftir 2 til 4 mánuði?', Math.exp(-0.4) - Math.exp(-0.8), 0.0005,
  calc('F(4) - F(2) = (1 - e^{-0{,}8}) - (1 - e^{-0{,}4}) = 0{,}5507 - 0{,}3297 = 0{,}2210') + slideErr('Á glæru 29 stendur „0,33 − 0,22 = 0,11". F(4) = 0,551 og F(2) = 0,330, svo rétt er 0,221.'));
PNUM('L05-gl-12', L, 2, 'gl', G + ', gl. 48–52 (samræmd próf)', 'Einkunnir eru N(30, 10²). Hverjar eru líkurnar á einkunn undir 55? ' + hint(TABNOTE), P.pnorm(2.5), tN(P.pnorm(2.5), P.tabPhi(2.5)), calc('Z = \\frac{55 - 30}{10} = 2{,}5', '\\Phi(2{,}5) = 0{,}9938'));
PNUM('L05-gl-13', L, 2, 'gl', G + ', gl. 50 (samræmd próf)', 'Einkunnir eru N(30, 10²). Hverjar eru líkurnar á einkunn á milli 40 og 50? ' + hint(TABNOTE), P.pnorm(2) - P.pnorm(1), tN(P.pnorm(2) - P.pnorm(1), P.tabPhi(2) - P.tabPhi(1)),
  calc('\\Pr(1 < Z < 2) = \\Phi(2) - \\Phi(1) = 0{,}9772 - 0{,}8413 = 0{,}1359') + slideErr('Á glæru 50 stendur Pr(Z &lt; 50) − Pr(Z &lt; 40); það á að vera Pr(X &lt; 50) − Pr(X &lt; 40) (eða Z &lt; 2 og Z &lt; 1). Talan 0,136 er rétt.'));
NUM('L05-gl-14', L, 2, 'gl', G + ', gl. 50 (samræmd próf)', '3.887 nemendur taka prófið (einkunnir N(30, 10²)). Hve margir má vænta að fái á bilinu 40 til 50?', 3887 * (P.pnorm(2) - P.pnorm(1)), 1, 'nem.',
  calc('3887 \\cdot 0{,}1359 = 528{,}3') + note('Glæran fær 529 með því að námunda líkurnar í 0,136 fyrst.'));
PNUM('L05-gl-15', L, 2, 'gl', G + ', gl. 68–70 (flugvélin)', 'Skekkjur í þremur víddum eru óháðar og N(0, 2²) í metrum. Hverjar eru líkurnar á að flugvélin sé innan við 2 m frá líklegustu staðsetningu?', P.pchisq(1, 3), 0.0005,
  calc('\\frac{D^2}{4} \\sim \\chi^2(3)', '\\Pr(D < 2) = \\Pr\\left(\\frac{D^2}{4} < 1\\right) = \\Pr(\\chi^2_3 < 1) = 0{,}1987') + note('R: <code>pchisq(1, 3)</code>.') + trap('Að deila ekki með dreifninni 4 gefur Pr(χ²₃ &lt; 4) = 0,739.'));
PNUM('L05-gl-16', L, 2, 'gl', G + ', gl. 70 (flugvélin)', 'Sama flugvél (skekkjur N(0, 2²) í 3 víddum). Hverjar eru líkurnar á að hún sé meira en 3 m frá líklegustu staðsetningu?', 1 - P.pchisq(9 / 4, 3), 0.0005,
  calc('\\Pr(D > 3) = \\Pr\\left(\\chi^2_3 > \\tfrac{9}{4}\\right) = 1 - 0{,}4778 = 0{,}5222'));
PNUM('L05-gl-17', L, 2, 'gl', G + ', gl. 70 (flugvélin)', 'Sama flugvél. Hverjar eru líkurnar á að hún sé á milli 1 og 3 m frá líklegustu staðsetningu?', P.pchisq(9 / 4, 3) - P.pchisq(1 / 4, 3), 0.0005,
  calc('F\\left(\\tfrac{9}{4}\\right) - F\\left(\\tfrac{1}{4}\\right) = 0{,}4778 - 0{,}0309 = 0{,}4469'));
PNUM('L05-gl-18', L, 2, 'gl', G + ', gl. 81', 'Y<sub>1</sub> ~ χ²(5) og Y<sub>2</sub> ~ χ²(10) eru óháðar og X = (Y<sub>1</sub>/5)/(Y<sub>2</sub>/10). Hverjar eru líkurnar Pr(X &lt; 2)?', P.pf(2, 5, 10), 0.0005,
  calc('X \\sim F(5, 10)', '\\Pr(X < 2) = 0{,}8358') + note('R: <code>pf(2, 5, 10)</code>. Glæran gefur líka Pr(X &gt; 4) ≈ 0,03.') + unconf('pf er ekki nefnt í glærunum; þar segir aðeins að líkur séu reiknaðar „með töflum eða tölvum".'));

NUM('L05-hv-23', L, 3, 'hv', D5 + ', 1e–f', 'X ~ Unif(−2, 2) og Y = 3X − 1. Hvert er staðalfrávik Y?', 12 / Math.sqrt(12), 0.0005, '',
  calc('§Endapunktar: 3·(−2) − 1 = −7 og 3·2 − 1 = 5, svo Y ~ Unif(−7, 5)', 'SD[Y] = \\frac{12}{\\sqrt{12}} = \\sqrt{12} = 2\\sqrt{3} = 3{,}4641') + note('Sama með |a|·SD[X] = 3 · 2/√3. E[Y] = −1.') + trap('Var[Y] = 12 er dreifnin.'));
STEP('L05-hv-24', L, 'hv', D5 + ', 3e', 'Sala X ~ N(200, 50²). Eigandinn kaupir 283 pylsur. Hagnaður H = 100X − 50S, þar sem S er fjöldi óseldra. Hverjar eru líkurnar á hagnaði yfir 12.000 kr.?',
  [['S sem fall af X', 1, calc('S = 283 - X \\Rightarrow H = 100X - 50(283 - X) = 150X - 14\\,150')],
   ['Dreifing H', 2, calc('E[H] = 150 \\cdot 200 - 14\\,150 = 15\\,850', 'SD[H] = 150 \\cdot 50 = 7\\,500') + note('Línulegt fall af normaldreifðri breytu er normaldreift.')],
   ['Líkurnar', 1, calc('Z = \\frac{12\\,000 - 15\\,850}{7\\,500} = -0{,}513', '\\Pr(H > 12\\,000) = 1 - \\Phi(-0{,}51) = 0{,}695 \\;(\\text{nákvæmt } 0{,}6961)') + trap('Að gleyma að S fer eftir X gefur SD = 100 · 50 = 5.000.')]]);
PNUM('L05-hv-25', L, 3, 'hv', D5 + ', 3e', 'Sala X ~ N(200, 50²); keyptar eru 283 pylsur og hagnaður er H = 100X − 50(283 − X). Hverjar eru líkurnar á hagnaði yfir 12.000 kr.? ' + hint(TABNOTE), 1 - P.pnorm((12000 - 15850) / 7500), tN(1 - P.pnorm((12000 - 15850) / 7500), 1 - P.tabPhi((12000 - 15850) / 7500)),
  calc('H = 150X - 14\\,150 \\sim N(15\\,850,\\; 7\\,500^2)', 'Z = -0{,}513', '1 - \\Phi(-0{,}51) = \\Phi(0{,}51) = 0{,}6950 \\;(\\text{tafla}), \\; 0{,}6961 \\;(\\text{nákvæmt})') + note('R: <code>1 - pnorm(12000, mean = 15850, sd = 7500)</code>.'));
MCQ('L05-hv-26', L, 3, 'hv', V6 + ', 3d', 'Forseti lofar minnst 5% hagvexti; söguleg gögn gefa hagvöxt ~ N(2%, 1,5²). Pr(X &gt; 5%) ≈ 0,0228. Hvað má álykta?',
  [['Loforðið er ósennilegt miðað við söguna: líkurnar eru undir 5% (en ekki undir 1%)'], ['Loforðið stenst örugglega ekki', 'Ólíklegt er ekki ómögulegt.'], ['Loforðið er sennilegt því 2,28% > 0', 'Litlar líkur benda til hins gagnstæða.'], ['Ekki hægt að álykta neitt án fleiri gagna', 'Spurt er hvað sagan segir, og hún gefur skýrt svar.'], ['Líkurnar eru 97,7%', 'Það eru líkurnar á að hagvöxtur verði undir 5%.']],
  note('Lausn verkefnisins: miðað við 5% viðmið er tilgátunni hafnað, en ekki miðað við 1%. Þetta er grunnurinn að tilgátuprófum.'));
STEP('L05-gl-19', L, 'gl', G + ', gl. 9–11', 'Leiðið út E[X] og Var[X] fyrir X ~ Unif(a, b).',
  [['E[X]', 2, calc('E[X] = \\int_a^b \\frac{x}{b - a}dx = \\frac{b^2 - a^2}{2(b - a)} = \\frac{(b + a)(b - a)}{2(b - a)} = \\frac{a + b}{2}')],
   ['E[X²]', 1, calc('E[X^2] = \\int_a^b \\frac{x^2}{b - a}dx = \\frac{b^3 - a^3}{3(b - a)} = \\frac{a^2 + ab + b^2}{3}')],
   ['Var[X]', 2, calc('\\mathrm{Var}[X] = \\frac{a^2 + ab + b^2}{3} - \\frac{(a + b)^2}{4} = \\frac{4a^2 + 4ab + 4b^2 - 3a^2 - 6ab - 3b^2}{12} = \\frac{(b - a)^2}{12}')]]);
STEP('L05-gl-20', L, 'gl', G + ', gl. 95–102', 'Leiðið út E[X] = 1/λ og Var[X] = 1/λ² fyrir X ~ Exp(λ) með hlutheildun.',
  [['Hlutheildun fyrir E[X]', 2, calc('u = x, \\; v\' = e^{-\\lambda x} \\Rightarrow v = -\\tfrac{1}{\\lambda}e^{-\\lambda x}', '\\int_0^\\infty x e^{-\\lambda x}dx = \\left[-\\tfrac{x}{\\lambda}e^{-\\lambda x}\\right]_0^\\infty + \\tfrac{1}{\\lambda}\\int_0^\\infty e^{-\\lambda x}dx = 0 + \\tfrac{1}{\\lambda^2}', 'E[X] = \\lambda \\cdot \\tfrac{1}{\\lambda^2} = \\tfrac{1}{\\lambda}') + note('x e<sup>−λx</sup> → 0 þegar x → ∞ (t.d. með reglu L\'Hôpital).')],
   ['E[X²]', 2, calc('u = x^2: \\; \\int_0^\\infty x^2 e^{-\\lambda x}dx = \\tfrac{2}{\\lambda}\\int_0^\\infty x e^{-\\lambda x}dx = \\tfrac{2}{\\lambda^3}', 'E[X^2] = \\lambda \\cdot \\tfrac{2}{\\lambda^3} = \\tfrac{2}{\\lambda^2}')],
   ['Var[X]', 1, calc('\\mathrm{Var}[X] = \\tfrac{2}{\\lambda^2} - \\tfrac{1}{\\lambda^2} = \\tfrac{1}{\\lambda^2}')]]);
STEP('L05-gl-21', L, 'gl', G + ', gl. 41–46', 'Sýnið að ef X ~ N(μ, σ²) og Y = aX + b (a &gt; 0), þá er Y ~ N(aμ + b, a²σ²).',
  [['Dreifingarfall Y', 1, calc('G(y) = \\Pr(aX + b \\le y) = \\Pr\\left(X \\le \\tfrac{y - b}{a}\\right) = F\\left(\\tfrac{y - b}{a}\\right)')],
   ['Diffra (keðjuregla)', 2, calc('g(y) = f\\left(\\tfrac{y - b}{a}\\right)\\cdot\\tfrac{1}{a} = \\frac{1}{\\sqrt{2\\pi}\\,a\\sigma}\\exp\\left[-\\tfrac{1}{2}\\left(\\tfrac{(y - b)/a - \\mu}{\\sigma}\\right)^2\\right]')],
   ['Endurrita veldið', 2, calc('\\frac{(y - b)/a - \\mu}{\\sigma} = \\frac{y - (a\\mu + b)}{a\\sigma}') + note('Þetta er þéttleiki normaldreifingar með meðaltal aμ + b og staðalfrávik aσ, þ.e. dreifni a²σ². Stöðlun Z = (X − μ)/σ er sértilfelli með a = 1/σ, b = −μ/σ.') + slideErr('Glæra 41 segir „staðalfrávik a·σ"; almennt er það |a|σ, því a getur verið neikvætt.')]]);
NUM('L05-gl-22', L, 3, 'gl', G + ', gl. 54', 'X<sub>1</sub> ~ N(10, 3²), X<sub>2</sub> ~ N(20, 4²) og X<sub>3</sub> ~ N(5, 12²) eru óháðar. Hvert er staðalfrávik summunnar?', 13, 0.0005, '',
  calc('\\mathrm{Var}\\left[\\sum X_i\\right] = 9 + 16 + 144 = 169', 'SD = \\sqrt{169} = 13') + slideErr('Á glæru 54 stendur að dreifni summunnar sé Σσ<sub>i</sub>; rétt er Σσ<sub>i</sub>². Með summu staðalfrávika fengist 19.'));
MCQ('L05-gl-23', L, 3, 'gl', G + ', gl. 13–18', 'X hefur F(x) = x³ á [0, 1]. Hvaða R-kóði hermir 1000 gildi úr dreifingu X með jafnri dreifingu?',
  [['<code>x &lt;- runif(1000)^(1/3)</code>'], ['<code>x &lt;- runif(1000)^3</code>', 'Það er F(U), ekki F<sup>−1</sup>(U).'], ['<code>x &lt;- 3 * runif(1000)^2</code>', 'Það er f(U), þéttleikinn.'], ['<code>x &lt;- runif(1000, 0, 3)</code>', 'Jöfn dreifing á [0, 3] hefur ekkert með F að gera.'], ['<code>x &lt;- rnorm(1000)^(1/3)</code>', 'Andhverfu-aðferðin byrjar á U ~ Unif(0, 1).']],
  calc('p = F(x) = x^3 \\Rightarrow x = F^{-1}(p) = p^{1/3}') + note('Spurt er um aðferðina, ekki tölurnar sem dragast.'), { r: true });
MCQ('L05-gl-24', L, 3, 'gl', G + ', gl. 66–67 og 71', 'Y<sub>1</sub> ~ χ²(3) og Y<sub>2</sub> ~ χ²(5) eru óháðar. Hvað gildir um Y<sub>1</sub> + Y<sub>2</sub>?',
  [['χ²(8), með væntigildi 8 og dreifni 16'], ['χ²(8), með væntigildi 8 og dreifni 8', 'Dreifni χ²(k) er 2k.'], ['χ²(15)', 'Frígráðurnar leggjast saman, ekki margfaldast.'], ['N(8, 16) nákvæmlega', 'Summan er nákvæmlega χ²(8); normaldreifing er aðeins nálgun fyrir stórt k.'], ['Ekki χ²-dreifð', 'Summa óháðra χ²-breyta er χ²-dreifð.']],
  calc('\\chi^2(3) + \\chi^2(5) = \\chi^2(8)', 'E = 8, \\quad \\mathrm{Var} = 2 \\cdot 8 = 16') + note('Ástæðan: χ²(k) er summa k óháðra Z<sub>i</sub>², svo summan er summa 3 + 5 slíkra liða.'));
PNUM('L05-ny-1', L, 3, 'ny', 'Ný spurning · t vs normal (gl. 82–92)', 'T ~ t(5). Reiknið Pr(T &gt; 2) með R (<code>1 - pt(2, 5)</code>) og berið saman við Pr(Z &gt; 2) = 0,0228.', 1 - P.pt(2, 5), 0.0005,
  calc('\\Pr(T_5 > 2) = 1 - 0{,}9490 = 0{,}0510') + note('t-dreifingin hefur þykkari hala en N(0, 1), svo líkurnar eru meira en tvöfalt hærri. Við 30+ frígráður er munurinn orðinn lítill.') + unconf('pt er ekki nefnt í glærunum.'));

CARD('L05-c1', L, 'Spjald · glæra 19', 'Hvernig tengjast Poisson-dreifing og veldisdreifing?',
  'Báðar lýsa sama ferlinu, atburðum sem gerast af handahófi með fastri tíðni λ. Poisson-dreifingin telur hve margir atburðir verða á tilteknu tímabili og er strjál. Veldisdreifingin mælir tímann á milli atburða og er samfelld, með væntigildið 1/λ. Ef að jafnaði verða 2 uppsagnir á mánuði er fjöldinn Poisson(2) og biðin á milli Exp(2) með meðalbið hálfan mánuð.',
  ['Sama tíðni λ', 'Poisson: fjöldi (strjál)', 'Exp: biðtími (samfelld)', 'Meðalbið 1/λ']);
CARD('L05-c2', L, 'Spjald · glæra 39–53', 'Hvers vegna dugar ein tafla fyrir allar normaldreifingar?',
  'Hvaða normaldreifða breytu sem er má staðla með Z = (X − μ)/σ, og þá er Z ~ N(0, 1). Það er afleiðing þess að línuleg föll normaldreifðra breyta eru normaldreifð. Því þarf aðeins töflu fyrir Φ(z). Taflan hefur yfirleitt aðeins jákvæð z, en samhverfan gefur Φ(−z) = 1 − Φ(z). Athugið að deila með σ, ekki dreifninni σ².',
  ['Stöðlun Z = (X − μ)/σ', 'Línuleg vörpun → normal', 'Ein tafla fyrir Φ', 'Samhverfa: Φ(−z) = 1 − Φ(z)']);
CARD('L05-c3', L, 'Spjald · glæra 82–92', 'Hvernig er t-dreifingin frábrugðin staðlaðri normaldreifingu og hvenær skiptir munurinn máli?',
  't-dreifingin er samhverf um 0 eins og N(0, 1) en með þykkari hala, svo öfgagildi eru líklegri. Hún er skilgreind sem T = Z/√(Y/k) með Z ~ N(0, 1) og Y ~ χ²(k) óháð. Þegar frígráðurnar k vaxa stefnir nefnarinn á 1 og t(k) nálgast N(0, 1); við 30 eða fleiri frígráður er munurinn lítill. Hún er notuð þegar σ er metið úr litlu úrtaki.',
  ['Samhverf, þykkari halar', 'T = Z/√(Y/k)', 'k → ∞ ⇒ N(0, 1)', 'Lítil úrtök']);
CARD('L05-c4', L, 'Spjald · glæra 55–83', 'Hvernig eru χ²-, F- og t-dreifingarnar byggðar upp úr normaldreifingunni?',
  'χ²(k) er summa k óháðra staðlaðra normaldreifðra breyta í öðru veldi, með væntigildi k og dreifni 2k. F(k₁, k₂) er hlutfall tveggja óháðra χ²-breyta, hvorrar deilt með frígráðum sínum, og er notuð í ANOVA. t(k) er staðlað normal deilt með rótinni af χ²(k)/k. Allar þrjár eru reiknaðar með töflum eða R.',
  ['χ²: summa Z²', 'F: hlutfall χ²/k', 't: Z/√(χ²/k)', 'Töflur eða R']);
}


// ================= L06 · Margvíðar slembibreytur og skilyrt vægi =================
{ const L = 'L06', G = 'Glærur 06', D6 = 'Dæmablað 6';
const T2 = tbl(['f(x, y)', 'Y = 1', 'Y = 2'], [['X = 1', '0,1', '0,1'], ['X = 2', '0,2', '0,6']]);
const T6 = tbl(['f(x, y)', 'y = 1', 'y = 2', 'y = 3'], [['x = 1', '0,125', '0,3125', '0,125'], ['x = 2', '0,0625', '0,0625', '0'], ['x = 3', '0,1075', '0,125', '0,08']]);
const P6 = [[0.125, 0.3125, 0.125], [0.0625, 0.0625, 0], [0.1075, 0.125, 0.08]];
const fexp = M('f(x, y) = 2e^{-x}e^{-2y}, \\; x, y > 0');
const fTri = M('f(x, y) = 2') + ' á 0 &lt; x &lt; y &lt; 1 (og 0 annars)';
PNUM('L06-gl-1', L, 1, 'gl', G + ', gl. 8–9', 'X og Y hafa samþéttleikafallið' + T2 + 'Hvert er F(1, 2) = Pr(X ≤ 1, Y ≤ 2)?', 0.2, 0.0005, calc('F(1, 2) = f(1,1) + f(1,2) = 0{,}1 + 0{,}1 = 0{,}2'));
PNUM('L06-gl-2', L, 1, 'gl', G + ', gl. 9', 'Sama tafla:' + T2 + 'Hvert er F(2, 1)?', 0.3, 0.0005, calc('F(2, 1) = f(1,1) + f(2,1) = 0{,}1 + 0{,}2 = 0{,}3') + trap('F(1, 2) = 0,2 víxlar breytunum; röðin skiptir máli.'));
PNUM('L06-hv-1', L, 1, 'hv', D6 + ', 1a', 'X og Y hafa samþéttleikafallið' + T6 + 'Hverjar eru líkurnar Pr(X = 2, Y = 1)?', 0.0625, 0.0005, calc('f(2, 1) = 0{,}0625') + note('Fyrir strjálar breytur er samþéttleikafallið bara líkurnar á hverri samsetningu.'));
MCQ('L06-gl-3', L, 1, 'gl', G + ', gl. 46–47', 'X og Y hafa ' + fexp + ', með jaðarþéttleikaföll e<sup>−x</sup> og 2e<sup>−2y</sup>. Hvert er væntigildi margvíðu breytunnar (X, Y)?',
  [['Vigurinn (1; 0,5)'], ['1,5', 'Það er E[X + Y], væntigildi falls af breytunum, ekki væntigildi margvíðu breytunnar.'], ['0,5', 'Það er E[XY].'], ['(1; 2)', 'E[Y] = 1/λ = 1/2, ekki λ.'], ['Fylki með dreifnum á hornalínu', 'Það er samdreifnifylkið.']],
  calc('E[(X, Y)] = (E[X], E[Y]) = (1;\\, 0{,}5)'));
NUM('L06-gl-4', L, 1, 'gl', G + ', gl. 61', 'Cov[X, Y] = 1,5. Hvert er Cov[2X + 7, −3Y + 1]?', -9, 0.0005, '', calc('\\mathrm{Cov}[aX + b, cY + d] = ac\\,\\mathrm{Cov}[X, Y] = 2 \\cdot (-3) \\cdot 1{,}5 = -9') + trap('Fastarnir 7 og 1 hafa engin áhrif; a og c eru ekki í öðru veldi.'));
MCQ('L06-gl-5', L, 1, 'gl', G + ', gl. 67–69', 'Hvers vegna er fylgni (correlation) oft notuð frekar en samdreifni?',
  [['Hún er óháð mælieiningum og liggur alltaf á [−1, 1]'], ['Hún mælir orsakasamband', 'Fylgni er ekki orsakasamband (glæra 72–75).'], ['Hún er alltaf jákvæð', 'Fylgni getur verið neikvæð.'], ['Hún er auðveldari í útreikningi því dreifni þarf ekki', 'Hún krefst dreifni beggja breyta.'], ['Fylgni 0 tryggir óhæði', 'Aðeins öfugt: óháðar ⇒ fylgni 0.']],
  calc('\\rho = \\frac{\\mathrm{Cov}[X,Y]}{\\sqrt{\\mathrm{Var}[X]\\mathrm{Var}[Y]}}'));
MCQ('L06-gl-6', L, 1, 'gl', G + ', gl. 56 og 69', 'Hvert eftirfarandi er rétt?',
  [['Ef X og Y eru óháðar er Cov[X, Y] = 0, en Cov = 0 þýðir ekki að þær séu óháðar'], ['Cov[X, Y] = 0 þýðir alltaf að X og Y séu óháðar', 'Svona stendur á glæru 69, en það gildir aðeins í sérstökum tilvikum (t.d. samnormaldreifðar breytur). X ~ N(0, 1) og Y = X² hafa Cov = 0 en eru gjörháðar.'], ['Óháðar breytur geta haft Cov ≠ 0', 'Óhæði gefur E[XY] = E[X]E[Y] og þar með Cov = 0.'], ['Fylgni getur verið 1,5', 'Fylgni er á [−1, 1].'], ['Cov[X, X] = 0', 'Cov[X, X] = Var[X].']],
  slideErr('Glæra 69 segir að fylgni 0 þýði að breyturnar séu óháðar. Aðeins öfuga stefnan gildir almennt.'));
MCQ('L06-gl-7', L, 1, 'gl', G + ', gl. 72–75', 'Gögn sýna jákvæða fylgni milli ísneyslu og innbrota. Hvað er líklegasta skýringin samkvæmt glærunum?',
  [['Þriðja breytan, sumarið, orsakar hvort tveggja'], ['Ísneysla veldur innbrotum', 'Fylgni segir ekkert um orsakasamhengi.'], ['Innbrot valda ísneyslu', 'Sama villa í hina áttina.'], ['Fylgnin hlýtur að vera 1', 'Ekkert gefur til kynna fullkomna fylgni.'], ['Breyturnar eru óháðar', 'Jákvæð fylgni þýðir að þær eru háðar.']],
  note('Að sýna orsakasamband er eitt stærsta vandamálið í hagrannsóknum.'));
MCQ('L06-gl-8', L, 1, 'gl', G + ', gl. 6', 'Hvert eftirfarandi gildir um samdreifingarfall F(x, y)?',
  [['F(∞, ∞) = 1 og F(−∞, y) = F(x, −∞) = 0'], ['F(x, y) = 0 fyrir öll x, y', 'Svona stendur á glæru 6; þar vantar −∞ í annað hnitið.'], ['F(∞, ∞) = 0', 'Líkurnar á að báðar séu undir hæsta gildi eru 1.'], ['F(x, y) = F<sub>X</sub>(x) + F<sub>Y</sub>(y)', 'Ekki almennt; fyrir óháðar breytur er F = F<sub>X</sub>F<sub>Y</sub>.'], ['F getur verið stærra en 1', 'F eru líkur.']],
  slideErr('Á glæru 6 stendur „F(x, y) = 0"; rétt er F(−∞, y) = F(x, −∞) = 0.'));

PNUM('L06-hv-2', L, 2, 'hv', D6 + ', 1c', 'X og Y hafa samþéttleikafallið' + T6 + 'Hverjar eru líkurnar á að X ≤ 2 og Y ≤ 3?', 0.6875, 0.0005,
  calc('F(2, 3) = (0{,}125 + 0{,}3125 + 0{,}125) + (0{,}0625 + 0{,}0625 + 0) = 0{,}6875') + note('Y ≤ 3 er öruggt, svo þetta er bara Pr(X ≤ 2) = f<sub>X</sub>(1) + f<sub>X</sub>(2).'));
PNUM('L06-hv-3', L, 2, 'hv', D6 + ', 1d', 'Sama tafla:' + T6 + 'Hverjar eru líkurnar á að X &lt; 2 og Y &gt; 2?', 0.125, 0.0005, calc('\\Pr(X < 2, Y > 2) = f(1, 3) = 0{,}125') + trap('1 − F(2, 2) = 0,4375 er ekki rétt fylling: „X < 2 og Y > 2" er ekki fyllingin á „X ≤ 2 og Y ≤ 2" (De Morgan).'));
PNUM('L06-hv-4', L, 2, 'hv', D6 + ', 1e', 'Sama tafla:' + T6 + 'Hvert er jaðarþéttleikafallið f<sub>Y</sub>(1)?', 0.295, 0.0005, calc('f_Y(1) = 0{,}125 + 0{,}0625 + 0{,}1075 = 0{,}295') + note('Öll jaðarföll: f<sub>X</sub> = (0,5625; 0,125; 0,3125), f<sub>Y</sub> = (0,295; 0,5; 0,205).') + trap('0,5625 er f<sub>X</sub>(1), summa raðar en ekki dálks.'));
PNUM('L06-hv-5', L, 2, 'hv', D6 + ', 1b', 'Sama tafla:' + T6 + 'Hvert er samdreifingarfallið F(3, 2)?', 0.795, 0.0005, calc('F(3, 2) = \\sum_{x \\le 3}\\sum_{y \\le 2} f(x, y) = 0{,}4375 + 0{,}125 + 0{,}2325 = 0{,}795') + note('Allar raðir, dálkar y = 1 og y = 2.'));
PNUM('L06-gl-9', L, 2, 'gl', G + ', gl. 11 og 14', 'X og Y hafa ' + fexp + '. Reiknið Pr(X &lt; 1, Y &lt; 2).', (1 - Math.exp(-1)) * (1 - Math.exp(-4)), 0.0005,
  calc('F(x, y) = e^{-x}e^{-2y} - e^{-x} - e^{-2y} + 1 = (1 - e^{-x})(1 - e^{-2y})', 'F(1, 2) = (1 - e^{-1})(1 - e^{-4}) = 0{,}6205'));
PNUM('L06-gl-10', L, 2, 'gl', G + ', gl. 18', 'X og Y hafa ' + fexp + '. Reiknið Pr(X &gt; 1, Y &gt; 2).', Math.exp(-5), 0.0005,
  calc('\\int_1^\\infty\\int_2^\\infty 2e^{-x}e^{-2y}\\,dy\\,dx = e^{-1}e^{-4} = e^{-5} = 0{,}0067') + trap('1 − F(1, 2) = 0,3795 er Pr(X > 1 eða Y > 2), ekki „og" (De Morgan: (A ∩ B)<sup>c</sup> = A<sup>c</sup> ∪ B<sup>c</sup>).'));
PNUM('L06-gl-11', L, 2, 'gl', G + ', gl. 19', 'X og Y hafa ' + fexp + '. Reiknið Pr(X &gt; 1, Y &lt; 2).', Math.exp(-1) * (1 - Math.exp(-4)), 0.0005,
  calc('\\int_1^\\infty\\int_0^2 2e^{-x}e^{-2y}\\,dy\\,dx = e^{-1}(1 - e^{-4}) = 0{,}3611') + slideErr('Í síðustu línu glæru 19 stendur e<sup>−1</sup>e<sup>−4</sup>; það á að vera e<sup>−1</sup>(1 − e<sup>−4</sup>). Talan 0,3611 er rétt. Í texta glærunnar stendur líka „y &gt; 2" þar sem á að standa y &lt; 2.'));
NUM('L06-gl-12', L, 2, 'gl', G + ', gl. 49–51', 'X og Y hafa ' + fexp + '. Hvert er E[X + Y]?', 1.5, 0.0005, '', calc('E[X + Y] = E[X] + E[Y] = 1 + 0{,}5 = 1{,}5'));
NUM('L06-gl-13', L, 2, 'gl', G + ', gl. 52 og 63', 'X og Y hafa ' + fexp + '. Hvert er E[XY]?', 0.5, 0.0005, '',
  calc('E[XY] = \\int_0^\\infty\\int_0^\\infty xy\\,2e^{-x}e^{-2y}\\,dx\\,dy = \\int_0^\\infty 2y e^{-2y}\\,dy \\cdot \\int_0^\\infty x e^{-x}\\,dx = 0{,}5 \\cdot 1 = 0{,}5') + note('Cov[X, Y] = 0,5 − 1 · 0,5 = 0: breyturnar eru óháðar, því f þáttast í e<sup>−x</sup>·2e<sup>−2y</sup>.'));
NUM('L06-gl-14', L, 2, 'gl', G + ', gl. 91–95', '20 hagfræðinemar (Y = 1) og 30 viðskiptafræðinemar (Y = 0). Hagfræðinemar fá 1, 2, 3 með líkum 0,2, 0,4, 0,4; viðskiptafræðinemar 0,1, 0,3, 0,6. Hvert er E[X], meðaleinkunn allra?', 2.38, 0.0005, '',
  calc('E[X \\mid Y = 1] = 0{,}2 + 0{,}8 + 1{,}2 = 2{,}2', 'E[X \\mid Y = 0] = 0{,}1 + 0{,}6 + 1{,}8 = 2{,}5', 'E[X] = \\tfrac{2}{5} \\cdot 2{,}2 + \\tfrac{3}{5} \\cdot 2{,}5 = 2{,}38') + trap('(2,2 + 2,5)/2 = 2,35 vegur hópana jafnt.'));
MCQ('L06-gl-15', L, 2, 'gl', G + ', gl. 97–99', 'X og Y hafa ' + fTri + '. Hvert er skilyrta væntigildið E[X | Y = y]?',
  [[M('y/2')], [M('1/y'), 'Það er skilyrti þéttleikinn f<sub>X|Y</sub>(x | y).'], [M('2y'), 'Það er jaðarþéttleikinn f<sub>Y</sub>(y).'], [M('(1 + y)/2'), 'X liggur á (0, y), ekki (y, 1).'], [M('y^2/12'), 'Það er skilyrta dreifnin.']],
  calc('f_Y(y) = \\int_0^y 2\\,dx = 2y', 'f_{X|Y}(x \\mid y) = \\frac{2}{2y} = \\frac{1}{y}, \\; 0 < x < y', 'E[X \\mid Y = y] = \\int_0^y \\frac{x}{y}\\,dx = \\frac{y}{2}') + note('X | Y = y ~ Unif(0, y).'));
NUM('L06-gl-16', L, 2, 'gl', G + ', gl. 64–66', 'Var[X] = 4, Var[Y] = 9 og Cov[X, Y] = −1,5. Hvert er Var[X + Y]?', 10, 0.0005, '', calc('\\mathrm{Var}[X + Y] = 4 + 9 + 2 \\cdot (-1{,}5) = 10') + trap('13 gerir ráð fyrir óhæði.'));
NUM('L06-gl-17', L, 2, 'gl', G + ', gl. 70–71', 'X og Y hafa ' + fexp + '. Hver er Var[Y]?', 0.25, 0.0005, '', calc('E[Y^2] = \\int_0^\\infty y^2\\,2e^{-2y}\\,dy = 0{,}5', '\\mathrm{Var}[Y] = 0{,}5 - 0{,}5^2 = 0{,}25') + note('Y ~ Exp(2), svo Var[Y] = 1/λ² = 0,25.'));

STEP('L06-hv-6', L, 'hv', D6 + ', dæmi 2 (heilt) · engin opinber lausn', 'X og Y hafa f(x, y) = 1,5x + 0,5y á 0 &lt; x, y &lt; 1. a) F(x, y) b) f<sub>X</sub> og f<sub>Y</sub> c) E[(X, Y)] d) samdreifnifylkið e) fylgnin f) eru X og Y háðar?',
  [['a) F(x, y)', 1, calc('F(x, y) = \\int_0^x\\int_0^y (1{,}5u + 0{,}5v)\\,dv\\,du = 0{,}75x^2y + 0{,}25xy^2')],
   ['b) Jaðarföll', 1, calc('f_X(x) = \\int_0^1 (1{,}5x + 0{,}5y)\\,dy = 1{,}5x + 0{,}25', 'f_Y(y) = \\int_0^1 (1{,}5x + 0{,}5y)\\,dx = 0{,}75 + 0{,}5y')],
   ['c) Væntigildi', 1, calc('E[X] = \\int_0^1 x(1{,}5x + 0{,}25)\\,dx = 0{,}625', 'E[Y] = \\int_0^1 y(0{,}75 + 0{,}5y)\\,dy = 0{,}5417')],
   ['d) Samdreifnifylki', 2, calc('E[X^2] = 0{,}4583 \\Rightarrow \\mathrm{Var}[X] = 0{,}06771', 'E[Y^2] = 0{,}375 \\Rightarrow \\mathrm{Var}[Y] = 0{,}08160', 'E[XY] = \\int\\int xy(1{,}5x + 0{,}5y) = 0{,}3333', '\\mathrm{Cov} = 0{,}3333 - 0{,}625 \\cdot 0{,}5417 = -0{,}00521', '\\Sigma = \\begin{pmatrix} 0{,}0677 & -0{,}0052 \\\\ -0{,}0052 & 0{,}0816 \\end{pmatrix}')],
   ['e–f) Fylgni og ályktun', 1, calc('\\rho = \\frac{-0{,}00521}{\\sqrt{0{,}06771 \\cdot 0{,}08160}} = -0{,}0701') + note('Háðar: f(x, y) ≠ f<sub>X</sub>(x)f<sub>Y</sub>(y), og veik neikvæð fylgni segir að þær hreyfist lítillega í gagnstæða átt.') + unconf('Lausnir dæmablaða 6–9 eru ekki í heimildunum; hér er reiknað sjálfstætt og staðfest tölulega.')]]);
NUM('L06-hv-7', L, 3, 'hv', D6 + ', 2d · engin opinber lausn', 'X og Y hafa f(x, y) = 1,5x + 0,5y á 0 &lt; x, y &lt; 1. Reiknið Cov[X, Y].', 1 / 3 - 0.625 * (13 / 24), 0.0001, '',
  calc('E[X] = 0{,}625, \\quad E[Y] = \\tfrac{13}{24} = 0{,}54167', 'E[XY] = 1{,}5 \\cdot \\tfrac{1}{3} \\cdot \\tfrac{1}{2} + 0{,}5 \\cdot \\tfrac{1}{2} \\cdot \\tfrac{1}{3} = \\tfrac{1}{3}', '\\mathrm{Cov} = \\tfrac{1}{3} - 0{,}625 \\cdot 0{,}54167 = -0{,}00521') + trap('Að gera ráð fyrir óhæði (Cov = 0) án þess að athuga hvort f þáttast.'));
NUM('L06-hv-8', L, 3, 'hv', D6 + ', 2e · engin opinber lausn', 'X og Y hafa f(x, y) = 1,5x + 0,5y á 0 &lt; x, y &lt; 1. Reiknið fylgnina ρ.', (1 / 3 - 0.625 * 13 / 24) / Math.sqrt((11 / 24 - 0.625 ** 2) * (3 / 8 - (13 / 24) ** 2)), 0.001, '',
  calc('\\mathrm{Var}[X] = \\tfrac{11}{24} - 0{,}625^2 = 0{,}06771, \\quad \\mathrm{Var}[Y] = \\tfrac{3}{8} - 0{,}54167^2 = 0{,}08160', '\\rho = \\frac{-0{,}00521}{\\sqrt{0{,}06771 \\cdot 0{,}08160}} = -0{,}0701'));
STEP('L06-hv-9', L, 'hv', D6 + ', dæmi 3 (heilt) · engin opinber lausn', 'X = vöxtur fasteignaverðs, Y = sveifluvísir, f(x, y) = (12/19)(1 + y)(1 − x + y) á [0, 1]². a) f<sub>Y</sub>(y) b) f<sub>X|Y</sub>(x | y) c) F<sub>X|Y</sub>(x | y) d) Pr(X &gt; 0,1 | Y = 0,75) e) E[X | Y = 1].',
  [['a) f<sub>Y</sub>', 1, calc('\\int_0^1 (1 - x + y)\\,dx = \\tfrac{1}{2} + y', 'f_Y(y) = \\tfrac{12}{19}(1 + y)\\left(\\tfrac{1}{2} + y\\right)')],
   ['b) Skilyrtur þéttleiki', 1, calc('f_{X|Y}(x \\mid y) = \\frac{f(x, y)}{f_Y(y)} = \\frac{1 - x + y}{\\tfrac{1}{2} + y}') + note('Fastinn 12/19 og (1 + y) styttast út.')],
   ['c) Skilyrt dreifingarfall', 1, calc('F_{X|Y}(x \\mid y) = \\frac{x - x^2/2 + xy}{\\tfrac{1}{2} + y}')],
   ['d) Líkurnar', 1, calc('F(0{,}1 \\mid 0{,}75) = \\frac{0{,}1 - 0{,}005 + 0{,}075}{1{,}25} = 0{,}136', '\\Pr(X > 0{,}1 \\mid Y = 0{,}75) = 1 - 0{,}136 = 0{,}864') + note('Fyllireglan virkar fyrir skilyrtu dreifinguna, því hún er einvíð.')],
   ['e) Skilyrt væntigildi', 1, calc('E[X \\mid Y = 1] = \\int_0^1 x\\frac{2 - x}{1{,}5}\\,dx = \\frac{1 - 1/3}{1{,}5} = 0{,}4444')]]);
PNUM('L06-hv-10', L, 3, 'hv', D6 + ', 3d · engin opinber lausn', 'f(x, y) = (12/19)(1 + y)(1 − x + y) á [0, 1]². Ef Y = 0,75, hverjar eru líkurnar á að X &gt; 0,1?', 1 - 0.17 / 1.25, 0.0005,
  calc('f_{X|Y}(x \\mid 0{,}75) = \\frac{1{,}75 - x}{1{,}25}', '\\Pr(X > 0{,}1 \\mid Y = 0{,}75) = \\int_{0{,}1}^1 \\frac{1{,}75 - x}{1{,}25}dx = 1 - 0{,}136 = 0{,}864') + trap('Að nota jaðardreifingu X í stað skilyrtu dreifingarinnar hunsar upplýsingarnar um Y.'));
NUM('L06-hv-11', L, 3, 'hv', D6 + ', 3e · engin opinber lausn', 'f(x, y) = (12/19)(1 + y)(1 − x + y) á [0, 1]². Hver er vænt hækkun fasteignaverðs í fullkomnu góðæri, E[X | Y = 1]?', 4 / 9, 0.0005, '',
  calc('f_{X|Y}(x \\mid 1) = \\frac{2 - x}{1{,}5}', 'E[X \\mid Y = 1] = \\frac{1}{1{,}5}\\left[x^2 - \\tfrac{x^3}{3}\\right]_0^1 = \\frac{2/3}{1{,}5} = 0{,}4444'));
STEP('L06-gl-18', L, 'gl', G + ', gl. 97–100', 'X og Y hafa ' + fTri + '. Finnið f<sub>X</sub>, f<sub>Y</sub>, E[X | Y = y] og Var[X | Y = y], og sannreynið að E[E[X | Y]] = E[X].',
  [['Jaðarföll', 1, calc('f_X(x) = \\int_x^1 2\\,dy = 2(1 - x)', 'f_Y(y) = \\int_0^y 2\\,dx = 2y')],
   ['Skilyrt vægi', 2, calc('E[X \\mid Y = y] = \\tfrac{y}{2}', '\\mathrm{Var}[X \\mid Y = y] = \\tfrac{y^2}{3} - \\tfrac{y^2}{4} = \\tfrac{y^2}{12}') + note('Skilyrtu vægin eru föll af y og aðeins skilgreind þar sem f<sub>Y</sub>(y) > 0.')],
   ['Endurteknar væntingar', 2, calc('E[E[X \\mid Y]] = E[Y/2] = \\tfrac{1}{2}\\int_0^1 y \\cdot 2y\\,dy = \\tfrac{1}{3}', 'E[X] = \\int_0^1 x \\cdot 2(1 - x)\\,dx = \\tfrac{1}{3}')]]);
PNUM('L06-ny-1', L, 3, 'ny', 'Ný spurning · líkur á svæði (gl. 17–22)', 'X og Y hafa ' + fTri + '. Hverjar eru líkurnar á að X + Y &lt; 1?', 0.5, 0.0005,
  calc('\\Pr(X + Y < 1) = \\int_0^{1/2}\\int_x^{1 - x} 2\\,dy\\,dx = \\int_0^{1/2} 2(1 - 2x)\\,dx = 0{,}5') + note('Þegar f er fasti eru líkurnar f sinnum flatarmál svæðisins (hér 2 · 1/4).') + trap('Að heilda y frá 0 hunsar skilyrðið x < y.'));
MCQ('L06-ny-2', L, 3, 'ny', 'Ný spurning · Cov = 0 ⇏ óhæði (gl. 69)', 'X ~ N(0, 1) og Y = X². Hvað gildir?',
  [['Cov[X, Y] = 0 en X og Y eru háðar'], ['Cov[X, Y] = 0, svo X og Y eru óháðar', 'Y er ákvörðuð af X; þekking á X gefur Y nákvæmlega.'], ['Cov[X, Y] = 1', 'E[XY] = E[X³] = 0 vegna samhverfu.'], ['Cov[X, Y] > 0 því Y vex með |X|', 'Samdreifni mælir aðeins línulegt samband.'], ['Cov er óskilgreint því Y er ekki normaldreift', 'Cov er skilgreint fyrir allar breytur með endanlega dreifni.']],
  calc('\\mathrm{Cov}[X, X^2] = E[X^3] - E[X]E[X^2] = 0 - 0 = 0') + note('Samdreifni og fylgni mæla línulegt samband; hér er sambandið fullkomið en ekki línulegt.'));
NUM('L06-ny-3', L, 3, 'ny', 'Ný spurning · byggð á töflu dæmablaðs 6', 'X og Y hafa samþéttleikafallið' + T6 + 'Reiknið Var[X − Y].', null, 0.0005, '',
  calc('E[X] = 1{,}75, \\; E[Y] = 1{,}91, \\; E[XY] = 3{,}2925', '\\mathrm{Cov} = 3{,}2925 - 1{,}75 \\cdot 1{,}91 = -0{,}05', '\\mathrm{Var}[X] = 3{,}875 - 1{,}75^2 = 0{,}8125, \\quad \\mathrm{Var}[Y] = 4{,}14 - 1{,}91^2 = 0{,}4919', '\\mathrm{Var}[X - Y] = 0{,}8125 + 0{,}4919 - 2(-0{,}05) = 1{,}4044') + trap('Var[X] − Var[Y] = 0,3206 dregur dreifnirnar frá; og −2Cov breytir formerki samdreifniliðarins.'), { calcFrom: 'P6var' });
NUM('L06-ny-4', L, 3, 'ny', 'Ný spurning · byggð á töflu dæmablaðs 6', 'Sama tafla:' + T6 + 'Reiknið E[Y | X = 3].', 0.5975 / 0.3125, 0.0005, '',
  calc('f_X(3) = 0{,}1075 + 0{,}125 + 0{,}08 = 0{,}3125', 'E[Y \\mid X = 3] = \\frac{1 \\cdot 0{,}1075 + 2 \\cdot 0{,}125 + 3 \\cdot 0{,}08}{0{,}3125} = \\frac{0{,}5975}{0{,}3125} = 1{,}912') + trap('0,5975 gleymir að deila með f<sub>X</sub>(3).'));
// reikna svar ny-3 úr töflunni sjálfri
{ const q = BANK.find(b => b.id === 'L06-ny-3'); const xs = [1, 2, 3], ys = [1, 2, 3]; let EX = 0, EY = 0, EXY = 0, EX2 = 0, EY2 = 0;
  xs.forEach((x, i) => ys.forEach((y, j) => { const p = P6[i][j]; EX += x * p; EY += y * p; EXY += x * y * p; EX2 += x * x * p; EY2 += y * y * p; }));
  q.ans = q.x = (EX2 - EX * EX) + (EY2 - EY * EY) - 2 * (EXY - EX * EY); delete q.calcFrom; }

CARD('L06-c1', L, 'Spjald · glæra 32–34', 'Hvers vegna segja jaðardreifingar ekki alla söguna um samdreifingu?',
  'Jaðardreifing lýsir hvorri breytu fyrir sig og fæst með því að summa eða heilda hina breytuna út. Hana má alltaf reikna, hvort sem breyturnar eru óháðar eða ekki. Upplýsingarnar um tengslin milli breytanna glatast hins vegar: mörg ólík samdreifingarföll geta haft sömu jaðarföll. Aðeins ef breyturnar eru óháðar fæst samdreifingin aftur sem margfeldi jaðarfallanna.',
  ['Jaðar = summa/heildi út hina breytuna', 'Alltaf hægt að reikna', 'Tengslin glatast', 'Óháðar: f = f<sub>X</sub>f<sub>Y</sub>']);
CARD('L06-c2', L, 'Spjald · glæra 58–69', 'Hver er munurinn á samdreifni og fylgni?',
  'Samdreifni Cov[X, Y] = E[XY] − E[X]E[Y] mælir hve mikið tvær breytur hreyfast saman, en stærð hennar fer eftir mælieiningum (krónur eða dollarar gefa ólíka tölu fyrir sama samband). Fylgni deilir samdreifninni með staðalfrávikum beggja, svo hún er óháð einingum og liggur á [−1, 1]. Báðar mæla aðeins línulegt samband. Óháðar breytur hafa fylgni 0, en fylgni 0 tryggir ekki óhæði.',
  ['Cov = E[XY] − E[X]E[Y]', 'Cov háð einingum', 'ρ á [−1, 1], einingalaus', 'Aðeins línulegt samband']);
CARD('L06-c3', L, 'Spjald · glæra 89–95', 'Útskýrðu lögmálið um endurteknar væntingar, E[X] = E[E[X | Y]], með dæmi.',
  'Ef við þekkjum væntigildi X innan hvers hóps sem Y skilgreinir getum við fengið heildarvæntigildið með því að vega hópmeðaltölin með líkunum á hópunum. Í dæmi glæranna er meðaleinkunn hagfræðinema 2,2 og viðskiptafræðinema 2,5; vegið með 2/5 og 3/5 fæst 2,38, sem er sama og E[X] reiknað beint. Þetta er önnur birtingarmynd lögmáls heildarlíkinda: Y er „væntur út". Það er mikið notað í hagfræði þegar skilyrt er á ástand.',
  ['Vega skilyrt væntigildi með Pr(Y)', 'Dæmið: 2,2 og 2,5 → 2,38', 'Lögmál heildarlíkinda', 'Skilyrt á ástand']);
CARD('L06-c4', L, 'Spjald · glæra 96–100', 'Hvers vegna eru skilyrt væntigildi og skilyrt dreifni föll af y, og hvenær eru þau óskilgreind?',
  'Skilyrta dreifingin f<sub>X|Y</sub>(x | y) = f(x, y)/f<sub>Y</sub>(y) breytist eftir því á hvaða gildi Y er skilyrt, svo vægi hennar breytast líka. Í dæminu f(x, y) = 2 á 0 &lt; x &lt; y &lt; 1 er E[X | Y = y] = y/2 og Var[X | Y = y] = y²/12: dreifing X þrengist og færist neðar þegar y er lítið. Skilyrtu vægin eru aðeins skilgreind þar sem f<sub>Y</sub>(y) &gt; 0, því annars er deilt með 0.',
  ['f<sub>X|Y</sub> = f/f<sub>Y</sub>', 'Vægi breytast með y', 'Dæmi: y/2 og y²/12', 'Óskilgreint ef f<sub>Y</sub>(y) = 0']);
}


// ================= L07 · Úrtök og höfuðmarkgildissetningin =================
{ const L = 'L07', G = 'Glærur 07', D7 = 'Dæmablað 7'; const P = PROB;
const sv = [87, 92, 99, 87, 10, 98, 85, 97, 94, 59];
const nn = (z1, z2) => P.pnorm(z2) - P.pnorm(z1), nt = (z1, z2) => P.tabPhi(z2) - P.tabPhi(z1);
MCQ('L07-gl-1', L, 1, 'gl', G + ', gl. 10–11', 'Hvað gerir úrtak X<sub>1</sub>, …, X<sub>n</sub> að <b>slembiúrtaki</b>?',
  [['Breyturnar eru óháðar (og hver hefur sömu dreifingu og þýðið)'], ['Úrtakið er stórt', 'Stærð skiptir ekki máli fyrir skilgreininguna.'], ['Gildin eru valin af rannsakanda', 'Val rannsakanda getur einmitt skekkt úrtakið.'], ['Meðaltal úrtaksins er jafnt meðaltali þýðisins', 'Það gildir aðeins að meðaltali: E[X̄] = μ.'], ['Úrtakið nær yfir allt þýðið', 'Þá er það manntal, ekki úrtak.']],
  note('Samkvæmt skilgreiningu úrtaks hefur hver X<sub>i</sub> sömu dreifingu og X; slembiúrtak krefst þess að auki að þær séu óháðar.'));
MCQ('L07-gl-2', L, 1, 'gl', G + ', gl. 12', 'Hvert eftirfarandi er <b>ekki</b> slembiúrtak samkvæmt glærunum?',
  [['Netkönnun sem Útvarp Saga birtir á heimasíðu sinni'], ['Endurtekin köst sama tenings', 'Glærurnar nefna teningaköst sem dæmi um (nær) slembiúrtak.'], ['Hópur fólks valinn af algjöru handahófi', 'Dæmi um slembiúrtak.'], ['Efnafræðitilraun endurtekin við sömu aðstæður', 'Glærurnar nefna þetta sem dæmi um (nær) slembiúrtak.'], ['Dráttur með endurtekningu úr kassa með númeruðum miðum', 'Óháðir dráttir með sömu dreifingu.']],
  note('Í netkönnun velur fólk sig sjálft. Aðrar sem glærurnar nefna: fjöldapóstur HÍ-nema og hagvöxtur á Íslandi 1990–2020.'));
MCQ('L07-gl-3', L, 1, 'gl', G + ', gl. 13–16', 'Hvers vegna er úrtaksmeðaltalið X̄ slembibreyta?',
  [['Það er fall af úrtakinu, sem er safn slembibreyta'], ['Af því það er alltaf normaldreift', 'Það er aðeins nálægt normaldreift fyrir stórt n (CLT).'], ['Það er það ekki; það er fasti', 'Annað úrtak gefur annað meðaltal.'], ['Af því μ er óþekkt', 'μ er fasti, óþekktur eða ekki.'], ['Aðeins ef úrtakið er lítið', 'Það er slembibreyta fyrir öll n.']],
  note('Lýsistærð T = T(X<sub>1</sub>, …, X<sub>n</sub>) er alltaf slembibreyta; t er raungerða gildið.'));
NUM('L07-gl-4', L, 1, 'gl', G + ', gl. 17 og 47', 'Teningi er kastað 3 sinnum. Hvert er E[X̄]?', 3.5, 0.0005, '', calc('E[\\bar{X}] = E[X] = 3{,}5') + note('Væntigildi úrtaksmeðaltals er jafnt meðaltali þýðisins, óháð n.'));
MCQ('L07-gl-5', L, 1, 'gl', G + ', gl. 33–35', 'Hvers vegna er deilt með n − 1 í úrtaksdreifninni S²?',
  [['Svo að E[S²] = σ²: X̄ er sjálft metið úr sama úrtaki, sem veldur bjaga ef deilt er með n'], ['Til að S² verði alltaf stærra en σ²', 'S² er stundum minna en σ²; það er rétt að meðaltali.'], ['Af því eitt gildi er alltaf útlagi', 'Það hefur ekkert með útlaga að gera.'], ['Það skiptir engu máli', 'Fyrir lítil n skiptir það miklu; fyrir stór n litlu.'], ['Svo að S² verði normaldreift', 'Ekki ástæðan; (n − 1)S²/σ² er χ²-dreift ef þýðið er normalt.']],
  note('<code>var()</code> og <code>sd()</code> í R deila líka með n − 1.'));
NUM('L07-hv-1', L, 1, 'hv', D7 + ', 1a', 'Tíu viðskiptavinir svara (0–100): 87, 92, 99, 87, 10, 98, 85, 97, 94, 59. Hver er meðaleinkunnin?', 80.8, 0.005, '', calc('\\bar{x} = \\frac{808}{10} = 80{,}8') + note('Miðgildið er 89,5; útlaginn 10 dregur meðaltalið niður.'));
NUM('L07-gl-6', L, 1, 'gl', G + ', gl. 45', 'Teningaúrtak: 5, 3, 6. Hvert er úrtaksmeðaltalið?', 14 / 3, 0.005, '', calc('\\bar{x} = \\frac{5 + 3 + 6}{3} = 4{,}67'));

NUM('L07-hv-2', L, 2, 'hv', D7 + ', 1b', 'Svörin: 87, 92, 99, 87, 10, 98, 85, 97, 94, 59. Hver er úrtaksdreifnin S²?', P.varS(sv), 0.05, '',
  calc('\\bar{x} = 80{,}8', '\\sum (x_i - \\bar{x})^2 = 6\\,771{,}6', 'S^2 = \\frac{6\\,771{,}6}{9} = 752{,}4') + trap('Að deila með 10 gefur 677,16.'));
NUM('L07-hv-3', L, 2, 'hv', D7 + ', 1c', 'Svörin: 87, 92, 99, 87, 10, 98, 85, 97, 94, 59. Hvert er staðalfrávik úrtaksins S?', P.sdS(sv), 0.005, '', calc('S = \\sqrt{752{,}4} = 27{,}43') + note('R: <code>sd(c(87, 92, 99, 87, 10, 98, 85, 97, 94, 59))</code>.'), { r: true, rc: 'cat(round(sd(c(87, 92, 99, 87, 10, 98, 85, 97, 94, 59)), 4))', rx: '27.4299' });
MCQ('L07-hv-4', L, 2, 'hv', D7 + ', 1d', 'Eftir eina klukkustund hafa 10 svarað og meðaltalið er 80,8. Er ráðlegt að sýna bankaráði það sem mat á ánægju allra viðskiptavina?',
  [['Nei: fyrstu 10 svarendurnir eru ekki slembiúrtak (þeir velja sig sjálfir) og úrtakið er lítið með útlaga'], ['Já, því meðaltalið er óbjagað mat á μ', 'E[X̄] = μ gildir fyrir slembiúrtak; þeir sem svara fyrst eru ekki slembiúrtak.'], ['Já, ef staðalfrávikið er líka sýnt', 'Staðalfrávik lagar ekki skekkt úrtak.'], ['Nei, því það ætti að deila með n − 1', 'Það á við dreifnina, ekki meðaltalið.'], ['Já, því 10 er yfir lágmarksstærð', 'Engin slík lágmarksstærð bjargar sjálfvöldu úrtaki.']],
  note('Síðar svöruðu 85% og meðaltalið var 67,8: snemmbúnir svarendur voru ánægðari en hinir.'));
NUM('L07-hv-5', L, 2, 'hv', D7 + ', 1e', 'Einkunnir 22.732 viðskiptavina eru normaldreifðar með meðaltal 67,8 og staðalfrávik 8,7. Hve margir eru frekar sáttir (einkunn 70–90)? ' + hint('Töflur leyfðar; vikmörkin ná bæði yfir töflugildi og nákvæmt gildi.'), 22732 * nn(2.2 / 8.7, 22.2 / 8.7), Math.ceil(Math.abs(22732 * (nn(2.2 / 8.7, 22.2 / 8.7) - nt(2.2 / 8.7, 22.2 / 8.7)))) + 2, 'manns',
  calc('z_1 = \\frac{70 - 67{,}8}{8{,}7} = 0{,}25, \\quad z_2 = \\frac{90 - 67{,}8}{8{,}7} = 2{,}55', '\\Phi(2{,}55) - \\Phi(0{,}25) = 0{,}9946 - 0{,}5987 = 0{,}3959 \\;(\\text{tafla})', '22\\,732 \\cdot 0{,}3959 \\approx 9\\,000 \\;(\\text{nákvæmt: } 8\\,975)') + unconf('Engin opinber lausn er til við dæmablað 7.'));
NUM('L07-hv-6', L, 2, 'hv', D7 + ', 1f', 'Einkunnir 22.732 viðskiptavina ~ N(67,8; 8,7²). Hve margir eru virkilega sáttir (einkunn yfir 90)? ' + hint('Töflur leyfðar; vikmörkin ná bæði yfir töflugildi og nákvæmt gildi.'), 22732 * (1 - P.pnorm(22.2 / 8.7)), 2, 'manns',
  calc('z = \\frac{90 - 67{,}8}{8{,}7} = 2{,}55', '1 - \\Phi(2{,}55) = 0{,}0054', '22\\,732 \\cdot 0{,}0054 \\approx 122'));
NUM('L07-hv-7', L, 2, 'hv', D7 + ', 2c', 'X er Bernoulli með p = 0,4 og {X<sub>1</sub>, X<sub>2</sub>} er slembiúrtak. Hver er Var[X̄]?', 0.12, 0.0005, '',
  calc('\\mathrm{Var}[\\bar{X}] = \\frac{p(1 - p)}{n} = \\frac{0{,}24}{2} = 0{,}12') + note('Sama fæst beint úr dreifingu X̄: gildin 0; 0,5; 1 með líkum 0,36; 0,48; 0,16.') + trap('0,24 er dreifni einnar mælingar.'));
NUM('L07-hv-8', L, 2, 'hv', D7 + ', 2f', 'X er Bernoulli með p = 0,4 og úrtakið er af stærð n = 3. Hver er Var[X̄<sub>n=3</sub>]?', 0.08, 0.0005, '', calc('\\mathrm{Var}[\\bar{X}] = \\frac{0{,}24}{3} = 0{,}08') + note('Dreifnin minnkar með n, væntigildið (0,4) helst.'));
MCQ('L07-hv-9', L, 2, 'hv', D7 + ', 2a', 'X er Bernoulli með p = 0,4 og n = 2. Hvert er þéttleikafall X̄?',
  [['Pr(X̄ = 0) = 0,36, Pr(X̄ = 0,5) = 0,48, Pr(X̄ = 1) = 0,16'], ['Pr(X̄ = 0) = 0,6, Pr(X̄ = 1) = 0,4', 'Það er dreifing einnar mælingar.'], ['Pr(X̄ = 0) = 0,36, Pr(X̄ = 0,5) = 0,24, Pr(X̄ = 1) = 0,16', 'Gleymdi að 0,5 fæst á tvo vegu (1, 0) og (0, 1); summan yrði 0,76.'], ['Pr(X̄ = 0,4) = 1', 'X̄ er slembibreyta.'], ['Jafnar líkur 1/3 á 0; 0,5; 1', 'Útkomurnar eru ekki jafnlíklegar.']],
  calc('\\Pr(\\bar{X} = 0) = 0{,}6^2 = 0{,}36', '\\Pr(\\bar{X} = 0{,}5) = 2 \\cdot 0{,}4 \\cdot 0{,}6 = 0{,}48', '\\Pr(\\bar{X} = 1) = 0{,}4^2 = 0{,}16'));
NUM('L07-hv-10', L, 2, 'hv', D7 + ', 3a', 'Fjárhæðir eru normaldreifðar með σ = 10.000 kr. Úrtak n = 10 gefur x̄ = 120.000 kr. Reiknið z-gildið ef μ = 100.000 kr.', 20000 / (10000 / Math.sqrt(10)), 0.01, '',
  calc('z = \\frac{120\\,000 - 100\\,000}{10\\,000/\\sqrt{10}} = \\frac{20\\,000}{3\\,162{,}3} = 6{,}32') + note('Pr(Z ≥ 6,32) ≈ 0: nánast útilokað að fá svona hátt meðaltal ef μ = 100.000.') + trap('Að deila með σ = 10.000 í stað σ/√n gefur 2.'));
NUM('L07-hv-11', L, 2, 'hv', D7 + ', 3b', 'Fjárhæðir normaldreifðar, σ óþekkt. Úrtak n = 10 gefur x̄ = 120.000 og s = 9.000. Reiknið t-prófstærðina ef μ = 100.000.', 20000 / (9000 / Math.sqrt(10)), 0.01, '',
  calc('t = \\frac{20\\,000}{9\\,000/\\sqrt{10}} = 7{,}03', '§t ~ t(9); Pr(T ≥ 7,03) ≈ 0,00003') + note('Þegar σ er metið með s er stærðin t-dreifð með n − 1 frígráðum.'));
NUM('L07-hv-12', L, 2, 'hv', D7 + ', 3c', 'Nú eru reikningarnir 500 með x̄ = 111.000 og s = 3.000. Reiknið prófstærðina miðað við μ = 100.000.', 11000 / (3000 / Math.sqrt(500)), 0.05, '',
  calc('z = \\frac{11\\,000}{3\\,000/\\sqrt{500}} = 81{,}99') + note('Forsendur: slembiúrtak; n = 500 er stórt svo höfuðmarkgildissetningin gildir óháð dreifingu fjárhæðanna, og s má nota í stað σ (t ≈ N(0, 1)). Líkurnar eru í raun 0.'));
PNUM('L07-gl-7', L, 2, 'gl', G + ', gl. 51–56', 'X er veldisdreifð með óþekkt λ. Úrtak af stærð 10 gefur x̄ = 3,468. Metið λ með 1/x̄ og notið matið til að finna Pr(X &gt; 5).', Math.exp(-5 / 3.468), 0.001,
  calc('\\hat{\\lambda} = \\frac{1}{3{,}468} = 0{,}288', '\\Pr(X > 5) = e^{-0{,}288 \\cdot 5} = 0{,}237') + slideErr('Á glæru 56 stendur 1 − (1 − e<sup>0,288·5</sup>); mínusinn vantar í veldisvísinn. Talan 0,237 er rétt.'));
NUM('L07-gl-8', L, 2, 'gl', G + ', gl. 47', 'Teningi er kastað 3 sinnum (Var[X] = 35/12). Hver er Var[X̄]?', 35 / 36, 0.0005, '', calc('\\mathrm{Var}[\\bar{X}] = \\frac{35/12}{3} = 0{,}972') + trap('2,92 er dreifni eins kasts.'));
NUM('L07-gl-9', L, 2, 'gl', G + ', gl. 87', 'Veldisdreift þýði, n = 50, x̄ = 3,468 og s² = 5,57. Reiknið z miðað við E[X] = 1,5 (höfuðmarkgildissetningin).', (3.468 - 1.5) / Math.sqrt(5.57 / 50), 0.01, '',
  calc('z = \\frac{3{,}468 - 1{,}5}{\\sqrt{5{,}57/50}} = \\frac{1{,}968}{0{,}3338} = 5{,}90') + note('Pr(Z > 5,9) ≈ 0, svo E[X] = 1,5 er hafnað.'));
NUM('L07-gl-10', L, 2, 'gl', G + ', gl. 95', 'Í úrtaki af stærð 1000 er hlutfallið p̂ = 0,64. Reiknið z miðað við p = 0,5.', 0.14 / Math.sqrt(0.25 / 1000), 0.01, '', calc('z = \\frac{0{,}64 - 0{,}5}{\\sqrt{0{,}5 \\cdot 0{,}5/1000}} = \\frac{0{,}14}{0{,}01581} = 8{,}85'));
PNUM('L07-gl-11', L, 2, 'gl', G + ', gl. 62–63', 'Y er normaldreift með σ² = 4. Úrtak n = 10 gefur ȳ = 4,16. Hverjar eru <b>einhliða</b> líkurnar Pr(Ȳ ≤ 4,16) ef E[Y] = 5,5? ' + hint(TABNOTE), P.pnorm(-1.34 / Math.sqrt(0.4)), nTol(P.pnorm(-1.34 / Math.sqrt(0.4)), P.tabPhi(-1.34 / Math.sqrt(0.4))),
  calc('z = \\frac{4{,}16 - 5{,}5}{\\sqrt{4/10}} = \\frac{-1{,}34}{0{,}6325} = -2{,}12', '\\Phi(-2{,}12) = 0{,}0170') +
  unconf('Glæra 63 notar z = −2,06 (sem er reiknað með S² = 4,22, ekki σ² = 4) og gefur 0,042, sem er hvorki einhliða (0,017) né tvíhliða (0,034) líkur fyrir z = −2,12. Á glærunni stendur líka „miðað við E[Y] = 5" þótt 5,5 sé notað. Spurðu kennarann.'));
PNUM('L07-gl-12', L, 2, 'gl', G + ', gl. 68–69', 'Sama úrtak en σ óþekkt: S² = 4,22, svo t = −1,34/√0,422 = −2,06 með 9 frígráðum. Hverjar eru <b>einhliða</b> líkurnar Pr(T ≤ −2,06)? (R: <code>pt(-2.06, 9)</code>.)', P.pt(-1.34 / Math.sqrt(0.422), 9), 0.001,
  calc('t = \\frac{-1{,}34}{\\sqrt{0{,}422}} = -2{,}063', '\\Pr(T_9 \\le -2{,}063) = 0{,}0346') +
  unconf('Glæra 69 gefur 0,056 „úr t-töflu". Einhliða gildið er 0,035 og tvíhliða 0,069. Meginpunkturinn stendur: t gefur hærri líkur en N(0, 1). Spurðu kennarann hvort átt er við einhliða eða tvíhliða.'));
NUM('L07-gl-13', L, 2, 'gl', G + ', gl. 74', 'Þýðið er veldisdreift með λ = 0,4. Hver er Var[X̄] fyrir úrtak af stærð n = 5?', 1.25, 0.0005, '', calc('\\mathrm{Var}[X] = 1/0{,}4^2 = 6{,}25', '\\mathrm{Var}[\\bar{X}] = 6{,}25/5 = 1{,}25') + note('Hermunin á glærunni fær 1,247 úr 10.000 úrtökum.') + trap('1/λ = 2,5 er væntigildið, ekki dreifnin.'));

STEP('L07-gl-14', L, 'gl', G + ', gl. 35–39', 'Sýnið að E[S²] = Var[X] fyrir slembiúrtak.',
  [['Hjálparjafnan', 1, calc('\\sum (X_i - \\bar{X})^2 = \\sum X_i^2 - n\\bar{X}^2')],
   ['Taka væntigildi', 2, calc('E[S^2] = \\frac{1}{n - 1}\\left(\\sum E[X_i^2] - nE[\\bar{X}^2]\\right)', 'E[X_i^2] = \\mathrm{Var}[X] + E[X]^2, \\quad E[\\bar{X}^2] = \\frac{\\mathrm{Var}[X]}{n} + E[X]^2')],
   ['Einfalda', 2, calc('E[S^2] = \\frac{1}{n - 1}\\left(n\\mathrm{Var}[X] + nE[X]^2 - \\mathrm{Var}[X] - nE[X]^2\\right) = \\frac{(n - 1)\\mathrm{Var}[X]}{n - 1} = \\mathrm{Var}[X]')]]);
NUM('L07-gl-15', L, 3, 'gl', G + ', gl. 40–42', 'Þýðið er normaldreift með σ² = 4. Hver er Var[S²] fyrir úrtak af stærð n = 10?', 2 * 16 / 9, 0.0005, '', calc('\\mathrm{Var}[S^2] = \\frac{2\\sigma^4}{n - 1} = \\frac{2 \\cdot 16}{9} = 3{,}556') + note('Formúlan krefst normaldreifingar (Kurt = 3).') + trap('2σ⁴/n = 3,2 notar n í stað n − 1.'));
NUM('L07-gl-16', L, 3, 'gl', G + ', gl. 47', 'Teningi er kastað 3 sinnum. Reiknið Var[S²] með almennu formúlunni (ferilris tenings er 1,7314).', (35 / 12) ** 2 / 3 * (1.7314285714 - 1 + 1), 0.015, '',
  calc('\\sigma^2 = 35/12 = 2{,}9167, \\quad \\mathrm{Kurt} = \\frac{E[(X - 3{,}5)^4]}{\\sigma^4} = \\frac{14{,}729}{8{,}507} = 1{,}7314', '\\mathrm{Var}[S^2] = \\frac{\\sigma^4}{n}\\left(\\mathrm{Kurt} - 1 + \\frac{2}{n - 1}\\right) = \\frac{8{,}507}{3}(0{,}7314 + 1) = 4{,}91') + note('Glæran fær 4,92 með σ² námundaðri í 2,92.'));
STEP('L07-hv-13', L, 'hv', D7 + ', dæmi 2 (heilt) · engin opinber lausn', 'X ~ Bernoulli(0,4). a) Þéttleikafall X̄ fyrir n = 2 b) E[X̄] c) Var[X̄] d–f) sama fyrir n = 3 g) Hver er munurinn og hvers vegna?',
  [['a–c) n = 2', 2, tbl(['x̄', '0', '0,5', '1'], [['Pr', '0,36', '0,48', '0,16']]) + calc('E[\\bar{X}] = 0{,}5 \\cdot 0{,}48 + 1 \\cdot 0{,}16 = 0{,}4', '\\mathrm{Var}[\\bar{X}] = 0{,}25 \\cdot 0{,}48 + 0{,}16 - 0{,}16 = 0{,}12')],
   ['d–f) n = 3', 2, tbl(['x̄', '0', '1/3', '2/3', '1'], [['Pr', '0,216', '0,432', '0,288', '0,064']]) + calc('E[\\bar{X}] = 0{,}4, \\quad \\mathrm{Var}[\\bar{X}] = 0{,}08')],
   ['g) Samanburður', 1, 'Væntigildið er það sama, E[X̄] = p, en dreifnin minnkar úr 0,24/2 í 0,24/3 því Var[X̄] = Var[X]/n. Stærra úrtak gefur nákvæmara mat.']]);
STEP('L07-hv-14', L, 'hv', D7 + ', dæmi 3 (heilt) · engin opinber lausn', 'Meðalútgreiðsla má ekki vera hærri en 100.000 kr. a) n = 10, x̄ = 120.000, normaldreift og σ = 10.000: Pr(X̄ ≥ 120.000)? b) Sama en σ óþekkt, s = 9.000. c) n = 500, x̄ = 111.000, s = 3.000: líkurnar og forsendurnar.',
  [['a) z', 1, calc('z = \\frac{20\\,000}{10\\,000/\\sqrt{10}} = 6{,}32 \\Rightarrow \\Pr \\approx 0')],
   ['b) t', 2, calc('t = \\frac{20\\,000}{9\\,000/\\sqrt{10}} = 7{,}03, \\; 9 \\text{ frígráður} \\Rightarrow \\Pr \\approx 0{,}00003') + note('Normaldreift þýði og σ metið með s: t-dreifing.')],
   ['c) Stórt úrtak', 2, calc('z = \\frac{11\\,000}{3\\,000/\\sqrt{500}} = 82 \\Rightarrow \\Pr \\approx 0') + note('Forsendur: slembiúrtak og höfuðmarkgildissetningin (n stórt), svo dreifing fjárhæðanna skiptir ekki máli og s má nota í stað σ.')]]);
MCQ('L07-ny-1', L, 3, 'ny', 'Ný spurning · lögmál mikils fjölda vs CLT (gl. 22 og 80–84)', 'Hver er munurinn á lögmáli mikils fjölda og höfuðmarkgildissetningunni?',
  [['LMF segir að X̄ stefni á μ; CLT segir að dreifing X̄ verði nálægt N(μ, σ²/n) fyrir stórt n'], ['Þær segja það sama', 'LMF segir hvert X̄ stefnir; CLT lýsir lögun dreifingarinnar.'], ['LMF gildir aðeins fyrir normaldreifð þýði', 'Hvorug krefst normaldreifðs þýðis (aðeins endanlegrar dreifni).'], ['CLT segir að þýðið verði normaldreift fyrir stórt n', 'Það er dreifing úrtaksmeðaltalsins sem verður nær normaldreifð, ekki þýðið.'], ['LMF tryggir að hvert úrtak gefi rétt mat', 'Aðeins að líkurnar á að vera nálægt μ stefni á 1.']],
  note('Myndirnar af úrtaksmeðaltölum veldisdreifingar fyrir n = 5, 20, 500, 1000 sýna bæði: dreifingin þjappast að 2,5 (LMF) og verður samhverf og bjöllulaga (CLT).'));
MCQ('L07-ny-2', L, 3, 'ny', 'Ný spurning · t eða z (gl. 63–70)', 'Lítið úrtak (n = 10) úr normaldreifðu þýði; σ er óþekkt og metið með S. Hvers vegna gefur t-dreifingin hærri líkur á öfgafullu meðaltali en N(0, 1)?',
  [['S er sjálft slembibreyta; aukaóvissan gefur t-dreifingunni þykkari hala'], ['Vegna þess að t-dreifingin er skökk', 't er samhverf um 0.'], ['Vegna þess að S² er bjagað', 'E[S²] = σ²; S² er óbjagað.'], ['Vegna þess að n er stórt', 'Munurinn skiptir mestu fyrir lítil n.'], ['Hún gerir það ekki; líkurnar eru jafnar', 'Á glærunum: 0,056 (t) á móti 0,042 (z) fyrir sama gildi.']],
  calc('\\frac{\\bar{Y} - \\mu}{S/\\sqrt{n}} = \\frac{Z}{\\sqrt{\\chi^2_{n-1}/(n - 1)}} \\sim t_{n-1}') + note('Fyrir n ≤ 30 er oft miðað við að nota t; þar yfir er munurinn lítill.'));
PNUM('L07-ny-3', L, 3, 'ny', 'Ný spurning · hlutföll og CLT (gl. 92–95)', 'Ef hlutfallið í þýðinu er 0,5, hverjar eru líkurnar á að fá p̂ ≥ 0,55 í slembiúrtaki af stærð 400? (Einhliða; CLT.) ' + hint(TABNOTE), 1 - P.pnorm(2), nTol(1 - P.pnorm(2), 1 - P.tabPhi(2)),
  calc('SD[\\hat{p}] = \\sqrt{\\frac{0{,}25}{400}} = 0{,}025', 'z = \\frac{0{,}55 - 0{,}5}{0{,}025} = 2', '1 - \\Phi(2) = 0{,}0228') + trap('Tvíhliða líkur (0,0455) svara annarri spurningu.'));
NUM('L07-ny-4', L, 3, 'ny', 'Ný spurning · stærð úrtaks', 'Þýði hefur σ = 12. Hve stórt þarf slembiúrtak að minnsta kosti að vera svo að staðalfrávik X̄ sé í mesta lagi 1?', 144, 0, '',
  calc('\\frac{12}{\\sqrt{n}} \\le 1 \\iff \\sqrt{n} \\ge 12 \\iff n \\ge 144') + trap('n = 12 gleymir rótinni.'));

CARD('L07-c1', L, 'Spjald · glæra 22–32', 'Hvað segir lögmál mikils fjölda, og hvað segir það ekki?',
  'Lögmál mikils fjölda segir að þegar úrtakið stækkar stefni líkurnar á að X̄ sé innan við hvaða litla ε sem er frá E[X] á 1. Glærurnar sýna það með hermun: úrtaksmeðaltöl úr Bin(10; 0,4), Exp(4) og N(10, 4) nálgast 4, 0,25 og 10. Það tryggir hins vegar ekki að eitt tiltekið stórt úrtak gefi rétt mat; aðeins að líkurnar á að vera nálægt aukast. Stærra úrtak hjálpar líka aðeins ef það er slembiúrtak.',
  ['X̄ → E[X] með líkum 1', 'Hermun á glærunum', 'Tryggir ekki rétt mat í einu úrtaki', 'Krefst slembiúrtaks']);
CARD('L07-c2', L, 'Spjald · glæra 80–86', 'Hvers vegna er höfuðmarkgildissetningin svona gagnleg?',
  'Hún segir að fyrir nógu stórt n sé X̄ nálægt N(E[X], Var[X]/n), óháð því hver dreifing þýðisins er, svo lengi sem dreifnin er endanleg. Það gerir okkur kleift að álykta um væntigildi þýðisins án þess að þekkja dreifingu þess. Við getum þá reiknað líkurnar á að fá tiltekið úrtaksmeðaltal ef giskað væntigildi er rétt og hafnað giskinu ef líkurnar eru mjög litlar. Hún skýrir líka hvers vegna tvíkosta-, Poisson-, χ²- og t-dreifingar nálgast normaldreifingu.',
  ['X̄ ≈ N(μ, σ²/n) fyrir stórt n', 'Óháð dreifingu þýðisins', 'Ályktun um μ án þess að þekkja dreifinguna', 'Nálgun annarra dreifinga']);
CARD('L07-c3', L, 'Spjald · glæra 33 og 42', 'Hver er munurinn á úrtaksdreifninni S² og dreifni úrtaksmeðaltalsins Var[X̄]?',
  'S² lýsir því hve mikið einstök gildi í gögnunum dreifast um meðaltal sitt og er mat á σ², dreifni þýðisins. Var[X̄] = σ²/n lýsir óvissunni í meðaltalinu sjálfu, þ.e. hve mikið X̄ myndi sveiflast milli úrtaka. S² minnkar ekki þegar n vex, en Var[X̄] gerir það. Þegar σ er óþekkt er S²/n notað sem mat á Var[X̄].',
  ['S²: dreifing gagnanna', 'Var[X̄]: óvissa í meðaltalinu', 'Var[X̄] = σ²/n minnkar með n', 'S²/n metur Var[X̄]']);
CARD('L07-c4', L, 'Spjald · glæra 48–56', 'Hvernig má nota úrtak til að meta stika þegar dreifing þýðisins er þekkt? Takið veldisdreifingu sem dæmi.',
  'Ef vitað er að þýðið er veldisdreift en λ er óþekkt má nýta að E[X] = 1/λ og að E[X̄] = E[X]. Úrtaksmeðaltalið er því mat á 1/λ og λ̂ = 1/X̄. Í dæmi glæranna gefa tvö úrtök af stærð 5 matin 0,219 og 0,421, en sameinað úrtak af stærð 10 gefur 0,288, sem er besta matið því dreifni meðaltalsins er minni. Matið er samt háð óvissu, og svör sem byggja á því, t.d. Pr(X &gt; 5) ≈ 0,237, eru það líka.',
  ['E[X] = 1/λ', 'λ̂ = 1/X̄', 'Stærra úrtak, minni dreifni', 'Óvissa berst í svörin']);
}


// ================= Viðbót: liðir úr heima- og skilaverkefnum sem eru ekki annars staðar =================
{ const S1 = `${M('S = \\{1,2,3,4,5,6,7\\}')}, ${M('A = \\{1,3,5,7\\}')}, ${M('B = \\{7,4,6\\}')} og ${M('C = \\{1,4\\}')}`;
MCQ('L01-hv-22', 'L01', 1, 'hv', 'Dæmablað 1, 1d', `Látum ${S1}. Hvert er ${M('B \\cup C^c')}?`,
  [[M('\\{2,3,4,5,6,7\\}')], [M('\\{2,3,5,6,7\\}'), 'Það er C<sup>c</sup>; B bætir 4 við.'], [M('\\{1,4,6,7\\}'), 'Tók B ∪ C.'], [M('\\{6,7\\}'), 'Tók sniðmengi.'], [M('S'), '1 er hvorki í B né C<sup>c</sup>.']],
  calc('C^c = \\{2,3,5,6,7\\}', 'B \\cup C^c = \\{2,3,4,5,6,7\\}'));
MCQ('L01-hv-23', 'L01', 1, 'hv', 'Dæmablað 1, 1b og 1f', `Látum ${S1}. Hvert er ${M('A^c \\cap B^c')}?`,
  [[M('\\{2\\}')], [M('\\{2,4,6\\}'), 'Það er A<sup>c</sup> eitt og sér.'], [M('\\{1,2,3,5\\}'), 'Það er B<sup>c</sup>.'], [M('\\{1,2,3,4,5,6\\}'), 'Sammengi í stað sniðmengis: A<sup>c</sup> ∪ B<sup>c</sup> = (A ∩ B)<sup>c</sup>.'], [M('\\emptyset'), '2 er bæði í A<sup>c</sup> og B<sup>c</sup>.']],
  calc('A^c = \\{2,4,6\\}, \\quad B^c = \\{1,2,3,5\\}', 'A^c \\cap B^c = \\{2\\} = (A \\cup B)^c') + note('Regla De Morgan.'));
PNUM('L01-hv-24', 'L01', 1, 'hv', 'Dæmablað 1, 4a', 'Áhættusæknir viðskiptavinir verða fyrir tjóni með líkum 35% á ári. Hverjar eru líkurnar á að áhættusækinn einstaklingur verði <b>ekki</b> fyrir tjóni?', 0.65, 0.001,
  calc('\\Pr(e \\mid s) = 1 - \\Pr(t \\mid s) = 1 - 0{,}35 = 0{,}65') + note('Fyllireglan gildir innan skilyrðingar, því skilyrtar líkur eru líkindafall.'));
MCQ('L01-hv-25', 'L01', 1, 'hv', 'Verkefni 2, 1a og 1d', `Látum ${M('S = \\{1, 42, 3, 10, 7, 9\\}')}, ${M('A = \\{1, 3, 7\\}')} og ${M('B = \\{10, 7, 9\\}')}. Hvert er ${M('(A \\cup B)^c')}?`,
  [[M('\\{42\\}')], [M('\\{7\\}'), 'Það er A ∩ B (liður 1a).'], [M('\\{1, 3, 10, 7, 9\\}'), 'Það er A ∪ B sjálft.'], [M('\\emptyset'), '42 er hvorki í A né B.'], [M('\\{1, 3, 42\\}'), 'Það er B<sup>c</sup>.']],
  calc('A \\cup B = \\{1, 3, 10, 7, 9\\}', '(A \\cup B)^c = \\{42\\}'));
}
{ const L = 'L00', V1 = 'Verkefni 1 (R æfingar)';
NUM('L00-hv-14', L, 1, 'hv', V1 + ', 1a og 1c', 'Í verkefni 1 er <code>a &lt;- 21.1</code>, <code>b &lt;- 5</code> og <code>c &lt;- -0.34</code>. Hvert er <code>d</code> eftir <code>d &lt;- a - b - c</code>?', 16.44, 0.001, '',
  calc('21{,}1 - 5 - (-0{,}34) = 16{,}44') + trap('16,1 gleymir að mínus neikvæðrar tölu er plús.'), { r: true, rc: 'a <- 21.1; b <- 5; c <- -0.34; d <- a - b - c; cat(round(d, 6))', rx: '16.44' });
NUM('L00-hv-15', L, 1, 'hv', V1 + ', 1d', 'Með sömu a, b, c (21.1, 5, −0.34): hvert er <code>e &lt;- a * b * c</code>?', -35.87, 0.001, '',
  calc('21{,}1 \\cdot 5 \\cdot (-0{,}34) = -35{,}87') + note('Í lið 1e er síðan reiknað d<sup>e</sup> = 16,44<sup>−35,87</sup>, sem er örsmá jákvæð tala.'), { r: true, rc: 'a <- 21.1; b <- 5; c <- -0.34; cat(round(a * b * c, 6))', rx: '-35.87' });
MCQ('L00-hv-16', L, 1, 'hv', V1 + ', 3b–c', 'Hvað prentar síðasta línan?' + code('minn_vigur2 <- c(10, 20, 30, 40, 50)\nc(sum(minn_vigur2), mean(minn_vigur2), max(minn_vigur2), length(minn_vigur2))'),
  [['150 30 50 5'], ['150 30 50 50', 'length telur stökin (5), skilar ekki síðasta stakinu.'], ['150 3 50 5', 'mean deilir summunni með fjöldanum: 150/5 = 30.'], ['15 30 50 5', 'sum leggur saman stökin sjálf.'], ['150 30 10 5', 'max skilar hæsta gildinu, 50.']],
  '', { r: true, rc: 'minn_vigur2 <- c(10, 20, 30, 40, 50); cat(c(sum(minn_vigur2), mean(minn_vigur2), max(minn_vigur2), length(minn_vigur2)))', rx: '150 30 50 5', rxo: true });
NUM('L00-hv-17', L, 1, 'hv', V1 + ', 3a', 'Hvað skilar <code>log(5)</code> í R?', Math.log(5), 0.0005, '',
  calc('\\ln 5 = 1{,}6094') + note('log í R er náttúrulegur logri (grunnur e); log10 er tugalogri.') + trap('0,699 er log10(5).'), { r: true, rc: 'cat(round(log(5), 4))', rx: '1.6094' });
MCQ('L00-hv-18', L, 2, 'hv', V1 + ', 4c–e', 'Eftir <code>library(quantmod)</code> og <code>getSymbols("DIS")</code> eru hlutabréfaverð Disney í töflunni DIS með dálkum m.a. DIS.Close og DIS.Adjusted. Hvaða skipun skilar hæsta leiðrétta lokaverði?' + ASSUME('Gögnin eru sótt af netinu með getSymbols; spurt er um skipunina, ekki verðið.'),
  [['<code>max(DIS$DIS.Adjusted)</code>'], ['<code>max(DIS)</code>', 'Tekur hámark yfir alla dálka, líka veltuna (Volume).'], ['<code>DIS$DIS.Adjusted[1]</code>', 'Fyrsta gildið, ekki það hæsta.'], ['<code>max(DIS.Adjusted)</code>', 'Dálkurinn er ekki til sem sjálfstæð breyta; vísa þarf í hann með $.'], ['<code>head(DIS$DIS.Adjusted)</code>', 'head sýnir fyrstu sex línurnar.']],
  note('$ vísar í tiltekinn dálk í töflu (data.frame eða xts).'), { r: true });
MCQ('L00-hv-19', L, 1, 'hv', V1 + ', 2b', 'Hvað skilar <code>length(minn_listi)</code>?' + code('minn_vigur <- c(1, 2, 3, 4, 5)\nminn_listi <- list(42, "Halló", minn_vigur)'),
  [['3'], ['7', 'Vigurinn telst eitt stak listans, ekki fimm.'], ['5', 'Það er lengd vigursins.'], ['1', 'Listinn hefur þrjú stök.'], ['Villa: listi getur ekki geymt mismunandi tög', 'Einmitt það sem greinir lista frá vektor.']],
  note('Vektor: eitt tag; listi: mismunandi tög.'), { r: true, rc: 'minn_vigur <- c(1, 2, 3, 4, 5); minn_listi <- list(42, "Halló", minn_vigur); cat(length(minn_listi))', rx: '3', rxo: true });
}
MCQ('L04-hv-19', 'L04', 1, 'hv', 'Dæmablað 4, 2a', 'X hefur dreifingarfallið F(x) = (x − 2)²(10 − 2x)/8 á [2, 4]. Hvert er þéttleikafallið?',
  [[M('f(x) = \\frac{-3x^2 + 18x - 24}{4}')], [M('f(x) = \\frac{(x - 2)(10 - 2x)}{4}'), 'Diffraði aðeins fyrri þáttinn; margfeldisreglan krefst beggja.'], [M('f(x) = \\frac{-2(x - 2)^2}{8}'), 'Diffraði aðeins seinni þáttinn.'], [M('f(x) = \\frac{(x - 2)^2(10 - 2x)}{8}'), 'Það er F sjálft.'], [M('f(x) = \\frac{3x^2 - 18x + 24}{4}'), 'Formerkjavilla; þá yrði f neikvætt á (2, 4).']],
  calc('F\'(x) = \\frac{2(x - 2)(10 - 2x) - 2(x - 2)^2}{8} = \\frac{-3x^2 + 18x - 24}{4}'));
PNUM('L05-hv-27', 'L05', 1, 'hv', 'Dæmablað 5, 3b', 'Dagleg sala á pylsum er N(200, 50²). Hverjar eru líkurnar á sölu undir 100? ' + hint(TABNOTE), PROB.pnorm(-2), 0.001,
  calc('Z = \\frac{100 - 200}{50} = -2', '\\Phi(-2) = 1 - \\Phi(2) = 0{,}0228') + note('Samhverfa: sama og Pr(X > 300).'));
NUM('L05-hv-28', 'L05', 1, 'hv', 'Verkefni 6, 2b', 'Tíminn milli ríkisskuldakreppna T er veldisdreifður með meðaltal 10 ár. Hver er Var[T]?', 100, 0.001, 'ár²', calc('\\mathrm{Var}[T] = \\frac{1}{\\lambda^2} = \\frac{1}{0{,}01} = 100') + trap('10 er staðalfrávikið (og væntigildið).'));
MCQ('L03-hv-25', 'L03', 1, 'hv', 'Verkefni 4, 2a', 'Líkur á að einstaklingur mæti í ræktina í hverjum mánuði eru 40%, óháð milli mánaða. X = fjöldi mánaða á ári sem hann mætir. Hverjir eru stikar X?',
  [['n = 12, p = 0,4'], ['n = 0,4, p = 12', 'Víxlaði stikunum.'], ['λ = 4,8', 'Fastur fjöldi tilrauna: tvíkosta, ekki Poisson.'], ['n = 12, p = 0,6', '0,6 eru líkurnar á að mæta ekki.'], ['n = 52, p = 0,4', 'Tilraunin er hver mánuður, ekki vika.']],
  calc('X \\sim \\mathrm{Bin}(12;\\, 0{,}4)'));
PNUM('L02-hv-19', 'L02', 1, 'hv', 'Dæmablað 2, 1b', 'Stjörnudreifingin hefur Pr(X = k) = 0,25; 0,25; 0,15; 0,15; 0,1; 0,1 fyrir k = 1, …, 6. Hvert er F(4)?', 0.8, 0.001, calc('F(4) = 0{,}25 + 0{,}25 + 0{,}15 + 0{,}15 = 0{,}8') + trap('f(4) = 0,15 er aðeins einn liður.'));


// ================= L08 · Metlar og punktamat =================
{ const L = 'L08', G = 'Glærur 08 Metlar og punktamöt', D8 = 'Dæmablað 8';
const NOSOL = ' · engin opinber lausn';
const kaffi = '5, 4, 1, 4, 2, 5, 4, 4, 5, 5';
const lan = '5, 4, 1, 4, 3, 5, 4, 4, 5, 5';
// ---------- stig 1 ----------
MCQ('L08-gl-1', L, 1, 'gl', G + ', gl. 7', 'Hvenær er metillinn θ̂ óbjagaður fyrir θ?',
  [[M('E[\\hat\\theta] = \\theta')], [M('\\mathrm{Var}[\\hat\\theta] = 0'), 'Það væri metill án óvissu; óbjagi snýst um væntigildið.'], [M('\\hat\\theta = \\theta') + ' í hverju úrtaki', 'Metill hittir nánast aldrei nákvæmlega; óbjagi segir að hann hitti að jafnaði.'], [M('\\lim_{n\\to\\infty}\\mathrm{Var}[\\hat\\theta] = 0'), 'Það er samkvæmni (gl. 17), ekki óbjagi.'], [M('\\mathrm{Var}[\\hat\\theta]') + ' er minni en dreifni annarra metla', 'Það er skilvirkni (gl. 14).']],
  calc('B(\\hat\\theta) = E[\\hat\\theta] - \\theta = 0') + note('Eiginleikarnir þrír: óbjagaður (væntigildi), skilvirkur (dreifni), samkvæmur (hegðun þegar n → ∞).'));
NUM('L08-gl-2', L, 1, 'gl', G + ', gl. 8', 'Metill θ̂ hefur E[θ̂] = 47 þegar rétt gildi er θ = 50. Hver er bjagi metilsins?', -3, 0.001, '',
  calc('B(\\hat\\theta) = E[\\hat\\theta] - \\theta = 47 - 50 = -3') + note('Neikvæður bjagi: metillinn vanmetur θ að jafnaði.') + trap('θ − E[θ̂] = 3 snýr formerkinu við.'));
MCQ('L08-gl-3', L, 1, 'gl', G + ', gl. 9–11', 'Hver er munurinn á beinni meðalskekkju (MAE) og meðalferskekkju (MSE)?',
  [['MSE refsar stórum skekkjum hlutfallslega meira en MAE, því skekkjan er sett í annað veldi'], ['MAE refsar stórum skekkjum meira', 'Í MAE vex framlagið línulega; í MSE vex það með öðru veldi.'], ['Þær gefa alltaf sömu röðun á metlum', 'Ekki endilega; metill með fáar en stórar skekkjur getur haft lága MAE en háa MSE.'], ['MSE tekur aðeins tillit til formerkis skekkjunnar', 'Hvorug tekur tillit til formerkis; |·| og (·)² fjarlægja það.'], ['MAE er sama og bjagi', 'Bjagi E[θ̂] − θ getur verið 0 þótt MAE sé stór, því jákvæðar og neikvæðar skekkjur jafnast út.']],
  calc('\\mathrm{MAE} = E[|\\hat\\theta - \\theta|], \\quad \\mathrm{MSE} = E[(\\hat\\theta - \\theta)^2]'));
MCQ('L08-gl-4', L, 1, 'gl', G + ', gl. 15–16', 'Bæði X̄ og Ẋ = X<sub>1</sub> (fyrsta stakið) eru óbjagaðir metlar fyrir E[X]. Hvor er skilvirkari ef n > 1, og hvers vegna?',
  [['X̄, því Var[X̄] = Var[X]/n er minni en Var[Ẋ] = Var[X]'], ['Ẋ, því hann er einfaldari', 'Skilvirkni ræðst af dreifni, ekki einfaldleika.'], ['Þeir eru jafn skilvirkir því báðir eru óbjagaðir', 'Óbjagi er forsenda samanburðarins; skilvirkni ber saman dreifnirnar.'], ['X̄, því hann er bjagaður en Ẋ ekki', 'Báðir eru óbjagaðir: E[X̄] = E[Ẋ] = E[X].'], ['Ẋ, því Var[Ẋ] = Var[X]/n', 'Ẋ notar aðeins eitt stak, svo dreifni hans er Var[X].']],
  calc('\\mathrm{Var}[\\bar X] = \\frac{\\mathrm{Var}[X]}{n} < \\mathrm{Var}[X] = \\mathrm{Var}[\\dot X]') + slideErr('Á glæru 15 stendur „Bæði X̄ og X̃"; átt er við Ẋ = X<sub>1</sub>.'));
NUM('L08-gl-5', L, 1, 'gl', G + ', gl. 29', 'X er jafndreifð á [0, β] með β óþekkt. Úrtak gefur x̄ = 5. Metið β með vægjaaðferðinni.', 10, 0.001, '',
  calc('E[X] = \\frac{0 + \\beta}{2}', '5 = \\frac{0 + \\hat\\beta}{2} \\Rightarrow \\hat\\beta = 10') + trap('β̂ = 5 ruglar saman matinu á E[X] og matinu á β.'));
NUM('L08-gl-6', L, 1, 'gl', G + ', gl. 58–62', 'Eftirspurn Q = α + βP. Gögnin eru P = 10, 20, 30, 40 og Q = 100, 90, 80, 70. Hvert er matið á α með aðferð minnstu kvaðrata?', 110, 0.001, '',
  calc('4\\alpha + 100\\beta = 340, \\quad 100\\alpha + 3000\\beta = 8000', '\\alpha = 85 - 25\\beta \\Rightarrow 8500 + 500\\beta = 8000 \\Rightarrow \\beta = -1', '\\alpha = 85 - 25 \\cdot (-1) = 110') + note('Punktarnir liggja nákvæmlega á línunni Q = 110 − P, svo summa kvaðratanna er 0.') + trap('85 er α ef β gleymist (α = 85 − 25β með β = 0).'));
NUM('L08-gl-7', L, 1, 'gl', G + ', gl. 45–47', 'X er jafndreifð á [0, β]. Úrtakið er 4,11; 1,58; 8,39; 6,57; 9,11; 9,22; 8,92; 8,46; 5,23; 6,53. Hvert er sennileikamatið á β?', 9.22, 0.0005, '',
  calc('L(\\beta) = \\frac{1}{\\beta^{10}} \\;\\text{ef}\\; \\beta \\ge 9{,}22', '\\hat\\beta = \\max x_i = 9{,}22') + note('L(β) minnkar þegar β stækkar, en β má ekki vera undir stærsta gildinu.') + trap('Vægjaaðferðin gefur 2x̄ = 13,624; það er annar metill.'));
MCQ('L08-gl-8', L, 1, 'gl', G + ', gl. 4–5', 'Forstjórinn biður um mat á hagnaði næsta árs. Hvað af eftirfarandi er bilmat?',
  [['„Hagnaðurinn verður líklega á bilinu 80–120 m.kr."'], ['„Hagnaðurinn verður 100 m.kr."', 'Eitt gildi er punktamat.'], ['„Meðalhagnaður síðustu ára er 95 m.kr."', 'Úrtaksmeðaltal er punktamat.'], ['„Hagnaðurinn verður jákvæður"', 'Það er fullyrðing, ekki bil utan um einkennandi gildi.'], ['„Staðalfrávik hagnaðar er 15 m.kr."', 'Það er punktamat á öðrum stika.']],
  note('Punktamat: eitt gildi (t.d. X̄ fyrir E[X]). Bilmat: bil utan um gildið; fjallað um það í 09.'));
MCQ('L08-gl-9', L, 1, 'gl', G + ', gl. 20–23', 'Hvers vegna er X̄ kallað stikalaus metill fyrir E[X]?',
  [['Það þarf enga forsendu um dreifingu þýðisins, aðeins að væntigildið sé til'], ['Af því að það hefur enga stika', 'X̄ metur stika (væntigildið); „stikalaus" vísar til forsendna um dreifingu þýðisins.'], ['Af því að það er alltaf normaldreift', 'X̄ er aðeins nálægt normaldreift fyrir stórt n (CLT); það skiptir ekki máli hér.'], ['Af því að það er bjagað', 'X̄ er óbjagaður.'], ['Af því að það er reiknað í tölvu', 'K-næsti nágranni er dæmi um reiknifrekan stikalausan metil, en það er ekki skilgreiningin.']],
  note('Stikabundnir metlar gefa sér dreifingu (t.d. normaldreifingu) og geta ályktað meira, en eru viðkvæmari fyrir röngum forsendum.'));
NUM('L08-hv-1', L, 1, 'hv', D8 + ', 1a' + NOSOL, `Fjöldi vina sem mætir í kaffi síðustu tíu skipti: ${kaffi}. Metið meðalfjöldann sem mætir.`, 3.9, 0.001, '',
  calc('\\bar{x} = \\frac{5 + 4 + 1 + 4 + 2 + 5 + 4 + 4 + 5 + 5}{10} = \\frac{39}{10} = 3{,}9') + note('Vægjaaðferðin: úrtaksmeðaltalið metur E[X].'));
// ---------- stig 2 ----------
NUM('L08-gl-10', L, 2, 'gl', G + ', gl. 30–31', 'X er jafndreifð á [α, β] og báðir stikar óþekktir. Úrtak gefur x̄ = 8 og S² = 12. Hvert er mat vægjaaðferðarinnar á β?', 14, 0.001, '',
  calc('\\frac{\\hat\\alpha + \\hat\\beta}{2} = 8, \\quad \\frac{(\\hat\\beta - \\hat\\alpha)^2}{12} = 12', '\\hat\\beta - \\hat\\alpha = 12, \\quad \\hat\\alpha + \\hat\\beta = 16', '\\hat\\alpha = 2, \\quad \\hat\\beta = 14') + note('Hin lausnin (α̂ = 14, β̂ = 2) er útilokuð því α < β. Tveir óþekktir stikar þurfa tvö vægi.') + trap('√12 = 3,46 sem hálf breidd gleymir 12 í nefnaranum.'));
NUM('L08-gl-11', L, 2, 'gl', G + ', gl. 50–53', 'Úrtak úr N(μ, σ²): 2,32; 2,23; 0,34; 0,61; −0,73; 2,43; 1,53; −0,92; 0,56; 3,91. Hvert er sennileikamatið á μ?', 1.228, 0.0005, '',
  calc('\\frac{\\partial \\ell}{\\partial \\mu} = \\frac{\\sum (x_i - \\hat\\mu)}{\\hat\\sigma^2} = 0 \\Rightarrow \\hat\\mu = \\bar{x}', '\\hat\\mu = \\frac{12{,}28}{10} = 1{,}228'));
NUM('L08-gl-12', L, 2, 'gl', G + ', gl. 54–55', 'Sama úrtak (2,32; 2,23; 0,34; 0,61; −0,73; 2,43; 1,53; −0,92; 0,56; 3,91), μ̂ = 1,228. Hvert er sennileikamatið á σ²?', 2.098996, 0.001, '',
  calc('\\hat\\sigma^2 = \\frac{1}{n}\\sum (x_i - 1{,}228)^2 = \\frac{20{,}990}{10} = 2{,}099') + note('Sennileikamatið deilir með n og er bjagað; S² = 20,990/9 = 2,332 er óbjagaða matið. Bjaginn hverfur þegar n vex.') +
  slideErr('Á glæru 54 stendur σ̂² = 1,647. Rétt gildi fyrir gögnin á glæru 50 er 2,099 (staðfest í R).') + trap('2,332 deilir með n − 1; spurt er um sennileikamatið.'), { r: true, rc: 'x <- c(2.32,2.23,0.34,0.61,-0.73,2.43,1.53,-0.92,0.56,3.91); cat(round(sum((x - mean(x))^2) / 10, 6))', rx: '2.098996' });
NUM('L08-gl-13', L, 2, 'gl', G + ', gl. 67–70', 'Gögnin eru nú P = 10, 20, 30, 40 og Q = 107, 85, 81, 63 (með skekkju). Metið β í Q = α + βP + ε með aðferð minnstu kvaðrata.', -1.36, 0.001, '',
  calc('\\bar{P} = 25, \\quad \\bar{Q} = 84', '\\sum (P_i - \\bar P)(Q_i - \\bar Q) = (-15)(23) + (-5)(1) + 5(-3) + 15(-21) = -680', '\\sum (P_i - \\bar P)^2 = 225 + 25 + 25 + 225 = 500', '\\hat\\beta = \\frac{-680}{500} = -1{,}36') + note('Glærurnar setja dæmið upp en reikna það ekki; svarið er staðfest með lm() í R.'), { r: true, rc: 'P <- c(10,20,30,40); Q <- c(107,85,81,63); cat(coef(lm(Q ~ P))[2])', rx: '-1.36' });
NUM('L08-gl-14', L, 2, 'gl', G + ', gl. 67–70', 'P = 10, 20, 30, 40 og Q = 107, 85, 81, 63, og β̂ = −1,36. Hvert er α̂?', 118, 0.001, '',
  calc('\\hat\\alpha = \\bar{Q} - \\hat\\beta \\bar{P} = 84 - (-1{,}36) \\cdot 25 = 84 + 34 = 118') + trap('84 − 34 = 50 gleymir að mínus sinnum mínus er plús.'));
NUM('L08-hv-2', L, 2, 'hv', D8 + ', 2c' + NOSOL, `Afgreiðslutími lána (dagar), veldisdreifður: ${lan}. Hvert er sennileikamatið á λ?`, 0.25, 0.0005, '',
  calc('\\ell(\\lambda) = 10\\log\\lambda - \\lambda\\sum x_i = 10\\log\\lambda - 40\\lambda', '\\frac{d\\ell}{d\\lambda} = \\frac{10}{\\lambda} - 40 = 0 \\Rightarrow \\hat\\lambda = \\frac{10}{40} = 0{,}25') + note('Meðalafgreiðslutíminn er metinn 1/λ̂ = 4 dagar.') + trap('λ̂ = x̄ = 4 er matið á meðalbiðinni, ekki á tíðninni.'));
NUM('L08-hv-3', L, 2, 'hv', D8 + ', 1b' + NOSOL, `Kaffigögnin: ${kaffi}. Metið dreifni fjöldans sem mætir (notið S²).`, 16.9 / 9, 0.001, '',
  calc('\\sum (x_i - 3{,}9)^2 = 1{,}21 + 0{,}01 + 8{,}41 + 0{,}01 + 3{,}61 + 1{,}21 + 0{,}01 + 0{,}01 + 1{,}21 + 1{,}21 = 16{,}9', 'S^2 = \\frac{16{,}9}{9} = 1{,}878') + note('Dæmablaðið segir „metið dreifingu"; átt er við dreifnina, sem er seinna vægið í lið c.') + trap('16,9/10 = 1,69 deilir með n.'));
NUM('L08-hv-4', L, 2, 'hv', D8 + ', 1c' + NOSOL, `Kaffigögnin (${kaffi}) eru talin Bin(n, p). Metið n með vægjaaðferðinni og námundið að næstu heiltölu.`, 8, 0, 'vinir',
  calc('np = 3{,}9, \\quad np(1 - p) = 1{,}878', '1 - \\hat p = \\frac{1{,}878}{3{,}9} = 0{,}4815 \\Rightarrow \\hat p = 0{,}5185', '\\hat n = \\frac{3{,}9}{0{,}5185} = 7{,}52 \\approx 8') +
  unconf('Engin lausn er til. Með dreifni sem deilir með n (1,69) fæst n̂ = 6,88 ≈ 7. Hér er S² notað, eins og í dæmi glæru 30.') + trap('n̂ = 5 (stærsta gildið í gögnunum) er ekki vægjamat; það er aðeins neðri mörk fyrir n.'));
PNUM('L08-hv-5', L, 2, 'hv', D8 + ', 1c' + NOSOL, `Með n̂ = 8 (námundað), hvert er þá matið á p fyrir kaffigögnin (x̄ = 3,9)?`, 3.9 / 8, 0.001,
  calc('\\hat p = \\frac{\\bar{x}}{\\hat n} = \\frac{3{,}9}{8} = 0{,}4875') + note('Eftir námundun á n er p endurmetið úr fyrsta væginu, svo E[X] = n̂p̂ standist áfram.') + unconf('Óljóst hvort dæmablaðið vill p̂ fyrir eða eftir námundun (0,5185 eða 0,4875).'));
MCQ('L08-hv-6', L, 2, 'hv', D8 + ', 2a–b' + NOSOL, `Afgreiðslutímar lána ${lan} (summa 40) eru úr Exp(λ). Hver er logrinn af sennileikafallinu, einfaldaður?`,
  [[M('\\ell(\\lambda) = 10\\log\\lambda - 40\\lambda')], [M('\\ell(\\lambda) = \\lambda^{10} e^{-40\\lambda}'), 'Það er sennileikafallið L(λ) sjálft, ekki logrinn.'], [M('\\ell(\\lambda) = \\log\\lambda - 40\\lambda'), 'Gleymir að log λ kemur fyrir einu sinni fyrir hvert af 10 gildum.'], [M('\\ell(\\lambda) = 10\\log\\lambda + 40\\lambda'), 'log(e<sup>−λx</sup>) = −λx; formerkið snýst ekki.'], [M('\\ell(\\lambda) = -10\\log\\lambda - 40\\lambda'), 'log(λe<sup>−λx</sup>) = log λ − λx, svo log λ er jákvætt.']],
  calc('L(\\lambda) = \\prod_{i=1}^{10} \\lambda e^{-\\lambda x_i} = \\lambda^{10} e^{-\\lambda \\sum x_i}', '\\ell(\\lambda) = 10\\log\\lambda - \\lambda \\cdot 40'));
MCQ('L08-hv-7', L, 2, 'hv', D8 + ', 3a–b' + NOSOL, 'Laga á parabólu y = αx² + βx að 10 punktum (x<sub>i</sub>, y<sub>i</sub>) með aðferð minnstu kvaðrata. Hvaða vandamál er leyst?',
  [[M('\\arg\\min_{\\alpha,\\beta} \\sum_{i=1}^{n} (y_i - \\alpha x_i^2 - \\beta x_i)^2')], [M('\\arg\\max_{\\alpha,\\beta} \\sum (y_i - \\alpha x_i^2 - \\beta x_i)^2'), 'Summan á að lágmarka, ekki hámarka.'], [M('\\arg\\min_{\\alpha,\\beta} \\sum (y_i - \\alpha x_i - \\beta)^2'), 'Það er bein lína, ekki parabólan y = αx² + βx.'], [M('\\arg\\min_{\\alpha,\\beta} \\sum |y_i - \\alpha x_i^2 - \\beta x_i|'), 'Það er minnsta beina frávik, ekki minnstu kvaðröt.'], [M('\\arg\\min_{\\alpha,\\beta} \\sum (x_i - \\alpha y_i^2 - \\beta y_i)^2'), 'x og y hafa víxlast; spáð er fyrir um y.']],
  calc('g(x_i \\mid \\alpha, \\beta) = \\alpha x_i^2 + \\beta x_i') + note('Líkanið er ólínulegt í x en línulegt í stikunum α og β, svo aðferð minnstu kvaðrata virkar (gl. 72).'));
NUM('L08-gl-15', L, 2, 'gl', G + ', gl. 13 og 76–79', 'X hefur Var[X] = 9 og n = 4. Hvert er E[S̃²] þar sem S̃² = (1/n)Σ(X<sub>i</sub> − X̄)²?', 6.75, 0.001, '',
  calc('E[\\tilde S^2] = \\frac{n - 1}{n}\\mathrm{Var}[X] = \\frac{3}{4} \\cdot 9 = 6{,}75') + note('Bjaginn er −Var[X]/n = −2,25; hann hverfur þegar n → ∞, svo metillinn er samkvæmur.') + trap('9 gildir fyrir S² (deilt með n − 1), sem er óbjagaður.'));
MCQ('L08-gl-16', L, 2, 'gl', G + ', gl. 17–18', 'Hvers vegna er Ẋ = X<sub>1</sub> ekki samkvæmur metill fyrir E[X]?',
  [['Dreifni hans er Var[X] óháð n, svo hún stefnir ekki á 0'], ['Af því að hann er bjagaður', 'Ẋ er óbjagaður: E[X<sub>1</sub>] = E[X].'], ['Af því að Var[Ẋ] = Var[X]/n', 'Það er dreifni X̄. Ẋ notar aðeins eitt stak.'], ['Hann er samkvæmur, því hann er óbjagaður', 'Óbjagi og samkvæmni eru ólíkir eiginleikar.'], ['Af því að Ẋ getur verið neikvætt', 'Formerkið skiptir ekki máli.']],
  calc('\\lim_{n\\to\\infty} \\mathrm{Var}[\\dot X] = \\mathrm{Var}[X] \\neq 0, \\quad \\lim_{n\\to\\infty} \\mathrm{Var}[\\bar X] = \\lim \\frac{\\mathrm{Var}[X]}{n} = 0') +
  note('Glæra 17 skilgreinir samkvæmni með lim Var[θ̂] = 0. Nákvæmar þarf líka bjaginn að stefna á 0 (MSE → 0): fasti eins og θ̂ = 5 hefur dreifni 0 en er ekki samkvæmur.'));
NUM('L08-ny-1', L, 2, 'ny', 'Ný spurning · MSE = Var + bjagi² (gl. 8–10)', 'Metill hefur Var[θ̂] = 4 og bjaga B(θ̂) = −1,5. Hver er meðalferskekkjan?', 6.25, 0.001, '',
  calc('\\mathrm{MSE} = \\mathrm{Var}[\\hat\\theta] + B(\\hat\\theta)^2 = 4 + (-1{,}5)^2 = 6{,}25') + note('MSE = E[(θ̂ − θ)²] skiptist í dreifni og bjaga í öðru veldi.') + trap('4 − 1,5 = 2,5 notar bjagann án þess að setja hann í annað veldi.'));
// ---------- stig 3 ----------
NUM('L08-hv-8', L, 3, 'hv', D8 + ', 2d' + NOSOL, 'Sennileikametillinn fyrir veldisdreifingu er λ̂ = n/ΣX<sub>i</sub>, og E[1/ΣX<sub>i</sub>] = λ/(n − 1). Ef n = 10 og rétt λ = 0,25, hvert er E[λ̂]?', 10 * 0.25 / 9, 0.0005, '',
  calc('E[\\hat\\lambda] = n \\cdot E\\left[\\frac{1}{\\sum X_i}\\right] = \\frac{n\\lambda}{n - 1} = \\frac{10 \\cdot 0{,}25}{9} = 0{,}2778') + note('E[λ̂] ≠ λ, svo metillinn er bjagaður (ofmetur λ um 11%). Óbjagaður metill: (n − 1)/ΣX<sub>i</sub>.') + trap('E[n/ΣX] = n/E[ΣX] = λ væri rétt aðeins ef 1/x væri línulegt (Jensen).'));
STEP('L08-hv-9', L, 'hv', D8 + ', dæmi 2 (heilt)' + NOSOL, `Afgreiðslutímar 10 lána (dagar) eru ${lan} og veldisdreifðir. a) Sennileikafall b) logri þess c) sennileikamat á λ d) sýnið að metillinn er bjagaður.`,
  [['a) Sennileikafall', 1, calc('L(\\lambda) = \\prod_{i=1}^{10} \\lambda e^{-\\lambda x_i} = \\lambda^{10} e^{-\\lambda \\sum x_i} = \\lambda^{10} e^{-40\\lambda}')],
   ['b) Logri', 1, calc('\\ell(\\lambda) = 10\\log\\lambda - 40\\lambda')],
   ['c) Hámörkun', 1, calc('\\frac{d\\ell}{d\\lambda} = \\frac{10}{\\lambda} - 40 = 0 \\Rightarrow \\hat\\lambda = \\frac{10}{40} = 0{,}25', '\\frac{d^2\\ell}{d\\lambda^2} = -\\frac{10}{\\lambda^2} < 0 \\;(\\text{hámark})')],
   ['d) Bjagi', 2, calc('E[\\hat\\lambda] = E\\left[\\frac{n}{\\sum X_i}\\right] = n \\cdot \\frac{\\lambda}{n - 1} = \\frac{10}{9}\\lambda \\neq \\lambda') + note('Bjaginn λ/(n − 1) hverfur þegar n → ∞.')]]);
NUM('L08-hv-10', L, 3, 'hv', D8 + ', 3c' + NOSOL, 'Laga á y = αx² + βx að punktunum x = −5; −3,8; −2,7; −1,6; −0,55; 0,52; 1,6; 2,7; 3,8; 5 og y = 26,1; 16,87; 14,74; 3,58; 3,81; −1,88; 2,25; 9,8; 21,5; 19 með aðferð minnstu kvaðrata. Hvert er α̂?', 1.0500573, 0.001, '',
  calc('\\frac{\\partial}{\\partial\\alpha}: \\; \\alpha\\sum x_i^4 + \\beta\\sum x_i^3 = \\sum x_i^2 y_i', '\\frac{\\partial}{\\partial\\beta}: \\; \\alpha\\sum x_i^3 + \\beta\\sum x_i^2 = \\sum x_i y_i', '1786{,}587\\,\\alpha - 0{,}0258\\,\\beta = 1876{,}028', '-0{,}0258\\,\\alpha + 99{,}153\\,\\beta = -36{,}445', '\\hat\\alpha = 1{,}0501, \\quad \\hat\\beta = -0{,}3673') + note('R: <code>coef(lm(y ~ 0 + I(x^2) + x))</code>. „0 +" tekur fastaliðinn út, því líkanið hefur engan.'),
  { r: true, rc: 'x <- c(-5,-3.8,-2.7,-1.6,-0.55,0.52,1.6,2.7,3.8,5); y <- c(26.1,16.87,14.74,3.58,3.81,-1.88,2.25,9.8,21.5,19); cat(round(coef(lm(y ~ 0 + I(x^2) + x))[1], 4))', rx: '1.0501' });
NUM('L08-hv-11', L, 3, 'hv', D8 + ', 3c' + NOSOL, 'Sama parabóla y = αx² + βx og sömu 10 punktar (dæmablað 8, dæmi 3). Hvert er β̂?', -0.3672918, 0.001, '',
  calc('\\hat\\beta = \\frac{\\sum x_i y_i - \\hat\\alpha \\sum x_i^3}{\\sum x_i^2} = \\frac{-36{,}445 + 1{,}0501 \\cdot 0{,}0258}{99{,}153} = -0{,}3673') + note('x-gildin eru nánast samhverf um 0, svo Σx³ ≈ 0 og jöfnurnar tvær eru nánast óháðar.'),
  { r: true, rc: 'x <- c(-5,-3.8,-2.7,-1.6,-0.55,0.52,1.6,2.7,3.8,5); y <- c(26.1,16.87,14.74,3.58,3.81,-1.88,2.25,9.8,21.5,19); cat(round(coef(lm(y ~ 0 + I(x^2) + x))[2], 4))', rx: '-0.3673' });
NUM('L08-gl-17', L, 3, 'gl', G + ', gl. 49 og 80–81', 'X ~ Unif(0, 10) og β̂ = max(X<sub>1</sub>, …, X<sub>10</sub>). Hvert er E[β̂]?', 100 / 11, 0.0005, '',
  calc('F_{\\hat\\beta}(x) = \\left(\\frac{x - \\alpha}{\\beta - \\alpha}\\right)^n \\Rightarrow f_{\\hat\\beta}(x) = \\frac{n(x - \\alpha)^{n-1}}{(\\beta - \\alpha)^n}', 'E[\\hat\\beta] = \\frac{n\\beta + \\alpha}{n + 1} = \\frac{10 \\cdot 10 + 0}{11} = 9{,}0909') + note('Bjagi −(β − α)/(n + 1) = −0,909. Óbjagaður metill: (n + 1)/n · max.') + trap('10 væri rétt ef metillinn væri óbjagaður; hámarkið er alltaf undir β.'));
STEP('L08-gl-18', L, 'gl', G + ', gl. 76–79', 'Sýnið að S̃² = (1/n)Σ(X<sub>i</sub> − X̄)² er bjagaður metill fyrir Var[X], en samkvæmur.',
  [['Hjálparjafna', 1, calc('\\sum (X_i - \\bar X)^2 = \\sum (X_i - \\mu)^2 - n(\\bar X - \\mu)^2')],
   ['Væntigildi', 2, calc('E\\left[\\sum (X_i - \\mu)^2\\right] = n\\mathrm{Var}[X], \\quad E[n(\\bar X - \\mu)^2] = n\\mathrm{Var}[\\bar X] = \\mathrm{Var}[X]')],
   ['Niðurstaða', 1, calc('E[\\tilde S^2] = \\frac{n\\mathrm{Var}[X] - \\mathrm{Var}[X]}{n} = \\frac{n - 1}{n}\\mathrm{Var}[X] \\neq \\mathrm{Var}[X]') + note('Þegar n → ∞ fer (n − 1)/n → 1, svo bjaginn hverfur og metillinn er samkvæmur.')]]);
MCQ('L08-ny-2', L, 3, 'ny', 'Ný spurning · gl. 49 og 81 (vægjamat vs sennileikamat)', 'X ~ Unif(0, β) og n = 10. Vægjametillinn 2X̄ er óbjagaður með Var = β²/(3n) = β²/30. Sennileikametillinn max X<sub>i</sub> hefur MSE = 2β²/((n + 1)(n + 2)) = β²/66. Hvor er betri?',
  [['Það fer eftir mælikvarðanum: 2X̄ er óbjagaður, en max X<sub>i</sub> hefur minni MSE'], ['2X̄ er betri í öllu tilliti', 'Óbjagi er kostur, en MSE vægjametilsins (β²/30) er meira en tvöfalt MSE sennileikametilsins (β²/66).'], ['max X<sub>i</sub> er óbjagaður', 'E[max] = nβ/(n + 1) < β.'], ['Þeir eru jafn góðir því báðir eru samkvæmir', 'Báðir eru samkvæmir, en það gerir þá ekki jafna fyrir gefið n.'], ['2X̄ getur aldrei gefið mat sem er minna en stærsta gildið', 'Það getur gerst, t.d. ef flest gildin eru lítil; þá gefur 2X̄ ómögulegt mat.']],
  calc('\\mathrm{MSE}[2\\bar X] = \\frac{\\beta^2}{30} \\approx 0{,}0333\\beta^2', '\\mathrm{MSE}[\\max X_i] = \\frac{2\\beta^2}{11 \\cdot 12} \\approx 0{,}0152\\beta^2') + note('Glæra 49 segir að vægjaaðferðin sé betri hér; það á við um bjaga. Miðað við MSE er sennileikametillinn betri. Í gögnunum á glæru 45 gefur 2x̄ = 13,62 en max = 9,22.'));
STEP('L08-ny-3', L, 'ny', 'Ný spurning · sennileikamat (gl. 41–44)', 'X<sub>1</sub>, …, X<sub>n</sub> eru óháðar og Poisson(λ). Leiðið út sennileikamatið á λ.',
  [['Sennileiki', 1, calc('L(\\lambda) = \\prod_{i=1}^n \\frac{e^{-\\lambda}\\lambda^{x_i}}{x_i!}')],
   ['Logri', 1, calc('\\ell(\\lambda) = -n\\lambda + \\log\\lambda \\sum x_i - \\sum \\log(x_i!)')],
   ['Fyrsta stigs skilyrði', 1, calc('\\frac{d\\ell}{d\\lambda} = -n + \\frac{\\sum x_i}{\\lambda} = 0 \\Rightarrow \\hat\\lambda = \\bar{x}') + note('Síðasti liðurinn inniheldur ekki λ. Hér er sennileikametillinn óbjagaður, því E[X̄] = λ.')]]);
MCQ('L08-gl-19', L, 3, 'gl', G + ', gl. 73', 'Hagfræðingur metur eftirspurnarfall Q = α + βP með aðferð minnstu kvaðrata úr gögnum um verð og sölumagn á markaði. Hvers vegna er matið líklega bjagað?',
  [['Hver athugun er jafnvægi framboðs og eftirspurnar, svo gögnin rekja ekki eftirspurnarferilinn einan'], ['Af því að aðferð minnstu kvaðrata er alltaf bjöguð', 'Hún er óbjöguð þegar forsendurnar halda, t.d. E[ε | P] = 0.'], ['Af því að líkanið er línulegt', 'Línuleiki í stikum er kostur, ekki ástæða bjaga.'], ['Af því að úrtakið er of lítið', 'Bjaginn hverfur ekki með stærra úrtaki; vandinn er í gögnunum sjálfum.'], ['Af því að skekkjan ε er normaldreifð', 'Normaldreifing skekkju veldur ekki bjaga.']],
  note('Verð og magn ákvarðast saman (samtímajöfnur, e. simultaneous equations). Til að meta eftirspurn rétt þarf að meta framboðið samtímis eða einangra áhrifin á annan hátt.'));
// ---------- spjöld ----------
CARD('L08-c1', L, 'Spjald · glæra 6–18', 'Hverjir eru þrír eftirsóknarverðir eiginleikar metla og hvernig eru þeir skilgreindir?',
  'Óbjagaður: E[θ̂] = θ, metillinn hittir að jafnaði á rétt gildi. Skilvirkur: af tveimur óbjöguðum metlum er sá skilvirkari sem hefur minni dreifni, og nýtir þá upplýsingarnar betur (X̄ er skilvirkari en X<sub>1</sub>). Samkvæmur: matið nálgast rétt gildi þegar n vex, lim Var[θ̂] = 0. Eiginleikarnir eru óháðir: X<sub>1</sub> er óbjagaður en ekki samkvæmur, og S̃² er bjagaður en samkvæmur.',
  ['E[θ̂] = θ', 'Minni dreifni = skilvirkari', 'Var → 0 þegar n → ∞', 'X₁ og S̃² sem gagndæmi']);
CARD('L08-c2', L, 'Spjald · glæra 19 og 27–74', 'Berðu saman vægjaaðferð, sennileikamat og aðferð minnstu kvaðrata.',
  'Vægjaaðferðin setur úrtaksvægi (x̄, s²) jöfn vægjum þýðisins og leysir fyrir stikana; eitt vægi þarf fyrir hvern stika. Hún er einföld og oft notuð í flóknum hagfræðilíkönum. Sennileikamat velur stikana sem gera úrtakið sem líklegast; það er mjög almennt en getur verið bjagað (t.d. max fyrir jafndreifingu, σ̂² sem deilir með n). Aðferð minnstu kvaðrata lágmarkar Σ(y − g(x, θ))² og hentar best fyrir líkön sem eru línuleg í stikunum. Þumalputtareglan: veldu skilvirkasta óbjagaða metilinn, annars samkvæman, og byrjaðu á einföldustu aðferðinni.',
  ['Vægi úrtaks = vægi þýðis', 'arg max sennileikans', 'arg min Σ frávika²', 'Einn stiki = eitt vægi']);
CARD('L08-c3', L, 'Spjald · glæra 20–26', 'Hver er munurinn á stikabundnum og stikalausum metlum, og hvert er „trade-off"-ið?',
  'Stikabundnir metlar gefa sér að þýðið fylgi tiltekinni dreifingu (t.d. normaldreifingu) og meta stika hennar. Þá má álykta mikið, t.d. reikna líkur, en matið getur orðið rangt ef forsendan bregst. Stikalausir metlar (X̄, K-næsti nágranni) þurfa færri forsendur og eru því sterkari gagnvart forsendubresti, en svara ekki öllum spurningum og krefjast oft meiri reikninga.',
  ['Forsenda um dreifingu', 'Meiri ályktanir en viðkvæmari', 'Færri forsendur, minna svarað', 'X̄ og KNN sem stikalaus dæmi']);
CARD('L08-c4', L, 'Spjald · glæra 41–44', 'Hvers vegna er unnið með logra sennileikans í stað sennileikans sjálfs?',
  'Fyrir slembiúrtak er sennileikinn margfeldi n líkinda, sem verður fljótt örsmá tala og er erfitt að diffra. Logrinn breytir margfeldinu í summu, sem er auðveldara að diffra og reikna í tölvu. Af því að log er stranglega vaxandi fall er hámarkið á sama stað: arg max L(θ) = arg max ℓ(θ). Síðan er ℓ diffrað, sett jafnt 0 og leyst fyrir θ.',
  ['Margfeldi verður summa', 'log er vaxandi: sama hámark', 'Tölulegur stöðugleiki', 'dℓ/dθ = 0']);
}


// ================= L09 · Tilgátupróf og öryggisbil =================
{ const L = 'L09', G = 'Glærur 09 Tilgátupróf og öryggisbil', D9 = 'Dæmablað 9';
const NOSOL = ' · engin opinber lausn';
const gl = '670, 636, 695, 743, 716, 699, 636, 686, 683, 700, 642, 601, 662, 610, 636, 585, 690, 534, 614, 591';
const glR = 'g <- c(670,636,695,743,716,699,636,686,683,700,642,601,662,610,636,585,690,534,614,591)';
const gu = '662, 610, 575, 587, 585, 692, 577, 646, 553, 601, 667, 630';
const guR = 'G <- c(662,610,575,587,585,692,577,646,553,601,667,630)';
const se9 = 52.07735 / Math.sqrt(20);   // s/√n fyrir launagögnin
// ---------- stig 1 ----------
MCQ('L09-gl-1', L, 1, 'gl', G + ', gl. 13 og 17', 'Hvaða z-gildi er notað í 95% tvíhliða öryggisbili þegar σ er þekkt?',
  [['1,96'], ['1,645', 'z<sub>0,05</sub> = 1,645 á við 90% tvíhliða bil eða 95% einhliða bil.'], ['2,58', 'z<sub>0,005</sub> = 2,58 á við 99% tvíhliða bil.'], ['2,33', 'z<sub>0,01</sub> = 2,33 á við 99% einhliða bil.'], ['0,975', 'Það eru líkurnar Pr(Z < z), ekki z-gildið sjálft.']],
  calc('\\alpha = 0{,}05 \\Rightarrow \\Pr(Z < z_{\\alpha/2}) = 1 - 0{,}025 = 0{,}975 \\Rightarrow z_{0{,}025} = 1{,}96'));
NUM('L09-gl-2', L, 1, 'gl', G + ', gl. 14', 'Y ~ N(10, 4) og n = 10. Hver eru neðri mörk 95% öryggisbilsins fyrir E[Ȳ]?', 10 - 1.96 * 2 / Math.sqrt(10), 0.005, '',
  calc('\\hat\\theta_L = 10 - z_{0{,}025}\\frac{\\sigma}{\\sqrt{n}} = 10 - 1{,}96 \\cdot \\frac{2}{\\sqrt{10}} = 10 - 1{,}240 = 8{,}76') + note('Efri mörkin eru 11,24. σ = √4 = 2.') + trap('Að nota σ² = 4 í stað σ = 2 gefur 7,52.'));
MCQ('L09-gl-3', L, 1, 'gl', G + ', gl. 37 og 43', 'Hvað er villa af gerð 1?',
  [['Að hafna H₀ þótt hún sé sönn'], ['Að hafna ekki H₀ þótt hún sé ósönn', 'Það er villa af gerð 2 (líkur β).'], ['Að hafna H₀ þegar hún er ósönn', 'Það er rétt niðurstaða (styrkur, 1 − β).'], ['Að reikna prófstærðina rangt', 'Villurnar eru tölfræðilegar, ekki reikningsvillur.'], ['Að velja einhliða próf í stað tvíhliða', 'Það er val á tilgátu, ekki villa af gerð 1.']],
  note('Líkurnar á villu af gerð 1 eru α, marktæknikrafan. Stundum kölluð fölsk jákvæð niðurstaða.'));
MCQ('L09-gl-4', L, 1, 'gl', G + ', gl. 39–40', 'Hvað er p-gildi?',
  [['Lægsta α sem leiðir til höfnunar H₀ með þessum gögnum'], ['Líkurnar á að H₀ sé sönn', 'p-gildið er reiknað miðað við að H₀ sé sönn; það eru ekki líkur á H₀.'], ['Líkurnar á villu af gerð 2', 'Það er β.'], ['Marktæknikrafan sem valin er fyrir prófið', 'α er valið fyrir fram; p-gildið kemur úr gögnunum.'], ['Styrkur prófsins', 'Styrkur er 1 − β.']],
  calc('§Hægri hali: p = Pr(T ≥ t | H₀) · vinstri: Pr(T ≤ t | H₀) · tvíhliða: 2·min{…}') + note('Hafna H₀ ef p < α. Lægra p-gildi þýðir sterkari vísbendingu gegn H₀.'));
MCQ('L09-gl-5', L, 1, 'gl', G + ', gl. 41–42', 'Hvað er styrkur (power) tilgátuprófs?',
  [['Líkurnar á að hafna H₀ þegar hún er ósönn, 1 − β'], ['Líkurnar á að hafna H₀ þegar hún er sönn', 'Það er α.'], ['1 − α', 'Það eru líkurnar á að hafna ekki sannri H₀.'], ['p-gildið', 'p-gildið kemur úr gögnum; styrkur er eiginleiki prófsins.'], ['Prófstærðin T', 'T er reiknað gildi, ekki líkur.']],
  note('Styrkur vex með úrtaksstærð og stærð áhrifanna. Einhliða próf hafa meiri styrk en tvíhliða, ef stefnan er rétt.'));
NUM('L09-gl-6', L, 1, 'gl', G + ', gl. 54–55', 'Úrtak 25 hagfræðinema hefur meðaleinkunn 6,8 og staðalfrávik 1,2. Reiknið t-prófstærðina fyrir H₀: μ ≤ 6,5.', 1.25, 0.001, '',
  calc('t = \\frac{6{,}8 - 6{,}5}{1{,}2/\\sqrt{25}} = \\frac{0{,}3}{0{,}24} = 1{,}25') + note('Efra einhliða próf: t<sub>24; 0,05</sub> = 1,711. Þar sem 1,25 < 1,711 er H₀ ekki hafnað (p = 0,112).') + slideErr('Á glæru 55 stendur „tilgátu um að μ sé minna en μ₀"; gagntilgátan er μ > 6,5, svo átt er við „stærra".') + trap('Að deila með 1,2 (ekki 1,2/√25) gefur 0,25.'));
NUM('L09-gl-7', L, 1, 'gl', G + ', gl. 87–88', 'Úrtak 10 ára af hagvexti hefur dreifni s² = 3,19. Reiknið χ²-prófstærðina fyrir H₀: σ² ≤ 3.', 9.57, 0.001, '',
  calc('\\chi^2 = \\frac{(n - 1)s^2}{\\sigma_0^2} = \\frac{9 \\cdot 3{,}19}{3} = 9{,}57') + note('Viðmiðsgildi χ²<sub>9</sub> fyrir efri hala 5% er 16,919. H₀ er ekki hafnað.') + trap('10 · 3,19/3 = 10,63 notar n í stað n − 1.'));
MCQ('L09-gl-8', L, 1, 'gl', G + ', gl. 99–101', 'Hver er núlltilgáta Jarque–Bera prófsins?',
  [['Gögnin fylgja normaldreifingu'], ['Gögnin fylgja ekki normaldreifingu', 'Það er gagntilgátan.'], ['Meðaltalið er 0', 'JB prófar skeifni og ferilris, ekki meðaltal.'], ['Dreifnin er 1', 'JB prófar lögun dreifingarinnar.'], ['Gögnin eru veldisdreifð', 'Prófið ber aðeins saman við normaldreifingu.']],
  note('Normaldreifing hefur skeifni 0 og ferilris 3. JB getur hafnað normaldreifingu en ekki sannað hana.'));
MCQ('L09-gl-9', L, 1, 'gl', G + ', gl. 57–58', 'Vektorinn x geymir einkunnir. Hvaða R-skipun prófar H₀: μ ≤ 6,5 gegn H₁: μ > 6,5?',
  [['<code>t.test(x, mu = 6.5, alternative = "greater")</code>'], ['<code>t.test(x, mu = 6.5)</code>', 'Sjálfgefið er tvíhliða próf (alternative = "two.sided").'], ['<code>t.test(x, mu = 6.5, alternative = "less")</code>', '"less" prófar H₁: μ < 6,5.'], ['<code>t.test(x > 6.5)</code>', 'Það prófar hlutfall rökgilda, ekki meðaltalið á móti 6,5.'], ['<code>var.test(x, mu = 6.5)</code>', 'var.test ber saman dreifni tveggja úrtaka.']],
  note('alternative lýsir gagntilgátunni H₁.'), { r: true });
NUM('L09-gl-10', L, 1, 'gl', G + ', gl. 19', 'Y er normaldreift með þekkt σ² = 4. Úrtak af stærð 10 gefur ȳ = 9,5. Hver eru efri mörk 95% öryggisbils fyrir μ?', 9.5 + 1.96 * 2 / Math.sqrt(10), 0.005, '',
  calc('9{,}5 + 1{,}96 \\cdot \\frac{2}{\\sqrt{10}} = 9{,}5 + 1{,}240 = 10{,}74') + note('Bilið [8,26; 10,74] er mat: í 95% endurtekinna úrtaka lendir μ innan bilsins sem reiknað er.'));
// ---------- stig 2 ----------
NUM('L09-gl-11', L, 2, 'gl', G + ', gl. 24', 'Y er normaldreift með óþekkt μ og σ². Úrtak af stærð 10 gefur ȳ = 9,5 og s² = 4. Hver eru efri mörk 95% öryggisbils fyrir μ? (t<sub>9; 0,025</sub> = 2,262)', 9.5 + 2.262 * 2 / Math.sqrt(10), 0.005, '',
  calc('9{,}5 + t_{9;\\,0{,}025}\\frac{s}{\\sqrt{n}} = 9{,}5 + 2{,}262 \\cdot \\frac{2}{\\sqrt{10}} = 9{,}5 + 1{,}431 = 10{,}93') + note('Bilið [8,07; 10,93] er breiðara en z-bilið [8,26; 10,74], því óvissa er um σ.') + trap('z = 1,96 í stað t gefur 10,74.'));
NUM('L09-gl-12', L, 2, 'gl', G + ', gl. 72–73', 'Hagfræðinemar (n = 25): meðaltal 6,8, staðalfrávik 1,2. Viðskiptafræðinemar (n = 25): 7 og 1,4. Reiknið Welch t-prófstærðina fyrir H₀: μ₁ = μ₂.', -0.2 / Math.sqrt(0.136), 0.002, '',
  calc('T = \\frac{6{,}8 - 7}{\\sqrt{\\frac{1{,}2^2}{25} + \\frac{1{,}4^2}{25}}} = \\frac{-0{,}2}{\\sqrt{0{,}0576 + 0{,}0784}} = \\frac{-0{,}2}{0{,}3688} = -0{,}542') + note('|−0,54| < t<sub>47; 0,025</sub> ≈ 2,01, svo H₀ er ekki hafnað (p = 0,59).') + trap('Að deila staðalfrávikunum með n (ekki dreifnunum) gefur rangt SE.'));
MCQ('L09-gl-14', L, 2, 'gl', G + ', gl. 56 og 61', 'Með 100 hagfræðinemum (meðaltal 6,8, staðalfrávik 1,2) er t = 2,5 fyrir H₀: μ ≤ 6,5. Viðmiðsgildið er t<sub>99; 0,05</sub> = 1,660. Hver er niðurstaðan við α = 0,05?',
  [['Hafna H₀: meðaleinkunnin er marktækt hærri en 6,5 (p ≈ 0,007)'], ['Ekki hafna H₀, því 2,5 < 2,58', '2,58 er z<sub>0,005</sub> (tvíhliða 1%); einhliða 5% gildið er 1,660.'], ['Hafna H₀ og sanna að μ = 6,8', 'Tilgátupróf sannar ekki gildi μ; 6,8 er punktamat.'], ['Ekki hafna H₀, því sama meðaltal gaf ekki höfnun með n = 25', 'Stærra úrtak minnkar s/√n og gefur hærra t.'], ['Hafna H₀ af því að 6,8 > 6,5', 'Munurinn verður að vera marktækur miðað við óvissuna, ekki aðeins jákvæður.']],
  calc('t = \\frac{0{,}3}{1{,}2/\\sqrt{100}} = \\frac{0{,}3}{0{,}12} = 2{,}5 > 1{,}660'));
NUM('L09-gl-15', L, 2, 'gl', G + ', gl. 95–98', 'F-próf fyrir dreifni hagvaxtar á Íslandi (s² = 3,19, n = 10) og í Danmörku (s² = 0,942, n = 10), tvíhliða með α = 0,05. Hvert er efra viðmiðsgildið, Pr(F<sub>9,9</sub> < c) = 0,975?', 4.025994, 0.01, '',
  calc('F = \\frac{3{,}19}{0{,}942} = 3{,}39', 'c_{0{,}025} = 0{,}248, \\quad c_{0{,}975} = 4{,}026') + note('0,248 < 3,39 < 4,03, svo H₀ er ekki hafnað (p = 0,083). R: <code>qf(0.975, 9, 9)</code>.') +
  slideErr('Á glæru 96 stendur að efra viðmiðsgildið sé 4,96; rétt er 4,03. Það sést líka á öryggisbilinu í R-úttakinu á glæru 98 (3,39/4,026 = 0,842). Niðurstaðan breytist ekki.') + trap('1/0,248 = 4,03; neðra og efra gildið eru umhverf þegar frígráðurnar eru jafnar.'), { r: true, rc: 'cat(round(qf(0.975, 9, 9), 6))', rx: '4.025994' });
NUM('L09-hv-1', L, 2, 'hv', D9 + ', 1a' + NOSOL, `Laun sumarstarfsmanna Gleðibankans (þús. kr.), normaldreifð: ${gl}. Hver eru neðri mörk 95% tvíhliða öryggisbils fyrir meðallaun? (t<sub>19; 0,025</sub> = 2,093)`, 651.45 - PROB.qt(0.975, 19) * se9, 0.01, 'þús. kr.',
  calc('\\bar{x} = 651{,}45, \\quad s = 52{,}077, \\quad \\frac{s}{\\sqrt{20}} = 11{,}645', '651{,}45 - 2{,}093 \\cdot 11{,}645 = 627{,}08') + note('Bilið er [627,08; 675,82]. R: <code>t.test(g)$conf.int</code>.') + trap('z = 1,96 í stað t gefur 628,63.'),
  { r: true, rc: glR + '; cat(round(t.test(g)$conf.int[1], 4))', rx: '627.0771' });
NUM('L09-hv-2', L, 2, 'hv', D9 + ', 1a' + NOSOL, `Sömu launagögn (n = 20, x̄ = 651,45, s = 52,077). Hver eru efri mörk 95% tvíhliða öryggisbilsins?`, 651.45 + PROB.qt(0.975, 19) * se9, 0.01, 'þús. kr.',
  calc('651{,}45 + 2{,}093 \\cdot 11{,}645 = 675{,}82'), { r: true, rc: glR + '; cat(round(t.test(g)$conf.int[2], 4))', rx: '675.8229' });
NUM('L09-hv-3', L, 2, 'hv', D9 + ', 1b' + NOSOL, 'Launagögnin (n = 20, x̄ = 651,45, s = 52,077). Hver eru mörk 99% neðra (einhliða) öryggisbils fyrir meðallaun? (t<sub>19; 0,01</sub> = 2,539)', 651.45 - PROB.qt(0.99, 19) * se9, 0.01, 'þús. kr.',
  calc('651{,}45 - 2{,}539 \\cdot 11{,}645 = 621{,}88') + note('Bilið er [621,88; ∞). Einhliða: allt α = 0,01 í öðrum halanum, svo t<sub>α</sub>, ekki t<sub>α/2</sub>.') + trap('t<sub>19; 0,005</sub> = 2,861 (tvíhliða 99%) gefur 618,13.'),
  { r: true, rc: glR + '; cat(round(t.test(g, conf.level = 0.99, alternative = "greater")$conf.int[1], 4))', rx: '621.8781' });
NUM('L09-hv-4', L, 2, 'hv', D9 + ', 1c' + NOSOL, 'Launagögnin (n = 20, x̄ = 651,45, s = 52,077). Hver eru mörk 90% efra (einhliða) öryggisbils? (t<sub>19; 0,10</sub> = 1,328)', 651.45 + PROB.qt(0.90, 19) * se9, 0.01, 'þús. kr.',
  calc('651{,}45 + 1{,}328 \\cdot 11{,}645 = 666{,}91') + note('Bilið er (−∞; 666,91].'),
  { r: true, rc: glR + '; cat(round(t.test(g, conf.level = 0.90, alternative = "less")$conf.int[2], 4))', rx: '666.9112' });
NUM('L09-hv-5', L, 2, 'hv', D9 + ', 2a' + NOSOL, 'Vinur segir sumarstarfsmenn fá yfir 800 þúsund. Prófið H₀: μ ≤ 800 gegn H₁: μ > 800 með launagögnunum (n = 20, x̄ = 651,45, s = 52,077). Hver er t-prófstærðin?', (651.45 - 800) / se9, 0.005, '',
  calc('t = \\frac{651{,}45 - 800}{52{,}077/\\sqrt{20}} = \\frac{-148{,}55}{11{,}645} = -12{,}76') + note('Efri einhliða próf: hafna ef t > 1,729. Hér er t langt neðan við, svo H₀ er ekki hafnað (p ≈ 1). Gögnin styðja alls ekki fullyrðingu vinarins.') + trap('Að fá stórt |t| þýðir ekki höfnun: í einhliða prófi skiptir stefnan máli.'),
  { r: true, rc: glR + '; cat(round(t.test(g, mu = 800, alternative = "greater")$statistic, 4))', rx: '-12.7567' });
MCQ('L09-hv-6', L, 2, 'hv', D9 + ', 2b' + NOSOL, 'Vinkona segir meðallaunin nær 670. Prófið H₀: μ = 670 gegn H₁: μ ≠ 670 (n = 20, x̄ = 651,45, s = 52,077, α = 0,05). Hver er niðurstaðan?',
  [['t = −1,59; |t| < 2,093, svo H₀ er ekki hafnað (p = 0,13)'], ['t = −1,59; hafna H₀ því t < 0', 'Formerkið eitt ræður ekki; bera þarf |t| saman við t<sub>α/2</sub>.'], ['t = −1,59; |t| < 1,729, svo H₀ er ekki hafnað', 'Niðurstaðan er sú sama, en 1,729 er einhliða gildið; tvíhliða próf notar 2,093.'], ['t = −0,36; H₀ er ekki hafnað', 'Það deilir með s (52,077) í stað s/√n.'], ['H₀ er samþykkt: meðallaunin eru 670', 'Að hafna ekki H₀ sannar hana ekki; 670 er aðeins samrýmanlegt gögnunum.']],
  calc('t = \\frac{651{,}45 - 670}{11{,}645} = -1{,}593, \\quad t_{19;\\,0{,}025} = 2{,}093') + note('670 er innan 95% öryggisbilsins [627,08; 675,82], sem gefur sömu niðurstöðu.'));
NUM('L09-hv-7', L, 2, 'hv', D9 + ', 3a' + NOSOL, 'Sérfræðistörf: n = 50, staðalfrávik launa 98 þús. Prófið H₀: σ ≤ 110 gegn H₁: σ > 110. Hver er χ²-prófstærðin?', 49 * 98 * 98 / (110 * 110), 0.005, '',
  calc('\\chi^2 = \\frac{(n - 1)s^2}{\\sigma_0^2} = \\frac{49 \\cdot 98^2}{110^2} = \\frac{470\\,596}{12\\,100} = 38{,}89') + note('Efri hali: χ²<sub>49; 0,05</sub> = 66,34. 38,89 < 66,34, svo H₀ er ekki hafnað (p = 0,85).') + trap('Tilgátan um σ = 110 verður σ² = 12.100; 49 · 98/110 = 43,65 notar staðalfrávik.'));
MCQ('L09-hv-8', L, 2, 'hv', D9 + ', 3b' + NOSOL, 'Leikskólakennsla: n = 34, staðalfrávik 106 þús. Prófið H₀: σ ≥ 130 gegn H₁: σ < 130 með α = 0,05. Pr(χ²<sub>33</sub> < 20,867) = 0,05. Hver er niðurstaðan?',
  [['χ² = 21,94 > 20,867, svo H₀ er ekki hafnað (p = 0,071)'], ['χ² = 21,94 < 47,40, svo H₀ er hafnað', '47,40 er efri 5% gildið; H₁: σ < 130 hefur höfnunarsvæðið í vinstri halanum.'], ['χ² = 26,91 > 20,867, svo H₀ er ekki hafnað', '33 · 106/130 = 26,91 notar staðalfrávik í stað dreifni.'], ['χ² = 21,94; hafna H₀ því s = 106 < 130', 'Mismunurinn verður að vera marktækur, ekki aðeins í rétta átt.'], ['χ² = 22,61 > 20,867, svo H₀ er ekki hafnað', '34 · 106²/130² = 22,61 notar n í stað n − 1.']],
  calc('\\chi^2 = \\frac{33 \\cdot 106^2}{130^2} = 21{,}94') + note('Nálægt mörkunum en ekki marktækt við 5%; við α = 0,10 yrði H₀ hafnað.'));
MCQ('L09-gl-16', L, 2, 'gl', G + ', gl. 58–59', 'R skilar eftirfarandi úttaki. Hvað má álykta við α = 0,05?' + out('One Sample t-test\ndata:  x\nt = 1.25, df = 24, p-value = 0.1117\nalternative hypothesis: true mean is greater than 6.5\n95 percent confidence interval:\n 6.389388      Inf\nsample estimates:\nmean of x \n      6.8'),
  [['Ekki er hægt að hafna því að μ ≤ 6,5, því p = 0,11 > 0,05'], ['Meðaltalið er marktækt hærra en 6,5, því 6,8 > 6,5', 'Punktamatið eitt nægir ekki; p-gildið er yfir α.'], ['H₀ er sönn: μ = 6,5', 'Að hafna ekki sannar ekki H₀.'], ['Hafna H₀ því 6,5 er innan öryggisbilsins', 'Öfugt: 6,5 innan [6,389; ∞) samrýmist H₀, svo henni er ekki hafnað.'], ['Hafna H₀ því t > 0', 'Bera þarf t saman við t<sub>24; 0,05</sub> = 1,711.']],
  note('Einhliða öryggisbilið [6,389; ∞) inniheldur 6,5, sem jafngildir því að hafna ekki H₀.'), { r: true });
PNUM('L09-gl-17', L, 2, 'gl', G + ', gl. 89–91', 'Í dreifniprófinu á glæru 89 er p-gildi efra einhliða prófs reiknað sem <code>1 - pchisq(test_stat, df = n - 1)</code>. Hvað skilar <code>1 - pchisq(9.57, 9)</code>?', 1 - PROB.pchisq(9.57, 9), 0.001,
  calc('p = \\Pr(\\chi^2_9 \\ge 9{,}57) = 1 - F_{\\chi^2_9}(9{,}57) = 0{,}386') + note('Glæran fær 0,3856 með óstýfðri prófstærð 9,579.') + trap('<code>pchisq(9.57, 9)</code> = 0,614 gefur vinstri halann.'), { r: true, rc: 'cat(round(1 - pchisq(9.57, 9), 6))', rx: String(+(1 - PROB.pchisq(9.57, 9)).toFixed(6)) });
MCQ('L09-gl-18', L, 2, 'gl', G + ', gl. 64–67', 'Aðhvarfsgreining lokaeinkunnar (0–10) á mætingu í % gefur stikann atndrte = 0,013341 (staðalskekkja 0,003623, t = 3,683, p = 0,000249). Hvað segir þetta?',
  [['Mæting hefur marktæk áhrif: 100% mæting tengist að jafnaði um 1,33 hærri einkunn en engin mæting'], ['Áhrifin eru ekki marktæk því stikinn er nálægt 0', 'Stærð stikans segir ekki til um marktækni; t = 3,68 gerir það.'], ['Hvert prósentustig í mætingu hækkar einkunn um 1,33', 'Það er áhrif 100 prósentustiga; hvert stig gefur 0,0133.'], ['p-gildið segir að líkurnar á að stikinn sé 0 séu 0,025%', 'p-gildið eru líkurnar á svona öfgafullu t ef stikinn væri 0.'], ['t-gildið er 0,013341/3,683', 't = stiki/staðalskekkja = 0,013341/0,003623.']],
  calc('t = \\frac{0{,}013341}{0{,}003623} = 3{,}683', '0{,}013341 \\cdot 100 = 1{,}334') + note('H₀: β = 0 er hafnað. Glæra 67 segir „um 1,35"; nákvæmara er 1,33.'));
MCQ('L09-ny-1', L, 2, 'ny', 'Ný spurning · öryggisbil og tilgátupróf (gl. 30)', '95% tvíhliða öryggisbil fyrir μ er [12,4; 15,1]. Hvað má segja um tvíhliða próf á H₀: μ = 16 við α = 0,05?',
  [['H₀ er hafnað, því 16 er utan bilsins'], ['H₀ er ekki hafnað, því bilið er breitt', 'Breidd skiptir ekki máli; spurningin er hvort μ₀ sé innan bilsins.'], ['Ekki hægt að segja án prófstærðarinnar', 'Tvíhliða próf við α og 1 − α tvíhliða bil gefa alltaf sömu niðurstöðu.'], ['H₀ er hafnað við α = 0,01 líka', 'Ekki víst: 99% bilið er breiðara og gæti innihaldið 16.'], ['H₀ er ekki hafnað, því 16 > 15,1', 'Utan bilsins þýðir höfnun.']],
  note('Höfnunarsvæði prófs með marktækni α er það sem fellur utan 1 − α öryggisbils.'));
MCQ('L09-gl-19', L, 2, 'gl', G + ', gl. 45–46', 'Hvað gerist, að öðru óbreyttu, ef α er lækkað úr 0,05 í 0,01?',
  [['Minni líkur á villu af gerð 1, en meiri líkur á villu af gerð 2'], ['Minni líkur á báðum villum', 'α og β hreyfast í gagnstæða átt fyrir fasta úrtaksstærð.'], ['Meiri styrkur', 'Höfnunarsvæðið minnkar, svo styrkurinn 1 − β minnkar.'], ['Öryggisbilið þrengist', 'Það breikkar: 99% bil er breiðara en 95% bil.'], ['p-gildið lækkar', 'p-gildið ræðst af gögnunum, ekki af α.']],
  note('Eina leiðin til að minnka báðar villur í einu er stærra úrtak (eða sterkari áhrif).'));
// ---------- stig 3 ----------
NUM('L09-gl-13', L, 3, 'gl', G + ', gl. 73', 'Hagfræðinemar n₁ = 25, s₁ = 1,2; viðskiptafræðinemar n₂ = 25, s₂ = 1,4. Hve margar frígráður ν hefur Welch t-prófið?', 0.136 ** 2 / ((0.0576 ** 2 + 0.0784 ** 2) / 24), 0.05, '',
  calc('\\nu = \\frac{(0{,}0576 + 0{,}0784)^2}{\\frac{0{,}0576^2}{24} + \\frac{0{,}0784^2}{24}} = \\frac{0{,}018496}{0{,}00039435} = 46{,}90') + note('R gefur df = 46.903 (glæra 75). Í töflu er yfirleitt námundað niður.') + trap('n₁ + n₂ − 2 = 48 á við sameinaða t-prófið með jafnri dreifni.'));
NUM('L09-hv-9', L, 3, 'hv', D9 + ', 2c' + NOSOL, `Laun hjá Gleðibankanum (n = 20): ${gl}. Hjá Radíobúð Gumma (n = 12): ${gu}. Prófið H₀: μ<sub>G</sub> ≤ μ<sub>R</sub> gegn H₁: μ<sub>G</sub> > μ<sub>R</sub> með Welch t-prófi. Hver er prófstærðin?`, 2.103936, 0.002, '',
  calc('\\bar{x}_G = 651{,}45, \\; s_G = 52{,}077; \\quad \\bar{x}_R = 615{,}42, \\; s_R = 43{,}504', 'SE = \\sqrt{\\frac{52{,}077^2}{20} + \\frac{43{,}504^2}{12}} = \\sqrt{135{,}60 + 157{,}72} = 17{,}127', 'T = \\frac{651{,}45 - 615{,}42}{17{,}127} = 2{,}104, \\quad \\nu = 26{,}6') +
  note('t<sub>26; 0,05</sub> = 1,706 < 2,104, svo H₀ er hafnað (p = 0,022): Gleðibankinn borgar marktækt betur.') +
  unconf('Dæmablaðið leyfir að gera ráð fyrir sömu dreifni (sameinað t-próf: t = 2,009, 30 frígráður, p = 0,027), en glærurnar kenna aðeins Welch-prófið. Báðar leiðir gefa höfnun við 5%.'),
  { r: true, rc: glR + '; ' + guR + '; cat(round(t.test(g, G, alternative = "greater")$statistic, 6))', rx: '2.103936' });
STEP('L09-hv-10', L, 'hv', D9 + ', dæmi 2 (heilt)' + NOSOL, 'Á að taka tilboði Gleðibankans? a) Er líklegt að meðallaunin séu yfir 800? b) Gætu þau verið 670? c) Borgar Gleðibankinn betur en Radíobúð Gumma?',
  [['a) H₀: μ ≤ 800, H₁: μ > 800', 1, calc('t = \\frac{651{,}45 - 800}{11{,}645} = -12{,}76 < 1{,}729') + note('H₀ er ekki hafnað; gögnin benda þvert á móti til að launin séu langt undir 800.')],
   ['b) H₀: μ = 670, H₁: μ ≠ 670', 1, calc('t = -1{,}593, \\quad |t| < t_{19;\\,0{,}025} = 2{,}093') + note('H₀ er ekki hafnað; 670 er innan 95% bilsins [627,08; 675,82].')],
   ['c) H₀: μ_G ≤ μ_R, H₁: μ_G > μ_R', 2, calc('T = 2{,}104, \\; \\nu = 26{,}6, \\quad t_{26;\\,0{,}05} = 1{,}706') + note('H₀ er hafnað (p = 0,022). Ef aðeins launin skipta máli á að taka tilboði Gleðibankans.')]]);
NUM('L09-hv-11', L, 3, 'hv', D9 + ', 3c' + NOSOL, 'Sérfræðistörf: s = 98, n = 50. Leikskólakennsla: s = 106, n = 34. Reiknið F = s²<sub>leiksk.</sub>/s²<sub>sérfr.</sub> fyrir tvíhliða F-próf á jafnri dreifni.', 106 * 106 / (98 * 98), 0.002, '',
  calc('F = \\frac{106^2}{98^2} = \\frac{11\\,236}{9\\,604} = 1{,}170', '§Frígráður (33, 49); viðmiðsgildi 0,520 og 1,847') + note('0,520 < 1,170 < 1,847, svo H₀ er ekki hafnað (p = 0,61). Enginn marktækur munur er á dreifni launa milli greinanna.') + trap('106/98 = 1,082 er hlutfall staðalfrávika.'));
STEP('L09-hv-12', L, 'hv', D9 + ', dæmi 3c–d' + NOSOL, 'Er marktækur munur á dreifni launa í sérfræðistörfum (s = 98, n = 50, meðallaun 928) og leikskólakennslu (s = 106, n = 34, meðallaun 688)? Hvað segir það um ójöfnuð?',
  [['Tilgátur', 1, calc('H_0: \\sigma_1^2 = \\sigma_2^2, \\quad H_1: \\sigma_1^2 \\neq \\sigma_2^2')],
   ['Prófstærð og ákvörðun', 2, calc('F = \\frac{106^2}{98^2} = 1{,}170, \\quad F_{33,49}: [0{,}520;\\; 1{,}847]') + note('F er innan bilsins, svo H₀ er ekki hafnað.')],
   ['d) Túlkun', 2, 'Dreifni launa, mæld í þúsundum króna, er svipuð í báðum greinum. En meðallaunin eru mjög ólík (928 og 688), svo sama staðalfrávik er hlutfallslega meiri dreifing í leikskólakennslu (breytistuðull 106/688 = 15% á móti 98/928 = 11%). Hvort ójöfnuður er „meiri" fer eftir því hvort hann er mældur í krónum eða hlutfallslega.']]);
NUM('L09-gl-20', L, 3, 'gl', G + ', gl. 81–82 og 87', 'Hagvöxtur á Íslandi: n = 10, s² = 3,19. Finnið neðri mörk 95% öryggisbils fyrir σ². (Pr(χ²<sub>9</sub> < 2,700) = 0,025 og Pr(χ²<sub>9</sub> < 19,023) = 0,975)', 9 * 3.19 / PROB.qchisq(0.975, 9), 0.005, '',
  calc('\\hat\\sigma^2_L = \\frac{(n - 1)s^2}{\\chi^2_{0{,}975}} = \\frac{9 \\cdot 3{,}19}{19{,}023} = \\frac{28{,}71}{19{,}023} = 1{,}509', '\\hat\\sigma^2_U = \\frac{28{,}71}{2{,}700} = 10{,}63') + note('Bilið [1,51; 10,63] er ekki samhverft um 3,19, því χ²-dreifingin er skekkt.') +
  note('Glæra 81 notar χ²<sub>α/2</sub> fyrir neðra hlutfallsmarkið, en glæra 86 notar χ²<sub>n−1,α</sub> fyrir efri halann. Lestu alltaf hvorn halann gildið á við.') + trap('Að deila með 2,700 gefur efri mörkin, ekki neðri.'));
NUM('L09-gl-21', L, 3, 'gl', G + ', gl. 100–101', 'Úrtak af stærð n = 40 hefur skeifni −0,5 og ferilris 4,5. Reiknið Jarque–Bera prófstærðina.', 40 / 6 * (0.25 + 0.25 * 2.25), 0.002, '',
  calc('JB = \\frac{n}{6}\\left(S^2 + \\frac{(K - 3)^2}{4}\\right) = \\frac{40}{6}\\left(0{,}25 + \\frac{1{,}5^2}{4}\\right) = 6{,}667 \\cdot 0{,}8125 = 5{,}417') + note('χ²<sub>2</sub> við 5% er 5,99. 5,42 < 5,99, svo normaldreifingu er ekki hafnað.') +
  slideErr('Á glæru 100 er S² sagt vera dreifni úrtaksins. S er <b>skeifni</b> úrtaksins og S² skeifnin í öðru veldi. Formúlan á glæru 101 („JB = n/6 S² ∼ χ²₂") er líka brengluð: undir H₀ er JB ∼ χ²₂.') + trap('(K − 3)² gleymir að draga 3 frá: (4,5)² = 20,25.'));
PNUM('L09-ny-2', L, 3, 'ny', 'Ný spurning · styrkur prófs (gl. 41–47)', 'H₀: μ = 10 gegn H₁: μ > 10, σ = 2 þekkt, n = 16, α = 0,05. Ef rétt μ er 11, hver er styrkur prófsins? ' + hint(TABNOTE), 1 - PROB.pnorm((10 + PROB.qnorm(0.95) * 0.5 - 11) / 0.5), nTol(1 - PROB.pnorm((10 + 1.645 * 0.5 - 11) / 0.5), PROB.tabPhi(0.355)),
  calc('\\text{Hafna ef } \\bar{x} > 10 + 1{,}645 \\cdot \\frac{2}{\\sqrt{16}} = 10{,}8225', '1 - \\beta = \\Pr(\\bar X > 10{,}8225 \\mid \\mu = 11) = \\Pr\\left(Z > \\frac{10{,}8225 - 11}{0{,}5}\\right) = \\Pr(Z > -0{,}355) = 0{,}639') + note('β = 0,361. Glærurnar skilgreina styrk en reikna hann ekki; dæmið sýnir hvers vegna stærra n eða stærri áhrif auka hann.') + trap('Pr(Z > 0,355) = 0,361 er β, ekki styrkurinn.'));
NUM('L09-gl-22', L, 3, 'gl', G + ', gl. 76–78', 'Vektorinn vid_alt á glæru 77 hefur ȳ = 7,4 og s = 0,4 (n = 25); hagfræðiúrtakið x hefur x̄ = 6,8 og s = 1,2 (n = 25). Reiknið Welch t-prófstærðina.', -0.6 / Math.sqrt(0.0576 + 0.0064), 0.002, '',
  calc('T = \\frac{6{,}8 - 7{,}4}{\\sqrt{0{,}0576 + 0{,}0064}} = \\frac{-0{,}6}{0{,}2530} = -2{,}372') + note('Þetta er t = −2,3717 sem R skilar á glæru 78.') +
  slideErr('Handreikningurinn á glæru 76 notar ȳ = 7,5 og s = 1,1 (T = −2,15, ν = 47,64), en gögnin í R-kóðanum hafa ȳ = 7,4 og s = 0,4 (staðfest í R), og R-úttakið prentar „mean of y 7.5". Báðar leiðir hafna H₀ við 5%.'), { r: true, rc: 'x <- c(6.131834,6.550493,8.817937,6.931617,7.006121,9.016122,7.426466,5.238759,5.971649,6.277362,8.393792,7.298317,7.350232,6.982539,6.137708,9.107191,7.473281,4.349525,7.731228,6.242975,5.488761,6.565960,5.541768,5.918364,6.049998); v <- c(7.177278,7.316831,8.072646,7.443872,7.468707,8.138707,7.608822,6.879586,7.123883,7.225787,7.931264,7.566106,7.583411,7.460846,7.179236,8.169064,7.624427,6.583175,7.710409,7.214325,6.962920,7.321987,6.980589,7.106121,7.149999); cat(round(t.test(x, v)$statistic, 4))', rx: '-2.3717' });
PNUM('L09-gl-23', L, 3, 'gl', G + ', gl. 60–61', 'Einhliða t-próf (H₁: μ > 6,5) með n = 100 gefur t = 2,5 og p = 0,007031. Hvert væri p-gildið fyrir tvíhliða próf (H₁: μ ≠ 6,5) með sömu gögnum?', 2 * (1 - PROB.pt(2.5, 99)), 0.0005,
  calc('p_{\\text{tvíhliða}} = 2\\min\\{\\Pr(T \\ge 2{,}5), \\Pr(T \\le 2{,}5)\\} = 2 \\cdot 0{,}007031 = 0{,}01406') + note('Tvíhliða próf hafnar líka við 5% en ekki við 1%.') + trap('0,0035 deilir með 2 í stað þess að margfalda.'));
// ---------- spjöld ----------
CARD('L09-c1', L, 'Spjald · glæra 18–21 og 35', 'Hvernig á að túlka 95% öryggisbil sem reiknað er úr úrtaki?',
  'Ef við tökum endurtekið ný úrtök og reiknum bil úr hverju, lendir rétt μ innan bilsins í 95% tilvika. Bilið er sjálft mat og breytist milli úrtaka; μ er fast. Þegar μ var þekkt (gl. 14) mátti segja að X̄ lenti innan bilsins með 95% líkum, sem er sterkari fullyrðing. Bil sem reiknað er með s í stað σ notar t-dreifingu og er breiðara.',
  ['95% endurtekinna bila innihalda μ', 'Bilið er slembið, μ fast', 'Mat, ekki rétta bilið', 't þegar σ er metið']);
CARD('L09-c2', L, 'Spjald · glæra 36–47', 'Útskýrðu villur af gerð 1 og 2 og tengsl α og β.',
  'Villa af gerð 1 er að hafna sannri H₀ (líkur α, fölsk jákvæð); villa af gerð 2 er að hafna ekki ósannri H₀ (líkur β, fölsk neikvæð). Styrkur er 1 − β. Fyrir gefið úrtak hreyfast α og β í gagnstæða átt: lægra α minnkar höfnunarsvæðið og eykur β. Venjan er að festa α (0,05 eða 0,01), því verra þykir að staðfesta ranga niðurstöðu, og minnka β með stærra úrtaki.',
  ['Gerð 1: hafna sannri H₀ (α)', 'Gerð 2: hafna ekki ósannri H₀ (β)', 'α ↓ ⇒ β ↑', 'Stærra n minnkar β']);
CARD('L09-c3', L, 'Spjald · glæra 22 og 51', 'Hvenær á að nota z og hvenær t?',
  'z (normaldreifing) þegar σ er þekkt, eða þegar úrtakið er nógu stórt til að höfða til höfuðmarkgildissetningarinnar. t með n − 1 frígráðum þegar þýðið er normaldreift og σ er metið með s. t-dreifingin hefur þyngri hala, svo viðmiðsgildin eru hærri og bilin breiðari; munurinn hverfur þegar n vex. R notar t sjálfgefið, sem er varfærnara (minni hætta á villu af gerð 1).',
  ['σ þekkt eða n stórt: z', 'σ metið, normalt þýði: t(n − 1)', 'Þyngri halar, breiðari bil', 'Munurinn hverfur fyrir stórt n']);
CARD('L09-c4', L, 'Spjald · glæra 27 og 99', 'Hvers vegna má aldrei segja að H₀ hafi verið „sönnuð" eða „samþykkt"?',
  'Tilgátupróf mælir hvort gögnin séu ólíkleg ef H₀ er sönn. Ef þau eru það ekki, segir það aðeins að gögnin samrýmist H₀, en þau gætu líka samrýmst mörgum öðrum gildum (t.d. bæði 670 og 650 í launadæminu). Of lítið úrtak (lítill styrkur) gefur oft enga höfnun þótt H₀ sé röng. Jarque–Bera getur því hafnað normaldreifingu en ekki sannað hana. Rétt orðalag er „ekki hægt að hafna H₀".',
  ['Ekki hafnað ≠ sannað', 'Mörg gildi samrýmast gögnunum', 'Lítill styrkur', '„Ekki hægt að hafna H₀"']);
CARD('L09-c5', L, 'Spjald · glæra 30 og 49–50', 'Hvenær á að nota einhliða próf og hvenær tvíhliða?',
  'Tvíhliða (H₁: μ ≠ μ₀) þegar frávik í báðar áttir skipta máli; α skiptist þá á tvo hala og viðmiðsgildið er t<sub>α/2</sub>. Einhliða (H₁: μ > μ₀ eða μ < μ₀) þegar spurningin snýst um aðra áttina, t.d. hvort laun séu yfir 800; allt α fer í annan halann, viðmiðsgildið er t<sub>α</sub> og prófið hefur meiri styrk. Á móti kemur forsendan um stefnuna, sem þarf að rökstyðja fyrir fram, ekki eftir að gögnin hafa sést. Tvíhliða p-gildi er tvöfalt einhliða gildið.',
  ['≠: tvíhliða, α/2', '> eða <: einhliða, α', 'Meiri styrkur en forsenda', 'p tvíhliða = 2 · p einhliða']);
}


// ===================== BLAÐIÐ =====================
// Formúlur eftir fyrirlestrum (lykill = id úr LECTURES). Til að bæta L08 við: bættu við lykli hér.
const SHEET_LEC = {
  L00: `<ul><li>Túlkað mál (R, Python, Matlab): línu fyrir línu, gagnvirkt en hægara · þýtt (C, C++, Java): allt í einu, hraðara</li><li>Tög: numeric · integer (<code>1L</code>) · complex · character · logical; 0 = FALSE í skilyrðum</li><li>Aðgerðir: <code>&lt;-</code> <code>+ - * / ^</code> <code>%/%</code> (heiltöludeiling) <code>%%</code> (afgangur) · <code>== != &gt; &gt;= &lt; &lt;=</code></li><li>Forgangur: <code>:</code> á undan <code>* /</code> á undan <code>+ -</code> → <code>365 - 1:3 + 1</code> = 365 364 363</li><li>Inntök: nefnd fyrst, ónefnd fylla lausu sætin í röð; sjálfgefin gildi <code>function(x, y = 3)</code></li></ul>`,
  L01: calc('\\Pr(A^c) = 1 - \\Pr(A)', '\\Pr(A \\cup B) = \\Pr(A) + \\Pr(B) - \\Pr(A \\cap B)', '(A \\cup B)^c = A^c \\cap B^c, \\quad (A \\cap B)^c = A^c \\cup B^c', 'P(n,k) = \\frac{n!}{(n-k)!}, \\quad C(n,k) = \\binom{n}{k} = \\frac{n!}{k!(n-k)!}', '\\Pr(A \\mid B) = \\frac{\\Pr(A \\cap B)}{\\Pr(B)}', '\\Pr(A) = \\sum_i \\Pr(B_i)\\Pr(A \\mid B_i)', '\\Pr(A_j \\mid B) = \\frac{\\Pr(A_j)\\Pr(B \\mid A_j)}{\\sum_i \\Pr(A_i)\\Pr(B \\mid A_i)}', '§Óháð: Pr(A ∩ B) = Pr(A)Pr(B)', '§A.m.k. einn af n óháðum: 1 − (1 − p)ⁿ'),
  L02: calc('F(x) = \\Pr(X \\le x) = \\sum_{t \\le x} f(t)', 'E[X] = \\sum x f(x), \\quad E[g(X)] = \\sum g(x) f(x)', '\\mathrm{Var}[X] = E[(X - \\mu)^2] = E[X^2] - E[X]^2', '\\mathrm{Skew} = E\\left[\\left(\\tfrac{X - \\mu}{\\sigma}\\right)^3\\right], \\quad \\mathrm{Kurt} = E\\left[\\left(\\tfrac{X - \\mu}{\\sigma}\\right)^4\\right]', '§Strjált miðgildi / p-hlutfallsmark: minnsta x með F(x) ≥ p', 'Q = a + \\frac{p - F(a)}{F(b) - F(a)}(b - a) \\quad \\text{(flokkuð gögn)}', '§Jensen: g kúpt ⇒ E[g(X)] ≥ g(E[X]); g hvelft ⇒ ≤'),
  L03: calc('\\text{Bernoulli: } p^x(1-p)^{1-x}, \\; E = p, \\; \\mathrm{Var} = p(1-p)', '\\text{Bin: } \\binom{n}{x}p^x(1-p)^{n-x}, \\; E = np, \\; \\mathrm{Var} = np(1-p)', '\\text{Poisson: } \\frac{e^{-\\lambda}\\lambda^x}{x!}, \\; E = \\mathrm{Var} = \\lambda', '\\mathrm{Bin}(n_1, p) + \\mathrm{Bin}(n_2, p) = \\mathrm{Bin}(n_1 + n_2, p)', '\\mathrm{Pois}(\\lambda_1) + \\mathrm{Pois}(\\lambda_2) = \\mathrm{Pois}(\\lambda_1 + \\lambda_2)', '\\mathrm{Bin}(n, \\lambda/n) \\to \\mathrm{Pois}(\\lambda), \\; n \\to \\infty'),
  L04: calc('F(x) = \\int_{-\\infty}^x f(t)\\,dt, \\quad f(x) = F\'(x)', 'f \\ge 0, \\quad \\int_{-\\infty}^{\\infty} f = 1 \\quad (f \\text{ má vera} > 1)', '\\Pr(a < X < b) = F(b) - F(a), \\quad \\Pr(X = x) = 0', 'E[X] = \\int x f(x)\\,dx, \\quad E[X^2] = \\int x^2 f(x)\\,dx', '§Miðgildi: F(x) = 0,5 · p-hlutfallsmark: F(x) = p', '§Uppskrift: heilda f → F · F(∞) = 1 · líkur = mismunur · vægi með heildum · F(x) = p'),
  L05: calc('Z = \\frac{X - \\mu}{\\sigma} \\sim N(0, 1), \\quad \\Phi(-z) = 1 - \\Phi(z)', 'aX + b \\sim N(a\\mu + b,\\; a^2\\sigma^2)', '\\sum X_i \\sim N\\left(\\sum \\mu_i,\\; \\sum \\sigma_i^2\\right) \\;(\\text{óháðar})', '\\chi^2(k) = Z_1^2 + \\dots + Z_k^2, \\quad F = \\frac{Y_1/k_1}{Y_2/k_2}, \\quad T = \\frac{Z}{\\sqrt{Y/k}}', '§68,3% / 95,4% / 99,7% innan 1σ / 2σ / 3σ', '§Hermun: X = F⁻¹(U), U ~ Unif(0, 1)'),
  L06: calc('F(x, y) = \\Pr(X \\le x, Y \\le y)', 'f_X(x) = \\sum_y f(x, y) \\;\\text{ eða }\\; \\int f(x, y)\\,dy', '\\Pr(x_1 < X < x_2, y_1 < Y < y_2) = F(x_2,y_2) - F(x_1,y_2) - F(x_2,y_1) + F(x_1,y_1)', '\\mathrm{Cov}[X,Y] = E[XY] - E[X]E[Y], \\quad \\rho = \\frac{\\mathrm{Cov}}{\\sigma_X\\sigma_Y} \\in [-1, 1]', '\\Sigma = \\begin{pmatrix} \\mathrm{Var}[X] & \\mathrm{Cov} \\\\ \\mathrm{Cov} & \\mathrm{Var}[Y] \\end{pmatrix}', 'f_{Y|X}(y \\mid x) = \\frac{f(x, y)}{f_X(x)}, \\quad E[X] = E[E[X \\mid Y]]', '§Óháðar ⇔ f(x, y) = f<sub>X</sub>(x)f<sub>Y</sub>(y)'),
  L07: calc('\\bar{X} = \\frac{1}{n}\\sum X_i, \\quad E[\\bar{X}] = \\mu, \\quad \\mathrm{Var}[\\bar{X}] = \\frac{\\sigma^2}{n}', 'S^2 = \\frac{1}{n-1}\\sum (X_i - \\bar{X})^2 = \\frac{\\sum X_i^2 - n\\bar{X}^2}{n - 1}, \\quad E[S^2] = \\sigma^2', '\\mathrm{Var}[S^2] = \\frac{2\\sigma^4}{n-1} \\;(\\text{normalt þýði})', '\\text{CLT: } \\frac{\\bar{X} - \\mu}{\\sigma/\\sqrt{n}} \\approx N(0, 1)', '\\frac{\\bar{X} - \\mu}{S/\\sqrt{n}} \\sim t_{n-1} \\;(\\text{normalt þýði, } \\sigma \\text{ óþekkt})', 'z = \\frac{\\hat{p} - p}{\\sqrt{p(1-p)/n}}', '§Veldisdreifing: λ̂ = 1/X̄'),
  L08: calc('B(\\hat\\theta)=E[\\hat\\theta] - \\theta, \\quad \\text{óbjagaður ef } B=0', '\\mathrm{MAE}=E[|\\hat\\theta - \\theta|], \\quad \\mathrm{MSE}=E[(\\hat\\theta - \\theta)^2]=\\mathrm{Var}[\\hat\\theta] + B^2', '§Skilvirkari: minni dreifni (af óbjöguðum) · samkvæmur: Var[θ̂] → 0 þegar n → ∞', 'E[\\tilde S^2]=\\frac{n-1}{n}\\sigma^2 \\quad (\\tilde S^2 \\text{ deilir með } n)', '§Vægjaaðferð: úrtaksvægi = vægi þýðis, eitt vægi á hvern stika', '\\text{Unif}(\\alpha,\\beta): \\; \\frac{\\hat\\alpha + \\hat\\beta}{2}=\\bar x, \\; \\frac{(\\hat\\beta - \\hat\\alpha)^2}{12}=S^2', '\\text{Bin}(n,p): \\; \\hat p=1 - \\frac{S^2}{\\bar x}, \\; \\hat n=\\frac{\\bar x}{\\hat p}', '\\hat\\theta=\\arg\\max_\\theta \\ell(\\theta), \\quad \\ell(\\theta)=\\sum \\log f(x_i \\mid \\theta), \\quad \\frac{d\\ell}{d\\theta}=0', '§Sennileikamat: Exp λ̂ = n/Σxᵢ · Poisson λ̂ = x̄ · Unif(0, β) β̂ = max xᵢ · N: μ̂ = x̄, σ̂² = Σ(xᵢ − x̄)²/n (bjagað)', 'E[\\max X_i]=\\frac{n\\beta + \\alpha}{n + 1}', '\\hat\\beta=\\frac{\\sum (x_i - \\bar x)(y_i - \\bar y)}{\\sum (x_i - \\bar x)^2}, \\quad \\hat\\alpha=\\bar y - \\hat\\beta \\bar x'),
  L09: calc('\\bar x \\pm z_{\\alpha/2}\\frac{\\sigma}{\\sqrt n} \\;(\\sigma \\text{ þekkt}), \\quad \\bar x \\pm t_{n-1,\\alpha/2}\\frac{s}{\\sqrt n} \\;(\\sigma \\text{ metið})', '§Einhliða bil: z<sub>α</sub> eða t<sub>α</sub> og aðeins önnur mörkin · z<sub>0,05</sub> = 1,645 · z<sub>0,025</sub> = 1,96 · z<sub>0,01</sub> = 2,33 · z<sub>0,005</sub> = 2,58', 'T=\\frac{\\bar x - \\mu_0}{s/\\sqrt n} \\sim t_{n-1}', '§Hafna H₀: efra einhliða T > t(n−1; α) · neðra T < −t(n−1; α) · tvíhliða |T| > t(n−1; α/2)', 'T=\\frac{\\bar x - \\bar y - D_0}{\\sqrt{s_1^2/n_1 + s_2^2/n_2}}, \\quad \\nu=\\frac{(s_1^2/n_1 + s_2^2/n_2)^2}{\\frac{(s_1^2/n_1)^2}{n_1 - 1} + \\frac{(s_2^2/n_2)^2}{n_2 - 1}}', '\\chi^2=\\frac{(n-1)s^2}{\\sigma_0^2} \\sim \\chi^2_{n-1}', '\\left[\\frac{(n-1)s^2}{\\chi^2_{1-\\alpha/2}},\\; \\frac{(n-1)s^2}{\\chi^2_{\\alpha/2}}\\right] \\;(\\text{hlutfallsmörk neðan frá})', 'F=\\frac{s_1^2}{s_2^2} \\sim F_{n_1 - 1,\\, n_2 - 1}', 'JB=\\frac{n}{6}\\left(S^2 + \\frac{(K-3)^2}{4}\\right) \\sim \\chi^2_2, \\quad S=\\text{skeifni}, \\; K=\\text{ferilris}', '§p-gildi: efri Pr(T ≥ t) · neðri Pr(T ≤ t) · tvíhliða 2·min · hafna ef p < α', '§Villa 1: hafna sannri H₀ (α) · villa 2: hafna ekki ósannri H₀ (β) · styrkur 1 − β')
};

// Ein tafla yfir allar dreifingar. * = R-fallið er ekki nefnt í glærunum (sama d/p/q/r-regla).
const SHEET_DIST = [
  ['Bernoulli(p)', M('p^x(1-p)^{1-x}'), M('F(0) = 1 - p'), M('p'), M('p(1-p)'), '<code>dbinom(x, 1, p)</code>'],
  ['Bin(n, p)', M('\\binom{n}{x}p^x(1-p)^{n-x}'), M('\\sum_{i \\le x} f(i)'), M('np'), M('np(1-p)'), '<code>dbinom pbinom rbinom</code>'],
  ['Poisson(λ)', M('\\frac{e^{-\\lambda}\\lambda^x}{x!}'), M('\\sum_{i \\le x} f(i)'), M('\\lambda'), M('\\lambda'), '<code>dpois ppois rpois</code>'],
  ['Unif(a, b)', M('\\frac{1}{b-a}'), M('\\frac{x-a}{b-a}'), M('\\frac{a+b}{2}'), M('\\frac{(b-a)^2}{12}'), '<code>punif runif</code>'],
  ['Exp(λ)', M('\\lambda e^{-\\lambda x}'), M('1 - e^{-\\lambda x}'), M('1/\\lambda'), M('1/\\lambda^2'), '<code>pexp(x, rate = λ) qexp rexp</code>'],
  ['N(μ, σ²)', M('\\frac{1}{\\sqrt{2\\pi}\\sigma}e^{-\\frac{1}{2}(\\frac{x-\\mu}{\\sigma})^2}'), M('\\Phi\\left(\\frac{x-\\mu}{\\sigma}\\right)'), M('\\mu'), M('\\sigma^2'), '<code>pnorm(x, mean, sd)</code> · <b>sd, ekki σ²</b>'],
  ['χ²(k)', 'Gamma-fall', 'tafla / R', M('k'), M('2k'), '<code>pchisq(x, k) qchisq</code>'],
  ['t(k)', 'flókin', 'tafla / R', '0 (k &gt; 1)', M('\\frac{k}{k-2}') + ' (k &gt; 2)', '<code>pt(x, k)</code>*'],
  ['F(k₁, k₂)', 'Beta-fall', 'tafla / R', M('\\frac{k_2}{k_2-2}') + ' (k₂ &gt; 2)', M('\\frac{2k_2^2(k_1+k_2-2)}{k_1(k_2-2)^2(k_2-4)}'), '<code>pf(x, k1, k2)</code>*']
];

// Reglur um E, Var og Cov
const SHEET_RULES = [
  [M('E[aX + b] = aE[X] + b'), 'alltaf'],
  [M('E[X + Y] = E[X] + E[Y]'), '<b>alltaf</b>, líka háðar'],
  [M('E[XY] = E[X]E[Y]'), 'aðeins óháðar'],
  [M('\\mathrm{Var}[aX + b] = a^2\\mathrm{Var}[X], \\; SD = |a|\\,SD[X]'), 'fastinn b hverfur'],
  [M('\\mathrm{Var}[X \\pm Y] = \\mathrm{Var}[X] + \\mathrm{Var}[Y] \\pm 2\\mathrm{Cov}[X,Y]'), 'Cov = 0 ef óháðar'],
  [M('\\mathrm{Var}[aX + bY] = a^2\\mathrm{Var}[X] + b^2\\mathrm{Var}[Y] + 2ab\\,\\mathrm{Cov}'), 'almennt'],
  [M('\\mathrm{Cov}[aX + b, cY + d] = ac\\,\\mathrm{Cov}[X, Y]'), M('\\mathrm{Cov}[X, X] = \\mathrm{Var}[X]')],
  [M('E[\\bar{X}] = \\mu, \\; \\mathrm{Var}[\\bar{X}] = \\sigma^2/n, \\; E[S^2] = \\sigma^2'), 'slembiúrtak'],
  [M('E[X] = E[E[X \\mid Y]]'), 'endurteknar væntingar']
];

// Ákvörðunarreglur
const SHEET_DECIDE = [
  ['Fastur fjöldi n óháðra tilrauna, sama p, talið hve margar heppnast', '<b>Bin(n, p)</b>'],
  ['Fjöldi atburða á tímabili; aðeins meðaltalið þekkt', '<b>Poisson(λ)</b>, með λ skalað á tímabilið sem spurt er um'],
  ['Biðtími á milli atburða (samfelldur)', '<b>Exp(λ)</b>, λ = 1/meðalbið'],
  ['Bin með stórt n og lítið p', 'Poisson(np)'],
  ['σ þekkt, eða n stórt (CLT)', '<b>z</b> og N(0, 1)'],
  ['Normaldreift þýði, σ óþekkt, lítið n (oft ≤ 30)', '<b>t</b> með n − 1 frígráðum'],
  ['Hlutfall p̂', 'z með p úr tilgátunni í nefnara'],
  ['„Að minnsta kosti einn", „einhver", „fleiri en" í Poisson', '<b>Fyllireglan</b>: 1 − Pr(engin) / 1 − F(k)'],
  ['„X > a og Y > b" í samdreifingu', 'Fyllireglan virkar <b>ekki</b> beint (De Morgan); heilda/summa yfir svæðið'],
  ['Summa eða mismunur <b>óháðra</b> breyta', '<b>Dreifnir leggjast saman</b>, líka við frádrátt; staðalfrávik aldrei'],
  ['Summa háðra breyta', 'Bæta ±2Cov við'],
  ['Hlutfallsmark strjálrar breytu', 'min{x : F(x) ≥ p}; brúun aðeins fyrir flokkuð gögn'],
  ['Hlutfallsmark samfelldrar breytu', 'Leysa F(x) = p'],
  ['Spurt um líkur á prófstærð', 'Taka alltaf fram <b>einhliða</b> eða <b>tvíhliða</b>'],
  ['Tilgáta um eitt meðaltal', '<b>t-próf</b> (σ metið) eða z (σ þekkt)'],
  ['Tvö óháð úrtök, munur á meðaltölum', '<b>Welch t-próf</b> með ν frígráðum'],
  ['Tilgáta um dreifni eða staðalfrávik eins þýðis', '<b>χ²-próf</b> með n − 1 frígráðum (staðalfrávik → dreifni)'],
  ['Tvær dreifnir bornar saman', '<b>F-próf</b>, F = s₁²/s₂² með (n₁ − 1, n₂ − 1)'],
  ['Eru gögnin normaldreifð?', '<b>Jarque–Bera</b>, χ²₂; hafna ef JB &gt; 5,99 (α = 0,05)'],
  ['H₁ með ≠', 'Tvíhliða: α/2 í hvorum hala'],
  ['H₁ með &gt; eða &lt;', 'Einhliða: allt α í þeim hala sem H₁ bendir á']
];

// R-svindlblað
const SHEET_R = [
  ['Tilvísanir', '<code>x[1]</code> fyrsta stak (byrjar á 1) · <code>x[c(1,3)]</code> · <code>x[2:4]</code> · <code>x[-1]</code> allt nema 1 · <code>x[x &gt; 5]</code> síun'],
  ['matrix', '<code>matrix(1:12, nrow = 3)</code> fyllist <b>dálk fyrir dálk</b> (byrow = TRUE fyrir raðir) · <code>m[i, j]</code> · <code>m[2, ]</code> röð · <code>m[, 3]</code> dálkur'],
  ['Listar', '<code>y[1]</code> undirlisti · <code>y[[1]]</code> stakið sjálft · <code>y[[2]][2]</code> · <code>y$nafn</code> = <code>y[["nafn"]]</code>'],
  ['Gerðir', 'vektor (eitt tag) · listi (mörg tög) · matrix (2 víddir, eitt tag) · array (fleiri víddir) · data.frame (tafla, dálkar með nöfnum)'],
  ['apply', '<code>apply(m, 1, f)</code> raðir · <code>apply(m, 2, f)</code> dálkar · <code>lapply</code> → listi · <code>sapply</code> → vektor · <code>vapply(x, f, numeric(1))</code> · <code>tapply(x, hópur, f)</code> · <code>mapply(f, x, y)</code>'],
  ['data.frame', '<code>df$Aldur</code> · <code>df[df$Aldur &lt; 30, ]</code> (tómt eftir kommu = allir dálkar) · <code>tapply(df$Aldur, df$Hópur, mean)</code> · <code>head(df)</code>'],
  ['Föll', '<code>f &lt;- function(x, y = 3) { return(x + y) }</code> · skilar síðustu segð eða return()'],
  ['Pakkar', '<code>install.packages("nafn")</code> einu sinni · <code>library(nafn)</code> í hverri keyrslu · <code>pakki::fall</code> tekur af vafa'],
  ['Dreifingar', 'd = þéttleiki · p = F(x) · q = hlutfallsmark · r = slembidráttur · <code>pnorm(x, mean, sd)</code>'],
  ['Próf', '<code>t.test(x, mu = 6.5, alternative = "greater")</code> · <code>t.test(x, y)</code> (Welch) · <code>var.test(x, y)</code> (F) · <code>$statistic</code>, <code>$p.value</code>, <code>$conf.int</code> · <code>jarque.bera.test(x)</code> (pakkinn tseries)'],
  ['Aðhvarf', '<code>m &lt;- lm(y ~ x)</code> · <code>coef(m)</code> · <code>summary(m)</code> gefur t-gildi og p-gildi fyrir H₀: β = 0 · <code>lm(y ~ 0 + I(x^2) + x)</code> án fastaliðar'],
  ['Annað', '<code>na.rm = TRUE</code> · <code>var()</code>, <code>sd()</code> deila með n − 1 · <code>prod(365 - 1:n + 1)</code> · <code>table(x)/length(x)</code> mælt PMF · <code>replicate(n, {…})</code>']
];

// Gildrulisti
const SHEET_TRAPS = [
  'sd vs dreifni: N(μ, σ²) hefur dreifnina sem seinni stika, en <code>pnorm</code>, <code>qnorm</code>, <code>rnorm</code> taka sd',
  'Var[X − Y] = Var X + Var Y (− 2Cov), ekki Var X − Var Y',
  'SD[aX] = |a|·SD[X], ekki a·SD og ekki a²·SD',
  'E[g(X)] ≠ g(E[X]) nema g sé línulegt (Jensen)',
  'Pr(X = x) = 0 fyrir samfelldar breytur, og f(x) getur verið &gt; 1',
  'Sundurlæg ≠ óháð: sundurlægir atburðir með jákvæðar líkur eru háðir',
  'Cov = 0 ⇏ óhæði (t.d. X ~ N(0, 1) og Y = X²)',
  '(A ∩ B)<sup>c</sup> = A<sup>c</sup> ∪ B<sup>c</sup>: „X &gt; 1 og Y &gt; 2" er ekki 1 − F(1, 2)',
  'λ skalað á rangt tímabil (t.d. á mánuði í stað tveggja ára)',
  'λ í veldisdreifingu er tíðni; meðalbiðin er 1/λ',
  'Tilvísun í R byrjar á 1, og matrix fyllist dálk fyrir dálk',
  'S² deilir með n − 1; Var[X̄] = σ²/n er annað en S²',
  'Staðalfrávik leggjast ekki saman: √(a + b) ≠ √a + √b',
  'Pr(X ≤ k) vs Pr(X &lt; k) í strjálum dreifingum',
  'Einhliða vs tvíhliða líkur',
  'Að deila með σ en ekki σ/√n þegar spurt er um X̄',
  'Sennileikamatið σ̂² deilir með n og er bjagað; S² deilir með n − 1',
  'Einhliða bil og próf nota t<sub>α</sub>; tvíhliða nota t<sub>α/2</sub>',
  'χ²- og F-gildi eru skrifuð á tvo vegu á glærum 09 (neðan frá á gl. 81, efri hali á gl. 86 og 93): lesið hvaða hala gildið á við',
  'Tilgáta um staðalfrávik (σ ≤ 110) er prófuð með dreifnum: s² og σ₀² = 110²',
  'Að hafna ekki H₀ sannar hana ekki; „ekki hægt að hafna H₀"',
  'Í einhliða prófi skiptir stefna T máli: stórt neikvætt T hafnar ekki H₀: μ ≤ μ₀',
  'F = s₁²/s₂², ekki hlutfall staðalfrávika'
];

// Villur á glærum (sannreyndar með útreikningi eða í R). Notaðu rétta gildið á prófi og sýndu útreikninginn.
const SHEET_ERRATA = [
  ['00 R, gl. 18', '<code>mat[1, 2]</code> skilar 2', 'Skilar 4 (matrix fyllist dálk fyrir dálk; keyrt í R)'],
  ['01, gl. 43', 'Teljari Bayes: Pr(B)Pr(A<sub>j</sub>|B)', 'Pr(A<sub>j</sub>)Pr(B|A<sub>j</sub>)'],
  ['02, gl. 18', 'Brúun: ·(a − b)', '·(b − a)'],
  ['02, gl. 48', 'Var[P] = 39,04', '9,76'],
  ['02, gl. 27–28', 'Texti: summa „hærri en 14"; kóði: &gt; 13', 'Ósamræmi; E = 92,13 með kóðanum, 15,74 með textanum'],
  ['03, gl. 22–23', 'Merkingar Pr(X &gt; 0) o.fl.', 'Atburðirnir eru X ≥ 2 (3 dagar) og X = 2 (2 dagar); tölurnar 0,352 og 0,16 réttar'],
  ['03, gl. 29', 'rbinom „reiknar þéttleikafall"', 'rbinom hermir slembigildi'],
  ['03, gl. 52', 'Pr(2 ≤ X ≤ 4) ≈ 0,676', '0,541 (0,676 er Pr(X ≤ 2))'],
  ['05, gl. 29', 'Pr(2 &lt; X &lt; 4) ≈ 0,11', '0,221'],
  ['05, gl. 41', 'Staðalfrávik aY = a·σ', '|a|·σ'],
  ['05, gl. 54', 'Dreifni summu: Σσ<sub>i</sub>', 'Σσ<sub>i</sub>²'],
  ['06, gl. 6', 'F(x, y) = 0', 'F(−∞, y) = F(x, −∞) = 0'],
  ['06, gl. 19', 'Síðasta lína e<sup>−1</sup>e<sup>−4</sup>; texti „y &gt; 2"', 'e<sup>−1</sup>(1 − e<sup>−4</sup>) = 0,3611; y &lt; 2'],
  ['06, gl. 69', 'Fylgni 0 ⇒ óháðar', 'Aðeins öfugt: óháðar ⇒ fylgni 0'],
  ['07, gl. 56', '1 − (1 − e<sup>0,288·5</sup>)', 'e<sup>−0,288·5</sup> = 0,237'],
  ['07, gl. 63 og 69', '0,042 og 0,056', 'Einhliða: 0,017 (z = −2,12) og 0,035 (t₉ = −2,06); óstaðfest hvað er átt við'],
  ['08, gl. 15', '„Bæði X̄ og X̃"', 'Ẋ = X<sub>1</sub>'],
  ['08, gl. 54', 'σ̂² = 1,647', '2,099 fyrir gögnin á gl. 50 (S² = 2,332)'],
  ['09, gl. 55', '„tilgátu um að μ sé minna en μ₀"', 'H₁: μ &gt; 6,5, svo „stærra"'],
  ['09, gl. 67', '„um 1,35 lægri"', '0,013341 · 100 = 1,33'],
  ['09, gl. 76–78', 'ȳ = 7,5 og s = 1,1 gefa T = −2,15', 'R-gögnin hafa ȳ = 7,4 og s = 0,4: T = −2,37 (eins og R skilar)'],
  ['09, gl. 85', '„S² er metið staðalfrávik"', 'S² er dreifni úrtaksins'],
  ['09, gl. 96', 'F<sub>9,9; 0,025</sub> = 4,96', '4,03 (qf(0.975, 9, 9)); niðurstaðan breytist ekki'],
  ['09, gl. 100–101', 'S² = dreifni úrtaksins', 'S = skeifni; S² er skeifnin í öðru veldi. Undir H₀ er JB ∼ χ²₂'],
  ['Dæmablað 4, 4b-ii', 'Miðja bils: (u<sub>i</sub> − l<sub>i</sub>)/2', '(u<sub>i</sub> + l<sub>i</sub>)/2 (verkefni 5 rétt)']
];

// Óstaðfest atriði (birt í Blaðinu og á Yfirliti)
const UNCONFIRMED = [
  'Snið lokaprófsins (fjölval, skrifleg dæmi eða blanda).',
  'Hvort formúlublaðið er eigið eða frá kennara; staðsetning prófsins.',
  'Strjált miðgildi: formúla glæru 16 (min{x : F(x) ≥ 0,5}) og lausn verkefnis 3 (2d: 15 í stað 20) stangast á; lausn dæmablaðs 2 (2d) brúar 70% hlutfallsmörk (3⅓) þar sem reglan gefur 4.',
  'Einhliða eða tvíhliða líkur á glærum 07 (gl. 63 og 69) — spurðu kennarann.',
  'pchisq og qchisq koma fyrir á glæru 89 í 09, en pt og pf hvergi (t.test og var.test reikna þau innbyrðis); gert ráð fyrir sömu d/p/q/r-reglu.',
  'Dæmablað 8, 1c: óljóst hvort nota á S² (n̂ = 8, p̂ = 0,4875) eða dreifni með n í nefnara (n̂ = 7), og hvort p̂ er gefið fyrir eða eftir námundun n.',
  'Dæmablað 9, 2c leyfir sameinað t-próf með jafnri dreifni, en glærurnar kenna aðeins Welch. Báðar leiðir hafna H₀ við 5%.',
  'Samantektin (skjalið) nær ekki enn yfir glærur 08 og 09; efni þeirra hér byggir eingöngu á glærunum og dæmablöðum 8–9.',
  'Lausnir vantar fyrir verkefni 1 og dæmablöð 6–9 (líka 8 og 9); svörin hér eru reiknuð sjálfstætt og staðfest tölulega.'
];

export { BANK, GENS };
