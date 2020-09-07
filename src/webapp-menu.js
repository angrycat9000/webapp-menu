import {Menu, Direction} from './Menu';
import Item from './Item';
import Position from './Position';
import Toolbar from './Toolbar';
import Popup from './Popup';
import SubMenuItem from './SubMenuItem';
import NestedMenu from './NestedMenu';
import Separator from './Separator';
import CheckItem from './CheckItem';
import IconFactory from './IconFactory';

const Wam = {
    Item,
    CheckItem,
    SubMenuItem,
    Separator,
    Popup,
    Toolbar,
    Position,
    Menu,
    Direction,
    NestedMenu,
    IconFactory
};

for(let e in Wam) {
    const c = Wam[e];
    if(c.tagName) {
        window.customElements.define(c.tagName, c);
        console.debug(`Registering <${c.tagName}>` );
    }
}

export default Wam;