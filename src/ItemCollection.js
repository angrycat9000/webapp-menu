import Item from './Item';

function convertToItem(obj) {
    return (obj instanceof Item) ? obj : Item.create(obj);
}


/**
 * Provide access to the children of the menu via JavaScript.
 */
class ItemCollection {
    constructor(owner, shadowContainer) {
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
        const newNode = convertToItem(newItem);
        return this.owner.insertBefore(newItem, nextItem);
    }

    /**
     *  @param {Item|object} item 
     */
    append(item) {
        const rValue = this.owner.appendChild(convertToItem(item));
        return rValue;
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
        let node =this.owner.firstChild;
        while(node) {
            const next = node.nextSibling;
            if(node instanceof Item)
                this.owner.removeChild(node);
            node = next;
        }
    }

    /** 
     * Replace the existing items with the set provided.
     * @see Item.set
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