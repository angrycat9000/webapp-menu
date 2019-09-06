import Attributes from './Attributes';
import {reusableStyleSheetsFunction} from './Style';
import itemStyle from '../style/item.scss';
const getStyleSheets = reusableStyleSheetsFunction(itemStyle);


/**
 * @callback iconFactoryFunction
 * @param {string} name
 * @return {HTMLElement}
 */

 /**
  * Item in a menu or toolbar.
  */
export class Item extends HTMLElement {
    /** 
     */
    constructor(options) {
        super();

        const shadow = this.attachShadow({mode: 'open'});
        shadow.adoptedStyleSheets = getStyleSheets();

        const button = Item.template.content.cloneNode(true);
        shadow.appendChild(button);

        /** @property {function} action */
        this.action = null;

        /** @property {object} data */
        this.data = null;
    }

    static create(options) {
        const type = options.type || Item;
        const item = document.createElement(type.tagName);
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
    get showToolbarLabel() {return Attributes.getExists(this, 'showtoolbarlabel');}
    set showToolbarLabel(value) {return Attributes.setExists(this, 'showtoolbarlabel', value);}

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
        return ['disabled', 'isdefaultfocus', 'label'];
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
            case 'label':
                const labelSlot = this.shadowRoot.querySelector('slot[name=label]');
                while(labelSlot.firstChild)
                    labelSlot.removeChild(labelSlot.firstChild);
                labelSlot.appendChild(document.createTextNode(newValue))
        }
      }

    /** @property {boolean} disabled true if the item is disabled */
    get disabled() {return Attributes.getExists(this, 'disabled')}
    set disabled(value) {return Attributes.setExists(this ,'disabled', value)}

    /**
     * @property {boolean} isDefaultFocus True if the item is the one to recieve focus when the user
     *                                    tabs into it
     */
    get isDefaultFocus() {return Attributes.getExists(this, 'isdefaultfocus')}
    set isDefaultFocus(value) {return Attributes.setExists(this ,'isdefaultfocus', value)}


    /** 
     * @property {string} label Set the value of the label.  This is overridden if there is an element
     *                             with ```slot="label"``` provided as a child.
     */
    get label() {
        const labelElement = this.querySelector('[slot=label]');
        return labelElement ? labelElement.innerText : this.shadowRoot.querySelector('slot[name=label]').innerText
    }
    set label(value) {return Attributes.setString(element, 'label', value)}

    clearSlot(name) {
        const items = this.querySelectorAll(`[slot=${name}]`);
        for(let item of items)
            this.removeChild(item);
    }

    /**
     * @property  {HTMLElement} shadowItem
     * @readonly
     */
    get shadowItem() {return this.shadowRoot.querySelector('.menu-item')}

    /**
     * Find the first Item in the path
     * @param {Array<Node>} path
     * @return {boolean}
     */
    static fromPath(path) {
        if( ! path)
            return null;
        for(let p = 0; p < path.length; p++) {
            if(path[p] instanceof Item)
                return path[p];
        }
        return null;
    }
};

Object.defineProperty(Item, 'tagName', {value:'wam-item'});

var template = null;
Object.defineProperty(Item, 'template', {get:function(){
    if(template)
        return template;

    template = document.createElement('template');
    template.innerHTML = 
        `<button class="menu-item menu-item__action" role="menuitem" tabindex="-1">
            <span class="menu-item-icon" aria-hidden="true"><slot name="icon"></slot></span>
            <span class="menu-item-label"><slot name="label">!? Missing Label !?</slot></span>
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

export default Item;