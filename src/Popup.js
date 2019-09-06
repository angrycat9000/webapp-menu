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

    updateItem(item, i , items) {
        item.setAppearance({
            hideIcon: ! this._hasIcons,
            hideLabel: false,
            roundTop: 0 == i,
            roundBottom: i == items.length - 1
        })
    }

    updateItems() {
        this._hasIcons = false;
        for(item of this.items) {
            if(item.hasIcon) {
                this._hasIcons = true;
                break;
            }
        }
        super.setItemStyles();
    }
}

Popup.tagName = 'wam-popup';

export default Popup;