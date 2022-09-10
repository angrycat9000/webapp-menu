import { ReusableStyleSheet } from "./Style";
import style from "../style/item.scss";
import Attributes from "./Attributes";
import setItemContextAttributes from "./setItemContextAttributes.js";
import updateDefaultFocus from "./updateDefaultFocus.js";

const stylesheet = new ReusableStyleSheet(style);

/**
 * @element wam-item
 */
export default class ItemElement extends HTMLElement {
  static get tagName() {
    return "wam-item";
  }

  constructor() {
    super();

    const shadow = this.attachShadow({ mode: "open", delegateFocus: true });
    stylesheet.addToShadow(shadow);

    this._item = document.createElement("div");
    this._item.setAttribute("part", "item");
    this._item.setAttribute("role", "menuitem");
    this._item.setAttribute("tabindex", -1);
    this._item.appendChild(document.createElement("slot"));
    this._item.addEventListener("click", this._onClick.bind(this));
    this._item.addEventListener("keydown", this._onKeyDown.bind(this));

    shadow.appendChild(this._item);
  }

  /**
   * Web component life cycle to define what attributes trigger #attributeChangedCallback
   */
  static get observedAttributes() {
    return ["disabled", "is-default-focus"];
  }

  /**
   * Web component life cycle when an attribute on the element is changed
   */
  attributeChangedCallback(name, oldValue, newValue) {
    const hasAttribute = null !== newValue;
    switch (name) {
      case "disabled":
        this._item.setAttribute("aria-disabled", hasAttribute);
        break;
      case "is-default-focus":
        this._item.setAttribute("tabindex", hasAttribute ? 0 : -1);
        break;
    }
  }

  connectedCallback() {
    this.parentMenu?.queueItemUpdate();
  }

  /**
   * @property {boolean}
   */
  get disabled() {
    return this._item.getAttribute("aria-disabled") === "true";
  }
  set disabled(value) {
    Attributes.setTrueFalse(this, "disabled", value);
  }

  get isInteractive() {
    return true;
  }

  /** @property {boolean} */
  get isDefaultFocus() {
    return this._item.getAttribute("tabindex") === "0";
  }
  set isDefaultFocus(value) {
    Attributes.setTrueFalse(this, "is-default-focus", value);
  }

  /**
   * @property {HTMLElement}
   * @readonly
   */
  get parentMenu() {
    return this.parentElement?.closest("wam-menu, wam-menubar");
  }

  /**
   * Set attributes based on the context of the parent.
   * @protected
   */
  setContextFromParent(parent, index, items) {
    setItemContextAttributes(this._item, index, parent, items);
  }

  _onKeyDown(event) {
    if (event.key === " " || event.key === "Enter") {
      this._onClick();
    } else {
      updateDefaultFocus(event, this.parentMenu);
    }
  }

  /**
   * @private
   */
  _onClick() {
    if (this.disabled) {
      return;
    }

    const event = new CustomEvent("wam-item-activate", { bubbles: true });
    const okToClose = this.dispatchEvent(event);
    if (!okToClose) {
      return;
    }

    // close all menus containing this item
    let parent = this.parentElement;
    while (parent) {
      if (parent.tagName === "WAM-MENU") {
        parent.isOpen = false;
      }
      parent = parent.parentElement;
    }
  }

  focus() {
    this._item.focus();
  }
}
