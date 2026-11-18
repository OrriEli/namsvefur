# Námsvefur — verklýsing fyrir Claude Code

Oct 27, 2026 · @Orri

## Markmið og samhengi

Byggðu einn námsvef sem sameinar fimm stakar prófæfingasíður í eitt forrit. Forritið á að hafa sameiginlega vél, einn villubanka og eina forsíðu sem segir notandanum hvað hann á að æfa í dag.

Notandinn er Orri, á fyrstu önn í hagfræði við Háskóla Íslands (haustönn 2026). Hann notar vefinn bæði í tölvu og síma. Hann lærir í blokkum sem skiptast í tvennt með 10–15 mínútna hléi, og hann vinnur best undir skýrum tímamörkum og með sýnilega framvindu.

| Fag | Stutt nafn | Gerð gömlu síðunnar | Næsta próf |
| --- | --- | --- | --- |
| HAG101G Hagræn stærðfræði I | Stærðfræði | Skrifleg skrefadæmi með sjálfsmati + hraðspurningar | Miðannarpróf 5. nóv. 2026 kl. 16:00, 90 mín. |
| HAG103G Heildahagfræði I | Heild | Krossaspurningar (gömul próf, nýjar, rafalar) | Hlutapróf búið (23. okt.); lokapróf óstaðfest |
| HAG106G Fjármálahagfræði I | Fjármál | Fyrirlestrar F1–F9 × 3 erfiðleikastig; krossar, tölusvör, skrefadæmi, spjöld | Lokapróf óstaðfest (líklega 180 mín.) |
| HAG107G Eindahagfræði I | Einda | Krossaspurningar, sama vél og HAG103G | Kaflapróf og lokapróf, sjá gömlu síðuna |
| HAG108G Líkindafræði og forritun | Líkindi | Sama vél og HAG106G; tölusvör með vikmörkum, R-merkt dæmi | Óstaðfest |

Verkið telst heppnað þegar:

- Orri opnar vefinn og sér innan 10 sekúndna hvað hann á að gera næst.
- Allt efni úr gömlu síðunum er til staðar: hver spurning, rafall, útskýring og „Blað“, orðrétt.
- Nýtt fag á vorönn krefst aðeins nýrrar gagnaskrár, engra breytinga á vélinni.

## Upphafsgögn

Gömlu síðurnar fimm eru einu heimildirnar um efnið. Orri setur þær í möppuna `legacy/` áður en verkið hefst:

```
legacy/
  HAG101G miðannarpróf.html
  HAG103G prófæfing.html
  HAG106G prófæfing.html
  HAG107G prófæfing.html
  HAG108G prófæfing.html
```

Hver síða er ein HTML-skrá með innbyggðu CSS og JavaScript, samtals um 1 MB. Efnið liggur í JavaScript-fylkjum, t.d. `OLD`, `NEW`, `GENS`, `STATIC`, `QUICK`, `BANK`, `CARDS`, `LECTURES`, `PLAN` og `SHEET`. Nöfnin og sviðin eru ekki eins á milli síðna.

Reglur:

- Skrárnar í `legacy/` eru eingöngu til lestrar. Breyttu þeim aldrei.
- Lestu allar fimm skrárnar í heild áður en þú hannar gagnasniðið. Ekki giska út frá einni.
- Fyrsta afurðin er `docs/legacy-inventory.md`: fyrir hverja síðu, gagnafylkin, spurningagerðir og svið þeirra, skjámyndir, vafrageymslulykil og fjölda atriða af hverri gerð.
- Þekktir geymslulyklar: `hag101g-midannar-v1`, `hag103g-hlutaprof-v1`, `hag106g-profaefing-v1`, `hag107g-kaflaprof3-v1`. Finndu lykil HAG108G í skránni.
- Efnið er flutt út úr gömlu síðunum með skriftu (`scripts/extract-legacy.js`), ekki afritað í höndunum, svo enginn texti breytist á leiðinni.

## Tæknival og uppbygging

Notaðu hreint JavaScript með ES-einingum og Vite, án viðmótsramma. Gömlu síðurnar eru skrifaðar þannig, svo vélarnar og rafalarnir flytjast yfir með lágmarksbreytingum.

