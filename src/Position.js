export const Alignment = Object.freeze({
  Center: "Center",
  Bottom: "Bottom",
  Right: "Right",
});

/**
 * @return {DOMRect}
 */
 function getWindowBounds() {
  return {
    left: window.scrollX,
    right: window.innerWidth + window.scrollX,
    top: window.scrollY,
    bottom: window.innerHeight + window.scrollY,
    width: window.innerWidth,
    height: window.innerHeight,
  }
}

/**
 * Get the top value for the element
 * @param {DOMRect} options.containerBounds
 * @param {DOMRect} options.elementBounds
 * @param {DOMRect} options.anchorBounds
 * @returns {number}
 */
function positionBelow({ containerBounds, elementBounds, anchorBounds }) {
  if (anchorBounds.bottom + elementBounds.height <= containerBounds.bottom) {
    return anchorBounds.bottom;
  }

  const topSpace = anchorBounds.top - containerBounds.top;
  const bottomSpace = containerBounds.bottom - anchorBounds.bottom;

  return topSpace > bottomSpace
    ? containerBounds.top
    : containerBounds.bottom - elementBounds.height;
}

/**
 * Get the left value for the element
 * @param {DOMRect} options.containerBounds
 * @param {DOMRect} options.elementBounds
 * @param {DOMRect} options.anchorBounds
 * @returns {number}
 */
function positionRight({ containerBounds, elementBounds, anchorBounds }) {
  if (anchorBounds.right + elementBounds.width <= containerBounds.right) {
    return anchorBounds.right;
  }

  const leftSpace = containerBounds.right - anchorBounds.left;
  const rightSpace = anchorBounds.left - containerBounds.right;

  return rightSpace > leftSpace
    ? anchorBounds.right
    : containerBounds.right - elementBounds.width;
}

function centerHorizontally({ containerBounds, elementBounds, anchorBounds }) {
  const centerX = anchorBounds.left + 0.5 * anchorBounds.width;

  const elementLeft = centerX - 0.5 * elementBounds.width;
  const elementRight = centerX + 0.5 * elementBounds.width;

  if (
    elementLeft < containerBounds.left &&
    elementBounds.width <= containerBounds.width
  ) {
    return containerBounds.left;
  }

  if (
    elementRight > containerBounds.right &&
    elementBounds.width <= containerBounds.width
  ) {
    return containerBounds.right - elementBounds.width;
  }

  return centerX - 0.5 * elementBounds.width;
}

/**
 * @param {HTMLElement} options.element
 * @param {HTMLElement|DOMRect} [options.container]
 * @param {HTMLElement|DOMRect} options.anchor
 * @param {Alignment} [options.alignment = Alignment.BottomCenter]
 * @param {number} [options.anchorMargin = 0]
 * @param {number} [containerMargin = 0]
 */
export function position(options) {
  let containerBounds;
  if (options.container) {
    containerBounds =
      options.container instanceof DOMRect
        ? options.container
        : options.container.getBoundingClientRect();
  } else {
    containerBounds = getWindowBounds();
  }

  const alignment = options.alignment ?? Alignment.BottomCenter;

  let anchorBounds =
    options.anchor instanceof DOMRect
      ? options.anchor
      : options.anchor.getBoundingClientRect();

  const element = options.element;
  const elementBounds = element.getBoundingClientRect();

  const anchorMargin = options.anchorMargin ?? 0;
  if (anchorMargin !== 0 && alignment === Alignment.Right) {
    anchorBounds = new DOMRect(
      anchorBounds.left - anchorMargin,
      anchorBounds.top,
      anchorBounds.width + 2 * anchorMargin,
      anchorBounds.height
    );
  } else if (anchorMargin !== 0) {
    anchorBounds = new DOMRect(
      anchorBounds.left,
      anchorBounds.top - anchorMargin,
      anchorBounds.width,
      anchorBounds.height + 2 * anchorMargin
    );
  }

  const containerMargin = options.containerMargin ?? 0;
  if (containerMargin !== 0) {
    containerBounds = new DOMRect(
      containerBounds.left - containerMargin,
      containerBounds.top - containerMargin,
      containerBounds.width + 2 * containerMargin,
      containerBounds.height + 2 * containerMargin
    );
  }

  let top, left;
  switch (alignment) {
    case Alignment.Bottom:
      top = positionBelow({ elementBounds, anchorBounds, containerBounds });
      left = anchorBounds.left;
      break;
    case Alignment.Right:
      top = anchorBounds.top;
      left = positionRight({ elementBounds, anchorBounds, containerBounds });
      break;
    case Alignment.Center:
      top = positionBelow({ elementBounds, anchorBounds, containerBounds });
      left = centerHorizontally({
        elementBounds,
        anchorBounds,
        containerBounds,
      });
      break;
  }

  let offsetTop = 0,
    offsetLeft = 0,
    offsetParent = element.offsetParent;
  while (offsetParent) {
    offsetTop += offsetParent.offsetTop;
    offsetLeft += offsetParent.offsetLeft;
    offsetParent = offsetParent.offsetParent;
  }

  left -= offsetLeft;
  top -= offsetTop;

  element.style.left = left + "px";
  element.style.top = top + "px";
}
