// Gamlar slóðir haldast: bókamerki og tenglar í #/villur, #/vikan, #/bladin og #/blodin vísa á nýju staðina.

/** Gamlar slóðir → nýju staðirnir. Skilar nýrri slóð eða null. */
export function redirect(hash) {
  const [path, qs] = hash.replace(/^#\/?/, '').split('?');
  const p = path.split('/').filter(Boolean)[0];
  if (p === 'villur' || p === 'vikan') return `#/framvinda/${p}`;
  if (p === 'bladin' || p === 'blodin') { const q = new URLSearchParams(qs || '').get('q'); return q ? `#/fog?q=${encodeURIComponent(q)}` : '#/fog'; }
  return null;
}
