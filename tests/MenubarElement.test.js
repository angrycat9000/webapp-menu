import { expect, fixture, html } from "@open-wc/testing";

import "../dist/webapp-menu";

describe("MenubarElement", () => {
  describe("getInteractiveItems", () => {
    it("return directly nested children", async () => {
      const element = await fixture(
        html`<wam-menubar><wam-menu id="direct"></wam-menu></wam-menubar>`
      );
      const interactiveItems = element.getInteractiveItems();
      expect(interactiveItems.length).to.equal(1);
      expect(interactiveItems._items[0]).equal(element.children[0]);
    });
  });

  it("sets defaultFocus on the first item", async () => {
    const menu = await fixture(
      `<wam-menu><wam-item></wam-item><wam-item></wam-item></wam-menu>`
    );
    const item = menu.firstElementChild;
    expect(item.isDefaultFocus).to.be.true;
  });
});
