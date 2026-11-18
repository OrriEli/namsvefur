# Gagnasnið

29. okt. 2026 · áfangi 0 · **samþykkt 30. okt. 2026** · útvíkkað 17. nóv. 2026 fyrir lokaprófsútgáfur gömlu síðnanna (sjá *Útvíkkun 17. nóv.* neðst; þar sem hún stangast á við fyrri kafla gildir hún)

Öll fimm fögin eru lýst með einu sniði. Vélin les `Course`-hlut og þarf aldrei að vita úr hvaða fagi atriði kemur. Sniðið verður skilgreint með JSDoc í `src/schema.js` og prófað með skriftu (sjá „Prófanir“ neðst).

Sniðið byggir á verklýsingunni. Áður en það var skrifað var öllum 1.112 föstu atriðunum varpað yfir á það í prufukeyrslu: hvert einasta svið úr gömlu síðunum á sér stað, og engin auðkenni rekast á. Tölurnar eru í `docs/legacy-inventory.md`.

## Frávik frá verklýsingunni

Þetta eru breytingarnar sem þarf að samþykkja. Allt annað er eins og í verklýsingunni.

| # | Verklýsingin | Tillaga | Af hverju |
| --- | --- | --- | --- |
| 1 | `source: 'old'│'new'│'sheet'│'gen'` | Bætt við **`'slides'`** (glærur). Gamla gildið geymt í `origin` þegar það er annað. | 184 atriði í 106 og 108 eru af glærunum og passa hvorki sem „gömul próf“, „nýjar“ né „dæmablöð“. |
| 2 | `sheet: string` | `sheet: Sheet` með köflum | „Blöðin“ á að sýna *hvaða kafli* geymir leitarorðið. HTML hvers kafla er orðrétt; samsett Blað er eins og gamla síðan teiknaði það. |
| 3 | `Generator.level?: number` | `Generator.levels?: number[]`, `f(level)` | Rafalar 106 og 108 eru eitt fall með þremur stigum. Stigið verður hluti af auðkenni æfingafærslu: `hag106g:g-ev@2`, eins og í gömlu geymslunni. |
| 4 | `e` alltaf til | `e` má vera tómt | Skrifleg dæmi og hraðspurningar 101 og skrefadæmi 106/108 hafa enga útskýringu; lausnin er í skrefunum. |
| 5 | – | Valkvæð svið: `exact`, `prob`, `keys`, `solution`, `examWeight`, `origin`, `r`, `rtest`, `x`, `chk` | Sérkenni einstakra síðna sem annars týndust (sjá töflu undir *Item*). |
| 6 | Eitt fag = ein skrá | `hag103g.js` (gögn) + `hag103g.gens.js` (rafalakóði) | Rafalar eru kóði sem byggir á hjálparsöfnum hverrar síðu (`Q`, `FIN`, `PROB`, `opts`, `calc`). Kóðinn er fluttur orðréttur í sér skrá; gagnaskráin er hreint JSON-hæft efni. Nýtt fag á vorönn þarf þá eina gagnaskrá og, ef það hefur rafala, eina rafalaskrá. |
| 7 | – | `Topic.review`, `Course.passScore`, `Course.sourceLabels` | Gömlu síðurnar höfðu þessar reglur í kóða (sjá *Course* og *Topic*). |

## Course

```js
/** @typedef {Object} Course
 *  @property {string} id               'hag103g'
 *  @property {string} code             'HAG103G'
 *  @property {string} name             'Heildahagfræði I'
 *  @property {string} short            'Heild'
 *  @property {string} color            áherslulitur fagsins, CSS-breyta, t.d. '--c-heild'
 *  @property {Topic[]} topics          efnisflokkar eða fyrirlestrar, í birtingarröð
 *  @property {Object<number,Level>} [levels]   106, 108
 *  @property {Item[]} items
 *  @property {Generator[]} gens
 *  @property {ExamFormat[]} examFormats
 *  @property {Sheet} sheet
 *  @property {Plan} [plan]             101, 103, 107
 *  @property {ExamInfo} examInfo       staðreyndir um prófið af gömlu síðunni
 *  @property {number} passScore        einkunn (0–1) sem skrefadæmi þarf til að teljast rétt
 *  @property {Partial<Record<Source,string>>} [sourceLabels]  heiti uppruna í síum, ef önnur en sjálfgefin
 *  @property {string} [genLabel]       forskeyti á merki rafaldæma, t.d. 'Reikningur' (sjálfgefið 'Rafall')
 *  @property {{key:string, file:string}} legacy   gamli geymslulykillinn og skráin
 */

/** @typedef {Object} Topic
 *  @property {string} id               'pen', 'fyl', 'F7', 'L03'
 *  @property {string} name             'Peningar, bankar og verðbólga'
 *  @property {string} [label]          stutt merki ef annað en id, t.d. 'F7–F8'
 *  @property {string} [ref]            'MT24', 'Kafli 5.4', 'SBE 4.4–4.5'
 *  @property {string} [weight]         vægi eins og gamla síðan sýndi það, t.d. '20*' (101)
 *  @property {string[]} [members]      eldri auðkenni sem falla undir flokkinn ('F7', 'F8')
 *  @property {boolean} [review]        upprifjun: ekki í blönduðu prófi né „veikustu flokkum“ (`gru` í 103 og 107)
 */

/** @typedef {Object} Level  @property {string} name  @property {string} desc */
```

`passScore` er 1 í HAG101G (gamla síðan krafðist fulls húss) og 0,7 í HAG106G og HAG108G. Krossar og tölusvör eru alltaf annaðhvort rétt eða rangt.

Sjálfgefin heiti uppruna: *Gömul próf*, *Nýjar*, *Dæmablöð*, *Glærur*, *Rafalar*. Frávik: 101 `{sheet:'Dæmablað', new:'Ný dæmi'}`, 103/107 `{gen:'Reikningar'}`, 106 `{old:'Miðannarpróf'}`, 108 `{sheet:'Heimaverkefni'}`.

## Item

