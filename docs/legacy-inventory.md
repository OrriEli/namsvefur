# Úttekt á gömlu síðunum

17. nóv. 2026 · lokaprófsútgáfurnar (fyrri úttekt, 29. okt., er í git-sögunni)

Þessi skrá lýsir gömlu prófæfingasíðunum fimm eins og þær liggja í `legacy/` eftir að Orri uppfærði þær allar fyrir lokaprófin. Tölurnar eru ekki taldar í höndunum: `scripts/inventory-legacy.js` hleður hverri síðu í lokað `vm`-umhverfi, les gagnafylkin úr minni hennar og keyrir hvern rafal. Talnablokkin neðst er skrifuð af skriftunni (`npm run inventory -- --write`), og `tests/extract.test.js` ber nýja vefinn saman við hana.

## Yfirlit

| Fag | Skrá | Vél | Geymslulykill | Lokapróf | Atriði | Rafalar | Æfingafærslur | Kaflar í Blaðinu |
| --- | --- | --- | --- | --- | --- | ---: | ---: | ---: |
| HAG101G | `HAG101G lokapróf.html` | skrifleg | `hag101g-lokaprof-v1` | 25. nóv. kl. 13:30 | 281 (135 skrifleg, 49 kross, 97 tölusvar) | 64 | 345 | 22 |
| HAG108G | `HAG108G prófæfing.html` | fyrirlestrar | `hag108g-profaefing-v1` | 1. des. kl. 13:30 | 417 (109 kross, 238 tölusvar, 29 skrifleg, 41 spjald) | 39 | 493 | 19 |
| HAG107G | `HAG107G prófæfing.html` | kross | `hag107g-lokaprof-v1` | 4. des. kl. 13:30 | 320 (270 kross, 11 veldu allt, 14 pörun, 25 tölusvar) | 43 | 363 | 12 |
| HAG103G | `HAG103G prófæfing.html` | kross | `hag103g-hlutaprof-v1` | 7. des. kl. 13:30 | 369 kross | 30 | 399 | 17 |
| HAG106G | `HAG106G prófæfing.html` | fyrirlestrar | `hag106g-profaefing-v1` | óstaðfest | 257 (92 kross, 117 tölusvar, 14 skrifleg, 34 spjald) | 30 | 313 | 12 |

Samtals **1.644 föst atriði**, **206 rafalar** og **1.913 æfingafærslur** (rafall með þremur stigum telst þrjár færslur; spjöld teljast ekki). Allar síðurnar hlaðast villulaust og engin auðkenni rekast á. Í HAG101G eru rafalarnir 34 og 30 þeirra hafa líka hraðútgáfu, svo þeir teljast 64.

Lokaprófsdagarnir eru af síðunum sjálfum og settir í `src/config.js`. HAG103G heldur geymslulykli hlutaprófsins; HAG101G og HAG107G fengu nýja lykla og flytja gömlu söguna inn sjálfar.

## Hvað breyttist frá miðannarútgáfunum

| Fag | Breytingar |
| --- | --- |
| HAG101G | Ný síða fyrir lokaprófið. Flokkum fjölgar úr 8 í 13 (ein breyta, fólgin föll, einsleitni, Taylor, hámörkun). Ný dæmi úr dæmablöðum 35–46, lokaprófin 2023 og 2025 í heild, miðannarpróf 2025 og skilaverkefni 2. Prófsniðin eru *Lokapróf 2023*, *Lokapróf 2025* (100 stig hvort), *Miðannarpróf 2025*, *Blandað* og *Rafalapróf* (7 hlutar, 3 klst.). Blaðið hefur 22 kafla með efnisyfirliti og tenglum beint í æfingu. Áætlun 12.–25. nóv. |
| HAG103G | Seinni hluti námskeiðsins bætist við: `OLD2` (51), `NEW2` (101) og `GENS2` (8) í 8 nýjum flokkum (MT26–34). Flokkarnir skiptast í *Seinni hlutinn* og *Fyrri hlutinn*. Prófsnið: *Fullt lokapróf* (50 spurningar, 3 klst.), *Seinni hlutinn* (20, 72 mín.), *Reikningapróf*, *Lokapróf 2025* og *2024*. Áætlun 17. nóv. – 7. des. |
| HAG107G | Allt námskeiðið, 14 flokkar í þremur hlutum. Fjórar spurningagerðir eins og í Inspera: kross (allt að 11 kostir), „veldu allt sem á við“ (`multi`, hlutastig: rétt mínus rangt), pörun (`match`, raðir × dálkar) og tölusvar með einum eða fleiri liðum (`num`, sjálfgefin vikmörk 0,6%, minnst 0,011). Stig eftir gerð: kross 2, veldu allt 3, pörun ⌈raðir/2⌉ (minnst 2), tölusvar 2 á lið. Prófsnið: *Lokapróf* (48, 3 klst.), *Hálft lokapróf*, *Reikningapróf* og *Hluti 1–3*. Engin áætlun. |
| HAG106G | Fyrirlestur F10 bætist við. Nýr flipi í Blaðinu: *A4 formúlublað* (tvær síður, KaTeX-HTML teiknað fyrirfram, prentvænt). |
| HAG108G | Fyrirlestrar L08 (metlar) og L09 (tilgátupróf og öryggisbil) bætast við. Blaðið fær t- og χ²-töflur (reiknaðar með `PROB`). |

