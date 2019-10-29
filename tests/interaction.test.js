import { html, fixture, expect} from '@open-wc/testing';

import Menu from '../dist/webapp-menu';


describe('Interaction', () => {  
    it(`wam-activate is fired`, async () => {
        const el = (await fixture(`<wam-popup open><wam-item></wam-item></wam-popup>`));
        const item = el.firstElementChild;
        let fired = false;
        item.addEventListener('wam-item-activate', (e)=>{fired=true});

        var evObj = document.createEvent('Events');
        evObj.initEvent('click', true, false);
        item.dispatchEvent(evObj);

        expect(fired).to.be.true;
    });
    it(`Close after activate`, async () => {
        const el = (await fixture(`<wam-popup open><wam-item></wam-item></wam-popup>`));
        const item = el.firstElementChild;

        var evObj = document.createEvent('Events');
        evObj.initEvent('click', true, false);
        item.dispatchEvent(evObj);

        expect(el.isOpen).to.be.false;
    });
    it(`Open after wam-activate + preventDefault()`, async () => {
        const el = (await fixture(`<wam-popup open><wam-item></wam-item></wam-popup>`));
        const item = el.firstElementChild;
        item.addEventListener('wam-item-activate', (e)=>e.preventDefault());

        var evObj = document.createEvent('Events');
        evObj.initEvent('click', true, false);
        item.dispatchEvent(evObj);

        expect(el.isOpen).to.be.true;
    });
    it(`Disabled item does not activate`, async () => {
        const el = (await fixture(`<wam-popup open><wam-item disabled></wam-item></wam-popup>`));
        const item = el.firstElementChild;
        let fired = false;
        item.addEventListener('wam-item-activate', (e)=>{fired=true});

        var evObj = document.createEvent('Events');
        evObj.initEvent('click', true, false);
        item.dispatchEvent(evObj);

        expect(fired).to.be.false;
    });

});