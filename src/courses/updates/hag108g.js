// Gömul próf í HAG108G, birt í nóv. 2026: lokapróf des. 2024 og des. 2025 og endurtökupróf jan. 2025 og jan. 2026.
// Gamla síðan í legacy/ er skrifvarin; scripts/extract-legacy.js bætir þessu ofan á það sem lesið er úr henni.
//   1. Dæmin 60 sem skrifleg dæmi (source 'old') með lausn skref fyrir skref; tölurnar staðfestar í R.
//   2. Prófsnið: blandað lokapróf (hvert af 15 sætum dregið úr einu prófanna fjögurra) og prófin fjögur óbreytt.
//   3. Sniðið er ekki lengur óstaðfest: upplýsingar um prófið og nýr kafli fremst á Blaðinu.
// Prófin 2025–26 gefa ekki vægi dæma; þar er notað vægi desemberprófsins 2024 (sama snið).

const R = String.raw;

const W24 = [5, 5, 5, 10, 5, 10, 10, 10, 5, 15, 10, 2, 2, 2, 4];
const WJ25 = [6.5, 3.5, 5, 10, 5, 10, 10, 10, 5, 15, 10, 2, 2, 2, 4];
const PAPERS = {
  D24: { name: 'Lokapróf desember 2024', w: W24 },
  J25: { name: 'Endurtökupróf janúar 2025', w: WJ25 },
  D25: { name: 'Lokapróf desember 2025', w: W24, guess: true },
  J26: { name: 'Endurtökupróf janúar 2026', w: W24, guess: true }
};

const ITEMS = [];
/** Eitt dæmi: [fyrirsögn skrefs, lausn, stig] fyrir hvern lið. */
function ex(paper, n, topic, q, steps) {
  const P = PAPERS[paper], w = P.w[n - 1];
  ITEMS.push({
    id: `${paper}-${n}`, topic, level: 2, source: 'old',
    src: `${P.name}, dæmi ${n} (${P.guess ? `vægi ekki gefið, um ${String(w).replace('.', ',')}%` : `${String(w).replace('.', ',')}%`})`,
    q, type: 'steps', steps: steps.map(([h, body, p = 1]) => ({ h, body, p })), examWeight: w, e: '', paper, r: topic === 'L00' ? true : undefined
  });
}

