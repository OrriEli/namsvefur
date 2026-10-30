// Krossaspurning: birting og mat. Sama útlit og í gömlu síðunum (.opt, .k, right/wrong).

export const LET = ['A', 'B', 'C', 'D', 'E'];

/**
 * @param {Object} it            tilvik með o, a
 * @param {{chosen?:number|null, reveal?:boolean}} st
 */
export function renderMcOptions(it, st) {
  return `<div class="opts">${it.o.map((o, i) => {
    let cls = 'opt';
    if (st.reveal) { if (i === it.a) cls += ' right'; else if (i === st.chosen) cls += ' wrong'; }
    else if (i === st.chosen) cls += ' sel';
    return `<button class="${cls}" data-i="${i}" ${st.reveal ? 'disabled' : ''}><span class="k">${LET[i]}</span><span>${o}</span></button>`;
  }).join('')}</div>`;
}

export const gradeMc = (it, chosen) => chosen === it.a ? 1 : 0;

export function mcVerdict(it, chosen) {
  if (chosen === null || chosen === undefined) return `<div class="verdict no">Ósvarað. Rétt svar er ${LET[it.a]}.</div>`;
  return chosen === it.a ? '<div class="verdict ok">Rétt.</div>' : `<div class="verdict no">Rangt. Rétt svar er ${LET[it.a]}.</div>`;
}

// Flýtilyklar: 1–5 og a–e velja kost.
export const keyToIndex = key => ({ 1: 0, 2: 1, 3: 2, 4: 3, 5: 4, a: 0, b: 1, c: 2, d: 3, e: 4 })[key.toLowerCase()];
