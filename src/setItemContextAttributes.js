/**
 * @param {HTMLElement} shadowElementItem - the shadow root element to set attributes on.
 * @param {number} index - index of the menu item item in the array of all items
 * @param {HTMLElement} parentMenu - the menu parent to take the context from
 * @param {Array<HTMLElement>}
 */
export default function setItemContextAttributes(shadowItemElement, index, parentMenu, items)  {
  shadowItemElement.dataset.parentType = parentMenu.tagName.toLowerCase();
  shadowItemElement.dataset.parentOrientation = parentMenu.orientation;
  shadowItemElement.dataset.siblingIcons = parentMenu.childHasIcon;

  if(index === 0) {
    shadowItemElement.dataset.isFirstItem = "";
  } else {
    delete shadowItemElement.dataset.isFirstItem;
  }

  if (index === items.length) {
    shadowItemElement.dataset.isLastItem = "";
  } else {
    delete shadowItemElement.dataset.isLastItem;
  }
}