const abc = (...li) => `<ol type="a">${li.map(x => `<li>${x}</li>`).join('')}</ol>`;
const code = s => `<pre class="code">${s.trim().replace(/</g, '&lt;')}</pre>`;
const pmf = rows => R`\[P(X=k)=\begin{cases}${rows.map(([p, k]) => R`${p} & \text{ef } k=${k}`).join(R`\\`)}\\0 & \text{annars}\end{cases}\]`;
const cdf = rows => R`\[F(x)=\begin{cases}${rows.join(R`\\`)}\end{cases}\]`;
/** Tafla samþéttleika eða samdreifingar: xs = gildi X, ys = gildi Y, m = raðir. */
const grid = (head, xs, ys, m) => `<div class="scroll"><table class="tt"><thead><tr><th>\\(${head}\\)</th>${ys.map(y => `<th>\\(y=${y}\\)</th>`).join('')}</tr></thead><tbody>${xs.map((x, i) => `<tr><th>\\(x=${x}\\)</th>${m[i].map(v => `<td class="mono">${v}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
const tbl = (head, rows) => `<div class="scroll"><table class="tt"><thead><tr>${head.map(h => `<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${r.map((v, i) => i ? `<td class="mono">${v}</td>` : `<th>${v}</th>`).join('')}</tr>`).join('')}</tbody></table></div>`;
const trap = s => `<p class="trap"><b>Gildra.</b> ${s}</p>`;

// =====================================================================================================
// Lokapróf desember 2024
// =====================================================================================================

ex('D24', 1, 'L01', `Formaður fjárfestingarklúbbs spyr alla meðlimi hvort þeir hafi stundað viðskipti með verðbréf.<ul><li>354 svör komu frá hagfræðingum; 197 þeirra hafa stundað viðskipti með verðbréf.</li><li>146 svör komu frá öðrum; 40 þeirra hafa stundað viðskipti með verðbréf.</li></ul>${abc(
  'Hverjar eru líkurnar á að meðlimur sem er hagfræðingur hafi stundað viðskipti með verðbréf?',
  'Hverjar eru líkurnar á að meðlimur sem er ekki hagfræðingur hafi <u>ekki</u> stundað viðskipti með verðbréf?',
  'Hverjar eru líkurnar á að meðlimur klúbbsins hafi stundað viðskipti með verðbréf?')}`, [
  ['a) Pr(V | H)', R`\[\Pr(V\mid H)=\frac{197}{354}\approx 0{,}556\]` + trap('Skilyrt: deilt er með fjölda hagfræðinga (354), ekki öllum 500.')],
  ['b) Pr(ekki V | ekki H)', R`<p>Af 146 sem eru ekki hagfræðingar hafa \(146-40=106\) ekki stundað viðskipti:</p>\[\Pr(V^c\mid H^c)=\frac{106}{146}\approx 0{,}726\]`],
  ['c) Pr(V)', R`\[\Pr(V)=\frac{197+40}{354+146}=\frac{237}{500}=0{,}474\]`]
]);

ex('D24', 2, 'L01', `Nemendur svara hvort þeir vilji frekar dæmatíma á mánudögum eða fimmtudögum: 12 velja mánudag og 7 velja fimmtudag.${abc(
  'Velja á 10 nemendur í fimmtudagstíma þannig að 6 þeirra völdu fimmtudag og hinir 4 mánudag. Á hversu marga vegu er hægt að velja þá 10?')}<p>Deildin raðar nemendum svo: hafi nemandi valið mánudag eru 70% líkur á að hann lendi í mánudagstíma; hafi hann valið fimmtudag eru 80% líkur á að hann lendi í fimmtudagstíma.</p><ol type="a" start="2"><li>Að því gefnu að nemandi hafi valið fimmtudag, hverjar eru líkurnar á að honum sé raðað á mánudag?</li><li>Að því gefnu að nemanda hafi verið raðað á mánudag, hverjar eru líkurnar á að hann hafi valið mánudag?</li></ol>`, [
  ['a) Fjöldi hópa', R`\[\binom{7}{6}\binom{12}{4}=7\cdot 495=3465\]<p>Röðin innan hóps skiptir ekki máli, og valið úr hvorum hópi er óháð, svo fjöldarnir margfaldast.</p>`, 2],
  ['b) Pr(M | valdi F)', R`\[\Pr(M\mid F_v)=1-0{,}8=0{,}2\]`],
  ['c) Bayes', R`<p>Gerum ráð fyrir að enginn hafi valið báða daga: \(\Pr(M_v)=\tfrac{12}{19}\), \(\Pr(F_v)=\tfrac{7}{19}\).</p>\[\begin{aligned}\Pr(M)&=\tfrac{12}{19}\cdot 0{,}7+\tfrac{7}{19}\cdot 0{,}2=\tfrac{9{,}8}{19}\approx 0{,}516\\ \Pr(M_v\mid M)&=\frac{\tfrac{12}{19}\cdot 0{,}7}{\tfrac{9{,}8}{19}}=\frac{8{,}4}{9{,}8}=\tfrac67\approx 0{,}857\end{aligned}\]`, 2]
]);

ex('D24', 3, 'L02', `Slembibreytan \\(X\\) hefur líkindamassafallið (PMF)${pmf([['0{,}1', 1], ['0{,}2', 3], ['0{,}3', 5], ['0{,}2', 6], ['0{,}1', 7], ['0{,}1', 12]])}${abc(
  'Finnið dreifingarfall \\(X\\) (CDF).', 'Reiknið væntigildi \\(X\\).', 'Hverjar eru líkurnar \\(P(3\\le X\\le 7)\\)?')}`, [
  ['a) Dreifingarfall', cdf([R`0 & x<1`, R`0{,}1 & 1\le x<3`, R`0{,}3 & 3\le x<5`, R`0{,}6 & 5\le x<6`, R`0{,}8 & 6\le x<7`, R`0{,}9 & 7\le x<12`, R`1 & x\ge 12`]) + trap('F er þrepafall skilgreint fyrir öll rauntölugildi x, ekki aðeins í gildunum sjálfum.'), 2],
  ['b) E[X]', R`\[E[X]=1(0{,}1)+3(0{,}2)+5(0{,}3)+6(0{,}2)+7(0{,}1)+12(0{,}1)=5{,}3\]`],
  ['c) P(3 ≤ X ≤ 7)', R`\[P(3\le X\le 7)=0{,}2+0{,}3+0{,}2+0{,}1=0{,}8=F(7)-F(1)\]` + trap('Með ≤ í neðri mörkum er dregið F(1) frá, ekki F(3).')]
]);

ex('D24', 4, 'L04', R`Slembibreytan \(Y\) hefur þéttleikafallið \[f(y)=\begin{cases}4y^3 & 0\le y\le 1\\0&\text{annars}\end{cases}\]` + abc('Hvert er dreifingarfall \\(Y\\)?', 'Finnið væntigildi \\(Y\\).', 'Finnið dreifni \\(Y\\).', 'Finnið staðalfrávik \\(Y\\).', 'Finnið miðgildi \\(Y\\).'), [
  ['a) F(y)', R`\[F(y)=\int_0^y 4t^3\,dt=y^4\quad(0\le y\le 1),\qquad F(y)=0 \text{ ef } y<0,\; F(y)=1 \text{ ef } y>1\]`, 2],
  ['b) E[Y]', R`\[E[Y]=\int_0^1 y\cdot 4y^3\,dy=\tfrac45=0{,}8\]`],
  ['c) Var[Y]', R`\[E[Y^2]=\int_0^1 4y^5\,dy=\tfrac23,\qquad \operatorname{Var}[Y]=\tfrac23-\left(\tfrac45\right)^2=\tfrac{2}{75}\approx 0{,}0267\]`, 2],
  ['d) Staðalfrávik', R`\[\sigma=\sqrt{2/75}\approx 0{,}163\]`],
  ['e) Miðgildi', R`\[F(m)=m^4=0{,}5\;\Rightarrow\; m=0{,}5^{1/4}\approx 0{,}841\]`]
]);

ex('D24', 5, 'L05', `Tíminn \\(T\\) þar til áhrif stýrivaxtabreytinga verða mælanleg er veldisdreifður og hefur að jafnaði verið 2 mánuðir.${abc(
  'Hver er stiki \\(T\\)?', 'Hverjar eru líkurnar á að áhrifin komi fram eftir 1 mánuð eða minna?', 'Hverjar eru líkurnar á að áhrifin komi fram á milli 3 og 6 mánaða?')}`, [
  ['a) Stikinn', R`\[\lambda=\frac{1}{E[T]}=\frac12=0{,}5 \text{ á mánuði}\]` + trap('λ er tíðni; meðalbiðin er 1/λ. Að setja λ = 2 er algengasta villan.')],
  ['b) P(T ≤ 1)', R`\[P(T\le 1)=1-e^{-0{,}5}\approx 0{,}393\]`],
  ['c) P(3 < T < 6)', R`\[P(3<T<6)=e^{-1{,}5}-e^{-3}\approx 0{,}2231-0{,}0498=0{,}173\]`]
]);

ex('D24', 6, 'L03', `Sjoppa veitir námsmönnum 10% afslátt af hamborgaramáltíð, og 70% kaupenda eru námsmenn. Á venjulegum degi kaupa 6 manns hamborgara. \\(X\\) er fjöldi þeirra sem nýta afsláttinn og er tvíkostadreifð.${abc(
  'Hverjir eru stikar \\(X\\)?', 'Hver er væntur fjöldi þeirra sem nýta afsláttinn?', 'Hver er dreifni fjöldans?', 'Hverjar eru líkurnar á að fleiri en 3 nýti afsláttinn?', 'Máltíðin kostar venjulega 2000 kr. Hverjar eru væntar tekjur af hamborgarasölu á dag?')}`, [
  ['a) Stikar', R`\[X\sim \text{Bin}(n=6,\;p=0{,}7)\]`],
  ['b) E[X]', R`\[E[X]=np=4{,}2\]`],
  ['c) Var[X]', R`\[\operatorname{Var}[X]=np(1-p)=6\cdot 0{,}7\cdot 0{,}3=1{,}26\]`],
  ['d) P(X > 3)', R`\[\begin{aligned}P(X>3)&=\tbinom64 0{,}7^4 0{,}3^2+\tbinom65 0{,}7^5 0{,}3+0{,}7^6\\&\approx 0{,}3241+0{,}3025+0{,}1176=0{,}744\end{aligned}\]<p>Í R: <code>1 - pbinom(3, 6, 0.7)</code>.</p>` + trap('„Fleiri en 3“ er X ≥ 4, svo 1 − P(X ≤ 3).'), 2],
  ['e) Væntar tekjur', R`<p>Hver námsmaður sem nýtir afsláttinn borgar 200 kr. minna: tekjur \(=6\cdot 2000-200X\).</p>\[E[\text{tekjur}]=12\,000-200\cdot 4{,}2=11\,160 \text{ kr.}\]`, 2]
]);

ex('D24', 7, 'L06', `\\(X\\) og \\(Y\\) eru strjálar með samþéttleikafallið \\(f(x,y)\\) í töflunni (önnur gildi hafa líkurnar 0):${grid('f(x,y)', [0, 1, 2], [0, 1, 2], [['0,1', '0,05', '0,05'], ['0,2', '0,1', '0,05'], ['0,05', '0,25', '0,15']])}${abc(
  'Finnið \\(P(X=1,Y=0)\\).', 'Finnið samdreifingarfallið \\(F(x,y)\\) á töfluformi.', 'Finnið \\(P(X\\le 1 \\text{ og } Y\\ge 1)\\).', 'Hver eru jaðarþéttleikaföllin \\(f_X(x)\\) og \\(f_Y(y)\\)?')}`, [
  ['a) P(X = 1, Y = 0)', R`<p>Lesið beint úr töflunni: \(0{,}2\).</p>`],
  ['b) F(x, y)', `<p>\\(F(x,y)=P(X\\le x, Y\\le y)\\): summa allra reita upp og til vinstri.</p>${grid('F(x,y)', [0, 1, 2], [0, 1, 2], [['0,10', '0,15', '0,20'], ['0,30', '0,45', '0,55'], ['0,35', '0,75', '1']])}`, 4],
  ['c) P(X ≤ 1, Y ≥ 1)', R`\[0{,}05+0{,}05+0{,}1+0{,}05=0{,}25\]` + trap('Þetta er ekki 1 − F(1, 0): „Y ≥ 1“ er ekki fyllimengi „Y ≤ 0“ þegar X er líka skilyrt.')],
  ['d) Jaðardreifingar', R`<p>Línusummur og dálkasummur:</p>\[f_X:\; 0{,}2,\;0{,}35,\;0{,}45\qquad f_Y:\; 0{,}35,\;0{,}4,\;0{,}25\]`, 2]
]);

ex('D24', 8, 'L06', R`\([X,Y]\) hefur samþéttleikafallið \[f(x,y)=\begin{cases}\tfrac18(x+y) & 0<x<2,\;0<y<2\\0&\text{annars}\end{cases}\]` + abc('Finnið jaðarþéttleikaföllin \\(f_X(x)\\) og \\(f_Y(y)\\).', 'Finnið \\(P(1<X<2)\\).', 'Finnið skilyrta þéttleikafallið \\(f_{X|Y}(x\\mid y)\\).', 'Finnið \\(P(1<X<2\\mid Y=1)\\).', 'Út frá b) og d), eru \\(X\\) og \\(Y\\) háðar eða óháðar?'), [
  ['a) Jaðarþéttleikar', R`\[f_X(x)=\int_0^2 \tfrac18(x+y)\,dy=\tfrac18(2x+2)=\tfrac{x+1}{4},\quad 0<x<2\]<p>Eins (samhverft): \(f_Y(y)=\tfrac{y+1}{4},\; 0<y<2\).</p>`, 2],
  ['b) P(1 < X < 2)', R`\[\int_1^2\tfrac{x+1}{4}\,dx=\tfrac14\Big[\tfrac{x^2}{2}+x\Big]_1^2=\tfrac14(4-1{,}5)=0{,}625\]`],
  ['c) f(x | y)', R`\[f_{X|Y}(x\mid y)=\frac{f(x,y)}{f_Y(y)}=\frac{(x+y)/8}{(y+1)/4}=\frac{x+y}{2(y+1)},\quad 0<x<2\]`, 2],
  ['d) P(1 < X < 2 | Y = 1)', R`\[f_{X|Y}(x\mid 1)=\tfrac{x+1}{4}\;\Rightarrow\;\int_1^2\tfrac{x+1}{4}\,dx=0{,}625\]`],
  ['e) Háðar', R`<p><b>Háðar.</b> Að b) og d) gefi sömu tölu er tilviljun við \(y=1\). Óhæði krefst \(f_{X|Y}(x\mid y)=f_X(x)\) fyrir <i>öll</i> y, en t.d. \(f_{X|Y}(x\mid 0{,}5)=\tfrac{x+0{,}5}{3}\ne \tfrac{x+1}{4}\). Einnig: \(f_Xf_Y=\tfrac{(x+1)(y+1)}{16}\ne\tfrac{x+y}{8}\).</p>`, 2]
]);

ex('D24', 9, 'L09', `Hagfræðingur spyr fólk hve mikið það eyði að jafnaði í matvörur á mánuði (í þúsundum króna):<p class="mono" style="text-align:center">250 &nbsp; 275 &nbsp; 230 &nbsp; 260 &nbsp; 240</p>${abc(
  'Reiknið meðaltal úrtaksins.', 'Reiknið dreifni og staðalfrávik úrtaksins.', 'Reiknið 99% tvíhliða öryggismörk fyrir meðaltalið, að því gefnu að eyðslan sé normaldreifð.')}<p class="hint">Prófið talar um „fyrstu 10 svörin“ en gefur 5 tölur; hér er n = 5.</p>`, [
  ['a) Meðaltal', R`\[\bar x=\frac{1255}{5}=251\]`],
  ['b) Dreifni og staðalfrávik', R`<p>Frávik: −1, 24, −21, 9, −11; ferningar 1, 576, 441, 81, 121.</p>\[s^2=\frac{1220}{5-1}=305,\qquad s=\sqrt{305}\approx 17{,}46\]` + trap('S² deilir með n − 1, ekki n.'), 2],
  ['c) 99% öryggisbil', R`\[\bar x\pm t_{4;\,0{,}005}\frac{s}{\sqrt n}=251\pm 4{,}604\cdot\frac{17{,}46}{\sqrt5}=251\pm 35{,}96\;\Rightarrow\;(215{,}0;\;287{,}0)\]` + trap('σ er óþekkt og n lítið: t-dreifing með n − 1 = 4 frígráður, og α/2 = 0,005.'), 2]
]);

ex('D24', 10, 'L09', `Fyrirtæki kannar hvort upplifun gesta í tveimur skemmtigörðum hafi verið jákvæð:${tbl(['', 'Vesterós', 'Aseroð'], [['Hlutfall jákvæðra', '0,5', '0,45'], ['Dreifni', '0,15', '0,05'], ['Fjöldi í úrtaki', '28', '20']])}${abc(
  'Prófið hvort hlutfall jákvæðra í Vesterós sé hærra en 0,3 miðað við 5% marktækni.',
  'Prófið hvort marktækur munur sé á hlutföllum jákvæðra í Vesterós og Aseroð miðað við 5% marktækni.',
  'Prófið hvort marktækur munur sé á dreifni jákvæðra skoðana miðað við 10% marktækni (notið 5% F-töfluna því 10%/2 = 5%).',
  'Hvernig túlkið þið niðurstöðurnar? Hvaða tilgátum byggja prófin á og hverjum var hafnað?')}`, [
  ['a) Einhliða próf', R`<p>\(H_0: p\le 0{,}3\) gegn \(H_1: p>0{,}3\). Með gefnu dreifninni:</p>\[T=\frac{0{,}5-0{,}3}{\sqrt{0{,}15/28}}=\frac{0{,}2}{0{,}0732}\approx 2{,}73>t_{27;\,0{,}05}=1{,}703\]<p><b>H₀ hafnað</b>: hlutfallið er marktækt hærra en 0,3. (Með dreifninni \(p_0(1-p_0)\) fæst \(z\approx 2{,}31>1{,}645\), sama niðurstaða.)</p>`, 4],
  ['b) Munur á hlutföllum (Welch)', R`\[T=\frac{0{,}5-0{,}45}{\sqrt{\frac{0{,}15}{28}+\frac{0{,}05}{20}}}=\frac{0{,}05}{0{,}0886}\approx 0{,}56\]<p>Welch-frígráður ≈ 44, \(t_{0{,}025}\approx 2{,}02\). \(|T|<2{,}02\): <b>ekki hægt að hafna</b> \(H_0: p_1=p_2\).</p>`, 4],
  ['c) F-próf á dreifni', R`\[F=\frac{s_1^2}{s_2^2}=\frac{0{,}15}{0{,}05}=3{,}0,\qquad F_{27,19;\,0{,}05}\approx 2{,}09\]<p>\(3{,}0>2{,}09\): <b>H₀ um jafna dreifni hafnað</b> við 10%. Stærri dreifnin fer í teljarann.</p>` + trap('F er hlutfall dreifna, ekki staðalfrávika.'), 4],
  ['d) Túlkun', `<p>Hlutfall jákvæðra í Vesterós er marktækt yfir 0,3, en ekki er marktækur munur á görðunum tveimur. Dreifnin er marktækt meiri í Vesterós: skoðanir þar eru dreifðari. Prófin gera ráð fyrir óháðum slembiúrtökum og nálgað normaldreifðum meðaltölum; Welch-prófið gerir ekki ráð fyrir jafnri dreifni, sem er eins gott því F-prófið hafnar henni.</p>`, 3]
]);

ex('D24', 11, 'L08', `Fjöldi umsókna um atvinnuleysisbætur á dag er Poisson-dreifður. Síðustu 5 daga:${tbl(['Dagur', '1', '2', '3', '4', '5'], [['Umsóknir', '1', '3', '2', '4', '3']])}<p>Finnið sennileikamat á \\(\\lambda\\).</p>${abc(
  'Hvert er sennileikafallið fyrir \\(\\lambda\\)?', 'Finnið lograsennileikafallið.', 'Finnið sennileikamatið \\(\\hat\\lambda\\).')}`, [
  ['a) Sennileikafall', R`\[L(\lambda)=\prod_{i=1}^5\frac{\lambda^{x_i}e^{-\lambda}}{x_i!}=\frac{\lambda^{13}e^{-5\lambda}}{1!\,3!\,2!\,4!\,3!}=\frac{\lambda^{13}e^{-5\lambda}}{1728}\]`, 3],
  ['b) Lograsennileiki', R`\[\ell(\lambda)=13\ln\lambda-5\lambda-\ln 1728\]`, 3],
  ['c) Matið', R`\[\ell'(\lambda)=\frac{13}{\lambda}-5=0\;\Rightarrow\;\hat\lambda=\frac{13}{5}=2{,}6=\bar x\]<p>\(\ell''(\lambda)=-13/\lambda^2<0\), svo þetta er hámark.</p>`, 4]
]);

