import Animation from './Animation';
import Position from './Position';
import {Item} from './Item';
import {addEventFunctions, addEventMember } from './Events';


/**
 * Base class for list of items that are menus. Ie. that use arrow keys to move between a list of items
 */
class Menu {
    /**
     * @param {HTMLElement} [options.host] element to add the menu to when it is opened
     * @param {iconFactoryFunction} [options.iconFactory]
     */
    constructor(options) {
        options = options || {};

        this.element = document.createElement('div');
        this.element.className = 'menu';
        this.element['data-menu'] = this;
        this.element.addEventListener('keydown', Menu.onKeyDown);
        this.element.addEventListener('click', Menu.onClick);
        addEventMember(this);

        this.state = 'closed';
        this.autoClose = true;
        this.host = options.host || document.body;
        this.iconFactory = options.iconFactory || Menu.defaultIconFactory;
        this.position = Position.Static;
        this.useAnimation = true;
    }

    /**
     * {HTMLElement} element that is the direct parent of the menu items.  Defaults to this.element
     * but sub classes can override this if they have a different structure
     */
    get itemParent() {
        return this.element;
    }

    /**
     * @param {HTMLElement} element
     * @return {Menu} Get the Menu object that this element is contained in
     */
    static fromElement(element) {
        while( ! element['data-menu']) {
            element = element.parentElement;
        }
        return element['data-menu'];
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

    /**
     * @param {HTMLElement} host The element that the menu will be added to.
     * @param {} position object with top,left,bottom, or right properties to be set on the element.
     *                      can include any or none of these properties. 
     * 
     * @param {Boolean} [suppressFocus] if true, do not set the focus when the menu opens.  Useful for when
     *                     the menu is triggered via a pointer event instead of a keyboard event
     * @return {Transition}
     */
    show(suppressFocus=false) {

        if( ! this.host)
            throw new Error('Tried to show Menu without a host element');

        this.previousFocus = document.activeElement;
        this.state = 'opening';

        let anim = new Animation.Transition(this.element, 'menushow');
        anim.on('firstframe', (e)=>{
            if('opening' !== this.state) {
                e.transition.stop();
                return;
            }

            this.host.appendChild(this.element);
            this.position.apply(this.element, this.host);
        });
        anim.on('complete',()=>{
            this.state = 'open';
            if( ! suppressFocus)
                this.setDefaultFocus();
            this.events.emit('opened', {menu:this});
        })

        return this.startTransition(anim);
    }

    /**
     * @return {Transition}
     */
    hide() {
        if(this.state == 'closed' || this.state == 'closing')
            return;

        this.state = 'closing';

        let anim = new Animation.Transition(this.element, 'menuhide');
        anim.on('firstframe',(e)=>{
            if(this.state !== 'closing')
                e.transition.stop();
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
     * @param {HTMLElement} current
     * @return {HTMLElement} The next element in this.itemParent. If current is the last element it
     *                       return the first element. If there is no current element it returns the
     *                       first element
     */
    getNext(current) {
        if(current && current.nextElementSibling)
            return current.nextElementSibling;
        else
            return this.itemParent.firstElementChild;
    }

    /**
     * @param {HTMLElement} current
     * @return {HTMLElement} the next item in this.itemParent. If current is the first element it
     *                       return the last element. If there is no current it returns the last element;
     */
    getPrevious(current) {
        if(current && current.previousElementSibling)
            return current.previousElementSibling;
        else
            return this.itemParent.lastElementChild;
    }

    /**
     * @return {HTMLElement|null} focused item in this menu or null if the focus is outside of this parent
     */
    getFocused() {
        let focused = document.activeElement;
        if(focused.parentElement != this.itemParent)
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
        for(let element of this.itemParent.children) {
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

