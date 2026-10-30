// Búið til af scripts/extract-legacy.js úr legacy/HAG107G prófæfing.html. Ekki breyta í höndunum.
// Rafalakóðinn er orðréttur; aðeins skilgreiningu síðunnar á F er skipt út fyrir sameiginlegu eininguna.
import { makeF } from '../ui/format.js';

// Reikningsdæmi sem búa til nýjar tölur í hvert skipti. Hvert fall skilar {q, o, a:0, e}.
const R = {
  ri: (a, b) => a + Math.floor(Math.random() * (b - a + 1)),
  pick: arr => arr[Math.floor(Math.random() * arr.length)],
  shuffle: arr => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
};
const F = makeF({ pctDigits: 1 });
// Byggir 5 einstaka valkosti; correct fyrst.
function opts(correct, distract, fmt, perturb) {
  const c = fmt(correct); const out = [c]; const seen = new Set([c]);
  for (const d of distract) { if (d === null || d === undefined || !isFinite(d)) continue; const s = fmt(d); if (!seen.has(s)) { seen.add(s); out.push(s); } if (out.length === 5) break; }
  let k = 1;
  while (out.length < 5 && k < 60) { const v = perturb(correct, k); const s = fmt(v); if (!seen.has(s)) { seen.add(s); out.push(s); } k++; }
  return out;
}
const pertAdd = step => (c, k) => c + (k % 2 ? 1 : -1) * Math.ceil(k / 2) * step;
const pertMul = (c, k) => c * (1 + (k % 2 ? 1 : -1) * Math.ceil(k / 2) * 0.08);

const demTxt = (a, b) => b === 1 ? `P = ${F.num(a)} − Q` : `P = ${F.num(a)} − ${F.num(b)}Q`;