ex('D24', 12, 'L00', `Grunnatriði í R:${code(`
x <- 5
y <- c(1, 2, 3, 4)

z_1 <- y[2] + y[4] + x
z_2 <- x + y`)}${abc('Hvert er gildið í <code>z_1</code>?', 'Hvert er gildið í <code>z_2</code>?')}`, [
  ['a) z_1', R`<p>\(y_2+y_4+x=2+4+5=\) <code>11</code>.</p>`],
  ['b) z_2', `<p>Vigurinn <code>c(6, 7, 8, 9)</code>: x er lagt við hvert stak y.</p>`]
]);

ex('D24', 13, 'L00', `Pakkar og stöðluð föll:${code(`
library(ggplot2)

x <- rnorm(100, mean = 0, sd = 1)

print(mean(x))
print(sd(x))

ggplot(data = data.frame(x), aes(x = x)) +
    geom_histogram(binwidth = 0.5, fill = "blue", color = "black")`)}${abc('Hvað gerir <code>library(ggplot2)</code>?', 'Hvað gerir <code>rnorm(100, mean = 0, sd = 1)</code>?', 'Hvað gerir skipunin í línum 8 og 9?')}`, [
  ['a) library', '<p>Hleður pakkanum ggplot2 (sem þarf að vera uppsettur) svo föll hans verði aðgengileg.</p>'],
  ['b) rnorm', '<p>Dregur 100 slembitölur úr staðlaðri normaldreifingu N(0, 1). Þriðja færibreytan er staðalfrávik, ekki dreifni.</p>'],
  ['c) ggplot', '<p>Teiknar stuðlarit (histogram) af x með stólpabreidd 0,5, bláum stólpum og svörtum útlínum.</p>']
]);

ex('D24', 14, 'L00', `Skilgreiningar falla:${code(`
fall <- function(a, b) {
    if (a > b) {
        result <- a^2 - b^2
    } else {
        result <- a^2 + b^2 + 5
    }
}`)}${abc('Hvaða gildi birtir <code>print(fall(5, 3))</code>?', 'Hvaða gildi birtir <code>print(fall(3, 5))</code>?')}`, [
  ['a) fall(5, 3)', R`<p>\(5>3\): \(25-9=\) <code>16</code>.</p>`],
  ['b) fall(3, 5)', R`<p>\(3\not>5\): \(9+25+5=\) <code>39</code>.</p><p class="note">Fallið skilar gildi síðustu segðar, úthlutuninni, en ósýnilega: <code>fall(3, 5)</code> eitt og sér prentar ekkert, <code>print()</code> birtir það.</p>`]
]);

ex('D24', 15, 'L00', `Tölfræðipróf og innlestur gagna:${code(`
read.csv("ice.csv")
read.csv("fra.csv")

res <- t.test(ice, fra)
print(res)`)}<p>Úttakið:</p>${code(`
        Welch Two Sample t-test

data:  ice and fra
t = 1.8516, df = 10, p-value = 0.09379
alternative hypothesis: true difference in means is not equal to 0
95 percent confidence interval:
 -0.406665  4.406665
sample estimates:
mean of x mean of y
      7.5       5.5`)}${abc('Hvað gera skipanirnar í línum 1 og 2?', 'Hvað gerir <code>t.test(ice, fra)</code> og hvað má lesa úr niðurstöðunum?')}`, [
  ['a) read.csv', '<p>Lesa CSV-skrárnar ice.csv og fra.csv í gagnatöflur. Athugið að úttakið er ekki geymt í breytu (vantar <code>ice &lt;- read.csv(…)</code>), svo það prentast bara.</p>'],
  ['b) Welch t-próf', R`<p>Tvíhliða t-próf (Welch, ójöfn dreifni) á því hvort meðaltöl hópanna tveggja séu jöfn. Meðaltöl 7,5 og 5,5; \(t=1{,}85\), df = 10, p = 0,094.</p><p>p &gt; 0,05: <b>ekki hægt að hafna</b> jöfnum meðaltölum við 5% (en það væri hægt við 10%). 95% öryggisbilið fyrir muninn, (−0,41; 4,41), inniheldur 0.</p>`, 3]
]);

// =====================================================================================================
// Endurtökupróf janúar 2025
// =====================================================================================================

ex('J25', 1, 'L01', `Útskriftarnemar úr hagfræðideild bera saman bækur sínar:<ul><li>16 útskrifuðust úr fjármálahagfræði; 10 þeirra starfa hjá fjármálastofnunum.</li><li>5 útskrifuðust úr almennri hagfræði; 1 starfar hjá fjármálastofnun.</li><li>11 útskrifuðust úr viðskiptahagfræði; 6 starfa hjá fjármálastofnunum.</li></ul>${abc(
  'Hverjar eru líkurnar á að nemandi úr viðskiptahagfræði starfi hjá fjármálastofnun?',
  'Hverjar eru líkurnar á að nemandi sem útskrifaðist <u>ekki</u> úr viðskiptahagfræði starfi <u>ekki</u> hjá fjármálastofnun?',
  'Hverjar eru líkurnar á að útskriftarnemi starfi hjá fjármálastofnun?',
  'Velja á 5 nemendur: 2 úr fjármálahagfræði, 1 úr almennri og 2 úr viðskiptahagfræði, og enginn þeirra starfar hjá fjármálastofnun. Á hversu marga vegu er það hægt?')}`, [
  ['a) Pr(F | V)', R`\[\Pr(F\mid V)=\tfrac{6}{11}\approx 0{,}545\]`],
  ['b) Pr(ekki F | ekki V)', R`<p>Ekki úr viðskiptahagfræði: \(16+5=21\); þar af starfa \(10+1=11\) hjá fjármálastofnun, svo 10 ekki:</p>\[\Pr(F^c\mid V^c)=\tfrac{10}{21}\approx 0{,}476\]`],
  ['c) Pr(F)', R`\[\Pr(F)=\frac{10+1+6}{32}=\frac{17}{32}\approx 0{,}531\]`],
  ['d) Fjöldi hópa', R`<p>Aðeins þeir sem starfa ekki hjá fjármálastofnun: 6, 4 og 5.</p>\[\binom62\binom41\binom52=15\cdot 4\cdot 10=600\]`, 2]
]);

ex('J25', 2, 'L01', `Þegar mikill samdráttur verður á hlutabréfamörkuðum (S) eru 80% líkur á efnahagskreppu (K); annars 10%. Almennt eru 20% líkur á samdrætti.${abc(
  'Að gefnum samdrætti, hverjar eru líkurnar á að <u>ekki</u> hefjist efnahagskreppa?', 'Að gefinni efnahagskreppu, hverjar eru líkurnar á að samdráttur hafi orðið?')}`, [
  ['a) Pr(ekki K | S)', R`\[\Pr(K^c\mid S)=1-0{,}8=0{,}2\]`],
  ['b) Bayes', R`\[\Pr(S\mid K)=\frac{0{,}2\cdot 0{,}8}{0{,}2\cdot 0{,}8+0{,}8\cdot 0{,}1}=\frac{0{,}16}{0{,}24}=\tfrac23\approx 0{,}667\]` + trap('Nefnarinn er heildarlíkur á kreppu, Pr(K), yfir bæði tilvikin.'), 2]
]);

ex('J25', 3, 'L02', `Slembibreytan \\(X\\) hefur líkindamassafallið${pmf([['0{,}2', '-1'], ['0{,}1', 3], ['0{,}4', 5], ['0{,}2', 6], ['0{,}1', 7]])}${abc(
  'Finnið dreifingarfall \\(X\\).', 'Reiknið væntigildi \\(X\\).', 'Hverjar eru líkurnar \\(P(3<X\\le 6)\\)?')}`, [
  ['a) Dreifingarfall', cdf([R`0 & x<-1`, R`0{,}2 & -1\le x<3`, R`0{,}3 & 3\le x<5`, R`0{,}7 & 5\le x<6`, R`0{,}9 & 6\le x<7`, R`1 & x\ge 7`]), 2],
  ['b) E[X]', R`\[E[X]=-1(0{,}2)+3(0{,}1)+5(0{,}4)+6(0{,}2)+7(0{,}1)=4{,}0\]`],
  ['c) P(3 < X ≤ 6)', R`\[P(3<X\le 6)=0{,}4+0{,}2=0{,}6=F(6)-F(3)\]` + trap('Strangt < útilokar X = 3.')]
]);

ex('J25', 4, 'L04', R`Slembibreytan \(Y\) hefur þéttleikafallið \[f(y)=\begin{cases}6y^5 & 0\le y\le 1\\0&\text{annars}\end{cases}\]` + abc('Hvert er dreifingarfall \\(Y\\)?', 'Finnið væntigildi \\(Y\\).', 'Finnið dreifni \\(Y\\).', 'Finnið staðalfrávik \\(Y\\).', 'Finnið 25% hlutfallsmark \\(Y\\).'), [
  ['a) F(y)', R`\[F(y)=y^6\quad(0\le y\le 1),\qquad 0 \text{ ef } y<0,\; 1 \text{ ef } y>1\]`, 2],
  ['b) E[Y]', R`\[E[Y]=\int_0^1 6y^6\,dy=\tfrac67\approx 0{,}857\]`],
  ['c) Var[Y]', R`\[E[Y^2]=\tfrac68=\tfrac34,\qquad \operatorname{Var}[Y]=\tfrac34-\tfrac{36}{49}=\tfrac{3}{196}\approx 0{,}0153\]`, 2],
  ['d) Staðalfrávik', R`\[\sigma=\sqrt{3/196}\approx 0{,}124\]`],
  ['e) 25% hlutfallsmark', R`\[F(q)=q^6=0{,}25\;\Rightarrow\; q=0{,}25^{1/6}\approx 0{,}794\]`]
]);

ex('J25', 5, 'L03', `Að meðaltali koma 2 viðskiptavinir í bankann á klukkustund. \\(F\\) er fjöldinn á klukkustund og er Poisson-dreifður.${abc(
  'Hver er stiki \\(F\\)?', 'Hver er dreifni \\(F\\)?', 'Hverjar eru líkurnar á að fleiri en 1 viðskiptavinur komi á gefinni klukkustund?')}`, [
  ['a) Stikinn', R`\[\lambda=2 \text{ á klukkustund}\]`],
  ['b) Dreifni', R`\[\operatorname{Var}[F]=\lambda=2\]`],
  ['c) P(F > 1)', R`\[P(F>1)=1-e^{-2}\left(1+2\right)=1-3e^{-2}\approx 0{,}594\]<p>Í R: <code>1 - ppois(1, 2)</code>.</p>`]
]);

ex('J25', 6, 'L03', `Líkurnar á að selja einstaklingi fjárfestingu eru 0,1, og haft er samband við 10 á dag. \\(X\\) er fjöldi kaupenda á dag og er tvíkostadreifð.${abc(
  'Hverjir eru stikar \\(X\\)?', 'Hver er væntur fjöldi kaupenda á dag?', 'Hver er dreifni fjöldans?', 'Hverjar eru líkurnar á að enginn kaupi?')}<p>Nú er haft samband við 1000 á dag.</p><ol type="a" start="5"><li>Hverjar eru líkurnar á að 110 eða færri kaupi? Nálgun nægir.</li></ol>`, [
  ['a) Stikar', R`\[X\sim\text{Bin}(n=10,\;p=0{,}1)\]`],
  ['b) E[X]', R`\[E[X]=np=1\]`],
  ['c) Var[X]', R`\[\operatorname{Var}[X]=np(1-p)=0{,}9\]`],
  ['d) P(X = 0)', R`\[P(X=0)=0{,}9^{10}\approx 0{,}349\]`],
  ['e) Normalnálgun', R`<p>\(n=1000\): \(E=100\), \(\operatorname{Var}=90\), \(\sigma\approx 9{,}49\).</p>\[P(X\le 110)\approx\Phi\!\left(\frac{110{,}5-100}{9{,}49}\right)=\Phi(1{,}11)\approx 0{,}866\]<p>Án samfelldnileiðréttingar: \(\Phi(1{,}05)\approx 0{,}854\). Nákvæmt (<code>pbinom(110, 1000, 0.1)</code>): 0,865.</p>`, 3]
]);

