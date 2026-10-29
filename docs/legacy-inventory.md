# Úttekt á gömlu síðunum

29. okt. 2026 · áfangi 0

Þessi skrá lýsir gömlu prófæfingasíðunum fimm eins og þær liggja í `legacy/`. Tölurnar eru ekki taldar í höndunum: `scripts/inventory-legacy.js` hleður hverri síðu í lokað `vm`-umhverfi (með DOM-staðgengli), les gagnafylkin beint úr minni og keyrir hvern rafal 200 sinnum á hverju stigi. Talnablokkin neðst er skrifuð af skriftunni (`npm run inventory -- --write`) og útdráttarprófin í áfanga 1–3 bera sig saman við hana.

## Yfirlit

| Fag | Skrá | Stærð | Geymslulykill | Föst atriði | Rafalar | Skjámyndir (nav) |
| --- | --- | --- | --- | --- | --- | --- |
| HAG101G | `HAG101G miðannarpróf.html` | 236 KB · 1.808 línur | `hag101g-midannar-v1` | 86 skrifleg dæmi + 101 hraðspurning | 25 (21 gefa líka hraðspurningu) | Yfirlit · Dæmi · Hraðæfing · Próf · Villur · Blaðið · Áætlun |
| HAG103G | `HAG103G prófæfing.html` | 199 KB · 1.703 línur | `hag103g-hlutaprof-v1` | 217 krossar (63 gamlar + 154 nýjar) | 22 | Yfirlit · Æfing · Próf · Villur · Blaðið · Áætlun |
| HAG106G | `HAG106G prófæfing.html` | 395 KB · 1.514 línur | `hag106g-profaefing-v1` | 229 (82 mc, 105 num, 12 steps, 30 card) | 27 × 3 stig = 81 færslur | Yfirlit · Æfing · Próf · Villur · Blaðið |
| HAG107G | `HAG107G prófæfing.html` | 182 KB · 1.533 línur | `hag107g-kaflaprof3-v1` | 141 kross (allar nýjar) | 25 | Yfirlit · Æfing · Próf · Villur · Blaðið · Áætlun |
| HAG108G | `HAG108G prófæfing.html` | 731 KB · 2.576 línur (þar af 367 KB KaTeX-letur í einni línu) | `hag108g-profaefing-v1` | 338 (86 mc, 196 num, 24 steps, 32 card) | 30 × 3 stig = 90 færslur | Yfirlit · Æfing · Próf · Villur · Blaðið |

Samtals **1.112 föst atriði** og **150 rafalar** (129 rafalaföll; 21 hraðútgáfa í HAG101G telst sér), sem verða **264 æfingafærslur** þegar rafölum með stigum er skipt upp.

Allar síðurnar hlaðast án villu í umhverfinu, engin auðkenni eru tvítekin innan síðu og enginn rafall kastaði villu, skilaði `NaN`/`Infinity` eða tvíteknum valkosti í 200 keyrslum.

## Þrjár vélar

Síðurnar fimm byggja á þremur vélum. Útlit, CSS-breytur, leiðsögn, villubanki, vegið úrtak og tímamælir eru eins í öllum.

| Vél | Fög | Einkenni |
| --- | --- | --- |
| **Krossavél** | 103, 107 | Eins kóði; munar aðeins á efnisflokkum, `MIX`, dagsetningu, áætlun og textum. Ein gerð: kross með 5 valkostum. Rafall skilar `{q, o, a:0, e}`. |
| **Fyrirlestravél** | 106, 108 | Fyrirlestrar × 3 erfiðleikastig. Fjórar gerðir (`mc`, `num`, `step`, `card`). Rafall er `f(lvl)` og skilar `num(...)` eða `mc(...)`. Stigvaxandi háttur, spjöld, blandað próf. 108 = 106 + KaTeX, R-merki, líkindasvör (`prob`), lágmark R-spurninga og fleiri kaflar í Blaðinu. |
| **Skrifleg vél** | 101 | Brotareikningur (`Q`-klasi) og fylkjasafn, MathJax, skrifleg dæmi með sjálfsmati *rétt/rangt á hvert skref*, hraðspurningar með nákvæmu brotasvari, skriflegt próf þar sem öll dæmi birtast í einu. |

### Sameiginleg hegðun (og þar sem hún er ekki eins)

