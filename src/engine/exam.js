// Próf á tíma: samsetning eftir prófsniði fagsins, mat og skráning. Teikning er í views/exam.js.
// Snið: 'inspera' (103, 107: ein spurning í einu), 'mixed' (106, 108: krossar, tölusvör, skrifleg dæmi og
// skýringarspjöld) og 'written' (101: öll dæmi í einu, svo sjálfsmat skref fyrir skref).

import { entriesOf, weightedPick, shuffle, instantiate, inMode } from './practice.js';
import { recordAnswer } from './review.js';
import { blank, grade, stepTotal } from './items/index.js';

/** Stig atriðis á prófi: vægi dæmis (skriflegt), stig gerðar (blandað), stig atriðis (HAG107G) eða 1. */
export function pointsOf(it, format) {
  if (it.w !== undefined) return it.w;
  if (format.pick.points) return format.pick.points[it.type] ?? 1;
  return it.pts ?? 1;
}

/** Velur færslur (gid) í próf. Skilar [{gid, w?}]. */
export function pickExam(course, format, state, opts = {}, rnd = Math.random) {
  const all = entriesOf(course).filter(e => inMode(e, { quick: false }));
  const p = format.pick;
  if (p.by === 'quota') {
    const out = [];
    for (const t of Object.keys(p.quota)) {
      const pool = all.filter(e => e.topic === t && (!p.sources || p.sources.includes(e.source)));
      const chosen = [];
      while (chosen.length < p.quota[t] && chosen.length < pool.length) {
        const e = weightedPick(pool, chosen, state, rnd);
        if (!chosen.includes(e.gid)) chosen.push(e.gid);
      }
      out.push(...chosen);
    }
    return shuffle(out, rnd).map(gid => ({ gid }));
  }
  if (p.by === 'fixed') {
    return p.ids.map(id => { const it = course.items.find(x => x.id === id); return { gid: `${course.id}:${id}`, w: format.style === 'written' ? it.examWeight : undefined }; });
  }
  if (p.by === 'gens') return shuffle(all.filter(e => e.kind === 'gen').map(e => e.gid), rnd).slice(0, p.n).map(gid => ({ gid }));
  if (p.by === 'blueprint') {
    const used = [];
    return p.sections.map(sec => {
      // sæti með föstum lista (HAG108G: sama dæmi úr fjórum prófum) eða flokkum (HAG101G)
      const pool = sec.ids ? all.filter(e => sec.ids.includes(e.key))
        : all.filter(e => sec.topics.includes(e.topic) && !used.includes(e.gid) && (p.gensOnly ? e.kind === 'gen' : (e.kind === 'gen' || e.points >= p.minPoints)));
      const e = weightedPick(pool, [], state, rnd); used.push(e.gid);
      return { gid: e.gid, w: sec.weight };
    });
  }
  if (p.by === 'levels') return pickLevels(course, p, state, opts, rnd);
  throw new Error(`Óþekkt prófsnið ${p.by}`);
}

// Sérsniðið æfingapróf (HAG106G, HAG108G): skipting á stig, dreift á fyrirlestra í hring, mest ⌈n₃/3⌉ skrifleg dæmi á
// stigi 3, lágmark R-spurninga ef R-fyrirlesturinn er valinn, og skýringarspjöld aftast.
function pickLevels(course, p, state, opts, rnd) {
  const groups = opts.groups || course.topics.map(t => t.id);
  const len = p.lengths.find(l => l.id === (opts.len || p.defaultLength)) || p.lengths[0];
  const w = (p.mixes.find(m => m.id === opts.mix) || p.mixes[0]).w;
  const per = w.map(x => Math.round(len.n * x)); per[1] += len.n - per.reduce((a, b) => a + b, 0);
  const all = entriesOf(course).filter(e => e.type !== 'card' && !e.paper && groups.includes(e.topic));   // heil gömul prófdæmi eru í eigin prófsniðum
  const byGid = Object.fromEntries(all.map(e => [e.gid, e]));
  const isStep = e => e.type === 'steps';
  let keys = [];
  [1, 2, 3].forEach((l, i) => {
    const pool = all.filter(e => e.level === l); const chosen = [];
    const gs = shuffle(groups, rnd); let gi = 0, guard = 0;
    while (chosen.length < per[i] && guard++ < 400) {
      const g = gs[gi++ % gs.length];
      const sub = pool.filter(e => e.topic === g && !chosen.includes(e.gid)); if (!sub.length) continue;
      const steps = chosen.filter(k => isStep(byGid[k])).length;
      const sub2 = l === 3 && steps >= Math.ceil(per[i] * p.stepCapL3) ? sub.filter(e => !isStep(e)) : sub; if (!sub2.length) continue;
      chosen.push(weightedPick(sub2, chosen, state, rnd).gid);
    }
    keys.push(...chosen);
  });
  if (p.rShare && groups.includes(p.rShare.topic)) {
    const need = Math.ceil(p.rShare.share * keys.length); let have = keys.filter(k => byGid[k].r).length, guard = 0;
    while (have < need && guard++ < 200) {
      const l = 1 + guard % 3;
      const cand = all.filter(e => e.r && e.level === l && !keys.includes(e.gid));
      const out = keys.findIndex(k => !byGid[k].r && byGid[k].level === l && !isStep(byGid[k]));
      if (!cand.length || out < 0) continue;
      keys[out] = weightedPick(cand, keys, state, rnd).gid; have++;
    }
  }
  const out = shuffle(keys, rnd).map(gid => ({ gid }));
  if (opts.explain ?? p.explain) {
    const cards = shuffle(entriesOf(course).filter(e => e.type === 'card' && groups.includes(e.topic)), rnd).slice(0, len.cards);
    out.push(...cards.map(e => ({ gid: e.gid })));
  }
  return out;
}