ex('J25', 7, 'L06', `\\(X\\) og \\(Y\\) eru strjálar með samþéttleikafallið:${grid('f(x,y)', [0, 1], [0, 1, 2, 3], [['0,15', '0,10', '0,05', '0,10'], ['0,20', '0,10', '0,15', '0,15']])}${abc(
  'Finnið \\(P(X=1,Y=0)\\).', 'Finnið samdreifingarfallið \\(F(x,y)\\) á töfluformi.', 'Finnið \\(P[(X=1,Y=1) \\text{ eða } (X=1,Y=2)]\\).', 'Hver eru jaðarþéttleikaföllin \\(f_X(x)\\) og \\(f_Y(y)\\)?')}`, [
  ['a) P(X = 1, Y = 0)', '<p>\\(0{,}20\\)</p>'],
  ['b) F(x, y)', grid('F(x,y)', [0, 1], [0, 1, 2, 3], [['0,15', '0,25', '0,30', '0,40'], ['0,35', '0,55', '0,75', '1']]), 4],
  ['c) Sundurlægir atburðir', R`\[0{,}10+0{,}15=0{,}25\]<p>Atburðirnir eru sundurlægir, svo líkurnar leggjast saman.</p>`],
  ['d) Jaðardreifingar', R`\[f_X:\;0{,}4,\;0{,}6\qquad f_Y:\;0{,}35,\;0{,}20,\;0{,}20,\;0{,}25\]`, 2]
]);

ex('J25', 8, 'L06', R`\([X,Y]\) hefur samþéttleikafallið \[f(x,y)=\begin{cases}6x^2y & 0\le x\le 1,\;0\le y\le 1\\0&\text{annars}\end{cases}\]` + abc('Finnið jaðarþéttleikaföllin \\(f_X(x)\\) og \\(f_Y(y)\\).', 'Finnið \\(P(0{,}25<X<0{,}5)\\).', 'Finnið \\(f_{X|Y}(x\\mid y)\\).', 'Eru \\(X\\) og \\(Y\\) háðar eða óháðar?'), [
  ['a) Jaðarþéttleikar', R`\[f_X(x)=\int_0^1 6x^2y\,dy=3x^2,\qquad f_Y(y)=\int_0^1 6x^2y\,dx=2y\]`, 2],
  ['b) P(0,25 < X < 0,5)', R`\[\Big[x^3\Big]_{0{,}25}^{0{,}5}=0{,}125-0{,}015625=0{,}109\]`],
  ['c) f(x | y)', R`\[f_{X|Y}(x\mid y)=\frac{6x^2y}{2y}=3x^2,\quad 0\le x\le 1\]`, 2],
  ['d) Óháðar', R`<p><b>Óháðar:</b> \(f_{X|Y}(x\mid y)=3x^2=f_X(x)\) fyrir öll y, og \(f(x,y)=3x^2\cdot 2y=f_X(x)f_Y(y)\). (Prófið vísar í „b) og d)“ en á við b) og c).)</p>`, 2]
]);

ex('J25', 9, 'L09', `Dagleg velta bréfa í Tóm hamingja ehf. síðustu 5 daga (í þúsundum króna):${tbl(['Dagur', '1', '2', '3', '4', '5'], [['Velta', '555', '1003', '674', '1243', '945']])}${abc(
  'Reiknið meðaltal úrtaksins.', 'Reiknið dreifni og staðalfrávik úrtaksins.', 'Reiknið 90% tvíhliða öryggismörk fyrir meðaltalið, að því gefnu að veltan sé normaldreifð.')}`, [
  ['a) Meðaltal', R`\[\bar x=\frac{4420}{5}=884\]`],
  ['b) Dreifni og staðalfrávik', R`<p>Frávik: −329, 119, −210, 359, 61.</p>\[s^2=\frac{299\,104}{4}=74\,776,\qquad s\approx 273{,}5\]`, 2],
  ['c) 90% öryggisbil', R`\[884\pm t_{4;\,0{,}05}\frac{273{,}5}{\sqrt5}=884\pm 2{,}132\cdot 122{,}3=884\pm 260{,}7\;\Rightarrow\;(623{,}3;\;1144{,}7)\]`, 2]
]);

ex('J25', 10, 'L09', `Rekstrarkostnaður tveggja bíltegunda í flota Hamingjufraktar:${tbl(['Tegund', 'Húnda', 'Missan'], [['Meðalkostnaður á km', '7,2 kr.', '7,6 kr.'], ['Dreifni', '1,2', '0,5'], ['Fjöldi bíla', '19', '23']])}${abc(
  'Prófið hvort meðalkostnaður Missan á km sé marktækt hærri en 8 kr. við 5% marktækni.',
  'Prófið hvort marktækur munur sé á meðalkostnaði Húnda og Missan við 5% marktækni.',
  'Prófið hvort dreifni kostnaðar Húnda sé marktækt hærri en Missan við 10% marktækni.',
  'Hvernig túlkið þið niðurstöðurnar? Hvaða ályktanir má draga?')}`, [
  ['a) Einhliða próf', R`<p>\(H_0:\mu\le 8\) gegn \(H_1:\mu>8\).</p>\[T=\frac{7{,}6-8}{\sqrt{0{,}5/23}}=\frac{-0{,}4}{0{,}147}\approx -2{,}71\]<p>T er neikvætt en \(H_1\) segir „hærra“: <b>ekki hægt að hafna</b> \(H_0\) (gagnrýnigildi \(t_{22;\,0{,}05}=1{,}717\)).</p>` + trap('Í einhliða prófi skiptir stefna T máli; |T| > 1,717 hafnar ekki H₀ þegar T er í öfuga átt.'), 4],
  ['b) Welch-próf', R`\[T=\frac{7{,}2-7{,}6}{\sqrt{\frac{1{,}2}{19}+\frac{0{,}5}{23}}}=\frac{-0{,}4}{0{,}291}\approx -1{,}37\]<p>Welch-frígráður ≈ 29,6, \(t_{0{,}025}\approx 2{,}04\). \(|T|<2{,}04\): <b>enginn marktækur munur</b>.</p>`, 4],
  ['c) F-próf (einhliða)', R`\[F=\frac{1{,}2}{0{,}5}=2{,}4,\qquad F_{18,22;\,0{,}10}\approx 1{,}78\]<p>\(2{,}4>1{,}78\): <b>H₀ hafnað</b>, dreifni Húnda er marktækt hærri. (Jafnvel 5%-gildið, um 2,08, er undir 2,4.)</p>`, 4],
  ['d) Túlkun', '<p>Ekkert bendir til að Missan kosti meira en 8 kr. á km, og meðalkostnaður tegundanna er ekki marktækt ólíkur. Kostnaður Húnda sveiflast hins vegar meira. Með svipaðan meðalkostnað og fyrirsjáanlegri rekstur er Missan betri kostur. Prófin byggja á óháðum úrtökum og nálgað normaldreifðum kostnaði.</p>', 3]
]);

ex('J25', 11, 'L08', `Umsóknir um styrk eru samþykktar (1) eða þeim hafnað (0), óháð hver annarri (Bernoulli):${tbl(['Umsókn', '1', '2', '3', '4', '5'], [['Niðurstaða', '1', '0', '1', '1', '0']])}<p>Finnið sennileikamat á \\(p\\).</p>${abc(
  'Hvert er sennileikafallið fyrir \\(p\\)?', 'Finnið lograsennileikafallið.', 'Finnið sennileikamatið \\(\\hat p\\).')}`, [
  ['a) Sennileikafall', R`\[L(p)=\prod_{i=1}^5 p^{x_i}(1-p)^{1-x_i}=p^3(1-p)^2\]`, 3],
  ['b) Lograsennileiki', R`\[\ell(p)=3\ln p+2\ln(1-p)\]`, 3],
  ['c) Matið', R`\[\ell'(p)=\frac3p-\frac{2}{1-p}=0\;\Rightarrow\;3(1-p)=2p\;\Rightarrow\;\hat p=\tfrac35=0{,}6\]`, 4]
]);

ex('J25', 12, 'L00', `Grunnatriði í R:${code(`
x <- 5
y <- c(1, 2, 3, 4)

z_1 <- y[2] * y[3]
z_2 <- x * y[1:3]`)}${abc('Hvert er gildið í <code>z_1</code>?', 'Hvert er gildið í <code>z_2</code>?')}`, [
  ['a) z_1', R`<p>\(2\cdot 3=\) <code>6</code>.</p>`],
  ['b) z_2', '<p><code>y[1:3]</code> er <code>c(1, 2, 3)</code>, svo <code>z_2</code> er <code>c(5, 10, 15)</code>.</p>']
]);

ex('J25', 13, 'L00', `Pakkar og stöðluð föll:${code(`
library(ggplot2)

x <- rpois(1000, lambda=4)

print(mean(x))
print(sd(x))

ggplot(data = data.frame(x), aes(x = x)) +
    geom_histogram(binwidth = 1, fill = "blue", color = "black")`)}${abc('Hvað gerir <code>library(ggplot2)</code>?', 'Hvað gerir <code>rpois(1000, lambda=4)</code>?', 'Hvað gerir skipunin í línum 8 og 9?')}`, [
  ['a) library', '<p>Hleður pakkanum ggplot2 svo föll hans verði aðgengileg.</p>'],
  ['b) rpois', '<p>Dregur 1000 slembitölur úr Poisson-dreifingu með λ = 4.</p>'],
  ['c) ggplot', '<p>Teiknar stuðlarit af x með stólpabreidd 1 (ein stoð á hverja heiltölu), bláum stólpum og svörtum útlínum.</p>']
]);

ex('J25', 14, 'L00', `Skilgreiningar falla:${code(`
fall <- function(a, celcius) {
    if (celcius) {
        result <- (a - 32) * 5/9
    } else {
        result <- (a * 9/5) + 32
    }
}`)}${abc('Hverju skilar <code>fall(35, TRUE)</code>?', 'Hverju skilar <code>fall(35, FALSE)</code>?')}`, [
  ['a) fall(35, TRUE)', R`<p>\((35-32)\cdot 5/9\approx\) <code>1.667</code> (Fahrenheit í Celsíus).</p>`],
  ['b) fall(35, FALSE)', R`<p>\(35\cdot 9/5+32=\) <code>95</code> (Celsíus í Fahrenheit).</p><p class="note">Fallið skilar gildinu ósýnilega því síðasta segðin er úthlutun; í skipanalínunni prentast ekkert nema með <code>print()</code>.</p>`]
]);

ex('J25', 15, 'L00', `Tölfræðipróf og innlestur gagna:${code(`
grade <- read.csv("grades.csv")

r <- t.test(grade$final, mu=5.5, alternative="greater")
print(r)`)}<p>Úttakið:</p>${code(`
        One Sample t-test

data:  grade$final
t = 1.8751, df = 99, p-value = 0.03186
alternative hypothesis: true mean is greater than 5.5
95 percent confidence interval:
 5.53217     Inf
sample estimates:
mean of x
 5.780891`)}${abc('Hvað gerir skipunin í línu 1?', 'Hvað gerir skipunin í línu 3 og hvað má lesa úr niðurstöðunum?')}`, [
  ['a) read.csv', '<p>Les grades.csv í gagnatöfluna <code>grade</code>.</p>'],
  ['b) Einhliða t-próf', R`<p>Einhliða t-próf á dálkinum <code>final</code>: \(H_0:\mu\le 5{,}5\) gegn \(H_1:\mu>5{,}5\). Meðaltalið er 5,78, \(t=1{,}88\), df = 99 (n = 100), p = 0,032.</p><p>p &lt; 0,05: <b>H₀ hafnað</b> við 5%; meðaleinkunnin er marktækt yfir 5,5. Einhliða 95% bilið er (5,53; ∞).</p>`, 3]
]);

