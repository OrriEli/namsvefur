// Í dag: prófadagatal, tillaga að lærdómsblokk (einn takki, Byrja) og kunnáttukort allra faga.

import { COURSES } from '../courses/index.js';
import { EXAMS } from '../config.js';
import { suggestBlock, daysSince } from '../engine/today.js';
import { topicStats, modeOf } from '../engine/practice.js';
import { dueIds } from '../engine/review.js';
import { countdownParts } from '../ui/countdown.js';
import { pctTxt, plural } from '../ui/format.js';
import { esc } from '../ui/dom.js';
import { startBlock, segLabel, hrefFor } from './block.js';

const WEEKDAYS = ['sunnudagur', 'mánudagur', 'þriðjudagur', 'miðvikudagur', 'fimmtudagur', 'föstudagur', 'laugardagur'];
const MONTHS = ['janúar', 'febrúar', 'mars', 'apríl', 'maí', 'júní', 'júlí', 'ágúst', 'september', 'október', 'nóvember', 'desember'];

/** Litur reits í kunnáttukorti: undir 60% rautt, 60–80% gult, yfir 80% grænt, ósnert grátt. */
export const cellCls = p => p === null ? '' : p < 0.6 ? 'lo' : p < 0.8 ? 'mid' : 'hi';
/** Því lengra síðan æft var, því daufari reitur (fullur litur í dag, daufastur eftir 14 daga). */
export const cellOpacity = days => days === null ? 1 : 1 - 0.55 * Math.min(1, days / 14);

export function knowledgeMap(S, now = Date.now()) {
  const rows = COURSES.map(c => {
    const m = modeOf(c, null);
    const filter = m && m.quick === false ? e => !e.quick && e.type !== 'card' : undefined;
    const cells = c.topics.map(t => {
      const s = topicStats(c, S, t.id, filter); const d = daysSince(c, S, t.id, now);
      const ago = d === null ? 'aldrei æft' : d < 1 ? 'æft í dag' : `æft fyrir ${plural(Math.round(d), 'degi', 'dögum')}`;
      const label = `${c.code} ${t.name}: ${s.pct === null ? 'ósnert' : pctTxt(s.pct) + ' rétt'}, ${ago}`;
      const short = c.engine === 'lecture' ? (t.label || t.id) : t.name;
      return `<a class="kcell ${cellCls(s.pct)}" href="#/fag/${c.id}/aefing?${filter ? 'm=written&' : ''}t=${t.id}" style="opacity:${cellOpacity(s.pct === null ? null : d).toFixed(2)}" aria-label="${esc(label)}" title="${esc(label)}"><span class="kn">${esc(short)}</span><span class="kp mono">${pctTxt(s.pct)}</span></a>`;
    }).join('');
    return `<div class="krow" style="--cc:var(${c.color})"><a class="cchip" href="#/fag/${c.id}">${c.code}</a><div class="kcells">${cells}</div></div>`;
  }).join('');
  return `<div class="kmap">${rows}</div>
    <div class="legend"><span><i class="kdot lo"></i>undir 60%</span><span><i class="kdot mid"></i>60–80%</span><span><i class="kdot hi"></i>yfir 80%</span><span><i class="kdot"></i>ósnert</span><span>Daufari reitur = lengra síðan æft var</span></div>`;
}