- **Byggingarafurð:** kyrrstæð síða í `dist/`, sem má hýsa t.d. á GitHub Pages. Bættu líka við einnar-skrár byggingu (`npm run build:single`, t.d. með `vite-plugin-singlefile`) svo hægt sé að birta vefinn sem eina HTML-skrá.
- **Tegundir:** JSDoc-tegundir í stað TypeScript. Gagnasniðið er skilgreint á einum stað (`src/schema.js`) og prófað með skriftu.
- **Prófanir:** Vitest. Hver rafall er keyrður 1.000 sinnum og útkoman staðfest (sjá kafla um gagnasnið). Útdráttarskriftan er prófuð með því að bera fjölda atriða saman við `docs/legacy-inventory.md`.
- **Engin ytri þjónusta** í fyrstu útgáfu. Allt keyrir í vafranum.

```
namsvefur/
  legacy/                 # gömlu síðurnar, aðeins lesnar
  docs/
    legacy-inventory.md
    schema.md
  scripts/
    extract-legacy.js     # les legacy/ og skrifar courses/*.js
  src/
    courses/
      hag101g.js          # gögn: efnisflokkar, atriði, rafalar, blað, prófsnið
      hag103g.js
      hag106g.js
      hag107g.js
      hag108g.js
      index.js            # skráir fögin
    engine/
      items/              # mc.js, num.js, steps.js, card.js
      practice.js
      exam.js
      review.js           # villubanki og dreifð endurtekning
      today.js            # röðun fyrir „Í dag“
      stats.js
    store/
      store.js            # geymslulag með útgáfu og flutningi
      legacy-import.js
    views/                # ein skrá á hverja skjámynd
    ui/                   # sameiginlegir hlutar, stílar, talnasnið
    config.js             # prófdagar, markmið, upptekin kvöld
    schema.js
  tests/
```

## Gagnasnið

Öll fimm fögin eru lýst með einu sniði. Atriði eru af fjórum gerðum, og vélin þarf ekki að vita úr hvaða fagi atriði kemur.

| Gerð | Lýsing | Kemur úr | Svar metið |
| --- | --- | --- | --- |
| `mc` | Krossaspurning, 2–5 valkostir | 103, 106, 107, 108, hraðspurningar 101 | Sjálfvirkt |
| `num` | Tölusvar með vikmörkum og einingu | 106, 108, hraðspurningar 101 | Sjálfvirkt, innan `tol` |
| `steps` | Margþrepa dæmi; lausn birt skref fyrir skref, hvert skref með stigum | 101, 106, 108 | Sjálfsmat: rétt/rangt á hvert skref |
| `card` | Skýringarspjald: spurning, svo svar | 106, 108 | Sjálfsmat: kunni/kunni ekki |

```js
/** @typedef {Object} Course
 *  @property {string} id            // 'hag103g'
 *  @property {string} code          // 'HAG103G'
 *  @property {string} name          // 'Heildahagfræði I'
 *  @property {string} short         // 'Heild'
 *  @property {Topic[]} topics       // efnisflokkar eða fyrirlestrar
 *  @property {Level[]} [levels]     // erfiðleikastig ef fagið notar þau
 *  @property {Item[]} items
 *  @property {Generator[]} gens
 *  @property {ExamFormat[]} examFormats
 *  @property {string} sheet         // HTML „Blaðsins“, orðrétt úr gömlu síðunni
 */

/** @typedef {Object} Item
 *  @property {string} id            // stöðugt, t.d. 'H25-1' (sama og í gömlu síðunni)
 *  @property {'mc'|'num'|'steps'|'card'} type
 *  @property {string} topic
 *  @property {number} [level]       // 1–3
 *  @property {'old'|'new'|'sheet'|'gen'} source
 *  @property {string} src           // merki, t.d. 'H25 #1'
 *  @property {string} q             // HTML
 *  @property {string[]} [o]         // mc
 *  @property {number} [a]           // mc: rétt valkostanúmer
 *  @property {number} [ans]         // num
 *  @property {number} [tol]         // num
 *  @property {string} [unit]        // num
 *  @property {{h:string, body:string, p:number}[]} [steps]
 *  @property {string} e             // útskýring, HTML
 */

/** @typedef {Object} Generator
 *  @property {string} id            // 'gen-vlf'
 *  @property {string} name
 *  @property {string} topic
 *  @property {number} [level]
 *  @property {() => Omit<Item,'id'|'topic'|'source'>} f
 */
```

