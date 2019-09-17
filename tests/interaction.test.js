import { html, fixture, expect } from '@open-wc/testing';

import Menu from '../dist/webapp-menu';


describe('Interaction', () => {  
    it(`Close after activate`, async () => {
        const el = (await fixture(`<wam-popup open><wam-item></wam-item></wam-popup>`));
        const item = el.firstElementChild;

        var evObj = document.createEvent('Events');
        evObj.initEvent('click', true, false);
        item.dispatchEvent(evObj);

        expect(el.isOpen).to.be.false;
    });
    it(`wam-item-activate preventDefault()`, async () => {
        const el = (await fixture(`<wam-popup open><wam-item></wam-item></wam-popup>`));
        const item = el.firstElementChild;
        item.addEventListener('wam-item-activate', (e)=>e.preventDefault());

        var evObj = document.createEvent('Events');
        evObj.initEvent('click', true, false);
        item.dispatchEvent(evObj);

        expect(el.isOpen).to.be.true;
    });

});