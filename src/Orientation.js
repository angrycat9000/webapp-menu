/**
 * Layout direction of the control.
 * @enum {string}
 * @readonly
 */
const Orientation = {
  /** The items are arranged in a top to bottom layout */
  Vertical: 'vertical',
  /** The items are arranged in a left to right (or right to left) pattern */
  Horizontal: 'horizontal',
};

// Work around that JS Doc does not include the values if export or freeze are used.
// https://github.com/jsdoc/jsdoc/issues/777
// https://github.com/jsdoc/jsdoc/issues/1657
Object.freeze(Orientation);
export {Orientation};
