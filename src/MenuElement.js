import { MenuStyle, ItemStyle } from "./Style.js";
import Attributes from "./Attributes.js";
import FocusList from "./FocusList.js";
import getItemsFlatteningGroups from "./getItemsFlatteningGroups.js";
import Orientation from "./Orientation.js";
import updateDefaultFocus from "./updateDefaultFocus.js";
import { Alignment, position } from "./Position.js";
import Icon from "./Icon.js";
/**
 * Occurs when a menu is opened
 * @event wam-menu-open
 * @type {CustomEvent}
 * @property {Menu} detail.menu
 */
/**
 * Occurs when a menu is close
 * @event wam-menu-close
 * @type {CustomEvent}
 * @property {Menu} detail.menu
 */

const template = document.createElement(template);

/**
 * @element wam-menu
 *
 */
export default class MenuElement extends HTMLElement {
  static get tagName() {
    return "wam-menu";
  }

  constructor() {
    super();

    const shadow = this.attachShadow({ mode: "open" });
    MenuStyle.addToShadow(shadow);
    ItemStyle.addToShadow(shadow);

    this.shadowRoot.innerHTML = `<button 
      part="item"
      role="menuitem" 
      aria-haspopup="menu"
      aria-expanded="false" 
      tabindex="-1"
    >
      <slot name="icon"></slot>
      <slot name="text"></slot>
    </button>
    <div
      part="popup"
      role"menu"
      aria-orientation="vertical"
    >
      <slot></slot>
    </div>`;

    this._item = this.shadowRoot.querySelector('[part="item"]');
    this._item.addEventListener("click", () => {
      this.isOpen = !this.isOpen;
    });

    this._popup = this.shadowRoot.querySelector('[part="popup"]');

    const nestedIcon = Icon.Nested;
    nestedIcon.setAttribute("class", 'nested-icon');
    this._item.appendChild(nestedIcon);

    this.addEventListener("keydown", this._onKeyDown.bind(this));
  }

  /**
   * Web component life cycle to define what attributes trigger #attributeChangedCallback
   */
  static get observedAttributes() {
    return ["name", "open", "is-default-focus", "orientation"];
  }

  /**
   * Web component life cycle when an attribute on the element is changed
   */
  attributeChangedCallback(name, oldValue, newValue) {
    const hasAttribute = null !== newValue;
    switch (name) {
      case "name":
        this.shadowRoot.querySelector('slot[name="text"]').innerText =  newValue;
        break;
      case "open":
        if (hasAttribute) {
          this._open();
        } else {
          this._close();
        }
        break;
      case "orientation":
        this._popup.setAttribute(
          "aria-orientation",
          newValue ?? Orientation.Horizontal
        );
        break;
      case "is-default-focus":
        this._item.setAttribute("tabindex", hasAttribute ? 0 : -1);
        break;
    }
  }

  connectedCallback() {
    // Force the upgrade of any children so they are included in this.interactiveItems
    // before trying to select the focused item
    window.customElements.upgrade(this);

    this.getInteractiveItems().insureDefaultSet();

    const inContainer = this.parentElement.closest("wam-menu, wam-menubar");
    this._setParentType(inContainer?.tagName);

    if (this.isOpen) {
      this._updatePosition();
    }
  }

  /** @property {boolean} */
  get isInteractive() {
    return true;
  }

  /** @property {boolean} */
  get isOpen() {
    return this._item.getAttribute("aria-expanded") === "true";
  }
  set isOpen(value) {
    Attributes.setTrueFalse(this, "open", value);
  }

  /** @property {boolean} */
  get isDefaultFocus() {
    return this._item.getAttribute("tabindex") === "0";
  }
  set isDefaultFocus(value) {
    Attributes.setTrueFalse(this, "is-default-focus", value);
  }

  /** @property {Orientation} */
  get orientation() {
    return this._popup.getAttribute("aria-orientation");
  }
  set orientation(value) {
    Attributes.setString(this, "orientation", value, Orientation.Vertical);
  }

  /**
   * @private
   */
  _setParentType(value) {
    if('WAM-MENUBAR' === value) {
      this.shadowRoot.querySelector('.nested-icon').style.display = "none";
      this._item.style.display = "";
    } else if('WAM-MENU' === value) {
      this.shadowRoot.querySelector('.nested-icon').style.display = "";
      this._item.style.display = "";
    } else {
      this.shadowRoot.querySelector('.nested-icon').style.display = "none";
      this._item.style.display = "none";
    }
  }

  /**
   * @returns {FocusList}
   */
  getInteractiveItems() {
    return new FocusList(
      getItemsFlatteningGroups(this).filter((item) => item.isInteractive)
    );
  }

  focus() {
    if (!this.isOpen) {
      this._item.focus();
    } else {
      this.getInteractiveItems().defaultFocus?.focus();
    }
  }

  _close() {
    if (!this.isOpen) {
      return;
    }

    this._item.setAttribute("aria-expanded", "false");
    this.dispatchEvent(
      new CustomEvent("wam-menu-close", {
        bubbles: true,
        detail: { menu: this },
      })
    );
  }

  _open() {
    if (this.isOpen) {
      return;
    }

    this._item.setAttribute("aria-expanded", "true");

    this._updatePosition();
    this.focus();
    this.dispatchEvent(
      new CustomEvent("wam-menu-open", {
        bubbles: true,
        detail: { menu: this },
      })
    );
  }

  _onKeyDown(event) {
    if ("Escape" == event.key) {
      this.isOpen = false;
    }

    updateDefaultFocus(event);
  }

  _getAnchor() {
    if (this._item.style.display === "") {
      return this._item;
    }
    return undefined;
  }

  _updatePosition() {
    if (!this.isConnected) {
      return;
    }

    const anchor = this._getAnchor();
    if (!anchor) {
      this._popup.style.left = "";
      this._popup.style.top = "";
      return;
    }

    const parentContainer = this.parentElement.closest(
      "wam-menu, wam-menubar, wam-toolbar"
    );
    const alignment =
      parentContainer?.orientation === Orientation.Vertical
        ? Alignment.Right
        : Alignment.Bottom;

    position({
      anchor: this._item,
      element: this._popup,
      alignment,
      anchorMargin: 4,
    });
  }
}
