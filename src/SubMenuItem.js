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
        slot.addEventListener('slotchange', this.setBorderRadii.bind(this));
        inner.appendChild(slot);
        outer.appendChild(inner);
        shadow.appendChild(outer);

        this.shadowRoot.querySelector('button').appendChild(Icon.Nested);
        
        /** */
        this.items = new ItemCollection(this, inner);
    }

    get shadowMenu() {return this.shadowRoot.querySelector('[role=menu]');}

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

    /** @property {boolean} isOpen */
    get isOpen() {return this.shadowMenu.style.display != 'none';}
    set isOpen(isOpen) {
        const submenu = this.shadowMenu;
        const width = this.getBoundingClientRect().width;
        if( ! isOpen) {
            submenu.style.display = 'none';
        } else {
            submenu.style.display = '';
            submenu.style.left = width + 'px';
            this.setBorderRadii();
        }
            
    }

    setBorderRadii() {
        this.backItem.shadowItem.classList.add('round-top');
        for(let item of this.items) {
            item.shadowItem.classList.remove(['round-top', 'round-bottom', 'round-right', 'round-left']);
        }
        if(this.items.length > 0);
            this.items.atIndex(this.items.length-1).shadowRoot.querySelector('.menu-item').classList.add('round-bottom');
    }
}

Object.defineProperty(SubMenuItem, 'tagName', {value:'wam-submenu'});

export default SubMenuItem;