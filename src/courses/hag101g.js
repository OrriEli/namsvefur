// Búið til af scripts/extract-legacy.js úr legacy/HAG101G lokapróf.html. Ekki breyta í höndunum.
import * as L from './legacy/hag101g.js';
import adapt from './adapters/written.js';

export const meta = {
  "id": "hag101g",
  "code": "HAG101G",
  "name": "Hagræn stærðfræði I",
  "short": "Stærðfræði",
  "color": "--c-hag101g",
  "engine": "written",
  "topics": [
    {
      "id": "fyl",
      "name": "Fylkjaaðgerðir og vigrar",
      "ref": "Kafli 4.1–4.7",
      "weight": "15*"
    },
    {
      "id": "akv",
      "name": "Ákveður og raðtala",
      "ref": "Kafli 5.1–5.3",
      "weight": "15*"
    },
    {
      "id": "and",
      "name": "Andhverfa",
      "ref": "Kafli 5.4",
      "weight": "15*"
    },
    {
      "id": "jof",
      "name": "Jöfnukerfi og Cramer",
      "ref": "Kafli 5.4–5.5",
      "weight": "15"
    },
    {
      "id": "dif",
      "name": "Diffrunarreglur",
      "ref": "Kafli 7.1–7.3",
      "weight": "10*"
    },
    {
      "id": "ein",
      "name": "Föll af einni breytu og útmörk",
      "ref": "Kafli 9.1–9.4 · 11.1",
      "weight": "10*"
    },
    {
      "id": "hlu",
      "name": "Hlutafleiður",
      "ref": "Kafli 7.4",
      "weight": "í öllu"
    },
    {
      "id": "mis",
      "name": "Heildarmismunur og heildarafleiður",
      "ref": "Kafli 8.1–8.4",
      "weight": "15"
    },
    {
      "id": "dul",
      "name": "Fólgin föll",
      "ref": "Kafli 8.5",
      "weight": "10*"
    },
    {
      "id": "eins",
      "name": "Einsleit og þenjanleg föll",
      "ref": "Kafli 12.6–12.7",
      "weight": "10*"
    },
    {
      "id": "tay",
      "name": "Taylor-nálgun",
      "ref": "Kafli 9.5",
      "weight": "10"
    },
    {
      "id": "hes",
      "name": "Hessian: hvelft, kúpt, útmörk",
      "ref": "Kafli 11.2–11.4",
      "weight": "25*"
    },
    {
      "id": "ham",
      "name": "Hámörkun og umslagssetning",
      "ref": "Kafli 11.4 · 13.5",
      "weight": "25*"
    }
  ],
  "modes": [
    {
      "id": "written",
      "label": "Skrifleg dæmi",
      "quick": false
    },
    {
      "id": "quick",
      "label": "Hraðæfing",
      "quick": true
    }
  ],
  "examFormats": [
    {
      "id": "L23",
      "name": "Lokapróf 2023",
      "desc": "Upprunalega prófið: fylki, jöfnukerfi, ein breyta, hámörkun með umslagssetningu, dulið fall, Taylor.",
      "style": "written",
      "minutes": 180,
      "pick": {
        "by": "fixed",
        "ids": [
          "L23-1",
          "L23-2",
          "L23-3",
          "L23-4",
          "L23-5",
          "L23-6"
        ]
      }
    },
    {
      "id": "L25",
      "name": "Lokapróf 2025",
      "desc": "Upprunalega prófið: fylki, jöfnukerfi, keðjuregla, heildarafleiða, fólgið fall, Taylor, hámörkun.",
      "style": "written",
      "minutes": 180,
      "pick": {
        "by": "fixed",
        "ids": [
          "L25-1",
          "L25-2",
          "L25-3",
          "L25-4",
          "L25-5",
          "L25-6",
          "L25-7"
        ]
      }
    },
    {
      "id": "mix",
      "name": "Blandað próf",
      "desc": "Fylki 15, jöfnukerfi 15, ein breyta 10, heildarmismunur 15, fólgin föll/einsleitni 10, Taylor 10, hámörkun 25. Ný samsetning í hvert sinn.",
      "style": "written",
      "minutes": 180,
      "pick": {
        "by": "blueprint",
        "sections": [
          {
            "topics": [
              "fyl",
              "akv",
              "and"
            ],
            "weight": 15
          },
          {
            "topics": [
              "jof"
            ],
            "weight": 15
          },
          {
            "topics": [
              "ein",
              "dif"
            ],
            "weight": 10
          },
          {
            "topics": [
              "mis"
            ],
            "weight": 15
          },
          {
            "topics": [
              "dul",
              "eins"
            ],
            "weight": 10
          },
          {
            "topics": [
              "tay"
            ],
            "weight": 10
          },
          {
            "topics": [
              "ham",
              "hes"
            ],
            "weight": 25
          }
        ],
        "minPoints": 5
      }
    },
    {
      "id": "gen",
      "name": "Rafalapróf",
      "desc": "Sama vægi og blandaða prófið en eingöngu dæmi með nýjum tölum.",
      "style": "written",
      "minutes": 180,
      "pick": {
        "by": "blueprint",
        "sections": [
          {
            "topics": [
              "fyl",
              "akv",
              "and"
            ],
            "weight": 15
          },
          {
            "topics": [
              "jof"
            ],
            "weight": 15
          },
          {
            "topics": [
              "ein",
              "dif"
            ],
            "weight": 10
          },
          {
            "topics": [
              "mis"
            ],
            "weight": 15
          },
          {
            "topics": [
              "dul",
              "eins"
            ],
            "weight": 10
          },
          {
            "topics": [
              "tay"
            ],
            "weight": 10
          },
          {
            "topics": [
              "ham",
              "hes"
            ],
            "weight": 25
          }
        ],
        "minPoints": 5,
        "gensOnly": true
      }
    },
    {
      "id": "M25",
      "name": "Miðannarpróf 2025",
      "desc": "Upphitun á fylkjahlutanum: fylki, jöfnukerfi, 4×4 ákveða, Hessian, heildarmismunur.",
      "style": "written",
      "minutes": 90,
      "pick": {
        "by": "fixed",
        "ids": [
          "M25-1",
          "M25-2",
          "M25-3",
          "M25-4",
          "M25-5"
        ]
      }
    }
  ],
  "sheet": {
    "head": "<div class=\"stack\" style=\"gap:6px\"><span class=\"eyebrow\">Ekkert formúlublað á prófinu</span><h1>Blaðið</h1><p class=\"muted\" style=\"max-width:62ch\">Allar reglur og aðgerðir til lokaprófsins 25. nóvember, ásamt því sem þarf að kunna utanbókar. Unnu dæmin eru falin undir „Unnið dæmi“. Hugtökin eru þau sem námskeiðið notar: <i>hvelft</i> þýðir concave (∩), <i>kúpt</i> convex (∪), <i>aðoka fylki</i> adjoint og <i>raðtala</i> rank.</p></div>\n\n<nav class=\"toc\" aria-label=\"Efnisyfirlit\">\n<button data-toc=\"s0\">Yfirlit</button><button data-toc=\"s1\">Fylki og vigrar</button><button data-toc=\"s2\">I, 0 og bylting</button><button data-toc=\"s3\">Andhverfur: reglur</button><button data-toc=\"s4\">Markov</button><button data-toc=\"s5\">Raðtala</button><button data-toc=\"s6\">Ákveður</button><button data-toc=\"s7\">Aðoka fylki</button><button data-toc=\"s8\">Cramer</button><button data-toc=\"s9\">Grunnafleiður</button><button data-toc=\"s10\">Diffrunarreglur</button><button data-toc=\"s11\">Ein breyta</button><button data-toc=\"s12\">Hlutafleiður</button><button data-toc=\"s13\">Mismunur</button><button data-toc=\"s14\">Heildarafleiður</button><button data-toc=\"s15\">Fólgin föll</button><button data-toc=\"s16\">Taylor</button><button data-toc=\"s17\">Einsleitni</button><button data-toc=\"s18\">Hvelft, kúpt, útmörk</button><button data-toc=\"s19\">Hámörkun og umslag</button><button data-toc=\"s20\">Gildrur</button><button data-toc=\"s21\">Frágangur</button>\n</nav>\n\n",
    "sections": [
      {
        "id": "s0",
        "n": "00",
        "title": "Yfirlit og fyrirkomulag",
        "html": "<section id=\"s0\"><h2><span class=\"n\">00</span>Yfirlit og fyrirkomulag</h2>\n<ul><li><b>Mið. 25. nóv. kl. 13:30–16:30</b> (3 klst.) í <b>Á301</b>. Svarað á skannblöð.</li>\n<li>Engin hjálpargögn og engin reiknivél. „Ekki er gefið fyrir svör án útreikninga eða rökstuðnings.“</li>\n<li>Allt námskeiðið er til prófs. Gömlu lokaprófin hafa 6–7 dæmi.</li></ul>\n<div class=\"scroll\"><table class=\"tt\"><thead><tr><th>Svið</th><th>Kaflar</th><th>Nótur</th><th>Dæmablað</th><th>2023</th><th>2025</th></tr></thead><tbody>\n<tr><td>Fylki, ákveður, andhverfa</td><td>4, 5.1–5.4</td><td>8–12</td><td>18–28</td><td>15</td><td>20</td></tr>\n<tr><td>Jöfnukerfi og Cramer</td><td>5.5</td><td>12</td><td>29</td><td>15</td><td>15</td></tr>\n<tr><td>Diffrun og föll af einni breytu</td><td>7.1–7.3, 9.1–9.4</td><td>13, 20</td><td>8–16, 43</td><td>15</td><td>5</td></tr>\n<tr><td>Heildarmismunur og heildarafleiður</td><td>8.1–8.4</td><td>15, 16</td><td>34, 35</td><td>–</td><td>15</td></tr>\n<tr><td>Fólgin föll (og einsleitni)</td><td>8.5, 12.6–12.7</td><td>16, 17, 19, 20</td><td>36–40</td><td>15</td><td>10</td></tr>\n<tr><td>Taylor-nálgun</td><td>9.5</td><td>18</td><td>41–42</td><td>10</td><td>15</td></tr>\n<tr><td>Hámörkun, Hessian, umslagssetning</td><td>11.1–11.4, 13.5</td><td>14, 20, 21</td><td>30–33, 44–46</td><td>30</td><td>20</td></tr></tbody></table></div>\n<p class=\"hint\">Dálkarnir 2023 og 2025 sýna vægi (%) á lokaprófunum. Algebra og tegrar (dæmablað 1–7 og 17) komu ekki fyrir á þeim; þau eru ekki í forritinu.</p></section>"
      },
      {
        "id": "s1",
        "n": "01",
        "title": "Fylki og vigrar",
        "html": "<section id=\"s1\"><h2><span class=\"n\">01</span>Fylki og vigrar <span class=\"kafli\">4.1–4.3</span><button class=\"btn small go\" data-sgo=\"fyl\">Æfa</button></h2>\n<p>\\(m\\times n\\) fylki hefur \\(m\\) raðir og \\(n\\) dálka; stakið í röð \\(i\\), dálki \\(j\\) er \\(a_{ij}\\). Ferningsfylki: \\(m = n\\). Dálkvigur \\(x\\) er \\(n\\times 1\\), raðvigur \\(x'\\) er \\(1\\times n\\).</p>\n<div class=\"kv\"><b>Jöfn fylki</b><span>sömu víddir og öll samsvarandi stök jöfn</span><b>Samlagning</b><span>sömu víddir; stak fyrir stak: \\(A \\pm B = [a_{ij} \\pm b_{ij}]\\)</span><b>Fasti</b><span>\\(kA = [k\\,a_{ij}]\\), víddir skipta ekki máli</span></div>\n\\[\\underset{(m\\times n)}{A}\\;\\underset{(n\\times p)}{B} = \\underset{(m\\times p)}{C}, \\qquad c_{ij} = \\sum_{k=1}^{n} a_{ik}\\,b_{kj}\\]\n<p>Skilyrði: fjöldi <b>dálka í A</b> = fjöldi <b>raða í B</b>. Útkoman tekur ytri víddirnar. Röð \\(i\\) í \\(A\\) sinnum dálkur \\(j\\) í \\(B\\) gefur \\(c_{ij}\\). Í \\(AB\\) er \\(B\\) <b>formargfaldað</b> með \\(A\\) og \\(A\\) <b>bakmargfaldað</b> með \\(B\\).</p>\n<p>„\\(A/B\\)“ er ekki til sem aðgerð (dæmi 19f). Í staðinn er margfaldað með andhverfu: \\(AB^{-1}\\).</p>\n<details class=\"ex\"><summary>Unnið dæmi: AB ≠ BA</summary>\n\\[A = \\begin{bmatrix}1&2\\\\3&4\\end{bmatrix},\\quad B = \\begin{bmatrix}0&1\\\\2&3\\end{bmatrix}\\]\n\\[AB = \\begin{bmatrix} 1\\cdot0+2\\cdot2 & 1\\cdot1+2\\cdot3 \\\\ 3\\cdot0+4\\cdot2 & 3\\cdot1+4\\cdot3 \\end{bmatrix} = \\begin{bmatrix} 4 & 7 \\\\ 8 & 15 \\end{bmatrix}, \\qquad BA = \\begin{bmatrix} 3 & 4 \\\\ 11 & 16 \\end{bmatrix}\\]\n</details>\n<h3>Vigrar</h3>\n<ul><li>\\(x'x\\) er \\((1\\times n)(n\\times 1) = 1\\times 1\\): tala, summa ferninga.</li>\n<li>\\(xx'\\) er \\((n\\times 1)(1\\times n) = n\\times n\\) fylki.</li>\n<li>Innra margfeldi: \\(u\\cdot v = u'v = \\sum_{i} u_iv_i\\).</li>\n<li><b>Hornréttir</b>: \\(u'v = 0\\). <b>Samsíða</b>: \\(u = kv\\).</li>\n<li>Myndrænt: \\(u + v\\) fæst með því að setja odd \\(v\\) á odd \\(u\\); \\(u - v = u + (-1)v\\); \\(2v\\) er tvöfalt lengri í sömu átt.</li>\n<li><b>Línulega háðir</b>: til eru \\(k_1, \\dots, k_n\\), ekki öll 0, þannig að \\(k_1v_1 + \\dots + k_nv_n = 0\\).</li></ul></section>"
      },
      {
        "id": "s2",
        "n": "02",
        "title": "Reiknireglur, I, 0 og bylting",
        "html": "<section id=\"s2\"><h2><span class=\"n\">02</span>Reiknireglur, I, 0 og bylting <span class=\"kafli\">4.4–4.6</span><button class=\"btn small go\" data-sgo=\"fyl\">Æfa</button></h2>\n<div class=\"scroll\"><table class=\"tt\"><thead><tr><th>Regla</th><th>Gildir?</th></tr></thead><tbody>\n<tr><td>\\(A + B = B + A\\)</td><td>Já</td></tr>\n<tr><td>\\((A + B) + C = A + (B + C)\\)</td><td>Já</td></tr>\n<tr><td>\\(AB = BA\\)</td><td><b>Nei</b>, almennt ekki</td></tr>\n<tr><td>\\((AB)C = A(BC)\\)</td><td>Já (tengiregla)</td></tr>\n<tr><td>\\(A(B + C) = AB + AC\\)</td><td>Já (dreifiregla)</td></tr>\n<tr><td>\\((B + C)A = BA + CA\\)</td><td>Já, en röðin skiptir máli</td></tr>\n<tr><td>\\(AB = 0 \\Rightarrow A = 0\\) eða \\(B = 0\\)</td><td><b>Nei</b></td></tr></tbody></table></div>\n<p><b>Einingafylki</b> \\(I_n\\): 1 á hornalínu, 0 annars staðar. \\(IA = AI = A\\), \\(I^2 = I\\), \\(I^{-1} = I\\). Víddin ræðst af hliðinni: ef \\(A\\) er \\(m\\times n\\) þarf \\(I\\) í \\(IA\\) að vera \\(m\\times m\\) en í \\(AI\\) að vera \\(n\\times n\\).</p>\n<p><b>Núllfylki</b> þarf ekki að vera ferningsfylki: \\(A + 0 = A\\), \\(A0 = 0\\). Víddir fylgja venjulegri margföldun (dæmi 23d: \\((5\\times 2)(2\\times 3) = 5\\times 3\\) núllfylki).</p>\n<p><b>Bylting</b> \\(A'\\): raðir verða dálkar, \\(m\\times n\\) verður \\(n\\times m\\). Samhverft ef \\(A' = A\\) (t.d. Hessian-fylki).</p>\n\\[(A')' = A \\qquad (A+B)' = A' + B' \\qquad (AB)' = B'A' \\qquad (ABC)' = C'B'A'\\]</section>"
      },
      {
        "id": "s3",
        "n": "03",
        "title": "Andhverfur: reglur og sannanir",
        "html": "<section id=\"s3\"><h2><span class=\"n\">03</span>Andhverfur: reglur og sannanir <span class=\"kafli\">4.6</span><button class=\"btn small go\" data-sgo=\"and\">Æfa</button></h2>\n<p>\\(A^{-1}\\) er aðeins til fyrir ferningsfylki og uppfyllir \\(A^{-1}A = AA^{-1} = I\\). Andhverfanlegt (non-singular) ⇔ \\(|A| \\ne 0\\). Ef andhverfa er til er hún einstök.</p>\n\\[(A^{-1})^{-1} = A \\qquad (AB)^{-1} = B^{-1}A^{-1} \\qquad (A')^{-1} = (A^{-1})'\\]\n<p class=\"notice\">Nótur 9 segja \\((A + B)^{-1} = B^{-1} + A^{-1}\\). Það er <b>rangt</b>; slík regla er ekki til. Rétta reglan („í öfugri röð“) er \\((AB)^{-1} = B^{-1}A^{-1}\\).</p>\n<details class=\"ex\"><summary>Sannanirnar úr dæmi 25</summary>\n<p>(a) Margfalda \\(AB\\) með \\(B^{-1}A^{-1}\\) og sýna að útkoman sé \\(I\\):</p>\n\\[(AB)(B^{-1}A^{-1}) = A(BB^{-1})A^{-1} = AIA^{-1} = AA^{-1} = I\\]\n<p>(b) Bylta \\(AA^{-1} = I\\) og nota \\((AB)' = B'A'\\) og \\(I' = I\\):</p>\n\\[(AA^{-1})' = I' \\;\\Rightarrow\\; (A^{-1})'A' = I \\;\\Rightarrow\\; (A^{-1})' = (A')^{-1}\\]\n</details>\n<div class=\"kv\"><b>Jöfnukerfi</b><span>\\(Ax = d \\Rightarrow x^* = A^{-1}d\\). \\(A^{-1}\\) fer <b>fyrir framan</b> \\(d\\), ekki \\(dA^{-1}\\).</span><b>\\(AX = B\\)</b><span>\\(X = A^{-1}B\\) (formargfalda)</span><b>\\(XA = B\\)</b><span>\\(X = BA^{-1}\\) (bakmargfalda)</span><b>\\(AB = kI\\)</b><span>\\(B = kA^{-1}\\) (dæmi 28)</span></div></section>"
      },
      {
        "id": "s4",
        "n": "04",
        "title": "Markov-keðjur",
        "html": "<section id=\"s4\"><h2><span class=\"n\">04</span>Markov-keðjur <span class=\"kafli\">4.7</span><button class=\"btn small go\" data-sgo=\"fyl\">Æfa</button></h2>\n<p><b>Raðvigur</b> dreifingarinnar sinnum færslufylkið \\(M\\). \\(p_{ij}\\) eru líkurnar á að fara úr \\(i\\) í \\(j\\), svo hver <b>röð</b> í \\(M\\) summast í 1.</p>\n\\[x_{t+1}' = x_t' M, \\qquad x_{t+n}' = x_t' M^n\\]\n<details class=\"ex\"><summary>Unnið dæmi</summary>\n\\[x_0' = \\begin{bmatrix}0{,}6 & 0{,}4\\end{bmatrix},\\qquad M = \\begin{bmatrix}0{,}9 & 0{,}1\\\\ 0{,}2 & 0{,}8\\end{bmatrix}\\]\n\\[\\begin{aligned}\nx_1' &= \\begin{bmatrix} 0{,}6\\cdot0{,}9 + 0{,}4\\cdot0{,}2 & \\; 0{,}6\\cdot0{,}1 + 0{,}4\\cdot0{,}8 \\end{bmatrix} \\\\\n&= \\begin{bmatrix} 0{,}54 + 0{,}08 & \\; 0{,}06 + 0{,}32 \\end{bmatrix} = \\begin{bmatrix} 0{,}62 & 0{,}38 \\end{bmatrix}\n\\end{aligned}\\]\n<p>Prófun: \\(0{,}62 + 0{,}38 = 1\\). Ef upphafsdreifingin er gefin sem dálkvigur (eins og í skilaverkefni 1) þarf að bylta henni fyrst.</p>\n</details></section>"
      },
      {
        "id": "s5",
        "n": "05",
        "title": "Línulegt óhæði, raðtala og þrepafylki",
        "html": "<section id=\"s5\"><h2><span class=\"n\">05</span>Línulegt óhæði, raðtala og þrepafylki <span class=\"kafli\">5.1</span><button class=\"btn small go\" data-sgo=\"akv\">Æfa</button></h2>\n<p>Skilyrði fyrir andhverfu: (1) ferningsfylki (nauðsynlegt, ekki nægjanlegt); (2) raðir línulega óháðar (nægjanlegt). Fyrir \\(n\\times n\\) fylki eru öll þessi jafngild:</p>\n\\[\\text{raðir óháðar} \\iff r(A) = n \\iff |A| \\ne 0 \\iff A^{-1} \\text{ til} \\iff Ax = d \\text{ hefur einstaka lausn}\\]\n<p>Raðtala \\(r(A)\\) er hámarksfjöldi óháðra raða (= dálka); \\(r(A) \\le \\min(m, n)\\). Leyfðar aðgerðir að þrepafylki, sem breyta ekki raðtölunni: (1) víxla röðum, (2) margfalda röð með \\(k \\ne 0\\), (3) leggja margfeldi einnar raðar við aðra. <b>Raðtala = fjöldi raða − fjöldi núllraða.</b></p>\n<details class=\"ex\"><summary>Unnið dæmi</summary>\n\\[\\begin{bmatrix} 1 & 2 & 3 \\\\ 2 & 4 & 6 \\\\ 1 & 0 & 1 \\end{bmatrix}\n\\xrightarrow[R_3 - R_1]{R_2 - 2R_1}\n\\begin{bmatrix} 1 & 2 & 3 \\\\ 0 & 0 & 0 \\\\ 0 & -2 & -2 \\end{bmatrix}\n\\xrightarrow[-\\frac12 R_2]{R_2 \\leftrightarrow R_3}\n\\begin{bmatrix} 1 & 2 & 3 \\\\ 0 & 1 & 1 \\\\ 0 & 0 & 0 \\end{bmatrix}\\]\n<p>Ein núllröð, svo \\(r(A) = 3 - 1 = 2 \\lt 3\\). Röð 2 = 2 · röð 1, fylkið er sérstætt og \\(|A| = 0\\). Skrifaðu aðgerðina við hverja ör; það gefur stig.</p>\n</details></section>"
      },
      {
        "id": "s6",
        "n": "06",
        "title": "Ákveður",
        "html": "<section id=\"s6\"><h2><span class=\"n\">06</span>Ákveður <span class=\"kafli\">5.2–5.3</span><button class=\"btn small go\" data-sgo=\"akv\">Æfa</button></h2>\n<p>Aðeins til fyrir ferningsfylki. \\(|A| = 0\\) ⇔ sérstætt.</p>\n\\[\\begin{vmatrix}a_{11}&a_{12}\\\\a_{21}&a_{22}\\end{vmatrix} = a_{11}a_{22} - a_{12}a_{21}\\]\n\\[|A_{3\\times3}| = a_{11}a_{22}a_{33} - a_{11}a_{23}a_{32} + a_{12}a_{23}a_{31} - a_{12}a_{21}a_{33} + a_{13}a_{21}a_{32} - a_{13}a_{22}a_{31}\\]\n<p><b>Hlutákveða</b> \\(|M_{ij}|\\): strika út röð \\(i\\) og dálk \\(j\\). <b>Fylgiþáttur</b> \\(|C_{ij}| = (-1)^{i+j}|M_{ij}|\\), formerkin í skákborðsmynstri:</p>\n\\[\\begin{bmatrix} + & - & + & - \\\\ - & + & - & + \\\\ + & - & + & - \\\\ - & + & - & + \\end{bmatrix} \\qquad |A| = \\sum_{j} a_{ij}|C_{ij}| \\;(\\text{röð } i) = \\sum_{i} a_{ij}|C_{ij}| \\;(\\text{dálkur } j)\\]\n<p>Liðaðu eftir röð eða dálki með <b>flestum núllum</b>. Í 26b hefur dálkur 3 þrjú núll, svo aðeins einn liður lifir og 4×4 verður 3×3.</p>\n<details class=\"ex\"><summary>Unnið dæmi: liðun eftir röð 1</summary>\n\\[\\begin{aligned}\n\\begin{vmatrix} 2 & 1 & 0 \\\\ 1 & 3 & 1 \\\\ 0 & 1 & 2 \\end{vmatrix}\n&= 2\\begin{vmatrix} 3 & 1 \\\\ 1 & 2 \\end{vmatrix} - 1\\begin{vmatrix} 1 & 1 \\\\ 0 & 2 \\end{vmatrix} + 0\\begin{vmatrix} 1 & 3 \\\\ 0 & 1 \\end{vmatrix} \\\\\n&= 2(6 - 1) - 1(2 - 0) + 0 \\\\\n&= 10 - 2 = 8\n\\end{aligned}\\]\n</details>\n<div class=\"scroll\"><table class=\"tt\"><thead><tr><th>#</th><th>Aðgerð</th><th>Áhrif á \\(|A|\\)</th></tr></thead><tbody>\n<tr><td>1</td><td>Bylta</td><td>engin: \\(|A'| = |A|\\)</td></tr>\n<tr><td>2</td><td>Víxla tveimur röðum (dálkum)</td><td>formerki snýst: \\(-|A|\\)</td></tr>\n<tr><td>3</td><td>Margfalda <b>eina</b> röð með \\(k\\)</td><td>\\(k|A|\\) (leyfir að þátta út úr röð)</td></tr>\n<tr><td>4</td><td>Leggja \\(k\\cdot\\)röð við aðra röð</td><td>engin</td></tr>\n<tr><td>5</td><td>Röð er línulegt fall af öðrum (t.d. tvær eins, núllröð)</td><td>\\(|A| = 0\\)</td></tr>\n<tr><td>6</td><td>Liðun með framandi fylgiþáttum, \\(\\sum_j a_{ij}|C_{i'j}|\\)</td><td>0</td></tr>\n<tr><td></td><td>Allt \\(n\\times n\\) fylkið sinnum \\(k\\)</td><td>\\(|kA| = k^n|A|\\)</td></tr></tbody></table></div>\n\\[|AB| = |A||B| \\qquad |A^{-1}| = \\frac{1}{|A|} \\qquad |\\text{þríhyrningsfylki}| = \\text{margfeldi hornalínu}\\]\n<p>Lokapróf 2025 spurði hvað gerist ef röð 2 er margfölduð með \\(k\\): eiginleiki 3, svarið er \\(k|A|\\).</p></section>"
      },
      {
        "id": "s7",
        "n": "07",
        "title": "Andhverfa með aðoka fylki",
        "html": "<section id=\"s7\"><h2><span class=\"n\">07</span>Andhverfa með aðoka fylki <span class=\"kafli\">5.4</span><button class=\"btn small go\" data-sgo=\"and\">Æfa</button></h2>\n\\[A^{-1} = \\frac{1}{|A|}\\operatorname{adj}A, \\qquad \\operatorname{adj}A = C' \\qquad\\qquad \\begin{bmatrix}a&b\\\\c&d\\end{bmatrix}^{-1} = \\frac{1}{ad-bc}\\begin{bmatrix}d&-b\\\\-c&a\\end{bmatrix}\\]\n<ol><li>Reikna \\(|A|\\). Ef 0: engin andhverfa, stoppa og segja það.</li><li>Öll \\(n^2\\) \\(|C_{ij}|\\) með formerki, raða í \\(C\\). Skrifaðu þá fyrst sem lista \\(|C_{11}| = \\dots\\)</li><li><b>Bylta</b>: \\(\\operatorname{adj}A = C'\\).</li><li>Deila með \\(|A|\\) og þátta út: \\(A^{-1} = \\frac13[\\dots]\\).</li></ol>\n<details class=\"ex\"><summary>Unnið dæmi 3×3</summary>\n\\[A = \\begin{bmatrix} 1 & 2 & 0 \\\\ 0 & 1 & 1 \\\\ 1 & 0 & 1 \\end{bmatrix}, \\qquad |A| = 1(1\\cdot1 - 1\\cdot0) - 2(0\\cdot1 - 1\\cdot1) + 0 = 1 + 2 = 3\\]\n\\[\\begin{aligned}\n|C_{11}| &= +(1\\cdot1 - 1\\cdot0) = 1 & |C_{12}| &= -(0\\cdot1 - 1\\cdot1) = 1 & |C_{13}| &= +(0\\cdot0 - 1\\cdot1) = -1 \\\\\n|C_{21}| &= -(2\\cdot1 - 0\\cdot0) = -2 & |C_{22}| &= +(1\\cdot1 - 0\\cdot1) = 1 & |C_{23}| &= -(1\\cdot0 - 2\\cdot1) = 2 \\\\\n|C_{31}| &= +(2\\cdot1 - 0\\cdot1) = 2 & |C_{32}| &= -(1\\cdot1 - 0\\cdot0) = -1 & |C_{33}| &= +(1\\cdot1 - 2\\cdot0) = 1\n\\end{aligned}\\]\n\\[C = \\begin{bmatrix} 1 & 1 & -1 \\\\ -2 & 1 & 2 \\\\ 2 & -1 & 1 \\end{bmatrix}, \\quad\n\\operatorname{adj} A = C' = \\begin{bmatrix} 1 & -2 & 2 \\\\ 1 & 1 & -1 \\\\ -1 & 2 & 1 \\end{bmatrix}, \\quad\nA^{-1} = \\frac{1}{3}\\begin{bmatrix} 1 & -2 & 2 \\\\ 1 & 1 & -1 \\\\ -1 & 2 & 1 \\end{bmatrix}\\]\n<p>Prófun: röð 1 í \\(A\\) sinnum dálkur 1 í adj: \\(1\\cdot1 + 2\\cdot1 + 0\\cdot(-1) = 3 = |A|\\); röð 1 sinnum dálkur 2: \\(1\\cdot(-2) + 2\\cdot1 + 0\\cdot2 = 0\\). Rétt. Ef beðið er um að <i>sannreyna</i> gefna andhverfu (lokapróf 2025) þarf að reikna \\(AA^{-1}\\) í heild.</p>\n</details></section>"
      },
      {
        "id": "s8",
        "n": "08",
        "title": "Jöfnukerfi og regla Cramers",
        "html": "<section id=\"s8\"><h2><span class=\"n\">08</span>Jöfnukerfi og regla Cramers <span class=\"kafli\">5.5</span><button class=\"btn small go\" data-sgo=\"jof\">Æfa</button></h2>\n<p>Uppsetning \\(Ax = d\\): ein röð á hverja jöfnu, einn dálkur á hverja breytu í sömu röð alls staðar, hægri hliðar í \\(d\\). Breyta sem vantar fær stuðulinn <b>0</b>.</p>\n\\[x^* = A^{-1}d \\qquad\\qquad x_j^* = \\frac{|A_j|}{|A|}\\]\n<p>\\(A_j\\) er \\(A\\) með <b>dálki</b> \\(j\\) skipt út fyrir \\(d\\). Virkar aðeins ef \\(|A| \\ne 0\\); ef \\(|A| = 0\\) er annaðhvort engin lausn eða óendanlega margar. Cramer er fljótlegastur þegar aðeins er beðið um <b>eina</b> breytu.</p>\n<details class=\"ex\"><summary>Unnið dæmi: báðar leiðir</summary>\n\\[\\begin{cases} 2x + y = 5 \\\\ x + 3y = 10 \\end{cases}\n\\;\\Longrightarrow\\;\n\\underbrace{\\begin{bmatrix} 2 & 1 \\\\ 1 & 3 \\end{bmatrix}}_{A}\n\\underbrace{\\begin{bmatrix} x \\\\ y \\end{bmatrix}}_{x}\n= \\underbrace{\\begin{bmatrix} 5 \\\\ 10 \\end{bmatrix}}_{d}\\]\n\\[x^* = A^{-1}d = \\frac{1}{5}\\begin{bmatrix} 3 & -1 \\\\ -1 & 2 \\end{bmatrix}\\begin{bmatrix} 5 \\\\ 10 \\end{bmatrix} = \\frac{1}{5}\\begin{bmatrix} 15 - 10 \\\\ -5 + 20 \\end{bmatrix} = \\begin{bmatrix} 1 \\\\ 3 \\end{bmatrix}\\]\n\\[\\begin{aligned}\n|A| &= 2\\cdot3 - 1\\cdot1 = 5 \\\\\n|A_1| &= \\begin{vmatrix} 5 & 1 \\\\ 10 & 3 \\end{vmatrix} = 15 - 10 = 5 &&\\Rightarrow\\; x^* = 5/5 = 1 \\\\\n|A_2| &= \\begin{vmatrix} 2 & 5 \\\\ 1 & 10 \\end{vmatrix} = 20 - 5 = 15 &&\\Rightarrow\\; y^* = 15/5 = 3\n\\end{aligned}\\]\n<p>Prófun: \\(2\\cdot1 + 3 = 5\\) og \\(1 + 3\\cdot3 = 10\\). Tekur hálfa mínútu og grípur flestar formerkjavillur.</p>\n</details></section>"
      },
      {
        "id": "s9",
        "n": "09",
        "title": "Grunnafleiður og lograreglur",
        "html": "<section id=\"s9\"><h2><span class=\"n\">09</span>Grunnafleiður og lograreglur <span class=\"kafli\">rifjun</span><button class=\"btn small go\" data-sq=\"dif\">Hraðæfing</button></h2>\n<div class=\"scroll\"><table class=\"tt\"><thead><tr><th>\\(f(x)\\)</th><th>\\(f'(x)\\)</th><th>\\(f(x)\\)</th><th>\\(f'(x)\\)</th></tr></thead><tbody>\n<tr><td>\\(c\\)</td><td>\\(0\\)</td><td>\\(e^{x}\\)</td><td>\\(e^{x}\\)</td></tr>\n<tr><td>\\(x^n\\)</td><td>\\(nx^{n-1}\\)</td><td>\\(e^{g(x)}\\)</td><td>\\(g'(x)e^{g(x)}\\)</td></tr>\n<tr><td>\\(c\\,g(x)\\)</td><td>\\(c\\,g'(x)\\)</td><td>\\(a^{x}\\)</td><td>\\(a^{x}\\ln a\\)</td></tr>\n<tr><td>\\(\\sqrt{x}\\)</td><td>\\(\\frac{1}{2\\sqrt{x}}\\)</td><td>\\(\\ln x\\)</td><td>\\(\\frac{1}{x}\\)</td></tr>\n<tr><td>\\(\\frac{1}{x}\\)</td><td>\\(-\\frac{1}{x^2}\\)</td><td>\\(\\ln g(x)\\)</td><td>\\(\\frac{g'(x)}{g(x)}\\)</td></tr></tbody></table></div>\n<p>Einfaldaðu með lograreglum <b>áður</b> en þú diffrar (dæmi 31b, 33a):</p>\n\\[\\ln(xy) = \\ln x + \\ln y \\qquad \\ln\\frac{x}{y} = \\ln x - \\ln y \\qquad \\ln x^b = b\\ln x \\qquad e^{\\ln x} = x\\]\n<p>Dæmi: \\(a\\ln(x_1x_2^b) = a\\ln x_1 + ab\\ln x_2\\), svo \\(f_1 = \\frac{a}{x_1}\\) og \\(f_2 = \\frac{ab}{x_2}\\). Vaxandi ef \\(f' \\gt 0\\), minnkandi ef \\(f' \\lt 0\\).</p></section>"
      },
      {
        "id": "s10",
        "n": "10",
        "title": "Diffrunarreglur",
        "html": "<section id=\"s10\"><h2><span class=\"n\">10</span>Diffrunarreglur <span class=\"kafli\">7.2–7.3</span><button class=\"btn small go\" data-sgo=\"dif\">Æfa</button></h2>\n<div class=\"kv\"><span>Summa</span><span>\\((f \\pm g \\pm h)' = f' \\pm g' \\pm h'\\)</span><span>Margfeldi</span><span>\\((fg)' = f'g + fg'\\), \\((fgh)' = f'gh + fg'h + fgh'\\)</span><span>Deiling</span><span>\\(\\left(\\frac{f}{g}\\right)' = \\frac{f'g - fg'}{g^2}\\)</span><span>Keðja</span><span>\\(\\frac{dz}{dx} = \\frac{dz}{dy}\\cdot\\frac{dy}{dx} = f'(g(x))\\,g'(x)\\)</span><span>Andhverfa</span><span>\\(\\frac{dx}{dy} = \\frac{1}{dy/dx}\\), ef \\(f\\) er stranglega vaxandi/minnkandi</span></div>\n<p>Deilingarreglan: „neðri sinnum afleiða efri, mínus efri sinnum afleiða neðri, yfir neðri í öðru“. Keðjureglan: „ytra fallið diffrað (innra óbreytt) sinnum afleiða innra fallsins“. Á prófi: skrifaðu \\(y\\) = innra fallið, \\(\\frac{dz}{dy}\\) og \\(\\frac{dy}{dx}\\) sérstaklega áður en þú margfaldar.</p>\n<details class=\"ex\"><summary>Unnin dæmi</summary>\n\\[\\frac{d}{dx}\\left[\\frac{x^2}{x+1}\\right] = \\frac{2x(x+1) - x^2\\cdot1}{(x+1)^2} = \\frac{x^2 + 2x}{(x+1)^2}\\]\n\\[\\frac{d}{dx}(x^2 + 1)^5 = 5(x^2+1)^4\\cdot 2x = 10x(x^2+1)^4\\]\n<p>\\(y = x^3 + x \\Rightarrow \\frac{dy}{dx} = 3x^2 + 1 \\gt 0\\) (stranglega vaxandi, svo andhverfa er til) \\(\\Rightarrow \\frac{dx}{dy} = \\frac{1}{3x^2 + 1}\\).</p>\n</details>\n<p>Hagfræði: \\(\\frac{d(AC)}{dQ} = \\frac{1}{Q}(MC - AC)\\), svo \\(MC = AC\\) í lágmarki meðalkostnaðar.</p></section>"
      },
      {
        "id": "s11",
        "n": "11",
        "title": "Föll af einni breytu og útmörk",
        "html": "<section id=\"s11\"><h2><span class=\"n\">11</span>Föll af einni breytu og útmörk <span class=\"kafli\">9.1–9.4 · 11.1</span><button class=\"btn small go\" data-sgo=\"ein\">Æfa</button></h2>\n<p>Gátlistinn sem lokapróf 2023 (dæmi 3) fylgdi:</p>\n<ol><li><b>Formengi.</b> \\(\\ln(g)\\) krefst \\(g \\gt 0\\); nefnari \\(\\ne 0\\); \\(\\sqrt{g}\\) krefst \\(g \\ge 0\\).</li>\n<li><b>Vaxandi/minnkandi:</b> formerki \\(f'\\). Þáttaðu \\(f'\\) og skoðaðu formerki hvers þáttar.</li>\n<li><b>Krítískir punktar:</b> \\(f'(x) = 0\\) (FGS, nauðsynlegt). Geta verið hámörk, lágmörk eða beygjuskil.</li>\n<li><b>Flokkun (AGS, nægjanlegt):</b> \\(f''(x^*) \\lt 0\\) hámark, \\(f''(x^*) \\gt 0\\) lágmark. Ef \\(f''(x^*) = 0\\): skoða formerkjaskipti \\(f'\\).</li>\n<li><b>Hvelft/kúpt:</b> formerki \\(f''\\); beygjuskil þar sem \\(f''\\) skiptir um formerki.</li>\n<li><b>Riss:</b> skurðpunktar (\\(f(0)\\), \\(f(x) = 0\\)), krítískir punktar, aðfellur og hegðun í endum.</li></ol>\n\\[dz = f'(x)\\,dx = 0 \\;\\Rightarrow\\; f'(x) = 0 \\qquad d^2z = f''(x)\\,dx^2 \\begin{cases}\\lt 0 & \\text{hámark}\\\\ \\gt 0 & \\text{lágmark}\\end{cases}\\]\n<p><b>Staðbundið vs. algilt.</b> Algilt hámark: \\(f(x^*) \\ge f(x)\\) fyrir öll \\(x\\) í formenginu. Ef fallið er stranglega hvelft (kúpt) á öllu formenginu er krítískur punktur algilt hámark (lágmark). Þriðja stigs margliður hafa aldrei algild útmörk. Á lokuðu bili \\([a, b]\\) geta útmörk líka verið á jaðrinum.</p>\n<details class=\"ex\"><summary>Unnið dæmi: \\(f(x) = \\ln(1/x)\\) (lokapróf 2023)</summary>\n\\[f(x) = -\\ln x,\\quad D = (0, \\infty),\\quad f'(x) = -\\frac1x \\lt 0,\\quad f''(x) = \\frac{1}{x^2} \\gt 0\\]\n<p>Minnkandi og stranglega kúpt; engir krítískir punktar; skurðpunktur \\((1, 0)\\); enginn skurður við y-ás.</p>\n</details></section>"
      },
      {
        "id": "s12",
        "n": "12",
        "title": "Hlutafleiður, stigull og Hessian-fylki",
        "html": "<section id=\"s12\"><h2><span class=\"n\">12</span>Hlutafleiður, stigull og Hessian-fylki <span class=\"kafli\">7.4</span><button class=\"btn small go\" data-sgo=\"hlu\">Æfa</button></h2>\n<p>Diffraðu eins og <b>allar aðrar breytur séu fastar</b>; allar reglur úr 09–10 gilda. \\(f_{ij}\\) með \\(i \\ne j\\) er krossafleiða. <b>Setning Young</b>: \\(f_{ij} = f_{ji}\\). Notaðu það sem prófun: ef \\(f_{xy} \\ne f_{yx}\\) er villa einhvers staðar.</p>\n<details class=\"ex\"><summary>Unnið dæmi: \\(f = x^2y + 3xy^3\\)</summary>\n\\[\\begin{aligned}\nf_x &= 2xy + 3y^3 & f_y &= x^2 + 9xy^2 \\\\\nf_{xx} &= 2y & f_{yy} &= 18xy \\\\\nf_{xy} &= \\tfrac{\\partial}{\\partial y}(2xy + 3y^3) = 2x + 9y^2 & f_{yx} &= \\tfrac{\\partial}{\\partial x}(x^2 + 9xy^2) = 2x + 9y^2 \\;\\checkmark\n\\end{aligned}\\]\n</details>\n\\[\\nabla f = (f_1, \\dots, f_n) \\qquad H = \\begin{bmatrix}f_{11}&f_{12}&f_{13}\\\\f_{21}&f_{22}&f_{23}\\\\f_{31}&f_{32}&f_{33}\\end{bmatrix} = H'\\]\n<p>Röð \\(i\\) = diffrað fyrst m.t.t. \\(x_i\\); dálkur \\(j\\) = svo m.t.t. \\(x_j\\).</p></section>"
      },
      {
        "id": "s13",
        "n": "13",
        "title": "Mismunur og heildarmismunur",
        "html": "<section id=\"s13\"><h2><span class=\"n\">13</span>Mismunur og heildarmismunur <span class=\"kafli\">8.1–8.3</span><button class=\"btn small go\" data-sgo=\"mis\">Æfa</button></h2>\n\\[\\Delta y = f'(x)\\Delta x + \\delta\\Delta x \\;(\\delta \\to 0) \\qquad dy = f'(x)\\,dx \\qquad dy = \\sum_{i=1}^n f_i\\,dx_i\\]\n<p>\\(f'(x)dx\\) er sá hluti breytingarinnar sem hallinn í upphafspunktinum skýrir; nálgunin versnar eftir því sem \\(dx\\) stækkar. Heildarmismunur: (1) allar fyrstu hlutafleiður, (2) hver sinnum sinn mismun, (3) leggja saman.</p>\n<details class=\"ex\"><summary>Unnið dæmi: \\(z = x^2y + 3xy^3\\) í \\((1, 2)\\), \\(dx = 0{,}1\\), \\(dy = -0{,}1\\)</summary>\n\\[dz = (2xy + 3y^3)\\,dx + (x^2 + 9xy^2)\\,dy\\]\n\\[\\begin{aligned}\nf_x &= 2\\cdot1\\cdot2 + 3\\cdot2^3 = 4 + 24 = 28 \\\\\nf_y &= 1^2 + 9\\cdot1\\cdot2^2 = 1 + 36 = 37 \\\\\ndz &= 28(0{,}1) + 37(-0{,}1) = 2{,}8 - 3{,}7 = -0{,}9\n\\end{aligned}\\]\n</details>\n<div class=\"kv\"><span>\\(dk = 0\\)</span><span>\\(d(ku^n) = knu^{n-1}du\\)</span><span>\\(d(u \\pm v \\pm w) = du \\pm dv \\pm dw\\)</span><span>\\(d(uv) = v\\,du + u\\,dv\\)</span><span>\\(d\\!\\left(\\frac{u}{v}\\right) = \\frac{1}{v^2}(v\\,du - u\\,dv)\\)</span><span>\\(d(uvw) = vw\\,du + uw\\,dv + uv\\,dw\\)</span></div>\n<p>Sömu reglur og fyrir afleiður, með \\(du\\) í stað \\(u'\\).</p>\n<p><b>Breytur sem eru föll</b> (dæmi 34b, sjá líka kafla 14): ef \\(y = f(x, \\ln x, x + e^x)\\):</p>\n\\[dy = \\Big[f_1 + \\frac{f_2}{x} + f_3(1 + e^x)\\Big]dx\\]\n<p>Halli hæðarlínu: \\(dz = 0 \\Rightarrow \\frac{dy}{dx} = -\\frac{f_x}{f_y}\\). Vaxtarbókhald: \\(\\frac{dY}{Y} = \\alpha\\frac{dK}{K} + \\beta\\frac{dL}{L}\\) fyrir \\(Y = AK^\\alpha L^\\beta\\).</p>\n<p>Teygni (C&amp;W 8.1, ekki í nótunum): \\(\\varepsilon = \\frac{dQ}{dP}\\cdot\\frac{P}{Q}\\). \\(|\\varepsilon| \\gt 1\\) teygin, \\(\\lt 1\\) óteygin; \\(kP^{-n}\\) hefur fasta teygni \\(-n\\).</p></section>"
      },
      {
        "id": "s14",
        "n": "14",
        "title": "Heildarafleiður",
        "html": "<section id=\"s14\"><h2><span class=\"n\">14</span>Heildarafleiður <span class=\"kafli\">8.4</span><button class=\"btn small go\" data-sgo=\"mis\">Æfa</button></h2>\n<p>Ef \\(y = f(x, w)\\) og \\(x = g(w)\\) hefur \\(w\\) <b>bein</b> áhrif á \\(y\\) og <b>óbein</b> í gegnum \\(x\\). Aðferð: taka heildarmismun og deila með \\(dw\\).</p>\n\\[\\frac{dy}{dw} = \\frac{\\partial y}{\\partial x}\\frac{dx}{dw} + \\frac{\\partial y}{\\partial w}\\]\n<div class=\"kv\"><b>Tvær miðlunarbreytur</b><span>\\(y = f(x_1, x_2, w)\\), \\(x_1 = g(w)\\), \\(x_2 = h(w)\\): \\(\\frac{dy}{dw} = f_1\\frac{dx_1}{dw} + f_2\\frac{dx_2}{dw} + f_w\\)</span><b>Hlut-heildarafleiða</b><span>\\(x_1 = g(u, v)\\), \\(x_2 = h(u, v)\\): \\(\\frac{\\S y}{\\S u} = f_1\\frac{\\partial x_1}{\\partial u} + f_2\\frac{\\partial x_2}{\\partial u} + f_u\\)</span></div>\n<p>Teiknaðu flæðirit með einni ör fyrir hvern farveg: hver ör er einn liður í summunni. Lokasvarið á að vera fall af \\(w\\) einu: stingdu \\(x = g(w)\\) inn og einfaldaðu. Staðfestu með beinni innsetningu ef tími gefst.</p>\n<details class=\"ex\"><summary>Unnið dæmi: lokapróf 2025, dæmi 4d</summary>\n\\[U = \\frac{2xy}{x+y},\\quad x = 3y^2:\\qquad \\frac{dU}{dy} = \\frac{2y^2}{(x+y)^2}\\cdot 6y + \\frac{2x^2}{(x+y)^2} = \\frac{6y(3y+2)}{(3y+1)^2}\\]\n</details></section>"
      },
      {
        "id": "s15",
        "n": "15",
        "title": "Fólgin (dulin) föll",
        "html": "<section id=\"s15\"><h2><span class=\"n\">15</span>Fólgin (dulin) föll <span class=\"kafli\">8.5</span><button class=\"btn small go\" data-sgo=\"dul\">Æfa</button></h2>\n<p>Gefið samband \\(F(y, x_1, \\dots, x_m) = 0\\). <b>Setningin um fólgin föll:</b> ef (A) hlutafleiðurnar \\(F_y, F_1, \\dots, F_m\\) eru samfelldar og (B) \\(F_y \\ne 0\\) í punkti sem uppfyllir \\(F = 0\\), þá er til fólgið fall \\(y = f(x_1, \\dots, x_m)\\) í grennd við punktinn, samfellt og með samfelldar hlutafleiður.</p>\n\\[\\frac{\\partial y}{\\partial x_i} = -\\frac{F_i}{F_y} \\qquad\\qquad \\frac{dy}{dx} = -\\frac{F_x}{F_y}\\]\n<ol><li>Skrifaðu sambandið sem \\(F(\\dots) = 0\\) (allt öðrum megin).</li><li>Athugaðu að punkturinn uppfylli \\(F = 0\\).</li><li>Reiknaðu hlutafleiðurnar og taktu fram að þær séu samfelldar.</li><li>Sýndu að hlutafleiðan m.t.t. <b>háðu</b> breytunnar sé \\(\\ne 0\\) í punktinum.</li><li>Formúlan, með mínusmerkinu.</li></ol>\n<p>Skilyrðin eru <b>nægjanleg, ekki nauðsynleg</b>. Ef beðið er um \\(x = f(y)\\) þarf \\(F_x \\ne 0\\) og \\(\\frac{dx}{dy} = -\\frac{F_y}{F_x}\\). Hagfræði: jafnnytjaferill (\\(U(x, y) = u_0\\)) og jafnmagnsferill (\\(Q(K, L) = Q_0\\)); halli \\(= -\\frac{U_x}{U_y}\\).</p>\n<details class=\"ex\"><summary>Unnið dæmi: \\(x^2 + xy + y^2 = 7\\) í \\((1, 2)\\)</summary>\n\\[F_x = 2x + y = 4,\\quad F_y = x + 2y = 5 \\ne 0,\\qquad \\frac{dy}{dx} = -\\frac45\\]\n</details>\n<p class=\"notice\">Lokapróf 2025, dæmi 5: punkturinn \\(\\left(\\tfrac14, -\\tfrac14\\right)\\) uppfyllir ekki \\(3x^2 + 2xy + 4y^2 = 0\\) (gildið er \\(\\tfrac{5}{16}\\)). Ef slíkt gerist: taktu það fram og leystu fyrir hæðarlínuna gegnum punktinn.</p></section>"
      },
      {
        "id": "s16",
        "n": "16",
        "title": "Taylor- og Maclaurin-nálgun",
        "html": "<section id=\"s16\"><h2><span class=\"n\">16</span>Taylor- og Maclaurin-nálgun <span class=\"kafli\">9.5</span><button class=\"btn small go\" data-sgo=\"tay\">Æfa</button></h2>\n\\[\\phi(x) \\approx \\phi(x_0) + \\frac{\\phi'(x_0)}{1!}(x - x_0) + \\frac{\\phi''(x_0)}{2!}(x - x_0)^2 + \\dots + \\frac{\\phi^{(n)}(x_0)}{n!}(x - x_0)^n\\]\n\\[R_n = \\frac{\\phi^{(n+1)}(p)}{(n+1)!}(x - x_0)^{n+1}, \\quad p \\text{ milli } x \\text{ og } x_0\\]\n<ul><li>Maclaurin: \\(x_0 = 0\\). 1. gráða er <b>línuleg nálgun</b> = snertill í \\(x_0\\).</li>\n<li>\\(R_n\\) stækkar þegar \\(n\\) er lægra og þegar \\(x\\) er fjær \\(x_0\\).</li>\n<li>Margliða af stigi \\(n\\): \\(n\\)-ta gráðu nálgun er <b>nákvæm</b> og \\(R_n = 0\\) (því \\(\\phi^{(n+1)} = 0\\)).</li>\n<li>„Einfaldið“: margfaldaðu út \\((x - x_0)^k\\) og safnaðu saman veldum af \\(x\\).</li></ul>\n<div class=\"kv\"><span>\\(e^x\\) um 0</span><span>\\(1 + x + \\frac{x^2}{2}\\)</span><span>\\(\\ln x\\) um 1</span><span>\\((x-1) - \\frac{(x-1)^2}{2}\\)</span><span>\\(\\sqrt{x}\\) um 1</span><span>\\(1 + \\frac{x-1}{2} - \\frac{(x-1)^2}{8}\\)</span></div>\n<details class=\"ex\"><summary>Unnið dæmi: lokapróf 2025, dæmi 6</summary>\n\\[f = 4x^3 - 3x^2 + 2x + 5,\\; x_0 = 2:\\quad f(2) = 29,\\; f'(2) = 38,\\; f''(2) = 42\\]\n\\[P_1 = 38x - 47, \\qquad P_2 = 29 + 38(x-2) + 21(x-2)^2 = 21x^2 - 46x + 37, \\qquad R_3 = 0\\]\n</details></section>"
      },
      {
        "id": "s17",
        "n": "17",
        "title": "Einsleit og þenjanleg föll",
        "html": "<section id=\"s17\"><h2><span class=\"n\">17</span>Einsleit og þenjanleg föll <span class=\"kafli\">12.6–12.7</span><button class=\"btn small go\" data-sgo=\"eins\">Æfa</button></h2>\n\\[f(jx_1, \\dots, jx_n) = j^r f(x_1, \\dots, x_n) \\qquad\\qquad rf = x_1f_1 + x_2f_2 + \\dots + x_nf_n \\;\\text{(Euler)}\\]\n<ul><li>Aðferð: settu \\(jx_i\\) inn fyrir allar breytur og reyndu að þátta \\(j^r\\) út.</li>\n<li>Margliða er einsleit ef og aðeins ef allir liðir hafa sömu heildargráðu. Fasti eða stakur lægri liður (\\(-y\\) í lokaprófi 2025) brýtur einsleitni.</li>\n<li>Framleiðslufall: \\(r \\gt 1\\) stærðarhagkvæmni, \\(r = 1\\) föst (línulega einsleitt), \\(r \\lt 1\\) stærðaróhagkvæmni. Cobb-Douglas \\(AK^\\alpha L^\\beta\\): \\(r = \\alpha + \\beta\\).</li>\n<li>Línulega einsleitt fall þarf ekki að vera línulegt (t.d. \\(x^\\beta y^{1-\\beta}\\)).</li>\n<li><b>Þenjanlegt</b> (homothetic): ef \\(f(x^0) = f(x^1)\\) þá \\(f(jx^0) = f(jx^1)\\). Öll einsleit föll eru þenjanleg, ekki öfugt; t.d. \\(\\ln(Ax^\\gamma y^{1-\\gamma}) = \\ln j + f\\) er þenjanlegt en ekki einsleitt (dæmi 39).</li></ul></section>"
      },
      {
        "id": "s18",
        "n": "18",
        "title": "Hvelft, kúpt og útmörk margra breyta",
        "html": "<section id=\"s18\"><h2><span class=\"n\">18</span>Hvelft, kúpt og útmörk margra breyta <span class=\"kafli\">11.1–11.4</span><button class=\"btn small go\" data-sgo=\"hes\">Æfa</button></h2>\n<p><b>Ein breyta:</b> hvelft ⇔ \\(f'' \\le 0\\) (stranglega ef \\(\\lt 0\\)); kúpt ⇔ \\(f'' \\ge 0\\) (stranglega ef \\(\\gt 0\\)). Línulegt fall er bæði hvelft og kúpt, en hvorugt stranglega.</p>\n<details class=\"ex\"><summary>Dæmi 30 (a, b, c > 0)</summary>\n<div class=\"scroll\"><table class=\"tt\"><thead><tr><th>\\(f(x)\\)</th><th>\\(f''(x)\\)</th><th>Niðurstaða</th></tr></thead><tbody>\n<tr><td>\\(ax\\)</td><td>\\(0\\)</td><td>bæði hvelft og kúpt</td></tr>\n<tr><td>\\(a\\sqrt{x} + b\\)</td><td>\\(-\\frac{a}{4}x^{-3/2} \\lt 0\\)</td><td>stranglega hvelft</td></tr>\n<tr><td>\\(\\ln(ax + b)\\)</td><td>\\(-\\frac{a^2}{(ax+b)^2} \\lt 0\\)</td><td>stranglega hvelft</td></tr>\n<tr><td>\\(ae^{bx+c}\\)</td><td>\\(ab^2e^{bx+c} \\gt 0\\)</td><td>stranglega kúpt</td></tr></tbody></table></div>\n</details>\n\\[|H_1| = f_{11},\\qquad |H_2| = \\begin{vmatrix}f_{11}&f_{12}\\\\f_{21}&f_{22}\\end{vmatrix} = f_{11}f_{22} - f_{12}^2,\\qquad |H_3| = |H|\\]\n<div class=\"scroll\"><table class=\"tt\"><thead><tr><th></th><th>\\(|H_1|\\)</th><th>\\(|H_2|\\)</th><th>\\(|H_3|\\)</th><th>Ályktun</th></tr></thead><tbody>\n<tr><td>Hvelft</td><td>\\(\\le 0\\)</td><td>\\(\\ge 0\\)</td><td>\\(\\le 0\\)</td><td>FGS gefa hámark</td></tr>\n<tr><td>Kúpt</td><td>\\(\\ge 0\\)</td><td>\\(\\ge 0\\)</td><td>\\(\\ge 0\\)</td><td>FGS gefa lágmark</td></tr>\n<tr><td>Hámark í \\(x^*\\)</td><td>\\(\\lt 0\\)</td><td>\\(\\gt 0\\)</td><td>\\(\\lt 0\\)</td><td>formerkin skiptast</td></tr>\n<tr><td>Lágmark í \\(x^*\\)</td><td>\\(\\gt 0\\)</td><td>\\(\\gt 0\\)</td><td>\\(\\gt 0\\)</td><td>öll jákvæð</td></tr></tbody></table></div>\n<p>Tvær breytur: ef \\(|H_2| \\gt 0\\) ræður formerki \\(f_{11}\\) (neikvætt: stranglega hvelft/hámark; jákvætt: stranglega kúpt/lágmark). Ef \\(|H_2| \\lt 0\\): <b>hvorki</b> hvelft né kúpt, og stöðupunktur er <b>söðulpunktur</b>. Dæmi: \\(f = x^2y + 1\\) gefur \\(|H_2| = 2y\\cdot 0 - (2x)^2 = -4x^2 \\lt 0\\).</p>\n<details class=\"ex\"><summary>Unnið dæmi: \\(x^ay^b\\), \\(a + b \\lt 1\\)</summary>\n\\[\\begin{aligned}\nf_{xx} &= a(a-1)x^{a-2}y^b, \\quad f_{yy} = b(b-1)x^a y^{b-2}, \\quad f_{xy} = ab\\,x^{a-1}y^{b-1} \\\\[4pt]\n|H_1| &= a(a-1)x^{a-2}y^b \\lt 0 \\quad (\\text{því } 0 \\lt a \\lt 1) \\\\[4pt]\n|H_2| &= ab(a-1)(b-1)\\,x^{2a-2}y^{2b-2} - a^2b^2\\,x^{2a-2}y^{2b-2} \\\\\n&= ab\\,x^{2a-2}y^{2b-2}\\big[(1-a)(1-b) - ab\\big] \\\\\n&= ab\\,x^{2a-2}y^{2b-2}\\,(1 - a - b) \\gt 0\n\\end{aligned}\\]\n<p>Stranglega hvelft. Lykilskrefið er að þátta sameiginlega veldið út áður en formerkið er metið. Með stuðli \\(A\\): \\(|H_2| = A^2ab(1-a-b)x^{2a-2}y^{2b-2}\\), svo \\(a + b = 1\\) gefur hvelft (ekki stranglega) og \\(a + b \\gt 1\\) hvorugt.</p>\n</details>\n<p><b>Útmörk tveggja breyta</b> (nótur 20): FGS \\(f_x = f_y = 0\\). AGS með öðrum heildarmismun:</p>\n\\[d^2z = f_{xx}\\,dx^2 + 2f_{xy}\\,dx\\,dy + f_{yy}\\,dy^2 \\quad\\begin{cases}\\lt 0 \\iff f_{xx} \\lt 0,\\; f_{yy} \\lt 0,\\; f_{xx}f_{yy} \\gt f_{xy}^2 & \\text{hámark}\\\\ \\gt 0 \\iff f_{xx} \\gt 0,\\; f_{yy} \\gt 0,\\; f_{xx}f_{yy} \\gt f_{xy}^2 & \\text{lágmark}\\end{cases}\\]\n<p><b>n breytur</b> (nótur 21): hámark ef \\(|H_i| \\lt 0\\) fyrir oddatölu \\(i\\) og \\(\\gt 0\\) fyrir slétta; lágmark ef \\(|H_i| \\gt 0\\) fyrir öll \\(i\\). Ef \\(H\\) er fast og formerkin gilda alls staðar er útmarkið algilt.</p>\n<p><b>Samsetningar</b> (dæmi 32): summa hvelfdra er hvelf; \\(p \\gt 0\\) sinnum heldur eiginleikanum; \\(-\\)(kúpt) er hvelft. Því er \\(\\pi = pY - C\\) hvelft.</p>\n<p class=\"hint\">Tæknileg athugasemd: prófið með leiðandi höfuðhlutákveðum er öruggt fyrir <b>strangar</b> niðurstöður. Fyrir \\(\\le\\), \\(\\ge\\) þarf strangt til tekið að skoða allar höfuðhlutákveður. Notaðu útgáfuna úr tímanum á prófinu, en vittu að munurinn er til.</p></section>"
      },
      {
        "id": "s19",
        "n": "19",
        "title": "Hámörkun og umslagssetningin",
        "html": "<section id=\"s19\"><h2><span class=\"n\">19</span>Hámörkun og umslagssetningin <span class=\"kafli\">11.4 · 13.5</span><button class=\"btn small go\" data-sgo=\"ham\">Æfa</button></h2>\n<p><b>Uppskrift að hámörkunardæmi</b> (lokapróf 2023, dæmi 4 og 2025, dæmi 7):</p>\n<ol><li>Ritaðu vandann formlega: \\(\\max_{K,L}\\; \\pi = pQ(K, L) - rK - wL\\).</li>\n<li>FGS: \\(\\pi_K = 0\\), \\(\\pi_L = 0\\); leystu sem fall af ytri breytum.</li>\n<li>AGS: Hessian og leiðandi höfuðhlutákveður (\\(-, +, -\\) hámark; \\(+, +, +\\) lágmark).</li>\n<li>Samanburðarstöðugreining: diffraðu \\(K^*(p)\\) og túlkaðu formerkið hagfræðilega.</li>\n<li>Virðisfall og umslagssetning.</li></ol>\n\\[V(\\phi) = f\\big(x^*(\\phi), y^*(\\phi), \\phi\\big), \\qquad \\frac{dV}{d\\phi} = \\underbrace{f_x\\frac{\\partial x^*}{\\partial\\phi} + f_y\\frac{\\partial y^*}{\\partial\\phi}}_{= 0 \\text{ því } f_x = f_y = 0} + f_\\phi = \\frac{\\partial f}{\\partial\\phi}\\Big|_{x^*, y^*}\\]\n<p><b>Virðisfallið</b> gefur hámarksgildi markmiðsfallsins sem fall af ytri breytu. Umslagssetningin: áhrif ytri breytu á hámarkið fást með því að diffra markmiðsfallið <b>beint</b> m.t.t. hennar og meta í hámarkinu. Fyrir hagnað: \\(\\frac{dV}{dp} = Q(K^*, L^*)\\), \\(\\frac{dV}{dw} = -L^*\\).</p>\n<details class=\"ex\"><summary>Unnið dæmi: lokapróf 2023, dæmi 4</summary>\n\\[\\pi = p(-K^2 - L^2 + 4L + 2K) - 2K - 4L, \\qquad K^* = 1 - \\frac1p, \\quad L^* = 2 - \\frac2p\\]\n\\[|H_1| = -2p \\lt 0, \\quad |H_2| = 4p^2 \\gt 0, \\qquad \\frac{dV}{dp} = Q^* = 5 - \\frac{5}{p^2} = 4{,}95 \\text{ í } p = 10\\]\n</details></section>"
      },
      {
        "id": "s20",
        "n": "20",
        "title": "Gildrur",
        "html": "<section id=\"s20\"><h2><span class=\"n\">20</span>Gildrur<button class=\"btn small go\" data-sq=\"all\">Hraðæfing</button></h2>\n<div class=\"trap\">\n<b>✗</b><span>Formengi: gleyma að \\(\\ln(g)\\) krefst \\(g \\gt 0\\) eða að nefnari má ekki vera 0.</span>\n<b>✗</b><span>Kalla krítískan punkt hámark án AGS. \\(f'' = 0\\) segir ekkert eitt og sér.</span>\n<b>✗</b><span>Heildarafleiða: gleyma beinu áhrifunum \\(\\partial y/\\partial w\\), eða skila svari sem fall af bæði \\(x\\) og \\(w\\).</span>\n<b>✗</b><span>Fólgin föll: gleyma mínusmerkinu í \\(-F_x/F_y\\), eða athuga ekki að punkturinn uppfylli \\(F = 0\\).</span>\n<b>✗</b><span>Taylor: gleyma að deila með \\(n!\\), eða skilja eftir \\((x - x_0)^2\\) þegar beðið er um að einfalda.</span>\n<b>✗</b><span>Einsleitni: segja „gráða 2“ þegar einn liður hefur aðra gráðu. Þá er fallið ekki einsleitt.</span>\n<b>✗</b><span>Umslagssetning: diffra \\(f\\) en gleyma að meta í \\((x^*, y^*)\\), eða bæta óbeinu áhrifunum við.</span>\n<b>✗</b><span>Margfalda án þess að athuga víddir. Skrifaðu \\((m\\times n)(n\\times p)\\) fyrst.</span>\n<b>✗</b><span>\\(AB = BA\\). Almennt ekki; reiknaðu bæði ef spurt er.</span>\n<b>✗</b><span>\\((AB)' = A'B'\\) eða \\((AB)^{-1} = A^{-1}B^{-1}\\). Röðin snýst: \\(B'A'\\) og \\(B^{-1}A^{-1}\\).</span>\n<b>✗</b><span>\\((A + B)^{-1} = A^{-1} + B^{-1}\\) (stendur í nótum 9). Engin slík regla til.</span>\n<b>✗</b><span>\\(dA^{-1}\\) í stað \\(A^{-1}d\\).</span>\n<b>✗</b><span>Ákveða fylkis sem er ekki ferningsfylki. Er ekki til; segðu það.</span>\n<b>✗</b><span>Gleyma \\((-1)^{i+j}\\). Skrifaðu skákborðsmynstrið til hliðar.</span>\n<b>✗</b><span>Gleyma að bylta fylgiþáttafylkinu. Adj er \\(C'\\), ekki \\(C\\).</span>\n<b>✗</b><span>\\(|2A| = 2|A|\\). Rétt er \\(2^n|A|\\).</span>\n<b>✗</b><span>Í Cramer: skipta út <b>röð</b> í stað dálks, eða gleyma að deila með \\(|A|\\).</span>\n<b>✗</b><span>\\(-(x - 3) = -x - 3\\). Svigar utan um neikvæðar tölur: \\(3\\cdot(-2)\\).</span>\n<b>✗</b><span>Víxlaður teljari í deilingarreglu: \\(fg' - f'g\\). Rétt: \\(f'g - fg'\\).</span>\n<b>✗</b><span>Gleyma innri afleiðu: \\((g^n)' = ng^{n-1}\\cdot g'\\), og \\((e^{3x})' \\ne e^{3x}\\).</span>\n<b>✗</b><span>Diffra breytu sem á að vera föst. Einfaldaðu \\(\\ln\\) og \\(e^{\\ln z} = z\\) fyrst.</span>\n<b>✗</b><span>Hvelft og kúpt víxlað. Hvelft = ∩ = \\(f'' \\le 0\\); kúpt = ∪ = \\(f'' \\ge 0\\).</span>\n<b>✗</b><span>Meta formerki \\(|H_2|\\) áður en sameiginlega veldið er þáttað út. Þáttaðu fyrst; þá sést formerkið á svigunum.</span>\n<b>✗</b><span>Segja „lágmark“ þegar \\(|H_2| \\lt 0\\). Það er söðulpunktur, hvað sem \\(|H_1|\\) segir.</span>\n</div></section>"
      },
      {
        "id": "s21",
        "n": "21",
        "title": "Frágangur og vinnubrögð",
        "html": "<section id=\"s21\"><h2><span class=\"n\">21</span>Frágangur og vinnubrögð</h2>\n<ol><li>Lestu allt prófið fyrst. Byrjaðu á fylkjadæmunum ef þau eru vélræn; þau gefa örugg stig.</li>\n<li>Skrifaðu regluna eða formúluna áður en þú stingur inn tölum. Það gefur hlutastig þótt reikningurinn klikki.</li>\n<li>Skrifaðu víddir undir hvert fylki: \\(\\underset{2\\times 3}{A}\\,\\underset{3\\times 2}{B}\\).</li>\n<li>Merktu hverja raðaðgerð (\\(R_2 - 2R_1\\)) og eftir hvaða röð eða dálki þú liðar.</li>\n<li>Prófaðu þegar það er ódýrt: eitt stak í \\(AA^{-1}\\), lausn inn í jöfnu, \\(f_{xy} = f_{yx}\\), Markov-summa = 1. Taktu fram að prófunin gangi upp.</li>\n<li>Svaraðu spurningunni í orðum: „\\(|A| = 8 \\ne 0\\) svo fylkið er andhverfanlegt“, „fallið er hvelft því …“.</li>\n<li>Haltu brotum sem brotum (\\(\\frac13\\), ekki 0,333) og þáttaðu út úr fylkjum: \\(A^{-1} = \\frac13[\\dots]\\).</li>\n<li>Tími: 180 mín. á 100 stig, um 1,8 mín. á stig. Dæmi sem gildir 15% á að taka um 25 mínútur, 30% um 50.</li></ol>\n<h3>Æfingaröð</h3>\n<div class=\"stack\" style=\"gap:8px\">\n<div class=\"row\"><button class=\"btn small\" data-sgo=\"ein,mis,dul,tay,eins,ham\" data-kind=\"blad\">Dæmablað 12–16, 35–46</button><span class=\"hint\">Nýja efnið fyrst.</span></div>\n<div class=\"row\"><button class=\"btn small\" data-exam=\"L23\">Lokapróf 2023 á tíma</button><span class=\"hint\">3 klst., á pappír.</span></div>\n<div class=\"row\"><button class=\"btn small\" data-exam=\"L25\">Lokapróf 2025 á tíma</button><span class=\"hint\">3 klst., á pappír.</span></div>\n<div class=\"row\"><button class=\"btn small\" data-sgo=\"akv,and,jof\" data-kind=\"blad\">Dæmi 26–29</button><span class=\"hint\">Fylkjahlutinn er 30–35% af prófinu.</span></div>\n</div></section>"
      }
    ]
  },
  "plan": {
    "eyebrow": "17. – 25. nóv.",
    "title": "Áætlun fram að lokaprófi",
    "intro": "Byggð á Google Calendar og Ugla-stundatöflunni þinni og vöktunum á Laugó. Endurskipulögð 17. nóv. eftir sjálfsmatinu: kaflarnir sem fengu 0–3 (Taylor, einsleitni, hámörkun, fólgin föll) koma fyrst. Tvö heil 3 klst. próf á pappír (21. og 23. nóv.), léttur dagur fyrir próf. HAG101G er fyrsta lokaprófið; næsta er HAG108G 1. des.",
    "days": [
      {
        "date": "2026-11-12",
        "label": "Fimmtudagur 12. – mánudagur 16. nóv.",
        "cal": "Fyrri hluti áætlunarinnar",
        "note": "Sjálfsmatið 17. nóv. sýnir að Taylor, einsleitni og hámörkun (0/10) og fólgin föll (3/10) eru eftir. Áætlunin héðan í frá setur þau fremst: saman eru þau um helmingur prófsins.",
        "items": []
      },
      {
        "date": "2026-11-17",
        "label": "Þriðjudagur 17. nóv.",
        "cal": "HAG101G 13:20 · Fjármálahagfræði til 19:00",
        "items": [
          {
            "at": "19:45",
            "m": 40,
            "h": "Taylor 1: lesa kafla 16 og leysa unnu dæmin",
            "p": "Lestu kaflann, lokaðu honum og leystu dæmablað 41 og lokapróf 2025 dæmi 6 á blað.",
            "go": {
              "v": "sheet",
              "sec": "s16"
            }
          },
          {
            "at": "20:25",
            "m": 10,
            "h": "Hlé",
            "brk": true
          },
          {
            "at": "20:35",
            "m": 40,
            "h": "Taylor 2: rafalar",
            "p": "Margliður og e, ln, rót. Markmið: þrjú dæmi í röð með fullt hús.",
            "go": {
              "v": "practice",
              "topics": [
                "tay"
              ]
            }
          }
        ]
      },
      {
        "date": "2026-11-18",
        "label": "Miðvikudagur 18. nóv.",
        "cal": "HAG108G 10:00 · HAG107G 14:10 · HAG103G dæmat. 16:40 · Laugó 19:00",
        "items": [
          {
            "at": "08:00",
            "m": 40,
            "h": "Hámörkun 1: umslagssetningin",
            "p": "Lestu kafla 19. Leystu dæmablað 46 og ný dæmi um virðisfall með einni breytu.",
            "go": {
              "v": "sheet",
              "sec": "s19"
            }
          },
          {
            "at": "08:40",
            "m": 10,
            "h": "Hlé",
            "brk": true
          },
          {
            "at": "08:50",
            "m": 45,
            "h": "Hámörkun 2: virðisfall í æfingu",
            "go": {
              "v": "practice",
              "topics": [
                "ham"
              ]
            }
          },
          {
            "at": "12:00",
            "m": 40,
            "h": "Einsleitni og Euler",
            "p": "Lestu kafla 17. Dæmablað 39–40 og rafalarnir. Lærðu prófið: settu jx inn og þáttaðu út j^r.",
            "go": {
              "v": "practice",
              "topics": [
                "eins"
              ]
            }
          },
          {
            "at": "12:40",
            "m": 10,
            "h": "Hlé",
            "brk": true
          },
          {
            "at": "12:50",
            "m": 30,
            "h": "Hraðæfing: Taylor, einsleitni, umslag",
            "go": {
              "v": "quick",
              "topics": [
                "tay",
                "eins",
                "ham"
              ]
            }
          }
        ]
      },
      {
        "date": "2026-11-19",
        "label": "Fimmtudagur 19. nóv.",
        "cal": "HAG103G 08:20 · HAG101G 11:40 (síðasti tími) · tímar til 18:10",
        "note": "Spurðu í tímanum kl. 11:40 um það sem þú festist í í hámörkun eða Taylor.",
        "items": [
          {
            "at": "10:00",
            "m": 40,
            "h": "Fólgin föll 1",
            "p": "Lestu kafla 15. Skrifaðu skilyrðin fimm upp og leystu dæmablað 36–37.",
            "go": {
              "v": "sheet",
              "sec": "s15"
            }
          },
          {
            "at": "10:40",
            "m": 10,
            "h": "Hlé",
            "brk": true
          },
          {
            "at": "10:50",
            "m": 40,
            "h": "Fólgin föll 2",
            "p": "Dæmablað 38, lokapróf 2023 dæmi 5 og 2025 dæmi 5, rafallinn.",
            "go": {
              "v": "practice",
              "topics": [
                "dul"
              ]
            }
          },
          {
            "at": "20:00",
            "m": 50,
            "h": "Hámörkun 3: heilt hagnaðardæmi",
            "p": "Lokapróf 2023 dæmi 4 á 50 mín., svo yfirferð.",
            "go": {
              "v": "practice",
              "topics": [
                "ham"
              ],
              "kind": "old"
            }
          }
        ]
      },
      {
        "date": "2026-11-20",
        "label": "Föstudagur 20. nóv.",
        "cal": "Dæmatímar 11:40–16:30",
        "note": "Engin Laugó-vakt er í dagatalinu. Ef þú átt vakt, færðu kvöldblokkina.",
        "items": [
          {
            "at": "08:30",
            "m": 45,
            "h": "Heildarmismunur og heildarafleiður",
            "p": "Kaflar 13–14 (mat 5 og 6). Dæmablað 34–35, lokapróf 2025 dæmi 4 og flæðirit í hvert sinn.",
            "go": {
              "v": "practice",
              "topics": [
                "mis"
              ]
            }
          },
          {
            "at": "09:15",
            "m": 10,
            "h": "Hlé",
            "brk": true
          },
          {
            "at": "09:25",
            "m": 45,
            "h": "Hámörkun 4: Hessian og samanburðarstöðugreining",
            "p": "Dæmablað 44–45, lokapróf 2025 dæmi 7.",
            "go": {
              "v": "practice",
              "topics": [
                "ham",
                "hes"
              ]
            }
          },
          {
            "at": "19:00",
            "m": 40,
            "h": "Rafalar: Taylor og fólgin föll",
            "go": {
              "v": "practice",
              "topics": [
                "tay",
                "dul"
              ],
              "kind": "gen"
            }
          },
          {
            "at": "19:40",
            "m": 10,
            "h": "Hlé",
            "brk": true
          },
          {
            "at": "19:50",
            "m": 20,
            "h": "Uppfæra sjálfsmatið á Blaðinu",
            "p": "Gefðu köflum 13–19 nýja einkunn; forgangsröðin á Yfirliti uppfærist.",
            "go": {
              "v": "sheet",
              "sec": "s13"
            }
          }
        ]
      },
      {
        "date": "2026-11-21",
        "label": "Laugardagur 21. nóv.",
        "cal": "Engir tímar",
        "items": [
          {
            "at": "10:00",
            "m": 180,
            "h": "Lokapróf 2025 á tíma, á pappír",
            "p": "3 klst. án hlés, sími í annað herbergi.",
            "go": {
              "v": "exam",
              "start": "L25"
            },
            "exam": true
          },
          {
            "at": "13:00",
            "m": 45,
            "h": "Hádegismatur",
            "brk": true
          },
          {
            "at": "13:45",
            "m": 45,
            "h": "Gefa sér stig",
            "go": {
              "v": "exam"
            }
          },
          {
            "at": "14:30",
            "m": 15,
            "h": "Hlé",
            "brk": true
          },
          {
            "at": "14:45",
            "m": 40,
            "h": "Æfa villurnar strax",
            "go": {
              "v": "practice",
              "review": true
            }
          }
        ]
      },
      {
        "date": "2026-11-22",
        "label": "Sunnudagur 22. nóv.",
        "cal": "Engir tímar",
        "items": [
          {
            "at": "10:00",
            "m": 45,
            "h": "Efst í forgangsröðinni",
            "p": "Yfirlitið velur flokkana út frá sjálfsmati og æfingu.",
            "go": {
              "v": "weak"
            }
          },
          {
            "at": "10:45",
            "m": 15,
            "h": "Hlé",
            "brk": true
          },
          {
            "at": "11:00",
            "m": 45,
            "h": "Ákveður og andhverfa",
            "p": "Mat 6,5 og 7: 4×4 Laplace (miðannarpróf 2025 dæmi 3) og aðoka fylki.",
            "go": {
              "v": "practice",
              "topics": [
                "akv",
                "and"
              ]
            }
          },
          {
            "at": "14:00",
            "m": 40,
            "h": "Föll af einni breytu",
            "p": "Mat 6: lokapróf 2023 dæmi 3 og dæmablað 43.",
            "go": {
              "v": "practice",
              "topics": [
                "ein"
              ]
            }
          },
          {
            "at": "20:00",
            "m": 20,
            "h": "Blaðið: kaflar 15–19",
            "go": {
              "v": "sheet",
              "sec": "s15"
            }
          }
        ]
      },
      {
        "date": "2026-11-23",
        "label": "Mánudagur 23. nóv.",
        "cal": "Laugó 17:30",
        "items": [
          {
            "at": "09:00",
            "m": 180,
            "h": "Lokapróf 2023 á tíma, á pappír",
            "p": "Síðasta heila prófið. Ef þú tókst það 15. nóv., taktu blandað próf í staðinn.",
            "go": {
              "v": "exam",
              "start": "L23"
            },
            "exam": true
          },
          {
            "at": "12:00",
            "m": 45,
            "h": "Hádegismatur",
            "brk": true
          },
          {
            "at": "12:45",
            "m": 45,
            "h": "Yfirferð",
            "go": {
              "v": "exam"
            }
          }
        ]
      },
      {
        "date": "2026-11-24",
        "label": "Þriðjudagur 24. nóv.",
        "cal": "Engir tímar",
        "note": "Léttur dagur. Ekkert nýtt efni og snemma í háttinn.",
        "items": [
          {
            "at": "10:00",
            "m": 40,
            "h": "Tæma villubankann",
            "go": {
              "v": "wrong"
            }
          },
          {
            "at": "10:40",
            "m": 15,
            "h": "Hlé",
            "brk": true
          },
          {
            "at": "10:55",
            "m": 30,
            "h": "Blaðið utanbókar",
            "p": "Skrifaðu reglurnar í köflum 14–19 á autt blað og berðu saman.",
            "go": {
              "v": "sheet",
              "sec": "s14"
            }
          },
          {
            "at": "16:00",
            "m": 20,
            "h": "Hraðæfing",
            "go": {
              "v": "quick"
            }
          }
        ]
      },
      {
        "date": "2026-11-25",
        "label": "Miðvikudagur 25. nóv. · prófdagur",
        "cal": "Laugó 19:00",
        "note": "Ekkert nýtt efni í dag.",
        "items": [
          {
            "at": "09:30",
            "m": 20,
            "h": "Gildrur og frágangur",
            "p": "Kaflar 20 og 21 á Blaðinu.",
            "go": {
              "v": "sheet",
              "sec": "s20"
            }
          },
          {
            "at": "09:50",
            "m": 10,
            "h": "Hlé",
            "brk": true
          },
          {
            "at": "10:00",
            "m": 15,
            "h": "Tíu hraðspurningar til upphitunar",
            "go": {
              "v": "quick"
            }
          },
          {
            "at": "13:00",
            "m": 20,
            "h": "Mæta í Á301",
            "p": "Skriffæri, skilríki, vatn."
          },
          {
            "at": "13:30",
            "m": 180,
            "h": "Lokaprófið",
            "p": "Lestu öll dæmin fyrst. Byrjaðu á fylkjunum.",
            "exam": true
          }
        ]
      }
    ]
  },
  "examInfo": {
    "title": "Lokaprófið",
    "note": "Vægið er á 100 stiga skala og byggt á lokaprófum 2023 og 2025. * = flokkar deila dæmi: fylki/ákveða/andhverfa 15, ein breyta/diffrun 10, fólgin föll/einsleitni 10, hámörkun/Hessian 25. Hlutafleiður koma fyrir í flestum dæmum. „Mat“ er sjálfsmatið af Blaðinu (0–10). „Skrifleg“ er hlutfall stiga sem þú hakaðir rétt.",
    "facts": [
      {
        "value": "3 klst.",
        "label": "skriflegt, svarað á skannblöð"
      },
      {
        "value": "6–7",
        "label": "dæmi yfir allt námskeiðið"
      },
      {
        "value": "0",
        "label": "reiknivélar og hjálpargögn"
      },
      {
        "value": "Á301",
        "label": "mið. 25. nóv., kl. 13:30"
      }
    ]
  },
  "passScore": 1,
  "sourceLabels": {
    "sheet": "Dæmablað",
    "new": "Ný dæmi"
  },
  "quickGens": [
    "g-mul",
    "g-trans",
    "g-vec",
    "g-markov",
    "g-det3",
    "g-detprop",
    "g-rank",
    "g-inv2",
    "g-inv3",
    "g-cr2",
    "g-prod",
    "g-quot",
    "g-chain",
    "g-invfn",
    "g-partial",
    "g-hess2",
    "g-hess3",
    "g-cd",
    "g-dy",
    "g-totd",
    "g-elast",
    "g-cubic",
    "g-totder",
    "g-implicit",
    "g-taylor",
    "g-taylor2",
    "g-homog",
    "g-cdhomog",
    "g-profit",
    "g-envelope"
  ],
  "legacy": {
    "key": "hag101g-lokaprof-v1",
    "file": "HAG101G lokapróf.html"
  },
  "self": {
    "sections": {
      "1": "fyl",
      "2": "fyl",
      "3": "and",
      "4": "fyl",
      "5": "akv",
      "6": "akv",
      "7": "and",
      "8": "jof",
      "9": "dif",
      "10": "dif",
      "11": "ein",
      "12": "hlu",
      "13": "mis",
      "14": "mis",
      "15": "dul",
      "16": "tay",
      "17": "eins",
      "18": "hes",
      "19": "ham"
    },
    "initial": {
      "1": 8,
      "2": 9,
      "3": 8,
      "4": 8,
      "5": 8,
      "6": 6.5,
      "7": 7,
      "8": 7,
      "9": 8,
      "10": 8,
      "11": 6,
      "12": 7.5,
      "13": 5,
      "14": 6,
      "15": 3,
      "16": 0,
      "17": 0,
      "18": 7,
      "19": 0
    },
    "at": "17. nóv."
  },
  "examWeights": {
    "fyl": 7,
    "akv": 6,
    "and": 6,
    "jof": 15,
    "dif": 3,
    "ein": 10,
    "hlu": 3,
    "mis": 8,
    "dul": 11,
    "eins": 4,
    "tay": 12,
    "hes": 8,
    "ham": 22
  }
};

/** @type {import('../schema.js').Course} */
export default adapt(meta, L);
