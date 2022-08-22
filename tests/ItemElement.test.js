import { expect, fixture, html } from "@open-wc/testing";

describe("ItemElement", () => {
  describe("isDefaultFocus", () => {
    it("defaults to false", () => {
      const element = document.createElement("wam-item");
      expect(element.isDefaultFocus).to.be.false;
    });

    it("can be set true by property", () => {
      const element = document.createElement("wam-item");
      element.isDefaultFocus = true;
      expect(element.isDefaultFocus).to.be.true;
    });

    it("can be set by attribute", async () => {
      const element = await fixture(
        html`<wam-item is-default-focus></wam-item>`
      );
      expect(element.isDefaultFocus).to.be.true;
    });

    it("setting property to true adds attribute", () => {
      const element = document.createElement("wam-item");
      element.isDefaultFocus = true;
      expect(element.getAttribute("is-default-focus")).to.equal("");
    });

    it("setting property to false removes the attribute", async () => {
      const element = await fixture(
        html`<wam-item is-default-focus></wam-item>`
      );
      element.isDefaultFocus = false;
      expect(element.hasAttribute("is-default-focus")).to.be.false;
    });

    it("true sets _item.tabindex to 0", async () => {
      const element = await fixture(
        html`<wam-item is-default-focus></wam-item>`
      );
      expect(element._item.getAttribute("tabindex")).to.equal("0");
    });

    it("false sets _item.tabindex to -1", async () => {
      const element = await fixture(html`<wam-item></wam-item>`);
      expect(element._item.getAttribute("tabindex")).to.equal("-1");
    });
  });
});
