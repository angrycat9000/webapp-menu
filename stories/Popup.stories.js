export default {
    title: 'Components/wam-popup',
    component: 'wam-popup'
}

export const htmlInit = () =>
    `<wam-popup static>
            <wam-item label="Cut"></wam-item>
            <wam-item label="Copy"></wam-item>
            <wam-item label="Paste"></wam-item>
    </wam-popup>`;
htmlInit.storyName = 'HTML';


export const jsInit = (args) => {
    const popup = document.createElement('wam-popup');
    popup.items.set(args.items);
    popup.isStatic = true;
    return popup;
};
jsInit.storyName = 'Javascript';
jsInit.args = {
    items: [
        {label:'Cut'},
        {label:'Copy'},
        {label:'Paste'}
    ]
}