| Atriði | 103 / 107 | 106 / 108 | 101 |
| --- | --- | --- | --- |
| Vægi í úrtaki | rafall 2 · ósnert 3 · í villubanka 5 · `s ≥ 2` → 0,25 · annars 1 | sama röð, en `s ≥ 2` → **0,3** | í villubanka 5 (athugað **fyrst**) · rafall 2 · ósnert 3 · fullt hús → **0,3** · annars 1 |
| Hvenær telst svar rétt | valinn kostur = rétt | `score ≥ 0,7` (skref: hlutfall stiga) | skriflegt: **fullt hús** · hraðspurning: rétt svar |
| Villubanki | út eftir 2 rétt í röð | sama | sama; skrifleg og hraðspurningar í sitt hvorum flokki |
| Forðast endurtekningu | síðustu `min(12, ⌊pool/2⌋)` | sama (spjöld: 8) | skrifleg 12, hraðspurningar 20 |
| Stokkun valkosta | við birtingu | sama | sama (hraðspurningar með `o`) |
| Flýtilyklar | `1`–`5` og `a`–`e` velja, `Enter` áfram, `←`/`→` í prófi | `1`–`5` velja, `Enter` svarar/snýr/áfram | Dæmi: `h` vísbending, `n` næsta skref, `a` öll skref, `r`/`v` rétt/vantaði, `Enter` áfram · Hraðæfing: `1`–`5` og `a`–`e`, `Enter` |
| Stærðfræði | engin | 106: engin · 108: KaTeX (`\(…\)`, `\[…\]`) | MathJax 3 (`\(…\)`, `\[…\]`) |

### Talnasniðið `F`

Fjórar útgáfur eru til. Þær gefa sama úttak nema í sjálfgefnum aukastöfum `F.pct`:

| Síða | Föll | `F.pct` sjálfgefið |
| --- | --- | --- |
| 103, 107 | `int`, `dec`, `pct`, `num` | 1 aukastafur |
| 106 | `int`, `dec`, `pct`, `pp`, `kr`, `usd`, `n` | **2 aukastafir** |
| 108 | `int`, `dec`, `pct`, `n`, `s`, `m` (KaTeX), `mi` (KaTeX) | 1 aukastafur |
| 101 | ekkert `F`; brot og tugabrot eru skrifuð sem TeX með `tx`, `dec`, `poly` o.fl. | – |

Punktur skilur þúsundir, komma aukastafi, mínus er U+2212. `dec` í 103/107 og 106/108 eru skrifuð á ólíkan hátt en sleppa bæði mínusmerki á gildum sem námundast í núll.

## HAG101G · Hagræn stærðfræði I

**Síðan.** „Miðannarprófið · HAG101G · 5. nóv.“ Próf `EXAM_AT = 2026-11-05T16:00Z`, 90 mín., skriflegt, engin reiknivél. MathJax 3.2.2 af cdnjs; viðvörun birtist ef það hleðst ekki á 12 s.

**Geymsla** (`hag101g-midannar-v1`): `{st, qs, wrong, plan, exam, last, hist}`

- `st[id] = {n, p, m, t}`: skrifleg dæmi; `p` = stig fengin samtals, `m` = hámark samtals.
- `qs[id] = {n, c, t, s}`: hraðspurningar; `s` = rétt í röð.
- `wrong[id] = 0 | 1`: lyklar eru auðkenni skriflegra dæma, rafala (`g-mul`), hraðspurninga (`Q-F1`) og hraðútgáfa rafala (`q:g-mul`).
- `plan[i] = bool`, `hist[] = {label, score, tot, at}`, `last = {label, score, tot}`, `exam` = próf í gangi.

**Gagnafylki**

| Fylki | Innihald | Fjöldi |
| --- | --- | ---: |
| `SHEET_PROBS` | dæmablað 18–34 (`D18`–`D34`), lokapróf 2023/2025 (`L23-*`, `L25-*`), skilaverkefni 1 (`S1-1`–`S1-5`) | 29 |
| `NEW_PROBS` | ný skrifleg dæmi (`N-F1` …), byggð á fyrirlestrarnótum | 57 |
| `STATIC` | `SHEET_PROBS` + `NEW_PROBS`, með `kind` = `blad` / `old` / `new` | 86 |
| `QUICK` | hraðspurningar (`Q-F1` …) | 101 |
| `GENS` | rafalar | 25 |
| `QGENS` | rafalar sem skila líka `quick` | 21 |
| `BLUEPRINT`, `OLD_EXAM` | prófsnið | 6, 7 |
| `TOPICS`, `ORDER` | efnisflokkar | 8 |
| `PLAN` | áætlun 27. okt. – 5. nóv. (10 dagar, 38 liðir) | 10 |
| `SHEET` | Blaðið, HTML-strengur (10 kaflar `s1`–`s10`) | 1 |

**Spurningagerðir og svið**

