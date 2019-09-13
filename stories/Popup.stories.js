import { document, console } from 'global';
import { storiesOf } from '@storybook/html';
import Menu from '../dist/webapp-menu.js';

storiesOf('Component Specific|Popup', module)
    .add('HTML Initalization', ()=>{
        return `<wam-popup open closeon="none" useanimation="false">
            <wam-item label="Cut"></wam-item>
            <wam-item label="Copy"></wam-item>
            <wam-item label="Paste"></wam-item>
        </wam-toolbar>`
    })
    .add('JavaScript Initalization', ()=>{
        const popup = document.createElement('wam-popup');
        popup.items.set([
            {label:'Cut'},
            {label:'Copy'},
            {label:'Paste'}
        ]);
        popup.closeOn.none();
        popup.isOpen = true;
        popup.useAnimation = false;
        return popup;
    })

