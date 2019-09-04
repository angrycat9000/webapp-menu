import Item from './Item';
import ItemCollection from './ItemCollection';
import Icon from './Icon';

import {reusableStyleSheetsFunction} from './Style';
import style from '../style/submenu.scss';
const getStyleSheets = reusableStyleSheetsFunction(style);

export class SubMenuItem extends Item {
    constructor() {
        super();

        const shadow = this.shadowRoot;
        shadow.adoptedStyleSheets = [...shadow.adoptedStyleSheets, ...getStyleSheets()];
        
        const outer = document.createElement('div');
        outer.className = 'submenu-outer';
        outer.setAttribute('role', 'menu');
        const inner = document.createElement('div');
        inner.className = 'submenu-inner';

        const back = Item.create({icon:Icon.Back, label:'Back'});
        inner.appendChild(back);

        const slot = document.createElement('slot');
        //slot.setAttribute('name','menu');
        inner.appendChild(slot);
        outer.appendChild(inner);
        shadow.appendChild(outer);

        this.shadowRoot.querySelector('button').appendChild(Icon.Nested);

        this.items = new ItemCollection(this, inner);
    }
}

Object.defineProperty(SubMenuItem, 'tagName', {value:'wam-submenu'});

export default SubMenuItem;