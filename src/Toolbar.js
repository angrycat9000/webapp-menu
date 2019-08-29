import Menu from './Menu';
import {Item} from  './Item';
import ItemList from './ItemList';

class Toolbar extends Menu {
    constructor() {
        super();
        this.shadowRoot.querySelector('.menu').classList.add('menu-toolbar')
    
    
  

        //this.itemParent.classList.add('menu-toolbar');
        //this.itemParent.setAttribute('icononly','');
    }

}

Toolbar.tagName = 'wam-toolbar';

export default Toolbar;