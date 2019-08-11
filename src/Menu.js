import Animation from './Animation';
import {addEventFunctions, addEventMember } from './Events';

var ItemType = {
    Action: 'action',
    Nested: 'nested',
    Back:  'back',
};

/**
 * Returns an HTMLElementth for this icon name
 * @param {string|HTMLElement} icon
 */
function iconToElement(icon) {
    if('string' == typeof icon)
        return Menu.iconGenerator(icon);
    else if(icon instanceof Node)
        return icon;
    else
        throw new Error('icon is not a string or HTMLElement');
}

/**
 * 
 */
class Item {
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
        element.setAttribute('title', this.label);

        let icon = document.createElement('span');
        icon.className = "menu-item-icon";
        if(this.icon) 
            icon.appendChild(iconToElement(this.icon));
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
            element.appendChild(Menu.iconGenerator.namedIcon('chevron_right'))
        }

        element.setAttribute('data-menu-item-id', this.id);
        element['data-menu-item'] = this;
        return this.element = element;
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
    constructor(items) {
        this.items = items.map(item=>item instanceof Item ? item : new Item(item));
        this.element = document.createElement('div');
        this.element.className = 'menu-list';
        this.element.setAttribute('role', 'menu')

        let hasIcons = false;
        for(let i=0; i < this.items.length; i++) {
            const item = this.items[i];
            hasIcons = hasIcons || item.icon
            item.element.setAttribute('tabindex', (0==i) ? '0' : '-1');
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

var Position =  {
   DockedBottom: {bottom:0, left:0, right:0, name:'dockedBottom'},
   DockedRight: {right:0, bottom:0, top:0, name:'dockedRight'},
   DockedLeft: {left:0, bottom:0, top:0, name:'dockedLeft'},
   Unset: {name:'unset'},
   responsivePopup: function(left, top, verticalMargin=16, size=400, portrait=Position.DockedBottom, landscape=Position.DockedRight) {
       return function(menu, container) {
           return computeResponsivePosition(menu, container, left, top, verticalMargin, size, portrait, landscape);
       }
   },
   popup: function(left, top, verticalMargin) {
        return function(menu, container) {
            return positionPopup(menu, container, left, top, verticalMargin);
        }
   }
};



/**
 * Base class for list of items that are menus. Ie. that use arrow keys to move between a list of items
 */
class Menu {
    constructor() {
        this.element = document.createElement('div');
        this.element.className = 'menu';
        this.element['data-menu'] = this;
        this.element.addEventListener('keydown', Menu.onKeyDown);
        this.element.addEventListener('click', Menu.onClick);
        addEventMember(this);

        this.state = 'closed';
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
     */
    get state() {return this._state;}
    set state(value) {
        this._state = value;
    }

    /**
     * @param {HTMLElement} host The element that the menu will be added to.
     * @param {} position object with top,left,bottom, or right properties to be set on the element.
     *                      can include any or none of these properties. 
     * 
     * @param {Boolean} [suppressFocus] if true, do not set the focus when the menu opens.  Useful for when
     *                     the menu is triggered via a pointer event instead of a keyboard event
     */
    show(host, position, suppressFocus=false) {
        this.previousFocus = document.activeElement;
        this.state = 'opening';
        this.host = host;
        //this.position = position || Position.Unset;
        position = position || Position.Unset;


        let anim = new Animation.Transition(this.element, 'menushow');
        anim.on('beforestart',(e)=>{
            if('opening' !== this.state)
                e.cancel();
        })
        anim.on('firstframe', (e)=>{
            host.appendChild(this.element);
            this.setPosition(position);
        });
        anim.on('complete',()=>{
            this.state = 'open';
            if( ! suppressFocus)
                this.setDefaultFocus();
            this.events.emit('opened', {menu:this});
        })
        anim.play();
        return anim;
    }
    
    /**
     * 
     */
    setPosition(position) {
        if('function' === typeof position)
            position = position(this.element, this.host);

        const newCssClass = position.name ? `menu-position__${position.name}` : '';
        for(let cssClass of this.element.classList) {
            if(cssClass.startsWith('menu-position__') && cssClass != newCssClass)
                this.element.classList.remove(cssClass);
        }
    
        for(let prop of ['top', 'bottom', 'left', 'right'])
            this.element.style[prop] = 'undefined' === typeof position[prop] ? '' : position[prop] +'px';

        if(newCssClass)
            this.element.classList.add(newCssClass);

        this.position = position;
    }

    /**
     * 
     */
    hide() {
        if(this.state == 'closed' || this.state == 'closing')
            return;

        this.state = 'closing';

        let anim = new Animation.Transition(this.element, 'menuhide');
        anim.on('beforestart',(e)=>{
            if(this.state !== 'closing')
                e.cancel();
        });
        anim.on('complete', ()=>{
            if(this.state != 'closing')
                return;

            this.state = 'closed';
            if(this.element.parentElement)
                this.element.parentElement.removeChild(this.element);

            if(this.previousFocus && ( ! document.activeElement || document.activeElement === document.body))
                this.previousFocus.focus();
            
            this.host = null;
            this.previousFocus = null;
            this.setFocusOn(null);
            this.events.emit('closed', {menu:this});
        });
        anim.play();
        return anim;
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

        const event = {
            menu:this,
            item:item,
            event:initiatingEvent, 
            _close: true,
            preventClose:function(){this._close = false}
        };
        if('function' == typeof item.action)
            item.action(event);

        if(event._close)
            this.hide();    
       // initiatingEvent.preventDefault();
    }
}

function materialIcon(name) {
    const icon = document.createElement('i');
    icon.className = 'material-icons';
    icon.innerHTML = name;
    return icon;
}

Menu.iconGenerator = materialIcon;

/**
 * 
 */
class ListContainer extends Menu {
    constructor(list) {
        super();
        this.element.classList.add('menu-container');
        
        this.stack = [];

        this.autoResize = true;
        this.autoClose = true;
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

        list = list instanceof List ? list : new List(list);
        this.stack.push(list);
        this.innerElement.appendChild(list.element);
    }
    show(host, position, suppressFocus) {
        const anim = super.show(host, position, suppressFocus);
        anim.on('firstframe', this.resize, this);
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

    push(list) {
        list = list instanceof List ? list : new List(list);
        this.stack.push(list);

        let anim = new Animation.Transition(this.innerElement, 'menuresize');
        anim.on('firstframe',()=>{this.innerElement.appendChild(list.element);});
        anim.on('secondframe',this.resize, this);
        anim.on('complete', ()=>{
            this.resizeForScroll();
            this.setDefaultFocus()
        });
        anim.play();
    }

    get currentList() {
        return this.stack[this.stack.length - 1];
    }

    get itemParent() {
        return this.currentList.element
    }

    pop() {
        if(this.stack.length < 2)
            return;

        this.stack.pop();

        let anim = new Animation.Transition(this.innerElement, 'menupop');
        anim.on('secondframe', this.resize, this);
        anim.on('complete', ()=>{
            this.setDefaultFocus();
            this.resizeForScroll();
            while(this.innerElement.children.length > this.stack.length)
                this.innerElement.removeChild(this.innerElement.lastElementChild);
        });
        anim.play();
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
            
            const back = {
                icon: 'arrow_back',
                label:item.label, 
                id:'menu-back', 
                type:ItemType.Back
            };
            this.push([back].concat(list));
            initiatingEvent.preventDefault();
        } else {
            super.activate(item);
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
 * 
 */
class Toolbar extends Menu {
    constructor(items) {
        super();

        this.element.classList.add('menu-toolbar');
        this.element.setAttribute('role', 'menu');

        this.items = items.map(item=>item instanceof Item ? item : new Item(item));
        for(let i = 0; i < this.items.length; i++) {
            const item = this.items[i];
            this.element.appendChild(item.element)
            item.element.setAttribute('tabindex', 0==i ? '0' : '-1');
        }
    }
}




var menuExport = {ItemType, Item, Menu, ListContainer, Toolbar, Position};

export default menuExport;