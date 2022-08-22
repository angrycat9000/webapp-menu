import { fixture, expect } from '@open-wc/testing';

import '../dist/webapp-menu';


describe('FocusList', () => {  
    it(`next`, async () => {
        const el = (await fixture(`
          <wam-popup>
            <wam-item id="one"></wam-item>
            <wam-item id="two"></wam-item>
            <wam-item id="three"></wam-item>
          </wam-popup>`));
        const tabList = el.displayItems;
        const two = el.querySelector('#two');
        const three = el.querySelector('#three');
        expect(tabList.next(two)).to.equal(three);
    });
    it(`next(last)`, async () => {
      const el = (await fixture(`
        <wam-popup>
          <wam-item id="one"></wam-item>
          <wam-item id="two"></wam-item>
          <wam-item id="three"></wam-item>
        </wam-popup>`));
      const tabList = el.displayItems;
      const one = el.querySelector('#one');
      const three = el.querySelector('#three');
      expect(tabList.next(three)).to.equal(one);
  });
    it(`previous`, async () => {
      const el = (await fixture(`
        <wam-popup>
          <wam-item id="one"></wam-item>
          <wam-item id="two"></wam-item>
          <wam-item id="three"></wam-item>
        </wam-popup>`));
      const tabList = el.displayItems;
      const two = el.querySelector('#two');
      const three = el.querySelector('#three');
      expect(tabList.previous(three)).to.equal(two);
  });

  it(`previous(first)`, async () => {
    const el = (await fixture(`
      <wam-popup>
        <wam-item id="one"></wam-item>
        <wam-item id="two"></wam-item>
        <wam-item id="three"></wam-item>
      </wam-popup>`));
    const tabList = el.displayItems;
    const one = el.querySelector('#one');
    const three = el.querySelector('#three');
    expect(tabList.previous(one)).to.equal(three);
});
});