// Stillingar. Fyrst um sinn: innflutningur gömlu sögunnar, einn reitur á hvert fag með leiðbeiningum.

import { COURSES } from '../courses/index.js';
import { LEGACY_KEYS, consoleCommand, parseLegacy, importLegacy } from '../store/legacy-import.js';
import { plural, fmtWhen as when } from '../ui/format.js';
import { esc } from '../ui/dom.js';


function summary(r) {
  return [plural(r.items, 'atriði', 'atriði'), r.cards ? plural(r.cards, 'spjald', 'spjöld') : '', `${r.bank} í villubanka`, r.hist ? plural(r.hist, 'próf', 'próf') + ' í sögu' : '', r.skipped ? `${r.skipped} sleppt (ekki lengur á síðunni)` : ''].filter(Boolean).join(' · ');
}

export function render({ app, store }) {
  const S = store.state;
  const msg = {};

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

  app.onclick = async e => {
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
