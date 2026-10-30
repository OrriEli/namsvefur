// Sameiginlegt fyrir prófanirnar: gömlu síðurnar, nýju fögin og talnablokk úttektarinnar.

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { loadLegacy } from '../scripts/lib/load-legacy.js';
import { META } from '../scripts/extract-legacy.js';
import { COURSES } from '../src/courses/index.js';

export const ROOT = join(import.meta.dirname, '..');

const legacyCache = {};
export const legacy = id => legacyCache[id] || (legacyCache[id] = loadLegacy(join(ROOT, 'legacy', META[id].file)));

export const courses = COURSES;

export function inventoryCounts() {
  const md = readFileSync(join(ROOT, 'docs', 'legacy-inventory.md'), 'utf8');
  const m = md.match(/<!-- inventory:counts:begin -->\n```json\n([\s\S]*?)\n```\n<!-- inventory:counts:end -->/);
  return JSON.parse(m[1]);
}

// Bil á milli merkja skipta ekki máli í HTML.
export const squash = html => html.replace(/>\s+</g, '><').trim();
