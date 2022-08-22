import { ReusableStyleSheet } from "./Style";
import style from "../style/menubar.scss";
import Attributes from "./Attributes.js";
import Orientation from "./Orientation.js";
import getItemsFlatteningGroups from "./getItemsFlatteningGroups.js";
import FocusList from "./FocusList.js";
import updateDefaultFocus from "./updateDefaultFocus.js";
import isItemOf from "./isItemOf.js";

const stylesheet = new ReusableStyleSheet(style);

export default class MenubarElement extends HTMLElement {
  static get tagName() {
    return "wam-menubar";
  }

  constructor() {
    super();

    const shadow = this.attachShadow({ mode: "open", delegatesFocus: true });
    stylesheet.addToShadow(shadow);

    this._container = document.createElement("div");
    this._container.className = "";
    this._container.setAttribute("role", "menubar");

    const slot = document.createElement("slot");
    this._container.appendChild(slot);
    this._container.setAttribute("aria-orientation", Orientation.Horizontal);
    shadow.appendChild(this._container);


    this.addEventListener("wam-menu-open", this._insureOnlyOneMenuOpen.bind(this));
    this.addEventListener("wam-menu-close", this._moveFocusBackToParent.bind(this));
    this.addEventListener("keydown", updateDefaultFocus);
  }

  /**
   * Web component life cycle to define what attributes trigger #attributeChangedCallback
   */
  static get observedAttributes() {
    return ["orientation"];
  }

  /**
   * Web component life cycle when an attribute on the element is changed
   */
  attributeChangedCallback(name, oldValue, newValue) {
    //const hasAttribute = null !== newValue;
    switch (name) {
      case "orientation":
        this._container.setAttribute(
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
  }

  /** @property {Orientation} */
  get orientation() {
    return this._container.getAttribute("aria-orientation");
  }
  set orientation(value) {
    Attributes.setString(this, "orientation", value, Orientation.Horizontal);
  }

  getInteractiveItems() {
    return new FocusList(
      getItemsFlatteningGroups(this).filter((item) => item.isInteractive)
    );
  }


  focus() {
    this.getInteractiveItems().defaultFocus?.focus();
  }


  _moveFocusBackToParent(event) {
    if(isItemOf(event.detail.menu, this)) {
      this.focus();
    }
  }

  _insureOnlyOneMenuOpen(event) {
    let openChild = event.target;
    while(openChild.parentElement && openChild.parentElement !== this) {
      openChild = openChild.parentElement;
    }

    if(!openChild) {
      return;
    }
    
    const interactiveItems = this.getInteractiveItems();
    for(const item of interactiveItems) {
      if(item.isOpen && item !== openChild) {
        item.isOpen = false;
      }
    }
  }
}
