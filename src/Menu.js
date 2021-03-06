import Animation from './Animation';
import Position from './Position';
import Item from './Item';
import {nextId} from './Id';
import ItemCollection from './ItemCollection';
import TabList from './TabList';
import Attributes from './Attributes';

import {ReusableStyleSheet} from './Style';
import style from '../style/menu.scss';


class CloseTriggerFlags {
    constructor(parent) {
        this._parent = parent;
        this._escape = this._pointerDownOutside = this._itemActivate = true;
    }

    /**
     * Menu will close if the user presses the Escape key
     * @property {boolean}
     */
    get escape() {return this._escape}
    set escape(value) {this._escape = value; this.updateAttribute()}

    /** 
     * Menu will close if the focus moves outside of the menu
     * @property {boolean}
     * @deprecated
     */
    get lostFocus() {return false}
    set lostFocus(value) {}

    /**
     * 
     */
    get pointerDownOutside() {return this._pointerDownOutside}
    set pointerDownOutside(value) {this._pointerDownOutside = value; this.updateAttribute()}

    /**
     * Menu will close when an item is activated.  
     * Does not include items that perform internal menu navigation such as 
     * opening a sub menu.
     * @property {boolean}
     */
    get itemActivate() {return this._itemActivate}
    set itemActivate(value) {this._itemActivate = value; this.updateAttribute()}

    /** 
     * Set the menu to close on any of the potential close events: escape, lost focus,
     * or activating an item.
     */
    all() {this._escape = this._pointerDownOutside = this._itemActivate = true;}

    /**
     * Ignore the potential close events.  A call to  #Menu.close must
     * be made to close the menu.
     */
    none() {this._escape = this._pointerDownOutside = this._itemActivate = false;}

    /**
     * Update the element attribute based on the internal values of this object.
     *  @private
     */
    updateAttribute() {
        const str = this.toString();
        this._parent.setAttribute('closeon', str);    
    }

    /**
     * Update the internal properties of this menu based on the element attribute value
     * @private
     */
    updateInternal() {
        this.fromString(this._parent.getAttribute('closeon'));
    }

    fromString(str) {
        if( ! str) {
            this._escape = true;
            this._pointerDownOutside = true;
            this._itemActivate = true;
        }

        const array = str.toLowerCase().split(',').map(s=>s.trim());
        if(0 == array.length || (1 == array.length && 'none' == array[0])) {
            this._escape = false;
            this._pointerDownOutside = false;
            this._itemActivate = false;
        } else if ( 1 == array.length && 'all' == array[0]) {
            this._escape = true;
            this._pointerDownOutside = true;
            this._itemActivate = true;
        } else {
            this._escape =  !! array.find(s=>s=='escape');
            this._pointerDownOutside = !! array.find(s=>s=='pointerdownoutside');
            this._itemActivate = !! array.find(s=>s=='itemactivate');
        }
    }

    toString() {
        const values = []
        if(this.escape)
            values.push('escape');

        if(this.pointerDownOutside)
            values.push('pointerdownoutside');

        if(this.itemActivate)
           values.push('itemactivate')

        if(3 == values.length)
            return 'all';
        if(0 == values.length)
            return 'none';

        return values.join(',');
    }
}

/**
 * @enum Direction
 */
export const Direction  = {
    TopToBottom: 'v',
    LeftToRight: 'h',
};

/**
 * Occurs when a menu element is opened.
 * @event wam-open
 * @type {CustomEvent}
 * @property {Menu} detail.menu
 */

/**
 * Occurs when a menu element is closed.
 * @event wam-close
 * @type {CustomEvent}
 * @property {Menu} detail.menu
 */

/**
 * Base class for list of items that are menus. Ie. that use arrow keys to move between a list of items.
 * @fires wam-open
 * @fires wam-close
 */
export class Menu extends HTMLElement {

