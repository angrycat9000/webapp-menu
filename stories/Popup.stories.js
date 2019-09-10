import { document, console } from 'global';
import { storiesOf } from '@storybook/html';
import Menu from '../dist/webapp-menu';

storiesOf('Popup', module)
    .add('HTML Initalization', ()=>{
        return `<wam-popup open closeon="none">
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
        return popup;
    })
    .add('ControlledBy', () => {
        return `<button id="open-menu-button" style="position:absolute; top:100px;left: 125px;">Open</button>
        <wam-popup controlledBy="open-menu-button">
            <wam-item label="Cut"></wam-item>
            <wam-item label="Copy"></wam-item>
            <wam-item label="Paste"></wam-item>
        </wam-toolbar>`
    }).add('Styles',()=> {
        return `<wam-popup open closeon="none"
        style="
            color:white;
            font-family: 'Hepta Slab', serif;
            
            --menu-border-radius:16px;
            --menu-border: 0;
            --menu-background: #202020;
            --menu-hover-background: #303030;
            --menu-pressed-background: black;
            --menu-item-background: transparent;
            --menu-shadow: 2px 2px 4px 4px rgba(0,0,0,0.3);
            --menu-focus-color: #40C4FF;
        ">
        <wam-item label="Cut"></wam-item>
        <wam-item label="Copy"></wam-item>
        <wam-item label="Paste"></wam-item>
    </wam-toolbar>`
    });