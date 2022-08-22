import { expect, fixture, html } from "@open-wc/testing";

describe("ItemElement", () => {
  describe("isDefaultFocus", () => {
    it("defaults to false", () => {
      const element = document.createElement("wam-item");
      expect(element.isDefaultFocus).to.be.false;
    });
  ]});