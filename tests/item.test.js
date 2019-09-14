import { html, fixture, expect } from '@open-wc/testing';

import Menu from '../dist/webapp-menu';


describe('Item', () => {  
    it(`Default Label`, async () => {
        const el = (await fixture(`<wam-item></wam-item>`));
        expect(el.label).to.be.equal('!? Missing Label !?');
    });
    it('<label="Test">', async () => {
        const el = (await fixture(`<wam-item label="Test"></wam-item>`));
        expect(el.label).to.be.equal('Test');
        
    });
    it('item.label="Test"', async () => {
        const el = (await fixture(`<wam-item></wam-item>`));
        el.label = 'Test';
        expect(el.label).to.be.equal('Test');
        expect(el).dom.to.equal(`<wam-item label="Test"></wam-item>`);
    });
    it('label in slot', async () => {
        const el = (await fixture(`<wam-item><span slot="label">Test</span></wam-item>`));
        expect(el.label).to.equal('Test');
    });
    describe('showToolbarLabel', ()=>{
        it('init to false', async ()=>{
            const el = (await fixture(`<wam-item></wam-item>`));
            expect(el.showToolbarLabel).to.be.false;
        });
        it('attribute set', async ()=>{
            const el = (await fixture(`<wam-item showtoolbarlabel></wam-item>`));
            expect(el.showToolbarLabel).to.be.true;
        });
        it('property set', async ()=>{
            const el = (await fixture(`<wam-item></wam-item>`));
            el.showToolbarLabel = true;
            expect(el).dom.to.equal(`<wam-item showtoolbarlabel></wam-item>`);
        });
    });
    describe('icon', ()=>{
        it('hasIcon()', async()=>{
            const el = (await fixture(`<wam-item></wam-item>`));
            expect(el.hasIcon).to.be.false;
        })
        it('hasIcon()', async()=>{
            const el = (await fixture(`<wam-item><img slot="icon"></wam-item>`));
            expect(el.hasIcon).to.be.true;
        })
    })
});