// =====================================================================================================
// Lokapróf desember 2025
// =====================================================================================================

ex('D25', 1, 'L01', `Blíðlyndur litli fær að velja leikföng úr verðlaunakassa með 3 plastgormum, 5 skopparaboltum og 4 dótabílum. Hann skilar ekki leikföngum aftur í kassann.${abc(
  'Velji hann eitt leikfang af handahófi, hverjar eru líkurnar á að hann velji <u>ekki</u> dótabíl?',
  'Á hversu marga vegu getur hann valið þrjú leikföng þannig að hann fái fyrst plastgorm, svo dótabíl og síðast dótabíl?')}`, [
  ['a) Ekki dótabíll', R`\[\Pr(B^c)=\frac{12-4}{12}=\tfrac23\approx 0{,}667\]`],
  ['b) Röðuð val án skila', R`\[3\cdot 4\cdot 3=36\]<p>3 gormar í fyrsta val, 4 bílar í annað og 3 bílar eftir í það þriðja.</p>` + trap('Röðin er gefin og ekki skilað: margfaldað, ekki C(n, k).'), 2]
]);

ex('D25', 2, 'L01', `Einn pakki er valinn af handahófi. Pakkar koma frá tveimur dreifingarmiðstöðvum:<ul><li><b>Austurbær</b> með líkur 0,6; þar eru 70% pakkanna litlir.</li><li><b>Vesturbær</b> með líkur 0,4; þar eru 40% pakkanna litlir.</li></ul>${abc(
  'Reiknið líkurnar á að valdi pakkinn sé lítill.', 'Að því gefnu að pakkinn sé lítill, hverjar eru líkurnar á að hann komi frá Austurbæ?')}`, [
  ['a) Heildarlíkur', R`\[\Pr(L)=0{,}6\cdot 0{,}7+0{,}4\cdot 0{,}4=0{,}42+0{,}16=0{,}58\]`],
  ['b) Bayes', R`\[\Pr(A\mid L)=\frac{0{,}42}{0{,}58}\approx 0{,}724\]`, 2]
]);

ex('D25', 3, 'L02', `Slembibreytan \\(X\\) hefur líkindamassafallið${pmf([['0{,}10', '-4'], ['0{,}25', 0], ['0{,}15', 6], ['0{,}30', 10], ['0{,}20', 1000]])}${abc(
  'Finnið dreifingarfall \\(X\\).', 'Reiknið væntigildi \\(X\\).', 'Hverjar eru líkurnar \\(P(X\\ge 7)\\)?')}`, [
  ['a) Dreifingarfall', cdf([R`0 & x<-4`, R`0{,}10 & -4\le x<0`, R`0{,}35 & 0\le x<6`, R`0{,}50 & 6\le x<10`, R`0{,}80 & 10\le x<1000`, R`1 & x\ge 1000`]), 2],
  ['b) E[X]', R`\[E[X]=-4(0{,}1)+0+6(0{,}15)+10(0{,}3)+1000(0{,}2)=203{,}5\]<p>Eitt stórt gildi (1000) ræður væntigildinu.</p>`],
  ['c) P(X ≥ 7)', R`\[P(X\ge 7)=P(X=10)+P(X=1000)=0{,}5\]`]
]);

ex('D25', 4, 'L04', R`Slembibreytan \(Y\) hefur þéttleikafallið \[f(y)=\begin{cases}\tfrac65(y+y^2) & 0\le y\le 1\\0&\text{annars}\end{cases}\]` + abc('Hvert er dreifingarfall \\(Y\\)?', 'Finnið væntigildi \\(Y\\).', 'Finnið dreifni \\(Y\\).', 'Finnið staðalfrávik \\(Y\\).', 'Hverjar eru líkurnar \\(P(0{,}5<Y<0{,}8)\\)?'), [
  ['a) F(y)', R`\[F(y)=\tfrac65\left(\tfrac{y^2}{2}+\tfrac{y^3}{3}\right)=\frac{3y^2+2y^3}{5}\quad(0\le y\le 1)\]<p>0 fyrir neðan, 1 fyrir ofan.</p>`, 2],
  ['b) E[Y]', R`\[E[Y]=\tfrac65\int_0^1(y^2+y^3)\,dy=\tfrac65\cdot\tfrac{7}{12}=0{,}7\]`],
  ['c) Var[Y]', R`\[E[Y^2]=\tfrac65\left(\tfrac14+\tfrac15\right)=0{,}54,\qquad \operatorname{Var}[Y]=0{,}54-0{,}49=0{,}05\]`, 2],
  ['d) Staðalfrávik', R`\[\sigma=\sqrt{0{,}05}\approx 0{,}224\]`],
  ['e) P(0,5 < Y < 0,8)', R`\[F(0{,}8)-F(0{,}5)=\frac{1{,}92+1{,}024}{5}-\frac{0{,}75+0{,}25}{5}=0{,}5888-0{,}2=0{,}389\]`]
]);

ex('D25', 5, 'L05', `Biðtíminn \\(T\\) (í mínútum) eftir staðfestingu rafrænnar greiðslu er jafndreifður á bilinu [1, 5].${abc(
  'Hverjir eru stikar \\(T\\)?', 'Finnið \\(E[T]\\).', 'Finnið \\(\\operatorname{Var}[T]\\).', 'Hverjar eru líkurnar á að greiðsla staðfestist á 2 mínútum eða skemur?')}`, [
  ['a) Stikar', R`\[a=1,\;b=5\]`],
  ['b) E[T]', R`\[E[T]=\tfrac{a+b}{2}=3\]`],
  ['c) Var[T]', R`\[\operatorname{Var}[T]=\tfrac{(b-a)^2}{12}=\tfrac{16}{12}=\tfrac43\approx 1{,}33\]`],
  ['d) P(T ≤ 2)', R`\[P(T\le 2)=\tfrac{2-1}{5-1}=0{,}25\]`]
]);

ex('D25', 6, 'L05', `Árlegur hagvöxtur \\(X\\) (í %) er normaldreifður með meðaltal 2% og staðalfrávik 1,5.${abc(
  'Hverjir eru stikar \\(X\\)?', 'Hverjar eru líkurnar á neikvæðum hagvexti, \\(P(X<0)\\)?', 'Hver er 5% versta sviðsmyndin, þ.e. mörk 5% neðra hlutfallsmarks?')}`, [
  ['a) Stikar', R`\[X\sim N(\mu=2,\;\sigma^2=1{,}5^2=2{,}25)\]` + trap('Seinni stikinn í N(μ, σ²) er dreifnin; pnorm og qnorm taka staðalfrávikið.')],
  ['b) P(X < 0)', R`\[P(X<0)=\Phi\!\left(\frac{0-2}{1{,}5}\right)=\Phi(-1{,}33)\approx 0{,}091\]`, 2],
  ['c) 5% hlutfallsmark', R`\[x_{0{,}05}=\mu-1{,}645\,\sigma=2-1{,}645\cdot 1{,}5\approx -0{,}47\%\]<p>Í R: <code>qnorm(0.05, 2, 1.5)</code>.</p>`, 2]
]);

ex('D25', 7, 'L06', `\\(X\\) og \\(Y\\) eru strjálar með samþéttleikafallið:${grid('f(x,y)', [0, 1, 2], [0, 1, 2], [['0,05', '0,15', '0'], ['0,3', '0', '0,1'], ['0,15', '0,1', '0,15']])}${abc(
  'Finnið samdreifingarfallið \\(F(x,y)\\) á töfluformi.', 'Finnið \\(P(X\\le 1 \\text{ og } Y\\ge 1)\\).', 'Finnið jaðarþéttleikaföllin \\(f_X(x)\\) og \\(f_Y(y)\\).')}`, [
  ['a) F(x, y)', grid('F(x,y)', [0, 1, 2], [0, 1, 2], [['0,05', '0,20', '0,20'], ['0,35', '0,50', '0,60'], ['0,50', '0,75', '1']]), 4],
  ['b) P(X ≤ 1, Y ≥ 1)', R`\[0{,}15+0+0+0{,}1=0{,}25\]`],
  ['c) Jaðardreifingar', R`\[f_X:\;0{,}2,\;0{,}4,\;0{,}4\qquad f_Y:\;0{,}5,\;0{,}25,\;0{,}25\]`, 2]
]);

ex('D25', 8, 'L06', R`\([X,Y]\) hefur samþéttleikafallið \[f(x,y)=\begin{cases}\tfrac14(x+2y) & 0<x<2,\;0<y<1\\0&\text{annars}\end{cases}\]` + abc('Finnið jaðarþéttleikaföllin \\(f_X(x)\\) og \\(f_Y(y)\\).', 'Finnið \\(f_{X|Y}(x\\mid y)\\).', 'Reiknið \\(\\operatorname{Cov}[X,Y]\\). Gefið: \\(E[XY]=\\tfrac23\\).', 'Hvað segir c) um samband breytanna? Eru þær háðar eða óháðar?'), [
  ['a) Jaðarþéttleikar', R`\[f_X(x)=\int_0^1\tfrac14(x+2y)\,dy=\tfrac{x+1}{4},\;0<x<2\qquad f_Y(y)=\int_0^2\tfrac14(x+2y)\,dx=\tfrac{1+2y}{2},\;0<y<1\]`, 2],
  ['b) f(x | y)', R`\[f_{X|Y}(x\mid y)=\frac{(x+2y)/4}{(1+2y)/2}=\frac{x+2y}{2(1+2y)},\quad 0<x<2\]`, 2],
  ['c) Cov[X, Y]', R`\[E[X]=\int_0^2\tfrac{x(x+1)}{4}dx=\tfrac76,\qquad E[Y]=\int_0^1\tfrac{y(1+2y)}{2}dy=\tfrac{7}{12}\]\[\operatorname{Cov}[X,Y]=\tfrac23-\tfrac76\cdot\tfrac7{12}=\tfrac{48-49}{72}=-\tfrac{1}{72}\approx -0{,}0139\]`, 3],
  ['d) Háðar', R`<p><b>Háðar:</b> \(\operatorname{Cov}\ne 0\) þýðir að breyturnar eru háðar (veikt neikvætt samband). Það sést líka á því að \(f_{X|Y}\) fer eftir y.</p>` + trap('Cov ≠ 0 ⇒ háðar, en Cov = 0 sannar ekki óhæði.')]
]);

ex('D25', 9, 'L09', `Mánaðarleg rafmagnseyðsla fjögurra heimila (í þúsundum króna):<p class="mono" style="text-align:center">15 &nbsp; 22 &nbsp; 20 &nbsp; 19</p>${abc(
  'Reiknið meðaltal úrtaksins.', 'Reiknið dreifni úrtaksins.', 'Reiknið staðalfrávik úrtaksins.', 'Reiknið 90% tvíhliða öryggismörk fyrir meðaltalið, að því gefnu að eyðslan sé normaldreifð.')}`, [
  ['a) Meðaltal', R`\[\bar x=\tfrac{76}{4}=19\]`],
  ['b) Dreifni', R`<p>Frávik: −4, 3, 1, 0.</p>\[s^2=\frac{16+9+1+0}{3}=\frac{26}{3}\approx 8{,}67\]`],
  ['c) Staðalfrávik', R`\[s\approx 2{,}944\]`],
  ['d) 90% öryggisbil', R`\[19\pm t_{3;\,0{,}05}\frac{2{,}944}{\sqrt4}=19\pm 2{,}353\cdot 1{,}472=19\pm 3{,}46\;\Rightarrow\;(15{,}54;\;22{,}46)\]`, 2]
]);

