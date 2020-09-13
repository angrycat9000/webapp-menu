export default {
    title: 'Common/Styling',
    parameters: {
        actions: {disabled: true},
        storysource: {disabled: true}
    }
};

const styleComponents = (args) => {
    let style = '';
    for(const [name, value] of Object.entries(args)) {
        style += `${name}: ${value};`;
    }

    return `
        <style>
            wam-popup, wam-toolbar, wam-nestedmenu {
                    position:static; ${style} 
            }
            .samples{display:flex; align-items:flex-start; flex-wrap:wrap;}
            .samples > * {margin-left:1rem;}
        </style>
        <div class="samples">
        <wam-popup static>
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

export const border = styleComponents.bind({});
border.storyName = 'Change Border';
border.args = {
    '--menu-border-color': 'red',
    '--menu-border-width': '4px',
    '--menu-border-radius': '1rem'
};

export const focusRing = styleComponents.bind({});
focusRing.storyName = 'Focus Ring';
focusRing.args = {
    '--menu-focus-color': 'red',
    '--menu-focus-width': '3px'
}

export const background = styleComponents.bind({});
background.storyName =  'Background';
background.args = {
    '--menu-item-background': 'linear-gradient(90deg, rgba(249,249,249,1) 0%, rgba(249,249,249,0) 50%)',
    '--menu-background': 'orange'
}

export const transition = styleComponents.bind({});
transition.storyName = 'Open Close Transition';
transition.args = {
    '--menu-transition-transform': 'translateX(100%)',
    '--menu-transition-opacity': '0.5'
}

export const font = styleComponents.bind({});
font.storyName = 'Font';
font.args = {
    'color': 'red',
    'fill': 'red',
    'font-family': 'Hepta Slab'
}

export const hoverActive = styleComponents.bind({});
hoverActive.storyName = 'Hover and Active State';
hoverActive.args = {
    '--menu-hover-background': 'red',
    '--menu-pressed-background': 'orange'
}

export const shadow = styleComponents.bind({});
shadow.args = {
    '--menu-shadow': '4px 4px 4px 2px rgba(0,0,0,0.3)'
}