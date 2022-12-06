import {ReusableStyleSheet} from './Style';
import separatorStyle from '../style/separator.scss';
import setItemContextAttributes from './setItemContextAttributes';

/**
 * Non-interactive separator to group different menu items
 * 
 * @element wam-separator
 */
export default class SeparatorElement extends HTMLElement {

    #separator;

    static get tagName() {
      return "wam-separator";
    }

    constructor() {
        super();
        const shadow = this.attachShadow({mode: 'open'});

        shadow.innerHTML = `<div role="separator"></div>`;
        this.#separator = shadow.firstElementChild;
        SeparatorElement.stylesheet.addToShadow(shadow);
    }

   /**
   * Set attributes based on the context of the parent.
   * @protected
   */
  setContextFromParent(parent, index, items) {
    setItemContextAttributes(this.#separator, index, parent, items);
  }
}

Object.defineProperty(SeparatorElement, 'stylesheet', {value: new ReusableStyleSheet(separatorStyle)})