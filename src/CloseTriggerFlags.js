export class CloseTriggerFlags {
  constructor(parent) {
      this._parent = parent;
      this._escape = this._pointerDownOutside = this._itemActivate = true;
  }

  /**
   * Menu will close if the user presses the Escape key
   * @property {boolean}
   */
  get escape() {return this._escape}
  set escape(value) {this._escape = value; this.updateAttribute()}

  /**
   * 
   */
  get pointerDownOutside() {return this._pointerDownOutside}
  set pointerDownOutside(value) {this._pointerDownOutside = value; this.updateAttribute()}

  /**
   * Menu will close when an item is activated.  
   * Does not include items that perform internal menu navigation such as 
   * opening a sub menu.
   * @property {boolean}
   */
  get itemActivate() {return this._itemActivate}
  set itemActivate(value) {this._itemActivate = value; this.updateAttribute()}

  /** 
   * Set the menu to close on any of the potential close events: escape, lost focus,
   * or activating an item.
   */
  all() {this._escape = this._pointerDownOutside = this._itemActivate = true;}

  /**
   * Ignore the potential close events.  A call to  #Menu.close must
   * be made to close the menu.
   */
  none() {this._escape = this._pointerDownOutside = this._itemActivate = false;}

  /**
   * Update the element attribute based on the internal values of this object.
   *  @private
   */
  updateAttribute() {
      const str = this.toString();
      this._parent.setAttribute('closeon', str);    
  }

  /**
   * Update the internal properties of this menu based on the element attribute value
   * @private
   */
  updateInternal() {
      this.fromString(this._parent.getAttribute('closeon'));
  }

  fromString(str) {
      if( ! str) {
          this._escape = true;
          this._pointerDownOutside = true;
          this._itemActivate = true;
      }

      const array = str.toLowerCase().split(',').map(s=>s.trim());
      if(0 == array.length || (1 == array.length && 'none' == array[0])) {
          this._escape = false;
          this._pointerDownOutside = false;
          this._itemActivate = false;
      } else if ( 1 == array.length && 'all' == array[0]) {
          this._escape = true;
          this._pointerDownOutside = true;
          this._itemActivate = true;
      } else {
          this._escape =  !! array.find(s=>s=='escape');
          this._pointerDownOutside = !! array.find(s=>s=='pointerdownoutside');
          this._itemActivate = !! array.find(s=>s=='itemactivate');
      }
  }

  toString() {
      const values = []
      if(this.escape)
          values.push('escape');

      if(this.pointerDownOutside)
          values.push('pointerdownoutside');

      if(this.itemActivate)
         values.push('itemactivate')

      if(3 == values.length)
          return 'all';
      if(0 == values.length)
          return 'none';

      return values.join(',');
  }
}

export default CloseTriggerFlags;
