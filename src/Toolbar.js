import Menu from './Menu';
import {Item} from  './Item';
import ItemList from './ItemList';

class Toolbar extends Menu {
    constructor() {
        super();
        this.itemParent.classList.add('menu-toolbar');
        this.itemParent.setAttribute('icononly','');
    }

}

export default Toolbar;