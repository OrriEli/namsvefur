// Breytingar Orra á HAG101G frá 17. nóv. 2026, gerðar í sjálfstæðu útgáfu síðunnar og fluttar hingað.
// Gamla síðan í legacy/ er skrifvarin og helst óbreytt; scripts/extract-legacy.js bætir þessu ofan á
// það sem lesið er úr henni, svo src/courses/hag101g.js inniheldur breytingarnar eftir `npm run extract`.
//   1. Sjálfsmat á köflum Blaðsins (0–10): kafli → flokkur (SEC_T), upphafsgildi (SELF0)
//   2. Forgangsröð = (1 − kunnátta) × vægi á prófi (EXW, % af prófinu)
//   3. Ný áætlun frá 17. nóv. (sama snið og PLAN gömlu síðunnar)

// sjálfsmat á köflum Blaðsins (0–10) og forgangsröð = (1 − kunnátta) × vægi á prófi
const SEC_T = {1:'fyl', 2:'fyl', 3:'and', 4:'fyl', 5:'akv', 6:'akv', 7:'and', 8:'jof', 9:'dif', 10:'dif', 11:'ein', 12:'hlu', 13:'mis', 14:'mis', 15:'dul', 16:'tay', 17:'eins', 18:'hes', 19:'ham'};
const SELF0 = {1:8, 2:9, 3:8, 4:8, 5:8, 6:6.5, 7:7, 8:7, 9:8, 10:8, 11:6, 12:7.5, 13:5, 14:6, 15:3, 16:0, 17:0, 18:7, 19:0};
const EXW = {fyl:7, akv:6, and:6, jof:15, dif:3, ein:10, hlu:3, mis:8, dul:11, eins:4, tay:12, hes:8, ham:22};

