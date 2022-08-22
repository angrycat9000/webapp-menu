import { fixture, expect, nextFrame } from '@open-wc/testing';

import Wam from '../dist/webapp-menu';

describe.skip('Item', () => {  
    describe('label', ()=> {
        it('Default label undefined', async () => {
            const el = (await fixture(`<wam-item></wam-item>`));
            expect(el.label).to.be.undefined;
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
        it('setting label removes slot content', async () => {
            const el = await fixture(`<wam-item><span slot="label">Test</span></wam-item>`);
            el.label="New";
            expect(el).lightDom.to.equal("");
        })
    })
    describe('showLabel', ()=>{
        it('init to false', async ()=>{
            const el = (await fixture(`<wam-item></wam-item>`));
            expect(el.showLabel).to.be.false;
        });
        it('attribute set', async ()=>{
            const el = (await fixture(`<wam-item show-label></wam-item>`));
            expect(el.showLabel).to.be.true;
        });
        it('property set', async ()=>{
            const el = (await fixture(`<wam-item></wam-item>`));
            el.showLabel = true;
            expect(el).dom.to.equal(`<wam-item show-label="true"></wam-item>`);
        });
    });
    describe('icon', ()=>{
        it('no icon', async()=>{
            const el = (await fixture(`<wam-item></wam-item>`));
            expect(el.hasIcon).to.be.false;
        })
        it('with icon', async()=>{
            const el = (await fixture(`<wam-item><img slot="icon"></wam-item>`));
            expect(el.hasIcon).to.be.true;
        })
        it('setting a non empty string replaces slot content', async () => {
            const toolbar = await fixture('<wam-toolbar><wam-item><img id="previous" slot="icon"></wam-item></wam-toolbar>');
            const item = toolbar.querySelector('wam-item');
            const oldIcon = item.querySelector('[slot=icon]');
            item.icon = 'icon-name';
            const newIcon = item.querySelector('[slot=icon]');
            expect(oldIcon).not.to.equal(newIcon);
        })
        it('setting to string renders factory icon', async() => {
            const toolbar = await fixture('<wam-toolbar><wam-item><img id="previous" slot="icon"></wam-item></wam-toolbar>');
            toolbar.iconFactory = Wam.IconFactory.imageSrc;
            const item = toolbar.querySelector('wam-item');
            item.icon = 'trash.png';
            expect(item).lightDom.to.equal('<img src="trash.png" slot="icon" data-factory-icon>')
        })
    })
    describe('disabled item focusable', async ()=>{
        const el = (await fixture(`<wam-item disabled></wam-item>`));
        el.focus();
        await nextFrame();

        expect(document.activeElement).to.be.equal(el);
    })
});