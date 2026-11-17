// Stillingar: lærdómsblokk, upptekin kvöld, öryggismat, markmið faga, útflutningur og innflutningur allra gagna,
// og innflutningur gömlu sögunnar, einn reitur á hvert fag.

import { COURSES } from '../courses/index.js';
import { LEGACY_KEYS, consoleCommand, parseLegacy, importLegacy } from '../store/legacy-import.js';
import { exportState, parseBackup, mergeStates } from '../store/backup.js';
import { plural, fmtWhen as when } from '../ui/format.js';
import { esc } from '../ui/dom.js';


function summary(r) {
  return [plural(r.items, 'atriði', 'atriði'), r.cards ? plural(r.cards, 'spjald', 'spjöld') : '', `${r.bank} í villubanka`, r.hist ? plural(r.hist, 'próf', 'próf') + ' í sögu' : '', r.skipped ? `${r.skipped} sleppt (ekki lengur á síðunni)` : ''].filter(Boolean).join(' · ');
}

export function render({ app, store }) {
  const S = store.state;
  const msg = {};

  const DAYS = [[1, 'mán.'], [2, 'þri.'], [3, 'mið.'], [4, 'fim.'], [5, 'fös.'], [6, 'lau.'], [0, 'sun.']];

  function prefsHTML() {
    const P = S.settings.prefs;
    const num = (k, label) => `<label class="row hint" style="gap:6px">${label} <input type="number" class="ninp" style="width:7ch" min="5" max="120" step="5" data-block="${k}" value="${P.block[k]}"> mín.</label>`;
    return `<div class="panel stack" style="gap:12px">
      <h2>Lærdómsblokk</h2>
      <div class="row" style="gap:16px">${num('first', 'Fyrri hluti')}${num('pause', 'Hlé')}${num('second', 'Seinni hluti')}</div>
      <div class="frow"><span class="eyebrow">Upptekin kvöld</span><div class="chips">${DAYS.map(([d, l]) => `<button class="chip" data-busy="${d}" aria-pressed="${P.busy.includes(d)}">${l}</button>`).join('')}</div></div>
      <p class="hint">Á upptekinni kvöldi er tillagan aðeins fyrri hlutinn.</p>
      <label class="switch"><input type="checkbox" id="conf" ${P.confidence ? 'checked' : ''}> Öryggismat: spyrja „Viss · Hálfviss · Gisk“ áður en lausnin birtist</label>
    </div>
    <div class="panel stack" style="gap:10px">
      <h2>Markmið faga</h2>
      <p class="hint">Birtast í prófadagatalinu á forsíðunni, t.d. „6,5 á lokaprófi“.</p>
      ${COURSES.map(c => `<label class="row" style="gap:10px;flex-wrap:nowrap"><span class="cchip" style="--cc:var(${c.color});min-width:76px">${c.code}</span><input class="note-in" data-goal="${c.id}" value="${esc((P.goals || {})[c.id] || '')}" placeholder="Markmið í ${esc(c.short)}" autocomplete="off"></label>`).join('')}
    </div>
    <div class="panel stack" style="gap:10px">
      <h2>Útflutningur og innflutningur</h2>
      <p class="hint" style="max-width:66ch">Öll gögnin sem ein JSON-skrá: til öryggis, eða til að flytja framvinduna í annan vafra. Innflutningur sameinar og skrifar ekki yfir nýrri gögn: ef atriði er í báðum gildir það sem var æft síðast.</p>
      <div class="row"><button class="btn" data-act="export">Sækja öll gögn (JSON)</button><label class="btn" for="bak">Hlaða inn skrá</label><input type="file" id="bak" accept=".json,application/json" hidden><span class="hint" id="bakmsg">${esc(msg.bak || '')}</span></div>
    </div>`;
  }

  function draw() {
    const cards = COURSES.map(c => {
      const done = S.settings.imported[c.id];
      return `<div class="panel stack c-${c.id}" style="gap:10px;--cc:var(${c.color})">
        <div class="row" style="justify-content:space-between"><h3><span class="cchip">${c.code}</span> ${esc(c.name)}</h3>${done ? `<span class="tag gen">Flutt inn ${when(done.at)}</span>` : ''}</div>
        <p class="hint">Lykill gömlu síðunnar: ${LEGACY_KEYS[c.id].map(k => `<code>${k}</code>`).join(' eða ')}</p>
        <div class="row" style="gap:8px;flex-wrap:nowrap"><pre class="code" style="flex:1;margin:0">${esc(consoleCommand(c.id))}</pre><button class="btn small" data-copy="${c.id}">Afrita skipun</button></div>
        <textarea class="scratch" data-paste="${c.id}" placeholder="Límdu vistunina hér: {&quot;st&quot;:{…},&quot;wrong&quot;:{…},…}" spellcheck="false"></textarea>
        <div class="row" style="justify-content:space-between"><span class="hint" data-msg="${c.id}">${msg[c.id] || (done ? summary(done) : '')}</span><button class="btn primary small" data-imp="${c.id}">Flytja inn</button></div>
      </div>`;
    }).join('');
    app.innerHTML = `<div class="stack" style="gap:18px">
      <h1>Stillingar</h1>
      ${prefsHTML()}
      <div class="panel stack" style="gap:8px">
        <h2>Gamla sagan</h2>
        <p class="muted" style="max-width:66ch">Gömlu síðurnar geyma árangurinn þinn í vafrageymslu sem þessi vefur nær ekki í. Svona flytur þú hann hingað, eitt fag í einu:</p>
        <ol style="margin:0;padding-left:20px;display:flex;flex-direction:column;gap:4px;max-width:66ch">
          <li>Opnaðu gömlu síðuna í sama vafra og þú notaðir hana í.</li>
          <li>Opnaðu þróunartólin og veldu <b>Console</b>: <kbd>⌥</kbd><kbd>⌘</kbd><kbd>J</kbd> í Chrome og Edge, <kbd>⌥</kbd><kbd>⌘</kbd><kbd>C</kbd> í Safari (kveikja þarf á <i>Develop</i>-valmyndinni í stillingum Safari).</li>
          <li>Límdu skipun fagsins hér fyrir neðan í Console og ýttu á <kbd>Enter</kbd>. Vistunin fer á klemmuspjaldið.</li>
          <li>Límdu hana í reit fagsins og smelltu á <b>Flytja inn</b>.</li>
        </ol>
        <p class="hint" style="max-width:66ch">Tilraunir, rétt svör og villubankinn flytjast, ásamt sögu prófa og spjöldum. Áætlanir og próf í gangi flytjast ekki. Það má flytja inn aftur síðar: árangur gömlu síðunnar er þá uppfærður en ekki tvítalinn, og það sem þú hefur æft hér heldur sér.</p>
      </div>
      ${cards}
    </div>`;
  }

  app.oninput = e => {
    const g = e.target.dataset.goal; if (!g) return;
    const P = S.settings.prefs; P.goals = { ...(P.goals || {}) };
    if (e.target.value.trim()) P.goals[g] = e.target.value.trim(); else delete P.goals[g];
    store.save();
  };

  app.onchange = async e => {
    const P = S.settings.prefs; const t = e.target;
    if (t.id === 'bak' && t.files && t.files[0]) {
      try { const r = mergeStates(S, parseBackup(await t.files[0].text())); store.save(); msg.bak = `Sameinað: ${plural(r.items, 'nýtt atriði', 'ný atriði')}, ${plural(r.updated, 'uppfært', 'uppfærð')}, ${plural(r.sessions, 'lota', 'lotur')}, ${r.hist} próf.`; }
      catch (err) { msg.bak = err.message; }
      return draw();
    }
    if (t.dataset.block) { const v = Math.round(+t.value); if (v >= 0 && v <= 180) { P.block = { ...P.block, [t.dataset.block]: v }; store.save(); } }
    if (t.id === 'conf') { P.confidence = t.checked; store.save(); }
  };

  app.onclick = async e => {
    const bz = e.target.closest('[data-busy]');
    if (bz) { const P = S.settings.prefs; const d = +bz.dataset.busy; P.busy = P.busy.includes(d) ? P.busy.filter(x => x !== d) : [...P.busy, d].sort(); store.save(); return draw(); }
    if (e.target.closest('[data-act="export"]')) {
      const d = new Date(); const name = `namsvefur-${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}.json`;
      const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([exportState(S)], { type: 'application/json' })); a.download = name; a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
      msg.bak = `Vistað sem ${name}.`; return draw();
    }
    const cp = e.target.closest('[data-copy]');
    if (cp) { try { await navigator.clipboard.writeText(consoleCommand(cp.dataset.copy)); cp.textContent = 'Afritað'; } catch (err) { cp.textContent = 'Veldu og afritaðu'; } return; }
    const b = e.target.closest('[data-imp]'); if (!b) return;
    const id = b.dataset.imp; const c = COURSES.find(x => x.id === id);
    const text = app.querySelector(`[data-paste="${id}"]`).value;
    if (!text.trim()) { msg[id] = 'Límdu vistunina fyrst.'; return draw(); }
    try {
      const old = parseLegacy(text, id);
      const r = importLegacy(S, c, old, { key: LEGACY_KEYS[id][0] });
      store.save();
      msg[id] = 'Flutt inn: ' + summary(r);
    } catch (err) { msg[id] = err.message; }
    draw();
  };
  draw();
  return {};
}
