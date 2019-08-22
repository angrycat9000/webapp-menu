import Menu from './Menu';
import {Item} from  './Item';
import ItemList from './ItemList';

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

        this.items = new ItemList(items, this.iconFactory);
        this.element.appendChild(this.items.element);
    }

    get itemParent() {
        return this.items.element;
    }
}

export default Toolbar;