import Icon from './Icon';

/**
 * @enum
 * @readonly
 */
export const ItemType = {
    Action: 'action',
    Nested: 'nested',
    Back:  'back',
};

/**
 * @callback iconFactoryFunction
 * @param {string} name
 * @return {HTMLElement}
 */

/**
 * @callback itemActionFunction
 * @param {ItemActionEvent} event
 */

/**
 * 
 */
export class Item {
    /** 
     * @param {string} options.label
     * @param {string} [options.label2]
     * @param {string} [options.id]
     * @param {string|Element} [options.icon]
     * @param {itemActionFunction} [options.action]
     * @param {*} [options.data] member to save caller defined data related to this item
     * @param {ItemType} [options.type] defaults to ItemType.Action

     */
    constructor(options) {
        if( ! options.label)
            throw new Error('Menu.Item must have a label');

        this.id = options.id || '';
        this.label = options.label;
        this.label2 = options.label2;
        this.id = options.id;
        this.icon = options.icon || null;
        this.action = options.action || null;
        this.data = options.data || null;
        this.type = options.type || ItemType.Action;

        this.element = this.createElement();
    }

    createElement() {
        if(this.element)
            return this.element;

        let element = document.createElement('button');
        element.className  = `menu-item menu-item__${this.type}`;
        element.setAttribute('role','menuitem'); 

        if(ItemType.Back == this.type) {
            element.setAttribute('aria-label', "Back to previous level: "+this.label); // screen reader will read 'back to previous level' and visible text
        } else {
            element.setAttribute('aria-label', this.label); // add aria-label on the BUTTONS containing icons that don't have visible text
        }

        let icon = document.createElement('span');
        icon.className = "menu-item-icon";
        icon.setAttribute('aria-hidden','true'); //otherwise screen readers could speak the icon's name
        if(this.icon instanceof Element)
            icon.appendChild(this.icon);
        element.appendChild(icon);


        let labelContainer = document.createElement('span');
        labelContainer.className = 'menu-item-label';
        if( ! this.label2)
            labelContainer.appendChild(document.createTextNode(this.label));
        else {
            let label1 = document.createElement('span');
            label1.appendChild(document.createTextNode(this.label));
            labelContainer.appendChild(label1);

            let label2 = document.createElement('span');
            label2.appendChild(document.createTextNode(this.label2));
            labelContainer.appendChild(label2);
        }
        element.appendChild(labelContainer);

        if(ItemType.Nested == this.type) {
            const nestedIcon = Icon.Nested;
            nestedIcon.classList.add('menu-item-nestedIcon');
            element.appendChild(nestedIcon);
            element.setAttribute('aria-haspopup','true'); //since this opens a submenu, it needs aria-haspopup
        }

        if(this.id)
            element.setAttribute('data-menu-item-id', this.id);
        element['data-menu-item'] = this;
        return this.element = element;
    }

    /**
     * @param {iconFactoryFunction}
     */
    convertIconStringToElement(factory) {
        if( ! this.icon || 'string' != typeof this.icon || ! factory)
            return;

        let iconElement = factory(this.icon);
        const iconContainer = this.element.querySelector('.menu-item-icon');
        if(iconContainer.firstElementChild)
            iconContainer.removeChild(iconContainer.firstElementChild)
        iconContainer.appendChild(iconElement);
    }

    /** @property {Boolean} disabled true if the item is disabled */
    get disabled() {return this.element.hasAttribute('disabled')}
    set disabled(value) {
        if(value)
            this.element.setAttribute('disabled','');
        else
            this.element.removeAttribute('disabled');
    }

    static fromElement(element) {
        while(element && ! element['data-menu-item'] && ! element.classList.contains('menu-container')) {
            element = element.parentElement;
        }
        return element ? element['data-menu-item'] : null;
    }
};