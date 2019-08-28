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
    //const menu = new Menu.ListContainer(items);
    
    const tools = [
        {label:'Add', iconName:'add'},
        {label:'Upload', iconName:'cloud_upload'},
        {label:'Delete', iconName:'delete'}
    ]

    /*const toolbar = new Menu.Toolbar(tools , {host:container, iconFactory:materialIcon});
    toolbar.element.id = 'toolbar';
    toolbar.autoClose = false;
    toolbar.useAnimation = false;

    container.appendChild(toolbar.element);*/

    /*const button = document.createElement('button');
    button.innerHTML = 'Show Menu';
    button.setAttribute('aria-haspopup','true'); // since this button spawns an ARIA menu, set aria-haspopup
    button.addEventListener('click', (e)=>{
        const rect = e.currentTarget.getBoundingClientRect();
        const top = rect.top + rect.height + 8;
        menu.position = Menu.Position.DockablePopup(rect.left, top);
        menu.show();
    })
    container.appendChild(button);*/

    const item = document.createElement('webapp-menu-item');
    item.setAttribute('label', 'Test');
    document.body.appendChild(item);

    const toolbar = document.createElement('webapp-menu-toolbar');
    toolbar.items.set(tools);
    toolbar.iconFactory =  materialIcon;

    const customIcon = Menu.Item.createElement({label:'Custom Icon Test'});
    customIcon.innerHTML = 'XY';
    toolbar.appendChild(customIcon)
    toolbar.appendChild(Menu.Item.createElement({label:'Test2 Label', label2:'sub label', iconName:'add'}))
    document.body.appendChild(toolbar);
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