```js
/** @typedef {'old'|'new'|'sheet'|'slides'|'gen'} Source */

/** @typedef {Object} Item
 *  @property {string} id               stöðugt, sama og í gömlu síðunni ('H25-1', 'F1-DB1-4a', 'Q-F1')
 *  @property {'mc'|'num'|'steps'|'card'} type
 *  @property {string} topic            Topic.id
 *  @property {1|2|3} [level]
 *  @property {Source} source
 *  @property {string} [origin]         gamla upprunagildið ef það er annað: 'blad', 'db', 'hv', 'gl', 'mid', 'ny'
 *  @property {string} src              merkið eins og gamla síðan birti það: 'H25 #1', 'Ný spurning', 'Ný · K11 · Orsakir einokunar'
 *  @property {string} q                HTML; getur innihaldið TeX innan \( \) og \[ \]
 *  @property {string} e                útskýring (mc, num), fyrirmyndarsvar (card); '' þar sem engin er
 *
 *  mc
 *  @property {string[]} [o]            2–5 valkostir, stokkaðir við birtingu
 *  @property {number} [a]              númer rétts kosts í `o`
 *
 *  num
 *  @property {number} [ans]
 *  @property {number} [tol]            rétt ef |svar − ans| ≤ tol (+1e-9), eins og í gömlu síðunum
 *  @property {string} [unit]
 *  @property {string} [exact]          nákvæmt svar 'p/q' eða heiltala; metið með brotareikningi, inntak má vera brot (101)
 *  @property {boolean} [prob]          svarið er líkur; '54,1%' gildir sem 0,541 (108)
 *
 *  steps
 *  @property {{h:string, body:string, p:number}[]} [steps]   titill, lausn (HTML), stig
 *  @property {number} [examWeight]     vægi á upprunalega prófinu (101: L23-1 = 15)
 *
 *  card
 *  @property {string[]} [keys]         „Gott svar nefnir“
 *
 *  sjaldgæf
 *  @property {{q:string, steps:{h:string, body:string, p:number}[]}} [solution]  allur útreikningurinn á bak við hraðspurningu (101-rafalar)
 *  @property {boolean} [r]             R-spurning (108)
 *  @property {{code:string, expect:string, rxo?:boolean}} [rtest]   R-kóði og vænt úttak sem gamla síðan prófaði í R (108)
 *  @property {number} [x]              tölugildi rétts svars, aðeins fyrir prófanir (108, rafalar 106/108)
 *  @property {*} [chk]                 prófunargögn úr gömlu síðunni, ekki birt (101)
 */
```

### Hvernig gömlu sviðin varpast

| Gamla síðan | Gamalt | Nýtt |
| --- | --- | --- |
| 103, 107 | `{id, t, src, q, o, a, e}` í `OLD` / `NEW` | `type:'mc'`, `topic = t`, `source = 'old'` / `'new'`, `src` = það sem síðan birti (`NEW` í 103: „Ný spurning“; í 107: „Ný · “ + `src`) |
| 106, 108 | `kind: 'mc'│'num'│'step'│'card'` | `type`: `'mc'`, `'num'`, `'steps'`, `'card'` |
| 106, 108 | `lec`, `lvl` | `topic` = fyrirlestrahópur (`F8` → `F7`), `level` |
| 106, 108 | `from` | `source` + `origin` (tafla að neðan) |
| 106, 108 | `steps: [{h, p, e}]` | `steps: [{h, body: e, p}]` |
| 106, 108 | `back`, `keys` | `e = back`, `keys` |
| 108 | `prob`, `r`, `rc`, `rx`, `rxo`, `x` | `prob`, `r`, `rtest: {code: rc, expect: rx, rxo}`, `x` |
| 101 | `{id, t, src, q, steps:[{titill, stig, lausn}], exam?, chk?}` | `type:'steps'`, `steps: [{h: titill, body: lausn, p: stig}]`, `examWeight = exam`, `chk` |
| 101 | hraðspurning með `o` | `type:'mc'`, `o`, `a` |
| 101 | hraðspurning án `o`, `a: '-3/2'` | `type:'num'`, `exact: '-3/2'`, `ans: −1,5`, `tol: 0` |

| `origin` | Fög | `source` |
| --- | --- | --- |
| `blad` | 101 | `sheet` |
| `db` | 106 | `sheet` |
| `hv` | 108 | `sheet` |
| `gl` | 106, 108 | `slides` |
| `mid` | 106 | `old` |
| `ny` | 106, 108 | `new` |

Í 101 eru skilaverkefni 1 (`S1-1`–`S1-5`) flokkuð sem `old`, eins og á gömlu síðunni.

### Dæmi úr raunverulegu efni

Dæmin eru varpanir á raunverulegum atriðum, gerðar af sömu prufuskriftu og varpaði öllum 1.112. Textinn er orðréttur.

**`mc`** · HAG103G, Hlutapróf 2025 #1

```js
{
  id: "H25-1",
  type: "mc",
  topic: "rei",
  source: "old",
  src: "H25 #1",
  q: "Verg landsframleiðsla er 120 m.kr., einkaneysla er 50 m.kr., fjárfesting er 20 m.kr., innflutningur er 40 m.kr. og útflutningur er 60 m.kr. Finnið útgjöld hins opinbera.",
  o: [
    "30 m.kr.",
    "70 m.kr.",
    "10 m.kr.",
    "50 m.kr.",
    "90 m.kr."
  ],
  a: 0,
  e: "<div class=\"f\">G = Y − C − I − (X − M)<br>G = 120 − 50 − 20 − (60 − 40) = 30</div>Gildran er 70: að gleyma að NX = X − M og draga ekkert frá fyrir utanríkisviðskipti."
}
```

**`num`** · HAG106G, dæmablað 1

```js
{
  id: "F1-DB1-4a",
  type: "num",
  topic: "F1",
  level: 1,
  source: "sheet",
  origin: "db",
  src: "Dæmablað 1, dæmi 4a",
  q: "Þú átt $1.000 og velur á milli tveggja kosta til eins árs. <b>Fyrirtæki A:</b> $0 (40% líkur) eða $2.400 (60%). <b>Ríkisskuldabréf:</b> $950 (50%) eða $1.100 (50%). Hvert er væntigildi fyrirtækis A eftir eitt ár? <span class=\"hint\">Í dölum.</span>",
  ans: 1440,
  tol: 0.5,
  unit: "$",
  e: "<div class=\"f\"><table class=\"cl\"><tr><td>E(X)</td><td class=\"eq\">=</td><td>Σ p<sub>i</sub> · x<sub>i</sub></td></tr><tr><td>E(A)</td><td class=\"eq\">=</td><td>0,40 × 0 + 0,60 × 2.400</td><td class=\"eq\">=</td><td>$1.440 → vænt ávöxtun 44%</td></tr><tr><td>E(B)</td><td class=\"eq\">=</td><td>0,50 × 950 + 0,50 × 1.100</td><td class=\"eq\">=</td><td>$1.025 → vænt ávöxtun 2,5%</td></tr></table></div><p class=\"note\">4b: A er áhættusamari, ekki vegna væntigildisins heldur dreifingarinnar: A getur tapað öllu, ríkisbréfið í versta falli 5%. 4c: lögmál 2, aukin áhætta krefst hærri væntrar ávöxtunar.</p>"
}
```

