import Icon from './Icon';
import Menu from './Menu';
import Position from './Position';
import Animation from './Animation';
import {Item, ItemType} from './Item';
import ItemList from './ItemList';

/**
 * 
 */
class ListContainer extends Menu {
    /**
     * 
     */
    constructor(list, options) {
        super(options);

        this.element.classList.add('menu-listcontainer');
        
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

        list = new ItemList(list, this.iconFactory);
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

        for(let child of this.innerElement.children)
            child.style.width = width + 'px';
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
                icon: Icon.Back,
                label:item.label, 
                id:'menu-back', 
                type:ItemType.Back
            };
            list = [back].concat(list);
        }

        list = new ItemList(list, this.iconFactory);
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

        this.events.emit('push', {menu:this});

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

        this.events.emit('pop', {menu:this, all});

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

export default ListContainer;