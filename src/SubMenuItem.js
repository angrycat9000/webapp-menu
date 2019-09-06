import Item from './Item';
import ItemCollection from './ItemCollection';
import Icon from './Icon';
import Attributes from './Attributes';

import {reusableStyleSheetsFunction} from './Style';
import style from '../style/submenu.scss';
const getStyleSheets = reusableStyleSheetsFunction(style);


export class SubMenuItem extends Item {
    constructor() {
        super();

        const shadow = this.shadowRoot;
        shadow.adoptedStyleSheets = [...shadow.adoptedStyleSheets, ...getStyleSheets()];
        
        const outer = document.createElement('div');
        outer.className = 'submenu-outer';
        outer.style.display = 'none';
        outer.setAttribute('role', 'menu');
        const inner = document.createElement('div');
        inner.className = 'submenu-inner';

        const back = Item.create({icon:Icon.Back, label:'Back'});
        back.shadowRoot.querySelector('button').setAttribute('aria-label', 'Back to previous level');
        inner.appendChild(back);

        const slot = document.createElement('slot');
        //slot.setAttribute('name','menu');
        inner.appendChild(slot);
        outer.appendChild(inner);
        shadow.appendChild(outer);

        this.shadowRoot.querySelector('button').appendChild(Icon.Nested);
        this.items = new ItemCollection(this, inner);
    }

    /** @property {Item} backItem Back button item from the shadow DOM */
    get backItem() {
        return this.shadowRoot.querySelector('wam-item');
    }

    /**
     * Determine if this is an action on the child items (instead of the open root item)
     * @param {Array<Node>} targetPath
     * @return {boolean}
     */
    isChildItem(targetPath) {
        if( ! targetPath)
            return false;

        for(let item of targetPath) {
            if(item == this)
                return false;
            if(item instanceof Item)
                return true;
        }
        return false;
    }

    set isOpen(value) {Attributes.setExists(this, 'open', value)}
    get isOpen() {return Attributes.getExists(this, 'open')}


    static get observedAttributes() {
        return Item.observedAttributes.concat('open');
    }


    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case 'open':

                this.applyOpenState(newValue !== null);
                break;
            default:
                super.attributeChangedCallback(name, oldValue, newValue);
                break;
        }
    }

    applyOpenState(isOpen) {
        const submenu = this.shadowRoot.querySelector('[role=menu]');
        const width = this.getBoundingClientRect().width;
        if(isOpen) {
            submenu.style.display = '';
            submenu.style.left = width + 'px';
        } else
            submenu.style.display = 'none';
    }
}

Object.defineProperty(SubMenuItem, 'tagName', {value:'wam-submenu'});

export default SubMenuItem;