| Gerð | Fjöldi | Svið |
| --- | ---: | --- |
| Skriflegt dæmi | 86 | `id, t, src, q, steps[{titill, stig, lausn}]`, valkvætt `exam` (vægi á gömlu prófi, 7 dæmi), `chk` (prófunargögn, 39 dæmi). Engin `e`. 2–9 skref, 3–20 stig. |
| Hraðspurning, kross | 29 | `id, t, src, q, o[5], a` (`a` = númer rétts kosts) |
| Hraðspurning, tölusvar | 72 | `id, t, src, q, a` þar sem `a` er **strengur**: heiltala (56) eða brot `p/q` (16). Metið nákvæmlega með brotareikningi; inntak má vera heiltala, brot eða tugabrot. Engin `e`. |
| Rafall | 25 | `f()` → `{q, steps, chk, quick?}`; `quick = {q, a, o?}`. 18 gefa tölusvar, `g-hess3` og `g-cd` gefa kross, `g-hess2` hvort tveggja. `g-AXB`, `g-cr3`, `g-solveinv` og `g-drule` hafa enga hraðútgáfu. |

**Efnisflokkar**

| Kóði | Efnisflokkur | Kafli | Vægi | Skrifleg | Hraðsp. | Rafalar | þar af hraðútg. |
| --- | --- | --- | --- | ---: | ---: | ---: | ---: |
| `fyl` | Fylkjaaðgerðir og vigrar | 4.1–4.7 | 15 | 17 | 16 | 4 | 4 |
| `akv` | Ákveður og raðtala | 5.1–5.3 | 20* | 8 | 15 | 3 | 3 |
| `and` | Andhverfa | 5.4 | 20* | 13 | 12 | 3 | 2 |
| `jof` | Jöfnukerfi og Cramer | 5.4–5.5 | 20 | 10 | 10 | 3 | 1 |
| `dif` | Diffrunarreglur | 7.2–7.3 | 15* | 9 | 14 | 4 | 4 |
| `hlu` | Hlutafleiður | 7.4 | 15* | 7 | 10 | 1 | 1 |
| `hes` | Hessian: hvelft, kúpt, útmörk | tími · 11.4 | 15 | 11 | 12 | 3 | 3 |
| `mis` | Mismunur og heildarmismunur | 8.1–8.3 | 15 | 11 | 12 | 4 | 3 |
| | **Samtals** | | | **86** | **101** | **25** | **21** |

\* = flokkurinn deilir dæmi með öðrum á prófinu.

Uppruni skriflegra dæma: dæmablað 17, gömul próf og skilaverkefni 12, ný 57. Hraðspurningar hafa engan uppruna nema `src`.

**Prófsnið** (allt 90 mín., öll dæmi birt í einu, sjálfsmat skref fyrir skref eftir skil)

| Snið | Samsetning |
| --- | --- |
| Blandað próf | `BLUEPRINT`: fyl 15 · akv/and 20 · jof 20 · dif/hlu 15 · hes 15 · mis 15 = 100 stig. Eitt dæmi á hlut, úr föstum dæmum með ≥ 5 stig eða rafölum. Stig dæmis = vægi × (fengin / hámark). |
| Lokaprófsliðirnir | `OLD_EXAM`: L23-1 (15), L23-2 (15), L25-1 (20), L25-2 (15), L25-3 (5), L25-4 (11), L25-7 (16) = **97 stig** |
| Rafalapróf | sama `BLUEPRINT`, aðeins rafalar |

**Blaðið:** 01 Fyrirkomulag · 02 Fylkjaaðgerðir · 03 Ákveður · 04 Andhverfa · 05 Jöfnukerfi og regla Cramers · 06 Diffrunarreglur · 07 Hlutafleiður og Hessian · 08 Mismunur og heildarmismunur · 09 Gildrur · 10 Frágangur sem gefur stig.

**Skrefaspilarinn** hefur þrjú stig á hverju skrefi: falið, titill sýndur (vísbending) og lausn sýnd. Hvert sýnt skref er merkt *Rétt hjá mér* eða *Vantaði eða rangt*; þegar öll eru merkt er dæmið skráð. Hnappurinn *Allt rétt* merkir öll í einu.

**Áætlun:** dagar 27. okt. – 5. nóv. með dagatalslínu (`cal`), athugasemd og liðum `{at, m, h, p, go, brk}`. `go` vísar á skjámynd með síum, t.d. `{v:'practice', topics:['fyl'], kind:'blad'}` eða `{v:'sheet', sec:'s9'}`.

## HAG103G · Heildahagfræði I

**Síðan.** „Hlutaprófið · HAG103G · 23. okt.“ `EXAM_AT = 2026-10-23T14:20Z` (liðið). 20 krossar, 60 mín., ekki dregið frá.

