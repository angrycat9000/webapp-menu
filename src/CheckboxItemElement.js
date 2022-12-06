import {ItemElement} from "./ItemElement.js";
import Attributes from "./Attributes";

/**
 * @event change
 * @type {CustomElement}
 */

/**
 * Interface for manipulating `wam-checkboxitem` elements.  Provides ARIA menuitemcheckbox role.
 * 
 * Menu item that has a checked and unchecked state representing a checkbox
 * 
 * @augments ItemElement
 * 
 * @element wam-check-item
 * 
 * @slot icon-on - icon shown when checked
 * @slot icon-off - icon shown when not checked
 */
export class CheckboxItemElement extends ItemElement {

  static get tagName() { return  "wam-checkbox-item"}

  #item;

  constructor() {
    super();

    this.#item = this.shadowRoot.querySelector("[part=item]");
    this.#item.setAttribute("role", "menuitemcheckbox");
    this.#item.setAttribute("aria-checked", false);

    const onOffIcons = CheckboxItemElement.template.content.cloneNode(true);
    const icon = this.shadowRoot.querySelector('slot[name="icon"]');
    // move nodes from DocumentFragment to the shadowRoot
    while(onOffIcons.firstElementChild) {
      icon.parentElement.insertBefore(onOffIcons.firstElementChild, icon);
    }
    icon.parentElement.removeChild(icon);

  }

  static get observedAttributes() {
    return ItemElement.observedAttributes.concat("checked");
  }

  attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback(name, oldValue, newValue);

    if ("checked" === name) {
      if (null !== newValue) this.#item.setAttribute("aria-checked", true);
      else this.#item.setAttribute("aria-checked", false);
    }
  }

  /**
   * Is the menu item checked.
   * @attribute checked
   * @type {boolean}
   */
  get checked() {
    return this.#item.getAttribute("aria-checked") === "true";
  }
  set checked(value) {
    Attributes.setTrueFalse(this, "checked", value);
  }

  get hasIcon() {
    return true;
  }

  /**
   * Simulate the user activating the item to toggle the value.
   * 
   * @fires change
   */
  click() {
    if (this.disabled) {
      return;
    }

    this.checked = !this.checked;
    
    const changeEvent = new CustomEvent("change", {bubbles: true});
    this.dispatchEvent(changeEvent);
  }
}

var template = null;
Object.defineProperty(CheckboxItemElement, "template", {
  get: function () {
    if (template) return template;

    template = document.createElement("template");
    template.innerHTML = `
      <slot name="icon-on" part="icon" class="on">
        <svg class="on" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
      </slot>
      <slot name="icon-off" part="icon" class="off">
        <svg class="off" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/><path d="M0 0h24v24H0z" fill="none"/></svg>
      </slot>`;
    return template;
  },
});
