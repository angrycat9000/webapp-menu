import Menu from './Menu';

import {reusableStyleSheetsFunction} from './Style';
import style from '../style/popup.scss';
const getStyleSheets = reusableStyleSheetsFunction(style);

class Popup extends Menu {
    constructor() {
        super();
        this.shadowRoot.adoptedStyleSheets = [...this.shadowRoot.adoptedStyleSheets, ...getStyleSheets()];
        this.shadowRoot.querySelector('.menu').classList.add('menu-popup');
    }

    static create(items) {
        const popup = document.createElement(Popup.tagName);
        //if( ! (popup instanceof Popup))
        //    throw new Error(`Popup (${Popup.tagName}) not registered as custom element`);

        popup.items.set(items);
        return popup;
    }
}

Popup.tagName = 'wam-popup';

export default Popup;