**`num` með `exact`** · HAG101G, hraðspurning. Svarið „−5“, „-10/2“ og „-5,0“ teljast öll rétt.

```js
{
  id: "Q-F1",
  type: "num",
  topic: "fyl",
  source: "new",
  src: "Fyrirlestrarnótur 8",
  q: "Hvert er stakið í röð 2, dálki 1 í \\(AB\\)? \\[A = \\begin{bmatrix}2 & -1 \\\\ 3 & 4\\end{bmatrix},\\quad B = \\begin{bmatrix}1 & 5 \\\\ -2 & 0\\end{bmatrix}\\]",
  ans: -5,
  tol: 0,
  unit: "",
  exact: "-5",
  e: ""
}
```

**`num` með `prob`** · HAG108G, dæmablað 1. Svarið „0,2“ og „20%“ teljast bæði rétt.

```js
{
  id: "L01-hv-4",
  type: "num",
  topic: "L01",
  level: 1,
  source: "sheet",
  origin: "hv",
  src: "Dæmablað 1, 2a",
  q: "Þið fáið lyklakippu með 5 ómerktum lyklum að sumarbústað; einn gengur að útidyrunum. Hverjar eru líkurnar á að opna í fyrstu tilraun?",
  ans: 0.2,
  tol: 0.001,
  unit: "",
  prob: true,
  e: "<div class=\"f\"><table class=\"cl\"><tr><td>\\(\\Pr\\)</td><td class=\"eq\">=</td><td>\\(\\frac{1}{5}\\)</td><td class=\"eq\">=</td><td>\\(0{,}2\\)</td></tr></table></div>"
}
```

**`steps`** · HAG101G, Lokapróf 2025 dæmi 3. Í prófinu „Lokaprófsliðirnir“ gildir dæmið 5 stig af 97.

```js
{
  id: "L25-3",
  type: "steps",
  topic: "dif",
  source: "old",
  src: "Lokapróf 2025, dæmi 3 (5%)",
  q: "Nýtið keðjuregluna til að reikna fyrstu afleiðu eftirfarandi falls: \\[f(x) = e^{4x^2 - 3x}\\]",
  steps: [
    {
      h: "Innra fall",
      body: "\\[y = 4x^2 - 3x,\\qquad \\frac{dy}{dx} = 8x - 3\\]",
      p: 2
    },
    {
      h: "Keðjureglan",
      body: "\\[f'(x) = e^{y}\\cdot\\frac{dy}{dx} = (8x - 3)\\,e^{4x^2 - 3x}\\]",
      p: 3
    }
  ],
  examWeight: 5,
  e: ""
}
```

**`card`** · HAG106G, opin spurning

```js
{
  id: "F1-3-C1",
  type: "card",
  topic: "F1",
  level: 3,
  source: "new",
  origin: "ny",
  src: "Opin spurning · F1",
  q: "Hvers vegna leiðir viðleitni margra fjárfesta til að „sigra markaðinn\" einmitt til þess að markaðurinn verður skilvirkur — og af hverju er íslenski markaðurinn síður skilvirkur en sá bandaríski?",
  e: "Þegar margir fjárfestar leita að vanmetnum bréfum kaupa þeir um leið og þeir finna þau, og kaupin ýta verðinu upp þar til umframávöxtunin hverfur. Samkeppnin um upplýsingar er því sjálf það sem færir þær inn í verðið. Afleiðingin er að á mjög skilvirkum markaði er nær ómögulegt að ná stöðugt hærri ávöxtun en áhættan réttlætir. Íslenski markaðurinn hefur færri félög, færri greinendur og minni veltu, svo færri leita að villunum og verð aðlagast hægar. Þar getur vönduð greining því frekar skilað árangri.",
  keys: [
    "Samkeppni um umframávöxtun færir upplýsingar inn í verð",
    "Kaup á vanmetnum bréfum hækka verðið þar til umframávöxtun hverfur",
    "Mótsögnin: því fleiri sem reyna, því erfiðara er það",
    "Ísland: fá félög, lítil velta, fáir greinendur",
    "Afleiðing: hægari aðlögun verðs og meira svigrúm fyrir greiningu"
  ]
}
```

**`mc` með R** · HAG108G, glærur 00. Takið eftir „§“ í útskýringunni: það er villa í gömlu síðunni (sjá úttektina, liður 10) og er flutt orðrétt.

```js
{
  id: "L00-gl-2",
  type: "mc",
  topic: "L00",
  level: 1,
  source: "slides",
  origin: "gl",
  src: "Glærur 00 R-grunnur, gl. 17",
  q: "Hvað prentar síðasta línan?<pre class=\"code\">x &lt;- c(1, 2, 3, 4, 5)\nx[c(1, 3)]</pre>",
  o: [
    "1 3",
    "2 4",
    "1 2 3",
    "3",
    "4"
  ],
  a: 0,
  e: "<div class=\"f\"><table class=\"cl\"><tr><td>x[c(1, 3)]</td><td class=\"eq\">=</td><td>§stak 1 og stak 3</td><td class=\"eq\">=</td><td>§1 og 3</td></tr></table></div><p class=\"note\"><b>Rangir kostir</b></p><ul class=\"traps\"><li><b>2 4</b> Taldi frá 0. Í R er fyrsta stakið x[1].</li><li><b>1 2 3</b> c(1, 3) er vektor tveggja vísa, ekki bilið 1:3.</li><li><b>3</b> Tók aðeins síðasta vísinn.</li><li><b>4</b> Lagði vísana saman.</li></ul>",
  r: true,
  rtest: {
    code: "x <- c(1, 2, 3, 4, 5); cat(x[c(1, 3)])",
    expect: "1 3",
    rxo: true
  }
}
```

