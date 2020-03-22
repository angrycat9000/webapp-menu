import Menu from './Menu';
import Attributes from './Attributes';
import {ReusableStyleSheet} from './Style';
import style from '../style/popup.scss';


class Popup extends Menu {
    constructor() {
        super();

        Popup.stylesheet.addToShadow(this.shadowRoot);
        this.shadowRoot.querySelector('.menu').classList.add('menu-popup');
        this._convertToPopup();
    }

    static get observedAttributes() {
        return super.observedAttributes.filter(attribute => 'popup' !== attribute).concat('static')
    }

    attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback(name, oldValue, newValue);

        if('static' === name) {
            const isPopup = null === newValue;
            if(isPopup)
                this._convertToPopup();
            else
                this._convertToStatic();
        }
    }
    
    static create(items) {
        return Menu.create(Popup, items)
    }

    get isPopup() {return ! Attributes.getExists(this, 'static');}
    set isPopup(value) {Attributes.setExists(this, 'static', ! value)}

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