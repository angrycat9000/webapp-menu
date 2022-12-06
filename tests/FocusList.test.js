import { expect, fixture, html } from "@open-wc/testing";
import '../dist/webapp-menu';

describe("FocusList", () => {
  let menu, list, itemOne, itemTwo, itemThree;
  beforeEach(async () => {
    menu = await fixture(
      html`<wam-menu>
        <wam-item id="one"></wam-item>
        <wam-item id="two"></wam-item>
        <wam-separator></wam-separator>
        <wam-item id="three"></wam-item>
      </wam-menu>`
    );

    list = menu.getInteractiveItems();
    itemOne = menu.querySelector("#one");
    itemTwo = menu.querySelector('#two');
    itemThree = menu.querySelector('#three');
  })

  describe("isDefaultFocus", () => {
    it("defaults to false", () => {
      const element = document.createElement("wam-item");
      expect(element.isDefaultFocus).to.be.false;
    });
  });

  it("first returns first element in list", () => {
    expect(list.first.id).to.equal("one");
  });

  it("does not include separator", async () => {
    const separator = menu.querySelector('wam-separator');
    expect(list.length).to.equal(3);
    const array = Array.from(list);
    expect(array).not.to.include(separator);
  })

  it.skip("focusFirst focuses first element", () => {
    const first = list.first;
    //expect(document.activeElement === first, "document.activeElement === first").to.be.false;

    //list.focusFirst();
    first.focus();

    expect(document.activeElement === first, "document.activeElement === first").to.be.true;
  })

  describe("next", ()=>{
    it(`of middle is last`, async () => {
      list.focusOn(itemTwo);
      expect(list.next).to.equal(itemThree);
    });
  
    it(`of last is first`, async () => {
      list.focusOn(itemThree)
      expect(list.next).to.equal(itemOne);
    });
  })

  describe("previous", ()=>{
    it(`of last is middle`, async () => {
      list.focusOn(itemThree);
      expect(list.previous).to.equal(itemTwo);
    });
  
    it(`of first is last)`, async () => {
      list.focusOn(itemOne)
      expect(list.previous).to.equal(itemThree);
    });
  })




});