Reglur:

- Alþjóðlegt auðkenni atriðis er `<fag>:<id>`, t.d. `hag103g:H25-1`. Rafall hefur `hag103g:gen-vlf`. Auðkennin breytast aldrei, því framvindan er geymd undir þeim.
- Valkostum `mc` er stokkað við birtingu, eins og í gömlu síðunum.
- Rafalapróf: fyrir hvern rafal, 1.000 keyrslur þar sem staðfest er að útkoman passar við sniðið, valkostir séu einstakir, rétt svar sé meðal þeirra og engin tala sé `NaN` eða `Infinity`.
- Haltu talnasniðinu `F` (punktur fyrir þúsundir, komma fyrir aukastafi, mínus U+2212) úr gömlu síðunum sem einni sameiginlegri einingu.
- Skrifaðu `docs/schema.md` með dæmi af hverri gerð úr raunverulegu efni. Orri samþykkir það áður en áfangi 1 hefst.

## Skjámyndir og virkni

Efst er stika með: **Í dag · Fög · Framvinda**, og tannhjól fyrir Stillingar í horni (endurhönnun, áfangi 2, 18. nóv.). Framvinda sameinar Villubankann og Vikuna; Upprifjun er lota sem Í dag ræsir (`#/upprifjun`); leit í Blöðunum er efst á Fögum og Blað hvers fags er flipi á fagsíðunni. Gamlar slóðir vísa áfram: `#/villur` og `#/vikan` → `#/framvinda/villur` og `#/framvinda/vikan`, `#/bladin` og `#/blodin` (með `?q=`) → `#/fog?q=` (`src/routes.js`). Á síma kemst stikan í eina línu.

### 1. Í dag (forsíða)

Forsíðan er ein ákvörðun, ekki yfirlit. Efst er prófadagatal: niðurtalning fyrir hvert próf úr `config.js`, næsta próf fremst. Próf án dagsetningar sýnir „óstaðfest“.

*Endurhönnun, áfangi 3 (18. nóv.):* efst er dagsetning, stór fyrirsögn með því sem á að gera núna (næsti óhakaði liður áætlunar dagsins, annars veikustu flokkar tillögunnar) og fjöldi daga í næsta próf í lit fagsins. Undir er dagaröð (`engine/timeline.js`), einn reitur á dag frá fyrsta degi áætlunar til síðasta staðfesta prófs: prófdagar fylltir og hærri, dagurinn í dag merktur, búnir dagar fylltir, liðnir ókláraðir skástrikaðir. Fag dags: prófdagur → fag prófsins; dagur í áætlun → fagið með flestar mínútur (hitt sem rönd); annars næsta próf, en þriðji hver dagur fer á prófið þar á eftir ef það er innan 7 daga. Dagur er búinn eftir 25 mín. í fagi dagsins, þegar áætlun dagsins er öll hökuð, eða þegar prófinu er lokið. Spjöldin „Lota kvöldsins“ (lærdómsblokkin, Byrja) og „Á áætlun“ (búnir dagar / allir dagar, ein setning). Kunnáttukortið er hitakort: grátt → rautt → gult → grænt (`--heat-*`), daufara eftir því sem lengra er síðan æft var.

Undir því er tillaga að lærdómsblokk, reiknuð í `engine/today.js`:

1. Forgangur hvers fags = vægi eftir nálægð prófs (t.d. 1 / dagar í próf, hámark við 14 daga) × veikleiki (1 − hlutfall réttra svara síðustu 14 daga).
2. Blokkin er sjálfgefið 25 mín. + 10 mín. hlé + 25 mín. (lengdir stillanlegar).
3. Fyrri helmingur: villur sem eru komnar á tíma, svo veikustu efnisflokkar fagsins með hæstan forgang.
4. Seinni helmingur: annað fag eða blönduð upprifjun, svo efni fléttist saman.
5. Hver liður sýnir fag, efni, fjölda atriða og áætlaðar mínútur.

