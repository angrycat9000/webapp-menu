import Attributes from './Attributes';
import {ReusableStyleSheet} from './Style';
import itemStyle from '../style/item.scss';


 /**
  * Occurs when an item in a toolbar is activated via a keypress or click.
  * @event wam-activate
  * @type {CustomEvent}
  * @property {Item} detail.item
  * @property {Menu} detail.menu
  * @property {Event} detail.source
  */

export class ItemBase extends HTMLElement {
    get isInteractive() {return true;}

    setAppearance() {}
}

 /**
  * Item in a menu or toolbar.
  * 
  * @element wam-item
  *
  * @fires wam-item-activate
  * 
  * @slot label
  * @slot icon
  */
export class Item extends ItemBase {
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

    /**
     * Create an Item object from an object with a set of properties
     */
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
     * @param {Node|string} [props.icon]
     * @param {boolean} [props.disabled]
     * @param {boolean} [props.showLabel]
     * @param {itemActivateFunction} [props.action]
     * @param {object} [props.data]
     * @param {string} [props.id]
     */
    set(props) {
        if( ! props)
            return;

        for(let prop of ['disabled', 'icon', 'label', 'showLabel', 'action', 'data', 'id']) {
            if('undefined' != typeof props[prop])
                this[prop] = props[prop];
        }
    }

    /**
     * @param {Node|string} icon
     */
    setIcon(icon) {
        this.clearSlot('icon');
        if(this.parentElement && this.parentElement.requestItemUpdate) {
            this.parentElement.requestItemUpdate();
        }
        if( ! icon)
            return;

        if(icon instanceof Node) {
            icon.setAttribute('slot', 'icon');
            this.appendChild(icon);
            return;
        }

        if(icon instanceof String) {
            this.icon = icon;
        }
    }

    /** 
     * @attribute {boolean} show-label -  Determine if the item be labeled in a toolbar. 
     *                                          Has no effect if the item is not in a toolbar.
     * @property {boolean}  showLabel - Determine if the item be labeled in a toolbar. 
     *                                   Has no effect if the item is not in a toolbar.
     * 
     */
    get showLabel() {return Attributes.getTrueFalse(this, 'show-label', false, true);}
    set showLabel(value) {return Attributes.setTrueFalse(this, 'show-label', value);}

    /**
     * 
     */
    get hasIcon () {
        return null !==  this.querySelector('[slot=icon]');
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
        if(!this.icon || !this.parentElement || ! this.parentElement.iconFactory)
            return;

        const iconElement = this.parentElement.iconFactory(this.icon);
        this.setIcon(iconElement);
    }

    /** @private */
    updateLabel() {
        const slot = 'label';
        this.clearSlot(slot);
        const label = Attributes.getString(this, slot);
        const labelNode = document.createTextNode(label);
        this.shadowRoot.querySelector(`slot[name=${slot}]`).appendChild(labelNode);
    }

    /** @private */
    getLabelText() {
        const slot = 'label';
        const label = Attributes.getString(this, slot);
        if(label)
            return label;
        const labelElement = this.querySelector(`[slot=${slot}]`);
        return labelElement ? labelElement.innerText : undefined;
    }

    connectedCallback() {
        this.updateFactoryIcon();
    }

    static get observedAttributes() {
        return ['disabled', 'isdefaultfocus', 'label', 'sublabel', 'icon'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        const hasValue = newValue !== null;
        switch (name) {
            case 'disabled':
                this.shadowRoot.querySelector('button').setAttribute('aria-disabled', hasValue);
                break;
            case 'isdefaultfocus':
                this.shadowRoot.querySelector('button').setAttribute('tabindex', null == newValue ? -1 : 0)
                break;
            case 'label':
                this.updateLabel();
                break;
            case 'icon':
                this.updateFactoryIcon();
                break;
        }
      }

    /** 
     * @attribute {on/off} disabled
     * @property {boolean} disabled true if the item is disabled 
     */
    get disabled() {return Attributes.getExists(this, 'disabled')}
    set disabled(value) {return Attributes.setExists(this ,'disabled', value)}

    /**
     * @property {boolean} isDefaultFocus True if the item is the one to recieve focus when the user
     *                                    tabs into the parent menu
     */
    get isDefaultFocus() {return '0' == this.shadowItem.getAttribute('tabindex')}
    set isDefaultFocus(value) {this.shadowItem.setAttribute('tabindex', value ? '0' : '-1')}


    /** 
     * @attribute {string} label
     * @property {string} label The text label for this element. If the label attribute is not provided
     *                           it falls back to the text content of the the element with `slot="label"`
     */
    get label() { return this.getLabelText('label') }
    set label(value) {Attributes.setString(this, 'label', value)}

    /**
     * @attribute {string} icon
     * @property {string} icon
     */
    get icon() {return Attributes.getString(this, 'icon');}
    set icon(value) {return Attributes.setString(this, 'icon', value);}

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
            <span class="label"><slot name="label"></slot></span>
        </button>`;
    return template;
}});

export default Item;