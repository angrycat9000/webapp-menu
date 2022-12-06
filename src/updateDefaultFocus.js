import {Orientation} from "./Orientation.js";

/**
 * Updates the default focus item of a menu.  The event.currentTarget
 * must be an element that has an `orientation` property and `getInteractiveItems` function
 * @param {Event} event
 * @param {HTMLElement} menu
 */
export default function updateDefaultFocus(event, menu) {
  if (!menu) {
    return;
  }

  switch (event.key) {
    case "ArrowLeft":
      if (Orientation.Horizontal === menu.orientation) {
        menu.getInteractiveItems().focusPrevious();
        event.preventDefault();
        event.stopPropagation();
      } else if (menu.parentMenu) {
        menu.isOpen = false;
        menu.parentMenu.focus();
        event.preventDefault();
        event.stopPropagation();
      }
      break;
    case "ArrowUp":
      if (Orientation.Vertical === menu.orientation) {
        menu.getInteractiveItems().focusPrevious();
        event.preventDefault();
        event.stopPropagation();
      } else if (menu.parentMenu) {
        menu.isOpen = false;
        event.preventDefault();
        event.stopPropagation();
      }
      break;
    case "ArrowRight":
      if (Orientation.Horizontal == menu.orientation) {
        menu.getInteractiveItems().focusNext();
        event.preventDefault();
        event.stopPropagation();
      }
      break;
    case "ArrowDown":
      if (
        "ArrowDown" === event.key &&
        Orientation.Vertical == menu.orientation
      ) {
        menu.getInteractiveItems().focusNext();
        event.preventDefault();
        event.stopPropagation();
      }
      break;
  }
}
