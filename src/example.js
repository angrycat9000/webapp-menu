import '../style/example.scss';
import Menu from './api.js';

function materialIcon(name) {
    const icon = document.createElement('i');
    icon.className = 'material-icons';
    icon.innerHTML = name;
    return icon;
}

function run() {
    const container = document.createElement('main');
    document.body.appendChild(container);

    const items = [
        {label:'Submenu', type:Menu.ItemType.Nested, action:showSubMenu},
        {label:'Action 1', icon:''},
        {label:'Action 2', icon:''},
        {label:'Action 3',}
    ];
    const menu = new Menu.ListContainer(items);
    
    const tools = [
        {label:'Add', icon:'add'},
        {label:'Upload', icon:'cloud_upload'},
        {label:'Delete', icon:'delete'}
    ]

    const toolbar = new Menu.Toolbar(tools , {host:container, iconFactory:materialIcon});
    toolbar.element.id = 'toolbar';
    toolbar.autoClose = false;
    toolbar.useAnimation = false;

    container.appendChild(toolbar.element);

    const button = document.createElement('button');
    button.innerHTML = 'Show Menu';
    button.setAttribute('aria-haspopup','true'); // since this button spawns an ARIA menu, set aria-haspopup
    button.addEventListener('click', (e)=>{
        const rect = e.currentTarget.getBoundingClientRect();
        const top = rect.top + rect.height + 8;
        menu.position = Menu.Position.Absolute(rect.left, top);
        menu.show();
    })
    container.appendChild(button);
}

function showSubMenu() {
    return [
        {label:'Sub menu action 1'},
        {label:'Sub menu action 2'},
        {label:'Sub menu action 3'},
        {label:'Sub menu action 4'},
        {label:'Sub menu action 5'},
        {label:'Sub menu action 6'},
    ]
}

if('loading' == document.readyState)
    window.addEventListener('DOMContentLoaded', run)
else
    run();