import Menu from './Menu';
import Item from './Item';
import SubMenuItem from './SubMenuItem';
import Animation from './Animation'
import TabList from './TabList';
import Attributes from './Attributes';

import {ReusableStyleSheet} from './Style';
import style from '../style/nestedmenu.scss';


class NestedMenu extends Menu {
    constructor() {
        super();
        const shadow = this.shadowRoot;
        NestedMenu.stylesheet.addToShadow(shadow);

        const menuRoot = shadow.querySelector('.menu');
        menuRoot.classList.add('menu-nestedmenu');

        this.stack = [];
    }

    static create(items) {
        return Menu.create(NestedMenu, items);
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

    get currentMenu() {
        if(0 == this.stack.length)
            return this;
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

    popAll() {
        const container = this.shadowRoot.querySelector('.menu-outer');
        container.style.height = this.autoResize ? '' : '100%';
        const slider = this.shadowRoot.querySelector('.menu-inner');
        slider.style.transform = `translate3d(0,0,0)`;

        while(this.stack.length) {
            const closed = this.stack.pop();
            closed.isOpen = false;
        }
    }

    open() {
        const anim = super.open();
        if( ! anim)
            return null;

        this.popAll();

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
        const resize = this.autoResize;

        const anim = new Animation.Transition(slider, 'animation-stack');
        anim.ignoreChildren = false;
        anim.on('firstframe',()=>{
            // Set the height in frame one so it will never be unset
            // in frame two.  The animation only works going from one height
            // value to another.  Not from unset to a value
            if(resize)
                container.style.height = container.clientHeight;

        })
        anim.on('secondframe',()=>{
            const width = container.clientWidth;
            const offset = width * this.stack.length;

            if(resize) {
                const lastVisibleItem = this.currentMenu.displayItems.last;
                const desiredHeight = lastVisibleItem.offsetTop + lastVisibleItem.getBoundingClientRect().height;
                const maxHeight = window.innerHeight - this.getBoundingClientRect().top - 8;
                container.style.maxHeight = Math.ceil(maxHeight) + 'px';
                container.style.height = Math.ceil(desiredHeight) + 'px';
                container.classList.add('animate-height');
            }
   
            slider.style.transform = `translate3d(${(-offset)}px,0,0)`;
        })
        anim.on('complete',()=>{            
            if(itemToClose)
                itemToClose.isOpen = false;  

            /* 
               Resizes the current list to be the same height as the container so it scrolls properly.
               This needs to be fired after the height transition for this.element has complete because
               it uses the final value of the height.  That value isn't available until after the
               transition has completed.  It might also have been capped by max-height
            */
           const borderWidth = container.offsetWidth - container.clientWidth;
           const resolvedHeight = Math.min(this.clientHeight - borderWidth, container.clientHeight);
            if(resize) {
                container.classList.remove('animate-height');
                container.style.height = resolvedHeight + 'px';
            }
            scroller.style.height = resolvedHeight + 'px';

            // If we set focus before the transition is complete, the browser tries to move the focus
            // element into view immediatly which breaks the animation
            this.setFocusOn(this.focusItem);
        })

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

    /** @property {boolean} autoResize Will the menu grow bigger or smaller for sub menus*/
    get autoResize() {return Attributes.getTrueFalse(this, 'autoresize', true)}
    set autoResize(value) {Attributes.setTrueFalse(this, 'autoresize', value, true)}

    static get observedAttributes() {
        return Menu.observedAttributes.concat(['autoresize']);
    }

    attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback(name, oldValue, newValue);
        if('autoresize' == name && 'false' == newValue) {
            const container = this.shadowRoot.querySelector('.menu-outer');
            if( ! container.style.height)
                container.style.height = '100%';
        }
    }
}

Object.defineProperty(NestedMenu, 'tagName', {value: 'wam-nestedmenu'});

Object.defineProperty(NestedMenu, 'stylesheet', {value: new ReusableStyleSheet(style)});

export default NestedMenu;