**Geymsla** (`hag103g-hlutaprof-v1`): `{st, wrong, plan, start, exam, last, hist}`; `st[id] = {n, c, s, t}`, `wrong[id] = 0 | 1`, `start = 'HH:MM'` (upphaf áætlunar), `hist[] = {label, n, c, at}`.

**Gagnafylki:** `OLD` 63 (H25 17, L25 26, L24 20), `NEW` 154, `GENS` 22, `TOPICS` 9, `MIX`, `PLAN` 13 liðir, `SHEET` (11 kaflar).

**Gerð og svið:** aðeins kross. `{id, t, src, q, o, a, e}`; `NEW` hefur ekki `src` og birtist sem „Ný spurning“. 216 með 5 valkosti, `H25-18` með 4. 52 gömul atriði hafa `a ≠ 0`. Rafall `f()` → `{q, o[5], a:0, e}`.

| Kóði | Efnisflokkur | Tilvísun | Gömul | Nýjar | Rafalar | Í blönduðu prófi |
| --- | --- | --- | ---: | ---: | ---: | ---: |
| `pen` | Peningar, bankar og verðbólga | MT24 | 14 | 37 | 1 | 4 |
| `vin` | Vinnumarkaður og atvinnuleysi | MT15, 22 | 8 | 20 | 3 | 3 |
| `opi` | Opið hagkerfi | MT25 | 9 | 22 | 3 | 3 |
| `rei` | Fastir reikningar og mælingar | MT20, 23 | 10 | 11 | 8 | 2 |
| `vox` | Hagvöxtur og Solow | MT20–21 | 7 | 17 | 4 | 3 |
| `ojo` | Ójöfnuður og fátækt | MT16 | 6 | 13 | 1 | 2 |
| `spa` | Sparnaður og lánsfjármarkaður | MT23 | 4 | 14 | 1 | 2 |
| `vid` | Alþjóðaviðskipti | MT17 | 5 | 13 | 1 | 1 |
| `gru` | Grunnhugtök | MT1–2 | 0 | 7 | 0 | – |
| | **Samtals** | | **63** | **154** | **22** | **20** |

**Prófsnið (Inspera):** flakk og merkingar, ekkert birt fyrr en skilað.

| Snið | Samsetning | Tími |
| --- | --- | --- |
| Blandað próf | `MIX` eftir flokkum (tafla að ofan), vegið úrtak úr föstum atriðum og rafölum, stokkað | 60 mín. |
| Hlutapróf 2025 | öll `H25-*` (17) í röð | 3 mín. á spurningu = 51 mín. |
| Reikningapróf | 15 rafalar af handahófi | 45 mín. |

**Blaðið:** 01 Fyrirkomulag · 02 Jöfnurnar þrjár sem Haukur nefndi · 03 Fastir reikningar · 04 Gefnar formúlur · 05 Keðjurnar fimm í opna hagkerfinu · 06 Lánsfjármarkaðurinn · 07 Vinnumarkaður og atvinnuleysi · 08 Peningar og bankar · 09 Hagvöxtur, Solow og VLF · 10 Alþjóðaviðskipti og ójöfnuður · 11 Gildrurnar.

**Áætlun:** 13 liðir `{m, h, p, go, brk}` frá upphafstíma (sjálfgefið 07:00) fram að prófi kl. 14:20.

**Efnissvið:** aðeins efni hlutaprófsins (MT 1, 2, 15–17, 20–25). MT34 er sleppt viljandi.

## HAG106G · Fjármálahagfræði I

**Síðan.** „Lokaprófið · HAG106G“. `EXAM = {at: null, minutes: 180, format: 'Skriflegt lokapróf, 50% af einkunn. Snið óstaðfest.', aids: 'Reiknivél og formúlublað (líklegt, óstaðfest)', sheetAllowed: true, explainQuestions: true}`.

**Geymsla** (`hag106g-profaefing-v1`): `{st, wrong, cards, exam, last, hist, adapt}`; `st[key] = {n, c, s}` þar sem `c` er summa einkunna á bilinu 0–1; lykill rafals er `g-ev@2` (rafall@stig); `cards[id] = {seen, again}`; `adapt = {lvl, up, down, msg}`; `hist[] = {label, pct, at}`.

**Gagnafylki:** `BANK` 229, `GENS` 27, `LECTURES` 8, `LEVELS` 3, `MIXES` 2, `LEN` 2, `SHEET_LEC` 8, `SHEET_RULES` 11, `SHEET_DECIDE` 9, `SHEET_TRAPS` 20. Afleidd: `STATIC` 199 (allt nema spjöld), `CARDS` 30, `ENTRIES` 280 (199 + 27 × 3).

