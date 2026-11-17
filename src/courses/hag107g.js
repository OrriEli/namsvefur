// Búið til af scripts/extract-legacy.js úr legacy/HAG107G prófæfing.html. Ekki breyta í höndunum.
import * as L from './legacy/hag107g.js';
import adapt from './adapters/mcq.js';

export const meta = {
  "id": "hag107g",
  "code": "HAG107G",
  "name": "Eindahagfræði I",
  "short": "Einda",
  "color": "--c-hag107g",
  "engine": "mcq",
  "topics": [
    {
      "id": "inn",
      "name": "Inngangur",
      "ref": "Vika 1 · DB6 #2, #4",
      "part": "Hluti 1 · framboð, eftirspurn og íhlutanir"
    },
    {
      "id": "fe",
      "name": "Framboð og eftirspurn",
      "ref": "Vika 2 · DB1, AD1, quiz 1",
      "part": "Hluti 1 · framboð, eftirspurn og íhlutanir"
    },
    {
      "id": "tey",
      "name": "Teygni",
      "ref": "Teygni · DB3 #1–2, #8, AD3 #1",
      "part": "Hluti 1 · framboð, eftirspurn og íhlutanir"
    },
    {
      "id": "aba",
      "name": "Ábati",
      "ref": "Vika 2 · DB2, AD2",
      "part": "Hluti 1 · framboð, eftirspurn og íhlutanir"
    },
    {
      "id": "ihl",
      "name": "Skattar og íhlutanir",
      "ref": "DB3 #3–7, AD3, AD4 #2–3",
      "part": "Hluti 1 · framboð, eftirspurn og íhlutanir"
    },
    {
      "id": "yta",
      "name": "Ytri áhrif og samgæði",
      "ref": "K9, K10 · DB4, AD4 #1",
      "part": "Hluti 2 · ytri áhrif, neytendur og fyrirtæki"
    },
    {
      "id": "nyt",
      "name": "Nytjar og neytendaval",
      "ref": "K4 · DB5, AD5",
      "part": "Hluti 2 · ytri áhrif, neytendur og fyrirtæki"
    },
    {
      "id": "kos",
      "name": "Framleiðsla og kostnaður",
      "ref": "K5 · DB6, DB7 #1–2",
      "part": "Hluti 2 · ytri áhrif, neytendur og fyrirtæki"
    },
    {
      "id": "sam",
      "name": "Fullkomin samkeppni",
      "ref": "K6 · DB7 #3, AD6",
      "part": "Hluti 2 · ytri áhrif, neytendur og fyrirtæki"
    },
    {
      "id": "ein",
      "name": "Einokun",
      "ref": "K11 · DB7 #4, DB8 #1–3, AD7, AD8 #1",
      "part": "Hluti 3 · markaðsform, viðskipti og óvissa"
    },
    {
      "id": "eis",
      "name": "Einokunarsamkeppni",
      "ref": "K12 · DB8 #4, AD8 #2–4",
      "part": "Hluti 3 · markaðsform, viðskipti og óvissa"
    },
    {
      "id": "fak",
      "name": "Fákeppni og leikjafræði",
      "ref": "K13 · DB9 #1–3, AD9 #1",
      "part": "Hluti 3 · markaðsform, viðskipti og óvissa"
    },
    {
      "id": "vid",
      "name": "Alþjóðaviðskipti",
      "ref": "K17 · DB9 #4, AD9 #2",
      "part": "Hluti 3 · markaðsform, viðskipti og óvissa"
    },
    {
      "id": "ovi",
      "name": "Óvissa og tryggingar",
      "ref": "K18",
      "part": "Hluti 3 · markaðsform, viðskipti og óvissa"
    }
  ],
  "examFormats": [
    {
      "id": "lok",
      "name": "Lokapróf",
      "desc": "Allir 14 flokkar með vægi annarprófanna. Allar spurningagerðir og reikningar með nýjum tölum.",
      "style": "inspera",
      "minutes": 180,
      "pick": {
        "by": "quota",
        "quota": {
          "inn": 3,
          "fe": 5,
          "tey": 4,
          "aba": 2,
          "ihl": 3,
          "yta": 4,
          "nyt": 4,
          "kos": 4,
          "sam": 3,
          "ein": 3,
          "eis": 3,
          "fak": 4,
          "vid": 3,
          "ovi": 3
        }
      }
    },
    {
      "id": "half",
      "name": "Hálft lokapróf",
      "desc": "Sama blanda í hálfri stærð, þegar þú hefur eina og hálfa klukkustund.",
      "style": "inspera",
      "minutes": 90,
      "pick": {
        "by": "quota",
        "quota": {
          "inn": 1,
          "fe": 3,
          "tey": 2,
          "aba": 1,
          "ihl": 2,
          "yta": 2,
          "nyt": 2,
          "kos": 2,
          "sam": 2,
          "ein": 2,
          "eis": 1,
          "fak": 2,
          "vid": 1,
          "ovi": 1
        }
      }
    },
    {
      "id": "gen",
      "name": "Reikningapróf",
      "desc": "Aðeins reikningar með nýjum tölum, úr öllum hlutum námskeiðsins.",
      "style": "inspera",
      "minutes": 45,
      "pick": {
        "by": "gens",
        "n": 15
      }
    },
    {
      "id": "p1",
      "name": "Hluti 1",
      "desc": "Sama efni og annarpróf 1: inngangur, framboð og eftirspurn, teygni, ábati, skattar og íhlutanir.",
      "style": "inspera",
      "minutes": 60,
      "pick": {
        "by": "quota",
        "quota": {
          "inn": 3,
          "fe": 4,
          "tey": 4,
          "aba": 2,
          "ihl": 3
        }
      }
    },
    {
      "id": "p2",
      "name": "Hluti 2",
      "desc": "Sama efni og annarpróf 2: ytri áhrif og samgæði, nytjar og neytendaval, framleiðsla og kostnaður, fullkomin samkeppni.",
      "style": "inspera",
      "minutes": 60,
      "pick": {
        "by": "quota",
        "quota": {
          "yta": 4,
          "nyt": 4,
          "kos": 4,
          "sam": 4
        }
      }
    },
    {
      "id": "p3",
      "name": "Hluti 3",
      "desc": "Sama efni og annarpróf 3: einokun, einokunarsamkeppni, fákeppni og leikjafræði, alþjóðaviðskipti, óvissa og tryggingar.",
      "style": "inspera",
      "minutes": 60,
      "pick": {
        "by": "quota",
        "quota": {
          "ein": 3,
          "eis": 3,
          "fak": 4,
          "vid": 3,
          "ovi": 3
        }
      }
    }
  ],
  "sheet": {
    "head": "\n<div class=\"stack\" style=\"gap:6px\"><span class=\"eyebrow\">Upprifjun · allt námskeiðið, í röð kaflanna</span><h1>Blaðið</h1><p class=\"muted\" style=\"max-width:62ch\">Formúlurnar, myndirnar og keðjurnar sem koma aftur og aftur, og gildrurnar sem annarprófin og dæmablöðin byggja á. Lestu einn hluta í einu og skrifaðu formúlurnar svo á autt blað án þess að kíkja.</p></div>\n\n",
    "sections": [
      {
        "id": "hag107g-01",
        "n": "01",
        "title": "Fyrirkomulag",
        "html": "<section><h2><span class=\"n\">01</span>Fyrirkomulag</h2>\n<ul><li>Föstudagur 4. desember, kl. 13:30–16:30 (3 klst.), stofa S-261.</li>\n<li>Annarprófin voru í Inspera með fjórum gerðum: kross, „veldu allt sem á við“, rétt/rangt-pörun og tölusvör. Gerðu ráð fyrir því sama.</li>\n<li>Í „veldu allt“ kostar rangt val stig. Veldu aðeins það sem þú ert viss um.</li>\n<li>Tölusvör: reiknaðu með fullri nákvæmni og námundaðu í lokin. Athugaðu formerki og einingar (þúsundir, milljónir).</li>\n<li>Prófefnið er allt námskeiðið: kaflar 1–13, 17 og 18 (fram að „behavioral economics“).</li></ul></section>"
      },
      {
        "id": "hag107g-02",
        "n": "02",
        "title": "Framboð, eftirspurn og jafnvægi",
        "html": "<section><h2><span class=\"n\">02</span>Framboð, eftirspurn og jafnvægi</h2>\n<div class=\"cols\">\n<div><h3>Jafnvægi</h3><div class=\"f\">Q<sub>D</sub> = a − bP · Q<sub>S</sub> = c + eP<br>P* = (a − c)/(b + e)<br>Q* = a − bP*</div><p class=\"hint\">Athugaðu alltaf: settu P* inn í <b>bæði</b> föllin.</p></div>\n<div><h3>Hliðrun eða færsla?</h3><ul>\n<li>Verð vörunnar sjálfrar ⇒ færsla <b>eftir</b> ferlinum.</li>\n<li>Eftirspurn hliðrast: tekjur, verð tengdra vara, smekkur, væntingar, fjöldi kaupenda.</li>\n<li>Framboð hliðrast: verð aðfanga, tækni, fjöldi seljenda, væntingar.</li></ul></div>\n</div>\n<div class=\"scroll\"><table class=\"tt\"><thead><tr><th>Breyting</th><th>P</th><th>Q</th></tr></thead><tbody>\n<tr><td>Eftirspurn →</td><td>↑</td><td>↑</td></tr><tr><td>Eftirspurn ←</td><td>↓</td><td>↓</td></tr>\n<tr><td>Framboð →</td><td>↓</td><td>↑</td></tr><tr><td>Framboð ←</td><td>↑</td><td>↓</td></tr>\n<tr><td><b>Tvær hliðranir</b></td><td colspan=\"2\">Það sem hreyfist í sömu átt er ljóst; hitt er óvisst</td></tr></tbody></table></div>\n<p class=\"hint\">Venjuleg vara: tekjur ↑ ⇒ eftirspurn ↑. Óæðri vara: tekjur ↑ ⇒ eftirspurn ↓ (núðlur). Staðkvæmdarvörur: P<sub>A</sub> ↑ ⇒ D<sub>B</sub> ↑. Stoðvörur: P<sub>A</sub> ↑ ⇒ D<sub>B</sub> ↓. Heildareftirspurn og -framboð einkagæða = <b>lárétt</b> summa.</p></section>"
      },
      {
        "id": "hag107g-03",
        "n": "03",
        "title": "Teygni",
        "html": "<section><h2><span class=\"n\">03</span>Teygni</h2>\n<div class=\"cols\">\n<div><div class=\"f\">ε = %ΔQ / %ΔP<br>Miðpunkta: %ΔQ = ΔQ / ((Q₁ + Q₂)/2)<br>Línulegt: ε = (dQ/dP) × (P/Q)<br>%ΔQ = ε × %ΔP</div>\n<div class=\"scroll\"><table class=\"tt\"><tbody>\n<tr><td>|ε| = 0</td><td>Fullkomlega óteygin (lóðrétt)</td></tr>\n<tr><td>|ε| &lt; 1</td><td>Óteygin: P ↑ ⇒ HT ↑</td></tr>\n<tr><td>|ε| = 1</td><td>Hlutlaus: HT óbreyttar</td></tr>\n<tr><td>|ε| &gt; 1</td><td>Teygin: P ↑ ⇒ HT ↓</td></tr>\n<tr><td>|ε| = ∞</td><td>Fullkomlega teygin (lárétt)</td></tr></tbody></table></div></div>\n<div><ul>\n<li><b>Tekjuteygni</b>: &gt; 0 venjuleg, &lt; 0 óæðri, &gt; 1 lúxus.</li>\n<li><b>Víxlteygni</b>: &gt; 0 staðkvæmdarvörur, &lt; 0 stoðvörur.</li>\n<li>Teygnari eftirspurn: margar staðkvæmdarvörur, lúxus, þröngur markaður, langur tími.</li>\n<li>Teygnara framboð: auðvelt að breyta framleiðslu, langur tími. Land er óteygið.</li>\n<li>Á línulegum ferli er hallinn fastur en teygnin breytist: teygin ofarlega, óteygin neðarlega.</li>\n</ul></div></div></section>"
      },
      {
        "id": "hag107g-04",
        "n": "04",
        "title": "Ábati, skattar og íhlutanir",
        "html": "<section><h2><span class=\"n\">04</span>Ábati, skattar og íhlutanir</h2>\n<div class=\"cols\">\n<div><h3>Ábati</h3><div class=\"f\">NÁ = ½ × Q* × (P<sub>max</sub> − P*)<br>FÁ = ½ × Q* × (P* − P<sub>min</sub>)<br>P<sub>max</sub>, P<sub>min</sub>: skurður við verðás (Q = 0)<br>Heildarábati = greiðsluvilji − kostnaður</div></div>\n<div><h3>Einingaskattur t</h3><div class=\"f\">Q<sub>D</sub>(P<sub>k</sub>) = Q<sub>S</sub>(P<sub>k</sub> − t)<br>P<sub>s</sub> = P<sub>k</sub> − t<br>Tekjur = t × Q<sub>nýtt</sub><br>DWL = ½ × t × (Q* − Q<sub>nýtt</sub>)<br>Hlutur kaupenda = t × e/(b + e)</div></div>\n</div>\n<ul>\n<li>Sama niðurstaða hvort skatturinn er lagður á kaupendur eða seljendur. Sá <b>óteygnari</b> ber meira.</li>\n<li>Allratap vex með teygni (meira til langs tíma). Fullkomlega óteygin eftirspurn ⇒ ekkert allratap.</li>\n<li><b>Verðþak</b> bindandi undir P* ⇒ skortur; <b>verðgólf</b> bindandi yfir P* ⇒ offramboð. Selt magn = styttri hliðin.</li>\n<li><b>Niðurgreiðsla</b> s: kostnaður = s × <b>nýtt</b> magn; DWL = ½ × s × (Q<sub>nýtt</sub> − Q*). Fleiri fá vöruna en samt verður allratap.</li>\n</ul></section>"
      },
      {
        "id": "hag107g-05",
        "n": "05",
        "title": "Ytri áhrif og samgæði",
        "html": "<section><h2><span class=\"n\">05</span>Ytri áhrif og samgæði</h2>\n<div class=\"cols\">\n<div><div class=\"f\">SMC = MC<sub>p</sub> + MC<sub>e</sub><br>Markaður: P = MC<sub>p</sub> · Kjörstaða: P = SMC<br>Pigou-skattur = MC<sub>e</sub>(Q*)</div>\n<ul><li>Neikvæð ⇒ of mikið magn (mengun). Jákvæð ⇒ of lítið (bólusetning).</li>\n<li>Peningaleg ytri áhrif (í gegnum verð) eru <b>ekki</b> markaðsbrestur.</li>\n<li>Coase: enginn viðskiptakostnaður ⇒ skilvirk lausn óháð eignarrétti.</li>\n<li>Skattur ákveður verð mengunar; kvóti ákveður magnið.</li></ul></div>\n<div><div class=\"scroll\"><table class=\"tt\"><thead><tr><th></th><th>Útilokun</th><th>Engin útilokun</th></tr></thead><tbody>\n<tr><td>Samkeppni</td><td>Einkagæði</td><td>Almenningur</td></tr>\n<tr><td>Engin samkeppni</td><td>Klúbbgæði</td><td>Samgæði</td></tr></tbody></table></div>\n<p class=\"hint\">Samgæði: laumufarþegar ⇒ of lítið framboð. Eftirspurn = <b>lóðrétt</b> summa; Q* þar sem MSB = MC. Almenningur ⇒ ofnýting (fiskurinn í sjónum).</p></div>\n</div></section>"
      },
      {
        "id": "hag107g-06",
        "n": "06",
        "title": "Neytendaval",
        "html": "<section><h2><span class=\"n\">06</span>Neytendaval</h2>\n<div class=\"cols\">\n<div><div class=\"f\">I = P<sub>x</sub>x + P<sub>y</sub>y<br>Skurðir: I/P<sub>x</sub> og I/P<sub>y</sub><br>|halli| = P<sub>x</sub>/P<sub>y</sub><br>|MRS| = MU<sub>x</sub>/MU<sub>y</sub> = |Δy/Δx|<br>Hámark: |MRS| = P<sub>x</sub>/P<sub>y</sub></div></div>\n<div><ul>\n<li>Tekjur ↑ ⇒ bandið hliðrast samsíða. P<sub>x</sub> ↑ ⇒ snýst um y-skurðinn (ás vörunnar sem breyttist <b>ekki</b>).</li>\n<li>Jafngildisferlar: hærri betri, niðurhallandi, skerast ekki, kúptir.</li>\n<li>Bein lína = fullkomnar staðkvæmdarvörur; rétthorn = fullkomnar stuðningsvörur.</li>\n<li>Skiptiáhrif: eftir sama ferli. Tekjuáhrif: yfir á nýjan feril.</li>\n<li><b>Giffen</b>: P ↑ ⇒ Q ↑; óæðri vara þar sem tekjuáhrifin yfirgnæfa skiptiáhrifin.</li>\n</ul></div></div></section>"
      },
      {
        "id": "hag107g-07",
        "n": "07",
        "title": "Kostnaður og fullkomin samkeppni",
        "html": "<section><h2><span class=\"n\">07</span>Kostnaður og fullkomin samkeppni</h2>\n<div class=\"cols\">\n<div><div class=\"f\">HK = FK + BK<br>JK = ΔHK/Δq · MHK = HK/q · MBK = BK/q<br>JK sker MHK og MBK í lágmarki þeirra<br>Hagfr. hagnaður = HT − beinn − óbeinn</div>\n<ul><li>Minnkandi jaðarframleiðsla ⇒ vaxandi JK.</li><li>Til langs tíma er allur kostnaður breytilegur.</li><li>LR MHK: ↓ stærðarhagkvæmni, flatt stöðug, ↑ óhagkvæmni.</li><li>Sokkinn kostnaður skiptir ekki máli (steikin hennar Tinnu).</li></ul></div>\n<div><div class=\"scroll\"><table class=\"tt\"><thead><tr><th>Ef</th><th>Fyrirtæki í samkeppni</th></tr></thead><tbody>\n<tr><td class=\"mono\">P = JK</td><td>Hagnaðarhámörkun (P = MT = JT)</td></tr>\n<tr><td class=\"mono\">P &lt; MBK</td><td><b>Hlé</b> til skamms tíma</td></tr>\n<tr><td class=\"mono\">MBK ≤ P &lt; MHK</td><td>Framleiða með tapi til skamms tíma</td></tr>\n<tr><td class=\"mono\">P &lt; MHK</td><td><b>Fara út</b> til langs tíma</td></tr>\n<tr><td class=\"mono\">P &gt; MHK</td><td>Hagnaður ⇒ innkoma</td></tr></tbody></table></div>\n<p class=\"hint\">Framboð til skamms tíma = JK fyrir ofan MBK; til langs tíma = JK fyrir ofan MHK. Langtímajafnvægi: P = lágmark MHK, hagnaður núll, n = Q/q.</p></div>\n</div></section>"
      },
      {
        "id": "hag107g-08",
        "n": "08",
        "title": "Einokun",
        "html": "<section><h2><span class=\"n\">08</span>Einokun</h2>\n<div class=\"cols\">\n<div><div class=\"f\">JT = JK ⇒ Q, P lesið af eftirspurn<br>P = a − bQ ⇒ JT = a − 2bQ<br>Föst JK: P* = (a + JK)/2<br>DWL = ½ × (Q<sub>S</sub> − Q<sub>E</sub>) × (P<sub>E</sub> − JK)</div></div>\n<div><div class=\"f\">L = (P − MC)/P = −1/ε<br>P = MC × |ε|/(|ε| − 1)<br>HHI = Σ sᵢ² (einokun 10.000)<br>Skattur t ⇒ P hækkar um t/2</div></div>\n</div>\n<ul><li>Fastur kostnaður breytir aldrei P eða Q, aðeins hagnaði.</li>\n<li>Einokari framleiðir alltaf á teygna hluta eftirspurnar.</li>\n<li>Verðmismunun: 1. stigs (hver á greiðsluvilja, ekkert DWL, enginn NÁ), 2. stigs (magnafsláttur), 3. stigs (hópar: nemar).</li>\n<li>Náttúruleg einokun: P = JK ⇒ tap, því JK &lt; MHK.</li></ul></section>"
      },
      {
        "id": "hag107g-09",
        "n": "09",
        "title": "Markaðsformin og leikjafræði",
        "html": "<section><h2><span class=\"n\">09</span>Markaðsformin og leikjafræði</h2>\n<div class=\"scroll\"><table class=\"tt\"><thead><tr><th></th><th>Einokun</th><th>Fákeppni</th><th>Einok.samk.</th><th>Full. samk.</th></tr></thead><tbody>\n<tr><td>Fjöldi</td><td>1</td><td>Nokkur</td><td>Mörg</td><td>Mörg</td></tr>\n<tr><td>Hindranir</td><td>Já</td><td><b>Umtalsverðar</b></td><td>Nei</td><td>Nei</td></tr>\n<tr><td>Verð</td><td>P &gt; JK</td><td>P &gt; JK</td><td>P &gt; JK</td><td><b>P = JK</b></td></tr>\n<tr><td>Hagnaður lt.</td><td>≥ 0</td><td>≥ 0</td><td><b>0</b></td><td>0</td></tr>\n<tr><td>Háð keppinautum</td><td>Nei</td><td>Já</td><td>Já</td><td>Nei</td></tr></tbody></table></div>\n<ul><li>Einokunarsamkeppni lt.: V = MHK (snerting) og V &gt; JK ⇒ umframgeta og álagning.</li>\n<li><b>Ríkjandi</b> leikáætlun: alltaf best. <b>Nash</b>: enginn bætir sig einn. Valkreppa fangans: Nash er verra fyrir báða.</li>\n<li>Leikur í röð: leysa aftur á bak. Hótun þarf að vera trúverðug.</li>\n<li>Pizzur (P = 120 − Q, JK = 0): einokun 60 á 60 · tvíkeppni 80 á 40 · samkeppni 120 á 0.</li></ul></section>"
      },
      {
        "id": "hag107g-10",
        "n": "10",
        "title": "Alþjóðaviðskipti",
        "html": "<section><h2><span class=\"n\">10</span>Alþjóðaviðskipti</h2>\n<div class=\"scroll\"><table class=\"tt\"><thead><tr><th></th><th>Útflutn.</th><th>Innflutn.</th><th>Tollur / kvóti</th></tr></thead><tbody>\n<tr><td>Neytendur</td><td>−B</td><td>+(B + D)</td><td>−(C + D + E + F)</td></tr>\n<tr><td>Framleiðendur</td><td>+(B + D)</td><td>−B</td><td>+C</td></tr>\n<tr><td>Ríki / kvótahafar</td><td>–</td><td>–</td><td>+E</td></tr>\n<tr><td><b>Heild</b></td><td>+D</td><td>+D</td><td><b>−(D + F)</b></td></tr></tbody></table></div>\n<p class=\"hint\">P<sub>A</sub> &lt; P<sub>W</sub> ⇒ hlutfallslegir yfirburðir ⇒ útflutningur. Innflutningur = Q<sub>D</sub>(P<sub>W</sub>) − Q<sub>S</sub>(P<sub>W</sub>). %-tollur: P = P<sub>W</sub>(1 + τ); ef það fer yfir P<sub>A</sub> er tollurinn bannandi. Kvóti: Q<sub>D</sub>(P) − Q<sub>S</sub>(P) = kvóti.</p></section>"
      },
      {
        "id": "hag107g-11",
        "n": "11",
        "title": "Óvissa og upplýsingar",
        "html": "<section><h2><span class=\"n\">11</span>Óvissa og upplýsingar</h2>\n<div class=\"cols\"><div><div class=\"f\">E(V) = Σ pᵢVᵢ<br>σ = √Σ pᵢ(Vᵢ − E)²<br>E(u) = Σ pᵢ u(Vᵢ)<br>u = √V ⇒ CE = E(u)²<br>Áhættuálag = E(V) − CE</div>\n<p class=\"hint\">Hvelft u ⇒ áhættufælinn. Sanngjarnt iðgjald = p × tjón; áhættufælinn tryggir þá að fullu.</p></div>\n<div><div class=\"scroll\"><table class=\"tt\"><thead><tr><th>Vandi</th><th>Hvenær</th><th>Viðbrögð</th></tr></thead><tbody>\n<tr><td><b>Hrakval</b></td><td>Fyrir samning</td><td>Skyldu- og ríkistryggingar</td></tr>\n<tr><td><b>Freistnivandi</b></td><td>Eftir samning (ex ante / ex post)</td><td>Sjálfsábyrgð</td></tr>\n<tr><td>Umboðsvandi</td><td>Umboðsaðili veit meira</td><td>–</td></tr></tbody></table></div></div></div></section>"
      },
      {
        "id": "hag107g-12",
        "n": "12",
        "title": "Gildrurnar",
        "html": "<section><h2><span class=\"n\">12</span>Gildrurnar</h2>\n<ul>\n<li>Verðbreyting vörunnar sjálfrar hliðrar <b>ekki</b> ferlinum.</li>\n<li>Miðpunktsaðferð: deildu með <b>meðaltali</b>, ekki upphafsgildi.</li>\n<li>Skurðpunktar ábatasvæða eru á <b>verð</b>ásnum (Q = 0).</li>\n<li>Allratap er þríhyrningur: ½. Skatttekjur, tolltekjur og hagnaður eru tilfærslur, ekki tap.</li>\n<li>Pigou-skatturinn miðast við ytri kostnaðinn í <b>kjörmagninu</b>, ekki markaðsmagninu.</li>\n<li>Tekjubandið snýst um ás vörunnar sem breyttist <b>ekki</b> í verði.</li>\n<li>JK = mismunur á HK; MHK = HK deilt með magni. Fastur kostnaður = HK við q = 0.</li>\n<li>Hlé: P &lt; <b>MBK</b>. Brotthvarf: P &lt; <b>MHK</b>.</li>\n<li>Einokun: JT = JK, svo verð af eftirspurninni (ekki P = JK, ekki JT = 0).</li>\n<li>Lerner (0–1) ≠ HHI (0–10.000).</li>\n<li>Hrakval = fyrir samning; freistnivandi = eftir samning.</li>\n<li>Spurningar um hvað á <b>EKKI</b> við: lestu þær tvisvar.</li>\n</ul></section>"
      }
    ]
  },
  "examInfo": {
    "title": "Lokapróf",
    "note": "„Í annarpr.“ er fjöldi spurninga úr annarprófum 1–3 í hverjum flokki (52 alls). Lokaprófið hér er 48 spurningar með sama hlutfalli; ábati fær tvær því dæmablöðin vega þar þungt. Fjöldi spurninga á raunverulega prófinu er óþekktur.",
    "facts": [
      {
        "value": "3 klst.",
        "label": "fös. 4. des., 13:30–16:30"
      },
      {
        "value": "S-261",
        "label": "prófstofa"
      },
      {
        "value": "4 gerðir",
        "label": "kross, veldu allt, pörun, tölusvar"
      },
      {
        "value": "14",
        "label": "flokkar í þremur hlutum"
      }
    ]
  },
  "passScore": 1,
  "sourceLabels": {
    "gen": "Reikningar"
  },
  "genLabel": "Reikningur",
  "newSrc": {
    "prefix": "Ný · ",
    "fallback": "Ný spurning"
  },
  "points": "type",
  "legacy": {
    "key": "hag107g-lokaprof-v1",
    "file": "HAG107G prófæfing.html"
  }
};

/** @type {import('../schema.js').Course} */
export default adapt(meta, L);