/** Býr til nýtt próf. Tilvikin eru vistuð með prófinu svo að endurhleðsla síðunnar haldi sömu tölum. */
export function buildExam(course, formatId, state, { now = Date.now(), rnd = Math.random, opts = {} } = {}) {
  const format = course.examFormats.find(f => f.id === formatId);
  const byGid = Object.fromEntries(entriesOf(course).map(e => [e.gid, e]));
  const items = pickExam(course, format, state, opts, rnd).map(({ gid, w }) => { const it = instantiate(course, byGid[gid], rnd); return w === undefined ? it : { ...it, w }; });
  let minutes = format.minutes;
  if (format.pick.by === 'levels') minutes = (format.pick.lengths.find(l => l.id === (opts.len || format.pick.defaultLength)) || format.pick.lengths[0]).minutes;
  const label = format.pick.by === 'levels' ? `${(format.pick.mixes.find(m => m.id === opts.mix) || format.pick.mixes[0]).name} · ${opts.groupsLabel || 'allir fyrirlestrar'}` : format.name;
  return { course: course.id, format: format.id, style: format.style, label, items, ans: items.map(blank), flag: items.map(() => false), start: now, dur: minutes * 60e3, cur: 0, phase: 'write' };
}

export const timeLeft = (exam, now = Date.now()) => exam.dur - (now - exam.start);

/** Þarf prófið sjálfsmat eftir skil (skrifleg dæmi)? */
export const needsGrading = exam => exam.items.some(it => it.type === 'steps');

/** Fer úr skrifhluta í sjálfsmat: skrefin birtast öll. */
export function toGrade(exam, { timeout = false, now = Date.now() } = {}) {
  exam.phase = 'grade'; exam.used = Math.min(exam.dur, now - exam.start); exam.timeout = timeout;
  exam.items.forEach((it, i) => { if (it.type === 'steps') exam.ans[i].st = it.steps.map(() => 2); });
}

/** Stig á hvert atriði: {frac, pts, max}. Spjöld gefa 0 af 0. */
export function scoreExam(course, exam) {
  const format = course.examFormats.find(f => f.id === exam.format);
  return exam.items.map((it, i) => {
    const max = it.type === 'card' ? 0 : pointsOf(it, format);
    const frac = it.type === 'card' ? 0 : grade(it, exam.ans[i]);
    return { frac, max, pts: frac * max };
  });
}

/** Metur, skráir hvert svar (röng fara í villubankann) og vistar niðurstöðuna í sögu. */
export function finishExam(state, course, exam, { timeout = false, now = Date.now() } = {}) {
  const scores = scoreExam(course, exam);
  exam.items.forEach((it, i) => {
    if (it.type === 'card') return;
    const pts = course.engine === 'written' && it.type === 'steps' ? { pts: scores[i].frac * stepTotal(it), max: stepTotal(it) } : {};
    recordAnswer(state, it.gid, scores[i].frac, { passScore: course.passScore, now, ...pts });
  });
  const score = scores.reduce((s, x) => s + x.pts, 0), max = scores.reduce((s, x) => s + x.max, 0);
  const used = exam.used ?? Math.min(exam.dur, now - exam.start);
  const res = { course: course.id, format: exam.format, label: exam.label, at: now, used, n: exam.items.filter(it => it.type !== 'card').length, score, max, timeout: exam.timeout ?? timeout };
  state.hist.push(res);
  state.sessions.push({ course: course.id, kind: 'exam', start: exam.start, end: now, n: res.n, c: scores.reduce((s, x) => s + (x.max ? x.frac : 0), 0) });
  delete state.exams[course.id];
  return { ...res, style: exam.style, items: exam.items, ans: exam.ans, scores };
}

/** Niðurstaða eftir lykli (flokki eða stigi): {lykill: {pts, max, n}}. */
export function breakdown(result, keyFn) {
  const by = {};
  result.items.forEach((it, i) => { const s = result.scores[i]; if (!s.max) return; const k = keyFn(it); const b = by[k] || (by[k] = { pts: 0, max: 0, n: 0 }); b.pts += s.pts; b.max += s.max; b.n++; });
  return by;
}
