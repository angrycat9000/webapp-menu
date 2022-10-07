import MenuElement from "./MenuElement.js";
import MenubarElement from "./MenubarElement.js";
import ItemElement from "./ItemElement.js";
import Orientation from "./Orientation.js"

export { MenuElement, MenubarElement, ItemElement, Orientation };

for (let element of [
  MenuElement,
  MenubarElement,
  ItemElement,
]) {
 window.customElements.define(element.tagName, element);
}
