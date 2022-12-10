import {Orientation} from "./Orientation.js";

function onKeyDown(event) {
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

/**
 *
 */
export default function manageFocus(element, slot) {
  element.addEventListener("keydown", onKeyDown);

  slot.addEventListener("slotchange", () => {
    const interactiveItems = element.getInteractiveItems();
    if (!interactiveItems.current) {
      interactiveItems.focusOn(interactiveItems.first);
    }
  });
}


manageFocus.onKeyDown = onKeyDown;