## Generator

```js
/** @typedef {Object} Generator
 *  @property {string} id               'gen-vlf' (103), 'g-ev' (106), 'g-mul' (101), 'q:g-mul' (hraðútgáfa 101)
 *  @property {string} name             'Liður sem vantar í VLF'
 *  @property {string} topic
 *  @property {number[]} [levels]       [1, 2, 3] ef f tekur stig
 *  @property {boolean|number[]} [r]    R-spurning á öllum stigum (true) eða aðeins þeim sem eru talin (108)
 *  @property {(level?: number) => GenItem} f
 */

/** Það sem rafall skilar: Item án auðkennis, flokks og uppruna. `type` ræðst af því sem
 *  rafallinn skilar hverju sinni, því fjórir rafalar í 106 skila ýmist `num` eða `mc`.
 *  @typedef {Omit<Item, 'id'|'topic'|'source'|'src'|'level'>} GenItem */
```

Rafalarnir eru fluttir orðréttir í `src/courses/<fag>.gens.js`, ásamt hjálparföllunum sem þeir nota. Neðst í skránni er þunnt millilag sem breytir gamla úttakinu í `GenItem`:

| Vél | Gamalt úttak | Millilag |
| --- | --- | --- |
| 103, 107 | `g.f()` → `{q, o, a:0, e}` | `{type:'mc', ...g.f()}` |
| 106, 108 | `g.f(lvl)` → `num(...)` / `pnum(...)` / `mc(...)` með `kind` | `kind` → `type`; `x`, `p` fylgja með; `levels: [1, 2, 3]` |
| 101 | `g.f()` → `{q, steps, chk, quick}` | tveir rafalar: `g-mul` gefur `steps`; `q:g-mul` gefur `mc` eða `num` með `exact` úr `quick` og `solution = {q, steps}`. Eins og á gömlu síðunni er reynt allt að 20 sinnum þar til `quick` fæst. 21 af 25 rafölum hafa hraðútgáfu. |

Dæmi um millilag, HAG103G:

```js
// ---- orðrétt úr legacy/HAG103G prófæfing.html (R, opts, pertAdd, MONTHS, GENS) ----
// ... const GENS = [ {id:"gen-vlf", t:"rei", name:"Liður sem vantar í VLF", f(){ ... }}, ... ];

// ---- millilag ----
export default GENS.map(g => ({ id: g.id, name: g.name, topic: g.t, f: () => ({ type: 'mc', ...g.f() }) }));
```

Eina breytingin á rafalakóðanum sjálfum er að skilgreiningu síðunnar á `F` er skipt út fyrir sameiginlegu eininguna (sjá *Talnasnið*).

## ExamFormat

```js
/** @typedef {Object} ExamFormat
 *  @property {string} id
 *  @property {string} name             'Blandað próf'
 *  @property {string} desc             lýsingin af gömlu síðunni, orðrétt
 *  @property {'inspera'|'written'|'mixed'} style
 *  @property {number} [minutes]
 *  @property {number} [minutesPerItem] (Hlutapróf 2025: 3)
 *  @property {Pick} pick
 */

/** @typedef {
 *   {by:'quota', quota:Object<string,number>, sources?:Source[]}               // n úr hverjum flokki, vegið úrtak
 *  |{by:'fixed', ids:string[]}                                                 // föst atriði í föstri röð
 *  |{by:'gens', n:number}                                                      // n rafalar af handahófi
 *  |{by:'blueprint', sections:{topics:string[], weight:number}[], minPoints:number, gensOnly?:boolean}
 *  |{by:'levels', mixes:{id:string, name:string, w:number[]}[],
 *     lengths:{id:string, minutes:number, n:number, cards:number}[],
 *     stepCapL3:number, points:{mc:number, num:number, steps:number, card:number},
 *     rShare?:{topic:string, share:number}}
 *  } Pick */
```

| Fag | `id` · nafn | `style` | Tími | `pick` |
| --- | --- | --- | --- | --- |
| 103 | `mix` · Blandað próf | inspera | 60 | `quota {pen:4, vin:3, opi:3, rei:2, vox:3, ojo:2, spa:2, vid:1}` = 20 |
| 103 | `h25` · Hlutapróf 2025 | inspera | 3 á spurningu | `fixed` (`H25-*`, 17) |
| 103 | `gen` · Reikningapróf | inspera | 45 | `gens 15` |
| 107 | `mix` · Blandað próf | inspera | 60 | `quota {ein:6, fak:4, vid:4, eis:3, ovi:3}` = 20 |
| 107 | `new` · Hugtakapróf | inspera | 60 | sama `quota`, `sources: ['new']` |
| 107 | `gen` · Reikningapróf | inspera | 45 | `gens 15` |
| 101 | `mix` · Blandað próf | written | 90 | `blueprint` fyl 15 · akv+and 20 · jof 20 · dif+hlu 15 · hes 15 · mis 15, `minPoints: 5` |
| 101 | `old` · Lokaprófsliðirnir | written | 90 | `fixed` L23-1, L23-2, L25-1, L25-2, L25-3, L25-4, L25-7; vægi úr `examWeight` = 97 |
| 101 | `gen` · Rafalapróf | written | 90 | sama `blueprint`, `gensOnly: true` |
| 106 | `blandad` · Próf á tíma | mixed | 90 / 180 | `levels`: blöndur 0,2/0,5/0,3 og 0,1/0,3/0,6; lengdir 12 dæmi + 1 spjald og 24 + 2; `stepCapL3: 1/3`; stig mc 1, num 1, steps 3, card 0 |
| 108 | `blandad` · Próf á tíma | mixed | 90 / 180 | eins og 106, auk `rShare {topic:'L00', share:0.15}` |

Einkunn: *inspera* = rétt / fjöldi × 10. *written* = Σ vægi × fengin stig / hámark, af Σ vægi. *mixed* = stig / hámark × 10, þar sem skrefadæmi gefur 3 × hlutfall haka.

## Sheet

