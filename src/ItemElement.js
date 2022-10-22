import { ReusableStyleSheet } from "./Style";
import style from "../style/item.scss";
import Attributes from "./Attributes";
import setItemContextAttributes from "./setItemContextAttributes.js";
import updateDefaultFocus from "./updateDefaultFocus.js";

const stylesheet = new ReusableStyleSheet(style);

/**
 * @element wam-item
 * 
 * @slot icon - used for displaying an graphic element
 */
export default class ItemElement extends HTMLElement {
  static get tagName() {
    return "wam-item";
  }

  #item;

  constructor() {
    super();

    const shadow = this.attachShadow({ mode: "open", delegateFocus: true });
    stylesheet.addToShadow(shadow);

    this.shadowRoot.innerHTML =
      `<div
        part="item"
        role="menuitem"
        tabindex="-1">
        <slot name="icon" part="icon" aria-hidden="true"></slot>
        <slot></slot>
      </div>`

    this.#item = this.shadowRoot.querySelector('[part="item"]')
    this.#item.addEventListener("click", this.click.bind(this));
    this.#item.addEventListener("keydown", this.#onKeyDown.bind(this));

    const iconSlot = this.shadowRoot.querySelector('slot[name="icon"]');
    iconSlot.addEventListener("slotchange", (event)=> {
      const hasIcon = event.target.assignedElements().length > 0;
      if(hasIcon) {
        this.#item.setAttribute("data-has-icon","");
      } else {
        this.#item.removeAttribute("data-has-icon");
      }
      this.parentMenu?.queueItemUpdate();
    });
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
        this.#item.setAttribute("aria-disabled", hasAttribute);
        break;
      case "is-default-focus":
        this.#item.setAttribute("tabindex", hasAttribute ? 0 : -1);
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
    return this.#item.getAttribute("aria-disabled") === "true";
  }
  set disabled(value) {
    Attributes.setTrueFalse(this, "disabled", value);
  }

  get isInteractive() {
    return true;
  }

  /** @property {boolean} */
  get isDefaultFocus() {
    return this.#item.getAttribute("tabindex") === "0";
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
   * Does this item have a element in the icon slot
   * @type {boolean}
   * @readonly
   */
  get hasIcon() {
    return this.#item.hasAttribute("data-has-icon");
  }

  /**
   * Set attributes based on the context of the parent.
   * @protected
   */
  setContextFromParent(parent, index, items) {
    setItemContextAttributes(this.#item, index, parent, items);
  }

  #onKeyDown(event) {
    if (event.key === " " || event.key === "Enter") {
      this.click();
    } else {
      updateDefaultFocus(event, this.parentMenu);
    }
  }

  /**
   * A
   */
  click() {
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
    this.#item.focus();
  }
}
