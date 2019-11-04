import { html, fixture, expect } from '@open-wc/testing';

import Menu from '../dist/webapp-menu';


describe('Menu', () => {  
    describe('open', ()=> {
        it(`<open>`, async () => {
            const el = (await fixture(`<wam-popup open></wam-popup`));
            expect(el.isOpen).to.be.true;
        });
        it(`initialize to false`, async () => {
            const el = (await fixture(`<wam-popup></wam-popup`));
            expect(el.isOpen).to.be.false;
        });
        it(`open()`, async () => {
            const el = (await fixture(`<wam-popup></wam-popup`));
            expect(el.isOpen).to.be.false;
            el.open();
            expect(el.isOpen).to.be.true;
        });
        it(`menu.isOpen = true`, async () => {
            const el = (await fixture(`<wam-popup></wam-popup`));
            expect(el.isOpen).to.be.false;
            el.isOpen = true;
            expect(el.isOpen).to.be.true;
            expect(el).dom.to.equal('<wam-popup open></wam-popup>');
        });
        it(`close()`, async () => {
            const el = (await fixture(`<wam-popup open></wam-popup`));
            el.close();
            expect(el.isOpen).to.be.false;
        });
    });
    describe('controlledBy',()=>{
        it('initalize to null', async ()=>{
            const el = (await fixture(`<wam-popup></wam-popup>`));
            expect(el.controlledBy).to.be.null;
        })
        it('set attribute', async ()=>{
            const el = (await fixture(`<div><button id="b"></button><wam-popup controlledBy="b"></wam-popup></div>`));
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
            const el = (await fixture(`<div><button id="b"></button><wam-popup controlledBy="b"></wam-popup></div>`));
            const b = el.firstElementChild;
            const p = el.lastElementChild;
            expect(p.controlledBy).to.be.equal(b);
            p.controlledBy = null;
            expect(p).dom.to.equal('<wam-popup></wam-popup>' , {ignoreAttributes: ['id']});
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
            const el = (await fixture(`<div><button id="b"></button><wam-popup controlledby="b"></wam-popup></div>`));
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
        it('attribute=false', async ()=>{
            const el = (await fixture(`<wam-popup useanimation="false"></wam-popup`));
            expect(el.useAnimation).to.be.false;
        })
        it('property=false', async ()=>{
            const el = (await fixture(`<wam-popup></wam-popup`));
            el.useAnimation = false;
            expect(el.useAnimation).to.be.false;
            expect(el).dom.to.equal(`<wam-popup useanimation="false"></wam-popup`);
        })
    }),
    describe('closeOn', ()=>{
        it('intialize to true', async()=>{
            const el = (await fixture(`<wam-popup></wam-popup`));
            expect(el.closeOn.escape).to.be.true;
            expect(el.closeOn.pointerDownOutside).to.be.true;
            expect(el.closeOn.itemActivate).to.be.true;
        });
        it('set attribute = none', async()=>{
            const el = (await fixture(`<wam-popup closeon="none"></wam-popup`));
            expect(el.closeOn.escape).to.be.false;
            expect(el.closeOn.pointerDownOutside).to.be.false;
            expect(el.closeOn.itemActivate).to.be.false;
        });
        it('none()', async()=>{
            const el = (await fixture(`<wam-popup></wam-popup`));
            el.closeOn.none();
            expect(el.closeOn.escape).to.be.false;
            expect(el.closeOn.pointerDownOutside).to.be.false;
            expect(el.closeOn.itemActivate).to.be.false;
        });
    })
    it('Menu.fromElement', async()=>{
        const el = (await fixture(`<wam-popup><wam-item></wam-item></wam-popup`));
        const item = el.firstElementChild;
        const menu = Menu.Menu.fromElement(item);
        expect(el).to.equal(menu);
    })
});