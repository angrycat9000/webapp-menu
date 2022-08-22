import { expect, fixture, html } from "@open-wc/testing";

describe("MenuElement", ()=>{
  describe("isDefaultFocus", () => {
    it("defaults to false", () => {
      const element = document.createElement("wam-menu");
      expect(element.isDefaultFocus).to.be.false;
    });

    it("can be set true by property", () => {
      const element = document.createElement("wam-menu");
      element.isDefaultFocus = true;
      expect(element.isDefaultFocus).to.be.true;
    });

    it("can be set by attribute", async () => {
      const element = await fixture(
        html`<wam-menu is-default-focus></wam-menu>`
      );
      expect(element.isDefaultFocus).to.be.true;
    });

    it("setting property to true adds attribute", () => {
      const element = document.createElement("wam-menu");
      element.isDefaultFocus = true;
      expect(element.getAttribute("is-default-focus")).to.equal("");
    });

    it("setting property to false removes the attribute", async () => {
      const element = await fixture(
        html`<wam-menu is-default-focus></wam-menu>`
      );
      element.isDefaultFocus = false;
      expect(element.hasAttribute("is-default-focus")).to.be.false;
    });

    it("true sets _item.tabindex to 0", async () => {
      const element = await fixture(
        html`<wam-menu is-default-focus></wam-menu>`
      );
      expect(element._item.getAttribute("tabindex")).to.equal("0");
    });

    it("false sets _item.tabindex to -1", async () => {
      const element = await fixture(html`<wam-menu></wam-menu>`);
      expect(element._item.getAttribute("tabindex")).to.equal("-1");
    });
  });
})