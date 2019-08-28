import Animation from './Animation';
import Position from './Position';
import {Item} from './Item';
import {addEventFunctions, addEventMember } from './Events';
import {getStyleLink} from './Style';
import ItemCollection from './ItemCollection';


function getBooleanAttribute(element, attributeName, defaultValue) {
    if( ! element.hasAttribute(attributeName))
        return defaultValue;

    const value = this.getAttribute(attributeName);
    if(value == 'false' || value == 'no')
        return false;
    if(value == 'true' || value == 'yes')
        return true;

    return defaultValue;
}

function setBooleanAttribute(element, attributeName, value) {
    const boolValue = ('yes' == value || 'true' == value) ? true : Boolean(value);
    element.setAttribute(attributeName, boolValue);
}

/**
 * Base class for list of items that are menus. Ie. that use arrow keys to move between a list of items
 */
class Menu extends HTMLElement {
    constructor() {
        super();

        this._shadow = this.attachShadow({mode: 'open'});
        this._shadow.appendChild(getStyleLink());

        this.items = new ItemCollection(this);


        /*this.element = document.createElement('div');
        this.element.className = 'menu';
        this.element['data-menu'] = this;*/
        this.addEventListener('keydown', Menu.onKeyDown);
        this.addEventListener('click', Menu.onClick);
        addEventMember(this);

        this.state = 'closed';
        //this.iconFactory = options.iconFactory || Menu.defaultIconFactory;
        this.position = Position.Static;
    }

    /**
     * {HTMLElement} element that is the direct parent of the menu items.
     */
    get itemParent() {
        if( ! this._itemParent) {
            this._itemParent = document.createElement('div');
            this._itemParent.className = 'menu-itemlist';
            this._itemParent.setAttribute('role', 'menu');
            this.itemParent.appendChild(document.createElement('slot'));
            this._shadow.appendChild(this._itemParent);
        }
        return this._itemParent;
    }

    /** @property {Boolean} useAnimation */
    get useAnimation() {return getBooleanAttribute(this, 'useanimation', true)}
    set useAnimation(value) {setBooleanAttribute(this, 'useanimation', value)}

    /** @property {boolean} autoClose */
    get autoClose() {return getBooleanAttribute(this, 'autoclose', true)}
    set autoClose(value) {setBooleanAttribute(this, 'autoclose', value)}

    /** @property {iconFactoryFunction} iconFactory */
    get iconFactory() {return this._iconFactory}
    set iconFactory(value) {
        this._iconFactory = value;
        for(let item of this.items)
            item.updateIcon();
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


    /**
     * If the menu is opened, closed, or in transition
     * @property {string} state;
     */
    get state() {return this._state;}
    set state(value) {
        this._state = value;
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
        this.itemParent.style.display = '';
        return;
        if('open' == this.state|| 'opening' == this.state)
            return null;

        this.previousFocus = this.parentElement ? document.activeElement : null;
        this.state = 'opening';

        let anim = new Animation.Transition(this.element, 'menushow');
        anim.on('firstframe', (e)=>{
            if('opening' !== this.state) {
                e.transition.stop();
                return;
            }

            // don't append the element to the end if it already is in the parent
            /*if(this.host != this.element.parentElement)
                this.host.appendChild(this.element);
                this.position.apply(this.element, this.host);
                */
        });
        anim.on('complete',()=>{
            this.state = 'open';
            if( ! suppressFocus)
                this.setDefaultFocus();
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
        this.itemParent.style.display='none';
        if(this.state == 'closed' || this.state == 'closing')
            return null;

        this.state = 'closing';

        let anim = new Animation.Transition(this.element, 'menuhide');
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
            if(this.element.parentElement)
                this.element.parentElement.removeChild(this.element);

            if(this.previousFocus && ( ! document.activeElement || document.activeElement === document.body))
                this.previousFocus.focus();
            
            this.previousFocus = null;
            this.setFocusOn(null);
            this.events.emit('closed', {menu:this});
        });

        return this.startTransition(anim);
    }

    /**
     * @return {Array<Item>}
     */
    _getItems() {
        return Array.from(this.querySelectorAll('webapp-menu-item'));
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
     * 
     */
    setDefaultFocus() {
        let item =  this.itemParent.querySelector('[tabindex="0"]') || this.itemParent.firstElementChild;
        this.setFocusOn(item);
    }

    /**
     * Set the focused element of the current list.  Modifies tab index of items so
     * only the focused element has tabindex=0.  Others have tabindex=-1
     * @param {HTMLElement} item
     */
    setFocusOn(item) {
        for(let element of this.items) {
            if(item === element) {
                element.setAttribute('tabindex', 0);
                element.focus();
            } else {
                element.setAttribute('tabindex', -1);
            }
      }
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
                this.hide();
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

        
        let closeMenu = true;
        /** 
         * @typedef ItemActionEvent 
         * @property {Menu} menu
         * @property {Item} item
         * @property {Event} initiatingEvent
         * @function preventClose
        */
        const event = {
            menu:this,
            item:item,
            event:initiatingEvent, 
            preventClose:function(){closeMenu = false}
        };
        if('function' == typeof item.action)
            item.action(event);

        if(this.autoClose && closeMenu)
            this.hide();    
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

}

addEventFunctions(Menu.prototype);

/** 
 * Set this as a fallback for any newly created Menu objects to use as the icon factory
 */
Menu.defaultIconFactory = null;

export default Menu;

