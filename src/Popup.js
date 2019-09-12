import Menu from './Menu';

import {ReusableStyleSheet} from './Style';
import style from '../style/popup.scss';


class Popup extends Menu {
    constructor() {
        super();

        Popup.stylesheet.addToShadow(this.shadowRoot);
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

    updateAllItems() {
        this._hasIcons = false;
        for(let item of this.items) {
            if(item.hasIcon) {
                this._hasIcons = true;
                break;
            }
        }
        super.updateAllItems();
    }
}

Object.defineProperty(Popup, 'tagName', {value: 'wam-popup'})

Object.defineProperty(Popup, 'stylesheet', {value: new ReusableStyleSheet(style)});

export default Popup;