Einn takki, **Byrja**, keyrir alla blokkina með tímamæli og hléi. Kvöld sem merkt eru upptekin í stillingum (sjálfgefið mán., mið. og fös.) fá styttri tillögu.

### 2. Kunnáttukort

Tafla á forsíðunni, undir tillögunni: eitt fag í hverri röð, einn reitur á efnisflokk. Litur eftir hlutfalli réttra svara (undir 60% rautt, 60–80% gult, yfir 80% grænt, ósnert grátt) og daufari eftir því sem lengra er síðan æft var. Smellur á reit opnar æfingu í því efni.

### 3. Fag

Hvert fag fær sína síðu með flipunum **Yfirlit, Æfing, Próf, Blaðið** og **Áætlun** þar sem gamla síðan hafði hana. Yfirlitið er staðan eftir efnisflokkum (og stigum, þar sem við á), eins og í gömlu síðunum.

### 4. Æfing

Einn spilari fyrir allar fjórar gerðirnar. Síur: efnisflokkar, stig, uppruni (gömul próf / nýjar / rafalar / dæmablöð). Val atriða notar vegnu úrtaksregluna úr gömlu síðunum (ósnert 3, í villubanka 5, rafall 2, náð tvisvar í röð 0,25).

**Öryggismat:** eftir að svar er valið, en áður en lausn birtist, kemur röðin *Viss · Hálfviss · Gisk*. Eitt smell, flýtilyklar `V`, `H`, `G`. Hægt að slökkva á í stillingum. Atriði sem var svarað rangt þótt merkt væri *Viss* fá sérmerki í villubankanum.

Flýtilyklar gömlu síðnanna haldast: `1`–`5` velja, `Enter` áfram.

### 5. Villubanki

Einn banki þvert á fög, með dreifðri endurtekningu í stað „tvisvar rétt í röð“:

- Rangt svar → atriðið fer í hólf 1 (á tíma eftir 1 dag).
- Rétt svar þegar atriðið er á tíma → næsta hólf: 1, 3, 7, 16 dagar. Rétt í hólfi 16 daga → út.
- Rangt svar í hvaða hólfi sem er → aftur í hólf 1.
- Rafalar koma aftur með nýjum tölum.

Við hverja villu er reitur: **Hvað hugsaði ég vitlaust?** (ein lína) og valkvæð merki, t.d. „gleymdi NX“. Villuskjárinn hefur tvær sýnir: *á tíma núna* og *eftir merkjum*, svo Orri sjái mynstrin í eigin villum.

### 6. Blönduð upprifjun

Tíu atriði valin úr öllum fögum, vegin eftir hve langt er síðan efnisflokkur var æfður. Fagið sést ekki fyrr en eftir svar, svo æfingin reyni á að þekkja hvers konar dæmi er á ferðinni.

### 7. Próf

Prófsnið hvers fags heldur sér, sem `examFormats` í gagnaskránni:

| Snið | Fög | Hegðun |
| --- | --- | --- |
| Inspera | 103, 107 | Krossar, flakk og merkingar, ekkert birt fyrr en skilað |
| Skriflegt | 101 | Öll dæmi birt í einu, skrifað á blað, svo sjálfsmat skref fyrir skref |
| Blandað | 106, 108 | Krossar, tölusvör og skrefadæmi; stutt og löng útgáfa; eins og prófið eða erfitt |

Samsetning, fjöldi og tími eru tekin úr gömlu síðunum. Tímamælir, saga og niðurstöðuskjár eru sameiginleg. Röng svör fara í villubankann.

### 8. Vikan

Yfirlit síðustu 7 daga: mínútur, fjöldi atriða og hlutfall réttra svara á hvert fag, þróun miðað við vikuna á undan, og hlutfall *Viss*-svara sem voru röng. Reitur fyrir markmið næstu viku sem birtist svo á forsíðunni. Takki sem afritar yfirlitið sem hreinan texta til að senda öðrum.

### 9. Blöðin

Leit þvert á Blöð allra faga, efst á Fögum (`#/fog?q=`). Leitarorð eins og „núvirði“ eða „Hessian“ sýnir hvaða kafli í hvaða fagi geymir það.

