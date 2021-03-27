import Animation from './Animation';
import Position from './Position';
import Item from './Item';
import {nextId} from './Id';
import ItemCollection from './ItemCollection';
import TabList from './TabList';
import Attributes from './Attributes';
import IconFactory from './IconFactory';

import {ReusableStyleSheet} from './Style';
import style from '../style/menu.scss';

/** @enum CloseReason */
export const CloseReason = {
    CloseMethod: 'close-method',
    Escape: 'escape-key',
    ItemActivated: 'item-activated',
    PointerDownOutside: 'pointer-down'
};

/**
 * @enum Direction
 */
export const Direction  = {
    TopToBottom: 'v',
    LeftToRight: 'h',
};

/**
 * Occurs when a menu element is opened.
 * @event wam-menu-open
 * @type {CustomEvent}
 * @property {Menu} detail.menu
 */

/**
 * Occurs when a menu element is closed.
 * @event wam-menu-close
 * @type {CustomEvent}
 * @property {Menu} detail.menu
 * @property {CloseReason} detail.cause
 */

/**
 * Base class for list of items that are menus. Ie. that use arrow keys to move between a list of items.
 * @fires wam-menu-open
 * @fires wam-menu-close
 * 
 * @attribute {on/off} static - If present will be treated as a static element instead of a popup
 * @attribute {string} controlled-by - Id of the element that controls if the menu is open or closed
 */
export class Menu extends HTMLElement {

    constructor() {
        super();

        const shadow = this.attachShadow({mode: 'open'});
        Menu.stylesheet.addToShadow(shadow);
        const outer = document.createElement('div');
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
         * @type {ItemCollection}
         */
        this.items = new ItemCollection(this);

        this._itemUpdatePending = false;

        /** @type {Direction} */
        this.direction = Direction.TopToBottom;

        /** @type {boolean} */
        this.useAnimation = true;

        this._position = Position.None;

        this._iconFactory = null;

        this._convertToPopup();

        this.addEventListener('keydown', Menu.onKeyDown);
        this.addEventListener('keypress', Menu.onKeyPress);
        this.addEventListener('click', Menu.onClick);
        this._windowResizeFunc = (e)=>{this.onWindowResize(e)}
        this._windowPointerFunc = (e)=>{this.onWindowPointerDown(e)}
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
     * @type {TabList}
     * @readonly
     */
    get interactiveItems() {
        return new TabList(this.displayItems.array.filter(item => item.isInteractive));
    }

    /**
     * Items that are visible to the user. 
     * 
     * Subclasses may use this to add items like seperators or default options.
     * 
     * @see Menu#items
     * @see Menu#displayedItems
     * @type {TabList}
     * @readonly
     */
    get displayItems() {return new TabList(this.items);}

    /**
     * Is the menu displayed to the user.
     * @type {boolean}
     * @readonly
     */
    get isOpen() {return 'open' === this._state ||  'opening' === this._state ||  this.isStatic;}

    /**
     * True if the menu is able to be opened and closed.  False for static menus that are always open.
     * @type {boolean}
     */
    get isStatic() { return Attributes.getExists(this, 'static') }
    set isStatic(value) { Attributes.setExists(this, 'static', value)}

    /**
     * Element that controls the opening and closing of this menu.
     * @type {HTMLElement} controlledBy
     */
    get controlledBy () {
        const id = this.getAttribute('controlled-by');
        if( ! id)
            return null;
        return this.getElementById(id);
    }
    set controlledBy(value) {
        if( ! value)
            this.removeAttribute('controlled-by');
        else {
            if( ! value.id)
                value.id = nextId();
            this.setAttribute('controlled-by', value.id);
        }
    }

    /** @type {PositionFunction} */
    get position() {return this._position}
    set position(value) {
        this._position = value;
        if(this.isOpen)
            this.applyPosition();
    }


    /** 
     * Override IconFactory.defaultFactory for this menu only.  Set to null to use the defaultFactory.
     * @see IconFactory#defaultFactory
     * @type {iconFactoryFunction} 
     */
    get iconFactory() {
        return this._iconFactory || IconFactory.defaultFactory;
    }
    set iconFactory(value) {
        this._iconFactory = value;
        for(let item of this.items)
            item.updateIcon();
    }

    /**
     * Web component life cycle helper to define what attributes trigger #attributeChangedCallback
     */
    static get observedAttributes() {
        return ['static', 'controlled-by'];
    }

    /**
     * Web component life cycle when an attribute on the element is changed
     */
    attributeChangedCallback(name, oldValue, newValue) {
        switch(name) {
            case 'static': {
                const isStatic = null !== newValue;
                if(isStatic)
                    this._convertToStatic();
                else
                    this._convertToPopup();
                break;
            }
            case 'controlled-by':
                this.setControlledByElement(this.getElementById(newValue));
                break;
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

    _convertToStatic() {
        const menu = this.shadowRoot.querySelector('.menu');
        menu.style.display = '';
        this.style.position = '';
        this._state = 'open';
    }

    _convertToPopup() {
        const menu = this.shadowRoot.querySelector('.menu');
        menu.style.display = 'none';
        this._state = 'closed';
    }
    
    /** 
     * Check if one of the menu items has focus
     * @return {boolean}
     */
    isFocusWithin() {
        let focused = document.activeElement;
        while(focused) {
            if(focused === this)
                return true;
            focused = focused.parentElement
        }
        return false;
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
     * Open the menu.  Promise resolves when the animation has completed
     * @return {Promise<Menu>}
     */
    open() {
        return new Promise((resolve, reject) => {
            const transition = this._open();
            if(null === transition) {
                reject('Already open')
            } else if(false === transition) {
                reject('Open canceled');
            } else {
                transition.on('complete', () => resolve(this))
            }
        })
    }

    /**
     * @private
     * @return {Transition} null if the menu is already open.  False if canceled.  Otherwise a Transition.
     */
    _open() {
        if(this.isOpen || this.isStatic)
            return null;

        const event = new CustomEvent('wam-menu-open', {
            bubbles:true,
            cancelable:true,
            detail: {
                menu: this,
            }
        });

        if( ! this.dispatchEvent(event)) {
            return false;
        }

        this.previousFocus = this.parentElement ? document.activeElement : null;
        this._state = 'opening';

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
            this._state = 'open';
        })

        return this.startTransition(anim);
    }

    /**
     * Close the menu.  Promise resolves when the animation has completed
     * @return {Promise<Menu>}
     */
    close() {
        return new Promise((resolve, reject) => {
            const transition = this._close(CloseReason.CloseMethod);
            if(null === transition) {
                reject('Already closed');
            } else if (false === transition) {
                reject('Close canceled');
            } else {
                transition.on('complete', () => resolve(this));
            }

        });
    }

    /**
     * @private
     * @param {CloseReason}
     * @return {Transition} Null if it is already closed, false
     */
    _close(cause) {
        if( this.isStatic || ! this.isOpen)
            return null;

        const event = new CustomEvent('wam-menu-close', {
            bubbles:true,
            cancelable: true,
            detail: {
                menu: this,
                cause: cause
            }
        });

        if( ! this.dispatchEvent(event)) {
            return false;
        }

        this._state = 'closing';

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
            this._state = 'closed';
            this.shadowRoot.querySelector('.menu').style.display = 'none';
        });

        return this.startTransition(anim);
    }


