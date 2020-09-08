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

function positionAtPointWithin(menu, x, y, containerElement, verticalMargin) {
  const position = positionPopup(menu.getBoundingClientRect(), containerElement.getBoundingClientRect(), x, y, verticalMargin, 'center');
  return apply(menu, position);
}

function positionAtPoint(menu, x, y, verticalMargin = 16) {
  const position = positionPopup(menu.getBoundingClientRect(), getWindowBounds(), x, y, verticalMargin, 'center');
  return apply(menu, position);
}


function positionForButton(menu, button, padding = 8) {
  const container = getWindowBounds();
  const buttonRect = button.getBoundingClientRect();
  const offset = buttonRect.height / 2 + padding;
  const y = buttonRect.top + buttonRect.height / 2 + window.scrollY;
  const x = buttonRect.left + window.scrollX;
  const menuRect = menu.getBoundingClientRect();

  const position = positionPopup(menuRect, container, x, y, offset, 'left');
  return apply(menu, position);
}

/**
 * @return {PositionValue}
 */
function positionPopup(menuRect, containerRect, x, y, verticalPadding, align = 'left') {
  const yAbove = y - verticalPadding;
  const yBelow = y + verticalPadding;

  const bounds = {
    min: {
      x: containerRect.left,
      y: containerRect.top
    },
    max: {
      x: containerRect.right,
      y: containerRect.bottom
    }
  };

  let margin = 8;
  bounds.min.x += margin;
  bounds.min.y += margin;
  bounds.max.x -= margin;
  bounds.max.y -= margin;

  let point = {
    x: ('center' == align) ? x - menuRect.width / 2 : x
  };


  if (point.x < bounds.min.x)
    point.x = bounds.min.x;
  if (point.x > bounds.max.x - menuRect.width)
    point.x = bounds.max.x - menuRect.width;

  let d2 = bounds.max.y - (yBelow + menuRect.height);
  let d1 = yAbove - (bounds.min.y + menuRect.height);

  if (d2 >= 0)
    point.y = yBelow;
  else if (d1 >= 0)
    point.y = yAbove - menuRect.height;
  else if (d1 > d2)
    point.y = bounds.min.y;
  else
    point.y = bounds.max.y - menuRect.height;

  return {
    top: Math.round(point.y),
    left: Math.round(point.x),
    position: 'absolute',
    transformOrigin: (point.y > y ? 'top ' : 'bottom ') + align
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
 * @param {PositionValue} posigtion
 */
function apply(element, position) {

  for (let prop of ['top', 'bottom', 'left', 'right']) {
    let value = position[prop]
    if ('undefined' === typeof value)
      value = '';
    else if ('number' === typeof value)
      value = value + 'px';
    element.style[prop] = value;
  }

  element.style.position = ('undefined' === typeof position.position) ? '' : position.position;


  if(element.shadowRoot) {
    const menu = element.shadowRoot.querySelector('.menu');
    if(menu)
      menu.style.transformOrigin = position.transformOrigin || '';
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
    return (menu) => positionForButton(menu, button)
  },

  /** 
   * Absolutely position the element at the given X and Y values
   * @param {number} left
   * @param {number} top
   * @return {PositionFunction}
   */
  Absolute: function (left, top) {
    return (menu) => apply(menu, {
      position: 'absolute',
      left,
      top
    })
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
    return (menu) => positionAtPoint(menu, left, top, verticalMargin)
  },

  /**
   * Show the menu centered above or below the point but contained
   * within the provided element
   * @param {number} left
   * @param {number} top
   * @param {HTMLElement} container
   * @return {PositionFunction}
   */
  AtPointWithin: function(left, top, container, verticalMargin = 16) {
    return (menu)=> positionAtPointWithin(menu, left, top, container, verticalMargin)
  }

}

export default Position;