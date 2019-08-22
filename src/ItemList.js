import {Item} from './Item';

/**
 * 
 */
class ItemList {
    constructor(items, iconFactory) {
        this.iconFactory = iconFactory
        this.items = items.map(item=>item instanceof Item ? item : new Item(item));
        this.element = document.createElement('div');
        this.element.className = 'menu-itemlist';
        this.element.setAttribute('role', 'menu')

        let hasIcons = false;
        for(let i=0; i < this.items.length; i++) {
            const item = this.items[i];
            hasIcons = hasIcons || item.icon
            item.element.setAttribute('tabindex', (0==i) ? '0' : '-1');
            item.convertIconStringToElement(this.iconFactory);
            this.element.appendChild(item.element);
        }
        this.element.setAttribute('data-menu-hasIcons', hasIcons ? 'true' : 'false');
    }
}

export default ItemList;