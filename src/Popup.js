import Menu from './Menu';

class Popup extends Menu {
    constructor() {
        super();
        
        this.shadowRoot.querySelector('.menu').classList.add('menu-popup');
    }

    static create(items) {
        const popup = document.createElement(Popup.tagName);
        //if( ! (popup instanceof Popup))
        //    throw new Error(`Popup (${Popup.tagName}) not registered as custom element`);

        popup.items.set(items);
        return popup;
    }
}

Popup.tagName = 'wam-popup';

export default Popup;