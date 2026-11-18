// Í dag: hvað á að gera núna (stór fyrirsögn) og dagar í næsta próf, dagaröð fram að síðasta prófi,
// „Lota kvöldsins“ (tillaga að lærdómsblokk, einn takki) og „Á áætlun“, og kunnáttukortið sem hitakort.

import { COURSES } from '../courses/index.js';
import { EXAMS } from '../config.js';
import { suggestBlock, daysSince } from '../engine/today.js';
import { topicStats, modeOf } from '../engine/practice.js';
import { dueIds } from '../engine/review.js';
import { timeToExam, examDateText } from '../engine/time.js';
import { buildStrip, onTrackText, DONE_MIN } from '../engine/timeline.js';
import { goHref } from './plan.js';
import { pctTxt, plural } from '../ui/format.js';
import { esc } from '../ui/dom.js';
import { startBlock, segLabel, hrefFor } from './block.js';

const WEEKDAYS = ['sunnudagur', 'mánudagur', 'þriðjudagur', 'miðvikudagur', 'fimmtudagur', 'föstudagur', 'laugardagur'];
const MONTHS = ['janúar', 'febrúar', 'mars', 'apríl', 'maí', 'júní', 'júlí', 'ágúst', 'september', 'október', 'nóvember', 'desember'];

/**
 * Litur reits í hitakortinu: grátt (ósnert) → rautt (0%) → gult (60%) → grænt (100%). Liturinn er blandaður
 * við flötinn, minna eftir því sem lengra er síðan æft var (fullur styrkur í dag, minnstur eftir 14 daga);
 * textinn helst í bleklit svo litaskilin haldist.
 */
export function heat(p, days) {
  if (p === null) return null;
  const [c1, c2, t] = p < 0.6 ? ['--heat-lo', '--heat-mid', p / 0.6] : ['--heat-mid', '--heat-hi', (p - 0.6) / 0.4];
  const amt = 45 - 25 * Math.min(1, (days ?? 0) / 14);
  return { c1, c2, t: Math.round(t * 100), amt: Math.round(amt) };
}
const heatStyle = h => h ? `--c1:var(${h.c1});--c2:var(${h.c2});--t:${h.t}%;--amt:${h.amt}%` : '';

export function knowledgeMap(S, now = Date.now()) {
  const rows = COURSES.map(c => {
    const m = modeOf(c, null);
    const filter = m && m.quick === false ? e => !e.quick && e.type !== 'card' : undefined;
    const cells = c.topics.map(t => {
      const s = topicStats(c, S, t.id, filter); const d = daysSince(c, S, t.id, now);
      const ago = d === null ? 'aldrei æft' : d < 1 ? 'æft í dag' : `æft fyrir ${plural(Math.round(d), 'degi', 'dögum')}`;
      const label = `${c.code} ${t.name}: ${s.pct === null ? 'ósnert' : pctTxt(s.pct) + ' rétt'}, ${ago}`;
      const short = c.engine === 'lecture' ? (t.label || t.id) : t.name;
      const h = heat(s.pct, d);
      return `<a class="kcell ${h ? 'heat' : ''}" href="#/fag/${c.id}/aefing?${filter ? 'm=written&' : ''}t=${t.id}" style="${heatStyle(h)}" aria-label="${esc(label)}" title="${esc(label)}"><span class="kn">${esc(short)}</span><span class="kp mono">${s.pct === null ? '' : pctTxt(s.pct)}</span></a>`;
    }).join('');
    return `<div class="krow" style="--cc:var(${c.color})"><a class="cchip" href="#/fag/${c.id}">${c.code}</a><div class="kcells">${cells}</div></div>`;
  }).join('');
  return `<div class="kmap">${rows}</div>
    <div class="legend"><span class="heatscale" aria-hidden="true"><i></i></span><span>0% → 60% → 100% rétt</span><span><i class="kdot"></i>ósnert</span><span>Daufari litur = lengra síðan æft var</span></div>`;
}

const DAYS_SHORT = ['sun.', 'mán.', 'þri.', 'mið.', 'fim.', 'fös.', 'lau.'];
const MON_SHORT = ['jan.', 'feb.', 'mars', 'apr.', 'maí', 'júní', 'júlí', 'ág.', 'sept.', 'okt.', 'nóv.', 'des.'];
const dayText = d => { const t = new Date(d + 'T12:00:00Z'); return `${DAYS_SHORT[t.getUTCDay()]} ${t.getUTCDate()}. ${MON_SHORT[t.getUTCMonth()]}`; };
const byId = id => COURSES.find(c => c.id === id);