    constructor() {
        super();

        const shadow = this.attachShadow({mode: 'open'});
        Menu.stylesheet.addToShadow(shadow);
        const outer = document.createElement('div');
        outer.style.display='none';
        outer.className = 'menu menu-outer';
        outer.setAttribute('role', 'menu');
        const inner = document.createElement('div');
        inner.className = 'menu-inner';
        const slot = document.createElement('slot');
        inner.appendChild(slot);
        outer.appendChild(inner);
        shadow.appendChild(outer);

        shadow.querySelector('slot').addEventListener('slotchange', this.updateAllItems.bind(this));

        /**
         * Caller editable list of items. 
         * 
         * Subclasses may add or filter items with the Menu#displayItems and Menu#interativeItems properies.
         * @see Menu#interactiveItems
         * @property {ItemCollection} items 
         */
        this.items = new ItemCollection(this);

        /**
         * @property {Direction}
         */
        this.direction = Direction.TopToBottom;

        /** 
         * Events that will cause the menu to close
         * @property {CloseTriggerFlags} closeOn
         */
        Object.defineProperty(this, 'closeOn', {value:new CloseTriggerFlags(this)});

        this.addEventListener('keydown', Menu.onKeyDown);
        this.addEventListener('keypress', Menu.onKeyPress);
        this.addEventListener('click', Menu.onClick);

        this._state = this._previousState = 'closed';
        this._windowResizeFunc = (e)=>{this.onWindowResize(e)}
        this._windowPointerFunc = (e)=>{this.onWindowPointerDown(e)}


        /** @property {PositionFunction} position */
        this._position = Position.None;


        
    }

    /**
     * @param {class} type
     * @param {Array<Item>} items
     */
    static create(type, items) {
        if( ! type.tagName)
            throw new Error('Type to create must extend Menu and must have a tagName attribute');

        const menu = document.createElement(type.tagName);
        
        if(Array.isArray(items))
            menu.items.set(items)

        return menu;
    }

    /** 
     * Items that can be cycled through using the arrow keys.
     * 
     * Subclasses may use this to remove non-tabbable items (eg. seperators).  Typically
     * a subset of Menu#displayedItems
     * 
     * @see Menu#items
     * @see Menu#displayedItems
     * @property {TabList} interactiveItems
     */
    get interactiveItems() {return this.displayItems;}

    /**
     * Items that are visible to the user. 
     * 
     * Subclasses may use this to add items like seperators or default options.
     * 
     * @see Menu#items
     * @see Menu#displayedItems
     */
    get displayItems() {return new TabList(this.items);}

    /** @property {boolean} useAnimation */
    get useAnimation() {return Attributes.getTrueFalse(this, 'useanimation', true)}
    set useAnimation(value) {Attributes.setTrueFalse(this, 'useanimation', value)}

    /**
     * @property {boolean} isOpen
     */
    get isOpen() {return Attributes.getExists(this, 'open')};
    set isOpen(value) {Attributes.setExists(this, 'open', value)}
    
    /**
     * @property {HTMLElement} controlledBy Element that controls this this menu.
     */
    get controlledBy () {
        const id = this.getAttribute('controlledBy');
        if( ! id)
            return null;
        return this.getElementById(id);
    }
    set controlledBy(value) {
        if( ! value)
            Attributes.setString(this, 'controlledby', null)
        else {
            if( ! value.id)
                value.id = nextId();
            this.setAttribute('controlledBy', value.id);
        }
    }

    get position() {return this._position}
    set position(value) {
        this._position = value;
        if(this.isOpen)
            this.applyPosition();
    }


    /** @property {iconFactoryFunction} iconFactory */
    get iconFactory() {return this._iconFactory}
    set iconFactory(value) {
        this._iconFactory = value;
        for(let item of this.items)
            item.updateFactoryIcon();
    }

    /**
     * Web component life cycle helper to define what attributes trigger #attributeChangedCallback
     */
    static get observedAttributes() {
        return ['open', 'closeon', 'controlledby'];
    }
    /**
     * Web component life cycle when an attribute on the element is changed
     */
    attributeChangedCallback(name, oldValue, newValue) {
        switch(name) {

            case 'open':
                if(null != newValue && 'false' != newValue)
                    this.open();
                else
                    this.close();
                break;

            case 'controlledby':
                this.setControlledByElement(this.getElementById(newValue));
                break;

            case 'closeon':
                this.closeOn.updateInternal();    
        }
    }

    /**
     * @param {HTMLElement} element
     * @return {Menu} Get the Menu object that this element is contained in
     */
    static fromElement(element) {
        while(element &&  ! (element instanceof Menu)) {
            element = element.parentElement;
        }
        return element;
    }
    
    isFocusWithin() {
        let focused = document.activeElement;
        while(focused) {
            if(focused === this)
                return true;
            focused = focused.parentElement
        }
        return false;  
    }

    onPointerDownOutside() {
        if(this.closeOn.pointerDownOutside && 'open' == this.state )
            this.close();
    }

    /**
     * If the menu is opened, closed, or in transition.  Public callers use isOpen
     * @property {string} state;
     * @private
     */
    get state() {return this._state;}
    set state(value) {
        this._state = value;
        
        this.isOpen = 'open' == value || 'opening' == value;
    }

