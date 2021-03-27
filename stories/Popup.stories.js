export default {
    title: 'Components/wam-popup',
    component: 'wam-popup'
}

export const htmlInit = () =>
    `<wam-popup static>
        <wam-item label="Cut" icon="content_cut"></wam-item>
        <wam-item label="Copy" icon="content_copy"></wam-item>
        <wam-item label="Paste" icon="content_paste"></wam-item>
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
        {label:'Cut', icon: 'content_cut'},
        {label:'Copy',  icon: 'content_copy'},
        {label:'Paste', icon: 'content_paste'}
    ]
}
