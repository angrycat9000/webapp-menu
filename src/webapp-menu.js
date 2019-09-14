import {Menu, Direction} from './Menu';
import Item from './Item';
import Position from './Position';
import Toolbar from './Toolbar';
import Popup from './Popup';
import SubMenuItem from './SubMenuItem';
import NestedMenu from './NestedMenu';
import TreeList from './TreeList';

const menuExport = {Item, SubMenuItem, Popup, Toolbar, Position, Menu, Direction, NestedMenu, TreeList};

for(let e in menuExport) {
    const c = menuExport[e];
    if(c.tagName) {
        window.customElements.define(c.tagName, c);
        console.debug(`Registering <${c.tagName}>` );
    }
}

export default menuExport;