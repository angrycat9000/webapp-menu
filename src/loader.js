import Menu from './api.js';

for(let element of [Menu.Item, Menu.SubMenuItem, Menu.Toolbar, Menu.Popup]) {
    window.customElements.define(element.tagName, element);
    console.debug(`Registering <${element.tagName}>` );
}
