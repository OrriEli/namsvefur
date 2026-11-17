// Búið til af scripts/extract-legacy.js úr legacy/HAG106G prófæfing.html. Ekki breyta í höndunum.
import * as L from './legacy/hag106g.js';
import adapt from './adapters/lecture.js';

export const meta = {
  "id": "hag106g",
  "code": "HAG106G",
  "name": "Fjármálahagfræði I",
  "short": "Fjármál",
  "color": "--c-hag106g",
  "engine": "lecture",
  "topics": [
    {
      "id": "F1",
      "name": "Fjármálaumhverfið",
      "ref": "Kafli 1"
    },
    {
      "id": "F2",
      "name": "Markaðir, peningakerfi og stofnanir",
      "ref": "1.5, 2, 3.1–3.3, 3.7"
    },
    {
      "id": "F3",
      "name": "Vextir",
      "ref": "3.8, 8"
    },
    {
      "id": "F4",
      "name": "Tímavirði peninga",
      "ref": "9"
    },
    {
      "id": "F5",
      "name": "Skuldabréf og hlutabréf",
      "ref": "10"
    },
    {
      "id": "F6",
      "name": "Útboð, viðskipti og afleiður",
      "ref": "11 + afleiður"
    },
    {
      "id": "F7",
      "label": "F7–F8",
      "name": "Ávöxtun og áhætta",
      "ref": "12",
      "members": [
        "F7",
        "F8"
      ]
    },
    {
      "id": "F9",
      "name": "Arðsemismat fjárfestinga",
      "ref": "17"
    },
    {
      "id": "F10",
      "name": "Fjármagnsskipan og fjármagnskostnaður",
      "ref": "18.1–18.4"
    }
  ],
  "levels": {
    "1": {
      "name": "Grunnur",
      "desc": "Skilgreining, hugtak eða ein formúla með beinni innsetningu."
    },
    "2": {
      "name": "Prófstig",
      "desc": "2–4 skref, ein sérvenja eða gildra sem þarf að varast."
    },
    "3": {
      "name": "Erfitt",
      "desc": "Margþrepa, öfug spurning, tenging fyrirlestra eða túlkun."
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
      "id": "blandad",
      "name": "Próf á tíma",
      "desc": "Skriflegt lokapróf, 50% af einkunn. Snið óstaðfest.",
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
        }
      }
    }
  ],
  "sheet": {
    "head": "\n    <div class=\"stack\" style=\"gap:6px\"><span class=\"eyebrow\">Formúlublað · sérvenjur · gildrur</span><h1>Blaðið</h1><p class=\"muted\" style=\"max-width:64ch\">Allt sem þarf að muna, eftir fyrirlestrum. Sérvenjur námskeiðsins eru efst því þær kosta flest stig.</p></div>\n    ",
    "sections": [
      {
        "id": "hag106g-!",
        "n": "!",
        "title": "Sérvenjur námskeiðsins",
        "html": "<section><h2><span class=\"n\">!</span>Sérvenjur námskeiðsins</h2><div class=\"scroll\"><table class=\"tt\"><thead><tr><th>Þegar…</th><th>…þá</th></tr></thead><tbody><tr><td>Skuldabréf með fleiri en eina greiðslu á ári</td><td>Íslenska leiðin: árlegir vaxtavextir, (1 + r)<sup>0,5</sup>. Bandaríska aðeins ef beðið er um hana.</td></tr><tr><td>Raunvextir af láni eða innláni</td><td>Nákvæm Fisher</td></tr><tr><td>Jafnvægisverðbólga verðtryggt vs óverðtryggt</td><td>Nákvæm Fisher</td></tr><tr><td>Verðbólguvæntingar úr RIKB og RIKS</td><td><b>Einfaldur frádráttur</b> (6,74 − 2,88 = 3,86%)</td></tr><tr><td>IP í r = RR + IP + DRP + MRP + LP</td><td>Einfaldur frádráttur</td></tr><tr><td>Tímabil í dögum</td><td>360 daga ár</td></tr><tr><td>Ekkert tekið fram</td><td>Ársvextir, reiknaðir einu sinni á ári, greitt í lok tímabils</td></tr><tr><td>Tveggja þrepa DDM</td><td>P<sub>n</sub> byggir á D<sub>n+1</sub> og er núvirt með (1 + r)<sup>n</sup></td></tr><tr><td>Greitt í upphafi tímabils</td><td>PVAD = PVA × (1 + r) og FVAD = FVA × (1 + r)</td></tr><tr><td>Kenningar um vaxtaróf</td><td>Allar þrjár geta átt við samtímis</td></tr><tr><td>Afvöxtunarstuðlar</td><td>Óbrúnaðir (NPV A = 1.987, glæra 1.982)</td></tr><tr><td>Beta og WACC (F10)</td><td>Óbrúnuð millistig (β<sub>Ó</sub> = 0,8824, glæra 0,88); lokasvarið rúnast eins (8,6%)</td></tr></tbody></table></div></section>"
      },
      {
        "id": "hag106g-F1",
        "n": "F1",
        "title": "Fjármálaumhverfið",
        "html": "<section><h2><span class=\"n\">F1</span>Fjármálaumhverfið</h2><div class=\"scroll\"><ul><li>Sex lögmál: tímavirði · áhætta krefst ávöxtunar · dreifing · skilvirkir markaðir · umboðsvandi · orðspor</li><li>Fjórir þættir kerfisins: löggjöf og eftirlit · peningakerfið · fjármálastofnanir · fjármálamarkaðir</li></ul>\n    <div class=\"f\"><table class=\"cl\"><tr><td>E(X)</td><td class=\"eq\">=</td><td>Σ p<sub>i</sub> x<sub>i</sub></td></tr><tr><td>Jafnvægislíkur: (1 − p) × x<sub>góð</sub></td><td class=\"eq\">=</td><td>E(B)</td></tr></table></div></div></section>"
      },
      {
        "id": "hag106g-F2",
        "n": "F2",
        "title": "Markaðir, peningakerfi og stofnanir",
        "html": "<section><h2><span class=\"n\">F2</span>Markaðir, peningakerfi og stofnanir</h2><div class=\"scroll\"><div class=\"f\"><table class=\"cl\"><tr><td>Eiginfjárhlutfall</td><td class=\"eq\">=</td><td>(virði − lán) / virði</td></tr><tr><td>LTV</td><td class=\"eq\">=</td><td>lán / virði · hámarksfall</td><td class=\"eq\">=</td><td>1 − LTV</td></tr><tr><td>Endurheimt</td><td class=\"eq\">=</td><td>það sem kröfuhafi fær / krafa</td></tr><tr><td>R<sub>ISK</sub></td><td class=\"eq\">=</td><td>(1 + R<sub>USD</sub>) × S<sub>1</sub>/S<sub>0</sub> − 1</td></tr></table></div><ul><li>Kröfuröð (staðfest): veðtryggðir → óveðtryggðir (skuldabréf) → forgangshluthafar → almennir hluthafar</li><li>Repo og seðlabankafé: enginn eftirmarkaður</li></ul></div></section>"
      },
      {
        "id": "hag106g-F3",
        "n": "F3",
        "title": "Vextir",
        "html": "<section><h2><span class=\"n\">F3</span>Vextir</h2><div class=\"scroll\"><div class=\"f\"><table class=\"cl\"><tr><td>r</td><td class=\"eq\">=</td><td>RR + IP + DRP + MRP + LP</td></tr><tr><td>Ríkisvíxill: r</td><td class=\"eq\">=</td><td>RR + IP · langt ríkisbréf: r</td><td class=\"eq\">=</td><td>RR + IP + MRP</td></tr><tr><td>r<sub>fyrirtæki</sub> − r<sub>ríki</sub> (sami líftími)</td><td class=\"eq\">=</td><td>DRP + LP</td></tr><tr><td>(1 + i)</td><td class=\"eq\">=</td><td>(1 + r)(1 + π)</td></tr><tr><td>r</td><td class=\"eq\">=</td><td>(1 + i)/(1 + π) − 1 · π*</td><td class=\"eq\">=</td><td>(1 + i)/(1 + r) − 1</td></tr><tr><td>IP markaðarins</td><td class=\"eq\">=</td><td>RIKB − RIKS (frádráttur)</td></tr><tr><td>Flatir vextir: P × r × d/360</td></tr><tr><td>Common equity</td><td class=\"eq\">=</td><td>EF / eignir · Tier 1</td><td class=\"eq\">=</td><td>(EF + TP − óefnisl.) / RWA ≥ 6% · Total ≥ 8%</td></tr><tr><td>Nýtt hlutafé: (E + X)/(A + X)</td><td class=\"eq\">=</td><td>k</td></tr></table></div></div></section>"
      },
      {
        "id": "hag106g-F4",
        "n": "F4",
        "title": "Tímavirði peninga",
        "html": "<section><h2><span class=\"n\">F4</span>Tímavirði peninga</h2><div class=\"scroll\"><div class=\"f\"><table class=\"cl\"><tr><td>FV</td><td class=\"eq\">=</td><td>PV(1 + r)<sup>t</sup> · PV</td><td class=\"eq\">=</td><td>FV/(1 + r)<sup>t</sup></td></tr><tr><td>FV</td><td class=\"eq\">=</td><td>PV(1 + r/m)<sup>t·m</sup> · EAR</td><td class=\"eq\">=</td><td>(1 + r/m)<sup>m</sup> − 1</td></tr><tr><td>FVA</td><td class=\"eq\">=</td><td>PMT[(1 + r)<sup>t</sup> − 1]/r · PVA</td><td class=\"eq\">=</td><td>PMT[1 − (1 + r)<sup>−t</sup>]/r</td></tr><tr><td>FVAD</td><td class=\"eq\">=</td><td>FVA(1 + r) · PVAD</td><td class=\"eq\">=</td><td>PVA(1 + r)</td></tr><tr><td>r</td><td class=\"eq\">=</td><td>(FV/PV)<sup>1/t</sup> − 1 · t</td><td class=\"eq\">=</td><td>ln(FV/PV)/ln(1 + r)</td></tr><tr><td>Flatir: 1 + r·d/360 · ósamfelldir: (1 + r)<sup>d/360</sup> · samfelldir: e<sup>r·d/360</sup></td></tr><tr><td>r<sub>s</sub></td><td class=\"eq\">=</td><td>m ln(1 + r<sub>ó</sub>/m) · r<sub>ó</sub></td><td class=\"eq\">=</td><td>e<sup>r<sub>s</sub></sup> − 1</td></tr><tr><td>EAR úr dögum</td><td class=\"eq\">=</td><td>(Lok/Upphaf)<sup>360/d</sup> − 1</td></tr></table></div></div></section>"
      },
      {
        "id": "hag106g-F5",
        "n": "F5",
        "title": "Skuldabréf og hlutabréf",
        "html": "<section><h2><span class=\"n\">F5</span>Skuldabréf og hlutabréf</h2><div class=\"scroll\"><div class=\"f\"><table class=\"cl\"><tr><td>P</td><td class=\"eq\">=</td><td>Σ c/(1 + r)<sup>t</sup> + Par/(1 + r)<sup>n</sup></td></tr><tr><td>ÍSL: hálfsárs greiðsla núvirt með (1 + r)<sup>0,5</sup></td></tr><tr><td>US: r/m og n·m tímabil · EAY</td><td class=\"eq\">=</td><td>(1 + r/m)<sup>m</sup> − 1</td></tr><tr><td>Áfallnir vextir</td><td class=\"eq\">=</td><td>c × liðinn tími · Clean</td><td class=\"eq\">=</td><td>Dirty − áfallnir</td></tr><tr><td>YTM ≈ [c + (Par − P)/n] / [(Par + P)/2]</td></tr><tr><td>P<sub>0</sub></td><td class=\"eq\">=</td><td>D/r (fastur) · P<sub>0</sub></td><td class=\"eq\">=</td><td>D<sub>1</sub>/(r − g) · r</td><td class=\"eq\">=</td><td>D<sub>1</sub>/P<sub>0</sub> + g</td></tr><tr><td>P<sub>n</sub></td><td class=\"eq\">=</td><td>D<sub>n</sub>(1 + g<sub>2</sub>)/(r − g<sub>2</sub>), núvirt með (1 + r)<sup>n</sup></td></tr><tr><td>R<sub>ár</sub></td><td class=\"eq\">=</td><td>(1 + R)<sup>1/T</sup> − 1</td></tr><tr><td>V/H</td><td class=\"eq\">=</td><td>Mcap/hagnaður · V/I</td><td class=\"eq\">=</td><td>Mcap/bókf. EF · A/V</td><td class=\"eq\">=</td><td>arður/Mcap</td></tr></table></div></div></section>"
      },
      {
        "id": "hag106g-F6",
        "n": "F6",
        "title": "Útboð, viðskipti og afleiður",
        "html": "<section><h2><span class=\"n\">F6</span>Útboð, viðskipti og afleiður</h2><div class=\"scroll\"><div class=\"f\"><table class=\"cl\"><tr><td>Margin</td><td class=\"eq\">=</td><td>(verð × fjöldi − lán) / (verð × fjöldi)</td></tr><tr><td>Veðkall: P</td><td class=\"eq\">=</td><td>Lán / [n(1 − viðhaldskrafa)]</td></tr><tr><td>Kaupréttur</td><td class=\"eq\">=</td><td>max(S − K; 0) · söluréttur</td><td class=\"eq\">=</td><td>max(K − S; 0)</td></tr><tr><td>Break-even: kaupr. K + verð · sölur. K − verð</td></tr><tr><td>Útgáfukostn.</td><td class=\"eq\">=</td><td>gengismunur + beinn kostn.; undirverðlagning</td><td class=\"eq\">=</td><td>(P<sub>1</sub> − P<sub>útb</sub>)/P<sub>útb</sub></td></tr></table></div><ul><li>Hollenskt uppboð: raða frá hæsta verði; útboðsverð = hæsta verð sem kemur öllu magni út; allir greiða það</li><li>Market order kaupir á ask, selur á bid</li></ul></div></section>"
      },
      {
        "id": "hag106g-F7–F8",
        "n": "F7–F8",
        "title": "Ávöxtun og áhætta",
        "html": "<section><h2><span class=\"n\">F7–F8</span>Ávöxtun og áhætta</h2><div class=\"scroll\"><div class=\"f\"><table class=\"cl\"><tr><td>R<sub>t</sub></td><td class=\"eq\">=</td><td>(P<sub>t</sub> − P<sub>t−1</sub> + D<sub>t</sub>)/P<sub>t−1</sub></td></tr><tr><td>R̄</td><td class=\"eq\">=</td><td>ΣR/T · s</td><td class=\"eq\">=</td><td>√[Σ(R − R̄)²/(T − 1)] · CV</td><td class=\"eq\">=</td><td>s/R̄</td></tr><tr><td>E(R)</td><td class=\"eq\">=</td><td>Σ p<sub>i</sub> R<sub>i</sub> · σ²</td><td class=\"eq\">=</td><td>Σ p<sub>i</sub>(R<sub>i</sub> − E(R))²</td></tr><tr><td>E(R<sub>p</sub>)</td><td class=\"eq\">=</td><td>Σ w<sub>i</sub> E(R<sub>i</sub>) · β<sub>p</sub></td><td class=\"eq\">=</td><td>Σ w<sub>i</sub> β<sub>i</sub></td></tr><tr><td>E(R<sub>i</sub>)</td><td class=\"eq\">=</td><td>RFR + β<sub>i</sub>[E(R<sub>M</sub>) − RFR]</td></tr><tr><td>β</td><td class=\"eq\">=</td><td>Cov(R<sub>i</sub>, R<sub>M</sub>)/σ²<sub>M</sub></td><td class=\"eq\">=</td><td>ρ σ<sub>i</sub>/σ<sub>M</sub></td></tr></table></div><ul><li>Veik: tæknigreining virkar ekki · hálfsterk: hvorki tækni- né grunngreining (US) · sterk: ekkert (ekki til í raun)</li></ul></div></section>"
      },
      {
        "id": "hag106g-F9",
        "n": "F9",
        "title": "Arðsemismat fjárfestinga",
        "html": "<section><h2><span class=\"n\">F9</span>Arðsemismat fjárfestinga</h2><div class=\"scroll\"><div class=\"f\"><table class=\"cl\"><tr><td>NPV</td><td class=\"eq\">=</td><td>−C<sub>0</sub> + Σ CF<sub>t</sub>/(1 + r)<sup>t</sup></td></tr><tr><td>0</td><td class=\"eq\">=</td><td>−C<sub>0</sub> + Σ CF<sub>t</sub>/(1 + IRR)<sup>t</sup></td></tr><tr><td>PI</td><td class=\"eq\">=</td><td>Σ CF<sub>t</sub>/(1 + r)<sup>t</sup> / C<sub>0</sub></td></tr><tr><td>TV</td><td class=\"eq\">=</td><td>Σ CIF<sub>t</sub>(1 + r)<sup>T−t</sup> · MIRR</td><td class=\"eq\">=</td><td>(TV/PV<sub>útfl.</sub>)<sup>1/T</sup> − 1</td></tr><tr><td>IRR 2 ára: −C x² + a x + b</td><td class=\"eq\">=</td><td>0, x</td><td class=\"eq\">=</td><td>1 + IRR</td></tr></table></div></div></section>"
      },
      {
        "id": "hag106g-F10",
        "n": "F10",
        "title": "Fjármagnsskipan og fjármagnskostnaður",
        "html": "<section><h2><span class=\"n\">F10</span>Fjármagnsskipan og fjármagnskostnaður</h2><div class=\"scroll\"><div class=\"f\"><table class=\"cl\"><tr><td>WACC</td><td class=\"eq\">=</td><td>w<sub>d</sub>k<sub>d</sub> + w<sub>e</sub>k<sub>e</sub></td></tr><tr><td>w<sub>d</sub></td><td class=\"eq\">=</td><td>D / (D + E), markaðsvirði · w<sub>e</sub></td><td class=\"eq\">=</td><td>1 − w<sub>d</sub></td></tr><tr><td>k<sub>d</sub></td><td class=\"eq\">=</td><td>YTM × (1 − T)</td></tr><tr><td>k<sub>e</sub></td><td class=\"eq\">=</td><td>RFR + β<sub>G</sub> × ERP</td></tr><tr><td>β<sub>G</sub></td><td class=\"eq\">=</td><td>β<sub>Ó</sub>[1 + (D/E)(1 − T)]</td></tr><tr><td>β<sub>Ó</sub></td><td class=\"eq\">=</td><td>β<sub>G</sub> / [1 + (D/E)(1 − T)]</td></tr><tr><td>Skattaskjöldur</td><td class=\"eq\">=</td><td>vextir × T</td></tr></table></div><ul><li>Nýtt skuldahlutfall: (1) aflétta við gamla D/E, (2) gíra upp við nýja D/E</li><li>WACC sem fall af gírun er U-laga; lágmarkið er kjörfjármagnsskipan</li><li>Óráðstafað eigið fé kostar k<sub>e</sub> (fórnarkostnaður)</li><li>Meðaláhættusamt verkefni: WACC fyrirtækisins, óháð því hvernig verkefnið er fjármagnað · áhættumeira verkefni: hærri krafa</li></ul></div></section>"
      },
      {
        "id": "hag106g-✓",
        "n": "✓",
        "title": "Ákvörðunarreglur",
        "html": "<section><h2><span class=\"n\">✓</span>Ákvörðunarreglur</h2><div class=\"scroll\"><table class=\"tt\"><thead><tr><th>Aðferð</th><th>Samþykkja / regla</th><th>Athugið</th></tr></thead><tbody><tr><td><b>NPV</b></td><td class=\"mono\">> 0</td><td>Virðisauki í krónum; fræðilega réttust</td></tr><tr><td><b>IRR</b></td><td class=\"mono\">> krafa</td><td>Getur gefið margar lausnir</td></tr><tr><td><b>MIRR</b></td><td class=\"mono\">> krafa</td><td>Alltaf ein lausn</td></tr><tr><td><b>PI</b></td><td class=\"mono\">> 1</td><td>Getur raðað misstórum verkefnum ólíkt NPV</td></tr><tr><td><b>Endurgreiðslutími</b></td><td class=\"mono\">< hámarkstími</td><td>Hunsar tímavirði og flæði eftir PP</td></tr><tr><td><b>Ósamrýmanleg verkefni</b></td><td class=\"mono\">hæsta NPV</td><td></td></tr><tr><td><b>Óháð verkefni</b></td><td class=\"mono\">öll með NPV > 0</td><td></td></tr><tr><td><b>Skuldabréf</b></td><td class=\"mono\">krafa > coupon ⇒ < 100</td><td>krafa = coupon ⇒ 100</td></tr><tr><td><b>CAPM</b></td><td class=\"mono\">vænt > krafa ⇒ vanmetið</td><td>vænt < krafa ⇒ ofmetið</td></tr><tr><td><b>Fjárfesting (F10)</b></td><td class=\"mono\">IRR > WACC ⇔ NPV(WACC) > 0</td><td>Krafa = WACC fyrir meðaláhættusamt verkefni</td></tr></tbody></table></div></section>"
      },
      {
        "id": "hag106g-✗",
        "n": "✗",
        "title": "Gildrulisti",
        "html": "<section><h2><span class=\"n\">✗</span>Gildrulisti</h2><ul><li>Fisher á verðbólguvæntingar úr RIKB/RIKS (á að draga frá)</li><li>Nálgun Fisher þegar spurt er um raunvexti láns</li><li>Lántaki vs fjárfestir í verðtryggingarvali: áttin snýst við</li><li>D<sub>0</sub> í stað D<sub>1</sub> í Gordon</li><li>D<sub>n</sub> í stað D<sub>n+1</sub> í P<sub>n</sub>; núvirða P<sub>n</sub> með (1 + r)<sup>n+1</sup></li><li>Gleyma (1 + r) í óhefðbundinni jafngreiðslu</li><li>Dirty price þegar beðið er um clean; áfallnir af tíma sem er eftir</li><li>Nafnverðið á ári 4 þegar síðasta greiðsla er á ári 3,5</li><li>Bandaríska leiðin við skuldabréfaverð</li><li>365 dagar í stað 360</li><li>Krafan á n ára bréfi er meðaltal, ekki verðbólga á ári n; deila með árum í bilinu</li><li>r<sub>fyrirtæki</sub> − r<sub>ríki</sub> = DRP + LP, ekki DRP</li><li>Vextir af upphaflegum höfuðstól í greiðsluáætlun</li><li>Deila með T í stað T − 1 (söguleg gögn) / deila með n − 1 í sviðsmyndum</li><li>β × allri markaðsávöxtun í stað áhættuálagsins</li><li>Staðalfrávik safns = vegið meðaltal (aðeins ef ρ = 1)</li><li>Hæsta IRR hjá ósamrýmanlegum verkefnum (á að vera hæsta NPV)</li><li>Eiginfjárhlutfall af skuldum í stað eigna; nýtt hlutafé hækkar líka eignir</li><li>Ávöxtun bréfs í stað ávöxtunar á eigið fé við gírun</li><li>Virði valréttar í stað hagnaðar (draga verð réttarins frá)</li><li>k<sub>d</sub> fyrir skatta í WACC; nafnvextir (coupon) í stað YTM</li><li>D/(D + E) í stað D/E í Hamada-formúlunni</li><li>Gamla betan notuð eftir að skuldahlutfall breytist (gleyma að aflétta og gíra upp)</li><li>Bókfært virði í stað markaðsvirðis í vigtum WACC</li><li>Kostnaður þeirrar fjármögnunar sem verkefnið fær í stað WACC</li></ul></section>"
      }
    ],
    "foot": "\n    <p class=\"foot\">Óstaðfest: hvar skiptakostnaður og laun lenda gagnvart veðtryggðum kröfum í kröfuröð. Staðfest röð: veðtryggðir → óveðtryggðir → forgangshluthafar → almennir.</p>\n  ",
    "a4": {
      "head": "<div class=\"stack\" style=\"gap:6px\"><span class=\"eyebrow\">Eitt A4-blað · tvær hliðir · til að afrita í höndunum</span><h1>Formúlublaðið</h1><p class=\"muted\" style=\"max-width:66ch\">Allar formúlur úr F1–F10, sérvenjur, ákvörðunarreglur og gildrur. Framhliðin er reikningsþyngsta efnið (F3–F5). Ef aðeins má skrifa á aðra hliðina skaltu velja úr bakhliðinni það sem þú kannt síst.</p></div>"
    }
  },
  "examInfo": {
    "title": "Lokaprófið",
    "format": "Skriflegt lokapróf, 50% af einkunn. Snið óstaðfest.",
    "aids": "Reiknivél og formúlublað (líklegt, óstaðfest)",
    "facts": [
      {
        "value": "3 klst.",
        "label": "líkleg lengd, óstaðfest"
      },
      {
        "value": "50%",
        "label": "af einkunn; þarf að standast"
      },
      {
        "value": "F1–F10",
        "label": "9 fyrirlestrahópar"
      },
      {
        "value": "+ blað",
        "label": "Reiknivél og formúlublað (líklegt, óstaðfest)"
      }
    ]
  },
  "passScore": 0.7,
  "sourceLabels": {
    "slides": "Glærur og próf",
    "old": "Miðannarpróf"
  },
  "legacy": {
    "key": "hag106g-profaefing-v1",
    "file": "HAG106G prófæfing.html"
  }
};

/** @type {import('../schema.js').Course} */
export default adapt(meta, L);
