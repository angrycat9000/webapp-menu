import {Menu, Direction} from './Menu';

import {ReusableStyleSheet} from './Style';
import style from '../style/toolbar.scss';


class Toolbar extends Menu {
    constructor() {
        super();

        Toolbar.stylesheet.addToShadow(this.shadowRoot);
        this.shadowRoot.querySelector('.menu').classList.add('menu-toolbar');

        this.direction = Direction.LeftToRight
    }

    updateItem(item, i , items) {
        item.setAppearance({
            hideIcon: false,
            hideLabel: ! item.hasAttribute('showtoolbarlabel'),
            roundLeft: 0 == i,
            roundRight: i == items.length - 1
        });
    }

}

Object.defineProperty(Toolbar, 'tagName', {value: 'wam-toolbar'})

Object.defineProperty(Toolbar, 'stylesheet', {value: new ReusableStyleSheet(style)});

export default Toolbar;