const GENS = [
// ---------- Einokun: verð og magn ----------
{id:"gen-mono-p", t:"ein", name:"Einokunarverð (JT = JK)", f(){
  const b = R.pick([1, 1, 2, 0.5]); const c = R.ri(2, 12) * 5; const Q = R.ri(5, 30) * 2; const a = c + 2 * b * Q;
  const P = a - b * Q; const FC = R.ri(1, 9) * 50; const dem = demTxt(a, b);
  return { q:`Andhverft eftirspurnarfall einokunarfyrirtækis er ${dem} og kostnaðarfallið er C = ${F.int(FC)} + ${c}Q. Hvaða verð setur fyrirtækið til að hámarka hagnað?`,
    o: opts(P, [c, a / 2, Q, a - 2 * b * (Q / 2)], v => F.num(v), pertAdd(b * 2)), a:0,
    e:`<div class="f">JT = ${F.num(a)} − ${F.num(2 * b)}Q<br>JK = ${c}<br>${F.num(a)} − ${F.num(2 * b)}Q = ${c} ⇒ Q = ${F.num(Q)}<br>P = ${F.num(a)} − ${F.num(b)} × ${F.num(Q)} = ${F.num(P)}</div>Gildrur: ${c} er jaðarkostnaðurinn (V = JK, samkeppni); ${F.num(a / 2)} er verðið þar sem JT = 0 (tekjuhámörkun); ${F.num(Q)} er magnið, ekki verðið. Fastur kostnaður (${F.int(FC)}) hefur engin áhrif á verðið.` };
}},
// ---------- Einokun: hagnaður ----------
{id:"gen-mono-profit", t:"ein", name:"Hagnaður einokunarfyrirtækis", f(){
  const b = R.pick([1, 1, 2]); const c = R.ri(2, 12) * 5; const Q = R.ri(5, 30) * 2; const a = c + 2 * b * Q;
  const P = a - b * Q; const FC = Math.min(R.ri(2, 30) * 10, Math.floor(b * Q * Q / 20) * 10); const TR = P * Q; const pi = TR - FC - c * Q;
  const Qr = a / (2 * b), Pr = a / 2;
  return { q:`Einokunarfyrirtæki stendur frammi fyrir eftirspurninni ${demTxt(a, b)} og hefur kostnaðarfallið C = ${F.int(FC)} + ${c}Q. Hver er hagnaður þess þegar það hámarkar hagnað?`,
    o: opts(pi, [pi + FC, TR, Pr * Qr - FC - c * Qr, (P - c) * Q * 2 - FC], v => F.int(v), pertAdd(Math.max(10, Math.round(pi / 50 / 10) * 10))), a:0,
    e:`<div class="f">JT = JK: ${F.num(a)} − ${F.num(2 * b)}Q = ${c} ⇒ Q = ${F.num(Q)}<br>P = ${F.num(a)} − ${F.num(b)} × ${F.num(Q)} = ${F.num(P)}<br>HT = ${F.num(P)} × ${F.num(Q)} = ${F.int(TR)}<br>HK = ${F.int(FC)} + ${c} × ${F.num(Q)} = ${F.int(FC + c * Q)}<br>Hagnaður = ${F.int(TR)} − ${F.int(FC + c * Q)} = ${F.int(pi)}</div>Gildrur: ${F.int(pi + FC)} gleymir fasta kostnaðinum; ${F.int(TR)} eru heildartekjur. Sama aðferð og í DB8 #1.` };
}},
// ---------- Einokun: allratap ----------
{id:"gen-mono-dwl", t:"ein", name:"Allratap einokunar", f(){
  const b = R.pick([1, 1, 2, 0.5]); const c = R.ri(1, 10) * 5; const Q = R.ri(4, 25) * 2; const a = c + 2 * b * Q;
  const P = a - b * Q; const Qc = (a - c) / b; const dwl = 0.5 * (Qc - Q) * (P - c);
  const cs = 0.5 * Q * (a - P); const pi = (P - c) * Q;
  return { q:`Einokunarfyrirtæki með fastan jaðarkostnað JK = ${c} stendur frammi fyrir eftirspurninni ${demTxt(a, b)}. Hvert er allratapið vegna einokunarinnar?`,
    o: opts(dwl, [2 * dwl, cs, pi, 0.5 * (a / b - Q) * P], v => F.num(v), pertAdd(Math.max(5, Math.round(dwl / 8 / 5) * 5))), a:0,
    e:`<div class="f">Einokun: ${F.num(a)} − ${F.num(2 * b)}Q = ${c} ⇒ Q<sub>E</sub> = ${F.num(Q)}, P<sub>E</sub> = ${F.num(P)}<br>Skilvirkt: P = JK ⇒ ${F.num(a)} − ${F.num(b)}Q = ${c} ⇒ Q<sub>S</sub> = ${F.num(Qc)}<br>Allratap = ½ × (Q<sub>S</sub> − Q<sub>E</sub>) × (P<sub>E</sub> − JK)<br>= ½ × (${F.num(Qc)} − ${F.num(Q)}) × (${F.num(P)} − ${c}) = ${F.num(dwl)}</div>Gildrur: ${F.num(2 * dwl)} gleymir ½; ${F.num(pi)} er einokunarhagnaðurinn (tilfærsla, ekki tap); ${F.num(cs)} er neytendaábatinn.` };
}},
// ---------- Lerner ----------
{id:"gen-lerner", t:"ein", name:"Lerner-vísitala", f(){
  const MC = R.ri(2, 40) * 5; let P = MC + R.ri(1, 30) * 5; if (P === 2 * MC) P += 5;
  const L = (P - MC) / P;
  return { q:`Fyrirtæki selur vöru á P = ${F.int(P)} kr. og jaðarkostnaður er ${F.int(MC)} kr. Hver er Lerner-vísitalan?`,
    o: opts(L, [MC / P, P / MC, (P - MC) / MC, 1 / L], v => F.dec(v, 2), (c, k) => c + (k % 2 ? 1 : -1) * Math.ceil(k / 2) * 0.03), a:0,
    e:`<div class="f">L = (P − MC) / P<br>L = (${F.int(P)} − ${F.int(MC)}) / ${F.int(P)} = ${F.dec(L, 2)}</div>Gildrur: ${F.dec(MC / P, 2)} = MC/P; ${F.dec((P - MC) / MC, 2)} deilir með MC í stað P (álagning sem hlutfall af kostnaði); ${F.dec(P / MC, 2)} = P/MC. Lerner er alltaf á milli 0 og 1.` };
}},
// ---------- Teygni úr Lerner ----------
{id:"gen-eps", t:"ein", name:"Teygni sem einokari telur sig standa frammi fyrir", f(){
  const MC = R.ri(2, 30) * 5; const P = MC + R.ri(1, 30) * 5; const L = (P - MC) / P; const e = -1 / L;
  return { q:`Hagnaðarhámarkandi einokunarfyrirtæki selur á P = ${F.int(P)} og jaðarkostnaður er ${F.int(MC)}. Hver er verðteygni eftirspurnar við þetta verð?`,
    o: opts(e, [-L, -P / MC, -MC / P, -(P - MC) / MC], v => F.dec(v, 2), (c, k) => c + (k % 2 ? 1 : -1) * Math.ceil(k / 2) * 0.07), a:0,
    e:`<div class="f">L = (${F.int(P)} − ${F.int(MC)}) / ${F.int(P)} = ${F.dec(L, 3)}<br>L = −1/ε ⇒ ε = −1 / ${F.dec(L, 3)} = ${F.dec(e, 2)}</div>Gildran ${F.dec(-L, 2)} setur Lerner beint inn sem teygni. Hagnaðarhámarkandi einokari er alltaf á teygna hlutanum (|ε| &gt; 1). Sama og DB8 #2c.` };
}},
// ---------- Verð út frá teygni ----------
{id:"gen-markup", t:"ein", name:"Verð út frá teygni og JK", f(){
  const e = R.pick([1.25, 1.5, 2, 2.5, 3, 4, 5]); const MC = R.ri(2, 30) * 10; const P = MC * e / (e - 1);
  return { q:`Einokunarfyrirtæki hefur jaðarkostnað ${F.int(MC)} kr. og verðteygni eftirspurnar er ${F.dec(-e, 2)}. Hvaða verð hámarkar hagnað?`,
    o: opts(P, [MC * (1 + 1 / e), MC * e, MC, MC * e / (e + 1)], v => F.num(Math.round(v * 100) / 100), pertMul), a:0,
    e:`<div class="f">(P − MC)/P = 1/|ε|<br>P = MC / (1 − 1/|ε|) = MC × |ε| / (|ε| − 1)<br>P = ${F.int(MC)} × ${F.num(e)} / ${F.num(e - 1)} = ${F.num(Math.round(P * 100) / 100)}</div>Gildran ${F.num(Math.round(MC * (1 + 1 / e) * 100) / 100)} = MC × (1 + 1/|ε|) leggur 1/|ε| ofan á <b>kostnaðinn</b>, en Lerner mælir álagningu sem hlutfall af <b>verðinu</b>.` };
}},
// ---------- Þriðja stigs verðmismunun ----------
{id:"gen-pd3", t:"ein", name:"Verðmismunun á tveimur mörkuðum", f(){
  let a1, a2, b1, b2, c, P1, P2, Pu;
  for (let k = 0; k < 50; k++) {
    c = R.ri(2, 8) * 5; a1 = c + R.ri(4, 20) * 10; a2 = c + R.ri(4, 20) * 10; b1 = R.pick([1, 2]); b2 = R.pick([1, 2, 4]);
    if (a1 === a2) continue; P1 = (a1 + c) / 2; P2 = (a2 + c) / 2;
    const A = a1 / b1 + a2 / b2, B = 1 / b1 + 1 / b2; Pu = (A + B * c) / (2 * B);
    if (Pu < Math.min(a1, a2) - 1) break;
  }
  return { q:`Einokunarfyrirtæki með fastan jaðarkostnað ${c} selur á tveimur aðgreindum mörkuðum: P₁ = ${a1} − ${b1 === 1 ? '' : b1}Q₁ og P₂ = ${a2} − ${b2 === 1 ? '' : b2}Q₂. Endursala milli markaða er ómöguleg. Hvaða verð setur það á markaði 2?`,
    o: opts(P2, [P1, a2 / 2, Math.round(Pu * 100) / 100, c, (a2 + c) / (2 * b2) === P2 ? null : (a2 + c) / (2 * b2)], v => F.num(Math.round(v * 100) / 100), pertAdd(2.5)), a:0,
    e:`Á hvorum markaði gildir JT = JK:<div class="f">JT₂ = ${a2} − ${2 * b2}Q₂ = ${c} ⇒ Q₂ = ${F.num((a2 - c) / (2 * b2))}<br>P₂ = ${a2} − ${b2} × ${F.num((a2 - c) / (2 * b2))} = ${F.num(P2)}</div>Með föstum JK eru markaðirnir óháðir hvor öðrum og P = (skurðpunktur + JK)/2. Gildrur: ${F.num(P1)} er verðið á markaði 1; ${F.num(Math.round(Pu * 100) / 100)} er sameiginlegt verð án mismununar; ${F.num(a2 / 2)} gleymir JK.` };
}},
// ---------- Skattur á einokun ----------
{id:"gen-mono-tax", t:"ein", name:"Einingaskattur á einokunarfyrirtæki", f(){
  const c = R.ri(1, 6) * 5; const t = R.ri(1, 8) * 4; const Q1 = R.ri(15, 50) * 2; const a = c + 2 * Q1 + t;
  const Pm = (a + c) / 2; const Pt = (a + c + t) / 2;
  return { q:`Eftirspurn er P = ${a} − Q og jaðarkostnaður einokunarfyrirtækis er ${c}. Settur er ${t} kr. einingaskattur á framleiðandann. Hvert verður verðið eftir skatt?`,
    o: opts(Pt, [Pm + t, Pm, c + t, Pt + t], v => F.num(v), pertAdd(1)), a:0,
    e:`<div class="f">Fyrir skatt: ${a} − 2Q = ${c} ⇒ Q = ${F.num((a - c) / 2)}, P = ${F.num(Pm)}<br>Eftir skatt: JK = ${c} + ${t} = ${c + t}<br>${a} − 2Q = ${c + t} ⇒ Q = ${F.num((a - c - t) / 2)}<br>P = ${a} − ${F.num((a - c - t) / 2)} = ${F.num(Pt)}</div>Verðið hækkar um ${F.num(t / 2)}, helming skattsins. Gildran ${F.num(Pm + t)} veltir öllum skattinum á neytendur. Sama aðferð og AD7 #1.` };
}},
// ---------- Jaðartekjur úr töflu ----------
{id:"gen-mr", t:"ein", name:"Jaðartekjur úr eftirspurnartöflu", f(){
  const step = R.pick([1, 2, 3, 5]); const p0 = step * R.ri(9, 14); const n = R.ri(3, 7);
  const P = q => p0 - step * q; const TR = q => P(q) * q; const mr = TR(n) - TR(n - 1);
  const rows = [n - 2, n - 1, n, n + 1].filter(q => q >= 1).map(q => `<tr><td>${q}</td><td>${F.int(P(q))}</td></tr>`).join('');
  return { q:`Eftirspurn einokunarfyrirtækis:<table class="dt"><tr><th>Magn</th><th>Verð</th></tr>${rows}</table>Hverjar eru jaðartekjurnar af ${n}. einingunni?`,
    o: opts(mr, [P(n), TR(n), TR(n - 1) - TR(n - 2), P(n - 1)], v => F.int(v), pertAdd(step)), a:0,
    e:`<div class="f">HT(${n - 1}) = ${n - 1} × ${F.int(P(n - 1))} = ${F.int(TR(n - 1))}<br>HT(${n}) = ${n} × ${F.int(P(n))} = ${F.int(TR(n))}<br>JT = ${F.int(TR(n))} − ${F.int(TR(n - 1))} = ${F.int(mr)}</div>Gildrur: ${F.int(P(n))} er verðið (meðaltekjur); ${F.int(TR(n))} eru heildartekjur; ${F.int(TR(n - 1) - TR(n - 2))} eru jaðartekjur fyrri einingar.` };
}},
// ---------- HHI ----------
{id:"gen-hhi", t:"fak", name:"Herfindahl-Hirschman vísitala", f(){
  const n = R.ri(3, 5); let s;
  for (;;) { s = Array.from({length: n - 1}, () => R.ri(1, 9) * 5); const rest = 100 - s.reduce((x, y) => x + y, 0); if (rest >= 5 && rest <= 70) { s.push(rest); break; } }
  s.sort((x, y) => y - x); const hhi = s.reduce((x, y) => x + y * y, 0);
  return { q:`Á markaði eru ${n} fyrirtæki með markaðshlutdeild ${s.map(x => x + '%').join(', ')}. Hver er HHI?`,
    o: opts(hhi, [hhi - s[s.length - 1] ** 2, n * (100 / n) ** 2, s[0] ** 2, 100 * n, hhi + s[s.length - 1] ** 2], v => F.int(v), pertAdd(50)), a:0,
    e:`<div class="f">HHI = Σ sᵢ²<br>= ${s.map(x => x + '²').join(' + ')}<br>= ${s.map(x => F.int(x * x)).join(' + ')} = ${F.int(hhi)}</div>Gildrur: ${F.int(n * (100 / n) ** 2)} gerir ráð fyrir jafnstórum fyrirtækjum; ${F.int(hhi - s[s.length - 1] ** 2)} sleppir minnsta fyrirtækinu. Einokun gefur 10.000.` };
}},
// ---------- Nash-jafnvægi í 2×2 leik ----------
{id:"gen-nash", t:"fak", name:"Nash-jafnvægi í ábatafylki", f(){
  const sA = R.pick([['Hátt verð','Lágt verð'],['Auglýsa','Auglýsa ekki'],['Mikið magn','Lítið magn'],['Stór sjóður','Lítill sjóður']]);
  let U, rA, rB;
  for (;;) {
    U = [[0,0],[0,0]].map(r => r.map(() => [R.ri(0, 18) * 5, R.ri(0, 18) * 5]));
    const domA = [0,1].find(i => U[i][0][0] > U[1-i][0][0] && U[i][1][0] > U[1-i][1][0]);
    const domB = [0,1].find(j => U[0][j][1] > U[0][1-j][1] && U[1][j][1] > U[1][1-j][1]);
    if (domA === undefined && domB === undefined) continue;
    // ein ríkjandi að minnsta kosti; finn einstakt Nash
    const ne = []; for (const i of [0,1]) for (const j of [0,1]) if (U[i][j][0] >= U[1-i][j][0] && U[i][j][1] >= U[i][1-j][1]) ne.push([i, j]);
    const strict = ne.filter(([i, j]) => U[i][j][0] > U[1-i][j][0] && U[i][j][1] > U[i][1-j][1]);
    if (ne.length === 1 && strict.length === 1) { [rA, rB] = ne[0]; break; }
  }
  const cell = (i, j) => `A: ${sA[i].toLowerCase()}, B: ${sA[j].toLowerCase()} (A fær ${U[i][j][0]}, B fær ${U[i][j][1]})`;
  const others = []; for (const i of [0,1]) for (const j of [0,1]) if (i !== rA || j !== rB) others.push(cell(i, j));
  const tab = `<table class="dt"><tr><th></th><th>B: ${sA[0].toLowerCase()}</th><th>B: ${sA[1].toLowerCase()}</th></tr>${[0,1].map(i => `<tr><td>A: ${sA[i].toLowerCase()}</td><td>${U[i][0][0]}, ${U[i][0][1]}</td><td>${U[i][1][0]}, ${U[i][1][1]}</td></tr>`).join('')}</table>`;
  const br = (who) => who === 'A' ? [0,1].map(j => `Ef B ${sA[j].toLowerCase()}: A fær ${U[0][j][0]} eða ${U[1][j][0]} ⇒ ${sA[U[0][j][0] > U[1][j][0] ? 0 : U[0][j][0] < U[1][j][0] ? 1 : 0].toLowerCase()}${U[0][j][0] === U[1][j][0] ? ' (jafnt)' : ''}`).join('<br>')
    : [0,1].map(i => `Ef A ${sA[i].toLowerCase()}: B fær ${U[i][0][1]} eða ${U[i][1][1]} ⇒ ${sA[U[i][0][1] > U[i][1][1] ? 0 : U[i][0][1] < U[i][1][1] ? 1 : 0].toLowerCase()}${U[i][0][1] === U[i][1][1] ? ' (jafnt)' : ''}`).join('<br>');
  return { q:`Tvö fyrirtæki velja samtímis. Útborganir (A, B):${tab}Hvert er Nash-jafnvægið?`,
    o:[cell(rA, rB), ...others, 'Ekkert Nash-jafnvægi er til í hreinum leikáætlunum'], a:0,
    e:`Finndu besta svar hvors leikmanns við hverri leikáætlun hins:<div class="f">${br('A')}<br>${br('B')}</div>Aðeins í (${sA[rA].toLowerCase()}, ${sA[rB].toLowerCase()}) eru báðir að velja besta svar við vali hins. Algengasta villan er að velja reitinn með hæstu samanlögðu útborgun; hann er oft ekki jafnvægi (valkreppa fangans).` };
}},
// ---------- Leikur í röð (leikjatré) ----------
{id:"gen-seq", t:"fak", name:"Leikur í röð: aftur á bak", f(){
  let L;
  for (;;) {
    L = [[R.ri(-4, 6) * 5, R.ri(-3, 4) * 5], [R.ri(-2, 6) * 5, R.ri(-2, 4) * 5], [R.ri(-4, 6) * 5, R.ri(-3, 4) * 5], [R.ri(-2, 6) * 5, R.ri(-2, 4) * 5]];
    if (L[0][1] === L[1][1] || L[2][1] === L[3][1]) continue;
    const yL = L[0][1] > L[1][1] ? 0 : 1, yH = L[2][1] > L[3][1] ? 2 : 3;
    if (L[yL][0] === L[yH][0]) continue;
    const xs = L.map(l => l[0]); if (new Set(xs).size < 4) continue;
    const eq = L[yL][0] > L[yH][0] ? yL : yH; const best = xs.indexOf(Math.max(...xs));
    if (best === eq) continue; // villugildran á að vera til
    L.eq = eq; L.yL = yL; L.yH = yH; break;
  }
  const lab = ['lágt verð, Y kemur inn','lágt verð, Y kemur ekki inn','hátt verð, Y kemur inn','hátt verð, Y kemur ekki inn'];
  const opt = i => `X setur ${lab[i]}: X fær ${F.int(L[i][0])}`;
  return { q:`Fyrirtæki X velur fyrst hátt eða lágt verð. Fyrirtæki Y sér valið og ákveður hvort það kemur inn á markaðinn. Útborganir (X, Y):<table class="dt"><tr><th>X</th><th>Y</th><th>(X, Y)</th></tr><tr><td>Lágt</td><td>Inn</td><td>${F.int(L[0][0])}, ${F.int(L[0][1])}</td></tr><tr><td>Lágt</td><td>Ekki inn</td><td>${F.int(L[1][0])}, ${F.int(L[1][1])}</td></tr><tr><td>Hátt</td><td>Inn</td><td>${F.int(L[2][0])}, ${F.int(L[2][1])}</td></tr><tr><td>Hátt</td><td>Ekki inn</td><td>${F.int(L[3][0])}, ${F.int(L[3][1])}</td></tr></table>Hver verður niðurstaðan?`,
    o:[opt(L.eq), ...[0,1,2,3].filter(i => i !== L.eq).map(opt), 'Ekkert jafnvægi er til'], a:0,
    e:`Leystu aftur á bak, frá Y:<div class="f">Ef lágt: Y fær ${F.int(L[0][1])} (inn) eða ${F.int(L[1][1])} (ekki) ⇒ ${L.yL === 0 ? 'inn' : 'ekki inn'} ⇒ X fær ${F.int(L[L.yL][0])}<br>Ef hátt: Y fær ${F.int(L[2][1])} (inn) eða ${F.int(L[3][1])} (ekki) ⇒ ${L.yH === 2 ? 'inn' : 'ekki inn'} ⇒ X fær ${F.int(L[L.yH][0])}<br>X velur ${L.eq < 2 ? 'lágt' : 'hátt'} verð (${F.int(L[L.eq][0])} &gt; ${F.int(L[L.eq === L.yL ? L.yH : L.yL][0])})</div>Gildran er að velja hæstu útborgun X í töflunni (${F.int(Math.max(...L.map(l => l[0])))}) án þess að athuga hvort Y myndi í raun velja þá grein.` };
}},
// ---------- Samráð og svik ----------
{id:"gen-cartel", t:"fak", name:"Samráð í tvíkeppni og svik", f(){
  const c = R.ri(0, 4) * 10; const Qm = R.ri(3, 8) * 20; const a = c + 2 * Qm; const q = Qm / 2; const d = R.pick([5, 10]) * (Qm >= 100 ? 2 : 1);
  const P = a - Qm, pi = (P - c) * q; const P2 = a - Qm - d; const pi1 = (P2 - c) * (q + d), pi2 = (P2 - c) * q;
  return { q:`Tvö fyrirtæki eru á markaði með eftirspurn P = ${a} − Q og jaðarkostnað ${c}. Þau hafa samráð og framleiða einokunarmagnið, ${q} hvort. Fyrirtæki 1 svíkur og framleiðir ${q + d} en fyrirtæki 2 heldur sig við ${q}. Hvernig breytist hagnaður fyrirtækis 1?`,
    o: opts(pi1 - pi, [pi2 - pi, (pi1 + pi2) - 2 * pi, (P - c) * d, pi1], v => (v > 0 ? '+' : '') + F.int(v), pertAdd(10)), a:0,
    e:`<div class="f">Samráð: Q = ${Qm}, P = ${a} − ${Qm} = ${P}<br>Hagnaður hvors = (${P} − ${c}) × ${q} = ${F.int(pi)}<br>Svik: Q = ${q + d} + ${q} = ${Qm + d}, P = ${P2}<br>Fyrirtæki 1: (${P2} − ${c}) × ${q + d} = ${F.int(pi1)}<br>Breyting = ${F.int(pi1)} − ${F.int(pi)} = ${(pi1 - pi > 0 ? '+' : '') + F.int(pi1 - pi)}</div>Gildrur: ${F.int(pi2 - pi)} er breytingin hjá fyrirtæki 2; ${F.int((P - c) * d)} gleymir að verðið lækkar á öllum einingunum. Sama rökfræði og demantadæmið (DB9 #1c).` };
}},
// ---------- Innflutningur ----------
{id:"gen-imports", t:"vid", name:"Innflutningur við heimsmarkaðsverð", f(){
  const b = R.pick([1, 2, 3]), d = R.pick([1, 2]); const Pa = R.ri(10, 40) * 2; const Qa = d * Pa + R.ri(5, 60) * 2;
  const a = Qa + b * Pa, c0 = Qa - d * Pa; const Pw = Pa - R.ri(2, Math.floor(Pa / 3)) * 2;
  const QD = a - b * Pw, QS = c0 + d * Pw; const imp = QD - QS;
  return { q:`Innlend eftirspurn er Q<sub>D</sub> = ${a} − ${b === 1 ? '' : b}P og innlent framboð er Q<sub>S</sub> = ${c0 < 0 ? '−' + Math.abs(c0) : c0} + ${d === 1 ? '' : d}P. Heimsmarkaðsverð er ${Pw} og viðskipti eru frjáls. Hve mikið er flutt inn?`,
    o: opts(imp, [QD, QS, Qa, QD - Qa, Qa - QS === QD - Qa ? null : Qa - QS], v => F.num(v), pertAdd(2)), a:0,
    e:`<div class="f">Án viðskipta: ${a} − ${b === 1 ? '' : b}P = ${F.int(c0)} + ${d === 1 ? '' : d}P ⇒ P = ${Pa}, Q = ${Qa}<br>Við P = ${Pw}: Q<sub>D</sub> = ${a} − ${b} × ${Pw} = ${QD}<br>Q<sub>S</sub> = ${F.int(c0)} + ${d} × ${Pw} = ${QS}<br>Innflutningur = ${QD} − ${QS} = ${imp}</div>Gildrur: ${QD} er eftirspurnin og ${QS} innlent framboð. ${QD - Qa} mælir aðeins aukningu eftirspurnar frá jafnvægi án viðskipta.` };
}},
// ---------- Ávinningur af viðskiptum ----------
{id:"gen-tradegain", t:"vid", name:"Ávinningur af viðskiptum (svæði D)", f(){
  const b = R.pick([1, 2]), d = R.pick([1, 2]); const Pa = R.ri(10, 40) * 2; const Qa = d * Pa + R.ri(5, 60) * 2;
  const a = Qa + b * Pa, c0 = Qa - d * Pa; const Pw = Pa - R.ri(2, Math.floor(Pa / 3)) * 2; const dP = Pa - Pw;
  const QD = a - b * Pw, QS = c0 + d * Pw; const imp = QD - QS; const gain = 0.5 * dP * imp;
  const dCS = 0.5 * (Qa + QD) * dP, dPS = 0.5 * (Qa + QS) * dP;
  return { q:`Q<sub>D</sub> = ${a} − ${b === 1 ? '' : b}P og Q<sub>S</sub> = ${c0 < 0 ? '−' + Math.abs(c0) : c0} + ${d === 1 ? '' : d}P. Jafnvægi án viðskipta er P = ${Pa}. Landið opnar fyrir innflutning á heimsmarkaðsverðinu ${Pw}. Um hve mikið eykst heildarábatinn?`,
    o: opts(gain, [2 * gain, dCS, dPS, dP * Qa], v => F.num(v), pertAdd(Math.max(2, Math.round(gain / 10)))), a:0,
    e:`<div class="f">Q<sub>D</sub>(${Pw}) = ${QD} · Q<sub>S</sub>(${Pw}) = ${QS} · innflutningur = ${imp}<br>D = ½ × (${Pa} − ${Pw}) × ${imp} = ${F.num(gain)}</div>Athugun með breytingum:<div class="f">ΔNÁ = ½ × (${Qa} + ${QD}) × ${dP} = +${F.num(dCS)}<br>ΔFÁ = −½ × (${Qa} + ${QS}) × ${dP} = −${F.num(dPS)}<br>Summa = ${F.num(dCS - dPS)}</div>Gildrur: ${F.num(2 * gain)} gleymir ½; ${F.num(dCS)} er aðeins ávinningur neytenda. Sama aðferð og DB9 #4b.` };
}},
// ---------- Tollur: allratap ----------
{id:"gen-tariff-dwl", t:"vid", name:"Allratap tolls", f(){
  const b = R.pick([1, 2]), d = R.pick([1, 2]); const Pa = R.ri(15, 40) * 2; const Qa = d * Pa + R.ri(5, 60) * 2;
  const a = Qa + b * Pa, c0 = Qa - d * Pa; const Pw = Pa - R.ri(4, Math.floor(Pa / 3)) * 2; const t = R.ri(1, Math.floor((Pa - Pw) / 2) - 1) * 2;
  const Pt = Pw + t; const QD0 = a - b * Pw, QS0 = c0 + d * Pw, QD1 = a - b * Pt, QS1 = c0 + d * Pt;
  const Dd = 0.5 * t * (QS1 - QS0), Fd = 0.5 * t * (QD0 - QD1); const dwl = Dd + Fd; const rev = t * (QD1 - QS1);
  return { q:`Q<sub>D</sub> = ${a} − ${b === 1 ? '' : b}P og Q<sub>S</sub> = ${c0 < 0 ? '−' + Math.abs(c0) : c0} + ${d === 1 ? '' : d}P. Heimsmarkaðsverð er ${Pw} og settur er ${t} kr. tollur á hverja innflutta einingu. Hvert er allratap tollsins?`,
    o: opts(dwl, [2 * dwl, Dd, rev, rev + dwl], v => F.num(v), pertAdd(Math.max(1, Math.round(dwl / 8)))), a:0,
    e:`<div class="f">Verð með tolli = ${Pw} + ${t} = ${Pt}<br>Q<sub>S</sub>: ${QS0} → ${QS1} · Q<sub>D</sub>: ${QD0} → ${QD1}<br>D = ½ × ${t} × (${QS1} − ${QS0}) = ${F.num(Dd)}<br>F = ½ × ${t} × (${QD0} − ${QD1}) = ${F.num(Fd)}<br>Allratap = D + F = ${F.num(dwl)}</div>Gildrur: ${F.num(rev)} eru tolltekjurnar (tilfærsla, ekki tap); ${F.num(Dd)} telur aðeins framleiðsluþríhyrninginn; ${F.num(2 * dwl)} gleymir ½.` };
}},
// ---------- Tollur: tolltekjur ----------
{id:"gen-tariff-rev", t:"vid", name:"Tolltekjur (prósentutollur)", f(){
  const b = 2, d = 2; const Pw = R.ri(4, 15) * 5; const pct = R.pick([10, 20, 40, 50]); const Pt = Math.round(Pw * (100 + pct)) / 100;
  const Pa = Math.ceil(Pt) + R.ri(2, 10) * 2; const Qa = d * Pa + R.ri(5, 50) * 2; const a = Qa + b * Pa, c0 = Qa - d * Pa;
  const QD0 = a - b * Pw, QS0 = c0 + d * Pw, QD1 = a - b * Pt, QS1 = c0 + d * Pt; const tt = Pt - Pw; const rev = tt * (QD1 - QS1);
  return { q:`Q<sub>D</sub> = ${a} − 2P og Q<sub>S</sub> = ${c0 < 0 ? '−' + Math.abs(c0) : c0} + 2P. Heimsmarkaðsverð er ${Pw}. Settur er ${pct}% tollur á heimsmarkaðsverðið. Hverjar eru tolltekjur ríkisins?`,
    o: opts(rev, [tt * (QD0 - QS0), Pt * (QD1 - QS1), pct * (QD1 - QS1), 0.5 * tt * ((QS1 - QS0) + (QD0 - QD1))], v => F.num(v), pertAdd(Math.max(1, Math.round(rev / 10)))), a:0,
    e:`<div class="f">Tollur = ${pct}% × ${Pw} = ${F.num(tt)} · verð = ${F.num(Pt)}<br>Q<sub>D</sub> = ${a} − 2 × ${F.num(Pt)} = ${F.num(QD1)}<br>Q<sub>S</sub> = ${F.int(c0)} + 2 × ${F.num(Pt)} = ${F.num(QS1)}<br>Innflutningur = ${F.num(QD1 - QS1)}<br>Tolltekjur = ${F.num(tt)} × ${F.num(QD1 - QS1)} = ${F.num(rev)}</div>Gildrur: ${F.num(tt * (QD0 - QS0))} notar innflutninginn <b>fyrir</b> toll; ${F.num(Pt * (QD1 - QS1))} margfaldar með öllu verðinu í stað tollsins. Sama aðferð og DB9 #4c.` };
}},
// ---------- Kvóti: verð ----------
{id:"gen-quota", t:"vid", name:"Innanlandsverð með innflutningskvóta", f(){
  const b = R.pick([1, 2]), d = R.pick([1, 2]); const Pa = R.ri(30, 80) * 2; const Qa = d * Pa + R.ri(5, 100) * 2;
  const a = Qa + b * Pa, c0 = Qa - d * Pa; const Pw = Pa - R.ri(8, Math.floor(Pa / 2)) * 2; const imp = (a - b * Pw) - (c0 + d * Pw);
  let Pq, quota; for (;;) { Pq = R.ri(Pw + 1, Pa - 1); quota = (a - c0) - (b + d) * Pq; if (quota > 0 && quota < imp) break; }
  return { q:`Q<sub>D</sub> = ${a} − ${b === 1 ? '' : b}P og Q<sub>S</sub> = ${c0 < 0 ? '−' + Math.abs(c0) : c0} + ${d === 1 ? '' : d}P. Heimsmarkaðsverð er ${Pw}. Settur er innflutningskvóti upp á ${quota} einingar. Hvert verður innanlandsverðið?`,
    o: opts(Pq, [Pa, Pw, ((a - c0) + quota) / (b + d), Pw + quota / (b + d)], v => F.num(Math.round(v * 100) / 100), pertAdd(2)), a:0,
    e:`<div class="f">Q<sub>D</sub> − Q<sub>S</sub> = kvóti<br>(${a} − ${b === 1 ? '' : b}P) − (${F.int(c0)} + ${d === 1 ? '' : d}P) = ${quota}<br>${a - c0} − ${b + d}P = ${quota} ⇒ P = ${Pq}</div>Gildrur: ${Pa} er verð án viðskipta, ${Pw} heimsmarkaðsverðið. ${F.num(Math.round(((a - c0) + quota) / (b + d) * 100) / 100)} leggur kvótann við í stað þess að draga hann frá. Sama aðferð og AD9 #2c.` };
}},
// ---------- Útflutningur ----------
{id:"gen-exports", t:"vid", name:"Útflutningur og ábati framleiðenda", f(){
  const b = R.pick([1, 2]), d = R.pick([1, 2]); const Pa = R.ri(10, 30) * 2; const Qa = d * Pa + 50 + R.ri(0, 40) * 2;
  const a = Qa + b * Pa, c0 = Qa - d * Pa; const Pw = Pa + R.ri(2, 10) * 2; const QD = a - b * Pw, QS = c0 + d * Pw; const ex = QS - QD;
  const dPS = 0.5 * (Qa + QS) * (Pw - Pa);
  return { q:`Q<sub>D</sub> = ${a} − ${b === 1 ? '' : b}P og Q<sub>S</sub> = ${c0 < 0 ? '−' + Math.abs(c0) : c0} + ${d === 1 ? '' : d}P. Heimsmarkaðsverð er ${Pw} og viðskipti eru gefin frjáls. Hvað gerist?`,
    o: opts(ex, [-ex, QS, QD, ex / 2, QS - Qa], v => v < 0 ? `Landið flytur inn ${F.num(-v)}` : `Landið flytur út ${F.num(v)}`, pertAdd(2)), a:0,
    e:`<div class="f">Án viðskipta: P = ${Pa} &lt; ${Pw} ⇒ útflutningur<br>Q<sub>S</sub> = ${F.int(c0)} + ${d} × ${Pw} = ${QS}<br>Q<sub>D</sub> = ${a} − ${b} × ${Pw} = ${QD}<br>Útflutningur = ${QS} − ${QD} = ${ex}</div>Framleiðendaábati eykst um ½ × (${Qa} + ${QS}) × ${Pw - Pa} = ${F.num(dPS)} og neytendur tapa. Gildra: að halda að hátt heimsmarkaðsverð þýði innflutning.` };
}},
// ---------- Staðalfrávik ----------
{id:"gen-sd", t:"ovi", name:"Vænt gildi og staðalfrávik", f(){
  const p = R.pick([0.5, 0.2, 0.25, 0.4, 0.6, 0.75, 0.8]); const lo = R.ri(0, 10) * 5; const hi = lo + R.ri(2, 12) * 10;
  const E = p * hi + (1 - p) * lo; const v = p * (hi - E) ** 2 + (1 - p) * (lo - E) ** 2; const sd = Math.sqrt(v);
  return { q:`Hagnaður verkefnis er ${hi} kr. með líkunum ${F.pct(p, 0)} en annars ${lo} kr. Hvert er staðalfrávik hagnaðarins?`,
    o: opts(sd, [v, E, (hi - lo) / 2, (hi - lo) * p * (1 - p), Math.sqrt(0.5 * (hi - E) ** 2 + 0.5 * (lo - E) ** 2)], x => F.dec(x, 2), pertAdd(1.5)), a:0,
    e:`<div class="f">E(V) = ${F.dec(p, 2)} × ${hi} + ${F.dec(1 - p, 2)} × ${lo} = ${F.dec(E, 2)}<br>Var(V) = ${F.dec(p, 2)} × (${hi} − ${F.dec(E, 2)})² + ${F.dec(1 - p, 2)} × (${lo} − ${F.dec(E, 2)})² = ${F.dec(v, 2)}<br>σ = √${F.dec(v, 2)} = ${F.dec(sd, 2)}</div>Gildrur: ${F.dec(v, 2)} er fervikið (gleymt að taka rót); ${F.dec(E, 2)} er vænt gildi; ${F.dec((hi - lo) / 2, 2)} er hálf spönnin, sem er aðeins rétt þegar líkurnar eru 50/50.` };
}},
// ---------- Væntar nytjar ----------
{id:"gen-eu", t:"ovi", name:"Væntar nytjar með u = √V", f(){
  const sq = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12]; let x1, x2; do { x1 = R.pick(sq); x2 = R.pick(sq); } while (x1 >= x2);
  const V1 = x1 * x1, V2 = x2 * x2; const p = R.pick([0.5, 0.25, 0.75, 0.4, 0.6]);
  const EU = p * x2 + (1 - p) * x1; const E = p * V2 + (1 - p) * V1;
  return { q:`Nytjafall einstaklings er u(V) = √V. Lotterí gefur ${V2} kr. með líkunum ${F.pct(p, 0)} en annars ${V1} kr. Hverjar eru væntar nytjar?`,
    o: opts(EU, [Math.sqrt(E), E, x1 + x2, p * x2, (x1 + x2) / 2], x => F.dec(x, 2), pertAdd(0.35)), a:0,
    e:`<div class="f">E(u) = p × u(V₁) + (1 − p) × u(V₂)<br>= ${F.dec(p, 2)} × √${V2} + ${F.dec(1 - p, 2)} × √${V1}<br>= ${F.dec(p, 2)} × ${x2} + ${F.dec(1 - p, 2)} × ${x1} = ${F.dec(EU, 2)}</div>Gildrur: ${F.dec(Math.sqrt(E), 2)} = √E(V) eru nytjar af væntu gildi (alltaf hærri fyrir áhættufælinn); ${F.dec(E, 2)} er vænt gildi í krónum.` };
}},
// ---------- Vissujafngildi og áhættuálag ----------
{id:"gen-rp", t:"ovi", name:"Áhættuálag (hámarksgreiðsla fyrir tryggingu)", f(){
  const pairs = [[0, 16], [0, 36], [4, 16], [4, 36], [9, 25], [1, 49], [9, 49], [16, 64], [0, 100], [25, 81], [4, 64], [36, 100]];
  const [V1, V2] = R.pick(pairs); const p = 0.5; const E = p * V1 + p * V2; const EU = p * Math.sqrt(V1) + p * Math.sqrt(V2); const CE = EU * EU; const rp = E - CE;
  return { q:`Nytjafall Sollu er u(V) = √V. Hagnaður hennar er ${V2} kr. eða ${V1} kr. með 50% líkum hvort. Hve miklu væri hún mest tilbúin að greiða fyrir tryggingu sem tryggir henni vænta hagnaðinn, ${F.num(E)} kr.?`,
    o: opts(rp, [CE, E, EU, E - EU, 0], x => F.dec(x, 2) + ' kr.', pertAdd(0.75)), a:0,
    e:`<div class="f">E(V) = 0,5 × ${V2} + 0,5 × ${V1} = ${F.num(E)}<br>E(u) = 0,5 × ${Math.sqrt(V2)} + 0,5 × ${Math.sqrt(V1)} = ${F.dec(EU, 2)}<br>Vissujafngildi: √X = ${F.dec(EU, 2)} ⇒ X = ${F.dec(CE, 2)}<br>Áhættuálag = ${F.num(E)} − ${F.dec(CE, 2)} = ${F.dec(rp, 2)}</div>Gildrur: ${F.dec(CE, 2)} er vissujafngildið, ekki greiðslan; ${F.dec(EU, 2)} eru nytjar, ekki krónur; 0 á við áhættuhlutlausan. Sama aðferð og tryggingardæmi Sollu.` };
}},
// ---------- Sanngjarnt iðgjald ----------
{id:"gen-fair", t:"ovi", name:"Sanngjarnt iðgjald", f(){
  const p = R.pick([1, 2, 4, 5, 10, 20, 25]) / 100; const L = R.ri(2, 40) * 50000; const prem = p * L; const W = L + R.ri(1, 10) * 100000;
  return { q:`Hús að verðmæti ${F.int(W)} kr. brennur með líkunum ${F.pct(p, 0)} á ári og tjónið yrði ${F.int(L)} kr. Hvert er „sanngjarnt“ iðgjald (vænt gildi tryggingarinnar núll) fyrir fulla tryggingu?`,
    o: opts(prem, [L, (1 - p) * L, p * W, L / (1 / p) * 2], x => F.int(x) + ' kr.', pertMul), a:0,
    e:`<div class="f">Sanngjarnt iðgjald = vænt tjón = p × tjón<br>= ${F.dec(p, 2)} × ${F.int(L)} = ${F.int(prem)}</div>Áhættufælinn einstaklingur tryggir sig að fullu á þessu verði. Tryggingafélög rukka þó alltaf meira til að mæta kostnaði. Gildrur: ${F.int(p * W)} margfaldar verðmæti hússins í stað tjónsins; ${F.int((1 - p) * L)} notar líkurnar á að ekkert gerist.` };
}},
// ---------- MC = AC (upprifjun) ----------
{id:"gen-mcac", t:"gru", name:"Hvar MC sker AC", f(){
  const a = R.pick([1, 2, 3]); const q = R.ri(2, 9); const b = 2 * a * q; const c = b * q + R.ri(1, 10) * 10;
  const mcMin = b / (3 * a);
  return { q:`Kostnaðarfallið er C = ${a === 1 ? '' : a}q³ − ${b}q² + ${c}q. Við hvaða magn skerast MC og AC?`,
    o: opts(q, [mcMin, b / a, 2 * q, b / (2 * a * 2)], x => 'q = ' + F.dec(x, 2).replace(/,00$/, ''), pertAdd(1)), a:0,
    e:`<div class="f">MC = ${3 * a}q² − ${2 * b}q + ${c}<br>AC = C/q = ${a === 1 ? '' : a}q² − ${b}q + ${c}<br>MC = AC ⇒ ${2 * a}q² − ${b}q = 0 ⇒ q = ${b}/${2 * a} = ${q}</div>MC sker AC í lágmarki AC. Gildra: ${F.dec(mcMin, 2)} er lágmark MC (dMC/dq = 0). Sama aðferð og DB7 #1.` };
}},
// ---------- Fjöldi fyrirtækja í langtímajafnvægi (upprifjun) ----------
{id:"gen-lrn", t:"gru", name:"Fjöldi fyrirtækja í langtímajafnvægi", f(){
  const a = R.pick([1, 2, 4]); const q = R.ri(2, 10); const FC = a * q * q; const b = R.ri(1, 10); const P = 2 * a * q + b;
  const B = R.pick([1, 2]); const n = R.ri(20, 150); const Q = n * q; const A = P + B * Q;
  return { q:`Fullkomin samkeppni: hvert fyrirtæki hefur TC = ${a === 1 ? '' : a}q² + ${b === 1 ? '' : b}q + ${FC}. Markaðseftirspurn er P = ${A} − ${B === 1 ? '' : B}Q. Hve mörg fyrirtæki eru á markaðnum í langtímajafnvægi?`,
    o: opts(n, [Q, (A - P) / (2 * B) / q === n ? null : Math.round((A - P) / (2 * B * q)), Math.round((A - b) / B / q), Math.round(n / 2)], x => F.int(x), pertAdd(5)), a:0,
    e:`<div class="f">ATC = ${a === 1 ? '' : a}q + ${b} + ${FC}/q<br>Lágmark: ${a} = ${FC}/q² ⇒ q = ${q}<br>P = ATC(${q}) = ${a * q} + ${b} + ${FC / q} = ${P}<br>${P} = ${A} − ${B === 1 ? '' : B}Q ⇒ Q = ${Q}<br>n = ${Q} / ${q} = ${n}</div>Gildra: ${Q} er heildarmagnið, ekki fjöldi fyrirtækja. Sama aðferð og DB7 #3.` };
}},
];

// ---- millilag: gamla úttakið {q, o, a, e} → GenItem ----
export default GENS.map(g => ({ id: g.id, name: g.name, topic: g.t, f: () => ({ type: 'mc', ...g.f() }) }));
