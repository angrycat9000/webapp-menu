import '../style/example.scss';
import 'material-icons/iconfont/material-icons.scss';

import Menu from './Menu';


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
const toolbar = new Menu.Toolbar(tools);
toolbar.element.id = 'toolbar';
toolbar.autoClose = false;

function run() {
    const toolbarContainer = document.createElement('div');
    toolbarContainer.id='toolbar';
    document.body.appendChild(toolbarContainer);
    toolbar.show(toolbarContainer);

    const button = document.createElement('button');
    button.innerHTML = 'Show Menu';
    button.addEventListener('click', (e)=>{
        const rect = e.currentTarget.getBoundingClientRect();
        const top = rect.top + rect.height + 8;
        menu.show(document.body, Menu.Position.absolute(rect.left, top));
    })
    document.body.appendChild(button);

    
}

if('loading' == document.readyState)
    window.addEventListener('DOMContentLoaded', run)
else
    run();