    startTransition(transition) {
        window.requestAnimationFrame(()=>{
            if( ! this.useAnimation)
                transition.immediate();
            else
                transition.firstFrame();
        });
        return transition;
    }

    applyPosition() {
        if(this.position && 'function' == typeof this.position)
            this.position(this);
    }

    /**
     * @return {Transition} null if the menu is already open.  Otherwise a Transition.
     */
    open() {
        if('open' == this.state|| 'opening' == this.state)
            return null;

        const event = new CustomEvent('wam-menu-open', {
            bubbles:true,
            cancelable:false,
            detail: {
                menu: this,
            }
        });

        this.dispatchEvent(event);

        this.previousFocus = this.parentElement ? document.activeElement : null;
        this.state = 'opening';

        const menuElement = this.shadowRoot.querySelector('.menu');


        let anim = new Animation.Transition(menuElement, 'animation-show');
        anim.on('firstframe', (e)=>{
            menuElement.style.display = '';
            this.applyPosition();
            if(this.controlledBy)
                this.controlledBy.setAttribute('aria-expanded', this.isOpen);

            window.addEventListener('resize', this._windowResizeFunc);
            window.addEventListener('touchstart', this._windowPointerFunc);
            window.addEventListener('mousedown', this._windowPointerFunc);
        });
        anim.on('secondframe',()=>{
            this.setFocusOn(this.focusItem);
        })

        anim.on('complete',()=>{
            this.state = 'open';
        })

        return this.startTransition(anim);
    }

    /**
     * @return {Transition} Null if it is already closed
     */
    close() {
        if(this.state == 'closed' || this.state == 'closing')
            return null;
    
        const event = new CustomEvent('wam-menu-close', {
            bubbles:true,
            cancelable:false,
            detail: {
                menu: this,
            }
        });
        this.dispatchEvent(event);

        this.state = 'closing';

        let anim = new Animation.Transition(this.shadowRoot.querySelector('.menu'), 'animation-hide');
        anim.on('firstframe',(e)=>{
            window.removeEventListener('resize', this._windowResizeFunc);
            window.removeEventListener('touchstart', this._windowPointerFunc);
            window.removeEventListener('mousedown', this._windowPointerFunc);
        });

        anim.on('secondframe', ()=>{
            if(this.previousFocus && ( ! document.activeElement || document.activeElement === document.body || this.isFocusWithin()))
                this.previousFocus.focus();
            
            this.previousFocus = null;
            this.setFocusOn(null);
        })

        anim.on('complete', ()=>{
            if(this.state != 'closing')
                return;

            this.state = 'closed';
            this.shadowRoot.querySelector('.menu').style.display = 'none';
        });

        return this.startTransition(anim);
    }


    /**
     * @return {HTMLElement|null} focused item in this menu or null if the focus is outside of this parent
     */
    getFocused() {
        const focused = document.activeElement;
        const menu = Menu.fromElement(focused);
        if(menu != this)
            return null;
        
        return focused;
    }


    onWindowPointerDown(e) {
        if(this.closeOn.pointerDownOutside && this !== Menu.fromElement(e.target))
            this.close();
    }

    onWindowResize() {
        if(this.isOpen)
            this.applyPosition();
    }

    /**
     * Web component life cycle when the element is added to the DOM
     */
    connectedCallback() {
        this._resizeListener = this.onWindowResize.bind(this);
        window.addEventListener('resize', this._resizeListener);

        const controlledBy = this.getAttribute('controlledBy');
        if(controlledBy)
            this.setControlledByElement(this.getElementById(controlledBy));
    }

    /**
     * Web component life cycle when the element is removed from the DOM
     */
    disconnectedCallback() {
        window.removeEventListener('resize', this._resizeListener);
        this.releaseControlledByElement()
    }
    
    /**
     * @property {Item} focusItem 
     */
    set focusItem(item) {
        for(let element of this.interactiveItems) {
            element.isDefaultFocus = (item == element);
        }
    }
    get focusItem() {
        const items = this.interactiveItems;
        return items.defaultFocusItem || items.first;
    }

    /**
     * Set the focused element of the current list.  Modifies tab index of items so
     * only the focused element has tabindex=0.  Others have tabindex=-1
     * @param {HTMLElement} item
     */
    setFocusOn(item) {
        this.focusItem = item;
        if(item)
            item.focus();
    }

    static onClick(e) {
        let menu = Menu.fromElement(e.currentTarget);
        if(menu)
            menu.onClick(e);
    }

    onClick(e) {
        const item = Item.fromEvent(e);
        if(item)
            this.activate(item, e);
    }

