import { decorate } from '@storybook/addon-actions';
 
const details = decorate([args => {
    const a = [`<${args[0].detail.menu.constructor.tagName}>`];
    if(args[0].detail.item)
        a.push(args[0].detail.item.label);
    return a;
}]);

const wamlogger = details.withActions('wam-item-activate','wam-menu-open', 'wam-menu-close','wam-submenu-open', 'wam-submenu-close');
export default wamlogger;