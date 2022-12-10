import { ReusableStyleSheet } from "./Style";
import style from "../style/menubar.scss";
import Attributes from "./Attributes.js";
import {Orientation} from "./Orientation.js";
import getItemsFlatteningGroups from "./getItemsFlatteningGroups.js";
import FocusList from "./FocusList.js";
import updateDefaultFocus from "./updateDefaultFocus.js";
import isItemOf from "./isItemOf.js";

const stylesheet = new ReusableStyleSheet(style);

/**
 * Interface for manipulating `wam-menubar` elements.  Provides ARIA menubar role.
 * 
 * @augments HTMLElement
 * @element wam-menubar
 */
export class MenubarElement extends HTMLElement {
  static get tagName() {
    return "wam-menubar";
  }

  // declare private fields
  #childHasIcon;
  #container;
  #updateItemsRequestId;

  constructor() {
    super();

    this.#updateItemsRequestId = undefined;
    this.#childHasIcon = false;

    const shadow = this.attachShadow({ mode: "open", delegatesFocus: true });
    stylesheet.addToShadow(shadow);

    this.#container = document.createElement("div");
    this.#container.className = "";
    this.#container.setAttribute("role", "menubar");

    const slot = document.createElement("slot");
    this.#container.appendChild(slot);
    this.#container.setAttribute("aria-orientation", Orientation.Horizontal);
    shadow.appendChild(this.#container);

    this.addEventListener(
      "wam-menu-open",
      this.#insureOnlyOneMenuOpen.bind(this)
    );
    this.addEventListener(
      "wam-menu-close",
      this.#moveFocusBackToParent.bind(this)
    );
    this.addEventListener("keydown", this.#onKeyDown.bind(this));
  }

  static get observedAttributes() {
    return ["orientation"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    //const hasAttribute = null !== newValue;
    switch (name) {
      case "orientation":
        this.#container.setAttribute(
          "aria-orientation",
          newValue ?? Orientation.Horizontal
        );
        break;
    }
  }

  connectedCallback() {
    // Force the upgrade of any children so they are included in this.interactiveItems
    // before trying to select the focused item
    window.customElements.upgrade(this);

    this.getInteractiveItems().insureDefaultSet();
    this.queueItemUpdate();
  }

  disconnectedCallback() {
    if(this.#updateItemsRequestId) {
      window.cancelAnimationFrame(this.#updateItemsRequestId);
      this.#updateItemsRequestId = undefined;
    }
  }

  /** @type {Orientation} */
  get orientation() {
    return this.#container.getAttribute("aria-orientation");
  }
  set orientation(value) {
    Attributes.setString(this, "orientation", value, Orientation.Horizontal);
  }

    
  /**
   * True if at least one child has an icon
   * @type {boolean}
   * @protected
   */
   get childHasIcon() {
    return this.#childHasIcon;
  }


  /** @returns {FocusList} */
  getInteractiveItems() {
    return new FocusList(
      getItemsFlatteningGroups(this).filter((item) => item.isInteractive)
    );
  }

  focus() {
    this.getInteractiveItems().current?.focus();
  }

  #moveFocusBackToParent(event) {
    if (isItemOf(event.detail.menu, this)) {
      this.focus();
    }
  }

  #insureOnlyOneMenuOpen(event) {
    let openChild = event.target;
    while (openChild.parentElement && openChild.parentElement !== this) {
      openChild = openChild.parentElement;
    }

    if (!openChild) {
      return;
    }

    const interactiveItems = this.getInteractiveItems();
    for (const item of interactiveItems) {
      if (item.isOpen && item !== openChild) {
        item.isOpen = false;
      }
    }
  }

  #onKeyDown(event) {
    updateDefaultFocus(event, this);
  }

  #updateItems() {
    const items = getItemsFlatteningGroups(this);
    this.#childHasIcon = items.some(item => item.hasIcon);
    items.forEach((item, index, items) =>
      item.setContextFromParent(this, index, items)
    );
    this.#updateItemsRequestId = undefined;
  }

  queueItemUpdate() {
    if (this.#updateItemsRequestId) {
      return;
    }
    this.#updateItemsRequestId = window.requestAnimationFrame(
      this.#updateItems.bind(this)
    );
  }
}
