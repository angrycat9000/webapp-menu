class FocusList {
  constructor(source) {
    this._items = source || [];
    if (!Array.isArray(source)) this._items = Array.from(source);
  }

  get length() {
    return this._items.length;
  }

  get first() {
    return 0 == this._items.length ? null : this._items[0];
  }

  get last() {
    return 0 == this._items.length ? null : this._items[this._items.length - 1];
  }

  get next() {
    const index = this.defaultFocusIndex;
    if (-1 === index) {
      return this.first;
    }

    const nextIndex = (index + 1) % this._items.length;
    return this._items[nextIndex];
  }

  get previous() {
    const index = this.defaultFocusIndex;
    if (-1 === index) {
      return this.last;
    }

    const nextIndex = (index - 1 + this._items.length) % this._items.length;
    return this._items[nextIndex];
  }

  get defaultFocus() {
    return this._items.find((item) => item.isDefaultFocus);
  }

  get defaultFocusIndex() {
    return this._items.findIndex((item) => item.isDefaultFocus);
  }

  *[Symbol.iterator]() {
    for (let e of this._items) yield e;
  }
  
  insureDefaultSet() {
    if(!this.defaultFocus && this._items.length > 0) {
        this.first.isDefaultFocus = true;
    }
  }


  focusOn(itemToFocus) {
    for (const item of this._items) {
      const isDefaultFocus = item === itemToFocus;
      item.isDefaultFocus = isDefaultFocus;
      if (isDefaultFocus) {
        item.focus();
      }
    }
  }

  focusFirst() {
    this.focusOn(this.first);
  }

  focusNext() {
    this.focusOn(this.next);
  }

  focusPrevious() {
    this.focusOn(this.previous);
  }
}

export default FocusList;
