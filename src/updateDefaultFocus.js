import Orientation from "./Orientation.js";

/**
 * Updates the default focus item of a menu.  The event.currentTarget
 * must be an element that has an `orientation` property and `getInteractiveItems` function
 * @param {Event} event.
 */
export default function updateDefaultFocus(event) {
  const element = event.currentTarget;

  if (
    "ArrowLeft" === event.key &&
    Orientation.Horizontal == element.orientation
  ) {
    element.getInteractiveItems().focusPrevious();
    event.preventDefault();
  } else if (
    "ArrowUp" === event.key &&
    Orientation.Vertical == element.orientation
  ) {
    element.getInteractiveItems().focusPrevious();
    event.preventDefault();
  } else if (
    "ArrowRight" === event.key &&
    Orientation.Horizontal == element.orientation
  ) {
    element.getInteractiveItems().focusNext();
    event.preventDefault();
  } else if (
    "ArrowDown" === event.key &&
    Orientation.Vertical == element.orientation
  ) {
    element.getInteractiveItems().focusNext();
    event.preventDefault();
  }
}