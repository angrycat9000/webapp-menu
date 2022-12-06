import { expect, fixture } from "@open-wc/testing";

import "../dist/webapp-menu";


describe("SeparatorElement", () => {

  it("sets role of separator in shadow root element", async ()=>{
    const element = await fixture(`<wam-separator></wam-separator>`);
    const separator = element.shadowRoot.querySelector("[role=separator]");
    expect(separator).not.to.be.null;
  })
});