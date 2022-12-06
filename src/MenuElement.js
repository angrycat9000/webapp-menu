import { MenuStyle, ItemStyle } from "./Style.js";
import Attributes from "./Attributes.js";
import FocusList from "./FocusList.js";
import getItemsFlatteningGroups from "./getItemsFlatteningGroups.js";
import {Orientation} from "./Orientation.js";
import updateDefaultFocus from "./updateDefaultFocus.js";
import { Alignment, position } from "./Position.js";
import Icon from "./Icon.js";
import setItemContextAttributes from "./setItemContextAttributes.js";

/**
 * Occurs when a menu is opened.
 * @event wam-menu-open
 * @type {CustomEvent}
 * @property {MenuElement} detail.menu
 */

/**
 * Occurs when a menu is closed.
 * @event wam-menu-close
 * @type {CustomEvent}
 * @property {MenuElement} detail.menu
 */


/**
 * Interface for manipulating `<wam-menu>` elements.  Provides the ARIA role of menu.
 * 
 * Displays a list of pop up choices to the user.  May be nested inside of a menubar or menu.
 *
 * @augments HTMLElement
 * @element wam-menu
 * @class
 */
export class MenuElement extends HTMLElement {
  static get tagName() {
    return "wam-menu";
  }

  // private fields
  #childHasIcon;
  #item;
  #popup;
  #updateItemsRequestId;

