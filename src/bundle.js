import '../style/menu.scss';
import Menu from './api.js';

console.log( 'TAGNAME: ', Menu.Item.tagName);
window.customElements.define(Menu.Item.tagName, Menu.Item);
window.customElements.define(Menu.Toolbar.tagName, Menu.Toolbar);
window.customElements.define(Menu.Popup.tagName, Menu.Popup);

export default Menu;