```js
/** @typedef {Object} Sheet
 *  @property {string} head             HTML efst: yfirskrift og inngangur
 *  @property {SheetSection[]} sections
 *  @property {string} [foot]           HTML neðst (106: neðanmálsgrein; 108: „Óstaðfest“-reitur)
 */
/** @typedef {Object} SheetSection
 *  @property {string} id               's1'–s10 í 101 (áætlunin vísar á þau); annars '<fag>-<n>'
 *  @property {string} n                merkið: '01', 'F3', 'Σ', '!'
 *  @property {string} title            'Peningar og bankar'
 *  @property {string} html             allur <section>-hlutinn, orðréttur
 */
```

Blaðið er tekið úr því sem `renderSheet()` gömlu síðunnar skilar, ekki úr gagnafylkjunum, svo Blöð 106 og 108 (teiknuð úr `SHEET_*` og `calc()`) og Φ-taflan í 108 koma eins út. Kaflafjöldi: 101 10, 103 11, 106 11, 107 9, 108 15.

## Plan og ExamInfo

Áætlanirnar flytjast sem kyrrstæð gögn í sínu upprunalega formi, því þær eru bundnar liðnum dögum:

```js
/** @typedef {{kind:'day', date:string, start:string, end:string, eyebrow:string, title:string, intro:string,
 *             steps:{m:number, h:string, p?:string, go?:Go, brk?:boolean}[]}
 *          | {kind:'days', days:{d:string, h:string, cal?:string, note?:string,
 *             items:{at:string, m:number, h:string, p?:string, go?:Go, brk?:boolean}[]}[]}} Plan
 *  @typedef {string | {v:string, topics?:string[], kind?:string, sec?:string}} Go   // vísun á skjámynd
 */

/** @typedef {Object} ExamInfo
 *  @property {string} title            'Lokaprófið', 'Hlutaprófið'
 *  @property {string} [format]         'Skriflegt lokapróf, 50% af einkunn. Snið óstaðfest.'
 *  @property {string} [aids]
 *  @property {string} [weight]
 *  @property {string} [note]           skýringin undir stöðutöflunni á gömlu síðunni
 *  @property {{value:string, label:string}[]} facts   staðreyndareitirnir á forsíðu gömlu síðunnar
 */
```

Prófdagar eru **ekki** í gagnaskránum heldur í `src/config.js`, svo Orri breyti þeim á einum stað.

## Auðkenni og framvinda

| Hlutur | Alþjóðlegt auðkenni | Dæmi |
| --- | --- | --- |
| Fast atriði | `<fag>:<id>` | `hag103g:H25-1`, `hag101g:Q-F1` |
| Rafall án stiga | `<fag>:<id>` | `hag103g:gen-vlf`, `hag101g:g-mul` |
| Rafall með stigum | `<fag>:<id>@<stig>` | `hag106g:g-ev@2` |
| Hraðútgáfa rafals (101) | `<fag>:q:<id>` | `hag101g:q:g-mul` |

Auðkenni er klofið á **fyrsta** tvípunkti. Innflutningurinn er í `src/store/legacy-import.js` og stillingasíðunni (`#/stillingar`). Hann má endurtaka: hlutur gömlu síðunnar er geymdur í `imp` og skipt út, svo ekkert tvítelst, og æfing á nýja vefnum ræður streak og villubanka. Hlutinn á eftir fagi er nákvæmlega lykillinn sem gamla síðan notaði í `st`, `qs` og `wrong`, svo innflutningur gömlu sögunnar er forskeyting.

```js
/** Framvinda eins atriðis, geymd undir alþjóðlegu auðkenni.
 *  @typedef {Object} ItemProgress
 *  @property {number} n                tilraunir
 *  @property {number} c                summa einkunna (0–1 á tilraun)
 *  @property {number} streak           rétt í röð
 *  @property {number} [last]           síðasta tilraun (ms)
 *  @property {'viss'|'halfviss'|'gisk'} [conf]
 *  @property {boolean} [sureWrong]     rangt þótt merkt Viss
 *  @property {1|3|7|16} [box]          hólf í villubanka; vantar = ekki í banka
 *  @property {number} [due]            næst á tíma (ms)
 *  @property {string} [note]           „Hvað hugsaði ég vitlaust?“
 *  @property {string[]} [tags]
 *  @property {boolean} [again]         spjald merkt „sýna aftur“
 */
```

| Gamla geymslan | Nýtt |
| --- | --- |
| `st[k] = {n, c, s}` (103, 106, 107, 108) | `n`, `c`, `streak = s` |
| `st[k] = {n, p, m}` (101, skrifleg) | `n`, `c = n · p / m`, `p`, `m` (staðan er hlutfall stiga, eins og á gömlu síðunni), `streak = 0` |
| `qs[k] = {n, c, s}` (101, hraðspurningar) | `n`, `c`, `streak = s` |
| `wrong[k]` | `box = 1`, `due` = innflutningstími (á tíma strax), `hits = wrong[k]` |
| `cards[id] = {seen, again}` (106, 108) | `n = seen`, `again` |
| `hist[]` | `state.hist` merkt `legacy`; 103/107 `c/n` (eða `pts/max`), 106/108 `pct × 10 / 10`, 101 `score/tot` |
| `adapt` (106, 108) | stigvaxandi stig, ef ekkert er þegar skráð |
| `plan`, `start`, `exam`, `last` | ekki flutt (áætlanir hafa breyst; próf í gangi passar ekki) |

## Sameiginlegar reglur

**Talnasnið.** Ein eining, `src/ui/format.js`, með öllum föllum gömlu útgáfnanna (`int`, `dec`, `pct`, `num`, `n`, `pp`, `kr`, `usd`, `s`, `m`, `mi`). Hún er búin til með `makeF({pctDigits})` því sjálfgefnir aukastafir `F.pct` eru 2 í HAG106G en 1 annars staðar; annars breyttist texti 106-rafala. Prófun ber hana saman við hverja gömlu útgáfu á handahófstölum.

**Vægi í úrtaki.** Verklýsingin: ósnert 3, í villubanka 5, rafall 2, náð tvisvar í röð 0,25, annars 1. Gömlu síðurnar athuguðu þetta í ólíkri röð. Tillaga: **villubanki (og á tíma) fyrst**, svo rafall, ósnert, náð. Þá koma rafalar í villubankanum aftur með vægi 5, eins og í 101.

**Stærðfræði.** KaTeX fyrir öll fög (eins og 108), með sömu afmörkurum `\( \)` og `\[ \]`. 101 notaði MathJax; í áfanga 3 er prófað að allt TeX í 101 teiknist með KaTeX.

