# Námsvefur

Einn námsvefur fyrir prófæfingu í hagfræði við HÍ, haust 2026. Hann sameinar fimm gamlar prófæfingasíður (`legacy/`) í eitt forrit með sameiginlegri vél. Verklýsingin er í [docs/verklysing.md](docs/verklysing.md). Síðan 17. nóv. byggir vefurinn á lokaprófsútgáfum gömlu síðnanna.

## Skipanir

```bash
npm install
```

```bash
npm run dev            # þróunarþjónn á http://localhost:5173
```

```bash
npm test               # allar prófanir (Vitest)
```

```bash
npm run build          # kyrrstæð síða í dist/ (GitHub Pages)
```

```bash
npm run build:single   # ein HTML-skrá í dist-single/index.html
```

```bash
npm run extract        # flytur efnið aftur út úr legacy/ í src/courses/
```

```bash
npm run inventory      # úttekt á gömlu síðunum (JSON); `-- --write` uppfærir talnablokkina
```

## Uppbygging

- `legacy/`: gömlu síðurnar, aðeins lesnar.
- `docs/`: úttekt (`legacy-inventory.md`) og gagnasnið (`schema.md`).
- `scripts/`: útdráttur og úttekt. `lib/load-legacy.js` keyrir gamla síðu í lokuðu `vm`-umhverfi.
- `src/courses/`: eitt fag = lýsigögn (`hag103g.js`) + gagnablokk gömlu síðunnar orðrétt (`legacy/hag103g.js`), búnar til af `extract-legacy.js` (ekki breyta þeim í höndunum), og eitt millilag á hverja vél (`adapters/`).
- `src/engine/`: vélin (æfing, próf, villubanki). Hún veit ekki úr hvaða fagi atriði kemur.
- `src/store/`: geymslulag með útgáfunúmeri; allt vistast undir `namsvefur-v1`.
- `src/views/`: ein skrá á hverja skjámynd. `src/ui/`: stílar (`base.css` og `legacy.css` úr gömlu síðunum, `styles.css` viðbætur vefsins), talnasnið, hjálparföll.
- `src/config.js`: prófdagar, markmið og upptekin kvöld.

## Staða

| Áfangi | Efni | Staða |
| --- | --- | --- |
| 0 | Úttekt og snið | lokið |
| 1 | Vél + HAG103G og HAG107G | lokið |
| 2 | HAG106G og HAG108G | lokið |
| 3 | HAG101G | lokið |
| 4 | Í dag, kunnáttukort, upprifjun, dreifð endurtekning, öryggismat | |
| 5 | Vikan, leit í Blöðunum, útflutningur, gamla sagan | innflutningur gömlu sögunnar lokið |
