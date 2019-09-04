


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