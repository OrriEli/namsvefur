// Íslenskt talnasnið: punktur skilur þúsundir, komma aukastafi, mínus er U+2212.
// Sameinar `F` úr gömlu síðunum. Eini munurinn á milli þeirra var sjálfgefinn aukastafafjöldi
// í F.pct (2 í HAG106G, 1 annars staðar), svo hann er stilltur með makeF({pctDigits}).
// tests/format.test.js ber hverja aðferð saman við gömlu útgáfurnar.

const group = s => s.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

export function makeF({ pctDigits = 1 } = {}) {
  const F = {
    int: n => { const s = Math.round(n).toString(); const neg = s.startsWith('-') && s !== '-0'; const d = s.replace('-', ''); return (neg ? '−' : '') + group(d); },
    dec: (x, d = 2) => { const r = Math.abs(x).toFixed(d); const neg = x < 0 && +r !== 0; let [i, f] = r.split('.'); i = group(i); return (neg ? '−' : '') + i + (f ? ',' + f : ''); },
    pct: (x, d = pctDigits) => F.dec(x * 100, d) + '%',
    num: x => Number.isInteger(x) ? F.int(x) : F.dec(x, 2),
    n: (x, d) => d === undefined ? (Number.isInteger(x) ? F.int(x) : F.dec(x, 2)) : F.dec(x, d),
    pp: (x, d = 2) => F.dec(x, d) + '%',
    kr: (x, d = 0) => F.dec(x, d) + ' kr.',
    usd: (x, d = 2) => '$' + F.dec(x, d),
    // stytt aukastafatala án óþarfa núlla: 0.250 → 0,25
    s: (x, d = 4) => { if (Number.isInteger(x)) return F.int(x); let t = F.dec(x, d); if (t.includes(',')) t = t.replace(/0+$/, '').replace(/,$/, ''); return t; },
    // KaTeX: sama og F.s en með {,} og venjulegu mínusmerki
    m: (x, d = 4) => F.s(x, d).replace(/−/g, '-').replace(/,(?=\d)/g, '{,}').replace(/\./g, '\\,'),
    mi: n => F.int(n).replace(/−/g, '-').replace(/\./g, '\\,')
  };
  return F;
}

export const F = makeF();

// Íslensk fleirtala: tölur sem enda á 1 (nema 11) taka eintölu. plural(141, 'spurning', 'spurningar') → „141 spurning“.
export const plural = (n, one, many) => `${n} ${n % 10 === 1 && n % 100 !== 11 ? one : many}`;

// Hlutfall sem heil prósenta, eins og í stöðutöflum gömlu síðnanna: 0,734 → „73%“, null → „–“.
export const pctTxt = p => p === null || p === undefined ? '–' : Math.round(p * 100) + '%';

// Einkunn á 0–10 með einum aukastaf: 0,73 → „7,3“.
export const grade10 = p => F.dec(p * 10, 1);

// Dagsetning og tími á íslensku óháð stillingum vafrans: „17. nóv. kl. 16:44“.
const MON = ['jan.', 'feb.', 'mars', 'apr.', 'maí', 'júní', 'júlí', 'ág.', 'sept.', 'okt.', 'nóv.', 'des.'];
export function fmtWhen(t) {
  const d = new Date(t);
  return `${d.getDate()}. ${MON[d.getMonth()]} kl. ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

// Lengd í mm:ss (eða h:mm:ss).
export function fmtDur(ms) {
  const s = Math.max(0, Math.round(ms / 1000)); const h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60), r = s % 60;
  return (h ? h + ':' : '') + String(m).padStart(2, '0') + ':' + String(r).padStart(2, '0');
}
