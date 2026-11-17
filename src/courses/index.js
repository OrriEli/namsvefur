// Skrá yfir fögin. Nýtt fag: bæta því í scripts/extract-legacy.js (eða skrifa gagnaskrá í höndunum) og skrá það hér.

import hag101g from './hag101g.js';
import hag103g from './hag103g.js';
import hag106g from './hag106g.js';
import hag107g from './hag107g.js';
import hag108g from './hag108g.js';

/** @type {import('../schema.js').Course[]} */
export const COURSES = [hag101g, hag108g, hag107g, hag103g, hag106g];

export const courseById = id => COURSES.find(c => c.id === id) || null;