    static onKeyPress(e) {
        e.currentTarget.onKeyPress(e)
    }

    onKeyPress(e) {
        const key = e.key.toLowerCase();
        const matching = this.interactiveItems.array.filter(i=>i.label[0].toLowerCase() == key);
        if(0 == matching.length)
            return;
        const tablist = new TabList(matching);
        const next = tablist.next(tablist.defaultFocusItem);
        this.setFocusOn(next);
    }

    static onKeyDown(e) {
        e.currentTarget.onKeyDown(e)
    }

    /**
     * 
     */
    onKeyDown(e) {
        let item = this.getFocused();
        if( ! item)
            return;
    
        if('ArrowLeft' == e.key && Direction.LeftToRight == this.direction) {
            this.setFocusOn(this.interactiveItems.previous(item));
            e.preventDefault();
        } else if ('ArrowUp' == e.key && Direction.TopToBottom == this.direction) {
            this.setFocusOn(this.interactiveItems.previous(item));
            e.preventDefault();
         } else if('ArrowRight' == e.key && Direction.LeftToRight == this.direction) {
            this.setFocusOn(this.interactiveItems.next(item));
            e.preventDefault();
        } else if('ArrowDown' == e.key && Direction.TopToBottom == this.direction) {
            this.setFocusOn(this.interactiveItems.next(item));
            e.preventDefault();
        } else if('Escape' == e.key && this.closeOn.escape) {
            this.close();
        }
    }

    /**
     * @param {Item} item
     */
    activate(item, initiatingEvent) {
        if(item.disabled)
            return;

        const event = new CustomEvent('wam-item-activate', {
            bubbles:true,
            cancelable: true,
            detail: {
                item: item,
                menu: this,
                source:initiatingEvent
            }
        });

        if('function' == typeof item.action)
            item.action(event);

        const closeMenu = item.dispatchEvent(event);
        
        if(this.closeOn.itemActivate && closeMenu)
            this.close();    
    }

    /** @private */
    releaseControlledByElement() {
        const handlers = this._controlledByEventListeners;
        if( ! handlers || ! handlers.target)
            return;

        const controlledBy = handlers.target;
        controlledBy.removeAttribute('aria-haspopup');
        controlledBy.removeAttribute('aria-expanded');
        controlledBy.removeAttribute('aria-controls');
        controlledBy.removeEventListener('click', handlers.onClick);
        controlledBy.removeEventListener('keydown', handlers.onKeyDown);

        handlers.target = null;
        this.position = Position.None;
    }

    /** @private  */
    get controlledByEventListeners() {
        if( ! this._controlledByEventListeners) {
            this._controlledByEventListeners = {
                onClick: (e)=>{this.isOpen = ! this.isOpen},
                onKeyDown: (e)=>{
                    if(this.isOpen )
                        return;

                    switch (e.key) {
                        case ' ':
                        case 'Enter':
                        case 'ArrowDown':
                            this.focusItem = this.interactiveItems.first;
                            this.open();
                            e.preventDefault();
                            break;

                        case 'ArrowUp': 
                            this.focusItem = this.interactiveItems.last;
                            this.open();
                            e.preventDefault();
                            break;
                    }
                }
            };
        }   
        return this._controlledByEventListeners;
    }

    /** @private */
    setControlledByElement(element) {
        this.releaseControlledByElement();

        if( !element)
            return;

        if( ! this.id)
            this.id = nextId();

        const listeners = this.controlledByEventListeners;

        listeners.target = element;
        element.setAttribute('aria-haspopup', 'true');
        element.setAttribute('aria-expanded', this.isOpen);
        element.setAttribute('aria-controls', this.id);
        element.addEventListener('click', listeners.onClick);
        element.addEventListener('keydown', listeners.onKeyDown);

        this.position = Position.WithElement(element);
    }

    /**
     * @param {Item} item
     * @param {number} index
     * @param {Array<Items>} items
     */
    updateItem(item, index, items) {}

    /**
     * 
     */
    updateAllItems() {
        const items = Array.from(this.items);
        items.forEach(this.updateItem, this);
    }

    /**
     * @private
     */
    getElementById(id) {
        let root = this.getRootNode();
        if(root.shadowRoot)
            root = root.shadowRoot;
        else
            root = window.document;
        return root.getElementById(id);
    }
}

/** 
 * Set this as a fallback for any newly created Menu objects to use as the icon factory
 */
Menu.defaultIconFactory = null;

Object.defineProperty(Menu, 'stylesheet', {value: new ReusableStyleSheet(style)})

export default Menu;