const PLAN = [
 {d:'2026-11-12', h:'Fimmtudagur 12. – mánudagur 16. nóv.', cal:'Fyrri hluti áætlunarinnar', note:'Sjálfsmatið 17. nóv. sýnir að Taylor, einsleitni og hámörkun (0/10) og fólgin föll (3/10) eru eftir. Áætlunin héðan í frá setur þau fremst: saman eru þau um helmingur prófsins.', items:[]},
 {d:'2026-11-17', h:'Þriðjudagur 17. nóv.', cal:'HAG101G 13:20 · Fjármálahagfræði til 19:00', items:[
  {at:'19:45', m:40, h:'Taylor 1: lesa kafla 16 og leysa unnu dæmin', p:'Lestu kaflann, lokaðu honum og leystu dæmablað 41 og lokapróf 2025 dæmi 6 á blað.', go:{v:'sheet', sec:'s16'}},
  {at:'20:25', m:10, h:'Hlé', brk:true},
  {at:'20:35', m:40, h:'Taylor 2: rafalar', p:'Margliður og e, ln, rót. Markmið: þrjú dæmi í röð með fullt hús.', go:{v:'practice', topics:['tay']}}]},
 {d:'2026-11-18', h:'Miðvikudagur 18. nóv.', cal:'HAG108G 10:00 · HAG107G 14:10 · HAG103G dæmat. 16:40 · Laugó 19:00', items:[
  {at:'08:00', m:40, h:'Hámörkun 1: umslagssetningin', p:'Lestu kafla 19. Leystu dæmablað 46 og ný dæmi um virðisfall með einni breytu.', go:{v:'sheet', sec:'s19'}},
  {at:'08:40', m:10, h:'Hlé', brk:true},
  {at:'08:50', m:45, h:'Hámörkun 2: virðisfall í æfingu', go:{v:'practice', topics:['ham']}},
  {at:'12:00', m:40, h:'Einsleitni og Euler', p:'Lestu kafla 17. Dæmablað 39–40 og rafalarnir. Lærðu prófið: settu jx inn og þáttaðu út j^r.', go:{v:'practice', topics:['eins']}},
  {at:'12:40', m:10, h:'Hlé', brk:true},
  {at:'12:50', m:30, h:'Hraðæfing: Taylor, einsleitni, umslag', go:{v:'quick', topics:['tay', 'eins', 'ham']}}]},
 {d:'2026-11-19', h:'Fimmtudagur 19. nóv.', cal:'HAG103G 08:20 · HAG101G 11:40 (síðasti tími) · tímar til 18:10', note:'Spurðu í tímanum kl. 11:40 um það sem þú festist í í hámörkun eða Taylor.', items:[
  {at:'10:00', m:40, h:'Fólgin föll 1', p:'Lestu kafla 15. Skrifaðu skilyrðin fimm upp og leystu dæmablað 36–37.', go:{v:'sheet', sec:'s15'}},
  {at:'10:40', m:10, h:'Hlé', brk:true},
  {at:'10:50', m:40, h:'Fólgin föll 2', p:'Dæmablað 38, lokapróf 2023 dæmi 5 og 2025 dæmi 5, rafallinn.', go:{v:'practice', topics:['dul']}},
  {at:'20:00', m:50, h:'Hámörkun 3: heilt hagnaðardæmi', p:'Lokapróf 2023 dæmi 4 á 50 mín., svo yfirferð.', go:{v:'practice', topics:['ham'], kind:'old'}}]},
 {d:'2026-11-20', h:'Föstudagur 20. nóv.', cal:'Dæmatímar 11:40–16:30', note:'Engin Laugó-vakt er í dagatalinu. Ef þú átt vakt, færðu kvöldblokkina.', items:[
  {at:'08:30', m:45, h:'Heildarmismunur og heildarafleiður', p:'Kaflar 13–14 (mat 5 og 6). Dæmablað 34–35, lokapróf 2025 dæmi 4 og flæðirit í hvert sinn.', go:{v:'practice', topics:['mis']}},
  {at:'09:15', m:10, h:'Hlé', brk:true},
  {at:'09:25', m:45, h:'Hámörkun 4: Hessian og samanburðarstöðugreining', p:'Dæmablað 44–45, lokapróf 2025 dæmi 7.', go:{v:'practice', topics:['ham', 'hes']}},
  {at:'19:00', m:40, h:'Rafalar: Taylor og fólgin föll', go:{v:'practice', kind:'gen', topics:['tay', 'dul']}},
  {at:'19:40', m:10, h:'Hlé', brk:true},
  {at:'19:50', m:20, h:'Uppfæra sjálfsmatið á Blaðinu', p:'Gefðu köflum 13–19 nýja einkunn; forgangsröðin á Yfirliti uppfærist.', go:{v:'sheet', sec:'s13'}}]},
 {d:'2026-11-21', h:'Laugardagur 21. nóv.', cal:'Engir tímar', items:[
  {at:'10:00', m:180, h:'Lokapróf 2025 á tíma, á pappír', p:'3 klst. án hlés, sími í annað herbergi.', go:{v:'exam', start:'L25'}, exam:true},
  {at:'13:00', m:45, h:'Hádegismatur', brk:true},
  {at:'13:45', m:45, h:'Gefa sér stig', go:{v:'exam'}},
  {at:'14:30', m:15, h:'Hlé', brk:true},
  {at:'14:45', m:40, h:'Æfa villurnar strax', go:{v:'practice', review:true}}]},
 {d:'2026-11-22', h:'Sunnudagur 22. nóv.', cal:'Engir tímar', items:[
  {at:'10:00', m:45, h:'Efst í forgangsröðinni', p:'Yfirlitið velur flokkana út frá sjálfsmati og æfingu.', go:{v:'weak'}},
  {at:'10:45', m:15, h:'Hlé', brk:true},
  {at:'11:00', m:45, h:'Ákveður og andhverfa', p:'Mat 6,5 og 7: 4×4 Laplace (miðannarpróf 2025 dæmi 3) og aðoka fylki.', go:{v:'practice', topics:['akv', 'and']}},
  {at:'14:00', m:40, h:'Föll af einni breytu', p:'Mat 6: lokapróf 2023 dæmi 3 og dæmablað 43.', go:{v:'practice', topics:['ein']}},
  {at:'20:00', m:20, h:'Blaðið: kaflar 15–19', go:{v:'sheet', sec:'s15'}}]},
 {d:'2026-11-23', h:'Mánudagur 23. nóv.', cal:'Laugó 17:30', items:[
  {at:'09:00', m:180, h:'Lokapróf 2023 á tíma, á pappír', p:'Síðasta heila prófið. Ef þú tókst það 15. nóv., taktu blandað próf í staðinn.', go:{v:'exam', start:'L23'}, exam:true},
  {at:'12:00', m:45, h:'Hádegismatur', brk:true},
  {at:'12:45', m:45, h:'Yfirferð', go:{v:'exam'}}]},
 {d:'2026-11-24', h:'Þriðjudagur 24. nóv.', cal:'Engir tímar', note:'Léttur dagur. Ekkert nýtt efni og snemma í háttinn.', items:[
  {at:'10:00', m:40, h:'Tæma villubankann', go:{v:'wrong'}},
  {at:'10:40', m:15, h:'Hlé', brk:true},
  {at:'10:55', m:30, h:'Blaðið utanbókar', p:'Skrifaðu reglurnar í köflum 14–19 á autt blað og berðu saman.', go:{v:'sheet', sec:'s14'}},
  {at:'16:00', m:20, h:'Hraðæfing', go:{v:'quick'}}]},
 {d:'2026-11-25', h:'Miðvikudagur 25. nóv. · prófdagur', cal:'Laugó 19:00', note:'Ekkert nýtt efni í dag.', items:[
  {at:'09:30', m:20, h:'Gildrur og frágangur', p:'Kaflar 20 og 21 á Blaðinu.', go:{v:'sheet', sec:'s20'}},
  {at:'09:50', m:10, h:'Hlé', brk:true},
  {at:'10:00', m:15, h:'Tíu hraðspurningar til upphitunar', go:{v:'quick'}},
  {at:'13:00', m:20, h:'Mæta í Á301', p:'Skriffæri, skilríki, vatn.'},
  {at:'13:30', m:180, h:'Lokaprófið', p:'Lestu öll dæmin fyrst. Byrjaðu á fylkjunum.', exam:true}]},
];

export default {
  self: { sections: SEC_T, initial: SELF0, at: '17. nóv.' },
  examWeights: EXW,
  plan: {
    eyebrow: '17. – 25. nóv.',
    intro: 'Byggð á Google Calendar og Ugla-stundatöflunni þinni og vöktunum á Laugó. Endurskipulögð 17. nóv. eftir sjálfsmatinu: kaflarnir sem fengu 0–3 (Taylor, einsleitni, hámörkun, fólgin föll) koma fyrst. Tvö heil 3 klst. próf á pappír (21. og 23. nóv.), léttur dagur fyrir próf. HAG101G er fyrsta lokaprófið; næsta er HAG108G 1. des.',
    days: PLAN
  },
  // skýringin undir töflunni „Staðan eftir flokkum“: nýja setningin fer á undan þeirri síðustu
  noteInsert: { before: '„Skrifleg“ er hlutfall stiga sem þú hakaðir rétt.', text: '„Mat“ er sjálfsmatið af Blaðinu (0–10). ' }
};
