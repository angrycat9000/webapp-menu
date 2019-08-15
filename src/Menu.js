import Animation from './Animation';
import {addEventFunctions, addEventMember } from './Events';

import backSvgIcon from '../icons/back.svg';
import nestedSvgIcon from '../icons/nested.svg';

function svgIconFromString(text) {
    const div = document.createElement('div');
    div.innerHTML = text;
    div.firstElementChild.setAttribute('aria-hidden', 'true')
    return div.firstElementChild;
}

/**
 * @enum
 * @readonly
 */
const ItemType = {
    Action: 'action',
    Nested: 'nested',
    Back:  'back',
};

/**
 * @callback iconFactoryFunction
 * @param {string} name
 * @return {HTMLElement}
 */

/**
 * @callback itemActionFunction
 * @param {ItemActionEvent} event
 */

/**
 * 
 */
class Item {
    /** 
     * @param {string} options.label
     * @param {string} [options.label2]
     * @param {string} [options.id]
     * @param {string|Element} [options.icon]
     * @param {itemActionFunction} [options.action]
     * @param {*} [options.data] member to save caller defined data related to this item
     * @param {ItemType} [options.type] defaults to ItemType.Action

     */
    constructor(options) {
        if( ! options.label)
            throw new Error('Menu.Item must have a label');

        this.id = options.id || '';
        this.label = options.label;
        this.label2 = options.label2;
        this.id = options.id;
        this.icon = options.icon || null;
        this.action = options.action || null;
        this.data = options.data || null;
        this.type = options.type || ItemType.Action;

        this.element = this.createElement();
    }

    createElement() {
        if(this.element)
            return this.element;

        let element = document.createElement('button');
        element.className  = `menu-item menu-item__${this.type}`;
        element.setAttribute('role','menuitem'); 

        if(ItemType.Back == this.type) {
            element.setAttribute('aria-label', "Back to previous level: "+this.label); // screen reader will read 'back to previous level' and visible text
        } else {
            element.setAttribute('aria-label', this.label); // add aria-label on the BUTTONS containing icons that don't have visible text
        }

        let icon = document.createElement('span');
        icon.className = "menu-item-icon";
        icon.setAttribute('aria-hidden','true'); //otherwise screen readers could speak the icon's name
        if(this.icon instanceof Element)
            icon.appendChild(this.icon);
        element.appendChild(icon);


        let labelContainer = document.createElement('span');
        labelContainer.className = 'menu-item-label';
        if( ! this.label2)
            labelContainer.appendChild(document.createTextNode(this.label));
        else {
            let label1 = document.createElement('span');
            label1.appendChild(document.createTextNode(this.label));
            labelContainer.appendChild(label1);

            let label2 = document.createElement('span');
            label2.appendChild(document.createTextNode(this.label2));
            labelContainer.appendChild(label2);
        }
        element.appendChild(labelContainer);

        if(ItemType.Nested == this.type) {
            const nestedIcon = svgIconFromString(nestedSvgIcon);
            nestedIcon.classList.add('menu-item-nestedIcon');
            element.appendChild(nestedIcon);
            element.setAttribute('aria-haspopup','true'); //since this opens a submenu, it needs aria-haspopup
        }

        if(this.id)
            element.setAttribute('data-menu-item-id', this.id);
        element['data-menu-item'] = this;
        return this.element = element;
    }

    /**
     * @param {iconFactoryFunction}
     */
    convertIconStringToElement(factory) {
        if( ! this.icon || 'string' != typeof this.icon || ! factory)
            return;

        let iconElement = factory(this.icon);
        const iconContainer = this.element.querySelector('.menu-item-icon');
        if(iconContainer.firstElementChild)
            iconContainer.removeChild(iconContainer.firstElementChild)
        iconContainer.appendChild(iconElement);
    }

    /** @property {Boolean} disabled true if the item is disabled */
    get disabled() {return this.element.hasAttribute('disabled')}
    set disabled(value) {
        if(value)
            this.element.setAttribute('disabled','');
        else
            this.element.removeAttribute('disabled');
    }

