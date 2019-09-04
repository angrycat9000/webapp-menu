import Menu from './Menu';

import {reusableStyleSheetsFunction} from './Style';
import style from '../style/toolbar.scss';
const getStyleSheets = reusableStyleSheetsFunction(style);

class Toolbar extends Menu {
    constructor() {
        super();

        this.shadowRoot.adoptedStyleSheets = [...this.shadowRoot.adoptedStyleSheets, ...getStyleSheets()];
        this.shadowRoot.querySelector('.menu').classList.add('menu-toolbar')
    }

}

Toolbar.tagName = 'wam-toolbar';

export default Toolbar;