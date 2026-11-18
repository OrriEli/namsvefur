// Gamlar slóðir mega ekki brotna: þær vísa á nýju staðina (áfangi 2 í endurhönnuninni).

import { describe, it, expect } from 'vitest';
import { redirect } from '../src/routes.js';

describe('gamlar slóðir', () => {
  it('#/villur og #/vikan → Framvinda við réttan hluta', () => {
    expect(redirect('#/villur')).toBe('#/framvinda/villur');
    expect(redirect('#/vikan')).toBe('#/framvinda/vikan');
  });
  it('#/bladin og #/blodin → leit á Fögum, leitarorðið fylgir', () => {
    expect(redirect('#/bladin')).toBe('#/fog');
    expect(redirect('#/blodin')).toBe('#/fog');
    expect(redirect('#/bladin?q=n%C3%BAvir%C3%B0i')).toBe('#/fog?q=n%C3%BAvir%C3%B0i');
    expect(redirect('#/blodin?q=Hessian')).toBe('#/fog?q=Hessian');
  });
  it('aðrar slóðir haldast, líka #/upprifjun', () => {
    for (const h of ['#/upprifjun', '#/idag', '', '#/fog?q=x', '#/fag/hag108g/prof', '#/framvinda/vikan', '#/stillingar']) expect(redirect(h)).toBe(null);
  });
});
