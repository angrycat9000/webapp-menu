import {fixture, expect, nextFrame} from '@open-wc/testing';

import '../dist/webapp-menu';

describe('Interaction', () => {  
    it(`wam-activate is fired once on click`, async () => {
        const el = (await fixture(`<wam-popup open><wam-item></wam-item></wam-popup>`));
        const item = el.firstElementChild;
        let fired = 0;
        item.addEventListener('wam-item-activate', (e)=>{fired++});

        var evObj = new MouseEvent("click", {
            bubbles: true,
            cancelable: true,
            view: window
          });
        item.dispatchEvent(evObj);

        expect(fired).to.be.equal(1);
    });
    it('wam-activate uses click to activate not keypress', async ()=> {
        const el = (await fixture(`<wam-popup open><wam-item></wam-item></wam-popup>`));
        const item = el.firstElementChild;
        let fired = 0;
        item.addEventListener('wam-item-activate', (e)=>{fired++});

        await nextFrame(); // wait for focus to settle

        const eventDown = new KeyboardEvent('keydown', {key: ' ', code: 32, bubbles:true});
        const eventUp = new KeyboardEvent('keyup', {key: ' ', code:32, bubbles:true});
        const eventPress = new KeyboardEvent('keypress', {key: ' ', code:32, bubbles:true});
        item.dispatchEvent(eventDown);
        item.dispatchEvent(eventUp);
        item.dispatchEvent(eventPress);
        expect(fired).to.be.equal(0);
    })
    it(`Close after activate`, async () => {
        const el = (await fixture(`<wam-popup open><wam-item></wam-item></wam-popup>`));
        const item = el.firstElementChild;

        var evObj = document.createEvent('Events');
        evObj.initEvent('keypress', true, false);
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
    it(`Separator does not activate`, async () => {
        const el = (await fixture(`<wam-popup open><wam-separator></wam-separator></wam-popup>`));
        const item = el.firstElementChild;
        let fired = false;
        item.addEventListener('wam-item-activate', (e)=>{fired=true});

        var evObj = document.createEvent('Events');
        evObj.initEvent('click', true, false);
        item.dispatchEvent(evObj);

        expect(fired).to.be.false;
    });

    it('controlledBy opens on click', async ()=>{
        const el = (await fixture(`
            <div>
                <wam-popup controlledBy="mine"><wam-item></wam-item></wam-popup>
                <button id="mine"></button>
            </div>`));
        const menu = el.children[0];
        const button = el.children[1];

        var evObj = new MouseEvent('click', {});
        button.dispatchEvent(evObj);

        expect(menu.isOpen).to.be.true;
    })
});