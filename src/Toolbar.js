import Menu from './Menu';
import {Item} from  './Item';

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

export default Toolbar;