class Container extends HTMLElement {
  constructor() {
    this._orientation = MenuOrientationHorizontal;
  }

  /** @property {MenuOrientation} */
  get orientation() { return this._orientation; }
  set orientation(value) { this._orientation = value; }


  
}