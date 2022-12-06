/**
 * List of interactive items that can take focus.
 */
class FocusList {
  /**
   * @param {(Array<HTMLElement>|Iterable<HTMLElement>)} source An array, array-like, or iterable object containing HTMLElements that compose the list of elements this object will manage focus for.
   */
  constructor(source) {
    this._items = source || [];
    if (!Array.isArray(source)) this._items = Array.from(source);
  }

  /**
   * The number of items in the list
   * @type {number}
   */
  get length() {
    return this._items.length;
  }

  /**
   * The first element in the list.
   * @type {?HTMLElement}
   */
  get first() {
    return 0 == this._items.length ? null : this._items[0];
  }

  /**
   * The last element in the list.
   * @type {?HTMLElement}
   */
  get last() {
    return 0 == this._items.length ? null : this._items[this._items.length - 1];
  }

  /** 
   * The element that is after the current focus element.
   * @type {?HTMLElement}
   */
  get next() {
    const index = this.defaultFocusIndex;
    if (-1 === index) {
      return this.first;
    }

    const nextIndex = (index + 1) % this._items.length;
    return this._items[nextIndex];
  }

  /**
   * The item that will be focused when the left of up arrow is pressed.  This will wrap to the last item
   * if the first item is currently focused.
   * @type {?HTMLElement}
   */
  get previous() {
    const index = this.defaultFocusIndex;
    if (-1 === index) {
      return this.last;
    }

    const nextIndex = (index - 1 + this._items.length) % this._items.length;
    return this._items[nextIndex];
  }

  /**
   * The current element.  It either has focus, or will get focus when the parent element is focused.
   * @type {?HTMLElement}
   */
  get defaultFocus() {
    return this._items.find((item) => item.isDefaultFocus);
  }

  /**
   * The index of the defaultFocus element in the list.  If there is no default focus, -1 is returned.
   * @type {number}
   */
  get defaultFocusIndex() {
    return this._items.findIndex((item) => item.isDefaultFocus);
  }

  *[Symbol.iterator]() {
    for (let e of this._items) yield e;
  }
  
  /**
   * Make sure that there is a default element set so that it will receive focus.
   */
  insureDefaultSet() {
    if(!this.defaultFocus && this._items.length > 0) {
        this.first.isDefaultFocus = true;
    }
  }

  /**
   * Set the current element in the list and set focus to it.
   * @param {HTMLElement} itemToFocus the item to set the default focus to
   */
  focusOn(itemToFocus) {
    for (const item of this._items) {
      const isDefaultFocus = item === itemToFocus;
      item.isDefaultFocus = isDefaultFocus;
      if (isDefaultFocus) {
        item.focus();
      }
    }
  }

  /**
   * Set the first element as the current element and set focus to it.
   */
  focusFirst() {
    this.focusOn(this.first);
  }

  /**
   * Set the next element as the current element and set focus to it.
   */
  focusNext() {
    this.focusOn(this.next);
  }


  /**
   * Set the previous element as the current element and set focus to it.
   */
  focusPrevious() {
    this.focusOn(this.previous);
  }
}

export default FocusList;
