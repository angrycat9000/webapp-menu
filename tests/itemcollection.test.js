import { fixture, expect } from '@open-wc/testing';

import '../dist/webapp-menu';


describe('ItemCollection', () => {  
    it(`Empty`, async () => {
        const el = (await fixture(`<wam-popup></wam-popup>`));
        expect(el.items.length).to.be.equal(0);
    });
    it(`Populated`, async () => {
        const el = (await fixture(`<wam-popup><wam-item></wam-item></wam-popup>`));
        expect(el.items.length).to.be.equal(1);
    });
    it(`removeAll()`, async () => {
        const el = (await fixture(`<wam-popup><wam-item></wam-item><wam-item></wam-item></wam-popup>`));
        expect(el.items.length).to.be.equal(2);
        el.items.removeAll();
        expect(el.items.length).to.be.equal(0);
    });
    describe('set()', ()=>{
        it(`with items`, async () => {
            const el = (await fixture(`<wam-popup><wam-item></wam-item><wam-item></wam-item></wam-popup>`));
            expect(el.items.length).to.be.equal(2);
            el.items.set([{label:'Test Value', icon:"alarm"}]);
            expect(el.items.length).to.be.equal(1);
            expect(el.items.atIndex(0).label).to.be.equal('Test Value');
            expect(el.items.atIndex(0).icon).to.be.equal('alarm');
        });
    });
    it('insertBefore(object)', async ()=>{
        const el = (await fixture(`<wam-popup><wam-item></wam-item><wam-item></wam-item></wam-popup>`));
        const e2 = (await fixture('<wam-item id="test"></wam-item>'));
        expect(el.items.length).to.be.equal(2);
        el.items.insertBefore({label:'Test'}, 1);
        expect(el.items.length).to.be.equal(3);
        expect(el.items.atIndex(1).label).to.be.equal('Test');
    });
    it('insertBefore(Item)', async ()=>{
        const el = (await fixture(`<wam-popup><wam-item></wam-item><wam-item></wam-item></wam-popup>`));
        const e2 = (await fixture('<wam-item id="test"></wam-item>'));
        expect(el.items.length).to.be.equal(2);
        el.items.insertBefore(e2, 1);
        expect(el.items.length).to.be.equal(3);
        expect(el.items.atIndex(1)).dom.to.equal('<wam-item id="test"></wam-item>');
    });
    it('append()', async ()=>{
        const el = (await fixture(`<wam-popup><wam-item></wam-item><wam-item></wam-item></wam-popup>`));
        expect(el.items.length).to.be.equal(2);
        el.items.append({label:'Test'});
        expect(el.items.length).to.be.equal(3);
        expect(el.items.atIndex(2).label).to.be.equal('Test');
    });
});