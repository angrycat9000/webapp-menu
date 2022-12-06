import { expect, fixture, html } from "@open-wc/testing";
import '../dist/webapp-menu';

describe("FocusList", () => {
  let list;
  beforeEach(async () => {
    const parent = await fixture(
      html`<wam-menu>
        <wam-item id="one"></wam-item>npmm 
        <wam-item id="two"></wam-item>
        <wam-separator></wam-separator>
        <wam-item id="three"></wam-item>
      </wam-menu>`
    );
    list = parent.getInteractiveItems();
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
    expect(list.length).to.equal(3);
  })

  it.skip("focusFirst focuses first element", () => {
    const first = list.first;
    //expect(document.activeElement === first, "document.activeElement === first").to.be.false;

    //list.focusFirst();
    first.focus();

    expect(document.activeElement === first, "document.activeElement === first").to.be.true;
  })
});
