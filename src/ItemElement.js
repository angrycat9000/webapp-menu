import { ReusableStyleSheet } from "./Style";
import style from "../style/item.scss";
import Attributes from "./Attributes";
import setItemContextAttributes from "./setItemContextAttributes.js";
import updateDefaultFocus from "./updateDefaultFocus.js";

const stylesheet = new ReusableStyleSheet(style);

/**
 * Occurs when a menu item is clicked.
 * 
 * The default behavior for `wam-item` is to close all the containing menus after the item is activated.
 * Use `event.preventDefault()` to have the menus remain open. 
 * @event wam-item-activate
 * @type {CustomEvent}
 */

/**
 * Interface for manipulating `wam-item` elements.  Provides ARIA menuitem role.
 * 
 * Defines an interactive item in a menu, menubar, or toolbar.
 * 
 * @augments HTMLElement
 *
 * @element wam-item
 * @slot icon - used for displaying an graphic element
 */
export class ItemElement extends HTMLElement {
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
        <slot part="text"></slot>
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

  static get observedAttributes() {
    return ["disabled", "is-default-focus"];
  }

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
   * A boolean value indicating whether or not the control is disabled.  A disabled control does not accept clicks.
   * @type {boolean}
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

  /**
   * A boolean property indicating if the item will be focused when the parent container is focused. Only one item in the container can be the default focus.s
   * @type {boolean}
   */
  get isDefaultFocus() {
    return this.#item.getAttribute("tabindex") === "0";
  }
  set isDefaultFocus(value) {
    Attributes.setTrueFalse(this, "is-default-focus", value);
  }

  /**
   * @type {?(MenuElement|MenubarElement)}
   * @readonly
   */
  get parentMenu() {
    return this.parentElement?.closest("wam-menu, wam-menubar");
  }

  /**
   * A boolean value indicating whether or not there is an element in the icon slot.
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
   * Simulate the user activating the item.
   * 
   * @fires wam-item-activate
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
