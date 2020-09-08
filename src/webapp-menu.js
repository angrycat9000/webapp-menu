import {Direction, CloseReason} from './Menu';
import Item from './Item';
import Position from './Position';
import Toolbar from './Toolbar';
import Popup from './Popup';
import SubMenuItem from './SubMenuItem';
import NestedMenu from './NestedMenu';
import Separator from './Separator';
import CheckItem from './CheckItem';
import IconFactory from './IconFactory';

export {
    Popup,
    Toolbar,
    NestedMenu,
    Item,
    SubMenuItem,
    CheckItem,
    Separator,
    CloseReason,
    Position,
    Direction,
    IconFactory
};


const Wam = {
    Popup,
    Toolbar,
    NestedMenu,
    Item,
    SubMenuItem,
    CheckItem,
    Separator,
    CloseReason,
    Position,
    Direction,
    IconFactory
};

for(let e in Wam) {
    const c = Wam[e];
    if(c.tagName)
        window.customElements.define(c.tagName, c);
}

export default Wam;