**Flýtilyklar.** `1`–`5` (og `a`–`e` í krossum) velja, `Enter` áfram. Öryggismatið notar `V`, `H`, `G`. Í skrefaspilaranum (101) þýða `h` „vísbending“ og `v` „vantaði“; öryggisröðin birtist þegar fyrsta lausnarskref er opnað og á meðan hún er sýnileg gilda `V`/`H`/`G`. Lyklarnir rekast því ekki á í tíma.

## Skrár

```
src/courses/
  hag103g.js          gögn: efnisflokkar, atriði, prófsnið, Blaðið, áætlun (búið til af extract-legacy.js)
  hag103g.gens.js     rafalakóði orðréttur + millilag (búið til af extract-legacy.js)
  ...
  index.js            skráir fögin
src/config.js         prófdagar, markmið, upptekin kvöld
src/schema.js         JSDoc-tegundirnar hér að ofan + validateCourse()
```

`config.js` byrjar svona, með svörum Orra:

```js
export const EXAMS = [
  { course: 'hag101g', kind: 'midannar', label: 'Miðannarpróf', at: '2026-11-05T16:00:00Z', minutes: 90 },
  { course: 'hag101g', kind: 'loka', label: 'Lokapróf', at: '2026-11-25T13:30:00Z', minutes: 180 },
  { course: 'hag108g', kind: 'loka', label: 'Lokapróf', at: '2026-12-01T13:30:00Z', minutes: 180 },  // af gömlu síðunni
  { course: 'hag103g', kind: 'loka', label: 'Lokapróf', at: null },                                   // óstaðfest
  { course: 'hag106g', kind: 'loka', label: 'Lokapróf', at: null, minutes: 180 },                     // óstaðfest
  { course: 'hag107g', kind: 'loka', label: 'Lokapróf', at: null }                                    // óstaðfest
];
```

## Prófanir á sniðinu

1. `validateCourse()` á hvert fag: hvert atriði hefur svið sinnar gerðar, `a` er innan `o`, `tol ≥ 0`, skref hafa `p > 0`, `topic` er til, auðkenni eru einkvæm.
2. Fjöldi atriða, rafala og Blaðkafla í hverju fagi = talnablokkin í `docs/legacy-inventory.md`.
3. Engin týnd svið: hvert svið í gömlu gögnunum á sér stað í nýja hlutnum.
4. Hver rafall (á hverju stigi) keyrður 1.000 sinnum: úttakið stenst `validateCourse`-reglurnar, valkostir einkvæmir, rétt svar meðal þeirra, engin `NaN` eða `Infinity`.
5. `format.js` gefur sama streng og hver gömul `F`-útgáfa.
6. Samsett Blað = það sem `renderSheet()` gömlu síðunnar skilar (bil á milli merkja jöfnuð).

## Ákvarðanir

Orri samþykkti sniðið 30. okt. 2026 með sjálfgefnu svörunum:

1. Frávikin sjö efst gilda.
2. HAG101G: lokapróf mið. 25. nóv. 2026 kl. 13:30–16:30 (180 mín.), auk miðannarprófs 5. nóv.
3. HAG108G: lokapróf 1. des. 2026 kl. 13:30, eins og á gömlu síðunni.
4. `passScore` í HAG101G er 1 (fullt hús), eins og á gömlu síðunni.
5. „§“-villan í 108 er flutt orðrétt.

Tvö valkvæð svið bættust við í áfanga 1 svo texti gömlu síðnanna haldist: `Course.genLabel` („Reikningur · …“ í 103 og 107) og `ExamInfo.note`.

## Útvíkkun 17. nóv. 2026

Orri uppfærði allar fimm gömlu síðurnar fyrir lokaprófin og bað um að vefurinn yrði byggður á þeim. Nýju síðurnar kalla á eftirfarandi viðbætur. Ekkert eldra svið breytti um merkingu.

### Nýjar gerðir og svið

| Svið | Gildi | Úr |
| --- | --- | --- |
| `type: 'multi'` | „Veldu allt sem á við“: `o`, `a` = númer allra réttra kosta. Hlutastig = (rétt − rangt) / fjöldi réttra, minnst 0 | 107 |
| `type: 'match'` | Pörun: `rows: [{t, a}]`, `cols: string[]`, `ord?` (halda röð raða). Hlutastig = hlutfall réttra raða | 107 |
| `num.parts` | Tölusvar með liðum: `[{l, ans, tol}]`; vikmörk sett í útdrætti (0,6% af svari, minnst 0,011, nema liðurinn gefi önnur) | 107 |
| `pts` | Stig á prófi: kross 2, veldu allt 3, pörun ⌈raðir/2⌉ (minnst 2), tölusvar 2 á lið | 107 |
| `quick` | Hraðspurning (101); skilur hraðæfingu frá skriflegum dæmum | 101 |
| `mc.o` | 2–12 valkostir (var 2–5) | 107 |
| `Topic.part` | Hluti námskeiðs, t.d. „Hluti 1 · framboð, eftirspurn og íhlutanir“ | 103, 107 |
| `Course.engine` | `'mcq'`, `'lecture'` eða `'written'` | öll |
| `Course.modes` | Æfingahættir: `{id, label, quick?, adapt?, cards?}` | 101, 106, 108 |
| `Sheet.a4` | `{head, html}`: A4-formúlublaðið | 106 |
| `ExamInfo.callout` | HTML-reitur á forsíðu („Óstaðfest“) | 108 |
| `Generator.types`, `Generator.quick` | Gerðir sem rafall skilar; hraðútgáfa rafals | 101 |

### Prófsnið (`pick.by`)

| `by` | Svið | Fög |
| --- | --- | --- |
| `quota` | `quota: {flokkur: fjöldi}` | 103 (*Fullt lokapróf* 50, *Seinni hlutinn* 20), 107 (*Lokapróf* 48, *Hálft*, *Hluti 1–3*) |
| `fixed` | `ids: string[]`; í skriflegu sniði gildir `examWeight` hvers dæmis | 103 (*Lokapróf 2024*, *2025*), 101 (*Lokapróf 2023*, *2025*, *Miðannarpróf 2025*) |
| `gens` | `n` | 103, 107 (*Reikningapróf* 15) |
| `blueprint` | `sections: [{topics, weight}]` eða `[{ids, weight}]`, `minPoints`, `gensOnly?` | 101 (*Blandað*, *Rafalapróf*: 7 hlutar, 100 stig), 108 (*Blandað lokapróf*: 15 sæti, hvert með sama dæmi úr fjórum gömlum prófum) |
| `levels` | `mixes`, `lengths`, `defaultLength`, `explain`, `stepCapL3`, `points`, `rShare?` | 106, 108 |