**Gerðir og svið**

| `kind` | Fjöldi | Svið |
| --- | ---: | --- |
| `mc` | 82 | `id, lec, lvl, kind, from, src, q, o[5], a, e` (alltaf `a = 0`) |
| `num` | 105 | `… q, ans, tol, unit, e`. Vikmörk: 0,01 (69), 0,5 (10), 1 (11), 0,05 (4), 0,005 (4), 0,0001 (3), 0,65, 0,02, 0,001, 1000. Einingar: `%` 53, `kr.` 21, `$` 16, `ár` 5, `ma.kr.` 4, `pp` 2, `kr./USD`, `M$`, engin 2. |
| `step` | 12 | `… q, steps[{h, p, e}]` (3–4 skref), alltaf stig 3 |
| `card` | 30 | `… q, back, keys[]`, alltaf stig 3 |

Rafall: `{id, lec, name, f(lvl)}` → `{kind:'num', q, ans, tol, unit, e, x, p}` eða `{kind:'mc', q, o, a:0, e, x, p}`. `x` = rétt svar sem tala, `p` = forsendur. **Fjórar samsetningar skila ýmist `num` eða `mc` eftir keyrslum:** `g-fisher@2`, `g-fisher@3`, `g-tv@2`, `g-capm@3`.

| Fyrirlestur | Heiti | mc | num | steps | card | Stig 1 / 2 / 3 | Rafalar |
| --- | --- | ---: | ---: | ---: | ---: | --- | ---: |
| F1 | Fjármálaumhverfið | 13 | 4 | 0 | 4 | 7 / 6 / 8 | 1 |
| F2 | Markaðir, peningakerfi og stofnanir | 13 | 14 | 2 | 5 | 10 / 13 / 11 | 3 |
| F3 | Vextir | 11 | 15 | 1 | 4 | 9 / 11 / 11 | 5 |
| F4 | Tímavirði peninga | 10 | 17 | 1 | 4 | 11 / 12 / 9 | 4 |
| F5 | Skuldabréf og hlutabréf | 8 | 22 | 3 | 4 | 11 / 12 / 14 | 5 |
| F6 | Útboð, viðskipti og afleiður | 10 | 11 | 1 | 3 | 7 / 9 / 9 | 3 |
| F7–F8 | Ávöxtun og áhætta (hópur `F7`, `members: ['F7','F8']`) | 9 | 11 | 2 | 3 | 7 / 8 / 10 | 3 |
| F9 | Arðsemismat fjárfestinga | 8 | 11 | 2 | 3 | 7 / 8 / 9 | 3 |
| | **Samtals** | **82** | **105** | **12** | **30** | **69 / 79 / 81** | **27** |

| Uppruni (`from`) | Merking á síðunni | mc | num | steps | card | Alls |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| `gl` | Glærur og próf (sían tekur líka `mid`) | 44 | 18 | 0 | 0 | 62 |
| `db` | Dæmablöð | 29 | 63 | 12 | 3 | 107 |
| `ny` | Nýjar | 7 | 18 | 0 | 26 | 51 |
| `mid` | Miðannarpróf, „ein af verstu“ spurningunum | 2 | 6 | 0 | 1 | 9 |

**Prófsnið (blandað):** valdir fyrirlestrar × blanda × lengd. Krossar, tölusvör og skrifleg dæmi; flakk og merkingar; lausnir eftir skil; skrifleg dæmi metin sjálf í yfirferð.

| Stilling | Gildi |
| --- | --- |
| Blanda (stig 1/2/3) | *Eins og prófið* 0,2 / 0,5 / 0,3 · *Erfitt* 0,1 / 0,3 / 0,6 |
| Lengd | *Stutt* 90 mín., 12 dæmi, 1 spjald · *Löng* 180 mín., 24 dæmi, 2 spjöld (sjálfgefin þegar `EXAM.minutes ≥ 150`) |
| Dreifing | á fyrirlestra í hring; á stigi 3 mest ⌈n₃/3⌉ skrifleg dæmi |
| Stig | `step` 3, `mc`/`num` 1, `card` 0 (spjöld telja ekki) |
| Einkunn | stig / hámark × 10 |

**Æfing:** þrír hættir: *Valin stig*, *Stigvaxandi* (upp eftir 3 rétt í röð, niður eftir 2 röng) og *Aðeins spjöld* (spjald merkt „sýna aftur“ fær vægi 4, ósnert 3, séð 1). Yfirlitið er fylki fyrirlestra × stiga.

