// Vikan (hluti af Framvindu): mínútur, atriði og hlutfall réttra á hvert fag síðustu 7 daga, þróun miðað við vikuna á undan,
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

/** Teiknar vikuyfirlitið í `el` (hluta á Framvindu). */
export function mountWeek(el, store) {
  const S = store.state;
  const sum = weekSummary(S, COURSES);
  const goal = S.settings.weekGoal ? S.settings.weekGoal.text : '';
  const maxDay = Math.max(30, ...sum.days.map(d => d.minutes));

  // fög sem ekki voru æfð í vikunni né vikunni á undan eru ekki í töflunni (engar núllraðir)
  const active = sum.rows.filter(r => r.n || r.prev.n), idle = sum.rows.filter(r => !r.n && !r.prev.n);
  const rows = active.map(r => `<tr><td><span class="cchip" style="--cc:var(${r.course.color})">${r.course.code}</span> ${esc(r.course.short)}</td>
    <td class="mono">${min(r.minutes)}</td><td class="mono">${r.n}</td><td class="mono">${perc(r.pct)}</td>
    <td class="mono hide-sm">${trend(r.minutes, r.prev.minutes, x => x, ' mín.')}</td>
    <td class="mono hide-sm">${trend(r.pct === null ? null : r.pct * 100, r.prev.pct === null ? null : r.prev.pct * 100, x => x, ' p.s.')}</td></tr>`).join('');
  const t = sum.total;

  const goalPanel = `<div class="panel stack" style="gap:10px">
      <h3>Markmið næstu viku</h3>
      <textarea class="scratch" id="goal" placeholder="T.d. „Tvö full lokapróf í HAG101G og villubankinn tómur fyrir miðvikudag.“">${esc(goal)}</textarea>
      <p class="hint">Markmiðið birtist á forsíðunni.</p>
    </div>`;
  if (!t.n && !sum.prev.n) {
    // engin æfing í tvær vikur: boð í stað núlla og strika
    el.innerHTML = `<div class="stack" style="gap:20px">
      <div class="row" style="justify-content:space-between;align-items:baseline"><h2>Vikan</h2><span class="hint">Síðustu 7 dagar</span></div>
      <div class="panel invite stack"><h3>Vikan fyllist þegar þú æfir</h3><p class="muted" style="max-width:60ch">Hér birtast mínútur á dag, hlutfall réttra svara í hverju fagi og þróunin frá vikunni á undan. Byrjaðu á lotu kvöldsins á Í dag.</p><div class="row"><a class="btn primary" href="#/idag">Opna Í dag</a></div></div>
      ${goalPanel}
    </div>`;
  } else el.innerHTML = `<div class="stack" style="gap:20px">
    <div class="row" style="justify-content:space-between;align-items:baseline"><h2>Vikan</h2><span class="hint">Síðustu 7 dagar</span></div>
    <div class="facts">
      <div><b>${min(t.minutes)}</b><span>mínútur (vikan á undan ${min(sum.prev.minutes)})</span></div>
      <div><b>${t.n}</b><span>atriði (vikan á undan ${sum.prev.n})</span></div>
      <div><b>${t.n ? perc(t.pct) : 'Engin svör'}</b><span>rétt${sum.prev.n ? ` (vikan á undan ${perc(sum.prev.pct)})` : ''}</span></div>
      <div><b>${t.sure ? perc(t.sureWrong / t.sure) : 'Ekkert'}</b><span>${t.sure ? `„Viss“-svara voru röng (${t.sureWrong} af ${t.sure})` : '„Viss“-svar enn í vikunni'}</span></div>
    </div>
    <div class="panel stack" style="gap:10px">
      <h3>Mínútur á dag</h3>
      <div class="days">${sum.days.map(d => `<div class="dcol" title="${Math.round(d.minutes)} mín."><span class="mono hint">${Math.round(d.minutes) || ''}</span><i style="height:${Math.round(d.minutes / maxDay * 100)}%"></i><span class="hint">${DAYS[d.day.getDay()]}</span></div>`).join('')}</div>
    </div>
    <div class="panel stack" style="gap:10px">
      <h3>Eftir fögum</h3>
      <div class="scroll"><table class="tt"><thead><tr><th>Fag</th><th>Mín.</th><th>Atriði</th><th>Rétt</th><th class="hide-sm">Tími miðað við fyrri viku</th><th class="hide-sm">Rétt miðað við fyrri viku</th></tr></thead><tbody>${rows}</tbody></table></div>
      ${idle.length ? `<p class="hint">Ekki æft síðustu tvær vikur: ${idle.map(r => r.course.code).join(', ')}.</p>` : ''}
      <p class="hint">Tími er talinn frá því atriði birtist þar til síðasta svari lotu lauk; hlé lengri en 15 mín. skipta lotum. Próf teljast með.</p>
    </div>
    ${goalPanel}
    <div class="row"><button class="btn primary" data-act="copy">Afrita yfirlitið sem texta</button><span class="hint" id="copied"></span></div>
  </div>`;

  el.oninput = e => {
    if (e.target.id !== 'goal') return;
    const text = e.target.value.trim();
    if (text) S.settings.weekGoal = { text, at: Date.now() }; else delete S.settings.weekGoal;
    store.save();
  };
  el.onclick = async e => {
    if (!e.target.closest('[data-act="copy"]')) return;
    const txt = weekText(weekSummary(S, COURSES), S.settings.weekGoal && S.settings.weekGoal.text);
    const msg = el.querySelector('#copied');
    el.querySelector('#copytxt')?.remove();
    try { await navigator.clipboard.writeText(txt); msg.textContent = 'Afritað á klemmuspjaldið.'; }
    catch (err) { msg.textContent = 'Vafrinn leyfði ekki afritun; textinn er hér fyrir neðan.'; msg.insertAdjacentHTML('afterend', `<pre class="code" id="copytxt" style="width:100%">${esc(txt)}</pre>`); }
  };
}