Samsetning, fjöldi og tími hvers prófsniðs eru lesin með því að keyra `buildExam()` gömlu síðunnar í útdrættinum; `tests/exam.test.js` ber hvert snið saman við hana.

### Skrár (kemur í stað fráviks 6)

```
src/courses/
  legacy/<fag>.js     gagnablokk gömlu síðunnar orðrétt sem ES-eining (atriði, rafalar, hjálparföll);
                      aðeins skilgreiningu síðunnar á F er skipt út fyrir sameiginlegu eininguna
  <fag>.js            lýsigögn (flokkar, prófsnið, Blaðið, áætlun) + kall á millilag vélarinnar
  adapters/mcq.js     varpar atriðum og rafölum krossavélarinnar (103, 107) á sniðið
  adapters/lecture.js sama fyrir fyrirlestravélina (106, 108)
  adapters/written.js sama fyrir skriflegu vélina (101)
```

Atriðin eru því ekki fryst sem JSON heldur reiknuð úr orðréttum kóða gömlu síðunnar þegar vefurinn hleðst. Það er nauðsynlegt í 101 og 108, þar sem atriðin eru búin til með sömu hjálparföllum og rafalarnir. `tests/extract.test.js` staðfestir að hvert atriði sé eins og það sem gamla síðan sjálf býr til.

### Hegðun sem var samræmd

- **Skrefadæmi** í öllum fögum nota skrefaspilara HAG101G (vísbending, næsta skref, öll skref, rétt/vantaði á hvert skref). HAG106G/108G sýndu áður öll skref í einu með hökum; stigin eru reiknuð eins.
- **Blandað próf (106, 108):** skriflegu dæmin eru metin á sérstökum yfirferðarskjá eftir skil (eins og í 101), í stað haka í niðurstöðunni.
- **Stærðfræði:** KaTeX í öllum fögum; allt TeX í öllum fögum teiknast villulaust (`tests/katex.test.js`).
- **Rafall sem skilar NaN, Infinity eða undefined** í texta er keyrður aftur (sjá úttektina).

## Áfangi 4: þvert á fög (17. nóv. 2026)

### Villubanki með dreifðri endurtekningu (`src/engine/review.js`)

| Atburður | Áhrif |
| --- | --- |
| Rangt svar | `box = 1`, `due = nú + 1 dagur`; `sureWrong = true` ef merkt var *Viss* |
| Rétt svar þegar `due ≤ nú` | næsta hólf: 1 → 3 → 7 → 16 dagar (`due = nú + hólf`); rétt í hólfi 16 → út |
| Rétt svar áður en á tíma | engin breyting á hólfi |
| Rangt svar í hvaða hólfi sem er | aftur í hólf 1 |

Vægi í úrtaki: villa á tíma 5, rafall 2, ósnert 3, villa sem er ekki á tíma 1, náð tvisvar í röð 0,25, annars 1. Innflutt villa úr gömlu síðunum er á tíma strax.

Ný svið á `ItemProgress`: `conf` (öryggismat síðasta svars), `sureWrong`, `note` („Hvað hugsaði ég vitlaust?“) og `tags`.

### Tillaga að blokk (`src/engine/today.js`)

- **Forgangur** = nálægð × veikleiki. Nálægð = 1 / min(dagar í próf, 14); óstaðfest próf 1/14; liðið próf 0. Veikleiki = 1 − hlutfall réttra síðustu 14 daga (úr lotum), dempað með 4 hlutlausum tilraunum; án lota er notað heildarhlutfall fagsins og án nokkurra svara 0,5.
- **Fyrri helmingur:** villur á tíma (öll fög með komandi próf, elstu fyrst, eins margar og komast fyrir), svo tveir veikustu flokkar fagsins með hæstan forgang.
- **Seinni helmingur:** tveir veikustu flokkar næsta fags í forgangsröð; ef ekkert annað fag hefur komandi próf, blönduð upprifjun.
- Áætlaður tími á atriði: hraðspurning 1 mín., kross 2, tölusvar, „veldu allt“ og pörun 3, skriflegt dæmi 8.
- **Upptekið kvöld** (sjálfgefið mán., mið., fös.): aðeins fyrri helmingurinn.

### Stillingar (`state.settings.prefs`)

`{confidence: true, block: {first: 25, pause: 10, second: 25}, busy: [1, 3, 5]}`; sjálfgefin gildi úr `src/config.js`, breytt á `#/stillingar`.

### Lærdómsblokk í gangi (`state.block`)

`{created, segments, first, pause, second, phase: 'first'|'pause'|'ready'|'second'|'done', phaseStart, idx}`. Stikan undir efstu stiku sýnir tímann og núverandi lið á öllum síðum.

## Áfangi 5: Vikan, Blöðin, útflutningur (17. nóv. 2026)

### Lotur (`state.sessions`)

`logActivity(state, course, kind, score, now, {from, conf, ok})` skráir hvert svar. Æfingarsvar sem kemur innan 15 mín. frá lokum síðustu æfingarlotu sama fags lengir hana; annars hefst ný lota. Lota hefst þegar atriðið birtist (`from`), þó ekki fyrr en 15 mín. fyrir svarið, svo atriði sem stóð opið yfir nótt telst ekki með. Ný svið: `sure` (svör merkt *Viss*) og `sureWrong` (þau sem voru röng). Hvert próf er ein lota frá upphafi til skila.

### Vikan (`src/engine/stats.js`)

`weekSummary(state, courses, now)` tekur saman síðustu 7 sólarhringa (`[nú − 7 d, nú]`) og 7 sólarhringana þar á undan: mínútur, atriði og hlutfall réttra á fag, mínútur á dag og hlutfall *Viss*-svara sem voru röng. Lota telst til tímabils og dags eftir því hvenær hún endaði. `weekText(sum, goal)` býr til textann sem afritunartakkinn setur á klemmuspjaldið; fög án virkni báðar vikurnar sleppa.

