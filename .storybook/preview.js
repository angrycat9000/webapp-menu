import { setCustomElements } from '@storybook/web-components';

import Menu from '../dist/webapp-menu.js';
//import customElements from '../dist/custom-elements.json';

//setCustomElements(customElements);

//Menu.IconFactory.defaultFactory = Menu.IconFactory.materialIcon;

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
  controls: {
    hideNoControlsWarning: true
  },
  docs: {disabled: true},
  options: {
    storySort: {
      order: ['Components', ['wam-toolbar', 'wam-popup', 'wam-nestedmenu'], 'Common']
    }
  }
};

export const argTypes = {
  interactiveItems: { control: { disable: true } },
}