  constructor() {
    super();

    this.#childHasIcon = false;
    this.#updateItemsRequestId = undefined;

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

    this.#item = this.shadowRoot.querySelector('[part="item"]');
    this.#item.addEventListener("click", () => {
      this.isOpen = !this.isOpen;
    });
    this.#item.addEventListener("keydown", this.#onItemKeyDown.bind(this));

    this.#popup = this.shadowRoot.querySelector('[part="popup"]');
    this.#popup.addEventListener("keydown", this.#onMenuKeyDown.bind(this));
    this.#popup.addEventListener("focusout", this.#onMenuFocusOut.bind(this));

    const nestedIcon = Icon.Nested;
    nestedIcon.setAttribute("class", "nested-icon");
    this.#item.appendChild(nestedIcon);

    const iconSlot = this.shadowRoot.querySelector('slot[name="icon"]');
    iconSlot.addEventListener("slotchange", (event)=> {
      const hasIcon = event.target.assignedElements().length > 0;
      if(hasIcon) {
        this.#item.setAttribute("data-has-icon","");
      } else {
        this.#item.removeAttribute("data-has-icon");
      }
      this.parentMenu?.queueItemUpdate()
    });
  }

  static get observedAttributes() {
    return ["name", "open", "is-default-focus", "orientation", "disabled"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    const hasAttribute = null !== newValue;
    switch (name) {
      case "disabled":
        this.#item.setAttribute("aria-disabled", hasAttribute);
        break;
      case "name":
        this.shadowRoot.querySelector('slot[name="text"]').innerText = newValue;
        break;
      case "open":
        if (hasAttribute) {
          this.#open();
        } else {
          this.#close();
        }
        break;
      case "orientation":
        this.#popup.setAttribute(
          "aria-orientation",
          newValue ?? Orientation.Horizontal
        );
        break;
      case "is-default-focus":
        this.#item.setAttribute("tabindex", hasAttribute ? 0 : -1);
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
      this.#updatePosition();
    }
  }

  disconnectedCallback() {
    if (this.#updateItemsRequestId) {
      window.cancelAnimationFrame(this.#updateItemsRequestId);
      this.#updateItemsRequestId = undefined;
    }
  }

  /**
   * A boolean value indicating whether or not the control is disabled.  A disabled control does not accept clicks.
   * @type {boolean} */
  get disabled() {
    return this.#item.getAttribute("aria-disabled") === "true";
  }
  set disabled(value) {
    if (value) {
      this.setAttribute("disabled", "");
    } else {
      this.removeAttribute("disabled");
    }
  }

  /** @type {boolean} */
  get isInteractive() {
    return true;
  }

  /** 
   * Determine if the menu is open.  USes the `open` attribute
   * @attribute open
   * @type {boolean}
   */
  get isOpen() {
    return this.#item.getAttribute("aria-expanded") === "true";
  }
  set isOpen(value) {
    Attributes.setTrueFalse(this, "open", value);
  }

  /** @type {boolean} */
  get isDefaultFocus() {
    return this.#item.getAttribute("tabindex") === "0";
  }
  set isDefaultFocus(value) {
    Attributes.setTrueFalse(this, "is-default-focus", value);
  }

  /** @type {Orientation} */
  get orientation() {
    return this.#popup.getAttribute("aria-orientation");
  }
  set orientation(value) {
    Attributes.setString(this, "orientation", value, Orientation.Vertical);
  }

  /**
   * Get the closest menu or menubar that contains this menu.
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
   * True if at least one child has an icon.  Updated before the next animation frame
   * @type {boolean}
   * @protected
   */
  get childHasIcon() {
    return this.#childHasIcon;
  }

  /**
   * Set attributes for visual formatting based on the context of the parent.
   * @protected
   */
  setContextFromParent(parent, index, items) {
    setItemContextAttributes(this.#item, index, parent, items);
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
      this.#item.focus();
    } else {
      this.getInteractiveItems().defaultFocus?.focus();
    }
  }

  #close() {
    if (!this.isOpen) {
      return;
    }

    this.#item.setAttribute("aria-expanded", "false");
    this.dispatchEvent(
      new CustomEvent("wam-menu-close", {
        bubbles: true,
        detail: { menu: this },
      })
    );
  }

  #open() {
    if (this.isOpen) {
      return;
    }

    this.#item.setAttribute("aria-expanded", "true");
    this.#updatePosition();
    this.getInteractiveItems().focusFirst();

    this.dispatchEvent(
      new CustomEvent("wam-menu-open", {
        bubbles: true,
        detail: { menu: this },
      })
    );
  }

  #onMenuFocusOut() {
    console.log(this.getRootNode().activeElement);
    // this.isOpen = false;
  }

  #onMenuKeyDown(event) {
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

  #onItemKeyDown(event) {
    if (
      event.key === " " ||
      event.key === "Enter" ||
      (event.key === "ArrowDown" &&
        this.parentMenu?.orientation === "horizontal") ||
      (event.key === "ArrowRight" && this.parentMenu.orientation === "vertical")
    ) {
      this.click();
      event.stopPropagation();
      event.preventDefault();
    } else {
      updateDefaultFocus(event, this.parentMenu);
    }
  }

  /** 
   * Activate the menu item
   */
  click() {
    if (this.disabled) {
      return;
    }

    this.isOpen = !this.isOpen;
  }

  #getAnchor() {
    if (this.#item.style.display === "") {
      return this.#item;
    }
    return undefined;
  }

  #updatePosition() {
    if (!this.isConnected) {
      return;
    }

    const anchor = this.#getAnchor();
    if (!anchor) {
      this.#popup.style.left = "";
      this.#popup.style.top = "";
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
      anchor: this.#item,
      element: this.#popup,
      alignment,
      anchorMargin: 4,
    });
  }

  #updateItems() {
    const items = getItemsFlatteningGroups(this);
    this.#childHasIcon = items.some((item) => item.hasIcon);
    items.forEach((item, index, items) =>
      item.setContextFromParent(this, index, items)
    );
    this.#updateItemsRequestId = undefined;
  }

  /**
   * Schedule an item update to update the visuals of all the children by calling
   * child.setContextFromParent. Also updates this.childHasIcon. 
   * 
   * This update occurs before the next animation frame
   * @protected
   */
  queueItemUpdate() {
    if (this.#updateItemsRequestId) {
      return;
    }
    this.#updateItemsRequestId = window.requestAnimationFrame(
      this.#updateItems.bind(this)
    );
  }
}
