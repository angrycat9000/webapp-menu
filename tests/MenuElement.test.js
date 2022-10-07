import { expect, fixture, html } from "@open-wc/testing";

describe("MenuElement", () => {
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

    it("true sets item.tabindex to 0", async () => {
      const element = await fixture(
        html`<wam-menu is-default-focus></wam-menu>`
      );
      const item = element.shadowRoot.querySelector("[part=item]");
      expect(item.getAttribute("tabindex")).to.equal("0");
    });

    it("false sets item.tabindex to -1", async () => {
      const element = await fixture(html`<wam-menu></wam-menu>`);
      const item = element.shadowRoot.querySelector("[part=item]");
      expect(item.getAttribute("tabindex")).to.equal("-1");
    });
  });

  describe("isOpen", () => {
    it("defaults to false", async () => {
      const el = await fixture(`<wam-menu></wam-menu>`);
      expect(el.isOpen).to.be.false;
    });

    it("is true of open attribute is present", async () => {
      const el = await fixture(`<wam-menu open></wam-menu>`);
      expect(el.isOpen).to.be.true;
    });
  });

  it("focuses on first item on open", async () => {
    const el = await fixture(`<wam-menu open><wam-item></wam-item></wam-menu>`);
    const item = el.firstElementChild;
    const isFocused = document.activeElement === item;
    expect(isFocused, "document.activeElement === item").to.be.true;
  });

  it('sets defaultFocus on the first item', async() => {
    const menu = await fixture(`<wam-menu open><wam-item></wam-item><wam-item></wam-item></wam-menu>`);
    const item = menu.firstElementChild;
    expect(item.isDefaultFocus, "isDefaultFocus").to.be.true;
})

  describe("disabled", ()=>{
    it("defaults to false", async ()=>{
      const element = await fixture(`<wam-menu></wam-menu>`);
      expect(element.disabled).to.be.false;
    })

    it("set true when disabled attribute is present", async ()=>{
      const element = await fixture(`<wam-menu disabled></wam-menu>`);
      expect(element.disabled).to.be.true;
    })
  })

  describe("interaction", () => {
    it("opens on item click", async () => {
      const nestedMenus = await fixture(html`<wam-menu><wam-menu name="target"></wam-menu></wam-menu>`);
      const element = nestedMenus.firstElementChild;

      var clickEvent = new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
        view: window,
      });
      element.shadowRoot.querySelector("[part=item]").dispatchEvent(clickEvent);

      expect(element.isOpen, "isOpen").to.be.true;
    });

    it("does not open on click when disabled", async () => {
      const nestedMenus = await fixture(html`<wam-menu><wam-menu name="target" disabled></wam-menu></wam-menu>`);
      const element = nestedMenus.firstElementChild;

      var clickEvent = new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
        view: window,
      });
      element.shadowRoot.querySelector("[part=item]").dispatchEvent(clickEvent);

      expect(element.isOpen, "isOpen").to.be.true;
    });

    it("opens on spacebar down", async () => {
      const nestedMenus = await fixture(html`<wam-menu><wam-menu name="target"></wam-menu></wam-menu>`);
      const element = nestedMenus.firstElementChild;

      element.focus();
      const keyDownEvent = new KeyboardEvent("keydown", {
        key: " ",
        code: 32,
        bubbles: true,
      });
      element.shadowRoot
        .querySelector("[part=item]")
        .dispatchEvent(keyDownEvent);

        expect(element.isOpen, "isOpen").to.be.true;
    });

    it("does not open on spacebar down when disabled", async () => {
      const nestedMenus = await fixture(html`<wam-menu><wam-menu name="target" disabled></wam-menu></wam-menu>`);
      const element = nestedMenus.firstElementChild;

      element.focus();
      const keyDownEvent = new KeyboardEvent("keydown", {
        key: " ",
        code: 32,
        bubbles: true,
      });
      element.shadowRoot
        .querySelector("[part=item]")
        .dispatchEvent(keyDownEvent);

        expect(element.isOpen, "isOpen").to.be.false;
    });
  });
});
