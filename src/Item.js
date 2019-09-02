import Icon from './Icon';
import {getStyleLink} from './Style';

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
export class Item extends HTMLElement {
    /** 
     */
    constructor(options) {
        super();

        const shadow = this.attachShadow({mode: 'open'});
        shadow.appendChild(getStyleLink());

        const button = Item.template.content.cloneNode(true);
        shadow.appendChild(button);

        /** @property {function} action */
        this.action = null;
    }

    static create(options) {
        const item = document.createElement(Item.tagName);
        item.set(options);
        return item;
    }

    focus() {
        const button =  this.shadowRoot.querySelector('button');
        button.focus();
    }

    /**
     * @param {object} props
     * @param {string} [props.label]
     * @param {string} [props.label2]
     * @param {Node|string} [props.icon]
     * @param {boolean} [props.disabled]
     */
    set(props) {
        if( ! props)
            return;
 
        if('undefined' != props.label || 'undefined' != props.label2)
            this.setLabel(props.label, props.label2);
        
        if('undefined' != props.icon)
            this.setIcon(props.icon);

        for(let prop of ['disabled', 'showToolbarLabel', 'action']) {
            if('undefined' != typeof props[prop])
                this[prop] = props[prop];
        }
    }

    /**
     * @param {Node|string} label
     * @param {Node|string} [label2]
     */
    setLabel(label, label2) {
        this.clearSlot('label');

        if( ! label && ! label2)
            return;

        if( ! label2) {
            const l0 = stringToNode(label);
            l0.setAttribute('slot', 'label');
            this.appendChild(l0);
            return;
        }

        const l0 = document.createElement('div');
        l0.setAttribute('slot', 'label');
        l0.appendChild(stringToNode(label))
        l0.appendChild(stringToNode(label2))

        this.appendChild(l0);
    }

    /**
     * @param {Node|string} icon
     */
    setIcon(icon) {
        this.clearSlot('icon');
        if( ! icon)
            return;

        if(icon instanceof Node) {
            icon.setAttribute('slot', 'icon');
            this.appendChild(icon);
            return;
        }

        let iconElement;
        if(this.parentElement && this.parentElement.iconFactory) {
            iconElement = this.parentElement.iconFactory(icon);
        } else {
            iconElement = document.createElement('span');
        }

        iconElement.setAttribute('slot', 'icon');
        iconElement.setAttribute('data-icon-factory-arg', icon);
        this.appendChild(iconElement);
    }

    /** 
     * @property {string} showToolbarLabel
     * 
     */
    get showToolbarLabel() {return this.hasAttribute('showtoolbarlabel');}
    set showToolbarLabel(value) {
        if(value) this.setAttribute('showtoolbarlabel', '');
        else this.removeAttribute('showtoolbarlabel');
    }

    updateFactoryIcon() {
        let oldIcon = this.querySelector('[slot=icon][data-icon-factory-arg]');
        if( ! oldIcon)
            return;
        
        oldIcon = oldIcon.getAttribute('data-icon-factory-arg');
        if( ! oldIcon)
            return;
        this.setIcon(oldIcon);   
    }

    connectedCallback() {
        this.updateFactoryIcon();
    }

    static get observedAttributes() {
        return ['disabled', 'isdefaultfocus'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        const hasValue = newValue !== null;
        switch (name) {
            case 'disabled':
                this.shadowRoot.querySelector('button').setAttribute('disabled', newValue);
                break;
            case 'isdefaultfocus':
                this.shadowRoot.querySelector('button').setAttribute('tabindex', null == newValue ? -1 : 0)
                break;
        }
      }

    /** @property {boolean} disabled true if the item is disabled */
    get disabled() {return this.hasAttribute('disabled')}
    set disabled(value) {
        if(value)
            this.setAttribute('disabled','');
        else
            this.removeAttribute('disabled');
    }

    /**
     * @property {boolean} isDefaultFocus True if the item is the one to recieve focus when the user
     *                                    tabs into it
     */
    get isDefaultFocus() {return this.hasAttribute('isdefaultfocus')}
    set isDefaultFocus(value) {
        if(value)
            this.setAttribute('isdefaultfocus','');
        else
            this.removeAttribute('isdefaultfocus');
    }

    clearSlot(name) {
        const items = this.querySelectorAll(`[slot=${name}]`);
        for(let item of items)
            this.removeChild(item);
    }



    /**
     * @param {Node} element
     */
    static isItem(element) {
        return ; 
    }

    static fromElement(element) {
        while(element && ! (element instanceof Item))
            element = element.parentElement;
        
        return element instanceof Item ? element : null;
    }
};

Item.tagName = 'wam-item';

var template = null;
Object.defineProperty(Item, 'template', {get:function(){
    if(template)
        return template;

    template = document.createElement('template');
    template.innerHTML = 
        `<button class="menu-item menu-item__action" role="menuitem" tabindex="-1">
            <span class="menu-item-icon" aria-hidden="true"><slot name="icon"></slot></span>
            <span class="menu-item-label"><slot name="label"></slot></span>
        </button>`;
    return template;
}});



/**
 * @param {Node|string} str
 * @return {Node}
 * @private
 */
function stringToNode(str, tag='span') {
    if(str instanceof Node) 
        return str;
        
    const span = document.createElement(tag);
    span.appendChild(document.createTextNode(str));
    return span;
}