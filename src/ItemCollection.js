import {Item} from './Item';

function convertToItem(obj) {
    return (obj instanceof Item) ? obj : Item.createElement(obj);
}

/**
 * 
 */
class ItemCollection {
    constructor(owner) {
        this.owner = owner;
    }

    /**
     * @param {number} index
     * @return {Item|null}
     */
    atIndex(i) {
        let j = 0;
        for(let e = this.owner.firstElementChild; null != e;  e = e.nextElementSibling) {
            if( ! (e instanceof Item))
                continue;

            if(j == i)
                return e;

            ++j;
        }
        return null;
    }

    /**
     * @param {Item} item
     * @return {number} Index of the item.  -1 if the item is not found
     */
    indexOf(item) {
        for(let i = 0, e = this.owner.firstElementChild; null != e; e = e.nextElementSibling, ++i) {
            if(e == item)
                return i;
        }
        return -1;
    }

    /**
     * @param {Item|object} newItem
     * @param {Item|number} exisiting
     */
    insertBefore(newItem, exisiting) {
        const nextItem = 'number' == typeof exisiting ?  this.atIndex(exisiting) : existing;
        return this.owner.insertBefore(newItem, nextItem);
    }

    /**
     *  @param {Item|object} item 
     */
    append(item) {
        return this.owner.appendChild(convertToItem(item));
    }

    /** 
     * @param {Item|number} item 
     */
    remove(item) {
        if('number' == typeof item)
            item = this.atIndex(item);

        if(item instanceof Item && item.parentElement == owner)
            this.owner.removeChild(item);
    }
    
    /** 
     * @property {number} 
     */
    get length() {
        let l = 0;
        for(let e of this.owner.children) {
            if(e instanceof Item)
                ++l;
        }
        return l;
    }

    /**
     * Remove all items
     */
    removeAll() {
        for(let e of this.owner.children) {
            if( e instanceof Item)
                this.owner.removeChild(e);
        }
    }

    /** 
     * @param {Array<Item|object>} items
     */
    set(items) {
        items = items.map(convertToItem);
        this.removeAll();

        for(let i of items)
            this.owner.appendChild(i);
    }

    *[Symbol.iterator]() {
        for(let e of this.owner.children)
            if(e instanceof Item)
                yield e;
    }
}

export default ItemCollection;