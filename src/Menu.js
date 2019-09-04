import Animation from './Animation';
import Position from './Position';
import Item from './Item';
import {addEventFunctions, addEventMember } from './Events';
import {getStyleLink} from './Style';
import ItemCollection from './ItemCollection';
import Attributes from './Attributes';

import {reusableStyleSheetsFunction} from './Style';
import style from '../style/menu.scss';
const getStyleSheets = reusableStyleSheetsFunction(style);

let id = 0;
function nextId() {
    return `wam-id-${++id}`;
}


/**
 * Base class for list of items that are menus. Ie. that use arrow keys to move between a list of items
 */
class Menu extends HTMLElement {
    constructor() {
        super();

        const shadow = this.attachShadow({mode: 'open'});
        shadow.adoptedStyleSheets = getStyleSheets();
        shadow.appendChild(getStyleLink());
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

        this.items = new ItemCollection(this, inner);

        /*this.element = document.createElement('div');
        this.element.className = 'menu';
        this.element['data-menu'] = this;*/
        this.addEventListener('keydown', Menu.onKeyDown);
        this.addEventListener('click', Menu.onClick);
        addEventMember(this);

        this.state = 'closed';
        this._controlledBy = {};

        //this.iconFactory = options.iconFactory || Menu.defaultIconFactory;
        this.position = Position.Static;

        this.addEventListener('focusout', this.onFocusOut.bind(this));
    }



    /** @property {Boolean} useAnimation */
    get useAnimation() {return Attributes.getTrueFalse(this, 'useanimation', true)}
    set useAnimation(value) {Attributes.setTrueFalse(this, 'useanimation', value)}

