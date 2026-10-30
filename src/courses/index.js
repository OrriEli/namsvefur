// Skrá yfir fögin. Nýtt fag: búa til gagnaskrá (með scripts/extract-legacy.js eða í höndunum) og bæta henni hér við.

import hag103g from './hag103g.js';
import hag107g from './hag107g.js';

/** @type {import('../schema.js').Course[]} */
export const COURSES = [hag103g, hag107g];

// Fög sem eru ekki komin inn enn. Birt á forsíðu svo ljóst sé hvað vantar.
export const PENDING = [
  { id: 'hag101g', code: 'HAG101G', name: 'Hagræn stærðfræði I', short: 'Stærðfræði', note: 'Kemur eftir miðannarprófið 5. nóv. Notaðu gömlu síðuna þangað til.' },
  { id: 'hag106g', code: 'HAG106G', name: 'Fjármálahagfræði I', short: 'Fjármál', note: 'Kemur í áfanga 2.' },
  { id: 'hag108g', code: 'HAG108G', name: 'Líkindafræði og forritun', short: 'Líkindi', note: 'Kemur í áfanga 2.' }
];

export const courseById = id => COURSES.find(c => c.id === id) || null;
