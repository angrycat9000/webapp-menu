


export function getStyleLink() {
    const link = document.createElement('link');
    link.setAttribute('href', 'webapp-menu.css');
    link.setAttribute('rel', 'stylesheet');
    return link;
}

export function reusableStyleSheetsFunction(styleStringArray) {
    var stylesheets;
    if( ! Array.isArray(styleStringArray))
        styleStringArray = [styleStringArray];
    return function() {
        if( ! stylesheets) {
            stylesheets = styleStringArray.map(styleString=>{
                const sheet = new CSSStyleSheet();
                sheet.replaceSync(styleString);
                return sheet;
            })
        }
        return stylesheets;
    }
}

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