## Vélarnar þrjár

| Vél | Fög | Einkenni |
| --- | --- | --- |
| **Kross** | 103, 107 | Ein spurning í einu, flakk og merkingar (Inspera). Kvótar á flokka eða föst próf. HAG107G: fjórar gerðir og stig. |
| **Fyrirlestrar** | 106, 108 | Fyrirlestrar × 3 stig. Kross, tölusvar, skrifleg dæmi og spjöld. Hættir: valin stig, stigvaxandi, aðeins spjöld. Blandað próf: blanda á stig, lengd, skýringarspjöld, þak á skrifleg dæmi á stigi 3 og (108) lágmark R-spurninga. |
| **Skrifleg** | 101 | Skrifleg dæmi með sjálfsmati skref fyrir skref (vísbending, næsta skref, öll skref, rétt/vantaði). Hraðæfing með nákvæmu brotasvari. Skriflegt próf: öll dæmi í einu, svo sjálfsmat. |

## Villur í gömlu síðunum sem nýi vefurinn tekur á

Textinn er fluttur orðréttur. Þar sem gamla síðan er gölluð breytir nýi vefurinn ekki textanum heldur ver sig í millilaginu eða við teikningu:

1. **HAG101G, `g-homog` (hraðútgáfa):** þegar gráðan er 2 verður valkosturinn „Já, af gráðu 1“ til tvisvar. Millilagið fjarlægir tvítekna kosti (rétta svarið, „Nei“, breytist ekki).
2. **HAG101G, prím sem `\'`:** fjögur TeX-brot skrifa prím sem `\'` (t.d. `f\'\'(1)`), sem er ógilt TeX. KaTeX fær `\'` skilgreint sem `'`.
3. **HAG108G, `g-ols` á stigi 2:** þegar hallatalan er nákvæmlega 0 (u.þ.b. 2 af 100.000 keyrslum) stendur „= Infinity“ í gildrutextanum. Rafall sem skilar NaN, Infinity eða undefined í texta er keyrður aftur.
4. **HAG108G, „§“:** `calc()` fjarlægir `§` aðeins í fremsta reit línu, svo `L00-gl-2` og `L00-hv-3` sýna stakt „§“. Flutt orðrétt, eins og ákveðið var 30. okt.

## Talnablokk

Skrifuð af `npm run inventory -- --write`. Ekki breyta í höndunum.

<!-- inventory:counts:begin -->
```json
{
  "hag101g": {
    "items": 281,
    "byType": {
      "mc": 49,
      "num": 97,
      "steps": 135
    },
    "bySource": {
      "new": 72,
      "old": 26,
      "sheet": 37
    },
    "gens": 64,
    "entries": 345,
    "sheetSections": 22
  },
  "hag103g": {
    "items": 369,
    "byType": {
      "mc": 369
    },
    "bySource": {
      "new": 255,
      "old": 114
    },
    "gens": 30,
    "entries": 399,
    "sheetSections": 17
  },
  "hag106g": {
    "items": 257,
    "byType": {
      "card": 34,
      "mc": 92,
      "num": 117,
      "steps": 14
    },
    "bySource": {
      "new": 62,
      "old": 9,
      "sheet": 107,
      "slides": 79
    },
    "gens": 30,
    "entries": 313,
    "sheetSections": 12
  },
  "hag107g": {
    "items": 320,
    "byType": {
      "match": 14,
      "mc": 270,
      "multi": 11,
      "num": 25
    },
    "bySource": {
      "new": 261,
      "old": 59
    },
    "gens": 43,
    "entries": 363,
    "sheetSections": 12
  },
  "hag108g": {
    "items": 417,
    "byType": {
      "card": 41,
      "mc": 109,
      "num": 238,
      "steps": 29
    },
    "bySource": {
      "new": 70,
      "sheet": 183,
      "slides": 164
    },
    "gens": 39,
    "entries": 493,
    "sheetSections": 19
  }
}
```
<!-- inventory:counts:end -->
