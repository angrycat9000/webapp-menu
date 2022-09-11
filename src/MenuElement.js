import { MenuStyle, ItemStyle } from "./Style.js";
import Attributes from "./Attributes.js";
import FocusList from "./FocusList.js";
import getItemsFlatteningGroups from "./getItemsFlatteningGroups.js";
import Orientation from "./Orientation.js";
import updateDefaultFocus from "./updateDefaultFocus.js";
import { Alignment, position } from "./Position.js";
import Icon from "./Icon.js";
import setItemContextAttributes from "./setItemContextAttributes.js";

/**
 * Occurs when a menu is opened.
 * @event wam-menu-open
 * @type {CustomEvent}
 * @property {Menu} detail.menu
 */

/**
 * Occurs when a menu is closed.
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

    this._updateItemsRequestId = undefined;
    this._childHasIcon = false;

    this._updateItems = this._updateItems.bind(this);
    this._onItemKeyDown = this._onItemKeyDown.bind(this);
    this._onMenuKeyDown = this._onMenuKeyDown.bind(this);
    this._onMenuFocusOut = this._onMenuFocusOut.bind(this);

    const shadow = this.attachShadow({ mode: "open" });
    MenuStyle.addToShadow(shadow);
    ItemStyle.addToShadow(shadow);

    this.shadowRoot.innerHTML = `<button 
      part="item"
      role="menuitem" 
      aria-haspopup="menu"
      aria-expanded="false" 
      tabindex="-1"
      data-parent-type=""
    >
      <slot name="icon"></slot>
      <slot name="text"></slot>
    </button>
    <div
      part="popup"
      role="menu"
      aria-orientation="vertical"
    >
      <slot></slot>
    </div>`;

    this._item = this.shadowRoot.querySelector('[part="item"]');
    this._item.addEventListener("click", () => {
      this.isOpen = !this.isOpen;
    });
    this._item.addEventListener("keydown", this._onItemKeyDown);

    this._popup = this.shadowRoot.querySelector('[part="popup"]');
    this._popup.addEventListener("keydown", this._onMenuKeyDown);
    this._popup.addEventListener("focusout", this._onMenuFocusOut);

    const nestedIcon = Icon.Nested;
    nestedIcon.setAttribute("class", "nested-icon");
    this._item.appendChild(nestedIcon);

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
    return ["name", "open", "is-default-focus", "orientation"];
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
      case "name":
        this.shadowRoot.querySelector('slot[name="text"]').innerText = newValue;
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

    this.parentMenu?.queueItemUpdate();

    this.getInteractiveItems().insureDefaultSet();

    if (this.isOpen) {
      this._updatePosition();
    }
  }

  disconnectedCallback() {
    if (this._updateItemsRequestId) {
      window.cancelAnimationFrame(this._updateItemsRequestId);
      this._updateItemsRequestId = undefined;
    }
  }

  /** @property {boolean} */
  get disabled() {
    return this._item.getAttribute("aria-disabled") === "true";
  }
  set disabled(value) {
    if (value) {
      this.setAttribute("disabled", "");
    } else {
      this.removeAttribute("disabled");
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
   * True if at least one child has an icon
   * @property {boolean}
   * @protected
   */
  get childHasIcon() {
    return this._childHasIcon;
  }

  /**
   * Set attributes based on the context of the parent.
   * @protected
   */
  setContextFromParent(parent, index, items) {
    setItemContextAttributes(this._item, index, parent, items);
  }

  /**
   * @returns {FocusList}
   */
  getInteractiveItems() {
    return new FocusList(
      getItemsFlatteningGroups(this).filter((item) => item.isInteractive)
    );
  }

  /**
   * @property {iconFactoryFunction}
   */
  get iconFactory() {
    return this._iconFactory ?? this.parentMenu?.iconFactory;
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
    this.getInteractiveItems().focusFirst();

    this.dispatchEvent(
      new CustomEvent("wam-menu-open", {
        bubbles: true,
        detail: { menu: this },
      })
    );
  }

  _onMenuFocusOut() {
    console.log(this.getRootNode().activeElement);
    // this.isOpen = false;
  }

  _onMenuKeyDown(event) {
    if ("Escape" == event.key) {
      this.isOpen = false;
      if (this.parentMenu) {
        this.parentMenu.focus();
      }
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    if (
      this.parentMenu &&
      (("ArrowLeft" === event.key &&
        Orientation.Vertical === this.orientation) ||
        ("ArrowUp" === event.key &&
          Orientation.Horizontal === this.orientation))
    ) {
      this.isOpen = false;
      event.preventDefault();
      event.stopPropagation();
    }
  }

  _onItemKeyDown(event) {
    if (
      event.key === " " ||
      event.key === "Enter" ||
      (event.key === "ArrowDown" &&
        this.parentMenu?.orientation === "horizontal") ||
      (event.key === "ArrowRight" && this.parentMenu.orientation === "vertical")
    ) {
      this._onClick();
      event.stopPropagation();
      event.preventDefault();
    } else {
      updateDefaultFocus(event, this.parentMenu);
    }
  }

  _onClick() {
    if (this.disabled) {
      return;
    }

    this.isOpen = !this.isOpen;
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

  _updateItems() {
    const items = getItemsFlatteningGroups(this);
    this._childHasIcon = items.some((item) => item.hasIcon);
    items.forEach((item, index, items) =>
      item.setContextFromParent(this, index, items)
    );
    this._itemUpdatePending = false;
  }

  queueItemUpdate() {
    if (this._itemUpdatePending) return;
    this._itemUpdatePending = true;
    window.queueMicrotask(this._updateItems);
  }
}
