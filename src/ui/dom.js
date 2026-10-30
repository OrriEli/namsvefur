// Sameiginleg hjálparföll viðmótsins.

export const $ = (s, root = document) => root.querySelector(s);
export const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// Hreinn texti úr HTML spurningar, til að sýna í listum (töflur og formúlureitir verða […]).
export const plain = h => String(h).replace(/<table[\s\S]*?<\/table>|<div class="f">[\s\S]*?<\/div>/g, ' […] ').replace(/<[^>]+>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
export const clip = (s, n) => s.length > n ? s.slice(0, n) + '…' : s;

export const barCls = p => p === null || p === undefined ? '' : p < 0.6 ? 'lo' : p < 0.8 ? 'mid' : '';
export const bar = (p, txt) => `<div class="row" style="gap:8px;flex-wrap:nowrap"><div class="bar ${barCls(p)}" style="flex:1"><i style="width:${p === null || p === undefined ? 0 : Math.round(p * 100)}%"></i></div><span class="mono" style="width:3.2ch;text-align:right">${txt}</span></div>`;

/** Hæð efstu stiku, svo tímamælir prófs festist undir henni. */
export function setTopH() {
  const top = document.querySelector('.top');
  if (top) document.documentElement.style.setProperty('--toph', top.offsetHeight + 'px');
}
