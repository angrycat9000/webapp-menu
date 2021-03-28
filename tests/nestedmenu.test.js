import { fixture, expect, nextFrame } from '@open-wc/testing';

import '../dist/webapp-menu';

const menu = 
  `<wam-nestedmenu useanimation="false" static>
    <wam-submenu id="smaller" label="small">
      <wam-item label="a"></wam-item>
    </wam-submenu>
    <wam-submenu id="bigger" label="large">
      <wam-item label="b"></wam-item>
      <wam-item label="c"></wam-item>
      <wam-item label="d"></wam-item>
      <wam-item label="e"></wam-item>
      <wam-item label="f"></wam-item>
    </wam-submenu>
    <wam-item label="filler"><wam-item>
  </wam-nestedmenu>`;


const itemHeight = 48;
const border = 2;
function sizeOfItems(n) {return n * itemHeight + border}

describe('NestedMenu', () => {  
  describe('autoresize attribute', ()=>{ 
    it('default', async () => {
        const el = (await fixture(`<wam-nestedmenu></wam-nestedmenu>`));
        expect(el.autoResize).to.be.true;
    });
    it('attribute=true', async () => {
      const el = (await fixture(`<wam-nestedmenu autoresize="true"></wam-nestedmenu>`));
      expect(el.autoResize).to.be.true;
    });
    it('attribute=false', async () => {
      const el = (await fixture(`<wam-nestedmenu autoresize="false"></wam-nestedmenu>`));
      expect(el.autoResize).to.be.false;
    });
    it('property=true', async () => {
      const el = (await fixture(`<wam-nestedmenu autoresize="false"></wam-nestedmenu>`));
      el.autoResize = true;
      expect(el.autoResize).to.be.true;
      expect(el).dom.to.equal('<wam-nestedmenu autoresize="true"></wam-nestedmenu>');
    });
    it('property=false', async () => {
      const el = (await fixture(`<wam-nestedmenu autoresize="true"></wam-nestedmenu>`));
      el.autoResize = false;
      expect(el.autoResize).to.be.false;
      expect(el).dom.to.equal('<wam-nestedmenu autoresize="false"></wam-nestedmenu>');
    });
  })
  describe('Resizing', ()=>{
    it('small to large', async ()=>{
      const el = (await fixture(menu));

    
      expect(el.clientHeight).to.equal(sizeOfItems(el.displayItems.length));

      const child = el.querySelector('#bigger');
      await new Promise((resolve)=>{el.openChild(child).on('complete', resolve);})
      await nextFrame();
      
      expect(el.clientHeight).to.equal(sizeOfItems(child.displayItems.length))
    })
    it('large to small', async ()=>{
      const el = (await fixture(menu));


      expect(el.clientHeight).to.equal(sizeOfItems(el.displayItems.length));

      const child = el.querySelector('#smaller');
      await new Promise((resolve)=>{el.openChild(child).on('complete', resolve);})
      await nextFrame();
     
      expect(el.clientHeight).to.equal(sizeOfItems(child.displayItems.length))
    })
  })
  it("topMenu", async()=> {
    const menu = await fixture(`
      <wam-nestedmenu>
        <wam-submenu> 
          <wam-submenu id="inner"></wam-submenu>
        </wam-submenu>
      </wam-nestedmenu>`);
    const inner = menu.querySelector('#inner');
    expect(inner.topMenu).to.be.equal(menu);
  });
})