    static fromElement(element) {
        while(element && ! element['data-menu-item'] && ! element.classList.contains('menu-container')) {
            element = element.parentElement;
        }
        return element ? element['data-menu-item'] : null;
    }
};


/**
 * 
 */
class List {
    constructor(items, iconFactory) {
        this.iconFactory = iconFactory
        this.items = items.map(item=>item instanceof Item ? item : new Item(item));
        this.element = document.createElement('div');
        this.element.className = 'menu-list';
        this.element.setAttribute('role', 'menu')

        let hasIcons = false;
        for(let i=0; i < this.items.length; i++) {
            const item = this.items[i];
            hasIcons = hasIcons || item.icon
            item.element.setAttribute('tabindex', (0==i) ? '0' : '-1');
            item.convertIconStringToElement(this.iconFactory);
            this.element.appendChild(item.element);
        }
        this.element.setAttribute('data-menu-list-hasIcons', hasIcons ? 'true' : 'false');
    }
}


function positionPopup(menu, container, x, y, verticalPadding=16) {
    const yAbove = y - verticalPadding;
    const yBelow = y + verticalPadding;  

    const menuWidth = menu.offsetWidth;
    const menuHeight = menu.offsetHeight;
    const containerRect= container.getBoundingClientRect();
    const bounds = {
        min: {x:containerRect.left, y:containerRect.top},
        max: {x:containerRect.right, y:containerRect.bottom}
    };
    
    let margin = 8;
    bounds.min.x += margin;
    bounds.min.y += margin;
    bounds.max.x -= margin;
    bounds.max.y -= margin;
    
    let point = {x:x - menuWidth / 2};
    
    if(point.x < bounds.min.x)
      point.x = bounds.min.x;
    if (point.x > bounds.max.x - menuWidth)
      point.x = bounds.max.x - menuWidth;
    
    let d2 = bounds.max.y - (yBelow + menuHeight);
    let d1 = yAbove - (bounds.min.y + menuHeight);
    
    if(d2 >= 0)
      point.y = yBelow;
    else if (d1 >= 0)
      point.y = yAbove - menuHeight;
    else if( d1 > d2) 
      point.y = bounds.min.y;
    else
      point.y = bounds.max.y - menuHeight;
  
    return {top: Math.round(point.y), left:Math.round(point.x), name:'popup'};
  }

function computeResponsivePosition(menu, container, left, top, verticalMargin, size, portrait, landscape) {
    const box = container.getBoundingClientRect();
    if(box.width > box.height && box.height < size) 
        return landscape;
    if(box.width <= box.height && box.width < size)
        return portrait;

    return positionPopup(menu, container, left, top, verticalMargin);
}

/**
 * @typedef ComputedPosition
 * @property {string} [name] used to generate a CSS class in the form of menu-position__name
 * @property {number|string} [left]
 * @property {number|string} [top]
 * @property {number|string} [right]
 * @property {number|string} [bottom]
 */


/**
 * Provides ability to defer computation of position until after the elementn has been added
 * to the DOM.  This allows accessing the size of the element;
 */
class Position {
    /**
     * @param {function|ComputedPosition} data An object with the position data or a function that will
     *                                         a ComputedPosition object.
     */
    constructor(data) {
        this.data = data;
    }

    static cssClassName(name) {
        return  name ? `menu-position__${name}` : '';
    }

    /**
     * Apply this position to the menu element.
     * @param {HTMLElement} menu
     * @param {HTMLElement} container
     */
    apply(menu, container) {
        const data = 'function' === typeof this.data ? this.data(menu,container) : this.data

        const newCssClass = Position.cssClassName(data.name);
        for(let cssClass of menu.classList) {
            if(cssClass.startsWith('menu-position__') && cssClass != newCssClass)
                menu.classList.remove(cssClass);
        }
    
        for(let prop of ['top', 'bottom', 'left', 'right']) {
            let value = data[prop]
            if('undefined' === typeof value )
                value = '';
            else if('number' === typeof value) 
                value = value +'px';
            menu.style[prop] = value;
        }

        if(newCssClass)
            menu.classList.add(newCssClass);
    }
}

