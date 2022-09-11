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

    this.shadowRoot.innerHTML =
      `<div
        part="item"
        role="menuitem"
        tabindex="-1">
        <slot name="icon" aria-hidden="true"></slot>
        <slot></slot>
      </div>`

    this._item = this.shadowRoot.querySelector('[part="item"]')
    this._item.addEventListener("click", this._onClick.bind(this));
    this._item.addEventListener("keydown", this._onKeyDown.bind(this));

    const iconSlot = this.shadowRoot.querySelector('slot[name="icon"]');
    iconSlot.addEventListener("slotchange", (event)=> {
      const hasIcon = event.target.assignedElements().length > 0;
      if(hasIcon) {
        this._item.setAttribute("data-has-icon","");
      } else {
        this._item.removeAttribute("data-has-icon");
      }
      this.parentMenu?.queueItemUpdate()
    });
  }

  /**
   * Web component life cycle to define what attributes trigger #attributeChangedCallback
   */
  static get observedAttributes() {
    return ["disabled", "icon", "is-default-focus"];
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
      case "icon":
        this._updateIcon(newValue);
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
   * Does this item have a icon. This includes both icons added directly into
   * the HTML and icons added by setting a name and icon factory function.
   * @type {boolean}
   * @readonly
   */
  get hasIcon() {
    for (const child of this.children) {
      if (child.getAttribute("slot") === "icon") {
        return true;
      }
    }
    return false;
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
