import Item from './Item';
import ItemCollection from './ItemCollection';
import Icon from './Icon';
import {nextId} from './Id';

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
        outer.id = nextId();
        const inner = document.createElement('div');
        inner.className = 'submenu-inner';

        const back = Item.create({icon:Icon.Back, label:'Back'});
        back.shadowItem.setAttribute('aria-label', 'Back to previous level');
        inner.appendChild(back);

        const slot = document.createElement('slot');
        //slot.addEventListener('slotchange', this.updateItems.bind(this));
        inner.appendChild(slot);
        outer.appendChild(inner);
        shadow.appendChild(outer);

        this.shadowItem.appendChild(Icon.Nested);
        this.shadowItem.setAttribute('aria-controls', outer.id);
        this.shadowItem.setAttribute('aria-expanded', false)
        
        /** */
        this.items = new ItemCollection(this, inner);
    }

    get shadowMenu() {return this.shadowRoot.querySelector('[role=menu]');}

    /** @property {Item} backItem Back button item from the shadow DOM */
    get backItem() {
        return this.shadowRoot.querySelector('wam-item');
    }

    get displayItems() {return new TabList([this.backItem].concat(Array.from(this.items)))}

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
        this.shadowItem.setAttribute('aria-expanded', isOpen);
        const submenu = this.shadowMenu;
        const width = this.getBoundingClientRect().width;
        if( ! isOpen) {
            submenu.style.display = 'none';
        } else {
            submenu.style.display = '';
            submenu.style.left = width + 'px';
        }
    }
}

Object.defineProperty(SubMenuItem, 'tagName', {value:'wam-submenu'});

export default SubMenuItem;