### 10. Stillingar

Prófdagar og -tímar, markmið á hvert fag (t.d. *6,5 á lokaprófi HAG107G*), upptekin kvöld, blokkalengdir, öryggismat af/á, útflutningur og innflutningur gagna, innflutningur gömlu sögunnar.

## Geymsla, gömul saga og samstilling

Öll framvinda fer í gegnum eitt geymslulag (`store/store.js`), svo hægt sé að skipta um geymslu síðar án þess að snerta vélina.

- **Sjálfgefið:** vafrageymsla undir einum lykli, `namsvefur-v1`, með útgáfunúmeri sniðs og flutningsföllum á milli útgáfa.
- **Skráning á hvert atriði:** fjöldi tilrauna, rétt, röð réttra svara, síðasta tilraun, öryggismat, hólf í villubanka, næsti tími, athugasemd og merki.
- **Lotuskráning:** hver æfing og hvert próf skráir upphaf, lok og mínútur, svo „Vikan“ geti reiknað tíma.
- **Útflutningur og innflutningur:** allt sem ein JSON-skrá, úr stillingum. Innflutningur sameinar, en skrifar ekki yfir nýrri gögn.

### Gamla sagan

Hver gömul síða geymir framvindu sína í eigin vafrageymslu, og nýi vefurinn getur ekki lesið hana beint. Búðu til `store/legacy-import.js` sem tekur hrátt JSON úr hverjum gömlum lykli og varpar því yfir á nýja sniðið:

- `st` → tilraunir og rétt á atriði, með forskeyti fags á auðkenni.
- `wrong` → atriði í villubanka, hólf 1, á tíma strax.
- `hist` → lotur með dagsetningu og niðurstöðu.

Í stillingum er textareitur fyrir hvert fag þar sem Orri límir inn JSON-ið, og skrifaðar leiðbeiningar um hvernig það er sótt úr gömlu síðunni (afrita gildi lykilsins úr þróunartólum vafrans). Saga HAG101G skiptir mestu, því villubankinn þar er í notkun fram að 5. nóvember.

### Samstilling milli tækja

Ekki í fyrstu útgáfu. Vafrageymsla er bundin við eitt tæki, svo framvinda í síma og tölvu er aðskilin þar til samstilling kemur. Hannaðu geymslulagið svo að samstilltur bakendi geti tekið við án breytinga annars staðar. Hvaða leið verður fyrir valinu er opin spurning (sjá síðasta kafla).

## Áfangar

Verkið er unnið í sjö áföngum. Hverjum áfanga lýkur með keyrðum prófunum, commit og stuttri samantekt fyrir Orra. Ekki byrja á næsta áfanga fyrr en viðmið þess fyrri eru uppfyllt.

0. **Úttekt og snið.** `docs/legacy-inventory.md` og `docs/schema.md`. Ekkert viðmót.
   - Viðmið: Orri hefur samþykkt sniðið.
1. **Vél + HAG103G og HAG107G.** Útdráttarskrifta, `mc`-gerðin, æfing, Inspera-próf, villubanki (einfaldur), Blaðið, fagsíða.
   - Viðmið: fjöldi atriða og rafala í hvoru fagi er sá sami og í úttektinni.
   - Viðmið: allir rafalar standast 1.000 keyrslna prófið.
   - Viðmið: blandað próf í HAG103G hefur sömu samsetningu eftir flokkum og gamla síðan (20 spurningar, 60 mín.).
2. **HAG106G og HAG108G.** Gerðirnar `num`, `steps` og `card`, stig 1–3, blandað prófsnið.
   - Viðmið: fjöldi atriða stemmir; tölusvör metin með sömu vikmörkum og í gömlu síðunum.
3. **HAG101G.** Skriflegt prófsnið með sjálfsmati, hraðspurningar.
   - Ekki fyrr en eftir miðannarprófið 5. nóvember. Orri notar gömlu síðuna fram að því.
   - Viðmið: allir prófliðir úr lokaprófum 2023 og 2025 eru til staðar með upprunalegu vægi (97 stig).
