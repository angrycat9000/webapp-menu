import {Menu, Direction} from './Menu.js';

import Attributes from './Attributes';
import {ReusableStyleSheet} from './Style';
import style from '../style/toolbar.scss';

/**
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

    static get observedAttributes() {
        return super.observedAttributes.concat('show-label');
    }

    attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback(name, oldValue, newValue);
        if('show-label' === name) {
            this.updateAllItems();
        }
    }

    /**
     * Toolbar level setting for showing labels. If true every item shows a label. 
     * If false falls back to the item value of show-label
     * @type {Boolean} 
     */
    get showLabel() {return Attributes.getExists(this, 'show-label')}
    set showLabel(value) {Attributes.setExists(this, 'show-label', value)}

    updateItem(item, i , items) {
        item.setAppearance({
            hideIcon: !item.hasIcon,
            hideLabel: !this.showLabel && !item.showLabel && item.hasIcon,
            roundLeft: 0 == i,
            roundRight: i == items.length - 1
        });
    }

}

Object.defineProperty(Toolbar, 'tagName', {value: 'wam-toolbar'})

Object.defineProperty(Toolbar, 'stylesheet', {value: new ReusableStyleSheet(style)});

export default Toolbar;