/** Dagaröðin: einn reitur á dag, prófdagar hærri, dagurinn í dag merktur, búnir dagar fylltir. */
function stripHTML(strip) {
  const cells = strip.days.map(d => {
    const c = byId(d.course), st = d.stripe && byId(d.stripe);
    const label = `${dayText(d.date)}: ${c.code}${d.exam ? ' lokapróf' : ''}${st ? ` (líka ${st.code})` : ''}${d.today ? ', í dag' : ''}${d.done ? ', lokið' : d.past ? ', ekki lokið' : ''}`;
    return `<li class="sday ${d.exam ? 'exam' : ''} ${d.done ? 'done' : ''} ${d.today ? 'now' : ''} ${d.past && !d.done ? 'missed' : ''}" style="--cc:var(${c.color})${st ? `;--sc:var(${st.color})` : ''}" title="${esc(label)}"><span class="vh">${esc(label)}</span>${st ? '<i class="stripe"></i>' : ''}</li>`;
  }).join('');
  const tbd = EXAMS.filter(x => !x.at && x.kind === 'loka').map(x => { const c = byId(x.course); return `<span class="sx tbd" style="--cc:var(${c.color})"><i></i>${c.code} óstaðfest</span>`; }).join('');
  const exams = strip.days.filter(d => d.exam).map(d => { const c = byId(d.course); return `<span class="sx" style="--cc:var(${c.color})"><i></i>${c.code} ${dayText(d.date)}</span>`; }).join('') + tbd;
  const ti = strip.days.findIndex(d => d.today);
  return `<div class="strip" style="--n:${strip.days.length}">
      <ol class="sdays" aria-label="Dagar fram að síðasta prófi">${cells}</ol>
      ${ti >= 0 ? `<div class="snowrow" aria-hidden="true"><span class="snow" style="grid-column:${ti + 1}">Í dag</span></div>` : ''}
    </div>
    <div class="slegend">${exams}</div>`;
}

