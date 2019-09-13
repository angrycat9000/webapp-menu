

console.log('Registering WAM event logger')
document.addEventListener('wam-item-activate', (e)=>{
    console.log('wam-item-activate',e.detail.item.label );
});

document.addEventListener('wam-menu-open', (e)=>{
    console.log('wam-menu-open', e.detail.menu)
});

document.addEventListener('wam-menu-close', (e)=>{
    console.log('wam-menu-close', e.detail.menu)
});

document.addEventListener('wam-submenu-open', (e)=>{
    console.log('wam-submenu-open', e.detail.item.label)
})

document.addEventListener('wam-submenu-close', (e)=>{
    console.log('wam-submenu-close', e.detail.item.label)
})