    /** @property {boolean} autoClose */
    get autoClose() {return Attributes.getTrueFalse(this, 'autoclose', true)}
    set autoClose(value) {Attributes.setTrueFalse(this, 'autoclose', value)}

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
        return document.getElementById(id);
    }
    set controlledBy(value) {
        if( ! value)
            Attributes.setString(this, 'controlledby', null)
        else {
            if( ! value.id)
                value.id = nextId();
            this.setAttribute('controlledBy', id);
        }
    }


    /** @property {iconFactoryFunction} iconFactory */
    get iconFactory() {return this._iconFactory}
    set iconFactory(value) {
        this._iconFactory = value;
        for(let item of this.items)
            item.updateFactoryIcon();
    }


    static get observedAttributes() {
        return ['open', 'controlledby'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        switch(name) {
            case 'open':
                if(null != newValue && 'false' != newValue)
                    this.open();
                else
                    this.close();
                break;
            case 'controlledby':
                this.setControlledByElement(document.getElementById(newValue));
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

    onFocusOut() {
        window.requestAnimationFrame(()=>{
            if( ! this.autoClose  || 'open' != this.state) {
                return;
            }

            let focused = document.activeElement;
            while(focused) {
                if(focused === this)
                    return;
                focused = focused.parentElement
            }

            if('open' == this.state)
                this.close();
        })
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
        if(this.controlledBy)
            this.controlledBy.setAttribute('aria-expanded', this.isOpen)
    }

    startTransition(transition) {
        if(this.useAnimation)
            transition.play();
        else
            transition.fastForward();
        return transition;
    }

    handleWindowResized() {
        this.position.apply(this.element, this.host);
    }


    /**
     * @param {Boolean} [suppressFocus] if true, do not set the focus when the menu opens.  Useful for when
     *                     the menu is triggered via a pointer event instead of a keyboard event
     * @return {Transition} null if the menu is already open.  Otherwise a Transition.
     */
    open(suppressFocus=false) {
        if('open' == this.state|| 'opening' == this.state)
            return null;

        this.previousFocus = this.parentElement ? document.activeElement : null;
        this.state = 'opening';

        const menuElement = this.shadowRoot.querySelector('.menu');

        let anim = new Animation.Transition(menuElement, 'menushow');
        anim.on('firstframe', (e)=>{
            if('opening' !== this.state) {
                e.transition.stop();
                return;
            }

            // don't append the element to the end if it already is in the parent
            menuElement.style.display = '';


            /*if(this.host != this.element.parentElement)
                this.host.appendChild(this.element);
                this.position.apply(this.element, this.host);
                */
        });
        anim.on('complete',()=>{
            this.state = 'open';
            if( ! suppressFocus)
                this.setFocusOn(this.focusItem);
            this.events.emit('opened', {menu:this});
            this.windowResizeFunc = ()=>this.handleWindowResized();
            window.addEventListener('resize',this.windowResizeFunc);
        })

        return this.startTransition(anim);
    }

    /**
     * @return {Transition} Null if it is already closed
     */
    close() {
        if(this.state == 'closed' || this.state == 'closing')
            return null;

        this.state = 'closing';

        let anim = new Animation.Transition(this.shadowRoot.querySelector('.menu'), 'menuhide');
        anim.on('firstframe',(e)=>{
            if(this.state !== 'closing') {
                e.transition.stop();
                return;
            }
            
            window.removeEventListener('resize', this.windowResizeFunc);
            this.windowResizeFunc = null;
        });
        anim.on('complete', ()=>{
            if(this.state != 'closing')
                return;

            this.state = 'closed';
            this.shadowRoot.querySelector('.menu').style.display = 'none';

            if(this.previousFocus && ( ! document.activeElement || document.activeElement === document.body))
                this.previousFocus.focus();
            
            this.previousFocus = null;
            this.setFocusOn(null);
            this.events.emit('closed', {menu:this});
        });

        return this.startTransition(anim);
    }

    /**
     * @param {Item} current
     * @return {Item} The next element in this.itemParent. If current is the last element it
     *                       return the first element. If there is no current element it returns the
     *                       first element
     */
    getNext(current) {
        const index = this.items.indexOf(current);
        if(index < 0)
            return this.items.atIndex(0);
        
        return this.items.atIndex((index+1) % this.items.length);
    }

    /**
     * @param {Item} current
     * @return {Item} the next item in this.itemParent. If current is the first element it
     *                       return the last element. If there is no current it returns the last element;
     */
    getPrevious(current) {
        const index = this.items.indexOf(current);
        const length = this.items.length;
        if(index < 0)
            return items.atIndex(length - 1);
        
        return this.items.atIndex((index - 1 + length) % length);
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

    
    /**
     * @property {Item} focusItem 
     */
    set focusItem(item) {
        for(let element of this.items) {
            if(item == element)
                element.setAttribute('isdefaultfocus', '');
            else
                element.removeAttribute('isdefaultfocus')
        }
    }
    get focusItem() {
        return this.querySelector('[isdefaultfocus]') || this.firstElementChild;
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
        const item = Item.fromElement(e.target);
        if(item)
            this.activate(item, e);
    }

    static onKeyDown(e) {
        let menu = Menu.fromElement(e.currentTarget);
        if(menu)
            menu.onKeyPress(e);
    }

    /**
     * 
     */
    onKeyPress(e) {
        let item = this.getFocused();
        if( ! item)
            return;
    
        switch(e.key) {
            case 'ArrowLeft':
            case 'ArrowUp':
                this.setFocusOn(this.getPrevious(item));
                e.preventDefault();
                break;
            case 'ArrowRight':
            case 'ArrowDown':
                this.setFocusOn(this.getNext(item));
                e.preventDefault();
                break;
            case 'Escape':
                this.close();
                //e.preventDefault();
                break;
            case ' ':
            case 'Enter':
                this.activate(Item.fromElement(item), e);
                e.preventDefault();
        }
    }

    /**
     * @param {Item} item
     */
    activate(item, initiatingEvent) {
        if(item.disabled)
            return;

        const event = new CustomEvent('menuitem', {detail: {
            item: item,
            menu: this,
            source:initiatingEvent
        }});


        const myEvent = {
            menu:this,
            item:item,
            event:initiatingEvent, 
            preventClose:function(){closeMenu = false}
        };

        if('function' == typeof item.action)
            item.action(event);

        const closeMenu = item.dispatchEvent(event);
        
        if(this.autoClose && closeMenu)
            this.close();    
    }

    /**
     * @type {Position|ComputedPosition} position
     */
    get position() {return this._position;}
    set position(value) {
        if( ! (value instanceof Position))
            value = new Position(value);

        this._position = value;
    }

    /** @private */
    releaseControlledByElement() {
        const controlledBy = this.controlledBy;
        if( ! controlledBy)
            return;

        const handlers = this.controlledByEventListeners;
        controlledBy.removeAttribute('aria-haspopup');
        controlledBy.removeAttribute('aria-expanded');
        controlledBy.removeAttribute('aria-controls');
        controlledBy.removeEventListener('click', handlers.onClick);
        controlledBy.removeEventListener('keydown', handlers.onKeyDown);
    }

    /** @private  */
    get controlledByEventListeners() {
        if( ! this._controlledByEventListeners) {
            this._controlledByEventListeners = {
                onClick: (e)=>{this.isOpen = ! this.isOpen},
                onKeyDown: (e)=>{
                    if(e.key == 'ArrowDown' &&  ! this.isOpen) {
                        this.focusItem = this.items.first;
                        this.open();
                    } else if(e.key == 'ArrowUp' && ! this.isOpen) {
                        this.focusItem = this.items.last;
                        this.open();
                    }
                }
            };
        }   
        return this._controlledByEventListeners;
    }

    /** @private */
    setControlledByElement(element) {
        this.releaseControlledByElement();

        if( ! this.id)
            this.id = nextId();

        const listeners = this.controlledByEventListeners;

        element.setAttribute('aria-haspopup', 'true');
        element.setAttribute('aria-expanded', this.isOpen);
        element.setAttribute('aria-controls', this.id);
        element.addEventListener('click', listeners.onClick);
        element.addEventListener('keydown', listeners.onKeyDown);
    }

}

addEventFunctions(Menu.prototype);

/** 
 * Set this as a fallback for any newly created Menu objects to use as the icon factory
 */
Menu.defaultIconFactory = null;

export default Menu;