export function render({ app, store, go }) {
  const S = store.state; const now = Date.now(); const d = new Date(now);
  const prefs = S.settings.prefs;

  const sug = suggestBlock(COURSES, S, { now, exams: EXAMS, prefs });
  const strip = buildStrip(COURSES, S, { now, exams: EXAMS });
  const running = S.block && S.block.phase !== 'done';
  const td = strip && strip.todayDay;

  // næsta próf: stóra talan
  const next = EXAMS.filter(x => x.at && Date.parse(x.at) + (x.minutes || 0) * 60e3 > now).sort((a, b) => Date.parse(a.at) - Date.parse(b.at))[0];
  const nc = next && byId(next.course), nt = next && timeToExam(next, now);
  const count = next ? `<a class="th-count" href="#/fag/${nc.id}" style="--cc:var(${nc.color})">
      <span class="th-num">${nt.days > 0 ? nt.days : nt.state === 'running' ? 'Nú' : 'Í dag'}</span>
      <span class="th-lbl">${nt.days > 1 ? 'dagar í' : nt.days === 1 ? 'dagur í' : ''} ${esc(next.label.toLowerCase())} <b>${nc.code}</b><br><span class="hint">${examDateText(next.at)}</span></span></a>` : '';

  // fyrirsögnin: næsti óhakaði liður áætlunar dagsins, annars tillagan
  let headline, sub, link = '';
  const planCourse = td && td.plan ? byId(td.course) : null;
  const doneMap = planCourse ? ((S.settings.plan || {})[planCourse.id] || {}).done || {} : {};
  const nextItem = planCourse ? td.plan.items.find(s => !doneMap[s.key]) : null;
  const firstTopics = sug.segments.find(s => s.kind === 'topics');
  if (nextItem) {
    headline = nextItem.h;
    sub = `${planCourse.code} · samkvæmt áætlun${nextItem.at ? ` kl. ${nextItem.at}` : ''} · ${nextItem.m} mín.`;
    if (nextItem.go) link = `<a class="btn" href="${goHref(planCourse, nextItem.go, S)}">Opna</a>`;
  } else if (td && td.done) {
    headline = 'Lota dagsins er búin';
    sub = planCourse ? `Allt á áætlun ${planCourse.code} í dag er hakað.` : `${Math.round(td.minutes)} mín. í ${byId(td.course).code} í dag.`;
  } else if (firstTopics) {
    const c = byId(firstTopics.course);
    headline = `${firstTopics.topics.map(t => c.topics.find(x => x.id === t).name).join(' og ')}`;
    sub = `${c.code} · veikustu flokkarnir í fagi með hæstan forgang`;
  } else {
    headline = sug.segments.length ? 'Villurnar sem eru á tíma' : 'Ekkert próf framundan';
    sub = '';
  }

  const segRow = s => `<li class="seg-row"><span class="eyebrow">${s.half === 1 ? 'Fyrri hluti' : 'Seinni hluti'}</span>
    <div style="min-width:0"><b>${esc(segLabel(s))}</b><div class="hint">${s.kind === 'due' ? `${plural(s.n, 'villa', 'villur')} sem ${s.n % 10 === 1 && s.n % 100 !== 11 ? 'er komin' : 'eru komnar'} á tíma` : s.kind === 'mix' ? '10 atriði; fagið birtist eftir svar' : `um ${plural(s.n, 'atriði', 'atriði')}`} · ${s.minutes} mín.</div></div>
    <a class="btn small" href="${hrefFor(s)}">Opna</a></li>`;
  const top = sug.ranking[0];
  const why = top && top.prio > 0 ? `${top.course.code} hefur hæstan forgang: ${top.days === null ? 'próf óstaðfest' : `próf ${timeToExam(top.exam, now).text}`}, ${top.share === null ? 'ekkert æft enn' : `${Math.round(top.share * 100)}% rétt nýlega`}.` : '';
  const dueAll = COURSES.reduce((s, c) => s + dueIds(S, c.id, now).length, 0);
  const goalList = COURSES.filter(c => (prefs.goals || {})[c.id]).map(c => `${c.code} ${esc(prefs.goals[c.id])}`);
  const goals = goalList.length ? `<p class="hint">Markmið: ${goalList.join(' · ')}</p>` : '';

  app.innerHTML = `<div class="stack today" style="gap:28px">
    <header class="th">
      <div class="th-main"><span class="eyebrow">${WEEKDAYS[d.getDay()]} ${d.getDate()}. ${MONTHS[d.getMonth()]}</span>
        <h1 class="th-head">${esc(headline)}</h1>${sub ? `<p class="th-sub">${esc(sub)}</p>` : ''}${link ? `<div class="row">${link}</div>` : ''}</div>
      ${count}
    </header>
    ${strip ? `<section class="stack" style="gap:10px" aria-label="Dagaröð">${stripHTML(strip)}${goals}</section>` : goals}
    ${S.settings.weekGoal ? `<div class="panel"><span class="eyebrow">Markmið vikunnar</span><p>${esc(S.settings.weekGoal.text)}</p></div>` : ''}
    <div class="tcards">
      <div class="panel stack" style="gap:12px">
        <div class="row" style="justify-content:space-between;align-items:baseline"><h2>Lota kvöldsins</h2><span class="mono hint">${sug.busy ? `${sug.first} mín. · upptekið kvöld` : `${sug.first} + ${sug.pause} hlé + ${sug.second} mín.`}</span></div>
        ${why ? `<p class="hint">${esc(why)}${dueAll ? ` ${plural(dueAll, 'villa er', 'villur eru')} á tíma.` : ''}</p>` : ''}
        <ol class="segs">${sug.segments.map(segRow).join('')}</ol>
        <div class="row">${running ? '<button class="btn primary" data-act="resume">Halda áfram</button>' : '<button class="btn primary" data-act="start">Byrja</button>'}<a class="hint" href="#/upprifjun">Eða blönduð upprifjun úr öllum fögum</a></div>
      </div>
      ${strip ? `<div class="panel stack ontrack" style="gap:8px">
        <h2>Á áætlun</h2>
        <p class="ot-num"><b>${strip.done}</b> / ${strip.total} <span>lotur</span></p>
        <p>${esc(onTrackText(strip))}</p>
        <p class="hint">Ein lota á dag fram að síðasta prófi. Dagur telst búinn eftir ${DONE_MIN} mín. í fagi dagsins, þegar áætlun dagsins er öll hökuð, eða þegar prófinu er lokið.</p>
      </div>` : ''}
    </div>
    <section class="panel stack" style="gap:10px">
      <div class="row" style="justify-content:space-between"><h2>Kunnáttukort</h2><span class="hint">Smelltu á reit til að æfa flokkinn</span></div>
      ${knowledgeMap(S, now)}
    </section>
  </div>`;

  app.onclick = e => {
    const a = e.target.closest('[data-act]'); if (!a) return;
    if (a.dataset.act === 'start') go(startBlock(store, sug));
    if (a.dataset.act === 'resume') { const B = S.block; go(B.phase === 'pause' || B.phase === 'ready' ? '#/idag' : hrefFor(B.segments[B.idx])); }
  };
  return {};
}
