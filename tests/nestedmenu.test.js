import { html, fixture, expect, nextFrame } from '@open-wc/testing';

import Menu from '../dist/webapp-menu';


describe('NestedMenu', () => {  
  describe('autoresize attribute', ()=>{ 
    it('default', async () => {
        const el = (await fixture(`<wam-nestedmenu></wam-nestedmenu>`));
        expect(el.autoResize).to.be.true;
    });
    it('attribute=true', async () => {
      const el = (await fixture(`<wam-nestedmenu autoresize="true"></wam-nestedmenu>`));
      expect(el.autoResize).to.be.true;
    });
    it('attribute=false', async () => {
      const el = (await fixture(`<wam-nestedmenu autoresize="false"></wam-nestedmenu>`));
      expect(el.autoResize).to.be.false;
    });
    it('property=true', async () => {
      const el = (await fixture(`<wam-nestedmenu autoresize="false"></wam-nestedmenu>`));
      el.autoResize = true;
      expect(el.autoResize).to.be.true;
      expect(el).dom.to.equal('<wam-nestedmenu autoresize="true"></wam-nestedmenu>');
    });
    it('property=false', async () => {
      const el = (await fixture(`<wam-nestedmenu autoresize="true"></wam-nestedmenu>`));
      el.autoResize = false;
      expect(el.autoResize).to.be.false;
      expect(el).dom.to.equal('<wam-nestedmenu autoresize="false"></wam-nestedmenu>');
    });
  })
})