ex('D25', 10, 'L09', `Óþekkt barna (á kvarðanum 1–5) í tveimur könnunum:${tbl(['', 'Desember 1980', 'Desember 2020'], [['Meðalóþekkt', '3,5', '3'], ['Dreifni óþekktar', '1,1', '0,5'], ['Fjöldi barna', '19', '26']])}${abc(
  'Prófið hvort meðalóþekkt barna í desember 1980 sé hærri en 3 miðað við 5% marktækni.',
  'Prófið hvort börn 1980 hafi verið óþekkari en börn 2020 miðað við 10% marktækni.',
  'Hvernig túlkið þið niðurstöðurnar? Hvaða tilgátum byggja prófin á? Er fullyrðing vikublaðsins um að unga kynslóðin í dag hagi sér verr rétt?')}`, [
  ['a) Einhliða próf', R`<p>\(H_0:\mu\le 3\) gegn \(H_1:\mu>3\).</p>\[T=\frac{3{,}5-3}{\sqrt{1{,}1/19}}=\frac{0{,}5}{0{,}2406}\approx 2{,}08>t_{18;\,0{,}05}=1{,}734\]<p><b>H₀ hafnað</b>: börn voru að jafnaði óþekk 1980.</p>`, 5],
  ['b) Welch-próf (einhliða)', R`\[T=\frac{3{,}5-3}{\sqrt{\frac{1{,}1}{19}+\frac{0{,}5}{26}}}=\frac{0{,}5}{0{,}2777}\approx 1{,}80\]<p>Welch-frígráður ≈ 29,6, \(t_{0{,}10}\approx 1{,}31\). \(1{,}80>1{,}31\): <b>H₀ hafnað</b>; börn 1980 voru marktækt óþekkari.</p>`, 5],
  ['c) Túlkun', '<p>Gögnin styðja ekki fullyrðinguna; ef eitthvað er voru börnin óþekkari 1980. Prófin gera ráð fyrir óháðum slembiúrtökum og nálgað normaldreifðum meðaltölum; Welch gerir ekki ráð fyrir jafnri dreifni.</p>', 5]
]);

ex('D25', 11, 'L08', `Fjöldi farþega í strætó á dag (Y) og bensínverð (X, kr./l):${tbl(['Athugun', '1', '2', '3'], [['Farþegar (Y)', '3200', '3600', '3400'], ['Bensínverð (X)', '260', '280', '270']])}<p>Gert er ráð fyrir línulegu sambandi \\(Y=\\alpha+\\beta X\\).</p>${abc(
  'Metið \\(\\hat\\alpha\\) og \\(\\hat\\beta\\) með aðferð minnstu kvaðrata.', 'Hver er spá líkansins þegar bensínverð er 330 kr./l?',
  'Gefið er \\(\\operatorname{Var}(\\hat\\beta)=42\\). Prófið \\(H_0:\\beta=0\\) gegn \\(H_1:\\beta\\ne 0\\) við 5% marktækni. Frígráður eru n − 2.', 'Hvað segir matið á β um sambandið?')}`, [
  ['a) Minnstu kvaðröt', R`<p>\(\bar x=270\), \(\bar y=3400\). Frávik x: −10, 10, 0; frávik y: −200, 200, 0.</p>\[\hat\beta=\frac{\sum(x_i-\bar x)(y_i-\bar y)}{\sum(x_i-\bar x)^2}=\frac{4000}{200}=20,\qquad \hat\alpha=3400-20\cdot 270=-2000\]`, 4],
  ['b) Spá', R`\[\hat y=-2000+20\cdot 330=4600\]`],
  ['c) t-próf á β', R`\[T=\frac{20}{\sqrt{42}}\approx 3{,}09,\qquad t_{1;\,0{,}025}=12{,}706\]<p>\(|T|<12{,}7\): <b>ekki hægt að hafna</b> \(H_0\).</p>` + trap('n − 2 = 1 frígráða gefur mjög hátt gagnrýnigildi.'), 3],
  ['d) Túlkun', '<p>Hver króna í bensínverði tengist 20 fleiri farþegum á dag, en með þremur athugunum er það ekki marktækt; gögnin duga ekki til að álykta um sambandið.</p>', 2]
]);

ex('D25', 12, 'L00', `Grunnatriði í R:${code(`
x <- 20
y <- c("a", "b", "c", "2")

z_1 <- y[4]
z_2 <- x^2`)}${abc('Hvert er gildið í <code>z_1</code>?', 'Hvert er gildið í <code>z_2</code>?')}`, [
  ['a) z_1', '<p>Strengurinn <code>"2"</code>, ekki talan 2: vigur í R hefur eitt tag, og hér er það character.</p>'],
  ['b) z_2', '<p><code>400</code></p>']
]);

ex('D25', 13, 'L00', `Pakkar og stöðluð föll:${code(`
library(wooldrige)

data(wage1)

reg <- lm(wage ~ educ, data = wage1)
summary(reg)`)}${abc('Hvað gerir <code>library(wooldrige)</code> (skipunin sjálf)?', 'Hvað gerir <code>lm(wage ~ educ, data = wage1)</code>?', 'Hvað gerir <code>summary(reg)</code>?')}`, [
  ['a) library', '<p>Hleður pakka svo föll hans og gögn verði aðgengileg. (Pakkinn heitir raunar <code>wooldridge</code>; með stafsetningunni á prófinu kæmi villa.)</p>'],
  ['b) lm', '<p>Metur línulegt aðhvarf (minnstu kvaðröt) á laun (wage) eftir menntun (educ) í gögnunum wage1 og geymir líkanið í <code>reg</code>.</p>'],
  ['c) summary', '<p>Birtir niðurstöður líkansins: stuðla, staðalvillur, t-gildi, p-gildi og R².</p>']
]);

ex('D25', 14, 'L00', `Skilgreiningar falla:${code(`
vigravinnsla <- function(v) {
    if (length(v) >= 3) {
        utkoma <- mean(v)
    } else {
        utkoma <- sum(v)
    }
    return(utkoma)
}`)}${abc('Hvaða gildi birtir <code>print(vigravinnsla(c(0, 20)))</code>?', 'Hvaða gildi birtir <code>print(vigravinnsla(c(1, 1, 1, 1)))</code>?')}`, [
  ['a) Tvö stök', '<p>Lengd 2 &lt; 3, svo summan: <code>20</code>.</p>'],
  ['b) Fjögur stök', '<p>Lengd 4 ≥ 3, svo meðaltalið: <code>1</code>.</p>']
]);

ex('D25', 15, 'L00', `Tölfræðipróf og innlestur gagna:${code(`
library(tseries)
hp <- read.csv("house_price.csv")

res <- jarque.bera.test(hp$price)
print(res)`)}<p>Úttakið:</p>${code(`
        Jarque Bera Test

data:  hp$price
X-squared = 165.28, df = 2, p-value < 2.2e-16`)}${abc('Hvað gerir skipunin í línu 2?', 'Hvað gerir <code>jarque.bera.test(hp$price)</code> og hvað má lesa úr niðurstöðunum?')}`, [
  ['a) read.csv', '<p>Les house_price.csv í gagnatöfluna <code>hp</code>.</p>'],
  ['b) Jarque–Bera', R`<p>Prófar hvort verðið sé normaldreift út frá skeifni og ris: \(H_0\): normaldreifing. Undir \(H_0\) er JB \(\sim\chi^2_2\). JB = 165,3 og p &lt; 2,2·10⁻¹⁶: <b>H₀ hafnað</b>; húsaverð er ekki normaldreift.</p>`, 3]
]);

// =====================================================================================================
// Endurtökupróf janúar 2026
// =====================================================================================================

ex('J26', 1, 'L01', `Í Félagi þorpara eru 5 ræningjar (2 bankaræningjar og 3 sjóræningjar) og 7 þjófar (3 gullþjófar og 4 vasaþjófar).${abc(
  'Ef allir eru jafnlíklegir til að verða þorpari ársins, hverjar eru líkurnar á að hann sé <u>ekki</u> sjóræningi?',
  'Skipa á 4 manna nefnd með 2 ræningjum og 2 þjófum. Á hversu marga vegu er það hægt?')}`, [
  ['a) Ekki sjóræningi', R`\[1-\tfrac{3}{12}=\tfrac{9}{12}=0{,}75\]`],
  ['b) Nefndin', R`\[\binom52\binom72=10\cdot 21=210\]`, 2]
]);

ex('J26', 2, 'L01', `75% kortafærslna eru einstaklingsfærslur og 25% fyrirtækjafærslur. Kerfið merkir 2% einstaklingsfærslna og 7% fyrirtækjafærslna sem grunsamlegar. Ein færsla er valin af handahófi.${abc(
  'Reiknið líkurnar á að færslan hafi verið merkt grunsamleg.', 'Að því gefnu að hún hafi verið merkt, hverjar eru líkurnar á að hún sé fyrirtækjafærsla?')}`, [
  ['a) Heildarlíkur', R`\[\Pr(G)=0{,}75\cdot 0{,}02+0{,}25\cdot 0{,}07=0{,}015+0{,}0175=0{,}0325\]`],
  ['b) Bayes', R`\[\Pr(F\mid G)=\frac{0{,}0175}{0{,}0325}\approx 0{,}538\]`, 2]
]);

ex('J26', 3, 'L02', `Slembibreytan \\(X\\) hefur líkindamassafallið${pmf([['0{,}5', '-4'], ['0{,}1', '-2'], ['0{,}1', 1], ['0{,}2', 3], ['0{,}1', 8]])}${abc(
  'Finnið dreifingarfall \\(X\\).', 'Reiknið væntigildi \\(X\\).', 'Hverjar eru líkurnar \\(P(X>1)\\)?')}`, [
  ['a) Dreifingarfall', cdf([R`0 & x<-4`, R`0{,}5 & -4\le x<-2`, R`0{,}6 & -2\le x<1`, R`0{,}7 & 1\le x<3`, R`0{,}9 & 3\le x<8`, R`1 & x\ge 8`]), 2],
  ['b) E[X]', R`\[E[X]=-4(0{,}5)-2(0{,}1)+1(0{,}1)+3(0{,}2)+8(0{,}1)=-0{,}7\]`],
  ['c) P(X > 1)', R`\[P(X>1)=1-F(1)=0{,}3\]` + trap('X > 1 útilokar X = 1.')]
]);

ex('J26', 4, 'L04', R`Slembibreytan \(Y\) hefur þéttleikafallið \[f(y)=\begin{cases}2(1-y) & 0\le y\le 1\\0&\text{annars}\end{cases}\]` + abc('Hvert er dreifingarfall \\(Y\\)?', 'Finnið væntigildi \\(Y\\).', 'Finnið dreifni \\(Y\\).', 'Finnið staðalfrávik \\(Y\\).', 'Hverjar eru líkurnar \\(P(0{,}1<Y<0{,}2)\\)?'), [
  ['a) F(y)', R`\[F(y)=\int_0^y 2(1-t)\,dt=2y-y^2\quad(0\le y\le 1)\]<p>0 fyrir neðan, 1 fyrir ofan.</p>`, 2],
  ['b) E[Y]', R`\[E[Y]=\int_0^1 2y(1-y)\,dy=2\left(\tfrac12-\tfrac13\right)=\tfrac13\]`],
  ['c) Var[Y]', R`\[E[Y^2]=2\left(\tfrac13-\tfrac14\right)=\tfrac16,\qquad\operatorname{Var}[Y]=\tfrac16-\tfrac19=\tfrac{1}{18}\approx 0{,}0556\]`, 2],
  ['d) Staðalfrávik', R`\[\sigma=\sqrt{1/18}\approx 0{,}236\]`],
  ['e) P(0,1 < Y < 0,2)', R`\[F(0{,}2)-F(0{,}1)=0{,}36-0{,}19=0{,}17\]`]
]);

