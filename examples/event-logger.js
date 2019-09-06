

console.log('Registering WAM event logger')
document.addEventListener('wam-activate', onActivate);



function onActivate(e) {
    console.log('wam-activate',e.detail.item.label );
}

document.addEventListener('wam-submenu-open', (e)=>{
    console.log('wam-submenu-open', e.detail.item.label)
})

document.addEventListener('wam-submenu-close', (e)=>{
    console.log('wam-submenu-close', e.detail.item.label)
})