**Blaðið** (teiknað úr fylkjunum): ! Sérvenjur námskeiðsins · F1 … F9 (8 kaflar) · ✓ Ákvörðunarreglur · ✗ Gildrulisti, auk neðanmálsgreinar um óstaðfesta kröfuröð. Engin áætlun.

## HAG107G · Eindahagfræði I

**Síðan.** „Kaflapróf 3 · HAG107G · 26. okt.“ `EXAM_AT = 2026-10-26T16:00Z` (liðið). Sama vél og HAG103G.

**Geymsla** (`hag107g-kaflaprof3-v1`): sama snið og HAG103G; `start` sjálfgefið 12:00.

**Gagnafylki:** `OLD` 0 (engin gömul próf til), `NEW` 141, `GENS` 25, `TOPICS` 6, `MIX`, `PLAN` 9 liðir, `SHEET` (9 kaflar). `NEW` hefur `src` (t.d. „K11 · Einokun: skilgreining“, „Dæmablað 8, dæmi 1a“) og birtist sem „Ný · “ + `src`. Allar 141 með 5 valkosti og `a = 0`.

| Kóði | Efnisflokkur | Tilvísun | Gömul | Nýjar | Rafalar | Í blönduðu prófi |
| --- | --- | --- | ---: | ---: | ---: | ---: |
| `ein` | Einokun | K11 · DB7 #4, DB8 #1–3, AD7, AD8 #1 | 0 | 37 | 9 | 6 |
| `fak` | Fákeppni og leikjafræði | K13 · DB9 #1–3, AD9 #1 | 0 | 29 | 4 | 4 |
| `vid` | Alþjóðaviðskipti | K17 · DB9 #4, AD9 #2 | 0 | 24 | 6 | 4 |
| `eis` | Einokunarsamkeppni | K12 · DB8 #4, AD8 #2–4 | 0 | 22 | 0 | 3 |
| `ovi` | Óvissa og tryggingar | K18 | 0 | 23 | 4 | 3 |
| `gru` | Kostnaður og fullkomin samkeppni | DB7 #1–3 · upprifjun | 0 | 6 | 2 | – |
| | **Samtals** | | **0** | **141** | **25** | **20** |

**Prófsnið (Inspera):** *Blandað próf* (20, 60 mín., `MIX`), *Hugtakapróf* (20, 60 mín., sama vægi en aðeins `new`), *Reikningapróf* (15 rafalar, 45 mín.).

**Blaðið:** 01 Fyrirkomulag · 02 Einokun: formúlurnar · 03 Fastir reikningar og gildrur · 04 Tölurnar úr dæmablöðunum · 05 Markaðsformin fjögur · 06 Leikjafræði · 07 Alþjóðaviðskipti: svæðin · 08 Óvissa og upplýsingar · 09 Gildrurnar.

**Áætlun:** 9 liðir fram að prófi kl. 16:00.

**Efnissvið:** aðeins efni Kaflaprófs 3 (K11, K12, K13, K17, K18 og upprifjun úr DB7). Síðan nefnir ekkert lokapróf.

## HAG108G · Líkindafræði og forritun

**Síðan.** „Lokaprófið · HAG108G“. `EXAM.at = '2026-12-01T13:30:00Z'`, 180 mín., 70% af einkunn (verkefnin gilda aðeins ef ≥ 5). Hjálpargögn: reiknivél, formúlublað og töflur fyrir N/t/χ²/F. KaTeX 0.16.11 af cdnjs, letrið innbyggt sem base64.

**Geymsla** (`hag108g-profaefing-v1`): sama snið og HAG106G.

**Gagnafylki:** `BANK` 338 (byggt með `MCQ`, `NUM`, `PNUM`, `STEP`, `CARD`), `GENS` 30, `LECTURES` 8 (L00–L07; L08–L10 í athugasemd), `SHEET_LEC` 8, `SHEET_DIST` 9, `SHEET_RULES` 9, `SHEET_DECIDE` 14, `SHEET_R` 10, `SHEET_TRAPS` 16, `SHEET_ERRATA` 17, `UNCONFIRMED` 6, `PROB` (26 dreifingaföll með R-nöfnum). Afleidd: `STATIC` 306, `CARDS` 32, `ENTRIES` 396 (306 + 30 × 3).

**Gerðir og svið** (umfram HAG106G)