Markmið næstu viku: `state.settings.weekGoal = {text, at}`, birt á forsíðunni. Markmið faga: `state.settings.prefs.goals = {hag101g: '…'}`, sjálfgefin úr `src/config.js`, birt í prófadagatalinu.

### Leit í Blöðunum (`src/engine/sheets.js`)

Hver kafli í Blaði hvers fags er gerður að hreinum texta (HTML-merki fjarlægð, TeX gert læsilegt: `\le` → ≤). Texti og leitarorð eru felld staf fyrir staf (lágstafir, kommur burt, ð → d), svo „nuvirdi“ finnur „núvirði“ og staðsetning samsvörunar í felldum texta er sú sama og í upprunalegum. Öll orð (2 stafir eða fleiri) þurfa að finnast í kaflanum. Innan fags koma fyrst kaflar sem bera orðið í fyrirsögn, svo eftir fjölda samsvarana. Smellur opnar kaflann í Blaði fagsins (`#/fag/<id>/bladid?k=<kafli>`).

### Útflutningur og innflutningur (`src/store/backup.js`)

Skráin er `{app: 'namsvefur', v, exported, state}`; innflutningur tekur líka við hreinu ástandi. Sameining breytir ástandi þessa vafra og skrifar ekki yfir nýrri gögn:

| Hluti | Regla |
| --- | --- |
| `items` | atriði sem vantar bætast við; ef bæði hafa atriðið gildir það sem var æft síðast (`last`) |
| `sessions` | sameinaðar eftir (fag, gerð, upphaf); sama lota í báðum: sú sem endaði síðar |
| `hist` | sameinuð eftir (fag, tími, heiti) |
| `settings.plan` | hök sameinast |
| `settings.adapt`, `settings.imported` | aðeins fyllt þar sem vantar |
| `settings.weekGoal` | nýrra gildir |
| `settings.prefs`, `exams`, `block` | þessi vafri heldur sínu |

Sami innflutningur tvisvar breytir engu í seinna skiptið.

### Viðmið

`tests/phase5.test.js`: gamla HAG103G-síðan er keyrð í `vm`, 300 svörum svarað, vistunin flutt inn, og hlutfall hvers flokks í kunnáttukortinu er borið saman við `topicStats` gömlu síðunnar.

## HAG101G 17. nóv.: sjálfsmat, forgangsröð og ný áætlun

Breytingarnar voru gerðar í sjálfstæðu útgáfu HAG101G-síðunnar. Gamla síðan í `legacy/` er skrifvarin, svo þær eru í `src/courses/updates/hag101g.js` og `scripts/extract-legacy.js` (`applyUpdates`) setur þær ofan á það sem lesið er úr henni. HAG108G hefur líka slíka skrá (sjá neðar); hin fögin ekki.

### Ný svið á `Course` (aðeins HAG101G)

| Svið | Efni |
| --- | --- |
| `self.sections` | kafli Blaðsins → flokkur, kaflar 1–19 (`SEC_T`) |
| `self.initial`, `self.at` | sjálfsmat Orra 17. nóv. (`SELF0`) og dagsetning þess |
| `examWeights` | um það bil % af prófinu á hvern flokk (`EXW`) |

Áætlunin (`plan`) og skýringin undir stöðutöflunni (`examInfo.note`) koma líka úr skránni. Liður í áætlun getur nú haft `exam: true` (birt sem próf) og `go.review: true` (villubanki skriflegra dæma, `?m=written&r=1`).

### Reglur (`src/engine/self.js`)

- **Sjálfsmat flokks** = meðaltal mats þeirra kafla sem tilheyra flokknum, á bilinu 0–1; tómir reitir teljast ekki með.
- **Kunnátta** = sjálfsmatið; þegar flokkurinn hefur að minnsta kosti 3 æfð skrifleg dæmi (hraðspurningar ekki taldar) er hún meðaltal matsins og hlutfalls stiga. Án mats gildir æfingin, og án hvors tveggja 0,5.
- **Forgangur** = (1 − kunnátta) × vægi á prófi. `weakest()` raðar eftir forgangi í fagi með sjálfsmati, svo „Skrifleg dæmi“ á Yfirliti, „Efst í forgangsröðinni“ í áætluninni og tillagan á forsíðunni fylgja honum.

### Geymsla

`state.settings.self[fag] = {v: {kafli: 0–10 | null}, at: '17. nóv.', ts}`. Upphafsgildin eru sett inn ef ekkert er vistað (`ts = 0`). Breyting á Blaðinu vistast strax, klemmd á 0–10, með dagsetningu og tíma. Við sameiningu útfluttra gagna gildir það mat sem var breytt síðast. Úr vistun sjálfstæðu síðunnar (`self`, `selfAt`) flyst matið inn nema því hafi verið breytt hér.


## HAG108G 18. nóv.: gömul próf

Fjögur gömul próf voru birt: lokapróf des. 2024 og des. 2025 og endurtökupróf jan. 2025 og jan. 2026. Þau eru í `src/courses/updates/hag108g.js`, sem `applyUpdates` setur ofan á gömlu síðuna:

| Breyting | Efni |
| --- | --- |
| `extraItems` → `items` | 60 skrifleg dæmi (`steps`, `source: 'old'`, stig 2) með `paper` ('D24', 'J25', 'D25', 'J26') og `examWeight`; millilagið (`adapters/lecture.js`) bætir þeim aftan við atriðin úr gömlu síðunni. Prófin 2025–26 gefa ekki vægi; notað er vægi 2024. |
| `examFormats` | *Blandað lokapróf* (`blueprint` með `ids`) og prófin fjögur (`fixed`) fremst, öll `written` á 180 mín. með `notice` um leyfð hjálpargögn. Gamla sniðið heitir nú *Sérsniðið æfingapróf* og tekur ekki dæmi með `paper`. |
| `examInfo`, Blaðið | Sniðið er ekki lengur óstaðfest; nýr kafli fremst á Blaðinu (`hag108g-P`) með sætunum 15, vægi eftir fyrirlestrum og gildrum úr prófunum. |

Tölurnar í lausnunum voru staðfestar í R. `tests/extract.test.js` ber fagið saman við gömlu síðuna að frádregnum þessum viðbótum; `tests/hag108g-old.test.js` prófar viðbæturnar.