ex('J26', 5, 'L03', `Líkurnar á að einstaklingur í áskrift mæti í ræktina einu sinni eða oftar í gefnum mánuði eru 0,4. \\(X\\) er fjöldi mánaða af 12 þar sem hann mætir og er tvíkostadreifð.${abc(
  'Hverjir eru stikar \\(X\\)?', 'Finnið væntigildi \\(X\\).', 'Finnið dreifni \\(X\\).', 'Hverjar eru líkurnar á að hann mæti einu sinni eða tvisvar á ári?')}`, [
  ['a) Stikar', R`\[X\sim\text{Bin}(n=12,\;p=0{,}4)\]`],
  ['b) E[X]', R`\[E[X]=12\cdot 0{,}4=4{,}8\]`],
  ['c) Var[X]', R`\[\operatorname{Var}[X]=12\cdot 0{,}4\cdot 0{,}6=2{,}88\]`],
  ['d) P(X = 1 eða 2)', R`\[12(0{,}4)(0{,}6)^{11}+\tbinom{12}{2}(0{,}4)^2(0{,}6)^{10}\approx 0{,}0174+0{,}0639=0{,}0813\]<p>Í R: <code>sum(dbinom(1:2, 12, 0.4))</code>.</p>`, 2]
]);

ex('J26', 6, 'L05', `Áhrif tveggja <u>óháðra</u> aðgerða á verðbólgu: \\(X\\) er normaldreifð með meðaltal 0,6 og staðalfrávik 0,4; \\(Y\\) er normaldreifð með meðaltal −0,3 og staðalfrávik 0,5.${abc(
  'Hverjir eru stikar \\(X\\) og \\(Y\\)?', 'Hverjar eru líkurnar \\(P(X>0)\\)?', 'Látum \\(I=X+Y\\). Hverjar eru líkurnar \\(P(I>0{,}5)\\)?')}`, [
  ['a) Stikar', R`\[X\sim N(0{,}6;\;0{,}4^2),\qquad Y\sim N(-0{,}3;\;0{,}5^2)\]`],
  ['b) P(X > 0)', R`\[P(X>0)=1-\Phi\!\left(\frac{0-0{,}6}{0{,}4}\right)=\Phi(1{,}5)\approx 0{,}933\]`],
  ['c) Summa óháðra', R`\[I\sim N(0{,}6-0{,}3;\;0{,}16+0{,}25)=N(0{,}3;\;0{,}41),\quad \sigma_I\approx 0{,}640\]\[P(I>0{,}5)=1-\Phi\!\left(\frac{0{,}2}{0{,}640}\right)=1-\Phi(0{,}31)\approx 0{,}377\]` + trap('Dreifnirnar leggjast saman, ekki staðalfrávikin: σ_I ≠ 0,4 + 0,5.'), 3]
]);

ex('J26', 7, 'L06', `\\(X\\) og \\(Y\\) eru strjálar með samþéttleikafallið:${grid('f(x,y)', ['-1', 0, 1], [0, 1], [['0,10', '0,20'], ['0,15', '0,15'], ['0,10', '0,30']])}${abc(
  'Finnið samdreifingarfallið \\(F(x,y)\\) á töfluformi.', 'Finnið \\(P(X\\le 0 \\text{ og } Y=1)\\).', 'Finnið jaðarþéttleikaföllin \\(f_X(x)\\) og \\(f_Y(y)\\).')}`, [
  ['a) F(x, y)', grid('F(x,y)', ['-1', 0, 1], [0, 1], [['0,10', '0,30'], ['0,25', '0,60'], ['0,35', '1']]), 4],
  ['b) P(X ≤ 0, Y = 1)', R`\[0{,}20+0{,}15=0{,}35\]`],
  ['c) Jaðardreifingar', R`\[f_X:\;0{,}3,\;0{,}3,\;0{,}4\qquad f_Y:\;0{,}35,\;0{,}65\]`, 2]
]);

ex('J26', 8, 'L06', R`\([X,Y]\) hefur samþéttleikafallið \[f(x,y)=\begin{cases}\tfrac14xy & 0<x<2,\;0<y<2\\0&\text{annars}\end{cases}\]` + abc('Finnið jaðarþéttleikaföllin \\(f_X(x)\\) og \\(f_Y(y)\\).', 'Finnið \\(f_{X|Y}(x\\mid y)\\).', 'Reiknið \\(\\operatorname{Cov}[X,Y]\\). Gefið: \\(E[XY]=\\tfrac{16}{9}\\).', 'Eru \\(X\\) og \\(Y\\) háðar eða óháðar?'), [
  ['a) Jaðarþéttleikar', R`\[f_X(x)=\int_0^2\tfrac14xy\,dy=\tfrac x2,\;0<x<2,\qquad f_Y(y)=\tfrac y2,\;0<y<2\]`, 2],
  ['b) f(x | y)', R`\[f_{X|Y}(x\mid y)=\frac{xy/4}{y/2}=\frac x2,\quad 0<x<2\]`, 2],
  ['c) Cov[X, Y]', R`\[E[X]=E[Y]=\int_0^2\tfrac{x^2}{2}dx=\tfrac43,\qquad\operatorname{Cov}[X,Y]=\tfrac{16}{9}-\tfrac43\cdot\tfrac43=0\]`, 3],
  ['d) Óháðar', R`<p><b>Óháðar:</b> \(f(x,y)=\tfrac x2\cdot\tfrac y2=f_X(x)f_Y(y)\) og \(f_{X|Y}=f_X\). Cov = 0 samræmist því.</p>` + trap('Cov = 0 eitt og sér sannar ekki óhæði; rökin eru þáttunin.')]
]);

ex('J26', 9, 'L09', `Mánaðarlegt leiguverð úr fjórum leigusamningum (í þúsundum króna):<p class="mono" style="text-align:center">230 &nbsp; 160 &nbsp; 170 &nbsp; 120</p>${abc(
  'Reiknið meðaltal úrtaksins.', 'Reiknið dreifni úrtaksins.', 'Reiknið staðalfrávik úrtaksins.', 'Reiknið 95% tvíhliða öryggismörk fyrir meðalleiguverð, að því gefnu að það sé normaldreift.')}`, [
  ['a) Meðaltal', R`\[\bar x=\tfrac{680}{4}=170\]`],
  ['b) Dreifni', R`<p>Frávik: 60, −10, 0, −50.</p>\[s^2=\frac{3600+100+0+2500}{3}=\frac{6200}{3}\approx 2066{,}7\]`],
  ['c) Staðalfrávik', R`\[s\approx 45{,}46\]`],
  ['d) 95% öryggisbil', R`\[170\pm t_{3;\,0{,}025}\frac{45{,}46}{2}=170\pm 3{,}182\cdot 22{,}73=170\pm 72{,}3\;\Rightarrow\;(97{,}7;\;242{,}3)\]`, 2]
]);

ex('J26', 10, 'L09', `Hagnaður fjölskyldufyrirtækis (m.kr.) fyrir og eftir endurskipulagningu:${tbl(['', 'Fyrir', 'Eftir'], [['Meðalhagnaður', '4,2', '3,1'], ['Dreifni hagnaðar', '1,6', '1,2'], ['Fjöldi ára', '22', '10']])}${abc(
  'Prófið við 10% marktækni hvort fyrirtækið hafi að jafnaði skilað hagnaði fyrir endurskipulagninguna (meðaltal hærra en 0).',
  'Prófið við 5% marktækni hvort meðalhagnaður hafi aukist eftir endurskipulagninguna.',
  'Hvernig túlkið þið niðurstöðurnar? Skiluðu breytingarnar árangri?')}`, [
  ['a) Einhliða próf', R`\[T=\frac{4{,}2-0}{\sqrt{1{,}6/22}}=\frac{4{,}2}{0{,}270}\approx 15{,}6>t_{21;\,0{,}10}=1{,}323\]<p><b>H₀ hafnað</b>: hagnaðurinn var jákvæður.</p>`, 5],
  ['b) Welch-próf (einhliða)', R`<p>\(H_0:\mu_{\text{eftir}}\le\mu_{\text{fyrir}}\) gegn \(H_1:\mu_{\text{eftir}}>\mu_{\text{fyrir}}\).</p>\[T=\frac{3{,}1-4{,}2}{\sqrt{\frac{1{,}2}{10}+\frac{1{,}6}{22}}}=\frac{-1{,}1}{0{,}439}\approx -2{,}51\]<p>T er neikvætt en \(H_1\) segir „aukist“: <b>ekki hægt að hafna</b> \(H_0\) (gagnrýnigildi \(t_{20;\,0{,}05}\approx 1{,}72\)).</p>` + trap('Stefna T: stórt neikvætt T hafnar ekki H₀ þegar H₁ segir „stærra“.'), 5],
  ['c) Túlkun', '<p>Fyrirtækið skilaði hagnaði fyrir breytingarnar, en ekkert bendir til að hann hafi aukist; meðaltalið lækkaði um 1,1 m.kr. (í tvíhliða prófi væri lækkunin marktæk, |T| = 2,51 &gt; 2,09). Ráðgjöfin skilaði ekki árangri. Forsendur: óháð ár og nálgað normaldreifður hagnaður.</p>', 5]
]);

ex('J26', 11, 'L08', `Útflutningsverðmæti (Y, ma.kr.) og gengisvísitala (X):${tbl(['Athugun', '1', '2', '3'], [['Útflutningur (Y)', '550', '545', '540'], ['Gengisvísitala (X)', '180', '200', '190']])}<p>Gert er ráð fyrir línulegu sambandi \\(Y=\\alpha+\\beta X\\).</p>${abc(
  'Metið \\(\\hat\\alpha\\) og \\(\\hat\\beta\\) með aðferð minnstu kvaðrata.', 'Hver er spá líkansins þegar gengisvísitalan er 205?',
  'Gefið er \\(\\operatorname{Var}(\\hat\\beta)=400\\). Prófið \\(H_0:\\beta=0\\) gegn \\(H_1:\\beta\\ne 0\\) við 5% marktækni. Frígráður eru n − 2.', 'Hvað segir matið á β um sambandið?')}`, [
  ['a) Minnstu kvaðröt', R`<p>\(\bar x=190\), \(\bar y=545\). Frávik x: −10, 10, 0; frávik y: 5, 0, −5.</p>\[\hat\beta=\frac{(-10)(5)+(10)(0)+(0)(-5)}{100+100}=\frac{-50}{200}=-0{,}25,\qquad\hat\alpha=545+0{,}25\cdot 190=592{,}5\]` + trap('Athugun 3 er ekki í röð eftir X; parið saman rétt gildi.'), 4],
  ['b) Spá', R`\[\hat y=592{,}5-0{,}25\cdot 205=541{,}25\]`],
  ['c) t-próf á β', R`\[T=\frac{-0{,}25}{\sqrt{400}}=-0{,}0125,\qquad |T|<t_{1;\,0{,}025}=12{,}706\]<p><b>Ekki hægt að hafna</b> \(H_0\).</p>`, 3],
  ['d) Túlkun', '<p>Matið bendir til lítils neikvæðs sambands (útflutningur lækkar um 0,25 ma.kr. við hækkun vísitölunnar um eitt stig), en það er hvergi nærri marktækt; ekki er hægt að álykta um samband.</p>', 2]
]);

ex('J26', 12, 'L00', `Grunnatriði í R:${code(`
x <- "Likindafraedi"
y <- c(5, 20, -1, 60)
x <- "Forritun"

z_1 <- y[1] + y[3]
z_2 <- x`)}${abc('Hvert er gildið í <code>z_1</code>?', 'Hvert er gildið í <code>z_2</code>?')}`, [
  ['a) z_1', R`<p>\(5+(-1)=\) <code>4</code>.</p>`],
  ['b) z_2', '<p><code>"Forritun"</code>: x var yfirskrifað í línu 3.</p>']
]);