| `kind` | Fjöldi | Viðbótarsvið |
| --- | ---: | --- |
| `mc` | 86 | `r`, `rc`, `rx`, `rxo`, `x` (tölugildi rétts svars, 8 atriði, aðeins fyrir prófanir); `e` endar á lista „Rangir kostir“ með skýringu á hverjum röngum kosti |
| `num` | 196 | `prob: true` á 102 (líkur; „54,1%“ líka gilt svar), `r`, `rc`, `rx`. Vikmörk: 0,0005 (101), 0,001 (54), **0 (14)**, 0,01 (7), 0,0001 (4), 0,005 (4), 1 (3), 0,05 (3), 0,002 (2), 0,0016, 0,015, 2, 27. 185 án einingar. |
| `step` | 24 | `r` (2–5 skref) |
| `card` | 32 | eins og 106 |

R-merki: 37 föst atriði hafa `r: true`; 31 hafa R-kóða (`rc`) og vænt úttak (`rx`) sem gömlu prófanirnar keyrðu í alvöru R; 15 hafa `rxo` (aðeins úttak borið saman). Rafalarnir `g-r-index`, `g-r-mod`, `g-r-args`, `g-r-apply` eru R á öllum stigum, `g-ctf` aðeins á stigi 1.

| Fyrirlestur | Heiti | mc | num | steps | card | Stig 1 / 2 / 3 | Rafalar |
| --- | --- | ---: | ---: | ---: | ---: | --- | ---: |
| L00 | Inngangur og R | 31 | 7 | 4 | 4 | 15 / 16 / 15 | 4 |
| L01 | Útkomurúm og líkindi | 12 | 28 | 2 | 4 | 15 / 18 / 13 | 5 |
| L02 | Strjálar slembibreytur | 8 | 20 | 3 | 4 | 10 / 14 / 11 | 4 |
| L03 | Strjálar dreifingar | 7 | 28 | 2 | 4 | 11 / 17 / 13 | 4 |
| L04 | Samfelldar slembibreytur | 7 | 24 | 3 | 4 | 9 / 17 / 12 | 1 |
| L05 | Samfelldar dreifingar | 6 | 43 | 4 | 4 | 15 / 27 / 15 | 5 |
| L06 | Margvíðar slembibreytur og skilyrt vægi | 7 | 23 | 3 | 4 | 9 / 13 / 15 | 3 |
| L07 | Úrtök og höfuðmarkgildissetningin | 8 | 23 | 3 | 4 | 7 / 18 / 13 | 4 |
| | **Samtals** | **86** | **196** | **24** | **32** | **91 / 140 / 107** | **30** |

| Uppruni (`from`) | Merking á síðunni | mc | num | steps | card | Alls |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| `gl` | Glærur | 45 | 69 | 8 | 0 | 122 |
| `hv` | Heimaverkefni | 31 | 113 | 16 | 0 | 160 |
| `ny` | Nýjar | 10 | 14 | 0 | 32 | 56 |

Rafall skilar `num(...)`, `pnum(...)` (= `num` með `prob: true`) eða `mc(...)`; 17 rafall@stig gefa kross, 38 tölusvar og 35 líkindasvar.

**Prófsnið:** eins og HAG106G, auk þess að ef L00 er valið skiptir prófið út dæmum þar til minnst ⌈0,15 × n⌉ eru R-spurningar (`R_SHARE`).

**Blaðið:** Σ Allar dreifingar · = Reglur um E, Var og Cov · L00 … L07 (8 kaflar) · ✓ Ákvörðunarreglur · R R í hnotskurn · Φ Staðlaða normaldreifingin (tafla reiknuð með `PROB.pnorm`) · ✗ Gildrulisti · ! Villur á glærum og í lausnum, og reitur „Óstaðfest“ (6 atriði, líka á forsíðunni). Engin áætlun.

## Skjámyndir gömlu síðnanna

| Skjámynd | 101 | 103 / 107 | 106 / 108 |
| --- | --- | --- | --- |
| Yfirlit | niðurtalning, 4 staðreyndir, 3 aðgerðir, tafla eftir flokkum (skrifleg + hraðæfing) | niðurtalning, 4 staðreyndir, 3 aðgerðir (próf, veikustu flokkar, villubanki), tafla eftir flokkum með vægi | niðurtalning, 4 staðreyndir, 4 aðgerðir (próf, stigvaxandi, spjöld, villubanki), fylki fyrirlestra × stiga |
| Æfing | „Dæmi“: síur á flokka og uppruna; lausn opnuð skref fyrir skref, hvert skref merkt rétt/rangt | síur á flokka og uppruna (Allt / Gömul próf / Nýjar / Reikningar) | síur á fyrirlestra, hátt, stig og uppruna; tölusvar slegið inn; skref með hökum; spjöld |
| Hraðæfing | stuttar spurningar, svar slegið inn sem heiltala/brot eða valið | – | – |
| Próf | skriflegt: öll dæmi í einu, svo sjálfsmat | Inspera: ein í einu, grind, merkingar | blandað: grind, merkingar, skrifleg dæmi metin eftir skil |
| Villur | skrifleg og hraðspurningar aðskilin | eftir flokkum | eftir fyrirlestrum, með stigi |
| Blaðið | `SHEET` | `SHEET` | teiknað úr `SHEET_*` |
| Áætlun | 10 dagar | einn dagur | – |