/**
 * @instance {Position} Static treat the menu as a static position and does not set the top, left, bottom, or right values on the element
 *                             Allow overriding the positioning by setting an id on the element and using CSS
 */
Position.Static = new Position({name:'static'});

/** 
 * @function Absolute
 * @param {number} left
 * @param {number} top
 * @return {Position}
*/
Position.Absolute = function(left, top) {
    return new Position({name:'absolute', left:left, top:top})
}

/** @instance {Position} DockedBottom keeps the menu locked to the bottom, left, and right sides of the screen*/
Position.DockedBottom = new Position({name:'dockedBottom'});

/** @instance {Position} DockedRight keeps the menu locked to the top, right, and bottom sides of the screen */
Position.DockedRight = {name:'dockedRight'}

/** @instance {Position} DockedLeft keeps the menu locked to the top, left, and bottom sides of the screen */
Position.DockedLeft = new Position({name:'dockedLeft'});

/** 
 * @function DockablePopup shows the menu as a floating popup of if the container meets a minimum size.  Otherwise
 *                                    sets it as docked to the bottom or right
 * @param {number} left
 * @param {number} top
 * @param {number} verticalMargin amount of space between the point and the top or bottom of the menu.
 * @return {Position}
 */
Position.DockablePopup = function(left, top, verticalMargin=16, size=400, portrait=Position.DockedBottom, landscape=Position.DockedRight) {
    const f = (menu, container)=>computeResponsivePosition(menu, container, left, top, verticalMargin, size, portrait, landscape);
    return new Position(f);
}

/** 
 * @function DockablePopup Shows the menu as a floating popup within the container
 * @param {number} left
 * @param {number} top
 * @param {number} verticalMargin amount of space between the point and the top or bottom of the menu.
 * @return {Position}
 */
Position.Popup = function(left, top, verticalMargin = 16) {
    const f = (menu, container)=>positionPopup(menu, container, left, top, verticalMargin);
    return new Position(f);
}

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


/**
 * 
 */
class ListContainer extends Menu {
    /**
     * 
     */
    constructor(list, options) {
        super(options);

        this.element.classList.add('menu-container');
        
        this.stack = [];

        this.autoResize = true;
        this.events.on('closed', this.clearHeight,this);


        this.element.addEventListener('focusout', ()=>{
            window.requestAnimationFrame(()=>{
                if( ! this.autoClose  || 'open' != this.state) {
                    return;
                }
    
                let focused = document.activeElement;
                while(focused) {
                    if(focused === this.element)
                        return;
                    focused = focused.parentElement
                }

                if('open' == this.state)
                    this.hide();
            })
        });

        this.innerElement = document.createElement('div');
        this.element.appendChild(this.innerElement);

        list = new List(list, this.iconFactory);
        this.stack.push({list, parent:null});
        this.innerElement.appendChild(list.element);
    }
    show(suppressFocus) {
        const anim = super.show(suppressFocus);
        anim.on('firstframe', this.resize, this);
        return anim;
    }

    clearHeight() {
        this.element.style.height = '';
    }

    /**
     * Sets up this.innerElement to point to the current list
     * Sets the current list to the correct width
     * Sets this.element to the target height
     */
    resize() {
        const width = this.element.clientWidth; 
        let height = this.element.clientHeight; 

        if(this.autoResize && this.position !== Position.DockedRight &&  this.position !== Position.DockedLeft) {
            height = this.currentList.element.scrollHeight;
            this.element.style.height =  this.currentList.element.scrollHeight + 'px';
        }

        this.innerElement.style.marginLeft = ((1 - this.stack.length) * width) + 'px'; 
        // make the inner element wider than it needs to be for when a
        // list is popped off the stack, but still animating out.  Otherwise
        // it shrinks the N+1 lists to fit in the space for N when animating
        this.innerElement.style.width = (width * (this.stack.length +1)) + 'px';

        let active = this.currentList.element;
        active.style.width = width + 'px';
        // set height in resizeForScroll()
    }

    /** 
     * Resizes the current list to be the same height as the container so it scrolls
     * properly.
     * This needs to be fired after the height transition for this.element has completed
     * because it uses the final value of the height.  That value isn't available
     * until after the transition has completed.  It might also have been capped by max-height
     */
    resizeForScroll() {
        this.currentList.element.style.height = this.element.clientHeight + 'px';
    }