ex('J26', 13, 'L00', `Pakkar og stöðluð föll:${code(`
library(ggplot2)

returns <- rnorm(50, mean = 0, sd = 0.01)

df <- data.frame(
  index = 1:length(returns),
  returns = returns
)

ggplot(df, aes(x = index, y = returns)) +
  geom_line()`)}${abc('Hvað gerir <code>library(ggplot2)</code> (skipunin sjálf)?', 'Hvað gerir <code>rnorm(50, mean = 0, sd = 0.01)</code>?')}`, [
  ['a) library', '<p>Hleður pakkanum ggplot2 svo föll hans verði aðgengileg.</p>'],
  ['b) rnorm', '<p>Dregur 50 slembitölur úr normaldreifingu með meðaltal 0 og staðalfrávik 0,01 (t.d. hermd dagleg ávöxtun). Síðustu línurnar teikna þær sem línurit eftir röð.</p>']
]);

ex('J26', 14, 'L00', `Skilgreiningar falla:${code(`
mitt_fall <- function(x) {
    if (sum(x[1:4]) > 10) {
        x <- x * 2
    }
    return(x[1:4])
}`)}${abc('Hvaða gildi birtir <code>print(mitt_fall(c(0, 5, 10, 1)))</code>?', 'Hvaða gildi birtir <code>print(mitt_fall(c(0, 5, 3, 1, 5)))</code>?')}`, [
  ['a) Summa 16', '<p>0 + 5 + 10 + 1 = 16 &gt; 10, svo x tvöfaldast: <code>0 10 20 2</code>.</p>'],
  ['b) Summa 9', '<p>Aðeins fyrstu fjögur stökin teljast: 0 + 5 + 3 + 1 = 9 ≤ 10. Fallið skilar fyrstu fjórum: <code>0 5 3 1</code>.</p>']
]);

ex('J26', 15, 'L00', `Tölfræðipróf og innlestur gagna:${code(`
library(readxl)
wages <- read_excel("wages_is.xlsx", sheet = "data")

public <- wages$wage_isk[wages$sector == "public"]
private <- wages$wage_isk[wages$sector == "private"]

res <- t.test(public, private)
print(res)`)}<p>Úttakið:</p>${code(`
        Welch Two Sample t-test

data:  public and private
t = -2.04, df = 58.9, p-value = 0.046
alternative hypothesis: true difference in means is not equal to 0
95 percent confidence interval:
 -120500  -1800
sample estimates:
mean of x mean of y
   720300    781100`)}${abc('Hvað gerir skipunin í línu 2?', 'Hvað gerir <code>t.test(public, private)</code> og hvað má lesa úr niðurstöðunum?')}`, [
  ['a) read_excel', '<p>Les blaðið „data“ úr Excel-skránni wages_is.xlsx (fall úr readxl) í gagnatöfluna <code>wages</code>.</p>'],
  ['b) Welch t-próf', R`<p>Tvíhliða Welch t-próf á því hvort meðallaun í opinbera geiranum og einkageiranum séu jöfn. Meðaltöl 720.300 og 781.100 kr.; \(t=-2{,}04\), df ≈ 59, p = 0,046.</p><p>p &lt; 0,05: <b>H₀ hafnað</b> við 5% (en ekki við 1%): laun í opinbera geiranum eru marktækt lægri. 95% bilið fyrir muninn, (−120.500; −1.800), inniheldur ekki 0.</p>`, 3]
]);

// =====================================================================================================
// Prófsnið og upplýsingar
// =====================================================================================================

const ids = paper => ITEMS.filter(i => i.paper === paper).map(i => i.id);
const NOTICE = 'Skrifaðu allar lausnir á blað með millireikningum. Reiknivél, formúlublað og töflur fyrir N, t, χ² og F eru leyfð (töflurnar eru á Blaðinu).';

const FORMATS = [
  { id: 'mix', name: 'Blandað lokapróf', desc: 'Sama snið og vægi og síðustu fjögur próf: 15 dæmi, hvert dregið úr einu prófanna fjögurra, svo samsetningin er ný í hvert sinn.', style: 'written', minutes: 180, notice: NOTICE,
    pick: { by: 'blueprint', sections: W24.map((w, i) => ({ ids: ['D24', 'J25', 'D25', 'J26'].map(p => `${p}-${i + 1}`), weight: w })) } },
  { id: 'D25', name: 'Lokapróf desember 2025', desc: 'Nýjasta lokaprófið: Bayes, jafndreifing, normaldreifing, samdreifni, minnstu kvaðröt og Jarque–Bera í R. Vægi dæma er ekki gefið; notað er vægi 2024.', style: 'written', minutes: 180, notice: NOTICE, pick: { by: 'fixed', ids: ids('D25') } },
  { id: 'J26', name: 'Endurtökupróf janúar 2026', desc: 'Summa óháðra normalbreyta, óháðar samfelldar breytur, minnstu kvaðröt og Welch í R. Vægi dæma er ekki gefið; notað er vægi 2024.', style: 'written', minutes: 180, notice: NOTICE, pick: { by: 'fixed', ids: ids('J26') } },
  { id: 'D24', name: 'Lokapróf desember 2024', desc: 'Veldis- og tvíkostadreifing, skilyrtar dreifingar, hlutföll með F-prófi og sennileikamat á Poisson.', style: 'written', minutes: 180, notice: NOTICE, pick: { by: 'fixed', ids: ids('D24') } },
  { id: 'J25', name: 'Endurtökupróf janúar 2025', desc: 'Poisson, normalnálgun tvíkostadreifingar, einhliða próf í öfuga átt og sennileikamat á Bernoulli.', style: 'written', minutes: 180, notice: NOTICE, pick: { by: 'fixed', ids: ids('J25') } }
];

const SLOTS = [
  ['1', 'Líkindafræði', '5–6,5', 'L01', 'Skilyrt líkindi úr talningu, fyllimengi („ekki … ekki“) og fjöldi hópa með \\(\\binom nk\\)'],
  ['2', 'Líkindafræði', '3,5–5', 'L01', 'Heildarlíkur og Bayes úr tveimur eða þremur hópum'],
  ['3', 'Slembibreytur', '5', 'L02', 'Strjált PMF: CDF sem þrepafall, E[X] og P(a ≤ X ≤ b)'],
  ['4', 'Slembibreytur', '10', 'L04', 'Samfellt PDF: F(y), E, Var, staðalfrávik og miðgildi, hlutfallsmark eða P(a &lt; Y &lt; b)'],
  ['5', 'Staðlaðar dreifingar', '5', 'L03, L05', 'Veldis-, Poisson-, jafn- eða tvíkostadreifing: stiki, E, Var og ein líkindi'],
  ['6', 'Staðlaðar dreifingar', '10', 'L03, L05', 'Tvíkosta- eða normaldreifing; normalnálgun, hlutfallsmark eða summa óháðra normalbreyta'],
  ['7', 'Marvíðar dreifingar', '10', 'L06', 'Tafla f(x, y): F(x, y) á töfluformi, P(X ≤ a og Y ≥ b) og jaðardreifingar'],
  ['8', 'Skilyrtar dreifingar', '10', 'L06', 'Samfellt f(x, y): jaðarþéttleikar, f(x | y), líkindi eða Cov, háðar eða óháðar'],
  ['9', 'Úrtök og tilgátur', '5', 'L09', 'Meðaltal, s² (n − 1), s og tvíhliða t-öryggisbil (90, 95 eða 99%)'],
  ['10', 'Úrtök og tilgátur', '15', 'L09', 'Einhliða t-próf, Welch-próf á mun, F-próf á dreifni og túlkun'],
  ['11', 'Metlar', '10', 'L08', 'Sennileikamat (Poisson, Bernoulli) eða minnstu kvaðröt með t-prófi á β (df = n − 2)'],
  ['12', 'R', '2', 'L00', 'Gildi breyta eftir keyrslu: vísar, vigrar, strengir'],
  ['13', 'R', '2', 'L00', 'library, rnorm/rpois, ggplot, lm og summary'],
  ['14', 'R', '2', 'L00', 'Fall með if/else: hvað prentast'],
  ['15', 'R', '4', 'L00', 'Innlestur (read.csv, read_excel) og túlkun á úttaki t.test eða jarque.bera.test']
];

const SECTION_HTML = `<section><h2><span class="n">P</span>Snið lokaprófsins</h2><p class="hint">Fjögur síðustu prófin (des. 2024, jan. 2025, des. 2025, jan. 2026) hafa öll sama snið: 15 skrifleg dæmi í 8 hlutum á 3 klst. Sama spurningin kemur aftur með nýjum tölum.</p><div class="scroll"><table class="tt"><thead><tr><th>Dæmi</th><th>Alltaf spurt um</th><th>Vægi %</th></tr></thead><tbody>${SLOTS.map(r => `<tr><td class="mono">${r[0]}</td><td>${r[4]}<div class="hint">${r[1]} · ${r[3]}</div></td><td class="mono">${r[2]}</td></tr>`).join('')}</tbody></table></div><h3>Vægi eftir fyrirlestrum</h3><p>L06 marvíðar og skilyrtar dreifingar 20% · L09 öryggisbil og tilgátupróf 20% · L00 R 10% · L01 líkindi 10% · L04 samfelldar breytur 10% · L08 metlar 10% · L03 og L05 staðlaðar dreifingar 15% saman · L02 strjálar breytur 5%. L07 (úrtaksdreifing X̄) er grunnurinn að dæmum 9 og 10.</p><h3>Gildrur úr gömlu prófunum</h3><ul><li>Einhliða próf þar sem T fer í öfuga átt (jan. 2025 10a, jan. 2026 10b): H₀ er ekki hafnað, hversu stórt sem |T| er.</li><li>Sama tala í tveimur liðum sannar ekki óhæði (des. 2024, 8e): berðu f(x | y) saman við f<sub>X</sub>(x) fyrir öll y.</li><li>Minnstu kvaðröt með þremur athugunum: df = n − 2 = 1 og t = 12,706.</li><li>Summa óháðra normalbreyta: dreifnirnar leggjast saman, ekki staðalfrávikin.</li><li>R: fall sem endar á úthlutun skilar gildinu ósýnilega; <code>print()</code> birtir það. <code>read.csv()</code> án <code>&lt;-</code> geymir ekkert.</li><li>R: <code>c("a", "b", "c", "2")[4]</code> er strengurinn "2", ekki talan.</li></ul></section>`;

export default {
  items: ITEMS,
  examFormats: {
    prepend: FORMATS,
    edit: { blandad: { name: 'Sérsniðið æfingapróf', desc: 'Krossar, tölusvör og skrifleg dæmi úr glærum, dæmablöðum og nýjum spurningum. Þú velur fyrirlestra, blöndu og lengd. Gömlu prófin eru ekki með hér.' } }
  },
  examInfo: {
    format: 'Fjögur síðustu prófin hafa sama snið: 15 skrifleg dæmi á 3 klst. Líkindi 10%, slembibreytur 15%, staðlaðar dreifingar 15%, marvíðar og skilyrtar dreifingar 20%, úrtök og tilgátur 20%, metlar 10% og R 10%.',
    facts: [
      { value: '3 klst.', label: '1. desember kl. 13:30' },
      { value: '15 dæmi', label: 'sama snið á fjórum síðustu prófum' },
      { value: '70%', label: 'af einkunn; verkefnin (30%) gilda aðeins ef þú færð ≥ 5' },
      { value: '+ blað', label: 'Reiknivél, formúlublað og töflur fyrir N/t/χ²/F' }
    ]
  },
  // Sniðið er ekki lengur óstaðfest: línan fer úr „Óstaðfest“-reitnum á forsíðunni og neðst á Blaðinu.
  replace: [{ from: '<li>Snið lokaprófsins (fjölval, skrifleg dæmi eða blanda).</li>', to: '' }],
  sheetSections: { prepend: [{ id: 'hag108g-P', n: 'P', title: 'Snið lokaprófsins', html: SECTION_HTML }] }
};
