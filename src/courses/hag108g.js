// Búið til af scripts/extract-legacy.js úr legacy/HAG108G prófæfing.html. Ekki breyta í höndunum.
import * as L from './legacy/hag108g.js';
import adapt from './adapters/lecture.js';

export const meta = {
  "id": "hag108g",
  "code": "HAG108G",
  "name": "Líkindafræði og forritun",
  "short": "Líkindi",
  "color": "--c-hag108g",
  "engine": "lecture",
  "topics": [
    {
      "id": "L00",
      "name": "Inngangur og R",
      "ref": "–"
    },
    {
      "id": "L01",
      "name": "Útkomurúm og líkindi",
      "ref": "SBE 3.1–3.5"
    },
    {
      "id": "L02",
      "name": "Strjálar slembibreytur",
      "ref": "SBE 4.1–4.3"
    },
    {
      "id": "L03",
      "name": "Strjálar dreifingar",
      "ref": "SBE 4.4–4.5"
    },
    {
      "id": "L04",
      "name": "Samfelldar slembibreytur",
      "ref": "SBE 5.1–5.2"
    },
    {
      "id": "L05",
      "name": "Samfelldar dreifingar",
      "ref": "SBE 5.3–5.5"
    },
    {
      "id": "L06",
      "name": "Margvíðar slembibreytur og skilyrt vægi",
      "ref": "SBE 4.7, 5.6, 7.1–7.4"
    },
    {
      "id": "L07",
      "name": "Úrtök og höfuðmarkgildissetningin",
      "ref": "SBE 6.1–6.4"
    },
    {
      "id": "L08",
      "name": "Metlar og punktamat",
      "ref": "SBE 9.1–9.4"
    },
    {
      "id": "L09",
      "name": "Tilgátupróf og öryggisbil",
      "ref": "SBE 9.1–9.6"
    }
  ],
  "levels": {
    "1": {
      "name": "Grunnur",
      "desc": "Skilgreining, ein formúla, eitt skref."
    },
    "2": {
      "name": "Prófstig",
      "desc": "Í stíl við heimaverkefnin. Kjarninn, því prófið líkist þeim."
    },
    "3": {
      "name": "Erfitt",
      "desc": "Margþrepa dæmi, samdreifingar, skilyrt vægi og útleiðslur."
    }
  },
  "modes": [
    {
      "id": "pick",
      "label": "Valin stig"
    },
    {
      "id": "adapt",
      "label": "Stigvaxandi",
      "adapt": true
    },
    {
      "id": "cards",
      "label": "Aðeins spjöld",
      "cards": true
    }
  ],
  "examFormats": [
    {
      "id": "mix",
      "name": "Blandað lokapróf",
      "desc": "Sama snið og vægi og síðustu fjögur próf: 15 dæmi, hvert dregið úr einu prófanna fjögurra, svo samsetningin er ný í hvert sinn.",
      "style": "written",
      "minutes": 180,
      "notice": "Skrifaðu allar lausnir á blað með millireikningum. Reiknivél, formúlublað og töflur fyrir N, t, χ² og F eru leyfð (töflurnar eru á Blaðinu).",
      "pick": {
        "by": "blueprint",
        "sections": [
          {
            "ids": [
              "D24-1",
              "J25-1",
              "D25-1",
              "J26-1"
            ],
            "weight": 5
          },
          {
            "ids": [
              "D24-2",
              "J25-2",
              "D25-2",
              "J26-2"
            ],
            "weight": 5
          },
          {
            "ids": [
              "D24-3",
              "J25-3",
              "D25-3",
              "J26-3"
            ],
            "weight": 5
          },
          {
            "ids": [
              "D24-4",
              "J25-4",
              "D25-4",
              "J26-4"
            ],
            "weight": 10
          },
          {
            "ids": [
              "D24-5",
              "J25-5",
              "D25-5",
              "J26-5"
            ],
            "weight": 5
          },
          {
            "ids": [
              "D24-6",
              "J25-6",
              "D25-6",
              "J26-6"
            ],
            "weight": 10
          },
          {
            "ids": [
              "D24-7",
              "J25-7",
              "D25-7",
              "J26-7"
            ],
            "weight": 10
          },
          {
            "ids": [
              "D24-8",
              "J25-8",
              "D25-8",
              "J26-8"
            ],
            "weight": 10
          },
          {
            "ids": [
              "D24-9",
              "J25-9",
              "D25-9",
              "J26-9"
            ],
            "weight": 5
          },
          {
            "ids": [
              "D24-10",
              "J25-10",
              "D25-10",
              "J26-10"
            ],
            "weight": 15
          },
          {
            "ids": [
              "D24-11",
              "J25-11",
              "D25-11",
              "J26-11"
            ],
            "weight": 10
          },
          {
            "ids": [
              "D24-12",
              "J25-12",
              "D25-12",
              "J26-12"
            ],
            "weight": 2
          },
          {
            "ids": [
              "D24-13",
              "J25-13",
              "D25-13",
              "J26-13"
            ],
            "weight": 2
          },
          {
            "ids": [
              "D24-14",
              "J25-14",
              "D25-14",
              "J26-14"
            ],
            "weight": 2
          },
          {
            "ids": [
              "D24-15",
              "J25-15",
              "D25-15",
              "J26-15"
            ],
            "weight": 4
          }
        ]
      }
    },
    {
      "id": "D25",
      "name": "Lokapróf desember 2025",
      "desc": "Nýjasta lokaprófið: Bayes, jafndreifing, normaldreifing, samdreifni, minnstu kvaðröt og Jarque–Bera í R. Vægi dæma er ekki gefið; notað er vægi 2024.",
      "style": "written",
      "minutes": 180,
      "notice": "Skrifaðu allar lausnir á blað með millireikningum. Reiknivél, formúlublað og töflur fyrir N, t, χ² og F eru leyfð (töflurnar eru á Blaðinu).",
      "pick": {
        "by": "fixed",
        "ids": [
          "D25-1",
          "D25-2",
          "D25-3",
          "D25-4",
          "D25-5",
          "D25-6",
          "D25-7",
          "D25-8",
          "D25-9",
          "D25-10",
          "D25-11",
          "D25-12",
          "D25-13",
          "D25-14",
          "D25-15"
        ]
      }
    },
    {
      "id": "J26",
      "name": "Endurtökupróf janúar 2026",
      "desc": "Summa óháðra normalbreyta, óháðar samfelldar breytur, minnstu kvaðröt og Welch í R. Vægi dæma er ekki gefið; notað er vægi 2024.",
      "style": "written",
      "minutes": 180,
      "notice": "Skrifaðu allar lausnir á blað með millireikningum. Reiknivél, formúlublað og töflur fyrir N, t, χ² og F eru leyfð (töflurnar eru á Blaðinu).",
      "pick": {
        "by": "fixed",
        "ids": [
          "J26-1",
          "J26-2",
          "J26-3",
          "J26-4",
          "J26-5",
          "J26-6",
          "J26-7",
          "J26-8",
          "J26-9",
          "J26-10",
          "J26-11",
          "J26-12",
          "J26-13",
          "J26-14",
          "J26-15"
        ]
      }
    },
    {
      "id": "D24",
      "name": "Lokapróf desember 2024",
      "desc": "Veldis- og tvíkostadreifing, skilyrtar dreifingar, hlutföll með F-prófi og sennileikamat á Poisson.",
      "style": "written",
      "minutes": 180,
      "notice": "Skrifaðu allar lausnir á blað með millireikningum. Reiknivél, formúlublað og töflur fyrir N, t, χ² og F eru leyfð (töflurnar eru á Blaðinu).",
      "pick": {
        "by": "fixed",
        "ids": [
          "D24-1",
          "D24-2",
          "D24-3",
          "D24-4",
          "D24-5",
          "D24-6",
          "D24-7",
          "D24-8",
          "D24-9",
          "D24-10",
          "D24-11",
          "D24-12",
          "D24-13",
          "D24-14",
          "D24-15"
        ]
      }
    },
    {
      "id": "J25",
      "name": "Endurtökupróf janúar 2025",
      "desc": "Poisson, normalnálgun tvíkostadreifingar, einhliða próf í öfuga átt og sennileikamat á Bernoulli.",
      "style": "written",
      "minutes": 180,
      "notice": "Skrifaðu allar lausnir á blað með millireikningum. Reiknivél, formúlublað og töflur fyrir N, t, χ² og F eru leyfð (töflurnar eru á Blaðinu).",
      "pick": {
        "by": "fixed",
        "ids": [
          "J25-1",
          "J25-2",
          "J25-3",
          "J25-4",
          "J25-5",
          "J25-6",
          "J25-7",
          "J25-8",
          "J25-9",
          "J25-10",
          "J25-11",
          "J25-12",
          "J25-13",
          "J25-14",
          "J25-15"
        ]
      }
    },
    {
      "id": "blandad",
      "name": "Sérsniðið æfingapróf",
      "desc": "Krossar, tölusvör og skrifleg dæmi úr glærum, dæmablöðum og nýjum spurningum. Þú velur fyrirlestra, blöndu og lengd. Gömlu prófin eru ekki með hér.",
      "style": "mixed",
      "pick": {
        "by": "levels",
        "mixes": [
          {
            "id": "exam",
            "name": "Eins og prófið",
            "w": [
              0.2,
              0.5,
              0.3
            ]
          },
          {
            "id": "hard",
            "name": "Erfitt",
            "w": [
              0.1,
              0.3,
              0.6
            ]
          }
        ],
        "lengths": [
          {
            "id": "short",
            "minutes": 90,
            "n": 12,
            "cards": 1
          },
          {
            "id": "long",
            "minutes": 180,
            "n": 24,
            "cards": 2
          }
        ],
        "defaultLength": "long",
        "explain": true,
        "stepCapL3": 0.3333333333333333,
        "points": {
          "mc": 1,
          "num": 1,
          "steps": 3,
          "card": 0
        },
        "rShare": {
          "topic": "L00",
          "share": 0.15
        }
      }
    }
  ],
  "sheet": {
    "head": "\n    <div class=\"stack\" style=\"gap:6px\"><span class=\"eyebrow\">Formúlublað · dreifingar · R · gildrur</span><h1>Blaðið</h1><p class=\"muted\" style=\"max-width:64ch\">Allt sem þarf að muna, eftir fyrirlestrum. Óstaðfest hvort formúlublaðið er eigið eða frá kennara. Töflur fyrir N, t, χ² og F eru leyfðar á prófinu.</p></div>\n    ",
    "sections": [
      {
        "id": "hag108g-P",
        "n": "P",
        "title": "Snið lokaprófsins",
        "html": "<section><h2><span class=\"n\">P</span>Snið lokaprófsins</h2><p class=\"hint\">Fjögur síðustu prófin (des. 2024, jan. 2025, des. 2025, jan. 2026) hafa öll sama snið: 15 skrifleg dæmi í 8 hlutum á 3 klst. Sama spurningin kemur aftur með nýjum tölum.</p><div class=\"scroll\"><table class=\"tt\"><thead><tr><th>Dæmi</th><th>Alltaf spurt um</th><th>Vægi %</th></tr></thead><tbody><tr><td class=\"mono\">1</td><td>Skilyrt líkindi úr talningu, fyllimengi („ekki … ekki“) og fjöldi hópa með \\(\\binom nk\\)<div class=\"hint\">Líkindafræði · L01</div></td><td class=\"mono\">5–6,5</td></tr><tr><td class=\"mono\">2</td><td>Heildarlíkur og Bayes úr tveimur eða þremur hópum<div class=\"hint\">Líkindafræði · L01</div></td><td class=\"mono\">3,5–5</td></tr><tr><td class=\"mono\">3</td><td>Strjált PMF: CDF sem þrepafall, E[X] og P(a ≤ X ≤ b)<div class=\"hint\">Slembibreytur · L02</div></td><td class=\"mono\">5</td></tr><tr><td class=\"mono\">4</td><td>Samfellt PDF: F(y), E, Var, staðalfrávik og miðgildi, hlutfallsmark eða P(a &lt; Y &lt; b)<div class=\"hint\">Slembibreytur · L04</div></td><td class=\"mono\">10</td></tr><tr><td class=\"mono\">5</td><td>Veldis-, Poisson-, jafn- eða tvíkostadreifing: stiki, E, Var og ein líkindi<div class=\"hint\">Staðlaðar dreifingar · L03, L05</div></td><td class=\"mono\">5</td></tr><tr><td class=\"mono\">6</td><td>Tvíkosta- eða normaldreifing; normalnálgun, hlutfallsmark eða summa óháðra normalbreyta<div class=\"hint\">Staðlaðar dreifingar · L03, L05</div></td><td class=\"mono\">10</td></tr><tr><td class=\"mono\">7</td><td>Tafla f(x, y): F(x, y) á töfluformi, P(X ≤ a og Y ≥ b) og jaðardreifingar<div class=\"hint\">Marvíðar dreifingar · L06</div></td><td class=\"mono\">10</td></tr><tr><td class=\"mono\">8</td><td>Samfellt f(x, y): jaðarþéttleikar, f(x | y), líkindi eða Cov, háðar eða óháðar<div class=\"hint\">Skilyrtar dreifingar · L06</div></td><td class=\"mono\">10</td></tr><tr><td class=\"mono\">9</td><td>Meðaltal, s² (n − 1), s og tvíhliða t-öryggisbil (90, 95 eða 99%)<div class=\"hint\">Úrtök og tilgátur · L09</div></td><td class=\"mono\">5</td></tr><tr><td class=\"mono\">10</td><td>Einhliða t-próf, Welch-próf á mun, F-próf á dreifni og túlkun<div class=\"hint\">Úrtök og tilgátur · L09</div></td><td class=\"mono\">15</td></tr><tr><td class=\"mono\">11</td><td>Sennileikamat (Poisson, Bernoulli) eða minnstu kvaðröt með t-prófi á β (df = n − 2)<div class=\"hint\">Metlar · L08</div></td><td class=\"mono\">10</td></tr><tr><td class=\"mono\">12</td><td>Gildi breyta eftir keyrslu: vísar, vigrar, strengir<div class=\"hint\">R · L00</div></td><td class=\"mono\">2</td></tr><tr><td class=\"mono\">13</td><td>library, rnorm/rpois, ggplot, lm og summary<div class=\"hint\">R · L00</div></td><td class=\"mono\">2</td></tr><tr><td class=\"mono\">14</td><td>Fall með if/else: hvað prentast<div class=\"hint\">R · L00</div></td><td class=\"mono\">2</td></tr><tr><td class=\"mono\">15</td><td>Innlestur (read.csv, read_excel) og túlkun á úttaki t.test eða jarque.bera.test<div class=\"hint\">R · L00</div></td><td class=\"mono\">4</td></tr></tbody></table></div><h3>Vægi eftir fyrirlestrum</h3><p>L06 marvíðar og skilyrtar dreifingar 20% · L09 öryggisbil og tilgátupróf 20% · L00 R 10% · L01 líkindi 10% · L04 samfelldar breytur 10% · L08 metlar 10% · L03 og L05 staðlaðar dreifingar 15% saman · L02 strjálar breytur 5%. L07 (úrtaksdreifing X̄) er grunnurinn að dæmum 9 og 10.</p><h3>Gildrur úr gömlu prófunum</h3><ul><li>Einhliða próf þar sem T fer í öfuga átt (jan. 2025 10a, jan. 2026 10b): H₀ er ekki hafnað, hversu stórt sem |T| er.</li><li>Sama tala í tveimur liðum sannar ekki óhæði (des. 2024, 8e): berðu f(x | y) saman við f<sub>X</sub>(x) fyrir öll y.</li><li>Minnstu kvaðröt með þremur athugunum: df = n − 2 = 1 og t = 12,706.</li><li>Summa óháðra normalbreyta: dreifnirnar leggjast saman, ekki staðalfrávikin.</li><li>R: fall sem endar á úthlutun skilar gildinu ósýnilega; <code>print()</code> birtir það. <code>read.csv()</code> án <code>&lt;-</code> geymir ekkert.</li><li>R: <code>c(\"a\", \"b\", \"c\", \"2\")[4]</code> er strengurinn \"2\", ekki talan.</li></ul></section>"
      },
      {
        "id": "hag108g-Σ",
        "n": "Σ",
        "title": "Allar dreifingar",
        "html": "<section><h2><span class=\"n\">Σ</span>Allar dreifingar</h2><div class=\"scroll\"><table class=\"tt dist\"><thead><tr><th>Dreifing</th><th>PMF / PDF</th><th>CDF</th><th>E[X]</th><th>Var[X]</th><th>R</th></tr></thead><tbody><tr><td>Bernoulli(p)</td><td>\\(p^x(1-p)^{1-x}\\)</td><td>\\(F(0) = 1 - p\\)</td><td>\\(p\\)</td><td>\\(p(1-p)\\)</td><td><code>dbinom(x, 1, p)</code></td></tr><tr><td>Bin(n, p)</td><td>\\(\\binom{n}{x}p^x(1-p)^{n-x}\\)</td><td>\\(\\sum_{i \\le x} f(i)\\)</td><td>\\(np\\)</td><td>\\(np(1-p)\\)</td><td><code>dbinom pbinom rbinom</code></td></tr><tr><td>Poisson(λ)</td><td>\\(\\frac{e^{-\\lambda}\\lambda^x}{x!}\\)</td><td>\\(\\sum_{i \\le x} f(i)\\)</td><td>\\(\\lambda\\)</td><td>\\(\\lambda\\)</td><td><code>dpois ppois rpois</code></td></tr><tr><td>Unif(a, b)</td><td>\\(\\frac{1}{b-a}\\)</td><td>\\(\\frac{x-a}{b-a}\\)</td><td>\\(\\frac{a+b}{2}\\)</td><td>\\(\\frac{(b-a)^2}{12}\\)</td><td><code>punif runif</code></td></tr><tr><td>Exp(λ)</td><td>\\(\\lambda e^{-\\lambda x}\\)</td><td>\\(1 - e^{-\\lambda x}\\)</td><td>\\(1/\\lambda\\)</td><td>\\(1/\\lambda^2\\)</td><td><code>pexp(x, rate = λ) qexp rexp</code></td></tr><tr><td>N(μ, σ²)</td><td>\\(\\frac{1}{\\sqrt{2\\pi}\\sigma}e^{-\\frac{1}{2}(\\frac{x-\\mu}{\\sigma})^2}\\)</td><td>\\(\\Phi\\left(\\frac{x-\\mu}{\\sigma}\\right)\\)</td><td>\\(\\mu\\)</td><td>\\(\\sigma^2\\)</td><td><code>pnorm(x, mean, sd)</code> · <b>sd, ekki σ²</b></td></tr><tr><td>χ²(k)</td><td>Gamma-fall</td><td>tafla / R</td><td>\\(k\\)</td><td>\\(2k\\)</td><td><code>pchisq(x, k) qchisq</code></td></tr><tr><td>t(k)</td><td>flókin</td><td>tafla / R</td><td>0 (k &gt; 1)</td><td>\\(\\frac{k}{k-2}\\) (k &gt; 2)</td><td><code>pt(x, k)</code>*</td></tr><tr><td>F(k₁, k₂)</td><td>Beta-fall</td><td>tafla / R</td><td>\\(\\frac{k_2}{k_2-2}\\) (k₂ &gt; 2)</td><td>\\(\\frac{2k_2^2(k_1+k_2-2)}{k_1(k_2-2)^2(k_2-4)}\\)</td><td><code>pf(x, k1, k2)</code>*</td></tr></tbody></table></div><p class=\"hint\">d = þéttleiki, p = F(x), q = hlutfallsmark, r = slembidráttur. * Fallið kemur ekki fyrir í glærunum; sama regla gildir.</p></section>"
      },
      {
        "id": "hag108g-=",
        "n": "=",
        "title": "Reglur um E, Var og Cov",
        "html": "<section><h2><span class=\"n\">=</span>Reglur um E, Var og Cov</h2><div class=\"scroll\"><table class=\"tt\"><tbody><tr><td>\\(E[aX + b] = aE[X] + b\\)</td><td>alltaf</td></tr><tr><td>\\(E[X + Y] = E[X] + E[Y]\\)</td><td><b>alltaf</b>, líka háðar</td></tr><tr><td>\\(E[XY] = E[X]E[Y]\\)</td><td>aðeins óháðar</td></tr><tr><td>\\(\\mathrm{Var}[aX + b] = a^2\\mathrm{Var}[X], \\; SD = |a|\\,SD[X]\\)</td><td>fastinn b hverfur</td></tr><tr><td>\\(\\mathrm{Var}[X \\pm Y] = \\mathrm{Var}[X] + \\mathrm{Var}[Y] \\pm 2\\mathrm{Cov}[X,Y]\\)</td><td>Cov = 0 ef óháðar</td></tr><tr><td>\\(\\mathrm{Var}[aX + bY] = a^2\\mathrm{Var}[X] + b^2\\mathrm{Var}[Y] + 2ab\\,\\mathrm{Cov}\\)</td><td>almennt</td></tr><tr><td>\\(\\mathrm{Cov}[aX + b, cY + d] = ac\\,\\mathrm{Cov}[X, Y]\\)</td><td>\\(\\mathrm{Cov}[X, X] = \\mathrm{Var}[X]\\)</td></tr><tr><td>\\(E[\\bar{X}] = \\mu, \\; \\mathrm{Var}[\\bar{X}] = \\sigma^2/n, \\; E[S^2] = \\sigma^2\\)</td><td>slembiúrtak</td></tr><tr><td>\\(E[X] = E[E[X \\mid Y]]\\)</td><td>endurteknar væntingar</td></tr></tbody></table></div></section>"
      },
      {
        "id": "hag108g-L00",
        "n": "L00",
        "title": "Inngangur og R",
        "html": "<section><h2><span class=\"n\">L00</span>Inngangur og R</h2><div class=\"scroll\"><ul><li>Túlkað mál (R, Python, Matlab): línu fyrir línu, gagnvirkt en hægara · þýtt (C, C++, Java): allt í einu, hraðara</li><li>Tög: numeric · integer (<code>1L</code>) · complex · character · logical; 0 = FALSE í skilyrðum</li><li>Aðgerðir: <code>&lt;-</code> <code>+ - * / ^</code> <code>%/%</code> (heiltöludeiling) <code>%%</code> (afgangur) · <code>== != &gt; &gt;= &lt; &lt;=</code></li><li>Forgangur: <code>:</code> á undan <code>* /</code> á undan <code>+ -</code> → <code>365 - 1:3 + 1</code> = 365 364 363</li><li>Inntök: nefnd fyrst, ónefnd fylla lausu sætin í röð; sjálfgefin gildi <code>function(x, y = 3)</code></li></ul></div></section>"
      },
      {
        "id": "hag108g-L01",
        "n": "L01",
        "title": "Útkomurúm og líkindi",
        "html": "<section><h2><span class=\"n\">L01</span>Útkomurúm og líkindi</h2><div class=\"scroll\"><div class=\"f\"><table class=\"cl\"><tr><td>\\(\\Pr(A^c)\\)</td><td class=\"eq\">=</td><td>\\(1 - \\Pr(A)\\)</td></tr><tr><td>\\(\\Pr(A \\cup B)\\)</td><td class=\"eq\">=</td><td>\\(\\Pr(A) + \\Pr(B) - \\Pr(A \\cap B)\\)</td></tr><tr><td>\\((A \\cup B)^c\\)</td><td class=\"eq\">=</td><td>\\(A^c \\cap B^c, \\quad (A \\cap B)^c\\)</td><td class=\"eq\">=</td><td>\\(A^c \\cup B^c\\)</td></tr><tr><td>\\(P(n,k)\\)</td><td class=\"eq\">=</td><td>\\(\\frac{n!}{(n-k)!}, \\quad C(n,k)\\)</td><td class=\"eq\">=</td><td>\\(\\binom{n}{k}\\)</td><td class=\"eq\">=</td><td>\\(\\frac{n!}{k!(n-k)!}\\)</td></tr><tr><td>\\(\\Pr(A \\mid B)\\)</td><td class=\"eq\">=</td><td>\\(\\frac{\\Pr(A \\cap B)}{\\Pr(B)}\\)</td></tr><tr><td>\\(\\Pr(A)\\)</td><td class=\"eq\">=</td><td>\\(\\sum_i \\Pr(B_i)\\Pr(A \\mid B_i)\\)</td></tr><tr><td>\\(\\Pr(A_j \\mid B)\\)</td><td class=\"eq\">=</td><td>\\(\\frac{\\Pr(A_j)\\Pr(B \\mid A_j)}{\\sum_i \\Pr(A_i)\\Pr(B \\mid A_i)}\\)</td></tr><tr><td colspan=\"9\" class=\"txt\">Óháð: Pr(A ∩ B) = Pr(A)Pr(B)</td></tr><tr><td colspan=\"9\" class=\"txt\">A.m.k. einn af n óháðum: 1 − (1 − p)ⁿ</td></tr></table></div></div></section>"
      },
      {
        "id": "hag108g-L02",
        "n": "L02",
        "title": "Strjálar slembibreytur",
        "html": "<section><h2><span class=\"n\">L02</span>Strjálar slembibreytur</h2><div class=\"scroll\"><div class=\"f\"><table class=\"cl\"><tr><td>\\(F(x)\\)</td><td class=\"eq\">=</td><td>\\(\\Pr(X \\le x)\\)</td><td class=\"eq\">=</td><td>\\(\\sum_{t \\le x} f(t)\\)</td></tr><tr><td>\\(E[X]\\)</td><td class=\"eq\">=</td><td>\\(\\sum x f(x), \\quad E[g(X)]\\)</td><td class=\"eq\">=</td><td>\\(\\sum g(x) f(x)\\)</td></tr><tr><td>\\(\\mathrm{Var}[X]\\)</td><td class=\"eq\">=</td><td>\\(E[(X - \\mu)^2]\\)</td><td class=\"eq\">=</td><td>\\(E[X^2] - E[X]^2\\)</td></tr><tr><td>\\(\\mathrm{Skew}\\)</td><td class=\"eq\">=</td><td>\\(E\\left[\\left(\\tfrac{X - \\mu}{\\sigma}\\right)^3\\right], \\quad \\mathrm{Kurt}\\)</td><td class=\"eq\">=</td><td>\\(E\\left[\\left(\\tfrac{X - \\mu}{\\sigma}\\right)^4\\right]\\)</td></tr><tr><td colspan=\"9\" class=\"txt\">Strjált miðgildi / p-hlutfallsmark: minnsta x með F(x) ≥ p</td></tr><tr><td>\\(Q\\)</td><td class=\"eq\">=</td><td>\\(a + \\frac{p - F(a)}{F(b) - F(a)}(b - a) \\quad \\text{(flokkuð gögn)}\\)</td></tr><tr><td colspan=\"9\" class=\"txt\">Jensen: g kúpt ⇒ E[g(X)] ≥ g(E[X]); g hvelft ⇒ ≤</td></tr></table></div></div></section>"
      },
      {
        "id": "hag108g-L03",
        "n": "L03",
        "title": "Strjálar dreifingar",
        "html": "<section><h2><span class=\"n\">L03</span>Strjálar dreifingar</h2><div class=\"scroll\"><div class=\"f\"><table class=\"cl\"><tr><td>\\(\\text{Bernoulli: } p^x(1-p)^{1-x}, \\; E\\)</td><td class=\"eq\">=</td><td>\\(p, \\; \\mathrm{Var}\\)</td><td class=\"eq\">=</td><td>\\(p(1-p)\\)</td></tr><tr><td>\\(\\text{Bin: } \\binom{n}{x}p^x(1-p)^{n-x}, \\; E\\)</td><td class=\"eq\">=</td><td>\\(np, \\; \\mathrm{Var}\\)</td><td class=\"eq\">=</td><td>\\(np(1-p)\\)</td></tr><tr><td>\\(\\text{Poisson: } \\frac{e^{-\\lambda}\\lambda^x}{x!}, \\; E\\)</td><td class=\"eq\">=</td><td>\\(\\mathrm{Var}\\)</td><td class=\"eq\">=</td><td>\\(\\lambda\\)</td></tr><tr><td>\\(\\mathrm{Bin}(n_1, p) + \\mathrm{Bin}(n_2, p)\\)</td><td class=\"eq\">=</td><td>\\(\\mathrm{Bin}(n_1 + n_2, p)\\)</td></tr><tr><td>\\(\\mathrm{Pois}(\\lambda_1) + \\mathrm{Pois}(\\lambda_2)\\)</td><td class=\"eq\">=</td><td>\\(\\mathrm{Pois}(\\lambda_1 + \\lambda_2)\\)</td></tr><tr><td>\\(\\mathrm{Bin}(n, \\lambda/n) \\to \\mathrm{Pois}(\\lambda), \\; n \\to \\infty\\)</td></tr></table></div></div></section>"
      },
      {
        "id": "hag108g-L04",
        "n": "L04",
        "title": "Samfelldar slembibreytur",
        "html": "<section><h2><span class=\"n\">L04</span>Samfelldar slembibreytur</h2><div class=\"scroll\"><div class=\"f\"><table class=\"cl\"><tr><td>\\(F(x)\\)</td><td class=\"eq\">=</td><td>\\(\\int_{-\\infty}^x f(t)\\,dt, \\quad f(x)\\)</td><td class=\"eq\">=</td><td>\\(F'(x)\\)</td></tr><tr><td>\\(f \\ge 0, \\quad \\int_{-\\infty}^{\\infty} f\\)</td><td class=\"eq\">=</td><td>\\(1 \\quad (f \\text{ má vera} > 1)\\)</td></tr><tr><td>\\(\\Pr(a < X < b)\\)</td><td class=\"eq\">=</td><td>\\(F(b) - F(a), \\quad \\Pr(X = x)\\)</td><td class=\"eq\">=</td><td>\\(0\\)</td></tr><tr><td>\\(E[X]\\)</td><td class=\"eq\">=</td><td>\\(\\int x f(x)\\,dx, \\quad E[X^2]\\)</td><td class=\"eq\">=</td><td>\\(\\int x^2 f(x)\\,dx\\)</td></tr><tr><td colspan=\"9\" class=\"txt\">Miðgildi: F(x) = 0,5 · p-hlutfallsmark: F(x) = p</td></tr><tr><td colspan=\"9\" class=\"txt\">Uppskrift: heilda f → F · F(∞) = 1 · líkur = mismunur · vægi með heildum · F(x) = p</td></tr></table></div></div></section>"
      },
      {
        "id": "hag108g-L05",
        "n": "L05",
        "title": "Samfelldar dreifingar",
        "html": "<section><h2><span class=\"n\">L05</span>Samfelldar dreifingar</h2><div class=\"scroll\"><div class=\"f\"><table class=\"cl\"><tr><td>\\(Z\\)</td><td class=\"eq\">=</td><td>\\(\\frac{X - \\mu}{\\sigma} \\sim N(0, 1), \\quad \\Phi(-z)\\)</td><td class=\"eq\">=</td><td>\\(1 - \\Phi(z)\\)</td></tr><tr><td>\\(aX + b \\sim N(a\\mu + b,\\; a^2\\sigma^2)\\)</td></tr><tr><td>\\(\\sum X_i \\sim N\\left(\\sum \\mu_i,\\; \\sum \\sigma_i^2\\right) \\;(\\text{óháðar})\\)</td></tr><tr><td>\\(\\chi^2(k)\\)</td><td class=\"eq\">=</td><td>\\(Z_1^2 + \\dots + Z_k^2, \\quad F\\)</td><td class=\"eq\">=</td><td>\\(\\frac{Y_1/k_1}{Y_2/k_2}, \\quad T\\)</td><td class=\"eq\">=</td><td>\\(\\frac{Z}{\\sqrt{Y/k}}\\)</td></tr><tr><td colspan=\"9\" class=\"txt\">68,3% / 95,4% / 99,7% innan 1σ / 2σ / 3σ</td></tr><tr><td colspan=\"9\" class=\"txt\">Hermun: X = F⁻¹(U), U ~ Unif(0, 1)</td></tr></table></div></div></section>"
      },
      {
        "id": "hag108g-L06",
        "n": "L06",
        "title": "Margvíðar slembibreytur og skilyrt vægi",
        "html": "<section><h2><span class=\"n\">L06</span>Margvíðar slembibreytur og skilyrt vægi</h2><div class=\"scroll\"><div class=\"f\"><table class=\"cl\"><tr><td>\\(F(x, y)\\)</td><td class=\"eq\">=</td><td>\\(\\Pr(X \\le x, Y \\le y)\\)</td></tr><tr><td>\\(f_X(x)\\)</td><td class=\"eq\">=</td><td>\\(\\sum_y f(x, y) \\;\\text{ eða }\\; \\int f(x, y)\\,dy\\)</td></tr><tr><td>\\(\\Pr(x_1 < X < x_2, y_1 < Y < y_2)\\)</td><td class=\"eq\">=</td><td>\\(F(x_2,y_2) - F(x_1,y_2) - F(x_2,y_1) + F(x_1,y_1)\\)</td></tr><tr><td>\\(\\mathrm{Cov}[X,Y]\\)</td><td class=\"eq\">=</td><td>\\(E[XY] - E[X]E[Y], \\quad \\rho\\)</td><td class=\"eq\">=</td><td>\\(\\frac{\\mathrm{Cov}}{\\sigma_X\\sigma_Y} \\in [-1, 1]\\)</td></tr><tr><td>\\(\\Sigma\\)</td><td class=\"eq\">=</td><td>\\(\\begin{pmatrix} \\mathrm{Var}[X] & \\mathrm{Cov} \\\\ \\mathrm{Cov} & \\mathrm{Var}[Y] \\end{pmatrix}\\)</td></tr><tr><td>\\(f_{Y|X}(y \\mid x)\\)</td><td class=\"eq\">=</td><td>\\(\\frac{f(x, y)}{f_X(x)}, \\quad E[X]\\)</td><td class=\"eq\">=</td><td>\\(E[E[X \\mid Y]]\\)</td></tr><tr><td colspan=\"9\" class=\"txt\">Óháðar ⇔ f(x, y) = f<sub>X</sub>(x)f<sub>Y</sub>(y)</td></tr></table></div></div></section>"
      },
      {
        "id": "hag108g-L07",
        "n": "L07",
        "title": "Úrtök og höfuðmarkgildissetningin",
        "html": "<section><h2><span class=\"n\">L07</span>Úrtök og höfuðmarkgildissetningin</h2><div class=\"scroll\"><div class=\"f\"><table class=\"cl\"><tr><td>\\(\\bar{X}\\)</td><td class=\"eq\">=</td><td>\\(\\frac{1}{n}\\sum X_i, \\quad E[\\bar{X}]\\)</td><td class=\"eq\">=</td><td>\\(\\mu, \\quad \\mathrm{Var}[\\bar{X}]\\)</td><td class=\"eq\">=</td><td>\\(\\frac{\\sigma^2}{n}\\)</td></tr><tr><td>\\(S^2\\)</td><td class=\"eq\">=</td><td>\\(\\frac{1}{n-1}\\sum (X_i - \\bar{X})^2\\)</td><td class=\"eq\">=</td><td>\\(\\frac{\\sum X_i^2 - n\\bar{X}^2}{n - 1}, \\quad E[S^2]\\)</td><td class=\"eq\">=</td><td>\\(\\sigma^2\\)</td></tr><tr><td>\\(\\mathrm{Var}[S^2]\\)</td><td class=\"eq\">=</td><td>\\(\\frac{2\\sigma^4}{n-1} \\;(\\text{normalt þýði})\\)</td></tr><tr><td>\\(\\text{CLT: } \\frac{\\bar{X} - \\mu}{\\sigma/\\sqrt{n}} \\approx N(0, 1)\\)</td></tr><tr><td>\\(\\frac{\\bar{X} - \\mu}{S/\\sqrt{n}} \\sim t_{n-1} \\;(\\text{normalt þýði, } \\sigma \\text{ óþekkt})\\)</td></tr><tr><td>\\(z\\)</td><td class=\"eq\">=</td><td>\\(\\frac{\\hat{p} - p}{\\sqrt{p(1-p)/n}}\\)</td></tr><tr><td colspan=\"9\" class=\"txt\">Veldisdreifing: λ̂ = 1/X̄</td></tr></table></div></div></section>"
      },
      {
        "id": "hag108g-L08",
        "n": "L08",
        "title": "Metlar og punktamat",
        "html": "<section><h2><span class=\"n\">L08</span>Metlar og punktamat</h2><div class=\"scroll\"><div class=\"f\"><table class=\"cl\"><tr><td>\\(B(\\hat\\theta)=E[\\hat\\theta] - \\theta, \\quad \\text{óbjagaður ef } B=0\\)</td></tr><tr><td>\\(\\mathrm{MAE}=E[|\\hat\\theta - \\theta|], \\quad \\mathrm{MSE}=E[(\\hat\\theta - \\theta)^2]=\\mathrm{Var}[\\hat\\theta] + B^2\\)</td></tr><tr><td colspan=\"9\" class=\"txt\">Skilvirkari: minni dreifni (af óbjöguðum) · samkvæmur: Var[θ̂] → 0 þegar n → ∞</td></tr><tr><td>\\(E[\\tilde S^2]=\\frac{n-1}{n}\\sigma^2 \\quad (\\tilde S^2 \\text{ deilir með } n)\\)</td></tr><tr><td colspan=\"9\" class=\"txt\">Vægjaaðferð: úrtaksvægi = vægi þýðis, eitt vægi á hvern stika</td></tr><tr><td>\\(\\text{Unif}(\\alpha,\\beta): \\; \\frac{\\hat\\alpha + \\hat\\beta}{2}=\\bar x, \\; \\frac{(\\hat\\beta - \\hat\\alpha)^2}{12}=S^2\\)</td></tr><tr><td>\\(\\text{Bin}(n,p): \\; \\hat p=1 - \\frac{S^2}{\\bar x}, \\; \\hat n=\\frac{\\bar x}{\\hat p}\\)</td></tr><tr><td>\\(\\hat\\theta=\\arg\\max_\\theta \\ell(\\theta), \\quad \\ell(\\theta)=\\sum \\log f(x_i \\mid \\theta), \\quad \\frac{d\\ell}{d\\theta}=0\\)</td></tr><tr><td colspan=\"9\" class=\"txt\">Sennileikamat: Exp λ̂ = n/Σxᵢ · Poisson λ̂ = x̄ · Unif(0, β) β̂ = max xᵢ · N: μ̂ = x̄, σ̂² = Σ(xᵢ − x̄)²/n (bjagað)</td></tr><tr><td>\\(E[\\max X_i]=\\frac{n\\beta + \\alpha}{n + 1}\\)</td></tr><tr><td>\\(\\hat\\beta=\\frac{\\sum (x_i - \\bar x)(y_i - \\bar y)}{\\sum (x_i - \\bar x)^2}, \\quad \\hat\\alpha=\\bar y - \\hat\\beta \\bar x\\)</td></tr></table></div></div></section>"
      },
      {
        "id": "hag108g-L09",
        "n": "L09",
        "title": "Tilgátupróf og öryggisbil",
        "html": "<section><h2><span class=\"n\">L09</span>Tilgátupróf og öryggisbil</h2><div class=\"scroll\"><div class=\"f\"><table class=\"cl\"><tr><td>\\(\\bar x \\pm z_{\\alpha/2}\\frac{\\sigma}{\\sqrt n} \\;(\\sigma \\text{ þekkt}), \\quad \\bar x \\pm t_{n-1,\\alpha/2}\\frac{s}{\\sqrt n} \\;(\\sigma \\text{ metið})\\)</td></tr><tr><td colspan=\"9\" class=\"txt\">Einhliða bil: z<sub>α</sub> eða t<sub>α</sub> og aðeins önnur mörkin · z<sub>0,05</sub> = 1,645 · z<sub>0,025</sub> = 1,96 · z<sub>0,01</sub> = 2,33 · z<sub>0,005</sub> = 2,58</td></tr><tr><td>\\(T=\\frac{\\bar x - \\mu_0}{s/\\sqrt n} \\sim t_{n-1}\\)</td></tr><tr><td colspan=\"9\" class=\"txt\">Hafna H₀: efra einhliða T > t(n−1; α) · neðra T < −t(n−1; α) · tvíhliða |T| > t(n−1; α/2)</td></tr><tr><td>\\(T=\\frac{\\bar x - \\bar y - D_0}{\\sqrt{s_1^2/n_1 + s_2^2/n_2}}, \\quad \\nu=\\frac{(s_1^2/n_1 + s_2^2/n_2)^2}{\\frac{(s_1^2/n_1)^2}{n_1 - 1} + \\frac{(s_2^2/n_2)^2}{n_2 - 1}}\\)</td></tr><tr><td>\\(\\chi^2=\\frac{(n-1)s^2}{\\sigma_0^2} \\sim \\chi^2_{n-1}\\)</td></tr><tr><td>\\(\\left[\\frac{(n-1)s^2}{\\chi^2_{1-\\alpha/2}},\\; \\frac{(n-1)s^2}{\\chi^2_{\\alpha/2}}\\right] \\;(\\text{hlutfallsmörk neðan frá})\\)</td></tr><tr><td>\\(F=\\frac{s_1^2}{s_2^2} \\sim F_{n_1 - 1,\\, n_2 - 1}\\)</td></tr><tr><td>\\(JB=\\frac{n}{6}\\left(S^2 + \\frac{(K-3)^2}{4}\\right) \\sim \\chi^2_2, \\quad S=\\text{skeifni}, \\; K=\\text{ferilris}\\)</td></tr><tr><td colspan=\"9\" class=\"txt\">p-gildi: efri Pr(T ≥ t) · neðri Pr(T ≤ t) · tvíhliða 2·min · hafna ef p < α</td></tr><tr><td colspan=\"9\" class=\"txt\">Villa 1: hafna sannri H₀ (α) · villa 2: hafna ekki ósannri H₀ (β) · styrkur 1 − β</td></tr></table></div></div></section>"
      },
      {
        "id": "hag108g-✓",
        "n": "✓",
        "title": "Ákvörðunarreglur",
        "html": "<section><h2><span class=\"n\">✓</span>Ákvörðunarreglur</h2><div class=\"scroll\"><table class=\"tt\"><thead><tr><th>Þegar…</th><th>…þá</th></tr></thead><tbody><tr><td>Fastur fjöldi n óháðra tilrauna, sama p, talið hve margar heppnast</td><td><b>Bin(n, p)</b></td></tr><tr><td>Fjöldi atburða á tímabili; aðeins meðaltalið þekkt</td><td><b>Poisson(λ)</b>, með λ skalað á tímabilið sem spurt er um</td></tr><tr><td>Biðtími á milli atburða (samfelldur)</td><td><b>Exp(λ)</b>, λ = 1/meðalbið</td></tr><tr><td>Bin með stórt n og lítið p</td><td>Poisson(np)</td></tr><tr><td>σ þekkt, eða n stórt (CLT)</td><td><b>z</b> og N(0, 1)</td></tr><tr><td>Normaldreift þýði, σ óþekkt, lítið n (oft ≤ 30)</td><td><b>t</b> með n − 1 frígráðum</td></tr><tr><td>Hlutfall p̂</td><td>z með p úr tilgátunni í nefnara</td></tr><tr><td>„Að minnsta kosti einn\", „einhver\", „fleiri en\" í Poisson</td><td><b>Fyllireglan</b>: 1 − Pr(engin) / 1 − F(k)</td></tr><tr><td>„X > a og Y > b\" í samdreifingu</td><td>Fyllireglan virkar <b>ekki</b> beint (De Morgan); heilda/summa yfir svæðið</td></tr><tr><td>Summa eða mismunur <b>óháðra</b> breyta</td><td><b>Dreifnir leggjast saman</b>, líka við frádrátt; staðalfrávik aldrei</td></tr><tr><td>Summa háðra breyta</td><td>Bæta ±2Cov við</td></tr><tr><td>Hlutfallsmark strjálrar breytu</td><td>min{x : F(x) ≥ p}; brúun aðeins fyrir flokkuð gögn</td></tr><tr><td>Hlutfallsmark samfelldrar breytu</td><td>Leysa F(x) = p</td></tr><tr><td>Spurt um líkur á prófstærð</td><td>Taka alltaf fram <b>einhliða</b> eða <b>tvíhliða</b></td></tr><tr><td>Tilgáta um eitt meðaltal</td><td><b>t-próf</b> (σ metið) eða z (σ þekkt)</td></tr><tr><td>Tvö óháð úrtök, munur á meðaltölum</td><td><b>Welch t-próf</b> með ν frígráðum</td></tr><tr><td>Tilgáta um dreifni eða staðalfrávik eins þýðis</td><td><b>χ²-próf</b> með n − 1 frígráðum (staðalfrávik → dreifni)</td></tr><tr><td>Tvær dreifnir bornar saman</td><td><b>F-próf</b>, F = s₁²/s₂² með (n₁ − 1, n₂ − 1)</td></tr><tr><td>Eru gögnin normaldreifð?</td><td><b>Jarque–Bera</b>, χ²₂; hafna ef JB &gt; 5,99 (α = 0,05)</td></tr><tr><td>H₁ með ≠</td><td>Tvíhliða: α/2 í hvorum hala</td></tr><tr><td>H₁ með &gt; eða &lt;</td><td>Einhliða: allt α í þeim hala sem H₁ bendir á</td></tr></tbody></table></div></section>"
      },
      {
        "id": "hag108g-R",
        "n": "R",
        "title": "R í hnotskurn",
        "html": "<section><h2><span class=\"n\">R</span>R í hnotskurn</h2><div class=\"scroll\"><table class=\"tt\"><tbody><tr><td><b>Tilvísanir</b></td><td><code>x[1]</code> fyrsta stak (byrjar á 1) · <code>x[c(1,3)]</code> · <code>x[2:4]</code> · <code>x[-1]</code> allt nema 1 · <code>x[x &gt; 5]</code> síun</td></tr><tr><td><b>matrix</b></td><td><code>matrix(1:12, nrow = 3)</code> fyllist <b>dálk fyrir dálk</b> (byrow = TRUE fyrir raðir) · <code>m[i, j]</code> · <code>m[2, ]</code> röð · <code>m[, 3]</code> dálkur</td></tr><tr><td><b>Listar</b></td><td><code>y[1]</code> undirlisti · <code>y[[1]]</code> stakið sjálft · <code>y[[2]][2]</code> · <code>y$nafn</code> = <code>y[[\"nafn\"]]</code></td></tr><tr><td><b>Gerðir</b></td><td>vektor (eitt tag) · listi (mörg tög) · matrix (2 víddir, eitt tag) · array (fleiri víddir) · data.frame (tafla, dálkar með nöfnum)</td></tr><tr><td><b>apply</b></td><td><code>apply(m, 1, f)</code> raðir · <code>apply(m, 2, f)</code> dálkar · <code>lapply</code> → listi · <code>sapply</code> → vektor · <code>vapply(x, f, numeric(1))</code> · <code>tapply(x, hópur, f)</code> · <code>mapply(f, x, y)</code></td></tr><tr><td><b>data.frame</b></td><td><code>df$Aldur</code> · <code>df[df$Aldur &lt; 30, ]</code> (tómt eftir kommu = allir dálkar) · <code>tapply(df$Aldur, df$Hópur, mean)</code> · <code>head(df)</code></td></tr><tr><td><b>Föll</b></td><td><code>f &lt;- function(x, y = 3) { return(x + y) }</code> · skilar síðustu segð eða return()</td></tr><tr><td><b>Pakkar</b></td><td><code>install.packages(\"nafn\")</code> einu sinni · <code>library(nafn)</code> í hverri keyrslu · <code>pakki::fall</code> tekur af vafa</td></tr><tr><td><b>Dreifingar</b></td><td>d = þéttleiki · p = F(x) · q = hlutfallsmark · r = slembidráttur · <code>pnorm(x, mean, sd)</code></td></tr><tr><td><b>Próf</b></td><td><code>t.test(x, mu = 6.5, alternative = \"greater\")</code> · <code>t.test(x, y)</code> (Welch) · <code>var.test(x, y)</code> (F) · <code>$statistic</code>, <code>$p.value</code>, <code>$conf.int</code> · <code>jarque.bera.test(x)</code> (pakkinn tseries)</td></tr><tr><td><b>Aðhvarf</b></td><td><code>m &lt;- lm(y ~ x)</code> · <code>coef(m)</code> · <code>summary(m)</code> gefur t-gildi og p-gildi fyrir H₀: β = 0 · <code>lm(y ~ 0 + I(x^2) + x)</code> án fastaliðar</td></tr><tr><td><b>Annað</b></td><td><code>na.rm = TRUE</code> · <code>var()</code>, <code>sd()</code> deila með n − 1 · <code>prod(365 - 1:n + 1)</code> · <code>table(x)/length(x)</code> mælt PMF · <code>replicate(n, {…})</code></td></tr></tbody></table></div></section>"
      },
      {
        "id": "hag108g-Φ",
        "n": "Φ",
        "title": "Staðlaða normaldreifingin Φ(z) = Pr(Z ≤ z)",
        "html": "<section><h2><span class=\"n\">Φ</span>Staðlaða normaldreifingin Φ(z) = Pr(Z ≤ z)</h2><p class=\"hint\">Röð = z með einum aukastaf, dálkur = annar aukastafur. Fyrir neikvætt z: Φ(−z) = 1 − Φ(z).</p><div class=\"scroll\"><table class=\"phi\"><thead><tr><th>z</th><th>,00</th><th>,01</th><th>,02</th><th>,03</th><th>,04</th><th>,05</th><th>,06</th><th>,07</th><th>,08</th><th>,09</th></tr></thead><tbody><tr><th>0,0</th><td>0,5000</td><td>0,5040</td><td>0,5080</td><td>0,5120</td><td>0,5160</td><td>0,5199</td><td>0,5239</td><td>0,5279</td><td>0,5319</td><td>0,5359</td></tr><tr><th>0,1</th><td>0,5398</td><td>0,5438</td><td>0,5478</td><td>0,5517</td><td>0,5557</td><td>0,5596</td><td>0,5636</td><td>0,5675</td><td>0,5714</td><td>0,5753</td></tr><tr><th>0,2</th><td>0,5793</td><td>0,5832</td><td>0,5871</td><td>0,5910</td><td>0,5948</td><td>0,5987</td><td>0,6026</td><td>0,6064</td><td>0,6103</td><td>0,6141</td></tr><tr><th>0,3</th><td>0,6179</td><td>0,6217</td><td>0,6255</td><td>0,6293</td><td>0,6331</td><td>0,6368</td><td>0,6406</td><td>0,6443</td><td>0,6480</td><td>0,6517</td></tr><tr><th>0,4</th><td>0,6554</td><td>0,6591</td><td>0,6628</td><td>0,6664</td><td>0,6700</td><td>0,6736</td><td>0,6772</td><td>0,6808</td><td>0,6844</td><td>0,6879</td></tr><tr><th>0,5</th><td>0,6915</td><td>0,6950</td><td>0,6985</td><td>0,7019</td><td>0,7054</td><td>0,7088</td><td>0,7123</td><td>0,7157</td><td>0,7190</td><td>0,7224</td></tr><tr><th>0,6</th><td>0,7257</td><td>0,7291</td><td>0,7324</td><td>0,7357</td><td>0,7389</td><td>0,7422</td><td>0,7454</td><td>0,7486</td><td>0,7517</td><td>0,7549</td></tr><tr><th>0,7</th><td>0,7580</td><td>0,7611</td><td>0,7642</td><td>0,7673</td><td>0,7704</td><td>0,7734</td><td>0,7764</td><td>0,7794</td><td>0,7823</td><td>0,7852</td></tr><tr><th>0,8</th><td>0,7881</td><td>0,7910</td><td>0,7939</td><td>0,7967</td><td>0,7995</td><td>0,8023</td><td>0,8051</td><td>0,8078</td><td>0,8106</td><td>0,8133</td></tr><tr><th>0,9</th><td>0,8159</td><td>0,8186</td><td>0,8212</td><td>0,8238</td><td>0,8264</td><td>0,8289</td><td>0,8315</td><td>0,8340</td><td>0,8365</td><td>0,8389</td></tr><tr><th>1,0</th><td>0,8413</td><td>0,8438</td><td>0,8461</td><td>0,8485</td><td>0,8508</td><td>0,8531</td><td>0,8554</td><td>0,8577</td><td>0,8599</td><td>0,8621</td></tr><tr><th>1,1</th><td>0,8643</td><td>0,8665</td><td>0,8686</td><td>0,8708</td><td>0,8729</td><td>0,8749</td><td>0,8770</td><td>0,8790</td><td>0,8810</td><td>0,8830</td></tr><tr><th>1,2</th><td>0,8849</td><td>0,8869</td><td>0,8888</td><td>0,8907</td><td>0,8925</td><td>0,8944</td><td>0,8962</td><td>0,8980</td><td>0,8997</td><td>0,9015</td></tr><tr><th>1,3</th><td>0,9032</td><td>0,9049</td><td>0,9066</td><td>0,9082</td><td>0,9099</td><td>0,9115</td><td>0,9131</td><td>0,9147</td><td>0,9162</td><td>0,9177</td></tr><tr><th>1,4</th><td>0,9192</td><td>0,9207</td><td>0,9222</td><td>0,9236</td><td>0,9251</td><td>0,9265</td><td>0,9279</td><td>0,9292</td><td>0,9306</td><td>0,9319</td></tr><tr><th>1,5</th><td>0,9332</td><td>0,9345</td><td>0,9357</td><td>0,9370</td><td>0,9382</td><td>0,9394</td><td>0,9406</td><td>0,9418</td><td>0,9429</td><td>0,9441</td></tr><tr><th>1,6</th><td>0,9452</td><td>0,9463</td><td>0,9474</td><td>0,9484</td><td>0,9495</td><td>0,9505</td><td>0,9515</td><td>0,9525</td><td>0,9535</td><td>0,9545</td></tr><tr><th>1,7</th><td>0,9554</td><td>0,9564</td><td>0,9573</td><td>0,9582</td><td>0,9591</td><td>0,9599</td><td>0,9608</td><td>0,9616</td><td>0,9625</td><td>0,9633</td></tr><tr><th>1,8</th><td>0,9641</td><td>0,9649</td><td>0,9656</td><td>0,9664</td><td>0,9671</td><td>0,9678</td><td>0,9686</td><td>0,9693</td><td>0,9699</td><td>0,9706</td></tr><tr><th>1,9</th><td>0,9713</td><td>0,9719</td><td>0,9726</td><td>0,9732</td><td>0,9738</td><td>0,9744</td><td>0,9750</td><td>0,9756</td><td>0,9761</td><td>0,9767</td></tr><tr><th>2,0</th><td>0,9772</td><td>0,9778</td><td>0,9783</td><td>0,9788</td><td>0,9793</td><td>0,9798</td><td>0,9803</td><td>0,9808</td><td>0,9812</td><td>0,9817</td></tr><tr><th>2,1</th><td>0,9821</td><td>0,9826</td><td>0,9830</td><td>0,9834</td><td>0,9838</td><td>0,9842</td><td>0,9846</td><td>0,9850</td><td>0,9854</td><td>0,9857</td></tr><tr><th>2,2</th><td>0,9861</td><td>0,9864</td><td>0,9868</td><td>0,9871</td><td>0,9875</td><td>0,9878</td><td>0,9881</td><td>0,9884</td><td>0,9887</td><td>0,9890</td></tr><tr><th>2,3</th><td>0,9893</td><td>0,9896</td><td>0,9898</td><td>0,9901</td><td>0,9904</td><td>0,9906</td><td>0,9909</td><td>0,9911</td><td>0,9913</td><td>0,9916</td></tr><tr><th>2,4</th><td>0,9918</td><td>0,9920</td><td>0,9922</td><td>0,9925</td><td>0,9927</td><td>0,9929</td><td>0,9931</td><td>0,9932</td><td>0,9934</td><td>0,9936</td></tr><tr><th>2,5</th><td>0,9938</td><td>0,9940</td><td>0,9941</td><td>0,9943</td><td>0,9945</td><td>0,9946</td><td>0,9948</td><td>0,9949</td><td>0,9951</td><td>0,9952</td></tr><tr><th>2,6</th><td>0,9953</td><td>0,9955</td><td>0,9956</td><td>0,9957</td><td>0,9959</td><td>0,9960</td><td>0,9961</td><td>0,9962</td><td>0,9963</td><td>0,9964</td></tr><tr><th>2,7</th><td>0,9965</td><td>0,9966</td><td>0,9967</td><td>0,9968</td><td>0,9969</td><td>0,9970</td><td>0,9971</td><td>0,9972</td><td>0,9973</td><td>0,9974</td></tr><tr><th>2,8</th><td>0,9974</td><td>0,9975</td><td>0,9976</td><td>0,9977</td><td>0,9977</td><td>0,9978</td><td>0,9979</td><td>0,9979</td><td>0,9980</td><td>0,9981</td></tr><tr><th>2,9</th><td>0,9981</td><td>0,9982</td><td>0,9982</td><td>0,9983</td><td>0,9984</td><td>0,9984</td><td>0,9985</td><td>0,9985</td><td>0,9986</td><td>0,9986</td></tr><tr><th>3,0</th><td>0,9987</td><td>0,9987</td><td>0,9987</td><td>0,9988</td><td>0,9988</td><td>0,9989</td><td>0,9989</td><td>0,9989</td><td>0,9990</td><td>0,9990</td></tr><tr><th>3,1</th><td>0,9990</td><td>0,9991</td><td>0,9991</td><td>0,9991</td><td>0,9992</td><td>0,9992</td><td>0,9992</td><td>0,9992</td><td>0,9993</td><td>0,9993</td></tr><tr><th>3,2</th><td>0,9993</td><td>0,9993</td><td>0,9994</td><td>0,9994</td><td>0,9994</td><td>0,9994</td><td>0,9994</td><td>0,9995</td><td>0,9995</td><td>0,9995</td></tr><tr><th>3,3</th><td>0,9995</td><td>0,9995</td><td>0,9995</td><td>0,9996</td><td>0,9996</td><td>0,9996</td><td>0,9996</td><td>0,9996</td><td>0,9996</td><td>0,9997</td></tr><tr><th>3,4</th><td>0,9997</td><td>0,9997</td><td>0,9997</td><td>0,9997</td><td>0,9997</td><td>0,9997</td><td>0,9997</td><td>0,9997</td><td>0,9997</td><td>0,9998</td></tr></tbody></table></div></section>"
      },
      {
        "id": "hag108g-t",
        "n": "t",
        "title": "t-dreifing: tdf; α með Pr(T > t) = α",
        "html": "<section><h2><span class=\"n\">t</span>t-dreifing: t<sub>df; α</sub> með Pr(T &gt; t) = α</h2><p class=\"hint\">Efri hali. Tvíhliða próf eða bil með α: lesið dálkinn α/2. Neðri hali: −t.</p><div class=\"scroll\"><table class=\"phi\"><thead><tr><th>df</th><th>0,10</th><th>0,050</th><th>0,025</th><th>0,010</th><th>0,005</th></tr></thead><tbody><tr><th>1</th><td>3,078</td><td>6,314</td><td>12,706</td><td>31,821</td><td>63,657</td></tr><tr><th>2</th><td>1,886</td><td>2,920</td><td>4,303</td><td>6,965</td><td>9,925</td></tr><tr><th>3</th><td>1,638</td><td>2,353</td><td>3,182</td><td>4,541</td><td>5,841</td></tr><tr><th>4</th><td>1,533</td><td>2,132</td><td>2,776</td><td>3,747</td><td>4,604</td></tr><tr><th>5</th><td>1,476</td><td>2,015</td><td>2,571</td><td>3,365</td><td>4,032</td></tr><tr><th>6</th><td>1,440</td><td>1,943</td><td>2,447</td><td>3,143</td><td>3,707</td></tr><tr><th>7</th><td>1,415</td><td>1,895</td><td>2,365</td><td>2,998</td><td>3,499</td></tr><tr><th>8</th><td>1,397</td><td>1,860</td><td>2,306</td><td>2,896</td><td>3,355</td></tr><tr><th>9</th><td>1,383</td><td>1,833</td><td>2,262</td><td>2,821</td><td>3,250</td></tr><tr><th>10</th><td>1,372</td><td>1,812</td><td>2,228</td><td>2,764</td><td>3,169</td></tr><tr><th>11</th><td>1,363</td><td>1,796</td><td>2,201</td><td>2,718</td><td>3,106</td></tr><tr><th>12</th><td>1,356</td><td>1,782</td><td>2,179</td><td>2,681</td><td>3,055</td></tr><tr><th>13</th><td>1,350</td><td>1,771</td><td>2,160</td><td>2,650</td><td>3,012</td></tr><tr><th>14</th><td>1,345</td><td>1,761</td><td>2,145</td><td>2,624</td><td>2,977</td></tr><tr><th>15</th><td>1,341</td><td>1,753</td><td>2,131</td><td>2,602</td><td>2,947</td></tr><tr><th>16</th><td>1,337</td><td>1,746</td><td>2,120</td><td>2,583</td><td>2,921</td></tr><tr><th>17</th><td>1,333</td><td>1,740</td><td>2,110</td><td>2,567</td><td>2,898</td></tr><tr><th>18</th><td>1,330</td><td>1,734</td><td>2,101</td><td>2,552</td><td>2,878</td></tr><tr><th>19</th><td>1,328</td><td>1,729</td><td>2,093</td><td>2,539</td><td>2,861</td></tr><tr><th>20</th><td>1,325</td><td>1,725</td><td>2,086</td><td>2,528</td><td>2,845</td></tr><tr><th>21</th><td>1,323</td><td>1,721</td><td>2,080</td><td>2,518</td><td>2,831</td></tr><tr><th>22</th><td>1,321</td><td>1,717</td><td>2,074</td><td>2,508</td><td>2,819</td></tr><tr><th>23</th><td>1,319</td><td>1,714</td><td>2,069</td><td>2,500</td><td>2,807</td></tr><tr><th>24</th><td>1,318</td><td>1,711</td><td>2,064</td><td>2,492</td><td>2,797</td></tr><tr><th>25</th><td>1,316</td><td>1,708</td><td>2,060</td><td>2,485</td><td>2,787</td></tr><tr><th>26</th><td>1,315</td><td>1,706</td><td>2,056</td><td>2,479</td><td>2,779</td></tr><tr><th>27</th><td>1,314</td><td>1,703</td><td>2,052</td><td>2,473</td><td>2,771</td></tr><tr><th>28</th><td>1,313</td><td>1,701</td><td>2,048</td><td>2,467</td><td>2,763</td></tr><tr><th>29</th><td>1,311</td><td>1,699</td><td>2,045</td><td>2,462</td><td>2,756</td></tr><tr><th>30</th><td>1,310</td><td>1,697</td><td>2,042</td><td>2,457</td><td>2,750</td></tr><tr><th>40</th><td>1,303</td><td>1,684</td><td>2,021</td><td>2,423</td><td>2,704</td></tr><tr><th>60</th><td>1,296</td><td>1,671</td><td>2,000</td><td>2,390</td><td>2,660</td></tr><tr><th>120</th><td>1,289</td><td>1,658</td><td>1,980</td><td>2,358</td><td>2,617</td></tr><tr><th>∞</th><td>1,282</td><td>1,645</td><td>1,960</td><td>2,326</td><td>2,576</td></tr></tbody></table></div></section>"
      },
      {
        "id": "hag108g-χ²",
        "n": "χ²",
        "title": "χ²-dreifing: c með Pr(χ² < c) = p",
        "html": "<section><h2><span class=\"n\">χ²</span>χ²-dreifing: c með Pr(χ² &lt; c) = p</h2><p class=\"hint\">Hlutfallsmörk neðan frá. Efri hali α: dálkurinn p = 1 − α.</p><div class=\"scroll\"><table class=\"phi\"><thead><tr><th>df</th><th>0,005</th><th>0,010</th><th>0,025</th><th>0,050</th><th>0,950</th><th>0,975</th><th>0,990</th><th>0,995</th></tr></thead><tbody><tr><th>1</th><td>0,0000</td><td>0,0002</td><td>0,0010</td><td>0,00</td><td>3,84</td><td>5,02</td><td>6,63</td><td>7,88</td></tr><tr><th>2</th><td>0,0100</td><td>0,0201</td><td>0,0506</td><td>0,10</td><td>5,99</td><td>7,38</td><td>9,21</td><td>10,60</td></tr><tr><th>3</th><td>0,07</td><td>0,11</td><td>0,22</td><td>0,35</td><td>7,81</td><td>9,35</td><td>11,34</td><td>12,84</td></tr><tr><th>4</th><td>0,21</td><td>0,30</td><td>0,48</td><td>0,71</td><td>9,49</td><td>11,14</td><td>13,28</td><td>14,86</td></tr><tr><th>5</th><td>0,41</td><td>0,55</td><td>0,83</td><td>1,15</td><td>11,07</td><td>12,83</td><td>15,09</td><td>16,75</td></tr><tr><th>6</th><td>0,68</td><td>0,87</td><td>1,24</td><td>1,64</td><td>12,59</td><td>14,45</td><td>16,81</td><td>18,55</td></tr><tr><th>7</th><td>0,99</td><td>1,24</td><td>1,69</td><td>2,17</td><td>14,07</td><td>16,01</td><td>18,48</td><td>20,28</td></tr><tr><th>8</th><td>1,34</td><td>1,65</td><td>2,18</td><td>2,73</td><td>15,51</td><td>17,53</td><td>20,09</td><td>21,95</td></tr><tr><th>9</th><td>1,73</td><td>2,09</td><td>2,70</td><td>3,33</td><td>16,92</td><td>19,02</td><td>21,67</td><td>23,59</td></tr><tr><th>10</th><td>2,16</td><td>2,56</td><td>3,25</td><td>3,94</td><td>18,31</td><td>20,48</td><td>23,21</td><td>25,19</td></tr><tr><th>11</th><td>2,60</td><td>3,05</td><td>3,82</td><td>4,57</td><td>19,68</td><td>21,92</td><td>24,72</td><td>26,76</td></tr><tr><th>12</th><td>3,07</td><td>3,57</td><td>4,40</td><td>5,23</td><td>21,03</td><td>23,34</td><td>26,22</td><td>28,30</td></tr><tr><th>13</th><td>3,57</td><td>4,11</td><td>5,01</td><td>5,89</td><td>22,36</td><td>24,74</td><td>27,69</td><td>29,82</td></tr><tr><th>14</th><td>4,07</td><td>4,66</td><td>5,63</td><td>6,57</td><td>23,68</td><td>26,12</td><td>29,14</td><td>31,32</td></tr><tr><th>15</th><td>4,60</td><td>5,23</td><td>6,26</td><td>7,26</td><td>25,00</td><td>27,49</td><td>30,58</td><td>32,80</td></tr><tr><th>16</th><td>5,14</td><td>5,81</td><td>6,91</td><td>7,96</td><td>26,30</td><td>28,85</td><td>32,00</td><td>34,27</td></tr><tr><th>17</th><td>5,70</td><td>6,41</td><td>7,56</td><td>8,67</td><td>27,59</td><td>30,19</td><td>33,41</td><td>35,72</td></tr><tr><th>18</th><td>6,26</td><td>7,01</td><td>8,23</td><td>9,39</td><td>28,87</td><td>31,53</td><td>34,81</td><td>37,16</td></tr><tr><th>19</th><td>6,84</td><td>7,63</td><td>8,91</td><td>10,12</td><td>30,14</td><td>32,85</td><td>36,19</td><td>38,58</td></tr><tr><th>20</th><td>7,43</td><td>8,26</td><td>9,59</td><td>10,85</td><td>31,41</td><td>34,17</td><td>37,57</td><td>40,00</td></tr><tr><th>21</th><td>8,03</td><td>8,90</td><td>10,28</td><td>11,59</td><td>32,67</td><td>35,48</td><td>38,93</td><td>41,40</td></tr><tr><th>22</th><td>8,64</td><td>9,54</td><td>10,98</td><td>12,34</td><td>33,92</td><td>36,78</td><td>40,29</td><td>42,80</td></tr><tr><th>23</th><td>9,26</td><td>10,20</td><td>11,69</td><td>13,09</td><td>35,17</td><td>38,08</td><td>41,64</td><td>44,18</td></tr><tr><th>24</th><td>9,89</td><td>10,86</td><td>12,40</td><td>13,85</td><td>36,42</td><td>39,36</td><td>42,98</td><td>45,56</td></tr><tr><th>25</th><td>10,52</td><td>11,52</td><td>13,12</td><td>14,61</td><td>37,65</td><td>40,65</td><td>44,31</td><td>46,93</td></tr><tr><th>26</th><td>11,16</td><td>12,20</td><td>13,84</td><td>15,38</td><td>38,89</td><td>41,92</td><td>45,64</td><td>48,29</td></tr><tr><th>27</th><td>11,81</td><td>12,88</td><td>14,57</td><td>16,15</td><td>40,11</td><td>43,19</td><td>46,96</td><td>49,64</td></tr><tr><th>28</th><td>12,46</td><td>13,56</td><td>15,31</td><td>16,93</td><td>41,34</td><td>44,46</td><td>48,28</td><td>50,99</td></tr><tr><th>29</th><td>13,12</td><td>14,26</td><td>16,05</td><td>17,71</td><td>42,56</td><td>45,72</td><td>49,59</td><td>52,34</td></tr><tr><th>30</th><td>13,79</td><td>14,95</td><td>16,79</td><td>18,49</td><td>43,77</td><td>46,98</td><td>50,89</td><td>53,67</td></tr><tr><th>40</th><td>20,71</td><td>22,16</td><td>24,43</td><td>26,51</td><td>55,76</td><td>59,34</td><td>63,69</td><td>66,77</td></tr><tr><th>50</th><td>27,99</td><td>29,71</td><td>32,36</td><td>34,76</td><td>67,50</td><td>71,42</td><td>76,15</td><td>79,49</td></tr><tr><th>60</th><td>35,53</td><td>37,48</td><td>40,48</td><td>43,19</td><td>79,08</td><td>83,30</td><td>88,38</td><td>91,95</td></tr><tr><th>80</th><td>51,17</td><td>53,54</td><td>57,15</td><td>60,39</td><td>101,88</td><td>106,63</td><td>112,33</td><td>116,32</td></tr><tr><th>100</th><td>67,33</td><td>70,06</td><td>74,22</td><td>77,93</td><td>124,34</td><td>129,56</td><td>135,81</td><td>140,17</td></tr></tbody></table></div></section>"
      },
      {
        "id": "hag108g-✗",
        "n": "✗",
        "title": "Gildrulisti",
        "html": "<section><h2><span class=\"n\">✗</span>Gildrulisti</h2><ul><li>sd vs dreifni: N(μ, σ²) hefur dreifnina sem seinni stika, en <code>pnorm</code>, <code>qnorm</code>, <code>rnorm</code> taka sd</li><li>Var[X − Y] = Var X + Var Y (− 2Cov), ekki Var X − Var Y</li><li>SD[aX] = |a|·SD[X], ekki a·SD og ekki a²·SD</li><li>E[g(X)] ≠ g(E[X]) nema g sé línulegt (Jensen)</li><li>Pr(X = x) = 0 fyrir samfelldar breytur, og f(x) getur verið &gt; 1</li><li>Sundurlæg ≠ óháð: sundurlægir atburðir með jákvæðar líkur eru háðir</li><li>Cov = 0 ⇏ óhæði (t.d. X ~ N(0, 1) og Y = X²)</li><li>(A ∩ B)<sup>c</sup> = A<sup>c</sup> ∪ B<sup>c</sup>: „X &gt; 1 og Y &gt; 2\" er ekki 1 − F(1, 2)</li><li>λ skalað á rangt tímabil (t.d. á mánuði í stað tveggja ára)</li><li>λ í veldisdreifingu er tíðni; meðalbiðin er 1/λ</li><li>Tilvísun í R byrjar á 1, og matrix fyllist dálk fyrir dálk</li><li>S² deilir með n − 1; Var[X̄] = σ²/n er annað en S²</li><li>Staðalfrávik leggjast ekki saman: √(a + b) ≠ √a + √b</li><li>Pr(X ≤ k) vs Pr(X &lt; k) í strjálum dreifingum</li><li>Einhliða vs tvíhliða líkur</li><li>Að deila með σ en ekki σ/√n þegar spurt er um X̄</li><li>Sennileikamatið σ̂² deilir með n og er bjagað; S² deilir með n − 1</li><li>Einhliða bil og próf nota t<sub>α</sub>; tvíhliða nota t<sub>α/2</sub></li><li>χ²- og F-gildi eru skrifuð á tvo vegu á glærum 09 (neðan frá á gl. 81, efri hali á gl. 86 og 93): lesið hvaða hala gildið á við</li><li>Tilgáta um staðalfrávik (σ ≤ 110) er prófuð með dreifnum: s² og σ₀² = 110²</li><li>Að hafna ekki H₀ sannar hana ekki; „ekki hægt að hafna H₀\"</li><li>Í einhliða prófi skiptir stefna T máli: stórt neikvætt T hafnar ekki H₀: μ ≤ μ₀</li><li>F = s₁²/s₂², ekki hlutfall staðalfrávika</li></ul></section>"
      },
      {
        "id": "hag108g-!",
        "n": "!",
        "title": "Villur á glærum og í lausnum",
        "html": "<section><h2><span class=\"n\">!</span>Villur á glærum og í lausnum</h2><p class=\"hint\">Á prófi: notaðu rétta gildið og sýndu útreikninginn.</p><div class=\"scroll\"><table class=\"tt\"><thead><tr><th>Hvar</th><th>Stendur</th><th>Rétt</th></tr></thead><tbody><tr><td class=\"mono\">00 R, gl. 18</td><td><code>mat[1, 2]</code> skilar 2</td><td>Skilar 4 (matrix fyllist dálk fyrir dálk; keyrt í R)</td></tr><tr><td class=\"mono\">01, gl. 43</td><td>Teljari Bayes: Pr(B)Pr(A<sub>j</sub>|B)</td><td>Pr(A<sub>j</sub>)Pr(B|A<sub>j</sub>)</td></tr><tr><td class=\"mono\">02, gl. 18</td><td>Brúun: ·(a − b)</td><td>·(b − a)</td></tr><tr><td class=\"mono\">02, gl. 48</td><td>Var[P] = 39,04</td><td>9,76</td></tr><tr><td class=\"mono\">02, gl. 27–28</td><td>Texti: summa „hærri en 14\"; kóði: &gt; 13</td><td>Ósamræmi; E = 92,13 með kóðanum, 15,74 með textanum</td></tr><tr><td class=\"mono\">03, gl. 22–23</td><td>Merkingar Pr(X &gt; 0) o.fl.</td><td>Atburðirnir eru X ≥ 2 (3 dagar) og X = 2 (2 dagar); tölurnar 0,352 og 0,16 réttar</td></tr><tr><td class=\"mono\">03, gl. 29</td><td>rbinom „reiknar þéttleikafall\"</td><td>rbinom hermir slembigildi</td></tr><tr><td class=\"mono\">03, gl. 52</td><td>Pr(2 ≤ X ≤ 4) ≈ 0,676</td><td>0,541 (0,676 er Pr(X ≤ 2))</td></tr><tr><td class=\"mono\">05, gl. 29</td><td>Pr(2 &lt; X &lt; 4) ≈ 0,11</td><td>0,221</td></tr><tr><td class=\"mono\">05, gl. 41</td><td>Staðalfrávik aY = a·σ</td><td>|a|·σ</td></tr><tr><td class=\"mono\">05, gl. 54</td><td>Dreifni summu: Σσ<sub>i</sub></td><td>Σσ<sub>i</sub>²</td></tr><tr><td class=\"mono\">06, gl. 6</td><td>F(x, y) = 0</td><td>F(−∞, y) = F(x, −∞) = 0</td></tr><tr><td class=\"mono\">06, gl. 19</td><td>Síðasta lína e<sup>−1</sup>e<sup>−4</sup>; texti „y &gt; 2\"</td><td>e<sup>−1</sup>(1 − e<sup>−4</sup>) = 0,3611; y &lt; 2</td></tr><tr><td class=\"mono\">06, gl. 69</td><td>Fylgni 0 ⇒ óháðar</td><td>Aðeins öfugt: óháðar ⇒ fylgni 0</td></tr><tr><td class=\"mono\">07, gl. 56</td><td>1 − (1 − e<sup>0,288·5</sup>)</td><td>e<sup>−0,288·5</sup> = 0,237</td></tr><tr><td class=\"mono\">07, gl. 63 og 69</td><td>0,042 og 0,056</td><td>Einhliða: 0,017 (z = −2,12) og 0,035 (t₉ = −2,06); óstaðfest hvað er átt við</td></tr><tr><td class=\"mono\">08, gl. 15</td><td>„Bæði X̄ og X̃\"</td><td>Ẋ = X<sub>1</sub></td></tr><tr><td class=\"mono\">08, gl. 54</td><td>σ̂² = 1,647</td><td>2,099 fyrir gögnin á gl. 50 (S² = 2,332)</td></tr><tr><td class=\"mono\">09, gl. 55</td><td>„tilgátu um að μ sé minna en μ₀\"</td><td>H₁: μ &gt; 6,5, svo „stærra\"</td></tr><tr><td class=\"mono\">09, gl. 67</td><td>„um 1,35 lægri\"</td><td>0,013341 · 100 = 1,33</td></tr><tr><td class=\"mono\">09, gl. 76–78</td><td>ȳ = 7,5 og s = 1,1 gefa T = −2,15</td><td>R-gögnin hafa ȳ = 7,4 og s = 0,4: T = −2,37 (eins og R skilar)</td></tr><tr><td class=\"mono\">09, gl. 85</td><td>„S² er metið staðalfrávik\"</td><td>S² er dreifni úrtaksins</td></tr><tr><td class=\"mono\">09, gl. 96</td><td>F<sub>9,9; 0,025</sub> = 4,96</td><td>4,03 (qf(0.975, 9, 9)); niðurstaðan breytist ekki</td></tr><tr><td class=\"mono\">09, gl. 100–101</td><td>S² = dreifni úrtaksins</td><td>S = skeifni; S² er skeifnin í öðru veldi. Undir H₀ er JB ∼ χ²₂</td></tr><tr><td class=\"mono\">Dæmablað 4, 4b-ii</td><td>Miðja bils: (u<sub>i</sub> − l<sub>i</sub>)/2</td><td>(u<sub>i</sub> + l<sub>i</sub>)/2 (verkefni 5 rétt)</td></tr></tbody></table></div></section>"
      }
    ],
    "foot": "\n    <div class=\"callout\"><b>Óstaðfest</b><ul><li>Hvort formúlublaðið er eigið eða frá kennara; staðsetning prófsins.</li><li>Strjált miðgildi: formúla glæru 16 (min{x : F(x) ≥ 0,5}) og lausn verkefnis 3 (2d: 15 í stað 20) stangast á; lausn dæmablaðs 2 (2d) brúar 70% hlutfallsmörk (3⅓) þar sem reglan gefur 4.</li><li>Einhliða eða tvíhliða líkur á glærum 07 (gl. 63 og 69) — spurðu kennarann.</li><li>pchisq og qchisq koma fyrir á glæru 89 í 09, en pt og pf hvergi (t.test og var.test reikna þau innbyrðis); gert ráð fyrir sömu d/p/q/r-reglu.</li><li>Dæmablað 8, 1c: óljóst hvort nota á S² (n̂ = 8, p̂ = 0,4875) eða dreifni með n í nefnara (n̂ = 7), og hvort p̂ er gefið fyrir eða eftir námundun n.</li><li>Dæmablað 9, 2c leyfir sameinað t-próf með jafnri dreifni, en glærurnar kenna aðeins Welch. Báðar leiðir hafna H₀ við 5%.</li><li>Samantektin (skjalið) nær ekki enn yfir glærur 08 og 09; efni þeirra hér byggir eingöngu á glærunum og dæmablöðum 8–9.</li><li>Lausnir vantar fyrir verkefni 1 og dæmablöð 6–9 (líka 8 og 9); svörin hér eru reiknuð sjálfstætt og staðfest tölulega.</li></ul></div>\n  "
  },
  "examInfo": {
    "title": "Lokaprófið",
    "format": "Fjögur síðustu prófin hafa sama snið: 15 skrifleg dæmi á 3 klst. Líkindi 10%, slembibreytur 15%, staðlaðar dreifingar 15%, marvíðar og skilyrtar dreifingar 20%, úrtök og tilgátur 20%, metlar 10% og R 10%.",
    "aids": "Reiknivél, formúlublað og töflur fyrir N/t/χ²/F",
    "weight": "70% af einkunn; verkefnaeinkunnin (30%) gildir aðeins ef þú færð minnst 5 á lokaprófinu",
    "callout": "<div class=\"callout\"><b>Óstaðfest</b><ul><li>Hvort formúlublaðið er eigið eða frá kennara; staðsetning prófsins.</li><li>Strjált miðgildi: formúla glæru 16 (min{x : F(x) ≥ 0,5}) og lausn verkefnis 3 (2d: 15 í stað 20) stangast á; lausn dæmablaðs 2 (2d) brúar 70% hlutfallsmörk (3⅓) þar sem reglan gefur 4.</li><li>Einhliða eða tvíhliða líkur á glærum 07 (gl. 63 og 69) — spurðu kennarann.</li><li>pchisq og qchisq koma fyrir á glæru 89 í 09, en pt og pf hvergi (t.test og var.test reikna þau innbyrðis); gert ráð fyrir sömu d/p/q/r-reglu.</li><li>Dæmablað 8, 1c: óljóst hvort nota á S² (n̂ = 8, p̂ = 0,4875) eða dreifni með n í nefnara (n̂ = 7), og hvort p̂ er gefið fyrir eða eftir námundun n.</li><li>Dæmablað 9, 2c leyfir sameinað t-próf með jafnri dreifni, en glærurnar kenna aðeins Welch. Báðar leiðir hafna H₀ við 5%.</li><li>Samantektin (skjalið) nær ekki enn yfir glærur 08 og 09; efni þeirra hér byggir eingöngu á glærunum og dæmablöðum 8–9.</li><li>Lausnir vantar fyrir verkefni 1 og dæmablöð 6–9 (líka 8 og 9); svörin hér eru reiknuð sjálfstætt og staðfest tölulega.</li></ul></div>",
    "facts": [
      {
        "value": "3 klst.",
        "label": "1. desember kl. 13:30"
      },
      {
        "value": "15 dæmi",
        "label": "sama snið á fjórum síðustu prófum"
      },
      {
        "value": "70%",
        "label": "af einkunn; verkefnin (30%) gilda aðeins ef þú færð ≥ 5"
      },
      {
        "value": "+ blað",
        "label": "Reiknivél, formúlublað og töflur fyrir N/t/χ²/F"
      }
    ]
  },
  "passScore": 0.7,
  "sourceLabels": {
    "sheet": "Heimaverkefni"
  },
  "legacy": {
    "key": "hag108g-profaefing-v1",
    "file": "HAG108G prófæfing.html"
  },
  "extraItems": [
    {
      "id": "D24-1",
      "topic": "L01",
      "level": 2,
      "source": "old",
      "src": "Lokapróf desember 2024, dæmi 1 (5%)",
      "q": "Formaður fjárfestingarklúbbs spyr alla meðlimi hvort þeir hafi stundað viðskipti með verðbréf.<ul><li>354 svör komu frá hagfræðingum; 197 þeirra hafa stundað viðskipti með verðbréf.</li><li>146 svör komu frá öðrum; 40 þeirra hafa stundað viðskipti með verðbréf.</li></ul><ol type=\"a\"><li>Hverjar eru líkurnar á að meðlimur sem er hagfræðingur hafi stundað viðskipti með verðbréf?</li><li>Hverjar eru líkurnar á að meðlimur sem er ekki hagfræðingur hafi <u>ekki</u> stundað viðskipti með verðbréf?</li><li>Hverjar eru líkurnar á að meðlimur klúbbsins hafi stundað viðskipti með verðbréf?</li></ol>",
      "type": "steps",
      "steps": [
        {
          "h": "a) Pr(V | H)",
          "body": "\\[\\Pr(V\\mid H)=\\frac{197}{354}\\approx 0{,}556\\]<p class=\"trap\"><b>Gildra.</b> Skilyrt: deilt er með fjölda hagfræðinga (354), ekki öllum 500.</p>",
          "p": 1
        },
        {
          "h": "b) Pr(ekki V | ekki H)",
          "body": "<p>Af 146 sem eru ekki hagfræðingar hafa \\(146-40=106\\) ekki stundað viðskipti:</p>\\[\\Pr(V^c\\mid H^c)=\\frac{106}{146}\\approx 0{,}726\\]",
          "p": 1
        },
        {
          "h": "c) Pr(V)",
          "body": "\\[\\Pr(V)=\\frac{197+40}{354+146}=\\frac{237}{500}=0{,}474\\]",
          "p": 1
        }
      ],
      "examWeight": 5,
      "e": "",
      "paper": "D24"
    },
    {
      "id": "D24-2",
      "topic": "L01",
      "level": 2,
      "source": "old",
      "src": "Lokapróf desember 2024, dæmi 2 (5%)",
      "q": "Nemendur svara hvort þeir vilji frekar dæmatíma á mánudögum eða fimmtudögum: 12 velja mánudag og 7 velja fimmtudag.<ol type=\"a\"><li>Velja á 10 nemendur í fimmtudagstíma þannig að 6 þeirra völdu fimmtudag og hinir 4 mánudag. Á hversu marga vegu er hægt að velja þá 10?</li></ol><p>Deildin raðar nemendum svo: hafi nemandi valið mánudag eru 70% líkur á að hann lendi í mánudagstíma; hafi hann valið fimmtudag eru 80% líkur á að hann lendi í fimmtudagstíma.</p><ol type=\"a\" start=\"2\"><li>Að því gefnu að nemandi hafi valið fimmtudag, hverjar eru líkurnar á að honum sé raðað á mánudag?</li><li>Að því gefnu að nemanda hafi verið raðað á mánudag, hverjar eru líkurnar á að hann hafi valið mánudag?</li></ol>",
      "type": "steps",
      "steps": [
        {
          "h": "a) Fjöldi hópa",
          "body": "\\[\\binom{7}{6}\\binom{12}{4}=7\\cdot 495=3465\\]<p>Röðin innan hóps skiptir ekki máli, og valið úr hvorum hópi er óháð, svo fjöldarnir margfaldast.</p>",
          "p": 2
        },
        {
          "h": "b) Pr(M | valdi F)",
          "body": "\\[\\Pr(M\\mid F_v)=1-0{,}8=0{,}2\\]",
          "p": 1
        },
        {
          "h": "c) Bayes",
          "body": "<p>Gerum ráð fyrir að enginn hafi valið báða daga: \\(\\Pr(M_v)=\\tfrac{12}{19}\\), \\(\\Pr(F_v)=\\tfrac{7}{19}\\).</p>\\[\\begin{aligned}\\Pr(M)&=\\tfrac{12}{19}\\cdot 0{,}7+\\tfrac{7}{19}\\cdot 0{,}2=\\tfrac{9{,}8}{19}\\approx 0{,}516\\\\ \\Pr(M_v\\mid M)&=\\frac{\\tfrac{12}{19}\\cdot 0{,}7}{\\tfrac{9{,}8}{19}}=\\frac{8{,}4}{9{,}8}=\\tfrac67\\approx 0{,}857\\end{aligned}\\]",
          "p": 2
        }
      ],
      "examWeight": 5,
      "e": "",
      "paper": "D24"
    },
    {
      "id": "D24-3",
      "topic": "L02",
      "level": 2,
      "source": "old",
      "src": "Lokapróf desember 2024, dæmi 3 (5%)",
      "q": "Slembibreytan \\(X\\) hefur líkindamassafallið (PMF)\\[P(X=k)=\\begin{cases}0{,}1 & \\text{ef } k=1\\\\0{,}2 & \\text{ef } k=3\\\\0{,}3 & \\text{ef } k=5\\\\0{,}2 & \\text{ef } k=6\\\\0{,}1 & \\text{ef } k=7\\\\0{,}1 & \\text{ef } k=12\\\\0 & \\text{annars}\\end{cases}\\]<ol type=\"a\"><li>Finnið dreifingarfall \\(X\\) (CDF).</li><li>Reiknið væntigildi \\(X\\).</li><li>Hverjar eru líkurnar \\(P(3\\le X\\le 7)\\)?</li></ol>",
      "type": "steps",
      "steps": [
        {
          "h": "a) Dreifingarfall",
          "body": "\\[F(x)=\\begin{cases}0 & x<1\\\\0{,}1 & 1\\le x<3\\\\0{,}3 & 3\\le x<5\\\\0{,}6 & 5\\le x<6\\\\0{,}8 & 6\\le x<7\\\\0{,}9 & 7\\le x<12\\\\1 & x\\ge 12\\end{cases}\\]<p class=\"trap\"><b>Gildra.</b> F er þrepafall skilgreint fyrir öll rauntölugildi x, ekki aðeins í gildunum sjálfum.</p>",
          "p": 2
        },
        {
          "h": "b) E[X]",
          "body": "\\[E[X]=1(0{,}1)+3(0{,}2)+5(0{,}3)+6(0{,}2)+7(0{,}1)+12(0{,}1)=5{,}3\\]",
          "p": 1
        },
        {
          "h": "c) P(3 ≤ X ≤ 7)",
          "body": "\\[P(3\\le X\\le 7)=0{,}2+0{,}3+0{,}2+0{,}1=0{,}8=F(7)-F(1)\\]<p class=\"trap\"><b>Gildra.</b> Með ≤ í neðri mörkum er dregið F(1) frá, ekki F(3).</p>",
          "p": 1
        }
      ],
      "examWeight": 5,
      "e": "",
      "paper": "D24"
    },
    {
      "id": "D24-4",
      "topic": "L04",
      "level": 2,
      "source": "old",
      "src": "Lokapróf desember 2024, dæmi 4 (10%)",
      "q": "Slembibreytan \\(Y\\) hefur þéttleikafallið \\[f(y)=\\begin{cases}4y^3 & 0\\le y\\le 1\\\\0&\\text{annars}\\end{cases}\\]<ol type=\"a\"><li>Hvert er dreifingarfall \\(Y\\)?</li><li>Finnið væntigildi \\(Y\\).</li><li>Finnið dreifni \\(Y\\).</li><li>Finnið staðalfrávik \\(Y\\).</li><li>Finnið miðgildi \\(Y\\).</li></ol>",
      "type": "steps",
      "steps": [
        {
          "h": "a) F(y)",
          "body": "\\[F(y)=\\int_0^y 4t^3\\,dt=y^4\\quad(0\\le y\\le 1),\\qquad F(y)=0 \\text{ ef } y<0,\\; F(y)=1 \\text{ ef } y>1\\]",
          "p": 2
        },
        {
          "h": "b) E[Y]",
          "body": "\\[E[Y]=\\int_0^1 y\\cdot 4y^3\\,dy=\\tfrac45=0{,}8\\]",
          "p": 1
        },
        {
          "h": "c) Var[Y]",
          "body": "\\[E[Y^2]=\\int_0^1 4y^5\\,dy=\\tfrac23,\\qquad \\operatorname{Var}[Y]=\\tfrac23-\\left(\\tfrac45\\right)^2=\\tfrac{2}{75}\\approx 0{,}0267\\]",
          "p": 2
        },
        {
          "h": "d) Staðalfrávik",
          "body": "\\[\\sigma=\\sqrt{2/75}\\approx 0{,}163\\]",
          "p": 1
        },
        {
          "h": "e) Miðgildi",
          "body": "\\[F(m)=m^4=0{,}5\\;\\Rightarrow\\; m=0{,}5^{1/4}\\approx 0{,}841\\]",
          "p": 1
        }
      ],
      "examWeight": 10,
      "e": "",
      "paper": "D24"
    },
    {
      "id": "D24-5",
      "topic": "L05",
      "level": 2,
      "source": "old",
      "src": "Lokapróf desember 2024, dæmi 5 (5%)",
      "q": "Tíminn \\(T\\) þar til áhrif stýrivaxtabreytinga verða mælanleg er veldisdreifður og hefur að jafnaði verið 2 mánuðir.<ol type=\"a\"><li>Hver er stiki \\(T\\)?</li><li>Hverjar eru líkurnar á að áhrifin komi fram eftir 1 mánuð eða minna?</li><li>Hverjar eru líkurnar á að áhrifin komi fram á milli 3 og 6 mánaða?</li></ol>",
      "type": "steps",
      "steps": [
        {
          "h": "a) Stikinn",
          "body": "\\[\\lambda=\\frac{1}{E[T]}=\\frac12=0{,}5 \\text{ á mánuði}\\]<p class=\"trap\"><b>Gildra.</b> λ er tíðni; meðalbiðin er 1/λ. Að setja λ = 2 er algengasta villan.</p>",
          "p": 1
        },
        {
          "h": "b) P(T ≤ 1)",
          "body": "\\[P(T\\le 1)=1-e^{-0{,}5}\\approx 0{,}393\\]",
          "p": 1
        },
        {
          "h": "c) P(3 < T < 6)",
          "body": "\\[P(3<T<6)=e^{-1{,}5}-e^{-3}\\approx 0{,}2231-0{,}0498=0{,}173\\]",
          "p": 1
        }
      ],
      "examWeight": 5,
      "e": "",
      "paper": "D24"
    },
    {
      "id": "D24-6",
      "topic": "L03",
      "level": 2,
      "source": "old",
      "src": "Lokapróf desember 2024, dæmi 6 (10%)",
      "q": "Sjoppa veitir námsmönnum 10% afslátt af hamborgaramáltíð, og 70% kaupenda eru námsmenn. Á venjulegum degi kaupa 6 manns hamborgara. \\(X\\) er fjöldi þeirra sem nýta afsláttinn og er tvíkostadreifð.<ol type=\"a\"><li>Hverjir eru stikar \\(X\\)?</li><li>Hver er væntur fjöldi þeirra sem nýta afsláttinn?</li><li>Hver er dreifni fjöldans?</li><li>Hverjar eru líkurnar á að fleiri en 3 nýti afsláttinn?</li><li>Máltíðin kostar venjulega 2000 kr. Hverjar eru væntar tekjur af hamborgarasölu á dag?</li></ol>",
      "type": "steps",
      "steps": [
        {
          "h": "a) Stikar",
          "body": "\\[X\\sim \\text{Bin}(n=6,\\;p=0{,}7)\\]",
          "p": 1
        },
        {
          "h": "b) E[X]",
          "body": "\\[E[X]=np=4{,}2\\]",
          "p": 1
        },
        {
          "h": "c) Var[X]",
          "body": "\\[\\operatorname{Var}[X]=np(1-p)=6\\cdot 0{,}7\\cdot 0{,}3=1{,}26\\]",
          "p": 1
        },
        {
          "h": "d) P(X > 3)",
          "body": "\\[\\begin{aligned}P(X>3)&=\\tbinom64 0{,}7^4 0{,}3^2+\\tbinom65 0{,}7^5 0{,}3+0{,}7^6\\\\&\\approx 0{,}3241+0{,}3025+0{,}1176=0{,}744\\end{aligned}\\]<p>Í R: <code>1 - pbinom(3, 6, 0.7)</code>.</p><p class=\"trap\"><b>Gildra.</b> „Fleiri en 3“ er X ≥ 4, svo 1 − P(X ≤ 3).</p>",
          "p": 2
        },
        {
          "h": "e) Væntar tekjur",
          "body": "<p>Hver námsmaður sem nýtir afsláttinn borgar 200 kr. minna: tekjur \\(=6\\cdot 2000-200X\\).</p>\\[E[\\text{tekjur}]=12\\,000-200\\cdot 4{,}2=11\\,160 \\text{ kr.}\\]",
          "p": 2
        }
      ],
      "examWeight": 10,
      "e": "",
      "paper": "D24"
    },
    {
      "id": "D24-7",
      "topic": "L06",
      "level": 2,
      "source": "old",
      "src": "Lokapróf desember 2024, dæmi 7 (10%)",
      "q": "\\(X\\) og \\(Y\\) eru strjálar með samþéttleikafallið \\(f(x,y)\\) í töflunni (önnur gildi hafa líkurnar 0):<div class=\"scroll\"><table class=\"tt\"><thead><tr><th>\\(f(x,y)\\)</th><th>\\(y=0\\)</th><th>\\(y=1\\)</th><th>\\(y=2\\)</th></tr></thead><tbody><tr><th>\\(x=0\\)</th><td class=\"mono\">0,1</td><td class=\"mono\">0,05</td><td class=\"mono\">0,05</td></tr><tr><th>\\(x=1\\)</th><td class=\"mono\">0,2</td><td class=\"mono\">0,1</td><td class=\"mono\">0,05</td></tr><tr><th>\\(x=2\\)</th><td class=\"mono\">0,05</td><td class=\"mono\">0,25</td><td class=\"mono\">0,15</td></tr></tbody></table></div><ol type=\"a\"><li>Finnið \\(P(X=1,Y=0)\\).</li><li>Finnið samdreifingarfallið \\(F(x,y)\\) á töfluformi.</li><li>Finnið \\(P(X\\le 1 \\text{ og } Y\\ge 1)\\).</li><li>Hver eru jaðarþéttleikaföllin \\(f_X(x)\\) og \\(f_Y(y)\\)?</li></ol>",
      "type": "steps",
      "steps": [
        {
          "h": "a) P(X = 1, Y = 0)",
          "body": "<p>Lesið beint úr töflunni: \\(0{,}2\\).</p>",
          "p": 1
        },
        {
          "h": "b) F(x, y)",
          "body": "<p>\\(F(x,y)=P(X\\le x, Y\\le y)\\): summa allra reita upp og til vinstri.</p><div class=\"scroll\"><table class=\"tt\"><thead><tr><th>\\(F(x,y)\\)</th><th>\\(y=0\\)</th><th>\\(y=1\\)</th><th>\\(y=2\\)</th></tr></thead><tbody><tr><th>\\(x=0\\)</th><td class=\"mono\">0,10</td><td class=\"mono\">0,15</td><td class=\"mono\">0,20</td></tr><tr><th>\\(x=1\\)</th><td class=\"mono\">0,30</td><td class=\"mono\">0,45</td><td class=\"mono\">0,55</td></tr><tr><th>\\(x=2\\)</th><td class=\"mono\">0,35</td><td class=\"mono\">0,75</td><td class=\"mono\">1</td></tr></tbody></table></div>",
          "p": 4
        },
        {
          "h": "c) P(X ≤ 1, Y ≥ 1)",
          "body": "\\[0{,}05+0{,}05+0{,}1+0{,}05=0{,}25\\]<p class=\"trap\"><b>Gildra.</b> Þetta er ekki 1 − F(1, 0): „Y ≥ 1“ er ekki fyllimengi „Y ≤ 0“ þegar X er líka skilyrt.</p>",
          "p": 1
        },
        {
          "h": "d) Jaðardreifingar",
          "body": "<p>Línusummur og dálkasummur:</p>\\[f_X:\\; 0{,}2,\\;0{,}35,\\;0{,}45\\qquad f_Y:\\; 0{,}35,\\;0{,}4,\\;0{,}25\\]",
          "p": 2
        }
      ],
      "examWeight": 10,
      "e": "",
      "paper": "D24"
    },
    {
      "id": "D24-8",
      "topic": "L06",
      "level": 2,
      "source": "old",
      "src": "Lokapróf desember 2024, dæmi 8 (10%)",
      "q": "\\([X,Y]\\) hefur samþéttleikafallið \\[f(x,y)=\\begin{cases}\\tfrac18(x+y) & 0<x<2,\\;0<y<2\\\\0&\\text{annars}\\end{cases}\\]<ol type=\"a\"><li>Finnið jaðarþéttleikaföllin \\(f_X(x)\\) og \\(f_Y(y)\\).</li><li>Finnið \\(P(1<X<2)\\).</li><li>Finnið skilyrta þéttleikafallið \\(f_{X|Y}(x\\mid y)\\).</li><li>Finnið \\(P(1<X<2\\mid Y=1)\\).</li><li>Út frá b) og d), eru \\(X\\) og \\(Y\\) háðar eða óháðar?</li></ol>",
      "type": "steps",
      "steps": [
        {
          "h": "a) Jaðarþéttleikar",
          "body": "\\[f_X(x)=\\int_0^2 \\tfrac18(x+y)\\,dy=\\tfrac18(2x+2)=\\tfrac{x+1}{4},\\quad 0<x<2\\]<p>Eins (samhverft): \\(f_Y(y)=\\tfrac{y+1}{4},\\; 0<y<2\\).</p>",
          "p": 2
        },
        {
          "h": "b) P(1 < X < 2)",
          "body": "\\[\\int_1^2\\tfrac{x+1}{4}\\,dx=\\tfrac14\\Big[\\tfrac{x^2}{2}+x\\Big]_1^2=\\tfrac14(4-1{,}5)=0{,}625\\]",
          "p": 1
        },
        {
          "h": "c) f(x | y)",
          "body": "\\[f_{X|Y}(x\\mid y)=\\frac{f(x,y)}{f_Y(y)}=\\frac{(x+y)/8}{(y+1)/4}=\\frac{x+y}{2(y+1)},\\quad 0<x<2\\]",
          "p": 2
        },
        {
          "h": "d) P(1 < X < 2 | Y = 1)",
          "body": "\\[f_{X|Y}(x\\mid 1)=\\tfrac{x+1}{4}\\;\\Rightarrow\\;\\int_1^2\\tfrac{x+1}{4}\\,dx=0{,}625\\]",
          "p": 1
        },
        {
          "h": "e) Háðar",
          "body": "<p><b>Háðar.</b> Að b) og d) gefi sömu tölu er tilviljun við \\(y=1\\). Óhæði krefst \\(f_{X|Y}(x\\mid y)=f_X(x)\\) fyrir <i>öll</i> y, en t.d. \\(f_{X|Y}(x\\mid 0{,}5)=\\tfrac{x+0{,}5}{3}\\ne \\tfrac{x+1}{4}\\). Einnig: \\(f_Xf_Y=\\tfrac{(x+1)(y+1)}{16}\\ne\\tfrac{x+y}{8}\\).</p>",
          "p": 2
        }
      ],
      "examWeight": 10,
      "e": "",
      "paper": "D24"
    },
    {
      "id": "D24-9",
      "topic": "L09",
      "level": 2,
      "source": "old",
      "src": "Lokapróf desember 2024, dæmi 9 (5%)",
      "q": "Hagfræðingur spyr fólk hve mikið það eyði að jafnaði í matvörur á mánuði (í þúsundum króna):<p class=\"mono\" style=\"text-align:center\">250 &nbsp; 275 &nbsp; 230 &nbsp; 260 &nbsp; 240</p><ol type=\"a\"><li>Reiknið meðaltal úrtaksins.</li><li>Reiknið dreifni og staðalfrávik úrtaksins.</li><li>Reiknið 99% tvíhliða öryggismörk fyrir meðaltalið, að því gefnu að eyðslan sé normaldreifð.</li></ol><p class=\"hint\">Prófið talar um „fyrstu 10 svörin“ en gefur 5 tölur; hér er n = 5.</p>",
      "type": "steps",
      "steps": [
        {
          "h": "a) Meðaltal",
          "body": "\\[\\bar x=\\frac{1255}{5}=251\\]",
          "p": 1
        },
        {
          "h": "b) Dreifni og staðalfrávik",
          "body": "<p>Frávik: −1, 24, −21, 9, −11; ferningar 1, 576, 441, 81, 121.</p>\\[s^2=\\frac{1220}{5-1}=305,\\qquad s=\\sqrt{305}\\approx 17{,}46\\]<p class=\"trap\"><b>Gildra.</b> S² deilir með n − 1, ekki n.</p>",
          "p": 2
        },
        {
          "h": "c) 99% öryggisbil",
          "body": "\\[\\bar x\\pm t_{4;\\,0{,}005}\\frac{s}{\\sqrt n}=251\\pm 4{,}604\\cdot\\frac{17{,}46}{\\sqrt5}=251\\pm 35{,}96\\;\\Rightarrow\\;(215{,}0;\\;287{,}0)\\]<p class=\"trap\"><b>Gildra.</b> σ er óþekkt og n lítið: t-dreifing með n − 1 = 4 frígráður, og α/2 = 0,005.</p>",
          "p": 2
        }
      ],
      "examWeight": 5,
      "e": "",
      "paper": "D24"
    },
    {
      "id": "D24-10",
      "topic": "L09",
      "level": 2,
      "source": "old",
      "src": "Lokapróf desember 2024, dæmi 10 (15%)",
      "q": "Fyrirtæki kannar hvort upplifun gesta í tveimur skemmtigörðum hafi verið jákvæð:<div class=\"scroll\"><table class=\"tt\"><thead><tr><th></th><th>Vesterós</th><th>Aseroð</th></tr></thead><tbody><tr><th>Hlutfall jákvæðra</th><td class=\"mono\">0,5</td><td class=\"mono\">0,45</td></tr><tr><th>Dreifni</th><td class=\"mono\">0,15</td><td class=\"mono\">0,05</td></tr><tr><th>Fjöldi í úrtaki</th><td class=\"mono\">28</td><td class=\"mono\">20</td></tr></tbody></table></div><ol type=\"a\"><li>Prófið hvort hlutfall jákvæðra í Vesterós sé hærra en 0,3 miðað við 5% marktækni.</li><li>Prófið hvort marktækur munur sé á hlutföllum jákvæðra í Vesterós og Aseroð miðað við 5% marktækni.</li><li>Prófið hvort marktækur munur sé á dreifni jákvæðra skoðana miðað við 10% marktækni (notið 5% F-töfluna því 10%/2 = 5%).</li><li>Hvernig túlkið þið niðurstöðurnar? Hvaða tilgátum byggja prófin á og hverjum var hafnað?</li></ol>",
      "type": "steps",
      "steps": [
        {
          "h": "a) Einhliða próf",
          "body": "<p>\\(H_0: p\\le 0{,}3\\) gegn \\(H_1: p>0{,}3\\). Með gefnu dreifninni:</p>\\[T=\\frac{0{,}5-0{,}3}{\\sqrt{0{,}15/28}}=\\frac{0{,}2}{0{,}0732}\\approx 2{,}73>t_{27;\\,0{,}05}=1{,}703\\]<p><b>H₀ hafnað</b>: hlutfallið er marktækt hærra en 0,3. (Með dreifninni \\(p_0(1-p_0)\\) fæst \\(z\\approx 2{,}31>1{,}645\\), sama niðurstaða.)</p>",
          "p": 4
        },
        {
          "h": "b) Munur á hlutföllum (Welch)",
          "body": "\\[T=\\frac{0{,}5-0{,}45}{\\sqrt{\\frac{0{,}15}{28}+\\frac{0{,}05}{20}}}=\\frac{0{,}05}{0{,}0886}\\approx 0{,}56\\]<p>Welch-frígráður ≈ 44, \\(t_{0{,}025}\\approx 2{,}02\\). \\(|T|<2{,}02\\): <b>ekki hægt að hafna</b> \\(H_0: p_1=p_2\\).</p>",
          "p": 4
        },
        {
          "h": "c) F-próf á dreifni",
          "body": "\\[F=\\frac{s_1^2}{s_2^2}=\\frac{0{,}15}{0{,}05}=3{,}0,\\qquad F_{27,19;\\,0{,}05}\\approx 2{,}09\\]<p>\\(3{,}0>2{,}09\\): <b>H₀ um jafna dreifni hafnað</b> við 10%. Stærri dreifnin fer í teljarann.</p><p class=\"trap\"><b>Gildra.</b> F er hlutfall dreifna, ekki staðalfrávika.</p>",
          "p": 4
        },
        {
          "h": "d) Túlkun",
          "body": "<p>Hlutfall jákvæðra í Vesterós er marktækt yfir 0,3, en ekki er marktækur munur á görðunum tveimur. Dreifnin er marktækt meiri í Vesterós: skoðanir þar eru dreifðari. Prófin gera ráð fyrir óháðum slembiúrtökum og nálgað normaldreifðum meðaltölum; Welch-prófið gerir ekki ráð fyrir jafnri dreifni, sem er eins gott því F-prófið hafnar henni.</p>",
          "p": 3
        }
      ],
      "examWeight": 15,
      "e": "",
      "paper": "D24"
    },
    {
      "id": "D24-11",
      "topic": "L08",
      "level": 2,
      "source": "old",
      "src": "Lokapróf desember 2024, dæmi 11 (10%)",
      "q": "Fjöldi umsókna um atvinnuleysisbætur á dag er Poisson-dreifður. Síðustu 5 daga:<div class=\"scroll\"><table class=\"tt\"><thead><tr><th>Dagur</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th></tr></thead><tbody><tr><th>Umsóknir</th><td class=\"mono\">1</td><td class=\"mono\">3</td><td class=\"mono\">2</td><td class=\"mono\">4</td><td class=\"mono\">3</td></tr></tbody></table></div><p>Finnið sennileikamat á \\(\\lambda\\).</p><ol type=\"a\"><li>Hvert er sennileikafallið fyrir \\(\\lambda\\)?</li><li>Finnið lograsennileikafallið.</li><li>Finnið sennileikamatið \\(\\hat\\lambda\\).</li></ol>",
      "type": "steps",
      "steps": [
        {
          "h": "a) Sennileikafall",
          "body": "\\[L(\\lambda)=\\prod_{i=1}^5\\frac{\\lambda^{x_i}e^{-\\lambda}}{x_i!}=\\frac{\\lambda^{13}e^{-5\\lambda}}{1!\\,3!\\,2!\\,4!\\,3!}=\\frac{\\lambda^{13}e^{-5\\lambda}}{1728}\\]",
          "p": 3
        },
        {
          "h": "b) Lograsennileiki",
          "body": "\\[\\ell(\\lambda)=13\\ln\\lambda-5\\lambda-\\ln 1728\\]",
          "p": 3
        },
        {
          "h": "c) Matið",
          "body": "\\[\\ell'(\\lambda)=\\frac{13}{\\lambda}-5=0\\;\\Rightarrow\\;\\hat\\lambda=\\frac{13}{5}=2{,}6=\\bar x\\]<p>\\(\\ell''(\\lambda)=-13/\\lambda^2<0\\), svo þetta er hámark.</p>",
          "p": 4
        }
      ],
      "examWeight": 10,
      "e": "",
      "paper": "D24"
    },
    {
      "id": "D24-12",
      "topic": "L00",
      "level": 2,
      "source": "old",
      "src": "Lokapróf desember 2024, dæmi 12 (2%)",
      "q": "Grunnatriði í R:<pre class=\"code\">x &lt;- 5\ny &lt;- c(1, 2, 3, 4)\n\nz_1 &lt;- y[2] + y[4] + x\nz_2 &lt;- x + y</pre><ol type=\"a\"><li>Hvert er gildið í <code>z_1</code>?</li><li>Hvert er gildið í <code>z_2</code>?</li></ol>",
      "type": "steps",
      "steps": [
        {
          "h": "a) z_1",
          "body": "<p>\\(y_2+y_4+x=2+4+5=\\) <code>11</code>.</p>",
          "p": 1
        },
        {
          "h": "b) z_2",
          "body": "<p>Vigurinn <code>c(6, 7, 8, 9)</code>: x er lagt við hvert stak y.</p>",
          "p": 1
        }
      ],
      "examWeight": 2,
      "e": "",
      "paper": "D24",
      "r": true
    },
    {
      "id": "D24-13",
      "topic": "L00",
      "level": 2,
      "source": "old",
      "src": "Lokapróf desember 2024, dæmi 13 (2%)",
      "q": "Pakkar og stöðluð föll:<pre class=\"code\">library(ggplot2)\n\nx &lt;- rnorm(100, mean = 0, sd = 1)\n\nprint(mean(x))\nprint(sd(x))\n\nggplot(data = data.frame(x), aes(x = x)) +\n    geom_histogram(binwidth = 0.5, fill = \"blue\", color = \"black\")</pre><ol type=\"a\"><li>Hvað gerir <code>library(ggplot2)</code>?</li><li>Hvað gerir <code>rnorm(100, mean = 0, sd = 1)</code>?</li><li>Hvað gerir skipunin í línum 8 og 9?</li></ol>",
      "type": "steps",
      "steps": [
        {
          "h": "a) library",
          "body": "<p>Hleður pakkanum ggplot2 (sem þarf að vera uppsettur) svo föll hans verði aðgengileg.</p>",
          "p": 1
        },
        {
          "h": "b) rnorm",
          "body": "<p>Dregur 100 slembitölur úr staðlaðri normaldreifingu N(0, 1). Þriðja færibreytan er staðalfrávik, ekki dreifni.</p>",
          "p": 1
        },
        {
          "h": "c) ggplot",
          "body": "<p>Teiknar stuðlarit (histogram) af x með stólpabreidd 0,5, bláum stólpum og svörtum útlínum.</p>",
          "p": 1
        }
      ],
      "examWeight": 2,
      "e": "",
      "paper": "D24",
      "r": true
    },
    {
      "id": "D24-14",
      "topic": "L00",
      "level": 2,
      "source": "old",
      "src": "Lokapróf desember 2024, dæmi 14 (2%)",
      "q": "Skilgreiningar falla:<pre class=\"code\">fall &lt;- function(a, b) {\n    if (a > b) {\n        result &lt;- a^2 - b^2\n    } else {\n        result &lt;- a^2 + b^2 + 5\n    }\n}</pre><ol type=\"a\"><li>Hvaða gildi birtir <code>print(fall(5, 3))</code>?</li><li>Hvaða gildi birtir <code>print(fall(3, 5))</code>?</li></ol>",
      "type": "steps",
      "steps": [
        {
          "h": "a) fall(5, 3)",
          "body": "<p>\\(5>3\\): \\(25-9=\\) <code>16</code>.</p>",
          "p": 1
        },
        {
          "h": "b) fall(3, 5)",
          "body": "<p>\\(3\\not>5\\): \\(9+25+5=\\) <code>39</code>.</p><p class=\"note\">Fallið skilar gildi síðustu segðar, úthlutuninni, en ósýnilega: <code>fall(3, 5)</code> eitt og sér prentar ekkert, <code>print()</code> birtir það.</p>",
          "p": 1
        }
      ],
      "examWeight": 2,
      "e": "",
      "paper": "D24",
      "r": true
    },
    {
      "id": "D24-15",
      "topic": "L00",
      "level": 2,
      "source": "old",
      "src": "Lokapróf desember 2024, dæmi 15 (4%)",
      "q": "Tölfræðipróf og innlestur gagna:<pre class=\"code\">read.csv(\"ice.csv\")\nread.csv(\"fra.csv\")\n\nres &lt;- t.test(ice, fra)\nprint(res)</pre><p>Úttakið:</p><pre class=\"code\">Welch Two Sample t-test\n\ndata:  ice and fra\nt = 1.8516, df = 10, p-value = 0.09379\nalternative hypothesis: true difference in means is not equal to 0\n95 percent confidence interval:\n -0.406665  4.406665\nsample estimates:\nmean of x mean of y\n      7.5       5.5</pre><ol type=\"a\"><li>Hvað gera skipanirnar í línum 1 og 2?</li><li>Hvað gerir <code>t.test(ice, fra)</code> og hvað má lesa úr niðurstöðunum?</li></ol>",
      "type": "steps",
      "steps": [
        {
          "h": "a) read.csv",
          "body": "<p>Lesa CSV-skrárnar ice.csv og fra.csv í gagnatöflur. Athugið að úttakið er ekki geymt í breytu (vantar <code>ice &lt;- read.csv(…)</code>), svo það prentast bara.</p>",
          "p": 1
        },
        {
          "h": "b) Welch t-próf",
          "body": "<p>Tvíhliða t-próf (Welch, ójöfn dreifni) á því hvort meðaltöl hópanna tveggja séu jöfn. Meðaltöl 7,5 og 5,5; \\(t=1{,}85\\), df = 10, p = 0,094.</p><p>p &gt; 0,05: <b>ekki hægt að hafna</b> jöfnum meðaltölum við 5% (en það væri hægt við 10%). 95% öryggisbilið fyrir muninn, (−0,41; 4,41), inniheldur 0.</p>",
          "p": 3
        }
      ],
      "examWeight": 4,
      "e": "",
      "paper": "D24",
      "r": true
    },
    {
      "id": "J25-1",
      "topic": "L01",
      "level": 2,
      "source": "old",
      "src": "Endurtökupróf janúar 2025, dæmi 1 (6,5%)",
      "q": "Útskriftarnemar úr hagfræðideild bera saman bækur sínar:<ul><li>16 útskrifuðust úr fjármálahagfræði; 10 þeirra starfa hjá fjármálastofnunum.</li><li>5 útskrifuðust úr almennri hagfræði; 1 starfar hjá fjármálastofnun.</li><li>11 útskrifuðust úr viðskiptahagfræði; 6 starfa hjá fjármálastofnunum.</li></ul><ol type=\"a\"><li>Hverjar eru líkurnar á að nemandi úr viðskiptahagfræði starfi hjá fjármálastofnun?</li><li>Hverjar eru líkurnar á að nemandi sem útskrifaðist <u>ekki</u> úr viðskiptahagfræði starfi <u>ekki</u> hjá fjármálastofnun?</li><li>Hverjar eru líkurnar á að útskriftarnemi starfi hjá fjármálastofnun?</li><li>Velja á 5 nemendur: 2 úr fjármálahagfræði, 1 úr almennri og 2 úr viðskiptahagfræði, og enginn þeirra starfar hjá fjármálastofnun. Á hversu marga vegu er það hægt?</li></ol>",
      "type": "steps",
      "steps": [
        {
          "h": "a) Pr(F | V)",
          "body": "\\[\\Pr(F\\mid V)=\\tfrac{6}{11}\\approx 0{,}545\\]",
          "p": 1
        },
        {
          "h": "b) Pr(ekki F | ekki V)",
          "body": "<p>Ekki úr viðskiptahagfræði: \\(16+5=21\\); þar af starfa \\(10+1=11\\) hjá fjármálastofnun, svo 10 ekki:</p>\\[\\Pr(F^c\\mid V^c)=\\tfrac{10}{21}\\approx 0{,}476\\]",
          "p": 1
        },
        {
          "h": "c) Pr(F)",
          "body": "\\[\\Pr(F)=\\frac{10+1+6}{32}=\\frac{17}{32}\\approx 0{,}531\\]",
          "p": 1
        },
        {
          "h": "d) Fjöldi hópa",
          "body": "<p>Aðeins þeir sem starfa ekki hjá fjármálastofnun: 6, 4 og 5.</p>\\[\\binom62\\binom41\\binom52=15\\cdot 4\\cdot 10=600\\]",
          "p": 2
        }
      ],
      "examWeight": 6.5,
      "e": "",
      "paper": "J25"
    },
    {
      "id": "J25-2",
      "topic": "L01",
      "level": 2,
      "source": "old",
      "src": "Endurtökupróf janúar 2025, dæmi 2 (3,5%)",
      "q": "Þegar mikill samdráttur verður á hlutabréfamörkuðum (S) eru 80% líkur á efnahagskreppu (K); annars 10%. Almennt eru 20% líkur á samdrætti.<ol type=\"a\"><li>Að gefnum samdrætti, hverjar eru líkurnar á að <u>ekki</u> hefjist efnahagskreppa?</li><li>Að gefinni efnahagskreppu, hverjar eru líkurnar á að samdráttur hafi orðið?</li></ol>",
      "type": "steps",
      "steps": [
        {
          "h": "a) Pr(ekki K | S)",
          "body": "\\[\\Pr(K^c\\mid S)=1-0{,}8=0{,}2\\]",
          "p": 1
        },
        {
          "h": "b) Bayes",
          "body": "\\[\\Pr(S\\mid K)=\\frac{0{,}2\\cdot 0{,}8}{0{,}2\\cdot 0{,}8+0{,}8\\cdot 0{,}1}=\\frac{0{,}16}{0{,}24}=\\tfrac23\\approx 0{,}667\\]<p class=\"trap\"><b>Gildra.</b> Nefnarinn er heildarlíkur á kreppu, Pr(K), yfir bæði tilvikin.</p>",
          "p": 2
        }
      ],
      "examWeight": 3.5,
      "e": "",
      "paper": "J25"
    },
    {
      "id": "J25-3",
      "topic": "L02",
      "level": 2,
      "source": "old",
      "src": "Endurtökupróf janúar 2025, dæmi 3 (5%)",
      "q": "Slembibreytan \\(X\\) hefur líkindamassafallið\\[P(X=k)=\\begin{cases}0{,}2 & \\text{ef } k=-1\\\\0{,}1 & \\text{ef } k=3\\\\0{,}4 & \\text{ef } k=5\\\\0{,}2 & \\text{ef } k=6\\\\0{,}1 & \\text{ef } k=7\\\\0 & \\text{annars}\\end{cases}\\]<ol type=\"a\"><li>Finnið dreifingarfall \\(X\\).</li><li>Reiknið væntigildi \\(X\\).</li><li>Hverjar eru líkurnar \\(P(3<X\\le 6)\\)?</li></ol>",
      "type": "steps",
      "steps": [
        {
          "h": "a) Dreifingarfall",
          "body": "\\[F(x)=\\begin{cases}0 & x<-1\\\\0{,}2 & -1\\le x<3\\\\0{,}3 & 3\\le x<5\\\\0{,}7 & 5\\le x<6\\\\0{,}9 & 6\\le x<7\\\\1 & x\\ge 7\\end{cases}\\]",
          "p": 2
        },
        {
          "h": "b) E[X]",
          "body": "\\[E[X]=-1(0{,}2)+3(0{,}1)+5(0{,}4)+6(0{,}2)+7(0{,}1)=4{,}0\\]",
          "p": 1
        },
        {
          "h": "c) P(3 < X ≤ 6)",
          "body": "\\[P(3<X\\le 6)=0{,}4+0{,}2=0{,}6=F(6)-F(3)\\]<p class=\"trap\"><b>Gildra.</b> Strangt < útilokar X = 3.</p>",
          "p": 1
        }
      ],
      "examWeight": 5,
      "e": "",
      "paper": "J25"
    },
    {
      "id": "J25-4",
      "topic": "L04",
      "level": 2,
      "source": "old",
      "src": "Endurtökupróf janúar 2025, dæmi 4 (10%)",
      "q": "Slembibreytan \\(Y\\) hefur þéttleikafallið \\[f(y)=\\begin{cases}6y^5 & 0\\le y\\le 1\\\\0&\\text{annars}\\end{cases}\\]<ol type=\"a\"><li>Hvert er dreifingarfall \\(Y\\)?</li><li>Finnið væntigildi \\(Y\\).</li><li>Finnið dreifni \\(Y\\).</li><li>Finnið staðalfrávik \\(Y\\).</li><li>Finnið 25% hlutfallsmark \\(Y\\).</li></ol>",
      "type": "steps",
      "steps": [
        {
          "h": "a) F(y)",
          "body": "\\[F(y)=y^6\\quad(0\\le y\\le 1),\\qquad 0 \\text{ ef } y<0,\\; 1 \\text{ ef } y>1\\]",
          "p": 2
        },
        {
          "h": "b) E[Y]",
          "body": "\\[E[Y]=\\int_0^1 6y^6\\,dy=\\tfrac67\\approx 0{,}857\\]",
          "p": 1
        },
        {
          "h": "c) Var[Y]",
          "body": "\\[E[Y^2]=\\tfrac68=\\tfrac34,\\qquad \\operatorname{Var}[Y]=\\tfrac34-\\tfrac{36}{49}=\\tfrac{3}{196}\\approx 0{,}0153\\]",
          "p": 2
        },
        {
          "h": "d) Staðalfrávik",
          "body": "\\[\\sigma=\\sqrt{3/196}\\approx 0{,}124\\]",
          "p": 1
        },
        {
          "h": "e) 25% hlutfallsmark",
          "body": "\\[F(q)=q^6=0{,}25\\;\\Rightarrow\\; q=0{,}25^{1/6}\\approx 0{,}794\\]",
          "p": 1
        }
      ],
      "examWeight": 10,
      "e": "",
      "paper": "J25"
    },
    {
      "id": "J25-5",
      "topic": "L03",
      "level": 2,
      "source": "old",
      "src": "Endurtökupróf janúar 2025, dæmi 5 (5%)",
      "q": "Að meðaltali koma 2 viðskiptavinir í bankann á klukkustund. \\(F\\) er fjöldinn á klukkustund og er Poisson-dreifður.<ol type=\"a\"><li>Hver er stiki \\(F\\)?</li><li>Hver er dreifni \\(F\\)?</li><li>Hverjar eru líkurnar á að fleiri en 1 viðskiptavinur komi á gefinni klukkustund?</li></ol>",
      "type": "steps",
      "steps": [
        {
          "h": "a) Stikinn",
          "body": "\\[\\lambda=2 \\text{ á klukkustund}\\]",
          "p": 1
        },
        {
          "h": "b) Dreifni",
          "body": "\\[\\operatorname{Var}[F]=\\lambda=2\\]",
          "p": 1
        },
        {
          "h": "c) P(F > 1)",
          "body": "\\[P(F>1)=1-e^{-2}\\left(1+2\\right)=1-3e^{-2}\\approx 0{,}594\\]<p>Í R: <code>1 - ppois(1, 2)</code>.</p>",
          "p": 1
        }
      ],
      "examWeight": 5,
      "e": "",
      "paper": "J25"
    },
    {
      "id": "J25-6",
      "topic": "L03",
      "level": 2,
      "source": "old",
      "src": "Endurtökupróf janúar 2025, dæmi 6 (10%)",
      "q": "Líkurnar á að selja einstaklingi fjárfestingu eru 0,1, og haft er samband við 10 á dag. \\(X\\) er fjöldi kaupenda á dag og er tvíkostadreifð.<ol type=\"a\"><li>Hverjir eru stikar \\(X\\)?</li><li>Hver er væntur fjöldi kaupenda á dag?</li><li>Hver er dreifni fjöldans?</li><li>Hverjar eru líkurnar á að enginn kaupi?</li></ol><p>Nú er haft samband við 1000 á dag.</p><ol type=\"a\" start=\"5\"><li>Hverjar eru líkurnar á að 110 eða færri kaupi? Nálgun nægir.</li></ol>",
      "type": "steps",
      "steps": [
        {
          "h": "a) Stikar",
          "body": "\\[X\\sim\\text{Bin}(n=10,\\;p=0{,}1)\\]",
          "p": 1
        },
        {
          "h": "b) E[X]",
          "body": "\\[E[X]=np=1\\]",
          "p": 1
        },
        {
          "h": "c) Var[X]",
          "body": "\\[\\operatorname{Var}[X]=np(1-p)=0{,}9\\]",
          "p": 1
        },
        {
          "h": "d) P(X = 0)",
          "body": "\\[P(X=0)=0{,}9^{10}\\approx 0{,}349\\]",
          "p": 1
        },
        {
          "h": "e) Normalnálgun",
          "body": "<p>\\(n=1000\\): \\(E=100\\), \\(\\operatorname{Var}=90\\), \\(\\sigma\\approx 9{,}49\\).</p>\\[P(X\\le 110)\\approx\\Phi\\!\\left(\\frac{110{,}5-100}{9{,}49}\\right)=\\Phi(1{,}11)\\approx 0{,}866\\]<p>Án samfelldnileiðréttingar: \\(\\Phi(1{,}05)\\approx 0{,}854\\). Nákvæmt (<code>pbinom(110, 1000, 0.1)</code>): 0,865.</p>",
          "p": 3
        }
      ],
      "examWeight": 10,
      "e": "",
      "paper": "J25"
    },
    {
      "id": "J25-7",
      "topic": "L06",
      "level": 2,
      "source": "old",
      "src": "Endurtökupróf janúar 2025, dæmi 7 (10%)",
      "q": "\\(X\\) og \\(Y\\) eru strjálar með samþéttleikafallið:<div class=\"scroll\"><table class=\"tt\"><thead><tr><th>\\(f(x,y)\\)</th><th>\\(y=0\\)</th><th>\\(y=1\\)</th><th>\\(y=2\\)</th><th>\\(y=3\\)</th></tr></thead><tbody><tr><th>\\(x=0\\)</th><td class=\"mono\">0,15</td><td class=\"mono\">0,10</td><td class=\"mono\">0,05</td><td class=\"mono\">0,10</td></tr><tr><th>\\(x=1\\)</th><td class=\"mono\">0,20</td><td class=\"mono\">0,10</td><td class=\"mono\">0,15</td><td class=\"mono\">0,15</td></tr></tbody></table></div><ol type=\"a\"><li>Finnið \\(P(X=1,Y=0)\\).</li><li>Finnið samdreifingarfallið \\(F(x,y)\\) á töfluformi.</li><li>Finnið \\(P[(X=1,Y=1) \\text{ eða } (X=1,Y=2)]\\).</li><li>Hver eru jaðarþéttleikaföllin \\(f_X(x)\\) og \\(f_Y(y)\\)?</li></ol>",
      "type": "steps",
      "steps": [
        {
          "h": "a) P(X = 1, Y = 0)",
          "body": "<p>\\(0{,}20\\)</p>",
          "p": 1
        },
        {
          "h": "b) F(x, y)",
          "body": "<div class=\"scroll\"><table class=\"tt\"><thead><tr><th>\\(F(x,y)\\)</th><th>\\(y=0\\)</th><th>\\(y=1\\)</th><th>\\(y=2\\)</th><th>\\(y=3\\)</th></tr></thead><tbody><tr><th>\\(x=0\\)</th><td class=\"mono\">0,15</td><td class=\"mono\">0,25</td><td class=\"mono\">0,30</td><td class=\"mono\">0,40</td></tr><tr><th>\\(x=1\\)</th><td class=\"mono\">0,35</td><td class=\"mono\">0,55</td><td class=\"mono\">0,75</td><td class=\"mono\">1</td></tr></tbody></table></div>",
          "p": 4
        },
        {
          "h": "c) Sundurlægir atburðir",
          "body": "\\[0{,}10+0{,}15=0{,}25\\]<p>Atburðirnir eru sundurlægir, svo líkurnar leggjast saman.</p>",
          "p": 1
        },
        {
          "h": "d) Jaðardreifingar",
          "body": "\\[f_X:\\;0{,}4,\\;0{,}6\\qquad f_Y:\\;0{,}35,\\;0{,}20,\\;0{,}20,\\;0{,}25\\]",
          "p": 2
        }
      ],
      "examWeight": 10,
      "e": "",
      "paper": "J25"
    },
    {
      "id": "J25-8",
      "topic": "L06",
      "level": 2,
      "source": "old",
      "src": "Endurtökupróf janúar 2025, dæmi 8 (10%)",
      "q": "\\([X,Y]\\) hefur samþéttleikafallið \\[f(x,y)=\\begin{cases}6x^2y & 0\\le x\\le 1,\\;0\\le y\\le 1\\\\0&\\text{annars}\\end{cases}\\]<ol type=\"a\"><li>Finnið jaðarþéttleikaföllin \\(f_X(x)\\) og \\(f_Y(y)\\).</li><li>Finnið \\(P(0{,}25<X<0{,}5)\\).</li><li>Finnið \\(f_{X|Y}(x\\mid y)\\).</li><li>Eru \\(X\\) og \\(Y\\) háðar eða óháðar?</li></ol>",
      "type": "steps",
      "steps": [
        {
          "h": "a) Jaðarþéttleikar",
          "body": "\\[f_X(x)=\\int_0^1 6x^2y\\,dy=3x^2,\\qquad f_Y(y)=\\int_0^1 6x^2y\\,dx=2y\\]",
          "p": 2
        },
        {
          "h": "b) P(0,25 < X < 0,5)",
          "body": "\\[\\Big[x^3\\Big]_{0{,}25}^{0{,}5}=0{,}125-0{,}015625=0{,}109\\]",
          "p": 1
        },
        {
          "h": "c) f(x | y)",
          "body": "\\[f_{X|Y}(x\\mid y)=\\frac{6x^2y}{2y}=3x^2,\\quad 0\\le x\\le 1\\]",
          "p": 2
        },
        {
          "h": "d) Óháðar",
          "body": "<p><b>Óháðar:</b> \\(f_{X|Y}(x\\mid y)=3x^2=f_X(x)\\) fyrir öll y, og \\(f(x,y)=3x^2\\cdot 2y=f_X(x)f_Y(y)\\). (Prófið vísar í „b) og d)“ en á við b) og c).)</p>",
          "p": 2
        }
      ],
      "examWeight": 10,
      "e": "",
      "paper": "J25"
    },
    {
      "id": "J25-9",
      "topic": "L09",
      "level": 2,
      "source": "old",
      "src": "Endurtökupróf janúar 2025, dæmi 9 (5%)",
      "q": "Dagleg velta bréfa í Tóm hamingja ehf. síðustu 5 daga (í þúsundum króna):<div class=\"scroll\"><table class=\"tt\"><thead><tr><th>Dagur</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th></tr></thead><tbody><tr><th>Velta</th><td class=\"mono\">555</td><td class=\"mono\">1003</td><td class=\"mono\">674</td><td class=\"mono\">1243</td><td class=\"mono\">945</td></tr></tbody></table></div><ol type=\"a\"><li>Reiknið meðaltal úrtaksins.</li><li>Reiknið dreifni og staðalfrávik úrtaksins.</li><li>Reiknið 90% tvíhliða öryggismörk fyrir meðaltalið, að því gefnu að veltan sé normaldreifð.</li></ol>",
      "type": "steps",
      "steps": [
        {
          "h": "a) Meðaltal",
          "body": "\\[\\bar x=\\frac{4420}{5}=884\\]",
          "p": 1
        },
        {
          "h": "b) Dreifni og staðalfrávik",
          "body": "<p>Frávik: −329, 119, −210, 359, 61.</p>\\[s^2=\\frac{299\\,104}{4}=74\\,776,\\qquad s\\approx 273{,}5\\]",
          "p": 2
        },
        {
          "h": "c) 90% öryggisbil",
          "body": "\\[884\\pm t_{4;\\,0{,}05}\\frac{273{,}5}{\\sqrt5}=884\\pm 2{,}132\\cdot 122{,}3=884\\pm 260{,}7\\;\\Rightarrow\\;(623{,}3;\\;1144{,}7)\\]",
          "p": 2
        }
      ],
      "examWeight": 5,
      "e": "",
      "paper": "J25"
    },
    {
      "id": "J25-10",
      "topic": "L09",
      "level": 2,
      "source": "old",
      "src": "Endurtökupróf janúar 2025, dæmi 10 (15%)",
      "q": "Rekstrarkostnaður tveggja bíltegunda í flota Hamingjufraktar:<div class=\"scroll\"><table class=\"tt\"><thead><tr><th>Tegund</th><th>Húnda</th><th>Missan</th></tr></thead><tbody><tr><th>Meðalkostnaður á km</th><td class=\"mono\">7,2 kr.</td><td class=\"mono\">7,6 kr.</td></tr><tr><th>Dreifni</th><td class=\"mono\">1,2</td><td class=\"mono\">0,5</td></tr><tr><th>Fjöldi bíla</th><td class=\"mono\">19</td><td class=\"mono\">23</td></tr></tbody></table></div><ol type=\"a\"><li>Prófið hvort meðalkostnaður Missan á km sé marktækt hærri en 8 kr. við 5% marktækni.</li><li>Prófið hvort marktækur munur sé á meðalkostnaði Húnda og Missan við 5% marktækni.</li><li>Prófið hvort dreifni kostnaðar Húnda sé marktækt hærri en Missan við 10% marktækni.</li><li>Hvernig túlkið þið niðurstöðurnar? Hvaða ályktanir má draga?</li></ol>",
      "type": "steps",
      "steps": [
        {
          "h": "a) Einhliða próf",
          "body": "<p>\\(H_0:\\mu\\le 8\\) gegn \\(H_1:\\mu>8\\).</p>\\[T=\\frac{7{,}6-8}{\\sqrt{0{,}5/23}}=\\frac{-0{,}4}{0{,}147}\\approx -2{,}71\\]<p>T er neikvætt en \\(H_1\\) segir „hærra“: <b>ekki hægt að hafna</b> \\(H_0\\) (gagnrýnigildi \\(t_{22;\\,0{,}05}=1{,}717\\)).</p><p class=\"trap\"><b>Gildra.</b> Í einhliða prófi skiptir stefna T máli; |T| > 1,717 hafnar ekki H₀ þegar T er í öfuga átt.</p>",
          "p": 4
        },
        {
          "h": "b) Welch-próf",
          "body": "\\[T=\\frac{7{,}2-7{,}6}{\\sqrt{\\frac{1{,}2}{19}+\\frac{0{,}5}{23}}}=\\frac{-0{,}4}{0{,}291}\\approx -1{,}37\\]<p>Welch-frígráður ≈ 29,6, \\(t_{0{,}025}\\approx 2{,}04\\). \\(|T|<2{,}04\\): <b>enginn marktækur munur</b>.</p>",
          "p": 4
        },
        {
          "h": "c) F-próf (einhliða)",
          "body": "\\[F=\\frac{1{,}2}{0{,}5}=2{,}4,\\qquad F_{18,22;\\,0{,}10}\\approx 1{,}78\\]<p>\\(2{,}4>1{,}78\\): <b>H₀ hafnað</b>, dreifni Húnda er marktækt hærri. (Jafnvel 5%-gildið, um 2,08, er undir 2,4.)</p>",
          "p": 4
        },
        {
          "h": "d) Túlkun",
          "body": "<p>Ekkert bendir til að Missan kosti meira en 8 kr. á km, og meðalkostnaður tegundanna er ekki marktækt ólíkur. Kostnaður Húnda sveiflast hins vegar meira. Með svipaðan meðalkostnað og fyrirsjáanlegri rekstur er Missan betri kostur. Prófin byggja á óháðum úrtökum og nálgað normaldreifðum kostnaði.</p>",
          "p": 3
        }
      ],
      "examWeight": 15,
      "e": "",
      "paper": "J25"
    },
    {
      "id": "J25-11",
      "topic": "L08",
      "level": 2,
      "source": "old",
      "src": "Endurtökupróf janúar 2025, dæmi 11 (10%)",
      "q": "Umsóknir um styrk eru samþykktar (1) eða þeim hafnað (0), óháð hver annarri (Bernoulli):<div class=\"scroll\"><table class=\"tt\"><thead><tr><th>Umsókn</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th></tr></thead><tbody><tr><th>Niðurstaða</th><td class=\"mono\">1</td><td class=\"mono\">0</td><td class=\"mono\">1</td><td class=\"mono\">1</td><td class=\"mono\">0</td></tr></tbody></table></div><p>Finnið sennileikamat á \\(p\\).</p><ol type=\"a\"><li>Hvert er sennileikafallið fyrir \\(p\\)?</li><li>Finnið lograsennileikafallið.</li><li>Finnið sennileikamatið \\(\\hat p\\).</li></ol>",
      "type": "steps",
      "steps": [
        {
          "h": "a) Sennileikafall",
          "body": "\\[L(p)=\\prod_{i=1}^5 p^{x_i}(1-p)^{1-x_i}=p^3(1-p)^2\\]",
          "p": 3
        },
        {
          "h": "b) Lograsennileiki",
          "body": "\\[\\ell(p)=3\\ln p+2\\ln(1-p)\\]",
          "p": 3
        },
        {
          "h": "c) Matið",
          "body": "\\[\\ell'(p)=\\frac3p-\\frac{2}{1-p}=0\\;\\Rightarrow\\;3(1-p)=2p\\;\\Rightarrow\\;\\hat p=\\tfrac35=0{,}6\\]",
          "p": 4
        }
      ],
      "examWeight": 10,
      "e": "",
      "paper": "J25"
    },
    {
      "id": "J25-12",
      "topic": "L00",
      "level": 2,
      "source": "old",
      "src": "Endurtökupróf janúar 2025, dæmi 12 (2%)",
      "q": "Grunnatriði í R:<pre class=\"code\">x &lt;- 5\ny &lt;- c(1, 2, 3, 4)\n\nz_1 &lt;- y[2] * y[3]\nz_2 &lt;- x * y[1:3]</pre><ol type=\"a\"><li>Hvert er gildið í <code>z_1</code>?</li><li>Hvert er gildið í <code>z_2</code>?</li></ol>",
      "type": "steps",
      "steps": [
        {
          "h": "a) z_1",
          "body": "<p>\\(2\\cdot 3=\\) <code>6</code>.</p>",
          "p": 1
        },
        {
          "h": "b) z_2",
          "body": "<p><code>y[1:3]</code> er <code>c(1, 2, 3)</code>, svo <code>z_2</code> er <code>c(5, 10, 15)</code>.</p>",
          "p": 1
        }
      ],
      "examWeight": 2,
      "e": "",
      "paper": "J25",
      "r": true
    },
    {
      "id": "J25-13",
      "topic": "L00",
      "level": 2,
      "source": "old",
      "src": "Endurtökupróf janúar 2025, dæmi 13 (2%)",
      "q": "Pakkar og stöðluð föll:<pre class=\"code\">library(ggplot2)\n\nx &lt;- rpois(1000, lambda=4)\n\nprint(mean(x))\nprint(sd(x))\n\nggplot(data = data.frame(x), aes(x = x)) +\n    geom_histogram(binwidth = 1, fill = \"blue\", color = \"black\")</pre><ol type=\"a\"><li>Hvað gerir <code>library(ggplot2)</code>?</li><li>Hvað gerir <code>rpois(1000, lambda=4)</code>?</li><li>Hvað gerir skipunin í línum 8 og 9?</li></ol>",
      "type": "steps",
      "steps": [
        {
          "h": "a) library",
          "body": "<p>Hleður pakkanum ggplot2 svo föll hans verði aðgengileg.</p>",
          "p": 1
        },
        {
          "h": "b) rpois",
          "body": "<p>Dregur 1000 slembitölur úr Poisson-dreifingu með λ = 4.</p>",
          "p": 1
        },
        {
          "h": "c) ggplot",
          "body": "<p>Teiknar stuðlarit af x með stólpabreidd 1 (ein stoð á hverja heiltölu), bláum stólpum og svörtum útlínum.</p>",
          "p": 1
        }
      ],
      "examWeight": 2,
      "e": "",
      "paper": "J25",
      "r": true
    },
    {
      "id": "J25-14",
      "topic": "L00",
      "level": 2,
      "source": "old",
      "src": "Endurtökupróf janúar 2025, dæmi 14 (2%)",
      "q": "Skilgreiningar falla:<pre class=\"code\">fall &lt;- function(a, celcius) {\n    if (celcius) {\n        result &lt;- (a - 32) * 5/9\n    } else {\n        result &lt;- (a * 9/5) + 32\n    }\n}</pre><ol type=\"a\"><li>Hverju skilar <code>fall(35, TRUE)</code>?</li><li>Hverju skilar <code>fall(35, FALSE)</code>?</li></ol>",
      "type": "steps",
      "steps": [
        {
          "h": "a) fall(35, TRUE)",
          "body": "<p>\\((35-32)\\cdot 5/9\\approx\\) <code>1.667</code> (Fahrenheit í Celsíus).</p>",
          "p": 1
        },
        {
          "h": "b) fall(35, FALSE)",
          "body": "<p>\\(35\\cdot 9/5+32=\\) <code>95</code> (Celsíus í Fahrenheit).</p><p class=\"note\">Fallið skilar gildinu ósýnilega því síðasta segðin er úthlutun; í skipanalínunni prentast ekkert nema með <code>print()</code>.</p>",
          "p": 1
        }
      ],
      "examWeight": 2,
      "e": "",
      "paper": "J25",
      "r": true
    },
    {
      "id": "J25-15",
      "topic": "L00",
      "level": 2,
      "source": "old",
      "src": "Endurtökupróf janúar 2025, dæmi 15 (4%)",
      "q": "Tölfræðipróf og innlestur gagna:<pre class=\"code\">grade &lt;- read.csv(\"grades.csv\")\n\nr &lt;- t.test(grade$final, mu=5.5, alternative=\"greater\")\nprint(r)</pre><p>Úttakið:</p><pre class=\"code\">One Sample t-test\n\ndata:  grade$final\nt = 1.8751, df = 99, p-value = 0.03186\nalternative hypothesis: true mean is greater than 5.5\n95 percent confidence interval:\n 5.53217     Inf\nsample estimates:\nmean of x\n 5.780891</pre><ol type=\"a\"><li>Hvað gerir skipunin í línu 1?</li><li>Hvað gerir skipunin í línu 3 og hvað má lesa úr niðurstöðunum?</li></ol>",
      "type": "steps",
      "steps": [
        {
          "h": "a) read.csv",
          "body": "<p>Les grades.csv í gagnatöfluna <code>grade</code>.</p>",
          "p": 1
        },
        {
          "h": "b) Einhliða t-próf",
          "body": "<p>Einhliða t-próf á dálkinum <code>final</code>: \\(H_0:\\mu\\le 5{,}5\\) gegn \\(H_1:\\mu>5{,}5\\). Meðaltalið er 5,78, \\(t=1{,}88\\), df = 99 (n = 100), p = 0,032.</p><p>p &lt; 0,05: <b>H₀ hafnað</b> við 5%; meðaleinkunnin er marktækt yfir 5,5. Einhliða 95% bilið er (5,53; ∞).</p>",
          "p": 3
        }
      ],
      "examWeight": 4,
      "e": "",
      "paper": "J25",
      "r": true
    },
    {
      "id": "D25-1",
      "topic": "L01",
      "level": 2,
      "source": "old",
      "src": "Lokapróf desember 2025, dæmi 1 (vægi ekki gefið, um 5%)",
      "q": "Blíðlyndur litli fær að velja leikföng úr verðlaunakassa með 3 plastgormum, 5 skopparaboltum og 4 dótabílum. Hann skilar ekki leikföngum aftur í kassann.<ol type=\"a\"><li>Velji hann eitt leikfang af handahófi, hverjar eru líkurnar á að hann velji <u>ekki</u> dótabíl?</li><li>Á hversu marga vegu getur hann valið þrjú leikföng þannig að hann fái fyrst plastgorm, svo dótabíl og síðast dótabíl?</li></ol>",
      "type": "steps",
      "steps": [
        {
          "h": "a) Ekki dótabíll",
          "body": "\\[\\Pr(B^c)=\\frac{12-4}{12}=\\tfrac23\\approx 0{,}667\\]",
          "p": 1
        },
        {
          "h": "b) Röðuð val án skila",
          "body": "\\[3\\cdot 4\\cdot 3=36\\]<p>3 gormar í fyrsta val, 4 bílar í annað og 3 bílar eftir í það þriðja.</p><p class=\"trap\"><b>Gildra.</b> Röðin er gefin og ekki skilað: margfaldað, ekki C(n, k).</p>",
          "p": 2
        }
      ],
      "examWeight": 5,
      "e": "",
      "paper": "D25"
    },
    {
      "id": "D25-2",
      "topic": "L01",
      "level": 2,
      "source": "old",
      "src": "Lokapróf desember 2025, dæmi 2 (vægi ekki gefið, um 5%)",
      "q": "Einn pakki er valinn af handahófi. Pakkar koma frá tveimur dreifingarmiðstöðvum:<ul><li><b>Austurbær</b> með líkur 0,6; þar eru 70% pakkanna litlir.</li><li><b>Vesturbær</b> með líkur 0,4; þar eru 40% pakkanna litlir.</li></ul><ol type=\"a\"><li>Reiknið líkurnar á að valdi pakkinn sé lítill.</li><li>Að því gefnu að pakkinn sé lítill, hverjar eru líkurnar á að hann komi frá Austurbæ?</li></ol>",
      "type": "steps",
      "steps": [
        {
          "h": "a) Heildarlíkur",
          "body": "\\[\\Pr(L)=0{,}6\\cdot 0{,}7+0{,}4\\cdot 0{,}4=0{,}42+0{,}16=0{,}58\\]",
          "p": 1
        },
        {
          "h": "b) Bayes",
          "body": "\\[\\Pr(A\\mid L)=\\frac{0{,}42}{0{,}58}\\approx 0{,}724\\]",
          "p": 2
        }
      ],
      "examWeight": 5,
      "e": "",
      "paper": "D25"
    },
    {
      "id": "D25-3",
      "topic": "L02",
      "level": 2,
      "source": "old",
      "src": "Lokapróf desember 2025, dæmi 3 (vægi ekki gefið, um 5%)",
      "q": "Slembibreytan \\(X\\) hefur líkindamassafallið\\[P(X=k)=\\begin{cases}0{,}10 & \\text{ef } k=-4\\\\0{,}25 & \\text{ef } k=0\\\\0{,}15 & \\text{ef } k=6\\\\0{,}30 & \\text{ef } k=10\\\\0{,}20 & \\text{ef } k=1000\\\\0 & \\text{annars}\\end{cases}\\]<ol type=\"a\"><li>Finnið dreifingarfall \\(X\\).</li><li>Reiknið væntigildi \\(X\\).</li><li>Hverjar eru líkurnar \\(P(X\\ge 7)\\)?</li></ol>",
      "type": "steps",
      "steps": [
        {
          "h": "a) Dreifingarfall",
          "body": "\\[F(x)=\\begin{cases}0 & x<-4\\\\0{,}10 & -4\\le x<0\\\\0{,}35 & 0\\le x<6\\\\0{,}50 & 6\\le x<10\\\\0{,}80 & 10\\le x<1000\\\\1 & x\\ge 1000\\end{cases}\\]",
          "p": 2
        },
        {
          "h": "b) E[X]",
          "body": "\\[E[X]=-4(0{,}1)+0+6(0{,}15)+10(0{,}3)+1000(0{,}2)=203{,}5\\]<p>Eitt stórt gildi (1000) ræður væntigildinu.</p>",
          "p": 1
        },
        {
          "h": "c) P(X ≥ 7)",
          "body": "\\[P(X\\ge 7)=P(X=10)+P(X=1000)=0{,}5\\]",
          "p": 1
        }
      ],
      "examWeight": 5,
      "e": "",
      "paper": "D25"
    },
    {
      "id": "D25-4",
      "topic": "L04",
      "level": 2,
      "source": "old",
      "src": "Lokapróf desember 2025, dæmi 4 (vægi ekki gefið, um 10%)",
      "q": "Slembibreytan \\(Y\\) hefur þéttleikafallið \\[f(y)=\\begin{cases}\\tfrac65(y+y^2) & 0\\le y\\le 1\\\\0&\\text{annars}\\end{cases}\\]<ol type=\"a\"><li>Hvert er dreifingarfall \\(Y\\)?</li><li>Finnið væntigildi \\(Y\\).</li><li>Finnið dreifni \\(Y\\).</li><li>Finnið staðalfrávik \\(Y\\).</li><li>Hverjar eru líkurnar \\(P(0{,}5<Y<0{,}8)\\)?</li></ol>",
      "type": "steps",
      "steps": [
        {
          "h": "a) F(y)",
          "body": "\\[F(y)=\\tfrac65\\left(\\tfrac{y^2}{2}+\\tfrac{y^3}{3}\\right)=\\frac{3y^2+2y^3}{5}\\quad(0\\le y\\le 1)\\]<p>0 fyrir neðan, 1 fyrir ofan.</p>",
          "p": 2
        },
        {
          "h": "b) E[Y]",
          "body": "\\[E[Y]=\\tfrac65\\int_0^1(y^2+y^3)\\,dy=\\tfrac65\\cdot\\tfrac{7}{12}=0{,}7\\]",
          "p": 1
        },
        {
          "h": "c) Var[Y]",
          "body": "\\[E[Y^2]=\\tfrac65\\left(\\tfrac14+\\tfrac15\\right)=0{,}54,\\qquad \\operatorname{Var}[Y]=0{,}54-0{,}49=0{,}05\\]",
          "p": 2
        },
        {
          "h": "d) Staðalfrávik",
          "body": "\\[\\sigma=\\sqrt{0{,}05}\\approx 0{,}224\\]",
          "p": 1
        },
        {
          "h": "e) P(0,5 < Y < 0,8)",
          "body": "\\[F(0{,}8)-F(0{,}5)=\\frac{1{,}92+1{,}024}{5}-\\frac{0{,}75+0{,}25}{5}=0{,}5888-0{,}2=0{,}389\\]",
          "p": 1
        }
      ],
      "examWeight": 10,
      "e": "",
      "paper": "D25"
    },
    {
      "id": "D25-5",
      "topic": "L05",
      "level": 2,
      "source": "old",
      "src": "Lokapróf desember 2025, dæmi 5 (vægi ekki gefið, um 5%)",
      "q": "Biðtíminn \\(T\\) (í mínútum) eftir staðfestingu rafrænnar greiðslu er jafndreifður á bilinu [1, 5].<ol type=\"a\"><li>Hverjir eru stikar \\(T\\)?</li><li>Finnið \\(E[T]\\).</li><li>Finnið \\(\\operatorname{Var}[T]\\).</li><li>Hverjar eru líkurnar á að greiðsla staðfestist á 2 mínútum eða skemur?</li></ol>",
      "type": "steps",
      "steps": [
        {
          "h": "a) Stikar",
          "body": "\\[a=1,\\;b=5\\]",
          "p": 1
        },
        {
          "h": "b) E[T]",
          "body": "\\[E[T]=\\tfrac{a+b}{2}=3\\]",
          "p": 1
        },
        {
          "h": "c) Var[T]",
          "body": "\\[\\operatorname{Var}[T]=\\tfrac{(b-a)^2}{12}=\\tfrac{16}{12}=\\tfrac43\\approx 1{,}33\\]",
          "p": 1
        },
        {
          "h": "d) P(T ≤ 2)",
          "body": "\\[P(T\\le 2)=\\tfrac{2-1}{5-1}=0{,}25\\]",
          "p": 1
        }
      ],
      "examWeight": 5,
      "e": "",
      "paper": "D25"
    },
    {
      "id": "D25-6",
      "topic": "L05",
      "level": 2,
      "source": "old",
      "src": "Lokapróf desember 2025, dæmi 6 (vægi ekki gefið, um 10%)",
      "q": "Árlegur hagvöxtur \\(X\\) (í %) er normaldreifður með meðaltal 2% og staðalfrávik 1,5.<ol type=\"a\"><li>Hverjir eru stikar \\(X\\)?</li><li>Hverjar eru líkurnar á neikvæðum hagvexti, \\(P(X<0)\\)?</li><li>Hver er 5% versta sviðsmyndin, þ.e. mörk 5% neðra hlutfallsmarks?</li></ol>",
      "type": "steps",
      "steps": [
        {
          "h": "a) Stikar",
          "body": "\\[X\\sim N(\\mu=2,\\;\\sigma^2=1{,}5^2=2{,}25)\\]<p class=\"trap\"><b>Gildra.</b> Seinni stikinn í N(μ, σ²) er dreifnin; pnorm og qnorm taka staðalfrávikið.</p>",
          "p": 1
        },
        {
          "h": "b) P(X < 0)",
          "body": "\\[P(X<0)=\\Phi\\!\\left(\\frac{0-2}{1{,}5}\\right)=\\Phi(-1{,}33)\\approx 0{,}091\\]",
          "p": 2
        },
        {
          "h": "c) 5% hlutfallsmark",
          "body": "\\[x_{0{,}05}=\\mu-1{,}645\\,\\sigma=2-1{,}645\\cdot 1{,}5\\approx -0{,}47\\%\\]<p>Í R: <code>qnorm(0.05, 2, 1.5)</code>.</p>",
          "p": 2
        }
      ],
      "examWeight": 10,
      "e": "",
      "paper": "D25"
    },
    {
      "id": "D25-7",
      "topic": "L06",
      "level": 2,
      "source": "old",
      "src": "Lokapróf desember 2025, dæmi 7 (vægi ekki gefið, um 10%)",
      "q": "\\(X\\) og \\(Y\\) eru strjálar með samþéttleikafallið:<div class=\"scroll\"><table class=\"tt\"><thead><tr><th>\\(f(x,y)\\)</th><th>\\(y=0\\)</th><th>\\(y=1\\)</th><th>\\(y=2\\)</th></tr></thead><tbody><tr><th>\\(x=0\\)</th><td class=\"mono\">0,05</td><td class=\"mono\">0,15</td><td class=\"mono\">0</td></tr><tr><th>\\(x=1\\)</th><td class=\"mono\">0,3</td><td class=\"mono\">0</td><td class=\"mono\">0,1</td></tr><tr><th>\\(x=2\\)</th><td class=\"mono\">0,15</td><td class=\"mono\">0,1</td><td class=\"mono\">0,15</td></tr></tbody></table></div><ol type=\"a\"><li>Finnið samdreifingarfallið \\(F(x,y)\\) á töfluformi.</li><li>Finnið \\(P(X\\le 1 \\text{ og } Y\\ge 1)\\).</li><li>Finnið jaðarþéttleikaföllin \\(f_X(x)\\) og \\(f_Y(y)\\).</li></ol>",
      "type": "steps",
      "steps": [
        {
          "h": "a) F(x, y)",
          "body": "<div class=\"scroll\"><table class=\"tt\"><thead><tr><th>\\(F(x,y)\\)</th><th>\\(y=0\\)</th><th>\\(y=1\\)</th><th>\\(y=2\\)</th></tr></thead><tbody><tr><th>\\(x=0\\)</th><td class=\"mono\">0,05</td><td class=\"mono\">0,20</td><td class=\"mono\">0,20</td></tr><tr><th>\\(x=1\\)</th><td class=\"mono\">0,35</td><td class=\"mono\">0,50</td><td class=\"mono\">0,60</td></tr><tr><th>\\(x=2\\)</th><td class=\"mono\">0,50</td><td class=\"mono\">0,75</td><td class=\"mono\">1</td></tr></tbody></table></div>",
          "p": 4
        },
        {
          "h": "b) P(X ≤ 1, Y ≥ 1)",
          "body": "\\[0{,}15+0+0+0{,}1=0{,}25\\]",
          "p": 1
        },
        {
          "h": "c) Jaðardreifingar",
          "body": "\\[f_X:\\;0{,}2,\\;0{,}4,\\;0{,}4\\qquad f_Y:\\;0{,}5,\\;0{,}25,\\;0{,}25\\]",
          "p": 2
        }
      ],
      "examWeight": 10,
      "e": "",
      "paper": "D25"
    },
    {
      "id": "D25-8",
      "topic": "L06",
      "level": 2,
      "source": "old",
      "src": "Lokapróf desember 2025, dæmi 8 (vægi ekki gefið, um 10%)",
      "q": "\\([X,Y]\\) hefur samþéttleikafallið \\[f(x,y)=\\begin{cases}\\tfrac14(x+2y) & 0<x<2,\\;0<y<1\\\\0&\\text{annars}\\end{cases}\\]<ol type=\"a\"><li>Finnið jaðarþéttleikaföllin \\(f_X(x)\\) og \\(f_Y(y)\\).</li><li>Finnið \\(f_{X|Y}(x\\mid y)\\).</li><li>Reiknið \\(\\operatorname{Cov}[X,Y]\\). Gefið: \\(E[XY]=\\tfrac23\\).</li><li>Hvað segir c) um samband breytanna? Eru þær háðar eða óháðar?</li></ol>",
      "type": "steps",
      "steps": [
        {
          "h": "a) Jaðarþéttleikar",
          "body": "\\[f_X(x)=\\int_0^1\\tfrac14(x+2y)\\,dy=\\tfrac{x+1}{4},\\;0<x<2\\qquad f_Y(y)=\\int_0^2\\tfrac14(x+2y)\\,dx=\\tfrac{1+2y}{2},\\;0<y<1\\]",
          "p": 2
        },
        {
          "h": "b) f(x | y)",
          "body": "\\[f_{X|Y}(x\\mid y)=\\frac{(x+2y)/4}{(1+2y)/2}=\\frac{x+2y}{2(1+2y)},\\quad 0<x<2\\]",
          "p": 2
        },
        {
          "h": "c) Cov[X, Y]",
          "body": "\\[E[X]=\\int_0^2\\tfrac{x(x+1)}{4}dx=\\tfrac76,\\qquad E[Y]=\\int_0^1\\tfrac{y(1+2y)}{2}dy=\\tfrac{7}{12}\\]\\[\\operatorname{Cov}[X,Y]=\\tfrac23-\\tfrac76\\cdot\\tfrac7{12}=\\tfrac{48-49}{72}=-\\tfrac{1}{72}\\approx -0{,}0139\\]",
          "p": 3
        },
        {
          "h": "d) Háðar",
          "body": "<p><b>Háðar:</b> \\(\\operatorname{Cov}\\ne 0\\) þýðir að breyturnar eru háðar (veikt neikvætt samband). Það sést líka á því að \\(f_{X|Y}\\) fer eftir y.</p><p class=\"trap\"><b>Gildra.</b> Cov ≠ 0 ⇒ háðar, en Cov = 0 sannar ekki óhæði.</p>",
          "p": 1
        }
      ],
      "examWeight": 10,
      "e": "",
      "paper": "D25"
    },
    {
      "id": "D25-9",
      "topic": "L09",
      "level": 2,
      "source": "old",
      "src": "Lokapróf desember 2025, dæmi 9 (vægi ekki gefið, um 5%)",
      "q": "Mánaðarleg rafmagnseyðsla fjögurra heimila (í þúsundum króna):<p class=\"mono\" style=\"text-align:center\">15 &nbsp; 22 &nbsp; 20 &nbsp; 19</p><ol type=\"a\"><li>Reiknið meðaltal úrtaksins.</li><li>Reiknið dreifni úrtaksins.</li><li>Reiknið staðalfrávik úrtaksins.</li><li>Reiknið 90% tvíhliða öryggismörk fyrir meðaltalið, að því gefnu að eyðslan sé normaldreifð.</li></ol>",
      "type": "steps",
      "steps": [
        {
          "h": "a) Meðaltal",
          "body": "\\[\\bar x=\\tfrac{76}{4}=19\\]",
          "p": 1
        },
        {
          "h": "b) Dreifni",
          "body": "<p>Frávik: −4, 3, 1, 0.</p>\\[s^2=\\frac{16+9+1+0}{3}=\\frac{26}{3}\\approx 8{,}67\\]",
          "p": 1
        },
        {
          "h": "c) Staðalfrávik",
          "body": "\\[s\\approx 2{,}944\\]",
          "p": 1
        },
        {
          "h": "d) 90% öryggisbil",
          "body": "\\[19\\pm t_{3;\\,0{,}05}\\frac{2{,}944}{\\sqrt4}=19\\pm 2{,}353\\cdot 1{,}472=19\\pm 3{,}46\\;\\Rightarrow\\;(15{,}54;\\;22{,}46)\\]",
          "p": 2
        }
      ],
      "examWeight": 5,
      "e": "",
      "paper": "D25"
    },
    {
      "id": "D25-10",
      "topic": "L09",
      "level": 2,
      "source": "old",
      "src": "Lokapróf desember 2025, dæmi 10 (vægi ekki gefið, um 15%)",
      "q": "Óþekkt barna (á kvarðanum 1–5) í tveimur könnunum:<div class=\"scroll\"><table class=\"tt\"><thead><tr><th></th><th>Desember 1980</th><th>Desember 2020</th></tr></thead><tbody><tr><th>Meðalóþekkt</th><td class=\"mono\">3,5</td><td class=\"mono\">3</td></tr><tr><th>Dreifni óþekktar</th><td class=\"mono\">1,1</td><td class=\"mono\">0,5</td></tr><tr><th>Fjöldi barna</th><td class=\"mono\">19</td><td class=\"mono\">26</td></tr></tbody></table></div><ol type=\"a\"><li>Prófið hvort meðalóþekkt barna í desember 1980 sé hærri en 3 miðað við 5% marktækni.</li><li>Prófið hvort börn 1980 hafi verið óþekkari en börn 2020 miðað við 10% marktækni.</li><li>Hvernig túlkið þið niðurstöðurnar? Hvaða tilgátum byggja prófin á? Er fullyrðing vikublaðsins um að unga kynslóðin í dag hagi sér verr rétt?</li></ol>",
      "type": "steps",
      "steps": [
        {
          "h": "a) Einhliða próf",
          "body": "<p>\\(H_0:\\mu\\le 3\\) gegn \\(H_1:\\mu>3\\).</p>\\[T=\\frac{3{,}5-3}{\\sqrt{1{,}1/19}}=\\frac{0{,}5}{0{,}2406}\\approx 2{,}08>t_{18;\\,0{,}05}=1{,}734\\]<p><b>H₀ hafnað</b>: börn voru að jafnaði óþekk 1980.</p>",
          "p": 5
        },
        {
          "h": "b) Welch-próf (einhliða)",
          "body": "\\[T=\\frac{3{,}5-3}{\\sqrt{\\frac{1{,}1}{19}+\\frac{0{,}5}{26}}}=\\frac{0{,}5}{0{,}2777}\\approx 1{,}80\\]<p>Welch-frígráður ≈ 29,6, \\(t_{0{,}10}\\approx 1{,}31\\). \\(1{,}80>1{,}31\\): <b>H₀ hafnað</b>; börn 1980 voru marktækt óþekkari.</p>",
          "p": 5
        },
        {
          "h": "c) Túlkun",
          "body": "<p>Gögnin styðja ekki fullyrðinguna; ef eitthvað er voru börnin óþekkari 1980. Prófin gera ráð fyrir óháðum slembiúrtökum og nálgað normaldreifðum meðaltölum; Welch gerir ekki ráð fyrir jafnri dreifni.</p>",
          "p": 5
        }
      ],
      "examWeight": 15,
      "e": "",
      "paper": "D25"
    },
    {
      "id": "D25-11",
      "topic": "L08",
      "level": 2,
      "source": "old",
      "src": "Lokapróf desember 2025, dæmi 11 (vægi ekki gefið, um 10%)",
      "q": "Fjöldi farþega í strætó á dag (Y) og bensínverð (X, kr./l):<div class=\"scroll\"><table class=\"tt\"><thead><tr><th>Athugun</th><th>1</th><th>2</th><th>3</th></tr></thead><tbody><tr><th>Farþegar (Y)</th><td class=\"mono\">3200</td><td class=\"mono\">3600</td><td class=\"mono\">3400</td></tr><tr><th>Bensínverð (X)</th><td class=\"mono\">260</td><td class=\"mono\">280</td><td class=\"mono\">270</td></tr></tbody></table></div><p>Gert er ráð fyrir línulegu sambandi \\(Y=\\alpha+\\beta X\\).</p><ol type=\"a\"><li>Metið \\(\\hat\\alpha\\) og \\(\\hat\\beta\\) með aðferð minnstu kvaðrata.</li><li>Hver er spá líkansins þegar bensínverð er 330 kr./l?</li><li>Gefið er \\(\\operatorname{Var}(\\hat\\beta)=42\\). Prófið \\(H_0:\\beta=0\\) gegn \\(H_1:\\beta\\ne 0\\) við 5% marktækni. Frígráður eru n − 2.</li><li>Hvað segir matið á β um sambandið?</li></ol>",
      "type": "steps",
      "steps": [
        {
          "h": "a) Minnstu kvaðröt",
          "body": "<p>\\(\\bar x=270\\), \\(\\bar y=3400\\). Frávik x: −10, 10, 0; frávik y: −200, 200, 0.</p>\\[\\hat\\beta=\\frac{\\sum(x_i-\\bar x)(y_i-\\bar y)}{\\sum(x_i-\\bar x)^2}=\\frac{4000}{200}=20,\\qquad \\hat\\alpha=3400-20\\cdot 270=-2000\\]",
          "p": 4
        },
        {
          "h": "b) Spá",
          "body": "\\[\\hat y=-2000+20\\cdot 330=4600\\]",
          "p": 1
        },
        {
          "h": "c) t-próf á β",
          "body": "\\[T=\\frac{20}{\\sqrt{42}}\\approx 3{,}09,\\qquad t_{1;\\,0{,}025}=12{,}706\\]<p>\\(|T|<12{,}7\\): <b>ekki hægt að hafna</b> \\(H_0\\).</p><p class=\"trap\"><b>Gildra.</b> n − 2 = 1 frígráða gefur mjög hátt gagnrýnigildi.</p>",
          "p": 3
        },
        {
          "h": "d) Túlkun",
          "body": "<p>Hver króna í bensínverði tengist 20 fleiri farþegum á dag, en með þremur athugunum er það ekki marktækt; gögnin duga ekki til að álykta um sambandið.</p>",
          "p": 2
        }
      ],
      "examWeight": 10,
      "e": "",
      "paper": "D25"
    },
    {
      "id": "D25-12",
      "topic": "L00",
      "level": 2,
      "source": "old",
      "src": "Lokapróf desember 2025, dæmi 12 (vægi ekki gefið, um 2%)",
      "q": "Grunnatriði í R:<pre class=\"code\">x &lt;- 20\ny &lt;- c(\"a\", \"b\", \"c\", \"2\")\n\nz_1 &lt;- y[4]\nz_2 &lt;- x^2</pre><ol type=\"a\"><li>Hvert er gildið í <code>z_1</code>?</li><li>Hvert er gildið í <code>z_2</code>?</li></ol>",
      "type": "steps",
      "steps": [
        {
          "h": "a) z_1",
          "body": "<p>Strengurinn <code>\"2\"</code>, ekki talan 2: vigur í R hefur eitt tag, og hér er það character.</p>",
          "p": 1
        },
        {
          "h": "b) z_2",
          "body": "<p><code>400</code></p>",
          "p": 1
        }
      ],
      "examWeight": 2,
      "e": "",
      "paper": "D25",
      "r": true
    },
    {
      "id": "D25-13",
      "topic": "L00",
      "level": 2,
      "source": "old",
      "src": "Lokapróf desember 2025, dæmi 13 (vægi ekki gefið, um 2%)",
      "q": "Pakkar og stöðluð föll:<pre class=\"code\">library(wooldrige)\n\ndata(wage1)\n\nreg &lt;- lm(wage ~ educ, data = wage1)\nsummary(reg)</pre><ol type=\"a\"><li>Hvað gerir <code>library(wooldrige)</code> (skipunin sjálf)?</li><li>Hvað gerir <code>lm(wage ~ educ, data = wage1)</code>?</li><li>Hvað gerir <code>summary(reg)</code>?</li></ol>",
      "type": "steps",
      "steps": [
        {
          "h": "a) library",
          "body": "<p>Hleður pakka svo föll hans og gögn verði aðgengileg. (Pakkinn heitir raunar <code>wooldridge</code>; með stafsetningunni á prófinu kæmi villa.)</p>",
          "p": 1
        },
        {
          "h": "b) lm",
          "body": "<p>Metur línulegt aðhvarf (minnstu kvaðröt) á laun (wage) eftir menntun (educ) í gögnunum wage1 og geymir líkanið í <code>reg</code>.</p>",
          "p": 1
        },
        {
          "h": "c) summary",
          "body": "<p>Birtir niðurstöður líkansins: stuðla, staðalvillur, t-gildi, p-gildi og R².</p>",
          "p": 1
        }
      ],
      "examWeight": 2,
      "e": "",
      "paper": "D25",
      "r": true
    },
    {
      "id": "D25-14",
      "topic": "L00",
      "level": 2,
      "source": "old",
      "src": "Lokapróf desember 2025, dæmi 14 (vægi ekki gefið, um 2%)",
      "q": "Skilgreiningar falla:<pre class=\"code\">vigravinnsla &lt;- function(v) {\n    if (length(v) >= 3) {\n        utkoma &lt;- mean(v)\n    } else {\n        utkoma &lt;- sum(v)\n    }\n    return(utkoma)\n}</pre><ol type=\"a\"><li>Hvaða gildi birtir <code>print(vigravinnsla(c(0, 20)))</code>?</li><li>Hvaða gildi birtir <code>print(vigravinnsla(c(1, 1, 1, 1)))</code>?</li></ol>",
      "type": "steps",
      "steps": [
        {
          "h": "a) Tvö stök",
          "body": "<p>Lengd 2 &lt; 3, svo summan: <code>20</code>.</p>",
          "p": 1
        },
        {
          "h": "b) Fjögur stök",
          "body": "<p>Lengd 4 ≥ 3, svo meðaltalið: <code>1</code>.</p>",
          "p": 1
        }
      ],
      "examWeight": 2,
      "e": "",
      "paper": "D25",
      "r": true
    },
    {
      "id": "D25-15",
      "topic": "L00",
      "level": 2,
      "source": "old",
      "src": "Lokapróf desember 2025, dæmi 15 (vægi ekki gefið, um 4%)",
      "q": "Tölfræðipróf og innlestur gagna:<pre class=\"code\">library(tseries)\nhp &lt;- read.csv(\"house_price.csv\")\n\nres &lt;- jarque.bera.test(hp$price)\nprint(res)</pre><p>Úttakið:</p><pre class=\"code\">Jarque Bera Test\n\ndata:  hp$price\nX-squared = 165.28, df = 2, p-value &lt; 2.2e-16</pre><ol type=\"a\"><li>Hvað gerir skipunin í línu 2?</li><li>Hvað gerir <code>jarque.bera.test(hp$price)</code> og hvað má lesa úr niðurstöðunum?</li></ol>",
      "type": "steps",
      "steps": [
        {
          "h": "a) read.csv",
          "body": "<p>Les house_price.csv í gagnatöfluna <code>hp</code>.</p>",
          "p": 1
        },
        {
          "h": "b) Jarque–Bera",
          "body": "<p>Prófar hvort verðið sé normaldreift út frá skeifni og ris: \\(H_0\\): normaldreifing. Undir \\(H_0\\) er JB \\(\\sim\\chi^2_2\\). JB = 165,3 og p &lt; 2,2·10⁻¹⁶: <b>H₀ hafnað</b>; húsaverð er ekki normaldreift.</p>",
          "p": 3
        }
      ],
      "examWeight": 4,
      "e": "",
      "paper": "D25",
      "r": true
    },
    {
      "id": "J26-1",
      "topic": "L01",
      "level": 2,
      "source": "old",
      "src": "Endurtökupróf janúar 2026, dæmi 1 (vægi ekki gefið, um 5%)",
      "q": "Í Félagi þorpara eru 5 ræningjar (2 bankaræningjar og 3 sjóræningjar) og 7 þjófar (3 gullþjófar og 4 vasaþjófar).<ol type=\"a\"><li>Ef allir eru jafnlíklegir til að verða þorpari ársins, hverjar eru líkurnar á að hann sé <u>ekki</u> sjóræningi?</li><li>Skipa á 4 manna nefnd með 2 ræningjum og 2 þjófum. Á hversu marga vegu er það hægt?</li></ol>",
      "type": "steps",
      "steps": [
        {
          "h": "a) Ekki sjóræningi",
          "body": "\\[1-\\tfrac{3}{12}=\\tfrac{9}{12}=0{,}75\\]",
          "p": 1
        },
        {
          "h": "b) Nefndin",
          "body": "\\[\\binom52\\binom72=10\\cdot 21=210\\]",
          "p": 2
        }
      ],
      "examWeight": 5,
      "e": "",
      "paper": "J26"
    },
    {
      "id": "J26-2",
      "topic": "L01",
      "level": 2,
      "source": "old",
      "src": "Endurtökupróf janúar 2026, dæmi 2 (vægi ekki gefið, um 5%)",
      "q": "75% kortafærslna eru einstaklingsfærslur og 25% fyrirtækjafærslur. Kerfið merkir 2% einstaklingsfærslna og 7% fyrirtækjafærslna sem grunsamlegar. Ein færsla er valin af handahófi.<ol type=\"a\"><li>Reiknið líkurnar á að færslan hafi verið merkt grunsamleg.</li><li>Að því gefnu að hún hafi verið merkt, hverjar eru líkurnar á að hún sé fyrirtækjafærsla?</li></ol>",
      "type": "steps",
      "steps": [
        {
          "h": "a) Heildarlíkur",
          "body": "\\[\\Pr(G)=0{,}75\\cdot 0{,}02+0{,}25\\cdot 0{,}07=0{,}015+0{,}0175=0{,}0325\\]",
          "p": 1
        },
        {
          "h": "b) Bayes",
          "body": "\\[\\Pr(F\\mid G)=\\frac{0{,}0175}{0{,}0325}\\approx 0{,}538\\]",
          "p": 2
        }
      ],
      "examWeight": 5,
      "e": "",
      "paper": "J26"
    },
    {
      "id": "J26-3",
      "topic": "L02",
      "level": 2,
      "source": "old",
      "src": "Endurtökupróf janúar 2026, dæmi 3 (vægi ekki gefið, um 5%)",
      "q": "Slembibreytan \\(X\\) hefur líkindamassafallið\\[P(X=k)=\\begin{cases}0{,}5 & \\text{ef } k=-4\\\\0{,}1 & \\text{ef } k=-2\\\\0{,}1 & \\text{ef } k=1\\\\0{,}2 & \\text{ef } k=3\\\\0{,}1 & \\text{ef } k=8\\\\0 & \\text{annars}\\end{cases}\\]<ol type=\"a\"><li>Finnið dreifingarfall \\(X\\).</li><li>Reiknið væntigildi \\(X\\).</li><li>Hverjar eru líkurnar \\(P(X>1)\\)?</li></ol>",
      "type": "steps",
      "steps": [
        {
          "h": "a) Dreifingarfall",
          "body": "\\[F(x)=\\begin{cases}0 & x<-4\\\\0{,}5 & -4\\le x<-2\\\\0{,}6 & -2\\le x<1\\\\0{,}7 & 1\\le x<3\\\\0{,}9 & 3\\le x<8\\\\1 & x\\ge 8\\end{cases}\\]",
          "p": 2
        },
        {
          "h": "b) E[X]",
          "body": "\\[E[X]=-4(0{,}5)-2(0{,}1)+1(0{,}1)+3(0{,}2)+8(0{,}1)=-0{,}7\\]",
          "p": 1
        },
        {
          "h": "c) P(X > 1)",
          "body": "\\[P(X>1)=1-F(1)=0{,}3\\]<p class=\"trap\"><b>Gildra.</b> X > 1 útilokar X = 1.</p>",
          "p": 1
        }
      ],
      "examWeight": 5,
      "e": "",
      "paper": "J26"
    },
    {
      "id": "J26-4",
      "topic": "L04",
      "level": 2,
      "source": "old",
      "src": "Endurtökupróf janúar 2026, dæmi 4 (vægi ekki gefið, um 10%)",
      "q": "Slembibreytan \\(Y\\) hefur þéttleikafallið \\[f(y)=\\begin{cases}2(1-y) & 0\\le y\\le 1\\\\0&\\text{annars}\\end{cases}\\]<ol type=\"a\"><li>Hvert er dreifingarfall \\(Y\\)?</li><li>Finnið væntigildi \\(Y\\).</li><li>Finnið dreifni \\(Y\\).</li><li>Finnið staðalfrávik \\(Y\\).</li><li>Hverjar eru líkurnar \\(P(0{,}1<Y<0{,}2)\\)?</li></ol>",
      "type": "steps",
      "steps": [
        {
          "h": "a) F(y)",
          "body": "\\[F(y)=\\int_0^y 2(1-t)\\,dt=2y-y^2\\quad(0\\le y\\le 1)\\]<p>0 fyrir neðan, 1 fyrir ofan.</p>",
          "p": 2
        },
        {
          "h": "b) E[Y]",
          "body": "\\[E[Y]=\\int_0^1 2y(1-y)\\,dy=2\\left(\\tfrac12-\\tfrac13\\right)=\\tfrac13\\]",
          "p": 1
        },
        {
          "h": "c) Var[Y]",
          "body": "\\[E[Y^2]=2\\left(\\tfrac13-\\tfrac14\\right)=\\tfrac16,\\qquad\\operatorname{Var}[Y]=\\tfrac16-\\tfrac19=\\tfrac{1}{18}\\approx 0{,}0556\\]",
          "p": 2
        },
        {
          "h": "d) Staðalfrávik",
          "body": "\\[\\sigma=\\sqrt{1/18}\\approx 0{,}236\\]",
          "p": 1
        },
        {
          "h": "e) P(0,1 < Y < 0,2)",
          "body": "\\[F(0{,}2)-F(0{,}1)=0{,}36-0{,}19=0{,}17\\]",
          "p": 1
        }
      ],
      "examWeight": 10,
      "e": "",
      "paper": "J26"
    },
    {
      "id": "J26-5",
      "topic": "L03",
      "level": 2,
      "source": "old",
      "src": "Endurtökupróf janúar 2026, dæmi 5 (vægi ekki gefið, um 5%)",
      "q": "Líkurnar á að einstaklingur í áskrift mæti í ræktina einu sinni eða oftar í gefnum mánuði eru 0,4. \\(X\\) er fjöldi mánaða af 12 þar sem hann mætir og er tvíkostadreifð.<ol type=\"a\"><li>Hverjir eru stikar \\(X\\)?</li><li>Finnið væntigildi \\(X\\).</li><li>Finnið dreifni \\(X\\).</li><li>Hverjar eru líkurnar á að hann mæti einu sinni eða tvisvar á ári?</li></ol>",
      "type": "steps",
      "steps": [
        {
          "h": "a) Stikar",
          "body": "\\[X\\sim\\text{Bin}(n=12,\\;p=0{,}4)\\]",
          "p": 1
        },
        {
          "h": "b) E[X]",
          "body": "\\[E[X]=12\\cdot 0{,}4=4{,}8\\]",
          "p": 1
        },
        {
          "h": "c) Var[X]",
          "body": "\\[\\operatorname{Var}[X]=12\\cdot 0{,}4\\cdot 0{,}6=2{,}88\\]",
          "p": 1
        },
        {
          "h": "d) P(X = 1 eða 2)",
          "body": "\\[12(0{,}4)(0{,}6)^{11}+\\tbinom{12}{2}(0{,}4)^2(0{,}6)^{10}\\approx 0{,}0174+0{,}0639=0{,}0813\\]<p>Í R: <code>sum(dbinom(1:2, 12, 0.4))</code>.</p>",
          "p": 2
        }
      ],
      "examWeight": 5,
      "e": "",
      "paper": "J26"
    },
    {
      "id": "J26-6",
      "topic": "L05",
      "level": 2,
      "source": "old",
      "src": "Endurtökupróf janúar 2026, dæmi 6 (vægi ekki gefið, um 10%)",
      "q": "Áhrif tveggja <u>óháðra</u> aðgerða á verðbólgu: \\(X\\) er normaldreifð með meðaltal 0,6 og staðalfrávik 0,4; \\(Y\\) er normaldreifð með meðaltal −0,3 og staðalfrávik 0,5.<ol type=\"a\"><li>Hverjir eru stikar \\(X\\) og \\(Y\\)?</li><li>Hverjar eru líkurnar \\(P(X>0)\\)?</li><li>Látum \\(I=X+Y\\). Hverjar eru líkurnar \\(P(I>0{,}5)\\)?</li></ol>",
      "type": "steps",
      "steps": [
        {
          "h": "a) Stikar",
          "body": "\\[X\\sim N(0{,}6;\\;0{,}4^2),\\qquad Y\\sim N(-0{,}3;\\;0{,}5^2)\\]",
          "p": 1
        },
        {
          "h": "b) P(X > 0)",
          "body": "\\[P(X>0)=1-\\Phi\\!\\left(\\frac{0-0{,}6}{0{,}4}\\right)=\\Phi(1{,}5)\\approx 0{,}933\\]",
          "p": 1
        },
        {
          "h": "c) Summa óháðra",
          "body": "\\[I\\sim N(0{,}6-0{,}3;\\;0{,}16+0{,}25)=N(0{,}3;\\;0{,}41),\\quad \\sigma_I\\approx 0{,}640\\]\\[P(I>0{,}5)=1-\\Phi\\!\\left(\\frac{0{,}2}{0{,}640}\\right)=1-\\Phi(0{,}31)\\approx 0{,}377\\]<p class=\"trap\"><b>Gildra.</b> Dreifnirnar leggjast saman, ekki staðalfrávikin: σ_I ≠ 0,4 + 0,5.</p>",
          "p": 3
        }
      ],
      "examWeight": 10,
      "e": "",
      "paper": "J26"
    },
    {
      "id": "J26-7",
      "topic": "L06",
      "level": 2,
      "source": "old",
      "src": "Endurtökupróf janúar 2026, dæmi 7 (vægi ekki gefið, um 10%)",
      "q": "\\(X\\) og \\(Y\\) eru strjálar með samþéttleikafallið:<div class=\"scroll\"><table class=\"tt\"><thead><tr><th>\\(f(x,y)\\)</th><th>\\(y=0\\)</th><th>\\(y=1\\)</th></tr></thead><tbody><tr><th>\\(x=-1\\)</th><td class=\"mono\">0,10</td><td class=\"mono\">0,20</td></tr><tr><th>\\(x=0\\)</th><td class=\"mono\">0,15</td><td class=\"mono\">0,15</td></tr><tr><th>\\(x=1\\)</th><td class=\"mono\">0,10</td><td class=\"mono\">0,30</td></tr></tbody></table></div><ol type=\"a\"><li>Finnið samdreifingarfallið \\(F(x,y)\\) á töfluformi.</li><li>Finnið \\(P(X\\le 0 \\text{ og } Y=1)\\).</li><li>Finnið jaðarþéttleikaföllin \\(f_X(x)\\) og \\(f_Y(y)\\).</li></ol>",
      "type": "steps",
      "steps": [
        {
          "h": "a) F(x, y)",
          "body": "<div class=\"scroll\"><table class=\"tt\"><thead><tr><th>\\(F(x,y)\\)</th><th>\\(y=0\\)</th><th>\\(y=1\\)</th></tr></thead><tbody><tr><th>\\(x=-1\\)</th><td class=\"mono\">0,10</td><td class=\"mono\">0,30</td></tr><tr><th>\\(x=0\\)</th><td class=\"mono\">0,25</td><td class=\"mono\">0,60</td></tr><tr><th>\\(x=1\\)</th><td class=\"mono\">0,35</td><td class=\"mono\">1</td></tr></tbody></table></div>",
          "p": 4
        },
        {
          "h": "b) P(X ≤ 0, Y = 1)",
          "body": "\\[0{,}20+0{,}15=0{,}35\\]",
          "p": 1
        },
        {
          "h": "c) Jaðardreifingar",
          "body": "\\[f_X:\\;0{,}3,\\;0{,}3,\\;0{,}4\\qquad f_Y:\\;0{,}35,\\;0{,}65\\]",
          "p": 2
        }
      ],
      "examWeight": 10,
      "e": "",
      "paper": "J26"
    },
    {
      "id": "J26-8",
      "topic": "L06",
      "level": 2,
      "source": "old",
      "src": "Endurtökupróf janúar 2026, dæmi 8 (vægi ekki gefið, um 10%)",
      "q": "\\([X,Y]\\) hefur samþéttleikafallið \\[f(x,y)=\\begin{cases}\\tfrac14xy & 0<x<2,\\;0<y<2\\\\0&\\text{annars}\\end{cases}\\]<ol type=\"a\"><li>Finnið jaðarþéttleikaföllin \\(f_X(x)\\) og \\(f_Y(y)\\).</li><li>Finnið \\(f_{X|Y}(x\\mid y)\\).</li><li>Reiknið \\(\\operatorname{Cov}[X,Y]\\). Gefið: \\(E[XY]=\\tfrac{16}{9}\\).</li><li>Eru \\(X\\) og \\(Y\\) háðar eða óháðar?</li></ol>",
      "type": "steps",
      "steps": [
        {
          "h": "a) Jaðarþéttleikar",
          "body": "\\[f_X(x)=\\int_0^2\\tfrac14xy\\,dy=\\tfrac x2,\\;0<x<2,\\qquad f_Y(y)=\\tfrac y2,\\;0<y<2\\]",
          "p": 2
        },
        {
          "h": "b) f(x | y)",
          "body": "\\[f_{X|Y}(x\\mid y)=\\frac{xy/4}{y/2}=\\frac x2,\\quad 0<x<2\\]",
          "p": 2
        },
        {
          "h": "c) Cov[X, Y]",
          "body": "\\[E[X]=E[Y]=\\int_0^2\\tfrac{x^2}{2}dx=\\tfrac43,\\qquad\\operatorname{Cov}[X,Y]=\\tfrac{16}{9}-\\tfrac43\\cdot\\tfrac43=0\\]",
          "p": 3
        },
        {
          "h": "d) Óháðar",
          "body": "<p><b>Óháðar:</b> \\(f(x,y)=\\tfrac x2\\cdot\\tfrac y2=f_X(x)f_Y(y)\\) og \\(f_{X|Y}=f_X\\). Cov = 0 samræmist því.</p><p class=\"trap\"><b>Gildra.</b> Cov = 0 eitt og sér sannar ekki óhæði; rökin eru þáttunin.</p>",
          "p": 1
        }
      ],
      "examWeight": 10,
      "e": "",
      "paper": "J26"
    },
    {
      "id": "J26-9",
      "topic": "L09",
      "level": 2,
      "source": "old",
      "src": "Endurtökupróf janúar 2026, dæmi 9 (vægi ekki gefið, um 5%)",
      "q": "Mánaðarlegt leiguverð úr fjórum leigusamningum (í þúsundum króna):<p class=\"mono\" style=\"text-align:center\">230 &nbsp; 160 &nbsp; 170 &nbsp; 120</p><ol type=\"a\"><li>Reiknið meðaltal úrtaksins.</li><li>Reiknið dreifni úrtaksins.</li><li>Reiknið staðalfrávik úrtaksins.</li><li>Reiknið 95% tvíhliða öryggismörk fyrir meðalleiguverð, að því gefnu að það sé normaldreift.</li></ol>",
      "type": "steps",
      "steps": [
        {
          "h": "a) Meðaltal",
          "body": "\\[\\bar x=\\tfrac{680}{4}=170\\]",
          "p": 1
        },
        {
          "h": "b) Dreifni",
          "body": "<p>Frávik: 60, −10, 0, −50.</p>\\[s^2=\\frac{3600+100+0+2500}{3}=\\frac{6200}{3}\\approx 2066{,}7\\]",
          "p": 1
        },
        {
          "h": "c) Staðalfrávik",
          "body": "\\[s\\approx 45{,}46\\]",
          "p": 1
        },
        {
          "h": "d) 95% öryggisbil",
          "body": "\\[170\\pm t_{3;\\,0{,}025}\\frac{45{,}46}{2}=170\\pm 3{,}182\\cdot 22{,}73=170\\pm 72{,}3\\;\\Rightarrow\\;(97{,}7;\\;242{,}3)\\]",
          "p": 2
        }
      ],
      "examWeight": 5,
      "e": "",
      "paper": "J26"
    },
    {
      "id": "J26-10",
      "topic": "L09",
      "level": 2,
      "source": "old",
      "src": "Endurtökupróf janúar 2026, dæmi 10 (vægi ekki gefið, um 15%)",
      "q": "Hagnaður fjölskyldufyrirtækis (m.kr.) fyrir og eftir endurskipulagningu:<div class=\"scroll\"><table class=\"tt\"><thead><tr><th></th><th>Fyrir</th><th>Eftir</th></tr></thead><tbody><tr><th>Meðalhagnaður</th><td class=\"mono\">4,2</td><td class=\"mono\">3,1</td></tr><tr><th>Dreifni hagnaðar</th><td class=\"mono\">1,6</td><td class=\"mono\">1,2</td></tr><tr><th>Fjöldi ára</th><td class=\"mono\">22</td><td class=\"mono\">10</td></tr></tbody></table></div><ol type=\"a\"><li>Prófið við 10% marktækni hvort fyrirtækið hafi að jafnaði skilað hagnaði fyrir endurskipulagninguna (meðaltal hærra en 0).</li><li>Prófið við 5% marktækni hvort meðalhagnaður hafi aukist eftir endurskipulagninguna.</li><li>Hvernig túlkið þið niðurstöðurnar? Skiluðu breytingarnar árangri?</li></ol>",
      "type": "steps",
      "steps": [
        {
          "h": "a) Einhliða próf",
          "body": "\\[T=\\frac{4{,}2-0}{\\sqrt{1{,}6/22}}=\\frac{4{,}2}{0{,}270}\\approx 15{,}6>t_{21;\\,0{,}10}=1{,}323\\]<p><b>H₀ hafnað</b>: hagnaðurinn var jákvæður.</p>",
          "p": 5
        },
        {
          "h": "b) Welch-próf (einhliða)",
          "body": "<p>\\(H_0:\\mu_{\\text{eftir}}\\le\\mu_{\\text{fyrir}}\\) gegn \\(H_1:\\mu_{\\text{eftir}}>\\mu_{\\text{fyrir}}\\).</p>\\[T=\\frac{3{,}1-4{,}2}{\\sqrt{\\frac{1{,}2}{10}+\\frac{1{,}6}{22}}}=\\frac{-1{,}1}{0{,}439}\\approx -2{,}51\\]<p>T er neikvætt en \\(H_1\\) segir „aukist“: <b>ekki hægt að hafna</b> \\(H_0\\) (gagnrýnigildi \\(t_{20;\\,0{,}05}\\approx 1{,}72\\)).</p><p class=\"trap\"><b>Gildra.</b> Stefna T: stórt neikvætt T hafnar ekki H₀ þegar H₁ segir „stærra“.</p>",
          "p": 5
        },
        {
          "h": "c) Túlkun",
          "body": "<p>Fyrirtækið skilaði hagnaði fyrir breytingarnar, en ekkert bendir til að hann hafi aukist; meðaltalið lækkaði um 1,1 m.kr. (í tvíhliða prófi væri lækkunin marktæk, |T| = 2,51 &gt; 2,09). Ráðgjöfin skilaði ekki árangri. Forsendur: óháð ár og nálgað normaldreifður hagnaður.</p>",
          "p": 5
        }
      ],
      "examWeight": 15,
      "e": "",
      "paper": "J26"
    },
    {
      "id": "J26-11",
      "topic": "L08",
      "level": 2,
      "source": "old",
      "src": "Endurtökupróf janúar 2026, dæmi 11 (vægi ekki gefið, um 10%)",
      "q": "Útflutningsverðmæti (Y, ma.kr.) og gengisvísitala (X):<div class=\"scroll\"><table class=\"tt\"><thead><tr><th>Athugun</th><th>1</th><th>2</th><th>3</th></tr></thead><tbody><tr><th>Útflutningur (Y)</th><td class=\"mono\">550</td><td class=\"mono\">545</td><td class=\"mono\">540</td></tr><tr><th>Gengisvísitala (X)</th><td class=\"mono\">180</td><td class=\"mono\">200</td><td class=\"mono\">190</td></tr></tbody></table></div><p>Gert er ráð fyrir línulegu sambandi \\(Y=\\alpha+\\beta X\\).</p><ol type=\"a\"><li>Metið \\(\\hat\\alpha\\) og \\(\\hat\\beta\\) með aðferð minnstu kvaðrata.</li><li>Hver er spá líkansins þegar gengisvísitalan er 205?</li><li>Gefið er \\(\\operatorname{Var}(\\hat\\beta)=400\\). Prófið \\(H_0:\\beta=0\\) gegn \\(H_1:\\beta\\ne 0\\) við 5% marktækni. Frígráður eru n − 2.</li><li>Hvað segir matið á β um sambandið?</li></ol>",
      "type": "steps",
      "steps": [
        {
          "h": "a) Minnstu kvaðröt",
          "body": "<p>\\(\\bar x=190\\), \\(\\bar y=545\\). Frávik x: −10, 10, 0; frávik y: 5, 0, −5.</p>\\[\\hat\\beta=\\frac{(-10)(5)+(10)(0)+(0)(-5)}{100+100}=\\frac{-50}{200}=-0{,}25,\\qquad\\hat\\alpha=545+0{,}25\\cdot 190=592{,}5\\]<p class=\"trap\"><b>Gildra.</b> Athugun 3 er ekki í röð eftir X; parið saman rétt gildi.</p>",
          "p": 4
        },
        {
          "h": "b) Spá",
          "body": "\\[\\hat y=592{,}5-0{,}25\\cdot 205=541{,}25\\]",
          "p": 1
        },
        {
          "h": "c) t-próf á β",
          "body": "\\[T=\\frac{-0{,}25}{\\sqrt{400}}=-0{,}0125,\\qquad |T|<t_{1;\\,0{,}025}=12{,}706\\]<p><b>Ekki hægt að hafna</b> \\(H_0\\).</p>",
          "p": 3
        },
        {
          "h": "d) Túlkun",
          "body": "<p>Matið bendir til lítils neikvæðs sambands (útflutningur lækkar um 0,25 ma.kr. við hækkun vísitölunnar um eitt stig), en það er hvergi nærri marktækt; ekki er hægt að álykta um samband.</p>",
          "p": 2
        }
      ],
      "examWeight": 10,
      "e": "",
      "paper": "J26"
    },
    {
      "id": "J26-12",
      "topic": "L00",
      "level": 2,
      "source": "old",
      "src": "Endurtökupróf janúar 2026, dæmi 12 (vægi ekki gefið, um 2%)",
      "q": "Grunnatriði í R:<pre class=\"code\">x &lt;- \"Likindafraedi\"\ny &lt;- c(5, 20, -1, 60)\nx &lt;- \"Forritun\"\n\nz_1 &lt;- y[1] + y[3]\nz_2 &lt;- x</pre><ol type=\"a\"><li>Hvert er gildið í <code>z_1</code>?</li><li>Hvert er gildið í <code>z_2</code>?</li></ol>",
      "type": "steps",
      "steps": [
        {
          "h": "a) z_1",
          "body": "<p>\\(5+(-1)=\\) <code>4</code>.</p>",
          "p": 1
        },
        {
          "h": "b) z_2",
          "body": "<p><code>\"Forritun\"</code>: x var yfirskrifað í línu 3.</p>",
          "p": 1
        }
      ],
      "examWeight": 2,
      "e": "",
      "paper": "J26",
      "r": true
    },
    {
      "id": "J26-13",
      "topic": "L00",
      "level": 2,
      "source": "old",
      "src": "Endurtökupróf janúar 2026, dæmi 13 (vægi ekki gefið, um 2%)",
      "q": "Pakkar og stöðluð föll:<pre class=\"code\">library(ggplot2)\n\nreturns &lt;- rnorm(50, mean = 0, sd = 0.01)\n\ndf &lt;- data.frame(\n  index = 1:length(returns),\n  returns = returns\n)\n\nggplot(df, aes(x = index, y = returns)) +\n  geom_line()</pre><ol type=\"a\"><li>Hvað gerir <code>library(ggplot2)</code> (skipunin sjálf)?</li><li>Hvað gerir <code>rnorm(50, mean = 0, sd = 0.01)</code>?</li></ol>",
      "type": "steps",
      "steps": [
        {
          "h": "a) library",
          "body": "<p>Hleður pakkanum ggplot2 svo föll hans verði aðgengileg.</p>",
          "p": 1
        },
        {
          "h": "b) rnorm",
          "body": "<p>Dregur 50 slembitölur úr normaldreifingu með meðaltal 0 og staðalfrávik 0,01 (t.d. hermd dagleg ávöxtun). Síðustu línurnar teikna þær sem línurit eftir röð.</p>",
          "p": 1
        }
      ],
      "examWeight": 2,
      "e": "",
      "paper": "J26",
      "r": true
    },
    {
      "id": "J26-14",
      "topic": "L00",
      "level": 2,
      "source": "old",
      "src": "Endurtökupróf janúar 2026, dæmi 14 (vægi ekki gefið, um 2%)",
      "q": "Skilgreiningar falla:<pre class=\"code\">mitt_fall &lt;- function(x) {\n    if (sum(x[1:4]) > 10) {\n        x &lt;- x * 2\n    }\n    return(x[1:4])\n}</pre><ol type=\"a\"><li>Hvaða gildi birtir <code>print(mitt_fall(c(0, 5, 10, 1)))</code>?</li><li>Hvaða gildi birtir <code>print(mitt_fall(c(0, 5, 3, 1, 5)))</code>?</li></ol>",
      "type": "steps",
      "steps": [
        {
          "h": "a) Summa 16",
          "body": "<p>0 + 5 + 10 + 1 = 16 &gt; 10, svo x tvöfaldast: <code>0 10 20 2</code>.</p>",
          "p": 1
        },
        {
          "h": "b) Summa 9",
          "body": "<p>Aðeins fyrstu fjögur stökin teljast: 0 + 5 + 3 + 1 = 9 ≤ 10. Fallið skilar fyrstu fjórum: <code>0 5 3 1</code>.</p>",
          "p": 1
        }
      ],
      "examWeight": 2,
      "e": "",
      "paper": "J26",
      "r": true
    },
    {
      "id": "J26-15",
      "topic": "L00",
      "level": 2,
      "source": "old",
      "src": "Endurtökupróf janúar 2026, dæmi 15 (vægi ekki gefið, um 4%)",
      "q": "Tölfræðipróf og innlestur gagna:<pre class=\"code\">library(readxl)\nwages &lt;- read_excel(\"wages_is.xlsx\", sheet = \"data\")\n\npublic &lt;- wages$wage_isk[wages$sector == \"public\"]\nprivate &lt;- wages$wage_isk[wages$sector == \"private\"]\n\nres &lt;- t.test(public, private)\nprint(res)</pre><p>Úttakið:</p><pre class=\"code\">Welch Two Sample t-test\n\ndata:  public and private\nt = -2.04, df = 58.9, p-value = 0.046\nalternative hypothesis: true difference in means is not equal to 0\n95 percent confidence interval:\n -120500  -1800\nsample estimates:\nmean of x mean of y\n   720300    781100</pre><ol type=\"a\"><li>Hvað gerir skipunin í línu 2?</li><li>Hvað gerir <code>t.test(public, private)</code> og hvað má lesa úr niðurstöðunum?</li></ol>",
      "type": "steps",
      "steps": [
        {
          "h": "a) read_excel",
          "body": "<p>Les blaðið „data“ úr Excel-skránni wages_is.xlsx (fall úr readxl) í gagnatöfluna <code>wages</code>.</p>",
          "p": 1
        },
        {
          "h": "b) Welch t-próf",
          "body": "<p>Tvíhliða Welch t-próf á því hvort meðallaun í opinbera geiranum og einkageiranum séu jöfn. Meðaltöl 720.300 og 781.100 kr.; \\(t=-2{,}04\\), df ≈ 59, p = 0,046.</p><p>p &lt; 0,05: <b>H₀ hafnað</b> við 5% (en ekki við 1%): laun í opinbera geiranum eru marktækt lægri. 95% bilið fyrir muninn, (−120.500; −1.800), inniheldur ekki 0.</p>",
          "p": 3
        }
      ],
      "examWeight": 4,
      "e": "",
      "paper": "J26",
      "r": true
    }
  ]
};

/** @type {import('../schema.js').Course} */
export default adapt(meta, L);
