import {Menu, Direction} from './Menu';

import {ReusableStyleSheet} from './Style';
import style from '../style/toolbar.scss';

/**
 * Here is a description of my web component.
 * 
 * @element wam-toolbar
 * 
 * @fires wam-item-activate
 * 
 */
export class Toolbar extends Menu {
    constructor() {
        super();

        Toolbar.stylesheet.addToShadow(this.shadowRoot);
        this.shadowRoot.querySelector('.menu').classList.add('menu-toolbar');

        this.direction = Direction.LeftToRight
    }

    static create(items) {
        return Menu.create(Toolbar, items);
    }

    updateItem(item, i , items) {
        item.setAppearance({
            hideIcon: !item.hasIcon,
            hideLabel: item.hasIcon && !item.showLabel,
            roundLeft: 0 == i,
            roundRight: i == items.length - 1
        });
    }

}

Object.defineProperty(Toolbar, 'tagName', {value: 'wam-toolbar'})

Object.defineProperty(Toolbar, 'stylesheet', {value: new ReusableStyleSheet(style)});

export default Toolbar;