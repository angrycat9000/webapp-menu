import Item from './Item';
import ItemCollection from './ItemCollection';
import Icon from './Icon';
import {nextId} from './Id';
import TabList from './TabList';

import {ReusableStyleSheet} from './Style';
import style from '../style/submenu.scss';

/**
 * Occurs when an submenu item is opened
 * @event wam-submenu-open
 * @type {CustomEvent}
 * @property {Item} detail.item
 * @property {Menu} detail.menu
 * @property {Event} detail.source
 */

/**
 * Occurs when an submenu item is closed
 * @event wam-submenu-close
 * @type {CustomEvent}
 * @property {Item} detail.item
 * @property {Menu} detail.menu
 * @property {Event} detail.source
 */

/**
 * 
 */
export class SubMenuItem extends Item {
    constructor() {
        super();

        const shadow = this.shadowRoot;
        SubMenuItem.stylesheet.addToShadow(shadow);
        
        const outer = document.createElement('div');
        outer.className = 'submenu-outer';
        outer.style.display = 'none';
        outer.setAttribute('role', 'menu');
        outer.id = nextId();
        const inner = document.createElement('div');
        inner.className = 'submenu-inner';

        const back = Item.create({ label:'Back'});
        const backIcon = Icon.Back;
        backIcon.setAttribute("slot", "icon");
        back.appendChild(backIcon);
        back.shadowItem.setAttribute('aria-label', 'Back to previous level');
        back.classList.add('back');
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
        this.items = new ItemCollection(this);
    }

    get shadowMenu() {return this.shadowRoot.querySelector('[role=menu]');}

    /** @property {Item} backItem Back button item from the shadow DOM */
    get backItem() {
        return this.shadowRoot.querySelector('wam-item');
    }

    get displayItems() {return new TabList([this.backItem].concat(Array.from(this.items)))}

    get topMenu() {
        let e = this.parentElement;
        while(e && 'wam-nestedmenu' !== e.tagName.toLowerCase()) {
            e = e.parentElement;
        }
        return e;
    }

    get iconFactory() {
        return this.topMenu.iconFactory;
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

    get scrollTop() {return this.shadowRoot.querySelector('.submenu-inner').scrollTop;}
    set scrollTop(value) {this.shadowRoot.querySelector('.submenu-inner').scrollTop = value;}

    /** @property {boolean} isOpen */
    get isOpen() {return this.shadowMenu.style.display != 'none';}
    set isOpen(isOpen) {
        this.shadowItem.setAttribute('aria-expanded', isOpen);
        const submenu = this.shadowMenu;

        if( ! isOpen) {
            submenu.style.display = 'none';
            this.shadowRoot.querySelector('.submenu-inner').style.height  ='';
        } else {
            const top = this.topMenu.shadowRoot.querySelector('.top-level-scroller').scrollTop;
            submenu.style.display = '';
            submenu.style.top = top + 'px';
        }
    }
}

Object.defineProperty(SubMenuItem, 'tagName', {value:'wam-submenu'});

Object.defineProperty(SubMenuItem, 'stylesheet', {value: new ReusableStyleSheet(style)})

export default SubMenuItem;