    /**
     * @return {?HTMLElement} focused item in this menu or null if the focus is outside of this parent
     */
    getFocused() {
        const focused = document.activeElement;
        const menu = Menu.fromElement(focused);
        if(menu != this)
            return null;
        
        return focused;
    }

    onWindowPointerDown(e) {
        if(!this.isStatic && this !== Menu.fromElement(e.target))
            this.close(CloseReason.PointerDownOutside);
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

        const controlledBy = this.getAttribute('controlled-by');
        if(controlledBy)
            this.setControlledByElement(this.getElementById(controlledBy));
        
        // Force the upgrade of any children so they are included in this.interactiveItems
        // before trying to select the focused item
        window.customElements.upgrade(this);

        this.focusItem = this.interactiveItems.first;
    }

    /**
     * Web component life cycle when the element is removed from the DOM
     */
    disconnectedCallback() {
        window.removeEventListener('resize', this._resizeListener);
        this.releaseControlledByElement()
    }
    
    /**
     * @type {Item} focusItem 
     * @protected
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
     * @protected
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
        const matching = this.interactiveItems.array.filter(i => {
            const label = i.label;
            if( ! label)
                return false;

            return i.label[0].toLowerCase() == key
        });
        if(0 == matching.length)
            return;
        const tablist = new TabList(matching);
        const next = tablist.next(tablist.defaultFocusItem);
        this.setFocusOn(next);
    }

    static onKeyDown(e) {
        e.currentTarget.onKeyDown(e)
    }

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
        } else if('Escape' == e.key && !this.isStatic) {
            this.close(CloseReason.Escape);
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

        const closeOk = item.dispatchEvent(event);
        
        if(!this.isStatic && closeOk)
            this.close(CloseReason.ItemActivated);
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
                onClick: (e)=>{
                    if(this.isOpen)
                        this.close();
                    else
                        this.open();
                },
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
        this._itemUpdatePending = false;
    }

    requestItemUpdate() {
        if(this._itemUpdatePending) 
            return;
        this._itemUpdatePending = true;
        window.queueMicrotask(this.updateAllItems.bind(this));
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

Object.defineProperty(Menu, 'stylesheet', {value: new ReusableStyleSheet(style)})

export default Menu;

