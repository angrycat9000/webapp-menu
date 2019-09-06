import { document, console } from 'global';
import { storiesOf } from '@storybook/html';
import Menu from '../dist/webapp-menu';

storiesOf('Popup', module)
  .add('HTML Initalization', () => 
    `<button id="open-menu-button">Open</button>
    <wam-popup controlledBy="open-menu-button">
        <wam-item label="Cut"></wam-item>
        <wam-item label="Copy"></wam-item>
        <wam-item label="Paste"></wam-item>
     </wam-toolbar>`)
    .add('JavaScript Initalization', ()=>{
        const popup = document.createElement('wam-popup');
        popup.items.set([
            {label:'Cut'},
            {label:'Copy'},
            {label:'Paste'}
        ]);
        popup.isOpen = true;
        return popup;
    })