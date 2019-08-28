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
     * @param {string} options.label
     * @param {string} [options.label2]
     * @param {string} [options.id]
     * @param {string|Element} [options.icon]
     * @param {itemActionFunction} [options.action]
     * @param {*} [options.data] member to save caller defined data related to this item
     * @param {ItemType} [options.type] defaults to ItemType.Action

     */
    constructor(options) {
        super();
        this._createShadow()

    }

    static createElement(options) {
        const item = document.createElement('webapp-menu-item');
        item.copyProperties(options);
        return item;
    }

    static get observedAttributes() {
        return ['label', ,'label2', 'icon', 'disabled'];
      }

    _createShadow() {
        this._shadow = this.attachShadow({mode: 'open'});


        let element = document.createElement('button');
        element.className  = `menu-item menu-item__${this.type}`;
        element.setAttribute('role','menuitem'); 
        element.setAttribute('tabindex', -1);

        if(ItemType.Back == this.type) {
            element.setAttribute('aria-label', "Back to previous level: "+this.label); // screen reader will read 'back to previous level' and visible text
        } else {
            element.setAttribute('aria-label', this.label); // add aria-label on the BUTTONS containing icons that don't have visible text
        }

        let icon = document.createElement('span');
        icon.className = "menu-item-icon";
        icon.setAttribute('aria-hidden','true'); //otherwise screen readers could speak the icon's name
        icon.appendChild(document.createElement('slot'))
        element.appendChild(icon);


        let labelContainer = document.createElement('span');
        labelContainer.className = 'menu-item-label';

        this._label1 = document.createElement('span');
        labelContainer.appendChild(this._label1);

        this._label2 = document.createElement('span');
        labelContainer.appendChild(this._label2);

        element.appendChild(labelContainer);

        if(ItemType.Nested == this.type) {
            const nestedIcon = Icon.Nested;
            nestedIcon.classList.add('menu-item-nestedIcon');
            element.appendChild(nestedIcon);
            element.setAttribute('aria-haspopup','true'); //since this opens a submenu, it needs aria-haspopup
        }

        if(this.id)
            element.setAttribute('data-menu-item-id', this.id);

        
        this._shadow.appendChild(getStyleLink());
        this._shadow.appendChild(element);
    }

    get label() {return this.getAttribute('label')}
    set label(value) {
        if( ! value)
            this.removeAttribute('label');
        else {
            this.setAttribute('label', value);
        }
    }

    get label2() {return this.getAttribute('label2')}
    set label2(value) {
        if( ! value)
            this.removeAttribute('label2');
        else {
            this.setAttribute('label2', value);
        }
    }

    focus() {
        const button =  this._shadow.querySelector('button');
        button.focus();
    }

    copyProperties(props) {
        for(let prop of ['label', 'label2', 'iconName', 'data', 'id']) {
            if('undefined' != typeof props[prop])
                this[prop] = props[prop];
        }
    }

    get _iconParent() {return this.shadowRoot.querySelector('.menu-item-icon')}
     
    get hasCustomIcon() {
        return Boolean(this.innerHTML.trim());
    }

    get iconElement() {
        const iconParent = this._iconParent;
        if('slot' == iconParent.nodeName)
            return this.firstChild;
        return iconParent.firstChild;
    }
    set iconElement(element) {this.setIcon(element, false);}

    setIconElement(node, internal) {
        const iconParent = this._iconParent;
        if(internal) {
            while(iconParent.firstElementChild)
                iconParent.removeChild(iconParent.firstElementChild);
            iconParent.appendChild(node);
        } else {
            while(this.firstChild)
                this.remove(firstChild);
            this.appendChild(node);
        }
    }

    get iconName() {return this.getAttribute('iconName')}
    set iconName(value) {
        if( ! value)
            this.removeAttribute('iconname');
        else
            this.setAttribute('iconname', value);
    }

    updateIcon() {
        if(this.hasCustomIcon) {
            if('SLOT' != this._iconParent.firstChild.nodeName)
                setIconElement(document.createElement('slot'), true);
        } else if(this.iconName && this.parentElement.iconFactory) {
            const iconElement = this.parentElement.iconFactory(this.iconName);
            this.setIconElement(iconElement, false);
        } 
    }

    connectedCallback() {
        this.updateIcon();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        const hasValue = newValue !== null;
        switch (name) {
            case 'label':
                this._label1.innerText = newValue ? newValue : '';
                break;
            case 'label2':
                this._label2.innerText = newValue ? newValue : '';
                break;     
            case 'icon':
                if( ! this.hasCustomIcon) 
                    this.updateIcon();
                break;
            case 'disabled':
                this.shadowRoot.querySelector('button').setAttribute('disabled', newValue);
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


    static fromElement(element) {
        while(element && ! element['data-menu-item'] && ! element.classList.contains('menu-container')) {
            element = element.parentElement;
        }
        return element ? element['data-menu-item'] : null;
    }
};
/*
var template = null;
Object.defineProperty(Item.prototype, 'template', {get:function(){
    if(template)
        return template;

    template = document.createElement('tempalate');
    template.innerHTML = 
        `<button class="menu-item menu-item__action" role="menuitem" tabindex="-1">
            <span class="menu-item-icon" aria-hidden="true"><slot></slot></span>
            <span class="menu-item-label"><slot></slot></span>
        </button>`;
    return template;
}});*/