    /**
     * @param {Array<Item>} list
     * @param {Item} item Item in the previous menu level that opened this level.  Null for first level
     */
    push(list, item) {

        if(item) {
            const back = {
                icon: svgIconFromString(backSvgIcon),
                label:item.label, 
                id:'menu-back', 
                type:ItemType.Back
            };
            list = [back].concat(list);
        }

        list = new List(list, this.iconFactory);
        this.stack.push({list, parent:item});

        let anim = new Animation.Transition(this.innerElement, 'menuresize');
        anim.on('firstframe',()=>{
            this.innerElement.appendChild(list.element);
            this.resize();
        });
        anim.on('complete', ()=>{
            this.resizeForScroll();
            this.setDefaultFocus()
        });

        return this.startTransition(anim);
    }

    get currentList() {
        return this.stack[this.stack.length - 1].list;
    }

    get itemParent() {
        return this.currentList.element
    }

    /**
     * @property {Array<Item>} itemPath for nested menus, returns the menu items selected to
     *                           reach the current level.  Array is length n - 1 where n is the
     *                           number of levels in the menu.
     */
    get itemPath() {
        return this.stack.slice(1).map(i=>i.parent);
    }

    /**
     * @param {Boolean} all True to return to the first level menu.  False
     *                      to just move one level up.  Defaults to false.
     * @return {Transition|false} false if it failed to pop any items.  Transitino
     *                         for changing display otherwise;
     */
    pop(all=false) {
        if(this.stack.length < 2)
            return false;

        if(all)
            this.stack = this.stack.slice(0,1);
        else
            this.stack.pop();

        let anim = new Animation.Transition(this.innerElement, 'menupop');
        anim.on('secondframe', this.resize, this);
        anim.on('complete', ()=>{
            while(this.innerElement.children.length > this.stack.length)
                this.innerElement.removeChild(this.innerElement.lastElementChild);
            this.setDefaultFocus();
            this.resizeForScroll();
        });

        return this.startTransition(anim);
    }

    activate(item, initiatingEvent) {
        if(item && ItemType.Back == item.type) {
            this.pop();
            initiatingEvent.preventDefault();
        } else if(item && ItemType.Nested == item.type) {
            const event = {menu:this, item:item, event:initiatingEvent};
            if('function' != typeof item.action) 
                throw new Error ('Nested menu item without an action to provide nested items')
            const list = item.action(event);
            if( ! Array.isArray(list))
                throw new Error('Nested menu item did not return an array of items');

            this.push(list, item);
            initiatingEvent.preventDefault();
        } else {
            super.activate(item, initiatingEvent);
        }
    }

    onKeyPress(e) {
        switch(e.key) {
            case 'ArrowLeft':
                this.pop();
                e.stopPropagation();
                break;
            case 'ArrowRight':
                const element = this.getFocused();
                const item = Item.fromElement(element);
                if(item && ItemType.Nested == item.type) {
                    item.element.click();
                    e.stopPropagation();
                }
                break;
            default:
                super.onKeyPress(e);
        }
    }
}

addEventFunctions(Menu.prototype);

/** 
 * Set this as a fallback for any newly created Menu objects to use as the icon factory
 */
Menu.defaultIconFactory = null;


class Toolbar extends Menu {
    /**
     * @param {Array<Item>} items
     * @param {HTMLElement} [options.parent]
     * @param {iconFactoryFunction} [options.iconFactory]
     */
    constructor(items, options={}) {
        super(options);

        this.element.classList.add('menu-toolbar');
        this.element.setAttribute('role', 'menu');

        this.items = items.map(item=>item instanceof Item ? item : new Item(item));
        for(let i = 0; i < this.items.length; i++) {
            const item = this.items[i];
            item.convertIconStringToElement(this.iconFactory);
            this.element.appendChild(item.element)
            item.element.setAttribute('tabindex', 0==i ? '0' : '-1');
        }
    }
}


var menuExport = {ItemType, Item, Menu, ListContainer, Toolbar, Position};
export default menuExport;