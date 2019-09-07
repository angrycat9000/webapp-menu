import Menu from './Menu';
import Item from './Item';
import SubMenuItem from './SubMenuItem';
import TabList from './TabList';

import {ReusableStyleSheet} from './Style';
import style from '../style/treelist.scss';


class TreeList extends Menu {
    constructor() {
        super();
        const shadow = this.shadowRoot;
        TreeList.stylesheet.addToShadow(shadow);

        const menuRoot = shadow.querySelector('.menu');
        menuRoot.classList.add('menu-treelist');
        menuRoot.classList.remove('menu-background');
        const background = document.createElement('div');

        background.className ='menu-background';
        shadow.insertBefore(background, shadow.firstElementChild);

        this.stack = [];
    }

    static create(items) {
        const treelist = document.createElement(TreeList.tagName);
        treelist.items.set(items);
        return treelist;
    }

    get displayItems() {
        const source = this.topSubMenu ? [this.topSubMenu.backItem, ...this.topSubMenu.items] : this.items;
        return new TabList(source);
    }

    get topSubMenu() {
        if(0 == this.stack.length)
            return null;
        return this.stack[this.stack.length - 1];
    }

    activate(item, sourceEvent) {
        if(item.disabled)
            return;

        if(item instanceof SubMenuItem) 
            this.openChild(item);
        else if(this.topSubMenu && item == this.topSubMenu.backItem)
            this.closeChild(item, sourceEvent);
        else
            super.activate(item, sourceEvent);
    }

    open(suppressFocus) {
        const anim = super.open(suppressFocus);
        if(anim)
            anim.on('firstframe', this.stackChanged, this);
        return anim;
    }

    /**
     * 
     */
    openChild(item, sourceEvent) {
        const event = new CustomEvent('wam-submenu-open', {
            bubbles:true,
            detail: {
                item: item,
                menu: this,
                source: sourceEvent
            }
        });

        if( ! item.dispatchEvent(event))
            return;

        this.stack.push(item);
        item.isOpen = true;
        this.stackChanged();
    }

    closeChild(sourceEvent) {
        if(0 == this.stack.length)
            return;

        const target = this.topSubMenu;

        const event = new CustomEvent('wam-submenu-close', {
            bubbles:true,
            detail: {
                item: target,
                menu: this,
                source: sourceEvent
            }
        });

        if( ! target.dispatchEvent(event))
            return;

        const closed = this.stack.pop();
        closed.isOpen = false;
        this.stackChanged();
    }

    getFocused() {
        let focused = super.getFocused();
        // if it is a submenu, check it has a focused item (ie. the back button)
        if(focused instanceof SubMenuItem 
            && focused.shadowRoot.activeElement 
            && focused.shadowRoot.activeElement instanceof Item)
            focused = focused.shadowRoot.activeElement;

        //make sure that focused isn't in a different submenu frame
        if(this.interactiveItems.array.indexOf(focused) < 0)
            return null;
        return focused;
    }

    getMenuContentElement(i) {
        if(0 == i)
            return this.shadowRoot.querySelector('.menu-inner');
        if(i > this.stack.length)
            return 0;
        
        const frame = this.stack[i-1];
        return frame.shadowRoot.querySelector('.submenu-inner');
        
    }

    stackChanged() {
        this.setFocusOn(this.focusItem);
        const outer = this.shadowRoot.querySelector('.menu-outer');
        const inner = this.shadowRoot.querySelector('.menu-inner');

        let offset = 0;
        for(let i = 0; i < this.stack.length; i++) {
            offset += this.getMenuContentElement(i).offsetWidth;
        }
        
        const frame = this.getMenuContentElement(this.stack.length);
        const bg = this.shadowRoot.querySelector('.menu-background');
        bg.style.width = frame.offsetWidth + 'px';     
        bg.style.height = frame.offsetHeight + 'px';   
        inner.style.left = (-offset) + 'px';
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

Object.defineProperty(TreeList, 'tagName', {value: 'wam-treelist'});

Object.defineProperty(TreeList, 'stylesheet', {value: new ReusableStyleSheet(style)});

export default TreeList