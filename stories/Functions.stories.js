import { storiesOf } from '@storybook/html';
import Menu from '../dist/webapp-menu';

function materialIcon(name) {
    const icon = document.createElement('i');
    icon.className = 'material-icons';
    icon.innerHTML = name;
    return icon;
}

function createPopup() {
    const popup = Menu.Popup.create([
        {label:'Cut'},
        {label:'Copy'},
        {label:'Paste'}
    ]);


    return popup;
}

function createStaticPopup() {
    const popup = createPopup();
    popup.isOpen = true;
    popup.useAnimation = false;
    popup.closeOn.none();
    return popup;
}

storiesOf('Common|Functions', module)
    .add('ControlledBy', () => {
        return `<p style="text-align:center"><button id="open-menu-button">Open</button></p>
        <wam-popup controlledBy="open-menu-button">
            <wam-item label="Cut"></wam-item>
            <wam-item label="Copy"></wam-item>
            <wam-item label="Paste"></wam-item>
        </wam-toolbar>`
    })
    .add('Position At Point', ()=>{
        const popup = createPopup();
        popup.style.fontSize = '1rem';

        const div = document.createElement('div');
        div.style.top = div.style.left = div.style.right = div.style.bottom = '0';
        div.style.position = 'absolute';
        div.style.fontSize = '4rem';
        div.style.display = 'flex';
        div.style.alignItems = 'center';
        div.style.justifyContent= 'center';
        div.addEventListener('click',(e)=>{
            let element = e.target;
            while(element) {
                if(element == popup)
                    return;
                element = element.parentElement;
            }
            
            popup.position = Menu.Position.AtPoint(e.pageX, e.pageY, 8);
            popup.open();
        
        })
        div.appendChild(document.createTextNode('Click Me'));
        div.appendChild(popup);

        return div;
    })
    .add('Item Collection', ()=>{
        const popup = createStaticPopup();
        popup.iconFactory = materialIcon;

        popup.items.append({label:'Accessibility', icon:'accessibility'});
        popup.items.insertBefore({label:'Themes', icon:'color_lens'}, 1);
        
        return popup;
    })
    .add('document.createElement()', () => {
        const bar = document.createElement('wam-toolbar');
        bar.iconFactory = materialIcon;
        bar.items.set([
          {label:'Reply', icon:'reply'},
          {label:'Reply All', icon:'reply_all'},
          {label:'Forward', icon:'forward'}
        ]);
        bar.isOpen = true;
        bar.closeOn.none();
        return bar;
      })
      .add('.create()', ()=>{
        const items = [
          {label:'Reply', icon:'reply'},
          {label:'Reply All', icon:'reply_all'},
          {label:'Forward', icon:'forward'}
        ];
        const bar = Menu.Toolbar.create(items);
        bar.iconFactory = materialIcon;
        bar.isOpen = true;
        bar.closeOn.none();
        return bar;
      })