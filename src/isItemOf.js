/**
 * @param {HTMLElement} item
 * @param {HTMLElement} menu
 * @returns {boolean}
 */
export default function isItemOf(item, menu) {
  if (!item) {
    return false;
  }

  let parentMenu = item.parentElement;
  while (parentMenu.tagName.toLowerCase() === "wam-group") {
    parentMenu = parentMenu.parentElement;
  }

  return menu === parentMenu;
}
