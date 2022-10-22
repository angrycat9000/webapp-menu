import MenuElement from "./MenuElement.js";
import MenubarElement from "./MenubarElement.js";
import ItemElement from "./ItemElement.js";
import CheckboxItemElement from "./CheckboxItemElement.js";
import Orientation from "./Orientation.js"

export { MenuElement, MenubarElement, ItemElement, CheckboxItemElement, Orientation };

for (let element of [
  MenuElement,
  MenubarElement,
  ItemElement,
  CheckboxItemElement,
]) {
 window.customElements.define(element.tagName, element);
}
