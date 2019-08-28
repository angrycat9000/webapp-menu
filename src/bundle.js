import '../style/menu.scss';
import Menu from './api.js';

window.customElements.define('webapp-menu-item', Menu.Item);
window.customElements.define('webapp-menu-toolbar', Menu.Toolbar);

export default Menu;