4. **Þvert á fög.** Í dag, prófadagatal, kunnáttukort, blönduð upprifjun, villubanki með dreifðri endurtekningu, öryggismat.
   - Viðmið: tillagan á forsíðunni breytist þegar villur eru skráðar og þegar prófdagur nálgast (prófað með einingaprófum á `today.js`).
5. **Vikan, leit í blöðum, útflutningur og innflutningur gömlu sögunnar.**
   - Viðmið: JSON úr gömlu HAG103G-síðunni flyst inn og birtist rétt í kunnáttukortinu.
6. **Samstilling** (valkvætt, eftir ákvörðun Orra).

## Útlit, mál og talnasnið

Endurhönnun frá 17. nóv. 2026: vefurinn á að líða eins og vel uppsett stærðfræðiglósubók, rólegur, skýr og með sterkt stigveldi. Allir tókar eru í `src/ui/tokens.css`: hlýr pappír í ljósri stillingu, hlýtt dökkt (ekki blásvart) í dökkri. Stillingarnar eru jafngildar, fylgja `prefers-color-scheme` sjálfkrafa og hægt er að velja í Stillingum. Hausinn er í sama lit og síðan, með þunnri línu undir. Blár (`--action`) er frátekinn fyrir aðgerðir. Fagalitir eru tókar (`--course-101` o.s.frv.) og hver fagsíða setur `--course-accent`. Gömlu breytuheitin (`--bg`, `--paper`, `--ink`, `--accent` o.s.frv.), sem efni úr gömlu síðunum notar, eru tengd tókunum.

- **Letur:** Newsreader (fyrirsagnir og stórar tölur) og Source Sans 3 (viðmót), sett upp með @fontsource svo þau virki án nets. `tabular-nums` á allar tölur. Jafnbreitt kerfisletur aðeins í forritskóða.
- **Tími í próf:** eitt fall (`src/engine/time.js`) í almanaksdögum, notað alls staðar.
- **Litir faga:** hvert fag fær einn áherslulit sem sést í dagatali, kunnáttukorti og merkjum. Litur ber aldrei merkingu einn og sér; nafn fags fylgir alltaf.
- **Sími fyrst:** 16 px hliðarbil, snertifletir minnst 44 px, engin lárétt skrun á síðunni (töflur skruna innan eigin ramma).
- **Mál:** allt viðmót á íslensku. Texti spurninga, útskýringa og blaða er fluttur orðrétt og ekki endurskrifaður.
- **Tölur:** íslenskt snið alls staðar, `1.234,5`, mínus sem `−`, prósentur sem `3,8%`.
- **Formúlur og útreikningar:** hver formúla í eigin línu og skref í útreikningi í jöfnuðum reitum eða töflum, aldrei samanþjöppuð inni í texta. Haltu `.f`-reitnum og `table.dt` úr gömlu síðunum.
- **Aðgengi:** öll stjórntæki nothæf með lyklaborði, `aria`-merki á reitum kunnáttukortsins, `prefers-reduced-motion` virt.
- Engin emoji og engin tilkynningahljóð.

## Utan verksviðs og opnar spurningar

Ekki í fyrstu útgáfu:

- Innskráning, notendur eða deiling með öðrum.
- Nýtt námsefni. Claude Code flytur efnið, en semur ekki nýjar spurningar nema Orri biðji um það.
- Kall í gervigreindarþjónustu úr vefnum.
- Tenging við Google Calendar eða Uglu. Áætlanir úr gömlu síðunum flytjast sem kyrrstæð gögn.

Opnar spurningar sem Orri svarar:

- [ ] Samstilling milli síma og tölvu: engin, handvirkur útflutningur, eða bakendi (hvaða)?

Þarf bara að virka á tölvu

- [ ] Hýsing: GitHub Pages, eða ein HTML-skrá birt annars staðar?

Github

- [ ] Flytja inn gömlu söguna fyrir öll fögin, eða aðeins HAG101G?

Allir áfangar eiga að snúast að undirbúningi fyrir lokapróf

- [ ] Dagsetningar lokaprófa í HAG103G, HAG106G, HAG107G og HAG108G (settar í `config.js` þegar þær liggja fyrir).

HAG101G	Hagræn stærðfræði I	Mið. 25 nóv. 2026 kl. 13:30 - 16:30
