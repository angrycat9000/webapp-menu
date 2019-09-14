import { html, fixture, expect } from '@open-wc/testing';

import Menu from '../dist/webapp-menu';


describe('Register Custom Elements', () => {  
  for(let e of  ['Toolbar', 'Popup','Item','NestedMenu']) {
    const t = Menu[e];
    if(t.tagName) {
      it(`Register <${t.tagName}>`, async () => {
        const el = (await fixture(`<${t.tagName}></${t.tagName}>`));
        expect(el).to.be.an.instanceof(t);
      });
    }
  }
});