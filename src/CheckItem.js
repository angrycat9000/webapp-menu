import Item from './Item';
import Attributes from './Attributes';

export class CheckItem extends Item {

    static get observedAttributes() {
        return Item.observedAttributes.concat('checked');
    }

    constructor() {
        super();

        const button = this.shadowRoot.querySelector('button');
        button.setAttribute('role', 'menuitemcheckbox');
        button.setAttribute('aria-checked', false);
        button.setAttribute('data-label', true)

        const icon = this.shadowRoot.querySelector('slot[name="icon"]');
        const onOff = CheckItem.template.content.cloneNode(true);
        icon.appendChild(onOff);

        this.addEventListener('wam-item-activate', this._activated.bind(this));
    }

    attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback(name, oldValue, newValue);

        if('checked' === name) {
            const button = this.shadowRoot.querySelector('button');
            if(null !== newValue)
                button.setAttribute('aria-checked', true);
            else
                button.setAttribute('aria-checked', false);
        }
    }


    get checked() {
        return Attributes.getExists(this, 'checked');
    }
    set checked(value) {
        Attributes.setExists(this, 'checked', value)
    }

    get hasIcon() {return true;}

    get showToolbarLabel() {return true;}

    _activated(e) {
        e.preventDefault();
        this.checked = !this.checked;
    }
}

Object.defineProperty(CheckItem, 'tagName', {value:'wam-check-item'});


var template = null;
Object.defineProperty(CheckItem, 'template', {get:function(){
    if(template)
        return template;

    template = document.createElement('template');
    template.innerHTML = 
        `<span class="check">
            <svg class="off" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/><path d="M0 0h24v24H0z" fill="none"/></svg>
            <svg class="on" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
        </span>`;
    return template;
}});


export default CheckItem;