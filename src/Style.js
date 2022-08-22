import itemStyle from '../style/item.scss';
import menuStyle from '../style/menu.scss';

export class ReusableStyleSheet {
    constructor(styleText) {
        this.text = styleText;
        this.sheet = null;
        this.template= null;
    }

    init(shadow) {
        if(shadow.adoptedStyleSheets) {
            try {
                this.sheet = new CSSStyleSheet();
                this.sheet.replaceSync(this.text);
            } catch (e) {
                this.sheet = null;
            }
        }

        if( ! this.sheet) {
            this.template = document.createElement('template');
            this.template.innerHTML = `<style>${this.text}</style>`;
        }
    }

    addToShadow(shadow) {
        if( ! this.sheet && ! this.element)
            this.init(shadow);

        if(this.sheet)
            shadow.adoptedStyleSheets = [...shadow.adoptedStyleSheets, this.sheet];
        else
            shadow.appendChild(this.template.content.cloneNode(true))
    }
}

export const ItemStyle =  new ReusableStyleSheet(itemStyle);
export const MenuStyle = new ReusableStyleSheet(menuStyle);