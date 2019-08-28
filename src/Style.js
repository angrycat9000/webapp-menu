


export function getStyleLink() {
    const link = document.createElement('link');
    link.setAttribute('href', 'webapp-menu.css');
    link.setAttribute('rel', 'stylesheet');
    return link;
}