// Búið til af scripts/extract-legacy.js úr legacy/HAG103G prófæfing.html. Ekki breyta í höndunum.
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

const MONTHS = ['jan','feb','mar','apr','maí','jún','júl','ágú','sep','okt','nóv','des'];

const GENS = [
// ---------- VLF: liður sem vantar ----------
{id:"gen-vlf", t:"rei", name:"Liður sem vantar í VLF", f(){
  const C = R.ri(8,30)*10, I = R.ri(2,8)*10, G = R.ri(3,9)*10, X = R.ri(3,12)*10; let M = R.ri(3,12)*10; if (M === X) M += 10;
  const Y = C + I + G + X - M; const vals = {C, I, G}; const names = {C:'einkaneysla', I:'fjárfesting', G:'útgjöld hins opinbera'}; const verb = {C:'er', I:'er', G:'eru'};
  const ask = R.pick(['C','I','G']); const others = Object.keys(vals).filter(k => k !== ask);
  const sumO = others.reduce((s,k)=>s+vals[k],0); const corr = vals[ask];
  const txt = others.map(k => `${names[k]} ${verb[k]} ${F.int(vals[k])} m.kr.`).join(', ');
  return { q:`Verg landsframleiðsla er ${F.int(Y)} m.kr., ${txt}, útflutningur er ${F.int(X)} m.kr. og innflutningur er ${F.int(M)} m.kr. ${ask==='G'?'Hver eru':'Hver er'} ${names[ask]} (${ask})?`,
    o: opts(corr, [Y - sumO, Y - sumO + (X - M), Y - sumO - X - M, Y - sumO - X].filter(v => v > 0), v => F.int(v) + ' m.kr.', pertAdd(10)), a:0,
    e:`<div class="f">Y = C + I + G + (X − M)<br>${ask} = ${F.int(Y)} − ${others.map(k=>F.int(vals[k])).join(' − ')} − (${F.int(X)} − ${F.int(M)}) = ${F.int(corr)}</div>Algengasta villan er að gleyma NX (gefur ${F.int(Y - sumO)}).` };
}},
// ---------- Atvinnuleysishlutfall ----------
{id:"gen-u", t:"vin", name:"Atvinnuleysishlutfall", f(){
  const pop = R.ri(250, 400) * 1000, out = R.ri(45, 110) * 1000, U = R.ri(6, 25) * 1000; const LF = pop - out;
  return { q:`Mannfjöldi (16–74 ára) er ${F.int(pop)} og þar af eru ${F.int(out)} ekki á vinnumarkaði. Atvinnulausir eru ${F.int(U)}. Hvert er atvinnuleysishlutfallið?`,
    o: opts(U/LF, [U/pop, U/(LF-U), U/out, LF/pop], v => F.pct(v), (c,k)=>c+(k%2?1:-1)*Math.ceil(k/2)*0.004), a:0,
    e:`<div class="f">Vinnuafl = ${F.int(pop)} − ${F.int(out)} = ${F.int(LF)}<br>u = ${F.int(U)} / ${F.int(LF)} = ${F.pct(U/LF)}</div>Gildran er að deila í allan mannfjöldann (${F.pct(U/pop)}).` };
}},
// ---------- Atvinnuþátttaka ----------
{id:"gen-part", t:"vin", name:"Atvinnuþátttaka", f(){
  const pop = R.ri(250, 400) * 1000, out = R.ri(45, 110) * 1000, U = R.ri(6, 25) * 1000; const LF = pop - out;
  return { q:`Mannfjöldi á vinnualdri er ${F.int(pop)}. Þar af eru ${F.int(out)} utan vinnumarkaðar og ${F.int(U)} atvinnulausir. Hver er atvinnuþátttakan?`,
    o: opts(LF/pop, [(LF-U)/pop, U/LF, out/pop, (LF-U)/LF], v => F.pct(v), (c,k)=>c+(k%2?1:-1)*Math.ceil(k/2)*0.01), a:0,
    e:`<div class="f">Atvinnuþátttaka = Vinnuafl / Mannfjöldi = ${F.int(LF)} / ${F.int(pop)} = ${F.pct(LF/pop)}</div>Vinnuafl = starfandi + atvinnulausir, svo atvinnulausir teljast með. ${F.pct((LF-U)/pop)} er hlutfall starfandi.` };
}},
// ---------- Ársverðbólga úr VNV-töflu ----------
{id:"gen-vnv", t:"rei", name:"Ársverðbólga úr VNV-töflu", f(){
  const y0 = R.pick([2024, 2025]); const sm = R.ri(0, 11); const n = 15; let v = R.ri(5800, 6600) / 10; const rows = [];
  const drift = R.ri(2, 7) / 1000;
  for (let i = 0; i < n; i++) { rows.push(v); v = v * (1 + drift + (Math.random() - 0.45) * 0.01); v = Math.round(v * 10) / 10; }
  const lab = i => { const m = sm + i; return `${y0 + Math.floor(m/12)}M${String((m%12)+1).padStart(2,'0')}`; };
  const t = R.ri(12, 14); const corr = rows[t]/rows[t-12] - 1;
  const mname = i => { const m = sm + i; return `${MONTHS[m%12]}. ${y0 + Math.floor(m/12)}`; };
  const tbl = '<table class="dt"><tr><th>Mánuður</th><th>VNV</th></tr>' + rows.map((r,i)=>`<tr><td>${lab(i)}</td><td>${F.dec(r,1)}</td></tr>`).join('') + '</table>';
  return { q:`Taflan sýnir vísitölu neysluverðs. Hver var verðbólgan í ${mname(t)} mæld á ársgrundvelli?${tbl}`,
    o: opts(corr, [rows[t]/rows[t-1]-1, rows[t]/rows[t-11]-1, t>=13? rows[t]/rows[t-13]-1 : rows[t-1]/rows[0]-1, (rows[t]-rows[t-12])/rows[t], (rows[t]/rows[t-1]-1)*12], v=>F.pct(v), (c,k)=>c+(k%2?1:-1)*Math.ceil(k/2)*0.004), a:0,
    e:`<div class="f">π = VNV(${lab(t)}) / VNV(${lab(t-12)}) − 1 = ${F.dec(rows[t],1)} / ${F.dec(rows[t-12],1)} − 1 = ${F.pct(corr)}</div>Berðu saman sama mánuð með 12 mánaða millibili. Mánaðarbreytingin var ${F.pct(rows[t]/rows[t-1]-1)}.` };
}},
// ---------- Mánaðarverðbólga ↔ ársverðbólga ----------
{id:"gen-man", t:"rei", name:"Mánaðar- og ársverðbólga", f(){
  if (Math.random() < 0.6) {
    const p = R.pick([0.12, 0.2, 0.3, 0.4, 0.5, 0.6, 0.8, 1.0, 1.5]); const c = Math.pow(1+p, 1/12) - 1;
    return { q:`Ef verðbólga er ${F.pct(p,0)} á ári, hver er þá meðalverðbólgan á mánuði?`,
      o: opts(c, [p/12, p/10, c*1.25, c*0.75], v=>F.pct(v,1), (c,k)=>c+(k%2?1:-1)*Math.ceil(k/2)*0.002), a:0,
      e:`<div class="f">(1 + π)^(1/12) − 1 = ${F.dec(1+p,2)}^(1/12) − 1 = ${F.pct(c,2)}</div>π/12 = ${F.pct(p/12,2)} gleymir að mánaðarhækkanirnar leggjast hver ofan á aðra.` };
  } else {
    const m = R.pick([0.005, 0.01, 0.015, 0.02, 0.03, 0.04, 0.05]); const c = Math.pow(1+m, 12) - 1;
    return { q:`Verðlag hækkar um ${F.pct(m,1)} á mánuði. Hver er verðbólgan á ársgrundvelli?`,
      o: opts(c, [m*12, m*12*0.9, c*1.2, Math.pow(1+m,10)-1], v=>F.pct(v,1), (c,k)=>c+(k%2?1:-1)*Math.ceil(k/2)*0.005), a:0,
      e:`<div class="f">(1 + m)¹² − 1 = ${F.dec(1+m,3)}¹² − 1 = ${F.pct(c,1)}</div>12·m = ${F.pct(m*12,1)} vanmetur því hækkanirnar safnast upp.` };
  }
}},
// ---------- Nákvæmir raunvextir ----------
{id:"gen-fisher", t:"rei", name:"Raunvextir (Fisher)", f(){
  const pairs = [[0.25,0.4],[0.5,2],[0.75,0.25],[0.4,1],[0.1,0.05],[0.08,0.12],[0.3,0.6],[0.6,0.2],[0.2,0.5],[0.15,0.35],[0.9,0.5],[0.05,0.1]];
  const [i, p] = R.pick(pairs); const c = (1+i)/(1+p) - 1;
  return { q:`Nafnvextir eru ${F.pct(i,0)} á ári og verðbólga ${F.pct(p,0)} á ári. Hverjir eru raunvextirnir, reiknaðir nákvæmlega (án einföldunar)?`,
    o: opts(c, [i-p, (1+p)/(1+i)-1, p-i, (i-p)/(1+i)], v=>F.pct(v,1), (c,k)=>c+(k%2?1:-1)*Math.ceil(k/2)*0.02), a:0,
    e:`<div class="f">r = (1 + i)/(1 + π) − 1 = ${F.dec(1+i,2)} / ${F.dec(1+p,2)} − 1 = ${F.pct(c,1)}</div>Nálgunin i − π = ${F.pct(i-p,1)} er aðeins góð þegar verðbólga er lítil.` };
}},
// ---------- Núvirði einnar greiðslu ----------
{id:"gen-pv", t:"rei", name:"Núvirði", f(){
  const X = R.pick([1,2,5,8,10,12,15,20,25,50]) * 1e6, r = R.pick([0.03,0.04,0.05,0.06,0.07,0.08,0.1]), N = R.ri(2, 10);
  const c = X / Math.pow(1+r, N);
  return { q:`Fyrirtæki fær greiddar ${F.int(X)} kr. eftir ${N} ár. Markaðsvextir eru ${F.pct(r,0)}. Hvert er núvirði upphæðarinnar? Núvirði má finna með PV = X/(1 + r)^N.`,
    o: opts(c, [X*Math.pow(1+r,N), X/(1+r*N), X/Math.pow(1+r,N-1), X*Math.pow(1-r,N)], v=>F.int(v), pertMul), a:0,
    e:`<div class="f">PV = ${F.int(X)} / ${F.dec(1+r,2)}^${N} = ${F.int(X)} / ${F.dec(Math.pow(1+r,N),6)} = ${F.int(c)}</div>${F.int(X*Math.pow(1+r,N))} er framtíðarvirði (margfaldað í stað þess að deila).` };
}},
// ---------- Núvirði greiðsluraðar ----------
{id:"gen-pvs", t:"rei", name:"Núvirði greiðsluraðar", f(){
  const P = R.pick([0.5,1,1.25,1.5,2,2.5]) * 1e6, n = R.ri(3, 6), r = R.pick([0.04,0.05,0.06,0.07,0.08,0.1]);
  let s0 = 0, s1 = 0; const rowsH = [];
  for (let k = 0; k < n; k++) { s0 += P/Math.pow(1+r,k); s1 += P/Math.pow(1+r,k+1); rowsH.push(`<tr><td>${k}</td><td>${F.int(P)}</td><td>${F.dec(1/Math.pow(1+r,k),6)}</td><td>${F.int(P/Math.pow(1+r,k))}</td></tr>`); }
  const L = Math.round((s0 + (Math.random()<0.5?-1:1) * R.ri(2,8) * 0.01 * s0) / 1e5) * 1e5;
  const choose = s0 > L ? 'B' : 'A';
  return { q:`Þú getur fengið ${F.int(L)} kr. í dag (A) eða ${F.int(P)} kr. á ári ${n} sinnum, fyrsta greiðsla í dag (B). Ávöxtun í banka er ${F.pct(r,0)}. PV = X/(1 + r)^N. Hvert er núvirði B og hvorn kostinn á að velja?`,
    o: opts(s0, [s1, n*P, n*P/(1+r), n*P/Math.pow(1+r,n)], v=>`Núvirði B er ${F.int(v)}; velja ${v > L ? 'B' : 'A'}`, pertMul), a:0,
    e:`Greiðslur á árum 0 til ${n-1}; greiðslan í dag er ekki afvöxtuð.<table class="dt"><tr><th>Ár</th><th>Greiðsla</th><th>1/(1+r)^N</th><th>Núvirði</th></tr>${rowsH.join('')}<tr><td><b>Σ</b></td><td></td><td></td><td><b>${F.int(s0)}</b></td></tr></table>${F.int(s0)} ${s0>L?'&gt;':'&lt;'} ${F.int(L)} ⇒ velja ${choose}. Ef allar greiðslur eru afvaxtaðar um eitt ár of mikið fæst ${F.int(s1)}.` };
}},
// ---------- Solow: fjármagn á mann í jafnvægi ----------
{id:"gen-solowk", t:"vox", name:"Solow: k* í jafnvægi", f(){
  let s, d, A, b; do { s = R.pick([0.2,0.25,0.3,0.4,0.5]); d = R.pick([0.04,0.05,0.1,0.2]); A = R.ri(2,6); b = s*A/d; } while (Math.abs(b - Math.round(b)) > 1e-9 || b > 80 || b < 4);
  b = Math.round(b); const k = b*b; const askY = Math.random() < 0.35;
  const intro = `Framleiðslufall hagkerfis er Y = A·L^0,5·K^0,5 með A = ${A}. Fjármagn afskrifast um ${F.pct(d,0)} á ári og sparnaðarhlutfallið er ${F.pct(s,0)}. Í langtímajafnvægi gildir s·Y = δ·K.`;
  if (!askY) return { q:`${intro} Hvert er fjármagn á mann í jafnvægi (K/L)?`,
    o: opts(k, [b, Math.pow(s/d,2), A*k, Math.pow(A/d,2)*s, Math.pow(s*A/d,2)/A], v=>F.num(Math.round(v*100)/100), pertMul), a:0,
    e:`<div class="f">s·A·L^0,5·K^0,5 = δ·K ⇒ s·A / δ = (K/L)^0,5<br>K/L = (s·A/δ)² = (${F.dec(s,2)}·${A} / ${F.dec(d,2)})² = ${b}² = ${F.int(k)}</div>Gildran er að gleyma að setja í annað veldi (gefur ${b}).` };
  const y = A*b; return { q:`${intro} Hver er framleiðsla á mann (Y/L) í jafnvægi?`,
    o: opts(y, [k, b, A*k, Math.sqrt(b)*A, s*y], v=>F.num(Math.round(v*100)/100), pertMul), a:0,
    e:`<div class="f">K/L = (s·A/δ)² = ${b}² = ${F.int(k)}<br>Y/L = A·(K/L)^0,5 = ${A}·${b} = ${F.int(y)}</div>` };
}},
// ---------- Solow: framleiðsla á mann ----------
{id:"gen-solowy", t:"vox", name:"Framleiðsla á mann (Cobb-Douglas)", f(){
  const q = R.ri(2,9), L = R.pick([2,4,5,10,20]), A = R.ri(2,8); const K = q*q*L; const c = A*q;
  return { q:`Framleiðslufall hagkerfis er Y = A·L^0,5·K^0,5. Hver er framleiðsla á mann (Y/L) ef A = ${A}, K = ${F.int(K)} og L = ${L}?`,
    o: opts(c, [A*K/L, Math.sqrt(A*K/L), A*Math.sqrt(K), q, A*Math.sqrt(K*L)], v=>F.num(Math.round(v*100)/100), pertAdd(A)), a:0,
    e:`<div class="f">Y/L = A·(K/L)^0,5 = ${A}·(${F.int(K)}/${L})^0,5 = ${A}·√${q*q} = ${A}·${q} = ${c}</div>` };
}},
// ---------- Gini ----------
{id:"gen-gini", t:"ojo", name:"Gini-stuðull", f(){
  const names = R.shuffle(['Anna','Baldur','Dóra','Eggert','Hildur','Viktor','Sigga','Bjarni','Eva','Jón']);
  const n = R.ri(3,5); let inc; do { inc = Array.from({length:n}, () => R.pick([2,3,4,5,6,8,10,12,15,20,25,30,40,50,60,80]) * 1000); } while (new Set(inc).size < n);
  const g = arr => { const N = arr.length, S = arr.reduce((a,b)=>a+b,0); let w = 0; arr.forEach((x,i)=> w += (N - i) * x); return (N+1)/N - 2*w/(N*S); };
  const sorted = inc.slice().sort((a,b)=>a-b); const c = g(sorted); const desc = sorted.slice().reverse();
  let w = 0; sorted.forEach((x,i)=> w += (n - i)*x); const S = sorted.reduce((a,b)=>a+b,0);
  const tbl = '<table class="dt"><tr><th>Nafn</th><th>Tekjur</th></tr>' + inc.map((x,i)=>`<tr><td>${names[i]}</td><td>${F.int(x)}</td></tr>`).join('') + '</table>';
  return { q:`Taflan lýsir tekjum einstaklinga í hagkerfi.${tbl}Nálga má Gini-stuðulinn með<div class="f">G = (n + 1)/n − 2·Σ(n + 1 − i)·xᵢ / (n·Σxᵢ)</div>þar sem i = 1 eru lægstu tekjurnar. Hver er Gini-stuðullinn?`,
    o: opts(c, [g(inc), 1 - c, c + 0.1, c - 0.1].filter(v => v > 0 && v < 1), v=>F.dec(v,2), (c,k)=>c+(k%2?1:-1)*Math.ceil(k/2)*0.05), a:0,
    e:`Raðað frá lægstu: ${sorted.map(F.int).join(', ')} (Σ = ${F.int(S)}).<div class="f">Σ(n+1−i)xᵢ = ${sorted.map((x,i)=>`${n-i}·${F.int(x)}`).join(' + ')} = ${F.int(w)}<br>G = ${n+1}/${n} − 2·${F.int(w)} / (${n}·${F.int(S)}) = ${F.dec((n+1)/n,3)} − ${F.dec(2*w/(n*S),3)} = ${F.dec(c,2)}</div>Án röðunar fæst ${F.dec(g(inc),2)}.` };
}},
// ---------- Hve marga starfsmenn á að ráða ----------
{id:"gen-vmpl", t:"vin", name:"Ráðning eftir VMPL", f(){
  let mpl = [], m = R.ri(90, 140); for (let i = 0; i < 6; i++) { mpl.push(m); m -= R.ri(5, 30); if (m < 5) m = 5; }
  const P = R.pick([2,4,5,10]); const Q = []; let q = 0; for (const x of mpl) { q += x; Q.push(q); }
  const ans = R.ri(2,5); const lo = P*mpl[ans], hi = P*mpl[ans-1]; let W = Math.round((lo + hi)/2 / 5) * 5; if (W <= lo) W = lo + 5; if (W > hi) W = hi;
  let hire = 0; for (let i = 0; i < 6; i++) if (P*mpl[i] >= W) hire = i+1; else break;
  const tbl = '<table class="dt"><tr><th>L</th><th>Q</th></tr><tr><td>0</td><td>0</td></tr>' + Q.map((x,i)=>`<tr><td>${i+1}</td><td>${F.int(x)}</td></tr>`).join('') + '</table>';
  const rows = mpl.map((x,i)=>`<tr><td>${i+1}</td><td>${x}</td><td>${F.int(P*x)}</td><td>${P*x>=W?'já':'nei'}</td></tr>`).join('');
  return { q:`Framleiðslufall fyrirtækis þar sem vinnuafl (L) er eini framleiðsluþátturinn:${tbl}Fyrirtækið selur á verðinu P = ${P} og greiðir hverjum starfsmanni W = ${F.int(W)}. Hagnaðarhámarkandi fyrirtæki ræður meðan P × MPL ≥ W. Hve marga starfsmenn ræður það?`,
    o: [String(hire), ...[1,2,3,4,5,6].filter(x=>x!==hire).sort((a,b)=>Math.abs(a-hire)-Math.abs(b-hire)).slice(0,4).map(String)], a:0,
    e:`<table class="dt"><tr><th>L</th><th>MPL = ΔQ</th><th>VMPL = ${P}·MPL</th><th>≥ ${F.int(W)}?</th></tr>${rows}</table>Ráða ${hire}. Næsti starfsmaður skilar minna en hann kostar.` };
}},
// ---------- Hlutfallslegir yfirburðir ----------
{id:"gen-comp", t:"vid", name:"Hlutfallslegir yfirburðir", f(){
  const pairs = R.pick([['Ísland','Noregur'],['Argentína','Indland'],['Brasilía','Kenía'],['Þýskaland','Ítalía'],['Ísland','Portúgal'],['Chile','Perú']]);
  const goods = R.pick([[['fiskur','fiski'],['ull','ull']],[['baunir','baunum'],['hrísgrjón','hrísgrjónum']],[['kaffi','kaffi'],['te','tei']],[['bjór','bjór'],['pizzur','pizzum']],[['saltfiskur','saltfiski'],['vín','víni']],[['kopar','kopar'],['kartöflur','kartöflum']]]);
  const hours = Math.random() < 0.4; let a1, a2, b1, b2;
  do { a1 = R.ri(1,9)*(hours?1:100); a2 = R.ri(1,9)*(hours?1:100); b1 = R.ri(1,9)*(hours?1:100); b2 = R.ri(1,9)*(hours?1:100); } while (Math.abs(a1/a2 - b1/b2) < 0.15);
  // fórnarkostnaður vöru 1 í einingum vöru 2
  const ocA = hours ? a1/a2 : a2/a1, ocB = hours ? b1/b2 : b2/b1;
  const [A, B] = pairs, [[g1n, g1], [g2n, g2]] = goods;
  const S = (x, y) => `${x} ætti að sérhæfa sig í ${y}`;
  const corr = ocA < ocB ? `${S(A, g1)} og ${B} í ${g2}` : `${S(B, g1)} og ${A} í ${g2}`;
  const wrong = ocA < ocB ? `${S(B, g1)} og ${A} í ${g2}` : `${S(A, g1)} og ${B} í ${g2}`;
  const unit = hours ? 'Vinnustundir á hverja einingu' : 'Magn sem framleiða má á einum mánuði';
  const tbl = `<table class="dt"><tr><th>Land</th><th>${g1n}</th><th>${g2n}</th></tr><tr><td>${A}</td><td>${F.int(a1)}</td><td>${F.int(a2)}</td></tr><tr><td>${B}</td><td>${F.int(b1)}</td><td>${F.int(b2)}</td></tr></table>`;
  return { q:`${unit}:${tbl}Hvort land ætti að sérhæfa sig í hvorri vöru?`,
    o:[corr, wrong, `${A} ætti að sérhæfa sig í báðum vörum`, `${B} ætti að sérhæfa sig í báðum vörum`, 'Óljóst út frá forsendum'], a:0,
    e:`Fórnarkostnaður einnar einingar af ${g1}, mældur í ${g2}:<div class="f">${hours ? `${A}: ${a1}/${a2} = ${F.dec(ocA,2)}<br>${B}: ${b1}/${b2} = ${F.dec(ocB,2)}` : `${A}: ${F.int(a2)}/${F.int(a1)} = ${F.dec(ocA,2)}<br>${B}: ${F.int(b2)}/${F.int(b1)} = ${F.dec(ocB,2)}`}</div>Lægri fórnarkostnaður ⇒ hlutfallslegir yfirburðir. ${hours ? 'Athugaðu að með <b>vinnustundum á einingu</b> deilir þú klst. vörunnar með klst. hinnar vörunnar; með <b>framleiðslu á tímabili</b> snýst það við.' : 'Með <b>framleiðslu á tímabili</b> er fórnarkostnaður vöru 1 = magn vöru 2 / magn vöru 1.'}` };
}},
// ---------- NX = S − I ----------
{id:"gen-nx", t:"opi", name:"NX = S − I", f(){
  const Y = R.ri(40, 60)*100, C = R.ri(22, 30)*100 + R.ri(0,9)*10, G = R.ri(10, 14)*100, I = R.ri(9, 15)*100 + R.ri(0,9)*10;
  const S = Y - C - G, NX = S - I; const dir = v => v > 0 ? 'fjármagn streymir út' : v < 0 ? 'fjármagn streymir inn' : 'ekkert hreint fjármagnsflæði';
  return { q:`Í opnu hagkerfi er Y = ${F.int(Y)}, C = ${F.int(C)}, G = ${F.int(G)} og I = ${F.int(I)} (ma.kr.). Hver er hreinn útflutningur og hvert streymir fjármagn?`,
    o: opts(NX, [-NX, Y - C - I, S, I - S + G], v => `NX = ${F.int(v)}; ${dir(v)}`, pertAdd(50)), a:0,
    e:`<div class="f">S = Y − C − G = ${F.int(Y)} − ${F.int(C)} − ${F.int(G)} = ${F.int(S)}<br>NX = S − I = ${F.int(S)} − ${F.int(I)} = ${F.int(NX)} = NCO</div>${NX<0?'NCO &lt; 0 þýðir hreint innstreymi fjármagns: landið selur eignir eða tekur lán til að greiða viðskiptahallann.':'NCO &gt; 0 þýðir að landið eignast erlendar eignir.'}` };
}},
// ---------- Einkasparnaður, opinber sparnaður ----------
{id:"gen-sav", t:"spa", name:"Einka- og opinber sparnaður", f(){
  const Y = R.ri(20, 60)*100, T = R.ri(5, 15)*100, C = Math.round(Y*R.ri(45,60)/100/10)*10; let G = T + R.ri(-3, 3)*50; if (G<=0) G = T;
  const priv = Y - T - C, pub = T - G, S = priv + pub; const ask = R.pick(['S','priv','pub']);
  const lbl = {S:'þjóðhagslegur sparnaður', priv:'einkasparnaður', pub:'opinber sparnaður'}[ask]; const c = {S, priv, pub}[ask];
  return { q:`Í lokuðu hagkerfi er Y = ${F.int(Y)}, T = ${F.int(T)}, C = ${F.int(C)} og G = ${F.int(G)} (ma.kr.). Hver er ${lbl}?`,
    o: opts(c, [Y - C, priv, pub, Y - C - T - G, S + T, G - T, Y - T], v => F.int(v) + ' ma.kr.', pertAdd(50)), a:0,
    e:`<div class="f">Einkasparnaður = Y − T − C = ${F.int(priv)}<br>Opinber sparnaður = T − G = ${F.int(pub)}<br>S = Y − C − G = ${F.int(S)} = I</div>${pub<0?'Ríkið er rekið með halla: neikvæður opinber sparnaður.':''}` };
}},
// ---------- Peningamagnsjafnan ----------
{id:"gen-qtm", t:"pen", name:"Peningamagnsjafnan MV = PY", f(){
  const v = R.ri(0, 2);
  if (v === 0) { const M = R.ri(2, 8)*100, V = R.ri(2,6), Y = R.ri(10, 40)*100; const P = M*V/Y;
    return { q:`Peningamagn er M = ${F.int(M)} ma.kr., veltuhraði V = ${V} og raunvirði VLF Y = ${F.int(Y)} ma.kr. Hvert er verðlagið P samkvæmt MV = PY?`,
      o: opts(P, [Y/(M*V), M*V*Y/1000, M/Y, V*Y/M, M*V], v=>F.dec(v,2), (c,k)=>c+(k%2?1:-1)*Math.ceil(k/2)*0.1), a:0,
      e:`<div class="f">P = MV / Y = ${F.int(M)}·${V} / ${F.int(Y)} = ${F.dec(P,2)}</div>` }; }
  if (v === 1) { const M = R.ri(2, 8)*100, P = R.pick([1,1.2,1.5,2]), Y = R.ri(10, 40)*100; const V = P*Y/M;
    return { q:`Peningamagn er ${F.int(M)} ma.kr., verðlag P = ${F.dec(P,2)} og raunvirði VLF ${F.int(Y)} ma.kr. Hver er veltuhraði peninga?`,
      o: opts(V, [M/(P*Y), Y/M, P*M/Y, P*Y], v=>F.dec(v,2), (c,k)=>c+(k%2?1:-1)*Math.ceil(k/2)*0.5), a:0,
      e:`<div class="f">V = PY / M = ${F.dec(P,2)}·${F.int(Y)} / ${F.int(M)} = ${F.dec(V,2)}</div>Veltuhraði = nafnvirði VLF / peningamagn.` }; }
  const m = R.pick([0.04,0.06,0.08,0.1,0.12,0.15,0.2]), g = R.pick([0.01,0.02,0.03,0.04,0.05]); const pi = (1+m)/(1+g) - 1;
  return { q:`Veltuhraði peninga er fastur. Peningamagn vex um ${F.pct(m,0)} á ári og raunvirði VLF um ${F.pct(g,0)}. Hver er verðbólgan, reiknuð nákvæmlega?`,
    o: opts(pi, [m+g, m, (1+g)/(1+m)-1, g-m, m*g], v=>F.pct(v,2), (c,k)=>c+(k%2?1:-1)*Math.ceil(k/2)*0.003), a:0,
    e:`<div class="f">(1 + %ΔM)(1 + %ΔV) = (1 + π)(1 + %ΔY)<br>1 + π = ${F.dec(1+m,2)} / ${F.dec(1+g,2)} ⇒ π = ${F.pct(pi,2)}</div>Nálgunin π ≈ %ΔM − %ΔY = ${F.pct(m-g,1)}. (Skilaverkefni 3, dæmi 4.)` };
}},
// ---------- Raungengi ----------
{id:"gen-E", t:"opi", name:"Raungengi E = eP/P*", f(){
  const kr = R.pick([125,130,140,145,150,160]); const P = R.pick([1800,2400,2800,3200,3500,4200,5600]); const Ps = R.pick([8,10,12,14,16,20]);
  const E = (1/kr)*P/Ps; const good = R.pick(['Pizza','Hamborgari','Bíómiði','Kaffibolli','Klipping']);
  return { q:`${good} kostar ${F.int(P)} kr. á Íslandi og ${Ps}€ á evrusvæðinu. Ein evra kostar ${kr} kr. Hvert er raungengið E = e·P/P*, þar sem e er fjöldi evra í hverri krónu?`,
    o: opts(E, [1/E, P/(Ps*100), E + 0.5, E - 0.35].filter(v => v > 0.05), v=>F.dec(v,2), (c,k)=>c+(k%2?1:-1)*Math.ceil(k/2)*0.15), a:0,
    e:`<div class="f">e = 1/${kr} = ${F.dec(1/kr,4)} €/kr.<br>E = ${F.dec(1/kr,4)} · ${F.int(P)} / ${Ps} = ${F.dec(E,2)}</div>Ein íslensk eining kostar jafn mikið og ${F.dec(E,2)} erlendar. E &gt; 1 þýðir að íslenska varan er dýrari.` };
}},
// ---------- KJK ----------
{id:"gen-ppp", t:"opi", name:"Kaupmáttarjafnvirði", f(){
  const P = R.pick([450,500,600,650,700,750,800,900]), Ps = R.pick([2.5,3,3.5,4,5]); const kr = R.pick([125,135,140,150,160,190,210]);
  const ppp = P/Ps; const strong = kr < ppp; const dev = ppp/kr - 1;
  const fv = v => F.dec(v, Math.abs(v - Math.round(v)) < 0.05 ? 0 : 1);
  const S1 = strong ? 'of sterk' : 'of veik', S2 = strong ? 'of veik' : 'of sterk';
  const lab = (v, s) => `${fv(v)} kr. á evru; krónan er ${s}`;
  return { q:`Kaffibolli kostar ${P} kr. í Reykjavík og ${F.dec(Ps,Ps%1?1:0)}€ í Kaupmannahöfn. Ein evra kostar ${kr} kr. Samkvæmt KJK, hvert ætti verð evru að vera og er krónan of sterk eða of veik?`,
    o:[lab(ppp, S1), lab(ppp, S2), lab(P*Ps/10, S1), lab(kr, 'rétt metin'), lab(Ps*kr/10, S2)], a:0,
    e:`<div class="f">KJK: 1/e = P/P* = ${P} / ${F.dec(Ps,1)} = ${F.dec(ppp,1)} kr. á evru</div>Evran kostar ${kr} kr. sem er ${strong?'minna':'meira'} en ${F.dec(ppp,1)}, svo krónan kaupir ${strong?'meira':'minna'} en kenningin segir: hún er of ${strong?'sterk':'veik'} (um ${F.pct(Math.abs(dev),0)}). Dæmið í MT25: 600 kr. vs 3€ við 140 kr. ⇒ krónan 43% of sterk.` };
}},
// ---------- Reglan um 70 ----------
{id:"gen-70", t:"vox", name:"Reglan um 70", f(){
  if (Math.random() < 0.6) { const g = R.pick([1,1.4,2,2.5,3.5,5,7,10]); const c = 70/g;
    return { q:`VLF á mann vex um ${F.dec(g, g%1?1:0)}% á ári. Um það bil hve mörg ár tekur að tvöfalda hana samkvæmt reglunni um 70?`,
      o: opts(c, [100/g, 70*g/10, 50/g, 140/g], v=>F.dec(v, 0)+' ár', pertAdd(3)), a:0,
      e:`<div class="f">Ár ≈ 70 / ${F.dec(g, g%1?1:0)} = ${F.dec(c,0)}</div>` }; }
  const yrs = R.pick([10,14,20,25,35,50,70]); const g = 70/yrs;
  return { q:`VLF á mann tvöfaldaðist á ${yrs} árum. Hver var meðalhagvöxtur á ári samkvæmt reglunni um 70?`,
    o: opts(g/100, [100/yrs/100, 2/yrs, 1/yrs, yrs/70/100*10], v=>F.pct(v,1), (c,k)=>c+(k%2?1:-1)*Math.ceil(k/2)*0.003), a:0,
    e:`<div class="f">g ≈ 70 / ${yrs} = ${F.dec(g,1)}%</div>` };
}},
// ---------- Meðalvöxtur (CAGR) ----------
{id:"gen-cagr", t:"vox", name:"Meðalvöxtur á ári", f(){
  const N = R.ri(3,10), end = R.ri(115, 190); const c = Math.pow(end/100, 1/N) - 1;
  return { q:`VLF fer úr 100 í ${end} á ${N} árum. Hver er meðalvöxtur á ári?`,
    o: opts(c, [(end-100)/100/N, (end-100)/100, Math.pow(end/100,1/(N+1))-1, Math.pow(end/100,1/(N-1))-1], v=>F.pct(v,2), (c,k)=>c+(k%2?1:-1)*Math.ceil(k/2)*0.002), a:0,
    e:`<div class="f">g = (${end}/100)^(1/${N}) − 1 = ${F.pct(c,2)}</div>Einfalt meðaltal (${F.pct((end-100)/100/N,2)}) ofmetur því vöxturinn leggst ofan á sig.` };
}},
// ---------- Framlag undirliðar ----------
{id:"gen-contrib", t:"rei", name:"Framlag undirliðar til hagvaxtar", f(){
  const s = R.pick([0.2,0.25,0.3,0.4,0.5,0.6]), g = R.pick([0.02,0.04,0.05,0.08,0.1,-0.05,-0.1]); const lab = R.pick(['einkaneyslu (C)','fjárfestingar (I)','útflutnings (X)']);
  const c = s*g;
  return { q:`Hlutur ${lab} í VLF var ${F.pct(s,0)} í fyrra og liðurinn óx um ${F.pct(g,0)} á milli ára. Hvert var framlag hans til hagvaxtar í ár?`,
    o: opts(c, [g, g/s, g*(1-s), 2*s*g], v=>F.dec(v*100,1)+' prósentustig', (c,k)=>c+(k%2?1:-1)*Math.ceil(k/2)*0.005), a:0,
    e:`<div class="f">Framlag = s(t−1) × %Δ = ${F.dec(s,2)} × ${F.pct(g,0)} = ${F.dec(c*100,1)} prósentustig</div>(Sýnidæmi 1.)` };
}},
// ---------- Raunvöxtur VLF / raunlaun ----------
{id:"gen-real", t:"rei", name:"Raunbreyting", f(){
  if (Math.random() < 0.5) { const n = R.pick([0.05,0.08,0.1,0.12,0.15,0.2]), p = R.pick([0.02,0.03,0.04,0.06,0.08,0.1]); const c = (1+n)/(1+p)-1;
    return { q:`Nafnvirði VLF jókst um ${F.pct(n,0)} á milli ára og verðvísitala VLF hækkaði um ${F.pct(p,0)}. Hver var raunhagvöxtur, nákvæmlega?`,
      o: opts(c, [n-p, n+p, (1+p)/(1+n)-1, n], v=>F.pct(v,1), (c,k)=>c+(k%2?1:-1)*Math.ceil(k/2)*0.003), a:0,
      e:`<div class="f">Raunvöxtur = (1 + ${F.dec(n,2)}) / (1 + ${F.dec(p,2)}) − 1 = ${F.pct(c,2)}</div>` }; }
  const W1 = R.ri(10,40)*1000, W2 = Math.round(W1*(1+R.ri(15,120)/100)/1000)*1000, C1 = R.ri(200,500), C2 = Math.round(C1*(1+R.ri(10,110)/100));
  const c = (W2/W1)/(C2/C1) - 1;
  return { q:`Mánaðarlaun voru ${F.int(W1)} kr. árið A og ${F.int(W2)} kr. árið B. Vísitala neysluverðs var ${C1} árið A og ${C2} árið B. Hvernig breyttust raunlaun?`,
    o: opts(c, [W2/W1-1, (W2/W1-1)-(C2/C1-1), (C2/C1)/(W2/W1)-1, C2/C1-1], v=>(v>=0?'Hækkuðu um ':'Lækkuðu um ')+F.pct(Math.abs(v),1), (c,k)=>c+(k%2?1:-1)*Math.ceil(k/2)*0.02), a:0,
    e:`<div class="f">Raunlaun B á verðlagi A = ${F.int(W2)} × ${C1}/${C2} = ${F.int(W2*C1/C2)}<br>${F.int(W2*C1/C2)} / ${F.int(W1)} − 1 = ${F.pct(c,1)}</div>Sama aðferð og kennaradæmið í MT20 (16 þ.kr. 1983, 76 þ.kr. 1990).` };
}},
];

// ---- millilag: gamla úttakið {q, o, a, e} → GenItem ----
export default GENS.map(g => ({ id: g.id, name: g.name, topic: g.t, f: () => ({ type: 'mc', ...g.f() }) }));
