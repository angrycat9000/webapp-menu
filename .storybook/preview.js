import '../dist/webapp-menu.js';

export const parameters = {
  actions: {
    handles: [
      'wam-item-activate',
      'wam-menu-open',
      'wam-menu-close',
      'wam-submenu-open', 
      'wam-submenu-close'
    ]
  },
  docs: {disabled: true}
};