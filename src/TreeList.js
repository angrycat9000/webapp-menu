import Menu from './Menu';
import Item from './Item';
import SubMenuItem from './SubMenuItem';
import Animation from './Animation'
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

    onKeyDown(e) {
        super.onKeyDown(e);

        let item = this.getFocused();
        if( ! item)
            return;

        if('ArrowRight' == e.key && item instanceof SubMenuItem) {
            this.activate(item, e);
        } else if('ArrowLeft' == e.key && this.topSubMenu && item == this.topSubMenu.backItem) {
            this.activate(item, e);
        }
    }

    open() {
        const anim = super.open();
        if( ! anim)
            return null;

        // replace default open first frame with one that clears out the open submenus
        anim.off('firstframe');
        anim.on('firstframe', ()=>{
            this.shadowRoot.querySelector('.menu').style.display = '';

            while(this.stack.length) {
                const closed = this.stack.pop();
                closed.isOpen = false;
            }
            this.stackChanged().immediate()

            this.applyPosition();
            if(this.controlledBy)
                this.controlledBy.setAttribute('aria-expanded', this.isOpen);
        });

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
        return this.startTransition(this.stackChanged());
    }

    /**
     * @return {Transition}
     */
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
            return null;

        const closed = this.stack.pop();

        const anim = this.stackChanged(closed);

        return this.startTransition(anim);
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

    /**
     * @param {function} beforeHeightResolved any code that needs to get run before
     *                                          after the animation, but before the final 
     *                                          height of the container is resolved
     */
    stackChanged(itemToClose) {
        const container = this.shadowRoot.querySelector('.menu-outer');
        const slider = this.shadowRoot.querySelector('.menu-inner');
        const scroller = this.getMenuContentElement(this.stack.length);

        const anim = new Animation.Transition(container, 'animation-stack');
        anim.ignoreChildren = false;
        anim.on('firstframe',()=>{
            const offset = container.clientWidth * this.stack.length;
            slider.style.transform = `translate3d(${(-offset)}px,0,0)`;
            const desiredHeight = this.stack.length ? scroller.scrollHeight : scroller.offsetHeight;
            container.style.height = desiredHeight + 'px';
        })
        anim.on('complete',()=>{
            /* 
               Resizes the current list to be the same height as the container so it scrolls properly.
               This needs to be fired after the height transition for this.element has complete because
               it uses the final value of the height.  That value isn't available until after the
               transition has completed.  It might also have been capped by max-height
            */
            if(itemToClose)
                itemToClose.isOpen = false;  
            const borderWidth = container.offsetWidth - container.clientWidth;
            const resolvedHeight = Math.min(this.clientHeight - borderWidth, container.clientHeight);
            scroller.style.height = resolvedHeight + 'px';
            container.style.height = resolvedHeight + 'px';
            this.setFocusOn(this.focusItem);
        }, null, 1)


        return anim;
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