## Það sem skiptir máli fyrir hönnunina

1. **Efnið nær aðeins yfir hluta námskeiðanna.** HAG103G nær yfir hlutaprófsefnið, HAG107G yfir Kaflapróf 3 og HAG101G yfir miðannarprófsefnið. Lokaprófin ná væntanlega yfir meira. Flutningurinn bætir engu við (sjá verklýsingu), en vélin þarf að þola að efnisflokkum fjölgi.
2. **Dagsetningar stangast á við verklýsinguna.** HAG108G-síðan segir lokapróf 1. des. 2026 kl. 13:30 (180 mín.); verklýsingin segir „óstaðfest“. HAG106G-síðan hefur enga dagsetningu.
3. **Rafalar eru kóði, ekki gögn.** Þeir byggja á hjálparsöfnum hverrar síðu: `Q`-brotaklasa og fylkjasafni (101, um 200 línur), `FIN` (106), `PROB` með `lgamma`, `pbeta` o.fl. (108), `opts`, `calc` og `F`. Útdrátturinn þarf að flytja þennan kóða óbreyttan.
4. **Rafall getur skipt um gerð á milli keyrslna** (fjórir í 106). Gerð atriðis ræðst því af því sem rafallinn skilar, ekki af rafalnum.
5. **Lyklar rafala með stigum eru `id@stig`** í geymslu 106/108 og hraðútgáfur 101 eru `q:id`. Ef nýju auðkennin halda þessu formi verður innflutningur gömlu sögunnar bein forskeyting.
6. **Tvær stærðfræðivélar.** MathJax (101) og KaTeX (108) nota sömu afmarkara. Öll 86 skriflegu dæmin og 94 af 101 hraðspurningu í 101, og 241 atriði í 108, innihalda TeX. Prófa þarf hvort allt TeX í 101 teiknast með KaTeX.
7. **Ólíkar reglur** um vægi í úrtaki (0,25 / 0,3), hvenær skriflegt dæmi telst rétt (fullt hús / ≥ 0,7) og sjálfgefna aukastafi í `F.pct` (1 / 2). Gerð er tillaga um sameiningu í `docs/schema.md`.
8. **Flýtilyklar rekast á.** Öryggismatið í verklýsingunni notar `V`, `H`, `G`, en í skrefaspilara 101 þýðir `v` „vantaði“ og `h` „vísbending“.
9. **Blöð 106 og 108 eru teiknuð í keyrslu** úr fylkjum og `calc()`; Φ-taflan í 108 er reiknuð. Útdrátturinn á því að geyma HTML-ið eins og `renderSheet()` skilar því, ekki fylkin.
10. **Villa í gömlu síðunni.** `calc()` í 108 fjarlægir `§` (merki um venjulegan texta) aðeins í fremsta reit línu, svo útskýringar `L00-gl-2`, `L00-hv-3` og rafalsins `g-r-index` á stigi 1 sýna stakt „§“. Textinn er fluttur orðrétt, með villunni, nema Orri vilji annað.

## Talnablokk

Skrifuð af `npm run inventory -- --write`. Ekki breyta í höndunum.

<!-- inventory:counts:begin -->
```json
{
  "hag101g": {
    "written": 86,
    "quick": 101,
    "quickMc": 29,
    "quickNum": 72,
    "gens": 25,
    "quickGens": 21,
    "sheetSections": 10
  },
  "hag103g": {
    "mc": 217,
    "old": 63,
    "new": 154,
    "gens": 22,
    "sheetSections": 11
  },
  "hag106g": {
    "mc": 82,
    "num": 105,
    "card": 30,
    "step": 12,
    "total": 229,
    "gens": 27,
    "genEntries": 81,
    "sheetSections": 11
  },
  "hag107g": {
    "mc": 141,
    "old": 0,
    "new": 141,
    "gens": 25,
    "sheetSections": 9
  },
  "hag108g": {
    "mc": 86,
    "num": 196,
    "step": 24,
    "card": 32,
    "total": 338,
    "gens": 30,
    "genEntries": 90,
    "sheetSections": 15
  }
}
```
<!-- inventory:counts:end -->
