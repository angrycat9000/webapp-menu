import { fixture, expect, nextFrame } from '@open-wc/testing';
import '../dist/webapp-menu';

describe('CheckItem', ()=> {
  describe('checked', ()=> {
    it('initializes to false', async() => {
      const el = await fixture('<wam-check-item></wam-check-item>');
      expect(el.checked).to.be.false;
    })
    it('set from attribute', async() => {
      const el = await fixture('<wam-check-item checked></wam-check-item>');
      expect(el.checked).to.be.true;
    })
    it('set from property', async() => {
      const el = await fixture('<wam-check-item></wam-check-item>');
      el.checked = true
      expect(el.checked).to.be.true;
      expect(el).dom.to.equal('<wam-check-item checked></wam-check-item>');
    })
    it('sets aria-checked', async() => {
      const el = await fixture('<wam-check-item checked></wam-check-item>');
      const button = el.shadowRoot.querySelector('button');
      expect(button.getAttribute('aria-checked')).to.equal("true");
    })
    it('clears aria-checked', async() => {
      const el = await fixture('<wam-check-item checked></wam-check-item>');
      el.checked = false;
      const button = el.shadowRoot.querySelector('button');
      expect(button.getAttribute('aria-checked')).to.equal("false");
    })
  })
})