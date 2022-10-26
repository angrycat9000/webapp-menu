import { fixture, expect } from '@open-wc/testing';
import '../dist/webapp-menu';

describe('CheckboxItem/element', () => {
  describe('checked', () => {
    it('initializes to false', async () => {
      const el = await fixture('<wam-checkbox-item></wam-checkbox-item>');
      expect(el.checked).to.be.false;
    })
    it('set from attribute', async () => {
      const el = await fixture('<wam-checkbox-item checked></wam-checkbox-item>');
      expect(el.checked).to.be.true;
    })
    it('set from property', async () => {
      const el = await fixture('<wam-checkbox-item></wam-checkbox-item>');
      el.checked = true
      expect(el.checked).to.be.true;
      expect(el).dom.to.equal('<wam-checkbox-item checked></wam-checkbox-item>');
    })
    it('sets aria-checked', async () => {
      const el = await fixture('<wam-checkbox-item checked></wam-checkbox-item>');
      const button = el.shadowRoot.querySelector('[role=menuitemcheckbox]');
      expect(button.getAttribute('aria-checked')).to.equal("true");
    })
    it('clears aria-checked', async () => {
      const el = await fixture('<wam-checkbox-item checked></wam-checkbox-item>');
      el.checked = false;
      const button = el.shadowRoot.querySelector('[role=menuitemcheckbox]');
      expect(button.getAttribute('aria-checked')).to.equal("false");
    })
  })

  describe("interaction", ()=>{
    let element, internalItem, changeFired, valueOnChange;

    beforeEach(async()=>{
      changeFired = false;
      valueOnChange = undefined;
      element = await fixture('<wam-checkbox-item></wam-checkbox-item>');
      internalItem = element.shadowRoot.querySelector('[role=menuitemcheckbox]');
      element.addEventListener('change', (event) => {
        changeFired = true;
        valueOnChange = event.target.checked;
      })
    })

    describe("when spacebar is pressed", ()=>{
      const spacePressedEvent = new KeyboardEvent("keydown", {
        key: " ",
        code: 32,
        bubbles: true,
      })

      it("dispatches change event with new value", async () => {
        internalItem.dispatchEvent(spacePressedEvent);
    
        expect(changeFired).to.be.true;
        expect(valueOnChange).to.be.true;
      })

      it("does not dispatch change or change value when disabled",  ()=>{
        element.disabled = true;
        internalItem.dispatchEvent(spacePressedEvent);

        expect(changeFired).to.be.false;
        expect(element.checked).to.be.false;
      })
    })

    describe("when clicked", ()=>{
      const clickEvent = new CustomEvent("click");

      it("dispatches changed event with new value", async() =>{
        internalItem.dispatchEvent(clickEvent);
    
        expect(changeFired).to.be.true;
        expect(valueOnChange).to.be.true;
      })

      it("does not dispatch event or change value when disabled",()=>{
        element.disabled = true;
        internalItem.dispatchEvent(clickEvent);

        expect(changeFired).to.be.false;
        expect(element.checked).to.be.false;
      })
  
      it("does not close menu", async ()=>{
        const menu = await fixture(`<wam-menu open><wam-checkbox-item></wam-checkbox-item></wam-menu>`);
        const check = menu.firstElementChild;

        check.click();

        expect(menu.isOpen).to.be.true;
      })
    })
   
  })



 



})