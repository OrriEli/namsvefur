// Vikan: mínútur, atriði og hlutfall réttra á hvert fag síðustu 7 daga, þróun miðað við vikuna á undan,
// hlutfall „Viss“-svara sem voru röng, markmið næstu viku og takki sem afritar yfirlitið sem texta.

import { COURSES } from '../courses/index.js';
import { weekSummary, weekText } from '../engine/stats.js';
import { esc } from '../ui/dom.js';

const DAYS = ['sun.', 'mán.', 'þri.', 'mið.', 'fim.', 'fös.', 'lau.'];
const perc = p => p === null ? '–' : Math.round(p * 100) + '%';
const min = m => `${Math.round(m)}`;

function trend(a, b, fmt, unit) {
  if (a === null || b === null || (a === 0 && b === 0)) return '<span class="hint">–</span>';
  const d = Math.round(a - b);
  if (!d) return '<span class="hint">óbreytt</span>';
  return `<span class="${d > 0 ? 'up' : 'down'}">${d > 0 ? '↑' : '↓'} ${fmt(Math.abs(d))}${unit}</span>`;
}

export function render({ app, store }) {
  const S = store.state;
  const sum = weekSummary(S, COURSES);
  const goal = S.settings.weekGoal ? S.settings.weekGoal.text : '';
  const maxDay = Math.max(30, ...sum.days.map(d => d.minutes));

  const rows = sum.rows.map(r => `<tr><td><span class="cchip" style="--cc:var(${r.course.color})">${r.course.code}</span> ${esc(r.course.short)}</td>
    <td class="mono">${min(r.minutes)}</td><td class="mono">${r.n}</td><td class="mono">${perc(r.pct)}</td>
    <td class="mono hide-sm">${trend(r.minutes, r.prev.minutes, x => x, ' mín.')}</td>
    <td class="mono hide-sm">${trend(r.pct === null ? null : r.pct * 100, r.prev.pct === null ? null : r.prev.pct * 100, x => x, ' p.s.')}</td></tr>`).join('');
  const t = sum.total;

  app.innerHTML = `<div class="stack" style="gap:20px">
    <div class="hero"><span class="eyebrow">Síðustu 7 dagar</span><h1>Vikan</h1></div>
    <div class="facts">
      <div><b>${min(t.minutes)}</b><span>mínútur (vikan á undan ${min(sum.prev.minutes)})</span></div>
      <div><b>${t.n}</b><span>atriði (vikan á undan ${sum.prev.n})</span></div>
      <div><b>${perc(t.pct)}</b><span>rétt (vikan á undan ${perc(sum.prev.pct)})</span></div>
      <div><b>${t.sure ? perc(t.sureWrong / t.sure) : '–'}</b><span>„Viss“-svara voru röng${t.sure ? ` (${t.sureWrong} af ${t.sure})` : ''}</span></div>
    </div>
    <div class="panel stack" style="gap:10px">
      <h2>Mínútur á dag</h2>
      <div class="days">${sum.days.map(d => `<div class="dcol" title="${Math.round(d.minutes)} mín."><span class="mono hint">${Math.round(d.minutes) || ''}</span><i style="height:${Math.round(d.minutes / maxDay * 100)}%"></i><span class="hint">${DAYS[d.day.getDay()]}</span></div>`).join('')}</div>
    </div>
    <div class="panel stack" style="gap:10px">
      <h2>Eftir fögum</h2>
      <div class="scroll"><table class="tt"><thead><tr><th>Fag</th><th>Mín.</th><th>Atriði</th><th>Rétt</th><th class="hide-sm">Tími miðað við fyrri viku</th><th class="hide-sm">Rétt miðað við fyrri viku</th></tr></thead><tbody>${rows}</tbody></table></div>
      <p class="hint">Tími er talinn frá því atriði birtist þar til síðasta svari lotu lauk; hlé lengri en 15 mín. skipta lotum. Próf teljast með.</p>
    </div>
    <div class="panel stack" style="gap:10px">
      <h2>Markmið næstu viku</h2>
      <textarea class="scratch" id="goal" placeholder="T.d. „Tvö full lokapróf í HAG101G og villubankinn tómur fyrir miðvikudag.“">${esc(goal)}</textarea>
      <p class="hint">Markmiðið birtist á forsíðunni.</p>
    </div>
    <div class="row"><button class="btn primary" data-act="copy">Afrita yfirlitið sem texta</button><span class="hint" id="copied"></span></div>
  </div>`;

  app.oninput = e => {
    if (e.target.id !== 'goal') return;
    const text = e.target.value.trim();
    if (text) S.settings.weekGoal = { text, at: Date.now() }; else delete S.settings.weekGoal;
    store.save();
  };
  app.onclick = async e => {
    if (!e.target.closest('[data-act="copy"]')) return;
    const txt = weekText(weekSummary(S, COURSES), S.settings.weekGoal && S.settings.weekGoal.text);
    const msg = app.querySelector('#copied');
    app.querySelector('#copytxt')?.remove();
    try { await navigator.clipboard.writeText(txt); msg.textContent = 'Afritað á klemmuspjaldið.'; }
    catch (err) { msg.textContent = 'Vafrinn leyfði ekki afritun; textinn er hér fyrir neðan.'; msg.insertAdjacentHTML('afterend', `<pre class="code" id="copytxt" style="width:100%">${esc(txt)}</pre>`); }
  };
  return {};
}
