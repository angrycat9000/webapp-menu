import '../style/example.scss';

import Menu from './Menu';

function materialIcon(name) {
    const icon = document.createElement('i');
    icon.className = 'material-icons';
    icon.innerHTML = name;
    return icon;
}

function run() {
    const items = [
        {label:'Submenu', type:Menu.ItemType.Nested, action:showSubMenu},
        {label:'Action 1', icon:''},
        {label:'Action 2', icon:''},
        {label:'Action 3',}
    ];
    
    function showSubMenu() {
        return [
            {label:'Sub menu action 1'},
            {label:'Sub menu action 2'}
        ]
    }
    
    const menu = new Menu.ListContainer(items);
    
    const tools = [
        {label:'Add', icon:'add'},
        {label:'Upload', icon:'cloud_upload'},
        {label:'Delete', icon:'delete'},
    ]
    const toolbar = new Menu.Toolbar(tools , {iconFactory:materialIcon});
    toolbar.element.id = 'toolbar';
    toolbar.autoClose = false;    

    const toolbarContainer = document.createElement('div');
    toolbarContainer.id='toolbar';
    document.body.appendChild(toolbarContainer);

    toolbar.host = toolbarContainer;
    toolbar.show();

    const button = document.createElement('button');
    button.innerHTML = 'Show Menu';
    button.setAttribute('aria-haspopup','true'); // since this button spawns an ARIA menu, set aria-haspopup
    button.addEventListener('click', (e)=>{
        const rect = e.currentTarget.getBoundingClientRect();
        const top = rect.top + rect.height + 8;
        menu.position = Menu.Position.Absolute(rect.left, top);
        menu.show();
    })
    document.body.appendChild(button);

    
}

if('loading' == document.readyState)
    window.addEventListener('DOMContentLoaded', run)
else
    run();