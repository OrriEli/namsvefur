// Búið til af scripts/extract-legacy.js úr legacy/HAG103G prófæfing.html. Ekki breyta í höndunum.
import * as L from './legacy/hag103g.js';
import adapt from './adapters/mcq.js';

export const meta = {
  "id": "hag103g",
  "code": "HAG103G",
  "name": "Heildahagfræði I",
  "short": "Heild",
  "color": "--c-hag103g",
  "engine": "mcq",
  "topics": [
    {
      "id": "key",
      "name": "Keynes og IS-LM",
      "ref": "MT26–27",
      "part": "Seinni hlutinn · nýtt efni"
    },
    {
      "id": "asd",
      "name": "Heildarframboð og -eftirspurn",
      "ref": "MT28",
      "part": "Seinni hlutinn · nýtt efni"
    },
    {
      "id": "hag",
      "name": "Peningastefna og ríkisfjármál",
      "ref": "MT29",
      "part": "Seinni hlutinn · nýtt efni"
    },
    {
      "id": "phi",
      "name": "Phillips-kúrfan og Taylor-regla",
      "ref": "MT30",
      "part": "Seinni hlutinn · nýtt efni"
    },
    {
      "id": "frb",
      "name": "Framboðsstefna",
      "ref": "MT31",
      "part": "Seinni hlutinn · nýtt efni"
    },
    {
      "id": "kre",
      "name": "Fjármálakreppur",
      "ref": "MT32",
      "part": "Seinni hlutinn · nýtt efni"
    },
    {
      "id": "evr",
      "name": "Evran og myntsvæði",
      "ref": "MT33",
      "part": "Seinni hlutinn · nýtt efni"
    },
    {
      "id": "umh",
      "name": "Ytri áhrif og loftslag",
      "ref": "MT34",
      "part": "Seinni hlutinn · nýtt efni"
    },
    {
      "id": "pen",
      "name": "Peningar, bankar og verðbólga",
      "ref": "MT24",
      "part": "Fyrri hlutinn · efni hlutaprófsins"
    },
    {
      "id": "vin",
      "name": "Vinnumarkaður og atvinnuleysi",
      "ref": "MT15, 22",
      "part": "Fyrri hlutinn · efni hlutaprófsins"
    },
    {
      "id": "opi",
      "name": "Opið hagkerfi",
      "ref": "MT25",
      "part": "Fyrri hlutinn · efni hlutaprófsins"
    },
    {
      "id": "rei",
      "name": "Fastir reikningar og mælingar",
      "ref": "MT20, 23",
      "part": "Fyrri hlutinn · efni hlutaprófsins"
    },
    {
      "id": "vox",
      "name": "Hagvöxtur og Solow",
      "ref": "MT20–21",
      "part": "Fyrri hlutinn · efni hlutaprófsins"
    },
    {
      "id": "ojo",
      "name": "Ójöfnuður og fátækt",
      "ref": "MT16",
      "part": "Fyrri hlutinn · efni hlutaprófsins"
    },
    {
      "id": "spa",
      "name": "Sparnaður og lánsfjármarkaður",
      "ref": "MT23",
      "part": "Fyrri hlutinn · efni hlutaprófsins"
    },
    {
      "id": "vid",
      "name": "Alþjóðaviðskipti",
      "ref": "MT17",
      "part": "Fyrri hlutinn · efni hlutaprófsins"
    },
    {
      "id": "gru",
      "name": "Grunnhugtök",
      "ref": "MT1–2",
      "review": true,
      "part": "Fyrri hlutinn · efni hlutaprófsins"
    }
  ],
  "examFormats": [
    {
      "id": "mix",
      "name": "Fullt lokapróf",
      "desc": "Sama lengd og vægi og alvöru prófið: um 20 spurningar úr seinni hlutanum og 30 úr þeim fyrri. Ný samsetning í hvert sinn.",
      "style": "inspera",
      "minutes": 180,
      "pick": {
        "by": "quota",
        "quota": {
          "key": 4,
          "asd": 4,
          "hag": 4,
          "phi": 4,
          "frb": 1,
          "kre": 1,
          "evr": 1,
          "umh": 1,
          "pen": 6,
          "vin": 4,
          "opi": 4,
          "rei": 4,
          "vox": 4,
          "ojo": 3,
          "spa": 2,
          "vid": 3
        }
      }
    },
    {
      "id": "second",
      "name": "Seinni hlutinn",
      "desc": "Aðeins nýja efnið: Keynes og IS-LM 4, AS-AD 4, hagstjórn 4, Phillips og Taylor 4, og eitt hvert úr MT31–34.",
      "style": "inspera",
      "minutes": 72,
      "pick": {
        "by": "quota",
        "quota": {
          "key": 4,
          "asd": 4,
          "hag": 4,
          "phi": 4,
          "frb": 1,
          "kre": 1,
          "evr": 1,
          "umh": 1
        }
      }
    },
    {
      "id": "gen",
      "name": "Reikningapróf",
      "desc": "Aðeins reikningar með nýjum tölum: Keynes-krossinn, margfaldarar, Okun, Taylor, VLF, raunvextir, Solow, Gini.",
      "style": "inspera",
      "minutes": 45,
      "pick": {
        "by": "gens",
        "n": 15
      }
    },
    {
      "id": "l25",
      "name": "Lokapróf 2025",
      "desc": "Raunverulega prófið í réttri röð, án spurninga sem vantar myndir í eða eru utan efnis.",
      "style": "inspera",
      "minutes": 148,
      "pick": {
        "by": "fixed",
        "ids": [
          "L25-1",
          "L25-2",
          "L25-3",
          "L25-4",
          "L25-5",
          "L25-8",
          "L25-9",
          "L25-10",
          "L25-11",
          "L25-12",
          "L25-14",
          "L25-15",
          "L25-16",
          "L25-17",
          "L25-18",
          "L25-19",
          "L25-20",
          "L25-21",
          "L25-22",
          "L25-23",
          "L25-24",
          "L25-27",
          "L25-28",
          "L25-29",
          "L25-30",
          "L25-31",
          "L25-32",
          "L25-34",
          "L25-35",
          "L25-36",
          "L25-37",
          "L25-38",
          "L25-39",
          "L25-40",
          "L25-41",
          "L25-42",
          "L25-43",
          "L25-44",
          "L25-45",
          "L25-49",
          "L25-50"
        ]
      }
    },
    {
      "id": "l24",
      "name": "Lokapróf 2024",
      "desc": "Sama. Margar spurningar komu aftur 2025, svo þetta segir mikið um hvað kemur aftur.",
      "style": "inspera",
      "minutes": 133,
      "pick": {
        "by": "fixed",
        "ids": [
          "L24-1",
          "L24-2",
          "L24-3",
          "L24-4",
          "L24-5",
          "L24-6",
          "L24-7",
          "L24-10",
          "L24-11",
          "L24-14",
          "L24-19",
          "L24-20",
          "L24-21",
          "L24-23",
          "L24-24",
          "L24-26",
          "L24-27",
          "L24-29",
          "L24-30",
          "L24-31",
          "L24-34",
          "L24-35",
          "L24-36",
          "L24-37",
          "L24-38",
          "L24-39",
          "L24-40",
          "L24-41",
          "L24-42",
          "L24-43",
          "L24-44",
          "L24-45",
          "L24-46",
          "L24-47",
          "L24-48",
          "L24-49",
          "L24-50"
        ]
      }
    }
  ],
  "sheet": {
    "head": "\n<div class=\"stack\" style=\"gap:6px\"><span class=\"eyebrow\">Upprifjun fyrir lokaprófið</span><h1>Blaðið</h1><p class=\"muted\" style=\"max-width:62ch\">Allt sem gömlu prófin hafa spurt um, þjappað saman. Nýja efnið (kaflar 11–16) er fremst í forritinu en aftast hér, svo númerin frá hlutaprófinu haldast. Það sem er feitletrað hefur komið oftar en einu sinni.</p></div>\n\n",
    "sections": [
      {
        "id": "hag103g-01",
        "n": "01",
        "title": "Fyrirkomulag",
        "html": "<section><h2><span class=\"n\">01</span>Fyrirkomulag</h2>\n<ul><li><b>Mánudagur 7. desember, kl. 13:30–16:30, HT103.</b></li>\n<li>Ef sniðið verður eins og 2024–25: 50 krossaspurningar í Inspera, 3 klst., um 3,6 mín. á spurningu, <b>ekki dregið frá fyrir rangt svar</b>: svaraðu öllu.</li>\n<li>Reiknivél leyfð. Formúlur fyrir Solow, Gini og Taylor-reglu hafa verið gefnar í dæmunum; margfaldarann, Okun og jöfnurnar þrjár þarftu að kunna.</li>\n<li>Efni: allt námskeiðið. Á lokaprófunum 2024–25 voru um 30 spurningar úr fyrri hlutanum og um 20 úr þeim seinni (MT26–34).</li>\n<li><b>Spurningar eru endurnýttar</b>: L24 #34 = L25 #33, L24 #49 = L25 #46, L24 #50 = L25 #48, og bankaspurningin kom aftur í Hlutaprófi 2026.</li></ul></section>"
      },
      {
        "id": "hag103g-02",
        "n": "02",
        "title": "Jöfnurnar þrjár sem Haukur nefndi",
        "html": "<section><h2><span class=\"n\">02</span>Jöfnurnar þrjár sem Haukur nefndi</h2>\n<div class=\"cols\">\n<div><h3>VLF</h3><div class=\"f\">Y = C + I + G + NX<br>Lokað: S = Y − C − G = I<br>S = (Y − T − C) + (T − G)<br>Opið: S = I + NX<br>S − I = NX = NCO</div><p class=\"hint\">Einkasparnaður + opinber sparnaður. Ríkishalli = T − G &lt; 0.</p></div>\n<div><h3>Peningamagnsjafnan</h3><div class=\"f\">M × V = P × Y<br>P = MV / Y · V = PY / M<br>%ΔM + %ΔV ≈ %ΔP + %ΔY</div><p class=\"hint\">V stöðugt og Y ræðst af raunþáttum ⇒ M ↑ ⇒ P ↑. Hlutleysi: engin áhrif á <b>raun</b>stærðir.</p></div>\n<div><h3>Raungengi</h3><div class=\"f\">E = e × P / P*<br>e = erlend mynt í hverri krónu</div><p class=\"hint\">e ↑, P ↑ eða P* ↓ ⇒ E ↑ ⇒ NX ↓.</p></div>\n<div><h3>Kaupmáttarjafnvirði (KJK)</h3><div class=\"f\">1/P = e/P* ⇒ E = 1<br>e = P* / P</div><p class=\"hint\">Raungengið er fasti, ekki nafngengið. Seðlaprentun ⇒ P ↑ ⇒ e ↓ (krónan veikist).</p></div>\n</div></section>"
      },
      {
        "id": "hag103g-03",
        "n": "03",
        "title": "Fastir reikningar",
        "html": "<section><h2><span class=\"n\">03</span>Fastir reikningar</h2>\n<div class=\"scroll\"><table class=\"tt\"><thead><tr><th>Hvað</th><th>Formúla</th><th>Gildra</th></tr></thead><tbody>\n<tr><td>Liður sem vantar</td><td class=\"mono\">Y = C + I + G + (X − M)</td><td>Gleyma NX</td></tr>\n<tr><td><b>Atvinnuleysi</b></td><td class=\"mono\">U / (mannfj. − utan vinnum.)</td><td>Deila í allan mannfjöldann</td></tr>\n<tr><td>Atvinnuþátttaka</td><td class=\"mono\">vinnuafl / mannfjöldi</td><td>Vinnuafl = starfandi + atvinnulausir</td></tr>\n<tr><td><b>Ársverðbólga</b></td><td class=\"mono\">VNV(t) / VNV(t−12) − 1</td><td>Bera saman við síðasta mánuð</td></tr>\n<tr><td>Mánaðar ← árs</td><td class=\"mono\">(1 + π)^(1/12) − 1</td><td>π / 12</td></tr>\n<tr><td><b>Raunvextir</b></td><td class=\"mono\">(1 + i)/(1 + π) − 1</td><td>i − π þegar spurt er „nákvæmlega“</td></tr>\n<tr><td>Raunhagvöxtur</td><td class=\"mono\">(1 + g_nafn)/(1 + g_verð) − 1</td><td>Mismunurinn</td></tr>\n<tr><td><b>Núvirði</b></td><td class=\"mono\">X / (1 + r)^N</td><td>Greiðsla í dag er ekki afvöxtuð</td></tr>\n<tr><td>Verðvísitala VLF</td><td class=\"mono\">nafnvirði / raunvirði × 100</td><td></td></tr>\n<tr><td>Framlag til hagvaxtar</td><td class=\"mono\">hlutur(t−1) × %Δ</td><td></td></tr>\n<tr><td>Meðalvöxtur</td><td class=\"mono\">(Y_T / Y_0)^(1/T) − 1</td><td>Einfalt meðaltal ofmetur</td></tr>\n<tr><td>Tvöföldunartími</td><td class=\"mono\">70 / g</td><td></td></tr>\n</tbody></table></div></section>"
      },
      {
        "id": "hag103g-04",
        "n": "04",
        "title": "Gefnar formúlur: kunna að nota þær hratt",
        "html": "<section><h2><span class=\"n\">04</span>Gefnar formúlur: kunna að nota þær hratt</h2>\n<div class=\"cols\">\n<div><h3>Solow, Y = A·L^0,5·K^0,5</h3><div class=\"f\">Jafnvægi: s·Y = δ·K<br>K/L = (s·A / δ)²<br>Y/L = A·(K/L)^0,5</div><p class=\"hint\">Gleymdu ekki að setja í annað veldi.</p></div>\n<div><h3>Gini</h3><div class=\"f\">G = (n+1)/n − 2·Σ(n+1−i)xᵢ / (n·Σxᵢ)</div><p class=\"hint\"><b>Raða frá lægstu tekjum.</b> Bjarki 15 þ., Elísa 5 þ., Sara 80 þ. ⇒ 0,5 (komið tvisvar).</p></div>\n</div></section>"
      },
      {
        "id": "hag103g-05",
        "n": "05",
        "title": "Keðjurnar fimm í opna hagkerfinu",
        "html": "<section><h2><span class=\"n\">05</span>Keðjurnar fimm í opna hagkerfinu</h2>\n<p class=\"hint\">Lánsfjármarkaður: framboð = S, eftirspurn = I + NCO. Gjaldeyrismarkaður: framboð króna = NCO (lóðrétt), eftirspurn = NX. Byrjaðu alltaf á fyrsta hlekknum.</p>\n<div class=\"scroll\"><table class=\"tt\"><thead><tr><th>Áfall</th><th>Lánsfé</th><th>r</th><th>NCO</th><th>E</th><th>NX</th></tr></thead><tbody>\n<tr><td><b>Sparnaður ↓ / ríkishalli</b></td><td>framboð ←</td><td>↑</td><td>↓</td><td>↑</td><td>↓</td></tr>\n<tr><td>Sparnaður ↑</td><td>framboð →</td><td>↓</td><td>↑</td><td>↓</td><td>↑</td></tr>\n<tr><td>Innstreymi fjármagns ↑</td><td>eftirspurn ←</td><td>↓</td><td>↓</td><td>↑</td><td>↓</td></tr>\n<tr><td><b>Fjármagnsflótti</b> / lífeyrissjóðir kaupa erlent</td><td>eftirspurn →</td><td>↑</td><td>↑</td><td>↓</td><td>↑</td></tr>\n<tr><td>Tollur eða kvóti</td><td>óbreytt</td><td>–</td><td>–</td><td>↑</td><td>óbreytt</td></tr>\n</tbody></table></div>\n<p class=\"hint\">Ríkishalli → tvíburahalli. Tollar breyta ekki S − I og því ekki NX (BNA: 903,5 → 901,5 ma.$). NCO ↑: Íslendingur kaupir Tesla-bréf. NCO ↓: Færeyingur kaupir ríkisbréf.</p></section>"
      },
      {
        "id": "hag103g-06",
        "n": "06",
        "title": "Lánsfjármarkaðurinn (lokað hagkerfi)",
        "html": "<section><h2><span class=\"n\">06</span>Lánsfjármarkaðurinn (lokað hagkerfi)</h2>\n<div class=\"scroll\"><table class=\"tt\"><tbody>\n<tr><td><b>Ríkisútgjöld ↑ / halli</b></td><td>framboð ← · r ↑ · magn ↓ (ruðningsáhrif)</td></tr>\n<tr><td>Lægri skattar á sparnað</td><td>framboð → · r ↓ · magn ↑</td></tr>\n<tr><td>Lægri skattar á fjárfestingu</td><td>eftirspurn → · r ↑ · magn ↑</td></tr>\n</tbody></table></div>\n<p class=\"hint\">Fjárfesting í hagfræði = vélar, verksmiðjur, hús. Hlutabréfakaup eru sparnaður. Krafa skuldabréfa ↑ ⇔ verð ↓.</p></section>"
      },
      {
        "id": "hag103g-07",
        "n": "07",
        "title": "Vinnumarkaður og atvinnuleysi",
        "html": "<section><h2><span class=\"n\">07</span>Vinnumarkaður og atvinnuleysi</h2>\n<div class=\"cols\"><div><ul>\n<li><b>Atvinnuleysi = náttúrulegt + hagsveiflubundið.</b> Náttúrulegt = leitar + skipulags (~4,5% á Íslandi).</li>\n<li><b>Laun yfir jafnvægi: lágmarkslaun, verkalýðsfélög, afkastalaun.</b></li>\n<li>Lágmarkslaun bíta aðeins ef þau eru yfir jafnvægi; meira atvinnuleysi þar sem eftirspurn er teygnari (flatari).</li>\n<li>Okun: neikvætt samband atvinnuleysis og hagvaxtar.</li>\n</ul></div><div><ul>\n<li>Ráða meðan <span class=\"mono\">P × MPL ≥ W</span>; W/P = MPL.</li>\n<li>Eftirspurn hliðrast: vöruverð P, tækni (MPL).</li>\n<li>Framboð hliðrast: innflytjendur, eftirlaunaaldur, <b>styttri skólaganga ⇒ framboð →, laun ↓, störf ↑</b>.</li>\n<li>Gefst upp á leit ⇒ utan vinnumarkaðar ⇒ u ↓.</li>\n</ul></div></div></section>"
      },
      {
        "id": "hag103g-08",
        "n": "08",
        "title": "Peningar og bankar",
        "html": "<section><h2><span class=\"n\">08</span>Peningar og bankar</h2>\n<div class=\"cols\"><div><ul>\n<li>Þrjú hlutverk: <b>gjaldmiðill, reiknieining, geymslueining</b>.</li>\n<li>M0 = seðlar og mynt + innstæður fjármálastofnana hjá SÍ (almennar og bindiskylda). <b>Aðeins SÍ býr til grunnfé.</b></li>\n<li>M1 = seðlar + veltiinnlán · M2 = M1 + óbundið sparifé · M3 = M2 + bundin innlán. ~98% af M3 eru innlán.</li>\n<li><b>Bankar búa til innlán þegar þeir lána</b> (útlán +100, innlán +100, M3 ↑, M0 óbreytt). Afborgun eyðir peningum.</li>\n<li>Takmörk: eftirspurn eftir lánum, eigið fé (Basel III), grunnfé til uppgjörs, stýrivextir. <b>Ekki peningamargfaldarinn.</b></li>\n<li>Bindiskylda: <b>varúðarhlutverk, virkt stjórntæki, skilvirkari miðlun</b>. Ekki margfaldari.</li>\n<li>Vörumynt = tengd vöru (gulli); pappírsmynt = ekkert virði í sjálfu sér.</li>\n<li>Kostnaður verðbólgu: skósóla, matseðla, verðhlutföll, skattaskekkjur, ruglingur, endurdreifing auðs. <b>Ekki „jaðarkostnaður“.</b></li>\n<li>Fisher: (1 + i) = (1 + r)(1 + π). Verðbólgumarkmið SÍ 2,5% (±1,5).</li>\n</ul></div><div><h3>Ártölin</h3><div class=\"scroll\"><table class=\"tt\"><tbody>\n<tr><td class=\"mono\">1886</td><td><b>Landsbankinn</b> opnar 1. júlí (12–14), gefur út krónur</td></tr>\n<tr><td class=\"mono\">1904</td><td>Íslandsbanki, erlendur, gulltryggðir seðlar</td></tr>\n<tr><td class=\"mono\">1927</td><td><b>Landsbankinn fær seðlaútgáfu</b> (til 1961)</td></tr>\n<tr><td class=\"mono\">1930</td><td>Íslandsbanki lokar → Útvegsbankinn; Búnaðarbankinn</td></tr>\n<tr><td class=\"mono\">1931</td><td>Fjármagnshöft (til EES 1993)</td></tr>\n<tr><td class=\"mono\">1961</td><td>Seðlabanki Íslands (lög 29. mars)</td></tr>\n<tr><td class=\"mono\">1979</td><td>Ólafslög: verðtrygging</td></tr>\n<tr><td class=\"mono\">1985</td><td>Vextir gefnir frjálsir</td></tr>\n<tr><td class=\"mono\">1990</td><td>Nýr Íslandsbanki; 7 → 3 viðskiptabankar</td></tr>\n<tr><td class=\"mono\">2003</td><td>Kaupþing + Búnaðarbanki; einkavæðingu lokið</td></tr>\n<tr><td class=\"mono\">okt. 2008</td><td><b>Ríkið tekur Landsbankann, Glitni og Kaupþing</b></td></tr>\n<tr><td class=\"mono\">2008–17</td><td>Gjaldeyrishöft</td></tr>\n</tbody></table></div></div></div></section>"
      },
      {
        "id": "hag103g-09",
        "n": "09",
        "title": "Hagvöxtur, Solow og VLF",
        "html": "<section><h2><span class=\"n\">09</span>Hagvöxtur, Solow og VLF</h2>\n<div class=\"cols\"><div><ul>\n<li><b>Ný tækni (A ↑): k* og y* aukast.</b></li>\n<li>Sparnaður ↑: tímabundinn vöxtur, hærra stig.</li>\n<li><b>Eldgos eyðir fjármagni: k ↓ tímabundið, sama jafnvægi.</b> Gildrur: „δ eykst“, „A lækkar“.</li>\n<li>Langtímavöxtur á mann aðeins af tækniframförum.</li>\n<li>Framleiðsluþættir: fjármagn, mannauður, náttúruauðlindir, tækniþekking. <b>Hagvöxtur er ekki einn þeirra.</b></li>\n</ul></div><div><ul>\n<li><b>Lífskjör til langs tíma = framleiðni</b> (menntun, tækni), ekki tollar eða lágmarkslaun.</li>\n<li>Malthus: fólksfjölgun étur upp aukna framleiðslu á mann.</li>\n<li>VLF: notaðar vörur, aðföng, millifærslur og verðbréf teljast ekki. Húsnæðiskaup = I. Óseld framleiðsla = birgðir = I.</li>\n<li>VLF tekur ekki tillit til tekjudreifingar né ólaunaðra starfa.</li>\n<li>VNV tekur innflutning með, VVLF ekki.</li>\n</ul></div></div></section>"
      },
      {
        "id": "hag103g-10",
        "n": "10",
        "title": "Alþjóðaviðskipti og ójöfnuður",
        "html": "<section><h2><span class=\"n\">10</span>Alþjóðaviðskipti og ójöfnuður</h2>\n<div class=\"cols\"><div><ul>\n<li><b>Hlutfallslegir yfirburðir = lægri fórnarkostnaður</b> (Ricardo). Algerir yfirburðir ráða ekki sérhæfingu.</li>\n<li>Tafla með <b>magni á tímabili</b>: fórnark. vöru 1 = magn 2 / magn 1. Tafla með <b>klst. á einingu</b>: klst. 1 / klst. 2.</li>\n<li>Útflutningsland: neytendur −B, framleiðendur +B+D. <b>„Neytendaábati dregst aldrei saman“ er rangt.</b></li>\n<li>Tollur: framleiðendaábati G → G + C, tolltekjur E, allratap D + F. Tollar hækka verð til innlendra framleiðenda.</li>\n</ul></div><div><ul>\n<li>Lorenz: því fjær 45° línunni, því meiri ójöfnuður. Skattalækkun á hæstu tekjur stækkar svæðið.</li>\n<li>Úrræði: lágmarkslaun, almannatryggingar, millifærslur í vöru og þjónustu, neikvæður tekjuskattur. <b>Ekki Lorenz-kúrfan, ekki bankaskattur.</b></li>\n<li>Algjör fátækt = grunnþarfir; hlutfallsleg = samfélagsleg viðmið. Lágtekjumörk 60% af miðgildi.</li>\n<li>Nytjastefna (summa nytja) · Rawls (lágmarksnyt) · frjálshyggja (jöfn tækifæri).</li>\n</ul></div></div></section>"
      },
      {
        "id": "hag103g-11",
        "n": "11",
        "title": "Keynesíski krossinn og margfaldarinn",
        "html": "<section><h2><span class=\"n\">11</span>Keynesíski krossinn og margfaldarinn</h2>\n<div class=\"cols\">\n<div><div class=\"f\">E = C + I + G + NX, C = a + MPC·Y<br>Jafnvægi: E = Y<br>Y = A / (1 − MPC), A = a + I + G + NX<br>k = 1 / (1 − MPC) · opið: k = 1 / MPW<br>MPW = MPS + t + MPM</div>\n<p class=\"hint\"><b>L24 #42: MPC 0,2 ⇒ k = 1,25, ekki 5.</b> L25 #44: MPC 0,6 ⇒ k = 2,5, ekki 1,67.</p></div>\n<div><div class=\"f\">Skattalækkun: ΔAD = k · MPC · ΔT<br>Til að ná Y*: ΔG = (Y* − Y) / k<br>Bil = (Y − Y*) / Y*<br>Nettó margfaldari = (k·ΔG − ruðningur) / ΔG</div>\n<p class=\"hint\">Útgjöld &gt; framleiðsla við fulla atvinnu ⇒ <b>verðbólguþrýstingur</b>; útgjöld &lt; ⇒ <b>verðhjöðnunarþrýstingur</b>. Keynes: beita ríkisfjármálum til skamms tíma (komið bæði árin).</p></div>\n</div>\n<p class=\"hint\">Sýnidæmi 4: C = 300 + 0,6Y, A = 840 ⇒ Y = 2.100, spenna 5% ⇒ ΔG = −100/2,5 = −40. Skilaverkefni 4: MPW 0,4, k 2,5, ΔG 40, ruðningur 20 ⇒ AD +80, nettó margfaldari 2,0.</p></section>"
      },
      {
        "id": "hag103g-12",
        "n": "12",
        "title": "IS-LM",
        "html": "<section><h2><span class=\"n\">12</span>IS-LM</h2>\n<p class=\"hint\">IS = vörumarkaður (r ↑ ⇒ I, C ↓ ⇒ Y ↓). LM = peningamarkaður (Y ↑ ⇒ peningaeftirspurn ↑ ⇒ r ↑). <b>Allt sem er útgjöld hliðrar IS, allt sem er peningamagn hliðrar LM.</b></p>\n<div class=\"scroll\"><table class=\"tt\"><thead><tr><th>Atburður</th><th>Kúrfa</th><th>r</th><th>Y</th></tr></thead><tbody>\n<tr><td><b>G ↑</b>, T ↓, X ↑, bjartsýni</td><td>IS →</td><td>↑</td><td>↑</td></tr>\n<tr><td>G ↓, <b>X ↓</b>, svartsýni</td><td>IS ←</td><td>↓</td><td>↓</td></tr>\n<tr><td><b>M ↑</b></td><td>LM →</td><td>↓</td><td>↑</td></tr>\n<tr><td><b>M ↓</b></td><td>LM ←</td><td>↑</td><td>↓</td></tr>\n<tr><td>G ↑ og SÍ heldur vöxtum föstum</td><td>IS → og LM →</td><td>óbr.</td><td>↑↑</td></tr>\n<tr><td>G ↓ og SÍ heldur Y föstu</td><td>IS ← og LM →</td><td>↓</td><td>óbr.</td></tr>\n<tr><td>Útflutningur hrynur og M ↑ (2020)</td><td>IS ← og LM →</td><td>↓</td><td>?</td></tr>\n<tr><td>G ↑ og M ↓</td><td>IS → og LM ←</td><td>↑</td><td>?</td></tr>\n</tbody></table></div></section>"
      },
      {
        "id": "hag103g-13",
        "n": "13",
        "title": "AS-AD",
        "html": "<section><h2><span class=\"n\">13</span>AS-AD</h2>\n<div class=\"cols\">\n<div><h3>Hvers vegna hallar …</h3><ul>\n<li><b>AD niður: auðsáhrif, vaxtaáhrif, gengisáhrif.</b> Vaxtaáhrifin vega mest; auðsáhrifin minnst á Íslandi (verðtrygging).</li>\n<li><b>SRAS upp: tregbreytanleg laun, tregbreytanleg verð, misskilningur.</b> Gildrur: „tregbreytanlegir vextir“, „auðsáhrifin“.</li>\n<li>LRAS lóðrétt: verðlag hefur <b>engin</b> áhrif á raunstærðir til langs tíma.</li>\n<li class=\"mono\">Q = NRQ + a(APL − EPL)</li>\n</ul></div>\n<div><h3>Hvað hliðrar hverju</h3><div class=\"scroll\"><table class=\"tt\"><tbody>\n<tr><td>C, I, G, NX (skattar, væntingar, ferðamenn, vextir)</td><td>AD</td></tr>\n<tr><td>Vinnuafl, fjármagn, auðlindir, tækni</td><td>SRAS og LRAS</td></tr>\n<tr><td><b>Vænt verðlag / verðbólguvæntingar</b></td><td>aðeins SRAS</td></tr>\n<tr><td>Olíu- og orkuverð (tímabundið)</td><td>aðeins SRAS</td></tr>\n<tr><td>Verðlag</td><td>hreyfing eftir</td></tr>\n</tbody></table></div></div>\n</div>\n<div class=\"scroll\"><table class=\"tt\"><thead><tr><th>Skellur</th><th>Skammur tími</th><th>Langur tími, enginn grípur inn í</th></tr></thead><tbody>\n<tr><td><b>AD ← varanlegt</b> (eldgos hræðir ferðamenn)</td><td>Y ↓, P ↓</td><td>SRAS → · Y = Y*, P lægra</td></tr>\n<tr><td><b>AD → varanlegt</b> (G ↑ fyrir kosningar, bjartsýni)</td><td>Y ↑, P ↑</td><td>SRAS ← · Y = Y*, P hærra</td></tr>\n<tr><td><b>SRAS ← tímabundið</b> (OPEC, rússneskt gas)</td><td>Y ↓, P ↑: kreppuverðbólga</td><td>SRAS aftur → · sami punktur og áður</td></tr>\n<tr><td>SRAS ← og SÍ <b>lækkar</b> vexti</td><td>AD → , P hækkar enn</td><td>Y = Y*, P hærra</td></tr>\n<tr><td>AD → og SÍ <b>hækkar</b> vexti</td><td>AD aftur ←</td><td>sami punktur og áður</td></tr>\n</tbody></table></div>\n<p class=\"hint\">Vextir hafa áhrif á AD, aldrei á AS. Aðlögunin til langs tíma kemur alltaf frá SRAS (væntingar og laun), ekki frá AD. Okun: <span class=\"mono\">u = u_pot − c·(Y − Y*)/Y*</span>.</p></section>"
      },
      {
        "id": "hag103g-14",
        "n": "14",
        "title": "Peningastefna og ríkisfjármál",
        "html": "<section><h2><span class=\"n\">14</span>Peningastefna og ríkisfjármál</h2>\n<div class=\"cols\"><div><ul>\n<li>SÍ stýrir vöxtum og peningamagnið aðlagast. Vextir ráðast á peningamarkaði til skamms tíma, á lánsfjármarkaði til langs tíma.</li>\n<li>Vaxtalækkun: r ↓ ⇒ I, C ↑ og krónan veikist ⇒ NX ↑ ⇒ AD →. Áhrifin koma fram á 6–18 mánuðum.</li>\n<li><b>Margfeldisáhrif ýkja, ruðningsáhrif draga úr.</b> Ruðningur: G ↑ ⇒ Y ↑ ⇒ peningaeftirspurn ↑ ⇒ r ↑ ⇒ I ↓. Minnstur í slaka.</li>\n<li>Skattalækkun hefur minni áhrif en jafn há útgjöld (fyrsta umferð MPC·ΔT). Varanleg &gt; tímabundin. Fjárfesting &gt; millifærslur.</li>\n</ul></div><div><ul>\n<li><b>Sjálfvirkir sveiflujafnarar</b>: skatttekjur lækka og bætur hækka í kreppu, án ákvörðunar. Hallalaus fjárlög á hverju ári magna sveifluna.</li>\n<li>Við framboðsskell getur peningastefnan varið annaðhvort framleiðslu eða verðlag, ekki hvort tveggja.</li>\n<li>COVID 2020: vextir 3% → 0,75%, bindiskylda 1% → 0%. Svo spenna, verðbólga 10,2% (feb. 2023) og vextir 9,25% (ág. 2023).</li>\n<li>Okt. 2026: vextir óbreyttir í 8% þótt verðbólga væri 5,9%, því hækkunin kom aðallega úr eldsneytisverði (tímabundinn framboðsskellur).</li>\n</ul></div></div></section>"
      },
      {
        "id": "hag103g-15",
        "n": "15",
        "title": "Phillips-kúrfan og Taylor-reglan",
        "html": "<section><h2><span class=\"n\">15</span>Phillips-kúrfan og Taylor-reglan</h2>\n<div class=\"cols\"><div>\n<div class=\"f\">u = u_pot − a(π − πᴱ)<br>π &gt; πᴱ ⇒ u &lt; u_pot</div>\n<ul>\n<li>Phillips 1958 (Bretland). Friedman og Phelps: <b>LRPC lóðrétt</b> við náttúrulegt atvinnuleysi.</li>\n<li><b>SRPC hliðrast vegna verðbólguvæntinga og framboðsskella</b> (komið bæði árin). AD-breytingar eru hreyfing eftir SRPC.</li>\n<li><b>Óvænt mikil verðbólga: fyrst upp og til vinstri eftir SRPC, svo hliðrast SRPC upp og til hægri</b>; aftur á u_pot með hærri verðbólgu. Spegilmynd ef verðbólga er minni en vænst.</li>\n</ul></div><div><ul>\n<li><b>Taylor: hækka vexti um meira en eitt prósentustig fyrir hvert prósentustig verðbólgu umfram markmið.</b></li>\n<li class=\"mono\">MT30: r = p + 0,5y + 0,5(p − 2) + 2</li>\n<li>QMM (SÍ): λ = 0,6, β = 1,5, ∅ = 0,5, markmið 2,5%.</li>\n<li>Fórnarhlutfall = VLF-tap (%) / lækkun verðbólgu, oft 3–5. Volcker: 15% → 3%, atvinnuleysi nær 11%.</li>\n<li>Trúverðugur og sjálfstæður seðlabanki ⇒ væntingar lækka strax ⇒ ódýrari hjöðnun. Tyrkland: 85,5% (okt. 2022).</li>\n</ul></div></div></section>"
      },
      {
        "id": "hag103g-16",
        "n": "16",
        "title": "Framboðsstefna, kreppur, evran og ytri áhrif",
        "html": "<section><h2><span class=\"n\">16</span>Framboðsstefna, kreppur, evran og ytri áhrif</h2>\n<div class=\"cols\"><div><ul>\n<li>Framboðsstefna hliðrar LRAS til hægri. Markaðsaðgerðir: skattar, einkavæðing, afnám reglna. Beinar: menntun, innviðir, rannsóknir.</li>\n<li>Laffer: 0% og 100% skattur gefa engar tekjur. Ísland 1989–2002 (50% → 18%) sannar ekki kúrfuna: margt annað breyttist.</li>\n<li><b>Fyrsta markaðsbólan: túlípanar í Hollandi</b> (1637). Svo 1929, Lehman 2008 og íslensku bankarnir 2008.</li>\n<li><b>Ytri áhrif</b> = áhrif á þriðja aðila sem ekki er tekið tillit til. Neikvæð ⇒ skattur eða mengunarleyfi (ETS 2005). Sameign ⇒ ofnýting (aflamark 1983). Loftslagsleikurinn: Nash (10, 10), ekki Pareto-skilvirkt.</li>\n</ul></div><div><ul>\n<li><b>Mundell: sveigjanleg laun, hreyfanlegt vinnuafl, samhverf áföll.</b> Hjálpar: fjármagnsflæði, innbyrðis viðskipti, sameiginleg ríkisfjármál og tryggingar. <b>Ekki „jafn stór lönd“.</b></li>\n<li>Galli myntbandalags: engin eigin peningastefna né gengi. Aðlögun með innri gengisfellingu (P ↓), hægt og með atvinnuleysi.</li>\n<li>Maastricht: verðbólga ≤ 2,7%, langtímavextir ≤ 5,1%, halli ≤ 3%, skuldir ≤ 60%, 2 ár í ERM II. Ísland uppfyllir halla og skuldir.</li>\n<li>29. ágúst 2026: ráðgefandi atkvæðagreiðsla um að hefja aftur viðræður, ekki um aðild eða evru.</li>\n</ul></div></div></section>"
      },
      {
        "id": "hag103g-17",
        "n": "17",
        "title": "Gildrurnar",
        "html": "<section><h2><span class=\"n\">17</span>Gildrurnar</h2>\n<ul>\n<li>Lestu hvort spurt er um <b>EKKI</b>. Þær voru margar á öllum prófunum.</li>\n<li>Reiknaðu áður en þú lítur á valkostina; rangir valkostir eru algengu villurnar (1/MPC, gleyma margfaldaranum, gleyma að setja í annað veldi).</li>\n<li>Í AS-AD og Phillips: hvaða kúrfa hreyfist <b>fyrst</b>? Röðin „hreyfing eftir, svo hliðrun“ greinir á milli valkosta.</li>\n<li>„Tímabundinn“ skellur ⇒ sami punktur til langs tíma. „Varanlegur“ ⇒ sama Y en nýtt verðlag.</li>\n<li>50 spurningar á 180 mínútum: farðu eina umferð og merktu það sem tekur meira en 4 mínútur.</li>\n</ul></section>"
      }
    ]
  },
  "plan": {
    "eyebrow": "17. nóvember – 7. desember",
    "title": "Áætlun fram að lokaprófi",
    "intro": "Raðað í kringum hin prófin (HAG101G 25.11, HAG108G 1.12, HAG107G 4.12) og kvöldin í Laugó. Lengri blokkir eru klofnar með hléi. Tvö full próf á tíma: það fyrra sýnir hvar þú stendur, það seinna hvort það hefur lagast.",
    "days": [
      {
        "date": "2026-11-17",
        "label": "Þri 17. nóv.",
        "title": "Greining á seinni hlutanum",
        "items": [
          {
            "m": 72,
            "h": "Próf: Seinni hlutinn á tíma",
            "p": "20 spurningar án glósa. Niðurstaðan segir hvar þú byrjar.",
            "go": {
              "v": "exam",
              "start": "second"
            }
          },
          {
            "m": 15,
            "h": "Hlé",
            "brk": true
          },
          {
            "m": 30,
            "h": "Yfirferð villna",
            "p": "Lestu útskýringuna við hverja villu og skrifaðu eina línu: hvað hugsaðir þú vitlaust?",
            "go": {
              "v": "wrong"
            }
          }
        ]
      },
      {
        "date": "2026-11-19",
        "label": "Fim 19. nóv.",
        "title": "Keynes, IS-LM og AS-AD",
        "note": "Eftir síðasta fyrirlesturinn. Ef nýtt efni kemur þar, skrifaðu það á blað.",
        "items": [
          {
            "m": 20,
            "h": "Blaðið, kaflar 11–13",
            "p": "Skrifaðu svo töfluna „Hvað hliðrar hverju“ og skellatöfluna eftir minni.",
            "go": {
              "v": "sheet"
            }
          },
          {
            "m": 30,
            "h": "Æfing: Keynes og IS-LM",
            "go": {
              "v": "practice",
              "topics": [
                "key"
              ]
            }
          },
          {
            "m": 10,
            "h": "Hlé",
            "brk": true
          },
          {
            "m": 30,
            "h": "Æfing: AS-AD",
            "go": {
              "v": "practice",
              "topics": [
                "asd"
              ]
            }
          }
        ]
      },
      {
        "date": "2026-11-21",
        "label": "Lau 21. nóv.",
        "title": "Hagstjórn, Phillips og Taylor",
        "items": [
          {
            "m": 15,
            "h": "Blaðið, kaflar 14–15",
            "go": {
              "v": "sheet"
            }
          },
          {
            "m": 35,
            "h": "Æfing: peningastefna og ríkisfjármál",
            "go": {
              "v": "practice",
              "topics": [
                "hag"
              ]
            }
          },
          {
            "m": 15,
            "h": "Hlé",
            "brk": true
          },
          {
            "m": 35,
            "h": "Æfing: Phillips-kúrfan og Taylor",
            "go": {
              "v": "practice",
              "topics": [
                "phi"
              ]
            }
          },
          {
            "m": 10,
            "h": "Hlé",
            "brk": true
          },
          {
            "m": 45,
            "h": "Reikningapróf á tíma",
            "p": "15 reikningsdæmi: margfaldarar, Okun, Taylor og fyrri hlutinn.",
            "go": {
              "v": "exam"
            }
          }
        ]
      },
      {
        "date": "2026-11-22",
        "label": "Sun 22. nóv.",
        "title": "Restin af nýja efninu",
        "items": [
          {
            "m": 15,
            "h": "Blaðið, kafli 16",
            "go": {
              "v": "sheet"
            }
          },
          {
            "m": 30,
            "h": "Æfing: framboðsstefna, kreppur, evran og ytri áhrif",
            "go": {
              "v": "practice",
              "topics": [
                "frb",
                "kre",
                "evr",
                "umh"
              ]
            }
          },
          {
            "m": 10,
            "h": "Hlé",
            "brk": true
          },
          {
            "m": 25,
            "h": "Villubankinn",
            "go": {
              "v": "wrong"
            }
          }
        ]
      },
      {
        "date": "2026-11-26",
        "label": "Fim 26. nóv.",
        "title": "Fullt lokapróf 1",
        "note": "Daginn eftir HAG101G. Ef þú ert búinn á því, færðu þetta á föstudag fyrir kvöldið.",
        "items": [
          {
            "m": 180,
            "h": "Fullt lokapróf á tíma",
            "p": "50 spurningar, 3 klst. Taktu 5 mín. hlé eftir 25 spurningar eins og þú ætlar að gera í prófinu.",
            "go": {
              "v": "exam"
            }
          }
        ]
      },
      {
        "date": "2026-11-28",
        "label": "Lau 28. nóv.",
        "title": "Yfirferð og veikustu flokkarnir",
        "note": "Stutt, því HAG108G er 1. des.",
        "items": [
          {
            "m": 30,
            "h": "Villurnar úr lokaprófi 1",
            "go": {
              "v": "wrong"
            }
          },
          {
            "m": 10,
            "h": "Hlé",
            "brk": true
          },
          {
            "m": 30,
            "h": "Æfa tvo veikustu flokkana",
            "go": {
              "v": "weak"
            }
          }
        ]
      },
      {
        "date": "2026-12-02",
        "label": "Mið 2. des.",
        "title": "Stutt viðhald",
        "note": "Síðdegis, fyrir Laugó.",
        "items": [
          {
            "m": 30,
            "h": "Villubankinn",
            "go": {
              "v": "wrong"
            }
          }
        ]
      },
      {
        "date": "2026-12-05",
        "label": "Lau 5. des.",
        "title": "Fullt lokapróf 2",
        "items": [
          {
            "m": 180,
            "h": "Lokapróf 2025 eða nýtt fullt lokapróf á tíma",
            "p": "Gamla prófið sýnir hvað kemur aftur; nýtt blandað próf er óþekkt. Veldu það sem þú hefur ekki tekið.",
            "go": {
              "v": "exam"
            }
          },
          {
            "m": 20,
            "h": "Hlé og matur",
            "brk": true
          },
          {
            "m": 40,
            "h": "Yfirferð villna",
            "go": {
              "v": "wrong"
            }
          }
        ]
      },
      {
        "date": "2026-12-06",
        "label": "Sun 6. des.",
        "title": "Tæma villubankann",
        "items": [
          {
            "m": 40,
            "h": "Villubankinn þar til hann er tómur eða næstum því",
            "go": {
              "v": "wrong"
            }
          },
          {
            "m": 15,
            "h": "Hlé",
            "brk": true
          },
          {
            "m": 40,
            "h": "Blaðið allt",
            "p": "Keðjurnar, skellatöfluna, Phillips-röðina og Mundell-listann utanbókar. Ekkert nýtt efni eftir þetta.",
            "go": {
              "v": "sheet"
            }
          }
        ]
      },
      {
        "date": "2026-12-07",
        "label": "Mán 7. des.",
        "title": "Prófdagur",
        "items": [
          {
            "m": 30,
            "h": "Morgunn: Blaðið, kaflar 01, 13, 15 og 17",
            "p": "Létt upprifjun, engin ný próf.",
            "go": {
              "v": "sheet"
            }
          },
          {
            "m": 15,
            "h": "Upphitun: 10 auðveldar spurningar",
            "p": "Til að koma heilanum í gang, ekki til að læra.",
            "go": {
              "v": "practice"
            }
          },
          {
            "m": 0,
            "h": "Mæta í HT103 kl. 13:15",
            "p": "Reiknivél, skilríki, hlaðin tölva. Prófið hefst 13:30."
          }
        ]
      }
    ]
  },
  "examInfo": {
    "title": "Lokaprófið",
    "note": "Vægið byggir á Lokaprófum 2024–25, Hlutaprófum 2025–26 og efni haustsins 2026. Glærur MT26–27 og MT32 vantaði, svo þeir flokkar byggja á gömlu prófunum, Skilaverkefni 4 og Sýnidæmi 4.",
    "facts": [
      {
        "value": "50",
        "label": "krossaspurningar, 5 valkostir"
      },
      {
        "value": "3 klst.",
        "label": "um 3,6 mín. á spurningu"
      },
      {
        "value": "0",
        "label": "dregið frá fyrir rangt svar"
      },
      {
        "value": "~20",
        "label": "spurningar úr seinni hlutanum"
      }
    ]
  },
  "passScore": 1,
  "sourceLabels": {
    "gen": "Reikningar"
  },
  "genLabel": "Reikningur",
  "newSrc": {
    "prefix": "Ný · byggt á ",
    "fallback": "Ný spurning"
  },
  "legacy": {
    "key": "hag103g-hlutaprof-v1",
    "file": "HAG103G prófæfing.html"
  }
};

/** @type {import('../schema.js').Course} */
export default adapt(meta, L);
