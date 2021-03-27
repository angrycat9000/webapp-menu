import { fixture, expect, nextFrame } from '@open-wc/testing';

import Wam from '../dist/webapp-menu';

describe('Menu', () => {  
    describe('isOpen', ()=> {
        it(`initialize to false for <wam-popup>`, async () => {
            const el = (await fixture(`<wam-popup popup></wam-popup`));
            expect(el.isOpen).to.be.false;
        });
        it(`initialize to true for <wam-popup static>`, async () => {
            const el = (await fixture(`<wam-popup static></wam-popup`));
            expect(el.isOpen).to.be.true;
        });

        it(`initialize to false for <wam-toolbar>`, async () => {
            const el = (await fixture(`<wam-toolbar></wam-toolbar`));
            expect(el.isOpen).to.be.false;
        });
        it(`initialize to true for <wam-toolbar static>`, async () => {
            const el = (await fixture(`<wam-toolbar static></wam-toolbar`));
            expect(el.isOpen).to.be.true
        });
        it(`open()`, async () => {
            const el = (await fixture(`<wam-popup></wam-popup`));
            expect(el.isOpen, 'closed before open()').to.be.false;
            el.open();
            expect(el.isOpen, 'open after open()').to.be.true;
        });
        it(`close()`, async () => {
            const el = (await fixture(`<wam-popup></wam-popup`));
            el.open();
            expect(el.isOpen, 'open after open()').to.be.true;
            el.close();
            expect(el.isOpen, 'closed after close()').to.be.false;
        });
        it(`close() ignored on static popup`, async () => {
            const el = (await fixture(`<wam-popup static></wam-popup`));
            el.open();
            el.close();
            expect(el.isOpen).to.be.true;
        });
        it('close() ignored on toolbar', async() => {
            const el = await fixture(`<wam-toolbar static></wam-toolbar`);
            el.close();
            expect(el.isOpen).to.be.true;
        });
        it('open rejects if already open', async() => {
            const el = await fixture(`<wam-toolbar></wam-toolbar`);
            await el.open();
            let rejected = false;
            await el.open().catch(() => rejected = true);
            return expect(rejected).to.be.true;
        });
        it('open resolves with menu', async() => {
            const el = await fixture(`<wam-popup></wam-popup`);
            const result = await el.open();
            return expect(result).to.equal(el);
        });
    });
    describe('controlled-by',()=>{
        it('initalize to null', async ()=>{
            const el = (await fixture(`<wam-popup></wam-popup>`));
            expect(el.controlledBy).to.be.null;
        })
        it('set attribute', async ()=>{
            const el = (await fixture(`<div><button id="b"></button><wam-popup controlled-by="b"></wam-popup></div>`));
            const b = el.firstElementChild;
            const p = el.lastElementChild;
            expect(p.controlledBy).to.be.equal(b);
        })
        it('set property', async ()=>{
            const el = (await fixture(`<div><button id="b"></button><wam-popup></wam-popup></div>`));
            const b = el.firstElementChild;
            const p = el.lastElementChild;
            p.controlledBy = b;
            expect(p.controlledBy).to.be.equal(b);
            expect(b).dom.to.equal(`<button id="b" aria-haspopup="true" aria-controls="${p.id}" aria-expanded="${p.isOpen}"></button>`)
        })
        it('set property to null', async()=>{
            const el = (await fixture(`<div><button id="b"></button><wam-popup controlled-by="b"></wam-popup></div>`));
            const b = el.firstElementChild;
            const p = el.lastElementChild;
            expect(p.controlledBy).to.be.equal(b);
            p.controlledBy = null;
            expect(p).dom.to.equal('<wam-popup></wam-popup>' , {ignoreAttributes: ['id', 'style']});
            expect(b).dom.to.equal('<button id="b"></button>');
        })
        it('Hook button on add', async()=>{
            const el = (await fixture(`<div><button id="b"></button><wam-popup></wam-popup></div>`));
            const button = el.firstElementChild;
            const popup = el.lastElementChild;
            el.removeChild(popup);
            popup.controlledBy = button;
            el.appendChild(popup);
            expect(b).dom.to.equal(`<button id="b" aria-haspopup="true" aria-controls="${popup.id}" aria-expanded="${popup.isOpen}"></button>`)
        })
        it('Cleanup button on remove', async()=>{
            const el = (await fixture(`<div><button id="b"></button><wam-popup controlled-by="b"></wam-popup></div>`));
            const button = el.firstElementChild;
            const popup = el.lastElementChild;
            el.removeChild(popup);
            expect(button).dom.to.equal(`<button id="b"></button>`)
        })
    })
    describe('useAnimation', ()=>{
        it('initalize to true', async ()=>{
            const el = (await fixture(`<wam-popup></wam-popup`));
            expect(el.useAnimation).to.be.true;
        })
        it('property=false', async ()=>{
            const el = (await fixture(`<wam-popup></wam-popup`));
            el.useAnimation = false;
            expect(el.useAnimation).to.be.false;
        })
    }),
    it('Wam.fromElement', async()=>{
        const el = (await fixture(`<wam-popup><wam-item></wam-item></wam-popup`));
        const item = el.firstElementChild;
        const menu = Wam.Popup.fromElement(item);
        expect(el).to.equal(menu);
    })
    it('Separator is not interactive', async()=>{
        const el = (await fixture(`<wam-popup><wam-separator></wam-separator><wam-item></wam-item></wam-popup`));
        expect(el.items.length).to.equal(2);
        expect(el.interactiveItems.length).to.equal(1);
    });

    it('focuses on open', async ()=>{
        const el = (await fixture(`<wam-popup><wam-item></wam-item></wam-popup>`));
        const item = el.firstElementChild;
        el.useAnimation = false;
        el.open();
        await nextFrame();
        expect(document.activeElement === item, 'document.activeElement').to.be.true;
        expect(el.getFocused() === item, 'getFocused()').to.be.true;
    });

    it('sets defaultFocus on the first item', async() => {
        const menu = await fixture(`<wam-toolbar><wam-item></wam-item><wam-item></wam-item></wam-toolbar>`);
        await nextFrame();
        const item = menu.firstElementChild;
        const shadowButton = item.shadowRoot.querySelector('button');
        expect(shadowButton.getAttribute('tabindex')).to.equal("0");
    })
});