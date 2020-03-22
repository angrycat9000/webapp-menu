import { html, fixture, expect, nextFrame } from '@open-wc/testing';

import Menu from '../dist/webapp-menu';

const menu5items = `<wam-popup style="width:100px" open>
    <wam-item></wam-item>
    <wam-item></wam-item>
    <wam-item></wam-item>
    <wam-item></wam-item>
    <wam-item></wam-item>
    </wam-popup>`

describe('Position', () => { 
    it('Full Screen', async ()=> {
        //viewport.set(1000,1000)
        const el = await fixture(menu5items);
        el.open();
        el.position = Menu.Position.AtPoint(100, 235, 0);
        await nextFrame();
        expect(el.style.top).to.equal('235px')
        expect(el.style.left).to.equal('50px'); // -50px because centered
    });
    /*it(`Empty`, async () => {
        //viewport.set(470,470);
        const el = (await fixture(menu5items));
        el.position = Menu.Position.AtPoint(235, 235);
        await nextFrame();
        expect(el.style.top).to.equal('235px')
        expect(el.style.left).to.equal('50px'); // -50px because centered
    });*/
});