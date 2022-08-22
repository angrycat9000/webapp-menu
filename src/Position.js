/**
 * @return {DOMRect}
 */
function getWindowBounds() {
  return new DOMRect(
    window.scrollX,
    window.scrollY,
    window.innerWidth,
    window.innerHeight
  );
}

function positionAtPointWithin(menu, x, y, containerElement, verticalMargin) {
  const position = positionPopup(
    menu.getBoundingClientRect(),
    containerElement.getBoundingClientRect(),
    x,
    y,
    verticalMargin,
    "center"
  );
  return apply(menu, position);
}

function positionAtPoint(menu, x, y, verticalMargin = 16) {
  const position = positionPopup(
    menu.getBoundingClientRect(),
    getWindowBounds(),
    x,
    y,
    verticalMargin,
    "center"
  );
  return apply(menu, position);
}

function positionForButton(menu, button, padding = 8) {
  const container = getWindowBounds();
  const buttonRect = button.getBoundingClientRect();
  const offset = buttonRect.height / 2 + padding;
  const y = buttonRect.top + buttonRect.height / 2 + window.scrollY;
  const x = buttonRect.left + window.scrollX;
  const menuRect = menu.getBoundingClientRect();

  const position = positionPopup(menuRect, container, x, y, offset, "left");
  return apply(menu, position);
}

/**
 * @return {PositionValue}
 */
function positionPopup(
  menuRect,
  containerRect,
  x,
  y,
  verticalPadding,
  align = "left"
) {
  const yAbove = y - verticalPadding;
  const yBelow = y + verticalPadding;

  const bounds = {
    min: {
      x: containerRect.left,
      y: containerRect.top,
    },
    max: {
      x: containerRect.right,
      y: containerRect.bottom,
    },
  };

  let margin = 8;
  bounds.min.x += margin;
  bounds.min.y += margin;
  bounds.max.x -= margin;
  bounds.max.y -= margin;

  let point = {
    x: "center" == align ? x - menuRect.width / 2 : x,
  };

  if (point.x < bounds.min.x) point.x = bounds.min.x;
  if (point.x > bounds.max.x - menuRect.width)
    point.x = bounds.max.x - menuRect.width;

  let d2 = bounds.max.y - (yBelow + menuRect.height);
  let d1 = yAbove - (bounds.min.y + menuRect.height);

  if (d2 >= 0) point.y = yBelow;
  else if (d1 >= 0) point.y = yAbove - menuRect.height;
  else if (d1 > d2) point.y = bounds.min.y;
  else point.y = bounds.max.y - menuRect.height;

  return {
    top: Math.round(point.y),
    left: Math.round(point.x),
    position: "absolute",
    transformOrigin: (point.y > y ? "top " : "bottom ") + align,
  };
}

/**
 * @typedef PositionValue
 * @property {string} [name]
 * @property {number|string} [left]
 * @property {number|string} [top]
 * @property {number|string} [right]
 * @property {number|string} [bottom]
 */

/**
 * A function that will set the position of the HTMLElement provided to it.
 * @callback PositionFunction
 * @param {HTMLElement} element
 */

/**
 * Apply this position to the menu element.
 * @param {HTMLElement} element
 * @param {PositionValue} position
 */
function apply(element, position) {
  for (let prop of ["top", "bottom", "left", "right"]) {
    let value = position[prop];
    if ("undefined" === typeof value) value = "";
    else if ("number" === typeof value) value = value + "px";
    element.style[prop] = value;
  }

  element.style.position =
    "undefined" === typeof position.position ? "" : position.position;

  if (element.shadowRoot) {
    const menu = element.shadowRoot.querySelector(".menu");
    if (menu) menu.style.transformOrigin = position.transformOrigin || "";
  }

  return position;
}

export const Position = {
  /**
   * Shows the menu left aligned to element.  Displays above the element if there
   * is not enough room above.
   * @param {HTMLElement} button
   * @return {PositionFunction}
   */
  WithElement: function (button) {
    return (menu) => positionForButton(menu, button);
  },

  /**
   * Absolutely position the element at the given X and Y values
   * @param {number} left
   * @param {number} top
   * @return {PositionFunction}
   */
  Absolute: function (left, top) {
    return (menu) =>
      apply(menu, {
        position: "absolute",
        left,
        top,
      });
  },

  /**
   * Clear the inline position styles on the element.
   * @property {PositionFunction} None
   */
  None: (e) => apply(e, {}),

  /**
   * Shows the menu centered above or below the point given by top and left.
   * Contained within the window viewport
   * @param {number} left
   * @param {number} top
   * @return {PositionFunction}
   */
  AtPoint: function (left, top, verticalMargin = 16) {
    return (menu) => positionAtPoint(menu, left, top, verticalMargin);
  },

  /**
   * Show the menu centered above or below the point but contained
   * within the provided element
   * @param {number} left
   * @param {number} top
   * @param {HTMLElement} container
   * @return {PositionFunction}
   */
  AtPointWithin: function (left, top, container, verticalMargin = 16) {
    return (menu) =>
      positionAtPointWithin(menu, left, top, container, verticalMargin);
  },
};

export default Position;

export const Alignment = Object.freeze({
  Center: "Center",
  Bottom: "Bottom",
  Right: "Right",
});

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
