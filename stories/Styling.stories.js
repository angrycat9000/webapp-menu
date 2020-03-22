import { storiesOf } from '@storybook/html';
import Menu from '../dist/webapp-menu';


function styleComponents(style) {
    return ()=>`<style>wam-popup, wam-toolbar, wam-nestedmenu{ position:static; ${style} }
    .samples{display:flex; align-items:flex-start; flex-wrap:wrap;}
    .samples > * {margin-left:1rem;}</style>
    <div class="samples">
     <wam-popup>
        <wam-item label="Cut"></wam-item>
        <wam-item label="Copy"></wam-item>
        <wam-item label="Paste"></wam-item>
    </wam-popup>
    <wam-toolbar>
        <wam-item label="Reply"><i class="material-icons" slot="icon">reply</i></wam-item>
        <wam-item label="Reply All"><i class="material-icons" slot="icon">reply_all</i></wam-item>
        <wam-item label="Forward"><i class="material-icons" slot="icon">forward</i></wam-item>
     </wam-toolbar>
     <wam-nestedmenu>
        <wam-submenu label="Letters">
            <wam-item label="Letter A"></wam-item>
            <wam-item label="Letter B"></wam-item>
        </wam-submenu>
        <wam-submenu label="Numbers">
            <wam-item label="Number 1"></wam-item>
            <wam-item label="Number 2"></wam-item>
            <wam-item label="Number 3"></wam-item>
         </wam-submenu>
    </wam-nestedmenu>
     </div>`;
}

storiesOf('Common|Style', module)
    .add('Border Color', styleComponents('--menu-border-color:red'))
    .add('Border Width', styleComponents('--menu-border-width:4px'))
    .add('No Border', styleComponents('--menu-border-width:0px; --menu-border-radius:0.5rem'))    .add('Border Style', styleComponents('--menu-border-style:outset'))
    .add('Border Radius', styleComponents('--menu-border-radius:1rem'))
    .add('Focus Ring Color', styleComponents('--menu-focus-color:red'))
    .add('Focus Ring Size', styleComponents('--menu-focus-width:1px'))
    .add('Item Background', styleComponents('--menu-item-background:orange'))
    .add('Menu Background', styleComponents('--menu-background:red; --menu-item-background:linear-gradient(90deg, rgba(249,249,249,1) 0%, rgba(249,249,249,0) 50%)'))
    .add('Item Hover', styleComponents('--menu-hover-background:red'))
    .add('Item Active', styleComponents('--menu-pressed-background:red'))
    .add('Text Color', styleComponents('color:red; fill:red'))
    .add('Font', styleComponents('font-family:serif'))
    .add('Shadow', styleComponents('--menu-shadow: 4px 4px 4px 2px rgba(0,0,0,0.3)'))
    .add('Open Close Transition', ()=>
        `<p style="text-align:center"><button id="open-menu-button">Open</button></p>
        <wam-popup popup controlledBy="open-menu-button" 
            style="--menu-transition-transform:translateX(100%); 
                   --menu-transition-opacity: 0.5">
            <wam-item label="Cut"></wam-item>
            <wam-item label="Copy"></wam-item>
            <wam-item label="Paste"></wam-item>
        </wam-popup>`)