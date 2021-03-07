import { html, fixture, expect, nextFrame } from '@open-wc/testing';

import Menu from '../dist/webapp-menu';

const menu5items = `<wam-popup useanimation="false" style="width:100px" open>
    <wam-item></wam-item>
    <wam-item></wam-item>
    <wam-item></wam-item>
    <wam-item></wam-item>
    <wam-item></wam-item>
    </wam-popup>`

describe('Position', () => { 
    it('Full Screen', async ()=> {
        //viewport.set(1000,1000)
        const el = (await fixture(menu5items));
        el.position = Menu.Position.AtPoint(100, 235, 0);
        await nextFrame();
        const rect = el.getBoundingClientRect();
        expect(rect.left).to.equal(50); // 100px - 50px for centering = 50 px
        expect(rect.top).to.equal(235);
    });

    it('inside of a relatively positioned container', async() => {
        const html = await fixture(`<div style="position: relative; left: 100px; top:-100px;">${menu5items}</div>`);
        const menu = html.querySelector('wam-popup');
        menu.position = Menu.Position.AtPoint(100, 235, 0);
        await nextFrame();
        const rect = menu.getBoundingClientRect();
        expect(rect.left).to.equal(50); // 100px - 50 px for centering = 50px
        expect(rect.top).to.equal(235);
    });
});