export function render({ app, store, go }) {
  const S = store.state; const now = Date.now(); const d = new Date(now);
  const prefs = S.settings.prefs;

  const exams = EXAMS.filter(x => !x.at || new Date(x.at).getTime() + (x.minutes || 0) * 60e3 > now)
    .sort((a, b) => (a.at ? new Date(a.at).getTime() : Infinity) - (b.at ? new Date(b.at).getTime() : Infinity));
  const cal = exams.map((x, i) => { const c = COURSES.find(y => y.id === x.course);
    const goal = (prefs.goals || {})[c.id];
    const p = countdownParts(x, now);
    const big = p.left || (x.at ? 'í gangi' : 'óstaðfest'), line = x.at ? `${x.label} · ${p.when}` : x.label;
    return `<a class="excard ${i === 0 ? 'next' : ''}" href="#/fag/${c.id}" style="--cc:var(${c.color})" aria-label="${esc(`${c.code} ${c.short}: ${line}${p.left ? ', eftir ' + p.left : ', ' + big}`)}"><span class="cchip">${c.code}</span><b class="exn">${esc(c.short)}</b><span class="exl mono">${p.left ? p.left.replace(/^(\d+ d\.) (.*)$/, '<b>$1</b> <span>$2</span>') : big}</span><span class="exw hint">${esc(line)}</span>${goal ? `<span class="exg hint">Markmið: ${esc(goal)}</span>` : ''}</a>`; }).join('');

  const sug = suggestBlock(COURSES, S, { now, exams: EXAMS, prefs });
  const running = S.block && S.block.phase !== 'done';
  const segRow = s => `<li class="seg-row"><span class="eyebrow">${s.half === 1 ? 'Fyrri hluti' : 'Seinni hluti'}</span>
    <div style="min-width:0"><b>${esc(segLabel(s))}</b><div class="hint">${s.kind === 'due' ? `${plural(s.n, 'villa', 'villur')} sem ${s.n % 10 === 1 && s.n % 100 !== 11 ? 'er komin' : 'eru komnar'} á tíma` : s.kind === 'mix' ? '10 atriði; fagið birtist eftir svar' : `um ${plural(s.n, 'atriði', 'atriði')}`} · ${s.minutes} mín.</div></div>
    <a class="btn small" href="${hrefFor(s)}">Opna</a></li>`;
  const top = sug.ranking[0];
  const why = top && top.prio > 0 ? `${top.course.code} hefur hæstan forgang: ${top.days === null ? 'próf óstaðfest' : `próf eftir ${plural(Math.max(0, Math.ceil(top.days)), 'dag', 'daga')}`}, ${top.share === null ? 'ekkert æft enn' : `${Math.round(top.share * 100)}% rétt nýlega`}.` : '';
  const dueAll = COURSES.reduce((s, c) => s + dueIds(S, c.id, now).length, 0);

  app.innerHTML = `<div class="stack" style="gap:22px">
    <div class="hero"><span class="eyebrow">${WEEKDAYS[d.getDay()]} ${d.getDate()}. ${MONTHS[d.getMonth()]}</span><h1>Í dag</h1></div>
    ${S.settings.weekGoal ? `<div class="panel"><span class="eyebrow">Markmið vikunnar</span><p>${esc(S.settings.weekGoal.text)}</p></div>` : ''}
    <div class="excal">${cal}</div>
    <div class="panel stack" style="gap:12px">
      <div class="row" style="justify-content:space-between;align-items:baseline"><h2>Lærdómsblokk</h2><span class="mono hint">${sug.busy ? `${sug.first} mín. · upptekið kvöld` : `${sug.first} + ${sug.pause} hlé + ${sug.second} mín.`}</span></div>
      ${why ? `<p class="hint">${esc(why)}${dueAll ? ` ${plural(dueAll, 'villa er', 'villur eru')} á tíma.` : ''}</p>` : ''}
      <ol class="segs">${sug.segments.map(segRow).join('')}</ol>
      <div class="row">${running ? '<button class="btn primary" data-act="resume">Halda áfram með blokkina</button>' : '<button class="btn primary" data-act="start">Byrja</button>'}<span class="hint">Tímamælir og hlé fylgja; stikan efst sýnir hvar þú ert.</span></div>
    </div>
    <div class="panel stack" style="gap:10px">
      <div class="row" style="justify-content:space-between"><h2>Kunnáttukort</h2><span class="hint">Smelltu á reit til að æfa flokkinn</span></div>
      ${knowledgeMap(S, now)}
    </div>
  </div>`;

  app.onclick = e => {
    const a = e.target.closest('[data-act]'); if (!a) return;
    if (a.dataset.act === 'start') go(startBlock(store, sug));
    if (a.dataset.act === 'resume') { const B = S.block; go(B.phase === 'pause' || B.phase === 'ready' ? '#/idag' : hrefFor(B.segments[B.idx])); }
  };
  return {};
}

