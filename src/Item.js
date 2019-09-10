import Attributes from './Attributes';
import {ReusableStyleSheet} from './Style';
import itemStyle from '../style/item.scss';


/**
 * @callback iconFactoryFunction
 * @param {string} name
 * @return {HTMLElement}
 */

 /**
  * Item in a menu or toolbar.
  */
export class Item extends HTMLElement {
    constructor() {
        super();

        const shadow = this.attachShadow({mode: 'open'});
        Item.stylesheet.addToShadow(shadow);

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

    /**
     * 
     */
    get hasIcon () {
        return this.shadowRoot.querySelector('slot[name=icon]').assignedElements().length > 0;
    }

    /**
     * @typedef ItemAppearance
     * @property {boolean} hideIcon
     * @property {boolean} hideLabel
     * @property {boolean} roundTop
     * @property {boolean} roundBottom
     * @property {boolean} roundLeft
     * @property {boolean} roundRight
     */

    /**
     * Allow Menu containers to tweak the appearance of this item.  Unless you are implementing a
     * new Menu subclass, you probably should not call this.
     * @param {ItemAppearance} appearance
     */
    setAppearance(config){
        const button = this.shadowItem;
        Attributes.setTrueFalse(button, 'data-icon', ! config.hideIcon)
        Attributes.setTrueFalse(button, 'data-label', ! config.hideLabel)
        Attributes.setExists(button, 'data-round-top-right', config.roundTop || config.roundRight);
        Attributes.setExists(button, 'data-round-top-left', config.roundTop || config.roundLeft);
        Attributes.setExists(button, 'data-round-bottom-right', config.roundBottom || config.roundRight);
        Attributes.setExists(button, 'data-round-bottom-left', config.roundBottom || config.roundLeft);
        Attributes.setString(button, 'title', config.hideLabel ? this.label : '')
    }

    updateFactoryIcon() {
        const slotContents = this.shadowRoot.querySelector('slot[name=icon]').assignedElements();
        if(0 == slotContents.length)
            return;

        const oldIcon = slotContents[0].getAttribute('data-icon-factory-arg');
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
     *                                    tabs into the parent menu
     */
    get isDefaultFocus() {return '0' == this.shadowItem.getAttribute('tabindex')}
    set isDefaultFocus(value) {this.shadowItem.setAttribute('tabindex', value ? '0' : '-1')}


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
     * @property  {HTMLElement} shadowItem The button in the ShadowDOM that represents this item.
     * @readonly
     */
    get shadowItem() {return this.shadowRoot.querySelector('button.item')}

    static fromEvent(event) {
        const path = event.composedPath();
        for(let element of path) {
            if(element instanceof Item)
                return element;
        }
        return null;
    }
};

Object.defineProperty(Item, 'tagName', {value:'wam-item'});

Object.defineProperty(Item, 'stylesheet', {value: new ReusableStyleSheet(itemStyle)})

var template = null;
Object.defineProperty(Item, 'template', {get:function(){
    if(template)
        return template;

    template = document.createElement('template');
    template.innerHTML = 
        `<button class="item" role="menuitem" tabindex="-1">
            <span class="icon" aria-hidden="true"><slot name="icon"></slot></span>
            <span class="label"><slot name="label">!? Missing Label !?</slot></span>
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