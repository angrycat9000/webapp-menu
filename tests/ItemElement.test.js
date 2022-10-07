import { expect, fixture, html, nextFrame } from "@open-wc/testing";

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

    it("true sets item.tabindex to 0", async () => {
      const element = await fixture(
        html`<wam-item is-default-focus></wam-item>`
      );
      const item = element.shadowRoot.querySelector("[part=item]");
      expect(item.getAttribute("tabindex")).to.equal("0");
    });

    it("false sets item.tabindex to -1", async () => {
      const element = await fixture(html`<wam-item></wam-item>`);
      const item = element.shadowRoot.querySelector("[part=item]");
      expect(item.getAttribute("tabindex")).to.equal("-1");
    });
  });

  it("focus() sets focus", async () => {
    const element = await fixture(html`<wam-item></wam-item>`);
    expect(
      document.activeElement === element,
      "document.activeElement === element"
    ).to.be.false;

    element.focus();

    expect(
      document.activeElement === element,
      "document.activeElement === element"
    ).to.be.true;
  });

  describe("disabled", () => {
    it("defaults to false", async () => {
      const el = await fixture(`<wam-item></wam-item>`);
      expect(el.disabled).to.be.false;
    });

    it("true if attribute set", async () => {
      const el = await fixture(`<wam-item disabled></wam-item>`);
      expect(el.disabled).to.be.true;
    });

    it("sets item aria-disabled attribute to true", async () => {
      const el = await fixture(`<wam-item disabled></wam-item>`);
      const item = el.shadowRoot.querySelector("[part=item]");
      expect(item.getAttribute("aria-disabled")).to.equal("true");
    });

    it("is still focusable", async () => {
      const el = await fixture(`<wam-item disabled></wam-item>`);
      el.focus();

      expect(document.activeElement).to.be.equal(el);
    });
  });

  describe("wam-item-activate", () => {
    it("is fired on item click", async () => {
      const element = await fixture(html`<wam-item></wam-item>`);
      let fired = 0;
      element.addEventListener("wam-item-activate", () => {
        fired++;
      });

      var clickEvent = new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
        view: window,
      });
      element.shadowRoot.querySelector("[part=item]").dispatchEvent(clickEvent);

      expect(fired, "event count").to.be.equal(1);
    });

    it("is not fired fired on click when disabled", async () => {
      const element = await fixture(html`<wam-item disabled></wam-item>`);
      let fired = 0;
      element.addEventListener("wam-item-activate", () => {
        fired++;
      });

      var clickEvent = new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
        view: window,
      });
      element.shadowRoot.querySelector("[part=item]").dispatchEvent(clickEvent);

      expect(fired, "event count").to.be.equal(0);
    });

    it("is fired on key down for space", async () => {
      const element = await fixture(html`<wam-item></wam-item>`);
      let fired = 0;
      element.addEventListener("wam-item-activate", () => {
        fired++;
      });
      element.focus();

      const keyDownEvent = new KeyboardEvent("keydown", {
        key: " ",
        code: 32,
        bubbles: true,
      });
      element.shadowRoot
        .querySelector("[part=item]")
        .dispatchEvent(keyDownEvent);

      expect(fired, "event count").to.be.equal(1);
    });

    it("is not fired on key down for space when disabled", async () => {
      const element = await fixture(html`<wam-item disabled></wam-item>`);
      let fired = 0;
      element.addEventListener("wam-item-activate", () => {
        fired++;
      });
      element.focus();

      const keyDownEvent = new KeyboardEvent("keydown", {
        key: " ",
        code: 32,
        bubbles: true,
      });
      element.shadowRoot
        .querySelector("[part=item]")
        .dispatchEvent(keyDownEvent);

      expect(fired, "event count").to.be.equal(0);
    });
  });
});
